<template>
    <div>
        <LayoutPublicHeader label="Nạp tiền" />
        <UiContent title="Nạp tiền vào tài khoản" no-dot sub="Hệ thống nạp tiền vào tài khoản" class="mt-3 mr-auto" size="xl">
            <div class="mt-5 mx-auto">
                <UForm :state="state" :validate="validate" @submit="onSubmit" class="grid grid-cols-12 gap-4 mb-4">
                    <div class="2xl:col-span-6 col-span-12">
                        <div
                            class="relative overflow-visible rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-900">
                            <div class="px-4 py-5 sm:p-6 pb-2 sm:pb-2">
                                <UiText class="break-words font-bold mb-4">Chọn kênh nạp</UiText>
                                <div class="mb-4">
                                    <div class="grid grid-cols-12 gap-2 ">
                                        <div v-for="(item, index) in list" :key="index" @click="changeGate(item, index)"
                                            class="relative overflow-visible hover:scale-100 rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-800 col-span-6 md:col-span-4 transition-2 cursor-pointer scale-95">
                                            <div class="p-2 sm:p-2">
                                                <UiFlex justify="center" class="items-center gap-1">
                                                    <UiText
                                                        class="break-words text-xs md:text-base font-semibold text-center">
                                                        {{ item.name }}
                                                    </UiText>
                                                    <UIcon v-if="state.index === index" name="i-bxs:check-circle"
                                                        class="text-primary"></UIcon>
                                                </UiFlex>
                                            </div>
                                            <div class="px-4 py-5 sm:p-6 pt-2 border-none sm:pt-2">
                                                <UiImg class="mt-2" :src="item.image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-4" v-if="state.gate">
                                    <UFormGroup label="Nhập số tiền" name="money">
                                        <UInput size="lg" v-model="state.money" type="number" placeholder="Nhỏ nhất 20.000" />
                                    </UFormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="2xl:col-span-6 col-span-12">
                        <div
                            class="relative overflow-visible rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-900">
                            <div class="px-4 py-5 sm:p-6">
                                <p class="break-words font-bold mb-4">Thông tin thanh toán</p>
                                <div class="mb-4" v-if="state.gate">
                                    <UiFlex class="flex-col items-center gap-4">
                                        <UiFlex class=" items-center w-full" justify="between">
                                            <UiText
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Kênh
                                            </UiText>
                                            <UiText class="break-words text-sm font-semibold">{{ state.gate.name }}</UiText>
                                        </UiFlex>
                                        <UiFlex justify="between" class="items-center w-full">
                                            <UiText
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Tài khoản
                                            </UiText>
                                            <UiFlex @click="startCopy(state.gate.number)" class="items-center cursor-pointer">
                                                <UiText class="break-words text-sm font-semibold">
                                                    {{ state.gate.number }}
                                                </UiText>
                                                <span class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </UiFlex>
                                        </UiFlex>
                                        <UiFlex justify="between" class="items-center w-full">
                                            <UiText
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Người nhận
                                            </UiText>
                                            <UiFlex @click="startCopy(state.gate.person)" class="items-center cursor-pointer">
                                                <UiText class="break-words text-sm font-semibold">
                                                    {{ state.gate.person }}
                                                </UiText>
                                                <span
                                                    class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </UiFlex>
                                        </UiFlex>
                                        <UiFlex justify="between" class="items-center w-full">
                                            <UiText class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Số tiền
                                            </UiText>
                                            <UiFlex class="items-center cursor-pointer" @click="startCopy(state.money)">
                                                <UiText class="break-words text-sm font-semibold">{{ useMoney().toMoney(state.money) }} đ
                                                </UiText>
                                                <span class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </UiFlex>
                                        </UiFlex>
                                        <UiFlex justify="between" class="items-center w-full">
                                            <UiText class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Nội dung
                                            </UiText>
                                            <UiFlex @click="startCopy(state.code)" class="items-center cursor-pointer">
                                                <UiText class="break-words text-sm font-semibold">{{ state.code }}
                                                </UiText>
                                                <span class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </UiFlex>
                                        </UiFlex>
                                    </UiFlex>
                                    <UButton type="submit"
                                        class="focus:outline-none mt-5 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-semibold rounded-2xl text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 w-full flex justify-center items-center">
                                        Tạo Giao Dịch
                                    </UButton>
                                </div>
                                <Empty v-else color="red" size="sm" text="Chưa có dữ liệu thanh toán"></Empty>
                            </div>
                        </div>
                    </div>
                </UForm>
                <!-- table -->
                <TablePublicPayment/>
            </div>
        </UiContent>
    </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import Empty from '~/components/ui/Empty.vue';
const { copy, isSupported } = useClipboard()
const state = ref({
    index: null,
    money: 0,
    gate: undefined,
    code: 'PAY-'+ Math.floor(Math.random() * 100000)
});
const loading = ref(false);
const list = ref([]);
const startCopy = (text) => {
    if (!isSupported.value || !text) return
    copy(text)
    useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}
const validate = (state) => {
    const errors = [];
    if(!state.money) errors.push({ path: 'money', message: 'Vui lòng nhập số tiền' })
    else if(isNaN(+state.money)) errors.push({ path: 'money', message: 'Định dạng số tiền không hợp lệ' })
    else if(state.money < 20000) errors.push({ path: 'money', message: 'Số tiền phải lớn hơn hoặc bằng 20.000' })
    return errors
}
const changeGate = (gate, index) => {
    state.value.index = index
    state.value.gate = gate;
}
const onSubmit = async () => {
    try {
        loading.value = true;
        await useAPI("client/payment/create", JSON.stringify(state.value));
        loading.value = false;
        getList();
        state.value.code = 'PAY-'+ Math.floor(Math.random() * 100000);
    } catch (e) {
        loading.value = false;
    }
}
const getGate = async () => {
    try {
        loading.value = true;
        const data = await useAPI("client/gate/get");
        list.value = data;
        loading.value = false;
    } catch (e) {
        loading.value = false;
    }
};
getGate();
</script>
