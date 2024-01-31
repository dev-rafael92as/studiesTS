import countBy from "./countBy.js";

type TransacaoValor = Transacao & { valor: number }
function filtrarValor(transacao: Transacao): transacao is TransacaoValor {
    return transacao.valor !== null
}

export default class Estatisticas {
    private transacoes;
    total;
    pagamento;
    status;

    constructor(transacoes: Transacao[]) {
        this.transacoes = transacoes
        this.total = this.setTotal()
        this.pagamento = this.setPagamento()
        this.status = this.setStatus()
    }

    private setTotal() {
        return this.transacoes.filter(filtrarValor).reduce((acc, item) => {return acc + item.valor}, 0)
    }

    private setPagamento() {
        const pagamentos = this.transacoes.map(({pagamento}) => pagamento)
        return countBy(pagamentos)
    }

    private setStatus() {
        const allStatus = this.transacoes.map(({status}) => status)
        return countBy(allStatus)
    }
} 