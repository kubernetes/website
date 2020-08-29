---
title: Controller
content_template: concept
weight: 30
---

<!-- overview -->

Nella robotica e nell'automazione, un _circuito di controllo_ (_control loop_) è un un'iterazione senza soluzione di continuità che regola lo stato di un sistema.

Ecco un esempio di un circuito di controllo: il termostato di una stanza.

Quando viene impostata la temperatura, si definisce attraverso il termostato lo *stato desiderato*. L'attuale temperatura nella stanza è invece lo *stato corrente*. Il termostato agisce per portare lo stato corrente il più vicino possibile allo stato desiderato accendendo e spegnendo le apparecchiature.

{{< glossary_definition term_id="controller" length="short" >}}

<!-- body -->

## Il modello del controller

Un _controller_ monitora almeno una tipo di risorsa registrata in Kubernetes. 
Questi [oggetti](/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects) hanno una proprietà chiamata *spec* (specifica) che rappresenta lo stato desiderato. Il o i *controller* per quella risorsa sono responsabili di mantenere lo stato corrente il più simile possibile rispetto allo stato desiderato.

Il _controller_ potrebbe eseguire l'azione relativa alla risorsa in questione da sé; più comunemente, in Kubernetes, un _controller_ invia messaggi all'{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} che a sua volta li rende disponibili ad altri componenti nel cluster. Di seguito troverete esempi per questo scenario.

{{< comment >}}
Alcuni controller nativi, come ad esempio l'_endpoints_ controller, agiscono su oggetti che non hanno una specifica. Per semplicità, questa pagina non entra in quel dettaglio.
{{< /comment >}}

### Controllo attraverso l'API server

Il {{< glossary_tooltip term_id="job" >}} _controller_ è un esempio di un _controller_ nativo in Kubernetes. I _controller_ nativi gestiscono lo stato interagendo con l'API server presente nel cluster.

Il Job è una risorsa di Kubernetes che lancia uno o più {{< glossary_tooltip term_id="pod" text="Pod" >}} per eseguire un lavoro (task) e poi fermarsi.

(Una volta che è stato [schedulato](/docs/concepts/scheduling-eviction/), un oggetto _Pod_ diventa parte dello stato desisderato di un dato _kubelet_).

Quando il Job _controller_ vede un nuovo lavoro da svolgere si assicura che, da qualche parte nel cluster, i _kubelet_ anche sparsi su più nodi eseguano il numero corretto di _Pod_ necessari per eseguire il lavoro richiesto. Il Job _controller_ non esegue direttamente alcun _Pod_ o _container_ bensì chiede all'API server di creare o rimuovere i _Pod_. Altri componenti appartenenti al {{< glossary_tooltip text="control plane" term_id="control-plane" >}} reagiscono in base alle nuove informazioni (ci sono nuovi _Pod_ da creare e gestire) e cooperano al completamento del job.

Dopo che un nuovo Job è stato creato, lo stato desiderato per quel Job è il suo completamento. Il Job _controller_ fa sì che lo stato corrente per quel Job sia il più vicino possibile allo stato desiderato: creare _Pod_ che eseguano il lavoro che deve essere effettuato attraverso il Job, così che il Job sia prossimo al completamento.

I _controller_ aggiornano anche gli oggetti che hanno configurato. Ad esempio: una volta che il lavoro relativo ad un dato Job è stato completato, il Job _controller_ aggiorna l'oggetto Job segnandolo come `Finished`.

(Questo è simile allo scenario del termostato che spegne un certo led per indicare che ora la stanza ha raggiungo la temperatura impostata)

### Controllo diretto

A differenza del Job, alcuni _controller_ devono eseguire delle modifiche a parti esterne al cluster.

Per esempio, se viene usato un circuito di controllo per assicurare che ci sia un numero sufficiente di {{< glossary_tooltip text="Nodi" term_id="node" >}} nel cluster, allora il _controller_ ha bisogno che qualcosa al di fuori del cluster configuri i nuovi _Nodi_ quando sarà necessario.

