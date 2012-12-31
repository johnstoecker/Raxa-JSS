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
            // // List of navigation buttons
            // {
            //     xtype: 'container',
            //     flex: 5,
            //     layout: {
            //         type: 'hbox'
            //     },
            //     items: [{
            //         xtype: 'button',
            //         text: 'Unstructured',
            //         handler: function() {
            //             Ext.getCmp('historyPanelMainView').setActiveItem(0);
            //         }
            //     }, {
            //         xtype: 'button',
            //         text: 'Investigations',
            //         handler: function() {
            //             Ext.getCmp('historyPanelMainView').setActiveItem(1);
            //         }
            //     }, {
            //         xtype: 'button',
            //         text: 'Diagnoses',
            //         handler: function() {
            //             Ext.getCmp('historyPanelMainView').setActiveItem(2);
            //         }
            //     }, {
            //         xtype: 'button',
            //         text: 'Medications',
            //         handler: function() {
            //             Ext.getCmp('historyPanelMainView').setActiveItem(3);
            //         }
            //     }, ]
            // },
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