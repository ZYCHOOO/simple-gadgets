<template lang="html">
  <div class="bmsk-editor">
    <div class="editor-bar">
      <div ref="toolbar" class="toolbar" />
      <div ref="editor" class="text" :style="{height: contentHeight}" />
    </div>
    <show-word-limit
      v-if="showWordLimit"
      :content="value"
      :max="max"
    />
  </div>
</template>

<script>
import Wangeditor from 'wangeditor'
import EditorMixin from './EditorMixin'
import * as utils from './utils'
export default {
  name: 'Editor',
  mixins: [EditorMixin],
  components: {
    ShowWordLimit: () => import('./ShowWordLimit')
  },
  data () {
    return {
      content: '',
      editor: null,
      info_: null,
      browserData: {
        _ua: navigator.userAgent.toLowerCase(),
        _QUIRKS: document.compatMode !== 'CSS1Compat',
        _IERANGE: !window.getSelection,
        pasteType: 2, // 0:none, 1:text, 2:HTML

        _IE: false,
        _NEWIE: false,
        _GECKO: false,
        _WEBKIT: false,
        _OPERA: false,
        _MOBILE: false,
        _IOS: false
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    contentHeight: {
      type: String,
      default: '320px'
    },
    placeholder: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 0
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    headers: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          if (val !== this.content) {
            this.setContent(val)
          }
        } else {
          this.setContent('')
        }
      }
    },
    content (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.editor = new Wangeditor(this.$refs.toolbar, this.$refs.editor)
    // 兼容老版本
    this.editor.customConfig = this.editor.customConfig
      ? this.editor.customConfig : this.editor.config
    this.initEditorBrowserData()
    this.setEditor()
    this.content = this.value
    this.$refs.editor.querySelector('.w-e-text').blur()
  },
  methods: {
    initEditorBrowserData () {
      this.browserData._IE = this.browserData._ua.indexOf('msie') > -1 && this.browserData._ua.indexOf('opera') === -1
      this.browserData._NEWIE = this.browserData._ua.indexOf('msie') === -1 && this.browserData._ua.indexOf('trident') > -1
      this.browserData._GECKO = this.browserData._ua.indexOf('gecko') > -1 && this.browserData._ua.indexOf('khtml') === -1
      this.browserData._WEBKIT = this.browserData._ua.indexOf('applewebkit') > -1
      this.browserData._OPERA = this.browserData._ua.indexOf('opera') > -1
      this.browserData._MOBILE = this.browserData._ua.indexOf('mobile') > -1
      this.browserData._IOS = /ipad|iphone|ipod/.test(this.browserData._ua)
    },
    setEditor () {
      this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
      this.editor.customConfig.uploadImgServer = utils._getBaseUrl() + this.action // 后端上传照片接口

      this.editor.customConfig.uploadImgHeaders = this.headers // 后端上传照片请求头
      this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名

      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 2 // 限制一次最多上传 2 张图片
      this.editor.customConfig.uploadImgTimeout = 30 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'table', // 表格
        'image', // 插入图片
        'undo', // 撤销
        'redo' // 重复
      ]

      this.editor.customConfig.uploadImgHooks = {
        // eslint-disable-next-line no-unused-vars
        fail: (xhr, editor, result) => {
          // alert('上传失败:' + result)
        },
        // eslint-disable-next-line no-unused-vars
        success: function (xhr, editor, result) {
          console.log('上传成功')
        },
        // eslint-disable-next-line no-unused-vars
        timeout: (xhr, editor) => {
          // 网络超时的回调
          alert('网络超时，请重新上传！')
        },
        // eslint-disable-next-line no-unused-vars
        error: (xhr, editor) => {
          alert('网络异常，请重新上传！')
          return false
        },
        // eslint-disable-next-line no-unused-vars
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          if (result.code === 0) {
            insertImg(result.data)
          } else {
            alert(result.msg)
          }
        }
      }

      const self = this

      this.editor.customConfig.onchange = (html) => {
        // 监控变化，同步更新到 textarea
        this.content = html
      }

      // 自定义处理粘贴的文本内容
      this.editor.customConfig.pasteTextHandle = (html) => {
        // html 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        if (!html) return ''

        // Chrome纯文本粘贴问题
        if (this.browserData._WEBKIT) {
          html = html.replace(/(<br>)\1/ig, '$1')
        }
        // paste HTML
        if (self.browserData.pasteType === 2) {
          // 去除内容为空的p标签
          html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '')
          // paste from ms word
          if (/schemas-microsoft-com|worddocument|mso-\w+/i.test(html)) {
            html = this._clearMsWord(html, self.filterMode ? self.htmlTags : this.htmlTags)
          } else {
            html = this._formatHtml(html, self.filterMode ? self.htmlTags : null)
          }
        }
        // paste text
        if (self.browserData.pasteType === 1) {
          html = html.replace(/&nbsp;/ig, ' ')
          html = html.replace(/\n\s*\n/g, '\n')
          html = html.replace(/<br[^>]*>/ig, '\n')
          html = html.replace(/<\/p><p[^>]*>/ig, '\n')
          html = html.replace(/<[^>]+>/g, '')
          html = html.replace(/ {2}/g, ' &nbsp;')
          if (self.newlineTag === 'p') {
            if (/\n/.test(html)) {
              html = html.replace(/^/, '<p>').replace(/$/, '<br /></p>').replace(/\n/g, '<br /></p><p>')
            }
          } else {
            html = html.replace(/\n/g, '<br />$&')
          }
        }

        return html
      }

      this.editor.config.placeholder = this.placeholder || ''

      // 创建富文本编辑器
      this.editor.create()
      this.editor.txt.html(this.value)
    },
    setContent (val) {
      this.editor.txt.html(val)
    }
  }
}
</script>

<style lang="scss">
.bmsk-editor {
  position: relative;
}
.editor-bar {
  overflow-x: hidden;
  position: relative;
  z-index: 0;

  .w-e-toolbar {
    flex-wrap: wrap;
  }
  .toolbar {
    padding-top: 1px;
    border-radius: 4px 4px 0 0;
    border: 1px solid #dcdfe6;
  }
  .text {
    padding-bottom: 1px;
    border-radius: 0 0 4px 4px;
    border: 1px solid #dcdfe6;
    border-top: none;
    min-height: 300px;
  }
  .w-e-text {
    min-height: 300px;
    overflow-y: auto;
    // resize: vertical;
  }
  /* table 样式 */
  table {
    border-collapse: collapse;
    border: 1px solid #333 !important;
  }
  table td,
  table th {
    border-top: transparent !important;
    border-left: transparent !important;
    border-bottom: 1px solid #333 !important;
    border-right: 1px solid #333 !important;
    padding: 3px 5px;
  }
  table th {
    text-align: center;
  }
  .editor-input {
    /deep/.el-input__inner {
      border: none;
    }
  }
  .placeholder-input {
    .el-input__inner {
      border: none !important;
    }
  }
}
</style>
