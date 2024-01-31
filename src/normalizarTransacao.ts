import moedaParaNumero from "./moedaParaNumero.js";
import stringToDate from "./strinfToDate.js";

declare global {
    type TrasacaoPagamento = "Boleto" | "Cartão de Crédito"
    type TransacaoStatus = "Estornada" | "Aguardando pagamento" | "Recusada pela operadora de cartão" | "Paga"
    
    interface TransacaoAPI {
        Nome: string;
        ID: number;
        Data: string;
        Status: TransacaoStatus;
        Email: string;
        ['Valor (R$)']: string;
        ['Forma de Pagamento']: TrasacaoPagamento;
        ['Cliente Novo']: number;
    }

    interface Transacao {
        nome: string;
        id: string;
        data: Date;
        status: TransacaoStatus;
        email: string;
        moeda: string;
        valor: number | null;
        pagamento: TrasacaoPagamento;
        novo: boolean;
    }
}

export default function normalizarTransacao<Interface>(transacao: TransacaoAPI) {
    return {
        nome: transacao.Nome,
        id: transacao.ID,
        data: stringToDate(transacao.Data),
        status: transacao.Status,
        email: transacao.Email,
        moeda: transacao["Valor (R$)"],
        valor: moedaParaNumero(transacao["Valor (R$)"]),
        pagamento: transacao["Forma de Pagamento"],
        novo: Boolean(transacao["Cliente Novo"])
    }
}