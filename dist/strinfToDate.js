export default function stringToDate(dateString) {
    const [data, tempo] = dateString.split(' ');
    const [dia, mes, ano] = data.split('/').map(Number);
    const [hora, minuto] = tempo.split(':').map(Number);
    return new Date(ano, mes - 1, dia, hora, minuto);
}
//# sourceMappingURL=strinfToDate.js.map