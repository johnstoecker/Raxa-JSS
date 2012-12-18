/**
 * This screen shows a drug order form 
 * with a button to add additional medications and a submit button.The left side shows patient
 * list
 */
//TODO: 
//Min and Max value validation filed of numberfield is not been working , 
//this is sencha bug , might be fixed in next version of sencha , so applied manually validations.
//Borders on numberfield is also not been working for styling , seems a sencha bug too . 
Ext.define("RaxaEmr.Outpatient.view.today.VitalsForm", {
    xtype: 'vitalsForm',
    requires:['Screener.view.VitalViewListener'],
    id: 'vitalsForm',
    extend: 'Ext.form.Panel',
    config: {
        styleHtmlContent: false,
        autoscroll: true,
        layout: 'vbox',
        items: [{
            // Need a separate panel here, so I can show/hide/disable
            xtype: 'panel',
            layout: 'vbox',
            id: 'vitalsInput',
            items: [{
                xtype: 'panel',
                layout: 'hbox',
                items: [{
                    // Fieldset for inputting vitals
                    xtype: 'fieldset',
                    width: '500px', // TODO: layout should fit screen
                    id: 'vitalsFields',
                    // TODO: For all inputs, get bounds from OpenMRS concept dictionary
                    items: [{
                        layout: 'hbox',
                        items: [{
                            xtype: 'vitalsListenerForm',
                            label: 'Systolic Blood Pressure',
                            labelWidth: '150px',
                            height: '50px',
                            flex : 3,
                            minValue: 0,
                            maxValue: 250,
                            name: 'systolicBloodPressureField',
                        },
                        {
                            xtype: 'label',
                            html : 'mmHg',
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd',
                            flex:2
                        }
                        ]
                    },
                    {
                        layout: 'hbox',
                        items: [{
                            // Diastolic Blood Pressure
                            xtype: 'vitalsListenerForm',
                            label: 'Diastolic Blood Pressure',
                            labelWidth: '150px',
                            minValue: 0,
                            maxValue: 150,
                            stepValue: 1,
                            name: 'diastolicBloodPressureField',
                            height: '50px',
                            flex:3
                        },{
                                         
                            html : 'mmHg',
                            flex:2,
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd'
                        }]
                    },
                    {
                        layout: 'hbox',
                        items: [{
                            // Temperature
                            xtype: 'vitalsListenerForm',
                            label: 'Temperature',
                            labelWidth: '150px',
                            id: 'tempSliderExt',
                            minValue: 25,
                            maxValue: 43,
                            stepValue: 0.1,
                            name: 'temperatureField',
                            height: '50px',
                            flex: '3'
                        },
                        {
                            layout : {
                                type  : 'hbox',
                                align : 'strech'
                            },
                            flex:2,
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd',
                            items  : [
                            {
                                xtype : 'radiofield',
                                label : 'C',
                                value: 'C',
                                name  : 'choice',
                                style: 'bgcolor:white;border-color:white'
                            },
                            {
                                xtype : 'radiofield',
                                label : 'F',
                                value: 'F',
                                name  : 'choice'
                            }
                            ]
                        }
                        ]
                    },
                    {
                        layout: 'hbox',
                        items: [{
                            // Repiratory Rate
                            xtype: 'vitalsListenerForm',
                            label: 'Repiratory Rate',
                            labelWidth: '150px',
                            minValue: 0,
                            maxValue: 200,
                            stepValue: 1,
                            name: 'respiratoryRateField',
                            height: '50px',
                            flex: '3'
                        },{
                            html : 'breaths/min',
                            flex:2,
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd'
                        }]
                    },
                    {
                        layout: 'hbox',
                        items: [{
                            // Pulse
                            xtype: 'vitalsListenerForm',
                            label: 'Pulse',
                            labelWidth: '150px',
                            minValue: 0,
                            maxValue: 230,
                            stepValue: 1,
                            name: 'pulseField',
                            height: '50px',
                            flex: '3'
                        },{
                            html : 'beats/min',
                            flex:2,
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd'
                        }]
                    },
                    {
                        layout: 'hbox',
                        items: [{
                            // Oxygen Saturation
                            xtype: 'vitalsListenerForm',
                            label: 'Oxygen Saturation',
                            labelWidth: '150px',
                            minValue: 0,
                            maxValue: 100,
                            stepValue: 1,
                            name: 'bloodOxygenSaturationField',
                            height: '50px',
                            flex: '3'
                        },{
                            html : 'unit',
                            flex:2,
                            border: '0 0 0 1',
                            style:'border-style : solid; border-color: #ddd'
                        }]
                    }
                
                    ]
                }]
            },
            {
                // Submit Button
                xtype: 'button',
                ui: 'confirm',
                id: 'submitVitalsButton',
                height: '40px',
                text: 'Save',
                width: '100px'
            }]
        }]
    }
});

