<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue';
import WorkSide from "./components/workside.vue";
import sidebars from './components/sidebars.vue';


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
  <v-app>
    <div class="workside">
      <WorkSide />
    </div>
    <!-- sidebars里显示页面内容，自适应大小 -->
    <div class="sidebars">
      <sidebars />
    </div>

    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav> -->


  </v-app>
</template>

<style>
/* 隐藏滚动条但保留滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.workside {
  position: absolute;
  bottom: 3%;
  right: 3%;
}
</style>
