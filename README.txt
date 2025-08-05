
# CS LAURENTUM - Gestionale Calcio a 5

Questo gestionale è pensato per gestire le anagrafiche dei giocatori e la contabilità della società CS LAURENTUM.

## 📁 STRUTTURA DEL PROGETTO

- `index.html`: Home del gestionale
- `editor.html`: Area riservata per inserimento/modifica dati (giocatori e contabilità)
- `serie-c2.html` / `under-21.html`: Visualizzazione pubblica dei giocatori per categoria
- `giocatore.html?id=NUMERO`: Profilo completo del giocatore
- `contabilita.html`: Riepilogo entrate, uscite e saldo
- `mese.html?mese=MESE`: Visualizzazione dettagliata di entrate/uscite mensili

## ⚙️ UTILIZZO

### 1. Inserimento / modifica dati (solo Admin)
- Apri `editor.html` dal tuo PC o tablet
- Carica i file `giocatori.json` e/o `contabilita.json` esistenti
- Inserisci nuovi dati tramite i moduli
- Al termine, clicca su **"Scarica giocatori.json"** o **"Scarica contabilita.json"**
- Carica i file aggiornati su GitHub Pages (o altro spazio pubblico) per aggiornare i dati

### 2. Visualizzazione pubblica
- I file HTML leggono i dati da:
  - `dati/giocatori.json`
  - `dati/contabilita.json`
- Per aggiornare la parte pubblica, sostituisci i file `.json` su GitHub

## 📝 NOTE
- Il salvataggio dei dati avviene **solo localmente** tramite download dei file `.json`
- Nessun dato viene perso se carichi il file giusto prima di iniziare
- Il gestionale è ottimizzato per **tablet**

## 📅 FORMATO DATE PER I MOVIMENTI
- Usa formato `YYYY-MM` nel campo data (es. `2025-07` per luglio 2025)
- Questo serve per il corretto filtraggio nella pagina `mese.html`

---

Creato per CS LAURENTUM ⚽
