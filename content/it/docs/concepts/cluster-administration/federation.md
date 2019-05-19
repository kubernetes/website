---
title: Federation
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

Questa pagina spiega perché e come gestire più cluster di Kubernetes utilizzando
federazione.
{{% /capture %}}

{{% capture body %}}
## Perché la federation

La federation facilita la gestione di più cluster. Lo fa fornendo 2
principali elementi costitutivi:

  * Sincronizzare le risorse tra i cluster: la Federazione offre la possibilità di conservare
    risorse in più cluster sincronizzati. Ad esempio, è possibile garantire che la stessa distribuzione esista in più cluster.
  * Rilevamento cross cluster: Federation offre la possibilità di configurare automaticamente server DNS e load balancer con i backend di tutti i cluster. Ad esempio, è possibile garantire che un record VIP o DNS globale possa essere utilizzato per accedere ai backend da più cluster.

Alcuni altri casi d'uso abilitati dalla federazione sono:

* Alta disponibilità: distribuendo il carico tra i cluster e la configurazione automatica del DNS
  server e bilanciamento del carico, la federazione riduce al minimo l'impatto del cluster
  fallimento.
* Evitare il lock-in del provider: semplificando la migrazione delle applicazioni
  cluster, la federazione impedisce il lock-in del provider di cluster.

La federazione non è utile se non si hanno più cluster. Alcuni dei motivi
perché potresti volere che più cluster siano:

* Bassa latenza: la presenza di cluster in più regioni riduce al minimo la latenza servendo
  utenti dal cluster che è più vicino a loro.
* Isolamento dei guasti: potrebbe essere meglio avere più cluster piccoli
  di un singolo cluster di grandi dimensioni per l'isolamento dei guasti (ad esempio: multiplo
  cluster in diverse zone di disponibilità di un provider cloud).
