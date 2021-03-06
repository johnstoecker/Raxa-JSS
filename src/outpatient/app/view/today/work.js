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
 
//bottom half view of the patient details (history , examination, diagnosis and treatment tab)
 
//enum to swich the tabs
 
var TABS = {
    HISTORY: 0,
    EXAMINATION: 1,
    DATA: 2,
    DIAGNOSIS: 3,
    TREATMENT: 4
}

Ext.define('RaxaEmr.Outpatient.view.today.work', {
    extend: 'Ext.Container',
    xtype: 'work',
    requires: ['RaxaEmr.Outpatient.view.history.Overview','RaxaEmr.Outpatient.view.today.treatment', 'RaxaEmr.Outpatient.view.today.diagnosis', 'RaxaEmr.Outpatient.view.today.draw'],
    config: {
        layout: {
            type: 'hbox'
        },
        height: 768,
        width: 1024,
        items: [{
             xtype: 'diagnosis-panel',
             id: 'diagnosis-panel'
         }, {
            xtype: 'treatment-panel',
           
        },
        ]
    }
});
