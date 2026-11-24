const lista = document.getElementById('lista');
const consultaDia = document.getElementById('consulta-dia');
const formPresenca = document.getElementById('form-presenca');
const mensagem = document.getElementById('mensagem');

async function carregarAlunosAtivos() {
  try {
    const alunos = await api('/api/alunos?status=ativo');
    const select = document.getElementById('p-aluno');
    alunos.forEach((a) => select.add(new Option(a.nome, a.id)));
  } catch (erro) {
    mensagem.innerHTML = `<div class="alert alert-danger mb-0">${escapar(erro.message)}</div>`;
  }
}

async function carregarPresencas() {
  try {
    const presencas = await api(`/api/frequencias?data=${consultaDia.value}`);
    if (presencas.length === 0) {
      lista.innerHTML = '<p class="vazio mb-0">Nenhuma presença neste dia.</p>';
      return;
    }
    lista.innerHTML = `
      <p class="small text-secondary mb-2">${presencas.length} ${presencas.length === 1 ? 'presença' : 'presenças'}</p>
      ${presencas.map((p) => `
        <div class="lista-item">
          <span class="avatar">${iniciais(p.nome)}</span>
          <div class="nome flex-grow-1 min-w-0 text-truncate">${escapar(p.nome)}</div>
          <span class="etiqueta etiqueta-ativo"><i class="bi bi-clock me-1"></i>${p.hora.slice(0, 5)}</span>
        </div>`).join('')}`;
  } catch (erro) {
    mostrarErro(lista, erro.message);
  }
}

formPresenca.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const data = document.getElementById('p-data').value;
  try {
    await api('/api/frequencias', {
      method: 'POST',
      body: {
        aluno_id: document.getElementById('p-aluno').value,
        data,
        hora: document.getElementById('p-hora').value
      }
    });
    mensagem.innerHTML = '<div class="alert alert-success mb-0">Presença registrada.</div>';
    consultaDia.value = data;
    carregarPresencas();
  } catch (erro) {
    mensagem.innerHTML = `<div class="alert alert-danger mb-0">${escapar(erro.message)}</div>`;
  }
});

consultaDia.addEventListener('change', carregarPresencas);

const agora = new Date();
document.getElementById('p-data').value = hojeISO();
document.getElementById('p-data').max = hojeISO();
document.getElementById('p-hora').value = agora.toTimeString().slice(0, 5);
consultaDia.value = hojeISO();

carregarAlunosAtivos();
carregarPresencas();
