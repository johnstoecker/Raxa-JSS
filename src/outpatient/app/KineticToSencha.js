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
					quality: 1,
					// height: 32,
					// width: 32
				});
				// k2s.addDoctorRecordImage_TEMP_FOR_DEMO(dataUrl);
				// Delete temp layer
				temp_layer.remove();

				// Adds it to history store (list is visible in history view)
				var now = Ext.util.Format.date(Date(), 'Y.m.j - g:ia');
				var visitHistoryStore = Ext.getStore('visitHistoryStore');
				visitHistoryStore.add({
					title: 'Visit <x>',
					date: now,
					uuid: 'FAKE-UUID-PUSHED',
					diagnosisCount: 0,
					treatmentCount: 0,
					imgSrc: dataUrl,
					// id: 'PatientRecord'
				});

				// Show most recently added item, from store
				var record = visitHistoryStore.getAt(visitHistoryStore.getCount()-1)
				var me = Ext.getCmp('history-unstructured-panel');
				me.showVisitInView(record);

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
				k2s.sendDoctorOrderEncounter();
			}
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

	// <TODO: Add Comment describing>
	addDoctorRecordImage: function() {
		var PatientRecordHistory = Ext.getStore('visitHistoryStore').getData();
		for(var j = 0; j < Ext.getStore('visitHistoryStore').getData().all.length; j++) //j is always 4, but not now.
		{
			if(PatientRecordHistory.all[j].data.id == "PatientRecord") {
				//    if( PatientRecordHistory.all[j].imgSrc.length < 65000){   
				var ObsModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrderObservation', {
					obsDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
					person: myRecord.data.uuid,
					//need to set selected patient uuid in localStorage
					concept: localStorage.patientRecordImageUuidconcept,
					value: PatientRecordHistory.all[j].data.imgSrc
				});
				this.DoctorOrderModel.data.obs.push(ObsModel.raw);
				//  }
				//    else {
				//    Ext.Msg.alert('Error','Can\'t save data on server');
				//    }
			}
		}
		console.log(Ext.getStore('DoctorOrder'));
	},
	//Sending Stage JSON so that high quality doctor records can be generated again
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
	//Small icons to show as thumbnails
	addDoctorRecordImage_TEMP_FOR_DEMO: function(dataUrl) {

		var ObsModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrderObservation', {
			obsDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
			person: myRecord.data.uuid,
			//need to set selected patient uuid in localStorage
			concept: localStorage.patientRecordImageUuidconcept,
			value: dataUrl
		});
		this.DoctorOrderModel.data.obs.push(ObsModel.raw);
	},

	// Send Outpatient encounter - causes the visit to "finalize" given current workflow
	sendDoctorOrderEncounter: function() {
		this.addObs();
		this.addDoctorRecordImage();
		this.addDoctorRecordVectorImage();
		this.addOrder();

		this.DoctorOrderModel.data.patient = myRecord.data.uuid;
		this.DoctorOrderStore.add(this.DoctorOrderModel);

		//makes the post call for creating the patient
		var that = this;
		this.DoctorOrderStore.on('write', function() {
			that.initCanvasData();
		});
		this.DoctorOrderStore.sync();
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