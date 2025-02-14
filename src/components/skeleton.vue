<script setup>
import { ref } from 'vue';
import { useControllersStore } from '@/stores/controllers';
import { useComputersStore } from '@/stores/mycomputers';
import { RouterLink, RouterView } from 'vue-router'
import WorkSide from '@/components/workside.vue'

const store = useControllersStore();
const store2 = useComputersStore();

const min = () => {
  window.electronAPI.minimizeWindow();
};

const close = () => {
  window.electronAPI.closeWindow();
}


</script>
<template>
  <div class="workside">
    <WorkSide />
  </div>
  <v-card>
    <v-layout>
      <v-app-bar color="#B2EBF2" density="compact" class="custom-app-bar">
        <v-app-bar-nav-icon variant="text" @click.stop="store.changedrawer" class="navicon"></v-app-bar-nav-icon>

        <v-toolbar-title>WATCHME</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-minus-box " variant="text" @click="min()" class="navicon"></v-btn>
          <v-btn icon="mdi-xamarin" variant="text" @click="close()" class="navicon"></v-btn>
        </template>

        <!-- <v-btn icon="mdi-dots-vertical" variant="text"></v-btn> -->
      </v-app-bar>
      <v-main class="mainpage">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
  <v-navigation-drawer v-model="store.drawerside" temporary class="custom-drawer">
    <v-list-item title="仓库" style="font-size: 50px;"></v-list-item>
    <v-divider></v-divider>
    <!-- 使用 v-if 和 v-else 控制显示内容 -->
    <template v-if="store2.computers.length > 0">
      <v-list-item class="hover-effect" v-for="computer in store2.computers" :key="computer.system.systemInfo.uuid"
        :title="computer.system.systemInfo.name || computer.system.systemInfo.version"
        :subtitle="computer.network.ip4[0]">
      </v-list-item>
    </template>
    <template v-else>
      <v-list-item title="暂无计算机信息" subtitle="请添加计算机"></v-list-item>
    </template>
  </v-navigation-drawer>
</template>
<style scoped>
.workside {
  position: absolute;
  bottom: 2%;
  right: 2%;
}

.custom-drawer {
  background-color: #B2EBF2;
}

.custom-app-bar {
  -webkit-app-region: drag;
  /* 添加 -webkit- 前缀以支持 Chromium 内核 */
}

.navicon {
  -webkit-app-region: no-drag;
}

.mainpage {
  display: inline-block;
  /* 转换为行内块元素 */
  margin-top: 15px;
  width: 100%;
  height: 100%;
}

/* 鼠标悬停效果样式 */
.hover-effect {
  transition: all 0.3s ease;
  /* 添加过渡效果 */
  border-radius: 4px;
  /* 添加圆角 */
}

.hover-effect:hover {
  background-color: #e0f7fa;
  /* 改变背景颜色 */
  cursor: pointer;
  /* 鼠标指针变为手型 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
  transform: translateY(-2px);
  /* 向上移动 2px */
}
</style>
