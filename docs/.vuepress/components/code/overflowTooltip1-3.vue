<template>
  <div class="code-overflow-tooltip">
    <div>
      <!-- 超长省略2行 -->
      <overflow-tooltip
        :content="text1"
        :item-style="longMultipleStyle"
        :line="2"
        overflow-multiple
      />
      <!-- 超长省略4行 -->
      <overflow-tooltip
        :content="text2"
        :item-style="longMultipleStyle"
        :line="4"
        overflow-multiple
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverflowTooltip1-3',
  components: {
    OverflowTooltip: () => import('../../../../plugins/components/overflow-tooltip/OverflowTooltip')
  },
  data() {
    return {
      text1: '这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字',
      text2: '这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字',
      longMultipleStyle: {
        padding: '2px',
        width: '300px',
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