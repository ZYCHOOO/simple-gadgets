<template>
  <div class="date-time" :style="{ 'font-size': `${useStyleObj.fontSize}px` }">
    <p :style="styleObject">{{ nowDate }}</p>
    <p :style="styleObject">{{ nowTime }}</p>
  </div>
</template>
<script>
export default {
  name: "DateTime",
  props: {
    //客户端传递的样式
    styleObj: {
      type: Object,
      default: () => ({
        fontSize: 25,
        color: ["#dcedff", "#5ca9ff"]
      })
    }
  },
  computed: {
    useStyleObj() {
      let size = 25;
      let color = ["#dcedff", "#5ca9ff"];
      if (this.styleObj.fontSize) {
        size = this.styleObj.fontSize;
      }
      if (this.styleObj.color) {
        color = this.styleObj.color;
      }
      return {
        fontSize: size,
        color: color
      };
    },
    styleObject() {//根据客户端传递的样式值配置文字的渐变色
      return {
        background: `linear-gradient(180deg,${this.useStyleObj["color"][0]},
        ${
          this.useStyleObj.color.length > 1
            ? this.useStyleObj["color"][1]
            : this.useStyleObj["color"][0]
        })`,
        "-webkit-background-clip": "text"
      };
    }
  },
  data() {
    return {
      timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: ""
    };
  },
  created() {
    this.timer = setInterval(() => {
      this.setNowTimes();
    }, 1000);
  },
  beforeDestroy: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    setNowTimes() {
      const myDate = new Date()
      const wk = myDate.getDay()
      const yy = String(myDate.getFullYear())
      const mm = myDate.getMonth() + 1
      const dd = this.zerolize(myDate.getDate())
      const hou = this.zerolize(myDate.getHours())
      const min = this.zerolize(myDate.getMinutes())
      const sec = this.zerolize(myDate.getSeconds())
      const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
      const week = weeks[wk]
      this.nowDate = `${yy}/${mm}/${dd} ${week}`
      this.nowTime = `${hou}:${min}:${sec}`
      this.nowWeek = week
    },
    zerolize(num) {
      return num < 10 ? `0${num}` : num
    }
  }
}
</script>
