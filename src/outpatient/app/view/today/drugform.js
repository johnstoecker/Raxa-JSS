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
 * 
 * This view contains the form to add details about a drug order
 *
 */
Ext.define('RaxaEmr.Outpatient.view.today.drugform', {
    extend: 'Ext.Container',
    xtype: 'drug-panel',
    id: 'drugForm',
    config: {
        centered: true,
        modal: true,
        hidden: true,
        floating: true,
        hideOnMaskTap: true,
        left: (768-500) / 2,    // centered, based on screen width and modal width
        top: 60,
        width: 500,
        title: 'Treatment',
        listeners : {
            hide: function()
            {
                if(Ext.getCmp('searchedDrugList'))
                    {
                        Ext.getCmp('searchedDrugList').setHidden(true);
                    }
            },
            show: function() {
                Ext.getCmp('drugfilterbysearchfield').reset();
                Ext.getCmp('drugfilterbysearchfield').focus();
            }
        },
        items: [{
                xtype: 'toolbar',
                title: 'Drug Order',
                items: [{
                    xtype: 'spacer'
                },{
                    xtype: 'button',
                    iconCls: 'delete',
                    iconMask: true,
                    handler: function() {
                        Ext.getCmp('drugForm').hide();
                    },
                    ui: 'decline',
                }]
            },{
            xtype: 'container',
            width: 500,
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                items: [{
                    xtype: 'container',
                    height: 280,
                    layout: {
                        type: 'fit'
                    },
                    items: [{
                        xtype: 'formpanel',
                        flex: 2,
                        id: 'drugaddform',
                        scrollable: 'false',
                        items: [{
                            xtype: 'fieldset',
                            items: [{
                                xtype: 'searchfield',
                                id: 'drugfilterbysearchfield',
                                label: 'Drug Name'
                            }, {
                                xtype: 'selectfield',
                                label: 'Strength',
                                id: 'drug-strength',
                                hidden : true,
                                valueField: 'value',
                                displayField: 'title',
                                store: {
                                    data: [{
                                        value: '',
                                        title: '',
                                    }, {
                                        value: '100',
                                        title: '100mg'
                                    }, {
                                        value: '200',
                                        title: '200mg'
                                    }, {
                                        value: '500',
                                        title: '500mg'
                                    }]
                                }
                            }, {
                                xtype: 'fieldset',
                                baseCls: 'x-form-fieldset-mod',
                                margin: '0 0 0 0',
                                layout: {
                                    type: 'hbox'
                                },
                                items: [{
                                    xtype: 'selectfield',
                                    label: 'Frequency',
                                    border: 0,
                                    labelWidth: '46.1538%',
                                    flex: 13,
                                    id: 'drug-frequency',
                                    valueField: 'value',
                                    displayField: 'title',
                                    store: {
                                        data: [{
                                            value: '',
                                            title: '',
                                        }, {
                                            value: 'Once Daily',
                                            title: 'Once Daily'
                                        }, {
                                            value: 'Once Daily',
                                            title: 'Twice Daily'
                                        }, {
                                            value: 'Once Daily',
                                            title: 'Thrice Daily'
                                        }]
                                    }
                                }, {
                                    xtype: 'selectfield',
                                    border: 0,
                                    flex: 7,
                                    id: 'drug-instruction',
                                    valueField: 'value',
                                    displayField: 'title',
                                    store: {
                                        data: [{
                                            value: '',
                                            title: '',
                                        }, {
                                            value: 'Empty Stomach',
                                            title: 'Empty Stomach',
                                        }, {
                                            value: 'Before Meals',
                                            title: 'Before Meals',
                                        }, {
                                            value: 'With Meals',
                                            title: 'With Meals',
                                        }, {
                                            value: 'After Meals',
                                            title: 'After Meals',
                                        }]
                                    }
                                }]
                            }, {
                                xtype: 'selectfield',
                                label: 'Route of Administration',
                                id: 'drug-routeofadministration',
                                valueField: 'value',
                                displayField: 'title',
                                store: {
                                    data: [{
                                        value: 'Oral',
                                        title: 'Oral',
                                    }, {
                                        value: 'Injection',
                                        title: 'Injection'
                                    }]
                                }
                            }, {
                                // TODO: Cause "days" to have a numeric input, like in Screener
                                xtype: 'numberfield',
                                id: 'drug-duration',
                                label: 'Duration (days)'
                            }]
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [{
                                xtype: 'spacer',
                                width: '8%'
                            }, {
                                xtype: 'button',
                                ui: 'confirm',
                                text: 'Add Drug',
                                id: 'addDrugInList',
                                flex: 1,
                                width: '40%',
                            }, {
                                xtype: 'spacer',
                                width: '4%'
                            }, {
                                xtype: 'button',
                                ui: 'confirm',
                                text: 'Add Drug and Continue',
                                id: 'addMoreDrug',
                                flex: 2,
                                width: '40%',
                            }, {
                                xtype: 'spacer',
                                width: '8%'
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }
});
