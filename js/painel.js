/* ==========================================================================
   CICLO DO BEM · painel.js
   Protótipo do painel da equipe: indicadores calculados, abas, tabela de
   doadores com busca e filtros, contratos com alerta de renovação (90 dias)
   e progresso das campanhas. Dados fictícios guardados em listas.
   As regras são as mesmas do programa em Python e das classes Java.
   ========================================================================== */

const HOJE = new Date();

/** Data de N dias atrás (negativo = no futuro). */
function diasAtras(n) {
    const d = new Date(HOJE);
    d.setDate(d.getDate() - n);
    return d;
}

const doadores = [
    { nome: "Ana Souza", cidade: "São Paulo", mensal: true, doacoes: [{ v: 20, d: 95 }, { v: 20, d: 65 }, { v: 150, d: 5 }], indicacoes: 1 },
    { nome: "Bruno Lima", cidade: "Campinas", mensal: true, doacoes: [{ v: 20, d: 72 }], indicacoes: 0 },
    { nome: "Carla Mendes", cidade: "Sorocaba", mensal: false, doacoes: [], indicacoes: 0 },
    { nome: "Diego Rocha", cidade: "Santos", mensal: false, doacoes: [{ v: 100, d: 150 }, { v: 80, d: 50 }], indicacoes: 0 },
    { nome: "Elisa Prado", cidade: "São Paulo", mensal: false, doacoes: [{ v: 50, d: 260 }], indicacoes: 0 },
    { nome: "Fábio Nunes", cidade: "Guarulhos", mensal: true, doacoes: [{ v: 30, d: 40 }, { v: 30, d: 10 }], indicacoes: 0 },
    { nome: "Gabriela Reis", cidade: "Osasco", mensal: false, doacoes: [{ v: 25, d: 20 }, { v: 25, d: 15 }, { v: 25, d: 3 }], indicacoes: 2 }
];

const contratos = [
    { empresa: "Sorriso Farma S.A.", valor: 120000, venceEm: 60 },
    { empresa: "Mercado Bom Preço", valor: 45000, venceEm: 25 },
    { empresa: "Clínica Boa Saúde", valor: 30000, venceEm: 210 },
    { empresa: "Tech Para Todos", valor: 80000, venceEm: 330 }
];

const campanhas = [
    { nome: "Natal do Bem", meta: 5000, arrecadado: 3150 },
    { nome: "Dia das Crianças", meta: 3000, arrecadado: 3420 },
    { nome: "Sorriso de Volta (Apolônias)", meta: 8000, arrecadado: 2200 }
];

/* ---------- regras de negócio ---------- */

function totalDoado(doador) {
    return doador.doacoes.reduce(function (soma, d) { return soma + d.v; }, 0);
}

function diasSemDoar(doador) {
    if (doador.doacoes.length === 0) { return null; }
    return Math.min.apply(null, doador.doacoes.map(function (d) { return d.d; }));
}

/** RN08: etapa da jornada. */
function etapaJornada(doador) {
    const quantidade = doador.doacoes.length;
    if (quantidade === 0) { return "LEAD"; }
    const recorrente = doador.mensal || quantidade >= 3;
    if (recorrente && doador.indicacoes > 0) { return "EMBAIXADOR"; }
    if (recorrente) { return "RECORRENTE"; }
    return "PRIMEIRO_DOADOR";
}

/** Risco de evasão: mensal 35/60 dias; avulso 120/240 dias. */
function nivelRisco(doador) {
    const dias = diasSemDoar(doador);
    if (dias === null) { return "SEM DOAÇÕES"; }
    const limites = doador.mensal ? [35, 60] : [120, 240];
    if (dias > limites[1]) { return "ALTO"; }
    if (dias > limites[0]) { return "MÉDIO"; }
    return "BAIXO";
}

function acaoSugerida(doador) {
    const risco = nivelRisco(doador);
    const etapa = etapaJornada(doador);
    if (risco === "ALTO") { return "Ligar e mostrar o impacto do último mês"; }
    if (risco === "MÉDIO") { return "Mensagem de reativação"; }
    if (etapa === "LEAD") { return "Convidar a doar R$ 20/mês"; }
    if (etapa === "PRIMEIRO_DOADOR") { return "Convidar para a doação mensal"; }
    if (etapa === "RECORRENTE") { return "Convidar a indicar amigos"; }
    return "Enviar relatório de impacto";
}

