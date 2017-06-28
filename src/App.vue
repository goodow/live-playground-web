<template>
  <div>
    <header-bar @toggleSideBar="toggleSideBar"></header-bar>

    <div class="demo-content">
      <side-bar v-show="sideBarVisible"></side-bar>
      <main>
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
import InteractiveBus from './components/InteractiveBus'
import SideBar from './components/SideBar'
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBvasV2WNLiFR6CR_m-_PbIDFEArYDtWpA",
  authDomain: "tencent-live.firebaseapp.com",
  databaseURL: "https://tencent-live.firebaseio.com",
};
firebase.initializeApp(config);

export default {
  name: 'app',
  data() {
    return {
      sideBarVisible: true,
      inProgress: 0
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

<style>
  /* Place drawer and main next to each other. */
  .demo-content {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    box-sizing: border-box;
  }
</style>
