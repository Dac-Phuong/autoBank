<template>
    <div>
        <LayoutPublicHeader label="Tài liệu API" />
        <UiContent title="Tài liệu API" sub="Danh sách các tài liệu API của các ngân hàng" class="mt-3" size="xl"
            no-dot>
            <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2">
                <UCard class="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 h-fit ">
                    <template #header>
                        <UiText tag="h3" class="font-bold">Danh mục tài liệu API</UiText>
                    </template>
                    <template #default>
                        <div v-if="list && list.length > 0">
                            <div v-for="(item, index) in list" :key="item._id" @click="getDocs(item, index)"
                                class="mb-2 last:mb-0">
                                <UiFlex justify="between"
                                    class="items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
                                    :class="[state.index === index ? 'bg-primary-500 dark:bg-primary-400 text-white dark:text-gray-400' : 'text-gray-600 dark:text-gray-400']">
                                    <UiText class="font-semibold">{{ item.name }}</UiText>
                                </UiFlex>
                            </div>
                        </div>
                        <UiEmpty class="mt-5" v-else text="Hiện tại chưa có dữ liệu" />
                    </template>
                </UCard>
                <UCard class="xl:col-span-9 lg:col-span-8 md:col-span-6 col-span-12">
                    <template #header>
                        <UiText tag="h3" class="font-bold">Danh sách tài liệu API</UiText>
                    </template>
                    <template #default>
                        <div v-if="state.docs && state.docs.length > 0">
                            <div v-for="(item, index) in state.docs" :key="index" class="accordion-item mb-2">
                                <UiFlex @click="toggle(index)" justify="between"
                                    class="items-center px-4 py-2 text-lg font-semibold cursor-pointer bg-primary hover:bg-green-600 rounded-lg transition">
                                    <UiText class="font-semibold text-white" size="base">{{ item.name }}</UiText>
                                    <UiIcon name="ic:baseline-keyboard-arrow-up" class="text-white"
                                        :class="{ 'rotate-180': activeIndex === index }">
                                    </UiIcon>
                                </UiFlex>
                                <div v-if="activeIndex === index" class="px-4 py-1 mt-2 rounded-lg bg-white border border-gray-200">
                                    <UiText v-if="item.content" v-html="item.content"></UiText>
                                    <UiText v-else text="Hiện tại chưa có dữ liệu" size="sm" class="text-center" />
                                </div>
                            </div>
                        </div>
                        <UiEmpty class="mt-5" v-else text="Hiện tại chưa có dữ liệu" />
                    </template>
                </UCard>
            </div>
        </UiContent>
    </div>
</template>
<script setup>

const list = ref([]);
const loading = ref(true);
const activeIndex = ref(null);
const state = ref({
    index: 0,
    docs: undefined
})
const toggle = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
const getDocs = (item, index) => {
    state.value.index = index;
    state.value.docs = item.docs;
}
const getList = async () => {
    try {
        loading.value = true;
        const data = await useAPI("client/docs/category/get");
        state.value.docs = data[0].docs || [];
        list.value = data;
        loading.value = false;
    } catch (error) {
        loading.value = false;
    }
}
getList();
</script>
<style lang="scss">
.accordion-transition {
    transition: max-height 0.3s ease, opacity 0.3s ease;
}
</style>