I _controller_ che interagiscono con un sistema esterno trovano il loro stato desiderato attraverso l'API server, quindi comunicano direttamente con un sistema esterno per portare il loro stato corrente più in linea possibile con lo stato desiderato

(In realtà c'è un _controller_ che scala orizzontalmente i nodi nel cluster. Vedi [Cluster autoscaling](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling)).

## Stato desiderato versus corrente {#desiderato-vs-corrente}

Kubernetes ha una visione *cloud-native* dei sistemi, ed è in grado di gestire continue modifiche.

Il cluster viene modificato continuamente durante la sua attività ed il _circuito di controllo_ è in grado di risolvere automaticamente i possibili guasti.

Fino a che i _controller_ del cluster sono in funzione ed in grado di apportare le dovute modifiche, non è rilevante che lo stato complessivo del cluster sia o meno stabile.

## Progettazione

Come cardine della sua progettazione, Kubernetes usa vari _controller_ ognuno dei quali è responsabile per un particolare aspetto dello stato del cluster. Più comunemente, un dato _circuito di controllo_ (_controller_) usa un tipo di risorsa per il suo stato desiderato, ed utilizza anche risorse di altro tipo per raggiungere questo stato desiderato. Per esempio il Job _controller_ tiene traccia degli oggetti di tipo _Job_ (per scoprire nuove attività da eseguire) e degli oggetti di tipo _Pod_ (questi ultimi usati per eseguire i _Job_, e quindi per controllare quando il loro lavoro è terminato). In questo caso, qualcos'altro crea i _Job_, mentre il _Job_ _controller_ crea i _Pod_.

È utile avere semplici _controller_ piuttosto che un unico, monolitico, _circuito di controllo_. I _controller_ possono guastarsi, quindi Kubernetes è stato disegnato per gestire questa eventualità.

{{< note >}}
Ci possono essere diversi _controller_ che creato o aggiornano lo stesso tipo di oggetti. Dietro le quinte, i _controller_ di Kubernetes si preoccupano esclusivamente delle risorse (di altro tipo) collegate alla risorsa primaria da essi controllata.

Per esempio, si possono avere _Deployment_ e _Job_; entrambe creano _Pod_. Il Job _controller_ non distrugge i _Pod_ creati da un _Deployment_, perché ci sono informazioni (*{{< glossary_tooltip term_id="label" text="labels" >}}*) che vengono usate dal _controller_ per distinguere i _Pod_.
{{< /note >}}

## I modi per eseguire i _controller_ {#eseguire-controller}

Kubernetes annovera un insieme di _controller_ nativi che sono in esecuzione all'interno del {{< glossary_tooltip term_id="kube-controller-manager" >}}. Questi _controller_ nativi forniscono importanti funzionalità di base.

Il Deployment _controller_ ed il Job _controller_ sono esempi di _controller_ che vengono forniti direttamente da Kubernetes stesso (ovvero _controller_ "nativi").
Kubernetes consente di eseguire un _piano di controllo_(_control plane_) resiliente, di modo che se un dei _controller_ nativi dovesse fallire, un'altra parte del piano di controllo si occuperà di eseguire quel lavoro.

Al fine di estendere Kubernetes, si possono avere _controller_ in esecuzione al di fuori del piano di controllo. Oppure, se si desidera, è possibile scriversi un nuovo _controller_. È possibile eseguire il proprio controller come una serie di _Pod_, oppure esternamente rispetto a Kubernetes. Quale sia la soluzione migliore, dipende dalla responsabilità di un dato controller.

## {{% heading "whatsnext" %}}
* Leggi in merito [Kubernetes control plane](/docs/concepts/#kubernetes-control-plane)
* Scopri alcune delle basi degli [oggetti di Kubernetes](/docs/concepts/#kubernetes-objects)
* Per saperne di più riguardo alle [API di Kubernetes](/docs/concepts/overview/kubernetes-api/)
* Se vuoi creare un tuo _controller_, guarda [i modelli per l'estensibilità](/docs/concepts/extend-kubernetes/extend-cluster/#extension-patterns) in Estendere Kubernetes.

