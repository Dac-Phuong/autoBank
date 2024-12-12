<template>
    <UiContent title="Logs" sub="Nhật ký hoạt động">
      <UiFlex class="mb-4">
        <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-auto" />
        <UForm :state="page" @submit="getList" class="mr-1">
          <UiFlex>
            <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" />
          </UiFlex>
        </UForm>
      </UiFlex>
  
      <!-- Table -->
      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
        <LoadingTable v-if="loading.load" />
  
        <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
          <template #createdAt-data="{ row }">
            {{ useDayJs().displayFull(row.createdAt) }}
          </template>
          <template #user.username-data="{ row }">
            <UBadge variant="soft" color="primary" >
              {{ row.user.username }}
            </UBadge>
          </template>
          <template #action-data="{ row }">
            <span v-html="row.action"></span>
          </template>
        </UTable>
      </UCard>
  
      <!-- Pagination -->
      <UiFlex justify="between" class="py-4">
        <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
      </UiFlex>
  
    </UiContent>
  </template>
  
  <script setup>
  // List
  const list = ref([]);
  // Columns
  const columns = [
    {
      key: "user.username",
      label: "Tài khoản",
    },
    {
      key: "action",
      label: "Hành động",
    },
    {
      key: "createdAt",
      label: "Bắt đầu",
      sortable: true
    },
  ];
  const selectedColumns = ref([...columns]);
  
  // Page
  const page = ref({
    size: 10,
    current: 1,
    sort: {
      column: "updatedAt",
      direction: "desc",
    },
    search: {
      key: null,
      by: 'USER'
    },
    total: 0,
  });
  
  // Loading
  const loading = ref({
    load: true,
    edit: false,
  });
  
  watch(() => page.value.size, () => getList());
  watch(() => page.value.current, () => getList());
  watch(() => page.value.sort.column, () => getList());
  watch(() => page.value.sort.direction, () => getList());
  watch(() => page.value.search.key, (val) => !val && getList())
  
  // Fetch
  const getList = async () => {
    try {
      loading.value.load = true;
      const data = await useAPI("admin/log/list", JSON.parse(JSON.stringify(page.value)));
      loading.value.load = false;
      list.value = data.list;
      page.value.total = data.total;
    } catch (e) {
      loading.value.load = false;
    }
  };
  getList();
  </script>
  