<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-3">
        <topic-selector @topicSelect="handleTopicSelect"></topic-selector>
      </div>

      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">
        <message-send :message="sendMessage" @sendMessage="handleTopicSelect"></message-send>
      </div>

      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
        <div>Reply:</div>
        <pre>{{ replyMessage && JSON.stringify(replyMessage, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import autoInit from '@material/auto-init';
import { MDCRipple } from '@material/ripple';
import TopicSelector from "./TopicSelector";
import MessageSend from "./MessageSend";

export default {
  components: {
    TopicSelector,
    MessageSend
  },
  name: 'interactive-bus',
  data() {
    return {
      sendMessage: null,
      replyMessage: null
    }
  },
  computed: {

  },
  methods: {
    handleTopicSelect (message) {
      this.sendMessage = message;
      this.replyMessage = message.reply;
    },
    fetchData () {
      if (this.$route.params.topic) {
//        let currentTopic = this.$route.params.topic;
//        document.getElementsByName("topic")[0].value = this.currentTopic.replace(/_/g, '/');
      }
    }
  },
  watch: {
    '$route': 'fetchData',
  },
  mounted () {
    let msgId = this.$route.params.id;
    if (msgId) {
      let topic = this.$route.params.topic;
      let self = this;
      let child = busRef.child('history').child(topic).child('messages').child(msgId);
      window.networkProgress.begin();
      child.once('value', function (snapshot) {
        window.networkProgress.end();
        self.handleTopicSelect(snapshot.val());
      });
    }
  }
}
</script>

<style scoped>
</style>
