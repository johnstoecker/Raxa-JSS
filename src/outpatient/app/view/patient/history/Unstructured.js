Ext.define('RaxaEmr.Outpatient.view.patient.history.Unstructured', {
    extend: 'Ext.Container',
    xtype: 'history-unstructured-panel',
    id: 'history-unstructured-panel',
    // title: 'History Unstructured',
    initialize: function() {
        // Save the scope
        console.log('initHistoryUnstructured Component');
        var that = this;
        this.callParent(arguments);
        console.log('overlay, on the way!');

        // TODO: That.add
        // var singleVisitHistory = that.add();
        // TODO: remove this 'cat' picture :P

        var visitHistory = that.add({
            xtype: 'panel',
            id: 'visitHistory',

            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // fullscreen: true,
            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 400,
            height: 400,

            // Here we specify the #id of the element we created in `index.html`
            // contentEl: 'content',
            // Style the content and make it scrollable
            // styleHtmlContent: true,
            // scrollable: true,
            layout: 'hbox',

            // Insert a title docked at the top with a title
            items: [{
                docked: 'top',
                xtype: 'toolbar',
                title: 'History',
                items: [{
                    xtype: 'button',
                    text: 'Close',
                    handler: function() {
                        console.log('cliked');
                        Ext.getCmp('visitHistory').hide();
                    },
                    ui: 'decline',
                    // badgeText: '2' // TODO: put this on buttons(?!), so we can see recent updates, etc
                }]
            }, {
                xtype: 'list',
                id: 'visitHistoryList',
                itemTpl: '<img src="{imgSrc}" height="32" width="32" /> {title} (Dx: {diagnosisCount}, Rx: {treatmentCount})',
                store: new Ext.data.ArrayStore({
                    id: 'visitHistoryStore',
                    fields: ['title', 'uuid', 'diagnosisCount', 'treatmentCount', 'imgSrc'],
                    data: []
                }),

                flex: 1,
                disableSelection: true,
                preventSelectionOnDisclose: true,
                onItemDisclosure: true,
                listeners: {
                    disclose: function(view, record, target, index, e, eOpts) {
                        console.log('Disclose!', 'You selected ' + record.get('uuid') + '... so let\'s open this history record');
                        // Close this window
                        Ext.getCmp('visitHistory').hide();
                        var img = Ext.getCmp('singleVisitHistoryImage');
                        img.setSrc(record.get('imgSrc'));
                        // TODO: Set height dynamically, according to size of (joined?) image(s).
                        //  This is to allow proper display of full image and scrolling.
                        img.setConfig({'height':800});

                        var button = Ext.getCmp('unstructuredHistoryChooseDateButton');
                        button.setText('Date of visit');

                        Ext.getCmp('singleVisitHistory').show();
                    }
                },

            }]
        });
    },
    config: {
        layout: {
            type: 'vbox'
        },
        fullscreen: true,
        items: [{
            // Button to view all history items
            xtype: 'button',
            id: 'unstructuredHistoryChooseDateButton',

            left: 500,
            top: 30,

            height: 20,
            // width: 60,
            text: 'Items',	//today's date
            handler: function() {
                Ext.getCmp('visitHistory').showBy(this);
                console.log('open history view');
            }
        }, {
            xtype: 'container',
            id: 'singleVisitHistory',
            scrollable: true,
            layout: 'vbox',
            flex: 1,
            
            items: [{
                xtype: 'image',
                id: 'singleVisitHistoryImage',  
                // Dynamically set 'src' and 'height' 
            }]
        }]
}
});