<script setup>
import { reactive } from 'vue'

const params = reactive({
  tencentcloud: {
    credential: {
      secretId: "AKID63naHl280kSH2d3TsAICvSq1ylMkFXbR",
      secretKey: "g8NOBl7FArLbdU6YpulPyKWhnjSBrOkw",
    },
    region: "ap-guangzhou",
    profile: {
      httpProfile: {
        endpoint: "lighthouse.tencentcloudapi.com",
      },
    },
  },
})


async function fetchTencentCloudClientUse() {
  try {
    const result = await window.electronAPI.callTencentCloudAPI("clientUse");
    console.log('腾讯云 API 调用结果:', result);
  } catch (error) {
    console.error(error);
  }
}
async function fetchTencentCloudConfig() {
  try {
    const result = await window.electronAPI.callTencentCloudAPI("getConfig");
    console.log('获取配置信息:', result);
  } catch (error) {
    console.error(error);
  }
}
async function fetchTencentCloudUpdataConfig() {
  try {
    // 过滤不可克隆的属性
    const sanitizedParams = JSON.parse(JSON.stringify(params));
    const result = await window.electronAPI.callTencentCloudAPI("updataConfig", sanitizedParams);
    console.log('更新配置:', result);
  } catch (error) {
    console.error(error);
  }
}
</script>
<template>
  <v-btn @click="fetchTencentCloudUpdataConfig()">更新配置 </v-btn>
  <br>
  <v-btn @click="fetchTencentCloudConfig()">获取配置信息 </v-btn>
  <br>
  <v-btn @click="fetchTencentCloudClientUse()">获取服务器信息 </v-btn>
  <br>
</template>
