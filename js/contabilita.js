
// ✅ Patch: gestione decimali ITA (virgola) + formattazione €
// - Accetta "12,50" o "12.50" ovunque
// - Somme e grafici ora usano numeri corretti
// - Nella tabella il totale è formattato in € con due decimali

let movimentiGlobali = [];

// --- Helpers ---
function parseImporto(val) {
  if (typeof val === "number") return val;
  if (val == null) return 0;
  // Rimuove spazi, sostituisce la virgola con il punto
  const clean = String(val).trim().replace(/\s+/g, "").replace(",", ".");
  const num = Number(clean);
  return isNaN(num) ? 0 : num;
}

function formatEuro(num) {
  const n = typeof num === "number" ? num : parseImporto(num);
  // Evita -0,00
  const safe = Math.abs(n) < 1e-9 ? 0 : n;
  return safe.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

fetch("dati/contabilita.json")
  .then(res => res.json())
  .then(data => {
    const entrate = data.Entrata || [];
    const uscite = data.Uscita || [];

    movimentiGlobali = [
      ...entrate.map(m => ({ ...m, tipo: "Entrata" })),
      ...uscite.map(m => ({ ...m, tipo: "Uscita" }))
    ];
    movimentiGlobali.sort((a, b) => (a.data || "").localeCompare(b.data));

    aggiornaTabella();
    aggiornaGrafico();
  });

// 🔁 Aggiorna tabella con filtri attivi
function aggiornaTabella() {
  const container = document.getElementById("tabellaCompleta");
  container.innerHTML = "";

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const tipo = document.getElementById("tipoFiltro")?.value || "";
  const mese = document.getElementById("meseFiltro")?.value || "";

  const risultati = movimentiGlobali.filter(m => {
    const matchTipo = tipo === "" || m.tipo === tipo;
    const matchTesto =
      (m.descrizione || "").toLowerCase().includes(search) ||
      (m.note || "").toLowerCase().includes(search);
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
    const [anno, meseNum, giorno] = (m.data || "").split("-");
    const dataFormatted = (anno && meseNum && giorno) ? `${giorno}-${meseNum}-${anno}` : (m.data || "");
    const meseNome = mesi[meseNum] ? `${mesi[meseNum]} ${anno}` : "";
    const meseParam = mesi[meseNum] ? `${mesi[meseNum].toLowerCase()}${anno}` : "";
    const link = meseParam ? `<a href="mese.html?mese=${meseParam}">📄</a>` : "";

    const importo = parseImporto(m.totale);
    if (m.tipo === "Entrata") totaleEntrate += importo;
    else totaleUscite += importo;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.tipo === "Entrata" ? "🟢 Entrata" : "🔴 Uscita"}</td>
      <td>${dataFormatted}</td>
      <td>${m.descrizione || ""}</td>
      <td>${formatEuro(importo)}</td>
      <td>${m.note || ""}</td>
      <td>${meseNome}</td>
      <td>${link}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  // Riepilogo formattato
  const riepilogo = document.getElementById("riepilogo");
  if (riepilogo) {
    riepilogo.innerHTML = `
      <p class="entrate">Totale Entrate: ${formatEuro(totaleEntrate)}</p>
      <p class="uscite">Totale Uscite: ${formatEuro(totaleUscite)}</p>
      <p class="saldo">Saldo Totale: ${formatEuro(totaleEntrate - totaleUscite)}</p>
    `;
  }
}

// 📈 Grafico entrate/uscite per mese
function aggiornaGrafico() {
  const dati = {};

  movimentiGlobali.forEach(m => {
    if (!m.data) return;
    const [anno, mese] = m.data.split("-");
    const key = `${anno}-${mese}`;
    if (!dati[key]) dati[key] = { entrate: 0, uscite: 0 };

    const importo = parseImporto(m.totale);
    if (m.tipo === "Entrata") dati[key].entrate += importo;
    else dati[key].uscite += importo;
  });

  const labels = Object.keys(dati).sort();
  const entrate = labels.map(k => dati[k].entrate);
  const uscite = labels.map(k => dati[k].uscite);

  const ctx = document.getElementById("graficoMensile")?.getContext("2d");
  if (!ctx) return;
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
      },
      scales: {
        y: {
          ticks: {
            // Mostra € anche sull'asse
            callback: (value) => formatEuro(value)
          }
        }
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
      // Togliamo il simbolo € per l'export numerico
      const totaleStr = (celle[3].innerText || "").replace(/[^\d,.-]/g, "").replace(",", ".");
      datiTabella.push({
        Tipo: celle[0].innerText,
        Data: celle[1].innerText,
        Descrizione: celle[2].innerText,
        Totale: Number(totaleStr),
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
document.getElementById("searchInput")?.addEventListener("input", aggiornaTabella);
document.getElementById("tipoFiltro")?.addEventListener("change", aggiornaTabella);
document.getElementById("meseFiltro")?.addEventListener("change", aggiornaTabella);
