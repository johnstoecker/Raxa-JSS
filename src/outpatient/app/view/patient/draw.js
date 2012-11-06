// TODO: put this in a singleton, so i can create several canvases

Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

window.name = "the window";

alice = {
  name: "Alice"
}

eve = {
  name: "Eve",
  
  talk: function(greeting) {
    console.log(greeting + ", my name is " + this.name);
  }
}

eve.talk("yo");
eve.talk.apply(alice, ["hello"]);
eve.talk.apply(window, ["hi"]);

// eve = {
//   talk: function(greeting) {
//     console.log(greeting + ", my name is " + this.name);
//   }.bind(alice) // <- bound to "alice"
// }

// eve.talk('evehello');

// Singleton to preserve namespace of variables
// (function () { 
    var canvasCount = 1;
/*
    // // var cCanvas = function(){
    // //     var that = this;
    // //     console.log('cCanvas scope');
    // //     console.log(that);
    //     // return 
    // cCanvas = {
    //         clicked : undefined,
    //         canvas : undefined,
    //         ctx : undefined,
    //         coords : undefined,
    //         offsetX : undefined, 
    //         offsetY : undefined, 
    //         oldX : undefined,
    //         oldY : undefined, 
    //         lowY : undefined,
    //         highY : undefined,

    //         handleMouseMove : function(e) {
    //             console.log("handleMouseMove");
    //             console.log("isClicked?");
    //             console.log(this.clicked);

    //             var x = e.offsetX,
    //                 y = e.offsetY;
    //             if (this.clicked) {
    //                 this.drawCircle(x, y);
    //                 this.updateBounds(y);
    //             }
    //         },

    //         updateBounds : function(y) {
    //             console.log("updateBounds");
    //             // console.log("updatebounds");
    //             if (y < lowY || lowY == undefined) { lowY = y; }
    //             if (y > highY || highY == undefined) { highY = y; }
    //         },

    //         handleMove : function(e) {
    //             console.log("handleMove");
    //             var x, y, i;
    //             for (i = 0; i < e.targetTouches.length; i++) {
    //                 x = e.targetTouches[i].clientX - offsetX;
    //                 y = e.targetTouches[i].clientY - offsetY;
    //                 this.drawCircle(x, y);
    //             }
    //         },
            
    //         setupCanvas : function() {
    //             console.log("setupCanvas");
    //             console.log("scope:");
    //             console.log(this);
    //             gloThis = this;
    //             this.canvas = document.getElementById('canvas1');
    //             this.canvas.width = 1000;
    //             this.canvas.height = 200;
    //             ctx = this.canvas.getContext("2d");
    //             coords = this.getCumulativeOffset(this.canvas);
    //             var that = this;
    //             console.log(that);
    //             window.onmousedown = function() {
    //                 console.log("onmousedown");
    //                 that.clicked = true;
    //             }
        
    //             window.onmouseup = function() {
    //                 that.oldX = that.oldY = that.clicked = false;
    //             }
                
    //             window.ontouchend = function() {
    //                 that.oldX = that.oldY = that.clicked = false;
    //             }

    //             offsetX = coords.x;
    //             offsetY = coords.y;
    //             this.drawBg(ctx);
    //         }.bind(this),
            
    //         drawBg : function() {
    //             console.log("drawBg");
    //             ctx.beginPath();
    //             ctx.moveTo(0, 75);
    //             ctx.lineTo(500, 75);
    //             ctx.stroke();
    //             ctx.font = "36pt Arial";
    //             ctx.fillStyle = "rgb(180,33,33)";
    //             ctx.fillText("X", 10, 75);
    //         },
            
    //         drawCircle : function(x, y) {
    //             console.log("drawCircle");
    //             ctx.strokeStyle = "rgb(55,55,255)";
    //             ctx.beginPath();
    //             if (oldX && oldY) {
    //                 ctx.moveTo(oldX, oldY);
    //                 ctx.lineTo(x, y);
    //                 ctx.stroke();
    //                 ctx.closePath();
    //             }
    //             oldX = x;
    //             oldY = y;
    //         },
            
    //         getCumulativeOffset : function(obj) {
    //             console.log("getCumulativeOffset");
    //             var left, top;
    //             left = top = 0;
    //             if (obj.offsetParent) {
    //                 do {
    //                     left += obj.offsetLeft;
    //                     top  += obj.offsetTop;
    //                 } while (obj = obj.offsetParent);
    //             }
    //             return {
    //                 x : left,
    //                 y : top
    //             };
    //         }
    //     };
    // // }

    // var GalleryComposite = function () {
    //     this.clicked = false;
    //     this.canvas;
    //     this.ctx;
    //     this.coords;
    //     this.offsetX; 
    //     this.offsetY; 
    //     this.oldX;
    //     this.oldY; 
    //     this.lowY;
    //     this.highY;

    //     // Setup window events
    //     // TODO: how is this dealt with if > 1 canvas
    //     window.onmousedown = function() {
    //         console.log("onmousedown");
    //         this.clicked = true;
    //     }
        
    //     window.onmouseup = function() {
    //         this.oldX = this.oldY = this.clicked = false;
    //     }
        
    //     window.ontouchend = function() {
    //         this.oldX = this.oldY = this.clicked = false;
    //     }
    // }

    // GalleryComposite.prototype = {
    //     handleMouseMove : function(e) {
    //         console.log("handleMouseMove");
    //         console.log("isClicked?");
    //         console.log(this.clicked);

    //         var x = e.offsetX,
    //             y = e.offsetY;
    //         if (this.clicked) {
    //             this.drawCircle(x, y);
    //             this.updateBounds(y);
    //         }
    //     },

    //     updateBounds : function(y) {
    //         console.log("updateBounds");
    //         // console.log("updatebounds");
    //         if (y < lowY || lowY == undefined) { lowY = y; }
    //         if (y > highY || highY == undefined) { highY = y; }
    //     },

    //     handleMove : function(e) {
    //         console.log("handleMove");
    //         var x, y, i;
    //         for (i = 0; i < e.targetTouches.length; i++) {
    //             x = e.targetTouches[i].clientX - offsetX;
    //             y = e.targetTouches[i].clientY - offsetY;
    //             this.drawCircle(x, y);
    //         }
    //     },
        
    //     setupCanvas : function() {
    //         console.log("setupCanvas");
    //         console.log("scope:");
    //         console.log(this);
    //         this.canvas = document.getElementById('canvas1');
    //         this.canvas.width = 1000;
    //         this.canvas.height = 200;
    //         ctx = this.canvas.getContext("2d");
    //         coords = this.getCumulativeOffset(this.canvas);
    //         offsetX = coords.x;
    //         offsetY = coords.y;
    //         this.drawBg(ctx);
    //     },
        
    //     drawBg : function() {
    //         console.log("drawBg");
    //         ctx.beginPath();
    //         ctx.moveTo(0, 75);
    //         ctx.lineTo(500, 75);
    //         ctx.stroke();
    //         ctx.font = "36pt Arial";
    //         ctx.fillStyle = "rgb(180,33,33)";
    //         ctx.fillText("X", 10, 75);
    //     },
        
    //     drawCircle : function(x, y) {
    //         console.log("drawCircle");
    //         ctx.strokeStyle = "rgb(55,55,255)";
    //         ctx.beginPath();
    //         if (oldX && oldY) {
    //             ctx.moveTo(oldX, oldY);
    //             ctx.lineTo(x, y);
    //             ctx.stroke();
    //             ctx.closePath();
    //         }
    //         oldX = x;
    //         oldY = y;
    //     },
        
    //     getCumulativeOffset : function(obj) {
    //         console.log("getCumulativeOffset");
    //         var left, top;
    //         left = top = 0;
    //         if (obj.offsetParent) {
    //             do {
    //                 left += obj.offsetLeft;
    //                 top  += obj.offsetTop;
    //             } while (obj = obj.offsetParent);
    //         }
    //         return {
    //             x : left,
    //             y : top
    //         };
    //     }.bind(this)
    // }


    // var GalleryComposite = function () {
    //     this.clicked = false;
    //     this.canvas;
    //     this.ctx;
    //     this.coords;
    //     this.offsetX; 
    //     this.offsetY; 
    //     this.oldX;
    //     this.oldY; 
    //     this.lowY;
    //     this.highY;

    //     // Setup window events
    //     // TODO: how is this dealt with if > 1 canvas
    //     window.onmousedown = function() {
    //         console.log("onmousedown");
    //         this.clicked = true;
    //     }
        
    //     window.onmouseup = function() {
    //         this.oldX = this.oldY = this.clicked = false;
    //     }
        
    //     window.ontouchend = function() {
    //         this.oldX = this.oldY = this.clicked = false;
    //     }
    // }

    // GalleryComposite.prototype = {
    //     handleMouseMove : function(e) {
    //         console.log("handleMouseMove");
    //         console.log("isClicked?");
    //         console.log(this.clicked);

    //         var x = e.offsetX,
    //             y = e.offsetY;
    //         if (this.clicked) {
    //             this.drawCircle(x, y);
    //             this.updateBounds(y);
    //         }
    //     },

    //     updateBounds : function(y) {
    //         console.log("updateBounds");
    //         // console.log("updatebounds");
    //         if (y < lowY || lowY == undefined) { lowY = y; }
    //         if (y > highY || highY == undefined) { highY = y; }
    //     },

    //     handleMove : function(e) {
    //         console.log("handleMove");
    //         var x, y, i;
    //         for (i = 0; i < e.targetTouches.length; i++) {
    //             x = e.targetTouches[i].clientX - offsetX;
    //             y = e.targetTouches[i].clientY - offsetY;
    //             this.drawCircle(x, y);
    //         }
    //     },
        
    //     setupCanvas : function() {
    //         console.log("setupCanvas");
    //         console.log("scope:");
    //         console.log(this);
    //         this.canvas = document.getElementById('canvas1');
    //         this.canvas.width = 1000;
    //         this.canvas.height = 200;
    //         ctx = this.canvas.getContext("2d");
    //         coords = this.getCumulativeOffset(this.canvas);
    //         offsetX = coords.x;
    //         offsetY = coords.y;
    //         this.drawBg(ctx);
    //     },
        
    //     drawBg : function() {
    //         console.log("drawBg");
    //         ctx.beginPath();
    //         ctx.moveTo(0, 75);
    //         ctx.lineTo(500, 75);
    //         ctx.stroke();
    //         ctx.font = "36pt Arial";
    //         ctx.fillStyle = "rgb(180,33,33)";
    //         ctx.fillText("X", 10, 75);
    //     },
        
    //     drawCircle : function(x, y) {
    //         console.log("drawCircle");
    //         ctx.strokeStyle = "rgb(55,55,255)";
    //         ctx.beginPath();
    //         if (oldX && oldY) {
    //             ctx.moveTo(oldX, oldY);
    //             ctx.lineTo(x, y);
    //             ctx.stroke();
    //             ctx.closePath();
    //         }
    //         oldX = x;
    //         oldY = y;
    //     },
        
    //     getCumulativeOffset : function(obj) {
    //         console.log("getCumulativeOffset");
    //         var left, top;
    //         left = top = 0;
    //         if (obj.offsetParent) {
    //             do {
    //                 left += obj.offsetLeft;
    //                 top  += obj.offsetTop;
    //             } while (obj = obj.offsetParent);
    //         }
    //         return {
    //             x : left,
    //             y : top
    //         };
    //     }
    // }

    // var clickableCanvas = function() {
    //     var clicked, ctx, coords, offsetX, offsetY, oldX, oldY, lowY, highY;
    //     var that = this;
    //     console.log('clickableCanvas scope:');
    //     console.log(that);

    //     var methods = {
    //         canvas:null,

    //         handleMouseMove : function(e) {
    //             var x = e.offsetX,
    //                 y = e.offsetY;
    //             if (clicked) {
    //                 this.drawCircle(x, y);
    //                 this.updateBounds(y);
    //             }
    //         },

    //         updateBounds : function(y) {
    //             // console.log("updatebounds");
    //             if (y < lowY || lowY == undefined) { lowY = y; }
    //             if (y > highY || highY == undefined) { highY = y; }
    //         },

    //         handleMove : function(e) {
    //             var x, y, i;
    //             for (i = 0; i < e.targetTouches.length; i++) {
    //                 x = e.targetTouches[i].clientX - offsetX;
    //                 y = e.targetTouches[i].clientY - offsetY;
    //                 this.drawCircle(x, y);
    //             }
    //         },
            
    //         setupCanvas : function() {

    //             console.log("setup canvas");
    //             this.canvas = document.getElementById('canvas1');
    //             this.canvas.width = 1000;
    //             this.canvas.height = 200;
    //             ctx = this.canvas.getContext("2d");
    //             coords = this.getCumulativeOffset(this.canvas);
    //             offsetX = coords.x;
    //             offsetY = coords.y;
    //             this.drawBg(ctx);
    //         },
            
    //         drawBg : function() {
    //             ctx.beginPath();
    //             ctx.moveTo(0, 75);
    //             ctx.lineTo(500, 75);
    //             ctx.stroke();
    //             ctx.font = "36pt Arial";
    //             ctx.fillStyle = "rgb(180,33,33)";
    //             ctx.fillText("X", 10, 75);
    //         },
            
    //         drawCircle : function(x, y) {
    //             ctx.strokeStyle = "rgb(55,55,255)";
    //             ctx.beginPath();
    //             if (oldX && oldY) {
    //                 ctx.moveTo(oldX, oldY);
    //                 ctx.lineTo(x, y);
    //                 ctx.stroke();
    //                 ctx.closePath();
    //             }
    //             oldX = x;
    //             oldY = y;
    //         },
            
    //         getCumulativeOffset : function(obj) {
    //             var left, top;
    //             left = top = 0;
    //             if (obj.offsetParent) {
    //                 do {
    //                     left += obj.offsetLeft;
    //                     top  += obj.offsetTop;
    //                 } while (obj = obj.offsetParent);
    //             }
    //             return {
    //                 x : left,
    //                 y : top
    //             };
    //         }

    //     };
        
    //     // Setup window events
    //     // TODO: how is this dealt with if > 1 canvas
    //     window.onmousedown = function() {
    //         clicked = true;
    //     }
        
    //     window.onmouseup = function() {
    //         oldX = oldY = clicked = false;
    //     }
        
    //     window.ontouchend = function() {
    //         oldX = oldY = clicked = false;
    //     }

    //     return methods;

    // };
*/

    var canvas, clicked, ctx, coords, offsetX, offsetY, oldX, oldY, lowY, highY;
    // var CANVAS_BG_COLOR = "rgb(204,204,204)";#cccccc
    var CANVAS_BG_COLOR = "rgb(238,238,238)";   // #eeeeee
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
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext("2d");
        coords = getCumulativeOffset(canvas);
        offsetX = coords.x;
        offsetY = coords.y;
        drawBg(ctx);
        activatePen();
    }
    
    function drawBg() {
        ctx.beginPath();
        ctx.fillStyle = CANVAS_BG_COLOR;
    }

    function activateEraser() {
        currentPenColor = CANVAS_BG_COLOR;
        ctx.lineWidth = 30;
    }

    function activatePen() {
        currentPenColor = CANVAS_PEN_COLOR
        ctx.lineWidth = 5;
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
                height:760,
                items: [{
                    scroll: false,
                    html: "<canvas width='100' height='100' id='canvas1'>Canvas not supported.</canvas>"
                }],
                listeners: {
                    painted: function() {
                        console.log("painted");
                        eve.talk('inside paited');
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
                // }, {
                //     xtype: 'button',
                //     text: '+ Drug',
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