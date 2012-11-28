Ext.define('RaxaEmr.Outpatient.view.patient.history.Unstructured', {
	extend: 'Ext.Container',
	xtype: 'history-unstructured-panel',
	id: 'history-unstructured-panel',
	
	// Connection with KineticJS stage
	isCanvasSetup: false,
	stage: null,

	initialize: function() {
		// Save the scope
		console.log('initHistoryUnstructured Component');
		var that = this;
		this.callParent(arguments);
		console.log('overlay, on the way!');

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
				itemTpl: '<img src="{imgSrc}" height="32" width="32" /> {date}',
				store: new Ext.data.ArrayStore({
					id: 'visitHistoryStore',
					fields: ['title', 'date', 'uuid', 'diagnosisCount', 'treatmentCount', 'imgSrc', 'json'],
					data: []
				}),

				flex: 1,
				disableSelection: true,
				listeners: {
					itemtap: function(view, index, target, record, e, eOpts) {
						gloRecord = record;
						console.log(record);
						// Close this window
						Ext.getCmp('visitHistory').hide();

						var stageJSON = record.get('json');
						var stage = Ext.getCmp('history-unstructured-panel').stage; 
						// stage.clear();
						stage = Kinetic.Node.create(stageJSON, 'unstructuredDataContainer');
						stage.draw();

						var button = Ext.getCmp('unstructuredHistoryChooseDateButton');
						var visitDate = record.get('date');
						button.setText(visitDate);

						Ext.getCmp('singleVisitHistory').show();
					}
				},
			}]
		});
	},
	config: {
		listeners: {
			painted: function() {
				if(!this.isCanvasSetup) {
					console.log("Setting up for unstructured history");
					// var stage = new Kinetic.Stage({
					// 	id: "unstructuredHistoryStage",
					// 	container: "unstructuredDataContainer",
					// 	width: STAGE_X,
					// 	height: STAGE_Y
					// });
					// this.stage = stage;
					this.isCanvasSetup = true;
				}
			},
		},
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
			text: 'Items',
			//today's date
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
				html: '<div id="unstructuredDataContainer" ></div>',
			}]
		}]
	}
});