* Scalabilità: esistono limiti di scalabilità per un singolo cluster di kubernetes (questo
  non dovrebbe essere il caso per la maggior parte degli utenti. Per ulteriori dettagli:
  [Scaling di Kubernetes e obiettivi di rendimento](https://git.k8s.io/community/sig-scalability/goals.md)).
* [Hybrid cloud](#hybrid-cloud-capabilities): è possibile avere più cluster su diversi provider cloud o
  data center locali.

### Caveats

ci sono un sacco di casi d'uso interessanti per la federazione, ci sono anche
alcuni avvertimenti:

* Maggiore larghezza di banda e costo della rete: l'aereo di controllo della federazione controlla tutto
  cluster per garantire che lo stato attuale sia come previsto. Questo può portare a
  costo di rete significativo se i cluster sono in esecuzione in diverse regioni in
  un provider cloud o su diversi provider cloud.
* Ridotto isolamento del cluster incrociato: un errore sul piano di controllo oils può
  impatto su tutti i cluster. Questo è mitigato mantenendo la logica in federazione
  piano di controllo al minimo. In gran parte delega al piano di controllo in
  cluster di kubernetes ogni volta che può. Anche la progettazione e l'implementazione sbagliano
  dal lato della sicurezza ed evitare l'interruzione del multi-cluster.
* Maturità: il progetto di federazione è relativamente nuovo e non è molto maturo.
  Non tutte le risorse sono disponibili e molte sono ancora alfa. [Problema
  88](https://github.com/kubernetes/federation/issues/88) enumera
  problemi noti con il sistema che il team è impegnato a risolvere.

### Hybrid cloud capabilities

le federation di Kubernetes Clusters possono includere cluster in esecuzione
diversi fornitori di servizi cloud (ad esempio Google Cloud, AWS) e locali
(ad esempio su OpenStack). [Kubefed](https://kubernetes.io/docs/tasks/federation/set-up-cluster-federation-kubefed/) è il metodo consigliato per la distribuzione di cluster federati.

Successivamente, le [risorse API](#api-risorse) possono estendersi su diversi cluster
e fornitori di cloud.

## Setting up federation

Per poter federare più cluster, è necessario prima impostare una federazione
piano di controllo.
Seguire la [guida di installazione](/docs/tutorial/federazione/set-up-cluster-federation-kubefed/) per configurare il
piano di controllo della federazione.

## API resources

Una volta impostato il piano di controllo, è possibile iniziare a creare l'API di federazione
risorse.
Le seguenti guide illustrano alcune delle risorse in dettaglio:

* [Cluster](/docs/tasks/administer-federation/cluster/)
* [ConfigMap](/docs/tasks/administer-federation/configmap/)
* [DaemonSets](/docs/tasks/administer-federation/daemonset/)
* [Deployment](/docs/tasks/administer-federation/deployment/)
* [Events](/docs/tasks/administer-federation/events/)
* [Hpa](/docs/tasks/administer-federation/hpa/)
* [Ingress](/docs/tasks/administer-federation/ingress/)
* [Jobs](/docs/tasks/administer-federation/job/)
* [Namespaces](/docs/tasks/administer-federation/namespaces/)
* [ReplicaSets](/docs/tasks/administer-federation/replicaset/)
* [Secrets](/docs/tasks/administer-federation/secret/)
* [Services](/docs/concepts/cluster-administration/federation-service-discovery/)

I [documenti di riferimento API](/docs/reference/federation/) elencano tutti i
risorse supportate da apiserver della federazione.
## Cascading deletion

Kubernetes versione 1.6 include il supporto per l'eliminazione a cascata di federati
risorse. Con la cancellazione a cascata, quando si elimina una risorsa dal
piano di controllo della federazione, si eliminano anche le risorse corrispondenti in tutti i cluster sottostanti.

L'eliminazione a cascata non è abilitata per impostazione predefinita quando si utilizza l'API REST. Abilitare
it, imposta l'opzione `DeleteOptions.orphanDependents = false` quando elimini a
risorsa dal piano di controllo della federazione utilizzando l'API REST. Usando `kubectl
delete`
abilita la cancellazione a cascata per impostazione predefinita. Puoi disabilitarlo eseguendo `kubectl
cancella --cascade = false`

Nota: la versione 1.5 di Kubernetes includeva il supporto per l'eliminazione a cascata di un sottoinsieme di
risorse federative.

## Ambito di un singolo cluster

Sui provider IaaS come Google Compute Engine o Amazon Web Services, esiste una VM in a
[zona](https://cloud.google.com/compute/docs/zones) o [disponibilità
zona](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).
Suggeriamo che tutte le VM in un cluster Kubernetes debbano essere nella stessa zona di disponibilità, perché:

  - Rispetto ad un singolo cluster globale di Kubernetes, ci sono meno punti singoli di errore.
  - confrontato con un cluster che copre le zone di disponibilità, è più facile ragionare sulle proprietà di disponibilità di a
    cluster a zona singola.
  - quando gli sviluppatori di Kubernetes stanno progettando il sistema (ad esempio facendo ipotesi su latenza, larghezza di banda o
    errori correlati) si presuppone che tutte le macchine si trovino in un unico data center o comunque strettamente connesse.

Si consiglia di eseguire meno cluster con più VM per zona di disponibilità; ma è possibile eseguire più cluster per zone di disponibilità.

I motivi per preferire un minor numero di cluster per zona di disponibilità sono:

  - Miglioramento del confezionamento dei contenitori in alcuni casi con più nodi in un cluster (minore frammentazione delle risorse).
  - riduzione delle spese generali operative (sebbene il vantaggio sia diminuito man mano che gli strumenti operativi e i processi maturano).
  - costi ridotti per i costi fissi delle risorse per gruppo, ad es. VM di apiserver (ma piccole in percentuale
    del costo complessivo del cluster per cluster di dimensioni medio-grandi).

I motivi per avere più cluster includono:

  - rigide politiche di sicurezza che richiedono l'isolamento di una classe di lavoro da un'altra (ma, vedi Partizionare Cluster
    sotto).
  - testare i cluster su nuove versioni di Kubernetes o su altri software cluster.

## Selezione del numero corretto di cluster

La selezione del numero di cluster di Kubernetes può essere una scelta relativamente statica, rivisitata solo occasionalmente.
Al contrario, il numero di nodi in un cluster e il numero di pod in un servizio possono variare di frequente in base a
carico e crescita.

Per scegliere il numero di cluster, in primo luogo, decidere in quali regioni è necessario avere una latenza adeguata per tutti gli utenti finali, per i servizi che verranno eseguiti
su Kubernetes (se si utilizza una rete di distribuzione di contenuti, i requisiti di latenza per i contenuti ospitati da CDN non sono necessari
essere considerato). Questioni legali potrebbero influenzare anche questo. Ad esempio, un'azienda con una base clienti globale potrebbe decidere di avere cluster nelle regioni USA, UE, AP e SA.
Chiama il numero di regioni in "R".

In secondo luogo, decidi quanti cluster dovrebbero essere disponibili allo stesso tempo, pur essendo disponibili. Chiamata
il numero che può essere non disponibile `U`. Se non sei sicuro, allora 1 è una buona scelta.

Se è possibile bilanciare il carico per indirizzare il traffico verso qualsiasi regione in caso di guasto di un cluster, allora
avete bisogno almeno dei grossi `R` o` U + 1`. Se non lo è (ad esempio, vuoi garantire una bassa latenza per tutti
utenti in caso di guasto di un cluster), quindi è necessario disporre di cluster `R * (U + 1)`
(`U + 1` in ciascuna delle regioni` R`). In ogni caso, prova a mettere ciascun cluster in una zona diversa.

Infine, se uno qualsiasi dei tuoi cluster richiederebbe più del numero massimo consigliato di nodi per un cluster Kubernetes, allora
potresti aver bisogno di più cluster. Kubernetes v1.3 supporta cluster di dimensioni fino a 1000 nodi. Supporta Kubernetes v1.8
cluster fino a 5000 nodi. Vedi [Costruire cluster di grandi dimensioni](/docs/setup/cluster-large/) per maggiori informazioni.

{{% /capture %}}

{{% capture whatsnext %}}
* Ulteriori informazioni sulla [Federazione proposta](https://github.com/kubernetes/community/blob/{{<param "githubbranch">}}/contributors/design-proposal/multicluster/federation.md).
* Vedi questo [guida alla configurazione](/docs/tutorial/federazione/set-up-cluster-federation-kubefed/) per la federazione dei cluster.
* Vedi questo [Kubecon2016 talk on federation](https://www.youtube.com/watch?v=pq9lbkmxpS8)
* Vedi questo [Kubecon2017 aggiornamento Europa sulla federazione](https://www.youtube.com/watch?v=kwOvOLnFYck)
* Vedi questo [Kubecon2018 aggiornamento Europa su sig-multicluster](https://www.youtube.com/watch?v=vGZo5DaThQU)
* Vedi questo [Kubecon2018 Europe Federation-v2 presentazione prototipo](https://youtu.be/q27rbaX5Jis?t=7m20s)
* Vedi questo [Federation-v2 Userguide](https://github.com/kubernetes-sigs/federation-v2/blob/master/docs/userguide.md)
{{% /capture %}}
