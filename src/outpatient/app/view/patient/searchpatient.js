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
Ext.define('RaxaEmr.Outpatient.view.patient.searchpatient', {
    extend: 'Ext.List',
    xtype: 'searchpatient',
    id: 'searchpatient',

    config: {
        store: 'PatientSearch',

        // Floating by default
        left: (768 - 700) / 2,
        top: 60,

        // Modal
        modal: true,
        floating: true,
        hideOnMaskTap: true,

        hidden: true,

        // Size and layout
        width: 700,
        height: 400,

        // Show / Hide Animations
        showAnimation: {
            type: 'slide',
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'down'
        },

        // CSS options
        cls: 'x-contacts',
        // ui: 'round',
        styleHtmlContent: true,
        styleHtmlCls: 'testHtml',
        overItemCls: 'testOver',
        selectedItemCls: 'testSelect',
        pressedCls: 'testPress',

        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Search Patient'
        }, {
            xtype: 'searchfield',
            docked: 'top',
            margin: '20 50 20 50',
            label: 'Search Patient',
            listeners: {
                keyup: function (field) {

                    Ext.getStore('PatientSearch').getProxy().setUrl(HOST + '/ws/rest/v1/patient?v=full&q=' + field.getValue());

                    Ext.getStore('PatientSearch').load({
                        scope: this,
                        callback: function (records, operation, success) {
                            if (success) {
                                console.log('search returned ' + records.length + 'patients')
                            } else {
                                Ext.Msg.alert("Error", Util.getMessageLoadError());
                            }
                        }
                    });
                }

            }
        }],

        itemTpl: new Ext.XTemplate(
            '<div class="headshot" style="background-image:url(resources/images/headshots/pic.gif);"></div>',
            '<div style="float:left;width:60%">', '{person.display}', '</div>',
            '<div style="float:left;width:30%;font-size:18px">',
            '<span>Gender : {person.gender}</span>',
            '<span>Age : {person.age}</span>',
            '</div>')
    }
});