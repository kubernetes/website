---
reviewers:
- remyleone
- feloy
- rekcah78
- rbenzair
title: Routage tenant compte de la topologie
content_type: concept
weight: 100
description: >-
  Le _routage tenant compte de la topologie_ (Topology Aware Routing) fournit un mécanisme
  qui aide à garder le trafic réseau dans sa zone d'origine. Privilégier le trafic
  dans la même zone entre les Pods de votre cluster peut améliorer la fiabilité, les
  performances (latence et débit réseau) ou réduire les coûts.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
Avant Kubernetes 1.27, cette fonctionnalité s'appelait _Topology Aware Hints_.
{{</ note >}}

Le _routage tenant compte de la topologie_ adapte le comportement du routage pour
garder de préférence le trafic dans sa zone d'origine. Dans certains cas,
cela peut réduire les coûts ou améliorer les performances réseau.

<!-- body -->

## Motivation {#motivation}

Les clusters Kubernetes sont de plus en plus souvent déployés dans des
environnements multizones. Le _routage tenant compte de la topologie_ fournit un
mécanisme qui aide à garder le trafic dans sa zone d'origine. Lorsqu'il
calcule les points de terminaison d'un {{<
glossary_tooltip term_id="Service" >}}, le contrôleur EndpointSlice tient compte
de la topologie (région et zone) de chaque point de terminaison et renseigne le
champ `hints` (indications) pour l'attribuer à une zone. Les composants du
cluster, comme {{< glossary_tooltip
term_id="kube-proxy" text="kube-proxy" >}}, peuvent ensuite utiliser ces
indications pour orienter le routage du trafic (en privilégiant les points de
terminaison topologiquement les plus proches).

## Activer le routage tenant compte de la topologie {#enabling-topology-aware-routing}

{{< note >}}
Avant Kubernetes 1.27, ce comportement était contrôlé par l'annotation
`service.kubernetes.io/topology-aware-hints`.
{{</ note >}}

Vous pouvez activer le routage tenant compte de la topologie pour un Service en
définissant l'annotation `service.kubernetes.io/topology-mode` sur `Auto`.
Lorsque chaque zone dispose de suffisamment de points de terminaison
disponibles, des indications de topologie sont ajoutées aux EndpointSlices pour attribuer chaque
point de terminaison à une zone précise. Le trafic est alors acheminé plus près
de son origine.

## Quand cela fonctionne le mieux {#when-it-works-best}

Cette fonctionnalité donne les meilleurs résultats lorsque :

### 1. Le trafic entrant est réparti uniformément {#1-incoming-traffic-is-evenly-distributed}

Si une grande partie du trafic provient d'une seule zone, ce trafic risque de
surcharger le sous-ensemble de points de terminaison attribués à cette zone.
Cette fonctionnalité est déconseillée lorsque le trafic entrant est censé
provenir d'une seule zone.

### 2. Le Service a au moins 3 points de terminaison par zone {#three-or-more-endpoints-per-zone}
Dans un cluster à trois zones, cela représente au moins 9 points de terminaison.
Avec moins de 3 points de terminaison par zone, il y a une forte probabilité
(environ 50 %) que le contrôleur EndpointSlice ne parvienne pas à répartir les
points de terminaison de manière équilibrée et se rabatte sur le routage par
défaut à l'échelle du cluster.

## Fonctionnement {#how-it-works}

L'heuristique « Auto » tente d'attribuer à chaque zone un nombre de points de
terminaison proportionnel. Cette heuristique donne de meilleurs résultats pour
les Services qui ont un nombre important de points de terminaison.

### Contrôleur EndpointSlice {#implementation-control-plane}

