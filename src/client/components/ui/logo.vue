<template>
  <UiFlex class="select-none" items="end">
    <UiText weight="bold" size="2xl" :color="color" class="text-white italic">ENI AutoMB</UiText>
  </UiFlex>
</template>

<script setup>
defineProps({
  color: String,
})
</script>