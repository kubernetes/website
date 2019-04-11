---
title: Che cos'è Kubernetes? 
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
Questa pagina è una panoramica di Kubernetes
{{% /capture %}}

{{% capture body %}}
Kubernetes è una piattaforma open source portatile ed estensibile per la gestione 
di carichi di lavoro e servizi containerizzati, che facilita sia la configurazione 
dichiarativa che l'automazione. Ha un grande ecosistema in rapida crescita. 
I servizi, il supporto e gli strumenti di Kubernetes sono ampiamente disponibili.

Google ha aperto il progetto Kubernetes nel 2014. Kubernetes si basa su un
[decennio e mezzo di esperienza che Google ha con l'esecuzione di carichi di lavoro di produzione su larga scala](https://research.google.com/pubs/pub43438.html), combined with
combinati con le migliori idee e pratiche della community.

## Perché ho bisogno di Kubernetes e cosa può fare?


Kubernetes ha differenti funzionalità. Può essere pensato come:

- una piattaforma container
- una piattaforma di microservizi
- una piattaforma cloud portatile
e molto altro.

Kubernetes fornisce un ambiente di gestione **incentrato sui contenitori**. 
Organizza l'infrastruttura di elaborazione, di rete e di archiviazione per 
conto dei carichi di lavoro degli utenti. 
Ciò fornisce gran parte della semplicità di Platform as a Service (PaaS) 
con la flessibilità di Infrastructure as a Service (IaaS) e consente la portabilità 
tra i fornitori di infrastrutture.

## In che modo Kubernetes è una piattaforma?

Anche se Kubernetes offre molte funzionalità, ci sono sempre nuovi scenari che trarrebbero vantaggio dalle nuove funzionalità. I flussi di lavoro specifici delle applicazioni possono essere ottimizzati per accelerare la velocità degli sviluppatori. L'orchestrazione ad hoc che è accettabile inizialmente richiede spesso una robusta automazione su larga scala. Questo è il motivo per cui Kubernetes è stato anche progettato per fungere da piattaforma per la creazione di un ecosistema di componenti e strumenti per semplificare l'implementazione, la scalabilità e la gestione delle applicazioni.

Le etichette[labels](/docs/concepts/overview/working-with-objects/labels/) 
[Labels](/docs/concepts/overview/working-with-objects/labels/) consentono agli utenti di organizzare le proprie risorse, a loro piacimento. 
Le annotazioni [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
consentono agli utenti di decorare le risorse con informazioni personalizzate per 
facilitare i loro flussi di lavoro e fornire un modo semplice per gli strumenti di 
gestione allo stato di checkpoint.


Inoltre, il piano di[controllo di Kubernetes](/docs/concepts/overview/components/) è basato sulle stesse API 
[APIs](/docs/reference/using-api/api-overview/) disponibili per sviluppatori e utenti. 
Gli utenti possono scrivere i propri controllori, come ad esempio
[schedulers](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/scheduler.md),con [le proprieAPI](/docs/concepts/api-extension/custom-resources/)
che possono essere targetizzate da uno strumento da riga di comando generico.
 [command-line
tool](/docs/user-guide/kubectl-overview/).

Questo
[design](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md)
ha permesso a un certo numero di altri sistemi di costruire su Kubernetes.


## Cosa non è Kubernetes

Kubernetes non è un sistema PaaS (Platform as a Service) tradizionale e onnicomprensivo. 
Poiché Kubernetes opera a livello di contenitore anziché a livello di hardware, 
fornisce alcune caratteristiche generalmente applicabili comuni alle offerte di PaaS, quali distribuzione, 
ridimensionamento, bilanciamento del carico, registrazione e monitoraggio. 
Tuttavia, Kubernetes non è monolitico e queste soluzioni predefinite sono opzionali 
e collegabili. Kubernetes fornisce gli elementi costitutivi per le piattaforme di sviluppo degli sviluppatori, 
ma conserva la scelta dell'utente e la flessibilità laddove è importante.


Kubernetes:

* Non limita i tipi di applicazioni supportate. Kubernetes mira a supportare una varietà estremamente diversificata di carichi di lavoro, 
  inclusi carichi di lavoro stateless, stateful e di elaborazione dei dati. Se un'applicazione può essere eseguita in un contenitore, 
  dovrebbe funzionare alla grande su Kubernetes.

* Non distribuisce il codice sorgente e non crea la tua applicazione. I flussi di lavoro di integrazione, consegna e distribuzione (CI / CD) continui sono determinati dalle culture organizzative e dalle preferenze, nonché dai requisiti tecnici.

* Non fornisce servizi a livello di applicazione, come middleware (ad es. Bus di messaggi), framework di elaborazione dati (ad esempio, Spark), database (ad esempio mysql), cache o sistemi di archiviazione cluster (ad esempio, Ceph) come nei servizi. Tali componenti possono essere eseguiti su Kubernetes e / o possono essere accessibili dalle applicazioni in esecuzione su Kubernetes tramite meccanismi portatili, come Open Service Broker.

* Non impone la registrazione, il monitoraggio o le soluzioni di avviso. Fornisce alcune integrazioni come prova del concetto e meccanismi per raccogliere ed esportare le metriche.

* Non fornisce né richiede una lingua / sistema di configurazione(ad esempio.,
  [jsonnet](https://github.com/google/jsonnet)). Fornisce un'API dichiarativa che può essere presa di mira da forme 
  arbitrarie di specifiche dichiarative.
  
* Non fornisce né adotta sistemi completi di configurazione, manutenzione, gestione o auto-riparazione.

Inoltre, Kubernetes non è un semplice *sistema di orchestrazione*. 
In realtà, elimina la necessità di orchestrazione. 
La definizione tecnica di *orchestrazione* è l'esecuzione di un flusso di lavoro definito: prima fare A, poi B, poi C.
Al contrario, Kubernetes comprende un insieme di processi di controllo componibili indipendenti che guidano continuamente 
lo stato corrente verso lo stato desiderato fornito. Non dovrebbe importare come si ottiene da A a C. 
Il controllo centralizzato non è richiesto. Ciò si traduce in un sistema che è più facile da usare e più potente, 
robusto, resiliente ed estensibile.


## Perché containers?

Cerchi dei motivi per i quali dovresti usare i containers?

![Perche' Containers?](/images/docs/why_containers.svg)

Il *vecchio modo* di distribuire le applicazioni era installare le applicazioni su un host usando il gestore di pacchetti del sistema operativo. Ciò ha avuto lo svantaggio di impigliare gli eseguibili, la configurazione, le librerie e i cicli di vita delle applicazioni tra loro e con il sistema operativo host. Si potrebbero costruire immagini di macchine virtuali immutabili al fine di ottenere prevedibili rollout e rollback, ma le VM sono pesanti e non portatili.


La *nuova strada* consiste nel distribuire contenitori basati sulla virtualizzazione a livello di sistema operativo piuttosto che sulla virtualizzazione dell'hardware. Questi contenitori sono isolati l'uno dall'altro e dall'host: hanno i loro filesystem, non possono vedere i processi degli altri e il loro utilizzo delle risorse di calcolo può essere limitato. Sono più facili da costruire rispetto alle macchine virtuali e, poiché sono disaccoppiati dall'infrastruttura sottostante e dal file system host, sono portatili attraverso cloud e distribuzioni del sistema operativo.


Poiché i contenitori sono piccoli e veloci, è possibile imballare un'applicazione in ogni immagine del contenitore. Questa relazione one-to-one tra applicazione e immagine sblocca tutti i vantaggi dei contenitori. Con i container, è possibile creare immagini di container immutabili al momento della compilazione / del rilascio piuttosto che del tempo di implementazione, poiché ogni applicazione non deve necessariamente essere composta con il resto dello stack di applicazioni, né essere sposata con l'ambiente dell'infrastruttura di produzione. La generazione di immagini del contenitore durante il tempo di generazione / rilascio consente di trasferire un ambiente coerente dallo sviluppo alla produzione. Allo stesso modo, i contenitori sono molto più trasparenti delle macchine virtuali, il che facilita il monitoraggio e la gestione. Ciò è particolarmente vero quando i cicli di vita dei processi dei contenitori vengono gestiti dall'infrastruttura anziché nascosti da un supervisore del processo all'interno del contenitore. Infine, con una singola applicazione per contenitore, la gestione dei contenitori equivale alla gestione della distribuzione dell'applicazione.
 
Riepilogo dei vantaggi del contenitore:


* **Creazione e implementazione di applicazioni agile**:
    maggiore facilità ed efficienza della creazione dell'immagine del contenitore rispetto all'uso di immagini VM.
* **Sviluppo, integrazione e implementazione continui**:
    fornisce la creazione e l'implementazione di un'immagine contenitore affidabile e frequente con rollback semplici e veloci (grazie all'immutabilità dell'immagine).

* **Separazione delle preoccupazioni per dev e ops**:
    immagini del contenitore dell'applicazione al momento della compilazione / rilascio piuttosto che del tempo di implementazione, disaccoppiando quindi le applicazioni dall'infrastruttura.
* **Osservabilità**
    Non solo le informazioni e le misurazioni a livello di sistema operativo, ma anche lo stato dell'applicazione e altri segnali.
    Coerenza ambientale tra sviluppo, test e produzione: funziona allo stesso modo su un laptop come nel cloud.

* **Environmental consistency across development, testing, and production**:
    Runs the same on a laptop as it does in the cloud.
* **Cloud and OS distribution portability**:
    Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, and anywhere else.
* **Portabilità della distribuzione di sistemi operativi e cloud**:
    funziona su Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine e in qualsiasi altro luogo.
    Gestione incentrata sull'applicazione: aumenta il livello di astrazione dall'esecuzione di un sistema operativo su hardware virtuale per l'esecuzione di un'applicazione su un sistema operativo utilizzando risorse logiche.
* **Loosely coupled, distributed, elastic, liberated [micro-services](https://martinfowler.com/articles/microservices.html)**:
    le applicazioni vengono suddivise in parti più piccole e indipendenti e possono essere distribuite e gestite in modo dinamico, non uno stack monolitico in esecuzione su un'unica grande macchina monouso.

* **Isolamento delle risorse**:
    prestazioni applicative prevedibili.
* **Utilizzo delle risorse**:
    alta efficienza e densità.

## Cosa significa Kubernetes? K8S?

Il nome **Kubernetes** deriva dal greco, che significa *timoniere* o *pilota*, ed è la radice del *governatore*
e del [cibernetico](http://www.etymonline.com/index.php?term=cybernetics). *K8s*
è un'abbreviazione derivata sostituendo le 8 lettere "ubernete" con "8".

{{% /capture %}}

{{% capture whatsnext %}}
*   Pronto per iniziare [Get Started](/docs/setup/)?
*   Per ulteriori dettagli, consultare la documentazione di Kubernetes.[Kubernetes Documentation](/docs/home/).
{{% /capture %}}


