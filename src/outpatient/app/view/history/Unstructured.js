Ext.define('RaxaEmr.Outpatient.view.history.Unstructured', {
	extend: 'Ext.Container',
	xtype: 'history-unstructured-panel',
	id: 'history-unstructured-panel',

	// Connection with KineticJS stage
	isCanvasSetup: false,
	stage: null,
	showVisitInView: function(record) {
		var me = Ext.getCmp('history-unstructured-panel');
		var imgSrc = record.get('imgSrc');
		addImageToLayer(imgSrc, me.loadedImageLayer, {
			x: DRAWABLE_X_MIN + 35,
			y: DRAWABLE_Y_MIN,
			width: DRAWABLE_X_MAX - DRAWABLE_X_MIN,
			height: DRAWABLE_Y_MAX - DRAWABLE_Y_MIN
		});

		// var img = Ext.getCmp('singleVisitHistoryImage');
		// var imgSrc = record.get('imgSrc');
		// img.setSrc('imgSrc');
		// Close visit history list window, if open
		Ext.getCmp('visitHistory').hide();

		// var button = Ext.getCmp('unstructuredHistoryChooseDateButton');
		// var visitDate = record.get('date');
		// button.setText(visitDate);
	},
	initialize: function() {
		// Save the scope
		var that = this;
		this.callParent(arguments);

		var visitHistory = that.add({
			xtype: 'panel',
			id: 'visitHistory',

			// We give it a left and top property to make it floating by default
			left: 364,
			top: 60,

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
			// scrollable: true,
			layout: 'hbox',

			// Insert a title docked at the top with a title
			items: [{
				docked: 'top',
				xtype: 'toolbar',
				title: 'History',
				id: 'historyListCloseButton',
				// styleHtmlContent: true,
				items: [{
					xtype: 'spacer'
				}, {
					xtype: 'button',
					iconCls: 'delete',
					iconMask: true,
					handler: function() {
						Ext.getCmp('visitHistory').hide();
					},
					ui: 'decline',
				}],
			}, {
				xtype: 'list',
				id: 'visitHistoryList',
				itemTpl: '<img src="{imgSrc}" height="48" width="32" /> <span style="font-size:26px"> {date} </span>',
				store: new Ext.data.ArrayStore({
					id: 'visitHistoryStore',
					fields: ['title', 'date', 'uuid', 'diagnosisCount', 'treatmentCount', 'imgSrc', 'json'],
					data: [],
					sorters: [{
						property: 'date',
						direction: 'DESC'
					}],
					listeners: {
						addrecords: function() {
							var visitHistoryStore = Ext.getStore('visitHistoryStore');
							if (visitHistoryStore.getCount()) {
								// Always auto-opens newest by "date" (see sorter, above)
								var record = visitHistoryStore.getAt(0);
								var me = Ext.getCmp('history-unstructured-panel');
								me.showVisitInView(record);
							}
						}
					}
				}),

				flex: 1,
				disableSelection: true,
				listeners: {
					// load: function() {
						// on first load after selecting any patient...
						// if >=1 visit
						// show most recent visit in view / 
						// automatically open the visit history menu
					// },
					itemtap: function(view, index, target, record, e, eOpts) {
						var me = Ext.getCmp('history-unstructured-panel');
						me.showVisitInView(record);
					}
				},
			}]
		});
	},
	config: {
		listeners: {
			painted: function() {
				if(!this.isCanvasSetup) {
					var stage = new Kinetic.Stage({
						id: "unstructuredHistoryStage",
						container: "historyContainer",
						width: STAGE_X,
						height: STAGE_Y
					});
					this.stage = stage;
					this.isCanvasSetup = true;

					// Layers
					var backgroundLayer = new Kinetic.Layer({
						id: 'backgroundLayer'
					});
					var loadedImageLayer = new Kinetic.Layer({
						id: 'loadedImageLayer'
					});
					var controlsLayer = new Kinetic.Layer({
						id: 'controlsLayer'
					});

					this.loadedImageLayer = loadedImageLayer;

					stage.add(backgroundLayer);
					stage.add(loadedImageLayer);
					stage.add(controlsLayer);

					// Draw background.
					// Background - blank white canvas
					var background = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: stage.getWidth(),
						height: stage.getHeight(),
						fill: "white"
					});
					backgroundLayer.add(background);

					// Background - toolbar background
					var toolbarBackground = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: stage.getWidth(),
						height: TOOLBAR_HEIGHT,
						fill: "#82b0e1" // Light Blue.
					});
					backgroundLayer.add(toolbarBackground);

					addImageToLayer("resources/images/bg/today_small.png", backgroundLayer, {
						x: 0,
						y: DRAWABLE_Y_MIN,
						// width: 35,
						// height: 835
						width: 41,
						height: 742
					});

					addImageToLayer("resources/images/bg/history_big.png", backgroundLayer, {
						x: stage.getWidth() - 723,
						y: DRAWABLE_Y_MIN,
						// width: 710,
						width: 722,
						// height: 835
						height: 742
					});

					// Add button for History Dropdown
					addImageToLayer("resources/images/button_History_off.png", controlsLayer, {
						x: 660,
						y: 0,
						width: 80,
						height: 44,
						events: 'click touchstart',
						handler: function() {
							// Show visit history
							Ext.getCmp('visitHistory').show();
						}
					});

					stage.draw();
				}
			},
		},
		layout: {
			type: 'vbox'
		},
		fullscreen: true,
		items: [{
			// 	// Button to view all history items
			// 	xtype: 'button',
			// 	id: 'unstructuredHistoryChooseDateButton',
			// 	left: 600,
			// 	top: 10,
			// 	height: 20,
			// 	// width: 60,
			// 	text: 'Which Visit?',
			// 	//today's date
			// 	handler: function() {
			// 		Ext.getCmp('visitHistory').showBy(this);
			// 		console.log('open history view');
			// 	}
			// }, {
			xtype: 'container',
			flex: 1,
			disabled: true,
			id: 'opdHistoryMainContainer',
			width: STAGE_X,
			height: STAGE_Y,
			layout: 'vbox',
			items: [{
				scroll: false,
				// scrollable: {
				// 	direction: 'vertical',
				// 	directionLock: true
				// },
				html: '<div id="historyContainer" ></div>'
			}],
		}]
	}
});