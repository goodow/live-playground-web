<template>
  <div>
    <section>
      <div class="mdc-textfield mdc-textfield--upgraded" data-mdc-auto-init="MDCTextfield">
        <input type="text" class="mdc-textfield__input" id="my-textfield" required
               name="topic" aria-controls="my-textfield-helptext"
               list="topics" @input="handleTopicInput" @change="handleTopicChange($event.target.value)">
        <label for="my-textfield" class="mdc-textfield__label mdc-textfield__label--float-above">Topic</label>
      </div>
      <datalist id="topics">
        <template v-if="currentCategory">
          <option :value="currentCategory + '/' + topic" v-for="(value, topic) in category[currentCategory].topics">{{ topic }}</option>
        </template>
        <template v-else="currentCategory">
          <option :value="key + '/'" v-for="(value, key) in category">{{ value.desc || key }}
          </option>
        </template>
      </datalist>
    </section>

    <div class="mdc-elevation--z1">
      <section>
        <nav class="mdc-tab-bar" data-mdc-auto-init="MDCTabBar">
          <router-link class="mdc-tab" to="" active-class="mdc-tab--active">历史</router-link>
          <router-link class="mdc-tab" to="" active-class="mdc-tab--active">收藏</router-link>
          <span class="mdc-tab-bar__indicator"></span>
        </nav>
      </section>

      <section>
        <ul class="two-line-avatar-text-icon-demo mdc-list mdc-list--two-line mdc-list--avatar-list mdc-list--dense">
          <li class="mdc-list-item" v-for="message in reversedMessages"
              @click="handleHistoryClick(message)">
            <!--<span class="mdc-list-item__start-detail grey-bg" role="presentation">-->
            <!--<i class="material-icons" aria-hidden="true">folder</i>-->
            <!--</span>-->
            <span class="mdc-list-item__text" data-mdc-auto-init="MDCRipple">
                {{ message.key }}
                <span class="mdc-list-item__text__secondary"> {{ new Date(message.time).toLocaleString() }} </span>
              </span>
            <i
              class="my-mdc-list-item__end-detail mdc-icon-toggle material-icons" data-mdc-auto-init="MDCIconToggle"
              role="button"
              aria-label="Add to favorites"
              aria-pressed="false"
              tabindex="0"
              data-toggle-on='{"content": "favorite", "label": "Remove From Favorites"}'
              data-toggle-off='{"content": "favorite_border", "label": "Add to Favorites"}'
              @click.stop="">
              <!-- Prevent FOUC by putting the initial content in -->
              star_border
            </i>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
  import autoInit from '@material/auto-init';
  import { MDCRipple } from '@material/ripple';
  import { MDCIconToggle } from '@material/icon-toggle';
  import * as firebase from 'firebase';

  export default {
    name: 'topic-selector',
    data() {
      return {
        category: {
          views: {desc: '页面跳转'},
          actions: {desc: '操作指令'},
          jceRequests: {desc: 'JCE 网络请求'},
          jsBridge: {desc: 'Javascript 相互调用'},
          domains: {desc: '持久存储'}
        },
        history: {},
        currentCategory: '',
        currentTopic: '',
      };
    },
    computed: {
      reversedMessages () {
        const toRtn = [];
        let messages = this.history[this.currentTopic];
        for (let key in messages) {
          let msg = messages[key];
          msg.key = key;
          toRtn.push(msg);
        }
        return toRtn.reverse();
      }
    },
    methods: {
      handleTopicInput: function (event) {
        let val = event.target.value;
        if (val.endsWith('/')) {
          let category = val.substring(0, val.length - 1);
          if (!this.category[category]) {
            return;
          }
          if (this.category[category].topics) {
            this.currentCategory = category;
            return;
          }
          let self = this;
          let categoryItem = this.category[category];
          window.networkProgress.begin();
          this.busRef.child('category').child(category).once('value', function (snapshot) {
            window.networkProgress.end();
            categoryItem.topics = snapshot.val().topics;
            self.currentCategory = category;
          });
          return;
        }
        let index = val.indexOf('/');
        if (index === -1) {
          this.currentCategory = '';
          return;
        }
        let subTopic = val.substring(index + 1).replace(/\//g, '_');
        if (this.category[this.currentCategory].topics[subTopic]) {
          this.handleTopicChange(val);
        }
      },
      handleTopicChange: function (topic) {
        topic = topic.replace(/\//g, '_');
        this.$router.replace('/topic/' + topic);
        if (this.history[topic]) {
          this.currentTopic = topic;
          return;
        }

        let self = this;
        window.networkProgress.begin();
        this.busRef.child('history').child(topic).child('messages').limitToLast(10).once('value', function (snapshot) {
          window.networkProgress.end();
          self.history[topic] = snapshot.val();
          self.currentTopic = topic;
        });
      },
      handleHistoryClick: function (message) {
        this.$router.replace('/topic/' + this.$route.params.topic + '/messages/' + message.key);
        this.$emit('topicSelect', message);
      },
    },
    watch: {
    },
    mounted () {
      autoInit(this.$el);
      this.busRef = firebase.database().ref('bus');

      if (this.$route.params.topic) {
        this.currentTopic = this.$route.params.topic;
        document.getElementsByName("topic")[0].value = this.currentTopic.replace(/_/g, '/');
      }

      this.$watch(
        function () {
          return this.history[this.currentTopic];
        },
        function (newVal, oldVal) {
          let interactiveListItems = document.querySelectorAll('.mdc-list-item');
          for (var i = 0, li; li = interactiveListItems[i]; i++) {
            MDCRipple.attachTo(li);
          }
          interactiveListItems = document.querySelectorAll('.my-mdc-list-item__end-detail');
          for (var i = 0, li; li = interactiveListItems[i]; i++) {
            MDCIconToggle.attachTo(li);
          }
        }
      )
    },
  }
</script>

<style scoped>
  .mdc-textfield {
    width: 100%;
    margin-top: -16px !important;
  }
  .mdc-textfield__input {
    width: 100%;
  }
  .two-line-avatar-text-icon-demo {
    min-height: 200px;
  }
  .mdc-list-item__text {
    width: 100%;
  }
  .my-mdc-list-item__end-detail {
    color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, .87));
  }
</style>
