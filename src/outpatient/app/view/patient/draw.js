// TODO: must be captured in a setupCanvas method, else will try to affect DOM before it's loaded

///////////////////////////////////////////////////////////
// Connection: Kinetic to Sencha
//  - bridges via firing Ext events
///////////////////////////////////////////////////////////

// Allows us to throw Ext events, triggering Sencha code when tapping on Kinetic items
Ext.define('KineticToSencha', {
    mixins: ['Ext.mixin.Observable'],
    config: {fullName : ''},

    constructor: function(config) {
        this.initConfig(config);  // We need to initialize the config options when the class is instantiated
    },

    addDiagnosis: function() {
         this.fireEvent('clickAddDiagnosis');
    }
});

g_diagnosis_text = "";

var k2s = Ext.create('KineticToSencha', {
    listeners: {
        clickAddDiagnosis: function() { // This function will be called when the 'quit' event is fired
            // By default, "this" will be the object that fired the event.
            console.log("k2s: clickAddDiagnosis");
            // Ext.getCmp('plusDrugButton').fireEvent('tap'); // hack to press a real button and launch its dialog

            console.log("k2s: NOTE ADDING DRUGS FOR NOW");
            // Print store. I'll have to pull info from this to print in Canvas
            // TODO: let's start with just the drug's name..
            var displayText = "";

            var store = Ext.getStore('drugpanel');
            var data = store.getData();
            var itemCount = data.getCount();
            if (itemCount > 0) {
                displayText += "Medications: \n";
            }

            for (var i=0; i < itemCount; i++) {
                var itemData = data.getAt(i).getData();
                console.log(itemData.drugname || "");
                displayText += ('* ' + itemData.drugname + '\n');

                // return itemData.drugname || "";
            }
            console.log('display...', displayText); 

            // TODO: Trigger refresh of Kinetic UI ... drug list should be updated
            g_diagnosis_text = displayText;
            store.clearData();  // Prevents repeating.. now just need to create multiple prescription text boxes

            Ext.getCmp('drugForm').setHidden(false);
            Ext.getCmp('drugaddform').reset();
            Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD);             
        }
    }
});

///////////////////////////////////////////////////////////
// Kinetic JS, drawing Canvas
///////////////////////////////////////////////////////////

imageCount = 0;

var DRAWABLE_X_MIN = 0;
var DRAWABLE_X_MAX = 700; // 708 - strict border
var DRAWABLE_Y_MIN = 240; // 230 - strict border
var DRAWABLE_Y_MAX = 1024;
var DEFAULT_MODE = "draw";  // undefined
var STAGE_X = 768;  //768
var STAGE_Y = 1024; //1024

var HISTORY_BASE_X = DRAWABLE_X_MAX;
var HISTORY_BASE_Y = DRAWABLE_Y_MIN + 196;
var HISTORY_ITEM_DIM = 64;

var CONTROL_BASE_X = DRAWABLE_X_MAX + 8;
var CONTROL_BASE_Y = DRAWABLE_Y_MIN - 6;
var CONTROL_ITEM_SPACING = 3;
var CONTROL_ITEM_DIM = 52;

function isInDrawableArea(myX, myY) {
  up = {
    x : myX,
    y : myY
  };

  
  if ((DRAWABLE_X_MIN <= up.x && up.x <= DRAWABLE_X_MAX) && (DRAWABLE_Y_MIN <= up.y && up.y <= DRAWABLE_Y_MAX)) {
    return true;
  } else {
    // console.log("not in drawable area: ", up.x, up.y );  
    return false;
  }
}


