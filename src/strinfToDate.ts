export default function stringToDate(dateString: string): Date {
    const [data, tempo] = dateString.split(' ')
    const [dia, mes, ano] = data.split('/').map(Number)
    const [hora, minuto] = tempo.split(':').map(Number)

    return new Date(ano, mes - 1, dia, hora, minuto)
}