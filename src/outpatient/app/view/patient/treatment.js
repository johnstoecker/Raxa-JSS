// 'LockableCarousel' from: http://stackoverflow.com/questions/8283196/disable-dragging-in-carousel
// TODO: Temp workaround to have 2 views. Eventually at FB style grab side and scroll, like:
// ...
Ext.define('Ext.LockableCarousel', {
    extend: 'Ext.Carousel',
    id: 'WelcomeCarousel',
    initialize: function() {
        this.onDragOrig = this.onDrag;
        this.onDrag = function(e) {
            // console.log(e);
            // TODO: Fiddle with this. idea is that you cannot drag on the canvasas "drawable area"
            // TODO: Instead, catch event where (if mouse over floating "tab" (or "thin bar"), then you can drag it)
            if (e.startX > 710) {
            // if(!this.locked) {
                this.onDragOrig(e);
            }
        }
    },
    // locked: false,
    locked: true,
    lock: function() {
        this.locked = true;
    },
    unlock: function() {
        this.locked = false;
    }
});

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

Ext.define('RaxaEmr.Outpatient.view.patient.treatment', {
    // extend: 'Ext.Container',
    extend: 'Ext.LockableCarousel',

    xtype: 'treatment-panel',
    requires: ['RaxaEmr.Outpatient.view.patient.drugpanel', 'RaxaEmr.Outpatient.view.patient.treatmentsummery', 'Screener.store.druglist', 'Screener.model.druglist', 'RaxaEmr.Outpatient.view.patient.druglist', 'RaxaEmr.Outpatient.view.patient.drugform', 'RaxaEmr.Outpatient.view.patient.DrugGrid'],
    id: 'treatment-panel',
    initialize: function() {
        this.callParent(arguments);

        // TODO: That.add
        // var singleVisitHistory = that.add();
        // TODO: remove this 'cat' picture :P

        var patientManagementDashboard = this.add({
            xtype: 'panel',
            id: 'patientManagementDashboard',

            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // fullscreen: true,
            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 768,
            height: 200,

            // Here we specify the #id of the element we created in `index.html`
            // contentEl: 'content',
            // Style the content and make it scrollable
            // styleHtmlContent: true,
            // scrollable: true,
            layout: 'hbox',
            showAnimation: {
                type: 'slide',
                direction: 'down'
            },
            hideAnimation: {
                type: 'slideOut',
                direction: 'up'
            },
            // Insert a title docked at the top with a title
            items: [{
                xtype: 'button',
                text: 'PatientList',
                iconCls: 'team',
                iconMask: true, 
                handler: function() {
                    console.log('patientList patient patientManagementDashboard button');
                },
                margin: 30,
                flex: 1,
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'add',
                iconMask: true, 
                handler: function() {
                    console.log('add patient patientManagementDashboard button');
                },
                margin: 30,
                flex: 1,
            }, {
                xtype: 'button',
                text: 'Search',
                iconCls: 'search',
                iconMask: true,
                handler: function() {
                    console.log('search patient patientManagementDashboard button');
                },
                margin: 30,               
                flex: 1,
            }]
        });
    },
    config: {
        title: 'Treatment',
        indicator: false,
        activeItem: 0,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'My Toolbar',
            
                items: [{
                    xtype: 'button',  
                    iconCls: 'team',
                    iconMask: true,
                    badgeText: 2,   // TODO: update with # of patients in waiting list
                    // ui: 'plain',
                    handler: function() {
                        // TODO: Animate
                        var dash = Ext.getCmp('patientManagementDashboard');
                        var hidden = dash.getHidden();
                        if (hidden) { 
                            // dash.show({type: 'slide', direction: 'down'});
                            dash.show();
                            // http://senchaexamples.com/2012/03/01/specifying-which-side-of-the-viewport-an-ext-msg-component-animates-from-in-sencha-touch-2/
                            // hideAnimation: 'slideOut'
                        } else {
                            // dash.hide({type: 'fade'});
                            dash.hide();
                        }
                    }
                }]
            
        },{
            xtype: 'drug-panel'
        }, {
            xtype: 'draw-panel'
        }, {
            xtype: 'history-panel'
        }]
    }
});