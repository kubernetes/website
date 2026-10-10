---
title: Concetti alla base del Cloud Controller Manager
content_type: concept
weight: 30
---

<!-- overview -->

Il concetto di CCM (cloud controller manager), da non confondere con il binario, è stato originariamente creato per consentire di sviluppare Kubernetes indipendentemente dall'implementazione dello specifico cloud provider. Il cloud controller manager viene eseguito insieme ad altri componenti principali come il Kubernetes controller manager, il server API e lo scheduler. Può anche essere avviato come addon di Kubernetes, nel qual caso viene eseguito su Kubernetes.

Il design del cloud controller manager è basato su un meccanismo di plug-in che consente ai nuovi provider cloud di integrarsi facilmente con Kubernetes creando un plug-in. Sono in atto programmi per l'aggiunta di nuovi provider di cloud su Kubernetes e per la migrazione dei provider che usano il vecchio metodo a questo nuovo metodo.

Questo documento discute i concetti alla base del cloud controller manager e fornisce dettagli sulle funzioni associate.

Ecco l'architettura di un cluster Kubernetes senza il gestore del controller cloud:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)




<!-- body -->

## Architettura

Nel diagramma precedente, Kubernetes e il provider cloud sono integrati attraverso diversi componenti:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server


Il CCM consolida tutta la logica dipendente dal cloud presente nei tre componenti precedenti, per creare un singolo punto di integrazione con il cloud. La nuova architettura con il CCM si presenta così:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Componenti del CCM

Il CCM divide alcune funzionalità del Kubernetes controller manager (KCM) e le esegue in un differente processo. In particolare, toglie dal KCM le integrazioni con il cloud specifico. Il KCM ha i seguenti controller che dipendono dal cloud specifico:

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

Nella versione 1.9, il CCM esegue i seguenti controller dall'elenco precedente:

* Node controller
* Route controller
* Service controller

{{< note >}}
È stato deliberatamente deciso di non spostare il Volume controller nel CCM. Data la complessità del Volume controller e gli sforzi già fatti per astrarre le logiche specifiche dei singoli fornitori, è stato deciso che il Volume controller non verrà spostato nel CCM.
{{< /note >}}

Il piano originale per supportare i volumi utilizzando il CCM era di utilizzare [Flex](/docs/concepts/storage/volumes/#flexVolume) per supportare volumi collegabili. Tuttavia, una implementazione parallela, nota come [CSI](/docs/concepts/storage/volumes/#csi) è stata designata per sostituire Flex.

Considerando queste evoluzioni, abbiamo deciso di adottare un approccio intermedio finché il CSI non è pronto.

## Funzioni del CCM

Il CCM eredita le sue funzioni da componenti di Kubernetes che dipendono da uno specifico provider di cloud. Questa sezione è strutturata sulla base di tali componenti.

### 1. Kubernetes controller manager

La maggior parte delle funzioni del CCM deriva dal KCM. Come menzionato nella sezione precedente, CCM esegue i seguenti cicli di controllo:

* Node controller
* Route controller
* Service controller

#### Node controller

Il Node controller è responsabile per l'inizializzazione di un nodo ottenendo informazioni sui nodi in esecuzione nel cluster dal provider cloud. Il controller del nodo esegue le seguenti funzioni:

1. Inizializzare un nodo con le label zone/region specifiche per il cloud in uso.
2. Inizializzare un nodo con le specifiche, ad esempio, tipo e dimensione specifiche del cloud in uso.
3. Ottenere gli indirizzi di rete del nodo e l'hostname.
4. Nel caso in cui un nodo non risponda, controlla il cloud per vedere se il nodo è stato cancellato dal cloud.
Se il nodo è stato eliminato dal cloud, elimina l'oggetto Nodo di Kubernetes.

#### Route controller

Il Route controller è responsabile della configurazione delle route nel cloud in modo che i container su nodi differenti del cluster Kubernetes possano comunicare tra loro. Il Route controller è utilizzabile solo dai cluster su Google Compute Engine.

#### Service Controller

Il Service Controller rimane in ascolto per eventi di creazione, aggiornamento ed eliminazione di servizi. In base allo stato attuale dei servizi in Kubernetes, configura i bilanciatori di carico forniti dal cloud (come gli ELB, i Google LB, o gli Oracle Cloud Infrastructure LB) per riflettere lo stato dei servizi in Kubernetes. Inoltre, assicura che i back-end dei bilanciatori di carico forniti dal cloud siano aggiornati.

### 2. Kubelet

Il Node Controller contiene l'implementazione dipendente dal cloud della kubelet. Prima dell'introduzione del CCM, la kubelet era responsabile dell'inizializzazione di un nodo con dettagli dipendenti dallo specifico cloud come gli indirizzi IP, le label region/zone e le informazioni sul tipo di istanza. L'introduzione del CCM ha spostato questa operazione di inizializzazione dalla kubelet al CCM.

In questo nuovo modello, la kubelet inizializza un nodo senza informazioni specifiche del cloud. Tuttavia, aggiunge un blocco al nodo appena creato che rende il nodo non selezionabile per eseguire container finché il CCM non inizializza il nodo con le informazioni specifiche del cloud. Il CCM rimuove quindi questo blocco.

## Sistema a plug-in

Il cloud controller manager utilizza le interfacce di Go per consentire l'implementazione di implementazioni di qualsiasi cloud. In particolare, utilizza l'interfaccia CloudProvider definita [qui](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

L'implementazione dei quattro controller generici evidenziati sopra, alcune strutture, l'interfaccia cloudprovider condivisa rimarranno nel core di Kubernetes. Le implementazioni specifiche per i vari cloud saranno costruite al di fuori del core e implementeranno le interfacce definite nel core.

Per ulteriori informazioni sullo sviluppo di plug-in, consultare [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Autorizzazione

Questa sezione dettaglia l'accesso richiesto dal CCM sui vari API objects per eseguire le sue operazioni.

### Node controller

Il Node controller funziona solo con oggetti di tipo Node. Richiede l'accesso completo per ottenere, elencare, creare, aggiornare, applicare patch, guardare ed eliminare oggetti di tipo Node.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Il Route controller ascolta la creazione dell'oggetto Node e configura le rotte in modo appropriato. Richiede l'accesso in lettura agli oggetti di tipo Node.

v1/Node:

- Get

### Service controller

Il Service controller resta in ascolto per eventi di creazione, aggiornamento ed eliminazione di oggetti di tipo Servizi, e configura gli endpoint per tali Servizi in modo appropriato.

Per accedere ai Servizi, è necessario il permesso per list e watch. Per aggiornare i Servizi, sono necessari i permessi patch e update.

Per impostare gli endpoint per i Servizi, richiede i permessi create, list, get, watch, e update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Others

L'implementazione del core di CCM richiede l'accesso per creare eventi e, per garantire operazioni sicure, richiede l'accesso per creare ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

L'RBAC ClusterRole per il CCM ha il seguente aspetto:

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

I seguenti fornitori di cloud hanno una implementazione di CCM:

* [Alibaba Cloud](https://github.com/kubernetes/cloud-provider-alibaba-cloud)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [Hetzner](https://github.com/hetznercloud/hcloud-cloud-controller-manager)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)
* [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [TencentCloud](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager)

## Cluster Administration

Le istruzioni complete per la configurazione e l'esecuzione del CCM sono fornite
[qui](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).


