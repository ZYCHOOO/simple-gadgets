# OverflowTooltip 省略提示

用于超长数据的展示以及悬停提示。

---

<common-CodeBox title="基本用法">
  <code-overflowTooltip1-1 />
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-overflow-tooltip">
        <overflow-tooltip
          content="这是简短描述"
          :item-style="itemStyle"
        />
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
        />
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
          :line="2"
          overflow-multiple
        />
      </div>
    </template>
  </highlight-code>
</common-CodeBox>

<common-CodeBox title="主题">
  <code-overflowTooltip1-2 />
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-overflow-tooltip">
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
        />
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
          effect="light"
        />
      </div>
    </template>
  </highlight-code>
</common-CodeBox>

<common-CodeBox title="多行省略">
  <code-overflowTooltip1-3 />
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-overflow-tooltip">
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
          :line="2"
          overflow-multiple
        />
        <overflow-tooltip
          content="这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字这是一条超长文字"
          :item-style="itemStyle"
          :line="4"
          overflow-multiple
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
        { param: 'effect', desc: '默认提供的主题', type: 'String',optionValue: 'dark/light', defaultValue: 'dark' },
        { param: 'line', desc: '在第n行显示省略（与overflowMultiple搭配使用，单独设置无效）', type: 'number', optionValue: '', defaultValue: '' },
        { param: 'content', desc: '显示的数据', type: 'string', optionValue: '', defaultValue: '' },
        { param: 'itemStyle', desc: '样式', type: 'object', optionValue: '', defaultValue: '' },
        { param: 'overflowMultiple', desc: '是否在第n行省略', type: 'boolean', optionValue: '', defaultValue: 'false' }
      ]
    }
  }
}
</script>