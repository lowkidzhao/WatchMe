<script setup>
import { ref } from 'vue'
import { fetchTencentCloudClientUse } from '@/utils/Tencentcloud-Api';
import { useSnackdataStore } from '@/stores/snackdata';
import { useDataStore } from '@/stores/data';

const snackdataStore = useSnackdataStore();
const dataStore = useDataStore();


async function getdata() {
  const message = await fetchTencentCloudClientUse()
  if (message.status != "获取成功") {
    snackdataStore.error(message)
  } else {
    dataStore.server = message.result
    snackdataStore.success(message.status)
  }
}
</script>
<template>
  服务器
  <v-btn @click="getdata">登录 </v-btn>

  <div>{{ dataStore.server }}</div>
</template>