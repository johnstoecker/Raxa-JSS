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

var DASHBOARD_BUTTON_MARGIN = 50;
Ext.define('RaxaEmr.Outpatient.view.today.Dashboard', {
    extend: 'Ext.Panel',    // TODO: Container
    xtype: 'opdDashboard',
    id: 'patientManagementDashboard',   
    config: {

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
    height: 250,
    style: 'background: #136198;',
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
        text: 'Patient List',
        id: 'dashboardPatientListButton',
        height: 128,
        width: 128,
        style: 'background: #53BF9A;',
        html: '<div style="text-align:center;"><img src="resources/images/icons/dashboard_search_patient_cropped.png" width="126" height="113"/></div>',
        handler: function() {
            console.log('patientList patient patientManagementDashboard button');
            Ext.getCmp('patientManagementDashboard').hide();
            Ext.getCmp('contact').show();
        },
        margin: DASHBOARD_BUTTON_MARGIN,
        flex: 1,
    }, {
        xtype: 'button',
        id: 'addPatientButton',
        height: 128,
        width: 128,
        style: 'background: #53BF9A;',
        html: '<div style="text-align:center;"><img src="resources/images/icons/dashboard_add_patient.png" width="128" height="128"/></div>',
        handler: function() {
            console.log('add patient patientManagementDashboard button');
            Ext.getCmp('patientManagementDashboard').hide();
        },
        margin: DASHBOARD_BUTTON_MARGIN,
        flex: 1,
        // TODO: Hidden for now. Add support for patient search
    }, {
        xtype: 'button',
        text: 'Search',
        height: 128,
        width: 128,
        style: 'background: #53BF9A;',
        html: '<div style="text-align:center;"><img src="resources/images/icons/dashboard_search_patient.png" width="128" height="128"/></div>',        
        //TODO Make this diabled after Demo as image is faded in view if button is diabled
        disabled: false,
        handler: function() {
            console.log('search patient patientManagementDashboard button');
            Ext.getCmp('patientManagementDashboard').hide();
        },
        margin: DASHBOARD_BUTTON_MARGIN,
        flex: 1,
    }]
    }
});