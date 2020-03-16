import '@polymer/app-route/app-route.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/marked-element';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/posts-list.js';
import '../elements/shared-styles.js';
import { ReduxMixin } from '../mixins/redux-mixin.js';
import { UtilsFunctions } from '../mixins/utils-functions.js';
import { blogActions } from '../redux/actions.js';

class PostPage extends UtilsFunctions(ReduxMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="shared-styles flex flex-alignment">
      :host {
        display: block;
      }

      .post {
        margin-bottom: 32px;
      }

      .date {
        font-size: 12px;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .suggested-posts {
        margin: 24px 0 -20px;
        padding-top: 24px;
        background-color: var(--primary-background-color);
      }

      [slot="markdown-html"] {
        font-size: 18px;
        line-height: 1.8;
        color: var(--primary-text-color);
      }

      [slot="markdown-html"] h1,
      [slot="markdown-html"] h2,
      [slot="markdown-html"] h3 {
        margin: 48px 0 16px;
      }

      [slot="markdown-html"] p {
        margin-top: 0;
        margin-bottom: 24px;
      }

      [slot="markdown-html"] img {
        width: 100%;
      }

      [slot="markdown-html"] plastic-image {
        margin: 32px 0 8px -16px;
        --iron-image-width: calc(100% + 32px);
        width: calc(100% + 32px);
        min-height: 200px;
        background-color: var(--secondary-background-color);
      }

      @media (min-width: 640px) {
        [slot="markdown-html"] plastic-image {
          min-height: 400px;
        }

        .suggested-posts {
          margin-top: 48px;
          padding-bottom: 36px;
        }
      }

    </style>

    <polymer-helmet
      title="[[post.title]] | {$ title $}"
      description="[[post.brief]]"
      image="[[post.image]]"
      active="[[active]]"
      label1="{$ blog.published $}"
      data1="[[published]]"></polymer-helmet>

    <app-route route="[[route]]" pattern="/:id" data="{{postData}}"></app-route>

    <hero-block
      background-image="[[post.image]]"
      background-color="[[post.primaryColor]]"
      font-color="#4B5356"
      active="[[active]]">
      <div class="hero-title">[[post.title]]</div>
    </hero-block>

    <div class="container-narrow">
      <marked-element class="post" markdown="[[postContent]]">
        <div slot="markdown-html"></div>
      </marked-element>
      <div class="date">{$ blog.published $}: [[getDate(post.published)]]</div>
    </div>

    <div class="suggested-posts">
      <div class="container-narrow">
        <h3 class="container-title">{$ blog.suggested $}</h3>
        <posts-list posts="[[suggestedPosts]]"></posts-list>
      </div>
    </div>

    <iron-ajax auto url="[[post.source]]" handle-as="text" on-response="handleMarkdownFileFetch"></iron-ajax>
`;
  }

  static get is() {
    return 'post-page';
  }

  static get properties() {
    return {
      active: Boolean,
      route: Object,
      post: Object,
      postsList: {
        type: Array,
      },
      postsMap: {
        type: Object,
      },
      postsFetching: {
        type: Boolean,
      },
      postsFetchingError: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
    };
  }

  static mapStateToProps(state, _element) {
    return {
      viewport: state.ui.viewport,
      postsList: state.blog.list,
      postsMap: state.blog.obj,
      postsFetching: state.blog.fetching,
      postsFetchingError: state.blog.fetchingError,
    };
  }

  static get observers() {
    return [
      '_postDataObserver(postData.id, postsList)',
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.postsFetching && (!this.postsList || !this.postsList.length)) {
      this.dispatchAction(blogActions.fetchList());
    }
  }

  handleMarkdownFileFetch(event) {
    if (event.detail.response) {
      this.set('postContent', event.detail.response);
    }
  }

  _postDataObserver(postId, postsList) {
    if (!this.postsList || !this.postsList.length || !this.postsMap[this.postData.id]) {
      return;
    }

    const post = this.postsMap[this.postData.id];
    this.set('post', post);
    this.set('postContent', post.content);
    this.set('suggestedPosts', this.postsList
        .filter((post) => post.id !== this.postData.id)
        .slice(0, 3),
    );
  }
}

window.customElements.define(PostPage.is, PostPage);
