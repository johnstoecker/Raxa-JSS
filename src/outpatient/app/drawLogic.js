//////////////////////////////////////////////////////////////////////////////
// Print Class
//  - Keep track of items to be displayed and saved on persist of the JSON
//////////////////////////////////////////////////////////////////////////////
function PrintClass() {
	// Constructor
}

PrintClass.prototype = {
	TextGroupProperty: new Object(),
	TextArray: new Array(new TextProperty()),
}

PrintClass.prototype.TextGroupProperty = {
	type: null,
	storeId: null,
	gid: null
}

PrintClass.prototype.Status = {
	DiagnosisPrinted: 0,
	MedicationPrinted: 0,
}

function TextProperty(text, uuid) {
	this.text = text;
	this.uuid = uuid;
}

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
		stage.toImage({
			callback: function(i) {
				i.id = "PatientRecord";
				var kineticImage = new Kinetic.Image({
					image: i,
					x: 0,
					y: 0,
					id: 'PatientRecord',
					crop: {
						x: kineticCanvas.DRAWABLE_X_MIN,
						y: kineticCanvas.DRAWABLE_Y_MIN,
						width: kineticCanvas.DRAWABLE_X_MAX - kineticCanvas.DRAWABLE_X_MIN,
						height: DRAWABLE_Y_MAX - kineticCanvas.DRAWABLE_Y_MIN
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
			DoctorOrderModel.data.orders.push(OrderModel.raw);
		}
	},

	// <TODO: Add Comment describing>
	addObs: function() {
		//TODO set persit TRUE if first order 
		// RaxaEmr.Outpatient.model.DoctorOrder.getFields().items[5].persist= true; //5th field in obs (sorted)
		//TODO set persist FALSE if no item in list
		DoctorOrderModel.data.obs = [];
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
			DoctorOrderModel.data.obs.push(ObsModel.raw);
			// console.log(ObsModel);
		}
		console.log(DoctorOrderModel);
	},

	// <TODO: Add Comment describing>
	addDoctorRecordImage: function() {
		// TODO UNABLE TO access ControlsLayer here
		// children till 7 are already there and rest goes into 
		// console.log(controlsLayer.children[8].attrs.image.src)
		// DoctorOrderModel.data.obs = [];
		//    (document.getElementById('id-of-doctor-form').src)
		//TODO check all objects of canvas which are saved and then push it as obs 
		// OR store an array of image which can be sent
		//set Image in obs json
		console.log('checking patient records in stage and copying to DoctorOrder store');

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
				DoctorOrderModel.data.obs.push(ObsModel.raw);
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
		DoctorOrderModel.data.obs.push(ObsModel.raw);
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
		DoctorOrderModel.data.obs.push(ObsModel.raw);
	},

	// <Comment describing>
	sendDoctorOrderEncounter: function() {
		this.addObs();
		this.addDoctorRecordImage();
		this.addDoctorRecordVectorImage();
		this.addOrder();

		DoctorOrderModel.data.patient = myRecord.data.uuid;
		DoctorOrderStore.add(DoctorOrderModel);

		//makes the post call for creating the patient
		var that = this;
		DoctorOrderStore.on('write', function() {
			console.log('doctor order store on WRITE event');
			that.initCanvasData();
		});
		DoctorOrderStore.sync();
	},

	// This function clears the canvas (UI) and resets all the models/stores which are tied ot the UI
	initCanvasData: function() {
		// Empty the stores which are used to send the data
		DoctorOrderStore = Ext.create('RaxaEmr.Outpatient.store.DoctorOrder');
		DoctorOrderModel = Ext.create('RaxaEmr.Outpatient.model.DoctorOrder', {
			//uuid:      //need to get myRecord variable of patientlist accessible here, so made it global variable
			//may need to set it later if new patient is created using DoctorOrder view (currently view/patient/draw.js)
			//other way is to create method in Controller which returns myRecord.data.uuid
			encounterType: localStorage.outUuidencountertype,
			// TODO figure out if should be prescription fill ?
			encounterDatetime: Util.Datetime(new Date(), Util.getUTCGMTdiff()),
			//Should encounterDatetime be time encounter starts or ends?
			provider: localStorage.loggedInUser
		});

		DoctorOrderModel.data.obs = [];
		DoctorOrderModel.data.orders = [];

		// Reset stores for diagnoses and treatments
		Ext.getStore('diagnosedDisease').clearData();
		Ext.getStore('drugpanel').clearData();
		
		// Reset the print object 
		// TODO: put print counts inside of the print Object, rather than separate floating vars
		PrintObject = new PrintClass();
		PrintObject.DiagnosisPrinted = 0;
		PrintObject.MedicationPrinted = 0;

		// Reset high Y
		highY = kineticCanvas.DEFAULT_HIGH_Y;

		// Clear layers on stage
		// TODO: Get layer by id rather than by index (see 'resources/images/button_New_off.png' code)
		stage.getChildren()[1].getChildren().splice(0, stage.getChildren()[1].getChildren().length);
		stage.getChildren()[2].getChildren().splice(0, stage.getChildren()[2].getChildren().length);
		//remove only specific children on controlLayer (X on textboxes)
		var CONTROL_LAYER = 3;
		var NUMBER_OF_VALID_CONTROL_BUTTONS = 7;
		// TODO: create a new layer for delete buttons to simplify this logic
		stage.getChildren()[CONTROL_LAYER].getChildren().splice(7, stage.getChildren()[CONTROL_LAYER].getChildren().length - NUMBER_OF_VALID_CONTROL_BUTTONS);
		stage.draw();
	}
});

// Instance of k2s to listen for events from canvas
var k2s = Ext.create('KineticToSencha', {
	id: 'k2s',
	listeners: {
		resetCanvas: function() {
			console.log('resetCanvas()');
			this.initCanvasData();
		},
		clickAddMedication: function() { // This function will be called when the 'quit' event is fired
			// By default, "this" will be the object that fired the event.
			console.log("k2s: clickAddMedication");
			var displayText = new String();
			var store = Ext.getStore('drugpanel');
			var data = store.getData();
			var itemCount = data.getCount();

			PrintObject.TextGroupProperty.type = 'DrugOrder';
			PrintObject.TextGroupProperty.storeId = 'drugpanel';
			PrintObject.TextGroupProperty.gid = this.gidCounter++;
			PrintObject.TextArray.splice(0, PrintObject.TextArray.length)

			for(var i = PrintObject.MedicationPrinted, index = 0; i < itemCount; i++, index++) {
				var itemData = data.getAt(i).getData();

				displayText = '';
				// TODO: Consolidate following code into loop
				if(!itemData.drugname) {
					// If no drug name, skip to next loop iteration
					continue;
				} else {
					displayText = (itemData.drugname + ' - ');
				}

				// Print all the details of the drug prescription
				var detailTypes = ["strength", "frequency", "instruction", "duration"]
				for (var j=0; j< detailTypes.length; j++) {
					var details = itemData[detailTypes[j]];
					if(details) {
						displayText += (' ' + details);
						if (detailTypes[j] == "duration") {
							displayText += ' days';
						}
					}
				}

				PrintObject.MedicationPrinted++;
				var textForPrintObject = new TextProperty(displayText, itemData.uuid);
				PrintObject.TextArray.push(textForPrintObject);
			}

			Ext.getCmp('drugForm').setHidden(false);
			Ext.getCmp('drugaddform').reset();
		},

		clickOnDiagnosis: function() { // This function will be called when the 'quit' event is fired
			console.log("k2s: clickOnDiagnosis");
			// Print store. I'll have to pull info from this to print in Canvas
			var displayText = [];
			var store = Ext.getStore('diagnosedDisease');
			var data = store.getData();
			var itemCount = data.getCount();
			console.log('itemcount= ' + itemCount);
			console.log('Diagnosis Printed=' + PrintObject.DiagnosisPrinted);
			PrintObject.TextGroupProperty.type = 'Diagnosis';
			PrintObject.TextGroupProperty.storeId = 'diagnosedDisease';
			PrintObject.TextGroupProperty.gid = this.gidCounter++;

			PrintObject.TextArray.splice(0, PrintObject.TextArray.length)

			for(var i = PrintObject.DiagnosisPrinted, index = 0; i < itemCount; i++, index++) {
				var itemData = data.getAt(i).getData();
				console.log(itemData);
				console.log('index=' + index + ' i= ' + i);
				displayText[index] = (itemData.complain);
				PrintObject.DiagnosisPrinted++;
				var textForPrintObject = new TextProperty(itemData.complain, itemData.id);
				PrintObject.TextArray.push(textForPrintObject);
			}
			console.log(PrintObject);

			// TODO: Trigger refresh of Kinetic UI ... drug list should be updated
			Ext.getCmp('diagnosis-panel').setHidden(false);
			//      Ext.getCmp('drugaddform').reset();
			//      Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD);
		}
	}
});


///////////////////////////////////////////////////////////
// Kinetic JS, drawing Canvas
///////////////////////////////////////////////////////////

// Globals / Constants
var kineticCanvas = {
	DRAWABLE_X_MIN : 60,	
	DRAWABLE_X_MAX : 680, // 708 - strict border = 700 ... minus the "Today" text
	DIFF : 144, // moving whole thing up a bit ... 1024 - 880 = 144
	DRAWABLE_Y_MIN : 200 - this.DIFF, // 230 - strict border 
	DEFAULT_HIGH_Y : this.DRAWABLE_Y_MIN + 15,
};

var PrintObject;
var stage = new Object;	// TODO: Remove if unneeded
// var imageCount = 0;

// var kineticCanvas.DRAWABLE_X_MIN = 60;
// var kineticCanvas.DRAWABLE_X_MAX = 680; // 708 - strict border = 700 ... minus the "Today" text
// var DIFF = 144; // moving whole thing up a bit ... 1024 - 880 = 144
// var kineticCanvas.DRAWABLE_Y_MIN = 200 - DIFF; // 230 - strict border 
// var kineticCanvas.DEFAULT_HIGH_Y = kineticCanvas.DRAWABLE_Y_MIN + 15;

// Keep track of the current low and high bounds (y-axis) for where a user
// has already added content onto the canvas. The idea is that we want to add
// structured data (diagnoses, prescriptions, ...) into blank areas on the 
// canvas where the user hasn't yet written.
var highY = kineticCanvas.DEFAULT_HIGH_Y;	// Not a constant

var DRAWABLE_Y_MAX = 1024;
var DEFAULT_MODE = "draw"; // undefined
var STAGE_X = 768; //768
var STAGE_Y = 1024; //1024
var HISTORY_BASE_X = kineticCanvas.DRAWABLE_X_MAX;
var HISTORY_BASE_Y = kineticCanvas.DRAWABLE_Y_MIN + 196;
var HISTORY_ITEM_DIM = 64;

var CONTROL_BASE_X = 2;
var CONTROL_BASE_Y = 2;
var CONTROL_ITEM_SPACING = 3;
var CONTROL_ITEM_DIM = 50;
var TOOLBAR_ITEM_DIM = 44;
var TOOLBAR_ITEM_BASE_X = 4;
var TOOLBAR_ITEM_BASE_Y = 1;
var TOOLBAR_HEIGHT = 46;

var HIGH_Y_OFFSET = 10; // a little extra space

function isInDrawableArea(myX, myY) {
	up = {
		x: myX,
		y: myY
	};

	if((kineticCanvas.DRAWABLE_X_MIN <= up.x && up.x <= kineticCanvas.DRAWABLE_X_MAX) && (kineticCanvas.DRAWABLE_Y_MIN <= up.y && up.y <= DRAWABLE_Y_MAX)) {
		return true;
	} else {
		// console.log("not in drawable area: ", up.x, up.y );  
		return false;
	}
}

// TODO: Remove from global scope
// 	This is being used in Unstructured.js view
function addImageToLayer(file, layer, config) {
	var imgObj = new Image();
	imgObj.onload = function() {
		config.image = imgObj;
		var kineticImage = new Kinetic.Image(config);
		layer.add(kineticImage);
		layer.draw();
	}
	imgObj.src = file;
}

var setupCanvas = function() {

	// attach variables and functions that need to be accessed from outside canvas
	// return this at end of setupCanvas
	var drawLogic;	
	
	var NO_CONTROL_GROUP = 'noControlGroup';

		var lowY = kineticCanvas.DRAWABLE_Y_MIN;

		var newLine;
		var newLinePoints = [];
		var prevPos;
		
		var mode = DEFAULT_MODE;		
		var historyYOffset = HISTORY_BASE_Y;

		var backgroundLayer = new Kinetic.Layer({
			id: 'backgroundLayer'
		});
		var linesLayer = new Kinetic.Layer({
			id: 'linesLayer'
		});
		var textLayer = new Kinetic.Layer({
			id: 'textLayer'
		});
		var controlsLayer = new Kinetic.Layer({
			id: 'controlsLayer'
		});
		var tempControlsLayer = new Kinetic.Layer({
			id: 'tempControlsLayer'
		});


		// Setup stage, upon which all layers are built.
		stage = new Kinetic.Stage({
			id: "stage",
			container: "container",
			width: STAGE_X,
			height: STAGE_Y
		});

		// Layers
		stage.add(backgroundLayer);
		stage.add(linesLayer);
		stage.add(textLayer); // in front of "draw" layer, i.e. cant draw on a diagnosis. for now.
		stage.add(controlsLayer);
		stage.add(tempControlsLayer);
		moving = false;

		////////////////////////
		// Event Listeners 
		////////////////////////
		stage.on("mousedown touchstart", function() {
			dragStart();
		});
		stage.on('mousemove touchmove', function() {
			dragMove();
		});
		stage.on("mouseup touchend", function() {
			dragComplete();
		});
		stage.on("paintDiagnosis", function() {
			k2s.fireEvent('clickOnDiagnosis');
			Ext.getCmp('diagnosis-panel').hide();
			drawTextAtLowPoint(PrintObject);
		});
		stage.on("paintMedication", function() {
			k2s.fireEvent('clickAddMedication');
			Ext.getCmp('drugForm').hide();
			drawTextAtLowPoint(PrintObject);
		});

		////////////////////////
		// Event Handlers
		////////////////////////
		// First touch or click starts a drag event
		function dragStart() {
			var up = stage.getUserPosition();

			if(!up || !isInDrawableArea(up.x, up.y) || mode !== 'draw') {
				return;
			}

			if(moving) {
				moving = false;
				backgroundLayer.draw();
			} else {
				newLinePoints = [];
				prevPos = up;	// Mouse or touch
				// prevPos = stage.getUserPosition(); // Mouse or touch
				newLinePoints.push(prevPos);
				newLine = new Kinetic.Line({
					points: newLinePoints,
					stroke: "black"
				});
				linesLayer.add(newLine);
				moving = true;
			}
		}

		// While user holding down the mouse clicker or touch, continue dragging
		function dragMove() {
			var up = stage.getUserPosition();

			// to draw, draw must be in progress
			if(!moving || !up || mode !== 'draw') {
				return;
			}

			// If draw in progress (moving == true) and go outside of DrawableArea, then complete the draw
			if (moving && !isInDrawableArea(up.x, up.y)) {
				dragComplete();
			}

			if(moving) {
				var mousePos = stage.getUserPosition(); // Mouse or touch
				newLinePoints.push(mousePos);
				var y = mousePos.y;
				if(y > highY) {
					highY = y + HIGH_Y_OFFSET;
				}
				prevPos = mousePos;

				linesLayer.drawScene();
			}
		}

		// On release of mouse or touch, done dragging
		// Note: this also is called when the use drags outside of the canvas's drawable area
		function dragComplete() {
			var up = stage.getUserPosition();
			if(!up || mode !== 'draw' || !moving) {
				return;
			}

			console.log('drag complete');
			
			// Draw complete. Add erase event listener on the newline.
			var currentLine = newLine;
			newLine.on('mouseover touchmove', function() {
				if (mode == "erase") {
					var children = linesLayer.getChildren();
					var index = children.indexOf(currentLine);
					children.splice(index,1)
					linesLayer.draw();
				}
			});

			stage.draw();

			moving = false;
		}

		// SAVING 
		// Save - event handler

		function onSaveCanvas() {
			// Callback, since the stage toDataURL() method is asynchronous, 
			k2s.saveDrawableCanvas();
			// k2s.saveLoadMask();
		}

		////////////////////////////////////////////////
		// Initialize
		//  - Draw background
		//  - Add Controls... Pencil, eraser, save
		////////////////////////////////////////////////
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
			// height: kineticCanvas.DRAWABLE_Y_MIN - 4,
			height: TOOLBAR_HEIGHT,
			fill: "#82b0e1" // Light Blue.
		});
		backgroundLayer.add(toolbarBackground);

		addImageToLayer("resources/images/bg/TODAY_710.png", backgroundLayer, {
			x: 0,
			y: kineticCanvas.DRAWABLE_Y_MIN,
			width: 710,
			height: 835,
		});

		addImageToLayer("resources/images/bg/HISTORY_35.png", backgroundLayer, {
			x: stage.getWidth() - 36,
			y: kineticCanvas.DRAWABLE_Y_MIN,
			width: 35,
			height: 835
		});

		var controlItems = [{
			// Pencil (Draw mode)
			image: 'resources/images/icons/pen_off.png',
			imageWhenToggledOn: 'resources/images/icons/pen_on.png',
			x: TOOLBAR_ITEM_BASE_X,
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			controlGroup : 'drawingInput',
			handler: function() {
				console.log('mode = draw');
				mode = "draw";
			}
		}, {
			// Eraser (Erase mode)
			// TODO: Support toggleable image state
			image: 'resources/images/icons/eraser_off.png',
			imageWhenToggledOn: 'resources/images/icons/eraser_on.png',
			x: TOOLBAR_ITEM_BASE_X + 1 * (TOOLBAR_ITEM_DIM),
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			controlGroup : 'drawingInput',
			handler: function() {
				console.log('mode = erase');
				mode = "erase";
			}
		}, {
			// Keyboard (typed text input)
			image: 'resources/images/icons/text_off.png',
			imageWhenToggledOn: 'resources/images/icons/text_on.png',
			x: TOOLBAR_ITEM_BASE_X + 2 * (TOOLBAR_ITEM_DIM),
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			controlGroup : 'drawingInput',
			handler: function() {
				console.log('KEYBOARD: TODO');
				// mode = "keyboard";
			}
		}, {
			// New
			image: 'resources/images/button_New_off.png',
			x: stage.getWidth() - 120 - 58 - 80,
			y: TOOLBAR_ITEM_BASE_Y,
			// width: 80,
			// height: 44,
			handler: function() {
				console.log('tapped new button');
				// TODO: Clear the canvas - for demo only
				Ext.Msg.confirm('New', 'Erase current visit (without saving)?', function(btn) {
					if(btn == 'yes') {
						k2s.fireEvent('resetCanvas');
					}
				});
			},
		}, {
			// Sends OPD Encounter
			image: 'resources/images/button_Finalize_off.png',
			x: stage.getWidth() - 120 - 58,
			y: TOOLBAR_ITEM_BASE_Y,
			// width: 120,
			// height: 44
			handler: function() {
				console.log('sending Doctor Encounter');
				Ext.Msg.confirm('Finalize', 'Save and complete this visit?', function(btn) {
					if(btn == 'yes') {
						// TODO: Saved image is wrong resolution
						
						// Saves image to localStore
						// Scrolls directly to see the history item in history view
						// Also saves via REST using k2s.sendDoctorOrderEncounter();
						// Clear "today" canvas, after saving via REST
						onSaveCanvas();
					}
				});
			},
		}, {
			// Add diagnosis
			image: 'resources/images/icons/add_D_off.png',
			x: kineticCanvas.DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
			y: CONTROL_BASE_Y + 3 * (CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING),
			width: 50,
			height: 49,
			handler: function() {
				console.log("Bringing diagnoses modal window.")
				onClickDiagnosis();
			}
		}, {
			// Add medication
			image: 'resources/images/icons/add_drug_off.png',
			x: kineticCanvas.DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
			y: CONTROL_BASE_Y + 4 * (CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING),
			width: 50,
			height: 49,
			handler: function() {
				onClickMedication();
			}
		// }, {
		// 	// Add investigation
		// 	image: 'resources/images/icons/add_investigation_off.png',
		// 	x: kineticCanvas.DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
		// 	y: CONTROL_BASE_Y + 5 * (CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING),
		// 	width: 50,
		// 	height: 49,
		// 	handler: function() {
		// 		console.log('INVESTIGATIONS: TODO');
		// 	}
		}];

		// Creates a 'clickable' item with a touch handler.
		// requires parameters for item: x,y,width,height,src,handler

		var	controlGroups = {};
		function createControlItem(item) {
			var imageObj = new Image();
			imageObj.onload = function() {
				// Add all items to a controlGroup
				var cg = item.controlGroup || NO_CONTROL_GROUP;

				var box = new Kinetic.Image({
					gid: item.gid,
					storeId: item.storeId,
					
					// Needed to toggle images in a group of icons
					controlGroup: cg,
					imageWhenToggledOn: item.imageWhenToggledOn,
					
					x: item.x,
					y: item.y,
					width: item.width,
					height: item.height,
					image: imageObj,

					imageOff: imageObj,
					imageOn: null,
				});
				box.on('click touchstart', function() {
					item.handler(box);

					// Update UI to show 1 item in the group being pressed
					// must have an attr 'imageWhenToggledOn'
					if(cg != NO_CONTROL_GROUP && box.attrs.imageWhenToggledOn) {
						toggleItemInControlGroup(box);
					}
				});

				// Add to control group. Create group if dne yet
				if( ! controlGroups.hasOwnProperty(cg)) {
					controlGroups[cg] = [];
				} 
				controlGroups[cg].push(box);
			
				if(item.layer == 'tempControlsLayer') {
					tempControlsLayer.add(box);
					tempControlsLayer.draw();
				} else {
					controlsLayer.add(box);
					controlsLayer.draw();	
				}
				
			}
			imageObj.src = item.image;
		}

		for(var i = 0; i < controlItems.length; i++) {
			createControlItem(controlItems[i]);
		}

		function toggleItemInControlGroup(item) {
			// Toggle "off" all items in Group 
			var cg = item.attrs.controlGroup;
			for (var i = 0; i < controlGroups[cg].length; i++) {
				var box = controlGroups[cg][i];
				box.setImage(box.attrs.imageOff);
			}
			
			// Toggle "on" selected item
			// requires controlItem to have an attribute called imageWhenToggledOn
			// Notes: doesn't make a new image each time. just creates it once and then re-uses
			// TODO: Initialize images once and always use those, rather than initalizing on the fly
			if (item.attrs.imageOn) {
				item.setImage(item.attrs.imageOn);
				controlsLayer.draw();
			} else {
				var file = item.attrs.imageWhenToggledOn;
				var imgObj = new Image();	
				imgObj.onload = function() {
					item.setImage(imgObj);
					item.attrs.imageOn = imgObj;
					controlsLayer.draw();
				}
				imgObj.src= file;
			}
		}

		//
		// Handlers
		//

		function onClickDiagnosis() {
			k2s.addDiagnosis();
		}

		function onClickMedication() {
			k2s.addMedication();
		}

		function drawTextAtLowPoint(PrintObject) {
			// If nothing to print, skip
			if(! PrintObject.TextArray.length) {
				return;
			}

			var type = PrintObject.TextGroupProperty.type;
			var storeId = PrintObject.TextGroupProperty.storeId;
			var gid = PrintObject.TextGroupProperty.gid;
			var TextArray = PrintObject.TextArray;

			// Bullet icon is based on type of text to be printed	
			var bullet_icon_link = '';
			switch(type) {
				case 'Diagnosis':
					bullet_icon_link = 'resources/images/icons/bullet_diagnosis.png';
					break;
				case 'DrugOrder':
					bullet_icon_link = 'resources/images/icons/bullet_drug.png';
					break;
				case 'LabOrder':
					bullet_icon_link = 'resources/images/icons/bullet_investigation.png';
					break;
			}

			// Draw bullet icons and text
			var myHighY = highY;
			addImageToLayer(bullet_icon_link, textLayer, {
				gid: gid,
				x: kineticCanvas.DRAWABLE_X_MIN + 20,
				y: myHighY,
				width: 14,
				height: 14
			});
			for(var i = 0; i < TextArray.length; i++) {
				var complexText = new Kinetic.Text({
					gid: gid,
					storeId: storeId,
					storeUuid: TextArray[i].uuid,
					x: kineticCanvas.DRAWABLE_X_MIN + 20 + 20,
					y: highY,
					text: TextArray[i].text,
					fontSize: 11,
					fontFamily: 'Helvetica',
					textFill: '#000',
					align: 'left',
				});
				textLayer.add(complexText);
				highY += ((complexText.textHeight * (complexText.textArr.length + 1))); // length + title + space
				
				// Hook to show a demo for decision support. For now, we just have example for sinusitus.
				if(TextArray[i].text === "Sinusitis") {
					var SuggestDrugOrder = true;
				}
			}

			// Add "delete" button
			// Note, this creates item on tempControlLayer, not text layer
			createControlItem({
				layer: 'tempControlsLayer',
				gid: gid,
				image: "resources/images/icons/delete_bigger.png",
				x: kineticCanvas.DRAWABLE_X_MAX - 140,
				y: myHighY,
				width: 32,
				height: 32,
				handler: function() {
					Ext.Msg.confirm('Delete', 'Are you sure?', function(btn) {
						if(btn == 'yes') {
							var gidToBeDeleted = this.gid;
							console.log('Deleting objects with gid= ' + gidToBeDeleted);

							// Step 1 : Get Layers
							var layersToSearch = [textLayer, tempControlsLayer];
							for(var i = 0; i < layersToSearch.length; i++) {		
								var childrenToRemove = [];
								for(var j = 0; j < layersToSearch[i].getChildren().length; j++) {							
									//Step 2 : Select Children with help of group id and delete those chidren
									var child = layersToSearch[i].getChildren()[j];
									if(child.attrs.gid === gidToBeDeleted) {
										childrenToRemove.push(child);

										//Step 3 : Search & Delete related item from store from Store
										//Checks if this item has any storeId & storeUuid linked
										if(child.attrs.storeId && child.attrs.storeUuid) {
											storeToBeDeleted = Ext.getStore(child.attrs.storeId);
											var SearchKey = child.attrs.storeUuid;
											var SearchOnId = '';
											switch(child.attrs.storeId) {
											case 'diagnosedDisease':
												SearchOnId = 'id'; //Can change mapping of all stores to remove this switch case
												break;
											case 'drugpanel':
												SearchOnId = 'uuid';
												break;
											case 'LabOrder':
												SearchOnId = 'uuid';
												break;
											}
											//Remove item from relevant store
											storeToBeDeleted.removeAt(storeToBeDeleted.findExact(SearchOnId, SearchKey));

											//KNOWN BUG : After Diagnosis is deleted from diagnosed list, they are not coming back to diagnosis list.
											//TODO: Put back in list of Diagnosis (they are removed from diagnosis list while inserting into diagnosis list);
											//Doctor can re search already diagnosed disease and select, though that will not effect anything
											if(child.attrs.storeId === 'diagnosedDisease') {
												// var diagnosedList = Ext.getCmp('diagnosisList');
												// diagnosedList.getStore().add({
												//     complain: child.attrs.text,
												//     id: child.attrs.storeUuid,
												// });

												// TODO: Global!! namespace this var, perhaps put this var in K2S
												--PrintObject.DiagnosisPrinted;
											}

											if(child.attrs.storeId === 'drugpanel') {
												// TODO: Global!! namespace this var, perhaps put this var in K2S
												--PrintObject.MedicationPrinted;
											}
										}
									}		
								}

								for (var k=0; k<childrenToRemove.length; k++) {
									var children = layersToSearch[i].getChildren();
									var index = children.indexOf(childrenToRemove[k]);
									children.splice(index, 1);
								}

								//Refreshes stage to show changes
								layersToSearch[i].draw();
							}
						}
					}, this);					
				}
			});

			var handDrawnLineY = highY; // + 20*(text.length-1);
			addImageToLayer("resources/images/icons/line.png", textLayer, {
				gid: gid,
				x: kineticCanvas.DRAWABLE_X_MIN + 20,
				y: handDrawnLineY,
				width: 529,
				height: 9
			});

			// += the height of the "hand drawn line" + "additional spacing"
			highY += (10 + 5);

			stage.draw();

			//FOR DEMO UI OF DECISION SUPPORT
			if(SuggestDrugOrder) {
				Ext.Msg.defaultAllowedConfig.maxHeight = 300;
				Ext.Msg.defaultAllowedConfig.maxWidth = 400;

				Ext.Msg.confirm('Raxa Decision Support', 
					'For <font size="3" color="green"><b>Sinusitis</b></font>, decision support suggests: <br /><br /> ' + '<font size="3" color="red"><b>Mometasone 200 μg twice daily (with meals) for 15 days </b></font> <br /> <br /> Do you wish to accept this suggestion?', 
					function(btn) {
					if(btn == 'yes') {
						Ext.getStore('drugpanel').add({
							concept: "80049AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
							drugname: "Mometasone",
							duration: "15",
							frequency: "Twice Daily",
							id: "ext-record-1733",
							instruction: "With Meals",
							routeofadministration: "TABLET",
							strength: "200",
							uuid: "a427c23f-7b85-4473-afa4-b8867e9733cf"
						});
						stage.fire('paintMedication');
					}
				}).setSize(400, 300);
			}
		}

		return stage;
	};