var setupCanvas = function() {

    var lowY = DRAWABLE_Y_MIN;
    var highY = DRAWABLE_Y_MIN;

    var newLine;
    var newLinePoints = [];
    var prevPos;
    var mode = DEFAULT_MODE;

    var historyYOffset = HISTORY_BASE_Y;

    layer = new Kinetic.Layer();
    loadedImageLayer = new Kinetic.Layer();  // For re-loaded thumbs
    linesLayer = new Kinetic.Layer();
    textLayer = new Kinetic.Layer();
    controlsLayer = new Kinetic.Layer();

    // var simpleText = new Kinetic.Text({
    // x: 190,
    // y: 15,
    // text: "Simple Text",
    // fontSize: 30,
    // fontFamily: "Calibri",
    // textFill: "green"
    // }); 

    stage = new Kinetic.Stage({
      container: "container",
      width: STAGE_X,
      height: STAGE_Y
    });
    GloStage = stage;

    background = new Kinetic.Rect({
      x: 0, 
      y: 0, 
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: "white"
    });

    layer.add(background);

    // Load background image for OPD
    var imageObj = new Image();
    imageObj.onload = function() {
    console.log("image loaded");
    console.log(stage.getWidth(), stage.getHeight());
    var backgroundImage = new Kinetic.Image({
      x: 0,
      y: 1024-880,
      image: imageObj,
      width: stage.getWidth(),
      height: 880
    });
    layer.add(backgroundImage);
    layer.draw();
    }
    var file = "background-768x880.png";
    imageObj.src = file;

    stage.add(layer);
    stage.add(linesLayer);
    stage.add(textLayer); // in front of "draw" layer, i.e. cant draw on a diagnosis. for now.
    stage.add(loadedImageLayer);
    stage.add(controlsLayer);

    moving = false;

    // Drag start
    stage.on("mousedown", function(){
    dragStart();
    });

    stage.on("touchstart", function(){
    dragStart();
    });

    function dragStart() {
      console.log('dragStart');

      var up = stage.getUserPosition();
      if (! isInDrawableArea(up.x, up.y)) {
        return;
      }
      
      if (mode !== 'draw') {
        return;
      }

      if (moving){
          moving = false;layer.draw();
      } else {
          newLinePoints = [];
          prevPos = stage.getUserPosition();  // Mouse or touch
          newLinePoints.push(prevPos);
          newLine = new Kinetic.Line({
            points: newLinePoints,
            stroke: "red",
          });
          linesLayer.add(newLine);

          moving = true;    
          // linesLayer.drawScene();            

          // // TODO: Allow erase of lines..
          // newLine.on('mouseover', function(evt){
          //   console.log('clicked on newline');
          //   if (mode == 'erase') {
          //     console.log('fake erase');
          //   }
          // });                        
      }
    }

    // Keep track of current low and high
    function updateBounds(mousePos) {
      var y = mousePos.y;
      if (y < lowY || lowY == undefined) { lowY = y; }
      if (y > highY || highY == undefined) { highY = y; console.log("hi = " + y)}
    }


    // Drag in progress
    stage.on("mousemove", function(){ dragMove(); });
    stage.on("touchmove", function(){ dragMove(); });

    function dragMove(){
      var up = stage.getUserPosition();
      // console.log(up.x, up.y);
      if (! isInDrawableArea(up.x, up.y)) {
        return;
      }

      // console.log('dragMove');
      if (mode !== 'draw') {
        return;
      }

      if (moving) {
          var mousePos = stage.getUserPosition();  // Mouse or touch
          var x = mousePos.x;
          var y = mousePos.y;
          newLinePoints.push(mousePos);
          updateBounds(mousePos);
          prevPos = mousePos;
          
          moving = true;
          linesLayer.drawScene();
      }
    }

    // Done dragging
    stage.on("mouseup", function(){dragComplete();});
    stage.on("touchend", function(){dragComplete();});

    function dragComplete(){
      console.log('drag complete');
      
      var up = stage.getUserPosition();
      if (! isInDrawableArea(up.x, up.y)) {
        return;
      }

      if (mode !== 'draw') {
        return;
      }

      moving = false; 
    }

    function onSaveCanvas() {
    /*
     * since the stage toDataURL() method is asynchronous, we need
     * to provide a callback
     */
    stage.toDataURL({
      callback: function(dataUrl) {
        /*
         * here you can do anything you like with the data url.
         * In this tutorial we'll just open the url with the browser
         * so that you can see the result as an image
         */
        // localStorage.setItem('imageFromVisit' + imageCount, dataUrl);
        createThumbnail('thumbImg' + imageCount, dataUrl);
        imageCount++;
      }
    });
    }

    // Creating thumbnails..
    // 'canvasImg'
    function createThumbnail(imgId, dataUrl) {
    // var dim = 64;
    // img = document.getElementById(imgId);
    // img.height = dim;
    // img.width = dim;
    // img.src = dataUrl;
    // // img.setAttribute('onclick', 'loadImageFromPriorVisit("' + dataUrl + '");')

    addHistoryItem('','yellow', dataUrl);
    }

    // Load 
    function addHistoryItem(name, color, dataUrl) {
    if (! dataUrl ) {
      var box = new Kinetic.Rect({
        x: DRAWABLE_X_MAX,
        y: historyYOffset,
        width: HISTORY_ITEM_DIM,
        height: HISTORY_ITEM_DIM,
        fill: color,  // Today
        stroke: "black",
        strokeWidth: 4,
        draggable: false,
        // name: 'thumb'
      });
      updateHistoryBar(box, '');
      addText(name);
      return;
    }

    // If there is a dataUrl, then use that image to do fun stuff like create thumbz
    var imageObj = new Image();
    imageObj.onload = function() {
      var box = createHistoryLink(imageObj);
      updateHistoryBar(box, dataUrl);
    }
    imageObj.src = dataUrl;

    function createHistoryLink(img) {
      var box = new Kinetic.Image({
        x: DRAWABLE_X_MAX,
        y: historyYOffset,
        width: HISTORY_ITEM_DIM,
        height: HISTORY_ITEM_DIM,
        stroke: "black",
        strokeWidth: 4,
        image: img
        // name: 'thumb'
      });
      return box;
    }

    function updateHistoryBar(box, dataUrl) {
      controlsLayer.add(box);
      controlsLayer.draw();
      box.on('click touchstart', function() {
        // Reset to current visit
        loadImageFromPriorVisit(dataUrl);
      });
      // box.on('touchstart', function() {
      //   // Reset to current visit
      //   loadImageFromPriorVisit(dataUrl);
      // });
      
      historyYOffset += HISTORY_ITEM_DIM + (HISTORY_ITEM_DIM / 2);
    }

    function addText(text) {
      console.log('add some text');
      var text = new Kinetic.Text({
        x: DRAWABLE_X_MAX + 8,
        y: historyYOffset - (HISTORY_ITEM_DIM + (HISTORY_ITEM_DIM / 2)) + HISTORY_ITEM_DIM / 3,
        fontSize: HISTORY_ITEM_DIM /3,
        fontFamily: "ComicSans",
        textFill: "white",
        text: name
      });
      text.on('click touchstart', function() {
        // Reset to current visit
        console.log('tap text');
        loadImageFromPriorVisit('');    // TODO: Careful. loads no visit if tapping text.
          // Hack just to get this working for "new" button, for now
      });
      controlsLayer.add(text);
      controlsLayer.draw();
    }
    }

    addHistoryItem('new', 'green', '');

    function loadImageFromPriorVisit(dataUrl) {
    console.log('loadImageFromPriorVisit');
    if (! dataUrl) {
      console.log('no data url');
      // Reset to draw mode
      // console.log(loadedImageLayer.getChildren());
      // loadedImageLayer.removeChildren();
      // loadedImageLayer.clear();
      loadedImageLayer.hide();
      // loadedImageLayer.draw();

      // For now, reset the drawing layers..
      // TODO: There may be times when we want to persist ('today in progress') and look
      //   back at history
      linesLayer.removeChildren();
      textLayer.removeChildren();
      
      highY = DRAWABLE_Y_MIN; // Also reset highY, so that text will appear in correct place relative to doctor handwriting
      stage.draw();
      return;
    }


    var imageObj = new Image();
    imageObj.onload = function() {
      console.log("image loaded");
      
      var priorVisitImage = new Kinetic.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stage.getWidth(),
        height: stage.getHeight()
      });
      
      loadedImageLayer.add(priorVisitImage);
      loadedImageLayer.draw();
    }
    imageObj.src = dataUrl;

    loadedImageLayer.show();
    }


    ////////////////////////////////////////////
    // Add Controls... Pencil, eraser, save   //
    ////////////////////////////////////////////

    // If there is a dataUrl, then use that image to do fun stuff like create thumbz
    var pencilImageObj = new Image();
    pencilImageObj.onload = function() {
    var box = new Kinetic.Image({
      x: CONTROL_BASE_X,
      y: CONTROL_BASE_Y,
      width: CONTROL_ITEM_DIM,
      height: CONTROL_ITEM_DIM,
      stroke: "black",
      strokeWidth: 1,
      image: pencilImageObj
    });
    box.on('click touchstart', function() {
      mode = "draw";
    });
    controlsLayer.add(box);
    controlsLayer.draw();       
    }
    pencilImageObj.src = 'pencil.png';

    var eraserImgObj = new Image();
    eraserImgObj.onload = function() {
    var box = new Kinetic.Image({
      x: CONTROL_BASE_X,
      y: CONTROL_BASE_Y + CONTROL_ITEM_DIM + CONTROL_ITEM_SPACING,
      width: CONTROL_ITEM_DIM,
      height: CONTROL_ITEM_DIM,
      stroke: "black",
      strokeWidth: 1,
      image: eraserImgObj
    });
    box.on('click touchstart', function() {
      console.log('disabled, for now, since eraser isnt working');
      // mode = "erase";
    });
    controlsLayer.add(box);
    controlsLayer.draw();
    }
    eraserImgObj.src = 'eraser.png';

    // var keyboardImgObj = new Image();
    // keyboardImgObj.onload = function() {
    //   // var box = createHistoryLink(imageObj);
    //   // function createHistoryLink(img) {
    //   var box = new Kinetic.Image({
    //     x: CONTROL_BASE_X,
    //     y: CONTROL_BASE_Y + CONTROL_ITEM_DIM*2 + CONTROL_ITEM_SPACING*2,
    //     width: CONTROL_ITEM_DIM,
    //     height: CONTROL_ITEM_DIM,
    //     stroke: "black",
    //     strokeWidth: 1,
    //     image: keyboardImgObj
    //   });
    //   box.on('click touchstart', function() {
    //     onAddDiagnosis();
    //   });
    //   controlsLayer.add(box);
    //   controlsLayer.draw();
    //   // updateHistoryBar(box, handler);
    // }
    // keyboardImgObj.src = 'keyboard.png';

    var saveImgObj = new Image();
    saveImgObj.onload = function() {
    var box = new Kinetic.Image({
      x: CONTROL_BASE_X,
      y: CONTROL_BASE_Y + CONTROL_ITEM_DIM*2 + CONTROL_ITEM_SPACING*2,
      width: CONTROL_ITEM_DIM,
      height: CONTROL_ITEM_DIM,
      stroke: "black",
      strokeWidth: 1,
      image: saveImgObj
    });
    box.on('click touchstart', function() {
        console.log('tapped save button');
      onSaveCanvas();
    });
    controlsLayer.add(box);
    controlsLayer.draw();
    }
    saveImgObj.src = 'save.png';

    // // Overlaps with "new" history item. just to help make it easier to understand
    // var newImgObj = new Image();
    // newImgObj.onload = function() {
    //   var box = new Kinetic.Image({
    //     x: CONTROL_BASE_X,
    //     y: CONTROL_BASE_Y + CONTROL_ITEM_DIM*3 + CONTROL_ITEM_SPACING*3,
    //     width: CONTROL_ITEM_DIM,
    //     height: CONTROL_ITEM_DIM,
    //     stroke: "black",
    //     strokeWidth: 1,
    //     image: newImgObj
    //   });
    //   box.on('click touchstart', function() {
    //     onSaveCanvas();
    //   });
    //   controlsLayer.add(box);
    //   controlsLayer.draw();
    // }
    // newImgObj.src = 'new.png';

    var plusDiagnosisImgObj = new Image();
    plusDiagnosisImgObj.onload = function() {
        var box = new Kinetic.Image({
          x: 200,
          y: DRAWABLE_Y_MIN - 40,
          width: 128,
          height: 30,
          stroke: "black",
          strokeWidth: 2,
          image: plusDiagnosisImgObj
        });
        box.on('click touchstart', function() {
          onAddDiagnosis();
        });
        controlsLayer.add(box);
        controlsLayer.draw();
    }        
    plusDiagnosisImgObj.src = 'plus_diagnosis.png';

    function onAddDiagnosis() {
        // Get user input
        console.log("add diagnosis")
        // var input = window.prompt("What's the diagnosis?","Tuberculosis");

        // Trigger launch of modal dialog in Sencha
        k2s.addDiagnosis();

        // inserts a dianosis wherever there's untouched space on canvas
        // drawTextAtLowPoint(input);
        drawDiagnosis(g_diagnosis_text);
    }

    function drawDiagnosis(text) {
        if (text) {
            drawTextAtLowPoint(text);  
        }
    }

    function drawTextAtLowPoint(text) {
        console.log("drawTextAtLowPoint");
      
      // add the shapes to the layer
      // simpleText.setAttrs({y: highY});
      // console.log(simpleText);
      // console.log(simpleText.y);
      // textLayer.add(simpleText);
        var complexText = new Kinetic.Text({
            x: 20,
            // y: 60,
            stroke: '#555',
            strokeWidth: 3,
            fill: '#eee',
            // text: 'DIAGNOSIS: Tuberculosis',
            // text: 'Medication: \n* Acetominophan - 100mg - 2x Daily \n* Acetominopan - 100mg - 2x Daily \n* Acetominopan - 100mg - 2x Daily \n',
            text: '',
            fontSize: 14,
            fontFamily: 'Calibri',
            textFill: '#000',
            // width: 380,
            padding: 10,
            // align: 'center',
            align: 'left',
            fontStyle: 'italic',
            shadow: {
                color: 'black',
                blur: 1,
                offset: [10, 10],
                opacity: 0.2
            },
            cornerRadius: 10
        });

          complexText.setAttrs(
            {y: highY,
            text: text});
          textLayer.add(complexText);
      stage.draw();
    } 
};

