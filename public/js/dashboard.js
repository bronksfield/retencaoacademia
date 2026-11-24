const lista = document.getElementById('lista');

async function carregarPainel() {
  try {
    const dados = await api('/api/dashboard');
    document.getElementById('kpi-ativos').textContent = dados.ativos;
    document.getElementById('kpi-hoje').textContent = dados.presencasHoje;
    document.getElementById('kpi-alto').textContent = dados.alto;
    document.getElementById('kpi-atencao').textContent = dados.atencao;

    criarGraficoBarras(
      document.getElementById('grafico-semana'),
      dados.semana.map((d) => d.dia),
      dados.semana.map((d) => d.total),
      dados.semana.length - 1
    );

    if (dados.alunos.length === 0) {
      lista.innerHTML = '<p class="vazio mb-0">Nenhum aluno precisa de atenção no momento.</p>';
      return;
    }

    lista.innerHTML = dados.alunos.map((a) => `
      <div class="lista-item">
        <span class="avatar">${iniciais(a.nome)}</span>
        <div class="flex-grow-1 min-w-0">
          <div class="nome text-truncate">${escapar(a.nome)}</div>
          <div class="detalhe">${a.ultima_presenca ? `${textoDias(a.dias_sem_presenca)} sem treinar` : 'nunca compareceu'}</div>
        </div>
        ${NIVEIS[a.nivel]}
        <a href="aluno.html?id=${a.id}" class="btn btn-suave btn-sm">Ver</a>
      </div>`).join('');
  } catch (erro) {
    mostrarErro(lista, erro.message);
  }
}

carregarPainel();
