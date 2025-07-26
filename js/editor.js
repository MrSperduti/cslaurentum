
let giocatori = [];
let contabilita = [];

document.getElementById("caricaGiocatori").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    try {
      giocatori = JSON.parse(reader.result);
      document.getElementById('anteprimaGiocatori').textContent = JSON.stringify(giocatori, null, 2);
      aggiornaElencoGiocatori();
    } catch (err) {
      alert("Errore nel file giocatori.json");
    }
  };
  reader.readAsText(e.target.files[0]);
});

document.getElementById("caricaContabilita").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    try {
      contabilita = JSON.parse(reader.result);
      document.getElementById('anteprimaContabilita').textContent = JSON.stringify(contabilita, null, 2);
      aggiornaElencoContabilita();
    } catch (err) {
      alert("Errore nel file contabilita.json");
    }
  };
  reader.readAsText(e.target.files[0]);
});

document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  giocatori.push(data);
  aggiornaElencoGiocatori();
  form.reset();
});

document.getElementById("movimentoForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if (!contabilita[data.tipo]) contabilita[data.tipo] = [];
  contabilita[data.tipo].push(data);
  aggiornaElencoContabilita();
  form.reset();
});

function aggiornaElencoGiocatori() {
  const lista = document.getElementById("listaGiocatori");
  lista.innerHTML = "";
  giocatori.forEach((g, i) => {
    const div = document.createElement("div");
    div.textContent = `${g.nome} ${g.cognome} (${g.categoria})`;
    lista.appendChild(div);
  });
}

function aggiornaElencoContabilita() {
  const lista = document.getElementById("listaContabilita");
  lista.innerHTML = "";
  const tipi = ["Entrata", "Uscita"];
  tipi.forEach(tipo => {
    if (!contabilita[tipo]) return;
    const titolo = document.createElement("h3");
    titolo.textContent = tipo;
    lista.appendChild(titolo);
    contabilita[tipo].forEach((m, i) => {
      const div = document.createElement("div");
      div.textContent = `${m.data} - ${m.descrizione} - €${m.totale} (${m.note})`;
      lista.appendChild(div);
    });
  });
}

function scaricaGiocatori() {
  const blob = new Blob([JSON.stringify(giocatori, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "giocatori.json";
  link.click();
}

function scaricaContabilita() {
  const blob = new Blob([JSON.stringify(contabilita, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contabilita.json";
  link.click();
}

if (document.getElementById("anteprimaGiocatori")) {
  document.getElementById("giocatoreForm").addEventListener("submit", () => {
    document.getElementById("anteprimaGiocatori").textContent = JSON.stringify(giocatori, null, 2);
  });
}
if (document.getElementById("anteprimaContabilita")) {
  document.getElementById("movimentoForm").addEventListener("submit", () => {
    document.getElementById("anteprimaContabilita").textContent = JSON.stringify(contabilita, null, 2);
  });
}
