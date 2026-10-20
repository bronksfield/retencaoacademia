# Sistema de Retenção e Reengajamento de Alunos para Academias

Projeto de Inovação — Análise e Desenvolvimento de Sistemas, IFBA Campus Valença (2026.2).
**Etapa 3 — Projeto de Implementação de Software.**

Aplicação web para ajudar academias a perceber quando um aluno está se afastando,
acompanhando a frequência de cada um e registrando as ações de reengajamento da equipe.

## Situação atual

Esta versão é um **protótipo das telas**, com dados fictícios, ainda sem ligação
com o banco de dados. O esquema inicial do banco foi criado com as tabelas principais.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS3, Bootstrap 5.3 e Bootstrap Icons |
| Banco de dados | PostgreSQL (Supabase) |
| Versionamento | Git / GitHub |

## Estrutura

```
login.html         tela de acesso
dashboard.html     painel com indicadores e alunos que precisam de atenção
alunos.html        lista de alunos
aluno.html         detalhe do aluno: histórico de presenças e intervenções
frequencia.html    registro de presenças
css/app.css        estilos próprios
banco/             esquema inicial do banco (SQL)
```

## Tabelas criadas

- `academias`
- `planos`
- `alunos`
- `frequencias`

## Como visualizar

Abra o arquivo `index.html` no navegador. Ele leva à tela de login, e o botão
**Entrar** abre o painel.

## Próximos passos

1. Ligar as telas ao banco (Supabase) e implementar o login.
2. Cadastro de alunos, planos e registro de frequência funcionando.
3. Regras de análise de frequência e classificação do nível de atenção.
4. Perfis de usuário (gestor e funcionário) e regras de acesso no banco.
5. Tabela e registro de intervenções.
6. Testes.
7. Integração com IA para sugestões de reengajamento.
