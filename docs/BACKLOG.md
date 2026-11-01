# Backlog · Ciclo do Bem

Plataforma de captação e fidelização de apoiadores da **Turma do Bem** · Challenge FIAP 2026

Responsável: Asaffe Gabriel Galdino Dos Santos · RM 574554 · 1TDSPB

Atualizado na **Sprint 2**.

Prioridade MoSCoW: **Must** (obrigatório), **Should** (importante), **Could** (desejável).

## Requisitos funcionais

| ID | Requisito | Descrição | Regras de negócio | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| RF01 | Cadastrar doador pessoa física | Cadastro com nome, e-mail, CPF opcional, cidade, UF e quem indicou. | RN02 e-mail e CPF únicos; RN03 só com consentimento LGPD; RN08 começa como LEAD | Must | S2 | Feito |
| RF02 | Cadastrar empresa (PJ) | Cadastro com CNPJ, razão social, setor, porte e relatório ESG; calcula afinidade com a causa. | RN01 apoiador é PF ou PJ; RN02 CNPJ obrigatório e único | Must | S2 | Feito |
| RF03 | Gerir privacidade (LGPD) | O titular consulta os dados guardados e revoga consentimentos. | RN03 revogação registra data e não apaga o histórico; cadastro fica inativo | Must | S2 | Feito |
| RF04 | Registrar doação | Doação única, mensal ou anual por Pix, cartão, boleto, PayPal ou PicPay. | RN04 cada doação tem um doador; RN05 mínimo R$ 5,00 e mensal só no cartão | Must | S2 | Feito |
| RF05 | Gerir campanhas | Cadastrar campanha com período e meta e acompanhar o percentual arrecadado. | RN06 fim ≥ início; doação só entra na campanha dentro do período | Should | S2 | Feito |
| RF06 | Validar comprovante da NFP | O doador envia o print da Nota Fiscal Paulista e o sistema confere o texto. | RN09 aprova só se citar Turma do Bem, doação automática e confirmação; marca doador NFP | Must | S2 | Feito |
| RF07 | Calcular a jornada do doador | Etapa LEAD, PRIMEIRO_DOADOR, RECORRENTE ou EMBAIXADOR recalculada a cada doação ou indicação. | RN08 regras de cada etapa; RN07 ninguém indica a si mesmo | Must | S2 | Feito |
| RF08 | Alertar risco de evasão | Lista de doadores com risco médio ou alto e ação sugerida. | Mensal: 35/60 dias sem doar; avulso: 120/240 dias | Must | S2 | Feito |
| RF09 | Atender pelo chatbot Cici | Chatbot no Telegram com IA: doação, NFP, impacto, retenção, empresas, LGPD e tratamento; responde em texto ou áudio. | RN03, RN05 e RN09 aplicadas na conversa; transfere para humano em casos sensíveis | Must | S2 | Feito |
| RF10 | Site responsivo com formulário | Site institucional e páginas da solução com formulário de contato validado em JavaScript. | Campos obrigatórios e e-mail válido antes do envio | Must | S2 | Feito |
| RF11 | Registrar interações | Histórico de contatos entre a equipe e cada apoiador. | RN10 canal, data/hora e responsável; RN16 colaborador inativo não registra | Should | S3 | A fazer |
| RF12 | Funil de patrocínio | Oportunidades com etapa, próxima ação, prazo e responsável. | RN11 oportunidade aberta sempre com próxima ação e prazo | Must | S3 | Modelado |
| RF13 | Contratos e renovação | Contrato gerado pela oportunidade ganha, com alerta 90 dias antes do fim. | RN12 fim > início, valor > 0, renovação gera novo contrato; RN13 | Must | S2/S3 | Parcial |
| RF14 | Adesão de empresas a campanhas | Registrar empresas patrocinadoras, divulgadoras ou doadoras de produtos. | RN14 uma adesão por empresa em cada campanha | Should | S3 | Modelado |
| RF15 | Radar de editais | Editais com prazo, aderência por programa e candidaturas. | RN15 uma candidatura por par; valor até o máximo do edital | Could | S4 | Modelado |
| RF16 | Painel de indicadores | Arrecadação, % recorrente, doadores por etapa, risco e participação PF × PJ. | Indicadores calculados, nunca digitados | Must | S2/S4 | Parcial |
| RF17 | Integrar Doare e Salesforce | Doações da Doare entram sozinhas; contatos sincronizados com o Salesforce. | Sem digitação manual; e-mail como chave de conciliação | Could | S4 | A fazer |

## Requisitos não funcionais

| ID | Categoria | Requisito | Regras |
|---|---|---|---|
| RNF01 | Privacidade (LGPD) | Consentimento com finalidade, data, hora e canal; nenhum dado de saúde de pacientes na base de captação; CPF exibido mascarado. | RN03 |
| RNF02 | Segurança | Chaves de API e senhas fora do código-fonte; tráfego só por HTTPS; dados de cartão nunca passam pelo chatbot (pagamento em página segura). | RN05 |
| RNF03 | Usabilidade e acessibilidade | Site funcional de 320 px a 1920 px sem rolagem horizontal; textos alternativos, labels e contraste adequado; respostas do chatbot com até 3 frases. | — |
| RNF04 | Desempenho | Chatbot responde em até 5 s em texto e até 10 s em áudio; páginas do site carregam em até 3 s em 4G. | — |
| RNF05 | Disponibilidade | Chatbot disponível 24 horas por dia, 7 dias por semana, com mensagem de contingência se a IA estiver fora. | — |
| RNF06 | Manutenibilidade | Código modular (Python em módulos, Java em pacotes por contexto) e mesmo padrão de nomes no banco, no Java e no Python. | — |
| RNF07 | Integridade dos dados | Banco Oracle com PK, FK, UNIQUE, CHECK e DEFAULT garantindo as regras que não podem depender só da aplicação. | RN01 a RN16 |
| RNF08 | Compatibilidade | Últimas duas versões de Chrome, Edge, Firefox e Safari; Telegram no celular e no computador. | — |
| RNF09 | Rastreabilidade | Código versionado no GitHub com commits frequentes; backlog público com requisitos, regras e status. | — |

## Casos de uso

- **UC01 · Cadastrar doador com consentimento LGPD** — atores: Doador (principal); Colaborador da captação (secundário); Chatbot Cici · regras: RN02, RN03, RN07, RN08 · requisitos: RF01, RF07
- **UC02 · Realizar doação** — atores: Doador (principal); Gateway de pagamento (secundário); Chatbot Cici · regras: RN04, RN05, RN06, RN08 · requisitos: RF04, RF05, RF07
- **UC03 · Validar comprovante da Nota Fiscal Paulista** — atores: Doador NFP (principal); Chatbot Cici; Serviço de IA/leitura de imagem (secundário); Colaborador · regras: RN03, RN09 · requisitos: RF06, RF09
- **UC04 · Gerir funil de patrocínio e renovação de contratos** — atores: Colaborador da captação PJ (principal); Empresa (secundário); Sistema (alerta agendado) · regras: RN11, RN12, RN13, RN14, RN16 · requisitos: RF02, RF12, RF13, RF14

## Regras de negócio

As regras RN01 a RN16 estão descritas no modelo descritivo do banco de dados (Building Relational Database, Sprint 2).
