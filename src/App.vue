<script setup>
import { onMounted, onUnmounted } from 'vue';
import skeleton from './components/skeleton.vue';
import initialize from './utils/initialize.js';
import snack from './components/snack.vue';
import { useDataStore } from './stores/data';
const store = useDataStore();


// 监听关闭信号
onMounted(async () => {

  console.log('Vue app is mounted.');

  // 等待初始化函数执行完成
  const daf = await initialize();
  store.params = daf;


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
    <!-- sidebars里显示页面内容，自适应大小 -->
    <div class="skeleton">
      <skeleton />
    </div>
    <snack />
  </v-app>
</template>

<style>
/* 隐藏滚动条但保留滚动功能 */
/* ::-webkit-scrollbar {
  display: none;
} */
/* 自定义滚动条样式 */
@font-face {
  font-family: 'AlibabaPuHuiTi';
  /* 自定义字体名称 */
  src: url('@/assets/fonts/AlibabaPuHuiTi-3-65-Medium.ttf') format('truetype'),
    url('@/assets/fonts/AlibabaPuHuiTi-3-65-Medium.woff') format('truetype'),
    url('@/assets/fonts/AlibabaPuHuiTi-3-65-Medium.woff2') format('woff2');

  font-weight: normal;
  font-style: normal;
}

.v-card-title,
.v-card-text {
  font-family: 'AlibabaPuHuiTi', sans-serif !important;
}

/* 将字体应用到全局 */
body {
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.skeleton {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* 修改routerlink带来的样式问题 */
.router-link-active {
  /* 改变背景颜色 */
  color: #0063f7;
  /* 改变文字颜色 */
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
