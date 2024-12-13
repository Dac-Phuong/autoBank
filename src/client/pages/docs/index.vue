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
                                    class="items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
                            <UAccordion
                                :items="state.docs.map((item) => ({ label: item.name, value: item,content: item.content  }))">
                            </UAccordion>
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
const state = ref({
    index: 0,
    docs: undefined
})
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