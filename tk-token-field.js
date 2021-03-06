/**
 * `tk-token-field`
 * A field that displays tokens
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
import {PolymerElement, html} from '@polymer/polymer';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronFormElementBehavior} from "@polymer/iron-form-element-behavior";
import {IronA11yKeysBehavior} from "@polymer/iron-a11y-keys-behavior";
import {IronValidatableBehavior} from "@polymer/iron-validatable-behavior";

import './polymer-dragula'
import './tk-token-field-dropdown';
import "@polymer/iron-icons/iron-icons"
import "@polymer/iron-icon"
import "@polymer/iron-input"
import "@polymer/iron-selector/iron-selector"
import "@polymer/paper-button"
import "@polymer/paper-input/paper-input-container"
import "@polymer/paper-input/paper-input-error"

class TkTokenField extends mixinBehaviors([IronFormElementBehavior, IronA11yKeysBehavior, IronValidatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }

            :host([hidden]) {
                display: none !important;
            }


            .tokens {
                min-height: 24px;
                font-size: 0;
            }

            .tokens[disabled] paper-button  {
                background-color: var(--app-secondary-color-light) !important;
                color: var(--app-text-color-dark) !important;
            }

            .tokens paper-button, paper-button.gu-mirror {
                background-color: var(--app-secondary-color-dark);
                margin: 0 5px 0 0;
                color: var(--app-text-color-light);
                height: 20px;
                font-size: 12px;
                min-width: initial;
                text-transform: none;
                padding-left: 8px;
            }

            .tokens paper-button iron-icon {
                height: 16px;
                width: 16px;
            }

            input {
                font: inherit;
                font-size: 12px;
                outline: none;
                box-shadow: none;
                border: none;
                width: auto;
                max-width: 100%;
                min-width: 1.8em;
                background-color: transparent;
            }

            .container {
                @apply(--layout-horizontal);
            }

            iron-selector > * {
                padding: 16px 16px;
            }

            .horizontal-section {
                padding: 0;
            }

            .iron-selected {
                background-color: var(--app-primary-color);
                color: var(--app-text-color-light);
            }

            label,
            .container {
                cursor: text;
            }

            ::slotted [prefix] {
                margin-right: 4px;
            }

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

            span.edited-token {
                background-color: var(--app-secondary-color);
                margin: 0 5px 0 0;
                padding: 2px 8px 2px 8px;
                border-radius: 3px;
                color: var(--app-text-color-light);
                height: 20px;
                font-size: 12px;
                min-width: initial;
                text-transform: none;
            }

            div.tk-token-selectable {
                padding: 4px 16px 4px 16px;
                font-size: 12px;
            }

            paper-input-container[disabled] {
                opacity: 1 !important;
            }

            paper-input-container {
                --paper-input-container-focus-color: var(--app-primary-color);
                --paper-input-container-label: {
                    color: var(--app-text-color);
                    opacity: 1;
                };
                --paper-input-container-underline-disabled: {
                    border-bottom: 1px solid var(--app-text-color);

                };
                --paper-input-container-color: var(--app-text-color);
            }
        </style>

        <paper-input-container always-float-label="[[_computeAlwaysFloatLabel(value, alwaysFloatLabel)]]" attr-for-value="value" on-tap="_handleContainerTap" disabled$="[[disabled]]" invalid="[[invalid]]">

            <label slot="label" hidden$="[[!label]]" aria-hidden="true">
                <span>[[label]]</span>
                <slot name="label-suffix"></slot>
            </label>

            <slot name="prefix"></slot>

            <div class="paper-input-input container" slot="input">
                <polymer-dragula id="poldrag" direction="horizontal" mirror-container="[[tokensContainer()]]" on-dragula-drop="_reorder">
				<span id="tokensContainer" class="tokens" disabled$="[[disabled]]">
					<template is="dom-repeat" items="[[pre]]" as="token">
						<paper-button tabindex="-1" data-token$="[[_getItemValue(token)]]" data-index$="[[index]]" on-tap="_handleSelectToken">[[_getItemLabel(token)]]<iron-icon icon="clear" on-tap="_handleDeleteToken"></iron-icon></paper-button>
					</template>
                    <span class$="[[_editedTokenClass(_inputValue)]]"><iron-input aria-labelledby="label" required$="[[required]]" bind-value="{{_inputValue}}" allowed-pattern="[[allowedPattern]]" prevent-invalid-input="[[preventInvalidInput]]" autofocus$="[[autofocus]]" autocomplete="off" disabled$="[[disabled]]">
					    <input id="inputValue">
				    </iron-input></span>
                    <template is="dom-repeat" items="[[post]]" as="token">
						<paper-button tabindex="-1" data-token$="[[_getItemValue(token)]]" data-index$="[[index]]" on-tap="_handleSelectToken">[[_getItemLabel(token)]]<iron-icon icon="clear" on-tap="_handleDeleteToken"></iron-icon></paper-button>
					</template>
				</span>
                </polymer-dragula>
            </div>

            <slot name="suffix"></slot>

            <template is="dom-if" if="[[errorMessage]]">
                <paper-input-error aria-live="assertive">[[errorMessage]]</paper-input-error>
            </template>

        </paper-input-container>

        <span id="inputWidthHelper">[[_inputValue]]</span>

        <tk-token-field-dropdown id="dropdownInput" no-overlap="" vertical-align="top" horizontal-align="left">
            <div slot="token-dropdown-content">
                <iron-selector id="itemList" selected="{{itemSelected}}" on-iron-select="_itemSelected">
                    <template is="dom-repeat" items="{{_items}}" as="item">
                        <div class="tk-token-selectable" name="[[_getItemValue(item)]]" on-tap="_clickItem">[[_getItemLabel(item)]]</div>
                    </template>
                </iron-selector>
            </div>
        </tk-token-field-dropdown>
`;
  }

  static get is() {
      return 'tk-token-field'
  }

  static get properties() {
      return {
          /**
           * The label for this input.
           */
          label: String,

          /**
           * Value contains an array of the selected items. Each item must contain a dataValuePath and a dataLabelPath value
           */
          value: {
              notify: true,
              type: Array,
              value: function () {
                  return []
              }
          },

          /**
           * The data attribute can be used to set the list box options. This method expects an array or function of objects or string values. If using an array of objects the default properties are value and label [{"value": 21, "label": "Mark"},{...}]
           */
          dataSource: {
              type: Object,
              observer: '_dataSourceChanged',
              value: null
          },

          /**
           * The data label path attribute can be used to change the default path "value" to a custom path. For example if set to "id" the data objects should look something like this {"id": 21, "label": "Mark"}.
           */
          dataValuePath: {
              type: String,
              value: 'value'
          },

          /**
           * The data label path attribute can be used to change the default path "label" to a custom path. For example if set to "name" the data objects should look something like this {"value": 21, "name": "Mark"}
           */
          dataLabelPath: {
              type: String,
              value: 'label'
          },

          allowedDuplicateValues: {
              type: Boolean,
              value: false
          },

          /**
           * Regular expression that list the characters allowed as input. This pattern represents the allowed characters for the field; as the user inputs text, each individual character will be checked against the pattern (rather than checking the entire value as a whole). The recommended format should be a list of allowed characters; for example, [a-zA-Z0-9-!]
           */
          allowedPattern: {
              type: String
          },

          /**
           * Set to true to auto-validate the input value.
           */
          autoValidate: {
              type: Boolean,
              value: false
          },

          autofocus: {
              type: Boolean
          },

          /**
           * Set to true to disable this input.
           */
          disabled: {
              type: Boolean,
              value: false
          },

          /**
           * The error message to display when the input is invalid.
           */
          errorMessage: {
              type: String
          },

          /**
           * Set to true to prevent the user from entering invalid input. If allowedPattern is set, any character typed by the user will be matched against that pattern, and rejected if it's not a match. Pasted input will have each character checked individually; if any character doesn't match allowedPattern, the entire pasted string will be rejected. If allowedPattern is not set, it will use the type attribute (only supported for type=number).
           */
          preventInvalidInput: {
              type: Boolean,
              value: false
          },

          _modeDropDown: {
              type: Boolean,
              value: false
          },

          /**
           * alwaysFloatLabel
           */
          alwaysFloatLabel: {
              type: Boolean,
              value: false
          },

          /**
           * Maximum number of tokens allowed in value
           */
          maxTokens: {
              type: Number
          },

          /**
           * This is the internal working list for the dropdown box. This list will exclude the potential selected tokens.
           */
          _items: {
              notify: true,
              type: Array,
              value: function () {
                  return []
              }
          },

          /**
           * Helper method to determine if the token input has an dropdown item list
           */
          _hasDropDown: {
              type: Boolean,
              computed: '_computeHasDropDown(_items)'
          },

          /**
           * Set to true to mark the input as required. If you're using PaperInputBehavior to
           * implement your own paper-input-like element, bind this to
           * the `<input is="iron-input">`'s `required` property.
           */
          required: {
              type: Boolean,
              value: false
          },

          /**
           * This field will be bind to the actual input field
           */
          _inputValue: {
              type: String,
              notify: true,
              value: ''
          },

          itemSelected: {
              type: Object,
              value: null
          },

          selectedTokenIndex: {
              type: Number,
              value: null
          },

          pre: {
              notify: true,
              type: Array,
              value: () => []
          },

          post: {
              type: Array,
              value: () => []
          }

      }
  }

  static get observers() {
      return [
          '_observeInputChange(_inputValue)',
          '_valueChanged(value.splices)',
          '_prePostChanged(value, selectedTokenIndex, value.splices)'
      ]
  }

  get keyBindings() {
      return {
          'enter': '_onEnter',
          'backspace': '_onBackspace'
      }
  }

  /**
   * Returns a reference to the input element.
   */
  get inputElement() {
      return this.shadowRoot.querySelector('#inputValue')
  }

  _valueChanged(e) {
      if (e) {
          this.dispatchEvent(new CustomEvent('value-splices-change', {detail:this.value, composed: true}))
      }
  }

  attached() {
      super.attached()

      /* Initialize the input helper span element for determining the actual width of the input text. This width will be used to create a dynamic width on the input field */
      const helper = this.shadowRoot.querySelector('#inputWidthHelper');
      const input = this.shadowRoot.querySelector('#inputValue');

      helper.style = window.getComputedStyle(input, null).cssText
      helper.style.position = 'absolute'
      helper.style.top = '-999px'
      helper.style.left = '0'
      helper.style.padding = '0'
      helper.style.width = 'auto'
      helper.style['white-space'] = 'pre'

      input.addEventListener('keyup', e => this._handleUpDown(e))
      input.addEventListener('focus', e => this._handleInputFocus(e))

      this._filterItems()
  }

  tokensContainer() {
      return this.root.getElementById('tokensContainer')
  }

  _reorder(e) {
      const value = this.value || []
      const to = (e.detail.sibling && e.detail.sibling.dataset.index && (parseInt(e.detail.sibling.dataset.index) + 1) || (value.length + 1)) - 1 //Avoid 0 being seen as false
      const from = e.detail.el.dataset.index && parseInt(e.detail.el.dataset.index)

      this.shadowRoot.querySelector('#poldrag').drake.cancel(true)

      setTimeout(() => {
          const moved = this.splice('value', from, 1)[0]
          this.splice('value', to > from ? to - 1 : to, 0, moved)
      }, 0)
  }

  _dataSourceChanged(dataSource) {
      if (dataSource && typeof dataSource.filter === 'function') {
          this.dataSource = dataSource
          this._filterItems()
      }
  }

  _filterItems(searchString) {
      if (this.dataSource) {
          var data = this.dataSource.filter(searchString)
          if (data && data instanceof Promise) {
              data.then(res => {
                  if (!res) { return } //canceled
                  this.set('_items', res.filter(v => this.allowedDuplicateValues || !(this.value || []).find(vv => vv[this.dataLabelPath] === v)))
                  if (this._items.length) {
                      this._openDropdown()
                  } else {
                      this._closeDropdown()
                  }
              })
          } else {
              this.set('_items', (data || []).filter(v => this.allowedDuplicateValues || !(this.value || []).find(vv => vv[this.dataLabelPath] === v)))
              if (this._items.length) {
                  this._openDropdown()
              } else {
                  this._closeDropdown()
              }
          }
      }
  }

  /**
   * This method will automatically set the label float.
   */
  _computeAlwaysFloatLabel(value, alwaysFloatLabel) {
      if (alwaysFloatLabel) {
          return true
      }
      return !((this.value || []).length === 0 && this.shadowRoot && this.shadowRoot.querySelector('#inputValue') !== document.activeElement && this !== document.activeElement)
  }

  _clickItem(e) {
      setTimeout(() => this._onEnter(), 100)
  }

  _lookupItemByPath(item, path) {
      if (item === undefined) {
          return
      }
      var parts = path.split(".")
      if (parts.length === 1) {
          return item[parts[0]]
      }
      return this._lookupItemByPath(item[parts[0]], parts.slice(1).join("."))
  }

  _getItemLabel(item) {
      return this.dataLabelPath && this.dataLabelPath.split(':').map(p=>this._lookupItemByPath(item, p)).join(':')
  }

  _getItemLabelForIndex(idx) {
      return idx != null && this.value[idx] && this._getItemLabel(this.value[idx])
  }

  _null(v) {
      return v === null
  }

  _editedTokenClass(s) {
      return s && s.length ? 'edited-token' : ''
  }
  _getItemValue(item) {
      return this._lookupItemByPath(item, this.dataValuePath)
  }

  /**
   * Recalculate string width after input change
   */
  _observeInputChange() {
      if (this.shadowRoot) {
          this.shadowRoot.querySelector('#inputValue').style.width = (this.shadowRoot.querySelector('#inputWidthHelper').offsetWidth + 10) + 'px'
          this._filterItems(this._inputValue)
      }
  }

  _handleUpDown(event) {
      event.preventDefault()
      if (this._hasDropDown && this.shadowRoot.querySelector('#dropdownInput').dropdown.opened) {
          var ironSelector = this.shadowRoot.querySelector('iron-selector')
          if (event.keyCode === 38) {
              if (ironSelector.selected) {
                  ironSelector.selectPrevious()
              }
          } else if (event.keyCode === 40) {
              if (ironSelector.selected === undefined) {
                  ironSelector.selectIndex(0)
              } else {
                  ironSelector.selectNext()
              }
          }
      } else if (event.keyCode === 38 || event.keyCode === 40) {
          this._openDropdown()
      }
  }

  _onBackspace(e) {
      if (this._inputValue.length === 0) {
          this._removeSelectedToken()
          e.stopPropagation()
      }
  }

  _onEnter() {
      const item = this.shadowRoot.querySelector('#dropdownInput').dropdown.opened && this._items.length > 0 && this._items.find(item => {
          return this._getItemValue(item) === this.shadowRoot.querySelector('iron-selector').selectedItem.name
      })

      if (item && !(this._inputValue || '').startsWith(this._getItemLabel(item))) {
          console.log('Did not validate because of '+this._inputValue+' not starting by '+this._getItemValue(item))
          this._validateToken(item)
          //Edit latest
          this.select(this.value.length -1)
      } else {
          if (this._inputValue && this._inputValue.length > 0 && !this._modeDropDown) {
              const placeHolder = {}
              placeHolder[this.dataLabelPath] = this._inputValue
              this._validateToken(placeHolder)
          }
      }
  }

  _prePostChanged(vals, idx)  {
      this.set('pre', idx !== null ? idx && (vals || []).slice(0, idx) || [] : (vals || []).map(x => x))
      this.set('post', idx !== null && idx < (vals || []).length - 1 ? (vals || []).slice(idx+1) : [])
  }

  _handleDeleteToken(e) {
      var el = (e.target.tagName === 'IRON-ICON' ? e.target.parentElement : e.target)
      this._removeToken(el.dataset.token)
      this.focus()
      e.stopPropagation()
  }

  select(idx) {
      if(idx === null || (idx >= 0 && idx < this.value.length) ) {
          this.set('selectedTokenIndex', idx)

          this.focus()
          this._resetInput()

          if (idx !== null) {
              this.set('_inputValue', this._getItemLabel(this.value[this.selectedTokenIndex]))
          }
      }
  }

  _handleSelectToken(e) {
      this.select((e.target || null) && Number(e.target.dataset.index || 0) )
      e.stopPropagation()
  }

  _removeSelectedToken() {
      if (this.selectedTokenIndex || this.selectedTokenIndex === 0) {
          this._removeToken(this.value[this.selectedTokenIndex])
          if (this.selectedTokenIndex && this.selectedTokenIndex - 1 < this.value.length) {
              this.select(this.selectedTokenIndex - 1)
          } else {
              this.select(null)
          }
      } else {
          if (this.pre.length && this.pre.length - 1 < this.value.length) {
              this.select(this.pre.length - 1)
          }
      }
  }

  _validateToken(item) {
      if (null === this.selectedTokenIndex || this.selectedTokenIndex > this.value.length - 1) {
          if (this.maxTokens && (this.value || []).length >= this.maxTokens) {
              return
          }
          this.push('value', item)
      } else {
          Object.assign(this.value[this.selectedTokenIndex], item)
          this.dispatchEvent(new CustomEvent('value-splices-change', {detail:this.value, composed: true}))
          this.set('selectedTokenIndex', null)
      }
      this._resetInput()
      this._autoValidate()
  }

  _resetInput() {
      this.set('_inputValue', '')
      if (this._hasDropDown && this._items.length > 0) {
          this.shadowRoot.querySelector('iron-selector').selectIndex(0)
      }
  }

  _removeToken(token) {
      this.splice('value', ( this.value || []).findIndex(v => this._getItemValue(v) === token), 1)
      this._autoValidate()
  }

  _autoValidate() {
      if (this.autoValidate) {
          this.validate()
      }
  }

  /**
   * Returns true if `value` is valid. The validator provided in `validator` will be used first,
   * then any constraints.
   * @return {boolean} True if the value is valid.
   */
  validate() {
      var valid = true

      // Empty, required input is invalid
      if (this.required && (this.value || [])  .length === 0) {
          valid = false
      } else if (this.hasValidator()) {
          valid = Polymer.IronValidatableBehavior.validate.call(this, this.value)
      }

      this.invalid = !valid
      this.fire('iron-input-validate')
      return valid
  }


  _handleContainerTap(e) {
      this.focus()
  }


  _openDropdown() {
      if (this._hasDropDown && !this.shadowRoot.querySelector('#dropdownInput').dropdown.opened) {
          this.getDropdownInput().open()
          this.shadowRoot.querySelector('iron-selector').selected = this.shadowRoot.querySelector('iron-selector').selected || 0
      } else {
          this.shadowRoot.querySelector('#dropdownInput').update()
      }
  }

    getDropdownInput() {
        return this.shadowRoot.querySelector('#dropdownInput');
    }

    _closeDropdown() {
        const input = this.shadowRoot.querySelector('#dropdownInput');
        if (input && input.dropdown && input.dropdown.opened) {
          input.close()
      }
  }

  _handleInputFocus(e) {
      this._triggerComputeFloatLabel()
  }

  _triggerComputeFloatLabel() {
      // Hack to manualy trigger compute function
      this.alwaysFloatLabel = !this.alwaysFloatLabel
      this.alwaysFloatLabel = !this.alwaysFloatLabel
  }

  /**
   * this method can be used to set the focus of the element
   */
  focus() {
      this.shadowRoot.querySelector('#inputValue').focus()
  }

  _getValidity() {
      var validValue = this.value.length > 0
      this.shadowRoot.querySelector('paper-input-container').invalid = !validValue
      return validValue
  }


  _computeHasDropDown() {
      return this._items && this._items.length > 0
  }
}

window.customElements.define(TkTokenField.is, TkTokenField)
