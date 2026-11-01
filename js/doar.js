/* ==========================================================================
   CICLO DO BEM · doar.js
   Simulador de doação (protótipo da solução) e validador do comprovante
   da Nota Fiscal Paulista. Regras de negócio aplicadas:
   - RN05: valor mínimo de R$ 5,00 e doação mensal só no cartão de crédito
   - RN09: comprovante aprovado só com Turma do Bem + doação automática + confirmação
   A página também aceita os dados do link enviado pela Cici no Telegram:
   doar.html?valor=30&forma=cartao_credito&tipo=mensal  ou  ?indicacao=123
   ========================================================================== */

const VALOR_MINIMO = 5;
const CUSTO_CONSULTA = 50;          // valor aproximado usado só para ilustrar o impacto
const NOMES_FORMA = { pix: "Pix", cartao_credito: "Cartão de crédito", boleto: "Boleto", paypal: "PayPal", picpay: "PicPay" };
const NOMES_TIPO = { unica: "Doação única", mensal: "Doação mensal", anual: "Doação anual" };

const estado = { tipo: "unica", valor: 50, forma: "pix" };

const botoesTipo = document.querySelectorAll("[data-tipo]");
const botoesValor = document.querySelectorAll("[data-valor]");
const campoOutroValor = document.getElementById("valor-outro");
const opcoesForma = document.querySelectorAll('input[name="forma"]');
const dicaForma = document.getElementById("dica-forma");

/* ---------- regras ---------- */

/** RN05: só cartão de crédito pode ser usado na doação mensal. */
function formaPermitida(tipo, forma) {
    return tipo !== "mensal" || forma === "cartao_credito";
}

/** Texto de impacto calculado a partir do valor e da frequência. */
function calcularImpacto(valor, tipo) {
    const valorAnual = tipo === "mensal" ? valor * 12 : valor;
    const consultas = Math.max(1, Math.floor(valorAnual / CUSTO_CONSULTA));
    const periodo = tipo === "mensal" ? " por ano" : "";
    return "Ajuda a manter cerca de " + consultas + (consultas === 1 ? " consulta" : " consultas") +
        periodo + " de jovens no Dentista do Bem.";
}

/* ---------- interface ---------- */

/** Atualiza o resumo lateral com o estado atual. */
function atualizarResumo() {
    document.getElementById("resumo-valor").textContent = formatarMoeda(estado.valor) + (estado.tipo === "mensal" ? "/mês" : "");
    document.getElementById("resumo-detalhe").textContent = NOMES_TIPO[estado.tipo] + ", " + NOMES_FORMA[estado.forma];
    document.getElementById("resumo-impacto").textContent = calcularImpacto(estado.valor, estado.tipo);
    document.getElementById("aviso-doacao").classList.add("oculto");
}

/** Habilita/desabilita as formas de pagamento conforme o tipo de doação. */
function atualizarFormas() {
    opcoesForma.forEach(function (opcao) {
        const permitida = formaPermitida(estado.tipo, opcao.value);
        opcao.disabled = !permitida;
        opcao.closest("label").classList.toggle("formas--desabilitada", !permitida);
    });
    if (!formaPermitida(estado.tipo, estado.forma)) {
        estado.forma = "cartao_credito";
        document.querySelector('input[value="cartao_credito"]').checked = true;
    }
    dicaForma.classList.toggle("oculto", estado.tipo !== "mensal");
}

function escolherTipo(tipo) {
    estado.tipo = tipo;
    botoesTipo.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tipo === tipo ? "true" : "false"); });
    atualizarFormas();
    atualizarResumo();
}

function escolherValor(valor) {
    estado.valor = valor;
    botoesValor.forEach(function (b) { b.classList.toggle("valores__botao--ativo", Number(b.dataset.valor) === valor); });
    atualizarResumo();
}

botoesTipo.forEach(function (botao) {
    botao.addEventListener("click", function () { escolherTipo(botao.dataset.tipo); });
});

botoesValor.forEach(function (botao) {
    botao.addEventListener("click", function () {
        campoOutroValor.value = "";
        limparErroValor();
        escolherValor(Number(botao.dataset.valor));
    });
});

function limparErroValor() {
    campoOutroValor.closest(".campo").classList.remove("campo--erro");
    document.getElementById("erro-valor").textContent = "";
}

