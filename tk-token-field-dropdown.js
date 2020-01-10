import './tk-expand-animation.js';
import {PolymerElement,html} from '@polymer/polymer';
import '@polymer/iron-dropdown'

class TkTokenFieldDropdown extends PolymerElement {
    static get template() {
        return html`
        <style>
            iron-dropdown {
                background: var(--tk-token-field-dropdown-background-color, #fafafa);
                color: var(--tk-token-field-dropdown-text-color, --secondary-text-color);
                @apply(--shadow-elevation-2dp);
                min-width: 280px;
                min-height: 26px;
            }
        </style>

        <iron-dropdown id="dropdown"
                       vertical-align="[[verticalAlign]]"
                       horizontal-align="[[horizontalAlign]]"
                       auto-fit-on-attach="[[autoFitOnAttach]]"
                       no-overlap="[[noOverlap]]"
                       open-animation-config="[[openAnimationConfig]]"
                       close-animation-config="[[closeAnimationConfig]]">
            <div slot="dropdown-content">
                <slot id="contentNode" name="token-dropdown-content"></slot>
            </div>
        </iron-dropdown>`
    }

    static get is() {
        return 'tk-token-field-dropdown'
    }

    static get properties() {
        return {
            verticalAlign: String,
            horizontalAlign: String,
            autoFitOnAttach: {
                type: Boolean,
                value: false
            },
            noOverlap: {
                type: Boolean,
                value: false
            },
            disabled: Boolean,
            dropdown: {
                type: Object
            },
            openAnimationConfig: {
                type: Array,
                value: function () {
                    return [{
                        name: 'fade-in-animation',
                        timing: {
                            delay: 150,
                            duration: 50
                        }
                    }, {
                        name: 'tk-expand-animation',
                        timing: {
                            delay: 150,
                            duration: 200
                        }
                    }]
                }
            },
            closeAnimationConfig: {
                type: Array,
                value: function () {
                    return [{
                        name: 'fade-out-animation',
                        timing: {
                            duration: 300
                        }
                    }]
                }
            }
        }
    }

    ready() {
        super.ready()

        this.dropdown = this.shadowRoot.querySelector('#dropdown')
    }

    /**
     *  Call after having updated the content div
     */
    update() {
        const dd = this.shadowRoot.querySelector('#dropdown');
        dd && dd.refit()
    }


    /**
     * Open can be used to open the dropdown list
     */
    open() {
        const dd = this.shadowRoot.querySelector('#dropdown');
        dd && dd.open()
    }

    /**
     * Close can be used to close the dropdown list
     */
    close() {
        const dd = this.shadowRoot.querySelector('#dropdown');
        dd && dd.close()
    }
}

window.customElements.define(TkTokenFieldDropdown.is, TkTokenFieldDropdown)
