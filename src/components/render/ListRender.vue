<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
        <render-models :message="message" @renderModelSelect="renderModelSelect"></render-models>
      </div>

      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4">
        <render-send :message="message" @sendMessage="renderModelSelect"></render-send>
      </div>

      <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-3">
        <render-selector @topicSelect="renderModelSelect"></render-selector>
      </div>
    </div>
  </div>
</template>

<script>
//  import autoInit from '@material/auto-init';
  import RenderModels from "./RenderModels";
  import RenderSend from "./RenderSend";
  import RenderSelector from "./RenderSelector";

  export default {
    components: {
      RenderSelector,
      RenderSend,
      RenderModels,
    },
    name: 'list-render',
    data() {
      return {
        message: null,
      }
    },
    computed: {

    },
    methods: {
      renderModelSelect (message) {
        this.message = message;
      },
      fetchData () {
        if (this.$route.params.topic) {
//        let currentTopic = this.$route.params.topic;
//        document.getElementsByName("topic")[0].value = this.currentTopic.replace(/_/g, '/');
        }
      }
    },
    watch: {
    },
    mounted () {
    }
  }
</script>

<style scoped>
</style>
