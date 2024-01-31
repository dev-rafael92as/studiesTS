import countBy from "./countBy.js";
function filtrarValor(transacao) {
    return transacao.valor !== null;
}
export default class Estatisticas {
    transacoes;
    total;
    pagamento;
    status;
    constructor(transacoes) {
        this.transacoes = transacoes;
        this.total = this.setTotal();
        this.pagamento = this.setPagamento();
        this.status = this.setStatus();
    }
    setTotal() {
        return this.transacoes.filter(filtrarValor).reduce((acc, item) => { return acc + item.valor; }, 0);
    }
    setPagamento() {
        const pagamentos = this.transacoes.map(({ pagamento }) => pagamento);
        return countBy(pagamentos);
    }
    setStatus() {
        const allStatus = this.transacoes.map(({ status }) => status);
        return countBy(allStatus);
    }
}
//# sourceMappingURL=Estatisticas.js.map