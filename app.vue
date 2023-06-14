<template>
  <UContainer class="py-4 flex flex-col gap-4">
    <UContainer class="flex justify-between items-center mx-0 w-full">
      <h1 class="text-xl">{{ $t('title') }}</h1>
      <div class="flex gap-2">
        <USelect
          v-model="$i18n.locale"
          :options="[
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
          ]"
          option-attribute="name"
          icon="i-heroicons-globe-alt"
        />
        <UButton :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="ghost" aria-label="Theme"
          @click="isDark = !isDark" />
      </div>
    </UContainer>
    <UContainer class="flex mx-0 w-full">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="md"
        color="white"
        :trailing="false"
        :placeholder="`${$t('search')}...`"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        class="w-80 max-w-full"
      >
        <template #trailing>
          <UButton
            v-show="search !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="search = ''"
          />
        </template>
      </UInput>
    </UContainer>
    <UContainer v-if="data?.total" class="flex mx-0 w-full">
      <UBadge size="sm">{{ data?.total }} {{ $t('tournament', data?.total).toLowerCase() }}</UBadge>
    </UContainer>
    <UContainer class="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))] mx-0 gap-4 w-full">
      <UCard v-for="{
          name,
          fed,
          city,
          start,
          end,
          total_players,
          time_control_type,
          time_control_value
        } in data?.tournaments"
        :key="name+end"
      >
        <p class="text-base capitalize">{{ name }}</p>
        <div class="flex justify-start mt-2 gap-2 text-gray-500 dark:text-gray-400">
          <UIcon :name="getFlag(fed)" class="text-lg" />
          <a
            v-if="city"
            class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[50ch]"
            :href="getCityLink(city, fed)"
            target="_blank"
          >
            {{ city.toLowerCase() }}
          </a>
          <p v-else class="text-sm capitalize">
            {{ $t(`region.${fed.toLowerCase()}`) }}
          </p>
        </div>
        <div class="flex justify-start mt-2 gap-2 text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-calendar" class="text-lg" />
          <div class="text-sm normal-case">
            <div class="inline-block first-letter:capitalize">
              {{ $d(formatDate(start), 'short') }}
            </div>
            <span v-if="start != end"> - </span>
            <div v-if="start != end" class="inline-block first-letter:capitalize">
              {{ $d(formatDate(end), 'short') }}
            </div>
          </div>
          <UBadge v-if="formatDate(start) < new Date()" color="sky" size="xs">
            {{ $t('in_progress') }}
          </UBadge>
        </div>
        <div class="flex justify-start items-center mt-2 gap-8 text-gray-500 dark:text-gray-400">
          <div v-if="total_players" class="text-sm flex justify-start items-center gap-2">
            <UIcon name="i-heroicons-user-group" class="text-lg" />
            {{ total_players }}
          </div>
          <div
            v-if="time_control_type"
            class="text-sm normal-case flex justify-start items-center gap-2"
          >
            <UIcon v-if="time_control_type === 'standard'" name="i-heroicons-puzzle-piece" class="text-lg" />
            <UIcon v-if="time_control_type === 'rapid'" name="i-heroicons-fire" class="text-lg" />
            <UIcon v-if="time_control_type === 'blitz'" name="i-heroicons-bolt" class="text-lg" />
            <div class="inline-block first-letter:capitalize">
              {{ time_control_type }}
            </div>
          </div>
          <div
            v-if="time_control_value"
            class="text-sm normal-case flex justify-start items-center gap-2"
          >
            <UIcon name="i-heroicons-clock" class="text-lg" />
            <span class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[40ch]">
              {{ time_control_value }}
            </span>
          </div>
        </div>
      </UCard>
    </UContainer>
    <UContainer v-if="data?.total > 0" class="flex justify-center mt-4 mb-8">
      <UPagination v-model="page" :page-count="displayPerPage" :total="data?.total" />
    </UContainer>
  </UContainer>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()
const page = ref(1)
const search = ref("")
const displayPerPage = ref(10)

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

watch([page, search], () => {
  refresh()
})

const { pending, data, refresh } = await useFetch(`${runtimeConfig.public.API_BASE_URL}/tournaments`, {
  lazy: true,
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  method: 'POST',
  body: {
    page: page,
    display_per_page: displayPerPage,
    search: search
  }
})

const getFlag = (country) => {
  if (country === "ESP") {
    return "i-circle-flags-es"
  } else if (country === "CAT") {
    return "i-circle-flags-es-ct"
  }
}

const getCityLink = (cityStr, fed) => {
  const city = cityStr.toLowerCase()
  const URLcontain = ['http', '.c', '.d', '.e', '.o']
  const isUrl = URLcontain.some((str) => {
    return city.includes(str)
  })
  if (isUrl) {
    if (!city.includes('http')) {
      return 'http://' + city
    }
    return city
  }
  const url = 'https://www.google.com/maps/search/'
  const link = url + city.split("/").join("") + ', ' + fed
  return link
}

const formatDate = (date) => {
  var dateParts = date.split("/")
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  return dateObject
}
</script>
