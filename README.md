# Sistema de Retenção e Reengajamento de Alunos para Academias

Projeto de Inovação — Análise e Desenvolvimento de Sistemas, IFBA Campus Valença (2026.2).
**Etapa 3 — Projeto de Implementação de Software.**

Aplicação web para ajudar academias a perceber quando um aluno está se afastando,
acompanhando a frequência de cada um e registrando as ações de reengajamento da equipe.

## Situação atual

As telas de painel, alunos, detalhe do aluno e frequência já estão ligadas ao banco
de dados MySQL por meio de uma API em Node.js com Express. O login e o registro de
intervenções ainda são apenas visuais.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS3, Bootstrap 5.3, Bootstrap Icons e JavaScript |
| Gráficos | Chart.js 4 |
| Fonte | Plus Jakarta Sans (Google Fonts) |
| Back-end | Node.js com Express |
| Banco de dados | MySQL (MariaDB) do XAMPP, acessado pela biblioteca `mysql2` |
| Versionamento | Git / GitHub |

## Arquitetura

```
Navegador (HTML + CSS + JavaScript)
        │  fetch (JSON)
        ▼
Back-end Node.js + Express  ── API em /api/...
        │  mysql2
        ▼
MySQL (XAMPP)
```

O navegador não acessa o banco diretamente: o JavaScript das telas chama a API,
e o back-end valida os dados e executa as consultas no MySQL.

## Visual

Layout com menu lateral, cards arredondados e cores suaves. É responsivo: no
celular, o menu lateral vira um menu deslizante (offcanvas do Bootstrap), os
indicadores ficam em duas colunas e algumas colunas da lista de alunos são ocultadas.

## Estrutura

```
server.js              servidor Express: entrega as telas e as rotas da API
db.js                  conexão com o MySQL
package.json           dependências do projeto
public/                telas (front-end)
  login.html           tela de acesso
  dashboard.html       painel com indicadores e alunos que precisam de atenção
  alunos.html          lista, busca e cadastro de alunos
  aluno.html           detalhe do aluno: gráfico de presenças por semana
  frequencia.html      registro e consulta de presenças
  css/app.css          estilos próprios
  js/                  JavaScript de cada tela (api.js é compartilhado)
banco/
  esquema_inicial.sql  criação do banco e das tabelas
  dados_exemplo.sql    dados fictícios para demonstração
```

## Tabelas

- `academias`
- `planos`
- `alunos`
- `frequencias` (uma presença por aluno por dia)

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/dashboard` | Indicadores e alunos que precisam de atenção |
| GET | `/api/alunos?busca=&status=` | Lista e busca alunos |
| POST | `/api/alunos` | Cadastra um aluno |
| GET | `/api/alunos/:id` | Detalhe do aluno e presenças por semana |
| GET | `/api/planos` | Lista os planos |
| GET | `/api/frequencias?data=` | Presenças de um dia |
| POST | `/api/frequencias` | Registra uma presença |

Nível de atenção: **Alto** com 14 dias ou mais sem presença, **Atenção** com 7 dias ou mais.

## Como executar

Pré-requisitos: [XAMPP](https://www.apachefriends.org) e [Node.js](https://nodejs.org) (versão 18 ou superior).

1. Abra o painel do XAMPP e clique em **Start** no **MySQL** (e no **Apache**, para usar o phpMyAdmin).
2. Acesse <http://localhost/phpmyadmin>, abra a aba **SQL**, cole o conteúdo de
   `banco/esquema_inicial.sql` e clique em **Executar**. Depois faça o mesmo com
   `banco/dados_exemplo.sql`.
3. Na pasta do projeto, instale as dependências e inicie o servidor:
   ```bash
   npm install
   npm start
   ```
4. Acesse <http://localhost:3000>.

A conexão usa o padrão do XAMPP (usuário `root`, sem senha, porta 3306). Para mudar,
defina as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.

## Próximos passos

1. Login com usuários da academia (gestor e funcionário).
2. Edição e inativação de alunos e cadastro de planos pela tela.
3. Tabela e registro de intervenções.
4. Regra de análise comparando a frequência recente com o histórico do aluno.
5. Testes.
6. Integração com IA para sugestões de reengajamento.
