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

Ext.define('RaxaEmr.Outpatient.view.today.treatment', {

    extend: 'Ext.Carousel',

    // Lockable Carousel
    // from: http://stackoverflow.com/questions/8283196/disable-dragging-in-carousel
    initialize: function() {
        this.onDragOrig = this.onDrag;
        this.onDrag = function(e) {
            // console.log(e);
            // TODO: Fiddle with this. idea is that you cannot drag on the canvasas "drawable area"
            // TODO: Instead, catch event where (if mouse over floating "tab" (or "thin bar"), then you can drag it)
            var RIGHT_SIDE_X = 710; // 58 pixels can be clicked, since full width is 768
            var LEFT_SIDE_X = 58;  
            var activeIndex = this.getActiveIndex();
            var FIRST_PAGE = 0;
            var LAST_PAGE = 1;
            if ((e.startX > RIGHT_SIDE_X) && (activeIndex < LAST_PAGE) || (e.startX < LEFT_SIDE_X && activeIndex > FIRST_PAGE)) {
            // if(!this.locked) {
                this.onDragOrig(e);
            }
        }
    },
    locked: true,
    lock: function() {
        this.locked = true;
    },
    unlock: function() {
        this.locked = false;
    },

    // Main definition 
    xtype: 'treatment-panel',
    requires: ['Screener.store.druglist', 'Screener.model.druglist', 'RaxaEmr.Outpatient.view.today.druglist', 'RaxaEmr.Outpatient.view.today.drugform'],
    id: 'treatment-panel',
    config: {
        title: 'Treatment',
        indicator: false,
        activeItem: 0,
        items: [{
            xtype: 'drug-panel'
        }, {
            xtype: 'draw-panel'
        }, {
            xtype: 'history-panel'
        }]
    }
});