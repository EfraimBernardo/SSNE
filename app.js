function inicializarBanco() {
    if (!localStorage.getItem('ipas_candidatos')) {
        localStorage.setItem('ipas_candidatos', JSON.stringify([]));
    }

    if (!localStorage.getItem('ipas_cursos')) {
        const cursosIniciais = [
            { id: 1, nome: 'Engenharia Informática', coordenador: 'Dr. Álvaro Bernardo', modalidade: 'Presencial' },
            { id: 2, nome: 'Administração de Empresas', coordenador: 'Dra. Maria Malulo', modalidade: 'Presencial' }
        ];
        localStorage.setItem('ipas_cursos', JSON.stringify(cursosIniciais));
    }
}


function obterCandidatos() { return JSON.parse(localStorage.getItem('ipas_candidatos')); }
function salvarCandidatos(arr) { localStorage.setItem('ipas_candidatos', JSON.stringify(arr)); }
function obterCursos() { return JSON.parse(localStorage.getItem('ipas_cursos')); }
function salvarCursos(arr) { localStorage.setItem('ipas_cursos', JSON.stringify(arr)); }


function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.getElementById(`btn-${tabId}`).classList.add('active');
    
    renderizarDados();
}

function toggleFormCandidato() {
    const form = document.getElementById('form-candidato-container');
    form.classList.toggle('hidden');
}



function salvarCursoRapido() {
    const nome = document.getElementById('curso-nome').value;
    const coordenador = document.getElementById('curso-coordenador').value;
    const modalidade = document.getElementById('curso-modalidade').value;

    if (!nome) { alert('Digite ao menos o nome do curso.'); return; }

    const cursos = obterCursos();
    cursos.push({
        id: Date.now(),
        nome: nome,
        coordenador: coordenador || 'Sem coordenador',
        modalidade: modalidade || 'Presencial'
    });
    
    salvarCursos(cursos);


    document.getElementById('curso-nome').value = '';
    document.getElementById('curso-coordenador').value = '';
    document.getElementById('curso-modalidade').value = '';

    renderizarDados();
}

function salvarCandidato(e) {
    e.preventDefault();
    
    const candidatos = obterCandidatos();
    candidatos.push({
        id: Date.now(),
        nome: document.getElementById('cand-nome').value,
        bi: document.getElementById('cand-bi').value,
        sexo: document.getElementById('cand-sexo').value,
        numBi: document.getElementById('cand-num-bi').value,
        escola: document.getElementById('cand-escola').value,
        media: document.getElementById('cand-media').value || '0',
        curso: document.getElementById('cand-curso').value,
        estado: document.getElementById('cand-estado').value,

        notaExame: (Math.random() * (20 - 7) + 7).toFixed(1), 
        pagamentoConfirmado: Math.random() > 0.4 ? 'Confirmado' : 'Pendente'
    });

    salvarCandidatos(candidatos);
    document.getElementById('form-candidato').reset();
    toggleFormCandidato();
    renderizarDados();
}

function deletarCandidato(id) {
    const atualizados = obterCandidatos().filter(c => c.id !== id);
    salvarCandidatos(atualizados);
    renderizarDados();
}

function deletarCurso(id) {
    const atualizados = obterCursos().filter(c => c.id !== id);
    salvarCursos(atualizados);
    renderizarDados();
}


