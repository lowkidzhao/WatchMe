<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { useRouter } from 'vue-router';
import { useComputersStore } from '@/stores/mycomputers';
import { useControllersStore } from '@/stores/controllers';
import { useSnackdataStore } from '@/stores/snackdata';
import { RouterLink } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { fetchTencentCloudClientUse } from '@/utils/Tencentcloud-Api';

const dataStore = useDataStore();


async function getdata() {
  const message = await fetchTencentCloudClientUse()
  if (message.status != "获取成功") {
    store3.error(message)
  } else {
    dataStore.server = message.result
    store3.success(message.status)
  }
}

const store = useControllersStore();
const store2 = useComputersStore();
const store3 = useSnackdataStore();
const isSpeedDialOpen = ref(false); // 控制 v-speed-dial 的展开状态

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

// 点击按钮时阻止 v-speed-dial 收回
const handleButtonClick = async () => {
  event.preventDefault(); // 阻止事件默认行为
  event.stopPropagation(); // 阻止事件冒泡
  isSpeedDialOpen.value = true;
  console.log('isSpeedDialOpen:', isSpeedDialOpen.value); // 添加调试信息
  await callMainProcessMethod();
};

const router = useRouter();
const generateScreenshot = async () => {
  try {
    // 检查是否有可用的 uuid
    if (store2.computerNow && store2.computerNow.system && store2.computerNow.system.systemInfo) {
      const uuid = store2.computerNow.system.systemInfo.uuid;
      // 使用正确的路由名称和传递 uuid 参数
      await router.push({ name: 'info', params: { uuid } });

      // 等待页面渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取 InfoView.vue 页面的 DOM 元素
      const infoViewElement = document.querySelector('.main-container');
      if (infoViewElement) {
        // 使用 html2canvas 生成截图
        const canvas = await html2canvas(infoViewElement);
        const dataURL = canvas.toDataURL('image/png');

        // 创建一个下载链接
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'info_view_screenshot.png';

        // 触发下载
        link.click();

        // 显示成功提示
        const store3 = useSnackdataStore();
        store3.snackbar = true;
        store3.text = '截图已生成，请选择保存路径';
        store3.color1 = 'success';
      } else {
        console.error('未找到 InfoView 元素');
        // 显示失败提示
        const store3 = useSnackdataStore();
        store3.snackbar = true;
        store3.text = '未找到 InfoView 元素，无法生成截图';
        store3.color1 = 'error';
      }
    } else {
      console.error('未获取到有效的 uuid');
      // 显示失败提示
      const store3 = useSnackdataStore();
      store3.snackbar = true;
      store3.text = '未获取到有效的 uuid，无法生成截图';
      store3.color1 = 'error';
    }
  } catch (error) {
    console.error('生成截图时出错:', error);
    // 显示失败提示
    const store3 = useSnackdataStore();
    store3.snackbar = true;
    store3.text = '生成截图时出错，请稍后重试';
    store3.color1 = 'error';
  }
};
</script>

<template>
  <div v-if="!store.workview">
    <v-speed-dial location="top center" transition="slide-y-reverse-transition" v-model="isSpeedDialOpen">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" size="large" icon="mdi-bank-outline"></v-fab>
      </template>
      <!-- 显示监控端信息 -->
      <RouterLink
        v-if="store2.computerNow && store2.computerNow.system && store2.computerNow.system.systemInfo && store2.computerNow.system.systemInfo.uuid"
        key="1" :to="`/info/${store2.computerNow.system.systemInfo.uuid}`">
        <v-btn icon="$info"></v-btn>
      </RouterLink>
      <!-- 图形化显示 -->
      <RouterLink
        v-if="store2.computerNow && store2.computerNow.system && store2.computerNow.system.systemInfo && store2.computerNow.system.systemInfo.uuid"
        key="2" :to="`/motion/${store2.computerNow.system.systemInfo.uuid}`">
        <v-btn icon="mdi-chart-bar"></v-btn>
      </RouterLink>
      <!-- 分享（生成截图） -->
      <v-btn key="3" icon="mdi-link-box-variant" @click="generateScreenshot"></v-btn>
      <!-- 重新加载 -->
      <v-btn key="4" icon="mdi-refresh" @click="handleButtonClick" :loading="store2.showWaiting"></v-btn>
    </v-speed-dial>
  </div>
  <div v-else>
    <v-speed-dial location="top center" transition="slide-y-reverse-transition" v-model="isSpeedDialOpen">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" size="large" icon="mdi-weather-cloudy"></v-fab>
      </template>
      <!-- 显示监控端信息 -->
      <RouterLink key="1" to="/server">
        <v-btn icon="$info"></v-btn>
      </RouterLink>
      <!-- 重新加载 -->
      <v-btn key="3" icon="mdi-refresh" @click="getdata"></v-btn>
    </v-speed-dial>
  </div>
</template>

<style scoped>
.v-speed-dial {
  margin-top: 0px;
  margin-right: 5px;
}
</style>
