---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Esecuzione in più zone
weight: 20
content_type: concept
---

<!-- overview -->

Questa pagina descrive l'esecuzione di Kubernetes su più zone.

<!-- body -->

## Contesto

Kubernetes è progettato in modo che un singolo cluster Kubernetes possa essere eseguito
su più zone di fault, tipicamente dove queste zone rientrano in un raggruppamento logico chiamato _regione_. I principali provider cloud definiscono una regione
come un insieme di zone di fault (chiamate anche _availability zone_) che offrono
un set coerente di funzionalità: all'interno di una regione, ogni zona offre le stesse
API e servizi.

Le architetture cloud tipiche mirano a ridurre al minimo la possibilità che un guasto in
una zona comprometta anche i servizi in un'altra zona.

## Comportamento del control plane

Tutti i [componenti del control plane](/docs/concepts/architecture/#control-plane-components)
supportano l'esecuzione come pool di risorse intercambiabili, replicate per
componente.

Quando distribuisci un control plane di cluster, posiziona le repliche dei
componenti del control plane su più zone di fault. Se la disponibilità è
una preoccupazione importante, seleziona almeno tre zone di fault e replica
ciascun componente del control plane (API server, scheduler, etcd,
cluster controller manager) su almeno tre zone di fault.
Se stai eseguendo un cloud controller manager, dovresti
replicare anche questo su tutte le zone di fault selezionate.

{{< note >}}
Kubernetes non fornisce resilienza cross-zone per gli endpoint dell'API server.
Puoi utilizzare varie tecniche per migliorare la disponibilità dell'API server del cluster, tra cui DNS round-robin, record SRV o
una soluzione di bilanciamento del carico di terze parti con health check.
{{< /note >}}

## Comportamento dei nodi

Kubernetes distribuisce automaticamente i Pod delle
risorse di workload (come {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
o {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
su nodi diversi in un cluster. Questa distribuzione aiuta
a ridurre l'impatto dei guasti.

Quando i nodi si avviano, il kubelet su ciascun nodo aggiunge automaticamente
{{< glossary_tooltip text="etichette" term_id="label" >}} all'oggetto Node
che rappresenta quello specifico kubelet nell'API di Kubernetes.
Queste etichette possono includere
[informazioni sulla zona](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

Se il tuo cluster si estende su più zone o regioni, puoi utilizzare le etichette dei nodi
insieme ai
[vincoli di distribuzione topologica dei Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
per controllare come i Pod vengono distribuiti tra i domini di fault del cluster:
regioni, zone e persino nodi specifici.
Questi suggerimenti consentono al
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} di posizionare
i Pod per una migliore disponibilità attesa, riducendo il rischio che un guasto correlato
influisca su tutto il tuo workload.

Ad esempio, puoi impostare un vincolo per assicurarti che le
3 repliche di uno StatefulSet vengano eseguite tutte in zone diverse tra loro,
quando ciò è possibile. Puoi definire questo comportamento in modo dichiarativo
senza specificare esplicitamente quali availability zone sono in uso per
ogni workload.

### Distribuzione dei nodi tra le zone

Il core di Kubernetes non crea i nodi per te; devi farlo tu stesso,
oppure utilizzare uno strumento come [Cluster API](https://cluster-api.sigs.k8s.io/) per
gestire i nodi per tuo conto.

Utilizzando strumenti come Cluster API puoi definire insiemi di macchine da eseguire come
nodi worker per il tuo cluster su più domini di fault, e regole per
ripristinare automaticamente il cluster in caso di interruzione di servizio di un'intera zona.

## Assegnazione manuale della zona per i Pod

Puoi applicare [vincoli node selector](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
ai Pod che crei, così come ai template di Pod nelle risorse di workload
come Deployment, StatefulSet o Job.

## Accesso allo storage per le zone

Quando vengono creati volumi persistenti, Kubernetes aggiunge automaticamente etichette di zona 
a qualsiasi PersistentVolume collegato a una zona specifica.
Il {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} garantisce quindi,
tramite il suo predicato `NoVolumeZoneConflict`, che i pod che richiedono un determinato PersistentVolume
vengano posizionati solo nella stessa zona di quel volume.

Tieni presente che il metodo di aggiunta delle etichette di zona può dipendere dal tuo 
cloud provider e dal provisioner di storage utilizzato. Consulta sempre la documentazione 
specifica per il tuo ambiente per assicurarti di una configurazione corretta.

Puoi specificare una {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
per le PersistentVolumeClaim che indica i domini di fault (zone) che lo
storage di quella classe può utilizzare.
Per sapere come configurare una StorageClass consapevole dei domini di fault o delle zone,
vedi [Topologie consentite](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Networking

Di per sé, Kubernetes non include un networking consapevole delle zone. Puoi utilizzare un
[plugin di rete](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
per configurare il networking del cluster, e quella soluzione di rete potrebbe avere elementi specifici per zona. Ad esempio, se il tuo cloud provider supporta i Service con
`type=LoadBalancer`, il load balancer potrebbe inviare traffico solo ai Pod in esecuzione nella
stessa zona dell'elemento load balancer che gestisce una determinata connessione.
Consulta la documentazione del tuo cloud provider per i dettagli.

Per deployment personalizzati o on-premises, valgono considerazioni simili.
Il comportamento di {{< glossary_tooltip text="Service" term_id="service" >}} e
{{< glossary_tooltip text="Ingress" term_id="ingress" >}}, inclusa la gestione
di diverse zone di fault, varia a seconda di come è configurato il tuo cluster.

## Ripristino dai guasti

Quando configuri il tuo cluster, potresti anche dover considerare se e come
la tua configurazione può ripristinare il servizio se tutte le zone di fault in una regione
vanno offline contemporaneamente. Ad esempio, ti affidi al fatto che ci sia almeno
un nodo in grado di eseguire Pod in una zona?  
Assicurati che qualsiasi lavoro di riparazione critico per il cluster non dipenda
dalla presenza di almeno un nodo sano nel cluster. Ad esempio: se tutti i nodi
sono non funzionanti, potresti dover eseguire un Job di riparazione con una speciale
{{< glossary_tooltip text="tollerazione" term_id="toleration" >}} in modo che la riparazione
possa essere completata almeno per riportare un nodo in servizio.

Kubernetes non fornisce una soluzione a questa sfida; tuttavia,
è qualcosa da considerare.

## {{% heading "whatsnext" %}}

Per scoprire come lo scheduler posiziona i Pod in un cluster, rispettando i vincoli configurati,
visita [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).

