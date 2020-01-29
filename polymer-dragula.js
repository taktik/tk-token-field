/*
Copyright 2016 Marcin Lulek

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
/**
 `polymer-dragula`
 Polymer wrapper of dragula drag and drop library

 @demo demo/demo.html Simple demo
 @demo demo/demo2.html Demo with nesting of elements
 */

import {PolymerElement, html} from '@polymer/polymer';
import dragula from 'dragula/dist/dragula';
window.dragula = dragula
import {beforeNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import {LegacyElementMixin} from "@polymer/polymer/lib/legacy/legacy-element-mixin";

class PolymerDragula extends LegacyElementMixin(PolymerElement) {
    static get template() {
        return html`
            <style>
              .gu-mirror {
                position: fixed !important;
                margin: 0 !important;
                z-index: 9999 !important;
                opacity: 0.8;
                -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
                filter: alpha(opacity=80);
              }
        
              .gu-hide {
                display: none !important;
              }
        
              .gu-unselectable {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
              }
        
              .gu-transit {
                opacity: 0.2;
                -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
                filter: alpha(opacity=20);
              }
            </style>
        
        <div style="border: 1px #fcdf35;">
            <slot></slot>
        </div>`
    }

    static get is() {
        return 'polymer-dragula'
    }

    static get properties() {
        return {
            /**
             * Dragula `drake` object
             */
            drake: {
                type: Object,
                value: function () {
                    return null
                }
            },
            /**
             * Elements are always draggable by default
             */
            fnMoves: {
                type: Function,
                value: function () {
                    return function (el, source, handle, sibling) {
                        return true; // elements are always draggable by default
                    }
                }
            },
            /**
             * Which containers accept elements
             */
            fnAccepts: {
                type: Function,
                value: function () {
                    return function (el, target, source, sibling) {
                        return true; // elements can be dropped in any of the `containers` by default
                    }
                }
            },
            /**
             * Prevents drags from initiating is evaluates to true
             */
            fnInvalid: {
                type: Function,
                value: function () {
                    return function (el, handle) {
                        return false; // don't prevent any drags from initiating by default
                    }
                }
            },
            /**
             * Only Elements in drake.containers will be taken into account
             */
            fnIsContainer: {
                type: Function,
                value: function () {
                    return function (el) {
                        return false;
                    }
                }
            },
            /**
             * Y axis is considered when determining where an element would be dropped
             */
            direction: {
                type: String,
                value: 'vertical'
            },
            /**
             * Elements are moved by default, not copied
             */
            copy: {
                type: Boolean,
                value: false
            },
            copySortSource: {
                type: Boolean,
                value: false
            },
            /**
             * Spilling will put the element back where it was dragged from, if this is true
             */
            revertOnSpill: {
                type: Boolean,
                value: false
            },
            /**
             * Spilling will `.remove` the element, if this is true
             */
            removeOnSpill: {
                type: Boolean,
                value: false
            },
            /**
             * Allows users to select input text
             */
            ignoreInputTextSelection: {
                type: Boolean,
                value: true
            },
            /**
             * Set the element that gets mirror elements appended
             */
            mirrorContainer: {
                type: Object
            },
            /**
             * Default slot selector
             */
            containerSelector: {
                type: String,
                value: '*'
            },
            /**
             * Sub slot selector (if you use something like <template> elem that wraps
             * subelements you want to use this to tell which elements are containers)
             */
            subContainerSelector: {
                type: String,
                value: ''
            }
        }
    }

    ready() {
        super.ready()
    }

    connectedCallback() {
        beforeNextRender(this, function () {
            var config = {
                isContainer: this.fnIsContainer,
                moves: this.fnMoves,
                accepts: this.fnAccepts,
                invalid: this.fnInvalid,
                direction: this.direction,
                copy: this.copy,
                copySortSource: this.copySortSource,
                revertOnSpill: this.revertOnSpill,
                removeOnSpill: this.removeOnSpill,
                mirrorContainer: this.mirrorContainer || document.body,
                ignoreInputTextSelection: this.ignoreInputTextSelection
            };
            var containers = [];
            var slotContainers = this.queryAllEffectiveChildren(this.containerSelector);

            for (var x = 0; x < slotContainers.length; x++) {
                if (!this.subContainerSelector) {
                    containers.push(slotContainers[x]);
                } else {
                    var subContainers = slotContainers[x].querySelectorAll(this.subContainerSelector);
                    for (var y = 0; y < subContainers.length; y++) {
                        containers.push(subContainers[y]);
                    }
                }
            }

            var drake = dragula(containers, config);
            drake.on('drag', function (el, source) {
                this.fire('dragula-drag', {el: el, source: source});
            }.bind(this));
            drake.on('dragend', function (el) {
                this.fire('dragula-dragend', {el: el});
            }.bind(this));
            drake.on('drop', function (el, target, source, sibling) {
                this.fire('dragula-drop', {el: el, target: target, source: source, sibling: sibling});
            }.bind(this));
            drake.on('cancel', function (el, container, source) {
                this.fire('dragula-cancel', {el: el, container: container, source: source});
            }.bind(this));
            drake.on('remove', function (el, container, source) {
                this.fire('dragula-remove', {el: el, container: container, source: source});
            }.bind(this));
            drake.on('shadow', function (el, container, source) {
                this.fire('dragula-shadow', {el: el, container: container, source: source});
            }.bind(this));
            drake.on('over', function (el, container, source) {
                this.fire('dragula-over', {el: el, container: container, source: source});
            }.bind(this));
            drake.on('out', function (el, container, source) {
                this.fire('dragula-out', {el: el, container: container, source: source});
            }.bind(this));
            drake.on('cloned', function (clone, container, type) {
                this.fire('dragula-cloned', {clone: clone, container: container, type: type});
            }.bind(this));
            this.drake = drake;
        }.bind(this))
    }

    disconnectedCallback() {
        this.drake.destroy();
    }
}
window.customElements.define(PolymerDragula.is, PolymerDragula)
