<script setup>
import { ref } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useSnackdataStore } from '@/stores/snackdata';
import { onMounted, watch } from 'vue'

const store = useComputersStore();
const store2 = useSnackdataStore();

const response = ref(false);
const showaitem = ref(false);
const computersNow = ref("");

// 调用electronAPI获取系统信息
async function callMainProcessMethod() {
  try {
    showaitem.value = true;
    const result = await window.electronAPI.callMainMethod("getSystemInfo");
    response.value = result;
    store.add(result)
    computersNow.value = store.computers[0]
    //反馈
    showaitem.value = false;
    store2.snackbar = true;
    store2.text = '获取成功';
    store2.color1 = 'success'
  } catch (error) {
    showaitem.value = false;
    console.error('Error calling main process method:', error);
    store2.snackbar = true;
    store2.text = '获取失败';
    store2.color1 = 'orange-darken-2'
  }
}


// 提取重复逻辑到一个函数中
const updateComputersNow = (computers) => {
  if (computers.length === 0) {
    computersNow.value = "无本机信息";
  } else {
    computersNow.value = computers[0];
  }
};

onMounted(() => {
  console.log("主页面挂载成功");
  updateComputersNow(store.computers);
});

// 监听 store.computers 的变化
watch(() => store.computers, (newComputers) => {
  updateComputersNow(newComputers);
});
</script>

<template>
  <main>
    <v-btn @click="callMainProcessMethod()">
      获取
    </v-btn>
    <br>
    <br>
    <v-skeleton-loader v-if="showaitem" color="info" type="paragraph"></v-skeleton-loader>
    <span v-if="!showaitem">
      {{ computersNow }}
    </span>
  </main>
</template>
