<template>
  <div class="code-overflow-tooltip">
    <div>
      <overflow-tooltip
        :content="text2"
        :item-style="longSingleStyle"
      />
      <overflow-tooltip
        :content="text2"
        :item-style="longSingleStyle"
        effect="light"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverflowTooltip1-2',
  components: {
    OverflowTooltip: () => import('../../../../plugins/components/overflow-tooltip/OverflowTooltip')
  },
  data() {
    return {
      text2: '这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字',
      longSingleStyle: {
        padding: '2px',
        width: '200px',
        border: '1px solid #F2F2F2',
        borderRadius: '4px',
        color: '#3B414F'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .code-overflow-tooltip{
    width: 100%;
    text-align: center;
    div {
      margin: 10px 0;
    }
  }
</style>