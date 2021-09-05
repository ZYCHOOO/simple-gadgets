<template>
  <div class="attr-table">
      <h3>{{title}}</h3>
      <el-table
        v-if="type === 'attr'"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-for="item in tableColumns"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        >
          <template v-slot="{ row }">
            <span>
              {{ row[item.key] ? row[item.key] : '--' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-for="item in tableColumns"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        >
          <template v-slot="{ row }">
            <span>
              {{ row[item.key] ? row[item.key] : '--' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import {
  ATTR_TABLE_COLUMN,
  EVENT_TABLE_COLUMN
} from '../../utils/tableColumn'
export default {
  name: 'AttrTable',
  props: {
    type: { type: String, default: 'attr' },
    title: { type: String, default: '属性' },
    tableData: { type: Array, default: () => [] }
  },
  computed: {
    tableColumns() {
      return this.type === 'attr'
        ? ATTR_TABLE_COLUMN : EVENT_TABLE_COLUMN
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-table {
  table {
    border-collapse: collapse;
    margin: 0;
  }
  .el-table__body, .el-table__footer, .el-table__header {
    margin: 0;
  }
  th, td, th.is-leaf {
    border: none;
  }
  .el-table__body, .el-table__footer, .el-table__header{
    border-collapse: collapse;
  }
}
</style>
