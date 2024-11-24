<template>
  <USelectMenu
    v-model="selectedGateId"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="name"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ selectedGate ? selectedGate.name : "Chọn kênh nạp" }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "update:gate"]);

const loading = ref(true);
const options = ref(props.options);
const selectedGateId = ref(props.modelValue);

const selectedGate = computed(() => options.value.find((i) => i._id === selectedGateId.value));

watch(selectedGateId, (value) => {
  emit("update:modelValue", value);
  emit("update:gate", options.value.find((i) => i._id === value));
});

const getGate = async () => {
  try {
    loading.value = true;
    const list = await useAPI("client/gate/select");
    options.value = list;
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

getGate();
</script>

