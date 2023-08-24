---
title: Déploiements
feature:
  title: Déploiements et restaurations automatisés
  description: >
    Kubernetes déploie progressivement les modifications apportées à votre application ou à sa configuration, tout en surveillant l'intégrité de l'application pour vous assurer qu'elle ne tue pas toutes vos instances en même temps.
    En cas de problème, Kubernetes annulera le changement pour vous.
    Profitez d'un écosystème croissant de solutions de déploiement.

content_type: concept
weight: 30
---

<!-- overview -->

Un _Deployment_ (déploiement en français) fournit des mises à jour déclaratives pour [Pods](/fr/docs/concepts/workloads/pods/pod/) et [ReplicaSets](/fr/docs/concepts/workloads/controllers/replicaset/).

Vous décrivez un _état désiré_ dans un déploiement et le {{< glossary_tooltip term_id="controller" text="controlleur">}} déploiement change l'état réel à l'état souhaité à un rythme contrôlé.
Vous pouvez définir des Deployments pour créer de nouveaux ReplicaSets, ou pour supprimer des déploiements existants et adopter toutes leurs ressources avec de nouveaux déploiements.

{{< note >}}
Ne gérez pas les ReplicaSets appartenant à un Deployment.
Pensez à ouvrir un ticket dans le dépot Kubernetes principal si votre cas d'utilisation n'est pas traité ci-dessous.
{{< /note >}}



<!-- body -->

## Cas d'utilisation

Voici des cas d'utilisation typiques pour les déploiements:

