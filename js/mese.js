
const params = new URLSearchParams(window.location.search);
const meseParam = params.get("mese"); // es. 'luglio2025'

if (!meseParam) {
  document.body.innerHTML = "<p>Parametro 'mese' mancante</p>";
} else {
  fetch("dati/contabilita.json")
    .then(res => res.json())
    .then(movimenti => {
      const entrateTable = document.getElementById("tabellaEntrate").getElementsByTagName("tbody")[0];
      const usciteTable = document.getElementById("tabellaUscite").getElementsByTagName("tbody")[0];
      const meseMap = {
        "gennaio": "01", "febbraio": "02", "marzo": "03", "aprile": "04",
        "maggio": "05", "giugno": "06", "luglio": "07", "agosto": "08",
        "settembre": "09", "ottobre": "10", "novembre": "11", "dicembre": "12"
      };

      const meseNome = meseParam.slice(0, -4); // es. "luglio"
      const anno = meseParam.slice(-4); // es. "2025"
      const meseNumerico = meseMap[meseNome.toLowerCase()];

      if (!meseNumerico) return;

      const filtrati = movimenti.filter(m => {
        if (!m.data) return false;
        const [y, mth, d] = m.data.split("-");
        return y === anno && mth === meseNumerico;
      });

      filtrati.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${m.data || ""}</td>
          <td>${m.descrizione || ""}</td>
          <td>${m.totale || ""}</td>
          <td>${m.note || ""}</td>`;
        if (m.tipo === "Entrata") {
          entrateTable.appendChild(row);
        } else if (m.tipo === "Uscita") {
          usciteTable.appendChild(row);
        }
      });
    });
}
