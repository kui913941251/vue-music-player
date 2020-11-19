<template>
  <div class="tab_bar">
    <div class="tab_item"
         :class="{active: index === currentIndex}"
         v-for="(item , index) in tabs"
         :key="item.id" ref="tabItem"
         @click="changeIndex(index)">
      {{item.name}}
    </div>
    <div class="line"
         :style="[{left: ((tabItemWidth / 2) - (lineWidth / 2) + (tabItemWidth * currentIndex))+ 'px'},
         {width: lineWidth+'px'}]"></div>
  </div>
</template>

<script>
  export default {
    name: "TabBar",
    props: {
      tabs: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        currentIndex: 0,
        tabItemWidth: 0,
        lineWidth: 0
      }
    },
    computed: {
    },
    updated() {
        this.$nextTick()
        this.tabItemWidth = this.$refs.tabItem[0].offsetWidth
        this.lineWidth = this.tabItemWidth * 0.5
    },
    mounted() {
      this.$nextTick(() => {
        this.tabItemWidth = this.$refs.tabItem[0].offsetWidth
        this.lineWidth = this.tabItemWidth * 0.5
      })
    },
    methods: {
      changeIndex(index) {
        this.currentIndex = index
        this.$emit("changeIndex" , index)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tab_bar{
    position: relative;
    background-color: #fff;
    width: 100%;
    display: flex;
    height: 40px;
    box-shadow: 0 2px 4px #e5e5e5;
    .tab_item{
      flex: 1;
      text-align: center;
      line-height: 40px;
      font-size: 15px;
      transition: .3s;
    }
    .line{
      position: absolute;
      left: 0;
      bottom: 2px;
      width: 20px;
      height: 2px;
      background-color: var(--musicThemeColor);
      transition: .3s;
    }
    .active{
      color: var(--musicThemeColor);
    }
  }
</style>