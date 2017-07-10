<template>
  <div>
    <section>
      <button class="send-button mdc-button mdc-button--raised mdc-button--primary" data-mdc-auto-init="MDCRipple"
              @click="handleSendClick">
        Send
      </button>
    </section>

    <section>
      <div class="mdc-textfield mdc-textfield--multiline" data-mdc-auto-init="MDCTextfield">
        <textarea id="multi-line-payload" class="mdc-textfield__input" aria-controls="payload-helptext"
                  @input="autoResizeTextArea($event.target)" v-model="payloadStr"></textarea>
        <label for="multi-line-payload" class="mdc-textfield__label mdc-textfield__label--float-above">Payload:</label>
      </div>
      <p id="payload-helptext" class="mdc-textfield-helptext mdc-textfield-helptext--validation-msg mdc-textfield-helptext--persistent"
         aria-hidden="true" style="color:#d50000">
      </p>
    </section>

  </div>
</template>

<script>
  import autoInit from '@material/auto-init';
  import { MDCRipple } from '@material/ripple';
  import * as firebase from 'firebase';

  export default {
    name: 'render-send',
    props: ['message'],
    data() {
      return {
        payloadStr: '',
      };
    },
    computed: {
      payload () {
        let payload;
        try {
          payload = this.payloadStr.length ? JSON.parse(this.payloadStr) : null;
        } catch (e) {
        }
        let ele = document.querySelectorAll('.mdc-textfield--multiline')[0];
        if (ele) {
          ele.MDCTextfield.helptextElement.innerHTML = this.payloadStr && !payload ? '格式不正确' : '';
        }
        return payload;
      },
    },
    methods: {
      autoResizeTextArea () {
        let elements = document.querySelectorAll('.mdc-textfield--multiline');
        this.$nextTick(function () {
          this.payload;
          this.options;
          for (let i in elements) {
            let mdcTextfield = elements[i].MDCTextfield;
            if (!mdcTextfield) {
              return;
            }
            let textArea = mdcTextfield.input_;
            textArea.style.height = 'auto';
            textArea.style.height = (textArea.scrollHeight) + "px";
          }
        });
      },
      handleSendClick () {
        let render = this.$route.params.render;
        if (!render) {
          window.snackbar.show({message: '请填写 Render', actionText: 'OK', actionHandler: () => {}});
          return;
        }
        if (this.payloadStr && !this.payload) {
          window.snackbar.show({message: 'Payload 格式不正确', actionText: 'OK', actionHandler: () => {}});
          return;
        }

        let id = this.$route.params.id;
        window.networkProgress.begin();
        let ref = firebase.database().ref('render').child('default');
        ref = id ? ref.child(id) : ref.push();
        let val = {data: this.payload};
        ref.set(val, function (error) {
          window.networkProgress.end();
          if (error) {
            window.snackbar.show({message: '发送失败', actionText: 'OK', actionHandler: () => {}});
          }
        });
      },
    },
    mounted () {
      autoInit(this.$el);
//      let msgId = this.$route.params.id;
//      if (msgId) {
//        let topic = 'renders_' + this.$route.params.render;
//        let self = this;
//        let busRef = firebase.database().ref('bus');
//        let child = busRef.child('history').child(topic).child('messages').child(msgId);
//        window.networkProgress.begin();
//        child.once('value', function (snapshot) {
//          window.networkProgress.end();
//          self.message = snapshot.val();
//        });
//      }
    },
    watch: {
      message (val, oldVal) {
        this.payloadStr = val.payload && JSON.stringify(val.payload, null, 2);
        this.autoResizeTextArea();
      },
    }
  };
</script>

<style scoped>
  .mdc-textfield {
    width: 100%;
    /*margin-bottom: 20px;*/
  }
  .mdc-textfield__input {
    width: 100%;
  }
  .send-button {
    float: right;
  }
</style>
