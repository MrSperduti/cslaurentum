let movimentiGlobali = [];

fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    const entrate = data.Entrata || [];
    const uscite = data.Uscita || [];

    movimentiGlobali = [...entrate.map(m => ({ ...m, tipo: "Entrata" })), ...uscite.map(m => ({ ...m, tipo: "Uscita" }))];
    movimentiGlobali.sort((a, b) => (a.data || "").localeCompare(b.data));

    aggiornaTabella();
    aggiornaGrafico();
  });

// 🔁 Aggiorna tabella con filtri attivi
function aggiornaTabella() {
  const container = document.getElementById("tabellaCompleta");
  container.innerHTML = "";

  const search = document.getElementById("searchInput").value.toLowerCase();
  const tipo = document.getElementById("tipoFiltro").value;
  const mese = document.getElementById("meseFiltro").value;

  const risultati = movimentiGlobali.filter(m => {
    const matchTipo = tipo === "" || m.tipo === tipo;
    const matchTesto = m.descrizione?.toLowerCase().includes(search) || m.note?.toLowerCase().includes(search);
    const matchMese = mese === "" || (m.data && m.data.startsWith(mese));
    return matchTipo && matchTesto && matchMese;
  });

  let totaleEntrate = 0;
  let totaleUscite = 0;

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Tipo</th>
        <th>Data</th>
        <th>Descrizione</th>
        <th>Totale</th>
        <th>Note</th>
        <th>Mese</th>
        <th>Vai</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement("tbody");

  const mesi = {
    '01': 'Gennaio', '02': 'Febbraio', '03': 'Marzo', '04': 'Aprile',
    '05': 'Maggio', '06': 'Giugno', '07': 'Luglio', '08': 'Agosto',
    '09': 'Settembre', '10': 'Ottobre', '11': 'Novembre', '12': 'Dicembre'
  };

  risultati.forEach(m => {
    const [anno, meseNum, giorno] = m.data.split("-");
    const dataFormatted = `${giorno}-${meseNum}-${anno}`;
    const meseNome = mesi[meseNum] ? `${mesi[meseNum]} ${anno}` : "";
    const meseParam = `${mesi[meseNum].toLowerCase()}${anno}`;
    const link = `<a href="mese.html?mese=${meseParam}">📄</a>`;

    const importo = parseFloat(m.totale || "0");
    if (m.tipo === "Entrata") totaleEntrate += importo;
    else totaleUscite += importo;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.tipo === "Entrata" ? "🟢 Entrata" : "🔴 Uscita"}</td>
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
  container.appendChild(table);

  document.getElementById("riepilogo").innerHTML = `
    <p class="entrate">Totale Entrate: € ${totaleEntrate.toFixed(2)}</p>
    <p class="uscite">Totale Uscite: € ${totaleUscite.toFixed(2)}</p>
    <p class="saldo">Saldo Totale: € ${(totaleEntrate - totaleUscite).toFixed(2)}</p>
  `;
}

// 📈 Grafico entrate/uscite per mese
function aggiornaGrafico() {
  const dati = {};

  movimentiGlobali.forEach(m => {
    if (!m.data) return;
    const [anno, mese] = m.data.split("-");
    const key = `${anno}-${mese}`;
    if (!dati[key]) dati[key] = { entrate: 0, uscite: 0 };

    const importo = parseFloat(m.totale || 0);
    if (m.tipo === "Entrata") dati[key].entrate += importo;
    else dati[key].uscite += importo;
  });

  const labels = Object.keys(dati).sort();
  const entrate = labels.map(k => dati[k].entrate);
  const uscite = labels.map(k => dati[k].uscite);

  const ctx = document.getElementById("graficoMensile").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Entrate", data: entrate, backgroundColor: "green" },
        { label: "Uscite", data: uscite, backgroundColor: "red" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Entrate vs Uscite mensili" }
      }
    }
  });
}

// 📤 Esporta Excel
function esportaExcel() {
  const datiTabella = [];
  const righe = document.querySelectorAll("#tabellaCompleta tbody tr");

  righe.forEach(riga => {
    const celle = riga.querySelectorAll("td");
    if (celle.length >= 7) {
      datiTabella.push({
        Tipo: celle[0].innerText,
        Data: celle[1].innerText,
        Descrizione: celle[2].innerText,
        Totale: celle[3].innerText,
        Note: celle[4].innerText,
        Mese: celle[5].innerText
      });
    }
  });

  const ws = XLSX.utils.json_to_sheet(datiTabella);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contabilità");
  XLSX.writeFile(wb, "contabilita_filtrata.xlsx");
}

// 🖨️ Esporta PDF (via stampa)
function esportaPDF() {
  const printContent = document.getElementById("tabellaCompleta").innerHTML;
  const original = document.body.innerHTML;
  document.body.innerHTML = `<h1>Stampa Contabilità</h1>${printContent}`;
  window.print();
  document.body.innerHTML = original;
  location.reload();
}

// 🔁 Eventi filtro
document.getElementById("searchInput").addEventListener("input", aggiornaTabella);
document.getElementById("tipoFiltro").addEventListener("change", aggiornaTabella);
document.getElementById("meseFiltro").addEventListener("change", aggiornaTabella);