///////////////////////////////////////////////////////////
// Sencha code
//  - well, it's a glorified canvas, wrapped in Sencha
///////////////////////////////////////////////////////////


/**
 * Copyright 2012, Raxa
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
//the view after clicking one of the patient in the patient list
Ext.define('RaxaEmr.Outpatient.view.patient.draw', {
    extend: 'Ext.Container',
    xtype: 'draw-panel',
    id: 'drawPanel',
    // requires: ['RaxaEmr.Outpatient.view.patient.Grid', 'RaxaEmr.Outpatient.view.patient.medicationhistory', 'RaxaEmr.Outpatient.view.patient.refertodoc', 'RaxaEmr.Outpatient.view.patient.work', 'RaxaEmr.Outpatient.view.patient.labresulthistory'],
    config: {
            layout: 'hbox',
            // scroll: true,
            items: [{
                xtype: 'container',
                id: 'opdPatientDataEntry',
                width:STAGE_X,
                // height:760,
                height:STAGE_Y,
                layout: 'vbox',
                items: [{
                    scroll: false,
                    html: '<div id="container" ></div>'
                // }, {
                //     xtype: 'drug-grid',
                //     id: 'orderedDrugGrid',
                //     height: 250,
                //     border: 10,
                }],
                listeners: {
                    painted: function() {
                        console.log("painted");
                        setupCanvas();
                    }
                },
            // }, {
            //     // Buttons to navigate while using OPD 
            //     xtype: 'container',
            //     id: 'opdPatientDataEntryControls',
            //     width: 118,
            //     items: [{
            //         xtype: 'button',
            //         text: '+ Drug',
            //         id: 'plusDrugButton',
            //         handler: function () {
            //             Ext.getCmp('drugForm').setHidden(false);
            //             Ext.getCmp('drugaddform').reset();
            //             Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD); // to add more than one treatment
            //         },
            //     }],
            }]
        // }],
        
    },

    // updateRecord: function (newRecord) {
    //     if (newRecord) {
    //         this.down('#content').setData(newRecord.data);
    //     }
    // }
});

// }());