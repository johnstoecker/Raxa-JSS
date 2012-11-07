// (function () { 
    var canvasCount = 1;

    // TODO: Drawing tutorials
    // - http://jsfiddle.net/NWBV4/10/
    // - http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

    var canvas, clicked, ctx, coords, offsetX, offsetY, oldX, oldY, lowY, highY;
    var CANVAS_BG_COLOR = "rgb(238,238,238)";
    var CANVAS_TRANSPARENT_COLOR = "rgba(255,255,255,)";
    var CANVAS_PEN_COLOR = "rgb(55,55,255)";
    var currentPenColor, currentBgColor;

    function handleMouseMove(e) {
        var x = e.offsetX,
            y = e.offsetY;
        if (clicked) {
            drawCircle(x, y);
            updateBounds(y);
        }
    }

    function updateBounds(y) {
        // console.log("updatebounds");
        if (y < lowY || lowY == undefined) { lowY = y; }
        if (y > highY || highY == undefined) { highY = y; }
    }

    function handleMove(e) {
        var x, y, i;
        for (i = 0; i < e.targetTouches.length; i++) {
            x = e.targetTouches[i].clientX - offsetX;
            y = e.targetTouches[i].clientY - offsetY;
            drawCircle(x, y);
        }
    }
    
    function setupCanvas(w, h) {
        console.log("setup canvas");
        
        canvas = document.getElementById('canvas1');
        canvas2 = document.getElementById('canvas2');
        canvas.width = w;
        canvas.height = h;
        canvas2.width = w;
        canvas2.height = h;
        
        ctx = canvas.getContext("2d");
        ctx2 = canvas2.getContext("2d");
        coords = getCumulativeOffset(canvas);
        offsetX = coords.x;
        offsetY = coords.y;
        // drawBg(ctx);

        activatePen();

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';  // Smoothes drawing considerably        
    }
    
    // function drawBg() {
    //     ctx.beginPath();
    //     ctx.fillStyle = CANVAS_BG_COLOR;
    // }

    function activateEraser() {
        currentPenColor = CANVAS_BG_COLOR;
        currentPenColor = CANVAS_TRANSPARENT_COLOR;
        ctx.lineWidth = 40;


        // ctx.globalCompositeOperation
        // "source-over"
        // ctx.globalCompositeOperation = 'copy'
        // "copy"
    }

    function activatePen() {
        currentPenColor = CANVAS_PEN_COLOR
        ctx.lineWidth = 5;
    }

    function drawTextAtLowPoint() {
        var pxSize = 20;
        ctx2.font = "bold " + pxSize + "px sans-serif";
        
        ctx2 = canvas.getContext("2d");
        ctx2.strokeStyle = CANVAS_PEN_COLOR;
        ctx2.fillText("hello world", 1, 1);
        
        // update high low values
        highY += pxSize;
        lowY -= pxSize; 
        lowY = Math.max(lowY,0);

        ctx2.fillText("beyond highest y value", 30, highY);
        ctx2.fillText("beyond lowest y value", 30, lowY);
    }
    
    function drawCircle(x, y) {
        ctx.strokeStyle = currentPenColor;
        ctx.beginPath();
        if (oldX && oldY) {
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
        }
        oldX = x;
        oldY = y;
    }
    
    function getCumulativeOffset(obj) {
        var left, top;
        left = top = 0;
        if (obj.offsetParent) {
            do {
                left += obj.offsetLeft;
                top  += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return {
            x : left,
            y : top
        };
    }
        
    // Setup window events
    // TODO: how is this dealt with if > 1 canvas
    window.onmousedown = function() {
        clicked = true;
    }
    
    window.onmouseup = function() {
        oldX = oldY = clicked = false;
    }
    
    window.ontouchend = function() {
        oldX = oldY = clicked = false;
    }


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
        // title: 'Outpatient Department',
        // border: true,
        // cls: 'x-show-contact',
        // ui: 'round',
        // id: 'more',
        // layout: 'vbox',
        // record: null,
        // items: [{
        //     id: 'content',
        //     tpl: ['<div class="top">', '<div style="float:left;width:50%;">', '<div class="headshot" style="float:left;background-image:url({image});">', '</div>', '<div class="name" style="float:left;width:80%;">', '{display}', '</br>', '<span>From : -- </span>', '</br>', '</div>', '</div>', '<div style="float:left;width:50%;">', '<div class="name_small" style="float:left;width:50%;">', '<span> Age : {age} </span>', '<span>ID : --</span>', '</br>', '</div>', '<div class="name_right" style="float:left;width:50%;">', '<h3>--</h3>', '<span></span>', '</div>', '</div>', '</div>'].join('')
        // },
        // {
        //     xtype: 'vitalsGrid',
        //     height: 84
        //     /*border: 10,*/
        // }, {
        //     // Canvas area
        //     xtype: 'container',
            layout: 'hbox',
            // scroll: true,
            items: [{
                xtype: 'container',
                id: 'opdPatientDataEntry',
                width:650,
                // height:760,
                height:400,
                layout: 'vbox',
                items: [{
                    scroll: false,
                    html: ["<div style='position: relative;'>",
                        "<canvas width='100' height='100' id='canvas2'",
                        " style='z-index:0;position:absolute;left:0px;top:0px;border:1px dotted;'>",
                        "Canvas not supported.</canvas>",
                        "<canvas width='100' height='100' id='canvas1'",
                        " style='z-index:2;position:absolute;left:0px;top:0px;border:1px dotted;'  >",
                        "Canvas not supported.</canvas>",
                        "</div>"].join("")
                }, {
                    xtype: 'drug-grid',
                    id: 'orderedDrugGrid',
                    height: 250,
                    border: 10,
                }],
                listeners: {
                    painted: function() {
                        console.log("painted");
                        // eve.talk('inside paited');
                        // var cc = clickableCanvas();
                        // cc.setupCanvas();
                        // cc.canvas.ontouchmove = cc.handleMove;
                        // cc.canvas.onmousemove = cc.handleMouseMove;
                        // var cc = clickableCanvas();
                        var size = Ext.getCmp("opdPatientDataEntry").getSize();
                        console.log("width", size.width, "height", size.height);
                        setupCanvas(size.width, size.height);
                        canvas.ontouchmove = handleMove;
                        canvas.onmousemove = handleMouseMove;
                    }
                },
            }, {
                // Buttons to navigate while using OPD 
                xtype: 'container',
                id: 'opdPatientDataEntryControls',
                width: 118,
                items: [{
                    xtype: 'button',
                    text: 'Draw',
                    handler: function() {
                        activatePen();
                    }
                }, {
                    xtype: 'button',
                    text: 'Erase',
                    handler: function() {
                        activateEraser();
                    }
                }, {
                    xtype: 'button',
                    text: '+ Drug',
                    handler: function () {
                        Ext.getCmp('drugForm').setHidden(false);
                        Ext.getCmp('drugaddform').reset();
                        Ext.getCmp('treatment-panel').setActiveItem(TREATMENT.ADD); // to add more than one treatment
                    }
                }, {
                    xtype: 'button',
                    text: '+ Text',
                    handler: function () {
                        drawTextAtLowPoint();
                    }
                // }, {
                //     xtype: 'button',
                //     text: '+ Lab',
                // }, {
                //     xtype: 'button',
                //     text: 'Drug Hist',
                // }, {
                //     xtype: 'button',
                //     text: 'Lab Hist',
                // }, {
                //     // Spacer
                //     xtype: 'button',
                //     text: '-',
                //     disabled: true
                // }, {
                //     xtype: 'button',
                //     text: 'Submit',
                //     handler: function(b, e) {
                //         var c = Ext.getCmp('opdPatientDataEntry');
                //         canvasCount++;
                //         c.insert(Ext.create('Ext.Container'), {
                //             scroll: false,
                //             html: "<canvas id='canvas" +canvasCount + "' width='100' height='100'>Canvas not supported.</canvas>"
                //         });
                //         // setupCanvas();
                //         // canvas.ontouchmove = handleMove;
                //         // canvas.onmousemove = handleMouseMove;

                //         // var img = canvas.toDataURL();

                //         // alert("Saving to file....not really.");
                //         /*
                //         Ext.Ajax.request({
                //             url: 'canvas-upload.php',
                //             method: 'POST',
                //             params: {
                //                 img: img
                //             }
                //         });
                //         */
                    // },
                    // scope: this
                }]
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