<template>
  <el-tooltip :content="content" :disabled="isShowTooltip" class="overflow-tooltip">
    <div
      :ref="content"
      class="overflow-tooltip__item overflow-ellipsis"
      :style="itemStyle"
      @mouseover="onMouseOver(content)"
    >
      {{ content }}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'OverflowTooltip',
  props: {
    content: { type: String, default: '', required: true },
    itemStyle: { type: Object, default: () => {}, required: true }
  },
  data() {
    return {
      isShowTooltip: true
    }
  },
  methods: {
    onMouseOver(content) {
      // 判断是否开启tooltip
      const item = this.$refs[content] instanceof Array
        ? this.$refs[content][0] : this.$refs[content]
      const scrollWidth = item.scrollWidth
      const contentWidth = item.offsetWidth
      this.isShowTooltip = scrollWidth <= contentWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>