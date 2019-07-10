<template>
  <div class="person-clock">
    <div class="header">
      <div class="left"><i class="iconfont iconback"></i></div>
      <div class="center">Demo1</div>
    </div>
    <div class="body">
      <div class="content-card">
        <div><img :src="userInfo.fileUrl" class="content-card-img"></div>
        <div class="content-card-right">
          <div class="content-card-line bg-font">
            <div>{{ userInfo.workerName }}</div>
            <div>{{countTime}}H</div>
          </div>
          <div class="content-card-line">
            <div>{{ workStatus === 'START' ? '工作中...' : '休息中...' }}</div>
            <div>合计</div>
          </div>
        </div>
     </div>
      <van-tabs v-model="active">
        <van-tab title="当天">
          <div v-for="(item,index) in dayHistory" :key="index" :class="{'content-info-open':item.workStatus==='START','content-info-close':item.workStatus==='END'}">
            <div class="flex-box content-info-first">
              <div class="flex-box"><span class="content-info-date">{{ item.startTime }}</span>
              </div>
              <div></div>
            </div>
          </div>
        </van-tab>
        <van-tab title="统计">
          <div>
            <div class="content-total-header">
              <div>{{ totalParam.startDate }}</div>~<div>{{ totalParam.endDate }}</div>
            </div>
            <div>
              <div v-for="(item,index) in totalDayHistory" :key="index" class="content-total-body">
                <div class="flex-box content-total-body-first">
                  <div>{{ item.date }}</div>
                  <div>{{ item.countTime }}</div>
                </div>
                <div class="flex-box content-total-body-second">
                  {{ item.startTime }} ~ {{ item.endTime }}
                </div>
              </div>
            </div>
        </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
var moment = require('moment')

interface DayHistoryItem {
  operateName?: string;
  startTime?: number;
  workStatus?: string;
  effectiveTime?: number;
  [propName: string]: any
}

interface OndDayHistoryItem {
  countTime?: number;
  date?: string;
  endTime?: string;
  startTime?: string;
  [propName: string]: any
}

interface UserInfo {
  creationTime?: string;
  fileUrl?: string;
  workerId?: string;
  workerName?: string;
  workerNumber?: string;
  [propName: string]: any
}

interface TokenData {
  access_token: string;
  appId: string;
  expires_in: number;
  organizationId: string;
  scope: string;
  token_type: string;
  userId: string;
  watermarkText: string;
  [propName: string]: any
}

interface TotalParam {
  pageNum: number;
  pageSize: number;
  startDate: string;
  endDate: string;
}

