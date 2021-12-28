<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">

            <jeepay-text-up :placeholder="'用户姓名'" :msg="searchData.createBy" v-model="searchData.createBy" />

            <a-form-item label="" class="table-head-layout">
              <template>
                <a-cascader :options="options" placeholder="区域" @change="onChangeArea" />
              </template>
            </a-form-item>

            <a-form-item label="" class="table-head-layout" style="max-width:350px;min-width:300px">
              <a-range-picker
                @change="onChangeDate"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
              >
                <a-icon slot="suffixIcon" type="sync" />
              </a-range-picker>
            </a-form-item>

            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchFunc" icon="search" :loading="btnLoading">查询</a-button>
              <a-button style="margin-left: 8px;" @click="() => this.searchData = {}" icon="reload">重置</a-button>
            </span>
          </div>
        </a-form>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable
        @btnLoadClose="btnLoading=false"
        ref="infoTable"
        :initData="true"
        :reqTableDataFunc="reqTableDataFunc"
        :tableColumns="tableColumns"
        :searchData="searchData"
        rowKey="id"
      >

        <template slot="labelSlot" slot-scope="{record}">
          <a-tag v-for="(item,key) in record.labelList" :key="key" color="blue">
            {{ item.labelName }}
          </a-tag>
        </template>

        <template slot="DelFlagSlot" slot-scope="{record}">
          <JeepayTableColState :state="record.lockFlag" :showSwitchType="$access('sublet_info_lock')" :onChange="(state) => { return updateState(record.id, state)}"/>
        </template>

        <template slot="stateSlot" slot-scope="{record}">
          <b v-if="record.status === 0">招租中</b>
          <b v-else>已出租</b>
        </template>

        <template slot="areaSlot" slot-scope="{record}">
          <P>{{ record.province }}{{ record.city }}{{ record.district }}{{ record.street }}</P>
        </template>
        <!--        monthlyRent-->
        <template slot="monthlyRentSlot" slot-scope="{record}">
          <P>{{ record.monthlyRent }}元</P>
        </template>

        <template slot="opSlot" slot-scope="{record}">  <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a v-if="$access('sublet_info_detail')" @click="detailFunc(record.id)" >详情</a>
            <a v-if="$access('comment_list')" @click="commentListFunc(record.id)" >评论列表</a>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>

    <!-- 转租详情抽屉 -->
    <template>
      <a-drawer
        width="40%"
        placement="right"
        :closable="true"
        :visible="visible"
        :title="visible === true? '转租详情':''"
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
              <a-descriptions-item label="状态">
                <a-tag :key="detailData.status" :color="detailData.status === 0 ? 'blue':' green'">
                  {{ detailData.status === 0 ?'招租中':'已出租' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="发布时间">
                <b>{{ detailData.createTime }}</b>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="前台展示">
                <b>{{ detailData.lockFlag == 0 ? '是' :'否' }}</b>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-divider />
        <a-row justify="space-between" type="flex">
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="描述">
                {{ detailData.description }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="标签">
                <a-tag v-for="(item,key) in detailData.labelList" :key="key" color="blue">
                  {{ item.labelName }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="月租">
                {{ detailData.monthlyRent }} 元
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="面积">
                {{ detailData.area }} m<sup>2</sup>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="详细地址">
                <P>{{ detailData.province }}{{ detailData.city }}{{ detailData.district }}{{ detailData.street }}{{ detailData.address }}</P>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-divider />
          <template>
            <img :width="200" v-for="(item,index) in detailData.images" :key="index" :src="item" />
          </template>
        </a-row>
      </a-drawer>
    </template>

    <!-- 转租详情抽屉 -->
    <template>
      <a-drawer
        width="40%"
        placement="right"
        :closable="true"
        :visible="commentVisible"
        :title="commentVisible === true? '评论列表':''"
        @close="commentClose"
      >
        <template>
          <a-comment v-for="(item,key) in data" :key="key">
            <template slot="actions">
              <a v-if="$access('comment_del')" @click="delComment(item.id,item.subletInfoId)" >删除</a>
            </template>
            <a slot="author">{{ item.username }}</a>
            <a-avatar
              slot="avatar"
              :src="item.user.avatar"
              :alt="item.username"
            />
            <p slot="content">
              {{ item.content }}
            </p>
            <a-tooltip slot="datetime" :title="item.createTime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.createTime.fromNow() }}</span>
            </a-tooltip>
            <a-comment v-for="(children,key) in item.children" :key="key">
              <template slot="actions">
                <a v-if="$access('comment_del')" @click="delComment(children.id,children.subletInfoId)" >删除</a>
              </template>
              <a slot="author">{{ children.username }}</a>
              <a-avatar
                slot="avatar"
                :src="children.user.avatar"
                :alt="children.username"
              />
              <p slot="content">
                {{ children.content }}
              </p>
              <a-tooltip slot="datetime" :title="children.createTime.format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ children.createTime.fromNow() }}</span>
              </a-tooltip>
            </a-comment>
          </a-comment>

        </template>
      </a-drawer>
    </template>

  </page-header-wrapper>

</template>
<script>
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import JeepayTableColState from '@/components/JeepayTable/JeepayTableColState'
import { API_URL_SUBLET_INFO_BASE, API_URL_SUBLET_INFO_LOCK, req, reqLoad, API_URL_SUBLET_INFO_LIST, API_URL_COMMENT_LIST, API_URL_COMMENT_MIDDLE } from '@/api/manage'
import moment from 'moment'
// import InfoAddOrEdit from './AddOrEdit'
// import RoleDist from './RoleDist'
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp'
import { Modal } from 'ant-design-vue'

  const tableColumns = [
  { title: '用户名', dataIndex: 'createBy' },
  { title: '标签', scopedSlots: { customRender: 'labelSlot' } },
  { title: '月租', scopedSlots: { customRender: 'monthlyRentSlot' } },
  { title: '地址', scopedSlots: { customRender: 'areaSlot' } },
  { title: '状态', scopedSlots: { customRender: 'stateSlot' }, align: 'center' },
  { title: '是否展示', scopedSlots: { customRender: 'DelFlagSlot' }, align: 'center' },
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
  components: { JeepayTable, JeepayTableColumns, JeepayTableColState, JeepayTextUp },
  data () {
    return {
      tableColumns: tableColumns,
      searchData: {},
      btnLoading: false,
      visible: false,
      commentVisible: false,
      detailData: {},
      data: [],
      moment,
      options: [
        {
          value: '广东省',
          label: '广东省',
          children: [
            {
              value: '广州市',
              label: '广州市',
              children: [
                {
                  value: '荔湾区',
                  label: '荔湾区'
                },
                {
                  value: '越秀区',
                  label: '越秀区'
                },
                {
                  value: '海珠区',
                  label: '海珠区'
                },
                {
                  value: '天河区',
                  label: '天河区'
                },
                {
                  value: '白云区',
                  label: '白云区'
                },
                {
                  value: '黄埔区',
                  label: '黄埔区'
                },
                {
                  value: '番禺区',
                  label: '番禺区'
                },
                {
                  value: '花都区',
                  label: '花都区'
                },
                {
                  value: '从化区',
                  label: '从化区'
                },
                {
                  value: '南沙区',
                  label: '南沙区',
                  children: [
                    {
                      value: '金隆路',
                      label: '金隆路'
                    }
                  ]
                }
              ]
            }, {
              value: '深圳市',
              label: '深圳市',
              children: [
                {
                  value: '罗湖区',
                  label: '罗湖区'
                },
                {
                  value: '福田区',
                  label: '福田区'
                },
                {
                  value: '南山区',
                  label: '南山区'
                },
                {
                  value: '宝安区',
                  label: '宝安区'
                },
                {
                  value: '龙岗区',
                  label: '龙岗区'
                },
                {
                  value: '盐田区',
                  label: '盐田区'
                },
                {
                  value: '龙华区',
                  label: '龙华区'
                },
                {
                  value: '坪山区',
                  label: '坪山区'
                },
                {
                  value: '光明区',
                  label: '光明区'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  mounted () {
  },
  methods: {

    // 请求table接口数据
    reqTableDataFunc: (params) => {
      return req.list(API_URL_SUBLET_INFO_LIST, params)
    },

    searchFunc: function () { // 点击【查询】按钮点击事件
      this.btnLoading = true // 打开查询按钮的loading
      this.$refs.infoTable.refTable(true)
    },

    roleDist: function (recordId) { // 【分配权限】 按钮点击事件
      this.$refs.roleDist.show(recordId)
    },
    updateState: function (recordId, state) { // 【更新状态】
      const that = this
      const title = state === 1 ? '确认[启用]该转租帖子？' : '确认[停用]该转租帖子？'
      const content = state === 1 ? '启用后该帖子将可在前台展示' : '停用后该帖子将不在前台展示'

      return new Promise((resolve, reject) => {
        that.$infoBox.confirmDanger(title, content, () => {
          return reqLoad.updateById(API_URL_SUBLET_INFO_LOCK, recordId, null).then(res => {
            that.searchFunc()
            resolve()
          }).catch(err => reject(err))
        },
          () => {
          reject(new Error())
        })
      })
    },
    onChangeArea (value) {
      this.searchData.province = value[0]
      this.searchData.city = value[1]
      this.searchData.district = value[2]
      this.searchData.street = value[3]
    },
    onChangeDate (date) {
      const startTime = moment(date[0]).valueOf()// 开始时间
      const endTime = moment(date[1]).valueOf()// 结束时间
      this.searchData.rangeTime = startTime + ',' + endTime
    },
    disabledDate (current) { // 今日之后日期不可选
      return current && current > moment().endOf('day')
    },
    detailFunc: function (recordId) {
      const that = this
      req.getById(API_URL_SUBLET_INFO_BASE, recordId).then(res => {
        res.createTime = moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')
        res.images = JSON.parse(res.images).images
        that.detailData = res
      })
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    commentListFunc: function (recordId) {
      const that = this
      req.getById(API_URL_COMMENT_LIST, recordId).then(res => {
        res.forEach(item => {
          item.createTime = moment(item.createTime).clone()
          if (item.children != null) {
            item.children.forEach(children => {
              children.createTime = moment(children.createTime)
              if (children.replyCommentId != null) {
                children.username = children.username + '  回复  ' + children.replyUsername
              }
            })
          }
        })
        that.data = res
      })
      this.commentVisible = true
    },
    commentClose () {
      this.commentVisible = false
      this.data = []
    },
    delComment (comment, subletInfoId) {
      const that = this
      Modal.confirm({
        title: '确认删除这条评论吗？',
        okType: 'danger',
        onOk () {
          req.delById(API_URL_COMMENT_MIDDLE, comment).then(res => {
            that.$message.success('删除成功')
            that.commentListFunc(subletInfoId)
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
