/* ==========================================================================
   CICLO DO BEM · main.js
   Funções usadas em TODAS as páginas:
   - menu hambúrguer (abrir/fechar, fechar ao clicar em um link ou na tecla Esc)
   - botão "voltar ao topo"
   - ano atual no rodapé
   - formatarMoeda(): função reutilizável pelas outras páginas
   ========================================================================== */

/** Formata um número como moeda brasileira: 1234.5 -> "R$ 1.234,50". */
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Remove acentos e deixa minúsculo, para comparar textos com segurança. */
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* ---------- Menu hambúrguer ---------- */
const botaoMenu = document.querySelector(".menu-botao");
const menu = document.querySelector(".menu");

function abrirMenu() {
    menu.classList.add("menu--aberto");
    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.setAttribute("aria-label", "Fechar menu");
}

function fecharMenu() {
    menu.classList.remove("menu--aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
}

function toggleMenu() {
    const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
    if (aberto) {
        fecharMenu();
    } else {
        abrirMenu();
    }
}

botaoMenu.addEventListener("click", toggleMenu);

// fecha o menu ao escolher uma página (útil no celular)
menu.querySelectorAll(".menu__link").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
});

// fecha com a tecla Esc
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        fecharMenu();
    }
});

// se a tela for alargada para desktop com o menu aberto, volta ao estado normal
window.addEventListener("resize", function () {
    if (window.innerWidth >= 992) {
        fecharMenu();
    }
});

/* ---------- Voltar ao topo ---------- */
const botaoTopo = document.querySelector(".voltar-topo");

function atualizarBotaoTopo() {
    botaoTopo.classList.toggle("voltar-topo--visivel", window.scrollY > 400);
}

window.addEventListener("scroll", atualizarBotaoTopo);
botaoTopo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Ano no rodapé ---------- */
document.getElementById("ano-atual").textContent = new Date().getFullYear();
