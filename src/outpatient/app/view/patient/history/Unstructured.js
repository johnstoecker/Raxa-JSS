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
			styleHtmlContent: true,
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
						// var svh = Ext.getCmp('singleVisitHistory'); 
						// var scroller = svh.getScrollable().getScroller();
						// var HEIGHT_OF_STAGE = 1024;
						// scroller.scrollTo(0, index*HEIGHT_OF_STAGE, true);
						
						var me = Ext.getCmp('history-unstructured-panel');
						var imgSrc = record.get('imgSrc');
					  	addImageToLayer(imgSrc, me.loadedImageLayer, {
							x: stage.getWidth()-711,
							y: DRAWABLE_Y_MIN,
							width: 768,
							height: 1024
						});

						// var img = Ext.getCmp('singleVisitHistoryImage');
						// var imgSrc = record.get('imgSrc');
						// img.setSrc('imgSrc');

						// Close this window
						Ext.getCmp('visitHistory').hide();

						var button = Ext.getCmp('unstructuredHistoryChooseDateButton');
						var visitDate = record.get('date');
						button.setText(visitDate);

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
					var stage = new Kinetic.Stage({
						id: "unstructuredHistoryStage",
						container: "historyContainer",
						width: STAGE_X,
						height: STAGE_Y
					});
					this.stage = stage;
					this.isCanvasSetup = true;

					// Layers
					var backgroundLayer = new Kinetic.Layer({id:'backgroundLayer'});
					var loadedImageLayer = new Kinetic.Layer({id:'loadedImageLayer'});
					var controlsLayer = new Kinetic.Layer({id:'controlsLayer'});

					this.loadedImageLayer = loadedImageLayer;

					console.log('adding layers');
					stage.add(backgroundLayer);
					stage.add(loadedImageLayer);
					stage.add(controlsLayer);

					// Draw background.
					// Background - blank white canvas
					background = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: stage.getWidth(),
						height: stage.getHeight(),
						fill: "white"
					});
					backgroundLayer.add(background);

					// Background - toolbar background
					toolbarBackground = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: stage.getWidth(),
						height: TOOLBAR_HEIGHT,
						fill: "#82b0e1"	// Light Blue.
					});
					backgroundLayer.add(toolbarBackground);
					
					addImageToLayer("resources/images/bg/TODAY_35.png", backgroundLayer, {
						x: 0,
						y: DRAWABLE_Y_MIN,
						width: 35,
						height: 835
					});
					
					addImageToLayer("resources/images/bg/HISTORY_710.png", backgroundLayer, {
						x: stage.getWidth()-711,
						y: DRAWABLE_Y_MIN,
						width: 710,
						height: 835
					});

					var visitHistoryStore = Ext.getStore('visitHistoryStore');
					var tempMonth = 10;
					var tempDay = 24;
					function addImageToHistoryStore(url) {	// TODO: add meta data
						// Request to fetch DataURL from a file
						// http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
						var request = new XMLHttpRequest();
						request.open('GET', url, true);
						request.onreadystatechange = function() {
						// Makes sure the document is ready to parse.
						if(request.readyState == 4) {
						  // Makes sure it's found the file.
						  if(request.status == 200) {
						  	console.log(request.responseText);

						  	// Add to history store
						  	var visitHistoryItem = {
			                    'title': "Fake Title",
			                    'date' : '2012.'+ tempMonth +'.'+ tempDay,
			                    'uuid' : 'FAKE',
			                    'diagnosisCount': 'd#',
			                    'treatmentCount': 't#',
			                    'imgSrc' : request.responseText,
			                    'json' : ''
			                };

			                // tempMonth -= 2;
			                tempDay -= 7;

			                visitHistoryStore.add(visitHistoryItem);
						  }
						}
						};
						request.send(null);
					}
					
					var images = [
						'resources/images/dataUrl/hypertensionDataURL', 
						'resources/images/dataUrl/chickenpoxDataURL',
						'resources/images/dataUrl/chickenpoxDataURL2',
					];
					for (var k=0; k < images.length; k++) {
						addImageToHistoryStore(images[k]);
					}

					stage.draw();
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

			left: 600,
			top: 10,

			height: 20,
			// width: 60,
			text: 'Which Visit?',
			//today's date
			handler: function() {
				Ext.getCmp('visitHistory').showBy(this);
				console.log('open history view');
			}
		}, {
			xtype: 'container',
			disabled: true,
			id: 'opdHistoryMainContainer',
			width: STAGE_X,
			height: STAGE_Y,
			layout: 'vbox',
			items: [{
			scroll: false,
				html: '<div id="historyContainer" ></div>'
			}],

			// xtype: 'container',
			// id: 'singleVisitHistory',
			// // scrollable: true,
			// scrollable: {
	//              direction: 'vertical',
	//              directionLock: true
	//          },
			// layout: 'vbox',
			// width: STAGE_X,
			// height: STAGE_Y,
			// items: [{
			// 	html: '<div id="historyContainer" ></div>',
			// 	// xtype: 'image',
			// 	// src: '',
			// 	// id: 'singleVisitHistoryImage',
			// 	// height: 800,
			// }]
		}]
	}
});