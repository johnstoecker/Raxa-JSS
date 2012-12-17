///////////////////////////////////////////////////////////////////////////////
// Kinetic JS, drawing Canvas
// - Globals vars shared across all views using Kinetic and canvases
// - k2s is an instance of KineticToSencha, which includes methods to track
// 	what's drawn on the canvas and save it when user does "finalize" command
// - setupCanvas initiatizes most of KineticJS (drawing items on the canvas, 
// 	preparing event handlers, etc)
///////////////////////////////////////////////////////////////////////////////

// Globals 
// TODO: Continue refactoring to remove these

var PrintObject;
var stage = new Object;	// TODO: Remove if unneeded

var DRAWABLE_X_MIN = 60;
var DRAWABLE_X_MAX = 680; // 708 - strict border = 700 ... minus the "Today" text
var DIFF = 144; // moving whole thing up a bit ... 1024 - 880 = 144
var DRAWABLE_Y_MIN = 200 - DIFF; // 230 - strict border 
var DEFAULT_HIGH_Y = DRAWABLE_Y_MIN + 15;

// Keep track of the current low and high bounds (y-axis) for where a user
// has already added content onto the canvas. The idea is that we want to add
// structured data (diagnoses, prescriptions, ...) into blank areas on the 
// canvas where the user hasn't yet written.
var highY = DEFAULT_HIGH_Y;	// Not a constant

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

// TODO: Remove from global scope
// 	This is being used in Unstructured.js view
function addImageToLayer(file, layer, config) {
	var imgObj = new Image();
	imgObj.onload = function() {
		config.image = imgObj;
		var kineticImage = new Kinetic.Image(config);

		if (config.handler && config.events) {
			kineticImage.on(config.events, config.handler);
		}

		layer.add(kineticImage);
		layer.draw();
	}
	imgObj.src = file;
}

var setupCanvas = function() {

	// attach variables and functions that need to be accessed from outside canvas
	// return this at end of setupCanvas
	var publicAccessObject = {};	
	
	var NO_CONTROL_GROUP = 'noControlGroup';

	var lowY = DRAWABLE_Y_MIN;

	var newLine;
	var newLinePoints = [];
	var prevPos;
	
	var mode;
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
		// Callback, since the stage toDataURL() method is asynchronous
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
		// height: DRAWABLE_Y_MIN - 4,
		height: TOOLBAR_HEIGHT,
		fill: "#82b0e1" // Light Blue.
	});
	backgroundLayer.add(toolbarBackground);

	addImageToLayer("resources/images/bg/today_big.png", backgroundLayer, {
		x: 0,
		y: DRAWABLE_Y_MIN,
		// width: 710,
		// height: 835,
		width: 723,
		height: 742
	});

	addImageToLayer("resources/images/bg/history_small.png", backgroundLayer, {
		x: stage.getWidth() - 42,
		y: DRAWABLE_Y_MIN,
		// width: 35,
		// height: 835
		width: 41,
		height: 742
	});

	var controlItems = [{
		// Pencil (Draw mode)
		image: 'resources/images/icons/pen_off.png',
		imageWhenToggledOn: 'resources/images/icons/pen_on.png',
		startToggledOn: true,
		x: TOOLBAR_ITEM_BASE_X,
		y: TOOLBAR_ITEM_BASE_Y,
		width: TOOLBAR_ITEM_DIM,
		height: TOOLBAR_ITEM_DIM,
		controlGroup : 'drawingInput',
		handler: function() {
			console.log('mode = draw');
			setCanvasInteractionMode('draw');
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
			setCanvasInteractionMode('erase');
		}
	// }, {
	// 	// Keyboard (typed text input)
	// 	image: 'resources/images/icons/text_off.png',
	// 	imageWhenToggledOn: 'resources/images/icons/text_on.png',
	// 	x: TOOLBAR_ITEM_BASE_X + 2 * (TOOLBAR_ITEM_DIM),
	// 	y: TOOLBAR_ITEM_BASE_Y,
	// 	width: TOOLBAR_ITEM_DIM,
	// 	height: TOOLBAR_ITEM_DIM,
	// 	controlGroup : 'drawingInput',
	// 	handler: function() {
	// 		console.log('KEYBOARD: TODO');
	// 		// mode = "keyboard";
	// 	}
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
	// }, {
	// 	// Add investigation
	// 	image: 'resources/images/icons/add_investigation_off.png',
	// 	x: DRAWABLE_X_MIN - CONTROL_ITEM_SPACING - CONTROL_ITEM_DIM,
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
		
			if(item.startToggledOn == true) {
				// Toggle by default
				box.fire('click');
			}
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

	// Handle canvas interaction mode
	function setCanvasInteractionMode(m) {
		if (m === 'draw') {
			mode = 'draw';
			tempControlsLayer.hide();
		} else if (m === 'erase') {
			mode = 'erase';
			tempControlsLayer.show();
		} else {
			mode = 'none';
			tempControlsLayer.hide();
		}
		tempControlsLayer.draw();
	}

	function getCanvasInteractionMode() {
		return mode;
	}

	// Default mode is Draw. Note that the toggling of the pencil icon to default to pressed 
	// is done elsewhere, in the control button / control group logic
	setCanvasInteractionMode('draw');

	//
	// Handlers
	//

	function onClickDiagnosis() {
		k2s.addDiagnosis();
	}

	function onClickMedication() {
		k2s.addMedication();
	}

	// Delete handler. TODO: Should be able to refactor and simply
	function deleteHandler(groupId) {
		Ext.Msg.confirm('Delete', 'Are you sure?', function(btn) {
			if(btn == 'yes') {
				var gidToBeDeleted = groupId;
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

	// Temporary filler function called whenever a user adds a diagnosis
	// If user chooses "Sinusitus" as their diagnosis, it will cause this alert to appear
	function fakeDecisionSupport() {
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
			x: DRAWABLE_X_MIN + 20,
			y: myHighY,
			width: 14,
			height: 14
		});
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
			x: DRAWABLE_X_MAX - 140,
			y: myHighY,
			width: 32,
			height: 32,
			handler: function() { deleteHandler(this.gid); }
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
			fakeDecisionSupport();
		}
	}

	publicAccessObject['methods'] = {};
	publicAccessObject['methods']['setCanvasInteractionMode'] = setCanvasInteractionMode;
	publicAccessObject['methods']['getCanvasInteractionMode'] = getCanvasInteractionMode;

	return publicAccessObject;
};

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
				displayText[index] = (itemData.complain);
				PrintObject.DiagnosisPrinted++;
				var textForPrintObject = new TextProperty(itemData.complain, itemData.id);
				PrintObject.TextArray.push(textForPrintObject);
			}

			// TODO: Trigger refresh of Kinetic UI ... drug list should be updated
			Ext.getCmp('diagnosis-panel').setHidden(false);
			//      Ext.getCmp('drugaddform').reset();
			//      Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD);
		}
	}
});
