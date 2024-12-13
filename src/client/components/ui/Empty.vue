<template>
    <UiFlex type="col">
      <UiIcon size="16" color="primary" name="tabler:mood-empty"></UiIcon>
      <UiText size="sm" color="gray" class="text-center" :color="color" :size="size" :text="text" />
    </UiFlex>
</template>
<script setup>
const props = defineProps({
  text: String,
  size: String,
  color: String,
});
</script>
