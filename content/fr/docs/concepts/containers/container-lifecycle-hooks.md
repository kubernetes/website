---
reviewers:
title: Hooks de cycle de vie de conteneurs
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Cette page décrit comment un conteneur pris en charge par kubelet peut utiliser 
le framework de Hooks de cycle de vie de conteneurs pour exécuter du code déclenché par des
événements durant son cycle de vie.

{{% /capture %}}


{{% capture body %}}

## Aperçu

De manière similaire à quantité de frameworks de langages de programmation qui ont des hooks
de cycle de vie de composants, comme Angular, Kubernetes fournit aux conteneurs
des hooks de cycle de vie.
Les hooks permettent à un conteneur d'être au courant d'événements durant son cycle de vie
et d'exécuter du code implémenté dans un handler lorsque le hook de cycle de vie correspondant
est exécuté.

## Hooks de conteneurs

Il existe deux hooks exposés aux conteneurs :

`PostStart`

Ce hook s'exécute immédiatement après qu'un conteneur soit créé.
Cependant, il n'y a aucune garantie que le hook s'exécute avant l'ENTRYPOINT du conteneur.
Aucun paramètre n'est passé au handler.

`PreStop`

Ce hook est appelé immédiatement avant qu'un conteneur se termine, en raison d'un appel à l'API
ou d'un événement comme un échec de la liveness probe, un droit de préemption, un conflit de ressources ou autres.
Un appel au hook preStop échoue si le conteneur est déjà dans l'état terminé ou complété. 
Il est bloquant, ce qui veut dire qu'il est synchrone, et doit donc se terminer avant que l'appel pour supprimer le conteneur soit envoyé.
Aucun paramètre n'est passé au handler.

Une description plus précise du comportement de l'arrêt peut être trouvé dans
[Arrêt de Pods](/fr/docs/concepts/workloads/pods/pod/#arr%C3%AAt-de-pods).

### Implémentation d'un handler de hook

Les conteneurs peuvent accéder à un hook en implémentant et enregistrant un handler pour ce hook.
Il existe deux types de handlers de hook pouvant être implémentés pour des conteneurs :

* Exec - Exécute une commande donnée, comme `pre-stop.sh`, dans les cgroups et namespaces du conteneur.
Les ressources consommées par la commande sont comptabilisées pour le conteneur.
* HTTP - Exécute une requête HTTP sur un endpoint spécifique du conteneur.

### Exécution d'un handler de hook

Lorsqu'un hook de cycle de vie de conteneur est appelé, 
le système de gestion de Kubernetes exécute le handler dans le conteneur enregistré
pour ce hook.

Les appels aux handlers de hook sont synchrones dans le contexte du pod contenant le conteneur.
Ceci veut dire que pour un hook `PostStart`,
bien que l'ENTRYPOINT du conteneur et le hook soient lancés de manière asynchrone, si le hook prend trop de temps à s'exécuter ou se bloque, 
le conteneur ne peut pas atteindre l'état `running`.

Le comportement est similaire pour un hook `PreStop`.
Si le hook se bloque durant l'exécution, 
la phase du Pod reste en état `Terminating` et le hook est tué après `terminationGracePeriodSeconds` que le pod se termine.
Si un hook `PostStart` ou `PreStop` échoue,
le conteneur est tué.

Les utilisateurs doivent rendre leurs handlers de hook aussi légers que possible.
Il existe des cas, cependant, où de longues commandes ont un intérêt,
comme pour enregistrer un état avant de stopper un conteneur.

### Garanties de déclenchement d'un hook
La politique de déclenchement d'un hook est *au moins une fois*,
ce qui veut dire qu'un hook peut être déclenché plus d'une fois pour un événement donné,
comme `PostStart` ou `PreStop`.
Il appartient à l'implémentation du hook de prendre en compte correctement ce comportement.

En général, un seul déclenchement est fait.
Si, par exemple, un récepteur de hook HTTP est hors service et ne peut pas
prendre en charge du trafic, il n'y a aucune tentative de renvoi.
Dans quelques rares cas, cependant, un double envoi peut se produire.
Par exemple, si kubelet redémarre au milieu d'un déclenchement de hook,
le hook pourrait être re-déclenché après que kubelet redémarre.

### Débugger des handlers de hook

Les logs pour un handler de hook ne sont pas exposés dans les événements du Pod.
Si un handler échoue pour une raison particulière, il envoie un événement.
Pour `PostStart`, c'est l'événement `FailedPostStartHook` 
et pour `PreStop`, c'est l'événement `FailedPreStopHook`.
Vous pouvez voir ces événements en exécutant `kubectl describe pod <pod_name>`.
Voici un exemple d'affichage d'événements lors de l'exécution de cette commande :

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubobjectPath          Type      Reason               Message
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

{{% /capture %}}

{{% capture whatsnext %}}

* En savoir plus sur l'[Environnement d'un conteneur](/fr/docs/concepts/containers/container-environment-variables/).
* Entraînez-vous à 
  [attacher des handlers de conteneurs à des événements de cycle de vie](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{{% /capture %}}
