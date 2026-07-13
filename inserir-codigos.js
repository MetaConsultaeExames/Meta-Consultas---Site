const fs = require('fs');
const path = require('path');

const BLOCK1 = `
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
  'pageType': 'landing_page',
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
let pulados = 0;

arquivos.forEach(arquivo => {
  if (!arquivo.endsWith('.html')) return;
  
  const caminho = path.join(__dirname, arquivo);
  let conteudo = fs.readFileSync(caminho, 'utf8');
  
  if (conteudo.includes('DataLayer e Consent Mode v2 - Meta Consultas')) {
    console.log(`⚠️  ${arquivo} já tem o DataLayer. Pulando.`);
    pulados++;
    return;
  }
  
  if (!conteudo.includes('<head>')) {
    console.log(`❌  ${arquivo} não tem <head>. Pulando.`);
    pulados++;
    return;
  }
  
  conteudo = conteudo.replace('<head>', '<head>' + BLOCK1);
  fs.writeFileSync(caminho, conteudo, 'utf8');
  console.log(`✅  ${arquivo} modificado!`);
  modificados++;
});

console.log(`\n✅ ${modificados} modificados | ⚠️ ${pulados} pulados`);
