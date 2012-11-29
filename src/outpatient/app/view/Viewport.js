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
    requires: ['RaxaEmr.Outpatient.view.patientlist', 'RaxaEmr.Outpatient.view.patient.more', 'RaxaEmr.Outpatient.view.patient.labresulthistorypanel', 'RaxaEmr.Outpatient.view.patient.refertodocpanel', 'RaxaEmr.Outpatient.view.patient.medicationhistorypanel', 'RaxaEmr.Outpatient.view.patient.diagnosis', 'RaxaEmr.Outpatient.view.patient.Dashboard'],

    config: {
        navigationBar: false,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: '',
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
                    Ext.getCmp('contact').hide();   // patient list
                    
                    var newPatientModal = Ext.getCmp('newPatient');
                    if (newPatientModal) {
                        newPatientModal.hide();    
                    }
                    
                    // search
                }
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