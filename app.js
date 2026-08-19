(() => {
  "use strict";

  const STORAGE_KEY = "curriculo-gerador:v1";

  const emptyState = () => ({
    area: "", nome: "", cargo: "", telefone: "", email: "", cidade: "",
    linkedin: "", github: "", foto: "",
    resumo: "", habilidades: "", certificacoes: "", extra: "",
    prioridadeFormacao: false,
    experiencia: [],
    formacao: [],
    idiomas: [],
    projetos: [],
    secoesCustom: []
  });

  const AREA_HINTS = {
    "": "Escolha sua área para ver dicas específicas de preenchimento. As seções do formulário continuam as mesmas — use \"Seções personalizadas\", no fim do formulário, para adicionar qualquer informação própria da sua área (registro profissional, publicações, prêmios etc.).",
    tech: "Tecnologia: preencha GitHub/portfólio no topo, use a seção Projetos com métricas técnicas (performance, uptime, escala, usuários) e liste a stack em Habilidades por ordem de domínio.",
    design: "Design/Criativo: coloque o link do portfólio (Behance, Dribbble, site pessoal) no lugar do GitHub. Descreva o processo e o resultado de cada projeto, não só o entregável visual.",
    academico: "Acadêmico/Pesquisa: use \"Seções personalizadas\" para Publicações, Congressos, Orientações e Bolsas — nesse contexto um currículo mais longo que 2 páginas é normal e esperado.",
    comercial: "Comercial/Vendas: quantifique tudo — % de meta batida, ticket médio, tamanho de carteira, posição no ranking do time. Números pesam mais que descrições de atividade.",
    saude: "Saúde: adicione seu registro profissional (CRM, COREN, CRF, CRP...) em \"Seções personalizadas\" e destaque especializações, residências e áreas de atendimento.",
    juridico: "Jurídico: adicione seu número da OAB em \"Seções personalizadas\" e destaque áreas de atuação, principais casos/pareceres (sem violar sigilo) e publicações.",
    engenharia: "Engenharia: adicione seu registro no CREA/CAU em \"Seções personalizadas\" e descreva projetos com resultados técnicos mensuráveis (custo, prazo, segurança, eficiência).",
    educacao: "Educação: destaque formação pedagógica, metodologias aplicadas e resultados de aprendizagem concretos (ex: aumento de aprovação, projetos implementados).",
    administrativo: "Administrativo/Financeiro: foque em eficiência de processos, sistemas dominados (ERP, Excel avançado) e resultados de organização ou redução de custos.",
    outra: "Use a seção \"Seções personalizadas\", no fim do formulário, para adicionar qualquer informação específica da sua área que não se encaixe nas seções padrão."
  };

  let state = Object.assign(emptyState(), load() || {});

  // ---------------- persistence ----------------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  // ---------------- helpers ----------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const escapeHtml = (s) => (s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  const MESES_ABREV = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const MESES_NOMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const ANO_ATUAL = new Date().getFullYear();

  const fmtMonth = (m) => {
    if (!m) return "";
    const [y, mo] = m.split("-");
    return `${MESES_ABREV[parseInt(mo,10)-1]}/${y}`;
  };

  function uid() { return Math.random().toString(36).slice(2, 9); }

  // ---------------- bind simple fields ----------------
  function bindSimpleFields() {
    $all("[data-field]", $("#form")).forEach(el => {
      const isCheckbox = el.type === "checkbox";
      if (isCheckbox) el.checked = !!state[el.dataset.field];
      else el.value = state[el.dataset.field] || "";
      const handler = () => {
        state[el.dataset.field] = isCheckbox ? el.checked : el.value;
        save();
        renderPreview();
      };
      el.addEventListener("input", handler);
      if (isCheckbox || el.tagName === "SELECT") el.addEventListener("change", handler);
    });
  }

  function setupAreaHint() {
    const select = $("#areaAtuacao");
    const hint = $("#areaHint");
    const update = () => { hint.textContent = AREA_HINTS[select.value] || AREA_HINTS[""]; };
    select.addEventListener("change", update);
    update();
  }

  // ---------------- generic list renderer ----------------
  function renderDynamicList(containerId, arrayKey, fieldDefs, addBtnId, entryLabel) {
    const container = $("#" + containerId);
    const addBtn = $("#" + addBtnId);

    function draw() {
      if (!Array.isArray(state[arrayKey])) state[arrayKey] = [];
      container.querySelectorAll(".entry-card").forEach(n => n.remove());
      state[arrayKey].forEach((entry, idx) => {
        const card = document.createElement("div");
        card.className = "entry-card";
        card.innerHTML = `
          <div class="entry-head">
            <span>${entryLabel} ${idx + 1}</span>
            <button type="button" class="small danger" data-remove="${idx}">remover</button>
          </div>
        `;
        const grid = document.createElement("div");
        grid.style.display = "flex";
        grid.style.flexDirection = "column";
        grid.style.gap = "8px";

        fieldDefs.forEach(rowDefs => {
          const row = document.createElement("div");
          row.className = rowDefs.length > 1 ? (rowDefs.length === 3 ? "row3" : "row2") : "";
          rowDefs.forEach(def => {
            const wrap = document.createElement("label");
            wrap.innerHTML = `<span>${def.label}</span>`;

            if (def.type === "monthyear") {
              const [savedYear, savedMonth] = (entry[def.key] || "").split("-");
              const selMonth = document.createElement("select");
              selMonth.innerHTML = `<option value="">Mês</option>` +
                MESES_NOMES.map((m, i) => `<option value="${String(i + 1).padStart(2, "0")}">${m}</option>`).join("");
              selMonth.value = savedMonth || "";
              const selYear = document.createElement("select");
              let yearOptions = `<option value="">Ano</option>`;
              for (let y = ANO_ATUAL + 1; y >= 1975; y--) yearOptions += `<option value="${y}">${y}</option>`;
              selYear.innerHTML = yearOptions;
              selYear.value = savedYear || "";
              const commit = () => {
                entry[def.key] = (selYear.value && selMonth.value) ? `${selYear.value}-${selMonth.value}` : "";
                save();
                renderPreview();
              };
              selMonth.addEventListener("change", commit);
              selYear.addEventListener("change", commit);
              const monthYearRow = document.createElement("div");
              monthYearRow.className = "monthyear-row";
              monthYearRow.appendChild(selMonth);
              monthYearRow.appendChild(selYear);
              wrap.appendChild(monthYearRow);
              row.appendChild(wrap);
              return;
            }

            let input;
            if (def.type === "textarea") {
              input = document.createElement("textarea");
              input.rows = def.rows || 3;
            } else if (def.type === "checkbox") {
              wrap.className = "checkbox-row";
              wrap.innerHTML = "";
              input = document.createElement("input");
              input.type = "checkbox";
              const span = document.createElement("span");
              span.textContent = def.label;
              wrap.appendChild(input);
              wrap.appendChild(span);
            } else {
              input = document.createElement("input");
              input.type = def.type || "text";
            }
            if (def.placeholder) input.placeholder = def.placeholder;
            if (def.type === "checkbox") {
              input.checked = !!entry[def.key];
            } else {
              input.value = entry[def.key] || "";
            }
            input.addEventListener("input", () => {
              entry[def.key] = def.type === "checkbox" ? input.checked : input.value;
              save();
              renderPreview();
            });
            if (def.type === "checkbox") {
              input.addEventListener("change", () => {
                entry[def.key] = input.checked;
                save();
                renderPreview();
              });
            }
            wrap.appendChild(input);
            row.appendChild(wrap);
          });
          grid.appendChild(row);
        });

        card.appendChild(grid);
        container.appendChild(card);
      });

      container.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          state[arrayKey].splice(parseInt(btn.dataset.remove, 10), 1);
          save();
          draw();
          renderPreview();
        });
      });
    }

    addBtn.addEventListener("click", () => {
      const newEntry = {};
      fieldDefs.flat().forEach(def => newEntry[def.key] = def.type === "checkbox" ? false : "");
      newEntry._id = uid();
      state[arrayKey].push(newEntry);
      save();
      draw();
      renderPreview();
    });

    draw();
  }

  function setupLists() {
    renderDynamicList("listExperiencia", "experiencia", [
      [{ key: "cargo", label: "Cargo", placeholder: "Desenvolvedora Backend" },
       { key: "empresa", label: "Empresa", placeholder: "Empresa LTDA" }],
      [{ key: "inicio", label: "Início", type: "monthyear" },
       { key: "fim", label: "Fim", type: "monthyear" }],
      [{ key: "atual", label: "Emprego atual", type: "checkbox" }],
      [{ key: "descricao", label: "Descrição (uma linha por bullet, comece com um verbo de ação)", type: "textarea", rows: 4,
         placeholder: "Reduzi o tempo de resposta da API principal em 30% via cache distribuído\nLiderei a migração de 12 microsserviços para Kubernetes" }]
    ], "addExperiencia", "Experiência");

    renderDynamicList("listFormacao", "formacao", [
      [{ key: "curso", label: "Curso", placeholder: "Bacharelado em Ciência da Computação" },
       { key: "instituicao", label: "Instituição", placeholder: "USP" }],
      [{ key: "inicio", label: "Início", type: "monthyear" },
       { key: "fim", label: "Conclusão (ou prevista)", type: "monthyear" }]
    ], "addFormacao", "Formação");

    renderDynamicList("listIdiomas", "idiomas", [
      [{ key: "idioma", label: "Idioma", placeholder: "Inglês" },
       { key: "nivel", label: "Nível", placeholder: "Avançado" }]
    ], "addIdioma", "Idioma");

    renderDynamicList("listProjetos", "projetos", [
      [{ key: "nome", label: "Nome do projeto", placeholder: "API de pagamentos" }],
      [{ key: "link", label: "Link", type: "url", placeholder: "https://github.com/usuario/projeto" }],
      [{ key: "descricao", label: "Descrição curta", type: "textarea", rows: 2, placeholder: "API REST de pagamentos com 99.9% de uptime, usada por 3 produtos internos" }]
    ], "addProjeto", "Projeto");

    renderDynamicList("listCustom", "secoesCustom", [
      [{ key: "titulo", label: "Título da seção", placeholder: "Publicações / Registro profissional / Prêmios..." }],
      [{ key: "conteudo", label: "Conteúdo (uma linha por item)", type: "textarea", rows: 3,
         placeholder: "CREA-SP 123456789\nArtigo publicado no Congresso Brasileiro de X, 2025" }]
    ], "addCustom", "Seção");
  }

  // ---------------- preview / resume markup (shared with standalone export) ----------------
  function buildResumeHtml(s) {
    const contactParts = [];
    if (s.telefone) contactParts.push(`<span>📞 ${escapeHtml(s.telefone)}</span>`);
    if (s.email) contactParts.push(`<span>✉️ ${escapeHtml(s.email)}</span>`);
    if (s.cidade) contactParts.push(`<span>📍 ${escapeHtml(s.cidade)}</span>`);
    if (s.linkedin) contactParts.push(`<span>🔗 ${escapeHtml(s.linkedin)}</span>`);
    if (s.github) contactParts.push(`<span>💻 ${escapeHtml(s.github)}</span>`);

    const skills = (s.habilidades || "").split(",").map(x => x.trim()).filter(Boolean);

    const expHtml = s.experiencia.length ? s.experiencia.map(e => {
      const periodo = (e.inicio || e.fim || e.atual)
        ? `${fmtMonth(e.inicio) || "?"} — ${e.atual ? "Atual" : (fmtMonth(e.fim) || "?")}`
        : "";
      const bullets = (e.descricao || "").split("\n").map(l => l.trim()).filter(Boolean)
        .map(l => `<li>${escapeHtml(l)}</li>`).join("");
      return `
        <div class="item">
          <div class="item-top">
            <div><span class="item-title">${escapeHtml(e.cargo)}</span>${e.empresa ? ` <span class="item-sub">· ${escapeHtml(e.empresa)}</span>` : ""}</div>
            ${periodo ? `<div class="item-date">${periodo}</div>` : ""}
          </div>
          ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
        </div>`;
    }).join("") : `<p class="empty-note">Nenhuma experiência adicionada ainda.</p>`;

    const formHtml = s.formacao.length ? s.formacao.map(f => {
      const periodo = (f.inicio || f.fim) ? `${fmtMonth(f.inicio) || "?"} — ${fmtMonth(f.fim) || "atual"}` : "";
      return `
        <div class="item">
          <div class="item-top">
            <div><span class="item-title">${escapeHtml(f.curso)}</span>${f.instituicao ? ` <span class="item-sub">· ${escapeHtml(f.instituicao)}</span>` : ""}</div>
            ${periodo ? `<div class="item-date">${periodo}</div>` : ""}
          </div>
        </div>`;
    }).join("") : "";

    const idiomasHtml = s.idiomas.length ? s.idiomas.map(i =>
      `<div class="lang-row"><span>${escapeHtml(i.idioma)}</span><span class="level">${escapeHtml(i.nivel)}</span></div>`
    ).join("") : "";

    const projetosHtml = s.projetos.length ? s.projetos.map(p => `
      <div class="item">
        <div class="item-top">
          <div><span class="item-title">${escapeHtml(p.nome)}</span></div>
          ${p.link ? `<div class="item-date">${escapeHtml(p.link)}</div>` : ""}
        </div>
        ${p.descricao ? `<p style="margin:2px 0 0;font-size:10pt;color:#222;">${escapeHtml(p.descricao)}</p>` : ""}
      </div>`).join("") : "";

    const certLines = (s.certificacoes || "").split("\n").map(l => l.trim()).filter(Boolean);
    const certHtml = certLines.length ? `<ul class="bullets">${certLines.map(l => `<li>${escapeHtml(l)}</li>`).join("")}</ul>` : "";

    const customHtml = (s.secoesCustom || []).filter(c => c.titulo || c.conteudo).map(c => {
      const linhas = (c.conteudo || "").split("\n").map(l => l.trim()).filter(Boolean);
      const corpo = linhas.length ? `<ul class="bullets">${linhas.map(l => `<li>${escapeHtml(l)}</li>`).join("")}</ul>` : "";
      return `<section class="block"><h2 class="block-title">${escapeHtml(c.titulo) || "Seção"}</h2>${corpo}</section>`;
    }).join("");

    const experienciaBlock = `<section class="block"><h2 class="block-title">Experiência profissional</h2>${expHtml}</section>`;
    const formacaoBlock = formHtml ? `<section class="block"><h2 class="block-title">Formação acadêmica</h2>${formHtml}</section>` : "";
    const expFormBlocks = s.prioridadeFormacao ? formacaoBlock + experienciaBlock : experienciaBlock + formacaoBlock;

    return `
      <header class="head">
        ${s.foto ? `<img class="photo" src="${escapeHtml(s.foto)}" alt="Foto de perfil">` : ""}
        <div>
          <h1 class="name">${escapeHtml(s.nome) || "Seu Nome"}</h1>
          ${s.cargo ? `<p class="role">${escapeHtml(s.cargo)}</p>` : ""}
          ${contactParts.length ? `<div class="contact-line">${contactParts.join("")}</div>` : ""}
        </div>
      </header>

      ${s.resumo ? `<section class="block"><h2 class="block-title">Resumo</h2><p class="summary">${escapeHtml(s.resumo)}</p></section>` : ""}

      ${expFormBlocks}

      ${skills.length ? `<section class="block"><h2 class="block-title">Habilidades</h2><div class="tags">${skills.map(sk => `<span class="tag">${escapeHtml(sk)}</span>`).join("")}</div></section>` : ""}

      ${idiomasHtml ? `<section class="block"><h2 class="block-title">Idiomas</h2>${idiomasHtml}</section>` : ""}

      ${certHtml ? `<section class="block"><h2 class="block-title">Certificações e cursos</h2>${certHtml}</section>` : ""}

      ${projetosHtml ? `<section class="block"><h2 class="block-title">Projetos</h2>${projetosHtml}</section>` : ""}

      ${customHtml}

      ${s.extra ? `<section class="block"><h2 class="block-title">Informações adicionais</h2><p class="summary">${escapeHtml(s.extra)}</p></section>` : ""}
    `;
  }

  function renderPreview() {
    $("#resumePreview").innerHTML = buildResumeHtml(state);
  }

  // ---------------- top bar actions ----------------
  function downloadBlob(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toast(message, ms = 6000) {
    let box = $("#toastBox");
    if (!box) {
      box = document.createElement("div");
      box.id = "toastBox";
      box.className = "toast";
      document.body.appendChild(box);
    }
    box.innerHTML = message.split("\n").map(l => l ? `<p>${l}</p>` : "<br>").join("");
    box.classList.add("show");
    clearTimeout(box._t);
    box._t = setTimeout(() => box.classList.remove("show"), ms);
  }

  function slug(str) {
    return (str || "curriculo")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "curriculo";
  }

  function setupTopbar() {
    $("#btnPrint").addEventListener("click", () => window.print());

    $("#btnExportJson").addEventListener("click", () => {
      downloadBlob(`curriculo-${slug(state.nome)}.json`, JSON.stringify(state, null, 2), "application/json");
    });

    $("#btnImport").addEventListener("click", () => $("#fileImport").click());
    $("#fileImport").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          state = Object.assign(emptyState(), imported);
          save();
          location.reload();
        } catch {
          toast("⚠️ Arquivo JSON inválido — verifique se é um arquivo exportado por este gerador.");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    $("#btnClear").addEventListener("click", () => {
      if (!confirm("Isso vai apagar todos os dados preenchidos. Continuar?")) return;
      state = emptyState();
      save();
      location.reload();
    });

    $("#btnExportSite").addEventListener("click", () => {
      const html = buildStandaloneSite(state);
      downloadBlob("index.html", html, "text/html");
      toast(
        "✅ index.html gerado! Para publicar no GitHub Pages:\n" +
        "1. Crie um repositório novo no GitHub\n" +
        "2. Coloque este index.html na raiz e faça commit/push\n" +
        "3. Settings → Pages → branch main, pasta /(root)\n" +
        "4. Fica em https://seu-usuario.github.io/repositorio/\n" +
        "Passo a passo completo com comandos git no README.md."
      );
    });
  }

  function buildStandaloneSite(s) {
    const resumeHtml = buildResumeHtml(s);
    const cssResumeVars = `
      :root{--accent:#1d4ed8;--accent-soft:#e8edfc;}
      *{box-sizing:border-box;}
      body{margin:0;background:#eef0f3;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:24px 12px;}
      .page{background:#fff;max-width:210mm;min-height:297mm;margin:0 auto;padding:16mm;box-shadow:0 1px 4px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.06);border-radius:2px;}
      .resume{color:#1a1a1a;font-size:11pt;line-height:1.45;}
      .resume h1.name{font-size:22pt;margin:0 0 2px;font-weight:800;color:#111;}
      .resume .role{font-size:12.5pt;color:var(--accent);font-weight:600;margin:0 0 8px;}
      .resume .contact-line{font-size:9.5pt;color:#444;display:flex;flex-wrap:wrap;gap:4px 10px;margin-bottom:6px;}
      .resume header.head{display:flex;gap:14px;border-bottom:2px solid var(--accent);padding-bottom:10px;margin-bottom:12px;align-items:flex-start;}
      .resume header.head .photo{width:26mm;height:26mm;border-radius:6px;object-fit:cover;flex-shrink:0;border:1px solid #ddd;}
      .resume section.block{margin-bottom:11px;}
      .resume section.block:last-child{margin-bottom:0;}
      .resume h2.block-title{font-size:10.5pt;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);border-bottom:1px solid #d8d8d8;padding-bottom:3px;margin:0 0 6px;font-weight:800;}
      .resume p.summary{margin:0;font-size:10.5pt;color:#222;}
      .resume .item{margin-bottom:8px;}
      .resume .item:last-child{margin-bottom:0;}
      .resume .item-top{display:flex;justify-content:space-between;gap:8px;font-size:10.5pt;}
      .resume .item-title{font-weight:700;color:#111;}
      .resume .item-sub{color:#333;font-weight:500;}
      .resume .item-date{color:#555;font-size:9.5pt;white-space:nowrap;font-weight:600;}
      .resume ul.bullets{margin:4px 0 0;padding-left:16px;}
      .resume ul.bullets li{font-size:10pt;margin-bottom:2px;color:#222;}
      .resume .tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:2px;}
      .resume .tag{font-size:9pt;background:var(--accent-soft);color:#1a3a99;padding:2px 8px;border-radius:20px;font-weight:600;}
      .resume .lang-row{display:flex;justify-content:space-between;font-size:10pt;margin-bottom:2px;}
      .resume .lang-row .level{color:#555;}
      .printbar{max-width:210mm;margin:0 auto 10px;display:flex;justify-content:flex-end;}
      .printbar button{font-family:inherit;font-weight:700;font-size:13px;padding:8px 14px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:#fff;cursor:pointer;}
      @media print{
        body{background:#fff;padding:0;}
        .printbar{display:none;}
        .page{box-shadow:none;margin:0;padding:0;}
        @page{size:A4;margin:14mm 14mm;}
      }
    `;
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(s.nome) || "Currículo"}${s.cargo ? " — " + escapeHtml(s.cargo) : ""}</title>
<meta name="description" content="Currículo de ${escapeHtml(s.nome) || "candidato"}${s.cargo ? " — " + escapeHtml(s.cargo) : ""}">
<style>${cssResumeVars}</style>
</head>
<body>
  <div class="printbar"><button onclick="window.print()">🖨️ Baixar / imprimir PDF</button></div>
  <div class="page"><div class="resume">${resumeHtml}</div></div>
</body>
</html>`;
  }

  // ---------------- responsive topbar height sync ----------------
  function syncTopbarHeight() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    document.documentElement.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
  }

  // ---------------- init ----------------
  bindSimpleFields();
  setupAreaHint();
  setupLists();
  setupTopbar();
  renderPreview();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight);
  if (window.ResizeObserver) {
    new ResizeObserver(syncTopbarHeight).observe(document.querySelector(".topbar"));
  }
})();
