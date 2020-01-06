---
title: Service
feature:
  title: Service discovery and load balancing
  description: >
    No need to modify your application to use an unfamiliar service discovery mechanism.
    Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< glossary_definition term_id="service" length="short" >}}

Avec Kubernetes, vous n'avez pas besoin de modifier votre application pour utiliser un mécanisme de découverte de services inconnu.
Kubernetes donne aux pods leurs propres adresses IP et un nom DNS unique pour un ensemble de pods, et peut équilibrer la charge entre eux.

{{% /capture %}}

{{% capture body %}}

## Motivation

Les {{< glossary_tooltip term_id="pod" text="Pods" >}} Kubernetes sont mortels.
Ils naissent et lorsqu'ils meurent, ils ne ressuscitent pas.
Si vous utilisez un {{< glossary_tooltip term_id="deployment" >}} pour exécuter votre application, il peut créer et détruire dynamiquement des pods.

Chaque pod obtient sa propre adresse IP, mais dans un déploiement, l'ensemble de pods s'exécutant en un instant peut être différent de l'ensemble de pods exécutant cette application un instant plus tard.

Cela conduit à un problème: si un ensemble de pods (appelez-les «backends») fournit des fonctionnalités à d'autres pods (appelez-les «frontends») à l'intérieur de votre cluster, comment les frontends peuvent-ils trouver et suivre l'adresse IP à laquelle se connecter, afin que le frontend puisse utiliser la partie backend de la charge de travail?

C'est là où les _Services_ rentrent en jeu.

## La ressource Service {#service-resource}

Dans Kubernetes, un service est une abstraction qui définit un ensemble logique de pods et une politique permettant d'y accéder (parfois ce modèle est appelé un micro-service).
L'ensemble des pods ciblés par un service est généralement déterminé par un {{< glossary_tooltip text="selector" term_id="selector" >}} (voir [ci-dessous](#services-without-selectors) pourquoi vous voudrez peut-être un service _sans_ un sélecteur).

Par exemple, considérons un backend de traitement d'image sans état qui s'exécute avec 3 replicas.
Ces réplicas sont fongibles et les frontends ne se soucient pas du backend qu'ils utilisent.
Bien que les pods réels qui composent l'ensemble backend puissent changer, les clients frontends ne devraient pas avoir besoin de le savoir, pas plus qu'ils ne doivent suivre eux-mêmes l'ensemble des backends.

L'abstraction du service permet ce découplage.

### Découverte de services native du cloud

Si vous pouvez utiliser les API Kubernetes pour la découverte de services dans votre application, vous pouvez interroger l'{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} pour les Endpoints, qui sont mis à jour chaque fois que l'ensemble des pods d'un service change.

Pour les applications non natives, Kubernetes propose des moyens de placer un port réseau ou un load balancer entre votre application et les modules backend.

## Définition d'un service

Un service dans Kubernetes est un objet REST, semblable à un pod.
Comme tous les objets REST, vous pouvez effectuer un `POST` d'une définition de service sur le serveur API pour créer une nouvelle instance.

Par exemple, supposons que vous ayez un ensemble de pods qui écoutent chacun sur le port TCP 9376 et portent une étiquette `app=MyApp`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Cette spécification crée un nouvel objet Service nommé «my-service», qui cible le port TCP 9376 sur n'importe quel pod avec l'étiquette «app=MyApp».

