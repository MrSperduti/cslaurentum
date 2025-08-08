
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

document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
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
  const data = Object.fromEntries(new FormData(e.target).entries());

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



// ---- DEBUG/Compat helpers ----
function normalizeGiocatori(parsed) {
  // Accept: array, or {giocatori:[...]} or {players:[...]}
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.giocatori)) return parsed.giocatori;
  if (parsed && Array.isArray(parsed.players)) return parsed.players;
  // Fallback: try to convert object values to array
  if (parsed && typeof parsed === 'object') {
    const vals = Object.values(parsed).filter(v => Array.isArray(v));
    if (vals.length === 1) return vals[0];
  }
  return [];
}

function showStatus(msg, isError) {
  let el = document.getElementById('statusEditor');
  if (!el) {
    el = document.createElement('div');
    el.id = 'statusEditor';
    el.style.margin='10px 0';
    el.style.padding='10px';
    el.style.borderRadius='6px';
    el.style.background= isError ? '#ffe6e6' : '#e6fff0';
    el.style.border='1px solid ' + (isError ? '#cc0000' : '#00aa55');
    document.querySelector('.container')?.insertBefore(el, document.querySelector('.container').children[1] || null);
  }
  el.textContent = msg;
  el.style.background = isError ? '#ffe6e6' : '#e6fff0';
  el.style.border = '1px solid ' + (isError ? '#cc0000' : '#00aa55');
}

// Override listeners with more robust parsing and explicit status
(function() {
  const input = document.getElementById("caricaGiocatori");
  if (!input) return;
  input.addEventListener("change", function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      try {
        const raw = reader.result;
        const parsed = JSON.parse(raw);
        const arr = normalizeGiocatori(parsed);
        if (!Array.isArray(arr)) throw new Error("Formato non riconosciuto");
        giocatori = arr;
        aggiornaAnteprima();
        mostraTabellaGiocatori();
        showStatus(`Giocatori caricati: ${giocatori.length}`, false);
      } catch (err) {
        console.error("Errore parsing giocatori.json:", err);
        alert("Errore nel file giocatori.json");
        showStatus("Errore nel file giocatori.json", true);
      }
    };
    reader.readAsText(file);
  }, { once: true });
})();

// Make anteprima clearly visible even for large JSON
(function(){
  const pre = document.getElementById("anteprimaGiocatori");
  if (pre) {
    pre.style.maxHeight = '300px';
    pre.style.overflow = 'auto';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.wordBreak = 'break-word';
  }
})();
