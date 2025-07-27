
const param = new URLSearchParams(window.location.search);
const raw = param.get("mese") || "";
const mesiNomi = {
  gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
  maggio: "05", giugno: "06", luglio: "07", agosto: "08",
  settembre: "09", ottobre: "10", novembre: "11", dicembre: "12"
};

let meseRif = "";
for (let nome in mesiNomi) {
  if (raw.toLowerCase().includes(nome)) {
    const anno = raw.match(/\d{4}$/);
    if (anno) {
      meseRif = `${anno[0]}-${mesiNomi[nome]}`;
    }
    break;
  }
}

fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    let entrate = [], uscite = [];

    if (Array.isArray(data)) {
      data.forEach(m => {
        if (m.data && m.data.startsWith(meseRif)) {
          if (m.tipo === "Entrata") entrate.push(m);
          else if (m.tipo === "Uscita") uscite.push(m);
        }
      });
    } else {
      ["Entrata", "Uscita"].forEach(tipo => {
        (data[tipo] || []).forEach(m => {
          if (m.data && m.data.startsWith(meseRif)) {
            if (tipo === "Entrata") entrate.push(m);
            else if (tipo === "Uscita") uscite.push(m);
          }
        });
      });
    }

    const divEntrate = document.getElementById("tabellaEntrate");
    const divUscite = document.getElementById("tabellaUscite");

    function generaTabella(lista) {
      if (lista.length === 0) return "<p>Nessun movimento.</p>";
      let html = "<table><thead><tr><th>Data</th><th>Descrizione</th><th>Totale</th><th>Note</th></tr></thead><tbody>";
      lista.forEach(m => {
        html += `<tr><td>${m.data}</td><td>${m.descrizione}</td><td>${m.totale}</td><td>${m.note || ""}</td></tr>`;
      });
      html += "</tbody></table>";
      return html;
    }

    divEntrate.innerHTML = generaTabella(entrate);
    divUscite.innerHTML = generaTabella(uscite);
  });
