<template>
    <LayoutPublicHeader :label="`${(route.params.key as string).toUpperCase()}`" />
    <UiContent title="Danh sách tài khoản"  no-dot>
        <UiFlex class="mb-4" justify="between">
            <UiFlex>
                <USelectMenu v-model="page.size" :options="option" />
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

                <template #status-data="{ row }">
                    <UBadge :color="row.status == 0 ? 'red' : 'green'" variant="soft">{{ row.status == 0 ? "Dừng" :
                        "Chạy" }}
                    </UBadge>
                </template>
                <template #createdAt-data="{ row }">
                    {{ useDayJs().displayFull(row.createdAt) }}
                </template>
                <template #time-data="{ row }">
                    {{ useDayJs().displayFull(row.time) }}
                </template>

                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del" />
                    </UDropdown>
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
            <UForm :validate="validateForm" :state="stateAdd" @submit="addAction" class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                <UFormGroup class="mb-3" label="Số tài khoản" name="number">
                    <UInput size="lg" v-model="stateAdd.number" placeholder="Nhập số tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập" name="account">
                    <UInput size="lg" v-model="stateAdd.account" placeholder="Nhập tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập" name="password">
                    <UInput size="lg" v-model="stateAdd.password" type="password"
                        placeholder="Nhập mật khẩu ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" name="policy">
                    <UCheckbox v-model="stateAdd.policy" class="cursor-pointer" name="notifications"
                        label="Bạn đồng ý với chính sách bảo mật của chúng tôi và cho phép chúng tôi truy xuất dữ liệu tài chính của bạn." />
                </UFormGroup>
                
                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.add">Thêm</UButton>
                    <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1 border border-gray-200 dark:border-gray-700 rounded-xl">Đóng</UButton>
                </UiFlex>
            </UForm>
        </UModal>

        <!-- Modal Edit -->
        <UModal v-model="modal.edit" preventClose>
            <UForm :validate="validateForm" :state="stateEdit" @submit="editAction" class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                <UFormGroup class="mb-3" label="Số tài khoản" name="number">
                    <UInput size="lg" v-model="stateEdit.number" placeholder="Nhập số tài khoản" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập" name="account">
                    <UInput size="lg" v-model="stateEdit.account" placeholder="Nhập tài khoản ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập" name="password">
                    <UInput size="lg" v-model="stateEdit.password" type="password"
                        placeholder="Nhập mật khẩu ngân hàng" />
                </UFormGroup>

                <UFormGroup class="mb-3" name="policy">
                    <UCheckbox v-model="stateEdit.policy" class="cursor-pointer" name="notifications"
                        label="Bạn đồng ý với chính sách bảo mật của chúng tôi và cho phép chúng tôi truy xuất dữ liệu tài chính của bạn." />
                </UFormGroup>

                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.edit">Sửa</UButton>
                    <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1 border border-gray-200 dark:border-gray-700 rounded-xl">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>
    </UiContent>
</template>

<script setup lang="ts">
const route = useRoute();
const news = ref(undefined);
const list = ref(undefined);
const option = ref<any>([5, 10, 20, 50, 100]);
// Columns
const columns = [
    {
        key: "account",
        label: "Tài khoản",
        sortable: true

    },
    {
        key: "number",
        label: "Số tài khoản",
        sortable: true
    },
    {
        key: "status",
        label: "Trạng thái",
        sortable: true

    },
    {
        key: "createdAt",
        label: "Thời gian thêm",
        sortable: true
    },
    {
        key: "time",
        label: "Lần chạy gần nhất",
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

// State
const stateAdd = ref({
    key: route.params.key,
    password: undefined,
    account: undefined,
    number: undefined,
    policy: true
});

const stateEdit = ref({
    _id: null,
    key: route.params.key,
    password: undefined,
    account: undefined,
    number: undefined,
    policy: true
});

// Modal
const modal = ref({
    add: false,
    edit: false,
});

watch(() => modal.value.add, (val) => !val && ((stateAdd as any).value = {
    password: undefined,
    account: undefined,
    number: undefined,
})
);

// Loading
const loading = ref({
    load: true,
    add: false,
    edit: false,
    del: false,
});
// validate
const validateForm = (state: any) => {
    const errors = [];
    if (!state.number) errors.push({ path: 'number', message: 'Vui lòng nhập số tài khoản' })
    else if (isNaN(+state.number)) errors.push({ path: 'number', message: 'Định dạng không hợp lệ' })

    if (!state.account) errors.push({ path: 'account', message: 'Vui lòng nhập tài khoản đăng nhập' })
    if (!!state.account?.match(/\s/g)) errors.push({ path: 'account', message: 'Phát hiện khoảng cách' })

    if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập mật khẩu' })
    else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
    else if (!!state.password?.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })
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
            stateEdit.value.policy = true
            stateEdit.value.key = route.params.key
        }
    }, {
        label: row.status == 0 ? 'Chạy auto' : 'Dừng auto',
        icon: row.status == 0 ? 'iconamoon:player-start-bold' : 'iconamoon:player-stop-bold',
        click: () => runAction(row._id)
    }]
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
        console.log(stateEdit.value);

        loading.value.edit = false;
        modal.value.edit = false;
        getList();
    } catch (e) {
        loading.value.edit = false;
    }
};
const runAction = async (_id: object) => {
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/run", { _id });
        loading.value.add = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
}
getList()
</script>
