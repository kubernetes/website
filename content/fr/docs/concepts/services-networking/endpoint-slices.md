---
reviewers:
- freehan
title: EndpointSlices
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  L'API EndpointSlice est le mécanisme que Kubernetes utilise pour permettre à votre Service
  de passer à l'échelle et de gérer un grand nombre de backends, et elle permet au cluster
  de mettre à jour efficacement sa liste de backends sains.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

{{< glossary_definition term_id="endpoint-slice" length="short" >}}

<!-- body -->

## API EndpointSlice {#endpointslice-resource}

Dans Kubernetes, un EndpointSlice contient des références à un ensemble de points
de terminaison réseau. Le plan de contrôle crée automatiquement des EndpointSlices
pour tout Service Kubernetes pour lequel un {{< glossary_tooltip text="sélecteur"
term_id="selector" >}} est spécifié. Ces EndpointSlices contiennent des
références à tous les Pods qui correspondent au sélecteur du Service. Les EndpointSlices
regroupent les points de terminaison réseau par combinaison unique de famille d'adresses IP,
de protocole, de numéro de port et de nom de Service.
Le nom d'un objet EndpointSlice doit être un
[nom de sous-domaine DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) valide.

Voici par exemple un objet EndpointSlice dont le propriétaire est le Service Kubernetes
`example`.

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

Par défaut, le plan de contrôle crée et gère des EndpointSlices qui ne contiennent
pas plus de 100 points de terminaison chacun. Vous pouvez modifier cette valeur avec l'option
`--max-endpoints-per-slice` de
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}},
jusqu'à un maximum de 1000.

Les EndpointSlices constituent la source de vérité de
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} pour déterminer
comment acheminer le trafic interne.

### Types d'adresses {#address-types}

Les EndpointSlices prennent en charge deux types d'adresses :

* IPv4
* IPv6

Chaque objet `EndpointSlice` correspond à un type d'adresse IP précis. Si vous avez
un Service accessible en IPv4 et en IPv6, il existera au moins deux objets
`EndpointSlice` (un pour IPv4 et un pour IPv6).

### Conditions {#conditions}

L'API EndpointSlice enregistre, pour les points de terminaison, des conditions qui peuvent être utiles à ses consommateurs.
Les trois conditions sont `serving`, `terminating` et `ready`.

#### Serving {#serving}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

La condition `serving` indique que le point de terminaison répond actuellement aux requêtes, et
qu'il devrait donc être utilisé comme cible pour le trafic du Service. Pour les points de terminaison
adossés à un Pod, elle correspond à la condition `Ready` du Pod.

#### Terminating {#terminating}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

