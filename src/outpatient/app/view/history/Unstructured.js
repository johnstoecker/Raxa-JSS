Ext.define('RaxaEmr.Outpatient.view.history.Unstructured', {
	extend: 'Ext.Container',
	xtype: 'history-unstructured-panel',
	id: 'history-unstructured-panel',

	// Connection with KineticJS stage
	isCanvasSetup: false,
	stage: null,
	showVisitInView: function(record) {
		var me = Ext.getCmp('history-unstructured-panel');
		var imgSrc = record.get('imgSrc') || "";
		var json =  record.get('json') || "" ;
		Ext.getCmp('history-unstructured-panel').fireEvent('repaint',json);

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
			left: 100,
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
					fields: ['title', 'date', 'uuid', 'diagnosisCount', 'treatmentCount', 'imgSrc', 'json','structuredData'],
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

						// Hide modal window
						Ext.getCmp('visitHistory').hide();
					}
				},
			}]
		});
	},
	config: {
		listeners: {
			repaint: function(stageJSONParam) {
				//converts JSON to Kinetic Stage object
				var RetrivedStage = Kinetic.Node.create(stageJSONParam, 'historyContainer');
				
				//Add children to textLayer is not present, otherwise pushes new Layer in stage
				if(this.stage.get('#textLayer').length){
					this.stage.get('#textLayer')[0].removeChildren();
					this.stage.get('#textLayer')[0].children = RetrivedStage.get('#textLayer')[0].getChildren();
				}
				else{
					this.stage.add(RetrivedStage.get('#textLayer')[0]);
				}

				//Add children to linesLayer is not present, otherwise pushes new Layer in stage
				if(this.stage.get('#linesLayer').length){
					this.stage.get('#linesLayer')[0].removeChildren();
					this.stage.get('#linesLayer')[0].children = RetrivedStage.get('#linesLayer')[0].getChildren();
				}
				else{
					this.stage.add(RetrivedStage.get('#linesLayer')[0]);
				}

				//TODO: Show this on repaint.
				if(!this.stage.get('#textLayer').length){
					this.stage.get('#textLayer')[0].show();
				}
				if(!this.stage.get('#linesLayer').length){
					this.stage.get('#linesLayer')[0].show();
				}
				if(this.stage.get('#structuredDataLayer').length){
					this.stage.get('#structuredDataLayer')[0].hide();
				}

                for (var i = 0; i < this.stage.get('#textLayer')[0].getChildren().length; i++) {
	                if (this.stage.get('#textLayer')[0].getChildren()[i].shapeType === "Image" && this.stage.get('#textLayer')[0].getChildren()[i].getName()) {

	                    var printImage = new Image();
	                    
	                    switch (this.stage.get('#textLayer')[0].getChildren()[i].getName()) {
	                        case 'LineSeparator':
	                            printImage.src = "resources/images/icons/line.png";
	                            
	                            this.stage.get('#textLayer')[0].getChildren()[i].setImage(printImage);
	                            break;
	                        case 'DrugOrder':
	                            printImage.src = "resources/images/icons/bullet_drug.png";
	                            this.stage.get('#textLayer')[0].getChildren()[i].setImage(printImage);
	                            break;
	                        case 'Diagnosis':
	                            printImage.src = "resources/images/icons/bullet_diagnosis.png";
	                            this.stage.get('#textLayer')[0].getChildren()[i].setImage(printImage);
	                            break;
	                        case 'LabOrder':
	                            printImage.src = "resources/images/icons/bullet_investigation.png";
	                            this.stage.get('#textLayer')[0].getChildren()[i].setImage(printImage);
	                            break;
	                    }
	                }
	             if(i===(stage.get('#textLayer')[0].getChildren().length-1))
				 {
				 	this.stage.get('#textLayer')[0].draw(); 
				 	this.stage.get('#linesLayer')[0].draw();
				 }
			}	
				//Testing
				setTimeout(function(){
					Ext.getCmp('history-unstructured-panel').stage.draw();
				 	//this.stage.get('#textLayer')[0].draw(); 
				 	//this.stage.get('#linesLayer')[0].draw();
				}, 500)
			},
			painted: function() {
				if(!this.isCanvasSetup) {
					stage = new Kinetic.Stage({
						id: "unstructuredHistoryStage",
						container: "historyContainer",
						width: STAGE_X,
						height: STAGE_Y
					}); 
					this.stage = stage;
					this.isCanvasSetup = true;

					// Layers
					var backgroundLayer =  new Kinetic.Layer({
						id: 'backgroundLayer'
					}); 
					var controlsLayer = new Kinetic.Layer({
						id: 'controlsLayer'
					});

					this.stage.add(backgroundLayer);
					this.stage.add(controlsLayer);

					// Draw background.
					// Background - blank white canvas
					var background = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: this.stage.getWidth(),
						height: this.stage.getHeight(),
						fill: "white"
					});
					backgroundLayer.add(background);

/*					// Background - toolbar background
					var toolbarBackground = new Kinetic.Rect({
						x: 0,
						y: 0,
						width: this.stage.getWidth(),
						height: TOOLBAR_HEIGHT,
						fill: "white"
					});
					backgroundLayer.add(toolbarBackground);
*/
					addImageToLayer("resources/images/bg/today_small.png", backgroundLayer, {
						x: 0,
						y:12,
//						y: DRAWABLE_Y_MIN,
						// width: 35,
						// height: 835
						width: 41,
						height: 742,
						events: 'click touchstart',
						handler: function() {
							Ext.getCmp('treatment-panel').animateActiveItem(UNSTRUCTURED_HISTORY_VIEW , {
									type: 'slide',
								direction: 'left'
							});
						}
					});

					addImageToLayer("resources/images/bg/history_big.png", backgroundLayer, {
						x: this.stage.getWidth() - 723,
						y: 12,
//						y: DRAWABLE_Y_MIN,
						// width: 710,
						width: 722,
						// height: 835
						height: 742
					});

					// // Add button for History Dropdown
					// addImageToLayer("resources/images/button_History_off.png", controlsLayer, {
					// 	x: 660,
					// 	y: 0,
					// 	width: 80,
					// 	height: 44,
					// 	hidden: true,
					// 	events: 'click touchstart',
					// 	handler: function() {
					// 		// Show visit history
					// 		Ext.getCmp('visitHistory').show();
					// 	}
					// });

					// Add Printer button
					addImageToLayer("resources/images/icons/printer.png", controlsLayer, {
						x: 680,
						y: 20,
						width: 44,
						height: 44,
						events: 'click touchstart',
						handler: function() {

						//TODO: Rather than storing in localStorage, event should be published (pubsub)
						var printablePatientRecord = { 
							patient: myRecord.raw,
							canvasJSON: this.parent.parent.toJSON({
								x: DRAWABLE_X_MIN,
								y: DRAWABLE_Y_MIN,
								width: DRAWABLE_X_MAX - DRAWABLE_X_MIN,
								height: DRAWABLE_Y_MAX - DRAWABLE_Y_MIN
							})
						};	
						
						localStorage.setItem('printablePatientRecord',JSON.stringify(printablePatientRecord));
						//open print window
						window.open("app/view/print/patientRecordPrint.html", "Patient Record");
						}
					});
					stage.draw();
				}
 			}, 
 			structuredDataOnCanvas: function () {
 			    var visitHistoryStore = Ext.getStore('visitHistoryStore');
 			    g_visitHistoryStore = visitHistoryStore;

 			    //TODO: Show these layers on repaint.
 			    if (this.stage.get('#textLayer')[0]) {
 			        this.stage.get('#textLayer')[0].hide();
 			    }
 			    if (this.stage.get('#linesLayer')[0]) {
 			        this.stage.get('#linesLayer')[0].hide();
 			    }

 			    if (!this.stage.get('#structuredDataLayer').length) {
 			        // Layers
 			        var structuredDataLayer = new Kinetic.Layer({
 			            id: 'structuredDataLayer'
 			        });
 			        this.stage.add(structuredDataLayer);
 			    }
 			    this.stage.get('#structuredDataLayer')[0].show();
 			    //TODO: Improve UI of structured view (similar to regular canvas)
 			    var EncounterText = '';

 			    for (var i = 0; i < visitHistoryStore.data.all.length; i++) {

 			        if (visitHistoryStore.data.all[i].data.structuredData) {

 			            EncounterText += visitHistoryStore.getAt(i).data.date;

 			            structuredData = JSON.parse(visitHistoryStore.data.all[i].data.structuredData);

 			            if (Ext.getCmp('DiagnosisHistoryView').isChecked()) {

 			                DiagnosisCount = structuredData.Diagnosis.length;
 			                console.log(DiagnosisCount);

 			                for (var j = 0; j < DiagnosisCount; j++) {
 			                    EncounterText += '\n' + structuredData.Diagnosis[j].name
 			                }

 			                EncounterText += '\n\n'

 			                var DiagnosisKinecticText = new Kinetic.Text({
 			                    x: DRAWABLE_X_MIN + 80,
 			                    y: 70,
 			                    text: EncounterText,
 			                    fontSize: 13,
 			                    fontFamily: 'Helvetica',
 			                    textFill: '#000',
 			                    align: 'left',
 			                });
 			                this.stage.get('#structuredDataLayer')[0].add(DiagnosisKinecticText);
 			            }
 			        }
 			        //TODO: Drugs are not coming in encounters now, need to make it consisten
 			        // if(Ext.getCmp('DrugsHistoryView').isChecked())
 			        // {


 			        // }
 			    }
 			    this.stage.draw();
 			}
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