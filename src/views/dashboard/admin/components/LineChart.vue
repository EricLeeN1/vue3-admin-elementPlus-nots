<template>
  <div ref="lineChartsRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import { ref, nextTick, onMounted, watch, onUnmounted } from 'vue'
// import resize from './mixins/resize'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const lineChartsRef = ref(null)
    const setOptions = ({ expectedData, actualData } = {}) => {
      chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: 'expected',
            itemStyle: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
    const initChart = () => {
      if (chart) {
        chart.dispose()
        chart = null
      }
      chart = echarts.init(lineChartsRef.value, 'macarons')
      setOptions(props.chartData)
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
    watch(
      () => props.chartData,
      () => {
        initChart()
      }
    )
    return {
      lineChartsRef
    }
  }
}
</script>

<style lang="scss" scoped></style>
