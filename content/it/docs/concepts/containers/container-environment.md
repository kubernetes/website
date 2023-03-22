---
title: Container Environment
content_type: concept
weight: 20
---

<!-- overview -->

Questa pagina descrive le risorse disponibili nei Container eseguiti in Kubernetes.

<!-- body -->

## Container environment

Quando si esegue un Container in Kubernetes, le seguenti risorse sono rese disponibili:

* Un filesystem, composto dal file system dell'[image](/docs/concepts/containers/images/) e da uno o più [volumes](/docs/concepts/storage/volumes/).
* Una serie di informazioni sul Container stesso.
* Una serie di informazioni sugli oggetti nel cluster.

### Informazioni sul Container

L' *hostname* di un Container è il nome del Pod all'interno del quale è eseguito il Container.
È consultabile tramite il comando `hostname` o tramite la funzione
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
disponibile in libc.

Il nome del Pod e il namespace possono essere resi disponibili come environment variables attraverso l'uso
delle [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Gli utenti possono aggiungere altre environment variables nella definizione del Pod; anche queste
saranno disponibili nel Container come tutte le altre environment variables definite staticamente nella
Docker image.

### Informazioni sul cluster

Al momento della creazione del Container è generata una serie di environment variables con la lista di servizi in esecuzione nel cluster.
Queste environment variables rispettano la sintassi dei Docker links.

Per un servizio chiamato *foo* che è in esecuzione in un Container di nome *bar*,
le seguenti variabili sono generate:

```shell
FOO_SERVICE_HOST=<host su cui il servizio è attivo>
FOO_SERVICE_PORT=<porta su cui il servizio è pubblicato>
```

I servizi hanno un indirizzo IP dedicato e sono disponibili nei Container anche via DNS
se il [DNS addon](http://releases.k8s.io/master/cluster/addons/dns/) è installato nel cluster.

## {{% heading "whatsnext" %}}

* Approfondisci [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Esegui un tutorial su come
  [definire degli handlers per i Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
