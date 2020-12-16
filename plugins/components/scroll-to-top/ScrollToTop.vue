<template>
  <div v-if="show" class="scroll-to-top" @click="backTop">
    <img :src="imgSrc" alt="" class="to-top__icon">
    <span v-if="value !== null" class="tp-top__text">
      {{ value }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ScrollToTop',
  props: {
    imgSrc: {
      type: String,
      defualt: null,
      required: true
    },
    value: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    // 点击图片回到顶部方法
    backTop() {
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//滚动距离
      let timer = setInterval(() => {
        scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//滚动距离
        let ispeed = Math.floor(scrollTop / 5)
        if (ispeed === 0) {
          ispeed = 1
        }
        document.documentElement.scrollTop = document.body.scrollTop = scrollTop - ispeed
        if (scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    },
    // 掩藏跟显示回到顶部按钮
    scrollToTop() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        this.show = true
      } else {
        this.show = false
      }
    }
  }
}
</script>

<style scoped>
  .scroll-to-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #FFF;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.14);
  }
  .to-top__icon {
    width: 13px;
    height: 16px;
  }
  .to-top__text {
    font: normal 400 12px PingFang-SC-Heavy, PingFang-SC;
    color: #999;
  }
</style>
