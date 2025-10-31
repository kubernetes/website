---
title: Labels et sélecteurs
content_type: concept
weight: 40
---

<!-- overview -->

Les _labels_ sont des paires clé/valeur qui sont attachées aux
{{< glossary_tooltip text="objets" term_id="object" >}} tels que les Pods.
Les labels sont destinées à être utilisées pour spécifier des attributs d'identification des objets
qui sont significatifs et pertinents pour les utilisateurs, mais n'impliquent pas directement de sémantique
au système principal. Les labels peuvent être utilisées pour organiser et sélectionner des sous-ensembles d'objets.
Les labels peuvent être attachées aux objets lors de leur création et ultérieurement
ajoutées et modifiées à tout moment. Chaque objet peut avoir un ensemble de labels clé/valeur
définies. Chaque clé doit être unique pour un objet donné.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Les labels permettent des requêtes et des surveillances efficaces et sont idéaux pour une utilisation dans les interfaces utilisateur (UI) et les interfaces en ligne de commande (CLI). Les informations non identifiantes doivent être enregistrées à l'aide des [annotations](/fr/docs/concepts/overview/working-with-objects/annotations/).

<!-- body -->

## Motivation

Les labels permettent aux utilisateurs de mapper leurs propres structures organisationnelles sur les objets système de manière lâchement couplée, sans nécessiter aux clients de stocker ces mappings.

Les déploiements de services et les pipelines de traitement par lots sont souvent des entités multidimensionnelles (par exemple, plusieurs partitions ou déploiements, plusieurs pistes de version, plusieurs niveaux, plusieurs micro-services par niveau). La gestion nécessite souvent des opérations transversales, ce qui rompt l'encapsulation des représentations strictement hiérarchiques, en particulier les hiérarchies rigides déterminées par l'infrastructure plutôt que par les utilisateurs.

Exemples de labels :

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

Voici des exemples de _label_ couramment utilisées; vous êtes libre de développer vos propres conventions. Gardez à l'esprit que la clé du _label_ doit être unique pour un objet donné.

## Syntaxe et jeu de caractères

Les labels sont des paires clé/valeur. Les clés de label valides ont deux segments : un préfixe facultatif et un nom, séparés par une barre oblique (`/`). Le segment du nom est requis et ne doit pas dépasser 63 caractères, en commençant et en terminant par un caractère alphanumérique (`[a-z0-9A-Z]`) avec des tirets (`-`), des traits de soulignement (`_`), des points (`.`) et des caractères alphanumériques entre eux. Le préfixe est facultatif. S'il est spécifié, le préfixe doit être un sous-domaine DNS : une série de labels DNS séparées par des points (`.`), ne dépassant pas 253 caractères au total, suivi d'une barre oblique (`/`).

Si le préfixe est omis, la clé du label est considérée comme privée pour l'utilisateur. Les composants système automatisés (par exemple, `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl` ou d'autres automatisations tierces) qui ajoutent des labels aux objets des utilisateurs finaux doivent spécifier un préfixe.

Les préfixes `kubernetes.io/` et `k8s.io/` sont réservés pour les composants principaux de Kubernetes.

Valeur de label valide :

* doit comporter 63 caractères ou moins (peut être vide),
* sauf s'il est vide, doit commencer et se terminer par un caractère alphanumérique (`[a-z0-9A-Z]`),
* peut contenir des tirets (`-`), des traits de soulignement (`_`), des points (`.`) et des caractères alphanumériques entre eux.

Par exemple, voici un manifeste pour un Pod qui a deux labels `environment: production` et `app: nginx` :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## Sélecteurs de labels

Contrairement aux [noms et UIDs](/fr/docs/concepts/overview/working-with-objects/names/), les labels ne garantissent pas l'unicité. En général, nous nous attendons à ce que de nombreux objets portent les mêmes label(s).

Via un _sélecteur de label_, le client/utilisateur peut identifier un ensemble d'objets.
Le sélecteur de label est le principe de regroupement central dans Kubernetes.

L'API prend actuellement en charge deux types de sélecteurs : _basés sur l'égalité_ et _basés sur un ensemble_.
Un sélecteur de label peut être composé de plusieurs _exigences_ séparées par des virgules.
Dans le cas de plusieurs exigences, toutes doivent être satisfaites, donc le séparateur de virgule
agit comme un opérateur logique _ET_ (`&&`).

La signification des sélecteurs vides ou non spécifiés dépend du contexte,
et les types d'API qui utilisent des sélecteurs doivent documenter leur validité et leur signification.

