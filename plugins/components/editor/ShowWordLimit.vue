<template>
  <div
    class="show-word-limit flex-row flex-center"
    :class="count > max ? 'warning-text animate__animated animate__shakeX' : 'primary-text'">
    <span>{{ count }}</span>
    <span>/{{ max }}</span>
  </div>
</template>

<script>
import { _filterHtmlTag } from './utils'
export default {
  name: 'ShowWordLimit',
  props: {
    max: { type: Number, default: 0, required: true },
    content: { type: String, default: '', required: true }
  },
  computed: {
    count () {
      return _filterHtmlTag(this.content).length
    }
  }
}
</script>

<style lang="scss" scoped>
  .show-word-limit {
    position: absolute;
    bottom: 0;
    right: 9px;
    height: 30px;
    background: transparent;
    border-radius: 4px;
    &.primary-text {
      font: normal 400 12px PingFangSC-Regular, PingFang SC;
      color: #3B414F;
    }
    &.warning-text {
      font: normal 400 12px PingFangSC-Regular, PingFang SC;
      color: #FB3A39;
    }
  }
</style>
