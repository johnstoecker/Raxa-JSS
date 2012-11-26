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

Ext.define('RaxaEmr.Outpatient.view.Viewport', {
    extend: 'Ext.navigation.View',  // TODO: this shouldnt be a navigation view. not using "push" anymore
    xtype: 'mainview',
    id: 'mainview',
    //other view used in this view are included
    requires: ['RaxaEmr.Outpatient.view.patientlist', 'RaxaEmr.Outpatient.view.patient.more', 'RaxaEmr.Outpatient.view.patient.labresulthistorypanel', 'RaxaEmr.Outpatient.view.patient.refertodocpanel', 'RaxaEmr.Outpatient.view.patient.medicationhistorypanel', 'RaxaEmr.Outpatient.view.patient.diagnosis'],

    initialize: function() {
        this.callParent(arguments);
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
                    Ext.getCmp('patientManagementDashboard').hide();
                    Ext.getCmp('contact').show();
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

        var patientList = this.add({
            xtype: 'patientlist',
            // id: 'patientManagementDashboard',

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
            height: 600,

            // Here we specify the #id of the element we created in `index.html`
            // contentEl: 'content',
            // Style the content and make it scrollable
            // styleHtmlContent: true,
            // scrollable: true,
            layout: 'hbox',
            showAnimation: {
                type: 'slide',
                direction: 'up'
            },
            hideAnimation: {
                type: 'slideOut',
                direction: 'down'
            },
            // Insert a title docked at the top with a title
        });
    },

    config: {
        navigationBar: false,
        // autoDestroy: false,
        // fullscreen: true,
        // confirmation buttons in the toolbar in the different view like medication history, refer to doc panel etc.
        // navigationBar: {
        //     items: [{
        //         xtype: 'button',
        //         id: 'confirmmedicationhistory',
        //         text: 'Done',
        //         ui: 'confirm',
        //         align: 'right',
        //         hidden: true
        //     }, {
        //         xtype: 'button',
        //         id: 'confirmlabresulthistory',
        //         text: 'Done',
        //         ui: 'confirm',
        //         align: 'right',
        //         hidden: true
        //     }, {
        //         xtype: 'button',
        //         id: 'confirmrefertodoc',
        //         text: 'Done',
        //         ui: 'confirm',
        //         align: 'right',
        //         hidden: true
        //     }, ]
        // },
        //the basic view of the main page is loaded
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'My Toolbar',

            items: [{
                xtype: 'button',
                iconCls: 'team',
                iconMask: true,
                badgeText: 2,
                // TODO: update with # of patients in waiti
                // ui: 'plain',
                handler: function() { 
                    var dash = Ext.getCmp('patientManagementDashboard');
                    var hidden = dash.getHidden();
                    if(hidden) {
                        // dash.show({type: 'slide', direction: 'down'});
                        dash.show();
                        // http://senchaexamples.com/2012/03/01/specifying-
                        // hideAnimation: 'slideOut'
                    } else {
                        // dash.hide({type: 'fade'});
                        dash.hide();
                    }
                }
            }]

        }, {
        // xtype: 'patientlist',
        //     flex: 1,
        //     }, {    
        //     xtype: 'button',
        //     flex: 1,
        //     text: 'hello'
                xtype: 'patientlist-show'
            // }, {
                // xtype: 'treatment-panel'
        }]
    }
});