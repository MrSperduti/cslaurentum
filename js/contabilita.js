
fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const meseRichiesto = params.get("mese");
    const meseMap = {
      gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
      maggio: "05", giugno: "06", luglio: "07", agosto: "08",
      settembre: "09", ottobre: "10", novembre: "11", dicembre: "12"
    };

    const meseNome = meseRichiesto.slice(0, -4);  // es. luglio
    const anno = meseRichiesto.slice(-4); // es. 2025
    const meseNumerico = meseMap[meseNome.toLowerCase()];

    if (!meseNumerico) return;

    const filtrati = data.filter(m => {
      const [y, mth, d] = m.data.split("-");
      return y === anno && mth === meseNumerico;
    });

    const divEntrate = document.getElementById("tabellaEntrate");
    const divUscite = document.getElementById("tabellaUscite");

    function generaTabella(lista) {
      if (lista.length === 0) return "<p>Nessun movimento.</p>";
      let html = "<table><thead><tr><th>Data</th><th>Descrizione</th><th>Totale</th><th>Note</th></tr></thead><tbody>";
      lista.forEach(m => {
        html += `<tr><td>${m.data || ""}</td><td>${m.descrizione || ""}</td><td>${m.totale || ""}</td><td>${m.note || ""}</td></tr>`;
      });
      html += "</tbody></table>";
      return html;
    }

    divEntrate.innerHTML = generaTabella(filtrati.filter(m => m.tipo === "Entrata"));
    divUscite.innerHTML = generaTabella(filtrati.filter(m => m.tipo === "Uscita"));
  });
