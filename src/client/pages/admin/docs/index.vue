<template>
  <UiContent title="Docs" size="2xl" sub="Quản lý các tài liệu API">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto" />
      <UButton color="primary" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #category-data="{ row }">
          <UBadge variant="soft" color="red">{{ row.category.name }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display ? 'green' : 'red'" variant="soft">{{ row.display ? "Hiện" : "Ẩn" }}
          </UBadge>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
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
      <UForm :state="stateAdd" @submit="addAction" class="p-4">

        <UFormGroup label="Tên tài liệu">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectCategory v-model="stateAdd.category" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">

        <UFormGroup label="Tên tài liệu">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectCategory v-model="stateEdit.category" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.content" preventClose
      :ui="{ width: 'sm:max-w-[calc(90%)] md:max-w-[calc(80%)] lg:max-w-4xl' }">
      <UForm :state="stateContent" @submit="contentAction" class="p-4">

        <UiEditor v-model="stateContent.content"></UiEditor>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.content">Sửa</UButton>
          <UButton color="gray" @click="modal.content = false" :disabled="loading.content" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'name',
    label: 'Tên tài liệu',
  },
  {
    key: 'category',
    label: 'danh mục',
  },
  {
    key: 'display',
    label: 'Hiển thị',
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  }, {
    key: 'updatedAt',
    label: 'Cập nhật',
    sortable: true
  }, {
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'updatedAt',
    direction: 'desc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  name: null,
  category: null,
  display: true

})
const stateEdit = ref({
  _id: null,
  name: null,
  category: null,
  display: true
})
const stateContent = ref({
  _id: null,
  content: null
})
// Modal
const modal = ref({
  add: false,
  edit: false,
  content: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  category: null,
  display: true
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.category = row.category._id
      modal.value.edit = true
    }
  }],
  [{
    label: 'Sửa nội dung',
    icon: 'i-bx-spreadsheet',
    click: () => {
      Object.keys(stateContent.value).forEach(key => stateContent.value[key] = row[key])
      stateContent.value.content = row.content
      stateContent.value._id = row._id
      modal.value.content = true
    }
  }],

  [{
    label: 'Xóa tài liệu',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

// Fetch

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('admin/docs/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('admin/docs/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('admin/docs/del', { _id })
    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}
const contentAction = async () => {
  try {
    loading.value.content = true
    await useAPI('admin/docs/content', JSON.parse(JSON.stringify(stateContent.value)))
    loading.value.content = false
    modal.value.content = false
    getList()
  }
  catch (e) {
    loading.value.content = false
  }
}
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('admin/docs/list', JSON.parse(JSON.stringify(page.value)))
    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  }
}
getList()
</script>
