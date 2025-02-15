<script setup>
import { ref, watch, computed } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import * as echarts from 'echarts';

const route = useRoute();
const store2 = useComputersStore();

// 根据 uuid 获取对应的计算机信息
const uuid = ref(route.params.uuid);
// 定义 ECharts 容器的引用，仅保留内存和硬盘图表的引用
const memoryChartRef = ref(null);
// 初始化 diskChartRefs 为一个空数组
const diskChartRefs = ref([]);

// 计算属性，将字节转换为 GB
const convertToGB = computed(() => {
  return (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
  };
});

// 初始化图表函数
const initCharts = () => {
  // 检查数据有效性
  if (!store2.computerNow || !store2.computerNow.memory || !store2.computerNow.disk || !store2.computerNow.disk.diskinfo) {
    console.log('数据无效，无法初始化图表');
    return;
  }

  // 初始化内存使用情况图表
  if (memoryChartRef.value) { // 检查 DOM 元素是否存在
    let memoryChart = echarts.getInstanceByDom(memoryChartRef.value);
    if (!memoryChart) {
      memoryChart = echarts.init(memoryChartRef.value);
    }
    const memoryData = [store2.computerNow.memory.used, store2.computerNow.memory.free];
    const memoryOption = {
      title: {
        text: '内存使用情况',
        subtext: '单位：MB',
        left: 'center',
        top: '2%', // 设置标题距离顶部的距离
      },
      grid: {
        top: '20%' // 调整图表内容距离顶部的距离
      },
      series: [
        {
          type: 'pie',
          radius: '70%', // 缩小饼图的半径
          center: ['50%', '55%'], // 调整饼图的中心位置，让饼图整体下移
          data: [
            { value: memoryData[0], name: '已使用' },
            { value: memoryData[1], name: '空闲' }
          ],
          label: {
            show: true, // 显示标签
            position: 'inside', // 标签位置
            formatter: '{b}: {c}MB ({d}%)' // 标签显示格式，b 为名称，c 为值，d 为百分比
          }
        }
      ],
      // responsive: true // 开启自适应大小
    };
    memoryChart.setOption(memoryOption);
  }

  // 初始化硬盘信息图表
  const diskUsage = store2.computerNow.disk.diskusage;
  diskUsage.forEach((disk, index) => {
    console.log(diskChartRefs.value); // 输出内部的值数组

    if (diskChartRefs.value[index]) { // 检查 DOM 元素是否存在
      let diskChart = echarts.getInstanceByDom(diskChartRefs.value[index]);
      if (!diskChart) {
        diskChart = echarts.init(diskChartRefs.value[index]);
      }
      const diskData = [
        { value: disk.used, name: '已使用' },
        { value: disk.available, name: '空闲' }
      ];
      const diskOption = {
        title: {
          text: `${disk.fs} 硬盘使用情况`,
          left: 'center',
          top: '2%',
          textStyle: {
            fontSize: 12 // 更改字体大小为 12px，可根据需要调整
          }
        },
        grid: {
          top: '20%'
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
            data: diskData.map(item => ({
              ...item,
              value: convertToGB.value(item.value)
            })),
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}: {c}GB ({d}%)' // 修改标签单位为 GB
            }
          }
        ]
      };
      diskChart.setOption(diskOption);
    } else {
      console.log(`diskChartRefs.value[${index}] 不存在，无法初始化图表`);
    }
  });
};

// 封装数据获取和图表更新逻辑
const fetchAndUpdateCharts = () => {
  store2.getCurrentComputer(uuid.value);
  initCharts();
};

onMounted(() => {
  fetchAndUpdateCharts();
});

// 监听路由参数 uuid 的变化
watch(() => route.params.uuid, (newUuid) => {
  uuid.value = newUuid;
  fetchAndUpdateCharts();
});
</script>
<template>
  <!-- ECharts 容器 -->
  <div class="chart-container">
    <!-- 内存使用情况图表容器 -->
    <div ref="memoryChartRef" class="chart-item"></div>
    <!-- 硬盘信息图表容器 -->
    <div v-for="(disk, index) in store2.computerNow?.disk?.diskusage || []" :key="index">
      <div :ref="(el) => {
        // 确保 diskChartRefs.value 是数组且长度足够
        if (!Array.isArray(diskChartRefs.value)) {
          diskChartRefs.value = [];
        }
        while (diskChartRefs.value.length <= index) {
          diskChartRefs.value.push(null);
        }
        diskChartRefs.value[index] = el;
      }" class="chart-item"></div>
    </div>
  </div>
  <span>
    {{ store2.computerNow?.disk?.diskusage }}
  </span>
</template>
<style scoped>
.chart-container {
  display: flex;
  justify-content: left;
  gap: 15px
}

.chart-item {
  width: 250px;
  height: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
  border-radius: 8px;
  overflow: hidden
}
</style>