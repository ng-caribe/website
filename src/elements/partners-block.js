import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { ReduxMixin } from '../mixins/redux-mixin.js';
import { dialogsActions, partnersActions, toastActions } from '../redux/actions.js';
import { DIALOGS } from '../redux/constants.js';
import './hoverboard-icons.js';
import './shared-styles.js';

class PartnersBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="shared-styles flex flex-alignment">
      :host {
        display: block;
      }

      .block-title {
        margin: 24px 0 8px;
      }

      .logos-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-gap: 8px;
      }

      .logo-item {
        padding: 12px;
      }

      .logo-img {
        height: 84px;
        width: 100%;
      }

      .cta-button {
        margin-top: 24px;
        color: var(--default-primary-color);
      }

      @media (min-width: 640px) {
        .logos-wrapper {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 812px) {
        .logos-wrapper {
          grid-template-columns: repeat(5, 1fr);
        }
      }

    </style>

    <div class="container">
      <h1 class="container-title">{$ partnersBlock.title $}</h1>

      <template is="dom-repeat" items="[[partners]]" as="block">
          <h4 class="block-title">[[block.title]]</h4>
          <div class="logos-wrapper">
            <template is="dom-repeat" items="[[block.items]]" as="logo">
              <a
                class="logo-item"
                href$="[[logo.url]]"
                title$="[[logo.name]]"
                target="_blank"
                rel="noopener noreferrer"
                layout horizontal
                center-center>
                <plastic-image
                  class="logo-img"
                  srcset="[[logo.logoUrl]]"
                  sizing="contain"
                  lazy-load
                  preload
                  fade></plastic-image>
              </a>
            </template>
          </div>
      </template>

      <paper-button class="cta-button animated icon-right" on-tap="_addPotentialPartner">
        <span>{$ partnersBlock.button $}</span>
        <iron-icon icon="hoverboard:arrow-right-circle"></iron-icon>
      </paper-button>
    </div>
`;
  }

  static get is() {
    return 'partners-block';
  }

  static get properties() {
    return {
      partners: {
        type: Array,
      },
      partnersFetching: {
        type: Boolean,
      },
      partnersFetchingError: {
        type: Object,
      },
      partnerAdding: {
        type: Boolean,
        observer: '_partnerAddingChanged',
      },
      partnerAddingError: {
        type: Object,
      },
    };
  }

  static mapStateToProps(state, _element) {
    return {
      viewport: state.ui.viewport,
      partners: state.partners.list,
      partnersFetching: state.partners.fetching,
      partnersFetchingError: state.partners.fetchingError,
      partnerAdding: state.partners.adding,
      partnerAddingError: state.partners.addingError,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.partnersFetching && (!this.partners || !this.partners.length)) {
      this.dispatchAction(partnersActions.fetchPartners());
    }
  }

  _addPotentialPartner() {
    dialogsActions.openDialog(DIALOGS.SUBSCRIBE, {
      title: '{$ partnersBlock.form.title $}',
      submitLabel: '{$ partnersBlock.form.submitLabel $}',
      firstFieldLabel: '{$ partnersBlock.form.fullName $}',
      secondFieldLabel: '{$ partnersBlock.form.companyName $}',
      submit: (data) => {
        this.dispatchAction(partnersActions.addPartner(data));
      },
    });
  }

  _partnerAddingChanged(newPartnerAdding, oldPartnerAdding) {
    if (oldPartnerAdding && !newPartnerAdding) {
      if (this.partnerAddingError) {
        this.dispatchAction(dialogsActions.setDialogError(DIALOGS.SUBSCRIBE));
      } else {
        dialogsActions.closeDialog(DIALOGS.SUBSCRIBE);
        toastActions.showToast({ message: '{$ partnersBlock.toast $}' });
      }
    }
  }
}

window.customElements.define(PartnersBlock.is, PartnersBlock);
