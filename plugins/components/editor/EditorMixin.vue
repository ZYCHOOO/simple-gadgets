<script>
import * as utils from './utils'
export default {
  name: 'EditorMixin',
  data() {
    return {
      htmlTags: utils.htmlTags
    }
  },
  methods: {
    _clearMsWord(html, htmlTags) {
      html = html.replace(/<meta[\s\S]*?>/ig, '')
        .replace(/<![\s\S]*?>/ig, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/ig, '')
        .replace(/<w:[^>]+>[\s\S]*?<\/w:[^>]+>/ig, '')
        .replace(/<o:[^>]+>[\s\S]*?<\/o:[^>]+>/ig, '')
        .replace(/<xml>[\s\S]*?<\/xml>/ig, '')
        .replace(/<spanyes';[^>]*>/ig, '')
        .replace(/<\/spanyes';[^>]*>/ig, '')
        .replace(/<spantimes[^>]*>/ig, '')
        .replace(/<\/spantimes[^>]*>/ig, '')
        .replace(/<(?:table|td)[^>]*>/ig, function(full) {
          return full.replace(/border-bottom:([#\w\s]+)/ig, 'border:$1')
        })
      return this._formatHtml(html, htmlTags)
    },
    _formatHtml(html, htmlTags, urlType, wellFormatted, indentChar) {
      // null or undefined: object == null
      if (html == null) {
        html = ''
      }
      urlType = urlType || ''
      wellFormatted = utils._undef(wellFormatted, false)
      indentChar = utils._undef(indentChar, '\t')
      var fontSizeList = 'xx-small,x-small,small,medium,large,x-large,xx-large'.split(',')
      // 将pre里的br转换成\n
      html = html.replace(/(<(?:pre|pre\s[^>]*)>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3) {
        return $1 + $2.replace(/<(?:br|br\s[^>]*)>/ig, '\n') + $3
      })
      // <br/></p> to </p>
      html = html.replace(/<(?:br|br\s[^>]*)\s*\/?>\s*<\/p>/ig, '</p>')
      // <p></p> to <p><br /></p>
      html = html.replace(/(<(?:p|p\s[^>]*)>)\s*(<\/p>)/ig, '$1<br />$2')
      // empty char
      html = html.replace(/\u200B/g, '')
      // &copy;
      html = html.replace(/\u00A9/g, '&copy;')
      // &reg;
      html = html.replace(/\u00AE/g, '&reg;')
      // wps
      html = html.replace(/<spanyes';[^>]*>/ig, '')
      html = html.replace(/<\/spanyes';[^>]*>/ig, '')
      html = html.replace(/<spantimes[^>]*>/ig, '')
      html = html.replace(/<\/spantimes[^>]*>/ig, '')

      // Bugfix:
      // https://github.com/kindsoft/kindeditor/issues/147
      html = html.replace(/\u2003/g, '&emsp;')
      html = html.replace(/\u3000/g, '&emsp;')
      // Bugfix:
      // https://github.com/kindsoft/kindeditor/issues/116
      // https://github.com/kindsoft/kindeditor/issues/145
      html = html.replace(/<[^>]+/g, function($0) {
        return $0.replace(/\s+/g, ' ')
      })

      var htmlTagMap = {}
      if (htmlTags) {
        // 展开htmlTags里的key
        utils._each(htmlTags, function(key, val) {
          var arr = key.split(',')
          for (var i = 0, len = arr.length; i < len; i++) {
            htmlTagMap[arr[i]] = utils._toMap(val)
          }
        })
        // 删除script和style里的内容
        if (!htmlTagMap.script) {
          html = html.replace(/(<(?:script|script\s[^>]*)>)([\s\S]*?)(<\/script>)/ig, '')
        }
        if (!htmlTagMap.style) {
          html = html.replace(/(<(?:style|style\s[^>]*)>)([\s\S]*?)(<\/style>)/ig, '')
        }
      }
      var re = /(\s*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:"]+="[^"]*")|(?:\s+[\w\-:"]+='[^']*'))*)(\/)?>(\s*)/g
      var tagStack = []
      html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
        var full = $0
        var startNewline = $1 || ''
        var startSlash = $2 || ''
        var tagName = $3.toLowerCase()
        var attr = $4 || ''
        var endSlash = $5 ? ' ' + $5 : ''
        var endNewline = $6 || ''
        // 不在名单里的过滤掉
        if (htmlTags && !htmlTagMap[tagName]) {
          return ''
        }
        // 无闭合标签的自动添加斜线
        if (endSlash === '' && utils._SINGLE_TAG_MAP[tagName]) {
          endSlash = ' /'
        }
        // inline tag时自动将多个空白转换成一个空格
        if (utils._INLINE_TAG_MAP[tagName]) {
          if (startNewline) {
            startNewline = ' '
          }
          if (endNewline) {
            endNewline = ' '
          }
        }
        // pre,style,script tag的格式化
        if (utils._PRE_TAG_MAP[tagName]) {
          if (startSlash) {
            endNewline = '\n'
          } else {
            startNewline = '\n'
          }
        }
        // br tag
        if (wellFormatted && tagName === 'br') {
          endNewline = '\n'
        }
        // block tag的格式化
        if (utils._BLOCK_TAG_MAP[tagName] && !utils._PRE_TAG_MAP[tagName]) {
          if (wellFormatted) {
            if (startSlash && tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
              tagStack.pop()
            } else {
              tagStack.push(tagName)
            }
            startNewline = '\n'
            endNewline = '\n'
            for (var i = 0, len = startSlash ? tagStack.length : tagStack.length - 1; i < len; i++) {
              startNewline += indentChar
              if (!startSlash) {
                endNewline += indentChar
              }
            }
            if (endSlash) {
              tagStack.pop()
            } else if (!startSlash) {
              endNewline += indentChar
            }
          } else {
            startNewline = endNewline = ''
          }
        }
        if (attr !== '') {
          var attrMap = utils._getAttrList(full)
          // 将font tag转换成span tag
          if (tagName === 'font') {
            var fontStyleMap = {}; var fontStyle = ''
            utils._each(attrMap, function(key, val) {
              if (key === 'color') {
                fontStyleMap.color = val
                delete attrMap[key]
              }
              if (key === 'size') {
                fontStyleMap['font-size'] = fontSizeList[parseInt(val, 10) - 1] || ''
                delete attrMap[key]
              }
              if (key === 'face') {
                fontStyleMap['font-family'] = val
                delete attrMap[key]
              }
              if (key === 'style') {
                fontStyle = val
              }
            })
            if (fontStyle && !/;$/.test(fontStyle)) {
              fontStyle += ';'
            }
            utils._each(fontStyleMap, function(key, val) {
              if (val === '') {
                return
              }
              if (/\s/.test(val)) {
                val = "'" + val + "'"
              }
              fontStyle += key + ':' + val + ';'
            })
            attrMap.style = fontStyle
          }
          // 处理attribute和style
          utils._each(attrMap, function(key, val) {
            // 补全单独属性
            if (utils._FILL_ATTR_MAP[key]) {
              attrMap[key] = key
            }
            // 处理URL
            if (utils._inArray(key, ['src', 'href']) >= 0) {
              attrMap[key] = utils._formatUrl(val, urlType)
            }
            // 过滤属性
            if ((htmlTags && key !== 'style' && !htmlTagMap[tagName]['*'] && !htmlTagMap[tagName][key]) ||
              (tagName === 'body' && key === 'contenteditable') ||
          /^kindeditor_\d+$/.test(key)) {
              delete attrMap[key]
            }
            if (key === 'style' && val !== '') {
              var styleMap = utils._getCssList(val)
              // eslint-disable-next-line no-unused-vars
              utils._each(styleMap, function(k, v) {
                // 过滤样式
                if (htmlTags && !htmlTagMap[tagName].style && !htmlTagMap[tagName]['.' + k]) {
                  delete styleMap[k]
                }
              })
              var style = ''
              utils._each(styleMap, function(k, v) {
                style += k + ':' + v + ';'
              })
              attrMap.style = style
            }
          })
          attr = ''
          utils._each(attrMap, function(key, val) {
            if (key === 'style' && val === '') {
              return
            }
            val = val.replace(/"/g, '&quot;')
            attr += ' ' + key + '="' + val + '"'
          })
        }
        if (tagName === 'font') {
          tagName = 'span'
        }
        return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline
      })
      // 将pre里的\n转换成 临时标签 + \n，防止被替换
      html = html.replace(/(<(?:pre|pre\s[^>]*)>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3) {
        return $1 + $2.replace(/\n/g, '<span id="__kindeditor_pre_newline__">\n') + $3
      })
      html = html.replace(/\n\s*\n/g, '\n')
      // 删除临时标签
      html = html.replace(/<span id="__kindeditor_pre_newline__">\n/g, '\n')
      return utils._trim(html)
    }
  }
}
</script>
