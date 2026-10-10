---
title: I componenti di Kubernetes
description: >
  Un cluster di Kubernetes è costituito da un insieme di componenti che sono, come minimo, un Control Plane e uno o più sistemi di elaborazione, detti nodi.
content_type: concept
weight: 20
card: 
  name: concepts
  weight: 20
---

<!-- overview -->
Facendo il deployment di Kubernetes, ottieni un cluster.
{{< glossary_definition term_id="cluster" length="all" prepend="Un cluster Kubernetes è">}}

Questo documento descrive i diversi componenti che sono necessari per avere 
un cluster Kubernetes completo e funzionante.

Questo è un diagramma di un cluster Kubernetes con tutti i componenti e le loro relazioni.

![I componenti di Kubernetes](/images/docs/components-of-kubernetes.png)



<!-- body -->
## Componenti della Control Plane

I componenti del Control Plane sono responsabili di tutte le decisioni globali sul cluster (ad esempio, lo scheduling) oltre che a rilevare e rispondere agli eventi del cluster (ad esempio, l'avvio di un nuovo {{< glossary_tooltip text="pod" term_id="pod">}} quando il valore `replicas` di un deployment non è soddisfatto).

I componenti della Control Plane possono essere eseguiti su qualsiasi nodo del cluster stesso. Solitamente, per semplicità, gli script di installazione tendono a eseguire tutti i componenti della Control Plane sulla stessa macchina, separando la Control Plane dai workload dell'utente.
Vedi [creare un cluster in High-Availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) per un esempio di un'installazione multi-master.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Alcuni esempi di controller gestiti dal kube-controller-manager sono:

  * Node Controller: Responsabile del monitoraggio dei nodi del cluster, e.g. della gestione delle azioni da eseguire quando un nodo diventa non disponibile.
  * Replication Controller: Responsabile per il mantenimento del corretto numero di Pod per ogni ReplicaSet presente nel sistema
  * Endpoints Controller: Popola gli oggetti Endpoints (cioè, mette in relazioni i Pods con i Services).
  * Service Account & Token Controllers: Creano gli account di default e i token di accesso alle API per i nuovi namespaces.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

Il cloud-controller-manager esegue dei controller specifici del tuo cloud provider.
Se hai una installazione Kubernetes on premises, o un ambiente di laboratorio
nel tuo PC, il cluster non ha un cloud-controller-manager.

Come nel kube-controller-manager, il cloud-controller-manager combina diversi control loop 
logicamente indipendenti in un singolo binario che puoi eseguire come un singolo processo. Tu puoi
scalare orizzontalmente (eseguire più di una copia) per migliorare la responsività o per migliorare la tolleranza ai fallimenti.

I seguenti controller hanno dipendenze verso implementazioni di specifici cloud provider:

  * Node Controller: Per controllare se sul cloud provider i nodi che hanno smesso di rispondere sono stati cancellati
  * Route Controller: Per configurare le network route nella sottostante infrastruttura cloud
  * Service Controller: Per creare, aggiornare ed eliminare i load balancer del cloud provider
 
## Componenti dei Nodi

I componenti del nodo vengono eseguiti su ogni nodo, mantenendo i pod in esecuzione e fornendo l'ambiente di runtime Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container Runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Gli Addons usano le risorse Kubernetes ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, etc) per implementare funzionalità di cluster.
Dal momento che gli addons forniscono funzionalità a livello di cluster, le risorse che necessitano di un namespace, vengono collocate nel namespace `kube-system`.

Alcuni addons sono descritti di seguito; mentre per una più estesa lista di addons, per favore vedere [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Mentre gli altri addons non sono strettamente richiesti, tutti i cluster Kubernetes dovrebbero essere muniti di un [DNS del cluster](/docs/concepts/services-networking/dns-pod-service/), dal momento che molte applicazioni lo necessitano.

Il DNS del cluster è un server DNS aggiuntivo rispetto ad altri server DNS presenti nella rete, e si occupa specificatamente dei record DNS per i servizi Kubernetes.

I container eseguiti da Kubernetes automaticamente usano questo server per la risoluzione DNS.

### Interfaccia web (Dashboard)

La [Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) è una interfaccia web per i cluster Kubernetes.
Permette agli utenti di gestire e fare troubleshooting delle applicazioni che girano nel cluster, e del cluster stesso.

### Monitoraggio dei Container

Il [Monitoraggio dei Container](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) salva serie temporali di metriche generiche dei container in un database centrale e fornisce una interfaccia in cui navigare i dati stessi.

### Log a livello di Cluster

Un [log a livello di cluster](/docs/concepts/cluster-administration/logging/) è responsabile per il salvataggio dei log dei container in un log centralizzato la cui interfaccia permette di cercare e navigare nei log.


## {{% heading "whatsnext" %}}

* Scopri i concetti relativi ai [Nodi](/docs/concepts/architecture/nodes/)
* Scopri i concetti relativi ai [Controller](/docs/concepts/architecture/controller/)
* Scopri i concetti relativi al [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Leggi la [documentazione](https://etcd.io/docs/) ufficiale di etcd

