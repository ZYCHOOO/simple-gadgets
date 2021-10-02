<template>
  <div class="code-editor">
    <div>
      <editor
        v-model="content"
        placeholder="请输入内容"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Editor1-1',
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