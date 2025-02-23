<script setup>
import { useDataStore } from '@/stores/data';
import { useRoute } from 'vue-router';
import { fetchInstanceMonitorData } from '@/utils/Tencentcloud-Api';
import { onMounted, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// 注册 ECharts 所需的组件和渲染器
use([CanvasRenderer, LineChart, GridComponent, TitleComponent, TooltipComponent]);

const route = useRoute();
const id = route.params.InstanceId;
// 获取数据存储实例
const dataStore = useDataStore();

// 定义加载状态和错误信息
const isLoading = ref(true);
const errorMessage = ref('');

// 定义图表配置
const chartOptions = ref({
  cpu: {
    title: { text: 'CPU 使用率 (%)', left: 'center', top: 10 },
    grid: { top: 60, bottom: 40 },
    xAxis: { type: 'time', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{ type: 'line', smooth: true, areaStyle: {} }]
  },
  mem: {
    title: { text: '内存使用率 (%)', left: 'center', top: 10 },
    grid: { top: 60, bottom: 40 },
    xAxis: { type: 'time', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{ type: 'line', smooth: true, areaStyle: {} }]
  },
  disk: {
    title: { text: '磁盘使用率 (%)', left: 'center', top: 10 },
    grid: { top: 60, bottom: 40 },
    xAxis: { type: 'time', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{ type: 'line', smooth: true, areaStyle: {} }]
  },
  network: {
    title: { text: '网络流量 (Mbps)', left: 'center', top: 10 },
    grid: { top: 60, bottom: 40 },
    xAxis: { type: 'time', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [
      { name: '出站流量', type: 'line', smooth: true },
      { name: '入站流量', type: 'line', smooth: true }
    ]
  }
});

// 数据处理函数，将原始数据转换为 ECharts 所需的格式
function processData(rawData) {
  return (rawData?.DataPoints || []).map(dp => [dp.Timestamp, dp.Value]);
}

// 网络数据处理函数，将字节转换为 Mbps
function processNetworkData(rawData) {
  return processData(rawData).map(([t, v]) => [t, v / 1e6]);
}

// 定义一个刷新计数器
const refreshCounter = ref(0);

// 封装数据获取和更新逻辑
async function updateData() {
  try {
    isLoading.value = true;
    const [cpuData, memData, diskData, netOut, netIn] = await Promise.all([
      fetchInstanceMonitorData(id, 'CPUUsage'),
      fetchInstanceMonitorData(id, 'MemUsage'),
      fetchInstanceMonitorData(id, 'DiskUsage'),
      fetchInstanceMonitorData(id, 'LANOuttraffic'),
      fetchInstanceMonitorData(id, 'LANIntraffic')
    ]);
    console.log(cpuData);

    // 更新 CPU 数据
    chartOptions.value.cpu.series[0].data = processData(cpuData);
    // 更新内存数据
    chartOptions.value.mem.series[0].data = processData(memData);
    // 更新磁盘数据
    chartOptions.value.disk.series[0].data = processData(diskData);
    // 更新网络出站流量数据
    chartOptions.value.network.series[0].data = processNetworkData(netOut);
    // 更新网络入站流量数据
    chartOptions.value.network.series[1].data = processNetworkData(netIn);

    errorMessage.value = '';
  } catch (err) {
    // 捕获错误并更新错误信息
    errorMessage.value = err.message;
  } finally {
    // 无论成功或失败，都将加载状态设置为 false
    isLoading.value = false;
    // 增加刷新计数器的值
    refreshCounter.value++;
  }
}

// 组件挂载时获取数据并更新图表
onMounted(async () => {
  await updateData();
});

// 刷新按钮点击事件处理函数
const refreshData = async () => {
  await updateData();
};
</script>

<template>
  <v-container class="chart-container pa-6">
    <!-- 返回按钮和刷新按钮 -->
    <v-row class="mb-4">
      <v-col cols="6">
        <v-btn to="/server" color="primary" dark elevation="3" rounded prepend-icon="mdi-arrow-left">
          返回
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn @click="refreshData" color="primary" dark elevation="3" rounded prepend-icon="mdi-refresh">
          刷新
        </v-btn>
      </v-col>
    </v-row>

    <!-- 加载状态显示 -->
    <template v-if="isLoading">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="80"></v-progress-circular>
          <p class="mt-3 text-subtitle-1">正在加载数据，请稍候...</p>
        </v-col>
      </v-row>
    </template>

    <!-- 错误信息显示 -->
    <template v-else-if="errorMessage">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-alert type="error" color="error" icon="mdi-alert-circle" dense outlined>
            {{ errorMessage }}
          </v-alert>
        </v-col>
      </v-row>
    </template>

    <!-- 数据显示 -->
    <template v-else>
      <v-row>
        <!-- 循环渲染图表 -->
        <v-col cols="12" md="6" lg="3" v-for="(chart, key) in chartOptions" :key="key">
          <v-card class="elevation-5 rounded-lg overflow-hidden mb-6" transition="scale-transition">
            <v-card-title class="text-h6 font-weight-bold pa-4 bg-primary text-white">
              {{ chart.title.text }}
            </v-card-title>
            <v-card-text style="height: 350px; background-color: #f9fafb;">
              <!-- 使用 vue-echarts 组件渲染图表，添加 :key 属性 -->
              <v-chart :option="chart" :key="refreshCounter" autoresize class="chart-element" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped>
.chart-container {
  max-width: 1440px;
  margin: 0 auto;
}

.chart-element {
  width: 100%;
  height: 100%;
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
</style>