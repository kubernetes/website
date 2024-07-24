---
title: Cycle de vie d'un Pod
content_type: concept
weight: 30
---

<!-- overview -->

Cette page décrit le cycle de vie d'un Pod.




<!-- body -->

## Phase du Pod

Le champ `status` d'un Pod est un objet
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core),
contenant un champ `phase`.

La phase d'un Pod est un résumé simple et de haut niveau de l'étape à laquelle le Pod se trouve
dans son cycle de vie.
La phase n'est pas faite pour être un cumul complet d'observations de l'état
du conteneur ou du Pod, ni pour être une machine à état compréhensible.

Le nombre et la signification des valeurs de phase d'un pod sont soigneusement gardés.
Hormis ce qui est documenté ici, rien ne doit être supposé sur des Pods
ayant une valeur de `phase` donnée.

Voici les valeurs possibles pour `phase` :

Valeur | Description
:-----|:-----------
`Pending` | Le Pod a été accepté par Kubernetes, mais une ou plusieurs images de conteneurs n'ont pas encore été créées. Ceci inclut le temps avant d'être affecté ainsi que le temps à télécharger les images à travers le réseau, ce qui peut prendre un certain temps.
`Running` | Le pod a été affecté à un nœud et tous les conteneurs ont été créés. Au moins un conteneur est toujours en cours d'exécution, ou est en train de démarrer ou redémarrer.
`Succeeded` | Tous les conteneurs du pod ont terminé avec succès et ne seront pas redémarrés.
`Failed` | Tous les conteneurs d'un pod ont terminé, et au moins un conteneur a terminé en échec : soit le conteneur a terminé avec un status non zéro, soit il a été arrêté par le système.
`Unknown` | Pour quelque raison l'état du pod ne peut pas être obtenu, en général en cas d'erreur de communication avec l'hôte du Pod.

## Conditions du Pod

Un Pod a un PodStatus, qui contient un tableau de
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
à travers lesquelles le Pod est ou non passé. Chaque élément
du tableau de PodCondition a six champs possibles :

* Le champ `lastProbeTime` fournit un timestamp auquel la condition du Pod
 a été sondée pour la dernière fois.

* Le champ `lastTransitionTime` fournit un timestamp auquel le Pod a changé de statut
  pour la dernière fois.

* Le champ `message` est un message lisible indiquant les détails de la transition.

* Le champ `reason` est une raison unique, en un seul mot et en CamelCase de la transition
  vers la dernière condition.

* Le champ `status` est une chaîne de caractères  avec les valeurs possibles "`True`", "`False`", et "`Unknown`".

* Le champ `type` est une chaîne de caractères ayant une des valeurs suivantes :

  * `PodScheduled` : le Pod a été affecté à un nœud ;
  * `Ready` : le Pod est prêt à servir des requêtes et doit être rajouté aux équilibreurs
    de charge de tous les Services correspondants ;
  * `Initialized` : tous les [init containers](/fr/docs/concepts/workloads/pods/init-containers)
    ont démarré correctement ;
  * `ContainersReady` : tous les conteneurs du Pod sont prêts.



## Sondes du Conteneur

Une [Sonde](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) (Probe) est un diagnostic
exécuté périodiquement par [kubelet](/docs/admin/kubelet/)
sur un Conteneur. Pour exécuter un diagnostic, kubelet appelle un
[Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) implémenté par
le Conteneur. Il existe trois types de handlers :

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core):
  Exécute la commande spécifiée à l'intérieur du Conteneur. Le diagnostic
  est considéré réussi si la commande se termine avec un code de retour de 0.

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core):
  Exécute un contrôle TCP sur l'adresse IP du Conteneur et sur un port spécifié.
  Le diagnostic est considéré réussi si le port est ouvert.

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core):
  Exécute une requête HTTP Get sur l'adresse IP du Conteneur et sur un port et
  un chemin spécifiés. Le diagnostic est considéré réussi si la réponse a un code
  de retour supérieur ou égal à 200 et inférieur à 400.

Chaque sonde a un résultat parmi ces trois :

* Success: Le Conteneur a réussi le diagnostic.
* Failure: Le Conteneur a échoué au diagnostic.
* Unknown: L'exécution du diagnostic a échoué, et donc aucune action ne peut être prise.

