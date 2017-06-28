<template>
  <div>
    <header class="mdc-toolbar mdc-theme--dark" data-mdc-auto-init="MDCToolbar">
      <div class="mdc-toolbar__row">
        <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
          <a href="#" class="material-icons mdc-toolbar__icon--menu" @click.prevent="toggleSideBar">menu</a>
          <span class="mdc-toolbar__title">{{ title }}</span>
        </section>
        <section class="mdc-toolbar__section mdc-toolbar__section--align-end" role="toolbar">
          <div class="my-select-container mdc-select mdc-list--avatar-list" role="listbox" tabindex="0"
               data-mdc-auto-init="MDCSelect">
            <span class="mdc-select__selected-text">选择一个目标设备</span>
            <div class="mdc-simple-menu mdc-select__menu">
              <ul class="mdc-list mdc-simple-menu__items mdc-list--two-line mdc-list--avatar-list">
                <li class="mdc-list-item" role="option" aria-disabled="true">
                  选择一个目标设备
                </li>
                <li class="mdc-list-item" role="option" :id="client.id" tabindex="0" v-for="client in clients">
                  <img class="mdc-list-item__start-detail" :src="client.faceImageURL" width="56" height="56"
                       :alt="client.nickName">
                  <span class="mdc-list-item__text">
                    {{ client.nickName }}
                    <span class="mdc-list-item__text__secondary">{{ client.id }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </header>

    <section>
      <div role="progressbar" id="my-linearProgress" class="mdc-linear-progress mdc-linear-progress--indeterminate" data-mdc-auto-init="MDCLinearProgress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { MDCToolbar } from '@material/toolbar';
  import { MDCLinearProgress } from '@material/linear-progress';
  import autoInit from '@material/auto-init';
  import * as firebase from 'firebase';

  export default {
    name: 'header-bar',
    data() {
      return {
        title: 'Interactive web playground for data driven apps',
        clients: [],
        inProcessCount: 0
      };
    },
    methods: {
      toggleSideBar () {
        this.$emit('toggleSideBar');
      }
    },
    mounted () {
      autoInit(this.$el);
      this.linearProgress = document.getElementById("my-linearProgress").MDCLinearProgress;
      this.linearProgress.close();
      window.networkProgress = {};
      let self = this;
      window.networkProgress.begin = function () {
        self.inProcessCount += 1;
      };
      window.networkProgress.end = function () {
        self.inProcessCount = Math.max(0, self.inProcessCount - 1);
      };

      const select = document.querySelector('.mdc-select').MDCSelect;
      select.listen('MDCSelect:change', () => {
        bus.targetClients = [select.value, '/topics/qq3175830003'];
      });

      window.busRef = firebase.database().ref('bus');
      busRef.child('clients').on('value', function (snapshot) {
        self.clients.splice(0);
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          childData.id = childKey;
          self.clients.push(childData);
        });
        if (self.clients.length) {
          self.$nextTick(function () {
            select.selectedIndex = self.clients.length;
            bus.targetClients = [select.value, '/topics/qq3175830003'];
          });
        }
      });
    },
    watch: {
      inProcessCount () {
        if (this.inProcessCount > 0) {
          this.linearProgress.open();
        } else {
          this.linearProgress.close();
        }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-select-container {
    margin-right: 40px;
  }
</style>
