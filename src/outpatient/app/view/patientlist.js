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
Ext.define('RaxaEmr.Outpatient.view.patientlist', {
    // TODO: Change to panel to get nice outline and more similar look to the dashboard?
    extend: 'Ext.List',
    xtype: 'patientlist',
    id: 'contact',
    
    config: {
        
        // TODO: Add nice looking empty text
        emptyText: 'No patients found',

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
        styleHtmlContent:true,
        styleHtmlCls:'testHtml',
        overItemCls:'testOver',
        selectedItemCls:'testSelect',
        pressedCls:'testPress',

		// List item template
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Patient List',
            items: [{
                xtype: 'button',
                id: 'refresh',
                iconCls: 'refresh',
                iconMask: true,
                ui: 'confirm',
            },{
                xtype: 'spacer'
            },{
                xtype: 'button',
                iconCls: 'delete',
                iconMask: true,
                handler: function() {
                    Ext.getCmp('contact').hide();
                },
                ui: 'decline',
            }]
        }],
        // itemTpl: '{display}',
		itemTpl: new Ext.XTemplate(
            '<div class="headshot" style="background-image:url(resources/images/headshots/pic.gif);"></div>', 
            '<div style="float:left;width:60%">', '{display}', '</div>', 
            '<div style="float:left;width:30%;font-size:18px">', 
                '<span>Gender : {[this.gender(values.gender)]}</span>',
                '<span>Age : {age}</span>', 
            '</div>',
			{
				date: function(str){
                    return str.encounters[0].encounterDatetime.split("T")[0];
				},
				gender: function(str){
					if(str == 'M'){
						return 'Male';
					}else if(str == 'F'){
                        return 'Female';
					}
				  }
			} 
		)
	}
});
