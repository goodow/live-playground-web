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

    <section>
      <div class="mdc-textfield mdc-textfield--multiline" data-mdc-auto-init="MDCTextfield">
        <textarea id="multi-line-options" class="mdc-textfield__input" aria-controls="options-helptext"
                  @input="autoResizeTextArea($event.target)" v-model="optionsStr"></textarea>
        <label for="multi-line-options" class="mdc-textfield__label mdc-textfield__label--float-above">Options:</label>
      </div>
      <p id="options-helptext" class="mdc-textfield-helptext mdc-textfield-helptext--validation-msg mdc-textfield-helptext--persistent"
         aria-hidden="true" style="color:#d50000">
      </p>
    </section>

    <section v-if="url">
      <div>Url:</div>
      <pre>{{ url }}</pre>
    </section>
  </div>
</template>

<script>
  import autoInit from '@material/auto-init';
  import { MDCRipple } from '@material/ripple';
  import TopicSelector from "./TopicSelector";
  import Bus from '../scripts/firebase-channel';

  let options = {serverKey: 'AAAAi0oAoHs:APA91bHpP6JOtaE-MPMLrwhAA8SNWoqTdjZkKVeqBd1ZzgW02immONlaL7qj99T3cYUFx0elL2XSOc8z7m97ltu_o6fGQsx_iaYetFwOtwcXBV9cqvoizCTL1tV5NaJ8k4bRNHKbIk2x'};
  window.bus = new Bus(options);

  export default {
    name: 'message-send',
    props: ['message'],
    data() {
      return {
        payloadStr: '',
        optionsStr: '',
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
      options () {
        let options;
        try {
          options = this.optionsStr.length ? JSON.parse(this.optionsStr) : null;
        } catch (e) {
        }
        let ele = document.querySelectorAll('.mdc-textfield--multiline')[1];
        if (ele) {
          ele.MDCTextfield.helptextElement.innerHTML = this.optionsStr && !options ? '格式不正确' : '';
        }
        return options;
      },
      url () {
        function flatten(input, reference, output) {
          output = output || {};
          for (var key in input) {
            var value = input[key];
            key = reference ? reference + '.' + key : key;
            if (typeof value === 'object' && value !== null) {
              flatten(value, key, output);
            } else {
              output[key] = value;
            }
          }
          return output;
        }

        let topic = this.$route.params.topic;
        if (!topic || (!topic.startsWith('views_') && !topic.startsWith('actions_'))) {
          return null;
        }

        let toReturn = 'qqlivebroadcast://';
        let index = topic.indexOf('_');
        toReturn += topic.substring(0, index);
        toReturn += "/"
        toReturn += topic.substring(index + 1).replace(/_/g, '/');
        toReturn += topic.startsWith('views_') ? 'View?' : '?';
        if (typeof this.payload === 'object') {
          let result = flatten(this.payload);
          for (var key in result) {
            toReturn += (key + '=' + result[key] + '&');
          }
        }
        if (this.options && this.options.extras) {
          result = flatten(this.options.extras.viewOpt, 'viewOption');
          for (var key in result) {
            toReturn += (key + '=' + result[key] + '&');
          }
        }
        return toReturn.substring(0, toReturn.length - 1);
      }
    },
    methods: {
      autoResizeTextArea () {
        let elements = document.querySelectorAll('.mdc-textfield--multiline');
        this.$nextTick(function () {
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
        let topic = this.$route.params.topic;
        if (!topic) {
          window.snackbar.show({message: '请填写 Topic', actionText: 'OK', actionHandler: () => {}});
          return;
        }
        topic = topic.replace(/_/g, '/');
        if ((this.payloadStr && !this.payload) || (this.optionsStr && this.options === undefined)) {
          let text = this.payload ? 'Options' : 'Payload';
          window.snackbar.show({message: text + ' 格式不正确', actionText: 'OK', actionHandler: () => {}});
          return;
        }

        window.networkProgress.begin();
        let message = {payload: this.payload, options: this.options};
        this.$emit('sendMessage', message);
        let self = this;
        bus.send(topic, this.payload, this.options, function (asyncResult) {
          window.networkProgress.end();
          message.reply = asyncResult.result;
          self.$emit('sendMessage', message);
        });
      },
    },
    mounted () {
      autoInit(this.$el);
    },
    watch: {
      message (val, oldVal) {
        this.payloadStr = val.payload && JSON.stringify(val.payload, null, 2);
        this.optionsStr = val.options && JSON.stringify(val.options, null, 2);
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
