---
title: Cos'è Kubernetes
content_template: templates/concept
weight: 10
card:
  name: concepts
  weight: 10
---
<meta charset="utf-8" />

{{% capture overview %}}
Questa pagina è una panoramica generale su Kubernetes.
{{% /capture %}}

{{% capture body %}}
Kubernetes è una piattaforma portatile, estensibile e open-source per la gestione di carichi di lavoro e servizi containerizzati, in grado di facilitare sia la configurazione dichiarativa che l'automazione. La piattaforma vanta un grande ecosistema in rapida crescita. Servizi, supporto e strumenti sono ampiamente disponibili nel mondo Kubernetes .

Il nome Kubernetes deriva dal greco, significa timoniere o pilota. Google ha aperto il progetto Kubernetes nel 2014. Kubernetes si basa su [dieci anni e mezzo di esperienza di Google nella gestione di workloads (carichi di lavoro) di produzione in scala] (https://ai.google/research/pubs/pub43438), combinata con le migliori idee e pratiche della comunità.

## Facciamo un piccolo passo indietro
Diamo un'occhiata alla ragione per cui Kubernetes è così utile facendo un piccolo salto indietro nel tempo.

![Deployment evolution](/images/docs/Container_Evolution.svg)

**L'era del deployment tradizionale:**
All'inizio, le organizzazioni eseguivano applicazioni su server fisici. Non c'era modo di definire i limiti delle risorse per le applicazioni in un server fisico e questo ha causato non pochi problemi di allocazione delle risorse. Ad esempio, se più applicazioni vengono eseguite su di un server fisico, si possono verificare casi in cui un'applicazione assorbe la maggior parte delle risorse e, di conseguenza, le altre applicazioni non raggiungono prestazioni ottimali. Una soluzione per questo sarebbe di eseguire ogni applicazione su un server fisico diverso. Ma questo non è la soluzione ideale, perché le risorse vengono sottoutilizzate, inoltre, questa pratica risulta essere costosa per le organizzazioni, le quali devono mantenere numerosi server fisici.

**L'era del deployment virtualizzato:**  Come soluzione venne introdotta la virtualizzazione. Essa consente di eseguire più macchine virtuali (VM) su di una singola CPU di un server fisico. La virtualizzazione consente di isolare le applicazioni tra più macchine virtuali e fornisce un livello di sicurezza superiore, dal momento che le informazioni di un'applicazione non sono liberamente accessibili da un'altra applicazione.

La virtualizzazione consente un migliore utilizzo delle risorse in un server fisico e permette una migliore scalabilità, perché un'applicazione può essere aggiunta o aggiornata facilmente, riduce i costi dell'hardware e molto altro ancora.

Ogni VM è una macchina completa che esegue tutti i componenti, compreso il proprio sistema operativo, oltre all'hardware virtualizzato.

**L'era del deployment a container:** I container sono simili alle macchine virtuali, ma presentano proprietà di isolamento che consentono di condividere il sistema operativo (OS) tra le applicazioni. Pertanto, i container sono considerati più leggeri. Analogamente a una macchina virtuale, un contenitore dispone di un proprio filesystem, CPU, memoria, spazio di elaborazione e altro ancora. Poiché sono disaccoppiati dall'infrastruttura sottostante, risultano portatili su cloud e distribuzioni di sistemi operativi.

I container stanno diventando popolari perché offrono molteplici vantaggi. Alcuni dei vantaggi dei container sono elencati di seguito:

* Creazione e distribuzione di applicazioni Agile: maggiore facilità ed efficienza nella creazione di immagini container rispetto all'uso di immagini VM.
* Sviluppo, integrazione e distribuzione continuativi: consente la creazione e la distribuzione di immagini container affidabili e frequenti con rollback rapidi e semplici (a causa dell'immutabilità dell'immagine).
* Separazione delle fasi di Dev e Ops: si creano immagini contenitore di applicazioni al momento della costruzione/rilascio piuttosto che al momento della distribuzione, disaccoppiando così le applicazioni dall'infrastruttura.
* L'osservabilità non riguarda solo le informazioni e le metriche a livello di sistema operativo, ma anche lo stato di salute dell'applicazione e altri segnali.
* Coerenza ambientale tra sviluppo, test e produzione: Funziona sullo stesso modo su un computer portatile come nel cloud.
* Portabilità della distribuzione cloud e del sistema operativo: Funziona su Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine e ovunque.
* Gestione incentrata sulle applicazioni: Aumenta il livello di astrazione dall'esecuzione di un sistema operativo su hardware virtuale all'esecuzione di un'applicazione su un sistema operativo utilizzando risorse logiche.
* Microservizi liberamente abbinabili, distribuiti, elastici e liberalizzati: le applicazioni sono suddivise in pezzi più piccoli e indipendenti e possono essere distribuite e gestite dinamicamente - niente stack monolitici che girano su di una grande macchina monouso.
* Isolamento delle risorse: prestazioni prevedibili dell'applicazione.
* Utilizzo delle risorse: alta efficienza e densità.

## Perché necessito di Kubernetes e cosa posso farci

I container sono un buon modo per raggruppare ed eseguire le applicazioni. In un ambiente di produzione, è necessario gestire i container che eseguono le applicazioni e garantire che non si verifichino tempi di inattività. Per esempio, se un container si guasta, un altro container necessita di essere riavviato. Non sarebbe più facile se questo comportamento fosse gestito direttamente da un sistema?

È così che Kubernetes viene in soccorso! Kubernetes vi fornisce un framework per far funzionare i sistemi distribuiti in modo resiliente. Si prende cura delle vostre esigenze di scalabilità, failover, schemi di distribuzione, e altro ancora. Per esempio, Kubernetes può facilmente gestire un Canary deploument per il vostro sistema.

Kubernetes vi fornisce:

* **Scoperta del servizio e bilanciamento del carico**
Kubernetes può esporre un contenitore usando il nome DNS o il proprio indirizzo IP. Se il traffico verso un container è alto, Kubernetes è in grado di caricare e distribuire il traffico di rete in modo che la distribuzione rimanga stabile.
* **Orchestrazione dello stoccaggio**
Kubernetes vi permette di montare automaticamente un sistema di archiviazione di vostra scelta, come per esempio memoria locale, fornitori di cloud pubblici, e altro ancora.
* **Rollout e rollback automatizzati**
È possibile descrivere lo stato desiderato per i propri contenitori distribuiti utilizzando Kubernetes, e si può cambiare lo stato da quello attuale a quello desiderato ad una velocità stabilita e controllata. Per esempio, potete automatizzare Kubernetes per creare nuovi container per la vostra distribuzione, rimuovere i container esistenti e adottare tutte le loro risorse nel nuovo container.
* **Packing automatico dei file bin**
Kubernetes permette di specificare quanta CPU e memoria (RAM) ha bisogno ogni container. Quando i container dispongono di richieste di risorse specifiche, Kubernetes può prendere decisioni migliori per gestire le risorse per i container.
* **Auto risoluzione**
Kubernetes riavvia i container che si bloccano, sostituisce i container, termina i container che non rispondono al controllo di salute definito dall'utente, e non li distribuisce ai clienti finché non sono pronti per funzionare correttamente..
* **Gestione di informazioni sensibili e della configurazione**
Kubernetes consente di memorizzare e gestire informazioni sensibili, come le password, i token OAuth e le chiavi ssh. È possibile distribuire e aggiornare i segreti e la configurazione dell'applicazione senza dover ricostruire le immagini del container e senza rivelare segreti nella configurazione della pila.

## Cosa non è Kubernetes

Kubernetes non è un sistema PaaS (Platform as a Service) tradizionale e completo. Dal momento che Kubernetes opera a livello di contenitore piuttosto che a livello hardware, esso fornisce alcune caratteristiche generalmente applicabili comuni alle offerte PaaS, come la distribuzione, il ridimensionamento, il bilanciamento del carico, la registrazione e il monitoraggio. Tuttavia, Kubernetes non è monolitico, e queste soluzioni predefinite sono opzionali e collegabili. Kubernetes fornisce gli elementi costitutivi per la costruzione di piattaforme di sviluppo, ma conserva la scelta e la flessibilità dell'utente dove è importante.

Kubernetes:

* Non limita i tipi di applicazioni supportate. Kubernetes mira a supportare una grande varietà di carichi di lavoro, compresi i carichi di lavoro senza stato, stateful e di elaborazione dati. Se un'applicazione può essere eseguita in un container, dovrebbe funzionare alla grande anche su Kubernetes.
* Non distribuisce il codice sorgente e non costruisce la vostra applicazione. I flussi di lavoro Continuous Integration, Delivery, and Deployment (CI/CD) sono determinati dalle culture e preferenze dell'organizzazione e dai requisiti tecnici.
* Non fornisce servizi a livello applicativo, come middleware (per esempio, bus di messaggi), framework di elaborazione dati (per esempio, Spark), database (per esempio, mysql), cache, né sistemi di archiviazione cluster (per esempio, Ceph) come servizi integrati. Tali componenti possono essere eseguiti su Kubernetes, e/o possono essere richiamati da applicazioni che girano su Kubernetes attraverso meccanismi portatili, come l'Open Service Broker.
* Non impone soluzioni di logging, monitoraggio o di allarme. Fornisce alcune integrazioni come test di un concetto, e meccanismi per raccogliere ed esportare le metriche.
* Non fornisce né rende obbligatorio un linguaggio/sistema di configurazione (per esempio, jsonnet). Fornisce un'API dichiarativa che può essere presa di mira da forme arbitrarie di specifiche dichiarative.
* Non fornisce né adotta alcuna configurazione completa della macchina, manutenzione, gestione o sistemi di autoguarigione.
* Inoltre, Kubernetes non è un semplice sistema di orchestrazione. Infatti, questo sistema elimina la necessità di orchestrazione. La definizione tecnica di orchestrazione è l'esecuzione di un flusso di lavoro definito: prima si fa A, poi B, poi C. Al contrario, Kubernetes è composto da un insieme di processi di controllo indipendenti e componibili che guidano costantemente lo stato attuale verso lo stato desiderato. Non dovrebbe importare come si passa dalla A alla C. Anche il controllo centralizzato non è richiesto. Questo si traduce in un sistema più facile da usare e più potente, robusto, resiliente ed estensibile.

{{% /capture %}}

{{% capture whatsnext %}}
*   Dai un'occhiata alla pagina [Le Componenti di Kubernetes](/docs/concepts/overview/components/)
*   Sai già [Come Iniziare](/docs/setup/)?
{{% /capture %}}
