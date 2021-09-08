<template>
  <el-tooltip :content="content" :disabled="isHideTooltip" :effect="effect">
    <div
      ref="parent"
      class="overflow-tooltip__item"
      :class="overflowMultiple ? 'multiple-line__ellipsis' : 'single-line__ellipsis'"
      :style="tooltipStyle">
      <span
        :ref="content"
        @mouseover="onMouseOver(content)"
      >
        {{ content }}
      </span>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'OverflowTooltip',
  props: {
    content: { type: String, default: '', required: true },
    itemStyle: { type: Object, default: () => {}, required: true },
    // 是否多行省略
    overflowMultiple: { type: Boolean, default: false },
    line: { type: Number, default: 0 },
    effect: { type: String, default: 'dark' }
  },
  data () {
    return {
      isHideTooltip: true
    }
  },
  computed: {
    tooltipStyle () {
      const style = { ...this.itemStyle }
      if (this.overflowMultiple) {
        style['-webkit-line-clamp'] = this.line
      }
      return style
    }
  },
  methods: {
    onMouseOver (content) {
      // 判断是否开启tooltip
      const item = this.$refs[content] instanceof Array
        ? this.$refs[content][0] : this.$refs[content]
      const parent = this.$refs.parent
      const contentWidth = item.offsetWidth
      this.isHideTooltip = this.overflowMultiple
        ? parent.scrollheight <= parent.offsetHeight : contentWidth <= parent.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .single-line__ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .multiple-line__ellipsis {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
</style>
