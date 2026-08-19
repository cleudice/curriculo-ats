# Gerador de Currículo

Gerador de currículo gratuito, 100% estático (HTML/CSS/JS puro, sem build, sem dependências, sem servidor). Roda inteiramente no navegador — seus dados ficam salvos apenas no `localStorage` do seu computador.

Feito como alternativa moderna ao gerador do 4devs.com.br, com um formulário revisado para seguir boas práticas atuais de currículo (veja a auditoria abaixo).

## Como usar

1. Abra `index.html` no navegador (duplo clique no arquivo, ou sirva com qualquer servidor estático).
2. Preencha o formulário à esquerda — a prévia à direita atualiza em tempo real.
3. Use os botões no topo:
   - **🛡️ ATS / 🎨 Visual** — alterna o formato do currículo. **ATS** (padrão) é uma coluna só, sem cor de fundo, pensado para passar por sistemas de triagem automática. **Visual** usa uma barra lateral colorida com foto — só recomendado quando você sabe que um humano vai abrir o arquivo direto (indicação, e-mail pessoal, empresa pequena) ou em áreas onde o currículo também é peça de portfólio (design, publicidade). O conteúdo recomendado (sem foto por padrão, sem CPF/RG, resultados quantificados) vale nos dois formatos — só a estrutura visual muda.
   - **💾 Salvar JSON** — baixa um backup dos seus dados (`curriculo-seu-nome.json`).
   - **📂 Importar JSON** — recarrega dados salvos anteriormente.
   - **🖨️ Exportar PDF** — abre a caixa de impressão do navegador; escolha "Salvar como PDF". Gera um PDF com texto real (selecionável/pesquisável), ideal para sistemas de triagem automática (ATS).
   - **🌐 Baixar site (GitHub Pages)** — gera um `index.html` autocontido (CSS embutido) apenas com o currículo, no formato (ATS ou Visual) selecionado no momento, pronto para publicar como site.

Seus dados também ficam salvos automaticamente no navegador (localStorage), então se você fechar a aba e voltar depois, o formulário continua preenchido.

Há um `exemplo.json` no repositório — importe-o para ver o gerador preenchido com dados de exemplo.

## Publicando seu currículo no GitHub Pages

Depois de clicar em **"🌐 Baixar site (GitHub Pages)"**, você terá um arquivo `index.html` com seu currículo pronto para virar um site.

### Opção A — site pessoal (`seu-usuario.github.io`)

```bash
# 1. crie no GitHub um repositório com o nome exato: seu-usuario.github.io
# 2. localmente:
mkdir meu-curriculo && cd meu-curriculo
git init
mv ~/Downloads/index.html .
git add index.html
git commit -m "Publica currículo"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-usuario.github.io.git
git push -u origin main
```

Pronto — o site fica disponível em `https://seu-usuario.github.io/` (pode levar 1–2 minutos).

### Opção B — projeto dentro de um repositório qualquer

```bash
mkdir meu-curriculo && cd meu-curriculo
git init
mv ~/Downloads/index.html .
git add index.html
git commit -m "Publica currículo"
git branch -M main
git remote add origin https://github.com/seu-usuario/meu-curriculo.git
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `root`**. O site fica em `https://seu-usuario.github.io/meu-curriculo/`.

### Publicando o próprio gerador (opcional)

Se você quiser hospedar esta ferramenta inteira (formulário + prévia) no GitHub Pages, basta subir os três arquivos (`index.html`, `styles.css`, `app.js`) para um repositório e ativar o Pages do mesmo jeito. Não há build step — é HTML/CSS/JS puro.

## Auditoria: o que ter, o que não ter e o melhor formato

Comparado a geradores antigos como o do 4devs (formulário com CPF/RG, estado civil, data de nascimento, foto obrigatória, objetivo genérico, layout colorido em tabela), este gerador aplica as recomendações atuais de recrutamento e de compatibilidade com ATS (Applicant Tracking Systems — os sistemas que fazem a triagem automática de currículos antes de um humano ler).

### ✅ O que incluir

| Item | Por quê |
|---|---|
| Nome e cargo-alvo | O recrutador precisa saber em 2 segundos para qual vaga você está se candidatando |
| Contato profissional (telefone, e-mail, cidade/UF) | Essencial e nada mais — sem endereço completo |
| LinkedIn e, se for da área tech, GitHub/portfólio | Aumenta a credibilidade e dá contexto rápido |
| Resumo de 2–4 linhas | Substitui o "objetivo" genérico; deve dizer quem você é + sua força + um resultado |
| Experiência em ordem cronológica reversa | É o que recrutadores esperam ler primeiro |
| Resultados quantificados (%, R$, tempo, escala) | Diferencia um currículo de lista de tarefas de um currículo de impacto |
| Formação acadêmica | Nome do curso + instituição + período |
| Habilidades técnicas relevantes para a vaga | Hard skills primeiro; adapte por vaga |
| Idiomas com nível real | "Fluente" só se for verdade — é comumente testado em entrevista |
| Certificações recentes e relevantes | Poucas e relevantes > muitas e genéricas |

### 🧩 Opcionais relevantes por contexto (use "Seções personalizadas")

Nem todo opcional serve para toda área — a regra é: só entra se prova competência para a vaga.

