const lista = document.getElementById('lista');
const busca = document.getElementById('busca');
const filtroStatus = document.getElementById('filtro-status');
const formAluno = document.getElementById('form-aluno');
const mensagemForm = document.getElementById('mensagem-form');

async function carregarAlunos() {
  try {
    const parametros = new URLSearchParams({ busca: busca.value, status: filtroStatus.value });
    const alunos = await api(`/api/alunos?${parametros}`);

    if (alunos.length === 0) {
      lista.innerHTML = '<p class="vazio mb-0">Nenhum aluno encontrado.</p>';
      return;
    }

    const linhas = alunos.map((a) => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <span class="avatar">${iniciais(a.nome)}</span>
            <div class="min-w-0">
              <div class="fw-semibold text-truncate">${escapar(a.nome)}</div>
              <div class="small text-secondary text-truncate">${escapar(a.email || 'sem e-mail')}</div>
            </div>
          </div>
        </td>
        <td class="d-none d-md-table-cell">${escapar(a.plano || '—')}</td>
        <td class="d-none d-md-table-cell">${formatarData(a.data_matricula)}</td>
        <td class="d-none d-sm-table-cell">${STATUS[a.status]}</td>
        <td class="text-end"><a href="aluno.html?id=${a.id}" class="btn btn-suave btn-sm">Ver</a></td>
      </tr>`).join('');

    lista.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>Aluno</th><th class="d-none d-md-table-cell">Plano</th><th class="d-none d-md-table-cell">Matrícula</th><th class="d-none d-sm-table-cell">Status</th><th><span class="visually-hidden">Ações</span></th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>`;
  } catch (erro) {
    mostrarErro(lista, erro.message);
  }
}

async function carregarPlanos() {
  try {
    const planos = await api('/api/planos');
    const select = document.getElementById('a-plano');
    planos.forEach((p) => select.add(new Option(p.nome, p.id)));
  } catch {
    // Sem planos, o aluno ainda pode ser cadastrado.
  }
}

formAluno.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('/api/alunos', {
      method: 'POST',
      body: {
        nome: document.getElementById('a-nome').value,
        email: document.getElementById('a-email').value,
        telefone: document.getElementById('a-telefone').value,
        plano_id: document.getElementById('a-plano').value || null,
        data_matricula: document.getElementById('a-matricula').value
      }
    });
    formAluno.reset();
    document.getElementById('a-matricula').value = hojeISO();
    mensagemForm.innerHTML = '<div class="alert alert-success mb-0">Aluno cadastrado com sucesso.</div>';
    carregarAlunos();
  } catch (erro) {
    mensagemForm.innerHTML = `<div class="alert alert-danger mb-0">${escapar(erro.message)}</div>`;
  }
});

let espera;
busca.addEventListener('input', () => {
  clearTimeout(espera);
  espera = setTimeout(carregarAlunos, 300);
});
filtroStatus.addEventListener('change', carregarAlunos);

document.getElementById('a-matricula').value = hojeISO();
carregarPlanos();
carregarAlunos();