Kubernetes attribue à ce service une adresse IP (parfois appelé l'"IP cluster"), qui est utilisé par les proxies Service (voir [IP virtuelles et proxy de service](#virtual-ips-and-service-proxies)).

Le contrôleur de service recherche en continu les pods qui correspondent à son sélecteur, puis POST toutes les mises à jour d'un objet Endpoint également appelé "my-service".

{{< note >}}
Un service peut mapper _n'importe quel_ `port` entrant vers un `targetPort`.
Par défaut et pour plus de commodité, le `targetPort` a la même valeur que le champ `port`.
{{< /note >}}

Les définitions de port dans les pods ont des noms, et vous pouvez référencer ces noms dans l'attribut `targetPort` d'un service.
Cela fonctionne même s'il existe un mélange de pods dans le service utilisant un seul nom configuré, avec le même protocole réseau disponible via différents numéros de port.
Cela offre beaucoup de flexibilité pour déployer et faire évoluer vos services.
Par exemple, vous pouvez modifier les numéros de port que les pods exposent dans la prochaine version de votre logiciel principal, sans casser les clients.

Le protocole par défaut pour les services est TCP; vous pouvez également utiliser tout autre [protocole pris en charge](#protocol-support).

Comme de nombreux services doivent exposer plus d'un port, Kubernetes prend en charge plusieurs définitions de port sur un objet Service.
Chaque définition de port peut avoir le même protocole, ou un autre.

### Services sans sélecteurs

Les services abritent le plus souvent l'accès aux pods Kubernetes, mais ils peuvent également abstraire d'autres types de backends.
Par exemple:

  * Vous voulez avoir un cluster de base de données externe en production, mais dans votre environnement de test, vous utilisez vos propres bases de données.
  * Vous souhaitez pointer votre service vers un service dans un autre {{< glossary_tooltip term_id="namespace" >}} ou sur un autre cluster.
  * Vous migrez une charge de travail vers Kubernetes.
    Lors de l'évaluation de l'approche, vous exécutez uniquement une partie de vos backends dans Kubernetes.

Dans n'importe lequel de ces scénarios, vous pouvez définir un service _sans_ un sélecteur de pod.
Par exemple:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Étant donné que ce service n'a pas de sélecteur, l'objet Endpoint correspondant n'est *pas* créé automatiquement.
Vous pouvez mapper manuellement le service à l'adresse réseau et au port où il s'exécute, en ajoutant manuellement un objet Endpoint:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```

{{< note >}}
Les IP de noeud final ne doivent pas être: loopback (127.0.0.0/8 pour IPv4, ::1/128 pour IPv6), ou link-local (169.254.0.0/16 et 224.0.0.0/24 pour IPv4, fe80::/64 pour IPv6).

Les adresses IP de noeud final ne peuvent pas être les adresses IP de cluster d'autres services Kubernetes, car {{< glossary_tooltip term_id="kube-proxy" >}} ne prend pas en charge les adresses IP virtuelles en tant que destination.
{{< /note >}}

L'accès à un service sans sélecteur fonctionne de la même manière que s'il avait un sélecteur.
Dans l'exemple ci-dessus, le trafic est routé vers le point de terminaison unique défini dans le YAML: `192.0.2.42:9376` (TCP).

Un service ExternalName est un cas spécial de service qui n'a pas de sélecteurs et utilise des noms DNS à la place.
Pour plus d'informations, consultez la section [ExternalName](#externalname) plus loin dans ce document.

### Endpoint Slices

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

Un Endpoint Slices est une ressource API qui peut fournir une alternative plus évolutive au Endpoints.
Bien que conceptuellement assez similaire aux Endpoints, les Endpoint Slices permettent la distribution des  endpoints réseau sur plusieurs ressources.
Par défaut, un Endpoint Slice est considéré comme "plein" une fois qu'il atteint 100 endpoints, au delà, des Endpoint Slices addtionnels seront crées pour stocker tout autre endpoints.

Les Endpoint Slices fournissent des attributs et des fonctionnalités supplémentaires qui sont décrits en détail dans [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).

## IP virtuelles et proxy de service

Chaque nœud d'un cluster Kubernetes exécute un `kube-proxy`.
`kube-proxy` est responsable de l'implémentation d'une forme d'IP virtuelle pour les `Services` qui ne sont pas de type [`ExternalName`](#externalname).

### Pourquoi ne pas utiliser le DNS round-robin ?

Une question qui apparaît de temps en temps est pourquoi Kubernetes s'appuie sur le proxy pour transférer le trafic entrant vers les backends.
Et les autres approches?
Par exemple, serait-il possible de configurer des enregistrements DNS qui ont plusieurs valeurs A (ou AAAA pour IPv6), et de s'appuyer sur la résolution de nom à tour de rôle (round-robin)?

Il existe plusieurs raisons d'utiliser le proxy pour les services:

 * Il existe une longue histoire d'implémentations DNS ne respectant pas les TTL d'enregistrement et mettant en cache les résultats des recherches de noms après leur expiration.
 * Certaines applications n'effectuent des recherches DNS qu'une seule fois et mettent en cache les résultats indéfiniment.
 * Même si les applications et les bibliothèques ont fait une bonne résolution, les TTL faibles ou nuls sur les enregistrements DNS pourraient imposer une charge élevée sur DNS qui devient alors difficile à gérer.

### User space proxy mode {#proxy-mode-userspace}

Dans ce mode, kube-proxy surveille le maître Kubernetes pour l'ajout et la suppression d'objets Service et Endpoint.
Pour chaque service, il ouvre un port (choisi au hasard) sur le nœud local.
Toutes les connexions à ce "port proxy" sont transmises par proxy à l'un des modules backend du service (comme indiqué via les points de terminaison).
kube-proxy prend en compte le paramètre `SessionAffinity` du service pour décider quel pod backend utiliser.

Enfin, le proxy de l'espace utilisateur installe des règles iptables qui capturent le trafic vers le service `clusterIP` (qui est virtuel) et `port`.
Les règles redirigent ce trafic vers le port proxy qui fait office de proxy pour le Pod de backend.

Par défaut, kube-proxy en mode espace utilisateur choisit un backend via un algorithme round-robin.

![Diagramme de vue d'ensemble des services pour le proxy de l'espace utilisateur](/images/docs/services-userspace-overview.svg)

### `iptables` proxy mode {#proxy-mode-iptables}

Dans ce mode, kube-proxy surveille le plan de contrôle Kubernetes pour l'ajout et la suppression d'objets Service et Endpoint.
Pour chaque service, il installe des règles iptables, qui capturent le trafic vers le «clusterIP» et le «port» du service, et redirigent ce trafic vers l'un des ensembles principaux du service.
Pour chaque objet Endpoint, il installe des règles iptables qui sélectionnent un Pod de backend.

Par défaut, kube-proxy en mode iptables choisit un backend au hasard.

L'utilisation d'iptables pour gérer le trafic a un coût système inférieur, car le trafic est géré par Linux netfilter sans avoir besoin de basculer entre l'espace utilisateur et l'espace noyau.
Cette approche est également susceptible d'être plus fiable.

Si kube-proxy s'exécute en mode iptables et que le premier pod sélectionné ne répond pas, la connexion échoue.
C'est différent du mode espace utilisateur: dans ce scénario, kube-proxy détecterait que la connexion au premier pod avait échoué et réessayerait automatiquement avec un pod backend différent.

Vous pouvez utiliser les [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) d'un Pod pour vérifier que les pods backend fonctionnent correctement, de sorte que kube-proxy en mode iptables ne voit que les backends testés comme sains.
Cela signifie que vous évitez d'envoyer du trafic via kube-proxy vers un pod connu pour avoir échoué.

![Diagramme de présentation des services pour le proxy iptables](/images/docs/services-iptables-overview.svg)

### IPVS proxy mode {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

En mode `ipvs`, kube-proxy surveille les Services et Endpoints Kubernetes. kube-proxy appelle l'interface` netlink` pour créer les règles IPVS en conséquence et synchronise périodiquement les règles IPVS avec les Services et Endpoints Kubernetes.
Cette boucle de contrôle garantit que l'état IPVS correspond à l'état souhaité.
Lors de l'accès à un service, IPVS dirige le trafic vers l'un des pods backend.

Le mode proxy IPVS est basé sur des fonctions hooks de netfilter qui est similaire au mode iptables, mais utilise la table de hachage comme structure de données sous-jacente et fonctionne dans l'espace du noyau.
Cela signifie que kube-proxy en mode IPVS redirige le trafic avec une latence plus faible que kube-proxy en mode iptables, avec de bien meilleures performances lors de la synchronisation des règles de proxy.
Par rapport aux autres modes proxy, le mode IPVS prend également en charge un débit plus élevé de trafic réseau.

IPVS offre plus d'options pour équilibrer le trafic vers les pods d'arrière-plan; ceux-ci sont:

- `rr`: round-robin
- `lc`: least connection (plus petit nombre de connexions ouvertes)
- `dh`: destination hashing
- `sh`: source hashing
- `sed`: shortest expected delay
- `nq`: never queue

{{< note >}}
Pour exécuter kube-proxy en mode IPVS, vous devez rendre IPVS Linux disponible sur le nœud avant de démarrer kube-proxy.

Lorsque kube-proxy démarre en mode proxy IPVS, il vérifie si les modules du noyau IPVS sont disponibles.
Si les modules du noyau IPVS ne sont pas détectés, alors kube-proxy revient à fonctionner en mode proxy iptables.
{{< /note >}}

![Diagramme de vue d'ensemble des services pour le proxy IPVS](/images/docs/services-ipvs-overview.svg)

Dans ces modèles de proxy, le trafic lié à l'IP: Port du service est dirigé vers un backend approprié sans que les clients ne sachent quoi que ce soit sur Kubernetes, les services ou les pods.

Si vous souhaitez vous assurer que les connexions d'un client particulier sont transmises à chaque fois au même pod, vous pouvez sélectionner l'affinité de session en fonction des adresses IP du client en définissant `service.spec.sessionAffinity` sur" ClientIP "(la valeur par défaut est" None").
Vous pouvez également définir la durée maximale de session persistante en définissant `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` de manière appropriée (la valeur par défaut est 10800, ce qui correspond à 3 heures).

## Services multi-ports

Pour certains services, vous devez exposer plusieurs ports.
Kubernetes vous permet de configurer plusieurs définitions de port sur un objet Service.
Lorsque vous utilisez plusieurs ports pour un service, vous devez donner tous vos noms de ports afin qu'ils ne soient pas ambigus.
Par exemple:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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
Comme pour tous les {{< glossary_tooltip term_id="name" text="names">}} Kubernetes en général, les noms de ports ne doivent contenir que des caractères alphanumériques en minuscules et `-`.
Les noms de port doivent également commencer et se terminer par un caractère alphanumérique.

Par exemple, les noms `123-abc` et `web` sont valides, mais `123_abc` et `-web` ne le sont pas.
{{< /note >}}

## Choisir sa propre adresse IP

Vous pouvez spécifier votre propre adresse IP de cluster dans le cadre d'une demande de création de Service.
Pour ce faire, définissez le champ `.spec.clusterIP`.
Par exemple, si vous avez déjà une entrée DNS existante que vous souhaitez réutiliser, ou des systèmes existants qui sont configurés pour une adresse IP spécifique et difficiles à reconfigurer.

L'adresse IP que vous choisissez doit être une adresse IPv4 ou IPv6 valide dans la plage CIDR `service-cluster-ip-range` configurée pour le serveur API.
Si vous essayez de créer un service avec une valeur d'adresse de clusterIP non valide, le serveur API retournera un code d'état HTTP 422 pour indiquer qu'il y a un problème.

## Découvrir les services

Kubernetes prend en charge 2 modes principaux de recherche d'un service: les variables d'environnement et DNS.

### Variables d'environnement

Lorsqu'un pod est exécuté sur un nœud, le kubelet ajoute un ensemble de variables d'environnement pour chaque service actif.
Il prend en charge à la fois les variables [Docker links](https://docs.docker.com/userguide/dockerlinks/) (voir [makeLinkVariables](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L49)) et plus simplement les variables `{SVCNAME}_SERVICE_HOST` et `{SVCNAME}_SERVICE_PORT`, où le nom du service est en majuscules et les tirets sont convertis en underscore.

Par exemple, le service `redis-master` qui expose le port TCP 6379 et a reçu l'adresse IP de cluster 10.0.0.11, produit les variables d'environnement suivantes:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Lorsque vous avez un pod qui doit accéder à un service et que vous utilisez la méthode des variables d'environnement pour publier le port et l'IP du cluster sur les pods clients, vous devez créer le service *avant* que les pods clients n'existent.
Sinon, ces pods clients n'auront pas leurs variables d'environnement remplies.

Si vous utilisez uniquement DNS pour découvrir l'IP du cluster pour un service, vous n'avez pas à vous soucier de ce problème de commande.
{{< /note >}}

### DNS

Vous pouvez (et devrait presque toujours) configurer un service DNS pour votre cluster Kubernetes à l'aide d'un [add-on](/docs/concepts/cluster-administration/addons/).

Un serveur DNS prenant en charge les clusters, tel que CoreDNS, surveille l'API Kubernetes pour les nouveaux services et crée un ensemble d'enregistrements DNS pour chacun.
Si le DNS a été activé dans votre cluster, tous les pods devraient automatiquement être en mesure de résoudre les services par leur nom DNS.

Par exemple, si vous avez un service appelé `"my-service"` dans un namespace Kubernetes `"my-ns"`, le plan de contrôle et le service DNS agissant ensemble et créent un enregistrement DNS pour `"my-service.my-ns"`.
Les Pods dans le Namespace `"my-ns"` devrait être en mesure de le trouver en faisant simplement une recherche de nom pour `my-service` (`"my-service.my-ns"` fonctionnerait également).

Les pods dans d'autres namespaces doivent utiliser le nom de `my-service.my-ns`.
Ces noms seront résolus en IP de cluster attribuée pour le service.

Kubernetes prend également en charge les enregistrements DNS SRV (Service) pour les ports nommés.
Si le service `"my-service.my-ns"` a un port nommé `http` avec un protocole défini sur `TCP`, vous pouvez effectuer une requête DNS SRV pour `_http._tcp.my-service.my-ns` pour découvrir le numéro de port de `http`, ainsi que l'adresse IP.

Le serveur DNS Kubernetes est le seul moyen d'accéder aux services `ExternalName`.
Vous pouvez trouver plus d'informations sur la résolution de `ExternalName` dans [DNS Pods et Services](/docs/concepts/services-networking/dns-pod-service/).

## Headless Services

Parfois, vous n'avez pas besoin de load-balancing et d'une seule IP de Service.
Dans ce cas, vous pouvez créer ce que l'on appelle des services "headless", en spécifiant explicitement "None" pour l'IP du cluster (`.spec.clusterIP`).

Vous pouvez utiliser un service headless pour interfacer avec d'autres mécanismes de découverte de service, sans être lié à l'implémentation de Kubernetes.

Pour les services headless, une IP de cluster n'est pas allouée, kube-proxy ne gère pas ces services et aucun load-balancing ou proxy n'est effectué par la plateforme pour eux.
La configuration automatique de DNS dépend de la définition ou non de sélecteurs par le service:

### Avec sélecteurs

Pour les services sans tête qui définissent des sélecteurs, le controlleur des Endpoints crée des enregistrements `Endpoints` dans l'API, et modifie la configuration DNS pour renvoyer des enregistrements (adresses) qui pointent directement vers les `Pods` visés par le `Service`.

### Sans sélecteurs

Pour les services headless qui ne définissent pas de sélecteurs, le contrôleur des Endpoints ne crée pas d'enregistrements `Endpoints`.
Cependant, le système DNS recherche et configure soit:

  * Enregistrements CNAME pour les services de type [`ExternalName`](#externalname).
  * Un enregistrement pour tous les «Endpoints» qui partagent un nom avec le Service, pour tous les autres types.

## Services de publication (ServiceTypes) {#publishing-services-service-types}

Pour certaines parties de votre application (par exemple, les frontaux), vous souhaiterez peut-être exposer un service sur une adresse IP externe, qui est en dehors de votre cluster.

Les «ServiceTypes» de Kubernetes vous permettent de spécifier le type de service que vous souhaitez.
La valeur par défaut est «ClusterIP».

Les valeurs de `Type` et leurs comportements sont:

   * `ClusterIP`: Expose le service sur une IP interne au cluster.
     Le choix de cette valeur rend le service uniquement accessible à partir du cluster.
     Il s'agit du `ServiceType` par défaut.
   * [`NodePort`](#nodeport): Expose le service sur l'IP de chaque nœud sur un port statique (le `NodePort`).
     Un service `ClusterIP`, vers lequel le service` NodePort` est automatiquement créé.
     Vous pourrez contacter le service `NodePort`, depuis l'extérieur du cluster, en demandant `<NodeIP>: <NodePort>`.
   * [`LoadBalancer`](#loadbalancer): Expose le service en externe à l'aide de l'équilibreur de charge d'un fournisseur de cloud.
     Les services `NodePort` et `ClusterIP`, vers lesquels les itinéraires de l'équilibreur de charge externe, sont automatiquement créés.
   * [`ExternalName`](#externalname): Mappe le service au contenu du champ `externalName` (par exemple` foo.bar.example.com`), en renvoyant un enregistrement `CNAME` avec sa valeur.
     Aucun proxy d'aucune sorte n'est mis en place.
     {{< note >}}
     Vous avez besoin de CoreDNS version 1.7 ou supérieure pour utiliser le type `ExternalName`.
     {{< /note >}}

Vous pouvez également utiliser [Ingress] (/fr/docs/concepts/services-networking/ingress) pour exposer votre service.
Ingress n'est pas un type de service, mais il sert de point d'entrée pour votre cluster.
Il vous permet de consolider vos règles de routage en une seule ressource car il peut exposer plusieurs services sous la même adresse IP.

### Type NodePort {#nodeport}

Si vous définissez le champ `type` sur` NodePort`, le plan de contrôle Kubernetes alloue un port à partir d'une plage spécifiée par l'indicateur `--service-node-port-range` (par défaut: 30000-32767).
Chaque nœud assure le proxy de ce port (le même numéro de port sur chaque nœud) vers votre service.
Votre service signale le port alloué dans son champ `.spec.ports[*].nodePort`.

Si vous souhaitez spécifier une ou des adresses IP particulières pour proxyer le port, vous pouvez définir l'indicateur `--nodeport-addresses` dans kube-proxy sur des blocs IP particuliers; cela est pris en charge depuis Kubernetes v1.10.
Cet indicateur prend une liste délimitée par des virgules de blocs IP (par exemple 10.0.0.0/8, 192.0.2.0/25) pour spécifier les plages d'adresses IP que kube-proxy doit considérer comme locales pour ce nœud.

Par exemple, si vous démarrez kube-proxy avec l'indicateur `--nodeport-addresses=127.0.0.0/8`, kube-proxy sélectionne uniquement l'interface de boucle locale pour les services NodePort.
La valeur par défaut pour `--nodeport-addresses` est une liste vide.
Cela signifie que kube-proxy doit prendre en compte toutes les interfaces réseau disponibles pour NodePort (qui est également compatible avec les versions antérieures de Kubernetes).

Si vous voulez un numéro de port spécifique, vous pouvez spécifier une valeur dans le champ `nodePort`.
Le plan de contrôle vous attribuera ce port ou signalera l'échec de la transaction API.
Cela signifie que vous devez vous occuper vous-même des éventuelles collisions de ports.
Vous devez également utiliser un numéro de port valide, celui qui se trouve dans la plage configurée pour l'utilisation de NodePort.

L'utilisation d'un NodePort vous donne la liberté de configurer votre propre solution d'équilibrage de charge, de configurer des environnements qui ne sont pas entièrement pris en charge par Kubernetes, ou même d'exposer directement les adresses IP d'un ou plusieurs nœuds.

Notez que ce service est visible en tant que `<NodeIP>: spec.ports[*].nodePort` et `.spec.clusterIP: spec.ports[*].Port`.
(Si l'indicateur `--nodeport-addresses` dans kube-proxy est défini, <NodeIP> serait filtré NodeIP(s).)

### Type LoadBalancer {#loadbalancer}

Sur les fournisseurs de cloud qui prennent en charge les load balancers externes, la définition du champ `type` sur` LoadBalancer` provisionne un load balancer pour votre service.
La création réelle du load balancer se produit de manière asynchrone et les informations sur le load balancer provisionné sont publiées dans le champ `.status.loadBalancer`.
Par exemple:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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

Le trafic provenant du load balancer externe est dirigé vers les Pod backend.
Le fournisseur de cloud décide de la répartition de la charge.

Some cloud providers allow you to specify the `loadBalancerIP`.
In those cases, the load-balancer is created with the user-specified `loadBalancerIP`.
If the `loadBalancerIP` field is not specified, the loadBalancer is set up with an ephemeral IP address.
If you specify a `loadBalancerIP` but your cloud provider does not support the feature, the `loadbalancerIP` field that you set is ignored.

{{< note >}}
If you're using SCTP, see the [caveat](#caveat-sctp-loadbalancer-service-type) below about the `LoadBalancer` Service type.
{{< /note >}}

{{< note >}}

On **Azure**, if you want to use a user-specified public type `loadBalancerIP`, you first need to create a static type public IP address resource.
This public IP address resource should be in the same resource group of the other automatically created resources of the cluster.
For example, `MC_myResourceGroup_myAKSCluster_eastus`.

Specify the assigned IP address as loadBalancerIP. 
Ensure that you have updated the securityGroupName in the cloud provider configuration file.
For information about troubleshooting `CreatingLoadBalancerFailed` permission issues see, [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](https://docs.microsoft.com/en-us/azure/aks/static-ip) or [CreatingLoadBalancerFailed on AKS cluster with advanced networking](https://github.com/Azure/AKS/issues/357).

{{< /note >}}

#### Internal load balancer

In a mixed environment it is sometimes necessary to route traffic from Services inside the same (virtual) network address block.

In a split-horizon DNS environment you would need two Services to be able to route both external and internal traffic to your endpoints.

You can achieve this by adding one the following annotations to a Service.
The annotation to add depends on the cloud Service provider you're using.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Select one of the tabs.
{{% /tab %}}
{{% tab name="GCP" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```
{{% /tab %}}
{{% tab name="AWS" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="Azure" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="OpenStack" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```
{{% /tab %}}
{{% tab name="Baidu Cloud" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```
{{% /tab %}}
{{% tab name="Tencent Cloud" %}}
```yaml
[...]
metadata:
  annotations:  
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
[...]
```
{{% /tab %}}
{{< /tabs >}}


#### TLS support on AWS {#ssl-support-on-aws}

For partial TLS / SSL support on clusters running on AWS, you can add three annotations to a `LoadBalancer` service:

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

The first specifies the ARN of the certificate to use.
It can be either a certificate from a third party issuer that was uploaded to IAM or one created within AWS Certificate Manager.

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

The second annotation specifies which protocol a Pod speaks.
For HTTPS and SSL, the ELB expects the Pod to authenticate itself over the encrypted connection, using a certificate.

HTTP and HTTPS selects layer 7 proxying: the ELB terminates the connection with the user, parse headers and inject the `X-Forwarded-For` header with the user's IP address (Pods only see the IP address of the ELB at the other end of its connection) when forwarding requests.

TCP and SSL selects layer 4 proxying: the ELB forwards traffic without modifying the headers.

In a mixed-use environment where some ports are secured and others are left unencrypted, you can use the following annotations:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

In the above example, if the Service contained three ports, `80`, `443`, and `8443`, then `443` and `8443` would use the SSL certificate, but `80` would just be proxied HTTP.

From Kubernetes v1.9 onwards you can use [predefined AWS SSL policies](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic elb-security-policy-table.html) with HTTPS or SSL listeners for your Services.
To see which policies are available for use, you can use the `aws` command line tool:

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

You can then specify any one of those policies using the "`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`" annotation; for example:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### PROXY protocol support on AWS

To enable [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) support for clusters running on AWS, you can use the following service annotation:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Since version 1.3.0, the use of this annotation applies to all ports proxied by the ELB and cannot be configured otherwise.

#### ELB Access Logs on AWS

There are several annotations to manage access logs for ELB Services on AWS.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled` controls whether access logs are enabled.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval` controls the interval in minutes for publishing the access logs.
You can specify an interval of either 5 or 60 minutes.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name` controls the name of the Amazon S3 bucket where load balancer access logs are stored.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix` specifies the logical hierarchy you created for your Amazon S3 bucket.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # Specifies whether access logs are enabled for the load balancer
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # The interval for publishing the access logs. You can specify an interval of either 5 or 60 (minutes).
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # The name of the Amazon S3 bucket where the access logs are stored
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod`
```

#### Connection Draining on AWS

Connection draining for Classic ELBs can be managed with the annotation `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` set
to the value of `"true"`.
The annotation `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` can also be used to set maximum time, in seconds, to keep the existing connections open before deregistering the instances.


```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### Other ELB annotations

There are other annotations to manage Classic Elastic Load Balancers that are described below.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
        # The time, in seconds, that the connection is allowed to be idle (no data has been sent over the connection) before it is closed by the load balancer

        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        # Specifies whether cross-zone load balancing is enabled for the load balancer

        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
        # A comma-separated list of key-value pairs which will be recorded as
        # additional tags in the ELB.

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
        # The number of successive successful health checks required for a backend to
        # be considered healthy for traffic. Defaults to 2, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
        # The number of unsuccessful health checks required for a backend to be
        # considered unhealthy for traffic. Defaults to 6, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
        # The approximate interval, in seconds, between health checks of an
        # individual instance. Defaults to 10, must be between 5 and 300
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
        # The amount of time, in seconds, during which no response means a failed
        # health check. This value must be less than the service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
        # value. Defaults to 5, must be between 2 and 60

        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
        # A list of additional security groups to be added to the ELB
```

#### Network Load Balancer support on AWS {#aws-nlb-support}

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

To use a Network Load Balancer on AWS, use the annotation `service.beta.kubernetes.io/aws-load-balancer-type` with the value set to `nlb`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{< note >}}
NLB only works with certain instance classes; see the [AWS documentation](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets) on Elastic Load Balancing for a list of supported instance types.
{{< /note >}}

Unlike Classic Elastic Load Balancers, Network Load Balancers (NLBs) forward the client's IP address through to the node.
If a Service's `.spec.externalTrafficPolicy` is set to `Cluster`, the client's IP address is not propagated to the end Pods.

By setting `.spec.externalTrafficPolicy` to `Local`, the client IP addresses is propagated to the end Pods, but this could result in uneven distribution of
traffic.
Nodes without any Pods for a particular LoadBalancer Service will fail the NLB Target Group's health check on the auto-assigned `.spec.healthCheckNodePort` and not receive any traffic.

In order to achieve even traffic, either use a DaemonSet, or specify a [pod anti-affinity](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) to not locate on the same node.

You can also use NLB Services with the [internal load balancer](/docs/concepts/services-networking/service/#internal-load-balancer) annotation.

In order for client traffic to reach instances behind an NLB, the Node security groups are modified with the following IP rules:

| Rule           | Protocol | Port(s)                                                                             | IpRange(s)                                                 | IpRange Description                                |
|----------------|----------|-------------------------------------------------------------------------------------|------------------------------------------------------------|----------------------------------------------------|
| Health Check   | TCP      | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | VPC CIDR                                                   | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| Client Traffic | TCP      | NodePort(s)                                                                         | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTU Discovery  | ICMP     | 3,4                                                                                 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\>    |

In order to limit which client IP's can access the Network Load Balancer, specify `loadBalancerSourceRanges`.

```yaml
spec:
  loadBalancerSourceRanges:
    - "143.231.0.0/16"
```

{{< note >}}
If `.spec.loadBalancerSourceRanges` is not set, Kubernetes allows traffic from `0.0.0.0/0` to the Node Security Group(s).
If nodes have public IP addresses, be aware that non-NLB traffic can also reach all instances in those modified security groups.

{{< /note >}}

#### Other CLB annotations on Tencent Kubernetes Engine (TKE)

There are other annotations for managing Cloud Load Balancers on TKE as shown below.

```yaml
    metadata:
      name: my-service
      annotations:
        # Bind Loadbalancers with speicfied nodes
        service.kubernetes.io/qcloud-loadbalancer-backends-label: key in (value1, value2)

        # ID of an existing load balancer
        service.kubernetes.io/tke-existed-lbid：lb-6swtxxxx
        
        # Custom parameters for the load balancer (LB), does not support modification of LB type yet
        service.kubernetes.io/service.extensiveParameters: ""
        
        # Custom parameters for the LB listener 
        service.kubernetes.io/service.listenerParameters: ""
        
        # Specifies the type of Load balancer;
        # valid values: classic (Classic Cloud Load Balancer) or application (Application Cloud Load Balancer)
        service.kubernetes.io/loadbalance-type: xxxxx

        # Specifies the public network bandwidth billing method; 
        # valid values: TRAFFIC_POSTPAID_BY_HOUR(bill-by-traffic) and BANDWIDTH_POSTPAID_BY_HOUR (bill-by-bandwidth).
        service.kubernetes.io/qcloud-loadbalancer-internet-charge-type: xxxxxx

        # Specifies the bandwidth value (value range: [1,2000] Mbps).
        service.kubernetes.io/qcloud-loadbalancer-internet-max-bandwidth-out: "10"

        # When this annotation is set，the loadbalancers will only register nodes 
        # with pod running on it, otherwise all nodes will be registered.
        service.kubernetes.io/local-svc-only-bind-node-with-pod: true
```

### Type ExternalName {#externalname}

Services of type ExternalName map a Service to a DNS name, not to a typical selector such as `my-service` or `cassandra`.
You specify these Services with the `spec.externalName` parameter.

This Service definition, for example, maps the `my-service` Service in the `prod` namespace to `my.database.example.com`:

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
ExternalName accepts an IPv4 address string, but as a DNS names comprised of digits, not as an IP address.
ExternalNames that resemble IPv4 addresses are not resolved by CoreDNS or ingress-nginx because ExternalName is intended to specify a canonical DNS name.
To hardcode an IP address, consider using [headless Services](#headless-services).
{{< /note >}}

When looking up the host `my-service.prod.svc.cluster.local`, the cluster DNS Service returns a `CNAME` record with the value `my.database.example.com`.
Accessing `my-service` works in the same way as other Services but with the crucial difference that redirection happens at the DNS level rather than via proxying or forwarding.
Should you later decide to move your database into your cluster, you can start its Pods, add appropriate selectors or endpoints, and change the Service's `type`.

{{< warning >}}
You may have trouble using ExternalName for some common protocols, including HTTP and HTTPS.
If you use ExternalName then the hostname used by clients inside your cluster is different from the name that the ExternalName references.

For protocols that use hostnames this difference may lead to errors or unexpected responses.
HTTP requests will have a `Host:` header that the origin server does not recognize; TLS servers will not be able to provide a certificate matching the hostname that the client connected to.
{{< /warning >}}

{{< note >}}
This section is indebted to the [Kubernetes Tips - Part 1](https://akomljen.com/kubernetes-tips-part-1/) blog post from [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes Services can be exposed on those `externalIPs`. Traffic that ingresses into the cluster with the external IP (as destination IP), on the Service port, will be routed to one of the Service endpoints.
`externalIPs` are not managed by Kubernetes and are the responsibility of the cluster administrator.

In the Service spec, `externalIPs` can be specified along with any of the `ServiceTypes`.
In the example below, "`my-service`" can be accessed by clients on "`80.11.12.10:80`" (`externalIP:port`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
  externalIPs:
    - 80.11.12.10
```

## Shortcomings

Using the userspace proxy for VIPs, work at small to medium scale, but will not scale to very large clusters with thousands of Services.
The [original design proposal for portals](http://issue.k8s.io/1107) has more details on this.

Using the userspace proxy obscures the source IP address of a packet accessing a Service.
This makes some kinds of network filtering (firewalling) impossible.
The iptables proxy mode does not obscure in-cluster source IPs, but it does still impact clients coming through a load balancer or node-port.

The `Type` field is designed as nested functionality - each level adds to the
previous.  This is not strictly required on all cloud providers (e.g. Google Compute Engine does
not need to allocate a `NodePort` to make `LoadBalancer` work, but AWS does)
but the current API requires it.

## Virtual IP implementation {#the-gory-details-of-virtual-ips}

The previous information should be sufficient for many people who just want to use Services.
However, there is a lot going on behind the scenes that may be worth understanding.

### Avoiding collisions

One of the primary philosophies of Kubernetes is that you should not be exposed to situations that could cause your actions to fail through no fault of your own.
For the design of the Service resource, this means not making you choose your own port number for a if that choice might collide with someone else's choice.
That is an isolation failure.

In order to allow you to choose a port number for your Services, we must ensure that no two Services can collide.
Kubernetes does that by allocating each Service its own IP address.

To ensure each Service receives a unique IP, an internal allocator atomically updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}} prior to creating each Service.
The map object must exist in the registry for Services to get IP address assignments, otherwise creations will fail with a message indicating an IP address could not be allocated.

In the control plane, a background controller is responsible for creating that map (needed to support migrating from older versions of Kubernetes that used in-memory locking).
Kubernetes also uses controllers to checking for invalid assignments (eg due to administrator intervention) and for cleaning up allocated IP addresses that are no longer used by any Services.

### Service IP addresses {#ips-and-vips}

Unlike Pod IP addresses, which actually route to a fixed destination, Service IPs are not actually answered by a single host.  
Instead, kube-proxy uses iptables (packet processing logic in Linux) to define _virtual_ IP addresses which are transparently redirected as needed.
When clients connect to the VIP, their traffic is automatically transported to an appropriate endpoint.
The environment variables and DNS for Services are actually populated in terms of the Service's virtual IP address (and port).

kube-proxy supports three proxy modes&mdash;userspace, iptables and IPVS&mdash;which each operate slightly differently.

#### Userspace

As an example, consider the image processing application described above.
When the backend Service is created, the Kubernetes master assigns a virtual IP address, for example 10.0.0.1.
Assuming the Service port is 1234, the Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it opens a new random port, establishes an iptables redirect from the virtual IP address to this new port, and starts accepting connections on it.

When a client connects to the Service's virtual IP address, the iptables rule kicks in, and redirects the packets to the proxy's own port.
The “Service proxy” chooses a backend, and starts proxying traffic from the client to the backend.

This means that Service owners can choose any port they want without risk of collision.
Clients can simply connect to an IP and port, without being aware of which Pods they are actually accessing.

#### iptables

Again, consider the image processing application described above.
When the backend Service is created, the Kubernetes control plane assigns a virtual IP address, for example 10.0.0.1.
Assuming the Service port is 1234, the Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it installs a series of iptables rules which redirect from the virtual IP address  to per-Service rules.
The per-Service rules link to per-Endpoint rules which redirect traffic (using destination NAT) to the backends.

When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are redirected to the backend.
Unlike the userspace proxy, packets are never copied to userspace, the kube-proxy does not have to be running for the virtual IP address to work, and Nodes see traffic arriving from the unaltered client IP address.

This same basic flow executes when traffic comes in through a node-port or through a load-balancer, though in those cases the client IP does get altered.

#### IPVS

iptables operations slow down dramatically in large scale cluster e.g 10,000 Services.
IPVS is designed for load balancing and based on in-kernel hash tables.
So you can achieve performance consistency in large number of Services from IPVS-based kube-proxy.
Meanwhile, IPVS-based kube-proxy has more sophisticated load balancing algorithms (least conns, locality, weighted, persistence).

## API Object

Service is a top-level resource in the Kubernetes REST API.
You can find more details about the API object at: [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Supported protocols {#protocol-support}

### TCP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

You can use TCP for any kind of Service, and it's the default network protocol.

### UDP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

You can use UDP for most Services.
For type=LoadBalancer Services, UDP support depends on the cloud provider offering this facility.

### HTTP

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

If your cloud provider supports it, you can use a Service in LoadBalancer mode to set up external HTTP / HTTPS reverse proxying, forwarded to the Endpoints of the Service.

{{< note >}}
You can also use {{< glossary_tooltip term_id="ingress" >}} in place of Service to expose HTTP / HTTPS Services.
{{< /note >}}

### PROXY protocol

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

If your cloud provider supports it (eg, [AWS](/docs/concepts/cluster-administration/cloud-providers/#aws)), you can use a Service in LoadBalancer mode to configure a load balancer outside of Kubernetes itself, that will forward connections prefixed with [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

The load balancer will send an initial series of octets describing the incoming connection, similar to this example

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
followed by the data from the client.

### SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kubernetes supports SCTP as a `protocol` value in Service, Endpoint, NetworkPolicy and Pod definitions as an alpha feature.
To enable this feature, the cluster administrator needs to enable the `SCTPSupport` feature gate on the apiserver, for example, `--feature-gates=SCTPSupport=true,…`.

When the feature gate is enabled, you can set the `protocol` field of a Service, Endpoint, NetworkPolicy or Pod to `SCTP`. 
Kubernetes sets up the network accordingly for the SCTP associations, just like it does for TCP connections.

#### Warnings {#caveat-sctp-overview}

##### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

{{< warning >}}
The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.
{{< /warning >}}

##### Service with type=LoadBalancer {#caveat-sctp-loadbalancer-service-type}

{{< warning >}}
You can only create a Service with `type` LoadBalancer plus `protocol` SCTP if the cloud provider's load balancer implementation supports SCTP as a protocol.
Otherwise, the Service creation request is rejected.
The current set of cloud load balancer providers (Azure, AWS, CloudStack, GCE, OpenStack) all lack support for SCTP.
{{< /warning >}}

##### Windows {#caveat-sctp-windows-os}

{{< warning >}}
SCTP is not supported on Windows based nodes.
{{< /warning >}}

##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
The kube-proxy does not support the management of SCTP associations when it is in userspace mode.
{{< /warning >}}

## Future work

In the future, the proxy policy for Services can become more nuanced than simple round-robin balancing, for example master-elected or sharded.
We also envision that some Services will have "real" load balancers, in which case the virtual IP address will simply transport the packets there.

The Kubernetes project intends to improve support for L7 (HTTP) Services.

The Kubernetes project intends to have more flexible ingress modes for Services which encompass the current ClusterIP, NodePort, and LoadBalancer modes and more.


{{% /capture %}}

{{% capture whatsnext %}}

* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
* Read about [Ingress](/docs/concepts/services-networking/ingress/)
* Read about [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/)

{{% /capture %}}
