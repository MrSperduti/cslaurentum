document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  // Gestione del caricamento della foto
  const fotoInput = e.target.querySelector('input[name="foto"]');
  if (fotoInput.files.length > 0) {
    const fotoFile = fotoInput.files[0];
    // Salviamo solo il nome del file della foto, esattamente come per il certificato medico
    data.foto = fotoFile.name;
  }

  // Gestione del caricamento del certificato medico (già esistente)
  const certificatoInput = e.target.querySelector('input[name="certificatoMedico"]');
  if (certificatoInput.files.length > 0) {
    const certificatoFile = certificatoInput.files[0];
    data.certificatoMedico = certificatoFile.name;
  }

  // Verifica se stiamo modificando un giocatore esistente
  if (modificaGiocatoreIndex !== null) {
    // Se il giocatore è già esistente, aggiorniamo i suoi dati
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
