/* ==========================================================================
   CICLO DO BEM · solucao.js
   Etapas da jornada do doador: ao clicar, mostra o que a plataforma faz.
   ========================================================================== */

const detalhesEtapas = {
    lead: {
        titulo: "Lead",
        texto: "O doador anônimo da Nota Fiscal Paulista manda o print da tela de confirmação. A IA confere se a doação automática é para a Turma do Bem e ele vira um contato, sempre com consentimento."
    },
    primeiro: {
        titulo: "Primeiro doador",
        texto: "Na hora certa, logo depois de validar o comprovante, a Cici convida para a primeira doação por Pix, cartão ou boleto. O valor mínimo é R$ 5,00."
    },
    recorrente: {
        titulo: "Recorrente",
        texto: "Quem assina a doação mensal ou faz três doações vira recorrente. Se passar de 35 dias sem doar, a equipe recebe um alerta de risco antes de perder o doador."
    },
    embaixador: {
        titulo: "Embaixador",
        texto: "O doador recorrente vê o impacto da sua ajuda e ganha um link de indicação. Cada amigo que chega por ele reinicia o ciclo do bem."
    }
};

const botoesEtapa = document.querySelectorAll(".jornada__etapa");
const painelDetalhe = document.getElementById("detalhe-etapa");

/** Marca a etapa escolhida e mostra a explicação dela. */
function mostrarEtapa(chave) {
    const etapa = detalhesEtapas[chave];
    painelDetalhe.innerHTML = "<h3>" + etapa.titulo + "</h3><p>" + etapa.texto + "</p>";
    botoesEtapa.forEach(function (botao) {
        const ativa = botao.dataset.etapa === chave;
        botao.classList.toggle("jornada__etapa--ativa", ativa);
        botao.setAttribute("aria-selected", ativa ? "true" : "false");
    });
}

botoesEtapa.forEach(function (botao) {
    botao.addEventListener("click", function () { mostrarEtapa(botao.dataset.etapa); });
});
