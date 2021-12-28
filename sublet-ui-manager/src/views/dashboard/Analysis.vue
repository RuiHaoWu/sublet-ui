<template>
  <div id="chart-card">
    <div class="chart-top">
      <div class="chart-item top-right">
        <div class="chart-data user-greet">
          <a-skeleton active avatar :loading="skeletonIsShow" :paragraph="{ rows: 6 }">
            <div class="user-greet-title">
              <div class="user-greet-all">
                <div class="user-greet-img">
                  <img :src="greetImg" alt="">
                </div>
                <div class="user-greet-all" >
                  <span style="">{{ mainTips.helloTitle }}</span>
                  <div>
                    <span style="font-size: 12px;">操作员</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="quick-start">
              <p class="quick-start-title ">快速开始</p>
            </div>
          </a-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import store from '@/store'
import { timeFix } from '@/utils/util'
import empty from './empty' // 空数据展示的组件，首页自用

export default {
    data () {
        return {
            skeletonIsShow: false, // 骨架屏是否显示
            greetImg: store.state.user.avatarImgPath, // 头像图片地址
            isAdmin: store.state.user.isAdmin, // 是否为超级管理员
            mainTips: { // 主页提示
                helloTitle: ''
            }
        }
    },
    components: { empty },
    methods: {
    },
    computed: {},
     mounted () {
    // 用户名信息以及时间问候语句。由于退出登陆才让他更改成功，所以这里的数据先从 vuex中获取
    this.mainTips.helloTitle = `${timeFix()}，` + this.$store.state.user.userName
  }
}
</script>

<style lang="less" scoped>
  @import './index.less'; // 响应式布局
  .user-greet {
    font-size: 19px;
    font-weight: 500;

    .quick-start {
      box-sizing: border-box;
      padding-top: 20px;

      .quick-start-title {
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        margin-bottom:0;
      }
      .quick-start-ul {
        font-size: 13px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        padding: 0;
        margin-bottom:0;

        li {
          margin-right: 20px;
          margin-top: 10px;
          text-align: left;

          :hover {
            color: @jee-inside-link
          }
        }
        li:hover {
          cursor:pointer;
        }
      }
    }
  }
  .chart-padding {
    box-sizing: border-box;
    padding: 0 5px;
    width:300px;
  }

  .user-greet-title{
    box-sizing:border-box;
    padding-bottom:20px;
    display:flex;
    justify-content:space-between;
    border-bottom:1px solid #ddd;

    .user-greet-all {
      display:flex;
      flex-direction:row;

      .user-greet-img {
        width:60px;
        height:60px;
        border-radius:50%;
        overflow:hidden;
        background:#ddd;
        margin-right:10px;
        img {
          width:60px;
          height:60px;
          border:1px solid rgba(0,0,0,0.08)
        }
      }
      .user-greet-all {
        display:flex;
        flex-direction:column;
        justify-content: space-around;
      }
    }
  }
  .analy-title {
    display:flex;
    justify-content:space-between;
    padding-bottom:0;
    align-items: center;
  }
  .there-spot:hover {
    cursor:pointer;
  }
  .ant-calendar-picker-input {
    border:none !important
  }
  .payAmountSpan {
   display:flex;
   justify-content:space-between;
   width: 100%;
   box-sizing: border-box;
   position: absolute;
   bottom:20px;
   padding:0 20px;
   box-sizing: border-box;
  }

  .chart-data {
    padding:20px;
    box-sizing: border-box;
  }

  .top-left {

    .chart-data {
      padding:0;
    }
  }

  .pay-amount-text {
    display: flex;
    padding: 0 20px 0 16px;
    box-sizing: border-box;
    height: 33px;
    line-height: 33px;
    align-items: baseline;
    margin-bottom: 10px;
    .pay-amount {
      font-size: 33px;
      margin-right: 10px;
    }
  }

  .pay-count-title {
    display:flex;
    flex-wrap: wrap;
    justify-content:space-between;
    align-items:center;
    .pay-count-date{
      display:flex;
      justify-content:space-around;
    }
  }
  .chart-padding {
    box-sizing: border-box;
    max-width:330px;
    min-width:260px;
    flex-grow: 1;
    flex-shrink:1;
    margin-bottom: 20px;
  }
  .change-date-layout {
    padding-left: 11px;
    align-items: center;
    display:flex;
    justify-content:space-between;

    .change-date-icon {
      width:50px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
  }

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    margin-right:20px;
    margin-bottom:20px;
  }
</style>
