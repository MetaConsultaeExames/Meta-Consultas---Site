Clínica Meta Consultas e Exames

README.MD - DOCUMENTAÇÃO TÉCNICA E ÉTICA

Diretrizes de Versionamento, Governança Digital e Compliance Médico

25 de junho de 2026

---

## Meta Consultas e Exames - Site Oficial

### 1. Objetivo do Repositório

Este repositório constitui a fonte única de verdade para o código-fonte, ativos digitais e configurações do site oficial da Clínica Meta Consultas e Exames. O objetivo central é estabelecer um ambiente de versionamento seguro que permita o deploy automático via Base 44, garantindo que toda alteração seja rastreável, auditável e passível de reversão imediata em caso de instabilidade ou desconformidade.

### 2. Diretrizes Éticas e Normativas (MANDATÓRIO)

A manutenção deste site deve observar rigorosamente as resoluções do Conselho Federal de Medicina (CFM) e as normas de publicidade médica. O descumprimento destas regras sujeita os responsáveis às sanções administrativas e legais cabíveis.


Atenção: As seguintes proibições são absolutas e não admitem exceções:


1. **Vedação ao Sensacionalismo:** É estritamente proibida a utilização de linguagem sensacionalista, promessas de cura garantida ou métodos infalíveis. A comunicação deve ser meramente informativa e educativa.
2. **Proibição de 'Antes e Depois':** Não é permitida a publicação de fotos comparativas de pacientes (ex: resultados de exames ou procedimentos), independentemente de autorização expressa do paciente ou do uso de tarjas de anonimato.
3. **Identificação Obrigatória:** Todas as páginas que descrevam serviços médicos ou especialidades devem exibir, de forma visível, o nome completo, o número do CRM e o RQE (Registro de Qualificação de Especialista) do Diretor Médico responsável.

### 3. Fluxo de Trabalho e Governança

Para assegurar a integridade do site e a conformidade com as diretrizes acima, o fluxo de publicação segue o modelo de Governança por Auditoria. Nenhuma alteração deve ser enviada diretamente para a branch principal (main) sem revisão prévia.


"O deploy automático para a Base 44 está configurado exclusivamente para a branch principal. Alterações diretas via FTP são proibidas."


*   **Criação de Branches:** Desenvolvedores e agências devem criar branches específicas para cada tarefa (ex: `feature/ajuste-seo` ou `fix/texto-servico`).
*   **Pull Requests (PR):** Toda alteração deve ser submetida via Pull Request.
*   **Auditoria Pré-Deploy:** O PR será auditado pela Skill de Compliance para verificar a aderência às normas éticas e performance técnica antes de ser mesclado (merge) e publicado.

### 4. Responsabilidade Técnica

A responsabilidade técnica final por todo o conteúdo publicado neste repositório e refletido no site oficial recai sobre o Diretor Médico da instituição.

*   **Diretor Médico:** Gustavo Gouvea
*   **Plataforma de Deploy:** Base 44
*   **Ambiente de Versionamento:** GitHub

---

*Documento elaborado em 25 de junho de 2026. As informações contidas são de responsabilidade do solicitante.*