/// <<< -- TODO: REMOVE THE BELOW

// TODO: This code is to help fetch history items. once we have history views can implement better.

// Usage: for now, after app starts, just run g_getAllDiagnoses()
//  This will load up some items into the diagnosis history and unstructured history views from
//  a patient on the test.raxa.org server

// Can fetch obs by 
// - encounter UUID (0 to n obs)
// - patient UUID (0 to n obs)
// - by obs UUID (0 to 1 obs)
// function g_fetchObs(uuid, resource, obsStore) {
//     console.log('g_fetchObs: ', uuid, resource, obsStore);
//     var myUrl;
//     if (resource == 'obs') {
//         myUrl = HOST + '/ws/rest/v1/obs/' + uuid;
//     } else if (resource == 'patient') {
//         myUrl = HOST + '/ws/rest/v1/obs?patient=' + uuid;
//     } else if (resource == 'encounter') {
//         myUrl = HOST + '/ws/rest/v1/obs?encounter=' + uuid + '&v=full';
//     } else {
//         return;
//     }

//     console.log('g_fetchObs: ' + myUrl);
//     var visitHistoryStore = Ext.getStore('visitHistoryStore');

//     // TODO: No need for ajax request. Just dig through the encounter Store.
//     //  Make the history store more robust... needs  
//     //      - at a minimum: Date, thumbNail (image), json
//     //      - someday: # dx, # rx, # images, referral, lab .. (various stats to show in the preview)
//     Ext.Ajax.request({
//         url: myUrl,
//         success: function(response) {
//             var r = JSON.parse(response.responseText).results;
            
//             for (var i = 0; i < r.length; i++) {
//                 obsStore.add(r[i]);

//                 // If it's an outpatient visit...
//                 // Check for image. This will be thumbnail.
//                 // TODO: Check for vector image, this is used to reload into the view
//                 if(r[i].concept.uuid == localStorage.patientRecordImageUuidconcept || 
                    
//                     r[i].concept.uuid == "1006f63a-3d43-4cc1-b4af-fd2dd8be3109") {  // TEMP so it works on Raxa.io and test.raxa, with dif uuids
//                     console.log("Found an image");
//                     visitHistoryStore.add({
//                         'title': 'myTitle',
//                         'uuid' : r[i].uuid,
//                         'diagnosisCount': 'd#',
//                         'treatmentCount': 't#',
//                         'imgSrc' : r[i].value
//                     });

                    
//                 }
//             }
//         },
//         headers: Util.getBasicAuthHeaders(),
//     });
// }

// var g_obsStore = Ext.create('RaxaEmr.Outpatient.store.opdObs');

// //  1. All diagnoses
// function g_getAllDiagnoses() {
//     console.log('g_getAllDiagnoses');
// }

// function g_getAllObs() {
//     console.log('g_getAllObs');
//     // TODO: Should I directly just fetch all observations? filter on diagnoses? too many?

//     // Obs
//     // var obsStore = Ext.create('RaxaEmr.Outpatient.store.opdObs');
//     var obsStore = Ext.getStore('opdObservations');
//     console.log(obsStore.getCount());
//     var obsCount = 0;
//     // Get each Outpatient encounter
//     for (var i=0; i < g_encounterStore.getCount(); i++) {
        
//         var encounterData = g_encounterStore.getAt(i).getData();
//         console.log(encounterData);
//         var display = encounterData.display;
//         var obs = encounterData.obs;
        
//         console.log('Encounter #', (i+1), display);
//         g_fetchObs(encounterData.uuid,'encounter', obsStore);
//         // Get the obs from each encounter and add to store

//         // var handler = function () {
//         //     for (var j=0; j < obs.length; j++) {
//         //         console.log('\t', 'Obs #', (j+1), obs[j].display);

//         //         // TODO: Ensure we're copying all necessary fields
//         //         // obsStore.add(obs[j])
//         //     }
//         // }
//     }
//     console.log(obsStore.getCount());
//     // obsStore.sync();
    
//     // TODO: Copy all obs into an obs store, just to try it.. good for grid and list displays
//     return obsStore;
// }

// //  2. All height / weights
//         // TODO: proof of concept for retrieving and visualizing info. 
//         // display a "growth chart" using height/weight vs datetime measures taken
//         // http://www.cdc.gov/growthcharts/ ... http://www.cdc.gov/growthcharts/who_charts.htm#The WHO Growth Charts

// function g_getGrowthChart() {

// }

// //  3. All medications ordered
// function g_getAllMedications() {
    
// }

// //  4. All investigations ordered (ideally, with results tagged on to them)
// function g_getAllInvestigations() {

// }

/// <<< -- TODO: REMOVE THE ABOVE

