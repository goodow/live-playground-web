<template>
  <div>
    <div>在腾讯直播 iPhone App 中实时预览: 我的->设置->快速连续三次点击"设置"标题栏打开彩蛋->实验室->开发者->富文本预览</div>
    <!-- Create the container -->
    <div id="toolbar"></div>
    <div id="editor-container"></div>
    <div class="flexbox-container">
      <pre id="delta"></pre>
      <pre id="document"></pre>
    </div>
  </div>
</template>

<script>
  import Quill from 'quill';
  import * as firebase from 'firebase';
  import Firepad from '../scripts/firepad/firepad.js';

  export default {
    name: 'rich-editor',
    data() {
      return {};
    },
    mounted () {
      //// Create Quill.
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'align': []}],

        ['link', 'image'],

        [{'font': []}],
        ['clean']                                         // remove formatting button
      ];
      var editor = window.quill = new Quill('#editor-container', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'  // or 'bubble'
      });
      editor.on('text-change', function (delta, oldContents, source) {
        printDocument();
        if (source === 'user') {
          var pre = document.getElementById('delta');
          pre.textContent = '差量:\n' + JSON.stringify(delta, null, 2);
        }
      });

      var ref = firebase.database().ref('richText').child('default');
      //// Create Firepad.
      var pad = Firepad.fromQuill(ref, editor, null);
      //// Initialize contents.
      pad.on('ready', function () {
        printDocument();
        if (pad.isHistoryEmpty()) {
//          pad.setText('Compose an epic...');
        }
      });

      function printDocument() {
        var pre = document.getElementById('document');
        pre.textContent = '文档:\n' + JSON.stringify(editor.getContents(), null, 2);
      }

    }
  }

</script>

<style scoped>
  @import '../../node_modules/quill/dist/quill.snow.css';
  .flexbox-container {
    display: flex;
    padding: 20px;
    background:#eee;
  }

  .flexbox-container > pre {
    width: 50%;
    padding: 10px;
    background:#fff;
  }
</style>
