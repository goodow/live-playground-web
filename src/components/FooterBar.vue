<template>
  <div>
    <div id="mdc-js-snackbar" data-mdc-auto-init="MDCSnackbar"
         class="mdc-snackbar"
         aria-live="assertive"
         aria-atomic="true"
         aria-hidden="true">
      <div class="mdc-snackbar__text"></div>
      <div class="mdc-snackbar__action-wrapper">
        <button type="button" class="mdc-button mdc-snackbar__action-button"></button>
      </div>
    </div>
  </div>
</template>

<script>
  import { MDCSnackbar } from '@material/snackbar';

  export default {
    name: 'footer-bar',
    props: ['message', 'actionText', 'actionHandler'],
    data() {
      return {
      };
    },
    mounted () {
      window.snackbar = this.snackbar = new MDCSnackbar(document.getElementById('mdc-js-snackbar'));
    },
    watch: {
      message () {
        let data = {
          message: this.message,
//          actionText: this.actionText,
//          actionHandler: this.actionHandler
        };
        this.snackbar.show(data);
      }
    }
  }

</script>

<style scoped>
</style>
