let giocatori = [];
let contabilita = [];

let modificaGiocatoreIndex = null;
let modificaContabilita = { tipo: null, index: null };

// Caricamento del file JSON dei giocatori
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

// Caricamento del file JSON della contabilità
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

// Gestione del submit del form per l'aggiunta o modifica di un giocatore
document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  // Se un documento è stato caricato, gestiamo il file del certificato medico
  const certificatoInput = e.target.querySelector('input[name="certificatoMedico"]');
  if (certificatoInput.files.length > 0) {
    const certificatoFile = certificatoInput.files[0];
    data.certificatoMedico = certificatoFile.name;
  }

  // Se un documento è stato caricato, gestiamo anche il file della foto
  const fotoInput = e.target.querySelector('input[name="foto"]');
  if (fotoInput.files.length > 0) {
    const fotoFile = fotoInput.files[0];
    data.foto = fotoFile.name;
  }

  // Se si sta modificando un giocatore esistente
  if (modificaGiocatoreIndex !== null) {
    giocatori[modificaGiocatoreIndex] = data;
    modificaGiocatoreIndex = null;
  } else {
    // Aggiungiamo un nuovo giocatore
    giocatori.push(data);
  }

  aggiornaAnteprima();
  mostraTabellaGiocatori();
  e.target.reset(); // Reset del form dopo l'invio
});

// Gestione del submit per la contabilità
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
  e.target.reset(); // Reset del form dopo l'invio
});

// Funzione per aggiornare l'anteprima del file JSON dei giocatori
function aggiornaAnteprima() {
  document.getElementById("anteprimaGiocatori").textContent = JSON.stringify(giocatori, null, 2);
  document.getElementById("anteprimaContabilita").textContent = JSON.stringify(contabilita, null, 2);
}

// Funzione per scaricare il file JSON dei giocatori
function scaricaGiocatori() {
  const blob = new Blob([JSON.stringify(giocatori, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "giocatori.json";
  link.click();
}

// Funzione per scaricare il file JSON della contabilità
function scaricaContabilita() {
  const blob = new Blob([JSON.stringify(contabilita, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contabilita.json";
  link.click();
}

// Funzione per mostrare la tabella dei giocatori
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

// Funzione per modificare un giocatore
function modificaGiocatore(i) {
  const form = document.getElementById("giocatoreForm");
  Object.entries(giocatori[i]).forEach(([k, v]) => {
    if (form[k]) form[k].value = v;
  });
  modificaGiocatoreIndex = i;
  window.scrollTo(0, form.offsetTop);
}

// Funzione per ordinare la tabella dei giocatori
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
