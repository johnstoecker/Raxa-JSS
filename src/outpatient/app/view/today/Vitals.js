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
var VITALS_VIEW_TITLE_STYLE = 'color:#2e7ab8;font-weight:bold';
var VITALS_VIEW_VALUE_STYLE = 'color:#000000;font-weight:bold';

Ext.define('RaxaEmr.Outpatient.view.today.Vitals', {
    extend: 'Ext.Container',
    xtype: 'vitalsGrid',
    id: 'vitalsGrid',
    config: {
        title: 'Grid',
        store: 'Grid',
        scrollable: 'false',
        items: [{
            html:  '<table align="top" border="0" cellpadding="0" cellspacing="0" style="width: 380px;height:20px;font-size:10px;">'+
            '<tbody>'+
                '<tr>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">Temperature</strong></span></td>'+
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
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">BP</strong></span></td>'+
                    '<td>'+
                        '<span style="' + VITALS_VIEW_TITLE_STYLE + '">Respiratory Rate</strong></span></td>'+
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
