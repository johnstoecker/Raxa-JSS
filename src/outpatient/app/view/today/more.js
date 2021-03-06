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
//the view after clicking one of the patient in the patient list
Ext.define('RaxaEmr.Outpatient.view.today.more', {
    extend: 'Ext.Container',
    xtype: 'patientlist-show',
    requires: ['RaxaEmr.Outpatient.view.today.Vitals', 'RaxaEmr.Outpatient.view.today.work'],
    config: {
        title: 'Outpatient Department',
        cls: 'x-show-contact',
        ui: 'round',
        id: 'more',
        layout: 'vbox',
        items: [{
            xtype: 'button',
            id: 'addVitalsButton',
            text: '+ Vitals',
            left: 656,
            top: 52,
            width: 80,
            height: 30, // layout of vitals "table" changes when real values are added to it
            handler: function() {
                console.log('popup for vitals, allowing input');
                Ext.getCmp('vitalsModal').show();
            }
        },{
            xtype: 'container',
            height: 96,
            layout: 'hbox',
            items: [{
                id: 'content',
                height: 60,
                tpl: [
                    '<div class="top">', 
                        '<div style="float:left;width:30%;">', 
                            '<span id ="patientProfile" class="headshot" style="float:left;background-image:url(resources/images/headshots/pic.gif);">', 
                            '</span>', 
                        '</div>', 
                        '<div style="float:left;width:40%;">', 
                            '<span class="name" style="float:left;">', 
                                '{display}', 
                            '</span>', 
                        '</div>', 
                        '<div style="float:left;width:30%;">', 
                            '<div class="name_small" style="float:left;">', 
                                '<span>{age} / {gender}</span>', 
                            '</div>', 
                        '</div>', 
                    '</div>'
                    ].join(''),
                flex: 1,
                border: 1,
            }, {
                xtype: 'vitalsGrid',
                margin: 4,
                flex: 1,
                // border: 1,
                
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'card'
            },
            id: 'working-area',
            flex: 1,
            activeItem: 0,
            items: [{
                xtype: 'treatment-panel',
            },{
                xtype: 'diagnosis-panel'
            }]
        }],
        record: null
    },

    updateRecord: function (newRecord) {
        if (newRecord) {
            this.down('#content').setData(newRecord.data);
        }
    }
});
