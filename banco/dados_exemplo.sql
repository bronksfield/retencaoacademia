-- Dados FICTÍCIOS para demonstração.
-- Executar depois do esquema_inicial.sql. As datas são relativas ao dia de hoje,
-- então o painel sempre mostra alunos em cada situação.

SET NAMES utf8mb4;
USE retencao_academia;

INSERT INTO academias (id, nome, cnpj, email, telefone, cidade)
VALUES (1, 'Academia Exemplo', '12345678000199', 'contato@academiaexemplo.com', '75999990000', 'Valença');

INSERT INTO planos (id, academia_id, nome, valor_mensal, duracao_meses) VALUES
  (1, 1, 'Mensal', 99.90, 1),
  (2, 1, 'Trimestral', 269.90, 3),
  (3, 1, 'Semestral', 499.90, 6);

INSERT INTO alunos (id, academia_id, plano_id, nome, email, telefone, data_matricula, status) VALUES
  (1, 1, 1, 'Ana Souza',        'ana@email.com',      '75988880001', '2026-03-10', 'ativo'),
  (2, 1, 2, 'Bruno Almeida',    'bruno@email.com',    '75988880002', '2026-05-22', 'ativo'),
  (3, 1, 1, 'Carlos Lima',      'carlos@email.com',   '75988880003', '2026-02-02', 'ativo'),
  (4, 1, 3, 'Juliana Reis',     'juliana@email.com',  '75988880004', '2026-01-15', 'ativo'),
  (5, 1, 1, 'Marcos Oliveira',  'marcos@email.com',   '75988880005', '2026-07-08', 'ativo'),
  (6, 1, 2, 'Patrícia Santos',  'patricia@email.com', '75988880006', '2026-04-30', 'ativo'),
  (7, 1, 1, 'Rafael Costa',     'rafael@email.com',   '75988880007', '2026-06-12', 'ativo'),
  (8, 1, 2, 'Fernanda Rocha',   'fernanda@email.com', '75988880008', '2026-03-03', 'ativo'),
  (9, 1, 1, 'Lucas Pereira',    'lucas@email.com',    '75988880009', '2026-08-19', 'ativo'),
  (10, 1, 3, 'Mariana Dias',    'mariana@email.com',  '75988880010', '2026-02-27', 'ativo'),
  (11, 1, 1, 'Thiago Martins',  'thiago@email.com',   '75988880011', '2026-09-01', 'inativo');

-- Presenças: (aluno, dias atrás, hora)
INSERT INTO frequencias (aluno_id, data, hora)
SELECT aluno_id, DATE_SUB(CURDATE(), INTERVAL dias DAY), hora FROM (
  SELECT 1 AS aluno_id, 18 AS dias, '07:10' AS hora UNION ALL SELECT 1, 20, '07:05' UNION ALL SELECT 1, 23, '07:15'
  UNION ALL SELECT 1, 27, '07:00' UNION ALL SELECT 1, 30, '07:20' UNION ALL SELECT 1, 34, '07:10'
  UNION ALL SELECT 3, 15, '18:30' UNION ALL SELECT 3, 17, '18:40' UNION ALL SELECT 3, 22, '18:20' UNION ALL SELECT 3, 25, '18:35'
  UNION ALL SELECT 4, 14, '06:30' UNION ALL SELECT 4, 16, '06:25' UNION ALL SELECT 4, 21, '06:40'
  UNION ALL SELECT 5, 9, '19:00' UNION ALL SELECT 5, 12, '19:10' UNION ALL SELECT 5, 16, '19:05'
  UNION ALL SELECT 6, 8, '12:00' UNION ALL SELECT 6, 11, '12:10' UNION ALL SELECT 6, 15, '12:05'
  UNION ALL SELECT 7, 7, '17:30' UNION ALL SELECT 7, 10, '17:45' UNION ALL SELECT 7, 13, '17:20'
  UNION ALL SELECT 2, 0, '06:12' UNION ALL SELECT 2, 2, '06:15' UNION ALL SELECT 2, 4, '06:10' UNION ALL SELECT 2, 7, '06:20'
  UNION ALL SELECT 8, 0, '06:40' UNION ALL SELECT 8, 1, '06:35' UNION ALL SELECT 8, 3, '06:45' UNION ALL SELECT 8, 6, '06:30'
  UNION ALL SELECT 9, 0, '07:05' UNION ALL SELECT 9, 2, '07:00' UNION ALL SELECT 9, 5, '07:10'
  UNION ALL SELECT 10, 0, '07:30' UNION ALL SELECT 10, 1, '07:25' UNION ALL SELECT 10, 4, '07:35'
) AS presencas;
