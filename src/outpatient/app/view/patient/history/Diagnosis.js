/// <<< -- TODO: REMOVE THE BELOW

// TODO: This code is to help fetch history items. once we have history views can implement better.

// Usage: for now, after app starts, just run g_getAllDiagnoses()
//  This will load up some items into the diagnosis history and unstructured history views from
//  a patient on the test.raxa.org server

// Can fetch obs by 
// - encounter UUID (0 to n obs)
// - patient UUID (0 to n obs)
// - by obs UUID (0 to 1 obs)
function g_fetchObs(uuid, resource, obsStore) {
    var myUrl;
    if (resource == 'obs') {
        myUrl = 'http://test.raxa.org:8080/openmrs/ws/rest/v1/obs/' + uuid;
    } else if (resource == 'patient') {
        myUrl = 'http://test.raxa.org:8080/openmrs/ws/rest/v1/obs?patient=' + uuid;
    } else if (resource == 'encounter') {
        myUrl = 'http://test.raxa.org:8080/openmrs/ws/rest/v1/obs?encounter=' + uuid + '&v=full';
    } else {
        return;
    }

    var visitHistoryStore = Ext.getStore('visitHistoryStore');

    Ext.Ajax.request({
        url: myUrl,
        success: function(response) {
            var r = JSON.parse(response.responseText).results;
            
            for (var i = 0; i < r.length; i++) {
                console.log(r[i]);
                obsStore.add(r[i]);

                // If it's an image, add it to the image store
                if(r[i].concept.uuid == localStorage.patientRecordImageUuidconcept || 
                    r[i].concept.uuid == "1006f63a-3d43-4cc1-b4af-fd2dd8be3109") {  // TEMP so it works on Raxa.io and test.raxa, with dif uuids
                    console.log("Found an image");
                    visitHistoryStore.add({
                        'title': 'myTitle',
                        'uuid' : r[i].uuid,
                        'diagnosisCount': 'd#',
                        'treatmentCount': 't#',
                        'imgSrc' : r[i].value
                    });

                    // TODO: Add vector image, too
                }

                console.log(obsStore.getCount());
            }
        },
        headers: Util.getBasicAuthHeaders(),
    });
}

function g_fetchSomeEncounters() {
        var store = Ext.create('RaxaEmr.Outpatient.store.opdEncounterPost');
        // Insert proper patient's UUID
        myUrl = HOST + '/ws/rest/v1/encounter' + '?patient=5ff52670-2cb2-4874-9fb1-b4bbe10dadda&v=full';
        myUrl = 'http://test.raxa.org:8080/openmrs/ws/rest/v1/encounter' + '?patient=5ff52670-2cb2-4874-9fb1-b4bbe10dadda&v=full';
        // myUrl = 'http://test.raxa.org:8080/openmrs/ws/rest/v1/encounter/05f95678-d4a9-4b43-b23e-e568245694e8?v=full';
        store.getProxy().setUrl(myUrl);
        // store.getProxy().setUrl(HOST + '/ws/rest/v1/encounter' + '?patient=75d93e0c-8596-4afb-88a9-dcf07a1b487f&v=full');
        
        //store.getProxy().getReader().setRootProperty('results');
        store.load();
        store.sync();
        return store;
}
var g_encounterStore = g_fetchSomeEncounters();

var g_obsStore = Ext.create('RaxaEmr.Outpatient.store.opdObs');

//  1. All diagnoses
function g_getAllDiagnoses() {\
    console.log('g_getAllDiagnoses');
}

function g_getAllObs() {
    console.log('g_getAllObs');
    // TODO: Should I directly just fetch all observations? filter on diagnoses? too many?

    // Obs
    // var obsStore = Ext.create('RaxaEmr.Outpatient.store.opdObs');
    var obsStore = Ext.getStore('opdObservations');
    console.log(obsStore.getCount());
    var obsCount = 0;
    // Get each Outpatient encounter
    for (var i=0; i < g_encounterStore.getCount(); i++) {
        
        var encounterData = g_encounterStore.getAt(i).getData();
        console.log(encounterData);
        var display = encounterData.display;
        var obs = encounterData.obs;
        
        console.log('Encounter #', (i+1), display);
        g_fetchObs(encounterData.uuid,'encounter', obsStore);
        // Get the obs from each encounter and add to store

        // var handler = function () {
        //     for (var j=0; j < obs.length; j++) {
        //         console.log('\t', 'Obs #', (j+1), obs[j].display);

        //         // TODO: Ensure we're copying all necessary fields
        //         // obsStore.add(obs[j])
        //     }
        // }
    }
    console.log(obsStore.getCount());
    // obsStore.sync();
    
    // TODO: Copy all obs into an obs store, just to try it.. good for grid and list displays
    return obsStore;
}

//  2. All height / weights
        // TODO: proof of concept for retrieving and visualizing info. 
        // display a "growth chart" using height/weight vs datetime measures taken
        // http://www.cdc.gov/growthcharts/ ... http://www.cdc.gov/growthcharts/who_charts.htm#The WHO Growth Charts

function g_getGrowthChart() {

}

//  3. All medications ordered
function g_getAllMedications() {
    
}

//  4. All investigations ordered (ideally, with results tagged on to them)
function g_getAllInvestigations() {

}

/// <<< -- TODO: REMOVE THE ABOVE

Ext.define('RaxaEmr.Outpatient.view.patient.history.Diagnosis', {
    extend: 'Ext.Container',
    xtype: 'history-diagnosis',
    // requires: ['RaxaEmr.Outpatient.view.history.DiagnosisGrid'],
    id: 'historyDiagnosis',
    initialize: function() {
        // this.config.items.add();
    },
    config: {
        layout: {
            type: 'vbox'
        },
        fullscreen: true,
        items: [{
            // Button to view all history items
            xtype: 'history-diagnosis-grid',
            flex: 1,
        }]
	}
});

Ext.define('RaxaEmr.Outpatient.view.history.DiagnosisGrid', {
    extend: 'Ext.ux.touch.grid.View',
    xtype: 'history-diagnosis-grid',
    id: 'historyDiagnosisGrid',
    requires: ['Ext.ux.touch.grid.feature.Feature', 'Ext.field.Number'],
    flex: 1,
    config: {
        title: 'Grid',
        store: g_obsStore,
        scrollable: 'false',
        columns: [{
            header: 'Name',
            dataIndex: 'display',
            width: '40%',
            // cls: 'centered-cell'
        }, {
            header: 'Date',
            dataIndex: 'obsDatetime',
            width: '60%',
            // cls: 'centered-cell'
        }]
    }
});
