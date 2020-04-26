---
reviewers: 
title: EndpointSlices
feature:
  title: EndpointSlices
  description: >
    Suivi évolutif des réseaux endpoints dans un cluster Kubernetes.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

_EndpointSlices_ offrent une méthode simple pour suivre les endpoints d'un réseau au sein d'un cluster de Kubernetes. Ils offrent une alternative plus evolutive et extensible aux Endpoints.

{{% /capture %}}

{{% capture body %}}

## Resource pour EndpointSlice {#endpointslice-resource}

Dans Kubernetes, un EndpointSlice contient des reférences à un ensemble de reseau 
endpoints. Le controleur d'EndpointSlice crée automatiquement des EndpointSlices pour un Kubernetes Service quand un {{< glossary_tooltip text="selecteur" term_id="selector" >}} est spécifié. Ces EnpointSlices vont inclure des references à n'importe quelle Pods qui correspond aux selecteur de Service. EndpointSlices groupent ensemble les endpoints d'un reseau par combinaisons uniques de Services et de Ports.

Par exemple, voici un échantillon d'une resource EndpointSlice pour le Kubernetes Service `exemple`.

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: exemple-abc
  labels:
    kubernetes.io/service-name: exemple
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
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

EndpointSlices geré par le controleur d'EndpointSlice n'auront, par défaut, pas plus de 100 endpoints chacun. En dessous de cette échelle, EndpointSlices devrait mapper 1:1 les Endpoints et les Service et devrait avoir une performance similaire.

EndpointSlices peuvent agir en tant que source de vérité pour kube-proxy quand it s'agit du routage d'un trafic interne. Lorsqu'ils sont activés, ils devraient offrir une amélioration de performance pour les services qui ont une grand quantité d'endpoints.

### Types d'addresses

EndpointSlices supporte trois type d'addresses:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name) - [serveur entièrement nommé]

### Topologie

Chaque endpoint dans un EnpointSlice peut contenir des informations de topologie pertinentes. 
Ceci est utilisé pour indiqué où se trouve un endpoint, qui contient les informations sur le Node, zone et region correspondante. Lorsque les valeurs sont disponibles, les étiquette de Topologies suivantes seront définies par le contrôleur EndpointSlice:

* `kubernetes.io/hostname` - Nom du Node sur lequel l'endpoint se situe.
* `topology.kubernetes.io/zone` - Zone dans laquelle l'endpoint se situe.
* `topology.kubernetes.io/region` - Region dans laquelle l'endpoint se situe.

Le contrôleur EndpointSlice surveille les Services et les Pods pour assurer que les correspondantes EndpointSlices sont mis-à-jour. Le contrôleur gèrera les EndpointSlices pour tout les Services qui ont un selecteur - [reference: {{< glossary_tooltip text="selecteur" term_id="selector" >}}] - specifié. Celles-ci representeront les IPs des Pods qui correspond au selecteur.

### Capacité d'EndpointSlices

Les EndpointSlices sont limités a une capacité de 100 endpoints chacun, par defaut. Vous pouvez configurer cela avec l'indicateur `--max-endpoints-per-slice` {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} jusqu'à un maximum de 1000.

### Distribution d'EndpointSlices

Chaque EndpointSlice a un ensemble de ports qui s'applique à toutes les endpoints dans la resource. Lorsque les ports nommés sont utilisés pour un Service, les Pods peuvent se retrouver avec différents port cible pour le même port nommé, nécessitant différents EndpointSlices. 

Le contrôleur essaie de remplir l'EndpointSlice aussi complètement que possible, mais ne les rééquilibre pas activement. La logique du contrôleur est assez simple:

1. Itérer à travers les EnpointSlices existantes, retirer les endpoints qui ne sont plus voulues et mettre à jour les endpoints qui ont changées.
2. Itérer à travers les EndpointSlices qui ont été modifiées dans la première étape et les remplir avec n'importe quelle endpoint nécéssaire.
3. Si il reste encore des endpoints neuves à ajouter, essayez de les mettre dans une slice qui n'a pas été changé et/ou en crée de nouvelles.

Par-dessus tout, la troisème étape priorise la limitation de mises à jour d'EnpointSlice sur une distribution complètement pleine d'EndpointSlices. Par exemple, si il y avait 10 nouvelles endpoints à ajouter et 2 EndpointSlices qui peuvent accomoder 5 endpoint en plus chacun; cette approche créera une nouvelle EndpointSlice au lieu de remplir les EndpointSlice existantes. C'est à dire, une seule création EndpointSlice est préférable à plusieurs mises à jour d'EndpointSlice.

Avec kube-proxy exécuté sur chaque Node et surveillant EndpointSlices, chaque changement a une EndpointSlice devient relativement coûteux puisqu'ils seront transmit à chaque Node du cluster. Cette approche vise à limiter le nombre de modifications qui doivent être envoyées à chaque Node, même si ça peut entraîner plusieurs EndpointSlices qui ne sont pas plein.

En pratique, cette distribution bien peu idéale devrait être rare. La plupart des changements traités par le contrôleur EndpointSlice sera suffisamment petit pour tenir dans un EndpointSlice existante, et sinon, une nouvelle EndpointSlice aura probablement été bientôt nécessaire de toute façon. Les mises à jour continues des déploiements fournissent également un remballage naturel des EndpointSlices avec tout leur pods et les endpoints correspondants qui se feront remplacer.

## Motivation

Les Endpoints API fournissent une méthode simple et facile à suivre pour les endpoint d'un réseau dans Kubernetes. Malheureusement, comme les clusters Kubernetes et Services sont devenus plus larges, les limitations de cette API sont devenues plus visibles. Plus particulièrement, ceux-ci comprenaient des défis liés au dimensionnement vers un plus grand nombre d'endpoint d'un réseau.

Puisque tous les endpoints d'un réseau pour un Service ont été stockés dans une seule ressource Endpoints, ces ressources pourraient devenir assez lourdes. Cela affecte les performances des composants Kubernetes (notamment le plan de contrôle) et a donné lieu à une grande quantité de trafic réseau et de traitement lorsque les Endpoints changent. Les EndpointSlices vous aident à atténuer ces problèmes ainsi qu'à fournir une plate-forme extensible pour des fonctionnalités supplémentaires telles que le routage topologique. 

{{% /capture %}}

{{% capture whatsnext %}}

* [Activer EndpointSlices](/docs/tasks/administer-cluster/enabling-endpointslices)
* Lire [Connecté des Application aux Services](/docs/concepts/services-networking/connect-applications-service/)

{{% /capture %}}