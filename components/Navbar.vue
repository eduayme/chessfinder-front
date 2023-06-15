<template>
    <UContainer class="flex flex-col md:flex-row gap-2 justify-between items-start mx-0 w-full">
        <h1 class="text-xl">{{ $t('title') }}</h1>
        <div class="flex gap-2">
            <USelect v-model="$i18n.locale" :options="[
                {
                    name: $t('english'),
                    value: 'en'
                }, {
                    name: $t('spanish'),
                    value: 'es'
                }, {
                    name: $t('catalan'),
                    value: 'ca'
                }
            ]" option-attribute="name" icon="i-heroicons-globe-alt" />
            <UButton :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="ghost" aria-label="Theme"
                @click="isDark = !isDark" />
        </div>
    </UContainer>
</template>

<script setup>
const colorMode = useColorMode()

const isDark = computed({
    get () {
        return colorMode.value === 'dark'
    },
    set () {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})
</script>