/**
 * Copyright 2012, Raxa
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// TODO: Remove these from the global namespace
var myRecord = new Object(); // for the record of current patient
var opd_observations = new Array(); //contains the observations of different tabs

Ext.define('RaxaEmr.Outpatient.controller.patientlist', {
    extend: 'Ext.app.Controller',

    // Constants
    SEARCH_LIST: {
        WIDTH: 300,
        HEIGHT: 400,
        HEIGHT_INNER: 380,
        PADDING: 0,
        ORIENTATION: "tc-bc?"
    },
                    
    config: {
        // All the fields are accessed in the controller through the id of the components
        refs: { 
            main: '#mainview',
            contacts: 'patientlist',
            contact: '#contact',
            name: '#name',
            docname: '#docname',
            urgency: '#urgency',
            lastvisit: '#lastvisit',
            refresh: '#refresh',
            mainTabs: '#maintabs',
            medicationHistory: '#medicationhistory',
            refToDocButton: '#reftodocbutton',
            confirmLabResultHistoryButton: '#confirmlabresulthistory',
            confirmMedicationHistoryButton: '#confirmmedicationhistory',
            confirmReferToDocButton: '#confirmrefertodoc',
            cheifcomplain: '#cheifComplain',
            labinfo: '#labinfo',
            examlist: '#examList',
            signlist: '#signList',
            deletecomlain: '#deleteComlain',
            addduration: '#addDuration',
            saveduration: '#saveDuration',
            adddruginlist: '#addDrugInList',
            addMoreDrug: '#addMoreDrug',
            adddiagnosisinlist: '#addDiagnosisInList',
            addMoreDiagnosis: '#addMoreDiagnosis',
            submithistory: '#submit-history',
            submitdrugs: '#submitDrugs',
            adddiagnosis: '#addDiagnosis',
            submitdiagnosis: '#submitDiagnosis',
            labordersearchfield: '#labordersearchfield',
            medicationhistorysearchfield: '#medicationhistorysearchfield',
            medicationhistorysortbydrugname: '#medicationhistorysortbydrugname',
            medicationhistorysortbydrugreaction: '#medicationhistorysortbydrugreaction',
            reftodocsearchfield: '#reftodocsearchfield',
            reftodocsortbydocname: '#reftodocsortbydocname',
            reftodocsortbyopdno: '#reftodocsortbyopdno',
            signfilterbysearchfield: '#signfilterbysearchfield',
            referPatient: '#referpatient',
            diagnosisfilterbysearchfield: '#diagnosisfilterbysearchfield',
            diagnosislist: '#diagnosisList',
            deleteDiagnosed: '#deleteDiagnosed',
            drugfilterbysearchfield: '#drugfilterbysearchfield',
            druglist: '#drugList',
            vitalsGrid : '#vitalsGrid',
        },

        // To perform action on specific component accessed through it's id above 
        control: { 
            contacts: {
                itemtap: 'onContactSelect'
            },
            signlist: {
                itemtap: 'onSignListSelect'
            },
            diagnosislist: {
                itemtap: 'onDiagnosisListSelect'
            },
            examlist: {
                itemtap: 'onExamListSelect'
            },
            druglist: {
                itemtap: 'onDrugListSelect',
            },
            name: {
                tap: 'sortByName'
            },
            docname: {
                tap: 'sortByDocName'
            },
            urgency: {
                tap: 'sortByUrgency'
            },
            lastvisit: {
                tap: 'sortByLastVisit'
            },
            refresh: {
                tap: 'refreshList'
            },
            medicationhistorysortbydrugname: {
                tap: 'medicationHistorySortByDrugName'
            },
            medicationhistorysortbydrugreaction: {
                tap: 'medicationHistorySortByDrugReaction'
            },
            reftodocsortbydocname: {
                tap: 'refToDocSortByDocName'
            },
            reftodocsortbyopdno: {
                tap: 'refToDocSortByOpdno'
            },
            medicationHistory: {
                tap: 'medicationHistoryAction'
            },
            refToDocButton: {
                tap: 'refToDocButton'
            },
            labinfo: {
                tap: 'labInfoAction'
            },
            searchfield: {
                clearicontap: 'patientListOnSearchClearIconTap',
                keyup: 'patientListOnSearchKeyUp'
            },
            labordersearchfield: {
                clearicontap: 'labOrderOnSearchClearIconTap',
                keyup: 'labOrderOnSearchKeyUp'
            },
            medicationhistorysearchfield: {
                clearicontap: 'medicationHistoryOnSearchClearIconTap',
                keyup: 'medicationHistoryOnSearchKeyUp'
            },
            reftodocsearchfield: {
                clearicontap: 'refToDocOnSearchClearIconTap',
                keyup: 'refToDocOnSearchKeyUp'
            },
            signfilterbysearchfield: {
                clearicontap: 'signFilterByOnSearchClearIconTap',
                keyup: 'signFilterByOnSearchKeyUp'
            },
            diagnosisfilterbysearchfield: {
                clearicontap: 'diagnosisFilterByOnSearchClearIconTap',
                keyup: 'diagnosisFilterByOnSearchKeyUp'
            },
            drugfilterbysearchfield: {
                clearicontap: 'drugFilterByOnSearchClearIconTap',
                keyup: 'drugFilterByOnSearchKeyUp'
            },
            cheifcomplain: {
                change: 'addChiefComplain',
            },
            deletecomlain: {
                tap: 'deleteComplain',
            },
            saveduration: {
                tap: 'saveduration',
            },
            addduration: {
                tap: 'addduration',
            },
            adddruginlist: {
                tap: 'adddruginlist'
            },
            addMoreDrug: {
                tap: 'adddruginlist'
            },
            adddiagnosisinlist: {
                tap: 'adddiagnosisinlist'
            },
            addMoreDiagnosis: {
                tap: 'adddiagnosisinlist'
            },
            submithistory: {
                tap: 'submitHistory'
            },
            submitdrugs: {
                tap: 'submitdrugs'
            },
            adddiagnosis: {
                tap: 'addDiagnosis'
            },
            submitdiagnosis: {
                tap: 'submitDiagnosis'
            },
            referPatient: {
                tap: 'referPatient'
            },
            deleteDiagnosed: {
                tap: 'deleteDiagnosed',
            },
            diagnosedList: {
                itemtap: 'onDiagnosedListSelect'
            }
        }
    },

    //this function starts on the load of the module
    init: function () {
        // Init and set store for the patient list
        var store_patientList = Ext.create('RaxaEmr.Outpatient.store.PatientsList', {
            storeId: 'patientStore'
        });
        this.getpatientlist();
        
        // Init and set store for patient search results
        // var store_patientList = Ext.create('RaxaEmr.Outpatient.store.PatientsList', {
        //     storeId: 'patientSearchStore'
        // });
    }, 

    // Opens dashboard immediately on Start.
    // TODO: Must enforce that you cannot draw on canvas or press any buttons until
    //  an actual patient record is loaded, as this will throw errors.
    launch: function () {
        var doctorName = Util.getSession().display;
        Ext.getCmp('mainview').setDoctorName(doctorName);

        Ext.getCmp('patientManagementDashboard').show();

        // Set store for patient list in UI
        var store_patientList = Ext.getStore('patientStore');
        Ext.getCmp('contact').setStore(store_patientList);
    },

    //fetches patient list who are screened but not not have an OPD encounter
    getpatientlist: function () {
        var d = new Date();
        //fetching screener patient list
        var list_scrEncounter = Ext.create('RaxaEmr.Outpatient.model.PostList', {
            name: "Screener Encounter",
            description: "Patients encountered Screener on " + "startDate=" + Util.Datetime(d, 24) + "&endDate=" + Util.Datetime(d),
            searchQuery: "?encounterType=" + localStorage.screenerUuidencountertype + "&startDate=" + Util.Datetime(d, 24) + "&endDate=" + Util.Datetime(d)

        });
        //fetching opd patient list
        var list_outEncounter = Ext.create('RaxaEmr.Outpatient.model.PostList', {
            name: "Outpatient Encounter",
            description: "Patients encountered Outpatient on " + "startDate=" + Util.Datetime(d, 24) + "&endDate=" + Util.Datetime(d),
            searchQuery: "?encounterType=" + localStorage.outUuidencountertype + "&startDate=" + Util.Datetime(d, 24) + "&endDate=" + Util.Datetime(d)

        });
        var k = 0;
        this.createList(list_scrEncounter, list_outEncounter, k);

    },
    //creating postlists for screener and opd lists
    createList: function (list_scr, list_out, k) {
        var that = this;

        var store_scr = Ext.create('RaxaEmr.Outpatient.store.PostLists');
        store_scr.on('write', function () {
            // Sync opd list
            var store_out = Ext.create('RaxaEmr.Outpatient.store.PostLists');
            store_out.on('write', function () {
                that.finalPatientList(store_scr, store_out);
            }, that);
            store_out.add(list_out);
            store_out.sync();
        }, that);
        
        store_scr.add(list_scr);
        store_scr.sync();
    },

    //this is where the actual list is fetched
    finalPatientList: function (store_scrEncounter, store_outEncounter) {
        var store_patientList = Ext.getStore('patientStore');
        
        console.log('store_scrEncounter');
        console.log(store_scrEncounter.getData().getAt(0).getData().uuid);
        console.log(store_scrEncounter);

        store_patientList.getProxy().setUrl(this.getPatientListUrl(store_scrEncounter.getData().getAt(0).getData().uuid, store_outEncounter.getData().getAt(0).getData().uuid, localStorage.screenerUuidencountertype));
        store_patientList.load({
            scope: this,
            callback: function(records, operation, success){
                if(success){
                    console.log('updating store');
                    // Ext.getCmp('contact').setStore(store_patientList);//setting store for the patient list

                    // Update badge text
                    // Possible instead to do this via a "datachanged" listener on the store?
                    Ext.getCmp('dashboardToggleButton').setBadgeText(store_patientList.getCount());
                    Ext.getCmp('dashboardPatientListButton').setBadgeText(store_patientList.getCount());
                }
                else{
                    Ext.Msg.alert("Error", Util.getMessageLoadError());
                }
            }
        });
        return store_patientList;
    },

    //for setting the url of the store
    getPatientListUrl: function (scr_UUID, out_UUID, encountertype) {
        return (HOST + '/ws/rest/v1/raxacore/patientlist' + '?inList=' + scr_UUID + '&notInList=' + out_UUID + '&encounterType=' + encountertype);
    },

    //called after clicking on a patient in the patient list
    onContactSelect: function (list, index, node, record) {

        if (!this.showContact) {
            console.log('creating show Contact screen')

            // this.showContact = Ext.create('RaxaEmr.Outpatient.view.today.more');
            this.showContact = Ext.getCmp('more');
        }

        this.showContact.setRecord(record);
        
        // Hide patients list
        Ext.getCmp('contact').hide();

        // Show contact
        this.getMain().setActiveItem(this.showContact);

        // Persist current patient's details
        myRecord = record;
       
        // Get patient's visit history
        var patientEncounterStore = this.getPatientEncounters(myRecord.data.uuid);
        patientEncounterStore.on('load', function () {
            // TODO: Sort by date, desc

            // Add all visits to the view
            var visitHistoryStore = this.getVisitHistory(patientEncounterStore);
            for (var i =0; i < visitHistoryStore.getCount(); i++) {
                // var stageJSON = visitHistoryStore.getAt(i).getData().json;
                
                // Add to stage
                // Kinetic.Node.create(stageJSON, 'unstructuredDataContainer');
            }
        }, this);

        // TODO: Get patient's diagnoses

        // Helper Function for getting most recent value of an observation type
        //
        // Input: display name of Observation and store of Observations
        // Returns: value of observation, if it exists, else "-"
        //
        // Note that the observations store may include only a subset of all
        // observations (e.g. the most recent 25), so you may not see an
        // observation if it is not recent enough
        var getMostRecentObsValue = function (display, store) {
            var groups = store.getGroups();
            for (var k=0; k < groups.length; k++)
            {
                if (groups[k].name === display && groups[k].children.length) 
                {
                    return groups[k].children[0].data.value;
                }
            }
            return "-";
        };
        
        // Load observations for current patient
        var obsStore = Ext.create('RaxaEmr.Outpatient.store.obs');
            
        obsStore.getProxy().setUrl(HOST + '/ws/rest/v1/obs?patient=' + myRecord.data.uuid);
        var that = this;
        obsStore.load({
            callback: function(records, operation, success){
                if(success){
                        // wait for store to load
                        console.log(obsStore); 
                        var obsTypes = ['PULSE','TEMPERATURE (C)', 'BLOOD OXYGEN SATURATION', 'DIASTOLIC BLOOD PRESSURE', 'SYSTOLIC BLOOD PRESSURE', 'RESPIRATORY RATE','PATIENT IMAGE'];
                        item = {};
                        item.pulse = '-';
                        item.temp = '-';
                        item.oxysat = '-';
                        item.sbp = '-';
                        item.dbp = '-';
                        item.resrate = '-';
                        for (var i=0; i < obsTypes.length; i++) {
                            var val = getMostRecentObsValue(obsTypes[i], obsStore)
                            // TODO: Will show undefined if no value is found
                            switch (obsTypes[i]){
                                case 'PULSE':
                                    document.getElementById('PR').innerHTML =val;
                                    item.pulse = val;
                                    break;
                                case 'TEMPERATURE (C)':
                                    document.getElementById('Temp').innerHTML =val;;
                                    item.temp = val;
                                    break;
                                case 'BLOOD OXYGEN SATURATION':
                                    document.getElementById('O2Sat').innerHTML =val;
                                    item.oxysat = val;
                                    break;
                                case 'DIASTOLIC BLOOD PRESSURE': 
                                    document.getElementById('DBP').innerHTML = val;
                                    item.dbp = val;
                                    break;
                                case 'SYSTOLIC BLOOD PRESSURE':
                                    item.sbp = val;
                                    document.getElementById('SBP').innerHTML = val;
                                    break;
                                case 'RESPIRATORY RATE':
                                    item.resrate = val;
                                    document.getElementById('RR').innerHTML = val;
                                    break;
                                case 'PATIENT IMAGE' :
                                    if (val!=='-')
                                        {
                                            document.getElementById('patientProfile').style['background-image'] = "url("+val+")";
                                        }
                                    break;
                                 default:
                                    break;
                            }
                        }
                        item.bp = Ext.String.format('{0} / {1}', item.sbp, item.dbp);

                        var vitalsGridStore = Ext.getStore("Grid");
                        vitalsGridStore.clearData();
                        vitalsGridStore.add(item);
                    //do the things here
                }
                else{
                    Ext.Msg.alert("Error", Util.getMessageLoadError());
                }
            }
        });
    },

    addChiefComplain: function () {
        var combo = Ext.getCmp('cheifComplain');
        examlist = Ext.getCmp('examList');
        examlist.getStore().add({
            complain: combo.getValue(),
            id: combo.getValue()
        });
        Ext.getCmp('maintabs').setActiveItem(TABS.EXAMINATION);
    },
    // called after selection of the examination list
    onExamListSelect: function (list, index, node, record) {
        Ext.getCmp('deleteComlain').setHidden(false);
        Ext.getCmp('addDuration').setHidden(false);
    },
    //to delete something form examination list of sign list
    deleteComplain: function () {
        var examlist = Ext.getCmp('examList');
        selectedRecord = examlist.getSelection();
        examlist.getStore().remove(selectedRecord);
    },
    //to add duration for a specefic problem/sign in the examlist
    addduration: function () {
        this.getMain().push(Ext.getCmp('durationPicker'));
        Ext.getCmp('durationPicker').setHidden(false);
    },
    //for saving the duaration
    saveduration: function () {
        var duration = Ext.getCmp('durationfield').getValue();
        var examlist = Ext.getCmp('examList');
        var selectedRecord = examlist.getSelection();
        var duration = Ext.getCmp('durationfield').getValue();
        var listdata = selectedRecord[0].set('duration', ' : ' + duration + ' days');
        Ext.getCmp('durationPicker').setHidden(true);
        Ext.getCmp('durationfield').reset();
    },
    //to perform actions on toolbar buttion of navigation view
    buttonAction: function (obj, obj2) {
        this.obj1 = Ext.create(obj);
        this.obj1.setRecord(myRecord);
        this.getMain().push(this.obj1);
        this.buttonShow(obj2);
    },

    buttonShow: function (obj) {
        var button = Ext.getCmp(obj);

        if (!button.isHidden()) {
            return;
        }

        button.setHidden(false);
    },

    buttonHide: function (obj) {
        var button = Ext.getCmp(obj);

        if (button.isHidden()) {
            return;
        }

        button.setHidden(true);
    },
    //to show the lab history of a patient
    labInfoAction: function () {
        this.buttonAction('RaxaEmr.Outpatient.view.today.labresulthistorypanel', 'confirmlabresulthistory');
    },
    //to show the medication history of a patient
    medicationHistoryAction: function () {
        this.buttonAction('RaxaEmr.Outpatient.view.today.medicationhistorypanel', 'confirmmedicationhistory');
    },
    //to show the doctors list for referal
    refToDocButton: function () {
        this.buttonAction('RaxaEmr.Outpatient.view.today.refertodocpanel', 'confirmrefertodoc');
        var docList = Ext.create('Screener.store.Doctors', {
            storeId: 'docStore'
        });
        docList.load({
            scope: this,
            callback: function(records, operation, success){
                if(success){
                    Ext.getCmp('refToDocPanel').setStore(docList);
                }
                else{
                    Ext.Msg.alert("Error", Util.getMessageLoadError());
                }
            }
        });
    },
    //for shorting the patient list
    sortBy: function (obj, listStore) {
        listStore.setSorters(obj);
        listStore.load({
            scope: this,
            callback: function(records, operation, success){
                if(success){
                }
                else{
                    Ext.Msg.alert("Error", Util.getMessageLoadError());
                }
            }
        });
    },

    sortByName: function () {
        this.sortBy('display', this.getContact().getStore());
    },

    sortByDocName: function () {
        this.sortBy('nameofdoc', this.getContact().getStore());
    },

    sortByUrgency: function () {
        this.sortBy('urgency', this.getContact().getStore());
    },

    sortByLastVisit: function () {
        this.sortBy('lastvisit', this.getContact().getStore());
    },
    
    refreshList: function () {
        this.getContact().getStore().load({
            scope: this,
            callback: function(records, operation, success){
                if(success){
                }
                else{
                    Ext.Msg.alert("Error", Util.getMessageLoadError());
                }
            }
        });
    },
    // for sorting the medication history
    medicationHistorySortByDrugName: function () {
        this.sortBy('drugname', Ext.getCmp('medicationhistorygrid').getStore());
    },

    medicationHistorySortByDrugReaction: function () {
        this.sortBy('drugreaction', Ext.getCmp('medicationhistorygrid').getStore());
    },
    // sorting the doc list for referal
    refToDocSortByDocName: function () {
        this.sortBy('display', Ext.getCmp('refToDocPanel').getStore());
    },

    refToDocSortByOpdno: function () {
        this.sortBy('uuid', Ext.getCmp('refToDocPanel').getStore());
    },
    // for serching in the list
    onSearchKeyUp: function (listStore, field, value1, value2) {

        var value = field.getValue();
        var store = listStore;

        store.clearFilter();

        if (value) {
            var searches = value.split(' ');
            var regexps = [];
            var i;

            for (i = 0; i < searches.length; i++) {
                if (!searches[i]) continue;
                regexps.push(new RegExp(searches[i], 'i'));
            }

            store.filter(function (record) {
                var matched = [];

                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i];
                    var didMatch = record.get(value1).match(search) || record.get(value2).match(search);
                    matched.push(didMatch);
                }

                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    return matched[0];
                }
            });
        }
    },
    // called when clear icon in the search field is clicked
    onSearchClearIconTap: function (listStore) {
        listStore.clearFilter();
    },

    patientListOnSearchKeyUp: function (field) {
        this.onSearchKeyUp(this.getContact().getStore(), field, 'display', 'uuid');
    },

    patientListOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(this.getContact().getStore());
    },

    medicationHistoryOnSearchKeyUp: function (field) {
        this.onSearchKeyUp(Ext.getCmp('medicationhistorygrid').getStore(), field, 'drugname', 'drugreaction');
    },

    medicationHistoryOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(Ext.getCmp('medicationhistorygrid').getStore());
    },

    labOrderOnSearchKeyUp: function (field) {
        this.onSearchKeyUp(Ext.getCmp('labResultHistoryList').getStore(), field, 'laborderno', 'specimenid');
    },

    labOrderOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(Ext.getCmp('labResultHistoryList').getStore());
    },

    refToDocOnSearchKeyUp: function (field) {
        this.onSearchKeyUp(Ext.getCmp('refToDocPanel').getStore(), field, 'display', 'uuid');
    },

    refToDocOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(Ext.getCmp('refToDocPanel').getStore());
    },

    //This function searches list of diagnosis. Since this list is very big, UI occasionally freezes
    //So, this function searches only after "Enter" button is detected
    diagnosisFilterByOnSearchKeyUp: function (field, e) {

    //Panel is created on left side of searchfield if not created in any previous call
        if (!Ext.getCmp('searchedDiagnosisList')) {
            Ext.create('Ext.Panel', {
                id: 'searchedDiagnosisList',
                items: [{
                    height: this.SEARCH_LIST.HEIGHT_INNER,
                    xtype: 'Diagnosis-List',
                    id: 'diagnosisList',
                    scrollable: true,
                    hidden: false
                }],
                width: this.SEARCH_LIST.WIDTH,
                height: this.SEARCH_LIST.HEIGHT,
                padding: this.SEARCH_LIST.PADDING
            }).showBy(Ext.getCmp('diagnosisfilterbysearchfield'), this.SEARCH_LIST.ORIENTATION);
        } 
        else {
            Ext.getCmp('searchedDiagnosisList').setHidden(false);
        }              
           this.onSearchKeyUp(Ext.getCmp('diagnosisList').getStore(), field, 'sign', 'type');
    },

    //This function is called on every event on searchfield 
    diagnosisFilterByOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(Ext.getCmp('diagnosisList').getStore());
    },

    //This function calls on selection of Diagnosis list and adds to Diagnosed List
    onDiagnosisListSelect: function (list, index, node, record) {
        Ext.getCmp('diagnosisfilterbysearchfield').setValue(record.data.sign);
        Ext.getCmp('searchedDiagnosisList').setHidden(true);
        var diagnosis = record.data;
        diagnosedStore = Ext.getStore('diagnosedDisease');
 
        diagnosedStore.add({
            complain: diagnosis.sign,
            id: diagnosis.id,
        });

    },

    //This function enables button which is to remove selected Diagnosed Diseased from Diagnosed List
    onDiagnosedListSelect: function (list, index, node, record) {
        Ext.getCmp('deleteDiagnosed').setHidden(false);
    },

    drugFilterByOnSearchClearIconTap: function () {
        this.onSearchClearIconTap(Ext.getCmp('drugList').getStore());
    },

    //for searching in the druglist
    drugFilterByOnSearchKeyUp: function (field) {
	//Panel is created on left side of searchfield if not created in any previous call
        if (!Ext.getCmp('searchedDrugList')) {
            Ext.create('Ext.Panel', {
                id: 'searchedDrugList',
                items: [{
                    height: this.SEARCH_LIST.HEIGHT_INNER,
                    xtype: 'Drug-List',
                    scrollable: true,
                    hidden: false
                }],
                width: this.SEARCH_LIST.WIDTH,
                height: this.SEARCH_LIST.HEIGHT,
                padding: this.SEARCH_LIST.PADDING
            }).showBy(Ext.getCmp('drugfilterbysearchfield'), this.SEARCH_LIST.ORIENTATION);

        } 
        else {
            Ext.getCmp('searchedDrugList').setHidden(false);
        }

	//Searches on drugList
        // Ext.getCmp('drugList').getStore().load();
        this.onSearchKeyUp(Ext.getCmp('drugList').getStore(), field, 'drug', 'uuid');
        this.signFilter();
    },

    onDrugListSelect: function (list, index, node, record) {
        Ext.getCmp('drugfilterbysearchfield').setValue(record.data.drug);
        Ext.getCmp('drug-routeofadministration').getStore().add({value: record.data.dosageForm,title: record.data.dosageForm});
        Ext.getCmp('drug-routeofadministration').setValue(record.data.dosageForm);
        Ext.getCmp('searchedDrugList').setHidden(true);
    },

    // to add observation in the observation array
    addObservation: function (concept, value) {
        var obsdate = new Date();
        opd_observations.push({
            person: myRecord.data.uuid,
            obsDatetime: obsdate,
            concept: concept,
            value: value
        });
    },
    // to submit history observations
    submitHistory: function () {
        var obsdate = new Date();
        var tobaccoValue = Ext.getCmp('tobaccoField').getValue() + ' ' + Ext.getCmp('tobaccoRouteofIntake').getValue() + ' ' + Ext.getCmp('tobaccoFrequency').getValue()

        this.addObservation(localStorage.patientHistoryUuidconcept, Ext.getCmp('patientHistory').getValue());
        this.addObservation(localStorage.pastMedicationHistoryUuidconcept, Ext.getCmp('pastMedicalHistory').getValue());
        this.addObservation(localStorage.alcoholIntakeUuidconcept, Ext.getCmp('alcoholField').getValue());
        this.addObservation(localStorage.tobaccoIntakeUuidconcept, tobaccoValue);
        this.addObservation(localStorage.otherHistoryUuidconcept, Ext.getCmp('otherHistory').getValue());
        this.addObservation(localStorage.familyHistoryUuidconcept, Ext.getCmp('familyHistory').getValue());

        Ext.getCmp('patientHistoryPanel').reset();
        Ext.getCmp('socialHistoryPanel').reset();
    },
    // to submit the examination observations
    submitExamination: function () {
        var obsdate = new Date();
        var examlist = Ext.getCmp('examList').getStore();
        var prob_num = examlist.getCount();
        for (i = 0; i < prob_num; i++) {
            this.addObservation(localStorage.examlistUuidconcept, examlist.getAt(i).data.complain + examlist.getAt(i).data.duration);
        }
    },
    // to add the drug order in the drug list and drug panel
    adddruginlist: function (obj) {
        druglist = Ext.getCmp('orderedDrugGrid');
        drugStore = Ext.getStore('drugpanel');	
	//Drug Form details are pushed to druglist store after validation of fields
        // if (Ext.getCmp('drugfilterbysearchfield').getValue() && Ext.getCmp('drug-strength').getValue() && Ext.getCmp('drug-instruction').getValue() && Ext.getCmp('drug-frequency').getValue() && Ext.getCmp('drug-duration').getValue() && Ext.isNumeric(Ext.getCmp('drug-duration').getValue()) && Ext.getCmp('drug-routeofadministration')) {
        if (Ext.getCmp('drugfilterbysearchfield').getValue()) {
            drugStore.add({
                drugname: Ext.getCmp('drugfilterbysearchfield').getValue(), //Ext.getCmp('drug-name').getValue(),
                strength: Ext.getCmp('drug-strength').getValue(),
                instruction: Ext.getCmp('drug-instruction').getValue(),
                frequency: Ext.getCmp('drug-frequency').getValue(),
                duration: Ext.getCmp('drug-duration').getValue(),
                routeofadministration: Ext.getCmp('drug-routeofadministration').getValue(),
                concept: Ext.getCmp('drugList').selected.items[0].data.concept,
                uuid: Ext.getCmp('drugList').selected.items[0].data.uuid
                // strength: 'fake mg',
                // instruction: 'fake ins',
                // frequency: 'fake freq',
                // duration: 'fake dur',
                // routeofadministration: 'fake route'
            });
	   
            // Drug Form is reset after drug data is pushed into code
            Ext.getCmp('drugaddform').reset();

            Ext.getCmp('drugForm').hide();
            stage.fire('paintMedication');
                
            // If 'add more', then reopen the form
            if (obj.id == 'addMoreDrug') {
                Ext.getCmp('drugForm').show();
            };   
        } 
        else {
            Ext.Msg.alert('Invalid Form', 'Please complete the Drug Form');
            Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD);
        }

        if (Ext.getCmp('searchedDrugList')) {
            Ext.getCmp('searchedDrugList').setHidden(true);
        }
    },
    
    // to submit the drug order
    submitdrugs: function () {
        concept = new Array();
        order = new Array();
        var k = 0,
            l = 0;
        var druglist = Ext.getCmp('drugList').getStore();
        var drug_num = Ext.getCmp('drugList').getStore().getCount();
        drug_num = drug_num - 1;
        for (i = 0; i <= drug_num; i++) {
            // value of Url for get call is made here using name of drug
            var Url = HOST + '/ws/rest/v1/concept?q='
            //            Url = Url + Ext.getCmp('drugfilterbysearchfield').getValue();
            concept.push(Ext.create('RaxaEmr.Outpatient.store.drugConcept'))
            // setting up the proxy for store with the above Url
            concept[i].setProxy({
                type: 'rest',
                url: Url,
                headers: Util.getBasicAuthHeaders(),
                reader: {
                    type: 'json',
                    rootProperty: 'results'
                }
            })
            var startdate = new Date()
            // value of end date depending on the duration 
            var enddate = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate() + druglist.getAt(i).data.duration);
            // model for drug order is created here
            order.push({
                patient: myRecord.data.uuid,
                drug: druglist.getAt(i).data.drug,
                startDate: startdate,
                autoExpireDate: enddate,
                dose: druglist.getAt(i).data.strength,
                quantity: druglist.getAt(i).data.duration,
                frequency: druglist.getAt(i).data.frequency,
                instructions: druglist.getAt(i).data.instruction,
                // type should be "drugorder" in order to post a drug order
                type: 'drugorder'
            })
            if (order[i].instructions == "") order[i].instructions = "-"
            // here it makes the get call for concept of related drug
            concept[i].load({
                scope: this,
                callback: function(records, operation, success){
                    if(success){
                        // added a counter k which increment as a concept load successfully, after all the concept are loaded
                        // value of k should be equal to the no. of drug forms
                        k = k + 1;
                        // value of k is compared with the no of drug forms
                        if (k == drug_num + 1) {
                            for (var j = 0; j <= drug_num; j++) {
                                order[j].concept = concept[j].getAt(0).data.uuid
                            }
                            var time = Util.Datetime(startdate, Util.getUTCGMTdiff());
                            // model for posting the encounter for given drug orders
                            var encounter = Ext.create('RaxaEmr.Outpatient.model.drugEncounter', {
                                patient: myRecord.data.uuid,
                                // this is the encounter for the prescription encounterType
                                encounterType: localStorage.prescriptionUuidencountertype,
                                encounterDatetime: time,
                                provider: localStorage.loggedInUser,
                                orders: order
                            })
                            var encounterStore = Ext.create('RaxaEmr.Outpatient.store.drugEncounter')
                            encounterStore.add(encounter)
                            // make post call for encounter
                            encounterStore.sync()
                            encounterStore.on('write', function () {
                                Ext.Msg.alert('successfull')
                                //Note- if we want add a TIMEOUT it shown added somewhere here
                            }, this)

                        }
                    }
                    else{
                        Ext.Msg.alert("Error", Util.getMessageLoadError());
                    }
                }
            });
        }
        druglist.removeAll();
    },

    referPatient: function () {
        var selection = Ext.getCmp('refToDocPanel').getSelection();
        var provider = selection[0].data.person.uuid;
        var currentDate = new Date();
        var jsonencounter = Ext.create('Screener.model.encounterpost', {
            encounterDatetime: Util.Datetime(currentDate, 5.5),
            patient: myRecord.data.uuid,
            encounterType: localStorage.screenerUuidencountertype,
            provider: provider
        });
        var store = Ext.create('Screener.store.encounterpost');
        store.getProxy().setUrl(HOST + '/ws/rest/v1/encounter/' + myRecord.data.encounters[0].uuid);
        store.add(jsonencounter);
        store.sync();
        store.on('write', function () {
            Ext.Msg.alert('successful');
        }, this);
    },

    getVisitHistory: function(encounterStore) {
        return [];
        
        console.log("getVisitHistory");
        var visitHistoryStore = Ext.getStore('visitHistoryStore');
        visitHistoryStore.clearData();

        // Get each Outpatient encounter, put relevant items into visitHistoryStore
        for (var i=0; i < encounterStore.getCount(); i++) {
            console.log(encounterData)
            var encounterData = encounterStore.getAt(i).getData();
            var display = encounterData.display;
            var obs = encounterData.obs;
            
            console.log('Encounter #', (i+1), display);        
            if(encounterData.encounterType.uuid == localStorage.outUuidencountertype) {
                gloObs = obs;
                // find vectorImage (json) and thumbnail Image (dataUrl)
                // TODO: Handle multiple images or jsons per encounter.
                var json = '';
                var imgSrc = '';
                for (var j = 0; j < obs.length; j++) {
                    o = obs[j];
                    var conceptUuid = o.concept.uuid;
                    console.log('obs #', j, ' ... conceptUuid = ', conceptUuid);
                    if(conceptUuid == localStorage.patientRecordImageUuidconcept) {
                        console.log('found thumb image!');
                        imgSrc = o.value;
                    } else if (conceptUuid == localStorage.patientRecordVectorImageUuidconcept) {
                        console.log('found vector image!');
                        console.log(o);
                        json = o.value;
                    }
                }   
                
                console.log('adding to visitHistoryStore');
                var visitHistoryItem = {
                    'title': encounterData.display,
                    'date' : Ext.util.Format.date(encounterData.encounterDatetime),
                    'uuid' : encounterData.uuid,
                    'diagnosisCount': 'd#',
                    'treatmentCount': 't#',
                    'imgSrc' : imgSrc,
                    'json' : json
                };
                console.log(visitHistoryItem);
                visitHistoryStore.add(visitHistoryItem);            
            }
        }

        return visitHistoryStore;
    },

    getPatientEncounters: function(patientUuid) {
        var store = Ext.create('RaxaEmr.Outpatient.store.opdEncounterPost');
        var myUrl = HOST + '/ws/rest/v1/encounter' + '?patient=' + patientUuid + '&v=full';    
        store.getProxy().setUrl(myUrl);
        store.load();
        store.sync();
        return store;
    }

});
