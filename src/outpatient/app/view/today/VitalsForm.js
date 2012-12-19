/**
 * This screen shows a drug order form 
 * with a button to add additional medications and a submit button.The left side shows patient
 * list
 */
//TODO: 
//Min and Max value validation filed of numberfield is not been working , 
//this is sencha bug , might be fixed in next version of sencha , so applied manually validations.
//Borders on numberfield is also not been working for styling , seems a sencha bug too . 

var VITALS_FORM_CONSTANTS = {
    FIELD_LABEL_WIDTH : '150px',
    FIELD_HEIGHT: '50px',
    FIELD_WIDTH: '0px'
};

Ext.define("RaxaEmr.Outpatient.view.today.VitalsForm", {
    xtype: 'vitalsForm',
    requires:['Screener.view.VitalViewListener'],
    id: 'vitalsForm',
    extend: 'Ext.form.Panel',
    config: {
        items: [{
            xtype: 'panel',
            layout: 'hbox',
            flex: 1,
            items: [{
                // Fieldset for inputting vitals
                xtype: 'fieldset',
                id: 'vitalsFields',
                // TODO: For all inputs, get bounds from OpenMRS concept dictionary
                items: [{
                    layout: 'hbox',
                    items: [{
                        xtype: 'vitalsListenerForm',
                        label: 'Systolic Blood Pressure',
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
                        // width: VITALS_FORM_CONSTANTS.FIELD_WIDTH,
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
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        minValue: 0,
                        maxValue: 150,
                        stepValue: 1,
                        name: 'diastolicBloodPressureField',
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
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
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        id: 'tempSliderExt',
                        minValue: 25,
                        maxValue: 43,
                        stepValue: 0.1,
                        name: 'temperatureField',
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
                        flex: '3'
                    },
                    {
                        html : 'Celcius',
                        flex:2,
                        border: '0 0 0 1',
                        style:'border-style : solid; border-color: #ddd'
                        // layout : {
                        //     type  : 'hbox',
                        //     align : 'strech'
                        // },
                        // flex:2,
                        // border: '0 0 0 1',
                        // style:'border-style : solid; border-color: #ddd',
                        // items  : [
                        // {
                        //     xtype : 'radiofield',
                        //     label : 'C',
                        //     value: 'C',
                        //     name  : 'choice',
                        //     style: 'bgcolor:white;border-color:white'
                        // },
                        // {
                        //     xtype : 'radiofield',
                        //     label : 'F',
                        //     value: 'F',
                        //     name  : 'choice'
                        // }
                        // ]
                    }
                    ]
                },
                {
                    layout: 'hbox',
                    items: [{
                        // Repiratory Rate
                        xtype: 'vitalsListenerForm',
                        label: 'Repiratory Rate',
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        minValue: 0,
                        maxValue: 200,
                        stepValue: 1,
                        name: 'respiratoryRateField',
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
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
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        minValue: 0,
                        maxValue: 230,
                        stepValue: 1,
                        name: 'pulseField',
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
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
                        labelWidth: VITALS_FORM_CONSTANTS.FIELD_LABEL_WIDTH,
                        minValue: 0,
                        maxValue: 100,
                        stepValue: 1,
                        name: 'bloodOxygenSaturationField',
                        height: VITALS_FORM_CONSTANTS.FIELD_HEIGHT,
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
            // height: '40px',
            text: 'Save',
            width: '100px'
        }]
    }
});

