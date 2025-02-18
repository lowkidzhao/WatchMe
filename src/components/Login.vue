<script setup>

async function fetchTencentCloudData() {
  const params = {}
  const result = await window.electronAPI.callTencentCloudAPI(params);
  console.log('腾讯云 API 调用结果:', result);
}
</script>
<template>
  <br>
  <v-btn @click="fetchTencentCloudData()">登录 </v-btn>
</template>
