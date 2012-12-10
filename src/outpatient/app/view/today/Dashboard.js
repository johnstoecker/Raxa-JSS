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

// TODO: move to util
var DASHBOARD_CONSTANTS = {
    BUTTON_MARGIN: '44 0 0 30',
    //'60 0 0 40',
    BUTTON_FLEX: 1,
    BUTTON_DIM: 96,
    BUTTON_IMG_DIM: 86,

    TEXT_WIDTH: 100,
    TEXT_MARGIN: '44 0 0 10',
    // 60 20 0 5
    TEXT_FLEX: 1,
    TEXT_PADDING: 0,

    // TODO: Create CSS tags for the various in-line style tags used here
    FONT_STYLE: 'color:white;font-family:"Helvetica";font-size:16px',
    BUTTON_STYLE: 'background: #53BF9A;text-align:center;',
    BACKGROUND_STYLE: 'background-color: #11598c;border:solid #1159ac;'
    // BACKGROUND_STYLE: 'background-color: #11598c;'
};

Ext.define('RaxaEmr.Outpatient.view.today.Dashboard', {

    extend: 'Ext.Container',
    xtype: 'opdDashboard',
    id: 'patientManagementDashboard',
    config: {
        listeners: {
            show: function() {
                Ext.getCmp('dashboardToggleButton').setIconCls('arrow_up');
            },
            hide: function() {
                Ext.getCmp('dashboardToggleButton').setIconCls('arrow_down')
            }
        },

        // Constants
        DASHBOARD: {
            BUTTON_MARGIN: '44 0 0 30',
            //'60 0 0 40';
        },

        // Background color
        // style: 'background-color: #82b0e1;',
        // style: 'background-color: #11598c;',
        // style: 'background-color: #4d7abd;',
        style: DASHBOARD_CONSTANTS.BACKGROUND_STYLE,

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
            text: 'Patient List',
            id: 'dashboardPatientListButton',
            height: DASHBOARD_CONSTANTS.BUTTON_DIM,
            width: DASHBOARD_CONSTANTS.BUTTON_DIM,
            margin: DASHBOARD_CONSTANTS.BUTTON_MARGIN,
            flex: DASHBOARD_CONSTANTS.BUTTON_FLEX,
            style: DASHBOARD_CONSTANTS.BUTTON_STYLE,
            html: '<img src="resources/images/icons/dashboard_patient_queue64x64.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            handler: function() {
                console.log('patientList patient patientManagementDashboard button');
                Ext.getCmp('patientManagementDashboard').hide();
                Ext.getCmp('contact').show();
            },
        }, {
            html: 'Select a patient from the queue',
            style: DASHBOARD_CONSTANTS.FONT_STYLE,
            width: DASHBOARD_CONSTANTS.TEXT_WIDTH,
            flex: DASHBOARD_CONSTANTS.TEXT_FLEX,
            margin: DASHBOARD_CONSTANTS.TEXT_MARGIN,
            padding: DASHBOARD_CONSTANTS.TEXT_PADDING
        }, {
            xtype: 'button',
            id: 'addPatientButton',
            height: DASHBOARD_CONSTANTS.BUTTON_DIM,
            width: DASHBOARD_CONSTANTS.BUTTON_DIM,
            margin: DASHBOARD_CONSTANTS.BUTTON_MARGIN,
            flex: DASHBOARD_CONSTANTS.BUTTON_FLEX,
            style: DASHBOARD_CONSTANTS.BUTTON_STYLE,
            html: '<img src="resources/images/icons/dashboard_add_patient64x64.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            handler: function() {
                console.log('add patient patientManagementDashboard button');
                Ext.getCmp('patientManagementDashboard').hide();
            },
        }, {
            html: 'Add a new patient to EMR',
            style: DASHBOARD_CONSTANTS.FONT_STYLE,
            width: DASHBOARD_CONSTANTS.TEXT_WIDTH,
            flex: DASHBOARD_CONSTANTS.TEXT_FLEX,
            margin: DASHBOARD_CONSTANTS.TEXT_MARGIN,
            padding: DASHBOARD_CONSTANTS.TEXT_PADDING
        }, {
            xtype: 'button',
            text: 'Search',
            height: DASHBOARD_CONSTANTS.BUTTON_DIM,
            width: DASHBOARD_CONSTANTS.BUTTON_DIM,
            margin: DASHBOARD_CONSTANTS.BUTTON_MARGIN,
            flex: DASHBOARD_CONSTANTS.BUTTON_FLEX,
            style: DASHBOARD_CONSTANTS.BUTTON_STYLE,
            html: '<img src="resources/images/icons/dashboard_search_patient64x64.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            //TODO Make this diabled after Demo as image is faded in view if button is diabled
            disabled: false,
            handler: function() {
                console.log('search patient patientManagementDashboard button');
                Ext.getCmp('patientManagementDashboard').hide();
            },
        }, {
            html: 'Search for a patient in EMR',
            style: DASHBOARD_CONSTANTS.FONT_STYLE,
            width: DASHBOARD_CONSTANTS.TEXT_WIDTH,
            flex: DASHBOARD_CONSTANTS.TEXT_FLEX,
            margin: DASHBOARD_CONSTANTS.TEXT_MARGIN,
            padding: DASHBOARD_CONSTANTS.TEXT_PADDING
        }]
    }
});