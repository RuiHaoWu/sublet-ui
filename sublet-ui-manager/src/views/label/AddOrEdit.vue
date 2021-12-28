<template>
  <a-modal v-model="isShow" :title=" isAdd ? '新增标签' : '修改标签' " @ok="handleOkFunc" :confirmLoading="confirmLoading">

    <a-form-model ref="infoFormModel" :model="saveObject" :label-col="{span: 6}" :wrapper-col="{span: 15}" :rules="rules">

      <a-form-model-item label="标签名称：" prop="labelName">
        <a-input v-model="saveObject.labelName" />
      </a-form-model-item>

      <!--       :disabled="saveObject.menuType == 'PB' || !saveObject.menuUri"-->

      <!--      <a-form-model-item label="状态：" prop="state">-->
      <!--        <a-radio-group v-model="saveObject.state">-->
      <!--          <a-radio :value="1">启用</a-radio>-->
      <!--          <a-radio :value="0">停用</a-radio>-->
      <!--        </a-radio-group>-->
      <!--      </a-form-model-item>-->

    </a-form-model>

  </a-modal>

</template>

<script>
import { req, API_URL_LABEL_BASE } from '@/api/manage'
export default {

  props: {
    callbackFunc: { type: Function }
  },

  data () {
    return {
      confirmLoading: false, // 显示确定按钮loading图标
      isAdd: true, // 新增 or 修改页面标识
      isShow: false, // 是否显示弹层/抽屉
      saveObject: {}, // 数据对象
      recordId: null, // 更新对象ID
      sysType: 'MGR', // 菜单类型
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    show: function (recordId) { // 弹层打开事件
      this.isAdd = !recordId
      // this.sysType = sysType
      this.saveObject = {} // 数据清空
      this.confirmLoading = false // 关闭loading

      if (this.$refs.infoFormModel !== undefined) {
        this.$refs.infoFormModel.resetFields()
      }

      const that = this
      if (!this.isAdd) { // 修改信息 延迟展示弹层
        that.recordId = recordId
        req.getById(API_URL_LABEL_BASE, recordId).then(res => { that.saveObject = res })
        this.isShow = true
      } else {
        that.isShow = true // 立马展示弹层信息
      }
    },

    handleOkFunc: function () { // 点击【确认】按钮事件
        const that = this
        this.$refs.infoFormModel.validate(valid => {
          if (valid) { // 验证通过
            // 请求接口

            that.confirmLoading = true // 显示loading

            if (that.isAdd) {
              req.add(API_URL_LABEL_BASE, that.saveObject).then(res => {
                that.$message.success('新增成功')
                that.isShow = false
                that.callbackFunc() // 刷新列表
              }).catch(res => { that.confirmLoading = false })
            } else {
              req.updateById(API_URL_LABEL_BASE, that.recordId, that.saveObject).then(res => {
                that.$message.success('修改成功')
                that.isShow = false
                that.callbackFunc() // 刷新列表
              }).catch(res => { that.confirmLoading = false })
            }
          }
        })
    }
  }
}
</script>
