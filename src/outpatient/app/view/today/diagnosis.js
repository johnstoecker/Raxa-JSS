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
// TODO: This belongs in Viewport setup, or somewhere else, to make it clear that it's being applied globally
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
        listeners: {
            hide: function() {
                if(Ext.getCmp('searchedDiagnosisList')) {
                    Ext.getCmp('searchedDiagnosisList').setHidden(true);
                }
            },
            show: function() {
                Ext.getCmp('diagnosisfilterbysearchfield').reset();
            }
        },
        // centered: true,
        modal: true,
        hidden: true,
        floating: true,
        left: (768 - 500) / 2,
        // centered, based on screen width and modal width
        top: 60,
        // enough to not overlap with toolbar
        width: 500,
        hideOnMaskTap: true,
        items: [{
            xtype: 'toolbar',
            title: 'Diagnosis',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'delete',
                iconMask: true,
                handler: function() {
                    Ext.getCmp('diagnosis-panel').hide();
                },
                ui: 'decline',
            }]
        }, {
            xtype: 'container',
            style: 'background-color: #f7f7f7;',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                margin: '20 40 20 40',
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
                        placeHolder: 'Use Keyboard to start typing....'
                    }]
                }, {
                    xtype: 'Diagnosis-List',
                    flex: 1,
                }]
            }, {
                xtype: 'container',
                flex: 1,
                hidden: true,
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
                style: 'background-color: #f7f7f7;',
                height: 80,
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'spacer',
                        flex: 1
                    }, {
                        xtype: 'button',
                        ui: 'confirm',
                        text: 'Add More',
                        id: 'addMoreDiagnosis',
                        hidden: true,
                        handler: function() {
                            // TODO: fire event. move handling to controller
                            // TODO: Ideally, it should still group them together and only draw
                            //  the line underneath once all diagnoses have been selected.
                            stage.fire('paintDiagnosis');

                            // Reset what's in the modal
                            Ext.getCmp('diagnosisfilterbysearchfield').reset();

                            // Show modal again
                            Ext.getCmp('diagnosis-panel').show();                           
                        },
                        flex: 1
                    }, //{
                       // xtype: 'spacer',
                       // flex: 1
                    //}, 
                    {
                        xtype: 'button',
                        text: 'Done',
                        id: 'addDiagnosisInList',
                        ui: 'confirm',
                        handler: function() {
                            // TODO: Investigate events this triggers.. sets off a chain and don't think we need all of them
                            stage.fire('paintDiagnosis');        

                            // Hide modal (prevents extra pop up bug on iPad?)
                            Ext.getCmp('diagnosis-panel').hide();                                           
                        },
                        flex: 1
                    }, {
                        xtype: 'spacer',
                        flex: 1
                    }]
                }]
            }]
        }]
    }
});