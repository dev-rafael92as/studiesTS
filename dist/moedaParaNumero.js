export default function moedaParaNumero(moeda) {
    const numero = Number(moeda.replaceAll('.', '').replace(',', '.'));
    if (isNaN(numero)) {
        return null;
    }
    else {
        return numero;
    }
}
//# sourceMappingURL=moedaParaNumero.js.map