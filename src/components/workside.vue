<script setup>
import { ref } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useControllersStore } from '@/stores/controllers';
import { useSnackdataStore } from '@/stores/snackdata';
import { RouterLink } from 'vue-router';

const store = useControllersStore();
const store2 = useComputersStore();
const store3 = useSnackdataStore();
// 调用electronAPI获取系统信息
async function callMainProcessMethod() {
  try {
    store2.showWaiting = true;
    const result = await window.electronAPI.callMainMethod("getSystemInfo");
    store2.add(result)
    store2.getCurrentComputer(result.system.systemInfo.uuid);
    store2.showWaiting = false;

    store3.snackbar = true;
    store3.text = '获取成功';
    store3.color1 = 'success'
  } catch (error) {
    store2.showWaiting = false;
    console.error('Error calling main process method:', error);

    store3.snackbar = true;
    store3.text = '获取失败';
    store3.color1 = 'orange-darken-2'
  }
}
</script>

<template>
  <v-speed-dial location="top center" transition="slide-y-reverse-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab v-bind="activatorProps" size="large" icon="mdi-bank-outline"></v-fab>
    </template>
    <!-- 显示监控端信息 -->
    <RouterLink key="1" :to="`/info/${store2.computerNow.system.systemInfo.uuid}`">
      <v-btn icon="$info"></v-btn>
    </RouterLink>
    <!-- 图形化显示 -->
    <RouterLink key="3" :to="`/motion/${store2.computerNow.system.systemInfo.uuid}`">
      <v-btn icon="mdi-chart-bar"></v-btn>
    </RouterLink>
    <!-- 开启监听（会消耗一部分被监听端的性能） -->
    <v-btn key="2" icon="mdi-motion-play"></v-btn>
    <!-- 重新加载 -->
    <v-btn key="4" icon="mdi-reload" @click="callMainProcessMethod()"></v-btn>
  </v-speed-dial>
</template>

<style scoped>
.v-speed-dial {
  margin-top: 0px;
  margin-right: 5px;
}
</style>
