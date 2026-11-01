/* ==========================================================================
   CICLO DO BEM · faq.js
   Acordeão das perguntas (abre uma de cada vez) e filtro por assunto.
   ========================================================================== */

const perguntas = document.querySelectorAll(".faq__pergunta");
const botoesFiltro = document.querySelectorAll("[data-filtro]");

/** Abre ou fecha uma resposta, ajustando a altura para a animação. */
function alternarResposta(botao, abrir) {
    const resposta = document.getElementById(botao.getAttribute("aria-controls"));
    botao.setAttribute("aria-expanded", abrir ? "true" : "false");
    resposta.style.maxHeight = abrir ? resposta.scrollHeight + "px" : "0";
}

perguntas.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const estaAberta = botao.getAttribute("aria-expanded") === "true";
        // fecha as outras para manter só uma aberta
        perguntas.forEach(function (outro) {
            if (outro !== botao) { alternarResposta(outro, false); }
        });
        alternarResposta(botao, !estaAberta);
    });
});

/** Mostra só as perguntas da categoria escolhida. */
function filtrarPerguntas(categoria) {
    document.querySelectorAll(".faq__item").forEach(function (item) {
        const mostrar = categoria === "todas" || item.dataset.categoria === categoria;
        item.classList.toggle("oculto", !mostrar);
    });
    botoesFiltro.forEach(function (botao) {
        botao.setAttribute("aria-selected", botao.dataset.filtro === categoria ? "true" : "false");
    });
}

botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () { filtrarPerguntas(botao.dataset.filtro); });
});
