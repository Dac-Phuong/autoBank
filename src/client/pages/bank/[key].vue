<template>
    <LayoutPublicHeader :label="`${(route.params.key as string).toUpperCase()}`" />
    <UiContent title="Danh sách tài khoản" no-dot>
        <UiFlex class="mb-4" justify="between">
            <UiFlex>
                <USelectMenu v-model="page.size" size="sm" :options="option" />
                <UForm :state="page" @submit="getList" class="mr-4">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"
                        class="ml-1" />
                </UForm>
            </UiFlex>
            <UButton color="primary" class="ml-2" @click="modal.add = true">Thêm mới</UButton>
        </UiFlex>
        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" class="relative ">
            <LoadingTable v-if="loading.load" />
            <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                <template #account-data="{ row }">
                    <UiText>{{ row.account }}</UiText>
                </template>

                <template #option-data="{ row }">
                    <UiText v-if="row.option" weight="semibold">{{ useMoney().toMoney(row.option.money) }} / {{
                        row.option.number }} Tháng </UiText>
                    <UiText v-else>...</UiText>
                </template>

                <template #status-data="{ row }">
                    <UBadge :color="statusFormat[row.status].color" variant="soft">
                        {{ statusFormat[row.status].label }}
                    </UBadge>
                </template>

                <template #start_date-data="{ row }">
                    {{ row.start_date ? useDayJs().displayFull(row.start_date) : '...' }}
                </template>

                <template #expired_date-data="{ row }">
                    {{ row.expired_date ? useDayJs().displayFull(row.expired_date) : '...' }}
                </template>

                <template #actions-data="{ row }">
                    <UDropdown v-if="row.status !== 0" :items="actions(row)">
                        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
                    </UDropdown>
                    <div v-else>
                        <UButton color="green" @click="getOption(row.bank[0], row._id)">Kích hoạt</UButton>
                    </div>
                </template>

            </UTable>
        </UCard>
        <!-- Pagination -->
        <UiFlex justify="between" class="py-4">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
        </UiFlex>

        <!-- Modal Add -->
        <UModal v-model="modal.add" preventClose>
            <UForm :validate="validateForm" :state="stateAdd" @submit="addAction"
                class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập" name="username">
                    <UInput size="lg" v-model="stateAdd.username" placeholder="Nhập tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập" name="password">
                    <UInput size="lg" v-model="stateAdd.password" type="password"
                        placeholder="Nhập mật khẩu ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Số tài khoản" name="account">
                    <UInput size="lg" v-model="stateAdd.account" placeholder="Nhập số tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="URL nhận dữ liệu" name="path">
                    <UInput size="lg" v-model="stateAdd.path" type="text" placeholder="Nhập url nhận dữ liệu" />
                </UFormGroup>

                <UFormGroup class="mb-3" name="policy">
                    <UCheckbox v-model="stateAdd.policy" class="cursor-pointer" name="notifications"
                        label="Bạn đồng ý với chính sách bảo mật của chúng tôi và cho phép chúng tôi truy xuất dữ liệu tài chính của bạn." />
                </UFormGroup>

                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.add">Thêm</UButton>
                    <UButton color="gray" @click="modal.add = false" :disabled="loading.add"
                        class="ml-1 border border-gray-200 dark:border-gray-700 rounded-xl">Đóng</UButton>
                </UiFlex>
            </UForm>
        </UModal>

        <!-- Modal Edit -->
        <UModal v-model="modal.edit" preventClose>
            <UForm :validate="validateForm" :state="stateEdit" @submit="editAction"
                class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập" name="username">
                    <UInput size="lg" v-model="stateEdit.username" placeholder="Nhập tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập" name="password">
                    <UInput size="lg" v-model="stateEdit.password" type="password"
                        placeholder="Nhập mật khẩu ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Số tài khoản" name="account">
                    <UInput size="lg" v-model="stateEdit.account" placeholder="Nhập số tài khoản" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="URL nhận dữ liệu" name="path">
                    <UInput size="lg" v-model="stateEdit.path" type="text" placeholder="Nhập url nhận dữ liệu" />
                </UFormGroup>

                <UFormGroup class="mb-3" name="policy">
                    <UCheckbox v-model="stateEdit.policy" class="cursor-pointer" name="notifications"
                        label="Bạn đồng ý với chính sách bảo mật của chúng tôi và cho phép chúng tôi truy xuất dữ liệu tài chính của bạn." />
                </UFormGroup>

                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.edit">Sửa</UButton>
                    <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit"
                        class="ml-1 border border-gray-200 dark:border-gray-700 rounded-xl">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>

        <!-- Modal BUY -->
        <UModal v-model="modal.buy" preventClose>
            <UCard>
                <template #header>
                    <UiFlex justify="between" class="">
                        <UiFlex color="gray"
                            class="h-[36px] border border-gray-200 dark:border-gray-700 rounded-xl flex items-center">
                            <UiFlex class="mr-1 h-full px-2 rounded-l-lg bg-primary">
                                <UiIcon name="solar:dollar-linear" class="text-white" />
                            </UiFlex>
                            <UiText class="text-sm mr-1 p-1 font-semibold">{{
                                useMoney().toMoney(authStore.profile?.currency.coin ||
                                    0) }} xu</UiText>
                        </UiFlex>
                        <UButton color="gray" @click="modal.buy = false" icon="i-heroicons-x-mark"
                            class="border border-gray-200 dark:border-gray-700 rounded-xl"></UButton>
                    </UiFlex>
                </template>
                <template #default>
                    <UForm :state="stateBuy">
                        <UiText class="pb-5" weight="semibold">Chọn gói kích hoạt</UiText>
                        <div v-if="options && options.options" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="(option, index) in options.options" :key="index"
                                @click="selectOption(option, index)"
                                class="relative flex flex-col items-center p-6 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out"
                                :class="[selectedOption === index ? 'border-primary-500 bg-primary-50' : 'border-gray-400 bg-gray-50']">
                                <UiFlex class="items-center justify-center">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                        :class="[selectedOption === index ? 'border-primary-500' : 'border-gray-500']">
                                        <UiText v-if="selectedOption === index"
                                            class="w-2.5 h-2.5 rounded-full bg-primary-600"></UiText>
                                    </div>
                                </UiFlex>
                                <UiText class="text-sm text-gray-800 font-semibold text-center mt-2">
                                    {{ option.number }} Tháng
                                </UiText>
                                <UiText class="text-sm text-gray-800 font-semibold text-center">
                                    {{ useMoney().toMoney(option.money) }} xu
                                </UiText>
                            </div>
                        </div>
                        <UiEmpty v-else text="Chưa có dữ liệu gói" />
                    </UForm>
                </template>
                <template #footer>
                    <UiFlex justify="end" class="mt-4 mb-2">
                        <UButton type="submit" :loading="loading.edit" @click="buyAction">Xác nhận</UButton>
                    </UiFlex>
                </template>
            </UCard>
        </UModal>
    </UiContent>
