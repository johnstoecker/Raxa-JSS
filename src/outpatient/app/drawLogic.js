// TODO: Unwind this spaghetti code. 
// Move controlling logic somewhere else, just fire events and listen to updates in view
// ///////////////////////////////////////////////////////////
// Connection: Kinetic to Sencha
//  - bridges via firing Ext events
///////////////////////////////////////////////////////////
// Allows us to throw Ext events, triggering Sencha code when tapping on Kinetic items
var SAVE_LOAD_MASK_MAX_WAIT_TIME = 1000;
Ext.define('KineticToSencha', {
	mixins: ['Ext.mixin.Observable'],
	id: 'k2s',
	config: {
		fullName: ''
	},
	constructor: function(config) {
		this.initConfig(config); // We need to initialize the config options when the class is instantiated
	},
	addMedication: function() {
		this.fireEvent('clickAddMedication');
	},
	clickDiagnosis: function() {
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

		setTimeout(mask, SAVE_LOAD_MASK_MAX_WAIT_TIME);
		Ext.getCmp('opdPatientDataEntry').setMasked(false);
	},

	// Saves just "drawable" portion of canvas
	saveDrawableCanvas: function() {
		// Convert stage to image. From image, create KineticImage and crop to "drawable" portion
		stage.toImage({
			callback: function(i) {
				i.id = "PatientRecord";
				kineticImage = new Kinetic.Image({
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
				// k2s.config.addDoctorRecordImage_TEMP_FOR_DEMO(dataUrl);
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
			}
		});
	}
});

// TODO: take these out of global scope
var g_medication_list = [];
var g_diagnosis_list = [];

function PrintClass() {
	//This function is same as a constructor
	//alert("Print Class");
}

PrintClass.prototype = {
	PrintText: function() {
		//create function to Print Text
	},
	TextGroupProperty: new Object(),
	TextArray: new Array(new TextProperty()),
}

PrintClass.prototype.TextGroupProperty = {
	type: null,
	storeId: null,
	gid: null
}

function TextProperty(text, uuid) {
	this.text = text, this.uuid = uuid
}

var PrintObject = new PrintClass();

var order;
var obs;
var DoctorOrderStore;
var DoctorOrderModel;
var DiagnosisPrinted = 0;
var MedicationPrinted = 0;
var k2s = Ext.create('KineticToSencha', {

	// TODO: Move all of these functions to the define() statement for k2s, and you can call via
	//	k2s.method() instead of k2s.config.method()
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
			console.log(ObsModel);
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
	//Sending Stage JSON so that high quality doctor records can be generated again
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

		console.log(DoctorOrderStore);
		DoctorOrderModel.data.patient = myRecord.data.uuid;
		console.log(Ext.getStore('DoctorOrder'));
		DoctorOrderStore.add(DoctorOrderModel);
		console.log(DoctorOrderStore);


		//removes text layer
		stage.getChildren()[1].getChildren().splice(0, stage.getChildren()[1].getChildren().length);
		stage.getChildren()[2].getChildren().splice(0, stage.getChildren()[2].getChildren().length);
		//remove only specific children on controlLayer (X on textboxes)
		stage.getChildren()[4].getChildren().splice(7, stage.getChildren()[4].getChildren().length - 7);
		stage.draw();


		Ext.getCmp('contact').setHidden(false);


		//makes the post call for creating the patient
		DoctorOrderStore.sync({
			success: function(response, records) {
				console.log(arguments);
			},
			failure: function(response, records) {
				console.log(arguments);
			}
		});


	},

	// <Comment describing>
	initStore: function() {
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
	},

	listeners: {
		clickAddMedication: function() { // This function will be called when the 'quit' event is fired
			// By default, "this" will be the object that fired the event.
			console.log("k2s: clickAddMedication");
			var displayText = new String();
			var store = Ext.getStore('drugpanel');
			var data = store.getData();
			var itemCount = data.getCount();

			PrintObject.TextGroupProperty.type = 'DrugOrder';
			PrintObject.TextGroupProperty.storeId = 'drugpanel';
			PrintObject.TextGroupProperty.gid = Math.floor((Math.random() * 5000) + 1);
			PrintObject.TextArray.splice(0, PrintObject.TextArray.length)

			for(var i = MedicationPrinted, index = 0; i < itemCount; i++, index++) {
				var itemData = data.getAt(i).getData();
				displayText = '';
				// TODO: Consolidate following code into loop
				if(!itemData.drugname) {
					// If no drug name, skip to next loop iteration
					continue;
				} else {
					displayText = (itemData.drugname);
				}

				var strength = itemData.strength;
				if(strength) {
					displayText += (' ' + strength + 'mg ');
				}

				var frequency = itemData.frequency;
				if(frequency) {
					displayText += (' ' + frequency);
				}

				var instruction = itemData.instruction;
				if(instruction) {
					displayText += (' ' + instruction);
				}

				var quantity = itemData.duration;
				if(quantity) {
					displayText += (' ' + quantity + ' days');
				}
				console.log(displayText)
				// return itemData.drugname || "";
				MedicationPrinted++;
				var textForPrintObject = new TextProperty(displayText, itemData.uuid);
				PrintObject.TextArray.push(textForPrintObject);
			}
			console.log(PrintObject);

			// TODO: Trigger refresh of Kinetic UI ... drug list should be updated
			g_medication_list = displayText;

			//TODO UI Designers want prev Diagnosis to be showed (with different color    
			// store.clearData(); // Prevents repeating.. now just need to create multiple prescription text boxes
			Ext.getCmp('drugForm').setHidden(false);
			Ext.getCmp('drugaddform').reset();
			// Ext.getCmp('treatment-panel').setActiveItem(0);
		},

		clickOnDiagnosis: function() { // This function will be called when the 'quit' event is fired
			console.log("k2s: clickOnDiagnosis");
			// Print store. I'll have to pull info from this to print in Canvas
			var displayText = [];
			var store = Ext.getStore('diagnosedDisease');
			var data = store.getData();
			var itemCount = data.getCount();
			console.log('itemcount= ' + itemCount);
			console.log('Diagnosis Printed=' + DiagnosisPrinted);
			PrintObject.TextGroupProperty.type = 'Diagnosis';
			PrintObject.TextGroupProperty.storeId = 'diagnosedDisease';
			PrintObject.TextGroupProperty.gid = Math.floor((Math.random() * 5000) + 1);

			PrintObject.TextArray.splice(0, PrintObject.TextArray.length)

			for(var i = DiagnosisPrinted, index = 0; i < itemCount; i++, index++) {
				var itemData = data.getAt(i).getData();
				console.log(itemData);
				console.log('index=' + index + ' i= ' + i);
				displayText[index] = (itemData.complain);
				DiagnosisPrinted++;
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
imageCount = 0;

var DRAWABLE_X_MIN = 60;
var DRAWABLE_X_MAX = 680; // 708 - strict border = 700 ... minus the "Today" text
var DIFF = 144; // moving whole thing up a bit ... 1024 - 880 = 144
var DRAWABLE_Y_MIN = 200 - DIFF; // 230 - strict border 
var DEFAULT_HIGH_Y = DRAWABLE_Y_MIN + 15;
var DRAWABLE_Y_MAX = 1024;
var DEFAULT_MODE = "draw"; // undefined
var STAGE_X = 768; //768
var STAGE_Y = 1024; //1024
var HISTORY_BASE_X = DRAWABLE_X_MAX;
var HISTORY_BASE_Y = DRAWABLE_Y_MIN + 196;
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

	if((DRAWABLE_X_MIN <= up.x && up.x <= DRAWABLE_X_MAX) && (DRAWABLE_Y_MIN <= up.y && up.y <= DRAWABLE_Y_MAX)) {
		return true;
	} else {
		// console.log("not in drawable area: ", up.x, up.y );  
		return false;
	}
}

// TODO: Remove if unneeded
var stage = new Object;

var setupCanvas = function() {

		var lowY = DRAWABLE_Y_MIN;
		var highY = DEFAULT_HIGH_Y;

		var newLine;
		var newLinePoints = [];
		var prevPos;
		var mode = DEFAULT_MODE;

		var historyYOffset = HISTORY_BASE_Y;

		var backgroundLayer = new Kinetic.Layer({
			id: 'backgroundLayer'
		});
		var loadedImageLayer = new Kinetic.Layer({
			id: 'loadedImageLayer'
		}); // For re-loaded thumbs
		var linesLayer = new Kinetic.Layer({
			id: 'linesLayer'
		});
		var textLayer = new Kinetic.Layer({
			id: 'textLayer'
		});
		var controlsLayer = new Kinetic.Layer({
			id: 'controlsLayer'
		});

		// Recreates stage saved in JSON : if there is '/n' in the code, we need to handle the case  
		//var json = '{"attrs":{"width":768,"height":1024,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"id":"stage"},"nodeType":"Stage","children":[{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"width":768,"height":1024,"cornerRadius":0,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"fill":"white"},"nodeType":"Shape","shapeType":"Rect"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":768,"height":880},"nodeType":"Shape","shapeType":"Image"}]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"points":[{"x":36,"y":198.5833282470703},{"x":45,"y":199.5833282470703},{"x":56,"y":200.5833282470703},{"x":76,"y":201.5833282470703},{"x":101,"y":204.5833282470703},{"x":135,"y":208.5833282470703},{"x":172,"y":212.5833282470703},{"x":211,"y":215.5833282470703},{"x":252,"y":217.5833282470703},{"x":293,"y":217.5833282470703},{"x":337,"y":213.5833282470703},{"x":383,"y":209.5833282470703},{"x":429,"y":204.5833282470703},{"x":469,"y":198.5833282470703},{"x":500,"y":193.5833282470703},{"x":521,"y":190.5833282470703},{"x":532,"y":188.5833282470703},{"x":540,"y":186.5833282470703},{"x":542,"y":185.5833282470703},{"x":542,"y":185.5833282470703},{"x":542,"y":185.5833282470703},{"x":541,"y":184.5833282470703},{"x":540,"y":184.5833282470703},{"x":540,"y":183.5833282470703},{"x":539,"y":183.5833282470703},{"x":539,"y":183.5833282470703},{"x":539,"y":183.5833282470703},{"x":539,"y":183.5833282470703},{"x":539,"y":183.5833282470703},{"x":538,"y":183.5833282470703}],"lineCap":"butt","dashArray":[],"detectionType":"pixel","visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"stroke":"red"},"nodeType":"Shape","shapeType":"Line"}]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"width":64,"height":64,"cornerRadius":0,"visible":true,"listening":true,"opacity":1,"x":700,"y":292,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"fill":"green","stroke":"black","strokeWidth":4},"nodeType":"Shape","shapeType":"Rect"},{"attrs":{"fontFamily":"ComicSans","text":"new","fontSize":21.333333333333332,"align":"left","verticalAlign":"top","fontStyle":"normal","padding":0,"width":"auto","height":"auto","detectionType":"path","cornerRadius":0,"lineHeight":1.2,"visible":true,"listening":true,"opacity":1,"x":708,"y":313.3333333333333,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"textFill":"white"},"nodeType":"Shape","shapeType":"Text"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":708,"y":90,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":52,"height":52,"stroke":"black","strokeWidth":1},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":708,"y":145,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":52,"height":52,"stroke":"black","strokeWidth":1},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":200,"y":56,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":128,"height":30,"stroke":"black","strokeWidth":1},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":708,"y":200,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":52,"height":52,"stroke":"black","strokeWidth":1},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":350,"y":56,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":150,"height":30,"stroke":"black","strokeWidth":1},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":700,"y":388,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":64,"height":64,"stroke":"black","strokeWidth":4,"id":"PatientRecord"},"nodeType":"Shape","shapeType":"Image"}]}]}';
		// create node using json string
		//	var json = '{"attrs":{"width":768,"height":1024,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"id":"stage"},"nodeType":"Stage","children":[{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"width":768,"height":1024,"cornerRadius":0,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"fill":"white"},"nodeType":"Shape","shapeType":"Rect"},{"attrs":{"width":161,"height":52,"cornerRadius":0,"visible":true,"listening":true,"opacity":1,"x":2,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"fill":"#2c7cb9"},"nodeType":"Shape","shapeType":"Rect"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":0,"y":56,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":709,"height":835},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":732,"y":56,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":36,"height":835},"nodeType":"Shape","shapeType":"Image"}]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"id":"lines"},"nodeType":"Layer","children":[{"attrs":{"points":[{"x":135,"y":168.25758361816406},{"x":136,"y":168.25758361816406},{"x":137,"y":167.25758361816406},{"x":139,"y":167.25758361816406},{"x":140,"y":166.25758361816406},{"x":149,"y":163.25758361816406},{"x":159,"y":160.25758361816406},{"x":173,"y":154.25758361816406},{"x":223,"y":137.25758361816406},{"x":250,"y":130.25758361816406},{"x":297,"y":120.25758361816406},{"x":309,"y":120.25758361816406},{"x":323,"y":120.25758361816406},{"x":361,"y":120.25758361816406},{"x":374,"y":122.25758361816406},{"x":394,"y":130.25758361816406},{"x":399,"y":137.25758361816406},{"x":402,"y":144.25758361816406},{"x":403,"y":176.25758361816406},{"x":399,"y":203.25758361816406},{"x":394,"y":231.25758361816406}],"lineCap":"butt","dashArray":[],"detectionType":"pixel","visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"stroke":"red"},"nodeType":"Shape","shapeType":"Line"},{"attrs":{"points":[{"x":367,"y":340.25758361816406},{"x":368,"y":340.25758361816406},{"x":374,"y":340.25758361816406},{"x":395,"y":340.25758361816406},{"x":419,"y":336.25758361816406},{"x":456,"y":329.25758361816406},{"x":538,"y":306.25758361816406},{"x":581,"y":293.25758361816406},{"x":650,"y":270.25758361816406},{"x":690,"y":255.25758361816406},{"x":695,"y":248.25758361816406},{"x":687,"y":250.25758361816406},{"x":670,"y":257.25758361816406},{"x":661,"y":260.25758361816406},{"x":650,"y":262.25758361816406},{"x":632,"y":269.25758361816406},{"x":623,"y":271.25758361816406},{"x":585,"y":281.25758361816406},{"x":576,"y":283.25758361816406},{"x":567,"y":286.25758361816406},{"x":549,"y":290.25758361816406},{"x":539,"y":292.25758361816406},{"x":529,"y":293.25758361816406},{"x":509,"y":296.25758361816406},{"x":500,"y":297.25758361816406},{"x":491,"y":297.25758361816406},{"x":478,"y":298.25758361816406},{"x":471,"y":298.25758361816406},{"x":466,"y":297.25758361816406},{"x":455,"y":296.25758361816406},{"x":450,"y":296.25758361816406},{"x":447,"y":295.25758361816406},{"x":438,"y":292.25758361816406},{"x":433,"y":291.25758361816406},{"x":429,"y":290.25758361816406},{"x":422,"y":286.25758361816406},{"x":419,"y":284.25758361816406},{"x":415,"y":281.25758361816406},{"x":408,"y":276.25758361816406},{"x":404,"y":274.25758361816406},{"x":397,"y":269.25758361816406},{"x":393,"y":265.25758361816406},{"x":389,"y":261.25758361816406},{"x":380,"y":255.25758361816406},{"x":376,"y":251.25758361816406},{"x":372,"y":248.25758361816406},{"x":365,"y":241.25758361816406},{"x":361,"y":238.25758361816406},{"x":358,"y":234.25758361816406},{"x":350,"y":227.25758361816406},{"x":347,"y":223.25758361816406},{"x":343,"y":219.25758361816406},{"x":337,"y":211.25758361816406},{"x":333,"y":207.25758361816406},{"x":330,"y":203.25758361816406},{"x":327,"y":197.25758361816406},{"x":325,"y":195.25758361816406},{"x":324,"y":193.25758361816406},{"x":323,"y":191.25758361816406},{"x":323,"y":190.25758361816406},{"x":323,"y":190.25758361816406},{"x":324,"y":190.25758361816406},{"x":324,"y":190.25758361816406},{"x":324,"y":189.25758361816406},{"x":324,"y":189.25758361816406},{"x":324,"y":190.25758361816406},{"x":325,"y":190.25758361816406},{"x":326,"y":193.25758361816406},{"x":328,"y":196.25758361816406},{"x":329,"y":199.25758361816406},{"x":330,"y":203.25758361816406},{"x":331,"y":205.25758361816406},{"x":332,"y":206.25758361816406},{"x":331,"y":208.25758361816406}],"lineCap":"butt","dashArray":[],"detectionType":"pixel","visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"stroke":"red"},"nodeType":"Shape","shapeType":"Line"}]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"id":"text"},"nodeType":"Layer","children":[{"attrs":{"fontFamily":"Calibri","text":"Diagnoses: * Fever\\n","fontSize":14,"align":"left","verticalAlign":"top","fontStyle":"italic","padding":10,"width":"auto","height":"auto","detectionType":"path","cornerRadius":10,"lineHeight":1.2,"visible":true,"listening":true,"opacity":1,"x":80,"y":345.25758361816406,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"stroke":"#555","strokeWidth":3,"fill":"#f44","textFill":"#000","shadow":{"color":"black","blur":1,"offset":{"x":10,"y":10},"opacity":0.2}},"nodeType":"Shape","shapeType":"Text"},{"attrs":{"fontFamily":"Calibri","text":"Medications: * Paracetamol  60ml - 43 - 100 - 43 - Once Daily - After Meals\\n","fontSize":14,"align":"left","verticalAlign":"top","fontStyle":"italic","padding":10,"width":"auto","height":"auto","detectionType":"path","cornerRadius":10,"lineHeight":1.2,"visible":true,"listening":true,"opacity":1,"x":80,"y":404.25758361816406,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"stroke":"#555","strokeWidth":3,"fill":"#44f","textFill":"#000","shadow":{"color":"black","blur":1,"offset":{"x":10,"y":10},"opacity":0.2}},"nodeType":"Shape","shapeType":"Text"}]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[]},{"attrs":{"clearBeforeDraw":true,"visible":true,"listening":true,"opacity":1,"x":0,"y":0,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false},"nodeType":"Layer","children":[{"attrs":{"visible":true,"listening":true,"opacity":1,"x":2,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":50},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":55,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":50},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":108,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":50},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":609,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":50},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":662,"y":2,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":50},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":7,"y":161,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":49},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":7,"y":214,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":49},"nodeType":"Shape","shapeType":"Image"},{"attrs":{"visible":true,"listening":true,"opacity":1,"x":7,"y":267,"scale":{"x":1,"y":1},"rotation":0,"offset":{"x":0,"y":0},"draggable":false,"width":50,"height":49},"nodeType":"Shape","shapeType":"Image"}]}]}';
		//	var stage = Kinetic.Node.create(json, 'container');

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
		stage.add(loadedImageLayer);
		stage.add(controlsLayer);
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
		stage.on("mouseup", function() {
			dragComplete();
		});
		stage.on("touchend", function() {
			dragComplete();
		});
		stage.on("paintDiagnosis", function() {
			console.log('printing Diagnosis');
			console.log(g_diagnosis_list);
			k2s.fireEvent('clickOnDiagnosis');
			Ext.getCmp('diagnosis-panel').setHidden(true);
			drawDiagnosis(PrintObject);
		});
		stage.on("paintMedication", function() {
			//To be refactored
			console.log('printing Drug Order');
			console.log(g_medication_list);
			k2s.fireEvent('clickAddMedication');
			Ext.getCmp('drugForm').setHidden(true);
			drawDiagnosis(PrintObject);
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
				prevPos = stage.getUserPosition(); // Mouse or touch
				newLinePoints.push(prevPos);
				newLine = new Kinetic.Line({
					points: newLinePoints,
					stroke: "black",
				});
				linesLayer.add(newLine);

				moving = true;
			}
		}

		// While user holding down the mouse clicker or touch, continue dragging


		function dragMove() {
			var up = stage.getUserPosition();
			if(!up || !isInDrawableArea(up.x, up.y) || mode !== 'draw') {
				return;
			}

			if(moving) {
				var mousePos = stage.getUserPosition(); // Mouse or touch
				var x = mousePos.x;
				var y = mousePos.y;
				newLinePoints.push(mousePos);
				updateBounds(mousePos);
				prevPos = mousePos;

				moving = true;
				linesLayer.drawScene();
			}
		}

		// On release of mouse or touch, done dragging


		function dragComplete() {
			var up = stage.getUserPosition();
			if(!up || !isInDrawableArea(up.x, up.y) || mode !== 'draw') {
				return;
			}

			moving = false;
		}

		// Keep track of the current low and high bounds (y-axis) for where a user
		// has already added content onto the canvas. The idea is that we want to add
		// structured data (diagnoses, prescriptions, ...) into blank areas on the 
		// canvas where the user hasn't yet written.


		function updateBounds(mousePos) {
			var y = mousePos.y;
			if(y < lowY || lowY == undefined) {
				lowY = y;
			}
			if(y > highY || highY == undefined) {
				highY = y + HIGH_Y_OFFSET;
			}
		}

		// SAVING 
		// Save - event handler

		function onSaveCanvas() {
			// Callback, since the stage toDataURL() method is asynchronous, 
			k2s.saveDrawableCanvas();
			k2s.saveLoadMask();
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
			// height: DRAWABLE_Y_MIN - 4,
			height: TOOLBAR_HEIGHT,
			fill: "#82b0e1" // Light Blue.
		});
		backgroundLayer.add(toolbarBackground);

		addImageToLayer("resources/images/bg/TODAY_710.png", backgroundLayer, {
			x: 0,
			y: DRAWABLE_Y_MIN,
			width: 710,
			height: 835
		});

		addImageToLayer("resources/images/bg/HISTORY_35.png", backgroundLayer, {
			x: stage.getWidth() - 36,
			y: DRAWABLE_Y_MIN,
			width: 35,
			height: 835
		});

		var controlItems = [{
			// Pencil (Draw mode)
			image: 'resources/images/icons/pen_on.png',
			x: TOOLBAR_ITEM_BASE_X,
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			handler: function() {
				console.log('mode = draw');
				mode = "draw";
			}
		}, {
			// Eraser (Erase mode)
			image: 'resources/images/icons/eraser_off.png',
			x: TOOLBAR_ITEM_BASE_X + 1 * (TOOLBAR_ITEM_DIM),
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			handler: function() {
				console.log('ERASER: TODO');
				// mode = "erase";
			}
		}, {
			// Keyboard (typed text input)
			image: 'resources/images/icons/text_off.png',
			x: TOOLBAR_ITEM_BASE_X + 2 * (TOOLBAR_ITEM_DIM),
			y: TOOLBAR_ITEM_BASE_Y,
			width: TOOLBAR_ITEM_DIM,
			height: TOOLBAR_ITEM_DIM,
			handler: function() {
				console.log('KEYBOARD: TODO');
				// mode = "keyboard";
			}
		}, {
			// New
			image: 'resources/images/new.png',
			x: stage.getWidth() - 120 - 58 - TOOLBAR_ITEM_DIM,
			y: CONTROL_BASE_Y + 1,
			width: TOOLBAR_HEIGHT - 6,
			height: TOOLBAR_HEIGHT - 6,
			handler: function() {
				console.log('tapped new button');
				// TODO: Clear the canvas - for demo only
				Ext.Msg.confirm('', 'Erase current visit (without saving)?', function(btn) {
					if(btn == 'yes') {
						linesLayer.removeChildren();
						textLayer.removeChildren();
						//remove only specific children on controlLayer (X on textboxes)
						var CONTROL_LAYER_BUTTON_COUNT = 8;	// Preserve this many buttons
						stage.getChildren()[4].getChildren().splice(CONTROL_LAYER_BUTTON_COUNT);
						// drawControlsLayers.removeChildren();	// TODO: Add to another layer for clarity (if perf OK)
						
						highY = DEFAULT_HIGH_Y;
						stage.draw();
					}
				});
			},
		}, {
			// Sends OPD Encounter
			image: 'resources/images/icons/button_finalize.png',
			x: stage.getWidth() - 120 - 58,
			y: TOOLBAR_ITEM_BASE_Y + 2,
			width: 120,
			height: TOOLBAR_HEIGHT - 6,
			handler: function() {
				console.log('sending Doctor Encounter');
				Ext.Msg.confirm('', 'Save and complete this visit?', function(btn) {
					if(btn == 'yes') {
						//For now,
						// - saves image to history store
						// TODO: Saved image is wrong resolution
						// - clears canvas
						// - (doesnt yet) move to patientlist
						onSaveCanvas();

						// Save via REST
						// k2s.config.sendDoctorOrderEncounter();
					}
				});
			},
		}, {
			// Add diagnosis
			image: 'resources/images/icons/add_D_off.png',
			x: DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
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
			x: DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
			y: CONTROL_BASE_Y + 4 * (CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING),
			width: 50,
			height: 49,
			handler: function() {
				onClickMedication();
			}
		}, {
			// Add investigation
			image: 'resources/images/icons/add_investigation_off.png',
			x: DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
			y: CONTROL_BASE_Y + 5 * (CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING),
			width: 50,
			height: 49,
			handler: function() {
				console.log('INVESTIGATIONS: TODO');
			}
		}];

		// Creates a 'clickable' item with a touch handler.
		// requires parameters for item: x,y,width,height,src,handler


		function createControlItem(item) {
			var imageObj = new Image();
			imageObj.onload = function() {
				var box = new Kinetic.Image({
					gid: item.gid,
					storeId: item.storeId,
					x: item.x,
					y: item.y,
					width: item.width,
					height: item.height,
					// stroke: "black",
					// strokeWidth: 1,
					image: imageObj
				});
				box.on('click touchstart', item.handler);
				controlsLayer.add(box);
				controlsLayer.draw();
			}
			imageObj.src = item.image;
		}

		for(var i = 0; i < controlItems.length; i++) {
			createControlItem(controlItems[i]);
		}

		//
		// Handlers
		//

		function onClickDiagnosis() {
			console.log("add diagnosis");
			k2s.clickDiagnosis();
			//        drawDiagnosis(g_diagnosis_list);
		}

		function onClickMedication() {
			// Get user input
			console.log("add diagnosis")
			// var input = window.prompt("What's the diagnosis?","Tuberculosis");
			// Trigger launch of modal dialog in Sencha
			k2s.addMedication();

			// inserts a dianosis wherever there's untouched space on canvas
			// drawTextAtLowPoint(input);
			//drawDiagnosis(g_medication_list);
		}

		function drawDiagnosis(text) {
			console.log('drawDiagnosis');
			if(text.TextArray.length) {
				drawTextAtLowPoint(text);
			}
		}

		function drawTextAtLowPoint(PrintObject) {
			console.log(PrintObject);
			// text = "Rheumatic Fever";
			// Image on each line.
			// TODO: Needs pointer to the related in the store, so "X" can call delete
			console.log("drawTextAtLowPoint");

			//PrintObject.TextGroupProperty['gid']
			var type = PrintObject.TextGroupProperty.type;
			var storeId = PrintObject.TextGroupProperty.storeId;
			var gid = PrintObject.TextGroupProperty.gid;
			var TextArray = PrintObject.TextArray;

			//		Bullet icon is based on type of text to be printed	
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

			var imageObj2 = new Image();
			var myHighY = highY;
			addImageToLayer(bullet_icon_link, textLayer, {
				gid: gid,
				x: DRAWABLE_X_MIN + 20,
				y: myHighY,
				width: 14,
				height: 14
			});
			console.log(TextArray);
			for(var i = 0; i < TextArray.length; i++) {
				var complexText = new Kinetic.Text({
					gid: gid,
					storeId: storeId,
					storeUuid: TextArray[i].uuid,
					x: DRAWABLE_X_MIN + 20 + 20,
					y: highY,
					text: TextArray[i].text,
					fontSize: 11,
					fontFamily: 'Helvetica',
					textFill: '#000',
					align: 'left',
				});
				textLayer.add(complexText);
				highY += ((complexText.textHeight * (complexText.textArr.length + 1))); // length + title + space
				//Drug order suggestion demo interface
				if(TextArray[i].text === "Sinusitis") {
					console.log('SINUSITIS Detected');
					var SuggestDrugOrder = true;
				}
			}
			// Add "delete" button
			// Note, this creates item on control Layer, not text layer
			createControlItem({
				gid: gid,
				image: "resources/images/icons/delete_bigger.png",
				x: DRAWABLE_X_MAX - 140,
				y: myHighY,
				width: 32,
				height: 32,
				handler: function() {
					gidToBeDeleted = this.attrs.gid;
					console.log('Deleting objects with gid= ' + gidToBeDeleted);

					// Step 1 : Get Layers
					for(var i = 0; i < stage.getChildren().length; i++) {
						//Children in only textLayer and controlsLayer to be removed
						// TODO: How about you just use the existing vars "textLayer" and "controlsLayer"? 
						if(stage.getChildren()[i].getId() === "textLayer" || stage.getChildren()[i].getId() === "controlsLayer") {
							//To check on infinite loop , TODO: Remove after testing
							var count = 0;
							for(var j = 0; j < stage.getChildren()[i].getChildren().length; j++) {
								count++;
								if(count == 100) {
									console.log('bad code.... infinite loop on');
									break;
								}

								//Step 2 : Select Children with help of group id and delete those chidren
								if(stage.getChildren()[i].getChildren()[j].attrs.gid === gidToBeDeleted) {
									//Step 3 : Search & Delete related item from store from Store
									//Checks if this item has any storeId & storeUuid linked
									if(stage.getChildren()[i].getChildren()[j].attrs.storeId && stage.getChildren()[i].getChildren()[j].attrs.storeUuid) {
										storeToBeDeleted = Ext.getStore(stage.getChildren()[i].getChildren()[j].attrs.storeId);
										var SearchKey = stage.getChildren()[i].getChildren()[j].attrs.storeUuid;
										var SearchOnId = '';
										switch(stage.getChildren()[i].getChildren()[j].attrs.storeId) {
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
										if(stage.getChildren()[i].getChildren()[j].attrs.storeId === 'diagnosedDisease') {
											// var diagnosedList = Ext.getCmp('diagnosisList');
											// diagnosedList.getStore().add({
											//     complain: stage.getChildren()[i].getChildren()[j].attrs.text,
											//     id: stage.getChildren()[i].getChildren()[j].attrs.storeUuid,
											// });
											--DiagnosisPrinted;
										}

										if(stage.getChildren()[i].getChildren()[j].attrs.storeId === 'drugpanel') {
											--MedicationPrinted;
										}
									}

									//Removing child layer from stage
									console.log('Deleted Child: ');
									console.log(stage.getChildren()[i].getChildren().splice(j, 1));
									--j;
								}

								//Refreshes stage to show changes made above
								stage.getChildren()[i].draw();
							}
						}
					}
				}
			});


			var handDrawnLineY = highY; // + 20*(text.length-1);
			addImageToLayer("resources/images/icons/line.png", textLayer, {
				gid: gid,
				x: DRAWABLE_X_MIN + 20,
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
				Ext.Msg.defaultAllowedConfig.maxWidth = 600;

				Ext.Msg.confirm('Confirmation for Raxa Decision Support Suggestion', 'Raxa Decision Support has suggested following Prescription \n' + '<font size="3" color="red"><br><b>Mometasone 200 μg twice daily (with meals) for 15 days </b></font> for <b>SINUSITIS</b> </br>  \n Do you wish to accept this suggestion?', function(btn) {
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
				}); 
				// .setSize(600, 300);
			}
		}


	};

// TODO: Quick Hack! Must remove from global scope
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