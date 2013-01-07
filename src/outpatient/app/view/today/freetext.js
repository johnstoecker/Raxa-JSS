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
Ext.define('RaxaEmr.Outpatient.view.today.freetext', {
    extend: 'Ext.Container',
    xtype: 'freetext-panel',
    id: 'freetext-panel',
    config: {
        layout: {
            type: 'vbox'
        },
        modal: true,
        hidden: true,
        floating: true,
        left: (768 - 500) / 2,
        // centered, based on screen width and modal width
        top: 60,
        // enough to not overlap with toolbar
        width: 500,
        hideOnMaskTap: true,
        items: [{
            xtype: 'toolbar',
            title: 'Free Text',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'delete',
                iconMask: true,
                handler: function () {
                    Ext.getCmp('freetext-panel').hide();
                },
                ui: 'decline',
            }]
        }, {
            xtype: 'textareafield',
            placeHolder: 'Select to start typing using keyboard...',
            padding: '10'
        }, {
            xtype: 'container',
            docked: 'bottom',
            style: 'background-color: #f7f7f7;',
            height: 80,
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    text: 'Submit',
                    id: 'addTextInList',
                    ui: 'confirm',
                    margin: '10 150 10 150',
                    flex: 1,
                    handler: function () {
                        //TODO: Add FreeText as obs                                        
                    }
                }]
            }]

        }]
    }
});