---
title: Concetti alla base del Cloud Controller Manager
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Il concetto CCM (cloud controller manager) (da non confondere con il binario) è stato originariamente creato per consentire al codice del fornitore specifico del cloud e al core Kubernetes di evolversi indipendentemente l'uno dall'altro. Il gestore del controller cloud viene eseguito insieme ad altri componenti principali come il controller controller di Kubernetes, il server API e lo scheduler. Può anche essere avviato come addon di Kubernetes, nel qual caso viene eseguito su Kubernetes.

Il design del gestore del controller cloud è basato su un meccanismo di plug-in che consente ai nuovi provider cloud di integrarsi facilmente con Kubernetes utilizzando plug-in. Sono in atto piani per l'acquisizione a bordo di nuovi provider di cloud su Kubernetes e per la migrazione dei provider di cloud dal vecchio modello al nuovo modello CCM.

Questo documento discute i concetti alla base del gestore del controller cloud e fornisce dettagli sulle funzioni associate.

Ecco l'architettura di un cluster Kubernetes senza il gestore del controller cloud:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## Design

Nel diagramma precedente, Kubernetes e il provider cloud sono integrati attraverso diversi componenti:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server


CCM consolida tutta la logica dipendente dal cloud dai tre componenti precedenti per creare un singolo punto di integrazione con il cloud. La nuova architettura con il CCM si presenta così:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Components of the CCM

CCM interrompe alcune funzionalità di Kubernetes controller manager (KCM) e lo esegue come processo separato. In particolare, elimina i controller in KCM dipendenti dal cloud. KCM ha i seguenti loop del controller dipendenti dal cloud:

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

Nella versione 1.9, CCM esegue i seguenti controller dall'elenco precedente:

* Node controller
* Route controller
* Service controller

Inoltre, esegue un altro controller chiamato controller PersistentVolumeLabels. Questo controller è responsabile dell'impostazione delle etichette delle zone e delle regioni su PersistentVolumes creati nei cloud GCP e AWS.

{{< note >}}
Il controller del volume è stato deliberatamente scelto per non far parte di CCM. A causa della complessità e degli sforzi già esistenti per estrapolare la logica del volume specifica del fornitore, è stato deciso che il controller del volume non verrà spostato su CCM.
{{< /note >}}

Il piano originale per supportare i volumi utilizzando CCM era di utilizzare i volumi Flex per supportare volumi collegabili. Tuttavia, è in programma uno sforzo concorrente noto come CSI per sostituire la logica Flex.me, è stato deciso che il controller del volume non verrà spostato su CCM.

Considerando queste dinamiche, abbiamo deciso di adottare una misurazione dell'interruzione intermedia finché il CSI non è pronto.

## Functions of the CCM

Il CCM eredita le sue funzioni da componenti di Kubernetes che dipendono da un provider di cloud. Questa sezione è strutturata in base a tali componenti.

### 1. Kubernetes controller manager

La maggior parte delle funzioni del CCM è derivata dal KCM. Come menzionato nella sezione precedente, CCM esegue i seguenti cicli di controllo:

* Node controller
* Route controller
* Service controller
* PersistentVolumeLabels controller

#### Node controller

Il controller del nodo è responsabile per l'inizializzazione di un nodo ottenendo informazioni sui nodi in esecuzione nel cluster dal provider cloud. Il controller del nodo esegue le seguenti funzioni:

1. Inizializzare un nodo con etichette zona / regione specifiche per il cloud.
2. Inizializzare un nodo con dettagli di istanza specifici del cloud, ad esempio, tipo e dimensione.
3. Ottenere gli indirizzi di rete del nodo e il nome host.
4. Nel caso in cui un nodo non risponda, controlla il cloud per vedere se il nodo è stato cancellato dal cloud.
Se il nodo è stato eliminato dal cloud, elimina l'oggetto Nodo Kubernetes.

#### Route controller

Il controller di instradamento è responsabile della configurazione delle rotte nel cloud in modo appropriato in modo che i contenitori su nodi diversi nel cluster Kubernetes possano comunicare tra loro. Il controller di percorso è applicabile solo ai cluster di Google Compute Engine.

#### Service Controller

