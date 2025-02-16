const apiKey = 'CVQ0S52OGI2R8510';   
const acoes = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'FB', 'NVDA', 'NFLX', 'SPY', 'INTC',
    'BA', 'DIS', 'V', 'PYPL', 'AMD', 'CSCO', 'IBM', 'GE', 'WMT', 'JNJ', 'PG', 
    'BABA', 'VZ', 'XOM', 'CVX', 'PFE', 'GS', 'MS', 'UNH', 'HD', 'COF', 'CMCSA',
    'AMGN', 'LMT', 'INTU', 'CAT', 'GS', 'TRV', 'USB', 'RTX', 'MMM', 'DE',
    'DUK', 'MU', 'BLK', 'ETN', 'RTX', 'UNP', 'T', 'CSX', 'COP', 'CL', 'MDT', 
    'SO', 'SBUX', 'MCD', 'WBA', 'LOW', 'NEE', 'TGT', 'GE', 'AXP', 'UPS', 'BKNG',
    'GOOG', 'F', 'PFE', 'BIDU', 'RIVN', 'ZM', 'MELI', 'LULU', 'ROKU', 'SQ',
    'TSM', 'QCOM', 'UBER', 'LYFT', 'INTC', 'AMAT', 'BIDU', 'KHC', 'UAL', 'CVS','USD'];
