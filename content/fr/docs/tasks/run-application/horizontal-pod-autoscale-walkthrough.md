---
title: "Découverte de l'HorizontalPodAutoscaler"
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
---

<!-- overview -->

Un [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) (raccourci en HPA) 
met à jour automatiquement une ressource de charge de travail 
(comme un {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 
ou un {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), 
dans le but de faire évoluer automatiquement la charge de travail en fonction 
de la demande. 

L'évolutivité horizontale signifie que la réponse à une
augmentation de la charge est de déployer plus de {{< glossary_tooltip text="Pods" term_id="pod" >}}. 
Cela diffère de l'évolutivité _verticale_, qui pour Kubernetes 
signifierait attribuer plus de ressources (par exemple : mémoire ou CPU)
aux Pods qui sont déjà en cours d'exécution pour la charge de travail.

Si la charge diminue et que le nombre de Pods est supérieur au minimum configuré, 
le HorizontalPodAutoscaler indique à la ressource de charge de travail 
(le Deployment, le StatefulSet ou une autre ressource similaire)
de réduire son échelle (nombre de réplicas).

Ce document vous guide à travers un exemple d'activation de HorizontalPodAutoscaler pour gérer 
automatiquement l'échelle d'une application web. 
Cette charge de travail d'exemple est Apache httpd exécutant du code PHP.

## {{% heading prerequisites %}}  

{{< include task-tutorial-prereqs.md >}} {{< version-check >}} Si vous utilisez 
une version plus ancienne de Kubernetes, consultez la version de la documentation correspondante 
(voir [versions de documentation disponibles](/docs/home/supported-doc-versions/)). 

Pour suivre ce guide, vous devez également utiliser un cluster qui dispose d'un 
[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) déployé et configuré. 

Le Metrics Server Kubernetes collecte les métriques des ressources des 
{{<glossary_tooltip term_id="kubelet" text="kubelets">}} de votre cluster et expose 
ces métriques via l'[API Kubernetes](/docs/concepts/overview/kubernetes-api/), 
en utilisant un [APIService](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 
pour ajouter de nouveaux types de ressources représentant les lectures de métriques. 

Pour apprendre comment déployer le Metrics Server, consultez la [documentation de metrics-server](https://github.com/kubernetes-sigs/metrics-server#deployment).

<!-- steps -->  

## Exécutez et exposez le serveur php-apache 

Pour démontrer un HorizontalPodAutoscaler, vous commencerez par démarrer un 
Deployment qui exécute un conteneur utilisant l'image `hpa-example`
et l'expose en tant que {{< glossary_tooltip term_id="service">}} en utilisant le 
manifeste suivant:

{{% codenew file="application/php-apache.yaml" %}} 

Pour créer les ressources, exécutez la commande suivante:
```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

## Créer le HorizontalPodAutoscaler {#create-horizontal-pod-autoscaler}

Maintenant que le serveur est en cours d'exécution, créez l'autoscaler à l'aide de `kubectl`. 
Il existe une sous-commande [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale), 
faisant partie de `kubectl`, qui vous aide à le faire.

Vous allez bientôt exécuter une commande qui crée un HorizontalPodAutoscaler 
qui maintient entre 1 et 10 réplicas des Pods contrôlés par le déploiement
php-apache que vous avez créé lors de la première étape.

En parlant simplement, le HPA ({{<glossary_tooltip text="contrôleur" term_id="controller">}})
augmentera ou diminuera le nombre de réplicas (en mettant à jour le déploiement)
pour maintenir une utilisation CPU moyenne de 50% sur l'ensemble des Pods.

Ensuite, le déploiement met à jour le ReplicaSet - cela fait partie du 
fonctionnement de tous les déploiements dans Kubernetes - puis le ReplicaSet 
ajoute ou supprime des Pods en fonction des modifications apportées à son champ `.spec`.

Étant donné que chaque pod demande 200 milli-cores via `kubectl run`,
cela signifie une utilisation CPU moyenne de 100 milli-cores.
Consultez les [détails de l'algorithme](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details) pour plus d'informations sur celui-ci.

Créez le HorizontalPodAutoscaler :

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

Vous pouvez visualiser le statut actuel du nouvel HorizontalPodAutoscaler avec la commande:

```shell
# Vous pouvez utiliser "hpa" ou "horizontalpodautoscaler"; les deux appelations fonctionnent.
kubectl get hpa
```

Le résultat sera similaire à celui-ci:
```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s
```

(Si vous voyez d'autres HorizontalPodAutoscalers avec des noms différents, 
cela signifie qu'ils existaient déjà et ce n'est généralement pas un problème).

Veuillez noter que la consommation actuelle de CPU est de 0 % 
car il n'y a pas de clients envoyant des requêtes au serveur
(la colonne ``TARGET`` montre la moyenne de tous les Pods 
contrôlés par le déploiement correspondant).

## Augmenter la charge {#increase-load}

Ensuite, voyons comment l'autoscaler réagit à une augmentation de la charge.

Pour cela, vous allez démarrer un autre Pod pour agir en tant que client. 
Le conteneur à l'intérieur du Pod client
s'exécute dans une boucle infinie, envoyant des requêtes au service php-apache.

```shell
# Exécutez ceci dans un terminal séparé
# pour que la montée en charge s'applique pendant que vous continuez les étapes suivantes
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

Maintenant exécutez:
```shell
# Entrez Ctrl+C pour terminer lorsque c'est ok
kubectl get hpa php-apache --watch
```

Après environ une minute, vous devriez constater une augmentation de la charge 
CPU, comme ceci:

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

en réponse, une augmentation du nombre de réplicas, comme ceci:
```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

Dans ce cas, la consommation CPU a atteint 305% de ce qui était demandé.
Ainsi, le nombre de réplicas du Deployment a été augmenté à 7:

```shell
kubectl get deployment php-apache
```

Vous devriez voir le nombre de réplicas être égal à la valeur du HorizontalPodAutoscaler:
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
La stabilisation du nombre de réplicas peut prendre quelques minutes. 
Comme la charge est incontrollée, le nombre final de réplicas 
peut varier par rapport à l'exemple présenté.
{{< /note >}}

## Arrêt de la charge {#stop-load}

Pour finir cet exemple, nous allons arrêter d'envoyer des requètes.

Dans le terminal utilisé pour créer le Pod qui exécute une image `busybox`, arrêtez la charge en entrant `<Ctrl> +C`.

Puis vérifiez le résultat après un temps d'attente:
```shell
# entrez Ctrl+C pour arrêter une fois la charge arretée
kubectl get hpa php-apache --watch
```

Le résultat sera similaire à:

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

et le nombre de réplicas du Deployment sera redescendu: 

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

Une fois que la consommation CPU atteindra 0, le HPA ajustera automatiquement le nombre de réplicas à 1.

Cette étape peut prendre quelques minutes.

<!-- discussion -->

## L'auto-ajustement basé sur des métriques multiples ou personnalisées

Vous pouvez ajouter de nouvelles métriques à utiliser pour l'auto-ajustement du Deployment `php-apache` en utilisant l'api `autoscaling/v2`.

Pour commencer, récupérez le YAML de votre HorizontalPodAutoscaler en format `autoscaling/v2`:

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

Ouvrez le fichier `/tmp/hpa-v2.yaml` avec votre éditeur, le YAML devrait ressembler à ceci:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      current:
        averageUtilization: 0
        averageValue: 0
```

Veuillez noter que le champ `targetCPUUtilizationPercentage` a été remplacé par un tableau appelé `metrics`.
La métrique d'utilisation du CPU est une *métrique de ressource*, car elle est représentée en pourcentage d'une ressource spécifiée sur les conteneurs de pod. 
Notez que vous pouvez spécifier d'autres métriques de ressource en plus du CPU. 
Par défaut, la seule autre métrique de ressource prise en charge est la mémoire. 
Ces ressources ne changent pas de nom d'un cluster à l'autre et devraient 
toujours être disponibles tant que l'API `metrics.k8s.io` est disponible.

Vous pouvez également spécifier des métriques de ressource en termes de valeurs directes, au lieu de pourcentages de la valeur demandée, 
en utilisant un `target.type` de `AverageValue` au lieu de `Utilization`, 
et en définissant le champ correspondant `target.averageValue` au lieu de `target.averageUtilization`.

Il existe deux autres types de métriques, tous deux considérés comme des *métriques personnalisées*: les métriques de pod et les métriques d'objet. 
Ces métriques peuvent avoir des noms spécifiques au cluster et 
nécessitent une configuration de la surveillance du cluster plus avancée.

Le premier de ces types de métriques alternatives est les *métriques de pod*. 
Ces métriques décrivent les pods et sont regroupées en moyenne sur l'ensemble des pods, 
puis comparées à une valeur cible pour déterminer le nombre de réplicas. 
Elles fonctionnent de manière similaire aux métriques de ressource, 
à la différence qu'elles prennent en charge *seulement* le type de `target` `AverageValue`.

Les métriques de pod sont spécifiées à l'aide d'une définition `metric` comme ceci:

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

Le deuxième type de métrique alternative est *les métriques d'objet*. 
Ces métriques décrivent un objet différent dans le même namespace, 
au lieu de décrire des Pods. 
Les métriques ne sont pas nécessairement récupérées à partir de l'objet mais le décrivent. 
Les métriques d'objet prennent en charge les types de `target` suivants: `Value` et `AverageValue`.
Avec `Value`, la cible est comparée directement à la métrique renvoyée par l'API.
Avec `AverageValue`, la valeur renvoyée par l'API de métriques 
personnalisées est divisée par le nombre de Pods avant d'être comparée à la cible. 
L'exemple suivant est la représentation YAML de la métrique `requests-per-second`.

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

Si vous fournissez plusieurs définitions de métriques similaires, 
le HorizontalPodAutoscaler examinera chaque métrique à tour de rôle. 
Il calculera les nombres de réplicas proposés pour chaque métrique, 
puis choisira celle avec le nombre de réplicas le plus élevé. 
Par exemple, si votre système de surveillance collecte des métriques sur le trafic réseau, 
vous pouvez mettre à jour la définition ci-dessus en utilisant `kubectl edit` pour qu'elle ressemble à ceci :

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

Ensuite, votre HorizontalPodAutoscaler tentera de s'assurer 
que chaque pod consomme environ 50% de sa CPU demandée, 
en traitant 1000 paquets par seconde, 
et que tous les pods derrière l'Ingress `main-route` 
servent un total de 10000 requêtes par seconde. 

### Auto-ajustement sur des métriques plus spécifiques 

De nombreuses chaines de métriques vous permettent de décrire les métriques soit par leur nom, 
soit par un ensemble de descripteurs supplémentaires appelés _labels_. 
Pour tous les types de métriques autres que les ressources (pod, objet et externe, décrits ci-dessous), 
vous pouvez spécifier un sélecteur de label supplémentaire qui est transmis à votre chaine de métriques. 
Par exemple, si vous collectez une métrique `http_requests` avec le label `verb`, 
vous pouvez spécifier la définition de métrique suivante pour ne faire varier l'échelle que sur les requêtes de type GET:

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

Ce sélecteur utilise la même syntaxe que les sélecteurs d'étiquettes complets de Kubernetes. 
La chaine de surveillance détermine comment regrouper plusieurs séries en une seule valeur, si le nom et le sélecteur correspondent à plusieurs séries. 
Le sélecteur est additif et ne peut pas sélectionner des métriques qui décrivent des objets qui ne sont **pas** l'objet cible 
(les pods cibles dans le cas du type `Pods`, et l'objet décrit dans le cas du type `Object`).  

### Auto-ajustement sur des métriques non liées aux objets Kubernetes  

Les applications s'exécutant sur Kubernetes peuvent avoir besoin de 
s'auto-adapter en fonction de métriques qui n'ont pas de relation évidente 
avec un objet dans le cluster Kubernetes, 
telles que des métriques décrivant un service hébergé sans corrélation directe avec les namespace Kubernetes. 
À partir de Kubernetes 1.10, vous pouvez répondre à ce cas d'utilisation avec des *métriques externes*.  

L'utilisation de métriques externes nécessite une connaissance de votre système de surveillance ; 
la configuration est similaire à celle requise lors de l'utilisation de métriques personnalisées. 
Les métriques externes vous permettent de mettre à l'échelle automatiquement 
votre cluster en fonction de n'importe quelle métrique disponible dans votre 
système de surveillance. 
Créez un bloc `metric` avec un `name` et un `selector`, comme ci-dessus, 
et utilisez le type de métrique `External` au lieu de `Object`. 
Si plusieurs séries temporelles correspondent au `metricSelector`, 
la somme de leurs valeurs sera utilisée par le HorizontalPodAutoscaler. 
Les métriques externes prennent en charge les types de cible `Value` et `AverageValue`, qui fonctionnent exactement de la même manière que lorsque vous utilisez le type `Object`.  

Par exemple, si votre application traite des tâches à partir d'un service de file de messages hébergé,
vous pouvez ajouter la section suivante à votre déclaration de 
HorizontalPodAutoscaler pour spécifier que vous avez besoin 
d'un travailleur par tranche de 30 tâches en attente.

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector:
        matchLabels:
          queue: "worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

Lorsque possible, il est préférable d'utiliser les types de cible métrique personnalisés plutôt que des métriques externes, 
car cela facilite la sécurisation de l'API des métriques personnalisées pour les administrateurs de cluster. 
L'API des métriques externes permet potentiellement l'accès à n'importe quelle métrique, 
il est donc nécessaire que les administrateurs de cluster fassent attention lors de son exposition. 

## Annexe : Conditions d'état du Horizontal Pod Autoscaler

Lorsque vous utilisez la forme `autoscaling/v2` du HorizontalPodAutoscaler, 
vous pourrez voir les *conditions d'état* définies par Kubernetes sur celui-ci. 
Ces conditions d'état indiquent s'il est capable de se mettre à l'échelle et s'il est actuellement 
restreint de quelque manière que ce soit. Les conditions apparaissent dans le 
champ `status.conditions`. 

Pour voir les conditions affectant un HorizontalPodAutoscaler, nous pouvons utiliser la commande `kubectl describe hpa`.

```shell
kubectl describe hpa cm-test
```

```
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

Pour ce HorizontalPodAutoscaler, vous pouvez voir plusieurs conditions dans un état sain. 
La première, `AbleToScale`, indique si le HPA est capable de récupérer et de mettre à jour les échelles, 
ainsi que si des conditions liées aux limitations sont susceptibles d'empêcher le redimensionnement. 
La deuxième, `ScalingActive`, indique si le HPA est activé (c'est-à-dire que le nombre de réplicas de la cible n'est pas nul) et est capable de calculer les échelles souhaitées. 
Lorsqu'il est `False`, cela indique généralement des problèmes de récupération des métriques. 
Enfin, la dernière condition, `ScalingLimited`, indique que l'échelle souhaitée a été limitée par le maximum ou le minimum du HorizontalPodAutoscaler. 
Cela indique que vous souhaiteriez peut-être augmenter ou diminuer les contraintes de nombre de réplicas minimum ou maximum de votre HorizontalPodAutoscaler.

## Quantités

Toutes les métriques dans le HorizontalPodAutoscaler et les API de métriques 
sont spécifiées à l'aide d'une notation spéciale en nombres entiers connue dans Kubernetes sous le nom de {{< glossary_tooltip term_id=quantity text=quantité >}}. 
Par exemple, la quantité `10500m` serait écrite comme `10.5` en notation décimale. 
Les API de métriques renvoient des nombres entiers sans suffixe lorsque cela est possible, et renvoient généralement des quantités en milli-unités sinon. 
Cela signifie que vous pouvez voir la valeur de votre métrique fluctuer entre `1` et `1500m`, ou `1` et `1.5` lorsqu'elle est écrite en notation décimale.

## Autres scénarios possibles

### Création de l'autoscaler de manière déclarative

Au lieu d'utiliser la commande `kubectl autoscale` pour créer un HorizontalPodAutoscaler de manière impérative, 
nous pouvons utiliser le manifeste suivant pour le créer de manière déclarative :

{{% codenew file=application/hpa/php-apache.yaml %}}

Ensuite, créez l'autoscaler en exécutant la commande suivante :

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
