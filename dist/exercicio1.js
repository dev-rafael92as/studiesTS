import fetchData from "./fetchData.js";
import normalizarTransacao from "./normalizarTransacao.js";
async function handleData() {
    const data = await fetchData("https://api.origamid.dev/json/transacoes.json");
    if (!data)
        return;
    const transacoes = data.map(normalizarTransacao);
    console.log(transacoes);
}
handleData();
async function fetchData1() {
    const transaction = await fetch("https://api.origamid.dev/json/transacoes.json");
    const transactionJSON = await transaction.json();
    const normalizedData = normalizeKeys(transactionJSON);
    populateTotalValues(normalizedData);
    obterOpcoesUnicasPagamento(normalizedData, 'formaDePagamento');
    obterOpcoesUnicasStatus(normalizedData, 'status');
    obterDiaComMaisVenda(normalizedData);
    popularTabela(normalizedData);
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
function popularTabela(data) {
    data.forEach((venda) => {
        const tBody = document.querySelector('tbody');
        if (tBody instanceof HTMLTableSectionElement) {
            const statusVenda = venda.status;
            const nomeCliente = venda.nome;
            const emailCliente = venda.email;
            const tipoPagamento = venda.formaDePagamento;
            const valorVendaBruto = venda.valor;
            let valorFormatado;
            if (valorVendaBruto === '-') {
                valorFormatado = "R$ -";
            }
            else {
                valorFormatado = formatarValorBRL(Number(valorVendaBruto.replace('.', '').replace(",", ".")));
            }
            if (typeof statusVenda === 'string' &&
                typeof nomeCliente === 'string' &&
                typeof emailCliente === 'string' &&
                typeof valorFormatado === 'string' &&
                typeof tipoPagamento === 'string') {
                tBody.insertAdjacentHTML('afterbegin', `<tr>
                    <td>${nomeCliente}</td>
                    <td>${emailCliente}</td>
                    <td>${valorFormatado}</td>
                    <td>${tipoPagamento}</td>
                    <td>${statusVenda}</td>
                </tr>`);
            }
        }
    });
}
//# sourceMappingURL=exercicio1.js.map