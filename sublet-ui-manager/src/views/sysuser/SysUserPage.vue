<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">
            <!--            <jeepay-text-up :placeholder="'用户ID'" :msg="searchData.userId" v-model="searchData.userId" />-->
            <jeepay-text-up :placeholder="'用户姓名'" :msg="searchData.username" v-model="searchData.username" />
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchFunc" icon="search" :loading="btnLoading">查询</a-button>
              <a-button style="margin-left: 8px;" @click="() => this.searchData = {}" icon="reload">重置</a-button>
            </span>
          </div>
        </a-form>

        <div>
          <a-button v-if="$access('user_add')" type="primary" icon="plus" @click="addFunc" class="mg-b-30">新建</a-button>
        </div>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable
        @btnLoadClose="btnLoading=false"
        ref="infoTable"
        :initData="true"
        :reqTableDataFunc="reqTableDataFunc"
        :tableColumns="tableColumns"
        :searchData="searchData"
        rowKey="userId"
      >

        <template slot="avatarSlot" slot-scope="{record}">
          <a-avatar size="default" :src="record.avatar" />
        </template>

        <template slot="stateSlot" slot-scope="{record}">
          <JeepayTableColState :state="record.lockFlag" :showSwitchType="$access('user_lock')" :onChange="(state) => { return updateState(record.userId, state)}"/>
        </template>

        <template slot="opSlot" slot-scope="{record}">  <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a v-if="$access('assign_role')" @click="roleDist(record.userId)" >变更角色</a>
            <a v-if="$access('user_edit')" @click="editFunc(record.userId)">修改</a>
            <a v-if="$access('user_del')" style="color: red" @click="delFunc(record.userId)">删除</a>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>

    <!-- 新增 / 修改 页面组件  -->
    <InfoAddOrEdit ref="infoAddOrEdit" :callbackFunc="searchFunc"/>

    <!-- 分配角色 页面组件  -->
    <RoleDist ref="roleDist"/>

  </page-header-wrapper>

</template>
<script>
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import JeepayTableColState from '@/components/JeepayTable/JeepayTableColState'
import { API_URL_SYS_USER_LIST, API_URL_USER_LOCK, req, reqLoad } from '@/api/manage'
import moment from 'moment'
import InfoAddOrEdit from './AddOrEdit'
import RoleDist from './RoleDist'
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp' // 文字上移组件

const tableColumns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '头像', scopedSlots: { customRender: 'avatarSlot' } },
  { title: '邮箱', dataIndex: 'email', width: '150px' },
  { title: '状态', scopedSlots: { customRender: 'stateSlot' }, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', customRender: (text, record, index) => { return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') } },
  { title: '修改时间', dataIndex: 'updateTime', customRender: (text, record, index) => { return record.updateTime == null ? null : moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') } },
  {
    key: 'op',
    title: '操作',
    width: 200,
    fixed: 'right',
    align: 'center',
    scopedSlots: { customRender: 'opSlot' }
  }
]

export default {
  components: { JeepayTable, JeepayTableColumns, InfoAddOrEdit, RoleDist, JeepayTableColState, JeepayTextUp },
  data () {
    return {
      tableColumns: tableColumns,
      searchData: {},
      btnLoading: false
    }
  },
  mounted () {
  },
  methods: {

    // 请求table接口数据
    reqTableDataFunc: (params) => {
      return req.list(API_URL_SYS_USER_LIST, params)
    },

    searchFunc: function () { // 点击【查询】按钮点击事件
      this.btnLoading = true // 打开查询按钮的loading
      this.$refs.infoTable.refTable(true)
    },

    addFunc: function () { // 业务通用【新增】 函数
      this.$refs.infoAddOrEdit.show()
    },

    editFunc: function (recordId) { // 业务通用【修改】 函数
      this.$refs.infoAddOrEdit.show(recordId)
    },

    delFunc: function (recordId) { // 业务通用【删除】 函数
      const that = this
      this.$infoBox.confirmDanger('确认删除？', '', () => {
        return req.delById(API_URL_SYS_USER_LIST, recordId).then(res => {
          that.$message.success('删除成功！')
          that.$refs.infoTable.refTable(false)
        })
      })
    },

    roleDist: function (recordId) { // 【分配权限】 按钮点击事件
      this.$refs.roleDist.show(recordId)
    },
    updateState: function (recordId, state) { // 【更新状态】
      const that = this
      const title = state === 1 ? '确认[启用]该用户？' : '确认[停用]该用户？'
      const content = state === 1 ? '启用后用户可进行登陆等一系列操作' : '停用后该用户将立即退出系统并不可再次登陆'

      return new Promise((resolve, reject) => {
        that.$infoBox.confirmDanger(title, content, () => {
          return reqLoad.updateById(API_URL_USER_LOCK, recordId, null).then(res => {
            that.searchFunc()
            resolve()
          }).catch(err => reject(err))
        },
          () => {
          reject(new Error())
        })
      })
    }
  }
}
</script>
