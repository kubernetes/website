---
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: Découverte de services et équilibrage de charge
  description: >
    Pas besoin de modifier votre application pour utiliser un mécanisme de découverte de services que vous ne connaissez pas. Kubernetes donne aux Pods leurs propres adresses IP et un seul nom DNS pour un ensemble de Pods, et peut répartir la charge entre eux.
description: >-
  Exposez une application qui s'exécute dans votre cluster derrière un point d'accès
  externe unique, même lorsque la charge de travail est répartie sur plusieurs backends.
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="Dans Kubernetes, un Service est" >}}

L'un des buts des Services est de vous éviter de modifier votre application pour l'adapter à un
mécanisme de découverte de services qu'elle ne connaît pas.
Le code qui tourne dans vos Pods peut être une application conçue pour le cloud (cloud native) ou
une ancienne application que vous avez simplement mise en conteneur. Dans les deux cas, un Service
rend cet ensemble de Pods accessible sur le réseau, pour que des clients puissent l'utiliser.

Si votre application tourne dans un {{< glossary_tooltip term_id="deployment" >}},
celui-ci crée et détruit des Pods au fil de l'eau. À un instant donné,
vous ne savez pas combien de Pods fonctionnent correctement, ni même forcément
comment ils s'appellent.
Kubernetes crée et détruit les {{< glossary_tooltip term_id="pod" text="Pods" >}}
pour atteindre l'état souhaité de votre cluster : ce sont des ressources éphémères. Ne comptez
pas sur la fiabilité ni sur la durée de vie d'un Pod en particulier.