</template>

<script setup lang="ts">
const route = useRoute();
definePageMeta({
    middleware: 'auth'
})
useSeoMeta({
    title: () => `${(route.params.key as string).toUpperCase()} - ENI AutoMB`,
    ogTitle: () => `${(route.params.key as string).toUpperCase()} - ENI AutoMB`
})
const authStore: any = useAuthStore();
const news = ref(undefined);
const list = ref(undefined);
const option = ref<any>([5, 10, 20, 50, 100]);
const options = ref<any>([]);
const selectedOption = ref(undefined)

// State
const stateAdd = ref({
    key: route.params.key,
    password: undefined,
    account: undefined,
    username: undefined,
    path: undefined,
    policy: true
});

const stateEdit = ref({
    _id: null,
    key: route.params.key,
    password: undefined,
    account: undefined,
    username: undefined,
    path: undefined,
    policy: true
});
const stateBuy = ref({
    _id: null,
    key: route.params.key,
    option: null,
});

// Modal
const modal = ref({
    add: false,
    edit: false,
    buy: false,
});

// Loading
const loading = ref({
    load: true,
    add: false,
    edit: false,
    running: false,
});
const statusFormat: any = {
    0: { label: 'Chưa kích hoạt', color: 'orange' },
    1: { label: 'Chạy', color: 'green' },
    2: { label: 'Dừng', color: 'red' },
    3: { label: 'Hết hạn', color: 'red' },
    4: { label: 'Sắp hết hạn', color: 'yellow' },
}
// Columns
const columns = [
    {
        key: "username",
        label: "Tài khoản",
    },
    {
        key: "account",
        label: "Số tài khoản",
    },
    {
        key: "status",
        label: "Trạng thái",
    },
    {
        key: "option",
        label: "Gói kích hoạt",
    },
    {
        key: "start_date",
        label: "Ngày bắt đầu",
        sortable: true
    },
    {
        key: "expired_date",
        label: "Ngày hết hạn",
        sortable: true
    },
    {
        key: "actions",
        label: "Chức năng",
    },
];
const selectedColumns = ref([...columns]);

