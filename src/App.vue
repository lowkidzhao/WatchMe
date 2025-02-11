<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue';
import WorkSide from "./components/workside.vue";

// 监听关闭信号
onMounted(() => {
  window.electronAPI.onCloseVueApp(() => {
    // 在这里可以添加关闭 Vue 应用的逻辑
    console.log('Closing Vue app...');
    // 发送关闭完成信号给主进程
    window.electronAPI.sendVueAppClosed();
  });
});

onUnmounted(() => {
  console.log('Vue app is unmounted.');
});
</script>

<template>
  <WorkSide />
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped></style>
