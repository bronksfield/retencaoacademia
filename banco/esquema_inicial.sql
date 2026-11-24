-- Sistema de Retenção e Reengajamento de Alunos para Academias
-- Esquema do banco de dados (MySQL / MariaDB do XAMPP)
--
-- Como aplicar: no phpMyAdmin (http://localhost/phpmyadmin), aba SQL,
-- cole este arquivo inteiro e clique em Executar.

CREATE DATABASE IF NOT EXISTS retencao_academia
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET NAMES utf8mb4;
USE retencao_academia;

CREATE TABLE academias (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(120) NOT NULL,
  cnpj       CHAR(14) UNIQUE,
  email      VARCHAR(120),
  telefone   VARCHAR(11),
  cidade     VARCHAR(80),
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE planos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  academia_id   INT NOT NULL,
  nome          VARCHAR(80) NOT NULL,
  valor_mensal  DECIMAL(10, 2) NOT NULL,
  duracao_meses TINYINT UNSIGNED NOT NULL DEFAULT 1,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (academia_id) REFERENCES academias (id)
) ENGINE=InnoDB;

CREATE TABLE alunos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  academia_id    INT NOT NULL,
  plano_id       INT NULL,
  nome           VARCHAR(120) NOT NULL,
  email          VARCHAR(120),
  telefone       VARCHAR(11),
  data_matricula DATE NOT NULL,
  status         ENUM('ativo', 'inativo', 'cancelado') NOT NULL DEFAULT 'ativo',
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (academia_id, email),
  FOREIGN KEY (academia_id) REFERENCES academias (id),
  FOREIGN KEY (plano_id) REFERENCES planos (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE frequencias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id  INT NOT NULL,
  data      DATE NOT NULL,
  hora      TIME NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (aluno_id, data),
  FOREIGN KEY (aluno_id) REFERENCES alunos (id) ON DELETE CASCADE
) ENGINE=InnoDB;
