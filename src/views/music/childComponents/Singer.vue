<template>
  <div class="singer">
    <div class="singer_class_list">
      <div class="class_item"
           v-for="(item,index) in singerClassList" @click="goToClassDetailPage(item.classid)">
        <div class="item_img">
          <img :src="item.imgurl" alt="">
        </div>
        <div class="item_title">{{item.classname}}</div>
        <div class="item_icon">
          <span class="iconfont icon-qianjin"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSingerClassData} from "network/request";

  export default {
    name: "Singer",
    components: {
    },
    data() {
      return {
        singerClassList: []
      }
    },
    created() {
      getSingerClassData({
        params: {
          json: true
        }
      }).then(res => {
        this.singerClassList = res.data.list
      })
    },
    mounted() {

    },
    methods: {
      goToClassDetailPage(classId) {
        this.$bus.$emit("addClassInfo" , classId)
      }
    }
  }
</script>

<style lang="less" scoped>
  .class_item{
    display: flex;
    align-items: center;
    padding: 10px;
    .item_img{
      flex: 1;
      border-radius: 5px;
      overflow: hidden;
      img{
        width: 100%;
        vertical-align: middle;
      }
    }
    .item_title{
      flex: 4;
      margin-left: 10px;
    }
  }
</style>