function renderizarDados() {
    const candidatos = obterCandidatos();
    const cursos = obterCursos();


    document.getElementById('dash-total-candidatos').innerText = candidatos.length;
    document.getElementById('dash-total-cursos').innerText = cursos.length;
    document.getElementById('dash-total-pagamentos').innerText = candidatos.filter(c => c.pagamentoConfirmado === 'Confirmado').length;
    document.getElementById('dash-total-exames').innerText = candidatos.length;


    document.getElementById('badge-pendentes').innerText = `${candidatos.filter(c => c.estado === 'Pendente').length} candidatos`;
    document.getElementById('badge-aprovados').innerText = `${candidatos.filter(c => c.estado === 'Aprovado').length} candidatos`;
    document.getElementById('badge-analise').innerText = `${candidatos.filter(c => c.estado === 'Em análise').length} candidatos`;


    const dashListaCurso = document.getElementById('dash-candidatos-curso-lista');
    dashListaCurso.innerHTML = cursos.length === 0 ? 'Nenhum curso cadastrado.' : '';
    cursos.forEach(cur => {
        const total = candidatos.filter(c => c.curso === cur.nome).length;
        dashListaCurso.innerHTML += `
            <div class="flex justify-between items-center py-1.5 border-b border-custom/40">
                <span>${cur.nome}</span>
                <span class="font-bold text-white">${total}</span>
            </div>`;
    });


    const selectCurso = document.getElementById('cand-curso');
    selectCurso.innerHTML = '';
    cursos.forEach(c => {
        selectCurso.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
    });


    const tabelaCand = document.getElementById('tabela-candidatos');
    tabelaCand.innerHTML = candidatos.length === 0 ? '<tr><td colspan="5" class="p-4 text-center text-muted">Nenhum candidato na lista.</td></tr>' : '';
    candidatos.forEach(c => {
        let corStatus = 'bg-badge-amber text-amber-400';
        if (c.estado === 'Aprovado') corStatus = 'bg-badge-emerald text-emerald-400';
        if (c.estado === 'Em análise') corStatus = 'bg-badge-blue text-blue-400';

        tabelaCand.innerHTML += `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-medium">${c.nome}</td>
                <td class="p-4 text-muted">${c.curso}</td>
                <td class="p-4 text-muted">${c.sexo}</td>
                <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${corStatus}">${c.estado}</span></td>
                <td class="p-4"><button onclick="deletarCandidato(${c.id})" class="text-red-400 hover:text-red-500 text-xs">Excluir</button></td>
            </tr>`;
    });


    const tabelaCursos = document.getElementById('tabela-cursos');
    tabelaCursos.innerHTML = cursos.length === 0 ? '<tr><td colspan="5" class="p-4 text-center text-muted">Nenhum curso cadastrado.</td></tr>' : '';
    cursos.forEach(c => {
        const totalAlunos = candidatos.filter(cand => cand.curso === c.nome).length;
        tabelaCursos.innerHTML += `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-medium">${c.nome}</td>
                <td class="p-4 text-muted">${c.coordenador}</td>
                <td class="p-4 text-muted">${c.modalidade}</td>
                <td class="p-4 font-bold text-blue-400">${totalAlunos}</td>
                <td class="p-4"><button onclick="deletarCurso(${c.id})" class="text-red-400 hover:text-red-500 text-xs">Excluir</button></td>
            </tr>`;
    });


    const tabelaExames = document.getElementById('tabela-exames');
    tabelaExames.innerHTML = candidatos.length === 0 ? '<tr><td colspan="3" class="p-4 text-center text-muted">Nenhum exame processado.</td></tr>' : '';
    candidatos.forEach(c => {
        const resultado = c.notaExame >= 10 ? 'Apto' : 'Não Apto';
        const corResultado = c.notaExame >= 10 ? 'text-emerald-400' : 'text-red-400';
        tabelaExames.innerHTML += `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-medium">${c.nome}</td>
                <td class="p-4 text-muted">${c.notaExame}</td>
                <td class="p-4 font-semibold ${corResultado}">${resultado}</td>
            </tr>`;
    });

    const tabelaPagamentos = document.getElementById('tabela-pagamentos');
    tabelaPagamentos.innerHTML = candidatos.length === 0 ? '<tr><td colspan="3" class="p-4 text-center text-muted">Nenhum pagamento registrado.</td></tr>' : '';
    candidatos.forEach(c => {
        const corPag = c.pagamentoConfirmado === 'Confirmado' ? 'bg-badge-emerald text-emerald-400' : 'bg-badge-amber text-amber-400';
        tabelaPagamentos.innerHTML += `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-medium">${c.nome}</td>
                <td class="p-4 text-muted">Kz 15.000,00</td>
                <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${corPag}">${c.pagamentoConfirmado}</span></td>
            </tr>`;
    });


    document.getElementById('rel-total-candidatos').innerText = candidatos.length;
    document.getElementById('rel-total-cursos').innerText = cursos.length;
}


window.onload = function() {
    inicializarBanco();
    renderizarDados();
};