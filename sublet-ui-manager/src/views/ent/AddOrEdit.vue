<template>
  <a-modal v-model="isShow" :title=" isAdd ? '新增菜单' : '修改菜单' " @ok="handleOkFunc" :confirmLoading="confirmLoading">

    <a-form-model ref="infoFormModel" :model="saveObject" :label-col="{span: 6}" :wrapper-col="{span: 15}" :rules="rules">

      <a-form-model-item label="资源名称：" prop="authName">
        <a-input v-model="saveObject.authName" />
      </a-form-model-item>

      <a-form-model-item label="权限码：" prop="permission">
        <a-input v-model="saveObject.permission" />
      </a-form-model-item>

      <a-form-model-item label="类型：" prop="type">
        <a-radio-group v-model="saveObject.type">
          <a-radio :value="0">菜单</a-radio>
          <a-radio :value="1">按钮</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="路径地址：" prop="menuUri">
        <a-input v-model="saveObject.menuUri" />
      </a-form-model-item>

      <a-form-model-item label="前端组件名称：" prop="component">
        <a-input v-model="saveObject.component" />
      </a-form-model-item>

      <a-form-model-item label="菜单图标：" prop="icon">
        <a-input v-model="saveObject.icon" />
      </a-form-model-item>

      <a-form-model-item label="排序（正序显示）：" prop="entSort">
        <a-input v-model="saveObject.sort" />
      </a-form-model-item>

      <a-form-model-item label="父节点：" prop="pid">
        <a-input v-model="saveObject.pid" />
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
import { req, API_URL_PERMISSION_LIST } from '@/api/manage'
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
        authName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
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
        req.getById(API_URL_PERMISSION_LIST, recordId).then(res => { that.saveObject = res })
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
              req.add(API_URL_PERMISSION_LIST, that.saveObject).then(res => {
                that.$message.success('新增成功')
                that.isShow = false
                that.callbackFunc() // 刷新列表
              }).catch(res => { that.confirmLoading = false })
            } else {
              req.updateById(API_URL_PERMISSION_LIST, that.recordId, that.saveObject).then(res => {
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
