import {html} from "@polymer/polymer";
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../tk-token-field.js';

/**
 * `tk-token-field`
 * A field that displays tokens
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TkTokenFieldDemo extends PolymerElement {
    static get is() {
        return 'tk-token-field-demo'
    }

    static get template() {
        return html`<tk-token-field data-source="[[_dataSource()]]"></tk-token-field>`
    }

    static get properties() {
        return {}
    }

    static get observers() {
        return [
        ]
    }

    _dataSource() {
        return {
            filter: (s) => ['bruxelles','liege','namur','anvers'].map(x => ({label:x, value:x})).filter(x => x.label.includes(s))
        }
    }

}
window.customElements.define(TkTokenFieldDemo.is, TkTokenFieldDemo)
