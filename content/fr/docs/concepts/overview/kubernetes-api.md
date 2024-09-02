---
title: L'API Kubernetes
content_type: concept
weight: 40
description: >
  L'API Kubernetes vous permet d'interroger et de manipuler l'état des objets dans Kubernetes.
  Le cœur du plan de contrôle de Kubernetes est le serveur API et l'API HTTP qu'il expose. Les utilisateurs, les différentes parties de votre cluster et les composants externes communiquent tous entre eux via le serveur API.
card:
  name: concepts
  weight: 30
---

<!-- aperçu -->

Le cœur du {{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}} de Kubernetes
est le {{< glossary_tooltip text="serveur API" term_id="kube-apiserver" >}}. Le serveur API
expose une API HTTP qui permet aux utilisateurs finaux, aux différentes parties de votre cluster et
aux composants externes de communiquer entre eux.

L'API Kubernetes vous permet d'interroger et de manipuler l'état des objets API dans Kubernetes
(par exemple : Pods, Namespaces, ConfigMaps et Events).

La plupart des opérations peuvent être effectuées via l'interface de ligne de commande [kubectl](/docs/reference/kubectl/)
ou d'autres outils en ligne de commande, tels que
[kubeadm](/docs/reference/setup-tools/kubeadm/), qui utilisent à leur tour l'API.
Cependant, vous pouvez également accéder à l'API directement en utilisant des appels REST. Kubernetes
fournit un ensemble de [bibliothèques clientes](/docs/reference/using-api/client-libraries/)
pour ceux qui souhaitent écrire des applications utilisant l'API Kubernetes.

Chaque cluster Kubernetes publie la spécification des API qu'il sert.
Il existe deux mécanismes que Kubernetes utilise pour publier ces spécifications d'API ; les deux sont utiles
pour permettre une interopérabilité automatique. Par exemple, l'outil `kubectl` récupère et met en cache l'API
spécification pour activer l'auto-complétion en ligne de commande et d'autres fonctionnalités.
Les deux mécanismes pris en charge sont les suivants :

