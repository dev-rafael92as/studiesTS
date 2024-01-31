import Estatisticas from "./Estatisticas.js";
import fetchData from "./fetchData.js";
import normalizarTransacao from "./normalizarTransacao.js";
async function handleData() {
    const data = await fetchData("https://api.origamid.dev/json/transacoes.json");
    if (!data)
        return;
    const transacoes = data.map(normalizarTransacao);
    preencherTabela(transacoes);
    preencherEstatisticas(transacoes);
}
function preencherEstatisticas(transacoes) {
    const data = new Estatisticas(transacoes);
    const spanHTML = document.querySelector("#valueTotal");
    if (spanHTML) {
        spanHTML.innerText = formatarValorBRL(data.total);
    }
}
function preencherTabela(transacoes) {
    const tabela = document.querySelector("#transacoes tBody");
    if (!tabela)
        return;
    transacoes.forEach((transacao) => {
        tabela.innerHTML += `<tr>
        <td>${transacao.nome}</td>
        <td>${transacao.email}</td>
        <td>${transacao.moeda}</td>
        <td>${transacao.pagamento}</td>
        <td>${transacao.status}</td>
    </tr>`;
    });
}
handleData();
async function fetchData1() {
    const transaction = await fetch("https://api.origamid.dev/json/transacoes.json");
    const transactionJSON = await transaction.json();
    const normalizedData = normalizeKeys(transactionJSON);
    obterOpcoesUnicasPagamento(normalizedData, 'formaDePagamento');
    obterOpcoesUnicasStatus(normalizedData, 'status');
    obterDiaComMaisVenda(normalizedData);
}
fetchData1();
function obterDiaComMaisVenda(data) {
    const transformarDataEmDiaDaSemana = data.map((venda) => {
        const dataCompleta = venda.data.split(' ')[0];
        const dataArray = dataCompleta.split("/");
        const data = new Date(`${dataArray[1]}/${dataArray[0]}/${dataArray[2]}`);
        const diaDaSemanaNumero = data.getDay();
        const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const diaDaSemanaNome = diasDaSemana[diaDaSemanaNumero];
        return diaDaSemanaNome;
    });
    const diaComMaisVenda = encontrarMaisFrequente(transformarDataEmDiaDaSemana);
    const htmlDiaMaisVenda = document.getElementById('maisVendas');
    if (htmlDiaMaisVenda instanceof HTMLDivElement) {
        htmlDiaMaisVenda.innerHTML = `Dia com mais vendas: ${diaComMaisVenda}`;
    }
}
function encontrarMaisFrequente(diasSemana) {
    const contador = {};
    let diaMaisFrequente = null;
    let maxContagem = 0;
    diasSemana.forEach(dia => {
        contador[dia] = (contador[dia] || 0) + 1;
        if (contador[dia] > maxContagem) {
            diaMaisFrequente = dia;
            maxContagem = contador[dia];
        }
    });
    return diaMaisFrequente;
}
function populateTotalValues(data) {
    const newData = data.map((item) => {
        if (item.valor === '-') {
            return { ...item, valor: '0' };
        }
        return item;
    });
    const total = newData.reduce((acc, item) => {
        if (item.valor === '-') {
            return acc;
        }
        else {
            return acc + (Number(item.valor.replace('.', '').replace(",", ".")));
        }
    }, 0);
    const totalBRL = formatarValorBRL(total);
    const spanTotal = document.getElementById('valueTotal');
    if (spanTotal instanceof HTMLSpanElement) {
        spanTotal.innerHTML = totalBRL;
    }
}
function obterOpcoesUnicasPagamento(data, propriedade) {
    const opcoesUnicas = new Set();
    data.forEach(item => {
        if (item.hasOwnProperty(propriedade)) {
            opcoesUnicas.add(item[propriedade]);
        }
    });
    const arrayOptions = Array.from(opcoesUnicas);
    const totalOpcoes = arrayOptions.map((option) => {
        const totalDeTransacoes = data.filter((item) => item.formaDePagamento === option).length;
        return `${option}: ${totalDeTransacoes}`;
    });
    const htmlMetodosPagamento = document.getElementById('paymentMethods');
    if (htmlMetodosPagamento instanceof HTMLElement) {
        totalOpcoes.forEach((option) => {
            htmlMetodosPagamento.insertAdjacentHTML('afterbegin', `<p>${option}</p>`);
        });
    }
}
function obterOpcoesUnicasStatus(data, propriedade) {
    const opcoesUnicas = new Set();
    data.forEach(item => {
        if (item.hasOwnProperty(propriedade)) {
            opcoesUnicas.add(item[propriedade]);
        }
    });
    const arrayOptions = Array.from(opcoesUnicas);
    const totalOpcoes = arrayOptions.map((option) => {
        const totalDeTransacoes = data.filter((item) => item.status === option).length;
        return `${option}: ${totalDeTransacoes}`;
    });
    const htmlMetodosPagamento = document.getElementById('status');
    if (htmlMetodosPagamento instanceof HTMLElement) {
        totalOpcoes.forEach((option) => {
            htmlMetodosPagamento.insertAdjacentHTML('afterbegin', `<p>${option}</p>`);
        });
    }
}
function formatarValorBRL(numero) {
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function normalizeKeys(data) {
    return data.map((item) => {
        const normalizedItem = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                const camelCaseKey = key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                    return index === 0 ? word.toLowerCase() : word.toUpperCase();
                }).replace(/\s+/g, '').replace('iD', "id").replace('(R$)', "");
                normalizedItem[camelCaseKey] = item[key];
            }
        }
        return normalizedItem;
    });
}
//# sourceMappingURL=exercicio1.js.map