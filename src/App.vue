<template>
  <div>
    <header-bar @toggleSideBar="toggleSideBar"></header-bar>

    <div class="page-content">
      <side-bar v-show="sideBarVisible"></side-bar>
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>

    <footer-bar></footer-bar>
  </div>
</template>

<script>
import * as mdc from 'material-components-web';
import HeaderBar from './components/HeaderBar'
import FooterBar from './components/FooterBar'
import InteractiveBus from './components/topic/InteractiveBus'
import SideBar from './components/SideBar'
import * as firebase from 'firebase';
import Bus from './scripts/firebase-channel';

let options = {serverKey: 'AAAAi0oAoHs:APA91bHpP6JOtaE-MPMLrwhAA8SNWoqTdjZkKVeqBd1ZzgW02immONlaL7qj99T3cYUFx0elL2XSOc8z7m97ltu_o6fGQsx_iaYetFwOtwcXBV9cqvoizCTL1tV5NaJ8k4bRNHKbIk2x'};
window.bus = new Bus(options);

var config = {
  apiKey: "AIzaSyBvasV2WNLiFR6CR_m-_PbIDFEArYDtWpA",
  authDomain: "tencent-live.firebaseapp.com",
  databaseURL: "https://tencent-live.firebaseio.com",
};
firebase.initializeApp(config);
window.firebase = firebase;

export default {
  name: 'app',
  data() {
    return {
      sideBarVisible: true,
    };
  },
  methods: {
    toggleSideBar () {
      this.sideBarVisible = !this.sideBarVisible;
    }
  },
  components: {
    FooterBar,
    HeaderBar,
    InteractiveBus,
    SideBar
  },
  mounted () {
  }
}

</script>

<style scoped>
  /* Place drawer and main next to each other. */
  .page-content {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    box-sizing: border-box;
  }
  .main-content {
    width: 100%;
  }
</style>
