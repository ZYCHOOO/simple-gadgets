<template>
  <div class="code-editor">
    <div>
      <editor
        v-model="content"
        :max="1800"
        placeholder="请输入内容"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Editor1-2',
  components: {
    Editor: () => import('../../../../plugins/components/editor/Editor')
  },
  data() {
    return {
      content: ''
    }
  }
}
</script>