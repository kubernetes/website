---
title: Cos'è Kubernetes?
description: >
  Kubernetes è una piattaforma portatile, estensibile e open-source per la gestione di carichi di lavoro e servizi containerizzati, in grado di facilitare sia la configurazione dichiarativa che l'automazione. La piattaforma vanta un grande ecosistema in rapida crescita. Servizi, supporto e strumenti sono ampiamente disponibili nel mondo Kubernetes .
content_type: concept
weight: 10
card:
  name: concepts
  weight: 10
---

<!-- overview -->
Questa pagina è una panoramica generale su Kubernetes.


<!-- body -->
Kubernetes è una piattaforma portatile, estensibile e open-source per la gestione di carichi di lavoro e servizi containerizzati, in grado di facilitare sia la configurazione dichiarativa che l'automazione. La piattaforma vanta un grande ecosistema in rapida crescita. Servizi, supporto e strumenti sono ampiamente disponibili nel mondo Kubernetes .

Il nome Kubernetes deriva dal greco, significa timoniere o pilota. Google ha reso open-source il progetto Kubernetes nel 2014. Kubernetes unisce [oltre quindici anni di esperienza di Google](/blog/2015/04/borg-predecessor-to-kubernetes/) nella gestione di carichi di lavoro di produzione su scala mondiale con le migliori idee e pratiche della comunità.

## Facciamo un piccolo salto indietro
Diamo un'occhiata alla ragione per cui Kubernetes è così utile facendo un piccolo salto indietro nel tempo.

![Deployment evolution](/images/docs/Container_Evolution.svg)

**L'era del deployment tradizionale:**
All'inizio, le organizzazioni eseguivano applicazioni su server fisici. Non c'era modo di definire i limiti delle risorse per le applicazioni in un server fisico e questo ha causato non pochi problemi di allocazione delle risorse. Ad esempio, se più applicazioni vengono eseguite sullo stesso server fisico, si possono verificare casi in cui un'applicazione assorbe la maggior parte delle risorse e, di conseguenza, le altre applicazioni non hanno le prestazioni attese. Una soluzione per questo sarebbe di eseguire ogni applicazione su un server fisico diverso. Ma questa non è una soluzione ideale, dal momento che le risorse vengono sottoutilizzate, inoltre, questa pratica risulta essere costosa per le organizzazioni, le quali devono mantenere numerosi server fisici.

**L'era del deployment virtualizzato:**
Come soluzione venne introdotta la virtualizzazione. Essa consente di eseguire più macchine virtuali (VM) su una singola CPU fisica. La virtualizzazione consente di isolare le applicazioni in più macchine virtuali e fornisce un livello di sicurezza superiore, dal momento che le informazioni di un'applicazione non sono liberamente accessibili da un'altra applicazione.

La virtualizzazione consente un migliore utilizzo delle risorse riducendo i costi per l'hardware, permette una migliore scalabilità, dato che un'applicazione può essere aggiunta o aggiornata facilmente, e ha molti altri vantaggi.

Ogni VM è una macchina completa che esegue tutti i componenti, compreso il proprio sistema operativo, sopra all'hardware virtualizzato.

**L'era del deployment in container:**
I container sono simili alle macchine virtuali, ma presentano un modello di isolamento più leggero, condividendo il sistema operativo (OS) tra le applicazioni. Pertanto, i container sono considerati più leggeri. Analogamente a una macchina virtuale, un container dispone di una segregazione di filesystem, CPU, memoria, PID e altro ancora. Poiché sono disaccoppiati dall'infrastruttura sottostante, risultano portabili tra differenti cloud e diverse distribuzioni.

I container sono diventati popolari dal momento che offrono molteplici vantaggi, ad esempio:

* Creazione e distribuzione di applicazioni in modalità Agile: maggiore facilità ed efficienza nella creazione di immagini container rispetto all'uso di immagini VM.
* Adozione di pratiche per lo sviluppo/test/rilascio continuativo: consente la frequente creazione e la distribuzione di container image affidabili, dando la possibilità di fare rollback rapidi e semplici (grazie all'immutabilità dell'immagine stessa).
* Separazione delle fasi di Dev e Ops: le container image vengono prodotte al momento della compilazione dell'applicativo piuttosto che nel momento del rilascio, permettendo così di disaccoppiare le applicazioni dall'infrastruttura sottostante.
* L'osservabilità non riguarda solo le informazioni e le metriche del sistema operativo, ma anche lo stato di salute e altri segnali dalle applicazioni.
* Coerenza di ambiente tra sviluppo, test e produzione: i container funzionano allo stesso modo su un computer portatile come nel cloud.
* Portabilità tra cloud e sistemi operativi differenti: lo stesso container funziona su Ubuntu, RHEL, CoreOS, on-premise, nei più grandi cloud pubblici e da qualsiasi altra parte.
* Gestione incentrata sulle applicazioni: Aumenta il livello di astrazione dall'esecuzione di un sistema operativo su hardware virtualizzato all'esecuzione di un'applicazione su un sistema operativo utilizzando risorse logiche.
* Microservizi liberamente combinabili, distribuiti, ad alta scalabilità: le applicazioni sono suddivise in pezzi più piccoli e indipendenti che possono essere distribuite e gestite dinamicamente - niente stack monolitici che girano su una singola grande macchina.
* Isolamento delle risorse: le prestazioni delle applicazioni sono prevedibili.
* Utilizzo delle risorse: alta efficienza e densità.

## Perché necessito di Kubernetes e cosa posso farci