// Page
const page = ref<any>({
    key: route.params.key,
    size: 10,
    current: 1,
    sort: {
        column: "updatedAt",
        direction: "desc",
    },
    search: {
        key: undefined,
    },
    total: 0,
});

watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => modal.value.add, (val) => !val && ((stateAdd as any).value = {
    key: route.params.key,
    password: undefined,
    account: undefined,
    username: undefined,
    policy: true
}));

const getOption = (option: any, _id: any) => {
    options.value = option;
    modal.value.buy = true;
    stateBuy.value._id = _id
}
const selectOption = (option: any, index: any) => {
    selectedOption.value = index
    stateBuy.value.option = option
}
// validate
const validateForm = (state: any) => {
    const errors = [];
    if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập tài khoản đăng nhập ' })
    if (!!state.username?.match(/\s/g)) errors.push({ path: 'username', message: 'Phát hiện khoảng cách' })

    if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập mật khẩu' })
    else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
    else if (!!state.password?.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

    if (!state.account) errors.push({ path: 'account', message: 'Vui lòng nhập số tài khoản' })
    if (!!state.account?.match(/\s/g)) errors.push({ path: 'account', message: 'Phát hiện khoảng cách' })
    else if (isNaN(+state.account)) errors.push({ path: 'account', message: 'Định dạng không hợp lệ' })

    if (!state.path) errors.push({ path: 'path', message: 'Vui lòng nhập url nhận dữ liệu' })
    else if (!state.path.match(/^http/g)) errors.push({ path: 'path', message: 'Định dạng không hợp lệ' })

    if (!state.policy) errors.push({ path: 'policy', message: 'Vui lòng đồng ý với chính sách' })
    return errors;
}

// Actions
const actions = (row: any) => [
    [{
        label: 'Sửa thông tin',
        icon: 'i-bx-pencil',
        click: () => {
            Object.keys(stateEdit.value).forEach(key => (stateEdit as any).value[key] = row[key]);
            modal.value.edit = true
            stateEdit.value.key = route.params.key
            stateEdit.value.policy = true
        }
    }, {
        label: row.status == 1 ? 'Dừng auto' : 'Chạy auto',
        icon: row.status == 1 ? 'iconamoon:player-stop-bold' : 'iconamoon:player-start-bold',
        click: () => runAction(row._id)
    },
    ],
    row.status === 4 ? [{
        label: 'Gia hạn',
        icon: 'material-symbols:sync',
        click: () => getOption(row.bank[0], row._id)
    }] : []
]

// Fetch
const getList = async () => {
    try {
        loading.value.load = true;
        const data = await useAPI("client/bank/account/list", JSON.parse(JSON.stringify(page.value)));
        loading.value.load = false;
        list.value = data.list;
        news.value = data;
    } catch (e) {
        loading.value.load = false;
    }
};

const addAction = async () => {
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/add", JSON.parse(JSON.stringify(stateAdd.value)));
        loading.value.add = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
};
const editAction = async () => {
    try {
        loading.value.edit = true;
        await useAPI("client/bank/account/edit", JSON.parse(JSON.stringify(stateEdit.value)));
        loading.value.edit = false;
        modal.value.edit = false;
        getList();
    } catch (e) {
        loading.value.edit = false;
    }
};
const runAction = async (_id: object) => {
    try {
        loading.value.load = true;
        await useAPI("client/bank/account/run", { _id });
        loading.value.load = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.load = false;
    }
}
const buyAction = async () => {
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/buy", JSON.parse(JSON.stringify(stateBuy.value)));
        loading.value.add = false;
        modal.value.buy = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
}
getList()
</script>
