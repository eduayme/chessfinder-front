<template>
  <UContainer class="flex flex-col gap-4 py-4 mb-8">
    <Navbar />
    <UContainer class="flex flex-col w-full mx-0 gap-x-6 gap-y-4 md:items-center md:flex-row">
      <div class="w-full sm:w-80">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          color="white"
          :placeholder="`${$t('search')}...`"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          class="max-w-full"
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
      </div>
      <div class="flex flex-wrap items-center mx-0 gap-x-6 gap-y-2">
          <div class="flex flex-wrap items-center mx-0 gap-x-1 gap-y-2">
            <UInput
              v-model="startDate"
              type="date"
              color="white"
              :max="endDate"
              class="min-w-[140px]"
            />
            <span class="text-gray-400 dark:text-gray-500">-</span>
            <UInput
              v-model="endDate"
              type="date"
              color="white"
              :min="startDate"
              class="min-w-[140px]"
            />
          </div>
          <USelect
            v-model="filterControl"
            :options="[
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
            ]"
            option-attribute="name"
            :icon="getIcon(filterControl)"
          />
          <USelect
            v-if="data?.regions"
            v-model="filterFederation"
            :options="[
              {
                name: $t('regions.all_regions'),
                value: ''
              },
              ...data?.regions?.map(region => {
                return {
                  'name': $t(`regions.${region?.toLowerCase()}`),
                  'value': region
                }
              }).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
            ]"
            option-attribute="name"
            :icon="getFlag(filterFederation)"
          />
          <UCheckbox v-model="notStarted" :label="$t('not_started')" name="notStarted" />
      </div>
    </UContainer>

    <UContainer v-if="data?.total > 0" class="flex items-center justify-between w-full">
      <UBadge
        size="sm"
        color="gray"
        variant="solid"
      >
        {{ data?.total }} {{ $t('tournament', data?.total).toLowerCase() }}
      </UBadge>
      <div class="hidden gap-4 md:flex">
        <UButton
          v-if="view === 'map'"
          :loading="pending"
          color="white"
          variant="outline"
          size="2xs"
          @click="page++"
          :disabled="data?.total === tournaments.length"
        >
          {{
            data?.total === tournaments.length
            ? $t('all_tournaments_loaded')
            : $t('load_more_tournaments')
          }}
        </UButton>
        <UButtonGroup size="xs">
          <UButton
            v-for="{ label, icon } in views"
            :key="label"
            :color="view === label ? 'primary' : 'white'"
            :variant="view === label ? 'outline' : 'link'"
            @click="view = label"
          >
            <UIcon :name="icon" class="text-base" />
            {{ $t(label) }}
          </UButton>
        </UButtonGroup>
      </div>
    </UContainer>
    <UContainer class="p-10 my-10 text-center" v-else-if="!pending">
      <UIcon name="i-heroicons-circle-stack" class="text-4xl" />
      <h3>{{ $t('no_tournaments') }}</h3>
    </UContainer>

    <template v-if="data?.total > 0 || pending">
      <UContainer v-show="view === 'cards'">
        <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <UCard
            v-for="{
              name,
              fed,
              address,
              start,
              end,
              total_players,
              time_control,
              ranking,
              info,
              website
            } in tournaments"
            :key="name + end"
            class="group md:hover:dark:ring-gray-500 md:hover:ring-gray-400 hover:shadow-md"
          >
              <p class="text-base capitalize">{{ name }}</p>
              <div class="flex flex-col items-start justify-start gap-2 md:items-end md:flex-row">
                <div class="flex items-center justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
                  <UTooltip :text="$t(`regions.${fed.toLowerCase()}`)" :popper="{ placement: 'top' }">
                    <UIcon :name="getFlag(fed)" class="text-base mr-[1px]" />
                  </UTooltip>
                  <a
                    class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[28ch]"
                    :href="getAddressLink(address)" target="_blank"
                  >
                    {{ address.toLowerCase() || $t(`regions.${fed.toLowerCase()}`) }}
                  </a>
                </div>
                <UBadge
                  v-if="formatDate(start) < new Date()"
                  size="xs"
                  color="sky"
                  variant="subtle"
                  class="md:ml-2"
                >
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
              <div class="flex flex-wrap justify-start mt-4 gap-x-4 gap-y-2 group">
                <UButton
                  v-if="website"
                  color="gray"
                  class="md:invisible md:group-hover:visible"
                  :to="website"
                  target="_blank"
                >
                  <UIcon name="i-heroicons-link" class="text-lg" />
                  {{ $t("website") }}
                </UButton>
                <UButton
                  v-if="ranking"
                  color="gray"
                  class="md:invisible md:group-hover:visible"
                  :to="ranking"
                  target="_blank"
                >
                  <UIcon name="i-heroicons-user-group" class="text-lg" />
                  {{ $t("ranking") }}
                </UButton>
                <UButton
                  v-if="info"
                  color="gray"
                  class="md:invisible md:group-hover:visible"
                  :to="info"
                  target="_blank"
                >
                  <UIcon name="i-heroicons-information-circle" class="text-lg" />
                  {{ $t("info") }}
                </UButton>
              </div>
          </UCard>
          <template v-if="pending">
            <UCard v-for="n in 9" :key="n" class="h-54">
              <div class="flex flex-col gap-2">
                <USkeleton class="w-full h-6" />
                <USkeleton class="h-5 w-[200px]" />
                <USkeleton class="h-5 w-[280px]" />
                <USkeleton class="h-5 w-[200px]" />
                <USkeleton class="h-8 w-[120px] mt-2" />
              </div>
            </UCard>
          </template>
        </div>
      </UContainer>
      <UContainer v-show="view === 'list'">
        <UTable
          :rows="tournaments"
          :columns="tableColumns"
          :empty-state="null"
          :ui='{
              "tr": {
                "base": "group"
              },
              "th": {
                "padding": "px-2 pb-3 pt-1"
              },
              "td": {
                "padding": "px-2 py-3 group-hover:bg-slate-100 dark:group-hover:bg-gray-800/50"
              }
          }'
        >
          <template #name-data="{ row }">
            <div class="flex items-center gap-2">
              <div class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[48ch]">
                {{ row.name }}
              </div>
              <UBadge
                v-if="formatDate(row.start) < new Date()"
                size="xs"
                color="sky"
                variant="subtle"
                class="md:ml-2"
              >
                {{ $t('in_progress') }}
              </UBadge>
            </div>
          </template>
          <template #start-data="{ row }">
            <UTooltip :text="$d(formatDate(row.start), 'short')" :popper="{ placement: 'top' }">
              {{ row.start }}
            </UTooltip>
          </template>
          <template #end-data="{ row }">
            <UTooltip :text="$d(formatDate(row.end), 'short')" :popper="{ placement: 'top' }">
              {{ row.end }}
            </UTooltip>
          </template>
          <template #time_control-data="{ row }">
            <div class="flex items-start justify-start gap-1 text-sm normal-case">
              <UIcon
                v-if="row.time_control?.type === 'standard'"
                :name="getIcon('standard')"
                class="text-lg"
              />
              <UIcon
                v-if="row.time_control?.type === 'rapid'"
                :name="getIcon('rapid')"
                class="text-lg"
              />
              <UIcon
                v-if="row.time_control?.type === 'blitz'"
                :name="getIcon('blitz')"
                class="text-lg"
              />
              <div class="inline-block first-letter:capitalize">
                {{ row.time_control?.type }}
                <span class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[24ch]">
                  <template v-if="row.time_control?.min > 0">
                    · {{ `${row.time_control?.min}m + ${row.time_control?.sec}s` }}
                  </template>
                  <template v-else>
                    {{ row.time_control?.value }}
                  </template>
                </span>
              </div>
            </div>
          </template>
          <template #address-data="{ row }">
            <div class="flex items-center gap-[6px]">
              <UTooltip :text="$t(`regions.${row.fed.toLowerCase()}`)" :popper="{ placement: 'top' }">
                <UIcon :name="getFlag(row.fed)" class="text-base mr-[1px]" />
              </UTooltip>
              <a
                class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[28ch]"
                :href="getAddressLink(row.address)" target="_blank"
              >
                {{ row.address.toLowerCase() || $t(`regions.${row.fed.toLowerCase()}`) }}
              </a>
            </div>
          </template>
          <template #actions-data="{ row }">
            <div class="flex flex-wrap justify-start invisible gap-x-4 gap-y-2 group-hover:visible">
              <UButton
                v-if="row.website"
                color="white"
                class="md:invisible md:group-hover:visible"
                :to="row.website"
                target="_blank"
                size="xs"
              >
                <UIcon name="i-heroicons-link" class="text-lg" />
                {{ $t("website") }}
              </UButton>
              <UButton
                v-if="row.ranking"
                color="white"
                class="md:invisible md:group-hover:visible"
                :to="row.ranking"
                target="_blank"
                size="xs"
              >
                <UIcon name="i-heroicons-user-group" class="text-lg" />
                {{ $t("ranking") }}
              </UButton>
              <UButton
                v-if="row.info"
                color="white"
                class="md:invisible md:group-hover:visible"
                :to="row.info"
                target="_blank"
                size="xs"
              >
                <UIcon name="i-heroicons-information-circle" class="text-lg" />
                {{ $t("info") }}
              </UButton>
            </div>
          </template>
        </UTable>
        <template v-if="pending">
          <div class="flex flex-col gap-4">
            <USkeleton v-for="n in 10" :key="n" class="w-full h-12" />
          </div>
        </template>
      </UContainer>
      <UContainer v-show="view === 'map'">
        <USkeleton v-if="pending" class="relative w-full h-[calc(100dvh-180px)] -mb-12" />
        <div v-else class="relative w-full h-[calc(100dvh-180px)] -mb-12">
          <MapboxMap
            :access-token="mapboxKey"
            :map-style="mapTheme"
            :center="mapCenter"
            :zoom="filterFederation !== '' && items.length > 0 ? 5 : 2"
            class="w-full h-full"
            @mb-created="(mapInstance) => map = mapInstance"
          >
            <MapboxGeolocateControl position="top-right" />
            <MapboxNavigationControl position="bottom-right" />
            <MapboxMarker
              v-for="(item, i) in items"
              :key="i"
              :lng-lat="[item?.lng || 0, item?.lat || 0]"
              popup
            >
              <template v-slot:popup>
                <UCard class="group">
                    <p class="text-base capitalize">{{ item?.name }}</p>
                    <div class="flex flex-col items-start justify-start gap-2 md:items-end md:flex-row">
                        <div class="flex items-center justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
                            <UTooltip :text="$t(`regions.${item?.fed.toLowerCase()}`)" :popper="{ placement: 'top' }">
                                <UIcon :name="getFlag(item?.fed)" class="text-base mr-[1px]" />
                            </UTooltip>
                            <a class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[28ch]"
                                :href="getAddressLink(item?.address)" target="_blank">
                                {{ item?.address.toLowerCase() || $t(`regions.${item?.fed.toLowerCase()}`) }}
                            </a>
                        </div>
                        <UBadge v-if="formatDate(item?.start) < new Date()" size="xs" color="sky" variant="outline" class="md:ml-2">
                            {{ $t('in_progress') }}
                        </UBadge>
                    </div>
                    <div class="flex justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
                        <UIcon name="i-heroicons-calendar" class="text-lg" />
                        <div class="text-sm normal-case">
                            <div class="inline-block first-letter:capitalize">
                                {{ $d(formatDate(item?.start), 'short') }}
                            </div>
                            <span v-if="item?.start != item?.end"> - </span>
                            <div v-if="item?.start != item?.end" class="inline-block first-letter:capitalize">
                                {{ $d(formatDate(item?.end), 'short') }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start gap-2 mt-2 text-gray-500 md:flex-row md:gap-4 dark:text-gray-400">
                        <div v-if="item?.total_players > 0 || item?.time_control?.type"
                            class="flex flex-row-reverse justify-end gap-4 md:justify-start md:flex-row">
                            <div v-if="item?.total_players > 0" class="flex justify-start gap-1 text-sm">
                                <UIcon name="i-heroicons-user-group" class="text-lg" />
                                {{ item?.total_players }}
                            </div>
                            <div v-if="item?.time_control?.type" class="flex items-start justify-start gap-1 text-sm normal-case">
                                <UIcon v-if="item?.time_control?.type === 'standard'" :name="getIcon('standard')" class="text-lg" />
                                <UIcon v-if="item?.time_control?.type === 'rapid'" :name="getIcon('rapid')" class="text-lg" />
                                <UIcon v-if="item?.time_control?.type === 'blitz'" :name="getIcon('blitz')" class="text-lg" />
                                <div class="inline-block first-letter:capitalize">
                                    {{ item?.time_control?.type }}
                                </div>
                            </div>
                        </div>
                        <div v-if="item?.time_control?.value" class="flex items-start justify-start gap-1 text-sm normal-case">
                            <UIcon name="i-heroicons-clock" class="text-lg" />
                            <span class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[24ch]">
                                <template v-if="item?.time_control?.min > 0">
                                    {{ `${item?.time_control?.min}m + ${item?.time_control?.sec}s` }}
                                </template>
                                <template v-else>
                                    {{ item?.time_control?.value }}
                                </template>
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-wrap justify-start mt-4 gap-x-4 gap-y-2 group">
                        <UButton v-if="item?.website" color="gray" class="md:invisible md:group-hover:visible" :to="item?.website"
                            target="_blank">
                            <UIcon name="i-heroicons-link" class="text-lg" />
                            {{ $t("website") }}
                        </UButton>
                        <UButton v-if="item?.ranking" color="gray" class="md:invisible md:group-hover:visible" :to="item?.ranking"
                            target="_blank">
                            <UIcon name="i-heroicons-user-group" class="text-lg" />
                            {{ $t("ranking") }}
                        </UButton>
                        <UButton v-if="item?.info" color="gray" class="md:invisible md:group-hover:visible" :to="item?.info"
                            target="_blank">
                            <UIcon name="i-heroicons-information-circle" class="text-lg" />
                            {{ $t("info") }}
                        </UButton>
                    </div>
                </UCard>
              </template>
            </MapboxMarker>
          </MapboxMap>
        </div>
      </UContainer>
    </template>
  </UContainer>
</template>

<script setup>
// Import the component and its CSS
import {
  MapboxMap,
  MapboxGeolocateControl,
  MapboxNavigationControl,
  MapboxMarker
} from '@studiometa/vue-mapbox-gl';
import '@studiometa/vue-mapbox-gl/index.css';

// Import Mapbox required CSS stylesheets
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css';

const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()
const { t } = useI18n()
const page = ref(1)
const search = ref("")
const displayPerPage = ref(15)
const notStarted = ref(true)
const minDate = ref(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)))
const filterControl = ref("")
const filterFederation = ref("")
const tournaments = ref([])
const view = ref("cards")
const views = ref([
  { label: 'cards', icon: 'i-heroicons-squares-2x2' },
  { label: 'list', icon: 'i-heroicons-queue-list' },
  { label: 'map', icon: 'i-heroicons-map' }
])
const startDate = ref("")
const endDate = ref("")
const map = ref(null)

