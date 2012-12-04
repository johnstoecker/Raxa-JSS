Ext.define('RaxaEmr.Outpatient.view.patient.history.Diagnosis', {
    extend: 'Ext.Container',
    xtype: 'history-diagnosis',
    requires: ['RaxaEmr.Outpatient.view.patient.history.DiagnosisGrid'],
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