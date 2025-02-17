<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useSnackdataStore } from '@/stores/snackdata';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const store2 = useComputersStore();
const store3 = useSnackdataStore();

// 根据 uuid 获取对应的计算机信息
const uuid = ref(route.params.uuid);

onMounted(() => {
  store2.getCurrentComputer(uuid.value)
});

// 监听路由参数 uuid 的变化
watch(() => route.params.uuid, (newUuid) => {
  uuid.value = newUuid;
  store2.getCurrentComputer(newUuid);
});
// 监听 store2.computerNow 的变化
watch(() => store2.computerNow, async (newComputerNow, oldComputerNow) => {
  // 使用 nextTick 确保 DOM 更新后执行回调
  await nextTick(() => {
    // 这里可以添加一些需要在 DOM 更新后执行的操作

  });
}, { deep: true });

// 计算属性，将字节转换为 GB
const convertToGB = computed(() => {
  return (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
  };
});
</script>

<template>
  <main class="main-container">
    <div class="info-container">
      <!-- 系统信息 -->
      <v-card class="info-card">
        <v-card-title class="card-title">系统信息</v-card-title>
        <v-card-text class="card-text">
          <p>制造商: {{ store2.computerNow?.system?.systemInfo?.manufacturer }}</p>
          <p>型号: {{ store2.computerNow?.system?.systemInfo?.model }}</p>
          <p>版本: {{ store2.computerNow?.system?.systemInfo?.version }}</p>
          <p>序列号: {{ store2.computerNow?.system?.systemInfo?.serial }}</p>
        </v-card-text>
      </v-card>
      <!-- CPU 信息 -->
      <v-card class="info-card">
        <v-card-title class="card-title">CPU 信息</v-card-title>
        <v-card-text class="card-text">
          <p>制造商: {{ store2.computerNow?.cpu?.manufacturer }}</p>
          <p>型号: {{ store2.computerNow?.cpu?.brand }}</p>
          <p>速度: {{ store2.computerNow?.cpu?.speed }} GHz</p>
          <p>核心数: {{ store2.computerNow?.cpu?.cores }}</p>
          <p>物理核心数: {{ store2.computerNow?.cpu?.physicalCores }}</p>
          <p>使用率: {{ store2.computerNow?.cpu?.usage }}%</p>
        </v-card-text>
      </v-card>

      <!-- GPU 信息 -->
      <v-card class="info-card">
        <v-card-title class="card-title">GPU 信息</v-card-title>
        <v-card-text class="card-text">
          <!-- 循环展示多个 GPU 控制器信息 -->
          <template v-for="(controller, index) in store2.computerNow?.gpu?.models?.controllers" :key="index">
            <p>型号: {{ controller.model }}</p>
            <p>显存: {{ controller.vram }} MB</p>
            <p>显存使用: {{ controller.memoryUsed }} MB</p>
            <p>显存空闲: {{ controller.memoryFree }} MB</p>
            <p>GPU 利用率: {{ controller.utilizationGpu }}%</p>
            <p>显存利用率: {{ controller.utilizationMemory }}%</p>
            <p>温度: {{ controller.temperatureGpu }} °C</p>
            <p>功耗: {{ controller.powerDraw }} W</p>
            <p>核心频率: {{ controller.clockCore }} MHz</p>
            <p>显存频率: {{ controller.clockMemory }} MHz</p>
          </template>
        </v-card-text>
      </v-card>
      <!-- 显示器信息 -->
      <v-card class="info-card">
        <v-card-title class="card-title">显示器信息</v-card-title>
        <v-card-text class="card-text">
          <!-- 循环展示多个显示器信息 -->
          <template v-for="(display, index) in store2.computerNow?.gpu?.models?.displays" :key="index">
            <p>显示器型号: {{ display.model }}</p>
            <p>连接方式: {{ display.connection }}</p>
            <p>分辨率: {{ display.resolutionX }}x{{ display.resolutionY }}</p>
            <p>刷新率: {{ display.currentRefreshRate }} Hz</p>
          </template>
        </v-card-text>
      </v-card>

      <!-- 硬盘信息 -->
      <template v-if="store2.computerNow?.disk?.diskinfo">
        <template v-for="(disk, index) in store2.computerNow.disk.diskinfo" :key="index">
          <v-card class="info-card">
            <v-card-title class="card-title">硬盘信息 - {{ index + 1 }}</v-card-title>
            <v-card-text class="card-text">
              <p>名称: {{ disk.name }}</p>
              <p>大小: {{ convertToGB(disk.size) }} GB</p>
              <p>类型: {{ disk.type }}</p>
            </v-card-text>
          </v-card>
        </template>
      </template>
      <!-- 网络信息 -->
      <v-card class="info-card">
        <v-card-title class="card-title">网络信息</v-card-title>
        <v-card-text class="card-text">
          <!-- 循环展示多个 IP 地址 -->
          <template v-for="(ip, index) in store2.computerNow?.network?.ip4" :key="index">
            <p v-if="ip">IP 地址 {{ index + 1 }}: {{ ip }}</p>
          </template>
          <p>MAC 地址: {{ store2.computerNow?.network?.mac }}</p>
        </v-card-text>
      </v-card>
    </div>
  </main>
</template>

<style scoped>
.main-container {
  /* padding: 0px; */
  display: flex;
  flex-direction: column;
  align-items: flex-start
}

.info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 15px;
  margin-bottom: 15px
}

.info-card {
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform .3s ease
}

.info-card:hover {
  transform: translateY(-5px)
}

.card-title {
  background-color: #f5f5f5;
  font-weight: 700;
  padding: 12px
}

.card-text {
  padding: 12px
}
</style>