const items = computed(() => {
  const itemsLatLng = tournaments.value
    ?.filter((t) => t?.latitude !== "" && t?.longitude !== "")

  itemsLatLng.forEach((item, index) => {
      item.id = index;
      item.lat = item?.latitude || 0,
      item.lng = item?.longitude || 0
  });

  return itemsLatLng
})

const mapboxKey = computed(() => {
  return runtimeConfig.public.mapboxKey
})

const mapCenter = computed(() => {
  if (items.value.length === 0) {
    return [5, 35]; // Default center of Europe
  }

  const sumLat = items.value.reduce((total, item) => total + item?.latitude, 0);
  const sumLng = items.value.reduce((total, item) => total + item?.longitude, 0);

  const avgLat = sumLat / items.value.length;
  const avgLng = sumLng / items.value.length;

  return [avgLng, avgLat];
})

const tableColumns = computed(() => {
  return [
    { key: 'name', label: t('name') },
    { key: 'start', label: t('start') },
    { key: 'end', label: t('end') },
    { key: 'time_control', label: t('time_control') },
    { key: 'address', label: t('address') },
    { key: 'actions' }
  ] || []
})

const mapTheme = computed(() => {
  if (colorMode.value === 'dark') {
    return 'mapbox://styles/mapbox/dark-v11?optimize=true'
  }
  return 'mapbox://styles/mapbox/light-v11?optimize=true'
})

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

