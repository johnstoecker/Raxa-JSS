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
    BUTTON_FLEX: 1,
    BUTTON_DIM: 96,
    BUTTON_IMG_DIM: 86,

    TEXT_WIDTH: 100,
    TEXT_MARGIN: '44 0 0 10',
    TEXT_FLEX: 1,
    TEXT_PADDING: 0,

    // TODO: Create CSS tags for the various in-line style tags used here
    FONT_STYLE: 'color:white;font-family:"Helvetica";font-size:16px',
    BUTTON_STYLE: 'background: #0a070b;text-align:center;',
    BACKGROUND_STYLE: 'background-color: #11598c;border:solid #1159ac;'
};

Ext.define('RaxaEmr.Outpatient.view.today.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'opdDashboard',
    id: 'patientManagementDashboard',
    requires: ['RaxaEmr.Outpatient.view.patient.searchpatient'],
    config: {
        listeners: {
            // Toggle arrow on button up/down when showing/hiding the dashboard
            show: function() {
                Ext.getCmp('dashboardToggleButton').setIconCls('arrow_up');
            },
            hide: function() {
                Ext.getCmp('dashboardToggleButton').setIconCls('arrow_down')
            }
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
            html: '<img src="resources/images/icons/dashboard_patient_queue.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            listeners: {
                tap: function() {
                    Ext.getCmp('patientManagementDashboard').hide();
                    Ext.getCmp('contact').show();
                }
            }
        }, {
            html: '<div ontouchstart="Ext.getCmp(\'dashboardPatientListButton\').fireEvent(\'tap\');"> Select a patient from the queue</div',
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
            html: '<img src="resources/images/icons/dashboard_add_patient.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            listeners: {
                tap: function() {
                    Ext.getCmp('newPatient').show();
                    Ext.getCmp('patientManagementDashboard').hide();
                }
            }
        }, {
            html: '<div ontouchstart="Ext.getCmp(\'addPatientButton\').fireEvent(\'tap\');"> Add a new patient to EMR</div>',
            style: DASHBOARD_CONSTANTS.FONT_STYLE,
            width: DASHBOARD_CONSTANTS.TEXT_WIDTH,
            flex: DASHBOARD_CONSTANTS.TEXT_FLEX,
            margin: DASHBOARD_CONSTANTS.TEXT_MARGIN,
            padding: DASHBOARD_CONSTANTS.TEXT_PADDING
        }, {
            xtype: 'button',
            text: 'Search',
            id: 'searchPatientButtonOnDashboard',
            height: DASHBOARD_CONSTANTS.BUTTON_DIM,
            width: DASHBOARD_CONSTANTS.BUTTON_DIM,
            margin: DASHBOARD_CONSTANTS.BUTTON_MARGIN,
            flex: DASHBOARD_CONSTANTS.BUTTON_FLEX,
            style: DASHBOARD_CONSTANTS.BUTTON_STYLE,
            html: '<img src="resources/images/icons/dashboard_search_patient.png" width="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '" height="' + DASHBOARD_CONSTANTS.BUTTON_IMG_DIM + '"/>',
            disabled: false,
            listeners: {
                tap: function() {
                    Ext.getCmp('patientManagementDashboard').hide();
    	            Ext.getCmp('searchpatient').show();
                }
            },
        }, {
            html: '<div ontouchstart="Ext.getCmp(\'searchPatientButtonOnDashboard\').fireEvent(\'tap\');">Search for a patient in EMR',
            style: DASHBOARD_CONSTANTS.FONT_STYLE,
            width: DASHBOARD_CONSTANTS.TEXT_WIDTH,
            flex: DASHBOARD_CONSTANTS.TEXT_FLEX,
            margin: DASHBOARD_CONSTANTS.TEXT_MARGIN,
            padding: DASHBOARD_CONSTANTS.TEXT_PADDING
        }]
    }
});