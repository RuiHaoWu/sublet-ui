<template>
  <page-header-wrapper>
    <a-card>

      <div class="table-page-search-wrapper">
        <div>
          <a-button v-if="$access('authority_add')" type="primary" icon="plus" @click="addFunc" class="mg-b-30">新建</a-button>
        </div>
      </div>

      <a-table
        :columns="tableColumns"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
        rowKey="permission"
        :scroll="{ x: 1450 }">
        <template slot="type" slot-scope="type">
          <span v-if="type.type == 0">菜单</span>
          <span v-else>按钮</span>
        </template>
        <!--        <template slot="delflag" slot-scope="record">-->
        <!--          <JeepayTableColState :state="record.delflag" :showSwitchType="$access('user_edit')" :onChange="(state) => { return updateState(record.entId, state)}"/>-->
        <!--        </template>-->
        <template slot="opSlot" slot-scope="record">  <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a v-if="$access('authority_edit')" @click="editFunc(record.id)">修改</a>
          </JeepayTableColumns>
        </template>
      </a-table>
    </a-card>

    <!-- 新增 / 修改 页面组件  -->
    <InfoAddOrEdit ref="infoAddOrEdit" :callbackFunc="refTable" />

  </page-header-wrapper>

</template>
<script>
import { getEntTree, API_URL_ENT_LIST, reqLoad } from '@/api/manage'
import JeepayTableColState from '@/components/JeepayTable/JeepayTableColState'
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import InfoAddOrEdit from './AddOrEdit'

const tableColumns = [
  { title: '权限id', dataIndex: 'id' },
  { title: '权限码', dataIndex: 'permission', width: '250px' }, // key为必填项，用于标志该列的唯一
  { title: '资源名称', dataIndex: 'name' },
  { title: '图标', dataIndex: 'icon' },
  { title: '路径', dataIndex: 'menuUri' },
  { title: '组件名称', dataIndex: 'component' },
  { title: '类型', scopedSlots: { customRender: 'type' }, align: 'center' },
  // { title: '状态', scopedSlots: { customRender: 'delflag' }, align: 'center' },
  { title: '排序', dataIndex: 'sort' },
  { title: '操作', width: '100px', fixed: 'right', align: 'center', scopedSlots: { customRender: 'opSlot' } }
]

export default {
  name: 'EntPage',
  components: { JeepayTableColState, JeepayTableColumns, InfoAddOrEdit },
  data () {
    return {
      querySysType: 'MGR', // 默认查询运营平台
      tableColumns: tableColumns,
      dataSource: [],
      loading: false
    }
  },
  mounted () {
    this.refTable() // 刷新页面
  },
  methods: {

    refTable: function () {
      const that = this
      that.loading = true
      getEntTree(that.querySysType).then(res => {
        that.dataSource = res
        that.loading = false
      })
    },

    updateState: function (recordId, state) {
      const that = this
      return reqLoad.updateById(API_URL_ENT_LIST, recordId, { state: state, sysType: that.querySysType }).then(res => {
        that.$message.success('更新成功')
        that.refTable() // 刷新页面
      })
    },

    editFunc: function (recordId) { // 业务通用【修改】 函数
      this.$refs.infoAddOrEdit.show(recordId)
    },

    addFunc: function () { // 业务通用【新增】 函数
      this.$refs.infoAddOrEdit.show()
    }
  }
}
</script>
