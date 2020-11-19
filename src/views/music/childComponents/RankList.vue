<template>
  <div class="rank_list">
    <div class="rank_item" v-for="(item,index) in rankList" @click="goToRankDetail(item.rankid)">
      <div class="item_img">
        <img :src="formatImgUrl(item.imgurl)" alt="">
      </div>
      <div class="item_info">
        <div class="item_title">{{item.rankname}}</div>
        <div class="item_update">更新时间: {{item.update_frequency}}</div>
      </div>
      <div class="item_icon">
        <span class="iconfont icon-qianjin"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRankListData} from "network/request";

  export default {
    name: "RankList",
    data() {
      return {
        rankList: []
      }
    },
    created() {
      getRankListData({
        params: {
          json: 'true'
        }
      }).then(res => {
        this.rankList = res.data.rank.list
      })
    },
    methods: {
      // 处理后台传过来的imgurl
      formatImgUrl(value) {
        if (value == "" || value == undefined) return
        let url = value
        url = url.replace("/{size}" , "")
        return url
      },
      // 显示排行榜详情
      goToRankDetail(rankId) {
        this.$bus.$emit("addRank" , rankId)
      }
    }
  }
</script>

<style lang="less" scoped>
  .rank_list{
    padding: 10px 15px;
    .rank_item{
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      .item_img{
        flex: 1;
        border-radius: 5px;
        overflow: hidden;
        img{
          width: 100%;
          vertical-align: middle;
        }
      }
      .item_info{
        flex: 4;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .item_title{
          font-size: 14px;
          margin-bottom: 10px;
        }
        .item_update{
          font-size: 13px;
        }
      }
    }
  }
</style>