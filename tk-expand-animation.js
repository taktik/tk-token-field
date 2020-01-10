import { PolymerElement } from '@polymer/polymer';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {NeonAnimationBehavior} from "@polymer/neon-animation/neon-animation-behavior";

class TkExpandAnimation extends mixinBehaviors([NeonAnimationBehavior], PolymerElement) {
		static get is() {
        return 'tk-expand-animation'
		}

		static get properties() {
        return {}
		}

		configure(config) {
        var node = config.node
        var height = node.getBoundingClientRect().height
        this._effect = new KeyframeEffect(node, [{
            height: (height / 2) + 'px'
        }, {
            height: height + 'px'
        }], this.timingFromConfig(config))
        return this._effect
		}

}

window.customElements.define(TkExpandAnimation.is, TkExpandAnimation)
