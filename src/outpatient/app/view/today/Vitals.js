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
                        '<span style=";"><strong>Systolic Blood Pressure</strong></span></td>'+
                    '<td>'+
                        '<span><strong>Diastolic Blood Pressure</strong></span></td>'+
                    '<td>'+
                        '<span><strong>Temperature</strong></span></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '&nbsp;<b id="SBP"></b></td>'+
                    '<td>'+
                        '&nbsp;<b id="DBP"></b></td>'+
                    '<td>'+
                        '&nbsp;<b id="Temp"></b></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '<span><strong>Respiratory Rate</strong></span></td>'+
                    '<td>'+
                        '<span><strong>Pulse Rate</strong></span></td>'+
                    '<td>'+
                        '<span><strong>Oxygen Saturation</strong></span></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>'+
                        '&nbsp;<b id="RR"></b></td>'+
                    '<td>'+
                        '&nbsp;<b id="PR"></b></td>'+
                    '<td>'+
                        '&nbsp;<b id="O2Sat"></b></td>'+
                '</tr>'+
            '</tbody>'+
        '</table>'
    }]
    }
});
