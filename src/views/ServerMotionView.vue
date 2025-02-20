<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();

// 根据 uuid 获取对应的计算机信息
const uuid = ref(route.params.uuid);

</script>
<template>
  服务器图形化{{ uuid }}
</template>