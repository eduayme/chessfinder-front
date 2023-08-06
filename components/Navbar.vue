<template>
    <UContainer class="flex items-start justify-between w-full gap-2 mx-0">
        <h1 class="text-2xl font-semibold">ChessFinder</h1>
        <div class="flex gap-2">
            <USelect
                v-model="locale"
                :options="locales"
                option-attribute="name"
                icon="i-heroicons-globe-alt"
                @change="navigateTo(`/${locale}`)"
            />
            <UButton :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="ghost" aria-label="Theme"
                @click="isDark = !isDark" />
        </div>
    </UContainer>
</template>

<script setup>
const { t, locale } = useI18n()
const colorMode = useColorMode()

const isDark = computed({
    get () {
        return colorMode.value === 'dark'
    },
    set () {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const locales = ref([
    {
        name: t('english'),
        value: 'en',
    }, {
        name: t('spanish'),
        value: 'es'
    },
    {
        name: t('catalan'),
        value: 'ca'
    }
])
</script>