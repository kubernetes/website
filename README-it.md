# La documentazione di Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Benvenuto! Questo repository contiene tutte le risorse necessarie per creare il [sito Web e la documentazione di Kubernetes](https://kubernetes.io/). Siamo molto contenti che tu voglia contribuire!

## Contribuire ai documenti

Puoi fare clic sul pulsante **Fork** nell'area in alto a destra dello schermo per creare una copia di questo repository nel tuo account GitHub. Questa copia è chiamata * fork *. Apporta le modifiche desiderate nella tua forcella e quando sei pronto a inviarci tali modifiche, vai alla tua forcella e crea una nuova richiesta di pull per farcelo sapere.

Una volta creata la richiesta di pull, un revisore di Kubernetes si assumerà la responsabilità di fornire un feedback chiaro e attuabile. Come proprietario della richiesta pull, ** è tua responsabilità modificare la tua richiesta di pull per rispondere al feedback che ti è stato fornito dal revisore di Kubernetes. ** Nota anche che potresti finire con più di un revisore di Kubernetes feedback o si potrebbe finire per ricevere feedback da un revisore di Kubernetes diverso da quello originariamente assegnato per fornire un feedback. Inoltre, in alcuni casi, uno dei revisori potrebbe chiedere una revisione tecnica da un [revisore tecnico di Kubernetes] (https://github.com/kubernetes/website/wiki/Tech-reviewers) quando necessario. I revisori faranno del loro meglio per fornire feedback in modo tempestivo, ma i tempi di risposta possono variare in base alle circostanze.

Per ulteriori informazioni su come contribuire alla documentazione di Kubernetes, vedere:

* [Inizia a contribuire](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Uso dei modelli di pagina](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Guida allo stile della documentazione](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizzazione della documentazione di Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## La documentazione di localizzazione di Kubernetes di `README.md`

### Coreano

Vedi la traduzione di `README.md` e una guida più dettagliata per i contributori coreani nella pagina [Korean README](README-ko.md). 

Puoi raggiungere i manutentori della localizzazione coreana a:

* June Yi ([GitHub - @gochist](https://github.com/gochist))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-ko)

## Eseguire il sito localmente usando Docker

Il modo consigliato per eseguire localmente il sito Web di Kubernetes è eseguire un'immagine specializzata [Docker](https://docker.com) che include il generatore di siti statici [Hugo](https://gohugo.io).

> Se si utilizza Windows, sono necessari alcuni altri strumenti che è possibile installare con [Chocolatey](https://chocolatey.org). `choco install make`

> Se preferisci eseguire il sito Web localmente senza Docker, vedi [Esegui localmente il sito usando Hugo](# running-the-site-local-using-hugo) di seguito.

Se hai Docker [attivo e funzionante](https://www.docker.com/get-started), crea l'immagine del Docker `kubernetes-hugo` localmente:

```Bash
make docker-image
```

Una volta che l'immagine è stata creata, puoi eseguire il sito localmente:

```Bash
make docker-serve
```

Aprire il browser a http://localhost: 1313 per visualizzare il sito. Man mano che si apportano modifiche ai file sorgente, Hugo aggiorna il sito e forza l'aggiornamento del browser.

## Eseguire il sito localmente usando Hugo

Vedere la [documentazione ufficiale di Hugo](https://gohugo.io/getting-started/installing/) per le istruzioni di installazione di Hugo. Assicurati di installare la versione di Hugo specificata dalla variabile di ambiente `HUGO_VERSION` nel file [`netlify.toml`](netlify.toml#L9). 

Per eseguire il sito localmente quando hai installato Hugo:

```Bash
make serve
```

Questo avvierà il server Hugo locale sulla porta 1313. Apri il browser a http://localhost:1313 per visualizzare il sito. Man mano che si apportano modifiche ai file sorgente, Hugo aggiorna il sito e forza l'aggiornamento del browser.

## Comunità, discussioni, contributi e supporto

Scopri come interagire con la community di Kubernetes sulla [pagina della community](http://kubernetes.io/community/).

Puoi raggiungere i manutentori di questo progetto su:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Codice di condotta

La partecipazione alla comunità di Kubernetes è regolata dal [Codice di Condotta di Kubernetes](code-of-conduct.md).

## Grazie!

Kubernetes prospera sulla partecipazione della comunità e apprezziamo molto i tuoi contributi al nostro sito e alla nostra documentazione!
