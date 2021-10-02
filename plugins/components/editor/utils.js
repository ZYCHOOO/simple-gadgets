function _isArray (val) {
  if (!val) {
    return false
  }
  return Object.prototype.toString.call(val) === '[object Array]'
}

function _isFunction (val) {
  if (!val) {
    return false
  }
  return Object.prototype.toString.call(val) === '[object Function]'
}

function _inArray (val, arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (val === arr[i]) {
      return i
    }
  }
  return -1
}

function _each (obj, fn) {
  if (_isArray(obj)) {
    for (var i = 0, len = obj.length; i < len; i++) {
      if (fn.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  } else {
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (fn.call(obj[key], key, obj[key]) === false) {
          break
        }
      }
    }
  }
}

function _trim (str) {
  // Forgive various special whitespaces, e.g. &nbsp;(\xa0).
  return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '')
}

function _inString (val, str, delimiter) {
  delimiter = delimiter === undefined ? ',' : delimiter
  return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0
}

function _addUnit (val, unit) {
  unit = unit || 'px'
  return val && /^-?\d+(?:\.\d+)?$/.test(val) ? val + unit : val
}

function _removeUnit (val) {
  var match
  return val && (match = /(\d+)/.exec(val)) ? parseInt(match[1], 10) : 0
}

function _escape (val) {
  return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function _unescape (val) {
  return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}

function _toCamel (str) {
  var arr = str.split('-')
  str = ''
  _each(arr, function (key, val) {
    str += (key > 0) ? val.charAt(0).toUpperCase() + val.substr(1) : val
  })
  return str
}

function _toHex (val) {
  function hex (d) {
    var s = parseInt(d, 10).toString(16).toUpperCase()
    return s.length > 1 ? s : '0' + s
  }
  return val.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
    function ($0, $1, $2, $3) {
      return '#' + hex($1) + hex($2) + hex($3)
    }
  )
}

function _toMap (val, delimiter) {
  delimiter = delimiter === undefined ? ',' : delimiter
  var map = {}; var arr = _isArray(val) ? val : val.split(delimiter); var match
  _each(arr, function (key, val) {
    if ((match = /^(\d+)\.\.(\d+)$/.exec(val))) {
      for (var i = parseInt(match[1], 10); i <= parseInt(match[2], 10); i++) {
        map[i.toString()] = true
      }
    } else {
      map[val] = true
    }
  })
  return map
}

function _toArray (obj, offset) {
  return Array.prototype.slice.call(obj, offset || 0)
}

function _undef (val, defaultVal) {
  return val === undefined ? defaultVal : val
}

function _invalidUrl (url) {
  return !url || /[<>"]/.test(url)
}

function _addParam (url, param) {
  return url.indexOf('?') >= 0 ? url + '&' + param : url + '?' + param
}

function _getCssList (css) {
  css = css.replace(/&quot;/g, '"')

  var list = {}
  // eslint-disable-next-line no-useless-escape
  var reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g
  var match
  while ((match = reg.exec(css))) {
    var key = _trim(match[1].toLowerCase())
    var val = _trim(_toHex(match[2]))
    list[key] = val
  }
  return list
}

function _getAttrList (tag) {
  var list = {}
  var reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:"]+)="([^"]*)")|(?:([\w\-:"]+)='([^']*)'))(?=(?:\s|\/|>)+)/g
  var match
  while ((match = reg.exec(tag))) {
    var key = (match[1] || match[2] || match[4] || match[6]).toLowerCase()
    var val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || ''
    list[key] = val
  }
  return list
}

// 过滤内容中的html标签
function _filterHtmlTag (content) {
  const reg = /<\/?.+?\/?>/g
  return content
    .replace(reg, '')
    .replace(/[ ]/g, '')
    .replace(/&nbsp;/ig, '') // 去掉&nbsp;
}

// 获取当前协议+域名
function _getBaseUrl () {
  let baseURL = ''
  if (!window.location.origin) { // 兼容IE，IE11版本下location.origin为undefined
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
  } else {
    baseURL = window.location.origin
  }
  return baseURL
}

const _INLINE_TAG_MAP = _toMap('a,abbr,acronym,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,img,input,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var')
const _BLOCK_TAG_MAP = _toMap('address,applet,blockquote,body,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,head,hr,html,iframe,ins,isindex,li,map,menu,meta,noframes,noscript,object,ol,p,pre,script,style,table,tbody,td,tfoot,th,thead,title,tr,ul')
const _SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed')
const _STYLE_TAG_MAP = _toMap('b,basefont,big,del,em,font,i,s,small,span,strike,strong,sub,sup,u')
const _CONTROL_TAG_MAP = _toMap('img,table,input,textarea,button')
const _PRE_TAG_MAP = _toMap('pre,style,script')
const _NOSPLIT_TAG_MAP = _toMap('html,head,body,td,tr,table,ol,ul,li')
const _AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr')
const _FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected')
const _VALUE_TAG_MAP = _toMap('input,button,textarea,select')

const htmlTags = {
  font: ['id', 'class', 'color', 'size', 'face', '.background-color'],
  span: [
    'id', 'class', '.color', '.background-color', '.font-size', '.font-family', '.background',
    '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
  ],
  div: [
    'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
    '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
    '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
  ],
  table: [
    'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
    '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
    '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
    '.width', '.height', '.border-collapse'
  ],
  'td,th': [
    'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
    '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
    '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
  ],
  a: ['id', 'class', 'href', 'target', 'name'],
  embed: ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', 'wmode'],
  img: ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
  'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': [
    'id', 'class', 'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
    '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
  ],
  pre: ['id', 'class'],
  hr: ['id', 'class', '.page-break-after'],
  'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del': ['id', 'class'],
  iframe: ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width', '.height']
}

export {
  _isArray,
  _isFunction,
  _inArray,
  _each,
  _trim,
  _inString,
  _addUnit,
  _removeUnit,
  _escape,
  _unescape,
  _toCamel,
  _toHex,
  _toMap,
  _toArray,
  _undef,
  _invalidUrl,
  _addParam,
  _getCssList,
  _getAttrList,
  _filterHtmlTag,
  _getBaseUrl,
  _INLINE_TAG_MAP,
  _BLOCK_TAG_MAP,
  _SINGLE_TAG_MAP,
  _STYLE_TAG_MAP,
  _CONTROL_TAG_MAP,
  _PRE_TAG_MAP,
  _NOSPLIT_TAG_MAP,
  _AUTOCLOSE_TAG_MAP,
  _FILL_ATTR_MAP,
  _VALUE_TAG_MAP,
  htmlTags
}
