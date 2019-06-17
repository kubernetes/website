---
title: Proxy in Kubernetes
content_template: templates/concept
weight: 90
---

{{% capture overview %}}
Questa pagina spiega i proxy utilizzati con Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Proxies

Esistono diversi proxy che puoi incontrare quando usi Kubernetes:

1. Il [proxy kubectl](/docs/tasks/access-application-cluster/access-cluster/#direct-accessing-the-rest-api):

    - Funziona sul desktop di un utente o in un pod
    - proxy da un indirizzo localhost all'apiserver di Kubernetes
    - client per proxy utilizza HTTP
    - proxy per apiserver utilizza HTTPS
    - individua l'apiserver
    - Aggiunge le intestazioni di autenticazione

1. Il [proxy apiserver](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - è un bastione costruito nell'apiserver
    - collega un utente al di fuori del cluster agli IP del cluster che altrimenti potrebbero non essere raggiungibili
    - funziona nei processi di apiserver
    - client per proxy utilizza HTTPS (o http se apiserver configurato in tal modo)
    - proxy to target può utilizzare HTTP o HTTPS come scelto dal proxy utilizzando le informazioni disponibili
    - può essere utilizzato per raggiungere un nodo, un pod o un servizio
    - esegue il bilanciamento del carico quando viene utilizzato per raggiungere un servizio

1. Il [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - Funziona su ciascun nodo
    - proxy UDP, TCP e SCTP
    - non capisce l'HTTP
    - fornisce il bilanciamento del carico
    - è appena usato per raggiungere i servizi

1. Un proxy / bilanciamento del carico di fronte agli apiserver:

    - esistenza e implementazione variano da cluster a cluster (ad esempio nginx)
    - si trova tra tutti i client e uno o più apiserver
    - funge da bilanciamento del carico se ci sono diversi apiserver.

1. Cloud Load Balancer su servizi esterni:

    - sono forniti da alcuni fornitori di servizi cloud (ad es. AWS ELB, Google Cloud Load Balancer)
    - vengono creati automaticamente quando il servizio Kubernetes ha tipo "LoadBalancer"
    - Solitamente supporta solo UDP / TCP
    - Il supporto SCTP dipende dall'implementazione del servizio di bilanciamento del carico del provider cloud
    - l'implementazione varia a seconda del provider cloud.

Gli utenti di Kubernetes in genere non devono preoccuparsi di nulla di diverso dai primi due tipi. L'amministratore del cluster
in genere assicurerà che questi ultimi tipi siano impostati correttamente.

## Richiedere reindirizzamenti

I proxy hanno sostituito le capacità di reindirizzamento. I reindirizzamenti sono stati deprecati.

{{% /capture %}}


