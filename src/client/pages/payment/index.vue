<template>
    <div>
        <LayoutPublicHeader label="Nạp tiền" />
        <UiContent title="Nạp tiền vào tài khoản" no-dot sub="Nạp tiền vào tài khoản" class="mt-3 mr-auto" size="xl">
            <div class="mt-5 mx-auto">
                <form class="grid grid-cols-12 gap-4 mb-4">
                    <div class="2xl:col-span-6 col-span-12">
                        <div
                            class="relative overflow-visible rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-900">
                            <div class="px-4 py-5 sm:p-6 pb-2 sm:pb-2">
                                <p class="break-words font-bold mb-4"> Chọn kênh nạp</p>
                                <div class="mb-4">
                                    <div class=""></div>
                                    <div class="">
                                        <div class="grid grid-cols-12 gap-2">
                                            <div
                                                class="relative overflow-visible hover:scale-95 rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-800 col-span-4 transition-2 cursor-pointer scale-95">
                                                <div class="p-2 sm:p-2">
                                                    <div class="flex justify-center items-center gap-1">
                                                        <p class="break-words text-sm font-semibold text-center"> Momo
                                                        </p>
                                                        <span
                                                            class="iconify i-bxs:check-circle text-green-500 dark:text-green-400"
                                                            aria-hidden="true"></span>
                                                    </div>
                                                </div>
                                                <div class="px-4 py-5 sm:p-6 pt-2 sm:pt-2">
                                                    <div class="relative select-none UiImg rounded-full"
                                                        style="aspect-ratio: 1 / 1;"><img alt="image" loading="lazy"
                                                            data-nuxt-img=""
                                                            class="object-cover w-full h-full select-none"
                                                            src="https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/momo.png"
                                                            srcset="https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/momo.png 1x, https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/momo.png 2x">
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="relative overflow-visible hover:scale-95 rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-800 col-span-4 transition-2 cursor-pointer">
                                                <div class="p-2 sm:p-2">
                                                    <div class="flex justify-center items-center gap-1">
                                                        <p class="break-words text-sm font-semibold text-center"> MB
                                                            BANK
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="px-4 py-5 sm:p-6 pt-2 sm:pt-2">
                                                    <div class="relative select-none UiImg rounded-full"
                                                        style="aspect-ratio: 1 / 1;"><img alt="image" loading="lazy"
                                                            data-nuxt-img=""
                                                            class="object-cover w-full h-full select-none"
                                                            src="https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/bank.png"
                                                            srcset="https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/bank.png 1x, https://choivuivui.com/_ipx/f_webp&q_100&fit_cover/https://choivuivui.com/images/gate/bank.png 2x">
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="mb-4">
                                        <div class="">
                                            <div class="flex content-center items-center justify-between text-sm"><label
                                                    for="v-1-24"
                                                    class="block font-medium text-gray-700 dark:text-gray-200">Nhập số
                                                    tiền
                                                </label></div>
                                        </div>
                                        <div class="relative mt-2">
                                            <div class="relative"><input id="v-1-24" name="money" type="number"
                                                    placeholder="Nhỏ nhất 20.000"
                                                    class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 text-sm px-3.5 py-2.5 shadow-sm bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-red-500 dark:ring-red-400 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400">
                                            </div>
                                            <p class="mt-2 text-red-500 dark:text-red-400 text-sm">Vui lòng nhập đầy đủ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="2xl:col-span-6 col-span-12">
                        <div
                            class="relative overflow-visible rounded-2xl divide-y dark:divide-gray-800 divide-gray-100 ring-1 dark:ring-gray-800 ring-gray-100 shadow bg-white dark:bg-gray-900">
                            <div class="px-4 py-5 sm:p-6">
                                <p class="break-words font-bold mb-4"> Thông tin thanh toán</p>
                                <div class="mb-4">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="flex justify-between items-center w-full">
                                            <p
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Kênh</p>
                                            <p class="break-words text-sm font-semibold"> Momo</p>
                                        </div>
                                        <div class="flex justify-between items-center w-full">
                                            <p
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Tài khoản</p>
                                            <div class="flex items-center cursor-pointer">
                                                <p class="break-words text-sm font-semibold"> 0398702724</p><span
                                                    class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center w-full">
                                            <p
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Người nhận</p>
                                            <div class="flex items-center cursor-pointer">
                                                <p class="break-words text-sm font-semibold"> Đồng Huyền Linh</p><span
                                                    class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center w-full">
                                            <p
                                                class="break-words text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                                Số tiền</p>
                                            <div class="flex items-center cursor-pointer">
                                                <p class="break-words text-sm font-semibold"> 0đ</p><span
                                                    class="iconify i-bx:copy-alt text-primary-500 dark:text-primary-400 cursor-pointer ml-2"
                                                    aria-hidden="true"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button type="submit"
                                        class="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-semibold rounded-2xl text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 w-full flex justify-center items-center">Tạo
                                        Giao Dịch</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </UiContent>
    </div>
</template>

<script setup>
const state = ref({
    gate: undefined,
    amount: undefined,
});
const loading = ref(false)
const list = ref([])
const getList = async () => {
    try {
        loading.value = true
        const data = await useAPI('client/gate/get')
        list.value = data.list
        loading.value = false
    } catch (e) {
        loading.value = false
    }
}
getList()
</script>
