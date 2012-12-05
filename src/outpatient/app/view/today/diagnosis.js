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
Ext.Viewport.setStyleHtmlContent(true); //This is to fit title of top bars & Component title bars (and not show them ending with ... (dots)
Ext.define('RaxaEmr.Outpatient.view.today.diagnosis', {
    extend: 'Ext.Container',
    xtype: 'diagnosis-panel',
    requires: ['RaxaEmr.Outpatient.view.today.diagnosedlist', 'RaxaEmr.Outpatient.view.today.diagnosislist'],
    id: 'diagnosis-panel',
    config: {
        layout: {
            type: 'vbox'
        },
        // centered: true,
        modal: true,
        hidden: true,
        floating: true,
        left: (768-500) / 2,    // centered, based on screen width and modal width
        top: 60,    // enough to not overlap with toolbar
        width: 500,
        hideOnMaskTap: true,
        title: 'Diagnosis',
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            title: 'Diagnosis'
        }, {
            xtype: 'container',
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
                    //style: 'border:solid #DADADA;',
                    height: 200,
                    layout: {
                        type: 'fit'
                    },
                    items: [{
                        xtype: 'Diagnosed-List',
                    }]
                }]
            }, {
                xtype: 'container',
                docked: 'bottom',
                items: [{
                    xtype: 'container',
                    margin: '0 0 20 0',
                    style: 'background-color: #f7f7f7;',
                    height: 60,
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Save',
                        centered: true,
                        flex: 1,
                        margin: '20 0 20 0',
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