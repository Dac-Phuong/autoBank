<template>
    <div>
        <LayoutPublicHeader label="Nạp tiền vào tài khoản" />
        <UiText text="Chuyển khoản qua Ngân Hàng" weight="medium" color="secondary" class="mt-10 text-center mr-auto"
            size="2xl" />
        <UiText
            text="Thực hiện chuyển khoản ngân hàng vào số tài khoản bên dưới. Vui lòng nhập đúng nội dung chuyển khoản và chờ ở trang này cho đến khi hệ thống báo thành công."
            color="secondary" class="text-center mt-2" size="sm" />
        <div class="mt-5 w-2/4 mx-auto">
            <UCard :ui="{ body: { padding: 'p-4 sm:p-2 relative' } }">
                <UForm class="w-full p-2">
                    <UFormGroup label="Kênh nạp" name="gate">
                        <SelectGate v-model="state.gate" class="mb-3" />
                    </UFormGroup>
                    <UFormGroup label="Số tiền" name="amount">
                        <UInput type="text" size="lg" class="bg-white" v-model="state.amount"
                            placeholder="Nhập số tiền" />
                    </UFormGroup>
                </UForm>
            </UCard>
        </div>
    </div>
</template>

<script setup>
const state = ref({
    gate: undefined,
    amount: undefined,
});

</script>