/** Valida o "outro valor" enquanto a pessoa digita. Devolve true se estiver ok. */
function validarOutroValor() {
    const texto = campoOutroValor.value.trim();
    if (texto === "") { limparErroValor(); return true; }
    const valor = Number(texto.replace(",", "."));
    if (isNaN(valor) || valor < VALOR_MINIMO) {
        campoOutroValor.closest(".campo").classList.add("campo--erro");
        document.getElementById("erro-valor").textContent = "O valor mínimo é R$ 5,00.";
        return false;
    }
    limparErroValor();
    escolherValor(valor);
    return true;
}

campoOutroValor.addEventListener("input", validarOutroValor);

opcoesForma.forEach(function (opcao) {
    opcao.addEventListener("change", function () {
        estado.forma = opcao.value;
        atualizarResumo();
    });
});

document.getElementById("botao-doar").addEventListener("click", function () {
    const aviso = document.getElementById("aviso-doacao");
    if (!validarOutroValor()) {
        aviso.className = "aviso aviso--erro";
        aviso.textContent = "Corrija o valor antes de confirmar.";
        return;
    }
    aviso.className = "aviso aviso--sucesso";
    aviso.textContent = "Simulação concluída! " + NOMES_TIPO[estado.tipo] + " de " + formatarMoeda(estado.valor) +
        " via " + NOMES_FORMA[estado.forma] + ". Na versão final, aqui abriria o pagamento seguro.";
});

/** Lê os parâmetros do link enviado pela Cici (?valor=&forma=&tipo=&indicacao=). */
function aplicarParametrosDoLink() {
    const parametros = new URLSearchParams(window.location.search);
    const tipo = parametros.get("tipo");
    const valor = Number(parametros.get("valor"));
    const forma = parametros.get("forma");
    if (tipo && NOMES_TIPO[tipo]) { escolherTipo(tipo); }
    if (forma && NOMES_FORMA[forma] && formaPermitida(estado.tipo, forma)) {
        estado.forma = forma;
        document.querySelector('input[value="' + forma + '"]').checked = true;
    }
    if (valor >= VALOR_MINIMO) {
        campoOutroValor.value = valor;
        escolherValor(valor);
    }
    if (parametros.get("indicacao")) {
        document.getElementById("resumo-indicacao").classList.remove("oculto");
    }
}

atualizarFormas();
aplicarParametrosDoLink();
atualizarResumo();

/* ---------- validador do comprovante da NFP ---------- */
const formNfp = document.getElementById("form-nfp");
const textoNfp = document.getElementById("texto-nfp");
const resultadoNfp = document.getElementById("resultado-nfp");

/** RN09: confere as três condições e devolve um objeto com o resultado de cada uma. */
function conferirComprovante(texto) {
    const t = normalizarTexto(texto);
    return {
        "Entidade Turma do Bem": t.includes("turma do bem"),
        "Doação automática": t.includes("automatica"),
        "Confirmação da operação": /confirm|sucesso|cadastrad/.test(t)
    };
}

formNfp.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const texto = textoNfp.value.trim();
    const erro = document.getElementById("erro-nfp");
    resultadoNfp.innerHTML = "";

    if (texto.length < 10) {
        textoNfp.closest(".campo").classList.add("campo--erro");
        erro.textContent = "Cole o texto do comprovante (pelo menos 10 caracteres).";
        return;
    }
    textoNfp.closest(".campo").classList.remove("campo--erro");
    erro.textContent = "";

    const verificacoes = conferirComprovante(texto);
    let aprovado = true;
    Object.keys(verificacoes).forEach(function (item) {
        const ok = verificacoes[item];
        if (!ok) { aprovado = false; }
        const linha = document.createElement("li");
        linha.className = ok ? "validador__ok" : "validador__falta";
        linha.textContent = item + (ok ? ": encontrado" : ": não encontrado");
        resultadoNfp.appendChild(linha);
    });
    const final = document.createElement("li");
    final.className = "aviso " + (aprovado ? "aviso--sucesso" : "aviso--erro");
    final.textContent = aprovado
        ? "Comprovante aceito. A pessoa passa a ser marcada como doadora da Nota Fiscal Paulista."
        : "Comprovante recusado. Peça um novo print da tela final de confirmação.";
    resultadoNfp.appendChild(final);
});