I container sono un buon modo per distribuire ed eseguire le tue applicazioni. In un ambiente di produzione, è necessario gestire i container che eseguono le applicazioni e garantire che non si verifichino interruzioni dei servizi. Per esempio, se un container si interrompe, è necessario avviare un nuovo container. Non sarebbe più facile se questo comportamento fosse gestito direttamente da un sistema?

È proprio qui che Kubernetes viene in soccorso! Kubernetes ti fornisce un framework per far funzionare i sistemi distribuiti in modo resiliente. Kubernetes si occupa della scalabilità, failover, distribuzione delle tue applicazioni. Per esempio, Kubernetes può facilmente gestire i rilasci con modalità Canary deployment.

Kubernetes ti fornisce:

* **Scoperta dei servizi e bilanciamento del carico**
Kubernetes può esporre un container usando un nome DNS o il suo indirizzo IP. Se il traffico verso un container è alto, Kubernetes è in grado di distribuire il traffico su più container in modo che il servizio rimanga stabile.
* **Orchestrazione dello storage**
Kubernetes ti permette di montare automaticamente un sistema di archiviazione di vostra scelta, come per esempio storage locale, dischi forniti da cloud pubblici, e altro ancora.
* **Rollout e rollback automatizzati**
Puoi utilizzare Kubernetes per descrivere lo stato desiderato per i propri container, e Kubernetes si occuperà di cambiare lo stato attuale per raggiungere quello desiderato ad una velocità controllata. Per esempio, puoi automatizzare Kubernetes per creare nuovi container per il tuo servizio, rimuovere i container esistenti e adattare le loro risorse a quelle richieste dal nuovo container.
* **Ottimizzazione dei carichi**
Fornisci a Kubernetes un cluster di nodi per eseguire i container. Puoi istruire Kubernetes su quanta CPU e memoria (RAM) ha bisogno ogni singolo container. Kubernetes allocherà i container sui nodi per massimizzare l'uso delle risorse a disposizione.
* **Self-healing**
Kubernetes riavvia i container che si bloccano, sostituisce container, termina i container che non rispondono agli health checks, e evita di far arrivare traffico ai container che non sono ancora pronti per rispondere correttamente.
* **Gestione di informazioni sensibili e della configurazione**
Kubernetes consente di memorizzare e gestire informazioni sensibili, come le password, i token OAuth e le chiavi SSH. Puoi distribuire e aggiornare le informazioni sensibili e la configurazione dell'applicazione senza dover ricostruire le immagini dei container e senza svelare le informazioni sensibili nella configurazione del tuo sistema.

## Cosa non è Kubernetes

Kubernetes non è un sistema PaaS (Platform as a Service) tradizionale e completo. Dal momento che Kubernetes opera a livello di container piuttosto che che a livello hardware, esso fornisce alcune caratteristiche generalmente disponibili nelle offerte PaaS, come la distribuzione, il ridimensionamento, il bilanciamento del carico, la registrazione e il monitoraggio. Tuttavia, Kubernetes non è monolitico, e queste soluzioni predefinite sono opzionali ed estensibili. Kubernetes fornisce gli elementi base per la costruzione di piattaforme di sviluppo, ma conserva le scelte dell'utente e la flessibilità dove è importante.

Kubernetes:

* Non limita i tipi di applicazioni supportate. Kubernetes mira a supportare una grande varietà di carichi di lavoro, compresi i carichi di lavoro stateless, stateful e elaborazione di dati. Se un'applicazione può essere eseguita in un container, dovrebbe funzionare alla grande anche su Kubernetes.
* Non compila il codice sorgente e non crea i container. I flussi di Continuous Integration, Delivery, and Deployment (CI/CD) sono determinati dalla cultura e dalle preferenze dell'organizzazione e dai requisiti tecnici.
* Non fornisce servizi a livello applicativo, come middleware (per esempio, bus di messaggi), framework di elaborazione dati (per esempio, Spark), database (per esempio, mysql), cache, né sistemi di storage distribuito (per esempio, Ceph) come servizi integrati. Tali componenti possono essere eseguiti su Kubernetes, e/o possono essere richiamati da applicazioni che girano su Kubernetes attraverso meccanismi come l'[Open Service Broker](https://openservicebrokerapi.org/).
* Non impone soluzioni di logging, monitoraggio o di gestione degli alert. Fornisce alcune integrazioni come dimostrazione, e meccanismi per raccogliere ed esportare le metriche.
* Non fornisce né rende obbligatorio un linguaggio/sistema di configurazione (per esempio, Jsonnet). Fornisce un'API dichiarativa che può essere richiamata da qualsiasi sistema.
* Non fornisce né adotta alcun sistema di gestione completa della macchina, configurazione, manutenzione, gestione o sistemi di self healing.
* Inoltre, Kubernetes non è un semplice sistema di orchestrazione. Infatti, questo sistema elimina la necessità di orchestrazione. La definizione tecnica di orchestrazione è l'esecuzione di un flusso di lavoro definito: prima si fa A, poi B, poi C. Al contrario, Kubernetes è composto da un insieme di processi di controllo indipendenti e componibili che guidano costantemente lo stato attuale verso lo stato desiderato. Non dovrebbe importare come si passa dalla A alla C. Anche il controllo centralizzato non è richiesto. Questo si traduce in un sistema più facile da usare, più potente, robusto, resiliente ed estensibile.



## {{% heading "whatsnext" %}}

*   Dai un'occhiata alla pagina [i componenti di Kubernetes](/docs/concepts/overview/components/)
*   Sai già [Come Iniziare](/docs/setup/)?