/* ---------- indicadores ---------- */
function mostrarIndicadores() {
    const arrecadadoPf = doadores.reduce(function (s, d) { return s + totalDoado(d); }, 0);
    const recorrentes = doadores.filter(function (d) { return ["RECORRENTE", "EMBAIXADOR"].includes(etapaJornada(d)); }).length;
    const emRisco = doadores.filter(function (d) { return nivelRisco(d) === "ALTO" || nivelRisco(d) === "MÉDIO"; }).length;
    const receitaPj = contratos.reduce(function (s, c) { return s + c.valor; }, 0);
    const aVencer = contratos.filter(function (c) { return c.venceEm <= 90; }).length;
    const participacaoPf = arrecadadoPf / (arrecadadoPf + receitaPj) * 100;

    const indicadores = [
        [doadores.length, "doadores PF"],
        [recorrentes, "recorrentes ou embaixadores"],
        [emRisco, "em risco de evasão"],
        [formatarMoeda(arrecadadoPf), "doações PF"],
        [aVencer, "contratos vencem em 90 dias"],
        [participacaoPf.toFixed(1).replace(".", ",") + "%", "da receita vem de PF"]
    ];
    document.getElementById("indicadores").innerHTML = indicadores.map(function (i) {
        return '<div class="indicador"><div class="indicador__valor">' + i[0] + '</div><div class="indicador__rotulo">' + i[1] + "</div></div>";
    }).join("");
}

/* ---------- tabela de doadores com filtros ---------- */
const campoBusca = document.getElementById("filtro-busca");
const filtroEtapa = document.getElementById("filtro-etapa");
const filtroRisco = document.getElementById("filtro-risco");

function classeRisco(risco) {
    if (risco === "ALTO") { return "etiqueta etiqueta--alto"; }
    if (risco === "MÉDIO") { return "etiqueta etiqueta--medio"; }
    return "etiqueta";
}

function mostrarDoadores() {
    const busca = normalizarTexto(campoBusca.value.trim());
    const filtrados = doadores.filter(function (d) {
        const textoOk = busca === "" || normalizarTexto(d.nome + " " + d.cidade).includes(busca);
        const etapaOk = filtroEtapa.value === "" || etapaJornada(d) === filtroEtapa.value;
        const riscoOk = filtroRisco.value === "" || nivelRisco(d) === filtroRisco.value;
        return textoOk && etapaOk && riscoOk;
    });
    // mais urgentes primeiro: mais dias sem doar no topo
    filtrados.sort(function (a, b) { return (diasSemDoar(b) || 0) - (diasSemDoar(a) || 0); });

    document.getElementById("tabela-doadores").innerHTML = filtrados.map(function (d) {
        const dias = diasSemDoar(d);
        return "<tr><td><strong>" + d.nome + "</strong><br><small>" + d.cidade + "</small></td>" +
            "<td>" + etapaJornada(d).replace("_", " ") + "</td>" +
            "<td>" + formatarMoeda(totalDoado(d)) + "</td>" +
            "<td>" + (dias === null ? "nunca doou" : dias + " dias") + "</td>" +
            '<td><span class="' + classeRisco(nivelRisco(d)) + '">' + nivelRisco(d) + "</span></td>" +
            "<td>" + acaoSugerida(d) + "</td></tr>";
    }).join("") || '<tr><td colspan="6">Nenhum doador encontrado com esses filtros.</td></tr>';

    document.getElementById("contagem-doadores").textContent = filtrados.length + " de " + doadores.length + " doadores exibidos.";
}

[campoBusca, filtroEtapa, filtroRisco].forEach(function (campo) {
    campo.addEventListener("input", mostrarDoadores);
    campo.addEventListener("change", mostrarDoadores);
});

/* ---------- contratos ---------- */
function mostrarContratos() {
    const ordenados = contratos.slice().sort(function (a, b) { return a.venceEm - b.venceEm; });
    document.getElementById("tabela-contratos").innerHTML = ordenados.map(function (c) {
        const vencimento = diasAtras(-c.venceEm).toLocaleDateString("pt-BR");
        const alerta = c.venceEm <= 90;
        return "<tr><td>" + c.empresa + "</td><td>" + formatarMoeda(c.valor) + "</td><td>" + c.venceEm + " dias (" + vencimento + ")</td>" +
            '<td><span class="' + (alerta ? "etiqueta etiqueta--alto" : "etiqueta") + '">' + (alerta ? "Renovar agora" : "Em dia") + "</span></td></tr>";
    }).join("");
}

/* ---------- campanhas ---------- */
function mostrarCampanhas() {
    document.getElementById("lista-campanhas").innerHTML = campanhas.map(function (c) {
        const pct = Math.round(c.arrecadado / c.meta * 100);
        return '<article><h3>' + c.nome + "</h3><p>" + formatarMoeda(c.arrecadado) + " de " + formatarMoeda(c.meta) + " (<strong>" + pct + "%</strong>)</p>" +
            '<div class="barra" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><div class="barra__preenchimento" style="width:' + Math.min(pct, 100) + '%"></div></div></article>';
    }).join("");
}

/* ---------- abas ---------- */
const botoesAba = document.querySelectorAll("[data-aba]");

function abrirAba(id) {
    botoesAba.forEach(function (botao) {
        const ativa = botao.dataset.aba === id;
        botao.setAttribute("aria-selected", ativa ? "true" : "false");
        document.getElementById(botao.dataset.aba).classList.toggle("oculto", !ativa);
    });
}

botoesAba.forEach(function (botao) {
    botao.addEventListener("click", function () { abrirAba(botao.dataset.aba); });
});

mostrarIndicadores();
mostrarDoadores();
mostrarContratos();
mostrarCampanhas();
