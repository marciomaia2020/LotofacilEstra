const totalNumeros = 25;
const totalJogos = 4;
let jogos = [];

document.getElementById('gerarJogos').addEventListener('click', gerarJogos);

function gerarJogos() {
    const fixas = document.getElementById('fixas').value.split(',').map(Number).filter(n => n > 0 && n <= totalNumeros);
    const excluir = parseInt(document.getElementById('excluir').value);

    // Validação
    if (fixas.length !== 12) {
        alert('Escolha exatamente 12 dezenas fixas.');
        return;
    }
    if (fixas.includes(excluir)) {
        alert('A dezena a excluir não pode estar entre as fixas.');
        return;
    }

    // Geração dos números restantes
    const numerosRestantes = Array.from({ length: totalNumeros }, (_, i) => i + 1).filter(n => !fixas.includes(n) && n !== excluir);

    // Dividir números restantes em 4 grupos de 3
    const grupos = [];
    for (let i = 0; i < 4; i++) {
        grupos.push(numerosRestantes.splice(0, 3));
    }

    // Gerar 4 jogos com 12 fixas + 3 dezenas de cada grupo
    jogos = [];
    for (let i = 0; i < totalJogos; i++) {
        const jogo = [...fixas, ...grupos[i]];
        jogos.push(jogo.sort((a, b) => a - b)); // Organizar em ordem crescente
    }

    mostrarJogos();
    document.getElementById('exportarExcel').disabled = false;
    document.getElementById('exportarTxt').disabled = false;
}

function mostrarJogos() {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    jogos.forEach((jogo, index) => {
        const jogoDiv = document.createElement('div');
        jogoDiv.className = 'jogo';
        jogoDiv.textContent = `Jogo ${index + 1}: ${jogo.join(', ')}`;
        resultadosDiv.appendChild(jogoDiv);
    });
}

document.getElementById('exportarExcel').addEventListener('click', exportarParaExcel);
document.getElementById('exportarTxt').addEventListener('click', exportarParaTXT);

function exportarParaExcel() {
    const wb = XLSX.utils.book_new();
    const ws_data = [['Jogo', 'Dezenas']];
    jogos.forEach((jogo, index) => ws_data.push([`Jogo ${index + 1}`, jogo.join(', ')]));
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');
    XLSX.writeFile(wb, 'jogos_lotofacil.xlsx');
}

function exportarParaTXT() {
    const texto = jogos.map(jogo => jogo.join(' ')).join('\n');
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_lotofacil.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
document.getElementById('gerarJogos').addEventListener('click', function() {
    const dezenasFixasInput = document.getElementById('dezenasFixas').value;
    const dezenaExcluir = parseInt(document.getElementById('dezenaExcluir').value);

    // Converte a string de dezenas fixas em um array de números
    const dezenasFixas = dezenasFixasInput.split(',').map(num => parseInt(num.trim()));

    // Valida se foram inseridas exatamente 12 dezenas
    if (dezenasFixas.length !== 12) {
        alert("Você deve inserir exatamente 12 dezenas.");
        return;
    }

    // Valida se todos os números são válidos (entre 1 e 25)
    if (dezenasFixas.some(num => isNaN(num) || num < 1 || num > 25)) {
        alert("Insira apenas números entre 1 e 25.");
        return;
    }

    // Valida se a dezena a excluir está entre as fixas
    if (dezenasFixas.includes(dezenaExcluir)) {
        alert("A dezena a excluir não pode estar entre as dezenas fixas.");
        return;
    }

    // Chama a função para gerar os jogos
    gerarJogos(dezenasFixas, dezenaExcluir);
});

function gerarJogos(dezenasFixas, dezenaExcluir) {
    // Lógica de geração de jogos aqui
    console.log("Dezenas fixas:", dezenasFixas);
    console.log("Dezena a excluir:", dezenaExcluir);

    // Exemplo: exibir jogos gerados
    document.getElementById('resultados').innerText = "Jogos gerados com sucesso!";
}
