---
title: Le API di Kubernetes
description: >
  Le API di Kubernetes ti permettono di interrogare e manipolare lo stato degli oggetti in Kubernetes. Il cuore del Control Plane di Kubernetes è l'API server e le API HTTP che esso espone. Ogni entità o componente che si interfaccia con il cluster (gli utenti, le singole parti del tuo cluster, i componenti esterni), comunica attraverso l'API server.
content_type: concept
weight: 30
card: 
  name: concepts
  weight: 20
---

<!-- overview -->

Le convenzioni generali seguite dalle API sono descritte in [API conventions doc](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

Gli *endpoints* delle API, la lista delle risorse esposte ed i relativi esempi sono descritti in [API Reference](/docs/reference).

L'accesso alle API da remoto è discusso in [Controllare l'accesso alle API](/docs/reference/access-authn-authz/controlling-access/).

Le API di Kubernetes servono anche come riferimento per lo schema dichiarativo della configurazione del sistema stesso. Il comando [kubectl](/docs/reference/kubectl/overview/) può essere usato per creare, aggiornare, cancellare ed ottenere le istanze delle risorse esposte attraverso le API.

Kubernetes assicura la persistenza del suo stato (al momento in [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)) usando la rappresentazione delle risorse implementata dalle API.

Kubernetes stesso è diviso in differenti componenti, i quali interagiscono tra loro attraverso le stesse API.




<!-- body -->

## Evoluzione delle API

In base alla nostra esperienza, ogni sistema di successo ha bisogno di evolvere ovvero deve estendersi aggiungendo funzionalità o modificare le esistenti per adattarle a nuovi casi d'uso. Le API di Kubernetes sono quindi destinate a cambiare e ad estendersi. In generale, ci si deve aspettare che nuove risorse vengano aggiunte di frequente cosi come nuovi campi possano altresì essere aggiunti a risorse esistenti. L'eliminazione di risorse o di campi devono seguire la [politica di deprecazione delle API](/docs/reference/using-api/deprecation-policy/).

In cosa consiste una modifica compatibile e come modificare le API è descritto dal [API change document](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md).

## Definizioni OpenAPI e Swagger

