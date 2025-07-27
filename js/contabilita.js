
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

    const table = document.createElement("table");
    const intestazioni = ["Tipo", "Data", "Descrizione", "Totale", "Note", "Mese"];
    table.innerHTML = "<thead><tr>" + intestazioni.map(c => `<th>${c}</th>`).join("") + "</tr></thead>";

    const tbody = document.createElement("tbody");
    movimenti.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.tipo || ""}</td>
        <td>${m.data || ""}</td>
        <td>${m.descrizione || ""}</td>
        <td>${m.totale || ""}</td>
        <td>${m.note || ""}</td>
        <td>${m.mese || ""}</td>`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  });
