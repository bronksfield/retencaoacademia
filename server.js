const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORTA = process.env.PORT || 3000;

// Enquanto o login não está pronto, o sistema trabalha com uma academia só.
const ACADEMIA_ID = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function nivelAtencao(diasSemPresenca) {
  if (diasSemPresenca >= 14) return 'alto';
  if (diasSemPresenca >= 7) return 'atencao';
  return 'normal';
}

function dataValida(texto) {
  return /^\d{4}-\d{2}-\d{2}$/.test(texto || '');
}

app.get('/api/dashboard', async (req, res, next) => {
  try {
    const [alunos] = await db.query(
      `SELECT a.id, a.nome,
              MAX(f.data) AS ultima_presenca,
              DATEDIFF(CURDATE(), COALESCE(MAX(f.data), a.data_matricula)) AS dias_sem_presenca
         FROM alunos a
         LEFT JOIN frequencias f ON f.aluno_id = a.id
        WHERE a.academia_id = ? AND a.status = 'ativo'
        GROUP BY a.id
        ORDER BY dias_sem_presenca DESC`,
      [ACADEMIA_ID]
    );
    const [[hoje]] = await db.query(
      `SELECT COUNT(*) AS total
         FROM frequencias f
         JOIN alunos a ON a.id = f.aluno_id
        WHERE a.academia_id = ? AND f.data = CURDATE()`,
      [ACADEMIA_ID]
    );

    const [porDia] = await db.query(
      `SELECT f.data, COUNT(*) AS total
         FROM frequencias f
         JOIN alunos a ON a.id = f.aluno_id
        WHERE a.academia_id = ? AND f.data > DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY f.data`,
      [ACADEMIA_ID]
    );
    const [[{ hoje: dataHoje }]] = await db.query('SELECT CURDATE() AS hoje');
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const semana = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date(`${dataHoje}T12:00:00`);
      dia.setDate(dia.getDate() - i);
      const iso = dia.toISOString().slice(0, 10);
      const registro = porDia.find((p) => p.data === iso);
      semana.push({ dia: nomesDias[dia.getDay()], total: registro ? registro.total : 0 });
    }

    const lista = alunos.map((a) => ({ ...a, nivel: nivelAtencao(a.dias_sem_presenca) }));
    res.json({
      semana,
      ativos: lista.length,
      presencasHoje: hoje.total,
      alto: lista.filter((a) => a.nivel === 'alto').length,
      atencao: lista.filter((a) => a.nivel === 'atencao').length,
      alunos: lista.filter((a) => a.nivel !== 'normal')
    });
  } catch (erro) {
    next(erro);
  }
});

app.get('/api/planos', async (req, res, next) => {
  try {
    const [planos] = await db.query(
      'SELECT id, nome, valor_mensal FROM planos WHERE academia_id = ? AND ativo = TRUE ORDER BY nome',
      [ACADEMIA_ID]
    );
    res.json(planos);
  } catch (erro) {
    next(erro);
  }
});

app.get('/api/alunos', async (req, res, next) => {
  try {
    const busca = `%${req.query.busca || ''}%`;
    const status = req.query.status || '';
    const [alunos] = await db.query(
      `SELECT a.id, a.nome, a.email, a.data_matricula, a.status, p.nome AS plano
         FROM alunos a
         LEFT JOIN planos p ON p.id = a.plano_id
        WHERE a.academia_id = ?
          AND (a.nome LIKE ? OR a.email LIKE ?)
          AND (? = '' OR a.status = ?)
        ORDER BY a.nome`,
      [ACADEMIA_ID, busca, busca, status, status]
    );
    res.json(alunos);
  } catch (erro) {
    next(erro);
  }
});

