// A glorified Canvas, in Sencha
// - The magic is created using KineticJS framework.
// - Drawing and handling of canvas is managed in 'outpatient/app/drawLogic.js'
Ext.define('RaxaEmr.Outpatient.view.today.draw', {
  extend: 'Ext.Container',
  xtype: 'draw-panel',
  id: 'drawPanel',
  isCanvasSetup: false,

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
            this.canvas = setupCanvas();
            k2s.canvas = this.canvas;
            k2s.initCanvasData();
            this.isCanvasSetup = true;
          }
        },
      },
    }]
  },
});
