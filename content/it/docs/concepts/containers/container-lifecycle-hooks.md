---
title: Container Lifecycle Hooks
content_type: concept
weight: 30
---

<!-- overview -->
Questa pagina descrive come i Container gestiti con kubelet possono utilizzare il lifecycle
hook framework dei Container per l'esecuzione di codice eseguito in corrispondenza di alcuni
eventi durante il loro ciclo di vita.

<!-- body -->

## Overview

Analogamente a molti framework di linguaggi di programmazione che hanno degli hooks legati al ciclo di
vita dei componenti, come ad esempio Angular, Kubernetes fornisce ai Container degli hook legati al loro ciclo di
vita dei Container.
Gli hook consentono ai Container di essere consapevoli degli eventi durante il loro ciclo di
gestione ed eseguire del codice implementato in un handler quando il corrispondente hook viene
eseguito.

## Container hooks

Esistono due tipi di hook che vengono esposti ai Container:

`PostStart`

Questo hook viene eseguito successivamente alla creazione del container.
Tuttavia, non vi è garanzia che questo hook venga eseguito prima dell'ENTRYPOINT del container.
Non vengono passati parametri all'handler.

`PreStop`

Questo hook viene eseguito prima della terminazione di un container a causa di una richiesta API o
di un evento di gestione, come ad esempio un fallimento delle sonde di liveness/startup, preemption, 
risorse contese e altro. Una chiamata all'hook di `PreStop` fallisce se il container è in stato
terminated o completed e l'hook deve finire prima che possa essere inviato il segnale di TERM per
fermare il container. Il conto alla rovescia per la terminazione del Pod (grace period) inizia prima dell'esecuzione
dell'hook `PreStop`, quindi indipendentemente dall'esito dell'handler, il container terminerà entro
il grace period impostato. Non vengono passati parametri all'handler.

Una descrizione più dettagliata riguardante al processo di terminazione dei Pod può essere trovata in
[Terminazione dei Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### Implementazione degli hook handler

I Container possono accedere a un hook implementando e registrando un handler per tale hook.
Ci sono due tipi di handler che possono essere implementati per i Container:

* Exec - Esegue un comando specifico, tipo `pre-stop.sh`, all'interno dei cgroup e namespace del Container.
Le risorse consumate dal comando vengono contate sul Container.
* HTTP - Esegue una richiesta HTTP verso un endpoint specifico del Container.

### Esecuzione dell'hook handler

Quando viene richiamato l'hook legato al lifecycle del Container, il sistema di gestione di Kubernetes
esegue l'handler secondo l'azione dell'hook, `httpGet` e `tcpSocket` vengono eseguiti dal processo kubelet,
mentre `exec` è eseguito nel Container.

Le chiamate agli handler degli hook sono sincrone rispetto al contesto del Pod che contiene il Container.
Questo significa che per un hook `PostStart`, l'ENTRYPOINT e l'hook si attivano in modo asincrono.
Tuttavia, se l'hook impiega troppo tempo per essere eseguito o si blocca, il container non può raggiungere lo
stato di `running`.

Gli hook di `PreStop` non vengono eseguiti in modo asincrono dall'evento di stop del container; l'hook
deve completare la sua esecuzione prima che l'evento TERM possa essere inviato. Se un hook di `PreStop`
si blocca durante la sua esecuzione, la fase del Pod rimarrà `Terminating` finchè il Pod non sarà rimosso forzatamente
dopo la scadenza del suo `terminationGracePeriodSeconds`. Questo grace period si applica al tempo totale
necessario per effettuare sia l'esecuzione dell'hook di `PreStop` che per l'arresto normale del container.
Se, per esempio, il `terminationGracePeriodSeconds` è di 60, e l'hook impiega 55 secondi per essere completato,
e il container impiega 10 secondi per fermarsi normalmente dopo aver ricevuto il segnale, allora il container
verrà terminato prima di poter completare il suo arresto, poiché `terminationGracePeriodSeconds` è inferiore al tempo
totale (55+10) necessario perché queste due cose accadano.

Se un hook `PostStart` o `PreStop` fallisce, allora il container viene terminato.

Gli utenti dovrebbero mantenere i loro handler degli hook i più leggeri possibili.
Ci sono casi, tuttavia, in cui i comandi di lunga durata hanno senso,
come il salvataggio dello stato del container prima della sua fine.

### Garanzia della chiamata dell'hook

La chiamata degli hook avviene *almeno una volta*, il che significa
che un hook può essere chiamato più volte da un dato evento, come per `PostStart`
o `PreStop`.
Sta all'implementazione dell'hook gestire correttamente questo aspetto.

Generalmente, vengono effettuate singole chiamate agli hook.
Se, per esempio, la destinazione di hook HTTP non è momentaneamente in grado di ricevere traffico,
non c'è alcun tentativo di re invio.
In alcuni rari casi, tuttavia, può verificarsi una doppia chiamata.
Per esempio, se un kubelet si riavvia nel mentre dell'invio di un hook, questo potrebbe essere
chiamato per una seconda volta dopo che il kubelet è tornato in funzione.

### Debugging Hook handlers

I log di un handler di hook non sono esposti negli eventi del Pod.
Se un handler fallisce per qualche ragione, trasmette un evento.
Per il `PostStart`, questo è l'evento di `FailedPostStartHook`, 
e per il `PreStop`, questo è l'evento di `FailedPreStopHook`.
Puoi vedere questi eventi eseguendo `kubectl describe pod <pod_name>`.
Ecco alcuni esempi di output di eventi dall'esecuzione di questo comando:

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubObjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```



## {{% heading "whatsnext" %}}


* Approfondisci [Container environment](/docs/concepts/containers/container-environment/).
* Esegui un tutorial su come
  [definire degli handlers per i Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

