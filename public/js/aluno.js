const cabecalho = document.getElementById('cabecalho');
const id = new URLSearchParams(location.search).get('id');

async function carregarAluno() {
  if (!id) {
    mostrarErro(cabecalho, 'Aluno não informado.');
    return;
  }
  try {
    const aluno = await api(`/api/alunos/${encodeURIComponent(id)}`);
    document.title = `${aluno.nome} · Retenção de Alunos`;

    cabecalho.innerHTML = `
      <section class="card">
        <div class="card-body d-flex flex-wrap align-items-center gap-3">
          <span class="avatar avatar-grande">${iniciais(aluno.nome)}</span>
          <div class="flex-grow-1 min-w-0">
            <h1 class="titulo text-truncate">${escapar(aluno.nome)}</h1>
            <div class="text-secondary small">
              Plano ${escapar(aluno.plano || 'não definido')} · matrícula em ${formatarData(aluno.data_matricula)}
              ${aluno.email ? `· ${escapar(aluno.email)}` : ''}
            </div>
          </div>
          <div class="d-flex gap-2">
            ${STATUS[aluno.status]}
            ${aluno.status === 'ativo' ? NIVEIS[aluno.nivel] : ''}
          </div>
        </div>
      </section>`;

    const rotulos = aluno.historico.map((_, i) => (i === aluno.historico.length - 1 ? 'Atual' : `-${aluno.historico.length - 1 - i}s`));
    criarGraficoBarras(document.getElementById('grafico-historico'), rotulos, aluno.historico, aluno.historico.length - 1);

    document.getElementById('ultima-presenca').textContent = aluno.ultima_presenca
      ? `Última presença: ${formatarData(aluno.ultima_presenca)} (${textoDias(aluno.dias_sem_presenca)})`
      : 'Nenhuma presença registrada.';

    document.getElementById('detalhes').hidden = false;
  } catch (erro) {
    mostrarErro(cabecalho, erro.message);
  }
}

carregarAluno();
