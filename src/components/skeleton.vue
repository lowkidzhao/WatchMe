<script setup>
import { ref } from 'vue';
import { useControllersStore } from '@/stores/controllers';
import { useComputersStore } from '@/stores/mycomputers';
import { useDataStore } from '@/stores/data';
import { useSnackdataStore } from '@/stores/snackdata';
import { RouterLink, RouterView } from 'vue-router'
import WorkSide from '@/components/workside.vue'
import { fetchTencentCloudUpdataConfig } from '@/utils/Tencentcloud-Api';

const store = useControllersStore();
const store2 = useComputersStore();
const store3 = useDataStore();
const store4 = useSnackdataStore();

const comboboxItems = ref([
  'ap-bangkok',
  'ap-beijing',
  'ap-chengdu',
  'ap-chongqing',
  'ap-guangzhou',
  'ap-hongkong',
  'ap-jakarta',
  'ap-mumbai',
  'ap-nanjing',
  'ap-seoul',
  'ap-shanghai',
  'ap-shanghai-fsi',
  'ap-shenzhen-fsi',
  'ap-singapore',
  'ap-tokyo',
  'eu-frankfurt',
  'na-ashburn',
  'na-siliconvalley',
  'sa-saopaulo']);
async function handleSelect(name) {
  let message = await fetchTencentCloudUpdataConfig(store3.params);
  if (message != "更新成功") {
    store4.error(message);
  } else {
    console.log(name);

    store3.cloud = name;
    store4.success(message);
  }
}

//工作台逻辑
function worksideTrue() {
  store.workview = true;
}
function worksideFalse() {
  store.workview = false;
}

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
    <v-layout class="layout">
      <v-app-bar color="#B2EBF2" density="compact" class="custom-app-bar">
        <v-app-bar-nav-icon variant="text" @click.stop="store.changedrawer" class="navicon"></v-app-bar-nav-icon>

        <v-toolbar-title class="headtitle">
          <RouterLink to="/">
            <v-btn class="btntitle">WATCHME</v-btn>
          </RouterLink>
        </v-toolbar-title>

        <v-spacer></v-spacer>


        <v-btn icon="mdi-minus-box " variant="text" @click="min()" class="navicon"></v-btn>
        <v-btn icon="mdi-xamarin" variant="text" @click="close()" class="navicon"></v-btn>

        <!-- <v-btn icon="mdi-dots-vertical" variant="text"></v-btn> -->
      </v-app-bar>
      <v-main class="mainpage">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
  <v-navigation-drawer v-model="store.drawerside" temporary class="custom-drawer" :width="350">
    <v-list-item title="仓库" style="font-size: 50px;"></v-list-item>
    <v-divider></v-divider>
    <!-- 使用 v-if 和 v-else 控制显示内容 -->
    <template v-if="store2.computers.length > 0">
      <RouterLink v-for="computer in store2.computers" :key="computer.system.systemInfo.uuid"
        :to="`/info/${computer.system.systemInfo.uuid}`">
        <v-list-item class="hover-effect" :title="computer.system.systemInfo.name || computer.system.systemInfo.version"
          subtitle="本机" @click="worksideFalse"></v-list-item>
      </RouterLink>
    </template>
    <template v-else>
      <v-list-item title="暂无计算机信息" subtitle="请添加计算机" @click="worksideFalse"></v-list-item>
    </template>
    <v-divider></v-divider>
    <RouterLink :to="`/server`">
      <v-list-item class="hover-effect" title="服务器" subtitle="云服务" @click="worksideTrue"></v-list-item>
    </RouterLink>
    <v-divider></v-divider>
    <!-- 新增腾讯云目录 -->
    <v-expansion-panels>
      <v-expansion-panel title="腾讯云" :readonly="false">
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">
              <v-text-field label="请输入secretId" v-model="store3.params.tencentcloud.credential.secretId"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="请输入secretKey"
                v-model="store3.params.tencentcloud.credential.secretKey"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-radio-group v-model="store3.params.tencentcloud.profile.httpProfile.endpoint" inline>
              <v-radio label="轻量服务器" value="lighthouse.tencentcloudapi.com"></v-radio>
              <v-radio label="云服务器" value="cvm.tencentcloudapi.com"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-combobox label="地域" :items="comboboxItems" variant="solo-filled"
                v-model="store3.params.tencentcloud.region"></v-combobox>
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" style="margin-top: 8px;" @click="handleSelect('腾讯云')">应用</v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>

      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 阿里云目录 -->
    <v-expansion-panels>
      <v-expansion-panel title="阿里云" :readonly="false">
        <v-expansion-panel-text>
          待接入
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>
<style>
::-webkit-scrollbar {
  display: none;
}


.workside {
  position: fixed;
  bottom: 2%;
  right: 2%;
  z-index: 999;
}

.custom-drawer {
  background-color: #B2EBF2;
}

.custom-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* 确保 app-bar 在其他元素之上 */
  -webkit-app-region: drag;
  /* 添加 -webkit- 前缀以支持 Chromium 内核 */
}

.mainpage {
  margin-top: 10px;
  /* 为 app-bar 留出空间，假设 app-bar 高度为 64px，根据实际情况调整 */
  height: calc(100vh - 10px);
  /* 调整 mainpage 的高度，减去 app-bar 的高度 */
  overflow-y: auto;
  /* 当内容超出高度时显示垂直滚动条 */
  position: relative;
  /* 确保定位正常 */
}

.headtitle {
  -webkit-app-region: no-drag;
  max-width: 85px;
  /* 你可以根据需要调整这个值 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* background-color: #e0f7fa; */
}

.btntitle {
  font-size: 14px;
  /* 调整字体大小 */
  font-weight: bold;
  /* 加粗字体 */
  color: #333;
  /* 调整字体颜色 */
  background-color: transparent;
  /* 背景透明 */
  border: none;
  /* 去除边框 */
  cursor: default;
  /* 鼠标指针恢复默认 */
  padding: 0;
  /* 去除内边距 */
}

.navicon {
  -webkit-app-region: no-drag;
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


/* 新增针对 v-layout 的样式 */
.layout {}
</style>