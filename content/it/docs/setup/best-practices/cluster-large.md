---
reviewers:
- davidopp
- lavalamp
title: Considerazioni per cluster di grandi dimensioni
weight: 10
---
Un cluster è un insieme di {{< glossary_tooltip text="nodi" term_id="node" >}} (macchine fisiche o virtuali) che eseguono agenti Kubernetes, gestiti dal {{< glossary_tooltip text="piano di controllo" term_id="control-plane" >}}. Kubernetes {{< param "version" >}} supporta cluster fino a 5.000 nodi. Più precisamente, Kubernetes è progettato per supportare configurazioni che rispettano *tutti* i seguenti criteri:

* Non più di 110 pod per nodo
* Non più di 5.000 nodi
* Non più di 150.000 pod totali
* Non più di 300.000 container totali

Puoi scalare il tuo cluster aggiungendo o rimuovendo nodi. Il modo in cui lo fai dipende da come è stato distribuito il tuo cluster.

## Quote delle risorse del cloud provider {#quota-issues}

Per evitare problemi di quota del cloud provider, quando crei un cluster con molti nodi, considera di:
* Richiedere un aumento della quota per risorse cloud come:
  * Istanza di calcolo
  * CPU
  * Volumi di storage
  * Indirizzi IP in uso
  * Set di regole di filtraggio dei pacchetti
  * Numero di bilanciatori di carico
  * Subnet di rete
  * Flussi di log
* Suddividere le azioni di scaling del cluster per avviare nuovi nodi a gruppi, con una pausa tra i gruppi, poiché alcuni cloud provider limitano la velocità di creazione delle nuove istanze.

## Componenti del piano di controllo

Per un cluster di grandi dimensioni, è necessario un piano di controllo con risorse di calcolo e altre risorse sufficienti.

Tipicamente si eseguono una o due istanze del piano di controllo per zona di fault, scalando queste istanze verticalmente prima e poi orizzontalmente dopo aver raggiunto il punto di rendimenti decrescenti nella scalabilità verticale.

Dovresti eseguire almeno un'istanza per zona di fault per garantire la tolleranza ai guasti. I nodi Kubernetes non indirizzano automaticamente il traffico verso gli endpoint del piano di controllo che si trovano nella stessa zona di fault; tuttavia, il tuo cloud provider potrebbe avere meccanismi propri per farlo.

Ad esempio, utilizzando un bilanciatore di carico gestito, puoi configurarlo per inviare il traffico proveniente dal kubelet e dai Pod nella zona di fault _A_ solo agli host del piano di controllo che si trovano anch'essi nella zona _A_. Se un singolo host del piano di controllo o endpoint della zona di fault _A_ va offline, tutto il traffico del piano di controllo per i nodi nella zona _A_ verrà inviato tra zone. Eseguire più host del piano di controllo in ogni zona rende questo scenario meno probabile.

### Storage etcd

Per migliorare le prestazioni dei cluster di grandi dimensioni, puoi archiviare gli oggetti Event in un'istanza etcd dedicata.

Quando crei un cluster, puoi (utilizzando strumenti personalizzati):

* avviare e configurare un'istanza etcd aggiuntiva
* configurare il {{< glossary_tooltip term_id="kube-apiserver" text="server API" >}} per utilizzarla per l'archiviazione degli eventi

Consulta [Gestione dei cluster etcd per Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) e [Configurare un cluster etcd ad alta disponibilità con kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) per dettagli sulla configurazione e gestione di etcd per un cluster di grandi dimensioni.

## Risorse degli addon

I [limiti delle risorse](/docs/concepts/configuration/manage-resources-containers/) di Kubernetes aiutano a minimizzare l'impatto di memory leak e altri modi in cui pod e container possono influenzare altri componenti. Questi limiti si applicano alle risorse degli {{< glossary_tooltip text="addon" term_id="addons" >}} così come ai carichi di lavoro applicativi.

Ad esempio, puoi impostare limiti di CPU e memoria per un componente di logging:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
  image: fluent/fluentd-kubernetes-daemonset:v1
  resources:
    limits:
    cpu: 100m
    memory: 200Mi
```

I limiti predefiniti degli addon sono solitamente basati su dati raccolti dall'esperienza su cluster Kubernetes piccoli o medi. Su cluster di grandi dimensioni, gli addon spesso consumano più risorse rispetto ai limiti predefiniti. Se un grande cluster viene distribuito senza adeguare questi valori, gli addon potrebbero essere continuamente terminati perché raggiungono il limite di memoria. In alternativa, l'addon potrebbe funzionare ma con prestazioni scarse a causa delle restrizioni sui tempi di CPU.

Per evitare problemi di risorse degli addon, quando crei un cluster con molti nodi, considera quanto segue:

* Alcuni addon scalano verticalmente: esiste una replica dell'addon per l'intero cluster o per una zona di fault. Per questi addon, aumenta le richieste e i limiti man mano che il cluster cresce.
* Molti addon scalano orizzontalmente: aggiungi capacità eseguendo più pod, ma con un cluster molto grande potresti anche dover aumentare leggermente i limiti di CPU o memoria. Il [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) può essere eseguito in modalità _recommender_ per fornire valori suggeriti per richieste e limiti.
* Alcuni addon vengono eseguiti come una copia per nodo, controllati da un {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}: ad esempio, un aggregatore di log a livello di nodo. Come nel caso degli addon scalati orizzontalmente, potresti dover aumentare leggermente i limiti di CPU o memoria.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` è una risorsa personalizzata che puoi distribuire nel tuo cluster per aiutarti a gestire richieste e limiti di risorse per i pod.  
Scopri di più su [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) e su come puoi usarlo per scalare i componenti del cluster, inclusi gli addon critici.

* Leggi [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)

* L'[addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme) ti aiuta a ridimensionare automaticamente gli addon man mano che la scala del cluster cambia.
