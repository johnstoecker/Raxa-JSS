Ext.define('RaxaEmr.Outpatient.view.history.Diagnosis', {
    extend: 'Ext.Container',
    xtype: 'history-diagnosis',
    requires: ['RaxaEmr.Outpatient.view.history.DiagnosisGrid'],
    id: 'historyDiagnosis',
    initialize: function() {
        // this.config.items.add();
    },
    config: {
        layout: {
            type: 'vbox'
        },
        fullscreen: true,
        items: [{
            // Button to view all history items
            xtype: 'history-diagnosis-grid',
            flex: 1,
        }]
	}
});