La documentazione completa e dettagliata delle API è fornita attraverso la specifica [OpenAPI](https://www.openapis.org/).

Dalla versione 1.10 di Kubernetes, l'API server di Kubernetes espone le specifiche OpenAPI attraverso il seguente *endpoint* `/openapi/v2`. Attraverso i seguenti *headers* HTTP è possibile richiedere un formato specifico:

Header | Possibili Valori
------ | ---------------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (il content-type di default è `application/json` per `*/*` ovvero questo header può anche essere omesso)
Accept-Encoding | `gzip` (questo header è facoltativo)

Prima della versione 1.14, gli *endpoints* che includono il formato del nome all'interno del segmento (`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`)
espongo le specifiche OpenAPI in formati differenti. Questi *endpoints* sono deprecati, e saranno rimossi dalla versione 1.14 di Kubernetes.

**Esempi per ottenere le specifiche OpenAPI**:

Prima della 1.10 | Dalla versione 1.10 di Kubernetes
---------------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

Kubernetes implementa per le sue API anche una serializzazione alternativa basata sul formato Protobuf che è stato pensato principalmente per la comunicazione intra-cluster, documentato nella seguente [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md), e i files IDL per ciascun schema si trovano nei *Go packages* che definisco i tipi delle API.

Prima della versione 1.14, l'*apiserver* di Kubernetes espone anche un'*endpoint*, `/swaggerapi`, che può essere usato per ottenere
le documentazione per le API di Kubernetes secondo le specifiche [Swagger v1.2](http://swagger.io/) .
Questo *endpoint* è deprecato, ed è stato rimosso nella versione 1.14 di Kubernetes.

## Versionamento delle API

Per facilitare l'eliminazione di campi specifici o la modifica della rappresentazione di una data risorsa, Kubernetes supporta molteplici versioni della stessa API disponibili attraverso differenti indirizzi, come ad esempio `/api/v1` oppure
`/apis/extensions/v1beta1`.

Abbiamo deciso di versionare a livello di API piuttosto che a livello di risorsa o di campo per assicurare che una data API rappresenti una chiara, consistente vista delle risorse di sistema e dei sui comportamenti, e per abilitare un controllo degli accessi sia per le API in via di decommissionamento che per quelle sperimentali.

Si noti che il versionamento delle API ed il versionamento del Software sono indirettamente collegati. La [API and release versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) descrive la relazione tra le versioni delle API ed le versioni del Software.

Differenti versioni delle API implicano differenti livelli di stabilità e supporto.  I criteri per ciascuno livello sono descritti in dettaglio nella [API Changes documentation](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions). Queste modifiche sono qui ricapitolate:

- Livello alpha:
  - Il nome di versione contiene `alpha` (e.g. `v1alpha1`).
  - Potrebbe contenere dei *bug*. Abilitare questa funzionalità potrebbe esporre al rischio di *bugs*. Disabilitata di default.
  - Il supporto di questa funzionalità potrebbe essere rimosso in ogni momento senza previa notifica.
  - Questa API potrebbe cambiare in modo incompatibile in rilasci futuri del Software e senza previa notifica.
  - Se ne raccomandata l'utilizzo solo in *clusters* di test creati per un breve periodo di vita, a causa di potenziali *bugs* e delle mancanza di un supporto di lungo periodo.
- Livello beta:
  - Il nome di versione contiene `beta` (e.g. `v2beta3`).
  - Il codice è propriamente testato. Abilitare la funzionalità è considerato sicuro. Abilitata di default.
  - Il supporto per la funzionalità nel suo complesso non sarà rimosso, tuttavia potrebbe subire delle modifiche.
  - Lo schema e/o la semantica delle risorse potrebbe cambiare in modo incompatibile in successivi rilasci beta o stabili. Nel caso questo dovesse verificarsi, verrano fornite istruzioni per la migrazione alla versione successiva. Questo potrebbe richiedere la cancellazione, modifica, e la ri-creazione degli oggetti supportati da questa API. Questo processo di modifica potrebbe richiedere delle valutazioni. La modifica potrebbe richiedere un periodo di non disponibilità dell'applicazione che utilizza questa funzionalità.
  - Raccomandata solo per applicazioni non critiche per la vostra impresa a causa dei potenziali cambiamenti incompatibili in rilasci successivi. Se avete più *clusters* che possono essere aggiornati separatamente, potreste essere in grado di gestire meglio questa limitazione.
  - **Per favore utilizzate le nostre versioni beta e forniteci riscontri relativamente ad esse! Una volta promosse a stabili, potrebbe non essere semplice apportare cambiamenti successivi.**
- Livello stabile:
  - Il nome di versione è `vX` dove `X` è un intero.
  - Le funzionalità relative alle versioni stabili continueranno ad essere presenti per parecchie versioni successive.

## API groups

Per facilitare l'estendibilità delle API di Kubernetes, sono stati implementati gli [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).  
L'*API group* è specificato nel percorso REST ed anche nel campo `apiVersion` di un oggetto serializzato.

Al momento ci sono diversi *API groups* in uso:

1. Il gruppo *core*, spesso referenziato come il *legacy group*, è disponibile al percorso REST `/api/v1` ed utilizza `apiVersion: v1`.

1. I gruppi basati su un nome specifico sono disponibili attraverso il percorso REST `/apis/$GROUP_NAME/$VERSION`, ed usano `apiVersion: $GROUP_NAME/$VERSION` (e.g. `apiVersion: batch/v1`). La lista completa degli *API groups* supportati e' descritta nel documento [Kubernetes API reference](/docs/reference/).

Vi sono due modi per supportati per estendere le API attraverso le [*custom resources*](/docs/concepts/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   è pensato per utenti con esigenze CRUD basilari.
1. Utenti che necessitano di un nuovo completo set di API che utilizzi appieno la semantica di Kubernetes possono implementare il loro *apiserver* ed utilizzare l'[*aggregator*](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)
   per fornire ai propri utilizzatori la stessa esperienza a cui sono abituati con le API incluse nativamente in Kubernetes.


## Abilitare o disabilitare gli *API groups*

Alcune risorse ed *API groups* sono abilitati di default. Questi posso essere abilitati o disabilitati attraverso il settaggio/flag `--runtime-config`
applicato sull'*apiserver*. `--runtime-config` accetta valori separati da virgola. Per esempio: per disabilitare `batch/v1`, usa la seguente configurazione `--runtime-config=batch/v1=false`, per abilitare `batch/v2alpha1`, utilizzate `--runtime-config=batch/v2alpha1`.  
Il *flag* accetta set di coppie *chiave/valore* separati da virgola che descrivono la configurazione a *runtime* dell'*apiserver*.

{{< note >}}Abilitare o disabilitare risorse o gruppi richiede il riavvio dell'*apiserver* e del *controller-manager* affinché le modifiche specificate attraverso il flag `--runtime-config` abbiano effetto.{{< /note >}}

## Abilitare specifiche risorse nel gruppo extensions/v1beta1

DaemonSets, Deployments, StatefulSet, NetworkPolicies, PodSecurityPolicies e ReplicaSets presenti nel gruppo di API `extensions/v1beta1` sono disabilitate di default.
Per esempio: per abilitare deployments and daemonsets, utilizza la seguente configurazione
`--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true`.

{{< note >}}Abilitare/disabilitare una singola risorsa è supportato solo per il gruppo di API `extensions/v1beta1` per ragioni storiche.{{< /note >}}


