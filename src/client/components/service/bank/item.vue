<template>
    <UCard v-if="item" class="ItemBank relative mb-4">
        <div class="relative z-10" @click="open(item.key, item.status)">
            <UiFlex justify="between">
                <UiImg :src="item.image" w="1" h="1" class="w-12 h-12" />
                <UBadge :color="item.status == 0 ? 'green' : 'red'" variant="soft">{{ item.status == 0 ? 'Đã mở' : 'Chưa mở' }}</UBadge>
            </UiFlex>
            <UiText class="text-3xl font-bold leading-8 mt-6 text-gray">{{ item.count }}</UiText>
            <UiText class="text-base text-gray-600 mt-1 font-semibold">{{ item.name }}</UiText>
        </div>
    </UCard>
</template>

<script setup>
const props = defineProps(['item'])

const open = async (key, status) => {
    if(status !== 0) return useNotify().error('Ngân hàng đang tạm đóng')
    await navigateTo(`/bank/${key}`)
}
</script>

<style lang="sass">
  .ItemBank
    transition: all 0.25s ease
    position: relative
    &:hover
        scale: 1.05
        cursor: pointer
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
    
</style>
