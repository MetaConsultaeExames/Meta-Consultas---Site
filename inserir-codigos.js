const fs = require('fs');
const path = require('path');

function getPageType(filename) {
  const name = filename.replace('.html', '').toLowerCase();

  const map = {
    'index': 'home',
    'quem-somos': 'institucional',
    'contato': 'contato',
    'faq': 'faq',
    'aviso': 'aviso',
    'area-do-paciente': 'area_paciente',
    'agendamento': 'agendamento',
    'agendamento-escolha': 'agendamento',
    'agendamento-listar': 'agendamento',
    'agendamento-listAll': 'agendamento',
    'agendamento-usuario': 'agendamento',
    'agendamento_receita': 'agendamento',
    'agendamento_v1': 'agendamento',
    'indexAgendamento': 'agendamento',
    'rede-parcerias': 'institucional',
  };

  const especialidades = [
    'cardiologia', 'ginecologia', 'exames', 'ortopedia', 'pediatria',
    'psicologia', 'psiquiatria', 'dermatologia', 'endocrinologia',
    'gastroenterologia', 'nutricao', 'obstetricia', 'otorrino',
    'urologia', 'angiologia', 'fisio', 'clinico-geral',
    'exames-de-imagem', 'exames-laboratoriais'
  ];

  if (map[name]) return map[name];
  if (especialidades.includes(name)) return 'especialidade';
  return 'pagina_interna';
}

const DATA_LAYER_BLOCK = (filename) => `
<!-- DataLayer e Consent Mode v2 - Meta Consultas -->
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': 500
});

window.dataLayer.push({
  'pageType': '${getPageType(filename)}',
  'pageTitle': document.title,
  'pageUrl': window.location.href,
  'clinicId': 'meta_consultas_exames',
  'clinicName': 'Meta Consultas e Exames',
  'clinicSegment': 'saude_popular',
  'clinicCity': 'Rio de Janeiro',
  'clinicState': 'RJ'
});
</script>

<!-- Script de persistência de UTMs -->
<script>
(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var utms = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid'];
  var dataToPush = {};
  utms.forEach(function(p) {
    var val = urlParams.get(p);
    if (val) { dataToPush[p] = val; sessionStorage.setItem('meta_'+p, val); }
  });
  if (Object.keys(dataToPush).length) window.dataLayer.push(dataToPush);
})();
</script>
`;

const arquivos = fs.readdirSync(__dirname);
let modificados = 0;
let gtmsAtualizados = 0;
let pulados = 0;

arquivos.forEach(arquivo => {
  if (!arquivo.endsWith('.html')) return;

  const caminho = path.join(__dirname, arquivo);
  let conteudo = fs.readFileSync(caminho, 'utf8');
  let alterado = false;

  // 1) Trocar GTM ID
  if (conteudo.includes('GTM-P3SL6STW')) {
    conteudo = conteudo.replace(/GTM-P3SL6STW/g, 'GTM-KS5V7KG');
    gtmsAtualizados++;
    alterado = true;
  }

  // 2) Inserir DataLayer (se não tiver)
  if (conteudo.includes('DataLayer e Consent Mode v2 - Meta Consultas')) {
    console.log(`⚠️  ${arquivo} já tem DataLayer.`);
    pulados++;
  } else if (!conteudo.includes('<head>')) {
    console.log(`❌  ${arquivo} sem <head>. Pulando.`);
    pulados++;
  } else {
    conteudo = conteudo.replace('<head>', '<head>' + DATA_LAYER_BLOCK(arquivo));
    alterado = true;
    modificados++;
  }

  // Só salva se algo mudou
  if (alterado) {
    fs.writeFileSync(caminho, conteudo, 'utf8');
    console.log(`✅  ${arquivo} salvo!`);
  }
});

console.log(`\n✅ ${modificados} com DataLayer inserido`);
console.log(`🔄 ${gtmsAtualizados} com GTM atualizado`);
console.log(`⚠️  ${pulados} pulados`);