Le contrôleur EndpointSlice est chargé de définir les indications sur les
EndpointSlices lorsque cette heuristique est activée. Le contrôleur attribue à
chaque zone une part proportionnelle des points de terminaison. Cette proportion
dépend du nombre de cœurs CPU
[allouables](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
des nœuds de cette zone. Par exemple, si une zone dispose de 2 cœurs CPU et
une autre d'un seul, le contrôleur attribuera deux fois plus de points de
terminaison à la zone qui dispose de 2 cœurs.

L'exemple suivant montre un EndpointSlice dont les indications ont été
renseignées :

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-hints
  labels:
    kubernetes.io/service-name: example-svc
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
    zone: zone-a
    hints:
      forZones:
        - name: "zone-a"
```

### kube-proxy {#implementation-kube-proxy}

Le composant kube-proxy filtre les points de terminaison vers lesquels il
achemine le trafic en fonction des indications définies par le contrôleur EndpointSlice. Dans
la plupart des cas, kube-proxy peut ainsi acheminer le trafic vers des points de
terminaison de la même zone. Il arrive que le contrôleur attribue des points de
terminaison d'une autre zone pour mieux équilibrer leur répartition entre les
zones. Une partie du trafic est alors acheminée vers d'autres zones.

## Garde-fous {#safeguards}

Le plan de contrôle de Kubernetes et le kube-proxy de chaque nœud appliquent
certains garde-fous avant d'utiliser les indications de topologie. Si
l'un d'eux n'est pas respecté, kube-proxy choisit des points de terminaison
n'importe où dans le cluster, quelle que soit la zone.

1. **Nombre insuffisant de points de terminaison :** s'il y a moins de points de
   terminaison que de zones dans le cluster, le contrôleur n'attribue aucune
   indication.

2. **Répartition équilibrée impossible :** dans certains cas, il est impossible
   de répartir les points de terminaison de manière équilibrée entre les zones.
   Par exemple, si la zone-a est deux fois plus grande que la zone-b mais qu'il
   n'y a que 2 points de terminaison, celui attribué à la zone-a risque de
   recevoir deux fois plus de trafic que celui de la zone-b. Le contrôleur
   n'attribue pas d'indications s'il ne parvient pas à ramener cette valeur de
   « surcharge estimée » sous un seuil acceptable pour chaque zone. À noter :
   ce calcul ne repose pas sur des mesures en temps réel. Un point de
   terminaison peut toujours se retrouver surchargé.

3. **Informations insuffisantes sur un ou plusieurs nœuds :** si un nœud n'a pas
   de label `topology.kubernetes.io/zone` ou ne remonte pas de valeur de CPU
   allouable, le plan de contrôle ne définit aucune indication de topologie sur
   les points de terminaison, et kube-proxy ne filtre donc pas les points de
   terminaison par zone.

4. **Un ou plusieurs points de terminaison n'ont pas d'indication de zone :**
   kube-proxy considère alors qu'un passage aux indications de topologie, ou
   leur abandon, est en cours. Filtrer les points de terminaison d'un Service
   dans cet état serait risqué : kube-proxy se rabat donc sur tous les points de
   terminaison.

5. **Une zone n'apparaît dans aucune indication :** si kube-proxy ne trouve
   aucun point de terminaison dont l'indication désigne la zone dans laquelle il
   s'exécute, il utilise les points de terminaison de toutes les zones. Cette
   situation se produit surtout lorsque vous ajoutez une nouvelle zone à un
   cluster existant.

## Contraintes {#constraints}

* Les indications de topologie ne sont pas utilisées lorsque `internalTrafficPolicy`
  vaut `Local` sur un Service. Les deux fonctionnalités peuvent coexister dans un
  même cluster sur des Services différents, mais pas sur le même Service.

* Cette approche fonctionne mal pour les Services dont une grande partie du
  trafic provient d'un sous-ensemble de zones. Elle suppose au contraire que le
  trafic entrant est à peu près proportionnel à la capacité des nœuds de chaque
  zone.

* Le contrôleur EndpointSlice ignore les nœuds qui ne sont pas prêts lorsqu'il
  calcule la part de chaque zone. Cela peut avoir des conséquences inattendues
  si une grande partie des nœuds ne sont pas prêts.

* Le contrôleur EndpointSlice ignore les nœuds qui portent le label
  `node-role.kubernetes.io/control-plane` ou `node-role.kubernetes.io/master`.
  Cela peut poser problème si des charges de travail s'exécutent aussi sur ces
  nœuds.

* Le contrôleur EndpointSlice ne tient pas compte des {{< glossary_tooltip
  text="tolérances" term_id="toleration" >}} lors du déploiement ni lors du
  calcul de la part de chaque zone. Si les Pods d'un Service sont limités à un
  sous-ensemble des nœuds du cluster, cela n'est pas pris en compte.

* Cela peut mal fonctionner avec la mise à l'échelle automatique. Par exemple,
  si une grande partie du trafic provient d'une seule zone, seuls les points de terminaison attribués
  à cette zone traiteront ce trafic. Il se peut alors que l'{{< glossary_tooltip
  text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}} ne
  détecte pas cette situation, ou que les nouveaux pods démarrent dans une autre
  zone.


## Heuristiques personnalisées {#custom-heuristics}

Kubernetes est déployé de bien des façons, et aucune heuristique unique
d'attribution des points de terminaison aux zones ne convient à tous les cas
d'usage. L'un des principaux objectifs de cette fonctionnalité est de permettre
le développement d'heuristiques personnalisées lorsque l'heuristique intégrée ne
convient pas à votre cas d'usage. Les premiers éléments permettant des
heuristiques personnalisées ont été intégrés dans la version 1.27. Il s'agit
d'une implémentation limitée, qui ne couvre peut-être pas encore certaines
situations pertinentes et plausibles.


## {{% heading "whatsnext" %}}

* Suivre le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/)
* Découvrir le champ
  [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution),
  étroitement lié à l'annotation `service.kubernetes.io/topology-mode`, qui offre
  des options souples pour le routage du trafic dans Kubernetes.
