let jogos = [];
const totalNumeros = 25;
const totalDezenas = 14;
let jogosCompletados = false; // Variável para rastrear se os jogos foram completados

document.getElementById('gerarJogos').addEventListener('click', gerarJogos);
document.getElementById('completarJogos').addEventListener('click', completarJogos);
document.getElementById('exportarExcel').addEventListener('click', exportarParaExcel);
document.getElementById('exportarTxt').addEventListener('click', exportarParaTXT);

function gerarJogos() {
    jogos = [];
    jogosCompletados = false; // Resetar o estado de conclusão

    // Gerar uma base de 14 dezenas
    const numerosDisponiveis = Array.from({length: totalNumeros}, (_, i) => i + 1);
    const baseJogo = [];
    while (baseJogo.length < totalDezenas) {
        const indexAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
        const numero = numerosDisponiveis.splice(indexAleatorio, 1)[0];
        baseJogo.push(numero);
    }
    baseJogo.sort((a, b) => a - b);

    // Criar 11 jogos idênticos com as 14 dezenas
    for (let i = 0; i < 11; i++) {
        jogos.push([...baseJogo]);
    }

    mostrarJogos(jogos);
    document.getElementById('completarJogos').disabled = false;
    document.getElementById('exportarExcel').disabled = true;
    document.getElementById('exportarTxt').disabled = true;
}

function completarJogos() {
    const todosNumeros = Array.from({length: totalNumeros}, (_, i) => i + 1);

    // Identificar os números que faltam para completar os 25 números
    const numerosFaltando = todosNumeros.filter(num => !jogos[0].includes(num));

    // Completar cada jogo com um dos números que faltam e marcar como adicionado
    jogos.forEach((jogo, index) => {
        const numeroAdicionado = numerosFaltando[index];
        jogo.push(numeroAdicionado);
        jogo.sort((a, b) => a - b);
        jogo[jogo.indexOf(numeroAdicionado)] = { numero: numeroAdicionado, adicionado: true }; // Marcar número adicionado
    });

    mostrarJogos(jogos);
    jogosCompletados = true; // Marcar os jogos como completados
    document.getElementById('exportarExcel').disabled = false;
    document.getElementById('exportarTxt').disabled = false;
}

function mostrarJogos(jogos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    jogos.forEach((jogo, index) => {
        const jogoDiv = document.createElement('div');
        jogoDiv.className = 'jogo';
        
        // Adicionar o rótulo do jogo
        const jogoLabel = document.createElement('div');
        jogoLabel.className = 'jogo-label';
        jogoLabel.textContent = `Jogo ${index + 1}:`;
        jogoDiv.appendChild(jogoLabel);
        
        // Gerar a string do jogo com a classe CSS para o número adicionado
        const jogoStr = jogo.map(item => {
            if (typeof item === 'object' && item.adicionado) {
                return `<span class="adicionado">${item.numero}</span>`;
            }
            return item;
        }).join(', ');

        jogoDiv.innerHTML += jogoStr;
        resultadosDiv.appendChild(jogoDiv);
    });
}

function exportarParaExcel() {
    if (!jogosCompletados) {
        alert('Você deve completar os jogos antes de exportar para Excel.');
        return;
    }

    const wb = XLSX.utils.book_new();
    
    // Adiciona o cabeçalho
    const header = ['Jogo', ...Array(totalDezenas).fill(null).map((_, i) => `Número ${String(i + 1).padStart(2, '0')}`)];
    
    // Adiciona o 15º número ao cabeçalho se o totalDezenas for 14
    if (totalDezenas < 15) {
        header.push('Número 15');
    }

    // Adiciona os jogos
    const data = jogos.map((jogo, index) => {
        const jogoArray = [
            `Jogo ${index + 1}`,
            ...jogo.map(item => typeof item === 'object' ? item.numero : item)
        ];

        // Preenche com células vazias se necessário para o 15º número
        while (jogoArray.length < header.length) {
            jogoArray.push('');
        }

        return jogoArray;
    });

    // Junta o cabeçalho e os dados
    const sheetData = [header, ...data];

    // Cria a planilha e a adiciona ao livro
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');
    
    // Salva o arquivo
    XLSX.writeFile(wb, 'jogos_lotofacil.xlsx');
}

function exportarParaTXT() {
    if (!jogosCompletados) {
        alert('Você deve completar os jogos antes de exportar para TXT.');
        return;
    }

    // Gera o conteúdo para o arquivo TXT sem rótulo e com espaços simples entre os números
    const texto = jogos.map(jogo => 
        jogo.map(item => typeof item === 'object' ? item.numero : item).join(' ')
    ).join('\n');

    // Cria o blob e o URL para o download
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_lotofacil.txt';
    
    // Aciona o download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
