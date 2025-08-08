// Funzione per modificare un giocatore
function modificaGiocatore(i) {
  const form = document.getElementById("giocatoreForm");
  // Popola i campi del form con i dati del giocatore
  Object.entries(giocatori[i]).forEach(([k, v]) => {
    if (form[k]) form[k].value = v;
  });

  // Se esiste un certificato medico, mostralo nel form
  const certificatoInput = document.querySelector('input[name="certificatoMedico"]');
  if (giocatori[i].certificatoMedico) {
    // Mostra il nome del file del certificato
    certificatoInput.setAttribute("data-certificato", giocatori[i].certificatoMedico);
  }

  // Se esiste una foto, mostralo nel form
  const fotoPreviewDiv = document.getElementById("fotoPreview");
  if (giocatori[i].foto) {
    fotoPreviewDiv.innerHTML = `<img src="foto/${giocatori[i].foto}" alt="Foto Giocatore" style="max-width: 150px; height: auto;">`;
  } else {
    fotoPreviewDiv.innerHTML = "Nessuna foto disponibile.";
  }

  // Imposta l'indice del giocatore da modificare
  modificaGiocatoreIndex = i;
  window.scrollTo(0, form.offsetTop);
}

// Gestione del submit del form per l'aggiunta o modifica di un giocatore
document.getElementById("giocatoreForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Raccolta dei dati dal form
  const data = Object.fromEntries(new FormData(e.target).entries());  // Raccoglie tutti i dati dal form

  // Gestione del certificato medico (se presente)
  const certificatoInput = e.target.querySelector('input[name="certificatoMedico"]');
  // Verifica se è stato selezionato un nuovo file
  if (certificatoInput.files.length > 0) {
    const certificatoFile = certificatoInput.files[0];
    data.certificatoMedico = certificatoFile.name;  // Salviamo solo il nome del file
  } else if (modificaGiocatoreIndex !== null && giocatori[modificaGiocatoreIndex].certificatoMedico) {
    // Mantieni il certificato esistente se non viene caricato un nuovo file
    data.certificatoMedico = giocatori[modificaGiocatoreIndex].certificatoMedico;
  }

  // Gestione della foto (se presente)
  const fotoInput = e.target.querySelector('input[name="foto"]');
  if (fotoInput.files.length > 0) {
    const fotoFile = fotoInput.files[0];
    data.foto = fotoFile.name;  // Salviamo solo il nome del file immagine
  } else if (modificaGiocatoreIndex !== null && giocatori[modificaGiocatoreIndex].foto) {
    // Mantieni la foto esistente se non viene caricata una nuova immagine
    data.foto = giocatori[modificaGiocatoreIndex].foto;
  }

  // Se si sta modificando un giocatore esistente
  if (modificaGiocatoreIndex !== null) {
    giocatori[modificaGiocatoreIndex] = data;
    modificaGiocatoreIndex = null;
  } else {
    // Aggiungiamo un nuovo giocatore
    giocatori.push(data);
  }

  // Dopo aver aggiunto o modificato il giocatore, aggiorniamo l'anteprima e la lista
  aggiornaAnteprima();
  mostraTabellaGiocatori();
  e.target.reset();  // Reset del form dopo l'invio
});

// Funzione per aggiornare l'anteprima del file JSON dei giocatori
function aggiornaAnteprima() {
  document.getElementById("anteprimaGiocatori").textContent = JSON.stringify(giocatori, null, 2);
}
