<template>
  <div>
    <section>
      <ul class="two-line-avatar-text-icon-demo mdc-list mdc-list--two-line mdc-list--avatar-list mdc-list--dense">
        <li class="mdc-list-item" v-for="(val, key) in models" @click="editModel(key, val)">
            <!--<span class="mdc-list-item__start-detail grey-bg" role="presentation">-->
            <!--{{ val.data['@type'].substring(val.data['@type'].indexOf('QQLPBLive') + 9) }}-->
            <!--</span>-->
          <span class="mdc-list-item__text" data-mdc-auto-init="MDCRipple">
                {{ key }}
                <span class="mdc-list-item__text__secondary">{{ JSON.stringify(val.data).substring(0, 150) }}</span>
              </span>
          <a class="mdc-list-item__end-detail material-icons" href="#"
             aria-label="Remove from favorites" title="Remove from favorites"
             @click.prevent="deleteModel(key)">
            delete_forever
          </a>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
  import * as firebase from 'firebase';
  import Vue from 'vue'
  import { MDCRipple } from '@material/ripple';
  import { MDCIconToggle } from '@material/icon-toggle';

  export default {
    name: 'render-models',
    data() {
      return {
        models: {}
      };
    },
    methods: {
      deleteModel (key) {
        window.networkProgress.begin();
        this.renderRef.child(key).remove(function () {
          window.networkProgress.end();
        });
      },
      editModel (key, val) {
        let type = val.data['@type'];
        type = type.substring(type.indexOf('QQLPBLive') + 9);
        this.$router.replace('/render/' + type + '/models/' + key);
        this.$emit('renderModelSelect', {payload: val.data});
      }
    },
    mounted () {
      let self = this;
      this.renderRef = firebase.database().ref('render').child('default');
      this.renderRef.on('child_added', function (snapshot) {
        Vue.set(self.models, snapshot.key, snapshot.val());
      });
      this.renderRef.on('child_removed', function (snapshot) {
        Vue.delete(self.models, snapshot.key);
      });
      this.renderRef.on('child_changed', function (snapshot) {
        Vue.set(self.models, snapshot.key, snapshot.val());
      });
    },
    watch: {
      models: function (newVal, oldVal) {
        Vue.nextTick(function () {
          let interactiveListItems = document.querySelectorAll('.mdc-list-item');
          for (var i = 0, li; li = interactiveListItems[i]; i++) {
            MDCRipple.attachTo(li);
          }
        });
      }
    }
  }

</script>

<style scoped>
  .mdc-list-item__text {
    width: calc(100% - 72px);
    overflow-wrap: break-word;
  }
  .mdc-list-item__end-detail {
    color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, .87));
    text-decoration: none;
  }
</style>