{{< note >}}
Pour certains types d'API, tels que les ReplicaSets, les sélecteurs de labels de deux instances ne doivent pas se chevaucher dans un namespace, sinon le contrôleur peut considérer cela comme des instructions contradictoires et échouer à déterminer combien de répliques doivent être présentes.
{{< /note >}}

{{< caution >}}
Pour les conditions basées sur l'égalité et les conditions basées sur un ensemble, il n'y a pas d'opérateur logique _OU_ (`||`).
Assurez-vous que vos déclarations de filtre sont structurées en conséquence.
{{< /caution >}}
### Exigence basée sur l'égalité

Les exigences basées sur l'égalité ou l'inégalité permettent de filtrer par clés et valeurs de label.
Les objets correspondants doivent satisfaire toutes les contraintes de label spécifiées, bien qu'ils puissent également avoir des labels supplémentaires. Trois types d'opérateurs sont admis : `=`, `==`, `!=`.
Les deux premiers représentent l'égalité (et sont synonymes), tandis que le dernier représente l'inégalité.
Par exemple :

```
environment = production
tier != frontend
```
Le premier sélectionne toutes les ressources avec une clé égale à `environment` et une valeur égale à `production`.
Le second sélectionne toutes les ressources avec une clé égale à `tier` et une valeur différente de `frontend`,
ainsi que toutes les ressources sans labels avec la clé `tier`. On peut filtrer les ressources en `production`
en excluant `frontend` en utilisant l'opérateur virgule : `environment=production,tier!=frontend`

Un scénario d'utilisation pour une exigence de label basée sur l'égalité est de spécifier des critères de sélection de nœud pour les Pods. Par exemple, le Pod d'exemple ci-dessous sélectionne les nœuds où le label "accelerator" existe et est définie sur "nvidia-tesla-p100".

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```
### Exigence basée sur un ensemble

Les exigences basées sur un ensemble permettent de filtrer les clés en fonction d'un ensemble de valeurs.
Trois types d'opérateurs sont pris en charge : `in`, `notin` et `exists` (uniquement l'identifiant de clé).
Par exemple :

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

- Le premier exemple sélectionne toutes les ressources avec une clé égale à `environment` et une valeur égale à `production` ou `qa`.
- Le deuxième exemple sélectionne toutes les ressources avec une clé égale à `tier` et des valeurs autres que `frontend` et `backend`, ainsi que toutes les ressources sans labels avec la clé `tier`.
- Le troisième exemple sélectionne toutes les ressources incluant un label avec la clé `partition`; aucune valeur n'est vérifiée.
- Le quatrième exemple sélectionne toutes les ressources sans un label avec la clé `partition`; aucune valeur n'est vérifiée.

De même, le séparateur virgule agit comme un opérateur _ET_. Ainsi, pour filtrer les ressources avec une clé `partition` (peu importe la valeur) et avec `environment` différent de `qa`, vous pouvez utiliser `partition,environment notin (qa)`. Le sélecteur de label basé sur un ensemble est une forme générale d'égalité, car `environment=production` est équivalent à `environment in (production)`; de même pour `!=` et `notin`.

Les exigences basées sur un ensemble peuvent être mélangées avec des exigences basées sur l'égalité. Par exemple: `partition in (customerA, customerB),environment!=qa`.


## API

### Filtrage LIST et WATCH

Pour les opérations **list** et **watch**, vous pouvez spécifier des sélecteurs de labels pour filtrer les ensembles d'objets retournés ; vous spécifiez le filtre à l'aide d'un paramètre de requête.
(Pour en savoir plus en détail sur les watches dans Kubernetes, lisez [détection efficace des changements](/fr/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)).
Les deux types d'exigences sont autorisés
(présentés ici tels qu'ils apparaîtraient dans une chaîne de requête d'URL) :

* exigences basées sur l'égalité : `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* exigences basées sur un ensemble : `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Les deux styles de sélecteurs de labels peuvent être utilisés pour lister ou surveiller des ressources via un client REST.
Par exemple, en ciblant `apiserver` avec `kubectl` et en utilisant une exigence basée sur l'égalité, on peut écrire :

```shell
kubectl get pods -l environment=production,tier=frontend
```

ou en utilisant des exigences basées sur un ensemble :

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Comme déjà mentionné, les exigences basées sur un ensemble sont plus expressives.
Par exemple, elles peuvent implémenter l'opérateur _OU_ sur les valeurs :

```shell
kubectl get pods -l 'environment in (production, qa)'
```

ou restreindre la correspondance négative via l'opérateur _notin_ :

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```
### Définir des références dans les objets API

