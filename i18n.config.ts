export default defineI18nConfig(() => ({
    strategy: "prefix",
    defaultLocale: "en",
    locales: ["en", "es", "ca"],
    fallbackLocale: ["en", "es", "ca"],
    messages: {
        en: {
            title: "Find all tournaments in Europe",
            english: "English",
            spanish: "Spanish",
            catalan: "Catalan",
            short: {
                year: "numeric",
                month: "short",
                weekday: "short",
                day: "numeric",
            },
            long: {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
            },
            tournament: "Tournament | Tournaments",
            search: "Search",
            in_progress: "In progress",
            not_started: "Not started",
            website: "Website",
            ranking: "Ranking",
            info: "Information",
            no_tournaments: "No tournaments found",
            time_controls: {
                all_controls: "All controls",
                standard: "Standard",
                rapid: "Rapid",
                blitz: "Blitz",
            },
            regions: {
                all_regions: "All regions",
                alb: "Albania",
                and: "Andorra",
                arm: "Armenia",
                aut: "Austria",
                aze: "Azerbaijan",
                blr: "Belarus",
                bel: "Belgium",
                bih: "Bosnia and Herzegovina",
                bul: "Bulgaria",
                cat: "Catalonia",
                cro: "Croatia",
                cyp: "Cyprus",
                cze: "Czech Republic",
                den: "Denmark",
                est: "Estonia",
                esp: "Spain",
                fin: "Finland",
                fra: "France",
                geo: "Georgia",
                ger: "Germany",
                gre: "Greece",
                hun: "Hungary",
                isl: "Iceland",
                irl: "Ireland",
                ita: "Italy",
                kaz: "Kazakhstan",
                kos: "Kosovo",
                lat: "Latvia",
                lie: "Liechtenstein",
                ltu: "Lithuania",
                lux: "Luxembourg",
                mlt: "Malta",
                mda: "Moldova",
                mnc: "Monaco",
                mne: "Montenegro",
                ned: "Netherlands",
                mkd: "North Macedonia",
                nor: "Norway",
                pol: "Poland",
                por: "Portugal",
                rou: "Romania",
                rus: "Russia",
                smr: "San Marino",
                srb: "Serbia",
                svk: "Slovakia",
                slo: "Slovenia",
                swe: "Sweden",
                sui: "Switzerland",
                tur: "Turkey",
                ukr: "Ukraine",
                eng: "United Kingdom",
            },
            cards: "Cards",
            list: "List",
            map: "Map",
            feature_soon: "Feature coming soon",
            name: "Name",
            start: "Start",
            end: "End",
            time_control: "Time control",
            city: "City"
        },
        es: {
            title: "Encuentra torneos por toda Europa",
            english: "Inglés",
            spanish: "Español",
            catalan: "Catalán",
            short: {
                year: "numeric",
                month: "short",
                weekday: "short",
                day: "numeric",
            },
            long: {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
            },
            tournament: "Torneo | Torneos",
            search: "Buscar",
            in_progress: "En progreso",
            not_started: "No empezado",
            website: "Página web",
            ranking: "Ranking",
            info: "Información",
            no_tournaments: "No se han encontrado torneos",
            time_controls: {
                all_controls: "Todos los controles",
                standard: "Estándard",
                rapid: "Rápido",
                blitz: "Blitz",
            },
            regions: {
                all_regions: "Todas las regiones",
                alb: "Albania",
                and: "Andorra",
                arm: "Armenia",
                aut: "Austria",
                aze: "Azerbaiyán",
                blr: "Bielorrusia",
                bel: "Bélgica",
                bih: "Bosnia y Herzegovina",
                bul: "Bulgaria",
                cat: "Cataluña",
                cro: "Croacia",
                cyp: "Chipre",
                cze: "República Checa",
                den: "Dinamarca",
                est: "Estonia",
                esp: "España",
                fin: "Finlandia",
                fra: "Francia",
                geo: "Georgia",
                ger: "Alemania",
                gre: "Grecia",
                hun: "Hungría",
                isl: "Islandia",
                irl: "Irlanda",
                ita: "Italia",
                kaz: "Kazajistán",
                kos: "Kosovo",
                lat: "Letonia",
                lie: "Liechtenstein",
                ltu: "Lituania",
                lux: "Luxemburgo",
                mlt: "Malta",
                mda: "Moldavia",
                mnc: "Mónaco",
                mne: "Montenegro",
                ned: "Países Bajos",
                mkd: "Macedonia del Norte",
                nor: "Noruega",
                pol: "Polonia",
                por: "Portugal",
                rou: "Rumania",
                rus: "Rusia",
                smr: "San Marino",
                srb: "Serbia",
                svk: "Eslovaquia",
                slo: "Eslovenia",
                swe: "Suecia",
                sui: "Suiza",
                tur: "Turquía",
                ukr: "Ucrania",
                eng: "Reino Unido",
            },
            cards: "Tarjetas",
            list: "Lista",
            map: "Mapa",
            feature_soon: "Funcionalidad próximamente disponible",
            name: "Nombre",
            start: "Inicio",
            end: "Fin",
            time_control: "Ritmo de juego",
            city: "Ciudad"
        },
        ca: {
            title: "Troba tots els tornejos a Europa",
            english: "Anglès",
            spanish: "Castellà",
            catalan: "Català",
            short: {
                year: "numeric",
                month: "short",
                weekday: "short",
                day: "numeric",
            },
            long: {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
            },
            tournament: "Torneig | Tornejos",
            search: "Cercar",
            in_progress: "En progrés",
            not_started: "No començat",
            website: "Pàgina web",
            ranking: "Ranking",
            info: "Informació",
            no_tournaments: "No s'han trobat tornejos",
            time_controls: {
                all_controls: "Tots els controls",
                standard: "Estàndard",
                rapid: "Ràpid",
                blitz: "Blitz",
            },
            regions: {
                all_regions: "Totes les regions",
                alb: "Albània",
                and: "Andorra",
                arm: "Armènia",
                aut: "Àustria",
                aze: "Azerbaidjan",
                blr: "Bielorússia",
                bel: "Bèlgica",
                bih: "Bòsnia i Hercegovina",
                bul: "Bulgària",
                cat: "Catalunya",
                cro: "Croàcia",
                cyp: "Xipre",
                cze: "República Txeca",
                den: "Dinamarca",
                est: "Estònia",
                esp: "Espanya",
                fin: "Finlàndia",
                fra: "França",
                geo: "Geòrgia",
                ger: "Alemanya",
                gre: "Grècia",
                hun: "Hongria",
                isl: "Islàndia",
                irl: "Irlanda",
                ita: "Itàlia",
                kaz: "Kazakhstan",
                kos: "Kosovo",
                lat: "Letònia",
                lie: "Liechtenstein",
                ltu: "Lituània",
                lux: "Luxemburg",
                mlt: "Malta",
                mda: "Moldàvia",
                mnc: "Mònaco",
                mne: "Montenegro",
                ned: "Països Baixos",
                mkd: "Macedònia del Nord",
                nor: "Noruega",
                pol: "Polònia",
                por: "Portugal",
                rou: "Romania",
                rus: "Rússia",
                smr: "San Marino",
                srb: "Sèrbia",
                svk: "Eslovàquia",
                slo: "Eslovènia",
                swe: "Suècia",
                sui: "Suïssa",
                tur: "Turquia",
                ukr: "Ucraïna",
                eng: "Regne Unit",
            },
            cards: "Targetes",
            list: "Llista",
            map: "Mapa",
            feature_soon: "Funcionalitat pròximamente disponible",
            name: "Nom",
            start: "Inici",
            end: "Fi",
            time_control: "Ritme de joc",
            city: "Ciutat"
        },
    },
    datetimeFormats: {
        en: {
            short: {
                year: "numeric",
                month: "short",
                weekday: "short",
                day: "numeric",
            },
        },
        es: {
            short: {
                year: "numeric",
                month: "short",
                weekday: "long",
                day: "numeric",
            },
        },
        ca: {
            short: {
                year: "numeric",
                month: "short",
                weekday: "long",
                day: "numeric",
            },
        },
    },
}));