async function api(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Erro inesperado.');
  return dados;
}

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function formatarData(data) {
  if (!data) return '—';
  const [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

function hojeISO() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

function iniciais(nome) {
  const partes = (nome || '').trim().split(/\s+/);
  const letras = partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : (partes[0] || '?').slice(0, 2);
  return escapar(letras.toUpperCase());
}

function textoDias(dias) {
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'há 1 dia';
  return `há ${dias} dias`;
}

const NIVEIS = {
  alto: '<span class="etiqueta etiqueta-alto">Alto</span>',
  atencao: '<span class="etiqueta etiqueta-atencao">Atenção</span>',
  normal: '<span class="etiqueta etiqueta-normal">Normal</span>'
};

const STATUS = {
  ativo: '<span class="etiqueta etiqueta-ativo">Ativo</span>',
  inativo: '<span class="etiqueta etiqueta-inativo">Inativo</span>',
  cancelado: '<span class="etiqueta etiqueta-cancelado">Cancelado</span>'
};

function mostrarErro(elemento, mensagem) {
  elemento.innerHTML = `<div class="alert alert-danger mb-0">${escapar(mensagem)}</div>`;
}

function criarGraficoBarras(canvas, rotulos, valores, destaque) {
  if (!window.Chart) return null;
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rotulos,
      datasets: [{
        label: 'Presenças',
        data: valores,
        backgroundColor: valores.map((_, i) => (i === destaque ? '#6d4ae0' : '#d9cffa')),
        borderRadius: 12,
        borderSkipped: false,
        maxBarThickness: 44
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#5f5a78', font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", weight: 600 } } },
        y: { beginAtZero: true, ticks: { precision: 0, color: '#5f5a78', font: { family: "'Plus Jakarta Sans', system-ui, sans-serif" } }, grid: { color: '#f0ecfb' }, border: { display: false } }
      }
    }
  });
}
