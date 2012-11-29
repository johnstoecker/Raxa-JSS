Ext.define('RaxaEmr.Outpatient.view.patient.history', {
    extend: 'Ext.Container',
    xtype: 'history-panel',
    requires: ['RaxaEmr.Outpatient.view.patient.history.Unstructured', 'RaxaEmr.Outpatient.view.patient.history.Diagnosis'],
    id: 'history-panel',
    title: 'History',
    initialize: function() {
        // Save the scope
        console.log('initHistoryComponent');
        var that = this;
        this.callParent(arguments);
    },
    config: {
        layout: {
            type: 'hbox'
        },
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox'
            }, 
            items: [{
                // Left bar
                // "Today" view vs History View
                xtype: 'container',
                // TODO: just fill this with an image!!
                html: '<div style="background-color:#82b0e1;"> &nbsp<br/ >&nbsp</div>',
                // color:
                width: 58,
                height: 52
            }, {
                // Left bar
                // "Today" view vs History View
                xtype: 'image',
                src: 'resources/images/bg/TODAY_35.png',
                width: 35,
                height: 835
            }]
        },
        {
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
                flex: 5,
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: 'Unstructured',
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(0);
                    }
                }, {
                    xtype: 'button',
                    text: 'Investigations',
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(1);
                    }
                }, {
                    xtype: 'button',
                    text: 'Diagnoses',
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(2);
                    }
                }, {
                    xtype: 'button',
                    text: 'Medications',
                    handler: function() {
                        Ext.getCmp('historyPanelMainView').setActiveItem(3);
                    }
                }, ]
            },
            // Main view
            {
                id: 'historyPanelMainView',
                flex: 95,
                xtype: 'container',
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