const tokenBrapi = 'tNuh6Ke4An8NJSEqSRkQEN';  // Token da API brapi
const criptoAtivos = ['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'ADA', 'DOT', 'SOL', 'DOGE', 'MATIC'];

// Função para buscar dados da Alpha Vantage
async function buscarDadosAcao(simbolo) {
    try {
        const resposta = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${simbolo}&apikey=${apiKey}`);
        const resultado = await resposta.json();

        console.log(`Resultado da consulta para ${simbolo}:`, resultado);

        const serieTemporal = resultado['Time Series (Daily)'];
        if (serieTemporal) {
            const primeiraData = Object.keys(serieTemporal)[0]; // Pegando a primeira data da série
            const dadosPrimeiroDia = serieTemporal[primeiraData];
            preencherTabela(simbolo, dadosPrimeiroDia, 'alphaVantage');
        } else {
            console.log(`Não foi possível obter dados para o símbolo: ${simbolo}`);
            if (resultado['Error Message']) {
                console.log('Mensagem de erro da API:', resultado['Error Message']);
            }
        }
    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
    }
}

// Função para buscar dados da brapi (ações brasileiras)
async function buscarDadosAcaoBrasil(simbolo) {
    try {
        const resposta = await fetch(`https://brapi.dev/api/quote/${simbolo}?token=${tokenBrapi}`);
        const resultado = await resposta.json();

        console.log(`Resultado da consulta para ${simbolo} (Brasil):`, resultado);

        // Garantir que a resposta contenha resultados
        if (resultado.results && resultado.results.length > 0) {
            const dados = resultado.results[0]; // Pega os dados da primeira ação
            preencherTabela(simbolo, dados, 'brasil');
        } else {
            console.log(`Não foi possível obter dados para o símbolo: ${simbolo}`);
        }
    } catch (erro) {
        console.error('Erro ao buscar dados das ações brasileiras:', erro);
    }
}

// Função para buscar dados de criptomoedas usando CryptoCompare
async function buscarDadosCripto(simbolo) {
    try {
        const resposta = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${simbolo}&tsyms=USD,EUR,BTC&api_key=${apiKey}`);
        const resultado = await resposta.json();

        console.log(`Resultado da consulta para ${simbolo} (Cripto):`, resultado);

        if (resultado && resultado.USD) { // Verifica se há o valor em USD
            const dados = {
                current_price: resultado.USD,  // Preço atual em USD
                high_24h: resultado.USD,  // Para o exemplo, vamos usar o mesmo preço como alta de 24h
                low_24h: resultado.USD,   // E o mesmo para baixa de 24h
                total_volumes: "N/A"  // CryptoCompare não fornece diretamente volume por cripto neste endpoint
            };
            preencherTabela(simbolo, dados, 'cripto');
        } else {
            console.log(`Não foi possível obter dados para a cripto: ${simbolo}`);
        }
    } catch (erro) {
        console.error('Erro ao buscar dados de criptomoedas:', erro);
    }
}

// Função para preencher as tabelas com os dados das ações e criptos
function preencherTabela(simbolo, dados, tipo) {
    const tabela = document.querySelector(`#tabela-acoes-${tipo} tbody`);
    const linha = document.createElement('tr');

    if (tipo === 'alphaVantage') {
        linha.innerHTML = `
            <td>${simbolo}</td>
            <td>${dados['1. open']}</td> <!-- Preço de Abertura -->
            <td>${dados['4. close']}</td> <!-- Preço de Fechamento -->
            <td>${dados['5. volume']}</td> <!-- Volume -->
        `;
    } else if (tipo === 'brasil') {
        linha.innerHTML = `
            <td>${simbolo}</td> <!-- Símbolo da Ação -->
            <td>${dados.regularMarketDayHigh || 'N/A'}</td> <!-- Preço Máximo -->
            <td>${dados.regularMarketDayLow || 'N/A'}</td> <!-- Preço Mínimo -->
            <td>${dados.volume || 'N/A'}</td> <!-- Volume -->
        `;
    } else if (tipo === 'cripto') {
        linha.innerHTML = `
            <td>${simbolo}</td> <!-- Símbolo da Cripto -->
            <td>${dados.current_price}</td> <!-- Preço Atual -->
            <td>${dados.high_24h}</td> <!-- Máximo 24h -->
            <td>${dados.low_24h}</td> <!-- Mínimo 24h -->
        `;
    }

    tabela.appendChild(linha);
}

// Função para buscar todas as ações de uma vez
async function buscarAcoes(tipo) {
    let ativosParaBuscar = tipo === 'alphaVantage' ? acoes : ['PETR4', 'VALE3', 'ITUB4', 'BBAS3', 'ABEV3', 'PETR3', 'MGLU3', 'LREN3', 'WEGE3', 'RENT3', 'BRAP4', 'B3SA3', 'IRBR3', 'QUAL3',
    'EMBR3', 'CIELO3', 'GGBR4', 'SUZB3', 'PSSA3', 'HYPE3', 'CIEL3', 'BBDC3', 'BBDC4', 'ELET3', 'ELET6', 'LAME4', 'SULA11', 'TIMS3', 
    'VIVT3', 'ENGI11', 'CPLU3', 'KLBN11', 'GGBR3', 'JBSS3', 'RADL3', 'TRPL4', 'FESA4', 'SANB11', 'CTIP3', 'CSNA3', 'VBBR3', 'MULT3',
    'RAPT4', 'USIM5', 'PAMT3', 'TEND3', 'ALUP11', 'KROT3', 'BRFS3', 'LIGT3', 'YDUQ3', 'EGIE3', 'SUSB3', 'MRVE3', 'DIRR3', 'TOTS3',
    'LIGT3', 'BRML3', 'ARZZ3'];  // Exemplo de ações brasileiras
    let criptoParaBuscar = tipo === 'cripto' ? criptoAtivos : [];

    for (let simbolo of ativosParaBuscar) {
        if (tipo === 'alphaVantage') {
            await buscarDadosAcao(simbolo);
        } else if (tipo === 'brasil') {
            await buscarDadosAcaoBrasil(simbolo);
        }
    }

    for (let simbolo of criptoParaBuscar) {
        if (tipo === 'cripto') {
            await buscarDadosCripto(simbolo);
        }
    }
}

// Função para alternar entre as tabelas
document.querySelector('#btnAlphaVantage').addEventListener('click', () => {
    document.getElementById('tabela-acoes-alphaVantage').style.display = 'block';
    document.getElementById('tabela-acoes-brasil').style.display = 'none';
    document.getElementById('tabela-acoes-cripto').style.display = 'none';
    document.querySelector('#tabela-acoes-alphaVantage tbody').innerHTML = ''; 
    buscarAcoes('alphaVantage');
});

document.querySelector('#btnBrasil').addEventListener('click', () => {
    document.getElementById('tabela-acoes-alphaVantage').style.display = 'none';
    document.getElementById('tabela-acoes-brasil').style.display = 'block';
    document.getElementById('tabela-acoes-cripto').style.display = 'none';
    document.querySelector('#tabela-acoes-brasil tbody').innerHTML = ''; 
    buscarAcoes('brasil');
});

document.querySelector('#btnCripto').addEventListener('click', () => {
    document.getElementById('tabela-acoes-alphaVantage').style.display = 'none';
    document.getElementById('tabela-acoes-brasil').style.display = 'none';
    document.getElementById('tabela-acoes-cripto').style.display = 'block';
    document.querySelector('#tabela-acoes-cripto tbody').innerHTML = ''; 
    buscarAcoes('cripto');
});

// Função para pesquisar na tabela
document.querySelector('.search-button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-input').value.toUpperCase(); // Convertendo para maiúsculas
    const tabelaAtiva = document.querySelector('#tabela-acoes-alphaVantage').style.display === 'block' 
        ? document.querySelector('#tabela-acoes-alphaVantage tbody') 
        : document.querySelector('#tabela-acoes-brasil').style.display === 'block' 
        ? document.querySelector('#tabela-acoes-brasil tbody') 
        : document.querySelector('#tabela-acoes-cripto tbody');

    const rows = tabelaAtiva.getElementsByTagName('tr');
    let found = false;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells[0].innerText.toUpperCase() === searchTerm) {
            const firstRow = tabelaAtiva.insertRow(0);
            for (let j = 0; j < cells.length; j++) {
                const newCell = firstRow.insertCell(j);
                newCell.innerHTML = cells[j].innerHTML;
            }
            tabelaAtiva.deleteRow(i + 1); // Remove a linha que foi movida
            found = true;
            break;
        }
    }

    if (!found) {
        alert('Item não encontrado na tabela.');
    }
});

// Chama a função para buscar os dados das ações da Alpha Vantage por padrão
buscarAcoes('alphaVantage');
