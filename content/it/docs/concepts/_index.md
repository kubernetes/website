---
title: Concepts
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

La sezione Concetti ti aiuta a conoscere le parti del sistema Kubernetes e le astrazioni utilizzate da Kubernetes per rappresentare il tuo cluster e ti aiuta ad ottenere una comprensione più profonda di come funziona Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Overview

Per lavorare con Kubernetes, usi *gli oggetti API Kubernetes* per descrivere lo *stato desiderato del tuo cluster*: quali applicazioni o altri carichi di lavoro vuoi eseguire, quali immagini del contenitore usano, numero di repliche, quali risorse di rete e disco vuoi rendere disponibile e altro ancora. Puoi impostare lo stato desiderato creando oggetti usando l'API di Kubernetes, in genere tramite l'interfaccia della riga di comando, `kubectl`. Puoi anche utilizzare direttamente l'API di Kubernetes per interagire con il cluster e impostare o modificare lo stato desiderato.

Una volta impostato lo stato desiderato, il *Kubernetes Control Plane* funziona per fare in modo che lo stato corrente del cluster corrisponda allo stato desiderato. Per fare ciò, Kubernetes esegue automaticamente una serie di attività, come l'avvio o il riavvio dei contenitori, il ridimensionamento del numero di repliche di una determinata applicazione e altro ancora. Il piano di controllo di Kubernetes è costituito da una raccolta di processi in esecuzione sul cluster:

* Il **Kubernetes Master** è una raccolta di tre processi che vengono eseguiti su un singolo nodo nel cluster, che è designato come nodo principale. Questi processi sono: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) e [kube-scheduler](/docs/admin/kube-scheduler/).
* Ogni singolo nodo non principale nel cluster esegue due processi:
  * **[kubelet](/docs/admin/kubelet/)**, che comunica con il master di Kubernetes.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, un proxy di rete che riflette i servizi di rete di Kubernetes su ciascun nodo.

## Kubernetes Objects

kubernetes contiene una serie di astrazioni che rappresentano lo stato del tuo sistema: applicazioni e carichi di lavoro distribuiti in container, le loro risorse di rete e disco associate e altre informazioni su ciò che sta facendo il tuo cluster. Queste astrazioni sono rappresentate da oggetti nell'API di Kubernetes; guarda la [Panoramica degli oggetti di Kubernetes](/docs/concepts/abstractions/overview/) per maggiori dettagli.

Gli oggetti di base di Kubernetes includono:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)


209/5000
Inoltre, Kubernetes contiene una serie di astrazioni di livello superiore denominate Controllori. I controller si basano sugli oggetti di base e forniscono funzionalità aggiuntive e funzionalità di convenienza. Loro includono:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetes Control Plane

Le varie parti del Piano di controllo di Kubernetes, come i master Kubernetes e i processi di Kubelet, regolano il modo in cui Kubernetes comunica con il cluster. Il Piano di controllo mantiene un registro di tutti gli oggetti Kubernetes nel sistema e esegue cicli di controllo continui per gestire lo stato di tali oggetti. In qualsiasi momento, i loop di controllo di Control Plane risponderanno ai cambiamenti nel cluster e lavoreranno per fare in modo che lo stato effettivo di tutti gli oggetti nel sistema corrisponda allo stato desiderato che hai fornito.

Ad esempio, quando si utilizza l'API di Kubernetes per creare un oggetto di distribuzione, si fornisce un nuovo stato desiderato per il sistema. Il piano di controllo di Kubernetes registra la creazione dell'oggetto e svolge le tue istruzioni avviando le applicazioni richieste e pianificandole sui nodi del cluster, in modo che lo stato effettivo del cluster corrisponda allo stato desiderato.

### Kubernetes Master

Il master Kubernetes è responsabile della gestione dello stato desiderato per il tuo cluster. Quando interagisci con Kubernetes, ad esempio utilizzando l'interfaccia della riga di comando `kubectl`, stai comunicando con il master di Kubernetes del cluster.

> Il "master" si riferisce a una raccolta di processi che gestiscono lo stato del cluster. In genere questi processi vengono eseguiti tutti su un singolo nodo nel cluster e questo nodo viene anche definito master. Il master può anche essere replicato per disponibilità e ridondanza.

### Kubernetes Nodes

I nodi di un cluster sono le macchine (VM, server fisici, ecc.) Che eseguono i flussi di lavoro delle applicazioni e del cloud. Il master Kubernetes controlla ciascun nodo; raramente interagirai direttamente con i nodi.

#### Object Metadata


* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

Se vuoi scrivere una pagina concettuale, vedi
[Uso dei modelli di pagina](/docs/home/contribute/page-templates/)
per informazioni sul tipo di pagina di concetto e il modello di concetto.

{{% /capture %}}
