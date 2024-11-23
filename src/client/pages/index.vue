<template>
   <div class="min-h-screen">
        <LayoutPublicHeader label="Tổng quan" />
        <LayoutPublicBankList title="Thống kê tài khoản"/>
   </div>
</template>
<script setup>
definePageMeta({
    middleware: 'auth'
})
</script>