onMounted(() => {
  onScroll()
  refresh()
})

const onScroll = () => {
  window.onscroll = () => {
    if (!pending.value) {
      let bottomOfWindow = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) + window.innerHeight === document.documentElement.offsetHeight

      if (bottomOfWindow && tournaments.value.length < data.value.total) {
        page.value++
      }
    }
  }
}

watch([search, filterControl, filterFederation, startDate, endDate], () => {
  page.value = 1
  refresh()
})

watch(page, () => {
  refresh()
})

watch(notStarted, (newValue) => {
  if (newValue) {
    minDate.value = new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
  } else {
    minDate.value = null
  }
  page.value = 1
  refresh()
})

const formatDate = (date) => {
  var dateParts = date.split("/")
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  return dateObject
}

const { data, pending, refresh } = await useAsyncData(
  'fetchTournaments',
  () =>
    $fetch(`${runtimeConfig.public.apiUrl}/tournaments`, {
      lazy: true,
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      body: {
        page: page.value,
        display_per_page: displayPerPage.value,
        search: search.value,
        min_date: startDate.value !== ''
            ? new Date(startDate.value)?.toLocaleString()?.split(',')[0]
              || minDate.value?.toLocaleString()?.split(',')[0]
              || null
            : minDate.value?.toLocaleString()?.split(',')[0] || null,
        max_date:
          endDate.value !== ''
            ? new Date(endDate.value)?.toLocaleString()?.split(',')[0] || null
            : null,
        time_control_type: filterControl.value,
        region: filterFederation.value
      }
    })
)

