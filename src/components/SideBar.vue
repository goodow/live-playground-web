<template>
  <nav class="mdc-permanent-drawer mdc-typography">
    <div class="mdc-list-group">
      <nav class="mdc-list">
        <router-link to="/topic" class="mdc-list-item" active-class="mdc-permanent-drawer--selected">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">track_changes</i>消息传递
        </router-link>
      </nav>

      <hr class="mdc-list-divider">

      <nav class="mdc-list">
        <router-link to="/editor" class="mdc-list-item" active-class="mdc-permanent-drawer--selected">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">mode_edit</i>富文本编辑器
        </router-link>
      </nav>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'side-bar',
    data() {
      return {};
    },
    mounted () {
    }
  }

</script>

<style scoped>
</style>
