document.addEventListener('DOMContentLoaded', function() {
    
    // 1. O SEGREDO DO CACHE ESTÁ AQUI:
    // Adicionamos a hora atual (Date.now()) na chamada do arquivo
    const urlDoConfig = '/js/campanha-whats/config.json?v=' + Date.now();

    // 2. Buscamos o arquivo JSON
    fetch(urlDoConfig)
        .then(response => response.json())
        .then(WHATSAPP_CONFIG => {
            // A PARTIR DAQUI, É A SUA LÓGICA ORIGINAL
            
            function normalize(str) {
                return (str || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            }

            function getAllUrlParams() {
                const params = new URLSearchParams(window.location.search);
                if (params.toString() === '' && window.location.hash) {
                    const hash = window.location.hash.replace(/^#/, '');
                    const query = hash.startsWith('?') ? hash.slice(1) : (hash.includes('=') ? hash : '');
                    if (query) {
                        new URLSearchParams(query).forEach((value, key) => params.set(key, value));
                    }
                }
                return params;
            }

            function getParam(params, names) {
                for (let i = 0; i < names.length; i++) {
                    let value = params.get(names[i]);
                    if (value) return normalize(value);
                }
                return '';
            }

            const params = getAllUrlParams();
            const unidadeUrl = getParam(params, ['_unidade', 'unidade']);
            const especialidadeUrl = getParam(params, ['_especialidade', 'especialidade']);

            const utmCampaign = getParam(params, ['utm_campaign']);
            const campParts = utmCampaign ? utmCampaign.split('_').map(normalize) : [];
            
            const campUnidade = campParts.find(p => WHATSAPP_CONFIG.UNIDADES_VALIDAS.includes(p)) || '';
            const campEspecialidade = campParts.find(p => WHATSAPP_CONFIG.ESPECIALIDADES_VALIDAS.includes(p)) || '';

            const unidadeFinal = unidadeUrl || campUnidade;
            const especialidadeFinal = especialidadeUrl || campEspecialidade;

            const isCampanhaValida = 
                WHATSAPP_CONFIG.UNIDADES_VALIDAS.includes(unidadeFinal) && 
                WHATSAPP_CONFIG.ESPECIALIDADES_VALIDAS.includes(especialidadeFinal);

            const novoLink = isCampanhaValida ? WHATSAPP_CONFIG.LINK_CAMPANHA : WHATSAPP_CONFIG.LINK_PADRAO;

            const whatsLinks = document.querySelectorAll(
                'a[href*="whatsapp"], a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"], a[href*="cloudiabot"]'
            );
            
            whatsLinks.forEach(link => { link.href = novoLink; });

            console.log('[WhatsApp links alterados com sucesso]', { novoLink });
        })
        .catch(error => {
            console.error('Erro ao carregar as configurações do WhatsApp:', error);
        });
});