| Contexto | O que costuma valer a pena adicionar |
|---|---|
| Tecnologia / Dev | Projetos com métricas técnicas, stack por proficiência, GitHub |
| Design / Criativo | Link de portfólio (Behance/Dribbble/site pessoal) em vez de GitHub |
| Acadêmico / Pesquisa | Publicações, congressos/apresentações, orientações, bolsas — aqui o documento é um **CV**, não um currículo, e pode passar de 2 páginas sem problema |
| Saúde, Jurídico, Engenharia (profissões regulamentadas) | Registro no conselho de classe (CRM, COREN, CRF, OAB, CREA, CAU, CRC, CRECI...) — normalmente só é exigido na admissão, mas listar é aceito e às vezes esperado em vagas seniores |
| Comercial / Vendas | Metas batidas (%), ticket médio, carteira, ranking no time |
| Qualquer área | Prêmios, voluntariado, associações profissionais |

O gerador tem um seletor **"Área de atuação"** que só ajusta as dicas do formulário (não aparece no currículo), e uma seção **"Seções personalizadas"** totalmente livre — título + itens — para registrar qualquer uma dessas informações sem precisar de um campo específico para cada profissão.

### 🚫 O que evitar (e por que este gerador não pede por padrão)

| Item | Por quê evitar |
|---|---|
| Foto | Gera viés inconsciente (idade, etnia, aparência); várias empresas e ATS descartam automaticamente currículos com foto; no Brasil não é exigida |
| CPF / RG / título de eleitor | Dado sensível desnecessário nessa etapa; expõe você a risco sob a LGPD; só é pedido depois, na admissão |
| Estado civil / religião / data de nascimento (idade) | No Brasil é ilegal a empresa exigir isso na seleção (discriminação); incluir voluntariamente só cria espaço para viés |
| "Objetivo" genérico ("busco crescimento profissional") | Não agrega informação nenhuma; substitua por um resumo objetivo |
| Tabelas, colunas múltiplas, caixas de texto | Muitos ATS extraem o texto na ordem errada ou perdem conteúdo em layouts complexos |
| Texto dentro de imagem / currículo em imagem/scan | ATS não consegue ler texto em imagem — o currículo é descartado |
| Fontes decorativas / excesso de cores | Prejudica leitura e parsing; um leve destaque de cor no cabeçalho é suficiente |
| "Referências disponíveis mediante solicitação" | Frase de preenchimento sem informação — se pedirem referências, você envia depois, à parte |
| Endereço completo | Cidade/UF basta; rua e número são desnecessários e expõem você |
| Currículo maior que 1–2 páginas fora do contexto certo | Ver regra de tamanho abaixo — a exceção é o CV acadêmico |

### 📏 Regra de tamanho (currículo vs. CV acadêmico)

- **Até ~5 anos de experiência:** 1 página.
- **Além disso, com conquistas relevantes para justificar:** 2 páginas.
- **Currículo acadêmico/pesquisa:** na prática é um **CV**, não um currículo — não tem limite de página; publicações, congressos e orientações se acumulam com o tempo. Use o seletor de área "Acadêmico / Pesquisa" para lembrar dessa diferença.

### 📐 Formato recomendado (o que este gerador produz)

- **Uma coluna**, sem tabelas — o texto flui na ordem certa para humanos e para ATS.
- **Cabeçalhos de seção padrão** ("Experiência profissional", "Formação acadêmica"...) — nomes criativos ("Minha trajetória") confundem o parser do ATS.
- **Fonte padrão do sistema** (Arial/Helvetica/Segoe UI), sem fontes exóticas.
- **Corpo de texto 10–12pt**, títulos de seção em caixa alta discreta.
- **PDF gerado a partir de HTML real** via impressão do navegador — texto sempre selecionável/pesquisável (diferente de gerar uma imagem e "printar" ela num PDF). PDF é o formato padrão esperado; envie em Word (.docx) só se a vaga pedir explicitamente.
- **Margens de 1,5–2cm**, bullets curtos (idealmente até 2 linhas).
- **Nome de arquivo recomendado:** `Nome_Sobrenome_Cargo.pdf` — sem espaços e sem acentos (o gerador já sugere esse padrão ao salvar o JSON; renomeie o PDF manualmente ao salvar).
- **Seção opcional "Zona de risco"** no formulário para quem, por exigência específica de um edital (ex.: concurso público), realmente precisa incluir dados extras — fica separada e claramente sinalizada, para não ser preenchida por engano.

### Fontes consultadas

[Sensei AI — ATS resume format 2026](https://www.senseicopilot.com/blog/best-ats-resume-format-for-2026) · [jobshinobi — Resume sections 2026](https://www.jobshinobi.com/blog/best-resume-sections-to-include-in-2026) · [IQ Partners — o que remover em 2026](https://www.iqpartners.com/blog/6-things-to-remove-from-your-resume-in-2026/) · [CVScholar — Academic CV vs resume](https://cvscholar.com/blog/academic-cv-vs-resume-differences) · [scale.jobs — 1 vs 2 páginas](https://scale.jobs/blog/one-page-vs-two-page-resume-ats-preferences) · [VisualCV — nome do arquivo](https://www.visualcv.com/blog/how-to-name-your-resume-file/) · [Migalhas — foto em currículo e LGPD](https://www.migalhas.com.br/depeso/362862/solicitacao-e-envio-de-fotos-em-curriculos-e-a-lgpd) · [Vagas.com — foto no currículo](https://www.vagas.com.br/blog/candidatos/foto-curriculo/)

## Estrutura do projeto

```
curriculo-gerador/
├── index.html      # app (formulário + prévia)
├── styles.css       # estilos do app e do currículo (inclui CSS de impressão)
├── app.js           # lógica: estado, renderização, localStorage, exportações
├── exemplo.json      # dados de exemplo para importar
└── README.md
```

Sem dependências externas, sem `npm install`, sem build. Basta abrir `index.html`.
