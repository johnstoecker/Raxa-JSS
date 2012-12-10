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
    //  changing to a Ext.panel/container causes opdLite canvas to not load. Why?
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    id: 'mainview',

    requires: ['RaxaEmr.Outpatient.view.patientlist', 'RaxaEmr.Outpatient.view.today.more', 'RaxaEmr.Outpatient.view.today.diagnosis', 'RaxaEmr.Outpatient.view.today.Dashboard'],
    config: {
        navigationBar: false,
        items: [{
            xtype: 'toolbar',
            title: {
                // Can set title and padding dynamically for logged in doctor
                id: 'mainviewToolbarTitle',
                title: 'Login Error!',
                padding: '0 0 0 30'
            },
            layout: {
                pack: 'left'
            },
            docked: 'top',
            items: [{
                xtype: 'button',
                id: 'dashboardToggleButton',
                iconCls: 'arrow_down',
                iconAlign: 'right',
                text: 'Dashboard',
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
                    Ext.getCmp('contact').hide(); // patient list
                    var newPatientModal = Ext.getCmp('newPatient');
                    if(newPatientModal) {
                        newPatientModal.hide();
                    }

                    // search
                }
            }, {
                xtype: 'spacer',
                width: 10
            }, {
                xtype: 'button',
                iconCls: 'settings',
                iconMask: true,
                iconAlign: 'right',
                text: 'Options', 
                handler: function(button, e, options) {
                    // Hide dashboard if it's in the way
                    var dash = Ext.getCmp('patientManagementDashboard');
                    dash.hide();
                    
                    // Show logout dialog
                    var logconfirm = button.LogoutButton;
                    if (!logconfirm) {
                        logconfirm = button.LogoutButton = Ext.widget('logoutConfirmPanel');
                    }
                    logconfirm.showBy(button);
                }
            }, {
                xtype: 'spacer',
                width: 340
            }]
        }, {
            // Individual Patient record
            xtype: 'patientlist-show'
        }, {
            // OPD Dashboard to add, select, search patients. (Hidden by default)
            xtype: 'opdDashboard'
        }, {
            // Patient List. (Hidden by default)
            xtype: 'patientlist'
        },{
            // Search Patient List. (Hidden by default)
            xtype: 'searchpatient'
        }]
    },

    // Sets name of logged in doctor on titlebar, in top right of screen
    setDoctorName: function(name) {
        var doctorName = Ext.getCmp('mainviewToolbarTitle');
        // Max doctor name length is < 20 characters before it will scroll off the screen of ipad2 resolution
        doctorName.setTitle("Dr. " + name);
        doctorName.setPadding('0 0 0 0')
    } 
});