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
Ext.Viewport.setStyleHtmlContent(true);  //This is to fit title of top bars & Component title bars (and not show them ending with ... (dots)
Ext.define('RaxaEmr.Outpatient.view.patient.diagnosis', {
    extend: 'Ext.Container',
    xtype: 'diagnosis-panel',
    requires: ['RaxaEmr.Outpatient.view.patient.diagnosedlist', 'RaxaEmr.Outpatient.view.patient.diagnosislist'],
    id: 'diagnosis-panel',
    config: {
        layout: {
            type: 'vbox'
        },
        width: 500,
        height: 500,
        centered: true,
        modal: true,
        hidden: true,
        floating: true,
        hideOnMaskTap: true,
        title: 'Diagnosis',
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            title: 'Diagnosis'
          },{
            xtype: 'container',
            width: 500,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'formpanel',
                    border: '0 0 1 0',
                    padding: '0 0 0 0',
                    style: 'border:solid #DADADA;',
                    scrollable: false,
                    items: [{
                        xtype: 'selectfield',
                        label: 'Search In',
                        hidden: true,
                        id: 'diagnosisFilter',
                        border: '0 0 1 0',
                        style: 'border:solid #DADADA;',
                        valueField: 'filterBy',
                        displayField: 'title',
                        store: {
                            data: [{
                                filterBy: 'all',
                                title: 'All',
                            }]
                        }
                    }, {
                        xtype: 'searchfield',
                        id: 'diagnosisfilterbysearchfield',
                    }]
                }, {
                    xtype: 'Diagnosis-List',
                    flex: 1,
                }]
            }, {
                xtype: 'container',
                flex: 1,
                items: [{
                    xtype: 'container',
                    margin: '0 0 20 0',
                    border: '0 0 0 3',
                    style: 'border:solid #DADADA;',
                    height: 476,
                    layout: {
                        type: 'fit'
                    },
                    items: [{
                        xtype: 'Diagnosed-List',
                    },{
                xtype: 'button',
                text: 'Save',
                docked: 'bottom',
                align: 'center',
                ui: 'confirm',
                handler: function() {
                    stage.fire('paintDiagnosis');
                }
            }]
                }]
            }]
        }]
    }
});