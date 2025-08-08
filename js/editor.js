
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


let giocatori = [];
let contabilita = [];

let modificaGiocatoreIndex = null;
let modificaContabilita = { tipo: null, index: null };

document.getElementById("caricaGiocatori").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    try {
      giocatori = JSON.parse(reader.result);
      aggiornaAnteprima();
      mostraTabellaGiocatori();
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
      aggiornaAnteprima();
      mostraTabellaContabilita();
    } catch (err) {
      alert("Errore nel file contabilita.json");
    }
  };
  reader.readAsText(e.target.files[0]);
});

document.getElementById("giocatoreForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("visitaMedicaDocumento");
  if (file && file.size > 0) {
    data.visitaMedicaFileName = file.name;
    data.visitaMedicaMime = file.type;
    data.visitaMedicaData = await readFileAsDataURL(file);
  }
  if (modificaGiocatoreIndex !== null) {
    giocatori[modificaGiocatoreIndex] = data;
    modificaGiocatoreIndex = null;
  } else {
    giocatori.push(data);
  }
  aggiornaAnteprima();
  mostraTabellaGiocatori();
  e.target.reset();
});

document.getElementById("movimentoForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("visitaMedicaDocumento");
  if (file && file.size > 0) {
    data.visitaMedicaFileName = file.name;
    data.visitaMedicaMime = file.type;
    data.visitaMedicaData = await readFileAsDataURL(file);
  }

  if (!contabilita || Array.isArray(contabilita)) {
    contabilita = { Entrata: [], Uscita: [] };
  }
  if (!contabilita[data.tipo]) contabilita[data.tipo] = [];

  if (modificaContabilita && modificaContabilita.index !== null && modificaContabilita.tipo === data.tipo) {
    contabilita[data.tipo][modificaContabilita.index] = data;
    modificaContabilita = { tipo: null, index: null };
  } else {
    contabilita[data.tipo].push(data);
  }

  aggiornaAnteprima();
  mostraTabellaContabilita();
  e.target.reset();
});

function mostraTabellaGiocatori() {
  const div = document.getElementById("listaGiocatori");
  div.innerHTML = "";
  if (giocatori.length === 0) return;

  const table = document.createElement("table");
  table.innerHTML = "<thead><tr>" + Object.keys(giocatori[0]).map(k => `<th>${k}</th>`).join("") + "<th>Azioni</th></tr></thead>";
  const tbody = document.createElement("tbody");

  giocatori.forEach((g, i) => {
    const tr = document.createElement("tr");
    Object.values(g).forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });

    const tdAzioni = document.createElement("td");
    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.onclick = () => modificaGiocatore(i);

    const btnDel = document.createElement("button");
    btnDel.textContent = "Elimina";
    btnDel.onclick = () => {
      giocatori.splice(i, 1);
      aggiornaAnteprima();
      mostraTabellaGiocatori();
    };

    tdAzioni.appendChild(btnMod);
    tdAzioni.appendChild(btnDel);
    tr.appendChild(tdAzioni);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  div.appendChild(table);
}

function mostraTabellaContabilita() {
  const div = document.getElementById("listaContabilita");
  div.innerHTML = "";

  ["Entrata", "Uscita"].forEach(tipo => {
    if (!contabilita[tipo] || contabilita[tipo].length === 0) return;

    const h3 = document.createElement("h3");
    h3.textContent = tipo;
    div.appendChild(h3);

    const table = document.createElement("table");
    table.innerHTML = "<thead><tr>" + Object.keys(contabilita[tipo][0]).map(k => `<th>${k}</th>`).join("") + "<th>Azioni</th></tr></thead>";
    const tbody = document.createElement("tbody");

    contabilita[tipo].forEach((m, i) => {
      const tr = document.createElement("tr");
      Object.values(m).forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.appendChild(td);
      });

      const tdAzioni = document.createElement("td");
      const btnMod = document.createElement("button");
      btnMod.textContent = "Modifica";
      btnMod.onclick = () => modificaMovimento(tipo, i);

      const btnDel = document.createElement("button");
      btnDel.textContent = "Elimina";
      btnDel.onclick = () => {
        contabilita[tipo].splice(i, 1);
        aggiornaAnteprima();
        mostraTabellaContabilita();
      };

      tdAzioni.appendChild(btnMod);
      tdAzioni.appendChild(btnDel);
      tr.appendChild(tdAzioni);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.appendChild(table);
  });
}

function modificaGiocatore(i) {
  const form = document.getElementById("giocatoreForm");
  Object.entries(giocatori[i]).forEach(([k, v]) => {
    if (form[k]) form[k].value = v;
  });
  modificaGiocatoreIndex = i;
  window.scrollTo(0, form.offsetTop);
}

function modificaMovimento(tipo, i) {
  const form = document.getElementById("movimentoForm");
  Object.entries(contabilita[tipo][i]).forEach(([k, v]) => {
    if (form[k]) form[k].value = v;
  });
  modificaContabilita = { tipo: tipo, index: i };
  window.scrollTo(0, form.offsetTop);
}

function aggiornaAnteprima() {
  document.getElementById("anteprimaGiocatori").textContent = JSON.stringify(giocatori, null, 2);
  document.getElementById("anteprimaContabilita").textContent = JSON.stringify(contabilita, null, 2);
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

function apriRepoGitHub() {
  const repoUrl = "https://github.com/MrSperduti/cslaurentum";
  window.open(repoUrl, "_blank");
}



function ordinaPerCampo(campo) {
  giocatori.sort((a, b) => {
    let valA = a[campo] || "";
    let valB = b[campo] || "";
    if (!isNaN(valA) && !isNaN(valB)) {
      return Number(valA) - Number(valB);
    }
    return valA.localeCompare(valB);
  });
  mostraTabellaGiocatori();
  aggiornaAnteprima();
}