app.post('/api/alunos', async (req, res, next) => {
  try {
    const nome = (req.body.nome || '').trim();
    const email = (req.body.email || '').trim() || null;
    const telefone = (req.body.telefone || '').replace(/\D/g, '') || null;
    const planoId = req.body.plano_id || null;
    const dataMatricula = req.body.data_matricula;

    if (nome.length < 2) return res.status(400).json({ erro: 'Informe o nome do aluno.' });
    if (!dataValida(dataMatricula)) return res.status(400).json({ erro: 'Informe a data de matrícula.' });

    const [resultado] = await db.query(
      `INSERT INTO alunos (academia_id, plano_id, nome, email, telefone, data_matricula)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ACADEMIA_ID, planoId, nome, email, telefone, dataMatricula]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um aluno com esse e-mail.' });
    }
    next(erro);
  }
});

app.get('/api/alunos/:id', async (req, res, next) => {
  try {
    const [[aluno]] = await db.query(
      `SELECT a.id, a.nome, a.email, a.telefone, a.data_matricula, a.status, p.nome AS plano,
              (SELECT MAX(f.data) FROM frequencias f WHERE f.aluno_id = a.id) AS ultima_presenca,
              DATEDIFF(CURDATE(), COALESCE((SELECT MAX(f.data) FROM frequencias f WHERE f.aluno_id = a.id),
                                           a.data_matricula)) AS dias_sem_presenca
         FROM alunos a
         LEFT JOIN planos p ON p.id = a.plano_id
        WHERE a.id = ? AND a.academia_id = ?`,
      [req.params.id, ACADEMIA_ID]
    );
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });

    const [semanas] = await db.query(
      `SELECT FLOOR(DATEDIFF(CURDATE(), data) / 7) AS semanas_atras, COUNT(*) AS presencas
         FROM frequencias
        WHERE aluno_id = ? AND data > DATE_SUB(CURDATE(), INTERVAL 56 DAY)
        GROUP BY semanas_atras`,
      [aluno.id]
    );

    const historico = [];
    for (let i = 7; i >= 0; i--) {
      const semana = semanas.find((s) => s.semanas_atras === i);
      historico.push(semana ? semana.presencas : 0);
    }

    res.json({ ...aluno, historico, nivel: nivelAtencao(aluno.dias_sem_presenca) });
  } catch (erro) {
    next(erro);
  }
});

app.get('/api/frequencias', async (req, res, next) => {
  try {
    const data = dataValida(req.query.data) ? req.query.data : null;
    const [presencas] = await db.query(
      `SELECT f.id, f.hora, a.nome
         FROM frequencias f
         JOIN alunos a ON a.id = f.aluno_id
        WHERE a.academia_id = ? AND f.data = COALESCE(?, CURDATE())
        ORDER BY f.hora`,
      [ACADEMIA_ID, data]
    );
    res.json(presencas);
  } catch (erro) {
    next(erro);
  }
});

app.post('/api/frequencias', async (req, res, next) => {
  try {
    const { aluno_id, data, hora } = req.body;
    if (!aluno_id) return res.status(400).json({ erro: 'Selecione o aluno.' });
    if (!dataValida(data)) return res.status(400).json({ erro: 'Informe a data.' });
    if (!/^\d{2}:\d{2}$/.test(hora || '')) return res.status(400).json({ erro: 'Informe o horário.' });

    const [[aluno]] = await db.query(
      `SELECT id, data_matricula FROM alunos
        WHERE id = ? AND academia_id = ? AND status = 'ativo'`,
      [aluno_id, ACADEMIA_ID]
    );
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado ou inativo.' });
    if (data < aluno.data_matricula) {
      return res.status(400).json({ erro: 'A data é anterior à matrícula do aluno.' });
    }
    const [[{ hoje }]] = await db.query('SELECT CURDATE() AS hoje');
    if (data > hoje) return res.status(400).json({ erro: 'Não é possível registrar presença em data futura.' });

    await db.query('INSERT INTO frequencias (aluno_id, data, hora) VALUES (?, ?, ?)', [aluno.id, data, hora]);
    res.status(201).json({ ok: true });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este aluno já tem presença registrada nesse dia.' });
    }
    next(erro);
  }
});

app.use((erro, req, res, next) => {
  console.error(erro);
  const semBanco = ['ECONNREFUSED', 'ER_BAD_DB_ERROR', 'ER_ACCESS_DENIED_ERROR'].includes(erro.code);
  res.status(500).json({
    erro: semBanco
      ? 'Não foi possível conectar ao banco. Verifique se o MySQL do XAMPP está ligado.'
      : 'Erro interno no servidor.'
  });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
