<script setup>
import { onMounted, onUnmounted } from 'vue';
import skeleton from './components/skeleton.vue';
import initialize from './utils/initialize.js';
import snack from './components/snack.vue';

// 监听关闭信号
onMounted(() => {

  console.log('Vue app is mounted.');

  initialize();

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
::-webkit-scrollbar {
  display: none;
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
