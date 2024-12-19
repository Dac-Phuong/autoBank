<template>
    <UiContent title="Statistic" sub="Thống kê số liệu" size="2xl">
        <UTabs :items="items" @change="onChange" class="max-w-[500px] my-4" />
        <div class="grid grid-cols-1 gap-4 md:gap-2 md:grid-cols-4">
            <!-- Revenue -->
            <UiFlex
                class="sm:p-6 px-4 md:px-8 py-6 md:py-8 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow hover:border-primary"
                justify="between">
                <div class="px-4 py-2 item-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
                    <UIcon size="20" class="mt-2" name="solar:dollar-bold" />
                </div>
                <div class="ml-2">
                    <UiText size="base" color="gray" class="clamp-1 line-clamp-1">Doanh thu</UiText>
                    <UiText v-if="!loading" size="2xl" weight="semibold" color="primary">{{
                        useMoney().toMoney(list.total || 0) }}
                    </UiText>
                    <USkeleton v-else class="h-6 w-full" />
                </div>
            </UiFlex>
            <!-- Transactions -->
            <UiFlex
                class="sm:p-6 px-4 md:px-8 py-6 md:py-8 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow hover:border-primary"
                justify="between">
                <div class="px-4 py-2 item-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
                    <UIcon size="20" class="mt-2" name="i-bx:wallet" />
                </div>
                <div class="ml-2">
                    <UiText size="base" color="gray" class="clamp-1 line-clamp-1">Giao dịch</UiText>
                    <UiText v-if="!loading" size="2xl" weight="semibold" color="primary">{{ list.payment || 0 }}
                    </UiText>
                    <USkeleton v-else class="h-6 w-full" />
                </div>
            </UiFlex>
            <!-- Users -->
            <UiFlex
                class="sm:p-6 px-4 md:px-8 py-6 md:py-8 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow hover:border-primary"
                justify="between">
                <div class="px-4 py-2 item-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
                    <UIcon size="20" class="mt-2" name="material-symbols:supervisor-account" />
                </div>
                <div class="ml-2">
                    <UiText size="base" color="gray" class="clamp-1 line-clamp-1">Người dùng</UiText>
                    <UiText v-if="!loading" size="2xl" weight="semibold" color="primary">{{ list.user || 0 }}</UiText>
                    <USkeleton v-else class="h-6 w-full" />
                </div>
            </UiFlex>
            <!-- Services -->
            <UiFlex
                class="sm:p-6 px-4 md:px-8 py-6 md:py-8 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow hover:border-primary"
                justify="between">
                <div class="px-4 py-2 item-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
                    <UIcon size="20" class="mt-2" name="material-symbols:tv-displays-outline" />
                </div>
                <div class="ml-2">
                    <UiText size="base" color="gray" class="clamp-1 line-clamp-1">Dịch vụ</UiText>
                    <UiText v-if="!loading" size="2xl" weight="semibold" color="primary">{{ list.service || 0 }}
                    </UiText>
                    <USkeleton v-else class="h-6 w-full" />
                </div>
            </UiFlex>
        </div>
        <!-- Line Chart -->
        <div class="sm:p-3 p-1 border border-gray-200 rounded-lg mt-5 hover:shadow hover:border-primary">
            <canvas ref="lineChartCanvas" class="w-full h-[250px]"></canvas>
        </div>
    </UiContent>
</template>

<script lang="ts" setup>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
const list = ref<any>({});
const loading = ref(true);
const dataChart = ref<any>({ labels: [], data: [] });
const lineChartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

onMounted(() => {
    const ctx = lineChartCanvas.value?.getContext("2d");
    if (ctx) {
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: dataChart.value.labels,
                datasets: [
                    {
                        label: "Statistics",
                        data: dataChart.value.data,
                        borderColor: "#22C55E",
                        backgroundColor: "#22C55E",
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Thống kê",
                    },
                    tooltip: {
                        enabled: true,
                        mode: "index",
                        callbacks: {
                            label: function (context) {
                                return `Giá trị: ${context.raw}`;
                            },
                        },
                    },
                },
            },
        });
    }
});

onBeforeUnmount(() => {
    chartInstance?.destroy();
    chartInstance = null;
});

const updateChart = () => {
    if (chartInstance) {
        chartInstance.data.labels = dataChart.value.labels;
        chartInstance.data.datasets[0].data = dataChart.value.data;
        chartInstance.update();
    }
};

const items = ref([
    { label: "Hôm nay", value: "today" },
    { label: "Hôm qua", value: "yesterday" },
    { label: "Tháng này", value: "month" },
    { label: "Tháng trước", value: "lastMonth" },
]);

const getStatistic = async (type: string) => {
    try {
        loading.value = true;
        const data = await useAPI("admin/statistic/get", { type });
        dataChart.value = data.dataChart;
        list.value = data;
        updateChart();
    } catch (error) {
        console.error("Failed to fetch statistics:", error);
    } finally {
        loading.value = false;
    }
};

function onChange(index: number) {
    getStatistic(items.value[index].value);
}

getStatistic("today");
</script>
