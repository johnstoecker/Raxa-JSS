Ext.define("RaxaEmr.Outpatient.view.today.VitalsModal", {
    extend: 'Ext.Container',
    id: 'vitalsModal',
    requires: ['RaxaEmr.Outpatient.view.today.VitalsForm'],
    xtype: 'vitalsmodal',
    config: {
        modal: true,
        hidden: true,
        floating: true,
        left: (768 - 500) / 2,
        // centered, based on screen width and modal width
        top: 60,
        // enough to not overlap with toolbar
        width: 500,
        height: 400,
        hideOnMaskTap: true,
        layout: 'vbox',
        // style: 'background:#96d2f7',
        items: [
        {
            xtype: 'toolbar',
            title: 'Add',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'delete',
                iconMask: true,
                handler: function() {
                    Ext.getCmp('vitalsModal').hide();
                },
                ui: 'decline',
            }]
        },
        {
            xtype: 'vitalsForm',
            flex: 1
        }]
    }
});