* [Créer un déploiement pour déployer un ReplicaSet](#création-dun-déploiement).
  Le ReplicaSet crée des pods en arrière-plan.
  Vérifiez l'état du déploiement pour voir s'il réussit ou non.
* [Déclarez le nouvel état des Pods](#mise-à-jour-dun-déploiement) en mettant à jour le PodTemplateSpec du déploiement.
  Un nouveau ReplicaSet est créé et le déploiement gère le déplacement des pods de l'ancien ReplicaSet vers le nouveau à un rythme contrôlé.
  Chaque nouveau ReplicaSet met à jour la révision du déploiement.
* [Revenir à une révision de déploiement antérieure](#annulation-dun-déploiement) si l'état actuel du déploiement n'est pas stable.
  Chaque restauration met à jour la révision du déploiement.
* [Augmentez le déploiement pour traiter plus de charge](#mise-à-léchelle-dun-déploiement).
* [Suspendre le déploiement](#pause-et-reprise-dun-déploiement) d'appliquer plusieurs correctifs à son PodTemplateSpec, puis de le reprendre pour démarrer un nouveau déploiement.
* [Utiliser l'état du déploiement](#statut-de-déploiement) comme indicateur qu'un déploiement est bloqué.
* [Nettoyer les anciens ReplicaSets](#politique-de-nettoyage) dont vous n'avez plus besoin.

## Création d'un déploiement

Voici un exemple de déploiement.
Il crée un ReplicaSet pour faire apparaître trois pods `nginx`:

{{% codenew file="controllers/nginx-deployment.yaml" %}}

Dans cet exemple:

* Un déploiement nommé `nginx-deployment` est créé, indiqué par le champ `.metadata.name`.
* Le déploiement crée trois pods répliqués, indiqués par le champ `replicas`.
* Le champ `selector` définit comment le déploiement trouve les pods à gérer.
  Dans ce cas, vous sélectionnez simplement un label définie dans le template de pod (`app:nginx`).
  Cependant, des règles de sélection plus sophistiquées sont possibles, tant que le modèle de pod satisfait lui-même la règle.

  {{< note >}}
  Le champ `matchLabels` est une table de hash {clé, valeur}.
  Une seule {clé, valeur} dans la table `matchLabels` est équivalente à un élément de `matchExpressions`, dont le champ clé est "clé", l'opérateur est "In" et le tableau de valeurs contient uniquement "valeur".
  Toutes les exigences, à la fois de `matchLabels` et de `matchExpressions`, doivent être satisfaites pour correspondre.
  {{< /note >}}

* Le champ `template` contient les sous-champs suivants:
  * Les Pods reçoivent le label `app:nginx` dans le champ `labels`.
  * La spécification du template de pod dans le champ `.template.spec`, indique que les pods exécutent un conteneur, `nginx`, qui utilise l'image `nginx` [Docker Hub](https://hub.docker.com/) à la version 1.7.9.
  * Créez un conteneur et nommez-le `nginx` en utilisant le champ `name`.

Suivez les étapes ci-dessous pour créer le déploiement ci-dessus:

Avant de commencer, assurez-vous que votre cluster Kubernetes est opérationnel.

1. Créez le déploiement en exécutant la commande suivante:

   {{< note >}}
   Vous pouvez spécifier l'indicateur `--record` pour écrire la commande exécutée dans l'annotation de ressource `kubernetes.io/change-cause`.
   C'est utile pour une future introspection.
   Par exemple, pour voir les commandes exécutées dans chaque révision de déploiement.
   {{< /note >}}

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

1. Exécutez `kubectl get deployments` pour vérifier si le déploiement a été créé.
   Si le déploiement est toujours en cours de création, la sortie est similaire à:

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```

   Lorsque vous inspectez les déploiements de votre cluster, les champs suivants s'affichent:

   * `NAME` répertorie les noms des déploiements dans le cluster.
   * `DESIRED` affiche le nombre souhaité de _répliques_ de l'application, que vous définissez lorsque vous créez le déploiement.
      C'est l'_état désiré_.
   * `CURRENT` affiche le nombre de réplicas en cours d'exécution.
   * `UP-TO-DATE` affiche le nombre de réplicas qui ont été mises à jour pour atteindre l'état souhaité.
   * `AVAILABLE` affiche le nombre de réplicas de l'application disponibles pour vos utilisateurs.
   * `AGE` affiche la durée d'exécution de l'application.

   Notez que le nombre de réplicas souhaitées est de 3 selon le champ `.spec.replicas`.

1. Pour voir l'état du déploiement, exécutez:

   ```shell
   kubectl rollout status deployment.v1.apps/nginx-deployment
   ```

   La sortie est similaire à ceci:

   ```shell
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

1. Exécutez à nouveau `kubectl get deployments` quelques secondes plus tard.
   La sortie est similaire à ceci:

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```

   Notez que le déploiement a créé les trois répliques et que toutes les répliques sont à jour (elles contiennent le dernier modèle de pod) et disponibles.

1. Pour voir le ReplicaSet (`rs`) créé par le déploiement, exécutez `kubectl get rs`.
   La sortie est similaire à ceci:

   ```text
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```

   Notez que le nom du ReplicaSet est toujours formaté comme: `[DEPLOYMENT-NAME]-[RANDOM-STRING]`.
   La chaîne aléatoire est générée aléatoirement et utilise le pod-template-hash comme graine.

1. Pour voir les labels générées automatiquement pour chaque Pod, exécutez `kubectl get pods --show-labels`.
   La sortie est similaire à ceci:

   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```

  Le ReplicaSet créé garantit qu'il y a trois pods `nginx`.

{{< note >}}
Vous devez spécifier un sélecteur approprié et des labels de template de pod dans un déploiement (dans ce cas, `app: nginx`).
Ne superposez pas les étiquettes ou les sélecteurs avec d'autres contrôleurs (y compris d'autres déploiements et StatefulSets).
Kubernetes n'empêche pas les chevauchements de noms, et si plusieurs contrôleurs ont des sélecteurs qui se chevauchent, ces contrôleurs peuvent entrer en conflit et se comporter de façon inattendue.
{{< /note >}}

### Étiquette pod-template-hash

{{< note >}}
Ne modifiez pas ce label.
{{< /note >}}

Le label `pod-template-hash` est ajoutée par le contrôleur de déploiement à chaque ReplicaSet créé ou adopté par un déploiement.

Ce label garantit que les ReplicaSets enfants d'un déploiement ne se chevauchent pas.
Il est généré en hachant le `PodTemplate` du ReplicaSet et en utilisant le hachage résultant comme valeur de label qui est ajoutée au sélecteur ReplicaSet, aux labels de template de pod et dans tous les pods existants que le ReplicaSet peut avoir.

## Mise à jour d'un déploiement

{{< note >}}
Le re-déploiement d'un déploiement est déclenché si et seulement si le modèle de pod du déploiement (c'est-à-dire `.spec.template`) est modifié, par exemple si les labels ou les images de conteneur du template sont mis à jour.
D'autres mises à jour, telles que la mise à l'échelle du déploiement, ne déclenchent pas de rollout.
{{< /note >}}

Suivez les étapes ci-dessous pour mettre à jour votre déploiement:

1. Mettons à jour les pods nginx pour utiliser l'image `nginx: 1.9.1` au lieu de l'image `nginx: 1.7.9`.

    ```shell
    kubectl --record deployment.apps/nginx-deployment set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```

    ou utilisez la commande suivante:

    ```shell
    kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1 --record
    ```
  
    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment image updated
    ```

    Alternativement, vous pouvez `éditer` le déploiement et changer `.spec.template.spec.containers[0].image` de `nginx: 1.7.9` à `nginx: 1.9.1`:

    ```shell
    kubectl edit deployment.v1.apps/nginx-deployment
     ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment edited
    ```

2. Pour voir l'état du déploiement, exécutez:

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    ```

    ou

    ```text
    deployment "nginx-deployment" successfully rolled out
    ```

Obtenez plus de détails sur votre déploiement mis à jour:

* Une fois le déploiement réussi, vous pouvez afficher le déploiement en exécutant `kubectl get deployments`.
  La sortie est similaire à ceci:

    ```text
    NAME               READY   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3/3     3            3           36s
    ```

* Exécutez `kubectl get rs` pour voir que le déploiement a mis à jour les pods en créant un nouveau ReplicaSet et en le redimensionnant jusqu'à 3 replicas, ainsi qu'en réduisant l'ancien ReplicaSet à 0 réplicas.

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       6s
    nginx-deployment-2035384211   0         0         0       36s
    ```

* L'exécution de `kubectl get pods` ne devrait désormais afficher que les nouveaux pods:

    ```shell
    kubectl get pods
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                                READY     STATUS    RESTARTS   AGE
    nginx-deployment-1564180365-khku8   1/1       Running   0          14s
    nginx-deployment-1564180365-nacti   1/1       Running   0          14s
    nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
    ```

    La prochaine fois que vous souhaitez mettre à jour ces pods, il vous suffit de mettre à jour le modèle de pod de déploiement à nouveau.

    Le déploiement garantit que seul un certain nombre de pods sont en panne pendant leur mise à jour.
    Par défaut, il garantit qu'au moins 75% du nombre souhaité de pods sont en place (25% max indisponible).

    Le déploiement garantit également que seul un certain nombre de pods sont créés au-dessus du nombre souhaité de pods.
    Par défaut, il garantit qu'au plus 125% du nombre de pods souhaité sont en hausse (surtension maximale de 25%).

    Par exemple, si vous regardez attentivement le déploiement ci-dessus, vous verrez qu'il a d'abord créé un nouveau pod, puis supprimé certains anciens pods et en a créé de nouveaux.
    Il ne tue pas les anciens Pods tant qu'un nombre suffisant de nouveaux Pods n'est pas apparu, et ne crée pas de nouveaux Pods tant qu'un nombre suffisant de Pods anciens n'a pas été tué.
    Il s'assure qu'au moins 2 pods sont disponibles et qu'au maximum 4 pods au total sont disponibles.

* Obtenez les détails de votre déploiement:

    ```shell
    kubectl describe deployments
    ```

    La sortie est similaire à ceci:

    ```text
    Name:                   nginx-deployment
    Namespace:              default
    CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
    Labels:                 app=nginx
    Annotations:            deployment.kubernetes.io/revision=2
    Selector:               app=nginx
    Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
    StrategyType:           RollingUpdate
    MinReadySeconds:        0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
        Labels:  app=nginx
        Containers:
        nginx:
            Image:        nginx:1.9.1
            Port:         80/TCP
            Environment:  <none>
            Mounts:       <none>
        Volumes:        <none>
        Conditions:
        Type           Status  Reason
        ----           ------  ------
        Available      True    MinimumReplicasAvailable
        Progressing    True    NewReplicaSetAvailable
        OldReplicaSets:  <none>
        NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
        Events:
        Type    Reason             Age   From                   Message
        ----    ------             ----  ----                   -------
        Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
        Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
        Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
        Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
        Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
        Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
        Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
    ```

    Ici, vous voyez que lorsque vous avez créé le déploiement pour la première fois, il a créé un ReplicaSet (nginx-deployment-2035384211) et l'a mis à l'échelle directement jusqu'à 3 réplicas.
    Lorsque vous avez mis à jour le déploiement, il a créé un nouveau ReplicaSet (nginx-deployment-1564180365) et l'a mis à l'échelle jusqu'à 1, puis a réduit l'ancien ReplicaSet à 2, de sorte qu'au moins 2 pods étaient disponibles et au plus 4 pods ont été créés à chaque fois.
    Il a ensuite poursuivi la montée en puissance du nouveau et de l'ancien ReplicaSet, avec la même stratégie de mise à jour continue.
    Enfin, vous aurez 3 réplicas disponibles dans le nouveau ReplicaSet, et l'ancien ReplicaSet est réduit à 0.

### Rollover (alias plusieurs mises à jour en vol) {#rollover}

Chaque fois qu'un nouveau déploiement est observé par le contrôleur de déploiement, un ReplicaSet est créé pour afficher les pods souhaités.
Si le déploiement est mis à jour, le ReplicaSet existant qui contrôle les pods dont les étiquettes correspondent à `.spec.selector` mais dont le modèle ne correspond pas à `.spec.template` est réduit.
Finalement, le nouveau ReplicaSet est mis à l'échelle à `.spec.replicas` et tous les anciens ReplicaSets sont mis à l'échelle à 0.

Si vous mettez à jour un déploiement alors qu'un déploiement existant est en cours, le déploiement crée un nouveau ReplicaSet conformément à la mise à jour et commence à le mettre à l'échelle, et arrête de mettre à jour le ReplicaSet qu'il augmentait précédemment - il l'ajoutera à sa liste de anciens ReplicaSets et commencera à le réduire.

Par exemple, supposons que vous créez un déploiement pour créer 5 répliques de `nginx: 1.7.9`, puis mettez à jour le déploiement pour créer 5 répliques de `nginx: 1.9.1`, alors que seulement 3 répliques de `nginx:1.7.9` avait été créés.
Dans ce cas, le déploiement commence immédiatement à tuer les 3 pods `nginx: 1.7.9` qu'il avait créés et commence à créer des pods `nginx: 1.9.1`.
Il n'attend pas que les 5 répliques de `nginx: 1.7.9` soient créées avant de changer de cap.

### Mises à jour du sélecteur de labels

Il est généralement déconseillé de mettre à jour le sélecteur de labels et il est suggéré de planifier vos sélecteurs à l'avance.
Dans tous les cas, si vous devez effectuer une mise à jour du sélecteur de labels, soyez très prudent et assurez-vous d'avoir saisi toutes les implications.

{{< note >}}
Dans la version d'API `apps/v1`, le sélecteur de label d'un déploiement est immuable après sa création.
{{< /note >}}

* Les ajouts de sélecteur nécessitent que les labels de template de pod dans la spécification de déploiement soient également mises à jour avec les nouveaux labels, sinon une erreur de validation est renvoyée.
  Cette modification ne se chevauche pas, ce qui signifie que le nouveau sélecteur ne sélectionne pas les ReplicaSets et les pods créés avec l'ancien sélecteur, ce qui entraîne la perte de tous les anciens ReplicaSets et la création d'un nouveau ReplicaSet.
* Les mises à jour du sélecteur modifient la valeur existante dans une clé de sélection - entraînent le même comportement que les ajouts.
* La suppression de sélecteur supprime une clé existante du sélecteur de déploiement - ne nécessite aucune modification dans les labels du template de pod.
  Les ReplicaSets existants ne sont pas orphelins et aucun nouveau ReplicaSet n'est créé, mais notez que le label supprimé existe toujours dans tous les Pods et ReplicaSets existants.

## Annulation d'un déploiement

Parfois, vous souhaiterez peut-être annuler un déploiement; par exemple, lorsque le déploiement n'est pas stable, comme en cas d'échecs à répétition (CrashLoopBackOff).
Par défaut, tout l'historique des déploiements d'un déploiement est conservé dans le système afin que vous puissiez le restaurer à tout moment (vous pouvez le modifier en modifiant la limite de l'historique des révisions).

{{< note >}}
La révision d'un déploiement est créée lorsque le déploiement d'un déploiement est déclenché.
Cela signifie qu'une nouvelle révision est créée si et seulement si le template de pod de déploiement (`.spec.template`) est modifié, par exemple si vous mettez à jour les labels ou les images de conteneur du template.
D'autres mises à jour, telles que la mise à l'échelle du déploiement, ne créent pas de révision de déploiement, de sorte que vous puissiez faciliter la mise à l'échelle manuelle ou automatique simultanée.
Cela signifie que lorsque vous revenez à une révision antérieure, seule la partie du template de pod de déploiement est annulée.
{{< /note >}}

* Supposons que vous ayez fait une faute de frappe lors de la mise à jour du déploiement, en mettant le nom de l'image sous la forme `nginx:1.91` au lieu de `nginx: 1.9.1`:

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment image updated
    ```

* Le déploiement est bloqué.
  Vous pouvez le vérifier en vérifiant l'état du déploiement:

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    ```

* Appuyez sur Ctrl-C pour arrêter la surveillance d'état de déploiement ci-dessus.
  Pour plus d'informations sur les déploiements bloqués, [en savoir plus ici](#deployment-status).

* Vous voyez que le nombre d'anciens réplicas (`nginx-deployment-1564180365` et `nginx-deployment-2035384211`) est 2, et les nouveaux réplicas (`nginx-deployment-3066724191`) est 1.

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       25s
    nginx-deployment-2035384211   0         0         0       36s
    nginx-deployment-3066724191   1         1         0       6s
    ```

* En regardant les pods créés, vous voyez que 1 pod créé par le nouveau ReplicaSet est coincé dans une boucle pour récupérer son image:

    ```shell
    kubectl get pods
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                                READY     STATUS             RESTARTS   AGE
    nginx-deployment-1564180365-70iae   1/1       Running            0          25s
    nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
    nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
    nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
    ```

    {{< note >}}
    Le contrôleur de déploiement arrête automatiquement le mauvais déploiement et arrête la mise à l'échelle du nouveau ReplicaSet.
    Cela dépend des paramètres rollingUpdate (`maxUnavailable` spécifiquement) que vous avez spécifiés.
    Kubernetes définit par défaut la valeur à 25%.
    {{< /note >}}

* Obtenez la description du déploiement:

    ```shell
    kubectl describe deployment
    ```

    La sortie est similaire à ceci:

    ```text
    Name:           nginx-deployment
    Namespace:      default
    CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
    Labels:         app=nginx
    Selector:       app=nginx
    Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
    StrategyType:       RollingUpdate
    MinReadySeconds:    0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.91
        Port:         80/TCP
        Host Port:    0/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    ReplicaSetUpdated
    OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
    NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
    Events:
      FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
      --------- --------    -----   ----                    -------------   --------    ------              -------
      1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
      21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
      21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
      13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
      13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
    ```

    Pour résoudre ce problème, vous devez revenir à une version précédente de Deployment qui est stable.

### Vérification de l'historique de déploiement d'un déploiement

Suivez les étapes ci-dessous pour vérifier l'historique de déploiement:

1. Tout d'abord, vérifiez les révisions de ce déploiement:

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    deployments "nginx-deployment"
    REVISION    CHANGE-CAUSE
    1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml --record=true
    2           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
    3           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    `CHANGE-CAUSE` est copié de l'annotation de déploiement `kubernetes.io/change-cause` dans ses révisions lors de la création.
    Vous pouvez spécifier le message`CHANGE-CAUSE` en:

    * Annoter le déploiement avec `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image mis à jour en 1.9.1"`
    * Ajoutez le drapeau `--record` pour enregistrer la commande `kubectl` qui apporte des modifications à la ressource.
    * Modification manuelle du manifeste de la ressource.

2. Pour voir les détails de chaque révision, exécutez:

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
    ```

    La sortie est similaire à ceci:

    ```text
    deployments "nginx-deployment" revision 2
      Labels:       app=nginx
              pod-template-hash=1159050644
      Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
      Containers:
       nginx:
        Image:      nginx:1.9.1
        Port:       80/TCP
         QoS Tier:
            cpu:      BestEffort
            memory:   BestEffort
        Environment Variables:      <none>
      No volumes.
    ```

### Revenir à une révision précédente

Suivez les étapes ci-dessous pour restaurer le déploiement de la version actuelle à la version précédente, qui est la version 2.

1. Vous avez maintenant décidé d'annuler le déploiement actuel et le retour à la révision précédente:

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment
    ```

    Alternativement, vous pouvez revenir à une révision spécifique en la spécifiant avec `--to-revision`:

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment
    ```

    Pour plus de détails sur les commandes liées au déploiement, lisez [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

    Le déploiement est maintenant rétabli à une précédente révision stable.
    Comme vous pouvez le voir, un événement `DeploymentRollback` pour revenir à la révision 2 est généré à partir du contrôleur de déploiement.

2. Vérifiez si la restauration a réussi et que le déploiement s'exécute comme prévu, exécutez:

    ```shell
    kubectl get deployment nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    NAME               READY   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3/3     3            3           30m
    ```

3. Obtenez la description du déploiement:

    ```shell
    kubectl describe deployment nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    Name:                   nginx-deployment
    Namespace:              default
    CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
    Labels:                 app=nginx
    Annotations:            deployment.kubernetes.io/revision=4
                            kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
    Selector:               app=nginx
    Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
    StrategyType:           RollingUpdate
    MinReadySeconds:        0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.9.1
        Port:         80/TCP
        Host Port:    0/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
    Events:
      Type    Reason              Age   From                   Message
      ----    ------              ----  ----                   -------
      Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
      Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
      Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
    ```

## Mise à l'échelle d'un déploiement

Vous pouvez mettre à l'échelle un déploiement à l'aide de la commande suivante:

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```

La sortie est similaire à ceci:

```text
deployment.apps/nginx-deployment scaled
```

En supposant que l'[horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) est activé dans votre cluster, vous pouvez configurer une mise à l'échelle automatique pour votre déploiement et choisir le nombre minimum et maximum de pods que vous souhaitez exécuter en fonction de l'utilisation du processeur de vos pods existants.

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```

La sortie est similaire à ceci:

```text
deployment.apps/nginx-deployment scaled
```

### Mise à l'échelle proportionnelle

Les déploiements RollingUpdate prennent en charge l'exécution simultanée de plusieurs versions d'une application.
Lorsque vous ou un autoscaler mettez à l'échelle un déploiement RollingUpdate qui se trouve au milieu d'un déploiement (en cours ou en pause), le contrôleur de déploiement équilibre les réplicas supplémentaires dans les ReplicaSets actifs existants (ReplicaSets avec pods) afin d'atténuer le risque.
Ceci est appelé *mise à l'échelle proportionnelle*.

Par exemple, vous exécutez un déploiement avec 10 réplicas, [maxSurge](#max-surge)=3, et [maxUnavailable](#max-unavailable)=2.

* Assurez-vous que les 10 réplicas de votre déploiement sont en cours d'exécution.

    ```shell
    kubectl get deploy
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment     10        10        10           10          50s
    ```

* Vous effectuez une mise à jour vers une nouvelle image qui s'avère impossible à résoudre depuis l'intérieur du cluster.

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment image updated
    ```

* La mise à jour de l'image démarre un nouveau déploiement avec ReplicaSet `nginx-deployment-1989198191`, mais elle est bloquée en raison de l'exigence `maxUnavailable` que vous avez mentionnée ci-dessus.
  Découvrez l'état du déploiement:

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME                          DESIRED   CURRENT   READY     AGE
    nginx-deployment-1989198191   5         5         0         9s
    nginx-deployment-618515232    8         8         8         1m
    ```

* Ensuite, une nouvelle demande de mise à l'échelle pour le déploiement arrive.
  La mise à l'échelle automatique incrémente les réplicas de déploiement à 15.
  Le contrôleur de déploiement doit décider où ajouter ces 5 nouvelles répliques.
  Si vous n'utilisiez pas la mise à l'échelle proportionnelle, les 5 seraient ajoutés dans le nouveau ReplicaSet.
  Avec une mise à l'échelle proportionnelle, vous répartissez les répliques supplémentaires sur tous les ReplicaSets.
  Des proportions plus importantes vont aux ReplicaSets avec le plus de répliques et des proportions plus faibles vont aux ReplicaSets avec moins de replicas.
  Tous les restes sont ajoutés au ReplicaSet avec le plus de répliques.
  Les ReplicaSets avec zéro réplicas ne sont pas mis à l'échelle.

Dans notre exemple ci-dessus, 3 répliques sont ajoutées à l'ancien ReplicaSet et 2 répliques sont ajoutées au nouveau ReplicaSet.
Le processus de déploiement devrait éventuellement déplacer toutes les répliques vers le nouveau ReplicaSet, en supposant que les nouvelles répliques deviennent saines.
Pour confirmer cela, exécutez:

```shell
kubectl get deploy
```

La sortie est similaire à ceci:

```text
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

Le statut de déploiement confirme la façon dont les réplicas ont été ajoutés à chaque ReplicaSet.

```shell
kubectl get rs
```

La sortie est similaire à ceci:

```text
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Pause et reprise d'un déploiement

Vous pouvez suspendre un déploiement avant de déclencher une ou plusieurs mises à jour, puis le reprendre.
Cela vous permet d'appliquer plusieurs correctifs entre la pause et la reprise sans déclencher de déploiements inutiles.

* Par exemple, avec un déploiement qui vient d'être créé:
  Obtenez les détails du déploiement:

    ```shell
    kubectl get deploy
    ```

    La sortie est similaire à ceci:

    ```text
    NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx     3         3         3            3           1m
    ```

    Obtenez le statut de déploiement:

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   3         3         3         1m
    ```

* Mettez le déploiement en pause en exécutant la commande suivante:

    ```shell
    kubectl rollout pause deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment paused
    ```

* Mettez ensuite à jour l'image du déploiement:

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment image updated
    ```

* Notez qu'aucun nouveau déploiement n'a commencé:

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    deployments "nginx"
    REVISION  CHANGE-CAUSE
    1   <none>
    ```

* Obtenez l'état de déploiement pour vous assurer que le déploiement est correctement mis à jour:

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   3         3         3         2m
    ```

* Vous pouvez effectuer autant de mises à jour que vous le souhaitez, par exemple, mettre à jour les ressources qui seront utilisées:

    ```shell
    kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment resource requirements updated
    ```

    L'état initial du déploiement avant de le suspendre continuera de fonctionner, mais les nouvelles mises à jour du déploiement n'auront aucun effet tant que le déploiement sera suspendu.

* Finalement, reprenez le déploiement et observez un nouveau ReplicaSet à venir avec toutes les nouvelles mises à jour:

    ```shell
    kubectl rollout resume deployment.v1.apps/nginx-deployment
    ```

    La sortie est similaire à ceci:

    ```text
    deployment.apps/nginx-deployment resumed
    ```

* Regardez l'état du déploiement jusqu'à ce qu'il soit terminé.

    ```shell
    kubectl get rs -w
    ```

    La sortie est similaire à ceci:

    ```text
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   2         2         2         2m
    nginx-3926361531   2         2         0         6s
    nginx-3926361531   2         2         1         18s
    nginx-2142116321   1         2         2         2m
    nginx-2142116321   1         2         2         2m
    nginx-3926361531   3         2         1         18s
    nginx-3926361531   3         2         1         18s
    nginx-2142116321   1         1         1         2m
    nginx-3926361531   3         3         1         18s
    nginx-3926361531   3         3         2         19s
    nginx-2142116321   0         1         1         2m
    nginx-2142116321   0         1         1         2m
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         20s
    ```

* Obtenez le statut du dernier déploiement:

    ```shell
    kubectl get rs
    ```

    La sortie est similaire à ceci:

    ```text
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         28s
    ```

{{< note >}}
Vous ne pouvez pas annuler un déploiement suspendu avant de le reprendre.
{{< /note >}}

## Statut de déploiement

Un déploiement entre dans différents états au cours de son cycle de vie.
Il peut être [progressant](#progressing-deployment) lors du déploiement d'un nouveau ReplicaSet, il peut être [effectué](#complete-deployment), ou il peut [ne pas progresser](#failed-deployment).

### Progression du déploiement

Kubernetes marque un déploiement comme _progressing_ lorsqu'une des tâches suivantes est effectuée:

* Le déploiement crée un nouveau ReplicaSet.
* Le déploiement augmente son nouveau ReplicaSet.
* Le déploiement réduit ses anciens ReplicaSet.
* De nouveaux pods deviennent prêts ou disponibles (prêt pour au moins [MinReadySeconds](#min-ready-seconds)).

Vous pouvez surveiller la progression d'un déploiement à l'aide de `kubectl rollout status`.

### Déploiement effectué

Kubernetes marque un déploiement comme _effectué_ lorsqu'il présente les caractéristiques suivantes:

* Toutes les répliques associées au déploiement ont été mises à jour vers la dernière version que vous avez spécifiée, ce qui signifie que toutes les mises à jour que vous avez demandées ont été effectuées.
* Toutes les répliques associées au déploiement sont disponibles.
* Aucune ancienne réplique pour le déploiement n'est en cours d'exécution.

Vous pouvez vérifier si un déploiement est terminé en utilisant `kubectl rollout status`.
Si le déploiement s'est terminé avec succès, `kubectl rollout status` renvoie un code de sortie de 0.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```

La sortie est similaire à ceci:

```text
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
$ echo $?
0
```

### Déploiement échoué

Votre déploiement peut rester bloqué en essayant de déployer son nouveau ReplicaSet sans jamais terminer.
Cela peut se produire en raison de certains des facteurs suivants:

* Quota insuffisant
* Échecs de la sonde de préparation
* Erreurs d'extraction d'image
* Permissions insuffisantes
* Plages limites
* Mauvaise configuration de l'exécution de l'application

Vous pouvez détecter cette condition en spécifiant un paramètre d'échéance dans votre spécification de déploiement:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)).
`.spec.progressDeadlineSeconds` indique le nombre de secondes pendant lesquelles le contrôleur de déploiement attend avant d'indiquer (dans l'état de déploiement) que la progression du déploiement est au point mort.

La commande `kubectl` suivante définit la spécification avec `progressDeadlineSeconds` pour que le contrôleur signale l'absence de progression pour un déploiement après 10 minutes:

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

La sortie est similaire à ceci:

```text
deployment.apps/nginx-deployment patched
```

Une fois le délai dépassé, le contrôleur de déploiement ajoute un `DeploymentCondition` avec les attributs suivants aux `.status.conditions` du déploiement:

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

Voir les [conventions Kubernetes API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) pour plus d'informations sur les conditions d'état.

{{< note >}}
Kubernetes ne prend aucune mesure sur un déploiement bloqué, sauf pour signaler une condition d'état avec `Reason=ProgressDeadlineExceeded`.
Les orchestrateurs de niveau supérieur peuvent en tirer parti et agir en conséquence, par exemple, restaurer le déploiement vers sa version précédente.
{{< /note >}}

{{< note >}}
Si vous suspendez un déploiement, Kubernetes ne vérifie pas la progression par rapport à votre échéance spécifiée.
Vous pouvez suspendre un déploiement en toute sécurité au milieu d'un déploiement et reprendre sans déclencher la condition de dépassement du délai.
{{< /note >}}

Vous pouvez rencontrer des erreurs transitoires avec vos déploiements, soit en raison d'un délai d'attente bas que vous avez défini, soit en raison de tout autre type d'erreur pouvant être traité comme transitoire.
Par exemple, supposons que votre quota soit insuffisant.
Si vous décrivez le déploiement, vous remarquerez la section suivante:

```shell
kubectl describe deployment nginx-deployment
```

La sortie est similaire à ceci:

```text
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

Si vous exécutez `kubectl get deployment nginx-deployment -o yaml`, l'état de déploiement est similaire à ceci:

```yaml
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

Finalement, une fois la date limite de progression du déploiement dépassée, Kubernetes met à jour le statut et la raison de la condition de progression:

```text
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Vous pouvez résoudre un problème de quota insuffisant en réduisant votre déploiement, en réduisant d'autres contrôleurs que vous exécutez ou en augmentant le quota de votre namespace.
Si vous remplissez les conditions de quota et que le contrôleur de déploiement termine ensuite le déploiement de déploiement, vous verrez la mise à jour de l'état du déploiement avec une condition réussie (`Status=True` et `Reason=NewReplicaSetAvailable`).

```text
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Type=Available` avec `Status=True` signifie que votre déploiement a une disponibilité minimale.
La disponibilité minimale est dictée par les paramètres spécifiés dans la stratégie de déploiement.
`Type=Progressing` avec `Status=True` signifie que votre déploiement est soit au milieu d'un déploiement et qu'il progresse ou qu'il a terminé avec succès sa progression et que les nouvelles répliques minimales requises sont disponibles (voir la raison de la condition pour les détails - dans notre cas, `Reason=NewReplicaSetAvailable` signifie que le déploiement est terminé).

Vous pouvez vérifier si un déploiement n'a pas pu progresser en utilisant `kubectl rollout status`.
`kubectl rollout status` renvoie un code de sortie différent de zéro si le déploiement a dépassé le délai de progression.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```

La sortie est similaire à ceci:

```text
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
$ echo $?
1
```

### Agir sur un déploiement échoué

Toutes les actions qui s'appliquent à un déploiement complet s'appliquent également à un déploiement ayant échoué.
Vous pouvez le mettre à l'échelle à la hausse/baisse, revenir à une révision précédente ou même la suspendre si vous devez appliquer plusieurs réglages dans le modèle de pod de déploiement.

## Politique de nettoyage

Vous pouvez définir le champ `.spec.revisionHistoryLimit` dans un déploiement pour spécifier le nombre d'anciens ReplicaSets pour ce déploiement que vous souhaitez conserver.
Le reste sera effacé en arrière-plan.
Par défaut, c'est 10.

{{< note >}}
La définition explicite de ce champ sur 0 entraînera le nettoyage de tout l'historique de votre déploiement, de sorte que le déploiement ne pourra pas revenir en arrière.
{{< /note >}}

## Déploiement des Canaries

Si vous souhaitez déployer des versions sur un sous-ensemble d'utilisateurs ou de serveurs à l'aide du déploiement, vous pouvez créer plusieurs déploiements, un pour chaque version, en suivant le modèle canari décrit dans [gestion des ressources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).

## Écriture d'une spécification de déploiement

Comme pour toutes les autres configurations Kubernetes, un déploiement a besoin des champs `apiVersion`, `kind` et `metadata`.
Pour des informations générales sur l'utilisation des fichiers de configuration, voir [déploiement d'applications](/docs/tutorials/stateless-application/run-stateless-application-deployment/), configuration des conteneurs, et [Utilisation de kubectl pour gérer les ressources](/docs/concepts/overview/working-with-objects/object-management/).

Un déploiement nécessite également un [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Pod Template

Les `.spec.template` et `.spec.selector` sont les seuls champs obligatoires du `.spec`.

Le `.spec.template` est un [Pod template](/fr/docs/concepts/workloads/pods/pod-overview/#pod-templates).
Il a exactement le même schéma qu'un [Pod](/fr/docs/concepts/workloads/pods/pod/), sauf qu'il est imbriqué et n'a pas de `apiVersion` ou de `kind`.

En plus des champs obligatoires pour un pod, un Pod Template dans un déploiement doit spécifier des labels appropriées et une stratégie de redémarrage appropriée.
Pour les labels, assurez-vous de ne pas chevaucher l'action d'autres contrôleurs.
Voir [sélecteur](#selector)).

Seulement un [`.spec.template.spec.restartPolicy`](/fr/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) égal à `Always` est autorisé, ce qui est la valeur par défaut s'il n'est pas spécifié.

### Répliques

`.spec.replicas` est un champ facultatif qui spécifie le nombre de pods souhaités.
Il vaut par défaut 1.

### Sélecteur

`.spec.selector` est un champ obligatoire qui spécifie un [sélecteur de labels](/docs/concepts/overview/working-with-objects/labels/) pour les pods ciblés par ce déploiement.

`.spec.selector` doit correspondre `.spec.template.metadata.labels`, ou il sera rejeté par l'API.

Dans la version d'API `apps/v1`, `.spec.selector` et `.metadata.labels` ne sont pas définis par défaut sur `.spec.template.metadata.labels` s'ils ne sont pas définis.
Ils doivent donc être définis explicitement.
Notez également que `.spec.selector` est immuable après la création du déploiement dans `apps/v1`.

Un déploiement peut mettre fin aux pods dont les étiquettes correspondent au sélecteur si leur modèle est différent de `.spec.template` ou si le nombre total de ces pods dépasse `.spec.replicas`.
Il fait apparaître de nouveaux pods avec `.spec.template` si le nombre de pods est inférieur au nombre souhaité.

{{< note >}}
Vous ne devez pas créer d'autres pods dont les labels correspondent à ce sélecteur, soit directement, en créant un autre déploiement, soit en créant un autre contrôleur tel qu'un ReplicaSet ou un ReplicationController.
Si vous le faites, le premier déploiement pense qu'il a créé ces autres pods.
Kubernetes ne vous empêche pas de le faire.
{{< /note >}}

Si vous avez plusieurs contrôleurs qui ont des sélecteurs qui se chevauchent, les contrôleurs se battront entre eux et ne se comporteront pas correctement.

### Stratégie

`.spec.strategy` spécifie la stratégie utilisée pour remplacer les anciens pods par de nouveaux.
`.spec.strategy.type` peut être "Recreate" ou "RollingUpdate".
"RollingUpdate" est la valeur par défaut.

#### Déploiment Recreate

Tous les pods existants sont tués avant que de nouveaux ne soient créés lorsque `.spec.strategy.type==Recreate`.

#### Déploiement de mise à jour continue

Le déploiement met à jour les pods dans une [mise à jour continue](/docs/tasks/run-application/rolling-update-replication-controller/) quand `.spec.strategy.type==RollingUpdate`.
Vous pouvez spécifier `maxUnavailable` et `maxSurge` pour contrôler le processus de mise à jour continue.

##### Max non disponible

`.spec.strategy.rollingUpdate.maxUnavailable` est un champ facultatif qui spécifie le nombre maximal de pods qui peuvent être indisponibles pendant le processus de mise à jour.
La valeur peut être un nombre absolu (par exemple, 5) ou un pourcentage des pods souhaités (par exemple, 10%).
Le nombre absolu est calculé à partir du pourcentage en arrondissant vers le bas.
La valeur ne peut pas être 0 si `.spec.strategy.rollingUpdate.maxSurge` est 0.
La valeur par défaut est 25%.

Par exemple, lorsque cette valeur est définie sur 30%, l'ancien ReplicaSet peut être réduit à 70% des pods souhaités immédiatement au démarrage de la mise à jour continue.
Une fois que les nouveaux pods sont prêts, l'ancien ReplicaSet peut être réduit davantage, suivi d'une augmentation du nouveau ReplicaSet, garantissant que le nombre total de pods disponibles à tout moment pendant la mise à jour est d'au moins 70% des pods souhaités.

##### Max Surge

`.spec.strategy.rollingUpdate.maxSurge` est un champ facultatif qui spécifie le nombre maximal de pods pouvant être créés sur le nombre de pods souhaité.
La valeur peut être un nombre absolu (par exemple, 5) ou un pourcentage des pods souhaités (par exemple, 10%).
La valeur ne peut pas être 0 si `MaxUnavailable` est 0.
Le nombre absolu est calculé à partir du pourcentage en arrondissant.
La valeur par défaut est 25%.

Par exemple, lorsque cette valeur est définie sur 30%, le nouveau ReplicaSet peut être mis à l'échelle immédiatement au démarrage de la mise à jour continue, de sorte que le nombre total d'anciens et de nouveaux pods ne dépasse pas 130% des pods souhaités.
Une fois que les anciens pods ont été détruits, le nouveau ReplicaSet peut être augmenté davantage, garantissant que le nombre total de pods en cours d'exécution à tout moment pendant la mise à jour est au maximum de 130% des pods souhaités.

### Progress Deadline Seconds

`.spec.progressDeadlineSeconds` est un champ facultatif qui spécifie le nombre de secondes pendant lesquelles vous souhaitez attendre que votre déploiement progresse avant que le système ne signale que le déploiement a [échoué](#failed-deployment) - refait surface comme une condition avec `Type=Progressing`, `Status=False` et `Reason=ProgressDeadlineExceeded` dans l'état de la ressource.
Le contrôleur de déploiement continuera de réessayer le déploiement.
À l'avenir, une fois la restauration automatique implémentée, le contrôleur de déploiement annulera un déploiement dès qu'il observera une telle condition.

S'il est spécifié, ce champ doit être supérieur à `.spec.minReadySeconds`.

### Min Ready Seconds

`.spec.minReadySeconds` est un champ facultatif qui spécifie le nombre minimum de secondes pendant lequel un pod nouvellement créé doit être prêt sans qu'aucun de ses conteneurs ne plante, pour qu'il soit considéré comme disponible.
Cette valeur par défaut est 0 (le pod sera considéré comme disponible dès qu'il sera prêt).
Pour en savoir plus sur le moment où un pod est considéré comme prêt, consultez [Sondes de conteneur](/fr/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Rollback To

Le champ `.spec.rollbackTo` est obsolète dans les versions d'API `extensions/v1beta1` et `apps/v1beta1` et n'est plus pris en charge dans les versions d'API commençant par `apps/v1beta2`.
Utilisez, `kubectl rollout undo` pour [Revenir à une révision précédente](#revenir-à-une-révision-précédente).

### Limite de l'historique des révisions

L'historique de révision d'un déploiement est stocké dans les ReplicaSets qu'il contrôle.

`.spec.revisionHistoryLimit` est un champ facultatif qui spécifie le nombre d'anciens ReplicaSets à conserver pour permettre la restauration.
Ces anciens ReplicaSets consomment des ressources dans `etcd` et encombrent la sortie de `kubectl get rs`.
La configuration de chaque révision de déploiement est stockée dans ses ReplicaSets; par conséquent, une fois un ancien ReplicaSet supprimé, vous perdez la possibilité de revenir à cette révision du déploiement.
Par défaut, 10 anciens ReplicaSets seront conservés, mais sa valeur idéale dépend de la fréquence et de la stabilité des nouveaux déploiements.

Plus précisément, la définition de ce champ à zéro signifie que tous les anciens ReplicaSets avec 0 réplicas seront nettoyés.
Dans ce cas, un nouveau panneau déroulant Déploiement ne peut pas être annulé, car son historique de révision est nettoyé.

### Paused

`.spec.paused` est un champ booléen facultatif pour suspendre et reprendre un déploiement.
La seule différence entre un déploiement suspendu et un autre qui n'est pas suspendu, c'est que toute modification apportée au `PodTemplateSpec` du déploiement suspendu ne déclenchera pas de nouveaux déploiements tant qu'il sera suspendu.
Un déploiement n'est pas suspendu par défaut lors de sa création.

## Alternative aux déploiements

### kubectl rolling-update

[`kubectl rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) met à jour les pods et les ReplicationControllers de la même manière.
Mais les déploiements sont recommandés, car ils sont déclaratifs, côté serveur et ont des fonctionnalités supplémentaires, telles que la restauration de toute révision précédente même après la mise à jour progressive..


