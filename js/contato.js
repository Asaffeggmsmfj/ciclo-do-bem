/* ==========================================================================
   CICLO DO BEM · contato.js
   Validação do formulário de contato SEM o atributo required:
   - campos obrigatórios, e-mail e telefone válidos, tamanho mínimo da mensagem
   - mensagens de erro amigáveis e borda vermelha no campo com problema
   - event.preventDefault() impede o envio enquanto houver erro
   - contador de caracteres e campo "empresa" que só aparece quando necessário
   ========================================================================== */

const formContato = document.getElementById("form-contato");
const campoAssunto = document.getElementById("assunto");
const blocoEmpresa = document.getElementById("campo-empresa");
const campoMensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador-mensagem");
const avisoSucesso = document.getElementById("aviso-sucesso");

/** Mostra a mensagem de erro de um campo e pinta a borda de vermelho. */
function mostrarErro(idCampo, mensagem) {
    const campo = document.getElementById(idCampo);
    campo.closest(".campo").classList.add("campo--erro");
    campo.setAttribute("aria-invalid", "true");
    document.getElementById("erro-" + idCampo).textContent = mensagem;
}

/** Limpa o erro de um campo. */
function limparErro(idCampo) {
    const campo = document.getElementById(idCampo);
    campo.closest(".campo").classList.remove("campo--erro");
    campo.removeAttribute("aria-invalid");
    document.getElementById("erro-" + idCampo).textContent = "";
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function telefoneValido(telefone) {
    const numeros = telefone.replace(/\D/g, "");
    return numeros.length === 10 || numeros.length === 11;
}

/** Valida um campo e devolve true se estiver correto. */
function validarCampo(id) {
    const valor = document.getElementById(id).value.trim();
    let erro = "";

    if (id === "nome") {
        if (valor === "") erro = "Informe seu nome.";
        else if (valor.split(/\s+/).length < 2) erro = "Digite nome e sobrenome.";
        else if (/\d/.test(valor)) erro = "O nome não pode ter números.";
    }
    if (id === "email") {
        if (valor === "") erro = "Informe seu e-mail.";
        else if (!emailValido(valor)) erro = "E-mail inválido. Exemplo: nome@email.com";
    }
    if (id === "telefone" && valor !== "" && !telefoneValido(valor)) {
        erro = "Telefone com DDD, ex.: (11) 91234-5678.";
    }
    if (id === "assunto" && valor === "") {
        erro = "Escolha um assunto.";
    }
    if (id === "empresa" && campoAssunto.value === "empresa" && valor === "") {
        erro = "Informe o nome da empresa.";
    }
    if (id === "mensagem") {
        if (valor === "") erro = "Escreva sua mensagem.";
        else if (valor.length < 10) erro = "A mensagem precisa ter pelo menos 10 caracteres.";
    }
    if (id === "lgpd" && !document.getElementById("lgpd").checked) {
        erro = "É preciso autorizar o uso dos dados para podermos responder.";
    }

    if (erro) {
        mostrarErro(id, erro);
        return false;
    }
    limparErro(id);
    return true;
}

const camposValidados = ["nome", "email", "telefone", "assunto", "empresa", "mensagem", "lgpd"];

// valida cada campo quando o usuário sai dele (blur) e limpa o erro enquanto digita
camposValidados.forEach(function (id) {
    const campo = document.getElementById(id);
    campo.addEventListener("blur", function () { validarCampo(id); });
    campo.addEventListener("input", function () {
        if (campo.closest(".campo").classList.contains("campo--erro")) { validarCampo(id); }
    });
});

// campo "empresa" só aparece quando o assunto é empresa
campoAssunto.addEventListener("change", function () {
    blocoEmpresa.classList.toggle("oculto", campoAssunto.value !== "empresa");
    if (campoAssunto.value !== "empresa") { limparErro("empresa"); }
});

// contador de caracteres da mensagem
function atualizarContador() {
    contador.textContent = campoMensagem.value.length + "/500";
}
campoMensagem.addEventListener("input", atualizarContador);

// envio
formContato.addEventListener("submit", function (evento) {
    evento.preventDefault();               // nunca envia direto: primeiro valida
    avisoSucesso.classList.add("oculto");

    let tudoCerto = true;
    camposValidados.forEach(function (id) {
        if (!validarCampo(id)) { tudoCerto = false; }
    });

    if (!tudoCerto) {
        // leva o foco para o primeiro campo com erro
        const primeiroErro = formContato.querySelector(".campo--erro input, .campo--erro select, .campo--erro textarea");
        if (primeiroErro) { primeiroErro.focus(); }
        return;
    }

    const primeiroNome = document.getElementById("nome").value.trim().split(" ")[0];
    avisoSucesso.textContent = "Obrigado, " + primeiroNome + "! Sua mensagem foi registrada e responderemos em até 2 dias úteis.";
    avisoSucesso.classList.remove("oculto");
    formContato.reset();
    blocoEmpresa.classList.add("oculto");
    atualizarContador();
});
