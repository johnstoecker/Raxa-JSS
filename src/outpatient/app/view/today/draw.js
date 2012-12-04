// A glorified Canvas, in Sencha
// - The magic is created using KineticJS framework.
// - Drawing and handling of canvas is managed in 'outpatient/app/drawLogic.js'
Ext.define('RaxaEmr.Outpatient.view.today.draw', {
  extend: 'Ext.Container',
  xtype: 'draw-panel',
  id: 'drawPanel',
  isCanvasSetup: false,
  isCanvasInteractive: true,

  // Methods to enable or disable interacting with the canvas (e.g. drawing, clicking buttons, etc)
  enableInteraction: function() {
    // TODO: Hide the blocking/masking layer
    return;
  }, 
  disableInteraction: function() {
    // TODO: Create a layer on higher z-value than previous layers.
    //  this prevents click events from going to lower layers
    //  could have a slight gray color, to indicate that no interaction is allowed 
    return;
  },
  getInteraction: function() {
    return this.isCanvasInteractive;
  },

  config: {
    layout: 'hbox',
    items: [{
      xtype: 'container',
      disabled: true,
      id: 'opdPatientDataEntry',
      width: STAGE_X,
      height: STAGE_Y,
      layout: 'vbox',
      items: [{
        scroll: false,
        html: '<div id="container" ></div>'
      }],

      listeners: {
        painted: function() {
          if (!this.isCanvasSetup) {
            console.log("Setting up canvas")
            // TODO: Load canvas according to which patient is selected
            setupCanvas();
            k2s.config.initStore();
            this.isCanvasSetup = true;
          }
        },
      },
    }]
  },
});
