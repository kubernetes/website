---
title: StatefulSets
content_type: concept
weight: 30
---

<!-- overview -->

StatefulSet est l'objet de l'API de charge de travail utilisé pour gérer des applications avec état (*stateful*).

{{< glossary_definition term_id="statefulset" length="all" >}}


<!-- body -->

## Utiliser des StatefulSets

Les StatefulSets sont utiles pour des applications qui nécessitent une ou plusieurs des choses suivantes :

* Des identifiants réseau stables et uniques.
* Un stockage persistant stable.
* Un déploiement et une mise à l'échelle ordonnés et contrôlés.
* Des mises à jour continues (*rolling update*) ordonnées et automatisées.

Ci-dessus, stable est synonyme de persistance suite au (re)scheduling de Pods.
Si une application ne nécessite aucun identifiant stable ou de déploiement, suppression ou
mise à l'échelle stables, vous devriez déployer votre application en utilisant un objet de charge de travail
fournissant un ensemble de réplicas sans état (*stateless*).

Un [Deployment](/fr/docs/concepts/workloads/controllers/deployment/) ou
[ReplicaSet](/fr/docs/concepts/workloads/controllers/replicaset/) peut être mieux adapté pour vos applications sans état.

## Limitations

* Le stockage pour un Pod donné doit être provisionné soit par un [approvisionneur de PersistentVolume](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md) basé sur un `storage class` donné, soit pré-provisionné par un admin.
* Supprimer et/ou réduire l'échelle d'un StatefulSet à zéro ne supprimera *pas* les volumes associés avec le StatefulSet. Ceci est fait pour garantir la sécurité des données, ce qui a généralement plus de valeur qu'une purge automatique de toutes les ressources relatives à un StatefulSet.
* Les StatefulSets nécessitent actuellement un [Service Headless](/fr/docs/concepts/services-networking/service/#headless-services) qui est responsable de l'identité réseau des Pods. Vous êtes responsable de la création de ce Service.
* Les StatefulSets ne fournissent aucune garantie de la terminaison des pods lorsqu'un StatefulSet est supprimé. Pour avoir une terminaison ordonnée et maîtrisée des pods du StatefulSet, il est possible de réduire l'échelle du StatefulSet à 0 avant de le supprimer.
* Lors de l'utilisation de [Rolling Updates](#rolling-updates) avec la
  [Politique de gestion des Pods](#politiques-de-gestion-dun-pod) par défaut (`OrderedReady`),
  il est possible de tomber dans un état indéfini nécessitant une
  [intervention manuelle pour réparer](#rollback-forcé).

## Composants

L'exemple ci-dessous décrit les composants d'un StatefulSet.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # doit correspondre à .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # est 1 par défaut
  template:
    metadata:
      labels:
        app: nginx # doit correspondre à .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

Dans l'exemple ci-dessus :

* Un Service Headless, appelé `nginx`, est utilisé pour contrôler le domaine réseau.
* Le StatefulSet, appelé `web`, a une Spec indiquant que 3 réplicas du container nginx seront démarrés dans des Pods.
* Le `volumeClaimTemplates` fournira un stockage stable utilisant des [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) provisionnés par un approvisionneur de PersistentVolume.

Le nom d'un objet StatefulSet doit être un
[nom de sous-domaine DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) valide.

## Sélecteur de Pod

Vous devez renseigner le champ `.spec.selector` d'un StatefulSet pour qu'il corresponde aux labels de son `.spec.template.metadata.labels`. Avant Kubernetes 1.8, le champ `.spec.selector` était mis par défaut s'il était omis. Pour les versions 1.8 et ultérieures, ne pas spécifier de sélecteur de Pod résulte en une erreur de validation lors de la création du StatefulSet.

## Identité du Pod

Les Pods d'un StatefulSet ont une identité unique comprenant un ordinal, une identité réseau stable et un stockage stable.
L'identité est accrochée au Pod, indépendamment du noeud sur lequel il est (re)programmé.

### Index Ordinal

Pour un StatefulSet avec N réplicas, chaque Pod du StatefulSet se verra assigné un ordinal entier, de 0 à N-1,
unique sur l'ensemble des pods.

### ID réseau stable

Chaque Pod dans un StatefulSet dérive son nom d'hôte du nom du StatefulSet
et de l'ordinal du Pod. Le modèle pour le nom d'hôte généré est
`$(nom statefulset)-$(ordinal)`. L'exemple ci-dessus créera trois Pods
nommés `web-0,web-1,web-2`.
Un StatefulSet peut utiliser un [Service Headless](/docs/concepts/services-networking/service/#headless-services)
pour contrôler le domaine de ses Pods. Le domaine pris en charge par ce Service prend la forme :
`$(nom service).$(namespace).svc.cluster.local`, où "cluster.local" est le domaine du cluster.
Chaque fois qu'un Pod est créé, il obtient un sous-domaine DNS correspondant, prenant la forme :
`$(nom pod).$(domaine du service gouvernant)`, où le service gouvernant est défini par le
champ `serviceName` du StatefulSet.

En fonction de la façon dont est configuré le DNS dans votre cluster, vous ne pourrez peut-être pas rechercher immédiatement
le nom DNS d'un pod nouvellement exécuté. Ce problème peut se produire lorsque d'autres clients dans le
cluster ont déjà envoyé des requêtes pour le nom d'hôte du Pod avant sa création.
La mise en cache négative (normale pour le DNS) signifie que les résultats des recherches précédentes ayant échoué sont
mémorisés et réutilisés, même après que le Pod ait démarré, pendant au moins quelques secondes.

Si vous avez besoin de découvrir les Pods rapidement après leur création, vous avez plusieurs options :

- Interrogez directement l'API Kubernetes (par exemple, à l'aide d'un watch) plutôt que de vous fier aux recherches DNS.
- Réduisez le temps de mise en cache dans votre fournisseur de DNS Kubernetes (cela signifie généralement modifier le ConfigMap de CoreDNS, qui met actuellement en cache pendant 30 secondes).

Comme mentionné dans la section [limitations](#limitations), vous êtes responsable de
créer le [Service Headless](/docs/concepts/services-networking/service/#headless-services)
responsable de l'identité réseau des Pods.

Voici quelques exemples de choix pour le domaine du cluster, le nom du service,
le nom du StatefulSet et comment cela affecte les noms DNS des pods du StatefulSet.

Domaine Cluster | Service (ns/nom)  | StatefulSet (ns/nom) | Domaine StatefulSet             | DNS Pod                                      | Nom d'hôte   |
--------------- | ----------------- | -------------------- | ------------------------------- | -------------------------------------------- | ------------ |
 cluster.local  | default/nginx     | default/web          | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local  | foo/nginx         | foo/web              | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local     | foo/nginx         | foo/web              | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
Le domaine cluster sera `cluster.local` à moins qu'il soit
[configuré autrement](/docs/concepts/services-networking/dns-pod-service/).
{{< /note >}}

### Stockage stable

Kubernetes crée un [PersistentVolume](/docs/concepts/storage/persistent-volumes/) pour chaque
VolumeClaimTemplate. Dans l'exemple nginx ci-dessus, chaque Pod se verra affecter un unique PersistentVolume
avec un StorageClass de `my-storage-class` et 1 GiB de stockage provisionné. Si aucun StorageClass
n'est spécifié, alors le StorageClass par défaut sera utilisé. Lorsqu'un Pod est (re)schedulé
sur un noeud, ses `volumeMounts` montent les PersistentVolumes associés aux  
PersistentVolumeClaims. Notez que les PersistentVolumes associés avec les PersistentVolumeClaims des Pods
ne sont pas supprimés lorsque les Pods, ou le StatefulSet, sont supprimés.
Ceci doit être fait manuellement.

### Étiquette du nom de Pod

Lorsque le StatefulSet {{< glossary_tooltip term_id="controller" >}} crée un Pod,
il ajoute une étiquette, `statefulset.kubernetes.io/pod-name`, renseignée avec le nom du Pod.
Cette étiquette vous permet d'attacher un Service à un Pod spécifique du StatefulSet.

## Garanties de déploiement et de mise à l'échelle

* Pour un StatefulSet avec N réplicas, lorsque les Pods sont déployés, ils sont créés de manière séquentielle, dans l'ordre {0..N-1}.
* Lorsque les Pods sont supprimés, ils sont terminés dans l'ordre inverse, {N-1..0}.
* Avant qu'une opération de mise à l'échelle soit appliquée à un Pod, tous ses prédécesseurs doivent être Running et Ready.
* Avant qu'un Pod soit terminé, tous ses successeurs doivent être complètement arrêtés.

Le StatefulSet ne devrait pas spécifier un `pod.Spec.TerminationGracePeriodSeconds` à 0. Cette pratique
est dangereuse et fortement déconseillée. Pour plus d'explications, veuillez vous référer à [forcer la suppression  de Pods de StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

Lorsque l'exemple nginx ci-dessus est créé, trois Pods seront déployés dans l'ordre
web-0, web-1, web-2. web-1 ne sera pas déployé avant que web-0 soit
[Running et Ready](/fr/docs/concepts/workloads/pods/pod-lifecycle/), et web-2 ne sera pas déployé avant que
web-1 soit Running et Ready. Si web-0 venait à échouer, après que web-1 soit Running et Ready, mais avant que
web-2 soit lancé, web-2 ne serait pas lancé avant que web-0 soit correctement relancé et redevienne Running et Ready.

Si un utilisateur venait à mettre à l'échelle l'exemple déployé en patchant le StatefulSet pour que
`replicas=1`, web-2 serait terminé en premier. web-1 ne serait pas terminé avant que web-2
ne soit complètement arrêté et supprimé. Si web-0 venait à échouer après que web-2 soit terminé et complètement arrêté,
mais avant que web-1 soit terminé, web-1 ne serait pas terminé avant que web-0 soit Running et Ready.

### Politiques de gestion d'un Pod

Dans Kubernetes 1.7 et ultérieurs, le StatefulSet vous permet d'assouplir ses garanties d'ordre,
tout en préservant ses garanties d'unicité et d'identité via son champ `.spec.podManagementPolicy`.

#### Gestion de Pod OrderedReady

La gestion de Pod `OrderedReady` est la valeur par défaut pour les StatefulSets. Il implémente le comportement décrit [ci-dessus](#garanties-de-déploiment-et-de-mise-à-l-échelle).

#### Gestion de Pod Parallel

La gestion de Pod `Parallel` indique au contrôleur de StatefulSet de lancer ou
terminer tous les Pods en parallèle, et de ne pas attendre que les Pods deviennent Running
et Ready ou complètement terminés avant de lancer ou terminer un autre
Pod. Cette option affecte seulement le comportement pour les opérations de mise à l'échelle.
Les mises à jour ne sont pas affectées.

## Stratégies de mise à jour

Dans Kubernetes 1.7 et ultérieurs, le champ `.spec.updateStrategy` d'un StatefulSet vous permet
de configurer et désactiver les rolling updates automatisés pour les conteneurs, étiquettes,
requête/limites de ressources, et annotations pour les Pods d'un StatefulSet.

### On Delete

La stratégie de mise à jour `OnDelete` implémente l'ancien comportement (1.6 et précédents). Lorsque
`.spec.updateStrategy.type` d'un StatefulSet est mis à `OnDelete`, le contrôleur de StatefulSet
ne mettra pas à jour automatiquement les Pods dans un StatefulSet.
Les utilisateurs doivent supprimer manuellement les Pods pour forcer le contrôleur à créer de nouveaux
Pods qui réflètent les modifications faites à un `.spec.template` d'un StatefulSet.

### Rolling Updates

La stratégie de mise à jour `RollingUpdate` implémente le rolling update automatisé pour les Pods d'un
StatefulSet. C'est la stratégie par défaut lorsque `.spec.updateStrategy` n'est pas spécifié.
Lorsqu'un `.spec.updateStrategy.type` d'un StatefulSet est mis à `RollingUpdate`, le contrôleur de
StatefulSet va supprimer et recréer chaque Pod d'un StatefulSet. Il va procéder dans le même ordre
que pour la terminaison d'un Pod (de l'ordinal le plus grand au plus petit), mettant à jour chaque Pod,
un seul à la fois. Il va attendre qu'un Pod mis à jour soit Running et Ready avant de mettre à jour
son prédécesseur.

#### Partitions

La stratégie de mise à jour `RollingUpdate` peut être partitionnée, en spécifiant une
`.spec.updateStrategy.rollingUpdate.partition`. Si une partition est spécifiée, tous les Pods ayant un
ordinal plus grand ou égal à la partition seront mis à jour lorsque le
`.spec.template` du StatefulSet sera mis à jour. Tous les Pods ayant un ordinal inférieur à la partition
ne sera pas mis à jour, et, même s'ils sont supprimés, ils seront recréés avec l'ancienne version. Si une
`.spec.updateStrategy.rollingUpdate.partition` d'un StatefulSet est plus grand que son `.spec.replicas`,
les mises à jour de son `.spec.template` ne seront pas propagés à ses Pods.
Dans la plupart des cas vous n'aurez pas à utiliser de partition, mais elles sont utiles si vous désirez
organiser une mise à jour, déployer une version canari, ou effectuer un déploiement par étapes.

#### Rollback forcé

En utilisant des [Rolling Updates](#rolling-updates) avec la
[politique de gestion d'un Pod](#politiques-de-gestion-dun-pod) par défaut (`OrderedReady`),
il est possible de se retrouver dans un état inconsistant nécessitant une intervention manuelle pour réparation.

Si vous mettez à jour le template de Pod dans une configuration qui ne devient jamais Running et
Ready (par exemple, du fait d'un mauvais binaire ou d'une erreur de configuration au niveau de l'application),
le StatefulSet va arrêter le rollout et attendre.

Dans cet état, il n'est pas suffisant de revenir à une bonne configuration du template de Pod.
En raison d'une [erreur connue](https://github.com/kubernetes/kubernetes/issues/67250),
le StatefulSet va continuer à attendre que le Pod en échec Pod devienne Ready
(ce qui n'arrive jamais) avant qu'il tente de revenir à la bonne configuration.

Après être revenu au bon template, vous devez aussi supprimer tous les Pods que le StatefulSet
avait déjà essayé de démarrer avec la mauvaise configuration.
Le StatefulSet va alors commencer à recréer les Pods en utilisant le bon template.

## {{% heading "whatsnext" %}}

* Suivre un exemple de [déploiement d'une application stateful](/docs/tutorials/stateful-application/basic-stateful-set/).
* Suivre un exemple de [déploiement de Cassandra avec des Stateful Sets](/docs/tutorials/stateful-application/cassandra/).
* Suivre un exemple d'[exécution d'une application stateful redondante](/docs/tasks/run-application/run-replicated-stateful-application/).
