<template>
    <div>
        <USkeleton class="w-full h-80" v-if="loading" />
        <div v-else>
            <DataEmpty icon="i-bx-credit-card" text="Không có thông tin" v-if="!gate" />
            <UCard v-else>
                <UiFlex justify="between" class="mb-6">
                    <UiText size="sm" color="gray" weight="semibold">Kênh</UiText>
                    <UiText size="sm" weight="semibold">{{ gate?.name || '...' }}</UiText>
                </UiFlex>

                <UiFlex justify="between" class="mb-6">
                    <UiText size="sm" color="gray" weight="semibold" mini>Người hưởng thụ</UiText>
                    <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ gate?.person || '...' }}
                    </UiText>
                </UiFlex>

                <UiFlex justify="between" class="mb-6">
                    <UiText size="sm" color="gray" weight="semibold" mini>Số tài khoản</UiText>

                    <UiFlex @click="startCopy(gate?.number)">
                        <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ gate?.number }}
                        </UiText>
                        <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                    </UiFlex>
                </UiFlex>

                <UiFlex justify="between" class="mb-6">
                    <UiText size="sm" color="gray" weight="semibold" mini>Số tiền</UiText>

                    <UiFlex @click="startCopy(props.state.money)">
                        <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ props.state.money ?  toMoney(props.state.money) : 0 }}</UiText>
                        <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                    </UiFlex>
                </UiFlex>

                <UiFlex justify="between">
                    <UiText size="sm" color="gray" weight="semibold" mini>Nội dung</UiText>
                    <UiFlex @click="startCopy(props.state.code)">
                        <UiText size="sm" weight="semibold" align="right" class="ml-4" pointer>{{ props.state.code || '...' }}
                        </UiText>
                        <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                    </UiFlex>
                </UiFlex>

                <UiFlex justify="center" class="mt-12" v-if="gate.qrcode">
                    <UiImg :src="gate.qrcode" class="w-[250px] md:max-w-[300px]" />
                </UiFlex>
            </UCard>
        </div>
    </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'

const { copy, isSupported } = useClipboard()
const { toMoney } = useMoney()
const props = defineProps(['state'])
const loading = ref(true)
const gate = ref(undefined)

const startCopy = (text) => {
    if (!isSupported.value || !text) return
    copy(text)
    useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

const fetch = async () => {
    try {
        const data = await useAPI('admin/gate/get', {_id: props.state._id })
        loading.value = false
        gate.value = data
    }
    catch (e) {
        loading.value = false
    }
}

fetch()
</script>