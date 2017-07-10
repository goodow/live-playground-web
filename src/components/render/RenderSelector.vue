<template>
  <div>
    <section>
      <div class="mdc-textfield mdc-textfield--upgraded" data-mdc-auto-init="MDCTextfield">
        <input type="text" class="mdc-textfield__input" id="my-textfield" required
               name="render" aria-controls="my-textfield-helptext"
               list="topics" @input="handleTopicInput" @change="handleTopicInput">
        <label for="my-textfield" class="mdc-textfield__label mdc-textfield__label--float-above">Render</label>
      </div>
      <datalist id="topics">
        <option :value="topic" v-for="(value, topic) in renders">{{ topic }}</option>
      </datalist>
    </section>

    <div class="mdc-elevation--z1">
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
    name: 'render-selector',
    data() {
      return {
        renders: {},
        history: {},
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
        this.$router.replace('/render/' + val);
        if (!this.renders[val]) {
          this.currentTopic = '';
          return;
        }
        let topic = 'renders_' + val;
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
        this.$router.replace('/render/' + this.$route.params.render);
        this.$emit('topicSelect', message);
      },
    },
    watch: {
    },
    mounted () {
      autoInit(this.$el);
      let render = this.$route.params.render;
      if (render) {
        this.currentTopic = 'renders_' + render;
        document.getElementsByName("render")[0].value = render;
      }

      this.busRef = firebase.database().ref('bus');
      let self = this;
      window.networkProgress.begin();
      this.busRef.child('category').child('renders').once('value', function (snapshot) {
        window.networkProgress.end();
        self.renders = snapshot.val().topics;
      });

      this.$watch(
        function () {
          return this.history[this.currentTopic];
        },
        function (newVal, oldVal) {
          let interactiveListItems = document.querySelectorAll('.mdc-list-item');
          for (var i = 0, li; li = interactiveListItems[i]; i++) {
            MDCRipple.attachTo(li);
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
</style>
