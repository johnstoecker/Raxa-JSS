Ext.define('RaxaEmr.Outpatient.view.history.Overview', {
    extend: 'Ext.Container',
    xtype: 'history-panel',
    requires: ['RaxaEmr.Outpatient.view.history.Unstructured', 'RaxaEmr.Outpatient.view.history.Diagnosis'],
    id: 'history-panel',
    title: 'History',
    initialize: function() {
        // Save the scope
        var that = this;
        this.callParent(arguments);
    },
    config: {
        layout: {
            type: 'hbox'
        },
        items: [{
            // Right side
            flex: 1,
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            items: [
            // List of navigation buttons
            {
                
                xtype: 'container',
                style: 'background-color: #FFFFFF;',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: 'View Past History',
                    style: 'background:#FFFFFF;border:0',
                    iconCls: 'arrow_down',
                    iconMask: true,
                    iconAlign: 'right',

                    handler: function() {
                        Ext.getCmp('visitHistory').showBy(this, "tc-bc?");
                        }                        


                },{
                    xtype: 'spacer'
                },
                {
                    xtype: 'checkboxfield',
                    style: 'background:#FFFFFF;background-color:#FFFFFF',
                    id : 'DrugsHistoryView',
                    label: 'Structured View:&nbsp;Drugs',
                    value: 'DrugsHistoryView',
                    labelWidth: 180,
                    checked: true,
                    listeners: {
                        check: function() {
                            Ext.getCmp('history-unstructured-panel').fireEvent('structuredDataOnCanvas');
                            },                        
                        uncheck: function() {
                            }  
                        }
                },{
                    xtype: 'checkboxfield',
                    id: 'DiagnosisHistoryView',
                    label: 'Diagnosis',
                    labelWidth: 100,
                    checked: true,
                    listeners: {
                        check: function() {
                            Ext.getCmp('history-unstructured-panel').fireEvent('structuredDataOnCanvas');
                            },                        
                        uncheck: function() {
                            }  
                        }                    
                },{
                    xtype: 'spacer'
                },{
                    xtype: 'button',
                    text: 'History',
                    hidden:true,
                    handler: function() {
                        Ext.getCmp('visitHistory').show();
                    }
                },{
                    xtype: 'button',
                    text: 'Unstructured',
                    hidden: true,
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(0);
                    }
                }, {
                    xtype: 'button',
                    text: 'Investigations',
                    hidden: true,
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(1);
                    }
                }, {
                    xtype: 'button',
                    text: 'Diagnoses',
                    hidden: true,
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(2);
                    }
                }, {
                    xtype: 'button',
                    text: 'Medications',
                    hidden: true,
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(3);
                    }
                }]
            },
            // Main view
            {
                id: 'historyPanelMainView',
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'card'
                },
                // // TODO: Create separate xtypes and files for these, as they get fancier
                items: [{
                    xtype: 'history-unstructured-panel'
                }, {
                    html: 'Investigations'
                }, {
                    // html: 'Diagnoses'
                    xtype: 'history-diagnosis'
                }, {
                    html: 'Medicine'
                }]
            }]
        }]
    }
});