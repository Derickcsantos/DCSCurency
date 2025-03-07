const apiKey = 'CVQ0S52OGI2R8510';  
const acoes = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA','FB','NVDA','NFLX','SPY','INTC','USD'];

async function buscarDadosAcao(simbolo) {
    try {
        const resposta = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${simbolo}&apikey=${apiKey}`);
        const resultado = await resposta.json();
        
        // Log da resposta para verificar o que está sendo retornado
        console.log(`Resultado da consulta para ${simbolo}:`, resultado);

        // Verificando se a resposta contém os dados de Time Series (Daily)
        const serieTemporal = resultado['Time Series (Daily)'];
        if (serieTemporal) {
            const primeiraData = Object.keys(serieTemporal)[0]; // Pegando a primeira data da série
            const dadosPrimeiroDia = serieTemporal[primeiraData];

            // Preenchendo a tabela com os dados
            preencherTabela(simbolo, dadosPrimeiroDia);
        } else {
            console.log(`Não foi possível obter dados para o símbolo: ${simbolo}`);
            // Verificar erro retornado pela API
            if (resultado['Error Message']) {
                console.log('Mensagem de erro da API:', resultado['Error Message']);
            }
        }
        
    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
    }
}

function preencherTabela(simbolo, dados) {
    const tabela = document.querySelector('#tabela-acoes tbody');
    const linha = document.createElement('tr');

    linha.innerHTML = `
        <td>${simbolo}</td>
        <td>${dados['1. open']}</td>
        <td>${dados['4. close']}</td>
        <td>${dados['5. volume']}</td>
    `;
    
    tabela.appendChild(linha);
}

async function buscarAcoes() {
    // Para cada ação (símbolo), buscamos os dados e preenchemos a tabela
    for (let simbolo of acoes) {
        await buscarDadosAcao(simbolo);
    }
}

document.querySelector('.search-button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const table = document.getElementById('tabela-acoes').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    let found = false;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells[0].innerText.toLowerCase() === searchTerm) {
            const firstRow = table.insertRow(0);
            for (let j = 0; j < cells.length; j++) {
                const newCell = firstRow.insertCell(j);
                newCell.innerHTML = cells[j].innerHTML;
            }
            table.deleteRow(i + 1);
            found = true;
            break;
        }
    }

    if (!found) {
        alert('Item não encontrado na tabela.');
    }
});

// Chama a função para buscar os dados das ações assim que a página carregar
buscarAcoes();