- [L'API Discovery](#discovery-api) fournit des informations sur les API Kubernetes :
  noms des API, ressources, versions et opérations prises en charge. Il s'agit d'un terme spécifique à Kubernetes car il s'agit d'une API distincte de l'API OpenAPI de Kubernetes.
  Il est destiné à être un bref résumé des ressources disponibles et il ne détaille pas
  le schéma spécifique des ressources. Pour des références sur les schémas de ressources,
  veuillez vous référer au document OpenAPI.

- Le [document OpenAPI de Kubernetes](#openapi-interface-definition) fournit des schémas (complets)
  [OpenAPI v2.0 et 3.0](https://www.openapis.org/) pour tous les points d'extrémité de l'API Kubernetes.
  L'OpenAPI v3 est la méthode préférée pour accéder à l'OpenAPI car il
  offre une vue plus complète et précise de l'API. Il inclut tous les chemins d'API disponibles,
  ainsi que toutes les ressources consommées et produites pour chaque opération
  sur chaque point d'extrémité. Il inclut également les composants d'extensibilité pris en charge par un cluster.
  Les données sont une spécification complète et sont significativement plus grandes que celles de l'API Discovery.

## API Discovery

Kubernetes publie une liste de toutes les versions de groupe et de toutes les ressources prises en charge via
l'API Discovery. Cela inclut les éléments suivants pour chaque ressource :

- Nom
- Portée du cluster ou du namespace
- URL de l'endpoint et verbes pris en charge
- Noms alternatifs
- Groupe, version, type

L'API est disponible sous forme agrégée et non agrégée. La découverte agrégée
propose deux endpoints tandis que la découverte non agrégée propose un
endpoint distinct pour chaque version de groupe.

### Découverte agrégée

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

Kubernetes propose une prise en charge stable de la _découverte agrégée_, publiant
toutes les ressources prises en charge par un cluster via deux endpoints (`/api` et
`/apis`). En demandant cela,
l'endpoint réduit considérablement le nombre de requêtes envoyées pour récupérer les
données de découverte du cluster. Vous pouvez accéder aux données en
demandant les endpoints respectifs avec un en-tête `Accept` indiquant
la ressource de découverte agrégée :
`Accept: application/json;v=v2;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

Sans indiquer le type de ressource à l'aide de l'en-tête `Accept`, la réponse par défaut
pour les endpoints `/api` et `/apis` est un document de découverte non agrégé.

Le [document de découverte](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2beta1.json)
pour les ressources intégrées peut être trouvé dans le référentiel GitHub de Kubernetes.
Ce document GitHub peut être utilisé comme référence pour l'ensemble de base des ressources disponibles
si un cluster Kubernetes n'est pas disponible pour la requête.

L'endpoint prend également en charge l'ETag et l'encodage protobuf.

### Découverte non agrégée

Sans agrégation de découverte, la découverte est publiée par niveaux, avec les endpoints racine
publiant les informations de découverte pour les documents en aval.

Une liste de toutes les versions de groupe prises en charge par un cluster est publiée à
les endpoints `/api` et `/apis`. Exemple :

```
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
}
```

Des requêtes supplémentaires sont nécessaires pour obtenir le document de découverte pour chaque version de groupe à
`/apis/<group>/<version>` (par exemple :
`/apis/rbac.authorization.k8s.io/v1alpha1`), qui annonce la liste des
ressources servies sous une version de groupe particulière. Ces endpoints sont utilisés par
kubectl pour récupérer la liste des ressources prises en charge par un cluster.

<!-- body -->

<a id="#api-specification" />

## Définition de l'interface OpenAPI

Pour plus de détails sur les spécifications OpenAPI, consultez la [documentation OpenAPI](https://www.openapis.org/).

Kubernetes prend en charge à la fois OpenAPI v2.0 et OpenAPI v3.0. OpenAPI v3 est
la méthode préférée pour accéder à l'OpenAPI car elle offre une représentation plus complète
(sans perte) des ressources Kubernetes. En raison des limitations de la version 2 d'OpenAPI, certains champs sont supprimés de l'OpenAPI publié, y compris mais sans s'y limiter `default`, `nullable`, `oneOf`.
### OpenAPI V2

Le serveur API Kubernetes sert une spécification OpenAPI v2 agrégée via
l'endpoint `/openapi/v2`. Vous pouvez demander le format de réponse en utilisant
les en-têtes de requête comme suit :

<table>
  <caption style="display:none">Valeurs valides des en-têtes de requête pour les requêtes OpenAPI v2</caption>
  <thead>
     <tr>
        <th>En-tête</th>
        <th style="min-width: 50%;">Valeurs possibles</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>ne pas fournir cet en-tête est également acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>principalement pour une utilisation intra-cluster</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>par défaut</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>sert </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>


### OpenAPI V3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

Kubernetes prend en charge la publication d'une description de ses API en tant qu'OpenAPI v3.

Un endpoint de découverte `/openapi/v3` est fourni pour voir une liste de tous les
groupes/versions disponibles. Cet endpoint ne renvoie que du JSON. Ces
groupes/versions sont fournis dans le format suivant :

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

Les URLs relatives pointent vers des descriptions OpenAPI immuables, afin
d'améliorer la mise en cache côté client. Les en-têtes de mise en cache HTTP appropriés
sont également définis par le serveur API à cette fin (`Expires` à 1 an dans
le futur, et `Cache-Control` à `immutable`). Lorsqu'une URL obsolète est
utilisée, le serveur API renvoie une redirection vers la nouvelle URL.

Le serveur API Kubernetes publie une spécification OpenAPI v3 par version de groupe Kubernetes à l'endpoint `/openapi/v3/apis/<group>/<version>?hash=<hash>`.

Reportez-vous au tableau ci-dessous pour les en-têtes de requête acceptés.

<table>
  <caption style="display:none">Valeurs valides des en-têtes de requête pour les requêtes OpenAPI v3</caption>
  <thead>
     <tr>
        <th>En-tête</th>
        <th style="min-width: 50%;">Valeurs possibles</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>ne pas fournir cet en-tête est également acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>principalement pour une utilisation intra-cluster</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>par défaut</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>sert </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

Une implémentation en Golang pour récupérer l'OpenAPI V3 est fournie dans le package
[`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3).

Kubernetes {{< skew currentVersion >}} publie
OpenAPI v2.0 et v3.0 ; il n'y a pas de plans pour prendre en charge la version 3.1 dans un avenir proche.

### Sérialisation Protobuf

Kubernetes implémente un format de sérialisation alternatif basé sur Protobuf qui
est principalement destiné à la communication intra-cluster. Pour plus d'informations
sur ce format, consultez la proposition de conception [Kubernetes Protobuf serialization](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md)
et les fichiers de langage de définition d'interface (IDL) pour chaque schéma situés dans les packages Go
qui définissent les objets de l'API.

## Persistance

Kubernetes stocke l'état sérialisé des objets en les écrivant dans
{{< glossary_tooltip term_id="etcd" >}}.

## Groupes d'API et versioning

Pour faciliter l'élimination de champs ou la restructuration des représentations de ressources,
Kubernetes prend en charge plusieurs versions d'API, chacune à un chemin d'API différent, tel que `/api/v1` ou `/apis/rbac.authorization.k8s.io/v1alpha1`.

Le versioning est effectué au niveau de l'API plutôt qu'au niveau de la ressource ou du champ
pour garantir que l'API présente une vue claire et cohérente des ressources et du comportement du système, et pour permettre de contrôler l'accès aux API en fin de vie et/ou expérimentales.

Pour faciliter l'évolution et l'extension de son API, Kubernetes implémente
[des groupes d'API](/docs/reference/using-api/#api-groups) qui peuvent être
[activés ou désactivés](/docs/reference/using-api/#enabling-or-disabling).

Les ressources de l'API sont distinguées par leur groupe d'API, leur type de ressource, leur namepaces
(pour les ressources avec namespace) et leur nom. Le serveur API gère la conversion entre
les versions d'API de manière transparente : toutes les différentes versions sont en réalité des représentations
des mêmes données persistées. Le serveur API peut servir les mêmes données sous plusieurs versions d'API.

Par exemple, supposons qu'il existe deux versions d'API, `v1` et `v1beta1`, pour la même
ressource. Si vous avez initialement créé un objet en utilisant la version `v1beta1` de son
API, vous pouvez ensuite lire, mettre à jour ou supprimer cet objet en utilisant soit la version `v1beta1`
soit la version `v1` de l'API, jusqu'à ce que la version `v1beta1` soit dépréciée et supprimée.
À ce moment-là, vous pouvez continuer à accéder et à modifier l'objet en utilisant l'API `v1`.

### Changements d'API

Tout système qui réussit doit évoluer et changer à mesure que de nouveaux cas d'utilisation émergent ou que les cas d'utilisation existants changent.
Par conséquent, Kubernetes a conçu l'API Kubernetes pour changer et évoluer en permanence.
Le projet Kubernetes vise à _ne pas_ rompre la compatibilité avec les clients existants et à maintenir cette
compatibilité pendant une certaine période afin que d'autres projets aient l'opportunité de s'adapter.

En général, de nouvelles ressources d'API et de nouveaux champs de ressources peuvent être ajoutés souvent et fréquemment.
L'élimination de ressources ou de champs nécessite de suivre la
[politique de dépréciation de l'API](/docs/reference/using-api/deprecation-policy/).

Kubernetes s'engage fermement à maintenir la compatibilité avec les API Kubernetes officielles
une fois qu'elles atteignent la disponibilité générale (GA), généralement à la version d'API `v1`. De plus,
Kubernetes maintient la compatibilité avec les données persistées via les versions d'API _beta_ des API Kubernetes officielles,
et garantit que les données peuvent être converties et accessibles via les versions d'API GA lorsque la fonctionnalité devient stable.

Si vous adoptez une version d'API beta, vous devrez passer à une version d'API beta ou stable ultérieure
une fois que l'API aura été promue. Le meilleur moment pour le faire est pendant la période de dépréciation de l'API beta,
car les objets sont accessibles simultanément via les deux versions d'API. Une fois que l'API beta a terminé sa
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
La compatibilité est un élément essentiel dans l'évolution de l'API Kubernetes. De nouvelles ressources et de nouveaux champs peuvent être ajoutés fréquemment, tandis que la suppression de ressources ou de champs nécessite de suivre la politique de dépréciation de l'API.

{{< note >}}
Bien que Kubernetes vise également à maintenir la compatibilité des versions _alpha_ des API, dans certaines circonstances, cela n'est pas possible. Si vous utilisez des versions d'API alpha, consultez les notes de version de Kubernetes lors de la mise à niveau de votre cluster, au cas où l'API aurait changé de manière incompatible, ce qui nécessite la suppression de tous les objets alpha existants avant la mise à niveau.
{{< /note >}}

Consultez la [référence des versions d'API](/docs/reference/using-api/#api-versioning)
pour plus de détails sur les définitions de niveau de version d'API.

## Extension d'API

L'API Kubernetes peut être étendue de deux manières :

1. Les [ressources personnalisées](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  vous permettent de définir de manière déclarative comment le serveur API doit fournir votre API de ressource choisie.
1. Vous pouvez également étendre l'API Kubernetes en implémentant une
  [couche d'agrégation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Apprenez comment étendre l'API Kubernetes en ajoutant votre propre
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Contrôler l'accès à l'API Kubernetes](/docs/concepts/security/controlling-access/) décrit
  comment le cluster gère l'authentification et l'autorisation pour l'accès à l'API.
- Apprenez-en davantage sur les points de terminaison de l'API, les types de ressources et les exemples en lisant
  [Référence de l'API](/docs/reference/kubernetes-api/).
- Apprenez ce qui constitue un changement compatible et comment modifier l'API à partir de
  [Changements d'API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).

