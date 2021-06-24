<template>
  <div ref="pieChart" :class="className" :style="{ height: height, width: width }" />
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
    const pieChart = ref(null)
    const initChart = () => {
      if (chart) {
        chart.dispose()
        chart = null
      }

      chart = echarts.init(pieChart.value, 'macarons')

      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
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
      pieChart,
      initChart
    }
  }
}
</script>

<style lang="scss" scoped></style>
