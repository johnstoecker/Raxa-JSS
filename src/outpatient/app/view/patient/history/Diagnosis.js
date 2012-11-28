Ext.define('RaxaEmr.Outpatient.view.patient.history.Diagnosis', {
    extend: 'Ext.Container',
    xtype: 'history-diagnosis',
    // requires: ['RaxaEmr.Outpatient.view.history.DiagnosisGrid'],
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

Ext.define('RaxaEmr.Outpatient.view.history.DiagnosisGrid', {
    extend: 'Ext.ux.touch.grid.View',
    xtype: 'history-diagnosis-grid',
    id: 'historyDiagnosisGrid',
    requires: ['Ext.ux.touch.grid.feature.Feature', 'Ext.field.Number'],
    flex: 1,
    config: {
        title: 'Grid',
        scrollable: 'false',
        columns: [{
            header: 'Name',
            dataIndex: 'display',
            width: '40%',
            // cls: 'centered-cell'
        }, {
            header: 'Date',
            dataIndex: 'obsDatetime',
            width: '60%',
            // cls: 'centered-cell'
        }]
    }
});
