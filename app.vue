<template>
  <UContainer class="flex flex-col gap-4 py-4 mb-8">

    <Navbar />

    <UContainer class="flex flex-col w-full gap-4 mx-0 md:items-center md:flex-row">
      <div class="w-full sm:w-80">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          color="white" :trailing="false"
          :placeholder="`${$t('search')}...`"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          class="max-w-full"
        >
          <template #trailing>
            <UButton v-show="search !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
              @click="search = ''" />
          </template>
        </UInput>
      </div>
      <div class="flex items-center gap-6 mx-0">
        <USelect v-model="controlType" :options="[
          {
            name: $t('time_controls.all_controls'),
            value: ''
          },
          {
            name: $t('time_controls.standard'),
            value: 'standard'
          }, {
            name: $t('time_controls.rapid'),
            value: 'rapid'
          }, {
            name: $t('time_controls.blitz'),
            value: 'blitz'
          }
        ]" option-attribute="name" :icon="getIcon(controlType)" />
        <UCheckbox v-model="notStarted" :label="$t('not_started')" name="notStarted" />
      </div>
    </UContainer>

    <UContainer v-if="data?.total" class="flex w-full">
      <UBadge size="sm">{{ data?.total }} {{ $t('tournament', data?.total).toLowerCase() }}</UBadge>
    </UContainer>

    <UContainer class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="{
        name,
        fed,
        city,
        start,
        end,
        total_players,
        time_control,
        link_info64,
        link_chessresults,
        link_fide,
        website
      } in data?.tournaments" :key="name + end"
        class="group md:hover:dark:ring-gray-600 md:hover:ring-gray-300 hover:shadow-md">
        <p class="text-base capitalize">{{ name }}</p>
        <div class="flex flex-col items-start justify-start gap-2 md:items-end md:flex-row">
          <div class="flex items-center justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
            <UIcon :name="getFlag(fed)" class="text-base mr-[1px]" />
            <a v-if="city"
              class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[28ch]"
              :href="getCityLink(city)" target="_blank">
              {{ city.toLowerCase() }}
            </a>
            <p v-else class="text-sm capitalize">
              {{ $t(`region.${fed.toLowerCase()}`) }}
            </p>
          </div>
          <UBadge v-if="formatDate(start) < new Date()" color="sky" size="xs" class="md:ml-2">
            {{ $t('in_progress') }}
          </UBadge>
        </div>
        <div class="flex justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
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
        </div>
        <div class="flex flex-col justify-start gap-2 mt-2 text-gray-500 md:flex-row md:gap-4 dark:text-gray-400">
          <div v-if="total_players > 0 || time_control?.type"
            class="flex flex-row-reverse justify-end gap-4 md:justify-start md:flex-row">
            <div v-if="total_players > 0" class="flex justify-start gap-1 text-sm">
              <UIcon name="i-heroicons-user-group" class="text-lg" />
              {{ total_players }}
            </div>
            <div v-if="time_control?.type" class="flex items-start justify-start gap-1 text-sm normal-case">
              <UIcon v-if="time_control?.type === 'standard'" :name="getIcon('standard')" class="text-lg" />
              <UIcon v-if="time_control?.type === 'rapid'" :name="getIcon('rapid')" class="text-lg" />
              <UIcon v-if="time_control?.type === 'blitz'" :name="getIcon('blitz')" class="text-lg" />
              <div class="inline-block first-letter:capitalize">
                {{ time_control?.type }}
              </div>
            </div>
          </div>
          <div v-if="time_control?.value" class="flex items-start justify-start gap-1 text-sm normal-case">
            <UIcon name="i-heroicons-clock" class="text-lg" />
            <span class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[24ch]">
              <template v-if="time_control?.min > 0">
                {{ `${time_control?.min}m + ${time_control?.sec}s` }}
              </template>
              <template v-else>
                {{ time_control?.value }}
              </template>
            </span>
          </div>
        </div>
        <div class="flex justify-start gap-4 mt-4 group">
          <UButton v-if="website" icon="i-heroicons-link" color="gray" class="md:invisible md:group-hover:visible"
            :to="website" target="_blank">
            website
          </UButton>
          <UButton v-if="link_fide" icon="i-heroicons-link" color="gray" class="md:invisible md:group-hover:visible"
            :to="link_fide" target="_blank">
            fide.com
          </UButton>
          <UButton v-if="link_chessresults" icon="i-heroicons-link" color="gray"
            class="md:invisible md:group-hover:visible" :to="link_chessresults" target="_blank">
            chess-results.com
          </UButton>
          <UButton v-if="link_info64" icon="i-heroicons-link" color="gray" class="md:invisible md:group-hover:visible"
            :to="link_info64" target="_blank">
            info64.org
          </UButton>
        </div>
      </UCard>
    </UContainer>

    <UContainer v-if="data?.total > displayPerPage" class="flex justify-center mt-4 mb-8">
      <UPagination v-model="page" :page-count="displayPerPage" :total="data?.total" />
    </UContainer>

  </UContainer>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const page = ref(1)
const search = ref("")
const displayPerPage = ref(12)
const notStarted = ref(false)
const minDate = ref(null)
const controlType = ref("")

const getIcon = (name) => {
  if (name === "standard") {
    return "i-heroicons-puzzle-piece"
  } else if (name === "rapid") {
    return "i-heroicons-fire"
  } else if (name === "blitz") {
    return "i-heroicons-bolt"
  }
  return "i-heroicons-clock"
}

watch([page, search], () => {
  refresh()
})

watch([search, notStarted], () => {
  page.value = 1
})

watch(notStarted, (newValue) => {
  if (newValue) {
    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
    minDate.value = tomorrow.toLocaleString().split(',')[0]
  } else {
    minDate.value = null
  }
  refresh()
})

const formatDate = (date) => {
  var dateParts = date.split("/")
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  return dateObject
}

const { data, refresh } = await useFetch(`${runtimeConfig.public.API_BASE_URL}/tournaments`, {
  lazy: true,
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  method: 'POST',
  body: {
    page: page,
    display_per_page: displayPerPage,
    search: search,
    min_date: minDate,
    time_control_type: controlType
  }
})

const getFlag = (country) => {
  if (country === "ESP" || country === "Spain") {
    return "i-circle-flags-es"
  } else if (country === "CAT") {
    return "i-circle-flags-es-ct"
  }
}

const getCityLink = (cityStr) => {
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
  const link = url + city.split("/").join("")
  return link
}

useHead({
  title: "ChessFinder",
  meta: [{
    name: 'description',
    content: "Find all chess tournaments in seconds"
  }]
})
</script>
