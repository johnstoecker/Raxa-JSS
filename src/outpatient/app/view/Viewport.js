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
    // TODO: this shouldnt be a navigation view. not using "push" anymore. However,
    //  changing to a Ext.panel/container causes patient list to fail to load. Why?
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    id: 'mainview',
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

            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 768,
            height: 200,

            layout: 'hbox',
            showAnimation: {
                type: 'slide',
                direction: 'down'
            },
            hideAnimation: {
                type: 'slideOut',
                direction: 'up'
            },

            items: [{
                xtype: 'button',
                text: 'PatientList',
                id: 'dashboardPatientListButton',
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
                id: 'addPatientButton',
                text: 'Add',
                iconCls: 'add',
                iconMask: true,
                handler: function() {
                    console.log('add patient patientManagementDashboard button');
                    Ext.getCmp('patientManagementDashboard').hide();
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
                    Ext.getCmp('patientManagementDashboard').hide();
                },
                margin: 30,
                flex: 1,
            }]
        });

        var patientList = this.add({
            xtype: 'patientlist',

            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 768,
            height: 600,

            layout: 'hbox',
            showAnimation: {
                type: 'slide',
                direction: 'up'
            },
            hideAnimation: {
                type: 'slideOut',
                direction: 'down'
            },
        });
    },

    config: {
        navigationBar: false,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'My Toolbar',

            items: [{
                xtype: 'button',
                id: 'dashboardToggleButton',
                iconCls: 'team',
                iconMask: true,
                handler: function() {
                    var dash = Ext.getCmp('patientManagementDashboard');
                    var hidden = dash.getHidden();
                    if(hidden) {
                        dash.show();
                    } else {
                        dash.hide();
                    }

                    // Hide any other modals, like "patient list", "add new", "search"
                    Ext.getCmp('contact').hide();   // patient list
                    
                    var newPatientModal = Ext.getCmp('newPatient');
                    if (newPatientModal) {
                        newPatientModal.hide();    
                    }
                    
                    // search
                }
            }]
        }, {
            xtype: 'patientlist-show'
        }]
    }
});