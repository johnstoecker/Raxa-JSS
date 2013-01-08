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

//info about the patient when we click on a patient like weight, height etc. is shown by this grid
 
// TODO: Move to CSS file and access here via "cls" tag in Sencha
var VITALS_VIEW_TITLE_STYLE = 'color:#000000;font-weight:bold;line-height:.4';
var VITALS_VIEW_VALUE_STYLE = 'color:#000000;';

Ext.define('RaxaEmr.Outpatient.view.today.Vitals', {
    extend: 'Ext.Container',
    xtype: 'vitalsGrid',
    id: 'vitalsGrid',

    // Pass in values in the following format
    // { key : value}
    // key in ['PULSE','TEMPERATURE (C)', 'BLOOD OXYGEN SATURATION', 'DIASTOLIC BLOOD PRESSURE', 'SYSTOLIC BLOOD PRESSURE', 'RESPIRATORY RATE'];
    setVitals: function(newValues) {
        console.log('update vitals from view.. pass in values');
        console.log(newValues);
        
        // default values
        item = {};
        item.pulse = '-';
        item.temp = '-';
        item.oxysat = '-';
        item.sbp = '-';
        item.dbp = '-';
        item.resrate = '-';

        // new values        
        for (var i=0; i < newValues.length; i++) {
            console.log(newValues[i]);
            var key = newValues[i].key;
            var val = newValues[i].value;

            // TODO: Accepts display name or concept UUID. refactor cleanly will only concept uuids
            switch (key){
                case 'PULSE':
                case localStorage.pulseUuidconcept:
                    document.getElementById('PR').innerHTML =val;
                    item.pulse = val;
                    break;
                case 'TEMPERATURE (C)':
                case localStorage.temperatureUuidconcept:
                    document.getElementById('Temp').innerHTML =val;;
                    item.temp = val;
                    break;
                case 'BLOOD OXYGEN SATURATION':
                case localStorage.bloodoxygensaturationUuidconcept:
                    document.getElementById('O2Sat').innerHTML =val;
                    item.oxysat = val;
                    break;
                case 'DIASTOLIC BLOOD PRESSURE': 
                case localStorage.diastolicbloodpressureUuidconcept:
                    document.getElementById('DBP').innerHTML = val;
                    item.dbp = val;
                    break;
                case 'SYSTOLIC BLOOD PRESSURE':
                case localStorage.systolicbloodpressureUuidconcept:
                    item.sbp = val;
                    document.getElementById('SBP').innerHTML = val;
                    break;
                case 'RESPIRATORY RATE':
                case localStorage.respiratoryRateUuidconcept:
                    item.resrate = val;
                    document.getElementById('RR').innerHTML = val;
                    break;
                default:
                   break;
            }
        }
        item.bp = Ext.String.format('{0} / {1}', item.sbp, item.dbp);

        var vitalsGridStore = Ext.getStore("Grid"); // TODO: rename to something easier/useful
        vitalsGridStore.clearData();
        vitalsGridStore.add(item);
    },
    config: {
        title: 'Grid',
        store: 'Grid',
        scrollable: 'false',
        items: [{
            html:  '<table align="top" border="0" cellpadding="0" cellspacing="0" style="width: 380px;line-height:1;font-size:13px;">'+
            '<tbody>'+
                '<tr>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">Temperature</span></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">SaO2</span></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">Pulse Rate</span></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_VALUE_STYLE + '" id="Temp"></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_VALUE_STYLE + '" id="O2Sat"></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_VALUE_STYLE + '" id="PR"></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">BP</span></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">Respiratory Rate</span></td>'+
                    '<td>'+
                        // "+Vitals" button
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_VALUE_STYLE + '" id="SBP"></span> / <span style="' + VITALS_VIEW_VALUE_STYLE + '" id="DBP"></span></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_VALUE_STYLE + '" id="RR"></td>'+
                    '<td>'+
                        // "+Vitals" button
                '</tr>'+
            '</tbody>'+
        '</table>'
    }]
    }
});
