// Gestione del submit del form per l'aggiunta o modifica di un giocatore
document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  // Se un documento è stato caricato, gestiamo il file del certificato medico
  const certificatoInput = e.target.querySelector('input[name="certificatoMedico"]');
  if (certificatoInput.files.length > 0) {
    const certificatoFile = certificatoInput.files[0];
    // Salviamo solo il nome del file, il file sarà caricato separatamente (su GitHub o server)
    data.certificatoMedico = certificatoFile.name;
  }

  // Se un documento è stato caricato, gestiamo anche il file della foto
  const fotoInput = e.target.querySelector('input[name="foto"]');
  if (fotoInput.files.length > 0) {
    const fotoFile = fotoInput.files[0];
    // Salviamo solo il nome del file dell'immagine
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