La condition `terminating` indique que le point de terminaison est
en cours d'arrêt. Pour les points de terminaison adossés à un Pod, cette condition est définie
dès que la suppression du Pod est demandée (c'est-à-dire lorsqu'il reçoit un horodatage
de suppression, mais très probablement avant que les conteneurs du Pod ne s'arrêtent).

Les proxys de Service ignorent normalement les points de terminaison marqués `terminating`,
mais ils peuvent acheminer le trafic vers des points de terminaison à la fois `serving` et
`terminating` si tous les points de terminaison disponibles sont marqués `terminating`. (Cela
contribue à garantir qu'aucun trafic du Service n'est perdu pendant les mises à jour progressives
des Pods sous-jacents.)

#### Ready {#ready}

La condition `ready` est essentiellement un raccourci pour vérifier
« `serving` et non `terminating` » (elle vaut toutefois toujours
`true` pour les Services dont `spec.publishNotReadyAddresses` est défini sur
`true`).

### Informations de topologie {#topology}

Chaque point de terminaison d'un EndpointSlice peut contenir des informations de topologie pertinentes.
Ces informations comprennent l'emplacement du point de terminaison ainsi que des informations
sur le nœud et la zone correspondants. Elles sont disponibles dans les champs suivants,
propres à chaque point de terminaison d'un EndpointSlice :

* `nodeName` : le nom du nœud sur lequel se trouve ce point de terminaison.
* `zone` : la zone dans laquelle se trouve ce point de terminaison.

### Gestion {#management}

Le plus souvent, c'est le plan de contrôle (plus précisément, le
{{< glossary_tooltip text="contrôleur" term_id="controller" >}} d'EndpointSlices) qui crée et
gère les objets EndpointSlice. Les EndpointSlices ont de nombreux autres cas d'usage,
comme les implémentations de service mesh, qui peuvent amener d'autres entités
ou contrôleurs à gérer des ensembles supplémentaires d'EndpointSlices.

Pour que plusieurs entités puissent gérer des EndpointSlices sans se gêner
mutuellement, Kubernetes définit le
{{< glossary_tooltip term_id="label" text="label" >}}
`endpointslice.kubernetes.io/managed-by`, qui indique l'entité qui gère
un EndpointSlice.
Le contrôleur d'EndpointSlices attribue la valeur `endpointslice-controller.k8s.io`
à ce label sur tous les EndpointSlices qu'il gère. Les autres entités qui gèrent
des EndpointSlices doivent elles aussi attribuer une valeur unique à ce label.

### Propriété {#ownership}

Dans la plupart des cas d'usage, le propriétaire d'un EndpointSlice est le Service dont
l'objet EndpointSlice suit les points de terminaison. Cette propriété est indiquée par une référence
de propriétaire (owner reference) sur chaque EndpointSlice, ainsi que par un label
`kubernetes.io/service-name` qui permet de retrouver simplement tous les EndpointSlices
d'un Service.

### Répartition des EndpointSlices {#distribution-of-endpointslices}

Chaque EndpointSlice possède un ensemble de ports qui s'applique à tous les points de terminaison
de la ressource. Lorsqu'un Service utilise des ports nommés, les Pods peuvent se retrouver avec
des numéros de port cible différents pour un même port nommé, ce qui nécessite des
EndpointSlices distincts.

Le plan de contrôle essaie de remplir les EndpointSlices autant que possible, mais ne
les rééquilibre pas activement. La logique est assez simple :

1. Parcourir les EndpointSlices existants, retirer les points de terminaison qui ne sont plus
   souhaités et mettre à jour les points de terminaison correspondants qui ont changé.
2. Parcourir les EndpointSlices modifiés lors de la première étape et
   les compléter avec les nouveaux points de terminaison nécessaires.
3. S'il reste encore de nouveaux points de terminaison à ajouter, essayer de les placer dans un
   EndpointSlice resté inchangé et/ou en créer de nouveaux.

Point important : la troisième étape privilégie la limitation des mises à jour d'EndpointSlices
plutôt qu'un remplissage optimal des EndpointSlices. Par exemple, s'il y a 10
nouveaux points de terminaison à ajouter et 2 EndpointSlices pouvant chacun en accueillir 5 de plus,
cette approche créera un nouvel EndpointSlice au lieu de remplir les 2
EndpointSlices existants. Autrement dit, une seule création d'EndpointSlice est
préférable à plusieurs mises à jour d'EndpointSlices.

Comme kube-proxy s'exécute sur chaque nœud et surveille les EndpointSlices, chaque modification
d'un EndpointSlice devient relativement coûteuse, puisqu'elle est transmise à
chaque nœud du cluster. Cette approche vise à limiter le nombre de
modifications à envoyer à chaque nœud, même si elle peut aboutir à plusieurs
EndpointSlices partiellement remplis.

En pratique, cette répartition moins qu'idéale devrait être rare. La plupart des modifications
traitées par le contrôleur d'EndpointSlices sont suffisamment petites pour tenir dans un
EndpointSlice existant ; dans le cas contraire, un nouvel EndpointSlice sera de toute façon
probablement nécessaire bientôt. Les mises à jour progressives des Deployments entraînent
aussi un réagencement naturel des EndpointSlices, puisque tous les Pods et leurs points de terminaison
correspondants sont remplacés.

### Points de terminaison en double {#duplicate-endpoints}

En raison de la nature des modifications d'EndpointSlices, un point de terminaison peut figurer dans
plusieurs EndpointSlices en même temps. Cela se produit naturellement, car les modifications de
différents objets EndpointSlice peuvent parvenir au watch / cache du client Kubernetes
à des moments différents.

{{< note >}}
Les clients de l'API EndpointSlice doivent parcourir tous les EndpointSlices existants
associés à un Service et construire une liste complète de points de terminaison réseau uniques.
Il est important de noter que des points de terminaison peuvent être dupliqués dans différents EndpointSlices.

Vous trouverez une implémentation de référence de cette agrégation et de cette
déduplication des points de terminaison dans le code `EndpointSliceCache` de `kube-proxy`.
{{< /note >}}

### Mise en miroir des EndpointSlices {#endpointslice-mirroring}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

L'API EndpointSlice remplace l'ancienne API Endpoints. Pour
préserver la compatibilité avec les anciens contrôleurs et les charges de travail des utilisateurs qui
s'attendent à ce que {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}}
achemine le trafic à partir des ressources Endpoints, le plan de contrôle du cluster
reproduit (en miroir) la plupart des ressources Endpoints créées par les utilisateurs
dans des EndpointSlices correspondants.

(Cette fonctionnalité est toutefois dépréciée, comme le reste de l'API Endpoints.
Les utilisateurs qui définissent manuellement des points de terminaison pour des Services
sans sélecteur doivent le faire en créant directement des ressources EndpointSlice,
plutôt qu'en créant des ressources Endpoints et en laissant le plan de contrôle les reproduire en miroir.)

Le plan de contrôle reproduit les ressources Endpoints en miroir, sauf si :

* la ressource Endpoints a un label `endpointslice.kubernetes.io/skip-mirror`
  défini sur `true` ;
* la ressource Endpoints a une annotation `control-plane.alpha.kubernetes.io/leader` ;
* la ressource Service correspondante n'existe pas ;
* la ressource Service correspondante a un sélecteur non nul.

Une même ressource Endpoints peut donner lieu à plusieurs EndpointSlices. C'est le
cas si une ressource Endpoints comporte plusieurs sous-ensembles (subsets) ou contient des points
de terminaison de plusieurs familles d'adresses IP (IPv4 et IPv6). Au maximum 1000 adresses par
sous-ensemble sont reproduites dans les EndpointSlices.

## {{% heading "whatsnext" %}}

* Suivre le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/)
* Lire la [référence de l'API](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) EndpointSlice
* Lire la [référence de l'API](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) Endpoints
