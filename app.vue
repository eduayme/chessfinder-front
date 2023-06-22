<template>
  <UContainer class="flex flex-col gap-4 py-4 mb-8">

    <Navbar />

    <UContainer class="flex flex-col w-full mx-0 gap-x-6 gap-y-4 md:items-center md:flex-row">
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
            v-model="filterFederation"
            :options="[
              {
                name: $t('regions.all_regions'),
                value: ''
              },
              ...data?.regions?.map(region => {
                return {
                  'name': $t(`regions.${region.toLowerCase()}`),
                  'value': region
                }
              })
            ]"
            option-attribute="name"
            :icon="getFlag(filterFederation)"
          />
          <UCheckbox v-model="notStarted" :label="$t('not_started')" name="notStarted" />
      </div>
    </UContainer>

    <UContainer v-if="data?.total > 0" class="flex w-full">
      <UBadge size="sm">{{ data?.total }} {{ $t('tournament', data?.total).toLowerCase() }}</UBadge>
    </UContainer>

    <div class="p-10 text-center" v-else>
      <UIcon name="i-heroicons-circle-stack" class="text-4xl" />
      <h3>{{ $t('no_tournaments') }}</h3>
    </div>

    <UContainer class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
      <template v-else>
        <UCard v-for="{
          name,
          fed,
          city,
          start,
          end,
          total_players,
          time_control,
          ranking,
          info,
          website
        } in data?.tournaments" :key="name + end"
          class="group md:hover:dark:ring-gray-500 md:hover:ring-gray-400 hover:shadow-md">
          <p class="text-base capitalize">{{ name }}</p>
          <div class="flex flex-col items-start justify-start gap-2 md:items-end md:flex-row">
            <div class="flex items-center justify-start gap-1 mt-2 text-gray-500 dark:text-gray-400">
              <UTooltip :text="$t(`regions.${fed.toLowerCase()}`)" :popper="{ placement: 'top' }">
                <UIcon :name="getFlag(fed)" class="text-base mr-[1px]" />
              </UTooltip>
              <a v-if="city"
                class="text-sm capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[32ch] md:max-w-[28ch]"
                :href="getCityLink(city)" target="_blank">
                {{ city.toLowerCase() }}
              </a>
              <p v-else class="text-sm capitalize">
                {{ $t(`regions.${fed.toLowerCase()}`) }}
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
      </template>
    </UContainer>

    <UContainer v-if="data?.total > displayPerPage" class="flex justify-center mt-4 mb-8">
      <UPagination v-model="page" :page-count="displayPerPage" :total="data?.total" />
    </UContainer>

  </UContainer>
</template>

<script setup>
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_u5d313g4BNHKKC0cxsWNepdD24UVLH7Nj6UzCWYqoeS',{api_host:'https://eu.posthog.com'})

const runtimeConfig = useRuntimeConfig()
const page = ref(1)
const search = ref("")
const displayPerPage = ref(12)
const notStarted = ref(false)
const minDate = ref(null)
const filterControl = ref("")
const filterFederation = ref("")

const getIcon = (name) => {
  if (name === "standard") {
    return "i-heroicons-puzzle-piece"
  } else if (name === "rapid") {
    return "i-heroicons-fire"
  } else if (name === "blitz") {
    return "i-heroicons-bolt"
  }
  return ""
}

watch(page, () => {
  refresh()
})

watch([search, notStarted, filterControl, filterFederation], () => {
  refresh()
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

const { data, pending, refresh } = await useFetch(`${runtimeConfig.public.apiUrl}/tournaments`, {
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
    time_control_type: filterControl,
    region: filterFederation
  }
})

const getFlag = (country) => {
  const countryCode = country.toUpperCase()
  if (countryCode === "ALB") return "i-circle-flags-al";
  if (countryCode === "AND") return "i-circle-flags-ad";
  if (countryCode === "ARM") return "i-circle-flags-am";
  if (countryCode === "AUT") return "i-circle-flags-at";
  if (countryCode === "AZE") return "i-circle-flags-az";
  if (countryCode === "BLR") return "i-circle-flags-by";
  if (countryCode === "BEL") return "i-circle-flags-be";
  if (countryCode === "BIH") return "i-circle-flags-ba";
  if (countryCode === "BUL") return "i-circle-flags-bg";
  if (countryCode === "CAT") return "i-circle-flags-es-ct";
  if (countryCode === "CRO") return "i-circle-flags-hr";
  if (countryCode === "CYP") return "i-circle-flags-cy";
  if (countryCode === "CZE") return "i-circle-flags-cz";
  if (countryCode === "DEN") return "i-circle-flags-dk";
  if (countryCode === "EST") return "i-circle-flags-ee";
  if (countryCode === "ESP") return "i-circle-flags-es";
  if (countryCode === "FIN") return "i-circle-flags-fi";
  if (countryCode === "FRA") return "i-circle-flags-fr";
  if (countryCode === "GEO") return "i-circle-flags-ge";
  if (countryCode === "GER") return "i-circle-flags-de";
  if (countryCode === "GRE") return "i-circle-flags-gr";
  if (countryCode === "HUN") return "i-circle-flags-hu";
  if (countryCode === "ISL") return "i-circle-flags-is";
  if (countryCode === "IRL") return "i-circle-flags-ie";
  if (countryCode === "ITA") return "i-circle-flags-it";
  if (countryCode === "KAZ") return "i-circle-flags-kz";
  if (countryCode === "KOS") return "i-circle-flags-xk";
  if (countryCode === "LAT") return "i-circle-flags-lv";
  if (countryCode === "LIE") return "i-circle-flags-li";
  if (countryCode === "LTU") return "i-circle-flags-lt";
  if (countryCode === "LUX") return "i-circle-flags-lu";
  if (countryCode === "MLT") return "i-circle-flags-mt";
  if (countryCode === "MDA") return "i-circle-flags-md";
  if (countryCode === "MNC") return "i-circle-flags-mc";
  if (countryCode === "MNE") return "i-circle-flags-me";
  if (countryCode === "NED") return "i-circle-flags-nl";
  if (countryCode === "MKD") return "i-circle-flags-mk";
  if (countryCode === "NOR") return "i-circle-flags-no";
  if (countryCode === "POL") return "i-circle-flags-pl";
  if (countryCode === "POR") return "i-circle-flags-pt";
  if (countryCode === "ROU") return "i-circle-flags-ro";
  if (countryCode === "RUS") return "i-circle-flags-ru";
  if (countryCode === "SMR") return "i-circle-flags-sm";
  if (countryCode === "SRB") return "i-circle-flags-rs";
  if (countryCode === "SVK") return "i-circle-flags-sk";
  if (countryCode === "SVN") return "i-circle-flags-si";
  if (countryCode === "SWE") return "i-circle-flags-se";
  if (countryCode === "SUI") return "i-circle-flags-ch";
  if (countryCode === "TUR") return "i-circle-flags-tr";
  if (countryCode === "UKR") return "i-circle-flags-ua";
  if (countryCode === "ENG") return "i-circle-flags-gb";
  return ""; // if code not found
};

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
