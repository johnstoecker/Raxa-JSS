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
 
Ext.define('RaxaEmr.Outpatient.view.patient.Grid', {
    extend: 'Ext.ux.touch.grid.View',
    extend: 'Ext.Container',  //HTML item is used to match current designs, though Grid CSS will handle pixel perfect desgins
    xtype: 'vitalsGrid',
    id: 'vitalsGrid',

 //   requires: ['Ext.ux.touch.grid.feature.Feature', 'Ext.field.Number', 'RaxaEmr.Outpatient.store.Grid'],

    config: {
        title: 'Grid',
        store: 'Grid',
        scrollable: 'false',
    items: [{
            html:  '<table align="top" border="0" cellpadding="0" cellspacing="0" style="width: 380px;height:20px;font-size:10px; text-align: center;">'+
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
        //        columns: [{
        //     header: 'Height',
        //     dataIndex: 'height',
        //     width: '17%',
        //     cls: 'centered-cell',
        //     renderer: function (value, values) {
        //         if(value == undefined) {
        //             return '<span>' + "-" + '</span>';
        //         } else {
        //             return '<span>' + value + ' cm' + '</span>';
        //         }// to change the view of the data feched
        //     }
        // }, {
        //     header: 'Weight',
        //     dataIndex: 'weight',
        //     width: '17%',
        //     cls: 'centered-cell',
        //     renderer: function (value , values) {
        //         if(value == undefined)  {
        //             return '<span>' + "-" +'</span>';  
        //         } else {
        //             return '<span>' + value + ' kg' + '</span>';
        //         }// to change the view of the data feched
        //     }
        // }, 
        // {
        //     header: 'BMI',
        //     dataIndex: 'bmi',
        //     width: '17%',
        //     cls: 'centered-cell',
        //     renderer: function (value ) {
        //         if(value == undefined) {    
        //             return "-";
        //         }
        //     }
        // }, 
        // {
          /*  header: 'BP',
            dataIndex: 'bp',
            width: '25%',
            cls: 'centered-cell',
            renderer: function (value ) {
                // TODO: Determine how to pass 2 BMI values into one grid panel
                if(value == "- / -" || value == undefined ) {
                    return "-";
                }
                else {
                    // var bmi = 68;
                    // return Ext.String.format('{0}/{1}', value);
                    return value;
                }// to change the view of the data feched
            }
        }, {
            header: 'Pulse',
            dataIndex: 'pulse',
            width: '17%',
            cls: 'centered-cell'
        }, {
            header: 'RespRate',
            dataIndex: 'resrate',
            width: '25%',
            cls: 'centered-cell'
        }, {
            header: 'Temp',
            dataIndex: 'temp',
            width: '17%',
            cls: 'centered-cell'
        }, {
            header: 'O2Sat',
            dataIndex: 'oxysat',
            width: '16%',
            cls: 'centered-cell'
        }]*/
    }
});
