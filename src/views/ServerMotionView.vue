<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '@/stores/data'
import { fetchInstanceMonitorData } from '@/utils/Tencentcloud-Api'
import * as echarts from 'echarts'

const route = useRoute()
const dataStore = useDataStore()
const uuid = ref(route.params.uuid)
const loading = ref(true)
const error = ref(null)

// 使用 ref 管理图表实例
const charts = ref({
  cpu: null,
  mem: null,
  net: null
})

// 添加模板引用
const cpuChartRef = ref(null)
const memChartRef = ref(null)
const netChartRef = ref(null)

// 监控指标配置
const metrics = ref({
  CPU: 'CPUUsage',
  MEM: 'MemUsage',
  NET: 'IntranetOut'
})

// 统一初始化图表
const initCharts = async () => {
  await nextTick()

  try {
    charts.value.cpu = initChart(cpuChartRef.value, 'CPU 使用率 (%)')
    charts.value.mem = initChart(memChartRef.value, '内存使用率 (%)')
    charts.value.net = initChart(netChartRef.value, '外网出带宽 (Mbps)')
  } catch (err) {
    handleError('图表初始化失败: ' + err.message)
  }
}

// 获取并更新数据
const fetchData = async () => {
  try {
    const results = await Promise.all([
      fetchInstanceMonitorData(uuid.value, metrics.value.CPU),
      fetchInstanceMonitorData(uuid.value, metrics.value.MEM),
      fetchInstanceMonitorData(uuid.value, metrics.value.NET)
    ])

    updateChartData(results)
    loading.value = false
  } catch (err) {
    handleError('数据获取失败: ' + err.message)
  }
}

// 更新图表数据方法
const updateChartData = (results) => {
  const [cpuData, memData, netData] = results
  charts.value.cpu.setOption(generateOption(processTimeData(cpuData), 'CPU'))
  charts.value.mem.setOption(generateOption(processTimeData(memData), 'MEM'))
  charts.value.net.setOption(generateOption(processTimeData(netData), 'NET'))
}

// 错误处理统一方法
const handleError = (message) => {
  error.value = message
  loading.value = false
  clearCharts()
}

// 清理图表资源
const clearCharts = () => {
  Object.values(charts.value).forEach(chart => {
    chart?.dispose()
  })
}

onMounted(async () => {
  await initCharts()
  await fetchData()
  const timer = setInterval(fetchData, 60000)

  onBeforeUnmount(() => {
    clearInterval(timer)
    clearCharts()
  })
})
</script>

<template>
  <v-container>
    <v-btn variant="text" color="primary" class="mb-4" to="/server">
      <v-icon>mdi-arrow-left</v-icon>
      返回服务器列表
    </v-btn>

    <v-card v-if="loading" class="pa-4">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
      <div class="text-center mt-2">正在获取监控数据...</div>
    </v-card>

    <v-alert v-else-if="error" type="error">{{ error }}</v-alert>

    <template v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <div ref="cpuChartRef" class="chart"></div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <div ref="memChartRef" class="chart"></div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <div ref="netChartRef" class="chart"></div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
  padding: 16px;
}
</style>
