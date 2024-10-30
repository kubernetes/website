# La documentazione di Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) 
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Benvenuto! Questo repository contiene tutte le informazioni necessarie per creare la [documentazione e il sito web di Kubernetes](https://kubernetes.io/). Siamo onorati che tu voglia contribuire!

## Come contribuire alla documentazione

Puoi premere il pulsante **Fork** in alto nella parte destra dello schermo per creare una copia di questo repository sotto la tua utenza di GitHub. Questa copia è chiamata un *fork*. Puoi fare tutte le modifiche che vuoi nel tuo fork, e quando sei pronto a mandarci i cambiamenti, vai sulla pagina del tuo fork e crea una nuova pull request per farcelo sapere.

Una volta che hai creato la pull request, un reviewer (revisore) Kubernetes la prenderà in carico per fornire un feedback chiaro e concretamente attuabile. Come owner della pull request, **è tua responsabilità modificare la tua pull request per rispondere al feedback che ti è stato fornito dal reviewer Kubernetes**. Inoltre, tieni presente che potresti ricevere feedback da più di un Reviewer di Kubernetes, incluse quindi persone diverse da quella che ti ha fornito il primo feedback. In alcuni casi, uno dei tuoi reviewer potrebbe richiedere una revisione tecnica da un [technical reviewer di Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) quando necessario. I reviewer faranno del loro meglio per fornire feedback in modo tempestivo, ma i tempi di risposta possono variare in base alle circostanze.

Per maggiori informazioni su come contribuire alla documentazione Kubernetes, vedi:

* [Cominciare a contribuire](https://kubernetes.io/docs/contribute/start/)
* [Vedere le modifiche localmente](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Utilizzare i template delle pagine](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Guida Stilistica per la documentazione di Kubernetes](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Tradurre la documentazione di Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Eseguire il sito Web localmente usando Docker

Il modo consigliato per eseguire localmente il sito Web Kubernetes prevede l'utilizzo di un'immagine [Docker](https://docker.com) inclusa nel sito e configurata con tutti i software necessari, a partire dal generatore di siti web statici [Hugo](https://gohugo.io).

> Se stai utilizzando Windows, avrai bisogno di alcuni strumenti aggiuntivi che puoi installare con [Chocolatey](https://chocolatey.org). `choco install make`

> Se preferisci eseguire il sito Web localmente senza Docker, vedi [Eseguire il sito Web localmente utilizzando Hugo](#eseguire-il-sito-web-localmente-utilizzando-hugo) di seguito.

Se hai Docker [attivo e funzionante](https://www.docker.com/get-started), crea l'immagine Docker `kubernetes-hugo` localmente:

```bash
make container-image
```

Dopo aver creato l'immagine, è possibile eseguire il sito Web localmente:

```bash
make container-serve
```

Apri il tuo browser su http://localhost:1313 per visualizzare il sito Web. Mentre modifichi i file sorgenti, Hugo aggiorna automaticamente il sito Web e forza un aggiornamento della pagina visualizzata nel browser.

## Eseguire il sito Web localmente utilizzando Hugo

Vedi la [documentazione ufficiale di Hugo](https://gohugo.io/getting-started/installing/) per le istruzioni di installazione di Hugo. Assicurati di installare esattamente la versione di Hugo specificata dalla variabile d'ambiente `HUGO_VERSION` nel file [`netlify.toml`](netlify.toml#L9).

Per eseguire il sito Web localmente dopo aver installato Hugo:

```bash
make serve
```

Questo comando avvierà il server Hugo locale sulla porta 1313. Apri il tuo browser su http://localhost:1313 per visualizzare il sito Web. Mentre apporti modifiche ai file di origine, Hugo aggiorna il sito Web e forza un aggiornamento del browser.

## Community, discussioni, contribuire e supporto

Scopri come interagire con la community di Kubernetes nella [pagina della community](http://kubernetes.io/community/).

Puoi contattare i maintainers di questo progetto su:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Codice di condotta

La partecipazione alla comunità Kubernetes è regolata dal [Codice di condotta di Kubernetes](code-of-conduct.md).

## Grazie!

Kubernetes prospera grazie alla partecipazione della comunity e apprezziamo i tuoi contributi al nostro sito Web e alla nostra documentazione!