Chaque Pod a sa propre adresse IP (c'est au plugin réseau de le garantir).
Or, pour un même Deployment, les Pods qui font tourner l'application à un instant donné
ne sont pas forcément les mêmes un instant plus tard.

D'où un problème. Imaginons que certains Pods (les « backends ») rendent un service
à d'autres Pods (les « frontends ») de votre cluster. Comment les frontends savent-ils
à quelle adresse IP joindre un backend, alors que ces adresses peuvent changer d'un instant à l'autre ?

C'est précisément le rôle des _Services_.

<!-- body -->

## Les Services dans Kubernetes {#services-in-kubernetes}

L'API Service de Kubernetes est une abstraction qui vous aide à exposer des groupes de
Pods sur le réseau. Chaque objet Service définit un ensemble logique de points de terminaison (le plus souvent
des Pods) et une politique qui indique comment rendre ces Pods accessibles.

Prenons un backend de traitement d'images sans état, qui tourne avec
3 réplicas. Ces 3 réplicas font exactement la même chose : peu importe à un frontend
lequel lui répond. Et si les Pods qui composent ce backend changent,
les frontends n'ont pas à le savoir ni à tenir à jour eux-mêmes
la liste des backends.

C'est ce découplage que permet l'abstraction Service.

Le déploiement canary est un cas d'usage courant des Services. Pour voir ce que cela implique, suivez le tutoriel [Déployer une release avec un déploiement canary](/docs/tutorials/stateless-application/canary-deployment/).

L'ensemble des Pods ciblés par un Service est en général déterminé
par un {{< glossary_tooltip text="sélecteur" term_id="selector" >}} que vous
définissez.
Pour découvrir d'autres façons de définir les points de terminaison d'un Service,
consultez [Services _sans_ sélecteurs](#services-without-selectors).

Si votre charge de travail communique en HTTP, vous pouvez utiliser un
[Ingress](/docs/concepts/services-networking/ingress/) pour contrôler la façon dont le trafic web
lui parvient.
Un Ingress n'est pas un type de Service, mais il sert de point d'entrée à votre
cluster. Il vous permet de regrouper vos règles de routage dans une seule ressource,
et donc d'exposer derrière un seul point d'écoute plusieurs composants de votre charge de travail
qui s'exécutent séparément dans le cluster.

L'API [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) de Kubernetes
va plus loin qu'Ingress et Service. Gateway est une famille d'API d'extension, mises en œuvre avec des
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} :
vous l'ajoutez à votre cluster, puis vous l'utilisez pour configurer l'accès aux services réseau
qui s'y exécutent.

### Découverte de services cloud native {#cloud-native-service-discovery}

Si votre application peut utiliser les API Kubernetes pour la découverte de services,
vous pouvez interroger le {{< glossary_tooltip text="serveur d'API" term_id="kube-apiserver" >}}
pour obtenir les EndpointSlices correspondants. Kubernetes met à jour les EndpointSlices d'un Service
chaque fois que l'ensemble des Pods de ce Service change.

Pour les applications qui ne s'appuient pas sur ces API, Kubernetes permet de placer un port réseau
ou un équilibreur de charge entre votre application et les Pods backend.

Dans les deux cas, votre charge de travail peut utiliser ces mécanismes de [découverte de services](#discovering-services)
pour trouver la cible à laquelle elle veut se connecter.

## Définir un Service {#defining-a-service}

Un Service est un {{< glossary_tooltip text="objet" term_id="object" >}}
(au même titre qu'un Pod ou une ConfigMap). Vous pouvez créer,
consulter ou modifier des définitions de Service avec l'API Kubernetes. En général,
c'est un outil comme `kubectl` qui fait ces appels d'API à votre place.

Par exemple, supposons que vous ayez un ensemble de Pods qui écoutent chacun sur le port TCP 9376
et qui portent le label `app.kubernetes.io/name=MyApp`. Vous pouvez définir un Service pour
exposer ce port TCP :

{{% code_sample file="service/simple-service.yaml" %}}

Appliquer ce manifeste crée un nouveau Service nommé « my-service », avec le
[type de Service](#publishing-services-service-types) ClusterIP par défaut. Le Service
cible le port TCP 9376 de tout Pod qui porte le label `app.kubernetes.io/name: MyApp`.

Kubernetes attribue à ce Service une adresse IP (l'_adresse IP de cluster_),
utilisée par le mécanisme d'IP virtuelles. Pour plus de détails sur ce mécanisme,
lisez [IP virtuelles et proxys de service](/docs/reference/networking/virtual-ips/).

Le contrôleur de ce Service recherche en continu les Pods qui
correspondent à son sélecteur, et met à jour au besoin les
EndpointSlices du Service.

Le nom d'un objet Service doit être un
[nom de label RFC 1123](/docs/concepts/overview/working-with-objects/names#rfc-1123-label-names) valide.


{{< note >}}
Un Service peut associer _n'importe quel_ `port` entrant à un `targetPort`. Par défaut, et
pour plus de simplicité, le `targetPort` prend la même valeur que le champ `port`.
{{< /note >}}

### Définitions de ports {#field-spec-ports}

Les ports définis dans les Pods ont des noms, auxquels vous pouvez faire référence dans
l'attribut `targetPort` d'un Service. Par exemple, on peut associer le `targetPort`
du Service au port du Pod de la façon suivante :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc

---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
```

Cela fonctionne même si le Service regroupe des Pods différents qui utilisent le même
nom de port, avec le même protocole réseau mais des numéros de port
différents. Vous gagnez ainsi beaucoup de souplesse pour déployer et faire évoluer
vos Services. Par exemple, vous pouvez changer le numéro de port qu'exposent les Pods
dans la version suivante de votre logiciel backend, sans casser les clients.

Le protocole par défaut des Services est
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp) ; vous pouvez aussi
utiliser n'importe quel autre [protocole pris en charge](/docs/reference/networking/service-protocols/).

Comme de nombreux Services doivent exposer plusieurs ports, Kubernetes prend en charge
[plusieurs définitions de ports](#multi-port-services) pour un même Service.
Chaque définition de port peut utiliser le même `protocol` que les autres ou un protocole différent.

### Services sans sélecteurs {#services-without-selectors}

La plupart du temps, un Service donne accès à des Pods Kubernetes grâce à son sélecteur.
Mais un Service sans sélecteur, associé aux objets
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}} correspondants,
peut aussi servir d'abstraction pour d'autres types de backends,
y compris des backends qui s'exécutent en dehors du cluster.

Par exemple :

* Vous voulez utiliser un cluster de bases de données externe en production, mais vos propres
  bases de données dans votre environnement de test.
* Vous voulez faire pointer votre Service vers un Service d'un autre
  {{< glossary_tooltip term_id="namespace" >}} ou d'un autre cluster.
* Vous migrez une charge de travail vers Kubernetes et, pendant la phase d'évaluation,
  vous n'exécutez qu'une partie de vos backends dans Kubernetes.

Dans tous ces cas, vous pouvez définir un Service _sans_ sélecteur
de Pods. Par exemple :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

Comme ce Service n'a pas de sélecteur, les objets EndpointSlice correspondants
ne sont pas créés automatiquement. Pour associer le Service
à l'adresse réseau et au port où s'exécute le backend, ajoutez vous-même un objet
EndpointSlice. Par exemple :

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # by convention, use the name of the Service
                     # as a prefix for the name of the EndpointSlice
  labels:
    # You should set the "kubernetes.io/service-name" label.
    # Set its value to match the name of the Service
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # should match with the name of the service port defined above
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### EndpointSlices personnalisés {#custom-endpointslices}

Lorsque vous créez un objet [EndpointSlice](#endpointslices) pour un Service, vous pouvez
lui donner n'importe quel nom. Chaque EndpointSlice d'un namespace doit avoir un
nom unique. Pour relier un EndpointSlice à un Service, posez sur cet EndpointSlice le
{{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/service-name`.

{{< note >}}
Les adresses IP des points de terminaison _ne doivent pas_ être des adresses de loopback (127.0.0.0/8 pour IPv4, ::1/128 pour IPv6), ni
des adresses link-local (169.254.0.0/16 et 224.0.0.0/24 pour IPv4, fe80::/64 pour IPv6).

Les adresses IP des points de terminaison ne peuvent pas être les adresses IP de cluster d'autres Services Kubernetes,
car {{< glossary_tooltip term_id="kube-proxy" >}} ne prend pas en charge les adresses IP virtuelles
comme destination.
{{< /note >}}

Pour un EndpointSlice que vous créez vous-même, ou par votre propre code,
vous devriez aussi choisir une valeur pour le label
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by).
Si vous écrivez votre propre contrôleur pour gérer les EndpointSlices, envisagez une
valeur du type `"my-domain.example/name-of-controller"`. Si vous utilisez un outil
tiers, utilisez le nom de l'outil tout en minuscules, en remplaçant les espaces et les autres
signes de ponctuation par des tirets (`-`).
Si des personnes gèrent les EndpointSlices directement avec un outil comme `kubectl`,
utilisez un nom qui décrit cette gestion manuelle, comme `"staff"` ou
`"cluster-admins"`. Évitez la valeur réservée `"controller"`, qui identifie les EndpointSlices
gérés par le plan de contrôle de Kubernetes lui-même.

#### Accéder à un Service sans sélecteur {#service-no-selector-access}

Un Service sans sélecteur s'utilise exactement comme un Service avec sélecteur.
Dans l'[exemple](#services-without-selectors) de Service sans sélecteur,
le trafic est acheminé vers l'un des deux points de terminaison définis dans
le manifeste de l'EndpointSlice : une connexion TCP vers 10.1.2.3 ou 10.4.5.6, sur le port 9376.

{{< note >}}
Le serveur d'API Kubernetes refuse de servir de proxy vers des points de terminaison qui ne correspondent pas
à des pods. Les actions comme `kubectl port-forward service/<service-name> forwardedPort:servicePort` sur un Service
sans sélecteur échouent donc. Cette contrainte empêche d'utiliser le serveur d'API Kubernetes
comme proxy vers des points de terminaison auxquels l'appelant n'a peut-être pas le droit d'accéder.
{{< /note >}}

Un Service `ExternalName` est un cas particulier : il n'a pas de
sélecteur et utilise des noms DNS à la place. Pour plus d'informations, consultez la section
[ExternalName](#externalname).

### EndpointSlices {#endpointslices}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Les [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) sont des objets qui
représentent une partie (une _tranche_) des points de terminaison réseau d'un Service.

Votre cluster Kubernetes suit le nombre de points de terminaison de chaque EndpointSlice.
Quand un Service a tant de points de terminaison qu'un seuil est atteint,
Kubernetes ajoute un EndpointSlice vide et y enregistre les nouveaux points de terminaison.
Par défaut, Kubernetes crée un nouvel EndpointSlice quand tous les EndpointSlices existants
contiennent au moins 100 points de terminaison, et seulement au moment où un point de terminaison
supplémentaire doit être ajouté.

Consultez [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) pour plus
d'informations sur cette API.

### Endpoints (obsolète) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

L'API EndpointSlice est l'évolution de l'ancienne API
[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/).
Par rapport à EndpointSlice, l'API Endpoints, obsolète,
pose plusieurs problèmes :

  - Elle ne prend pas en charge les clusters en double pile.
  - Elle ne contient pas les informations nécessaires aux fonctionnalités plus récentes, comme
    [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution).
  - Elle tronque la liste des points de terminaison si celle-ci est trop longue pour tenir dans un seul objet.

Il est donc recommandé à tous les clients d'utiliser
l'API EndpointSlice plutôt qu'Endpoints.

#### Points de terminaison en surcapacité {#over-capacity-endpoints}

Kubernetes limite le nombre de points de terminaison que peut contenir un objet
Endpoints. Au-delà de 1000 points de terminaison pour un Service, Kubernetes
tronque les données de l'objet Endpoints. Comme un Service peut être relié
à plusieurs EndpointSlices, cette limite de 1000 ne
concerne que l'ancienne API Endpoints.

Dans ce cas, Kubernetes enregistre au maximum 1000 points de terminaison backend
dans l'objet Endpoints, et y pose une
{{< glossary_tooltip text="annotation" term_id="annotation" >}} :
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
Le plan de contrôle retire aussi cette annotation lorsque le nombre de Pods backend repasse sous 1000.

Le trafic est toujours envoyé aux backends, mais tout mécanisme d'équilibrage de charge qui s'appuie sur
l'ancienne API Endpoints n'utilise au maximum que 1000 des points de terminaison disponibles.

Pour la même raison, vous ne pouvez pas mettre à jour manuellement un objet Endpoints pour lui donner plus de 1000 points de terminaison.

### Protocole applicatif {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Le champ `appProtocol` permet d'indiquer le protocole applicatif de
chaque port d'un Service. Les implémentations s'en servent comme d'une indication pour offrir
un comportement plus riche avec les protocoles qu'elles connaissent.
La valeur de ce champ est recopiée dans les objets
Endpoints et EndpointSlice correspondants.

Ce champ suit la syntaxe standard des labels Kubernetes. Les valeurs valides sont l'une des suivantes :

* Les [noms de services standard de l'IANA](https://www.iana.org/assignments/service-names).

* Des noms préfixés définis par l'implémentation, comme `mycompany.com/my-custom-protocol`.

* Des noms préfixés définis par Kubernetes :

| Protocole | Description |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 en clair, comme décrit dans la [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) |
| `kubernetes.io/ws`  | WebSocket en clair, comme décrit dans la [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
| `kubernetes.io/wss` | WebSocket sur TLS, comme décrit dans la [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |

### Services multi-ports {#multi-port-services}

Certains Services doivent exposer plusieurs ports.
Kubernetes vous permet de configurer plusieurs définitions de ports sur un même objet Service.
Dans ce cas, vous devez donner un nom à chacun des ports
pour éviter toute ambiguïté.
Par exemple :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
Comme pour les {{< glossary_tooltip term_id="name" text="noms">}} Kubernetes en général, les noms de ports
ne doivent contenir que des caractères alphanumériques en minuscules et des `-`. Les noms de ports doivent
aussi commencer et se terminer par un caractère alphanumérique.

Par exemple, les noms `123-abc` et `web` sont valides, mais `123_abc` et `-web` ne le sont pas.
{{< /note >}}

## Type de Service {#publishing-services-service-types}

Pour certaines parties de votre application (par exemple les frontends), vous voudrez peut-être exposer un
Service sur une adresse IP externe, accessible depuis l'extérieur de votre
cluster.

Le type d'un Service Kubernetes vous permet d'indiquer quel genre de Service vous voulez.

Voici les valeurs possibles de `type` et leur comportement :

[`ClusterIP`](#type-clusterip)
: Expose le Service sur une adresse IP interne au cluster : le Service n'est alors
  joignable que depuis le cluster. C'est la valeur par défaut si vous n'indiquez pas
  explicitement de `type` pour un Service.
  Vous pouvez exposer le Service sur Internet avec un
  [Ingress](/docs/concepts/services-networking/ingress/) ou une
  [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Expose le Service sur un port statique (le `NodePort`) de l'adresse IP de chaque nœud.
  Pour rendre ce port de nœud disponible, Kubernetes configure aussi une adresse IP de cluster,
  comme pour un Service de `type: ClusterIP`.

[`LoadBalancer`](#loadbalancer)
: Expose le Service à l'extérieur grâce à un équilibreur de charge externe. Kubernetes
  ne fournit pas directement de composant d'équilibrage de charge : vous devez en fournir un,
  ou intégrer votre cluster Kubernetes à un fournisseur de cloud.

[`ExternalName`](#externalname)
: Associe le Service au contenu du champ `externalName` (par exemple
  au nom d'hôte `api.foo.bar.example`). Le serveur DNS de votre cluster est alors
  configuré pour renvoyer un enregistrement `CNAME` avec ce nom d'hôte externe.
  Aucun proxy, de quelque sorte que ce soit, n'est mis en place.

Le champ `type` de l'API Service est conçu comme une suite de fonctionnalités imbriquées : chaque niveau
s'ajoute au précédent. Il y a toutefois une exception à ce principe : vous pouvez
définir un Service `LoadBalancer` en
[désactivant l'allocation de `NodePort` pour l'équilibreur de charge](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation).

### `type: ClusterIP` {#type-clusterip}

Ce type de Service, utilisé par défaut, attribue une adresse IP prise dans un pool d'adresses
que votre cluster réserve à cet usage.

Plusieurs autres types de Service reposent sur le type `ClusterIP`.

Si vous définissez un Service dont `.spec.clusterIP` vaut `"None"`,
Kubernetes n'attribue pas d'adresse IP. Consultez [Services headless](#headless-services)
pour plus d'informations.

#### Choisir votre propre adresse IP {#choosing-your-own-ip-address}

Vous pouvez choisir vous-même l'adresse IP de cluster dans la requête de création
d'un `Service`, en renseignant le champ `.spec.clusterIP`. C'est utile par exemple si vous
avez une entrée DNS existante à réutiliser, ou d'anciens systèmes
configurés pour une adresse IP précise et difficiles à reconfigurer.

L'adresse IP que vous choisissez doit être une adresse IPv4 ou IPv6 valide, comprise dans la
plage CIDR `service-cluster-ip-range` configurée pour le serveur d'API.
Si vous essayez de créer un Service avec une valeur `clusterIP` invalide, le serveur
d'API renvoie un code d'état HTTP 422 pour signaler le problème.

Lisez [Éviter les collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions)
pour savoir comment Kubernetes aide à réduire le risque, et l'impact, d'une situation où deux Services
différents essaient d'utiliser la même adresse IP.

### `type: NodePort` {#type-nodeport}

Si vous donnez au champ `type` la valeur `NodePort`, le plan de contrôle de Kubernetes
alloue un port dans une plage définie par l'option `--service-node-port-range` (par défaut : 30000-32767).
Sur chaque nœud, ce port (le même numéro partout) est relayé vers votre Service.
Votre Service indique le port alloué dans son champ `.spec.ports[*].nodePort`.

Utiliser un NodePort vous laisse libre de mettre en place votre propre solution d'équilibrage de charge,
de configurer des environnements que Kubernetes ne prend pas entièrement en charge, ou même
d'exposer directement les adresses IP d'un ou plusieurs nœuds.

Pour un Service NodePort, Kubernetes alloue en plus un port (TCP, UDP ou
SCTP, selon le protocole du Service). Chaque nœud du cluster se configure
pour écouter sur ce port et transférer le trafic vers l'un des points de terminaison
prêts du Service. Depuis l'extérieur du cluster, vous pouvez joindre le Service de `type: NodePort`
en vous connectant à n'importe quel nœud avec le bon protocole (par exemple TCP)
et le bon port (celui attribué au Service).

#### Choisir votre propre port {#nodeport-custom-port}

Si vous voulez un numéro de port précis, indiquez-le dans le champ
`nodePort`. Le plan de contrôle vous attribuera ce port, ou signalera l'échec
de la transaction de l'API.
C'est donc à vous de gérer les éventuelles collisions de ports.
Le numéro de port doit aussi être valide, c'est-à-dire compris dans la plage configurée
pour les NodePorts.

Voici un exemple de manifeste pour un Service de `type: NodePort` qui indique
une valeur de NodePort (30007 dans cet exemple) :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # By default and for convenience, the `targetPort` is set to
      # the same value as the `port` field.
      targetPort: 80
      # Optional field
      # By default and for convenience, the Kubernetes control plane
      # will allocate a port from a range (default: 30000-32767)
      nodePort: 30007
```

#### Réserver des plages de NodePort pour éviter les collisions {#avoid-nodeport-collisions}

La politique d'attribution des ports aux Services NodePort vaut aussi bien pour l'attribution automatique
que pour l'attribution manuelle. Quand un utilisateur veut créer un Service NodePort sur
un port précis, ce port peut entrer en conflit avec un port déjà attribué.

Pour éviter ce problème, la plage de ports des Services NodePort est divisée en deux bandes.
L'attribution dynamique utilise par défaut la bande haute, et peut passer à la bande basse une fois
la bande haute épuisée. Les utilisateurs peuvent ainsi choisir leurs ports dans la bande basse, avec moins de risque de collision.

Avec la plage NodePort par défaut 30000-32767, les bandes sont réparties ainsi :

- Bande statique : 30000-30085
- Bande dynamique : 30086-32767

Consultez [Avoid Collisions Assigning Ports to NodePort Services](/blog/2023/05/11/nodeport-dynamic-and-static-allocation/)
pour savoir comment les bandes statique et dynamique sont calculées.

#### Configuration des adresses IP des Services de `type: NodePort` {#service-nodeport-custom-listen-address}

Lorsque kube-proxy est utilisé en [mode
`iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables), les Services NodePort sont
disponibles par défaut sur toutes les adresses IP du nœud. En [mode
`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables), ils ne sont
disponibles par défaut que sur l'adresse IP principale du nœud (ou les adresses IP principales en double pile).

Vous pouvez changer l'ensemble des adresses IP de nœud sur lesquelles les Services NodePort sont disponibles avec
l'option `--nodeport-addresses` de kube-proxy, ou le champ équivalent `nodePortAddresses`
du [fichier de configuration de kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/).
Elle accepte une liste de blocs d'adresses IP séparés par des virgules (par exemple `10.0.0.0/8`, `192.0.2.0/25`), ou un
ou plusieurs des mots-clés suivants :

- `primary` : l'adresse IPv4 et/ou IPv6 principale du nœud, d'après l'objet Node.
  (C'est la valeur par défaut en mode `nftables`.)
- `localhost` : les adresses de loopback du nœud (`127.0.0.0/8`, `::1/128`).
- `all` : toutes les adresses. (C'est la valeur par défaut en modes `iptables` et `ipvs`.)

Par exemple, si vous démarrez kube-proxy avec l'option `--nodeport-addresses=192.168.0.0/24`,
kube-proxy essaie de trouver sur chaque nœud une adresse IP locale dans ce sous-réseau, et ne sert
les Services NodePort que sur cette adresse IP.

#### Services de `type: NodePort` via localhost {#localhost-nodeports}

Les mécanismes qu'utilisent les proxys de service pour mettre en œuvre les Services NodePort ne permettent pas toujours
de les rendre disponibles sur localhost. Pour kube-proxy :

  - En mode `iptables`, avec une valeur de `--nodeport-addresses` qui inclut
    `127.0.0.1`, les Services NodePort sont disponibles sur `127.0.0.1`. Cela
    nécessite toutefois d'activer un sysctl du noyau (`route_localnet`) qui peut avoir des effets secondaires
    néfastes pour la sécurité dans certains clusters. Pour désactiver les NodePorts sur localhost en mode iptables, passez
    `--iptables-localhost-nodeports false` à kube-proxy, ou donnez à
    `--nodeport-addresses` une plage qui n'inclut pas `127.0.0.1`.

  - En mode `ipvs`, ou en mode `iptables` dans un cluster IPv6 en pile simple, les Services
    NodePort ne sont pas disponibles sur localhost.

{{< feature-state feature_gate_name="KubeProxyNFTablesLocalhostNodePorts" >}}

  - En mode `nftables`, les Services NodePort sont disponibles sur localhost lorsque la
    feature gate `KubeProxyNFTablesLocalhostNodePorts` est activée et que
    `--nodeport-addresses` a une valeur qui inclut explicitement `localhost`.
    (La valeur `all` seule ne suffit _pas_.) Cette fonctionnalité redirige
    les connexions NodePort sur localhost vers un proxy en espace utilisateur :
    elle est donc moins efficace que le proxy de service habituel.

Les plugins réseau tiers qui ont leur propre implémentation de proxy de service peuvent prendre en charge
ou non les NodePorts localhost : consultez la documentation de ces plugins.

### `type: LoadBalancer` {#loadbalancer}

Chez les fournisseurs de cloud qui proposent des équilibreurs de charge externes, la valeur
`LoadBalancer` du champ `type` provisionne un équilibreur de charge pour votre Service.
L'équilibreur de charge est créé de façon asynchrone, et
les informations le concernant sont publiées dans le champ
`.status.loadBalancer` du Service.
Par exemple :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

Le trafic de l'équilibreur de charge externe est dirigé vers les Pods backend. C'est le fournisseur de
cloud qui décide comment répartir la charge.

Pour mettre en œuvre un Service de `type: LoadBalancer`, Kubernetes commence en général
par faire les mêmes changements que si vous aviez demandé un Service de
`type: NodePort`. Le composant cloud-controller-manager configure ensuite l'équilibreur de charge
externe pour qu'il transfère le trafic vers le port de nœud attribué.

Vous pouvez configurer un Service avec équilibreur de charge pour
[ne pas lui attribuer](#load-balancer-nodeport-allocation) de port de nœud, à condition que
l'implémentation du fournisseur de cloud le permette.

Certains fournisseurs de cloud vous permettent d'indiquer le `loadBalancerIP`. Dans ce cas, l'équilibreur de charge est créé
avec le `loadBalancerIP` indiqué par l'utilisateur. Si le champ `loadBalancerIP` n'est pas renseigné,
l'équilibreur de charge est configuré avec une adresse IP éphémère. Si vous indiquez un `loadBalancerIP`
mais que votre fournisseur de cloud ne prend pas en charge cette fonctionnalité, le champ `loadbalancerIP` que vous
avez défini est ignoré.


{{< note >}}
Le champ `.spec.loadBalancerIP` d'un Service est obsolète depuis Kubernetes v1.24.

Ce champ était insuffisamment spécifié et son sens varie selon les implémentations.
Il ne peut pas non plus prendre en charge le réseau en double pile. Ce champ pourrait être supprimé dans une future version de l'API.

Si votre fournisseur permet d'indiquer la ou les adresses IP de l'équilibreur de charge
d'un Service par une annotation (qui lui est propre), vous devriez passer à cette méthode.

Si vous écrivez du code pour intégrer un équilibreur de charge à Kubernetes, évitez d'utiliser ce champ.
Vous pouvez vous appuyer sur [Gateway](https://gateway-api.sigs.k8s.io/) plutôt que sur Service, ou
définir sur le Service vos propres annotations (propres au fournisseur) qui portent l'information équivalente.
{{< /note >}}

#### Impact de la disponibilité des nœuds sur le trafic de l'équilibreur de charge {#node-liveness-impact-on-load-balancer-traffic}

Les vérifications de santé des équilibreurs de charge sont essentielles aux applications modernes. Elles permettent de
déterminer vers quel serveur (machine virtuelle ou adresse IP) l'équilibreur de charge doit
envoyer le trafic. Les API Kubernetes ne définissent pas comment mettre en œuvre ces vérifications
pour les équilibreurs de charge gérés par Kubernetes : ce sont les fournisseurs de cloud
(et les personnes qui écrivent le code d'intégration) qui décident du comportement. Ces vérifications de santé
sont très utilisées pour prendre en charge le champ
`externalTrafficPolicy` des Services.

#### Équilibreurs de charge avec plusieurs protocoles {#load-balancers-with-mixed-protocol-types}

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

Par défaut, pour les Services de type LoadBalancer qui définissent plusieurs ports, tous
les ports doivent avoir le même protocole, et ce protocole doit être pris en charge
par le fournisseur de cloud.

La feature gate `MixedProtocolLBService` (activée par défaut pour kube-apiserver depuis la v1.24) permet d'utiliser
des protocoles différents pour les Services de type LoadBalancer qui définissent plusieurs ports.

{{< note >}}
C'est votre fournisseur de cloud qui définit les protocoles utilisables pour les Services avec équilibreur
de charge, et il peut imposer des restrictions plus strictes que l'API Kubernetes.
{{< /note >}}

#### Désactiver l'allocation de NodePort pour l'équilibreur de charge {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Vous pouvez, si vous le souhaitez, désactiver l'allocation de ports de nœud pour un Service de `type: LoadBalancer` en donnant
au champ `spec.allocateLoadBalancerNodePorts` la valeur `false`. Ne l'utilisez que pour les implémentations d'équilibreur de charge
qui acheminent le trafic directement vers les pods, sans passer par des ports de nœud. Par défaut, `spec.allocateLoadBalancerNodePorts`
vaut `true`, et les Services de type LoadBalancer continuent d'allouer des ports de nœud. Si vous passez `spec.allocateLoadBalancerNodePorts`
à `false` sur un Service existant qui a déjà des ports de nœud alloués, ces ports ne sont **pas** libérés automatiquement.
Pour les libérer, vous devez supprimer explicitement l'entrée `nodePorts` de chaque port du Service.

#### Indiquer la classe d'implémentation de l'équilibreur de charge {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Pour un Service dont le `type` vaut `LoadBalancer`, le champ `.spec.loadBalancerClass`
vous permet d'utiliser une autre implémentation d'équilibreur de charge que celle fournie par défaut par le fournisseur de cloud.

Par défaut, `.spec.loadBalancerClass` n'est pas défini, et un Service de type
`LoadBalancer` utilise l'implémentation d'équilibreur de charge par défaut du fournisseur de cloud si le
cluster est configuré avec un fournisseur de cloud via l'option `--cloud-provider` de ses
composants.

Si vous indiquez `.spec.loadBalancerClass`, Kubernetes considère qu'une implémentation d'équilibreur
de charge correspondant à cette classe surveille les Services.
Toute implémentation d'équilibreur de charge par défaut (par exemple celle du
fournisseur de cloud) ignore les Services pour lesquels ce champ est défini.
`spec.loadBalancerClass` ne peut être défini que sur un Service de type `LoadBalancer`.
Une fois défini, il ne peut plus être modifié.
La valeur de `spec.loadBalancerClass` doit être un identifiant au format d'un label,
avec un préfixe facultatif, comme « `internal-vip` » ou « `example.com/internal-vip` ».
Les noms sans préfixe sont réservés aux utilisateurs finaux.

#### Mode d'adresse IP de l'équilibreur de charge {#load-balancer-ip-mode}

Pour un Service de `type: LoadBalancer`, un contrôleur peut définir `.status.loadBalancer.ingress.ipMode`.
Le champ `.status.loadBalancer.ingress.ipMode` indique le comportement de l'adresse IP de l'équilibreur de charge.
Il ne peut être indiqué que si le champ `.status.loadBalancer.ingress.ip` l'est aussi.

`.status.loadBalancer.ingress.ipMode` peut prendre deux valeurs : « VIP » et « Proxy ».
La valeur par défaut, « VIP », signifie que le trafic arrive au nœud
avec pour destination l'adresse IP et le port de l'équilibreur de charge.
Avec « Proxy », deux cas sont possibles, selon la façon dont l'équilibreur de charge
du fournisseur de cloud achemine le trafic :

- Si le trafic arrive au nœud puis est traduit (DNAT) vers le pod, la destination est l'adresse IP et le port de nœud ;
- Si le trafic arrive directement au pod, la destination est l'adresse IP et le port du pod.

Les implémentations de Service peuvent utiliser cette information pour ajuster le routage du trafic.

#### Équilibreur de charge interne {#internal-load-balancer}

Dans un environnement mixte, il est parfois nécessaire d'acheminer le trafic de Services situés dans le même
bloc d'adresses réseau (virtuel).

Dans un environnement DNS split-horizon, il vous faudrait deux Services pour acheminer à la fois le trafic externe
et le trafic interne vers vos points de terminaison.

Pour configurer un équilibreur de charge interne, ajoutez à votre Service l'une des annotations suivantes,
selon le fournisseur de cloud que vous utilisez :

{{< tabs name="service_tabs" >}}
{{% tab name="Par défaut" %}}
Sélectionnez l'un des onglets.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

Un Service de type ExternalName est associé à un nom DNS, et non à un sélecteur classique comme
`my-service` ou `cassandra`. Vous indiquez ce nom avec le paramètre `spec.externalName`.

Par exemple, cette définition associe
le Service `my-service` du namespace `prod` à `my.database.example.com` :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
Un Service de `type: ExternalName` accepte une adresse IPv4 sous forme de chaîne,
mais il la traite comme un nom DNS composé de chiffres,
et non comme une adresse IP (Internet n'autorise d'ailleurs pas ce genre de noms dans le DNS).
Les serveurs DNS ne résolvent pas les Services dont le nom externe ressemble
à une adresse IPv4.

Pour associer un Service directement à une adresse IP précise, envisagez plutôt
des [Services headless](#headless-services).
{{< /note >}}

Quand on recherche l'hôte `my-service.prod.svc.cluster.local`, le Service DNS du cluster
renvoie un enregistrement `CNAME` de valeur `my.database.example.com`. On accède à
`my-service` comme aux autres Services, à une différence près, essentielle :
la redirection se fait au niveau du DNS, et non par un proxy ou un
transfert. Si vous décidez plus tard d'intégrer votre base de données au cluster, vous
pourrez démarrer ses Pods, ajouter les sélecteurs ou les points de terminaison nécessaires, et changer le
`type` du Service.

{{< caution >}}
ExternalName peut poser problème avec certains protocoles courants, dont HTTP et HTTPS.
En effet, le nom d'hôte qu'utilisent les clients de votre cluster n'est pas le même
que le nom auquel l'ExternalName fait référence.

Pour les protocoles qui utilisent des noms d'hôte, cette différence peut entraîner des erreurs ou des réponses inattendues.
Les requêtes HTTP auront un en-tête `Host:` que le serveur d'origine ne reconnaît pas ;
les serveurs TLS ne pourront pas fournir de certificat correspondant au nom d'hôte auquel le client s'est connecté.
{{< /caution >}}

## Services headless {#headless-services}

Parfois, vous n'avez besoin ni d'équilibrage de charge ni d'une adresse IP unique pour le Service. Dans
ce cas, vous pouvez créer ce qu'on appelle des _Services headless_, en indiquant explicitement
`"None"` comme adresse IP de cluster (`.spec.clusterIP`).

Un Service headless vous permet de vous interfacer avec d'autres mécanismes de découverte de services,
sans dépendre de l'implémentation de Kubernetes.

Pour les Services headless, aucune adresse IP de cluster n'est allouée, kube-proxy ne gère pas
ces Services, et la plateforme ne fait pour eux ni équilibrage de charge ni proxy.

Un Service headless permet à un client de se connecter directement au Pod de son choix. Ces Services ne
configurent ni routes ni transfert de paquets à l'aide
d'[adresses IP virtuelles et de proxys](/docs/reference/networking/virtual-ips/) : ils publient à la place les
adresses IP de chaque pod via des enregistrements DNS internes, servis par le
[service DNS](/docs/concepts/services-networking/dns-pod-service/) du cluster.
Pour définir un Service headless, créez un Service dont `.spec.type` vaut ClusterIP (la valeur par défaut de `type`),
et donnez en plus à `.spec.clusterIP` la valeur None.

La chaîne None est un cas particulier : ce n'est pas la même chose que de laisser le champ `.spec.clusterIP` vide.

La configuration automatique du DNS dépend de la présence ou non de sélecteurs sur le Service :

### Avec sélecteurs {#with-selectors}

Pour les Services headless qui définissent des sélecteurs, le contrôleur des points de terminaison crée
des EndpointSlices dans l'API Kubernetes et modifie la configuration DNS pour qu'elle renvoie
des enregistrements A ou AAAA (adresses IPv4 ou IPv6) qui pointent directement vers les Pods du Service.

### Sans sélecteurs {#without-selectors}

Pour les Services headless qui ne définissent pas de sélecteurs, le plan de contrôle ne
crée pas d'objets EndpointSlice. Le système DNS recherche et configure toutefois,
selon le cas :

* des enregistrements DNS CNAME pour les Services de [`type: ExternalName`](#externalname) ;
* des enregistrements DNS A / AAAA pour toutes les adresses IP des points de terminaison prêts du Service,
  pour tous les types de Service autres que `ExternalName`.
  * Pour les points de terminaison IPv4, le système DNS crée des enregistrements A.
  * Pour les points de terminaison IPv6, le système DNS crée des enregistrements AAAA.

Lorsque vous définissez un Service headless sans sélecteur, le `port` doit
être identique au `targetPort`.

## Découvrir les services {#discovering-services}

Pour les clients qui s'exécutent dans votre cluster, Kubernetes propose deux méthodes principales pour
trouver un Service : les variables d'environnement et le DNS.

### Variables d'environnement {#environment-variables}

Lorsqu'un Pod s'exécute sur un nœud, le kubelet ajoute un ensemble de variables d'environnement
pour chaque Service actif. Il ajoute les variables `{SVCNAME}_SERVICE_HOST` et `{SVCNAME}_SERVICE_PORT`,
où le nom du Service est mis en majuscules et les tirets sont remplacés par des tirets bas.


Par exemple, le Service `redis-primary`, qui expose le port TCP 6379 et a reçu
l'adresse IP de cluster 10.0.0.11, produit les variables d'environnement
suivantes :

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Si un Pod doit accéder à un Service et que vous transmettez
le port et l'adresse IP de cluster aux Pods clients par des variables d'environnement,
vous devez créer le Service *avant* les Pods clients.
Sinon, les variables d'environnement de ces Pods ne seront pas renseignées.

Si vous passez uniquement par le DNS pour trouver l'adresse IP de cluster d'un Service, cette question
d'ordre ne se pose pas.
{{< /note >}}

Kubernetes fournit aussi des variables compatibles avec la fonctionnalité
« _[legacy container links](https://docs.docker.com/network/links/)_ » de Docker Engine.
Pour voir comment c'est mis en œuvre dans Kubernetes, lisez
[`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72).

### DNS {#dns}

Vous pouvez (et devriez presque toujours) installer un service DNS dans votre cluster
Kubernetes avec un [module complémentaire](/docs/concepts/cluster-administration/addons/).

Un serveur DNS qui connaît le cluster, comme CoreDNS, surveille l'API Kubernetes pour repérer les nouveaux
Services et crée un ensemble d'enregistrements DNS pour chacun. Si le DNS est activé
dans tout le cluster, tous les Pods devraient pouvoir résoudre automatiquement
les Services par leur nom DNS.

Par exemple, si vous avez un Service appelé `my-service` dans un namespace
Kubernetes `my-ns`, le plan de contrôle et le Service DNS créent ensemble
un enregistrement DNS pour `my-service.my-ns`. Les Pods du namespace `my-ns`
devraient trouver le Service en résolvant simplement le nom `my-service`
(`my-service.my-ns` fonctionne aussi).

Les Pods des autres namespaces doivent utiliser le nom qualifié `my-service.my-ns`. Ces noms
sont résolus en l'adresse IP de cluster du Service.

Kubernetes prend aussi en charge les enregistrements DNS SRV (Service) pour les ports nommés. Si le
Service `my-service.my-ns` a un port nommé `http` dont le protocole est
`TCP`, vous pouvez faire une requête DNS SRV sur `_http._tcp.my-service.my-ns` pour obtenir
le numéro de port de `http`, ainsi que l'adresse IP.

Les Services `ExternalName` ne sont accessibles que par le serveur DNS de Kubernetes.
Pour en savoir plus sur la résolution des `ExternalName`, consultez
[DNS pour les Services et les Pods](/docs/concepts/services-networking/dns-pod-service/).

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## Mécanisme d'adressage IP virtuel {#virtual-ip-addressing-mechanism}

La page [IP virtuelles et proxys de service](/docs/reference/networking/virtual-ips/) explique le
mécanisme que Kubernetes fournit pour exposer un Service avec une adresse IP virtuelle.

### Politiques de trafic {#traffic-policies}

Vous pouvez définir les champs `.spec.internalTrafficPolicy` et `.spec.externalTrafficPolicy`
pour contrôler la façon dont Kubernetes achemine le trafic vers les backends en bonne santé (« ready »).

Consultez [Politiques de trafic](/docs/reference/networking/virtual-ips/#traffic-policies) pour plus de détails.

### Contrôle de la distribution du trafic {#traffic-distribution}

Le champ `.spec.trafficDistribution` est un autre moyen d'influencer le routage
du trafic dans un Service Kubernetes. Les politiques de trafic apportent des garanties
sémantiques strictes ; la distribution du trafic, elle, vous permet d'exprimer des _préférences_
(par exemple acheminer le trafic vers les points de terminaison les plus proches dans la topologie). Cela peut aider à optimiser
les performances, les coûts ou la fiabilité. Dans Kubernetes {{< skew currentVersion >}}, les
valeurs suivantes sont prises en charge :

`PreferSameZone`
: Indique une préférence pour acheminer le trafic vers des points de terminaison situés dans la même
  zone que le client.

`PreferSameNode`
: Indique une préférence pour acheminer le trafic vers des points de terminaison situés sur le même
  nœud que le client.

`PreferClose` (obsolète)
: Ancien alias de `PreferSameZone`, au sens moins
  explicite.

Si le champ n'est pas défini, l'implémentation applique sa stratégie de routage par défaut.

Consultez [Distribution du
trafic](/docs/reference/networking/virtual-ips/#traffic-distribution) pour
plus de détails.

### Affinité de session {#session-stickiness}

Si vous voulez vous assurer que les connexions d'un client donné arrivent toujours au
même Pod, vous pouvez configurer une affinité de session basée sur l'adresse IP
du client. Lisez [affinité de session](/docs/reference/networking/virtual-ips/#session-affinity)
pour en savoir plus.

## Adresses IP externes {#external-ips}

{{< feature-state for_k8s_version="v1.36" state="deprecated" >}}

Tous les utilisateurs devraient commencer à migrer pour ne plus utiliser `externalIPs`.
Envisagez plutôt un contrôleur d'équilibreur de charge externe ou une implémentation
de Gateway API.

Si des adresses IP externes sont routées vers un ou plusieurs nœuds du cluster, les Services Kubernetes
peuvent être exposés sur ces `externalIPs`. Quand du trafic réseau arrive dans le cluster avec
l'adresse IP externe pour destination et le port de ce Service, les règles et les routes
configurées par Kubernetes garantissent qu'il est acheminé vers l'un des points de terminaison
de ce Service.

Vous pouvez indiquer des `externalIPs` pour n'importe quel
[type de Service](#publishing-services-service-types).
Dans l'exemple ci-dessous, les clients peuvent joindre le Service `"my-service"` en TCP
sur `"198.51.100.32:80"` (calculé à partir de `.spec.externalIPs[]` et `.spec.ports[].port`).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
Kubernetes ne gère pas l'allocation des `externalIPs` : c'est la responsabilité
de l'administrateur du cluster.
{{< /note >}}

## Objet de l'API {#api-object}

Service est une ressource de premier niveau de l'API REST de Kubernetes. Vous trouverez plus de détails
sur l'[objet Service de l'API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## {{% heading "whatsnext" %}}

Pour en savoir plus sur les Services et leur place dans Kubernetes :

* Suivez le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/).
* Découvrez l'[Ingress](/docs/concepts/services-networking/ingress/), qui
  expose des routes HTTP et HTTPS depuis l'extérieur du cluster vers des Services de
  votre cluster.
* Découvrez [Gateway](/docs/concepts/services-networking/gateway/), une extension de
  Kubernetes qui offre plus de souplesse qu'Ingress.

Pour aller plus loin, lisez les pages suivantes :

* [IP virtuelles et proxys de service](/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* [Référence de l'API Service](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [Référence de l'API EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Référence de l'API Endpoints (ancienne)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