kubelet peut optionnellement exécuter et réagir à trois types de sondes sur des conteneurs
en cours d'exécution :

* `livenessProbe` : Indique si le Conteneur est en cours d'exécution. Si
   la liveness probe échoue, kubelet tue le Conteneur et le Conteneur
   est soumis à sa [politique de redémarrage](#politique-de-redemarrage) (restart policy).
   Si un Conteneur ne fournit pas de liveness probe, l'état par défaut est `Success`.

* `readinessProbe` : Indique si le Conteneur est prêt à servir des requêtes.
   Si la readiness probe échoue, le contrôleur de points de terminaison (Endpoints)
   retire l'adresse IP du Pod des points de terminaison de tous les Services
   correspodant au Pod. L'état par défaut avant le délai initial est
   `Failure`. Si le Conteneur ne fournit pas de readiness probe, l'état par
   défaut est `Success`.

* `startupProbe`: Indique si l'application à l'intérieur du conteneur a démarré.
   Toutes les autres probes sont désactivées si une starup probe est fournie,
   jusqu'à ce qu'elle réponde avec succès. Si la startup probe échoue, le kubelet
   tue le conteneur, et le conteneur est assujetti à sa [politique de redémarrage](#politique-de-redemarrage).
   Si un conteneur ne fournit pas de startup probe, l'état par défaut est `Success`.

### Quand devez-vous utiliser une liveness probe ?

Si le process de votre Conteneur est capable de crasher de lui-même lorsqu'il
rencontre un problème ou devient inopérant, vous n'avez pas forcément besoin
d'une liveness probe ; kubelet va automatiquement exécuter l'action correcte
en accord avec la politique de redémarrage (`restartPolicy`) du Pod.

Si vous désirez que votre Conteneur soit tué et redémarré si une sonde échoue, alors
spécifiez une liveness probe et indiquez une valeur pour `restartPolicy` à Always
ou OnFailure.

### Quand devez-vous utiliser une readiness probe ?

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Si vous voulez commencer à envoyer du trafic à un Pod seulement lorsqu'une sonde
réussit, spécifiez une readiness probe. Dans ce cas, la readiness probe peut être
la même que la liveness probe, mais l'existence de la readiness probe dans la spec
veut dire que le Pod va démarrer sans recevoir aucun trafic et va commencer
à recevoir du trafic après que la sonde réussisse.
Si votre Conteneur doit charger une grande quantité de données, des fichiers de
configuration ou exécuter des migrations au démarrage, spécifiez une readiness probe.

Si vous désirez que le Conteneur soit capable de se mettre en maintenance tout seul, vous
pouvez spécifier une readiness probe qui vérifie un point de terminaison spécifique au
readiness et différent de la liveness probe.

Notez que si vous voulez uniquement être capable de dérouter les requêtes lorsque
le Pod est supprimé, vous n'avez pas forcément besoin d'une readiness probe; lors
de sa suppression, le Pod se met automatiquement dans un état non prêt, que la
readiness probe existe ou non.
Le Pod reste dans le statut non prêt le temps que les Conteneurs du Pod s'arrêtent.

### Quand devez-vous utiliser une startup probe ?

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Si votre conteneur démarre habituellement en plus de `initialDelaySeconds + failureThreshold × periodSeconds`, 
vous devriez spécifier une startup probe qui vérifie le même point de terminaison que la liveness probe. La valeur par défaut pour `periodSeconds` est 30s.
Vous devriez alors mettre sa valeur `failureThreshold` suffisamment haute pour permettre au conteneur de démarrer, sans changer les valeurs par défaut de la liveness probe. Ceci aide à se protéger de deadlocks.

Pour plus d'informations sur la manière de mettre en place une liveness, readiness ou startup probe,
voir [Configurer des Liveness, Readiness et Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## Statut d'un Pod et d'un Conteneur

Pour des informations détaillées sur le statut d'un Pod et d'un Conteneur, voir
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
et
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core).
Notez que l'information rapportée comme statut d'un Pod dépend du
[ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core) actuel.

## États d'un Conteneur

Une fois que le Pod est assigné à un nœud par le scheduler, kubelet commence
à créer les conteneurs en utilisant le runtime de conteneurs. Il existe trois états possibles
pour les conteneurs : en attente (Waiting), en cours d'exécution (Running) et terminé (Terminated). Pour vérifier l'état d'un conteneur, vous pouvez utiliser `kubectl describe pod [POD_NAME]`. L'état est affiché pour chaque conteneur du Pod.

* `Waiting` : état du conteneur par défaut. Si le conteneur n'est pas dans un état Running ou Terminated, il est dans l'état Waiting. Un conteneur dans l'état Waiting exécute
les opérations nécessaires, comme télécharger les images, appliquer des Secrets, etc. À côté
de cet état, un message et une raison sur l'état sont affichés pour vous fournir plus
d'informations.

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
   ...
   ```

* `Running` : Indique que le conteneur s'exécute sans problème. Le hook `postStart` (s'il existe) est exécuté avant que le conteneur entre dans l'état Running. Cet état affiche aussi le moment auquel le conteneur est entré dans l'état Running.

   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```

* `Terminated`:  Indique que le conteneur a terminé son exécution et s'est arrêté.
Un conteneur entre dans cet état lorsqu'il s'est exécuté avec succès ou lorsqu'il a
échoué pour une raison quelconque. De plus, une raison et un code de retour sont affichés,
ainsi que les moments de démarrage et d'arrêt du conteneur. Avant qu'un conteneur entre
dans l'état Terminated, le hook `preStop` est exécuté (s'il existe).

   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ```

## Pod readiness {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Votre application peut injecter des données dans `PodStatus`.

_Pod readiness_. Pour utiliser cette fonctionnalité, remplissez `readinessGates` dans le PodSpec avec
une liste de conditions supplémentaires que le kubelet évalue pour la disponibilité du Pod.

Les Readiness gates sont déterminées par l'état courant des champs `status.condition` du Pod.
Si Kubernetes ne peut pas trouver une telle condition dans le champs `status.conditions` d'un Pod, the statut de la condition
est mise par défaut à "`False`".

Voici un exemple :

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready  # une PodCondition intégrée
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"   # une PodCondition supplémentaire
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Les conditions du Pod que vous ajoutez doivent avoir des noms qui sont conformes au [format des étiquettes](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) de Kubernetes.

### Statut de la disponibilité d'un Pod {#statut-pod-disponibilité}

La commande `kubectl patch` ne peut pas patcher le statut d'un objet.
Pour renseigner ces `status.conditions` pour le pod, les applications et
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} doivent utiliser l'action `PATCH`.
Vous pouvez utiliser une [bibliothèque client Kubernetes](/docs/reference/using-api/client-libraries/) pour
écrire du code qui renseigne les conditions particulières pour la disponibilité dun Pod.

Pour un Pod utilisant des conditions particulières, ce Pod est considéré prêt **seulement**
lorsque les deux déclarations ci-dessous sont vraies :

* Tous les conteneurs du Pod sont prêts.
* Toutes les conditions spécifiées dans `ReadinessGates` sont `True`.

Lorsque les conteneurs d'un Pod sont prêts mais qu'au moins une condition particulière
est manquante ou `False`, le kubelet renseigne la condition du Pod à `ContainersReady`.

## Politique de redémarrage

La structure PodSpec a un champ `restartPolicy` avec comme valeur possible
Always, OnFailure et Never. La valeur par défaut est Always.
`restartPolicy` s'applique à tous les Conteneurs du Pod. `restartPolicy` s'applique
seulement aux redémarrages des Conteneurs par kubelet sur le même nœud. Des conteneurs
terminés qui sont redémarrés par kubelet sont redémarrés avec un délai exponentiel
(10s, 20s, 40s ...) plafonné à cinq minutes, qui est réinitialisé après dix minutes
d'exécution normale. Comme discuté dans le
[document sur les Pods](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof),
une fois attaché à un nœud, un Pod ne sera jamais rattaché à un autre nœud.

## Durée de vie d'un Pod

En général, les Pods restent jusqu'à ce qu'un humain ou un process de
{{< glossary_tooltip term_id="controller" text="contrôleur" >}} les supprime explicitement.

Le plan de contrôle nettoie les Pods terminés (avec une phase à `Succeeded` ou
`Failed`), lorsque le nombre de Pods excède le seuil configuré
(determiné par `terminated-pod-gc-threshold` dans le kube-controller-manager).
Ceci empêche une fuite de ressources lorsque les Pods sont créés et supprimés au fil du temps.

Il y a différents types de ressources pour créer des Pods :

- Utilisez un {{< glossary_tooltip term_id="deployment" >}},
  {{< glossary_tooltip term_id="replica-set" >}} ou {{< glossary_tooltip term_id="statefulset" >}}
  pour les Pods qui ne sont pas censés terminer, par exemple des serveurs web.

- Utilisez un {{< glossary_tooltip term_id="job" >}}
  pour les Pods qui sont censés se terminer une fois leur tâche accomplie. Les Jobs sont appropriés
seulement pour des Pods ayant `restartPolicy` égal à OnFailure ou Never.

- Utilisez un {{< glossary_tooltip term_id="daemonset" >}}
  pour les Pods qui doivent s'exécuter sur chaque noeud éligible.

Toutes les ressources de charges de travail contiennent une PodSpec. Il est recommandé de créer
la ressource de charges de travail appropriée et laisser le contrôleur de la ressource créer les Pods
pour vous, plutôt que de créer directement les Pods vous-même.

Si un nœud meurt ou est déconnecté du reste du cluster, Kubernetes applique
une politique pour mettre la `phase` de tous les Pods du nœud perdu à Failed.

## Exemples

### Exemple avancé de liveness probe

Les Liveness probes sont exécutées par kubelet, toutes les requêtes sont donc faites
dans l'espace réseau de kubelet.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - liveness
    image: registry.k8s.io/e2e-test-images/agnhost:2.40
    livenessProbe:
      httpGet:
        # lorsque "host" n'est pas défini, "PodIP" sera utilisé
        # host: my-host
        # lorsque "scheme" n'est pas défini, "HTTP" sera utilisé. "HTTP" et "HTTPS" sont les seules valeurs possibles
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

### Exemples d'états

   * Un Pod est en cours d'exécution et a un Conteneur. Le conteneur se termine avec succès.
     * Écriture d'un événement de complétion.
     * Si `restartPolicy` est :
       * Always : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * OnFailure : la `phase` du Pod passe à Succeeded.
       * Never : la `phase` du Pod passe à Succeeded.

   * Un Pod est en cours d'exécution et a un Conteneur. Le conteneur se termine en erreur.
     * Écriture d'un événement d'échec.
     * Si `restartPolicy` est :
       * Always : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * OnFailure : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * Never : la `phase` du Pod passe à Failed.

   * Un Pod est en cours d'exécution et a deux Conteneurs. Le conteneur 1 termine en erreur.
     * Écriture d'un événement d'échec.
     * Si `restartPolicy` est :
       * Always : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * OnFailure : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * Never : Le Conteneur n'est pas redémarré ; la `phase` du Pod reste à Running.
     * Si Container 1 est arrêté, et Conteneur 2 se termine :
       * Écriture d'un événement d'échec.
       * Si `restartPolicy` est :
         * Always : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
         * OnFailure : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
         * Never : la `phase` du Pod passe à Failed.

   * Un Pod est en cours d'exécution et a un Conteneur. Le Conteneur n'a plus assez de mémoire.
     * Le Conteneur se termine en erreur.
     * Écriture d'un événement OOM.
     * Si `restartPolicy` est :
       * Always : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * OnFailure : Redémarrage du Conteneur ; la `phase` du Pod reste à Running.
       * Never : Écriture d'un événement d'erreur ; la `phase` du Pod passe à Failed.

   * Le Pod est en cours d'exécution, et un disque meurt.
     * Tous les conteneurs sont tués.
     * Écriture d'un événement approprié.
     * La `phase` du Pod devient Failed.
     * Si le Pod s'exécute sous un contrôleur, le Pod est recréé ailleurs.

   * Le Pod est en cours d'exécution et son nœud est segmenté.
     * Le contrôleur de Nœud attend un certain temps.
     * Le contrôleur de Nœud passe la `phase` du Pod à Failed.
     * Si le Pod s'exécute sous un contrôleur, le Pod est recréé ailleurs.




## {{% heading "whatsnext" %}}


* Apprenez par la pratique
  [attacher des handlers à des événements de cycle de vie d'un conteneur](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Apprenez par la pratique
  [configurer des liveness, readiness et startup probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* En apprendre plus sur les [hooks de cycle de vie d'un Conteneur](/docs/concepts/containers/container-lifecycle-hooks/).





