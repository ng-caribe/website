import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin.js';
import { dialogsActions, notificationsActions, uiActions, userActions } from '../redux/actions.js';
import { DIALOGS, NOTIFICATIONS_STATUS } from '../redux/constants.js';
import './shared-styles.js';

class HeaderToolbar extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="shared-styles flex flex-alignment positioning">
      :host {
        --iron-icon-fill-color: currentColor;
        display: block;
        z-index: 1;
        border-bottom: 1px solid var(--divider-color);
        background-color: var(--primary-background-color);
        transition: background-color var(--animation), border-bottom-color var(--animation), color var(--animation);
        color: var(--primary-text-color);
      }

      :host([transparent]) {
        --iron-icon-fill-color: var(--hero-font-color, '#fff');
        background-color: transparent;
        border-bottom-color: transparent;
        color: var(--hero-font-color, '#fff');
      }

      :host([transparent]) .toolbar-logo {
        background-color: var(--hero-logo-color);
        opacity: var(--hero-logo-opacity, 1);
      }

      app-toolbar {
        margin: 0 auto;
        padding: 0 16px;
        height: auto;
        max-width: var(--max-container-width);
      }

      .toolbar-logo {
        display: block;
        width: 150px;
        height: 32px;
        background-color: var(--default-primary-color);
        transition: background-color var(--animation);
        -webkit-mask: url('/images/logo-monochrome.svg') no-repeat;
      }

      .nav-items {
        --paper-tabs-selection-bar-color: var(--default-primary-color);
        --paper-tabs: {
          height: 64px;
        };
      }

      .nav-item a,
      .signin-tab {
        padding: 0 14px;
        color: inherit;
        text-transform: uppercase;
      }

      .profile-image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
      }

      .dropdown-panel {
        padding: 24px;
        max-width: 300px;
        background: #fff;
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .dropdown-panel p {
        margin-top: 0;
      }

      .dropdown-panel .panel-actions {
        margin: 0 -16px -16px 0;
      }

      .profile-details .profile-image {
        margin-right: 16px;
        width: 48px;
        height: 48px;
      }

      .profile-name,
      .profile-email {
        font-size: 14px;
        display: block;
        white-space: nowrap;
        color: var(--secondary-text-color);
      }

      .profile-action {
        margin-top: 4px;
        text-transform: uppercase;
        color: var(--default-primary-color);
        font-size: 14px;
        cursor: pointer;
      }

      paper-button iron-icon {
        margin-right: 8px;
        --iron-icon-fill-color: var(--hero-font-color);
      }

      .buy-button {
        margin-top: 12px;
      }

      @media (min-width: 640px) {
        app-toolbar {
          padding: 0 36px;
          height: initial;
        }
      }

    </style>

    <app-toolbar class="header">
      <div>
        <paper-icon-button
          icon="hoverboard:menu"
          hidden$="[[viewport.isLaptopPlus]]"
          aria-label="menu"
          on-tap="openDrawer"></paper-icon-button>
      </div>
      <div layout horizontal center flex>
        <a class="toolbar-logo" href="/" hidden$="[[!viewport.isLaptopPlus]]" layout horizontal title="{$ title $}"></a>
      </div>

      <paper-tabs
        class="nav-items"
        selected="[[route.route]]"
        attr-for-selected="name"
        hidden$="[[!viewport.isLaptopPlus]]"
        role="navigation"
        noink>
        {% for nav in navigation %}
        <paper-tab name="{$ nav.route $}" class="nav-item" link>
          <a href="{$ nav.permalink $}" layout vertical center-center>{$ nav.label $}</a>
        </paper-tab>
        {% endfor %}

<!--        <paper-tab class="signin-tab" on-tap="signIn" link hidden$="[[user.signedIn]]">{$ signIn $}</paper-tab>-->

<!--        <a-->
<!--          href$="[[_getTicketUrl(tickets)]]"-->
<!--          target="_blank"-->
<!--          rel="noopener noreferrer"-->
<!--          ga-on="click"-->
<!--          ga-event-category="ticket button"-->
<!--          ga-event-action="buy_click">-->
<!--          <paper-button class="buy-button" primary>{$ buyTicket $}</paper-button>-->
<!--        </a>-->
      </paper-tabs>

<!--      <paper-menu-button-->
<!--        id="notificationsMenu"-->
<!--        class="notifications-menu"-->
<!--        vertical-align="top"-->
<!--        horizontal-align="right"-->
<!--        no-animations>-->
<!--        <paper-icon-button-->
<!--          icon="hoverboard:[[_getNotificationsIcon(notifications.status)]]"-->
<!--          slot="dropdown-trigger"></paper-icon-button>-->
<!--        <div class="dropdown-panel" slot="dropdown-content">-->
<!--          <div hidden$="[[_hideNotificationBlock(notifications.status, 'DEFAULT')]]">-->
<!--            <p>{$ notifications.default $}</p>-->
<!--            <div class="panel-actions" layout horizontal end-justified>-->
<!--              <paper-button primary-text on-tap="_toggleNotifications">{$ notifications.subscribe $}</paper-button>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div hidden$="[[_hideNotificationBlock(notifications.status, 'GRANTED')]]">-->
<!--            <p>{$ notifications.enabled $}</p>-->
<!--            <div class="panel-actions" layout horizontal end-justified>-->
<!--              <paper-button primary-text on-tap="_toggleNotifications">{$ notifications.unsubscribe $}</paper-button>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div hidden$="[[_hideNotificationBlock(notifications.status, 'DENIED')]]">-->
<!--            <p>{$ notifications.blocked $}</p>-->
<!--            <div class="panel-actions" layout horizontal end-justified>-->
<!--              <a href="{$ notifications.enable.link $}" target="_blank" rel="noopener noreferrer">-->
<!--                <paper-button primary-text on-tap="_closeNotificationMenu">{$ notifications.enable.label $}-->
<!--                </paper-button>-->
<!--              </a>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </paper-menu-button>-->

<!--      <paper-menu-button-->
<!--        class="auth-menu"-->
<!--        hidden$="[[!user.signedIn]]"-->
<!--        vertical-align="top"-->
<!--        horizontal-align="right"-->
<!--        no-animations-->
<!--        layout-->
<!--        horizontal-->
<!--        center-center>-->
<!--        <div class="profile-image" slot="dropdown-trigger" style$="background-image: url('[[user.photoURL]]')"></div>-->
<!--        <div class="dropdown-panel profile-details" slot="dropdown-content" layout horizontal>-->
<!--          <div-->
<!--            class="profile-image"-->
<!--            slot="dropdown-trigger"-->
<!--            self-center-->
<!--            style$="background-image: url('[[user.photoURL]]')"></div>-->
<!--          <div layout vertical center-justified>-->
<!--            <span class="profile-name">[[user.displayName]]</span>-->
<!--            <span class="profile-email">[[user.email]]</span>-->
<!--            <span class="profile-action" role="button" on-tap="signOut">{$ signOut $}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </paper-menu-button>-->

<!--      <paper-icon-button-->
<!--        icon="hoverboard:account"-->
<!--        on-tap="signIn"-->
<!--        hidden$="[[_isAccountIconHidden(user.signedIn, viewport.isLaptopPlus)]]"></paper-icon-button>-->
    </app-toolbar>
`;
  }

  static get is() {
    return 'header-toolbar';
  }

  static get properties() {
    return {
      route: {
        type: String,
      },
      viewport: {
        type: Object,
      },
      addToHomescreen: {
        type: Object,
      },
      heroSettings: {
        type: Object,
        observer: '_setToolbarSettings',
      },
      dialogs: {
        type: Object,
      },
      notifications: {
        type: Boolean,
      },
      user: {
        type: Object,
      },
      tickets: {
        type: Object,
      },
      transparent: Boolean,
    };
  }

  static mapStateToProps(state, _element) {
    return {
      dialogs: state.dialogs,
      notifications: state.notifications,
      route: state.routing,
      schedule: state.schedule,
      user: state.user,
      addToHomescreen: state.ui.addToHomescreen,
      heroSettings: state.ui.heroSettings,
      viewport: state.ui.viewport,
    };
  }

  static get observers() {
    return [
      '_authStatusChanged(user.signedIn)',
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    HOVERBOARD.Elements.HeaderToolbar = this;
  }

  openDrawer() {
    uiActions.toggleDrawer(true);
  }

  closeDrawer() {
    uiActions.toggleDrawer(false);
  }

  signIn() {
    dialogsActions.openDialog(DIALOGS.SIGNIN);
  }

  signOut() {
    userActions.signOut();
  }

  _authStatusChanged(signedIn) {
    if (this.dialogs.signin.isOpened) {
      dialogsActions.closeDialog(DIALOGS.SIGNIN);
    }
  }

  _toggleNotifications() {
    this._closeNotificationMenu();
    if (this.notifications.status === NOTIFICATIONS_STATUS.GRANTED) {
      this.dispatchAction(notificationsActions.unsubscribe(this.notifications.token));
      return;
    }
    this.dispatchAction(notificationsActions.requestPermission());
  }

  _getNotificationsIcon(status) {
    return status === NOTIFICATIONS_STATUS.DEFAULT ?
      'bell-outline' :
      status === NOTIFICATIONS_STATUS.GRANTED ? 'bell' : 'bell-off';
  }

  _hideNotificationBlock(status, blockStatus) {
    return status !== NOTIFICATIONS_STATUS[blockStatus];
  }

  _closeNotificationMenu() {
    this.$.notificationsMenu.close();
  }

  _isAccountIconHidden(userSignedIn, isTabletPlus) {
    return userSignedIn || isTabletPlus;
  }

  _getTicketUrl(tickets) {
    if (!tickets.list.length) return '';
    const availableTicket = tickets.list.filter((ticket) => ticket.available)[0];
    return availableTicket ? availableTicket.url : tickets.list[0].url;
  }

  _setToolbarSettings(settings) {
    if (!settings) return;
    this.updateStyles({
      '--hero-font-color': settings.fontColor || '',
      '--hero-logo-opacity': settings.hideLogo ? '0' : '1',
      '--hero-logo-color': settings.backgroundImage ? '#fff' : 'var(--default-primary-color)',
    });
  }
}

customElements.define(HeaderToolbar.is, HeaderToolbar);
