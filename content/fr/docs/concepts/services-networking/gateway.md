---
title: Gateway API
content_type: concept
description: >-
  Gateway API est une famille de types d'API qui fournissent un provisionnement dynamique
  de l'infrastructure et un routage avancé du trafic.
weight: 55
---

<!-- overview -->

Rendez des services réseau accessibles grâce à un mécanisme de configuration extensible, orienté
rôles et conscient des protocoles. [Gateway API](https://gateway-api.sigs.k8s.io/) est un {{<glossary_tooltip text="add-on" term_id="addons">}}
qui contient des [types](https://gateway-api.sigs.k8s.io/references/spec/) d'API fournissant un
provisionnement dynamique de l'infrastructure et un routage avancé du trafic.

<!-- body -->

## Principes de conception {#design-principles}

Les principes suivants ont guidé la conception et l'architecture de Gateway API :

* __Orientée rôles :__ les types de Gateway API sont modélisés d'après les rôles organisationnels
  chargés de gérer le réseau des services Kubernetes :
  * __Fournisseur d'infrastructure :__ gère une infrastructure qui permet à plusieurs clusters isolés
    de servir plusieurs locataires, par exemple un fournisseur de cloud.
  * __Opérateur de cluster :__ gère des clusters et s'occupe généralement des politiques, de l'accès
    réseau, des permissions des applications, etc.
  * __Développeur d'applications :__ gère une application qui s'exécute dans un cluster et s'occupe
    généralement de la configuration au niveau de l'application et de la composition des
    [Services](/docs/concepts/services-networking/service/).
* __Portable :__ les spécifications de Gateway API sont définies sous forme de [ressources personnalisées](/docs/concepts/extend-kubernetes/api-extension/custom-resources)
  et sont prises en charge par de nombreuses [implémentations](https://gateway-api.sigs.k8s.io/implementations/).
* __Expressive :__ les types de Gateway API prennent en charge des fonctionnalités couvrant les cas
  d'usage courants de routage du trafic, comme la correspondance sur les en-têtes ou la pondération
  du trafic, entre autres, qui n'étaient possibles avec [Ingress](/docs/concepts/services-networking/ingress/)
  qu'au moyen d'annotations personnalisées.
* __Extensible :__ Gateway permet de lier des ressources personnalisées à différents niveaux de l'API.
  Cela rend possible une personnalisation fine aux endroits appropriés de la structure de l'API.

## Modèle de ressources {#resource-model}

Gateway API comporte quatre types d'API stables :

* __GatewayClass :__ définit un ensemble de gateways partageant une configuration commune et gérées
  par un contrôleur qui implémente la classe.

* __Gateway :__ définit une instance d'infrastructure de traitement du trafic, comme un équilibreur de charge (load balancer) cloud.

* __HTTPRoute :__ définit des règles propres à HTTP pour acheminer le trafic d'un listener de Gateway
  vers une représentation de points de terminaison réseau de backend. Ces points de terminaison sont
  souvent représentés par un {{<glossary_tooltip text="Service" term_id="service">}}.

* __GRPCRoute :__ définit des règles propres à gRPC pour acheminer le trafic d'un listener de Gateway
  vers une représentation de points de terminaison réseau de backend. Ces points de terminaison sont
  souvent représentés par un {{<glossary_tooltip text="Service" term_id="service">}}.

Gateway API est organisée en différents types d'API liés par des relations d'interdépendance, afin de
refléter l'organisation par rôles des entreprises. Un objet Gateway est associé à exactement une GatewayClass ;
la GatewayClass décrit le contrôleur de gateway chargé de gérer les Gateways de cette classe.
Un ou plusieurs types de routes, comme HTTPRoute, sont ensuite associés aux Gateways. Une Gateway peut
filtrer les routes autorisées à se rattacher à ses `listeners`, ce qui forme un modèle de confiance
bidirectionnel avec les routes.

La figure suivante illustre les relations entre les trois types stables de Gateway API :

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="Figure illustrant les relations entre les trois types stables de Gateway API" class="diagram-medium" >}}

### GatewayClass {#api-kind-gateway-class}

Les Gateways peuvent être implémentées par différents contrôleurs, souvent avec des configurations
différentes. Une Gateway doit référencer une GatewayClass qui contient le nom du contrôleur qui
implémente la classe.

Exemple minimal de GatewayClass :

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

Dans cet exemple, un contrôleur qui implémente Gateway API est configuré pour gérer les GatewayClasses
dont le nom de contrôleur est `example.com/gateway-controller`. Les Gateways de cette classe seront
gérées par le contrôleur de l'implémentation.

Consultez la référence de [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)
pour la définition complète de ce type d'API.

### Gateway {#api-kind-gateway}

Une Gateway décrit une instance d'infrastructure de traitement du trafic. Elle définit un point de
terminaison réseau qui peut servir à traiter le trafic, c'est-à-dire à le filtrer, à en équilibrer la charge, à le
fractionner, etc., vers des backends comme un Service. Par exemple, une Gateway peut représenter un
équilibreur de charge cloud ou un serveur proxy interne au cluster, configuré pour accepter du trafic HTTP.

Exemple typique de ressource Gateway :

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-namespace
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    hostname: "www.example.com"
    allowedRoutes:
      namespaces:
        from: Same
```

Dans cet exemple, une instance d'infrastructure de traitement du trafic est programmée pour écouter
le trafic HTTP sur le port 80. Comme le champ `addresses` n'est pas renseigné, une adresse ou un nom
d'hôte est attribué à la Gateway par le contrôleur de l'implémentation. Cette adresse sert de point
de terminaison réseau pour traiter le trafic destiné aux points de terminaison réseau de backend
définis dans les routes.

Consultez la référence de [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)
pour la définition complète de ce type d'API. Pour configurer des listeners HTTPS/TLS, consultez le
[guide TLS de Gateway API](https://gateway-api.sigs.k8s.io/guides/tls/).

{{< note >}}
Par défaut, une Gateway n'accepte que les routes du même namespace. Les routes situées dans d'autres namespaces nécessitent de configurer `allowedRoutes`.
{{< /note >}}

### HTTPRoute {#api-kind-httproute}

Le type HTTPRoute définit le comportement de routage des requêtes HTTP, d'un listener de Gateway vers
des points de terminaison réseau de backend. Pour un backend de type Service, une implémentation peut
représenter le point de terminaison réseau du backend par l'IP du Service ou par les EndpointSlices
associées au Service. Une HTTPRoute représente une configuration appliquée à l'implémentation de
Gateway sous-jacente. Par exemple, définir une nouvelle HTTPRoute peut conduire à configurer des
routes de trafic supplémentaires dans un équilibreur de charge cloud ou dans un serveur proxy du cluster.

Exemple typique d'HTTPRoute :

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

Dans cet exemple, le trafic HTTP provenant de la Gateway `example-gateway`, dont l'en-tête Host: vaut
`www.example.com` et dont le chemin de la requête est `/login`, sera acheminé vers le Service
`example-svc` sur le port `8080`.

Consultez la référence de [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)
pour la définition complète de ce type d'API.


### GRPCRoute {#api-kind-grpcroute}

Le type GRPCRoute définit le comportement de routage des requêtes gRPC, d'un listener de Gateway vers
des points de terminaison réseau de backend. Pour un backend de type Service, une implémentation peut
représenter le point de terminaison réseau du backend par l'IP du Service ou par les EndpointSlices
associées au Service. Une GRPCRoute représente une configuration appliquée à l'implémentation de
Gateway sous-jacente. Par exemple, définir une nouvelle GRPCRoute peut conduire à configurer des
routes de trafic supplémentaires dans un équilibreur de charge cloud ou dans un serveur proxy du cluster.

Les Gateways qui prennent en charge GRPCRoute doivent prendre en charge HTTP/2 sans mise à niveau
initiale depuis HTTP/1, afin de garantir que le trafic gRPC circule correctement.

Exemple typique de GRPCRoute :

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 50051
```

Dans cet exemple, le trafic gRPC provenant de la Gateway `example-gateway`, dont l'hôte est
`svc.example.com`, sera dirigé vers le Service `example-svc` sur le port `50051`, dans le même namespace.

GRPCRoute permet de cibler des services gRPC précis, comme dans l'exemple suivant :

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - matches:
    - method:
        service: com.example
        method: Login
    backendRefs:
    - name: foo-svc
      port: 50051
```

Dans ce cas, la GRPCRoute correspond à tout le trafic destiné à svc.example.com et applique ses règles
de routage pour transmettre le trafic au bon backend. Comme une seule correspondance est définie,
seules les requêtes vers la méthode com.example.User.Login sur svc.example.com seront
transmises. Les RPC vers toute autre méthode ne correspondront pas à cette route.

Consultez la référence de [GRPCRoute](https://gateway-api.sigs.k8s.io/references/spec/#grpcroute)
pour la définition complète de ce type d'API.

## Flux des requêtes {#request-flow}

Voici un exemple simple de trafic HTTP acheminé vers un Service à l'aide d'une Gateway et d'une HTTPRoute :

{{< figure src="/docs/images/gateway-request-flow.svg" alt="Schéma montrant un exemple de trafic HTTP acheminé vers un Service à l'aide d'une Gateway et d'une HTTPRoute" class="diagram-medium" >}}

Dans cet exemple, le flux d'une requête pour une Gateway implémentée sous forme de proxy inverse est le suivant :

1. Le client commence à préparer une requête HTTP pour l'URL `http://www.example.com`.
2. Le résolveur DNS du client résout le nom de destination en
   une ou plusieurs adresses IP associées à la Gateway.
3. Le client envoie une requête à l'adresse IP de la Gateway ; le proxy inverse reçoit la requête
   HTTP et utilise l'en-tête Host: pour trouver une configuration issue de la Gateway et de
   l'HTTPRoute rattachée.
4. Le proxy inverse peut éventuellement vérifier la correspondance des en-têtes et/ou du chemin
   de la requête, selon les règles de correspondance de l'HTTPRoute.
5. Le proxy inverse peut éventuellement modifier la requête, par exemple pour ajouter ou supprimer
   des en-têtes, selon les règles de filtrage de l'HTTPRoute.
6. Enfin, le proxy inverse transmet la requête à un ou plusieurs backends.

## Conformité {#conformance}

Gateway API couvre un large ensemble de fonctionnalités et elle est largement implémentée. Cette
combinaison exige des définitions et des tests de conformité clairs pour garantir que l'API offre
une expérience cohérente partout où elle est utilisée.

Consultez la documentation sur la [conformité](https://gateway-api.sigs.k8s.io/docs/concepts/conformance/)
pour comprendre des notions comme les canaux de publication, les niveaux de prise en charge et
l'exécution des tests de conformité.

## Migrer depuis Ingress {#migrating-from-ingress}

Gateway API succède à l'API [Ingress](/docs/concepts/services-networking/ingress/).
Elle n'inclut cependant pas le type Ingress. Une conversion ponctuelle de vos ressources Ingress
existantes en ressources Gateway API est donc nécessaire.

Consultez le guide de [migration depuis Ingress](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress)
pour savoir comment migrer des ressources Ingress vers des ressources Gateway API.

## {{% heading "whatsnext" %}}

Les ressources de Gateway API ne sont pas implémentées nativement par Kubernetes : leurs spécifications
sont définies sous forme de [ressources personnalisées](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
prises en charge par un large éventail d'[implémentations](https://gateway-api.sigs.k8s.io/implementations/).
[Installez](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) les CRD de Gateway API ou
suivez les instructions d'installation de l'implémentation choisie. Une fois l'implémentation installée,
utilisez le guide [Getting Started](https://gateway-api.sigs.k8s.io/guides/) pour prendre en main
rapidement Gateway API.

{{< note >}}
Consultez la documentation de l'implémentation choisie pour bien en comprendre les éventuelles limites.
{{< /note >}}

Consultez la [spécification de l'API](https://gateway-api.sigs.k8s.io/reference/api-spec/main/spec/) pour plus
de détails sur tous les types de Gateway API.
