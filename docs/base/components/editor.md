# Editor 富文本编辑器

基于wangeditor封装的vue富文本编辑器组件。

---

<common-CodeBox title="基本使用">
  <code-editor1-1 />
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-editor">
        <bm-editor
          v-model="content"
          placeholder="请输入正文"
        />
      </div>
    </template>
  </highlight-code>
</common-CodeBox>

<common-CodeBox title="显示当前输入字数">
  <code-editor1-2 />
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-editor">
        <bm-editor
          v-model="content"
          :max="3000"
          placeholder="请输入正文"
          show-word-limit
        />
      </div>
    </template>
  </highlight-code>
</common-CodeBox>

<common-AttrTable :table-data="tableData" />

<script>
  export default {
    data() {
      return {
        tableData: [
          { param: 'v-model', desc: '绑定值', type: 'String/Number', optionValue: '', defaultValue: '' },
          { param: 'placeholder', desc: '输入框占位文本', type: 'String', optionValue: '', defaultValue: '' },
          { param: 'max', desc: '最大字数限制', type: 'Number', optionValue: '', defaultValue: '' },
          { param: 'showWordLimit', desc: '是否显示当前字数', type: 'Boolean', optionValue: '', defaultValue: 'false' },
          { param: 'systemBase', desc: '基路径（用于图片上传）', type: 'String', optionValue: '', defaultValue: '' }
        ]
      }
    }
  }
</script>