@Component({
  components: {
  }
})
export default class Demo1 extends Vue {
  private active: number = 0;
  // 基地址
  private baseUrl: string = 'https://www.easy-mock.com/mock/5d131fea9b0a7d376146697a';
  private dayHistory: DayHistoryItem[] = [];
  private oneDayHistory: DayHistoryItem[] = []; // 某天的记录
  // 某天总工时
  private oneDayCountTime: string = '';
  // 某天日期
  private oneDayDate: string | undefined;
  private userInfo: UserInfo = {};
  // 当天总工时
  private countTime: string = '';
  // 当天工作状态
  private workStatus: string = '';
  private totalDayHistory: OndDayHistoryItem[] = [];
  // token
  private tokenData: TokenData = {
    access_token: '',
    appId: '',
    expires_in: 0,
    organizationId: '',
    scope: '',
    token_type: '',
    userId: '',
    watermarkText: ''
  };
  // 是否展示加载图标
  private showLoading: boolean = false;
  private totalParam: TotalParam = {
    pageNum: 0,
    pageSize: 15,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  // tab页参数
  tabItem: string = 'day';

  public async mounted () {
    await this.getWork()
    await this.getDayHistory()
  }

  // 获取用户信息
  async getWork () {
    var vm = this
    var instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    })
    let resp = await instance.post(`/sme/getWorker`, {})
    vm.userInfo = resp.data.data.workerDTO
    vm.userInfo.fileUrl = vm.userInfo.fileUrl
  }
  // 获取打卡记录列表
  async getDayHistory (type = 'day', date?: string) {
    var vm = this
    var instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000
    })
    let resp = await instance.post(`/getDayHistory`, {})
    // this.showLoading = false
    if (type === 'day') {
      vm.dayHistory = resp.data.data.list ? resp.data.data.list : []
      vm.workStatus = resp.data.data.nowStatus
      vm.countTime = resp.data.data.countTime
      vm.dayHistory.map(item => {
        item.startTime = moment(item.startTime).format('hh:mm:ss')
      })
    } else {
      vm.oneDayHistory = resp.data.data.list ? resp.data.data.list : []
      vm.oneDayDate = date
      vm.oneDayCountTime = resp.data.data.countTime
      vm.oneDayHistory.map(item => {
        item.startTime = moment(item.startTime).format('hh:mm:ss')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../assets/stylus/_variables.styl';
  .flex-box {
    display flex
  }
  .person-clock {
    width 100%
    height 100%
    position relative
  }
  .header {
    display flex
    background $baseColor
    color #ffffff
    height 44px
    line-height 44px
    .left {
      width 10%
    }
    .center {
      width 90%
      padding-right 10%
      text-align center
    }
  }
  .body {
    position absolute
    left 0
    right 0
    top 44px
    bottom 44px
    background-color: #fafafa;
  }
  .footer {
    position absolute
    bottom 0
    height 44px
    line-height 44px
    width 100%
  }
  .footer-button {
    height inherit
    width inherit
    text-align center
    color $baseColor
    font-size 20px
  }
  .content-card {
      display flex
      padding 15px
      background $baseColor
      color #ffffff
  }
  .content-card-img {
      width 50px
      height 50px
      border-radius 50%
  }
  .content-card-right {
      flex 1
  }
  .content-card-info {

  }
  .content-card-line {
      display flex
      margin-bottom 10px
      padding-left 10px
      > div {
          &:first-child {
              width 70%
              text-align left
          }
          &:last-child {
              width 30%
              text-align right
          }
      }
  }
  .bg-font {
      font-size 20px
      font-weight bold
  }
  .tabpane {
    width 50%
  }
  .content-info-open {
      margin 10px 0
      background #ffffff
      position relative
      > div {
          padding 15px 15px 0 30px
          &:last-child {
              padding-bottom 15px
          }
      }
      &:before{
          content ''
          position absolute
          left 20px
          height 100%
          width 1px
          background $borderColor
      }
      &:after{
          content ''
          position absolute
          left 16px
          top 50%
          transform translateY(-50%)
          width 9px
          height 9px
          border-radius 50%
          background #1F8CEB
      }
  }
  .content-info-close {
      margin 10px 0
      background #ffffff
      position relative
      > div {
          padding 15px 15px 0 30px
          &:last-child {
              padding-bottom 15px
          }
      }
      &:before{
          content ''
          position absolute
          left 20px
          height 100%
          width 1px
          background $borderColor
      }
      &:after{
          content ''
          position absolute
          left 16px
          top 50%
          transform translateY(-50%)
          width 9px
          height 9px
          border-radius 50%
          background #48D2A0
      }
  }
  .content-info-first {
      >div {
          width 50%
          &:last-child {
              text-align right
          }
      }
  }
  .content-info-date {
      margin-right 10px
  }
  .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
  .content-total-header {
        background #ffffff
        border-top 1px solid $borderColor
        border-bottom 1px solid $borderColor
        color $grayFontColor
        height 42px
        line-height 42px
        padding-left 15px
        margin 10px 0
        box-shadow 0px 0px 2px #cccccc
        position relative
        display flex
        &:after {
            content ''
            width 10px
            height 10px
            border-top 2px solid $borderColor
            border-right 2px solid $borderColor
            position absolute
            right 15px
            top 16px
            transform rotate(45deg)
        }
    }
    .content-total-body {
        background #ffffff
        border-top 1px solid $borderColor
        border-bottom 1px solid $borderColor
        padding 0 15px
        margin 10px 0
        box-shadow 0px 0px 2px #cccccc
        position relative
    }
    .content-total-body-first {
        margin 10px 0
        >div {
            width 50%
            &:last-child {
                color $baseColor
                text-align right
            }
        }
    }
    .content-total-body-second {
        margin 10px 0
        position relative
        color $grayFontColor
        &:after {
            content ''
            width 10px
            height 10px
            border-top 2px solid $borderColor
            border-right 2px solid $borderColor
            position absolute
            right 0px
            top 6px
            transform rotate(45deg)
        }
    }
</style>
