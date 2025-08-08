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
      aggiornaAnteprima(); // Assicuriamoci che l'anteprima venga aggiornata correttamente
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
      aggiornaAnteprima(); // Assicuriamoci che l'anteprima venga aggiornata correttamente
      mostraTabellaContabilita();
    } catch (err) {
      alert("Errore nel file contabilita.json");
    }
  };
  reader.readAsText(e.target.files[0]);
});

// Gestione del submit del form per l'aggiunta o modifica di un giocatore
document.get
