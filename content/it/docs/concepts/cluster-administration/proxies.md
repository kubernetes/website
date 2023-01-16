---
title: Proxy in Kubernetes
content_type: concept
weight: 90
---

<!-- overview -->
Questa pagina spiega i proxy utilizzati con Kubernetes.


<!-- body -->

## Proxy

Esistono diversi proxy che puoi incontrare quando usi Kubernetes:

1.  Il [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#direct-accessing-the-rest-api):

    - viene eseguito sul computer di un utente o in un pod
    - collega un localhost address all'apiserver di Kubernetes
    - il client comunica con il proxy in HTTP
    - il proxy comunica con l'apiserver in HTTPS
    - individua l'apiserver
    - aggiunge gli header di autenticazione

1.  L'[apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - è un proxy presente nell'apiserver
    - collega un utente al di fuori del cluster agli IP del cluster che altrimenti potrebbero non essere raggiungibili
    - è uno dei processi dell'apiserver
    - il client comunica con il proxy in HTTPS (o HTTP se l'apiserver è configurato in tal modo)
    - il proxy comunica con il target via HTTP o HTTPS come scelto dal proxy utilizzando le informazioni disponibili
    - può essere utilizzato per raggiungere un nodo, un pod o un servizio
    - esegue il bilanciamento del carico quando viene utilizzato per raggiungere un servizio

1.  Il [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - è eseguito su ciascun nodo
    - fa da proxy per comunicazioni UDP, TCP e SCTP
    - non gestisce il protocollo HTTP
    - esegue il bilanciamento del carico
    - è usato solo per raggiungere i servizi

1.  Un proxy/bilanciatore di carico di fronte agli apiserver:

    - la sua esistenza e implementazione variano da cluster a cluster (ad esempio nginx)
    - si trova tra i client e uno o più apiserver
    - funge da bilanciatore di carico se ci sono più di un apiserver.

1.  Cloud Load Balancer su servizi esterni:

    - sono forniti da alcuni fornitori di servizi cloud (ad es. AWS ELB, Google Cloud Load Balancer)
    - vengono creati automaticamente quando il servizio Kubernetes ha tipo `LoadBalancer`
    - solitamente supporta solo UDP / TCP
    - il supporto SCTP dipende dall'implementazione del bilanciatore di carico del provider cloud
    - l'implementazione varia a seconda del provider cloud.

Gli utenti di Kubernetes in genere non devono preoccuparsi alcun proxy, se non i primi due tipi. L'amministratore del cluster
in genere assicurerà che gli altri tipi di proxy siano impostati correttamente.

## Richiedere reindirizzamenti

I proxy hanno sostituito le funzioni di reindirizzamento. I reindirizzamenti sono stati deprecati.




