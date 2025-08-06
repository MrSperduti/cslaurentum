fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    let movimenti = [];

    if (Array.isArray(data)) {
      movimenti = data;
    } else {
      ["Entrata", "Uscita"].forEach(tipo => {
        if (Array.isArray(data[tipo])) {
          data[tipo].forEach(m => movimenti.push({ ...m, tipo }));
        }
      });
    }

    movimenti.sort((a, b) => (a.data || "").localeCompare(b.data));

    const container = document.getElementById("tabellaCompleta");
    if (!container) return;

    if (movimenti.length === 0) {
      container.innerHTML = "<p>Nessun movimento disponibile.</p>";
      return;
    }

    let totaleEntrate = 0;
    let totaleUscite = 0;

    const table = document.createElement("table");
    const intestazioni = ["Tipo", "Data", "Descrizione", "Totale", "Note", "Mese", "Vai"];
    table.innerHTML = "<thead><tr>" + intestazioni.map(c => `<th>${c}</th>`).join("") + "</tr></thead>";

    const tbody = document.createElement("tbody");

    const mesi = {
      '01': 'Gennaio', '02': 'Febbraio', '03': 'Marzo', '04': 'Aprile',
      '05': 'Maggio', '06': 'Giugno', '07': 'Luglio', '08': 'Agosto',
      '09': 'Settembre', '10': 'Ottobre', '11': 'Novembre', '12': 'Dicembre'
    };

    movimenti.forEach(m => {
      let dataFormatted = m.data;
      let meseNome = "";
      let link = "";

      if (m.data && m.data.length === 10) {
        const [anno, mese, giorno] = m.data.split("-");
        dataFormatted = `${giorno}-${mese}-${anno}`;
        meseNome = mesi[mese] ? `${mesi[mese]} ${anno}` : "";
        const param = `${mesi[mese].toLowerCase()}${anno}`; // es. luglio2025
        link = `<a href="mese.html?mese=${param}">📄</a>`;
      }

      const importo = parseFloat(m.totale || "0");
      if (m.tipo === "Entrata") totaleEntrate += importo;
      else if (m.tipo === "Uscita") totaleUscite += importo;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.tipo || ""}</td>
        <td>${dataFormatted}</td>
        <td>${m.descrizione || ""}</td>
        <td>${m.totale || ""}</td>
        <td>${m.note || ""}</td>
        <td>${meseNome}</td>
        <td>${link}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    const riepilogo = document.createElement("div");
    riepilogo.innerHTML = `
      <p><strong>Totale Entrate:</strong> € ${totaleEntrate.toFixed(2)}</p>
      <p><strong>Totale Uscite:</strong> € ${totaleUscite.toFixed(2)}</p>
      <p><strong>Saldo:</strong> € ${(totaleEntrate - totaleUscite).toFixed(2)}</p>
    `;

    container.appendChild(riepilogo);
    container.appendChild(table);
  });
