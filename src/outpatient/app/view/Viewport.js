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
            title: 'dot',
            title: {
                  title: 'Doctor Name...',
                  // padding: '0 0 0 400',
                  // align: 'right',
                  // centered: false 
                },
            // title: 'yoyo',
            layout: {
                // align: 'right',
                // pack: 'justify',
                pack: 'left'
            },
            docked: 'top',
            items: [{
                xtype: 'button',
                id: 'dashboardToggleButton',
                iconCls: 'arrow_down',
                // iconAlign: 'right',
                text: 'Dashboard',
                iconMask: true,
                handler: function() {
                    var dash = Ext.getCmp('patientManagementDashboard');
                    var tb = Ext.getCmp('dashboardToggleButton');
                    var hidden = dash.getHidden();
                    if(hidden) {
                        dash.show();
                        tb.setIconCls('arrow_up');
                    } else {
                        dash.hide();
                        tb.setIconCls('arrow_down');
                    }

                    // Hide any other modals, like "patient list", "add new", "search"
                    Ext.getCmp('contact').hide();   // patient list
                    
                    var newPatientModal = Ext.getCmp('newPatient');
                    if (newPatientModal) {
                        newPatientModal.hide();    
                    }
                    
                    // search
                }
            // }, {
                // xtype: 'spacer',
                // width: 450,
            // }, {
            //     xtype: 'text',
            //     html: 'Dr. Name',
            // }, {
            //     xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'settings',
                iconMask: true,
                // iconAlign: 'right',
                text: 'Options'
            }, {
                xtype: 'spacer',
                width: 450
            }]
        }, {
            // Individual Patient record
            xtype: 'patientlist-show'
        },{
            // OPD Dashboard to add, select, search patients. (Hidden by default)
            xtype: 'opdDashboard'
        },{
            // Patient List. (Hidden by default)
            xtype: 'patientlist' 
        }]
    }
});