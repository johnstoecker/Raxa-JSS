///////////////////////////////////////////////////////////
// Connection: Kinetic to Sencha
//  - bridges via firing Ext events
//	- Triggers Sencha code when tapping on Kinetic items
///////////////////////////////////////////////////////////
Ext.define('KineticToSencha', {
	mixins: ['Ext.mixin.Observable'],
	config: {
		fullName: ''
	},
	gidCounter: 0,
	DoctorOrderStore: null,
	DoctorOrderModel: null,	
	canvas: null,

	constructor: function(config) {
		this.initConfig(config); // We need to initialize the config options when the class is instantiated
	},
	addMedication: function() {
		this.fireEvent('clickAddMedication');	// firing in two places?
	},
	addDiagnosis: function() {
		this.fireEvent('clickOnDiagnosis');
	},
	saveLoadMask: function() {
		var mask = function() {
				console.log('mask off');
				Ext.getCmp('opdPatientDataEntry').setMasked(false)
			}

		console.log('mask on');
		Ext.getCmp('opdPatientDataEntry').setMasked({
			xtype: 'loadmask',
			message: 'Saving...',
			modal: true
		});

		setTimeout(mask, Util.SAVE_LOAD_MASK_MAX_WAIT_TIME);
		Ext.getCmp('opdPatientDataEntry').setMasked(false);
	},

	// Saves just "drawable" portion of canvas
	saveDrawableCanvas: function() {
		// Convert stage to image. From image, create KineticImage and crop to "drawable" portion
		
		// Disable interaction. E.g. this hides delete icons, if in erase mode. Interaction is restored below.
		var interactionMode = k2s.canvas.methods.getCanvasInteractionMode();
		k2s.canvas.methods.setCanvasInteractionMode('');
		var k2sContext = this;
		stage.toImage({
			callback: function(i) {
				i.id = "PatientRecord";
				var kineticImage = new Kinetic.Image({
					image: i,
					x: 0,
					y: 0,
					id: 'PatientRecord',
					crop: {
						x: DRAWABLE_X_MIN,
						y: DRAWABLE_Y_MIN,
						width: DRAWABLE_X_MAX - DRAWABLE_X_MIN,
						height: DRAWABLE_Y_MAX - DRAWABLE_Y_MIN
					}
				});

				// Create a temp layer and add the "screenshot" image. If it's not added to a layer,
				// or added to the stage, then Kinetic won't allow you to call toDataUrl() on it.
				var temp_layer = new Kinetic.Layer();
				temp_layer.add(kineticImage);
				stage.add(temp_layer);
				var dataUrl = kineticImage.toDataURL({
					callback: function(dataUrl) {
						console.log('callback for dataUrl');
					},
					mimeType: 'image/jpeg',
					quality: .4,
					// height: 32,
					// width: 32
				});
				
				// Delete temp layer
				temp_layer.remove();

				// Adds it to history store (list is visible in history view)
				k2sContext.addToVisitHistory({
					date: Date(),
					imgSrc: dataUrl
				});

				// Show most recently added item, from store
				// this automatically happens in the store, now

				// Scroll to history view
				var UNSTRUCTURED_HISTORY_VIEW = 0;
				Ext.getCmp('history-panel').setActiveItem(UNSTRUCTURED_HISTORY_VIEW);

				// TODO: Animation isn't showing in Chrome. On device?
				var HISTORY_OVERVIEW = 1;
				Ext.getCmp('treatment-panel').animateActiveItem(HISTORY_OVERVIEW, {
   					type: 'slide',
					direction: 'right'
				});

				// Restore prior interaction mode (e.g. adding back 'x' icons for delete)
				k2s.canvas.methods.setCanvasInteractionMode(interactionMode);

				// Save via REST
				// TODO: fix callback spaghetti code ... this callback is hidden in another callback
				// from onSaveCanvas... saveDrawableCanvas... etc
				k2s.sendDoctorOrderEncounter(dataUrl);
			}
		});
	},

	// Adds a visit to the history view
	// config should pass: date, imgSrc 
	// TODO: json, doctorname... (other metadata?)
	addToVisitHistory: function(config) {
		var visitHistoryStore = Ext.getStore('visitHistoryStore');
		visitHistoryStore.add({
			// title: 'Visit <x>',
			date: Ext.util.Format.date(config.date, 'Y.m.j - g:ia'),
			// doctorName: '',
			// uuid: 'FAKE-UUID-PUSHED',
			// diagnosisCount: 0,
			// treatmentCount: 0,
			imgSrc: config.imgSrc,
			// json: config.json
		});
	},

	// <TODO: Add Comment describing>
	addOrder: function() {
		//set persist of order true as Doctor may not always have a order
		RaxaEmr.Outpatient.model.DoctorOrder.getFields().items[6].persist = true; //6th field in orders (sorted)
		// RaxaEmr.Outpatient.model.DoctorOrder.getFields().get('orders').setPersist(true); //6th field in orders (sorted)
		var drugPanel = Ext.getStore('drugpanel');

		lengthOfDrugOrder = Ext.getStore('drugpanel').getData().all.length;

		for(var i = 0; i < lengthOfDrugOrder; i++) {
			var drugPanel = Ext.getStore('drugpanel').getData().all[i].data;

			//Drug Orders here
			var OrderModel = Ext.create('RaxaEmr.Outpatient.model.drugOrder', {
				type: 'drugorder',
				patient: myRecord.data.uuid,
				concept: drugPanel.concept,
				drug: drugPanel.uuid,
				startDate: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
				autoExpireDate: Util.Datetime(new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() + drugPanel.duration), Util.getUTCGMTdiff()),
				instructions: drugPanel.routeofadministration,
				quantity: drugPanel.duration,
				//TODO Figure out why dose is creating problem while sending
				//dose: drugPanel.frequency,
				//Pharmacy is using dose. Remove inconsistency
				frequency: drugPanel.frequency,
				orderer: localStorage.loggedInUser
			});
			this.DoctorOrderModel.data.orders.push(OrderModel.raw);
		}
	},

	// <TODO: Add Comment describing>
	addObs: function() {
		//TODO set persit TRUE if first order 
		// RaxaEmr.Outpatient.model.DoctorOrder.getFields().items[5].persist= true; //5th field in obs (sorted)
		//TODO set persist FALSE if no item in list
		this.DoctorOrderModel.data.obs = [];
		lengthOfDiagnosis = Ext.getCmp('diagnosedList').getStore().data.length;
		for(var i = 0; i < lengthOfDiagnosis; i++) {
			console.log(Ext.getCmp('diagnosedList').getStore().data.all[i].data);
			var ObsModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrderObservation', {
				obsDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
				person: myRecord.data.uuid,
				//need to set selected patient uuid in localStuiorage
				concept: Ext.getCmp('diagnosedList').getStore().data.all[i].data.id,
				//      value: Ext.getCmp('diagnosedList').getStore().data.all[i].data.complain
			});
			this.DoctorOrderModel.data.obs.push(ObsModel.raw);
			// console.log(ObsModel);
		}
		console.log(this.DoctorOrderModel);
	},

	// Saves the dataURL for the image (actual jpg graphic)
	// Currently, saves data in full size, but someday may only create a thumbnail
	// Note: OpenMRS REST calls are restricted to max size < ~70kb, by default, so 
	// can't attach a large image
	addDoctorRecordImage: function(dataUrl) {
		var ObsModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrderObservation', {
			obsDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
			person: myRecord.data.uuid,
			//need to set selected patient uuid in localStorage
			concept: localStorage.patientRecordImageUuidconcept,
			value: dataUrl
		});
		this.DoctorOrderModel.data.obs.push(ObsModel.raw);
	},

	// Sending Stage JSON so that high quality doctor records can be generated again
	// Idea: also allow stage to flexibly update (e.g. to show current status/results for a lab test)
	addDoctorRecordVectorImage: function() {
		var ObsModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrderObservation', {
			obsDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
			person: myRecord.data.uuid,
			//need to set selected patient uuid in localStorage
			concept: localStorage.patientRecordVectorImageUuidconcept,
			value: stage.toJSON()
		});
		this.DoctorOrderModel.data.obs.push(ObsModel.raw);
	},

	// Send Outpatient encounter - causes the visit to "finalize" given current workflow
	sendDoctorOrderEncounter: function(dataUrl) {
		this.addObs();
		// TODO: these are currently two special cases of Obs. can streamline to just the addObs fn
		this.addDoctorRecordImage(dataUrl);
		// this.addDoctorRecordVectorImage();

		this.addOrder();

		this.DoctorOrderModel.data.patient = myRecord.data.uuid;
		this.DoctorOrderStore.add(this.DoctorOrderModel);

		//makes the post call for creating the patient
		var that = this;

		// this.DoctorOrderStore.on('write', function() {
		// 	// Reset the "today" canvas after saving the visit
		// 	that.initCanvasData();
		// });
		this.DoctorOrderStore.sync();

		// TODO: Moving this outside of the 'write' callback. It will now happen immediately after the REST call
		// 	Danger-- if the REST call fails, we've lost all the data we need to construct it!
		//	We'll need a better scheme for caching this data in the future and doing repeated sync attempts...
		//
		// Another option -- could add a mask to the main "input" UI before REST call, and remove mask after REST call. however,
		// 	this doesn't fix the fundamental problem that the rest call might fail
		// The other issue is that you cannot really clear the view (and allow user input) without clearing the stores too
		//	because the stores' data is tied to the view (e.g. diagnoses shown in the UI are being submitted in the backend).
		//	So if we just clear the canvas and allow the user to start drawing again, they may be confused when the stores
		// 	behave unexpectedly. 
		// 	...
		//	Design discussion needed. let's solve this in a robust way that accounts for possibility of validation
		//  or syncing/network errors.
		that.initCanvasData();
	},

	// This function clears the canvas (UI) and resets all the models/stores which are tied ot the UI
	initCanvasData: function() {
		// Empty the stores which are used to send the data
		this.DoctorOrderStore = Ext.create('RaxaEmr.Outpatient.store.DoctorOrder');
		this.DoctorOrderModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrder', {
			//uuid:      //need to get myRecord variable of patientlist accessible here, so made it global variable
			//may need to set it later if new patient is created using DoctorOrder view (currently view/patient/draw.js)
			//other way is to create method in Controller which returns myRecord.data.uuid
			encounterType: localStorage.outUuidencountertype,
			// TODO figure out if should be prescription fill ?
			encounterDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
			//Should encounterDatetime be time encounter starts or ends?
			provider: localStorage.loggedInUser
		});

		this.DoctorOrderModel.data.obs = [];
		this.DoctorOrderModel.data.orders = [];

		// Reset stores for diagnoses and treatments
		Ext.getStore('diagnosedDisease').clearData();
		Ext.getStore('drugpanel').clearData();
		
		// Reset the print object 
		// TODO: put print counts inside of the print Object, rather than separate floating vars
		PrintObject = new PrintToCanvas();
		PrintObject.DiagnosisPrinted = 0;
		PrintObject.MedicationPrinted = 0;

		// TODO: Move this method to the kineticJS stage instead of calling global stage object
		function eraseDrawableLayers() {
			// Reset high Y
			highY = DEFAULT_HIGH_Y;

			// Clear user inputted layers from stage
			var layers = stage.getChildren();
			for (var index=0; index < layers.length; index++) {
				var layerId = layers[index].attrs.id;
				if (layerId == 'linesLayer' || layerId == 'textLayer' || layerId == 'tempControlsLayer') {
					layers[index].removeChildren();
				}
			}
			stage.draw();
		}

		eraseDrawableLayers();
	}
});