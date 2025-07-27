
fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("tabellaCompleta");
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = "<p>Nessun movimento disponibile.</p>";
      return;
    }

    const table = document.createElement("table");
    const intestazioni = ["Tipo", "Data", "Descrizione", "Totale", "Note"];
    table.innerHTML = "<thead><tr>" + intestazioni.map(c => `<th>${c}</th>`).join("") + "</tr></thead>";

    const tbody = document.createElement("tbody");

    // Ordinamento dei movimenti per data
    data.sort((a, b) => (a.data || "").localeCompare(b.data));

    // Aggiunta dei dati nella tabella con il formato dd-mm-yyyy
    data.forEach(m => {
      let dataFormatted = m.data;
      if (m.data && m.data.length === 10) {
        const [anno, mese, giorno] = m.data.split("-");
        dataFormatted = `${giorno}-${mese}-${anno}`;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.tipo || ""}</td>
        <td>${dataFormatted}</td>
        <td>${m.descrizione || ""}</td>
        <td>${m.totale || ""}</td>
        <td>${m.note || ""}</td>`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  });