Certains objets Kubernetes, tels que les [`services`](/fr/docs/concepts/services-networking/service/) et les [`replicationcontrollers`](/fr/docs/concepts/workloads/controllers/replicationcontroller/), utilisent également des sélecteurs de labels pour spécifier des ensembles d'autres ressources, telles que les [pods](/fr/docs/concepts/workloads/pods/).

#### Service et ReplicationController

L'ensemble des pods ciblés par un `service` est défini avec un sélecteur de labels.
De même, la population de pods qu'un `replicationcontroller` doit gérer est également définie avec un sélecteur de labels.

Les sélecteurs de labels pour ces deux objets sont définis dans des fichiers `json` ou `yaml` en utilisant des maps,
et seules les exigences basées sur l'égalité sont prises en charge :

```json
"selector": {
    "component" : "redis",
}
```

ou

```yaml
selector:
  component: redis
```

Ce sélecteur (respectivement au format `json` ou `yaml`) est équivalent à `component=redis` ou `component in (redis)`.

#### Ressources prenant en charge les exigences basées sur un ensemble

Les nouvelles ressources, telles que [`Job`](/fr/docs/concepts/workloads/controllers/job/),
[`Deployment`](/fr/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/fr/docs/concepts/workloads/controllers/replicaset/) et
[`DaemonSet`](/fr/docs/concepts/workloads/controllers/daemonset/),
prennent également en charge les exigences basées sur un ensemble.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

`matchLabels` est une carte de paires `{clé, valeur}`. Une seule paire `{clé, valeur}` dans la carte `matchLabels` est équivalente à un élément de `matchExpressions`, dont le champ `key` est "clé", l'opérateur est "In" et le tableau `values` contient uniquement "valeur". `matchExpressions` est une liste d'exigences de sélecteur de pod. Les opérateurs valides incluent In, NotIn, Exists et DoesNotExist. Les ensembles de valeurs doivent être non vides dans le cas de In et NotIn. Toutes les exigences, à la fois de `matchLabels` et de `matchExpressions`, sont combinées avec un ET -- elles doivent toutes être satisfaites pour correspondre.


#### Sélection de jeux de nœuds

Un cas d'utilisation pour la sélection basée sur les labels est de restreindre l'ensemble des nœuds sur lesquels un pod peut être planifié. Consultez la documentation sur la [sélection de nœuds](/fr/docs/concepts/scheduling-eviction/assign-pod-node/) pour plus d'informations.

## Utilisation efficace des labels

Vous pouvez appliquer un seul label à n'importe quelle ressource, mais ce n'est pas toujours la meilleure pratique. Il existe de nombreux scénarios où plusieurs labels doivent être utilisés pour distinguer des ensembles de ressources les uns des autres.

Par exemple, différentes applications utiliseraient des valeurs différentes pour le label `app`, mais une application multi-niveaux, telle que l'exemple [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/), aurait également besoin de distinguer chaque niveau. Le frontend pourrait avoir les labels suivants:

```yaml
labels:
  app: guestbook
  tier: frontend
```

while the Redis master and replica would have different `tier` labels, and perhaps even an
additional `role` label:

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

and

```yaml
labels:
  app: guestbook
  tier: backend
  role: replica
```
Les labels permettent de découper les ressources selon n'importe quelle dimension spécifiée par un label :

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

## Mise à jour des labels

Parfois, vous souhaiterez renommer les pods existants et d'autres ressources avant de créer de nouvelles ressources. Cela peut être fait avec `kubectl label`.
Par exemple, si vous souhaitez étiqueter tous vos pods NGINX en tant que niveau frontend, exécutez :

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Ce premier filtre tous les pods avec le label "app=nginx", puis les labels avec "tier=fe".
Pour voir les pods que vous avez étiquetés, exécutez :

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Cela affiche tous les pods "app=nginx", avec une colonne de label supplémentaire pour le niveau des pods (spécifié avec `-L` ou `--label-columns`).

Pour plus d'informations, veuillez consulter [kubectl label](/fr/docs/reference/generated/kubectl/kubectl-commands/#label).


## {{% heading "whatsnext" %}}

- Apprenez comment [ajouter un label à un nœud](/fr/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- Trouvez des informations sur les [labels, annotations et taints bien connus](/fr/docs/reference/labels-annotations-taints/)
- Consultez les [labels recommandés](/fr/docs/concepts/overview/working-with-objects/common-labels/)
- [Appliquez les normes de sécurité des pods avec des labels de namespace](/fr/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- Lisez un blog sur [l'écriture d'un contrôleur pour les labels de pod](/fr/blog/2021/06/21/writing-a-controller-for-pod-labels/)