watch (data, (newValue) => {
  if (page.value === 1) {
    tournaments.value = []
  }
  tournaments.value = [...tournaments.value, ...newValue?.tournaments]
})

const getFlag = (country) => {
  const countryCode = country.toUpperCase()
  if (countryCode === "ALB") return "i-circle-flags-al"
  if (countryCode === "AND") return "i-circle-flags-ad"
  if (countryCode === "ARM") return "i-circle-flags-am"
  if (countryCode === "AUT") return "i-circle-flags-at"
  if (countryCode === "AZE") return "i-circle-flags-az"
  if (countryCode === "BLR") return "i-circle-flags-by"
  if (countryCode === "BEL") return "i-circle-flags-be"
  if (countryCode === "BIH") return "i-circle-flags-ba"
  if (countryCode === "BUL") return "i-circle-flags-bg"
  if (countryCode === "CAT") return "i-circle-flags-es-ct"
  if (countryCode === "CRO") return "i-circle-flags-hr"
  if (countryCode === "CYP") return "i-circle-flags-cy"
  if (countryCode === "CZE") return "i-circle-flags-cz"
  if (countryCode === "DEN") return "i-circle-flags-dk"
  if (countryCode === "EST") return "i-circle-flags-ee"
  if (countryCode === "ESP") return "i-circle-flags-es"
  if (countryCode === "FIN") return "i-circle-flags-fi"
  if (countryCode === "FRA") return "i-circle-flags-fr"
  if (countryCode === "GEO") return "i-circle-flags-ge"
  if (countryCode === "GER") return "i-circle-flags-de"
  if (countryCode === "GRE") return "i-circle-flags-gr"
  if (countryCode === "HUN") return "i-circle-flags-hu"
  if (countryCode === "ISL") return "i-circle-flags-is"
  if (countryCode === "IRL") return "i-circle-flags-ie"
  if (countryCode === "ITA") return "i-circle-flags-it"
  if (countryCode === "KAZ") return "i-circle-flags-kz"
  if (countryCode === "KOS") return "i-circle-flags-xk"
  if (countryCode === "LAT") return "i-circle-flags-lv"
  if (countryCode === "LIE") return "i-circle-flags-li"
  if (countryCode === "LTU") return "i-circle-flags-lt"
  if (countryCode === "LUX") return "i-circle-flags-lu"
  if (countryCode === "MLT") return "i-circle-flags-mt"
  if (countryCode === "MDA") return "i-circle-flags-md"
  if (countryCode === "MNC") return "i-circle-flags-mc"
  if (countryCode === "MNE") return "i-circle-flags-me"
  if (countryCode === "NED") return "i-circle-flags-nl"
  if (countryCode === "MKD") return "i-circle-flags-mk"
  if (countryCode === "NOR") return "i-circle-flags-no"
  if (countryCode === "POL") return "i-circle-flags-pl"
  if (countryCode === "POR") return "i-circle-flags-pt"
  if (countryCode === "ROU") return "i-circle-flags-ro"
  if (countryCode === "RUS") return "i-circle-flags-ru"
  if (countryCode === "SMR") return "i-circle-flags-sm"
  if (countryCode === "SRB") return "i-circle-flags-rs"
  if (countryCode === "SVK") return "i-circle-flags-sk"
  if (countryCode === "SLO") return "i-circle-flags-si"
  if (countryCode === "SWE") return "i-circle-flags-se"
  if (countryCode === "SUI") return "i-circle-flags-ch"
  if (countryCode === "TUR") return "i-circle-flags-tr"
  if (countryCode === "UKR") return "i-circle-flags-ua"
  if (countryCode === "ENG") return "i-circle-flags-gb"
  return "i-heroicons-globe-alt" // if code not found
}

const getAddressLink = (addressStr) => {
  const address = addressStr.toLowerCase()
  const URLcontain = ['http', '.c', '.d', '.e', '.o']
  const isUrl = URLcontain.some((str) => {
    return address.includes(str)
  })
  if (isUrl) {
    if (!address.includes('http')) {
      return 'http://' + address
    }
    return address
  }
  const url = 'https://www.google.com/maps/search/'
  const link = url + address.split("/").join("")
  return link
}

useHead({
  title: "ChessFinder",
  meta: [{
    name: 'ChessFinder',
    content: "Find all chess tournaments in seconds"
  }]
})
</script>

<style>
canvas {
  border-radius: 6px;
}
.mapboxgl-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.mapboxgl-popup-content {
  background: white;
  padding: 0;
  width: 480px;
}
.mapboxgl-popup-tip {
  border-top-color: white;
  border-bottom-color: white;
}

.dark .mapboxgl-popup-content {
  background: #18181B;
}
.dark .mapboxgl-popup-tip {
  border-top-color: #18181B;
  border-bottom-color: #18181B;
}
.mapboxgl-popup-close-button {
  width: 24px;
  height: 24px;
}
</style>
