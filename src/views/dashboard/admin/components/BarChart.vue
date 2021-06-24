<template>
  <div ref="barChart" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
// import resize from './mixins/resize'
// TODO: resize添加
// import macarons2 from 'echarts/theme/macarons2.js'
// require('echarts/theme/macarons')
// TODO add 主题引用
let chart = null
const animationDuration = 6000
export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  setup() {
    const barChart = ref(null)
    const initChart = () => {
      chart = echarts.init(barChart.value, 'macarons')

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration
          }
        ]
      })
    }
    onMounted(() => {
      nextTick(() => {
        initChart()
      })
    })
    onUnmounted(() => {
      if (!chart) {
        return
      }
      chart.dispose()
      chart = null
    })
    return {
      barChart,
      initChart
    }
  }
}
</script>

<style lang="scss" scoped></style>