Il responsabile del servizio è responsabile dell'ascolto del servizio di creazione, aggiornamento ed eliminazione di eventi. In base allo stato attuale dei servizi in Kubernetes, configura i bilanciatori del carico cloud (come ELB o Google LB) per riflettere lo stato dei servizi in Kubernetes. Inoltre, assicura che i back-end di servizio per i servizi di bilanciamento del carico del cloud siano aggiornati.

#### PersistentVolumeLabels controller

Il controllore PersistentVolumeLabels applica le etichette sui volumi AWS EBS / GCE PD al momento della creazione. Ciò elimina la necessità per gli utenti di impostare manualmente le etichette su questi volumi.

Queste etichette sono essenziali per la pianificazione dei pod in quanto questi volumi sono costretti a funzionare solo all'interno della regione / zona in cui si trovano. Qualsiasi pod che utilizza questi volumi deve essere pianificato nella stessa zona / zona.

Il controller PersistentVolumeLabels è stato creato appositamente per CCM; cioè, non esisteva prima della creazione del CCM. Ciò è stato fatto per spostare la logica di etichettatura fotovoltaica nel server API Kubernetes (era un controller di ammissione) al CCM. Non funziona su KCM.

### 2. Kubelet

Il controller del nodo contiene la funzionalità dipendente dal cloud di kubelet. Prima dell'introduzione del CCM, il kubelet era responsabile dell'inizializzazione di un nodo con dettagli specifici del cloud come indirizzi IP, etichette regione / zona e informazioni sul tipo di istanza. L'introduzione del CCM ha spostato questa operazione di inizializzazione dal kubelet al CCM.

In questo nuovo modello, kubelet inizializza un nodo senza informazioni specifiche del cloud. Tuttavia, aggiunge un disturbo al nodo appena creato che rende il nodo non programmabile finché CCM non inizializza il nodo con informazioni specifiche del cloud. Rimuove quindi questa macchia.


### 3. Kubernetes API server

Il controller Persistent Volume Labels sposta la funzionalità dipendente dal cloud del server API di Kubernetes sul CCM come descritto nelle sezioni precedenti

## Plugin mechanism

Il gestore del controller cloud utilizza le interfacce Go per consentire l'implementazione di implementazioni da qualsiasi cloud. In particolare, utilizza l'interfaccia CloudProvider definita [qui](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

L'implementazione dei quattro controller condivisi evidenziati sopra e alcuni scaffolding con l'interfaccia cloudprovider condivisa rimarranno nel core di Kubernetes. Le implementazioni specifiche per i fornitori di cloud saranno costruite al di fuori del core e implementeranno le interfacce definite nel core.

Per ulteriori informazioni sullo sviluppo di plug-in, consultare  [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Authorization

Questa sezione suddivide l'accesso richiesto su vari oggetti API da CCM per eseguire le sue operazioni.

### Node Controller

Il controller del nodo funziona solo con oggetti nodo. Richiede l'accesso completo per ottenere, elencare, creare, aggiornare, applicare patch, guardare ed eliminare oggetti nodo.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Il controllore del percorso ascolta la creazione dell'oggetto Nodo e configura le rotte in modo appropriato. Richiede l'accesso agli oggetti Nodo.

v1/Node:

- Get

### Service controller

Il controller del servizio ascolta Service object crea, aggiorna ed elimina eventi e quindi configura gli endpoint per tali Servizi in modo appropriato.

Per accedere ai Servizi, è necessario un elenco e controllare l'accesso. Per aggiornare i servizi, richiede la patch e l'accesso agli aggiornamenti.

Per impostare gli endpoint per i Servizi, richiede l'accesso per creare, elencare, ottenere, guardare e aggiornare.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### PersistentVolumeLabels controller

Il controller Persistent Volume Labels ascolta su Persistent Volume (PV) crea eventi e quindi li aggiorna. Questo controller richiede l'accesso per ottenere e aggiornare PV.

v1/PersistentVolume:

- Get
- List
- Watch
- Update

### Others

L'implementazione del core di CCM richiede l'accesso per creare eventi e per garantire operazioni sicure richiede l'accesso per creare ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

RBAC ClusterRole per il CCM ha il seguente aspetto:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Vendor Implementations

I seguenti fornitori di cloud hanno implementato CCM:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)

## Cluster Administration

Sono fornite le istruzioni complete per la configurazione e l'esecuzione del CCM
[qui](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}
