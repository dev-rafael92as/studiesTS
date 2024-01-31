"use strict";
async function fetchData(url) {
    const base = 'https://api.origamid.dev/json';
    const response = await fetch(base + url);
    return await response.json();
}
async function handleData() {
    const jogo = await fetchData('/jogo.json');
    if (checkInterface(jogo, 'ano')) {
        console.log(jogo.ano);
    }
    const livro = await fetchData('/livro.json');
    if (checkInterface(livro, 'ano')) {
        console.log(livro.ano);
    }
}
handleData();
function checkInterface(obj, ...keys) {
    if (obj &&
        typeof obj === 'object' &&
        keys.filter((key) => key in obj).length === keys.length) {
        return true;
    }
    else {
        return false;
    }
}
function checkInterfaceSimples(obj, key) {
    if (obj && typeof obj === 'object' && key in obj) {
        return true;
    }
    else {
        return false;
    }
}
