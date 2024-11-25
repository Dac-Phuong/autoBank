<template>
    <div>
        <LayoutPublicHeader label="Nạp tiền vào tài khoản" />
        <UiText text="Chuyển khoản qua Ngân Hàng" weight="medium" color="secondary" class="mt-10 text-center mr-auto"
            size="2xl" />
        <UiText
            text="Thực hiện chuyển khoản ngân hàng vào số tài khoản bên dưới. Vui lòng nhập đúng nội dung chuyển khoản và chờ ở trang này cho đến khi hệ thống báo thành công."
            color="secondary" class="text-center mt-2" size="sm" />
        <div class="mt-5">
            <UCard :ui="{ body: { padding: 'p-0 sm:p-0 relative' } }">
                <div class="w-full">
                
                </div>
            </UCard>
        </div>
    </div>
</template>