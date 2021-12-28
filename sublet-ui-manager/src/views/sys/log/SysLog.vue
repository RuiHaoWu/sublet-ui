<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">
            <a-form-item label="" class="table-head-layout" style="max-width:350px;min-width:300px">
              <a-range-picker
                @change="onChange"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
              >
                <a-icon slot="suffixIcon" type="sync" />
              </a-range-picker>
            </a-form-item>
            <!--            <jeepay-text-up :placeholder="'用户ID'" :msg="searchData.userId" v-model="searchData.userId" />-->
            <jeepay-text-up :placeholder="'用户名'" :msg="searchData.username" v-model="searchData.username" />
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.type" placeholder="日志类型" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">异常</a-select-option>
              </a-select>
            </a-form-item>

            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="queryhFunc" :loading="btnLoading">搜索</a-button>
              <a-button style="margin-left: 8px" icon="reload" @click="() => this.searchData = {}">重置</a-button>
            </span>
          </div>
        </a-form>
        <div>
          <a-button icon="delete" v-if="$access('log_del')" type="danger" @click="delFunc" class="mg-b-30">删除</a-button>
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
        :rowSelection="rowSelection"
        rowKey="id"
      >
        <template slot="userNameSlot" slot-scope="{record}"><b>{{ record.createBy }}</b></template> <!-- 自定义插槽 -->
        <template slot="typeSlot" slot-scope="{record}">
          <a-tag :key="record.type" :color="record.type === 0 ? 'green':'red'">
            {{ record.type === 0 ?'正常':'异常' }}
          </a-tag>
        </template>
        <template slot="opSlot" slot-scope="{record}">  <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a-button type="link" v-if="$access('log_detail')" @click="detailFunc(record.id)">详情</a-button>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>
    <!-- 日志详情抽屉 -->
    <template>
      <a-drawer
        width="40%"
        placement="right"
        :closable="true"
        :visible="visible"
        :title="visible === true? '日志详情':''"
        @close="onClose"
      >
        <a-row justify="space-between" type="flex">
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="用户名">
                <b>
                  {{ detailData.createBy }}
                </b>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="用户IP">
                {{ detailData.remoteAddr }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="日志类型">
                <a-tag :key="detailData.type" :color="detailData.type === 0 ? 'green':'red'">
                  {{ detailData.type === 0 ?'正常':'异常' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="所属系统">
                {{ detailData.clientId }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-divider />
        <a-row justify="space-between" type="flex">
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="操作描述">
                {{ detailData.title }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="请求方法">
                {{ detailData.method }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="请求地址">
                {{ detailData.requestUri }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="执行时长">
                {{ detailData.execTime }}ms
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-row justify="start" type="flex">
          <a-col :sm="24">
            <a-form-model-item label="请求参数">
              <a-input
                type="textarea"
                disabled="disabled"
                style="background-color: black;color: #FFFFFF;height: 150px"
                v-model="detailData.body"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row justify="start" type="flex">
          <a-col :sm="24">
            <a-form-model-item label="错误日志">
              <a-input
                type="textarea"
                disabled="disabled"
                style="background-color: black;color: #FFFFFF;height: 150px"
                v-model="detailData.errorMsg"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-drawer>
    </template>
  </page-header-wrapper>
</template>
<script>
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp' // 文字上移组件
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import { API_URL_SYS_LOG, req } from '@/api/manage'
import moment from 'moment'
import { message, Modal } from 'ant-design-vue'

// eslint-disable-next-line no-unused-vars
const tableColumns = [
  // { key: 'id', title: 'id', dataIndex: 'id' },
  { key: 'createBy', title: '用户名', fixed: 'left', scopedSlots: { customRender: 'userNameSlot' } },
  { key: 'title', title: '操作描述', ellipsis: true, dataIndex: 'title' },
  { key: 'remoteAddr', title: '用户IP', dataIndex: 'remoteAddr' },
  { key: 'execTime', title: '执行时间', dataIndex: 'execTime', align: 'center' },
  { key: 'type', title: '日志类型', scopedSlots: { customRender: 'typeSlot' } },
  { key: 'clientId', title: '所属系统', dataIndex: 'clientId' },
  { key: 'createTime', dataIndex: 'createTime', title: '访问时间', customRender: (text, record, index) => { return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') } },
  { key: 'op', title: '操作', width: '100px', fixed: 'right', align: 'center', scopedSlots: { customRender: 'opSlot' } }
]

export default {
  name: 'IsvListPage',
  components: { JeepayTable, JeepayTableColumns, JeepayTextUp },
  data () {
    return {
      tableColumns: tableColumns,
      searchData: {},
      selectedIds: [], // 选中的数据
      createdStart: '', // 选择开始时间
      createdEnd: '', // 选择结束时间
      visible: false,
      detailData: {},
      btnLoading: false
    }
  },
  computed: {
    rowSelection () {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectedIds = [] // 清空选中数组
          selectedRows.forEach(function (data) { // 赋值选中参数
            that.selectedIds.push(data.id)
          })
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    // 请求table接口数据
    reqTableDataFunc: (params) => {
      return req.list(API_URL_SYS_LOG, params)
    },
    delFunc: function () {
      const that = this
      if (that.selectedIds.length === 0) {
        message.error('请选择要删除的日志')
        return false
      }
      Modal.confirm({
        title: '确认删除' + that.selectedIds.length + '条日志吗？',
        okType: 'danger',
        onOk () {
          req.delById(API_URL_SYS_LOG, that.selectedIds).then(res => {
            that.selectedIds = [] // 清空选中数组
            that.$refs.infoTable.refTable(true)
            that.$message.success('删除成功')
          })
        },
        onCance () {
        }
      })
    },
    searchFunc: function () { // 点击【查询】按钮点击事件
      this.$refs.infoTable.refTable(true)
    },
    detailFunc: function (recordId) {
      const that = this
      req.getById(API_URL_SYS_LOG, recordId).then(res => {
        that.detailData = res
      })
      this.visible = true
    },
    moment,
    onChange (date) {
      const startTime = moment(date[0]).valueOf()// 开始时间
      const endTime = moment(date[1]).valueOf()// 结束时间
      this.searchData.rangeTime = startTime + ',' + endTime
    },
    disabledDate (current) { // 今日之后日期不可选
      return current && current > moment().endOf('day')
    },
    onClose () {
      this.visible = false
    },
    queryhFunc () {
      this.btnLoading = true
      this.$refs.infoTable.refTable(true)
    }
  }
}
</script>
