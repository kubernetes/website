---
title: "Ambiente di produzione"
description: Crea un cluster Kubernetes production ready
weight: 30
no_list: true
---
<!-- overview -->

Un cluster Kubernetes production ready richiede pianificazione e preparazione.
Se il tuo cluster Kubernetes deve eseguire carichi di lavoro critici, deve essere configurato per essere resiliente.
Questa pagina spiega i passaggi che puoi seguire per configurare un cluster production ready
o per promuovere un cluster esistente per l'uso in produzione.
Se hai già familiarità con la configurazione di produzione e desideri i link, vai alle [Voci correlate](#voci-correlate).

<!-- body -->

## Considerazioni in produzione

In genere, un ambiente Kubernetes di produzione ha più requisiti rispetto a un
ambiente Kubernetes di apprendimento, sviluppo o test personale. Un ambiente di produzione potrebbe richiedere
un accesso sicuro da parte di molti utenti, una disponibilità costante e le risorse necessarie per adattarsi
alle mutevoli esigenze.

Quando decidi dove collocare il tuo ambiente di produzione Kubernetes
(on-premise o nel cloud) e il livello di gestione che intendi assumere
o delegare ad altri, considera come i requisiti per un cluster Kubernetes
siano influenzati dai seguenti fattori:

- *Alta disponibilità*: Un cluster Kubernetes con un solo nodo [learning environment](/docs/setup/#learning-environment)
  ha un solo punto di fallimento. Creare un cluster ad alta disponibilità significa considerare:
  - Separare il control plane dai nodi worker.
  - Replicare i componenti del control plane su più nodi.
  - Bilanciare il traffico al {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  - Avere abbastanza nodi worker disponibili, o essere in grado di renderere rapidamente disponibile, come richiesto dai carichi di lavoro variabili, nuovi nodi.
- *Scalare*: se prevedi che il tuo ambiente di produzione Kubernetes riceva una quantità stabile di
  domanda, potresti essere in grado di impostare la capacità necessaria e di avere tutto pronto. Tuttavia,
  se prevedi che la domanda cresca nel tempo o cambi drasticamente in base a fattori come
  stagione o eventi speciali, devi pianificare come scalare per alleviare la crescente
  pressione dovuta a un maggior numero di richieste al control plane e ai nodi worker, oppure come ridimensionare per ridurre le risorse inutilizzate.
- *Sicurezza e gestione degli accessi*: hai privilegi di amministratore completi sul tuo
  cluster di apprendimento Kubernetes. Tuttavia, i cluster condivisi con carichi di lavoro importanti e
  più di uno o due utenti richiedono un approccio più raffinato per stabilire chi e cosa può
  accedere alle risorse del cluster. Puoi utilizzare il controllo degli accessi basato sui ruoli
  ([RBAC](/docs/reference/access-authn-authz/rbac/)) e gli altri
  meccanismi di sicurezza per assicurarsi che gli utenti accedano solo alle risorse di loro competenza, mantenendo il cluster di per sè, sicuro.
  È possibile impostare limiti alle risorse a cui gli utenti e i workloads possono accedere
  gestendo le [policies](/docs/concepts/policy/) e le
  [container resources](/docs/concepts/configuration/manage-resources-containers/).

Prima di creare autonomamente un ambiente di produzione Kubernetes, valuta
di delegare parte o tutto questo lavoro ai providers
[Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
o agli altri [Kubernetes Partners](/partners/).
Le scelte possibili includono:

- *Serverless*: esegui semplicemente carichi di lavoro su macchine di terze parti senza gestire
  affatto un cluster. Ti verranno addebitati costi per l'utilizzo della CPU, la memoria e
  le richieste disco.
- *Control plane gestito*: lascia che sia il provider a gestire la scalabilità e la disponibilità
  del control plane del cluster, nonché patch e aggiornamenti.
- *Nodi worker gestiti*: configura pool di nodi in base alle tue esigenze,
  quindi il provider si assicura che tali nodi siano disponibili e pronti per implementare
  gli aggiornamenti quando necessario.
- *Integrazione*: Esistono provider che integrano Kubernetes con altri
  servizi di cui potresti aver bisogno, come storage, registri di container, metodi di autenticazione
  e strumenti di sviluppo.

Che tu crei autonomamente un cluster Kubernetes di produzione o collabori con
partner, consulta le sezioni seguenti per valutare le tue esigenze in relazione
al *control plane*, ai *nodi worker*, all'*accesso utente* e alle
*risorse del carico di lavoro* del tuo cluster.

## Setup di un cluster production ready

In un cluster Kubernetes di produzione, il control plane gestisce il cluster
da servizi che possono essere distribuiti su più computer
in modi diversi. Ogni nodo worker, tuttavia, rappresenta una singola entità
configurata per eseguire i pod Kubernetes.

### Control plane in produzione

Il più semplice cluster Kubernetes ha l'intero control plane e i servizi dei nodi worker eseguiti sulla stessa macchina. È possibile espandere tale ambiente aggiungendo
nodi worker, come illustrato nel diagramma in
[Componenti di Kubernetes](/docs/concepts/overview/components/).
Se il cluster è pensato per essere disponibile per un breve periodo di tempo o può essere
eliminato in caso di gravi problemi, questa potrebbe essere la soluzione giusta per te.

Tuttavia, se si necessita di un cluster più permanente e ad alta disponibilità, è necessario
valutare anche di scalare il control plane. Per loro natura, i servizi del control plane
in esecuzione su una singola macchina non sono ad alta disponibilità.
Se mantenere il cluster attivo e funzionante
e garantire che possa essere riparato in caso di problemi è importante,
considerare questi passaggi:

- *Scegli gli strumenti di distribuzione*: puoi distribuire un control plane utilizzando strumenti come
  kubeadm, kops e kubespray. Vedi
  [Installare Kubernetes con i tools di distribuzione](/docs/setup/production-environment/tools/)
  per apprendere suggerimenti per implementazioni di produzione utilizzando ciascuno di questi metodi di distribuzione.
- *Gestione dei certificati*: le comunicazioni sicure tra i servizi del control plane
  sono implementate tramite certificati. I certificati vengono generati automaticamente
  durante la distribuzione oppure è possibile generarli utilizzando la propria autorità di certificazione.
  Vedi [Certificati PKI e requisiti](/docs/setup/best-practices/certificates/) per i dettagli.
- *Configura il bilanciatore del carico per l'apiserver*: configura un bilanciatore del carico
  per distribuire le richieste API esterne alle istanze del servizio apiserver in esecuzione su nodi diversi. Consulta [Creare un bilanciatore del carico esterno](/docs/tasks/access-application-cluster/create-external-load-balancer/) per ulteriori dettagli.
- *Servizio etcd separato e backup frequente*: i servizi etcd possono essere eseguiti sulle
  stesse macchine degli altri servizi del control plane oppure su macchine separate, per
  maggiore sicurezza e disponibilità. Poiché etcd memorizza i dati di configurazione del cluster,
  il backup del database etcd dovrebbe essere eseguito regolarmente per garantire
  la possibilità di riparare il database in caso di necessità.
  Vedi [etcd FAQ](https://etcd.io/docs/v3.5/faq/) per consultare i dettagli su come configuare e usare etcd.
  Consulta [Gestire etcd clusters per Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  e [Implementare un etcd cluster ad alta disponibilità con kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  per ulteriori dettagli.
- *Creare più control plane*: per un'elevata disponibilità, il control plane non dovrebbe
  essere limitato a una singola macchina. Se i servizi del control plane
  sono eseguiti da un servizio init (come systemd), ogni servizio dovrebbe essere eseguito su
  almeno tre macchine. Tuttavia, l'esecuzione dei servizi del control plane come pod in
  Kubernetes garantisce che il numero replicato di servizi richiesti
  sarà sempre disponibile.
  Lo scheduler dovrebbe tollerare gli errori,
  ma non altamente disponibile. Alcuni strumenti di deployment implementano l'algoritmo di elezione [Raft](https://raft.github.io/)
  per eleggere il leader dei servizi Kubernetes. Se il
  master scompare, un altro servizio si autoelegge e prende il sopravvento.
- *Estensione su più zone*: se mantenere il cluster sempre disponibile è
  fondamentale, valuta la possibilità di creare un cluster che funzioni su più data center,
  definiti zone negli ambienti cloud. I gruppi di zone sono chiamati regioni.
  Distribuendo un cluster su
  più zone nella stessa regione, è possibile aumentare le probabilità che il cluster
  continui a funzionare anche se una zona diventa non disponibile.
  Vedi [Esecuzione in più zone](/docs/setup/best-practices/multiple-zones/) per i dettagli.
- *Gestire le funzionalità in corso*: se si prevede di mantenere il cluster attivo nel tempo,
  ci sono delle attività da svolgere per mantenerne l'integrità e la sicurezza. Ad esempio,
  se si è installato con kubeadm, sono disponibili istruzioni per
  [Gestione dei certificati](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  e [Aggiornamento dei cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  Consultare [Amministrare un cluster](/docs/tasks/administer-cluster/)
  per un elenco più dettagliato delle attività amministrative di Kubernetes.

Per informazioni sulle opzioni disponibili quando si eseguono i servizi del control plane, consultare le pagine dei componenti
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
e [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/). Per esempi di control plane ad alta disponibilità, vedere
[Opzioni per topologia ad alta disponibilità](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[Creazione di cluster ad alta disponibilità con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/),
e [Gestione di cluster etcd per Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/).
Vedere [Backup di un cluster etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
per informazioni sulla creazione di un piano di backup etcd.

### Nodi worker in produzione

I carichi di lavoro in produzione devono essere resilienti e tutto ciò da cui dipendono (come CoreDNS) deve esserlo altrettanto. Che tu gestisca direttamente il control plane o che sia un provider cloud a farlo per te, è comunque necessario considerare come gestire i nodi worker (detti anche semplicemente *nodi*).

- *Configura i nodi*: I nodi possono essere macchine fisiche o virtuali. Se desideri creare e gestire i tuoi nodi, puoi installare un sistema operativo supportato e poi aggiungere ed eseguire i relativi [servizi Node](/docs/concepts/architecture/#node-components). Considera:
  - Le esigenze dei tuoi carichi di lavoro quando configuri i nodi, assicurandoti che siano disponibili memoria, CPU, velocità del disco e capacità di storage adeguate.
  - Se bastano sistemi generici o se hai carichi di lavoro che richiedono GPU, nodi Windows o isolamento tramite VM.
- *Valida i nodi*: Consulta [Configurazione valida dei nodi](/docs/setup/best-practices/node-conformance/) per informazioni su come assicurarti che un nodo soddisfi i requisiti per unirsi a un cluster Kubernetes.
- *Aggiungi nodi al cluster*: Se gestisci il cluster autonomamente, puoi aggiungere nodi configurando le tue macchine e aggiungendole manualmente oppure facendole registrare automaticamente all’apiserver del cluster. Consulta la sezione [Nodi](/docs/concepts/architecture/nodes/) per informazioni su come configurare Kubernetes per aggiungere nodi in questi modi.
- *Scala i nodi*: Prevedi un piano per espandere la capacità che il tuo cluster richiederà in futuro. Consulta [Considerazioni per cluster di grandi dimensioni](/docs/setup/best-practices/cluster-large/) per aiutarti a determinare di quanti nodi hai bisogno, in base al numero di pod e container da eseguire. Se gestisci i nodi autonomamente, ciò può significare acquistare e installare hardware fisico.
- *Autoscaling dei nodi*: Leggi [Autoscaling dei nodi](/docs/concepts/cluster-administration/node-autoscaling) per conoscere gli strumenti disponibili per gestire automaticamente i nodi e la capacità che forniscono.
- *Configura i controlli di salute dei nodi*: Per carichi di lavoro importanti, è fondamentale assicurarsi che i nodi e i pod in esecuzione siano in salute. Utilizzando il daemon [Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/), puoi monitorare lo stato di salute dei tuoi nodi.

## Gestione degli utenti in produzione

In produzione, potresti passare da un modello in cui solo tu o un piccolo gruppo di persone accedete al cluster, a una situazione in cui potrebbero potenzialmente accedere decine o centinaia di utenti. In un ambiente di apprendimento o in un prototipo, potresti utilizzare un unico account amministrativo per tutte le operazioni. In produzione, invece, sarà necessario prevedere più account con diversi livelli di accesso a differenti namespace.

Gestire un cluster di qualità production significa decidere come consentire selettivamente l’accesso ad altri utenti. In particolare, è necessario scegliere strategie per validare l’identità di chi tenta di accedere al cluster (autenticazione) e per stabilire se dispongono delle autorizzazioni necessarie per eseguire le operazioni richieste (autorizzazione):

- *Autenticazione*: L'apiserver può autenticare gli utenti utilizzando certificati client, bearer token, un proxy   di autenticazione o HTTP basic auth. Puoi scegliere quali metodi di autenticazione utilizzare. Tramite plugin,   l'apiserver può sfruttare i metodi di autenticazione già in uso nella tua organizzazione, come LDAP o Kerberos.   Consulta [Autenticazione](/docs/reference/access-authn-authz/authentication/) per una descrizione dei diversi   metodi di autenticazione degli utenti Kubernetes.
- *Autorizzazione*: Quando decidi come autorizzare gli utenti regolari, probabilmente sceglierai tra  l'autorizzazione RBAC e ABAC. Consulta [Panoramica sull'autorizzazione](/docs/reference/access-authn-authz/  authorization/) per una panoramica delle diverse modalità di autorizzazione degli account utente (e anche    dell'accesso degli account di servizio al cluster):
  - *Controllo degli accessi basato sui ruoli* ([RBAC](/docs/reference/access-authn-authz/rbac/)): consente di assegnare l'accesso al cluster concedendo insiemi specifici di permessi agli utenti autenticati. I permessi possono essere assegnati a un namespace specifico (Role) o all'intero cluster (ClusterRole). Utilizzando RoleBinding e ClusterRoleBinding, questi permessi possono essere associati a utenti specifici.
  - *Controllo degli accessi basato sugli attributi* ([ABAC](/docs/reference/access-authn-authz/abac/)): consente di creare policy basate sugli attributi delle risorse nel cluster e permette o nega l'accesso in base a tali attributi. Ogni riga di un file di policy identifica proprietà di versionamento (apiVersion e kind) e una mappa di proprietà spec per abbinare il soggetto (utente o gruppo), la proprietà della risorsa, la proprietà non-resource (/version o /apis) e readonly. Consulta [Esempi](/docs/reference/access-authn-authz/abac/#examples) per i dettagli.

Come persona che si occupa di configurare autenticazione e autorizzazione su un cluster Kubernetes di produzione, ecco alcuni aspetti da considerare:

- *Imposta la modalità di autorizzazione*: Quando l'API server di Kubernetes
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
  viene avviato, le modalità di autorizzazione supportate devono essere impostate tramite un file *--authorization-config* o il flag *--authorization-mode*.
  Ad esempio, questo flag nel file *kube-apiserver.yaml* (in */etc/kubernetes/manifests*)
  potrebbe essere impostato su Node,RBAC. In questo modo, le richieste autenticate verrebbero autorizzate tramite Node e RBAC.
- *Crea certificati utente e role binding (RBAC)*: Se utilizzi l'autorizzazione RBAC,
  gli utenti possono creare una CertificateSigningRequest (CSR) che può essere
  firmata dalla CA del cluster. Successivamente puoi associare Role e ClusterRole a ciascun utente.
  Consulta [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  per i dettagli.
- *Crea policy che combinano attributi (ABAC)*: Se utilizzi l'autorizzazione ABAC,
  puoi assegnare combinazioni di attributi per creare policy che autorizzano utenti o gruppi selezionati ad accedere a determinate risorse (come un
  pod), namespace o apiGroup. Per maggiori informazioni, consulta
  [Esempi](/docs/reference/access-authn-authz/abac/#examples).
- *Considera gli Admission Controller*: Ulteriori forme di autorizzazione per
  le richieste che arrivano tramite l'API server includono la
  [Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
  I webhook e altri tipi speciali di autorizzazione devono essere abilitati aggiungendo
  [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  all'API server.

## Imposta i limiti dei carichi di lavoro

Le richieste dei carichi di lavoro in produzione possono esercitare pressione sia all'interno che all'esterno del control plane di Kubernetes. Considera questi aspetti quando configuri il cluster per soddisfare le esigenze dei tuoi workload:

- *Imposta limiti per namespace*: Definisci quote per namespace su risorse come memoria e CPU. Consulta
  [Gestire memoria, CPU e risorse API](/docs/tasks/administer-cluster/manage-resources/)
  per maggiori dettagli.
- *Prepara il DNS per la domanda prevista*: Se prevedi che i carichi di lavoro aumentino notevolmente,
  il servizio DNS deve essere pronto a scalare di conseguenza. Consulta
  [Autoscaling del servizio DNS in un cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Crea account di servizio aggiuntivi*: Gli account utente determinano cosa possono fare gli utenti su un cluster, mentre un account di servizio definisce l’accesso dei pod all’interno di uno specifico namespace. Per impostazione predefinita, un pod utilizza l’account di servizio predefinito del proprio namespace.
  Consulta [Gestione degli account di servizio](/docs/reference/access-authn-authz/service-accounts-admin/)
  per informazioni sulla creazione di nuovi account di servizio. Ad esempio, potresti voler:
  - Aggiungere secret che un pod può utilizzare per scaricare immagini da un determinato container registry. Consulta
    [Configurare account di servizio per i pod](/docs/tasks/configure-pod-container/configure-service-account/)
    per un esempio.
  - Assegnare permessi RBAC a un account di servizio. Consulta
    [Permessi degli account di servizio](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    per i dettagli.

## {{% heading "whatsnext" %}}

- Decidi se vuoi creare il tuo cluster Kubernetes di produzione oppure se preferisci affidarti a una delle [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/) o ai [Kubernetes Partners](/partners/).
- Se scegli di costruire il tuo cluster, pianifica come gestire i [certificati](/docs/setup/best-practices/certificates/) e configura l’alta disponibilità per componenti come [etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) e [API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- Scegli tra i metodi di deployment [kubeadm](/docs/setup/production-environment/tools/kubeadm/), [kops](https://kops.sigs.k8s.io/) o [Kubespray](https://kubespray.io/).
- Configura la gestione degli utenti decidendo i metodi di [Autenticazione](/docs/reference/access-authn-authz/authentication/) e [Autorizzazione](/docs/reference/access-authn-authz/authorization/).
- Prepara il cluster per i carichi di lavoro applicativi impostando [limiti alle risorse](/docs/tasks/administer-cluster/manage-resources/), [autoscaling del DNS](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/) e [account di servizio](/docs/reference/access-authn-authz/service-accounts-admin/).
