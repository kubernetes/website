---
title: IP virtuelles et proxys de service
content_type: reference
weight: 50
---

<!-- overview -->
Chaque {{< glossary_tooltip term_id="node" text="nœud" >}} d'un
{{< glossary_tooltip term_id="cluster" text="cluster" >}} Kubernetes exécute un
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
(sauf si vous avez déployé votre propre composant à la place de `kube-proxy`).

Le composant `kube-proxy` met en œuvre un mécanisme d'_IP virtuelle_
pour les {{< glossary_tooltip term_id="service" text="Services">}}
dont le `type` n'est pas
[`ExternalName`](/docs/concepts/services-networking/service/#externalname).
Chaque instance de kube-proxy surveille le
{{< glossary_tooltip term_id="control-plane" text="plan de contrôle" >}} Kubernetes
pour détecter l'ajout et la suppression d'{{< glossary_tooltip term_id="object" text="objets" >}}
Service et {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}.
Pour chaque Service, kube-proxy appelle les API adaptées à son mode pour configurer le nœud :
celui-ci capture alors le trafic destiné à la `clusterIP` et au `port` du Service,
et le redirige vers l'un des points de terminaison du Service
(en général un Pod, mais ce peut être n'importe quelle adresse IP fournie par l'utilisateur).
Une boucle de contrôle veille à ce que les règles de chaque nœud restent synchronisées de façon fiable
avec l'état des Services et des EndpointSlices indiqué par le serveur d'API.

{{< figure src="/images/docs/services-iptables-overview.svg" title="Mécanisme d'IP virtuelle pour les Services, en mode iptables" class="diagram-medium" >}}

Une question revient régulièrement : pourquoi Kubernetes passe-t-il par un proxy
pour transférer le trafic entrant vers les backends ? Pourquoi pas une autre
approche ? Par exemple, ne pourrait-on pas configurer des enregistrements DNS
avec plusieurs valeurs A (ou AAAA pour IPv6), et compter sur une résolution de
noms en round-robin ?

Plusieurs raisons expliquent ce recours à un proxy pour les Services :

* Depuis longtemps, certaines implémentations DNS ne respectent pas le TTL des
  enregistrements et gardent en cache les résultats des résolutions de noms
  au-delà de leur expiration.
* Certaines applications ne font la résolution DNS qu'une seule fois, et gardent
  le résultat en cache indéfiniment.
* Même si les applications et les bibliothèques refaisaient correctement la résolution,
  des TTL faibles ou nuls sur les enregistrements DNS pourraient imposer au DNS une
  charge élevée, difficile à gérer.

Vous découvrirez plus loin sur cette page comment fonctionnent les différentes implémentations de kube-proxy.
Retenez surtout que `kube-proxy` peut modifier des règles au niveau du noyau
(par exemple créer des règles iptables), et que ces règles peuvent subsister,
parfois jusqu'au redémarrage de la machine. L'exécution de kube-proxy doit donc être réservée
à un administrateur conscient des conséquences d'un service de proxy réseau
privilégié et de bas niveau sur une machine. L'exécutable `kube-proxy` propose bien
une fonction `cleanup`, mais ce n'est pas une fonctionnalité officielle : elle est
fournie en l'état.

<a id="example"></a>
Certains détails de cette référence s'appuient sur un exemple : les
{{< glossary_tooltip term_id="pod" text="Pods" >}} backend d'une charge de travail
de traitement d'images sans état, qui tourne avec
trois réplicas. Ces réplicas font exactement la même chose :
peu importe à un frontend lequel lui répond. Même si les Pods qui composent
ce backend changent, les clients frontend n'ont pas à le savoir,
ni à tenir à jour eux-mêmes la liste des backends.

<!-- body -->

## Modes de proxy {#proxy-modes}

kube-proxy peut démarrer dans plusieurs modes, définis par sa configuration.

Sur les nœuds Linux, les modes disponibles pour kube-proxy sont :

[`iptables`](#proxy-mode-iptables)
: kube-proxy configure les règles de transfert des paquets avec iptables.

[`ipvs`](#proxy-mode-ipvs)
: kube-proxy configure les règles de transfert des paquets avec ipvs.

[`nftables`](#proxy-mode-nftables)
: kube-proxy configure les règles de transfert des paquets avec nftables.

Si vous ne choisissez pas explicitement de mode au démarrage de kube-proxy (avec l'option
de ligne de commande `--proxy-mode`, ou le champ `mode` d'un fichier de configuration),
il utilise le mode recommandé par défaut.
Dans Kubernetes {{< skew currentVersion >}}, il s'agit d'`iptables`, mais une
future version de Kubernetes passera à `nftables` par défaut. Pour
éviter que le backend de proxy d'un cluster ne change sans prévenir
lors d'une mise à niveau, assurez-vous que la configuration de kube-proxy
de chacun de vos clusters indique explicitement le mode à utiliser.

Sous Windows, un seul mode est disponible pour kube-proxy :

[`kernelspace`](#proxy-mode-kernelspace)
: kube-proxy configure les règles de transfert des paquets dans le noyau Windows.

### Mode de proxy `iptables` {#proxy-mode-iptables}

_Ce mode de proxy n'est disponible que sur les nœuds Linux._

Dans ce mode, kube-proxy configure les règles de transfert des paquets avec
l'API iptables du sous-système netfilter du noyau. Pour chaque point de terminaison,
il installe des règles iptables qui, par défaut, choisissent un Pod backend
au hasard.

#### Exemple {#packet-processing-iptables}

Prenons l'application de traitement d'images décrite [plus haut](#example)
sur cette page.
Lorsque le Service backend est créé, le plan de contrôle de Kubernetes lui attribue une
adresse IP virtuelle, par exemple 10.0.0.1. Pour cet exemple, supposons que le
port du Service est 1234.
Toutes les instances de kube-proxy du cluster détectent la création du nouveau
Service.

Lorsque le kube-proxy d'un nœud détecte un nouveau Service, il installe une série de règles iptables
qui renvoient le trafic destiné à l'adresse IP virtuelle vers d'autres règles iptables, propres à chaque Service.
Ces règles par Service renvoient à leur tour vers des règles propres à chaque point de terminaison backend,
et ces dernières redirigent le trafic vers les backends (par traduction d'adresse de destination, ou DNAT).

Lorsqu'un client se connecte à l'adresse IP virtuelle du Service, la règle iptables entre en jeu.
Un backend est choisi (selon l'affinité de session, ou au hasard), et les paquets sont
redirigés vers ce backend sans que l'adresse IP du client soit réécrite.

Le principe est le même lorsque le trafic arrive par un Service de `type: NodePort`
ou par un équilibreur de charge, à ceci près que l'adresse IP du client est alors modifiée.

#### Optimiser les performances du mode iptables {#optimizing-iptables-mode-performance}

En mode iptables, kube-proxy crée quelques règles iptables pour chaque
Service, et quelques règles iptables pour chaque adresse IP de point de terminaison.
Dans les clusters qui comptent des dizaines de milliers de Pods et de Services, cela représente
des dizaines de milliers de règles iptables, et kube-proxy peut avoir besoin de beaucoup de temps pour actualiser
les règles du noyau lorsque des Services (ou leurs EndpointSlices) changent. Vous pouvez ajuster
la synchronisation de kube-proxy avec les options de la
[section `iptables`](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)
du [fichier de configuration](/docs/reference/config-api/kube-proxy-config.v1alpha1/) de kube-proxy
(que vous indiquez avec `kube-proxy --config <path>`) :

```yaml
...
iptables:
  minSyncPeriod: 1s
  syncPeriod: 30s
...
```

##### `minSyncPeriod` {#minsyncperiod}

Le paramètre `minSyncPeriod` définit le délai minimal entre deux
tentatives de resynchronisation des règles iptables avec le noyau. S'il vaut
`0s`, kube-proxy synchronise les règles immédiatement,
à chaque changement d'un Service ou d'un EndpointSlice. Cela fonctionne bien dans les très
petits clusters, mais génère beaucoup de travail redondant quand de nombreux
éléments changent en peu de temps. Prenons par exemple un
Service qui s'appuie sur un {{< glossary_tooltip term_id="deployment" text="Deployment" >}}
de 100 pods : si vous supprimez ce
Deployment alors que `minSyncPeriod` vaut `0s`, kube-proxy retirerait
un à un les points de terminaison du Service des règles iptables,
soit 100 mises à jour au total. Avec une valeur de `minSyncPeriod` plus grande, plusieurs
événements de suppression de Pod seraient regroupés : kube-proxy pourrait
par exemple ne faire que 5 mises à jour, qui retirent chacune 20 points de terminaison.
C'est bien plus efficace en termes de CPU, et l'ensemble des changements
est synchronisé plus vite.

Plus la valeur de `minSyncPeriod` est grande, plus le travail peut être
regroupé. L'inconvénient est que chaque changement peut devoir
attendre jusqu'à une période `minSyncPeriod` complète avant d'être traité : les
règles iptables restent donc plus longtemps désynchronisées par rapport à
l'état actuel du serveur d'API.

La valeur par défaut de `1s` devrait convenir à la plupart des clusters, mais dans les très
grands clusters, il peut être nécessaire d'augmenter cette valeur.
En particulier, si la métrique `sync_proxy_rules_duration_seconds` de kube-proxy
indique une durée moyenne bien supérieure à 1 seconde, augmenter
`minSyncPeriod` peut rendre les mises à jour plus efficaces.

##### Mettre à jour une ancienne configuration de `minSyncPeriod` {#minimize-iptables-restore}

Les anciennes versions de kube-proxy mettaient à jour toutes les règles de tous les Services à
chaque synchronisation. Cela causait des problèmes de performances (retard des mises à jour) dans les grands
clusters, et la solution recommandée était d'augmenter
`minSyncPeriod`. Depuis Kubernetes v1.28, le mode iptables de
kube-proxy procède de façon plus économe : il ne met à jour que les règles des
Services ou EndpointSlices qui ont réellement changé.

Si vous aviez modifié la valeur par défaut de `minSyncPeriod`, essayez de
supprimer ce réglage pour revenir à la valeur par défaut
(`1s`), ou au moins d'utiliser une valeur plus petite qu'avant la mise à niveau.

Si vous n'utilisez pas le kube-proxy de Kubernetes {{< skew currentVersion >}}, vérifiez
le comportement et les conseils propres à la version que vous utilisez réellement.

##### `syncPeriod` {#syncperiod}

Le paramètre `syncPeriod` contrôle quelques opérations de synchronisation
qui ne sont pas directement liées aux changements de tel ou tel
Service ou EndpointSlice. Il détermine notamment la rapidité avec laquelle
kube-proxy remarque qu'un composant externe a modifié ses
règles iptables. Dans les grands clusters, kube-proxy n'effectue par ailleurs
certaines opérations de nettoyage qu'une fois par `syncPeriod`, pour éviter
du travail inutile.

En général, augmenter `syncPeriod` ne devrait pas avoir beaucoup
d'effet sur les performances. Par le passé, il était parfois utile de lui donner
une très grande valeur (par exemple `1h`). Ce n'est plus recommandé :
cela risque de nuire au bon fonctionnement plus que d'améliorer les performances.

### Mode de proxy IPVS {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.35" state="deprecated" >}}

_Ce mode de proxy n'est disponible que sur les nœuds Linux._

**Le mode de proxy `ipvs` est obsolète**. Sa prise en charge sera désactivée par défaut à partir de Kubernetes v1.40 (vous pourrez la réactiver avec la
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `KubeProxyIPVS`),
et le mode `ipvs` sera complètement supprimé dans Kubernetes v1.43.

En mode `ipvs`, kube-proxy utilise les API IPVS et iptables du noyau pour
créer des règles qui redirigent le trafic des adresses IP des Services vers les adresses IP des points de terminaison.

Comme le mode iptables, le mode de proxy IPVS repose sur des fonctions de hook
netfilter, mais il utilise une table de hachage comme structure de données
sous-jacente et fonctionne dans l'espace noyau.

{{< note >}}
Le mode de proxy `ipvs` était une expérimentation visant à fournir un backend
kube-proxy Linux qui synchronise ses règles plus rapidement et offre un
meilleur débit réseau que le mode `iptables`. Il a atteint ces objectifs,
mais l'API IPVS du noyau s'est révélée mal adaptée à l'API Service de
Kubernetes, et le backend `ipvs` n'a jamais réussi à gérer correctement
tous les cas particuliers des fonctionnalités des Services Kubernetes.

Le mode de proxy `nftables` (décrit plus bas) remplace en pratique
les modes `iptables` et `ipvs`, avec de meilleures performances que l'un comme
l'autre, et c'est le remplaçant recommandé
d'`ipvs`. Si vous déployez sur des systèmes Linux trop anciens
pour le mode de proxy `nftables`, envisagez aussi le mode
`iptables` plutôt qu'`ipvs` : les performances du mode
`iptables` se sont beaucoup améliorées depuis l'arrivée du mode `ipvs`.
{{< /note >}}

IPVS offre plus d'options pour répartir le trafic entre les Pods backend :

* `rr` (Round Robin) : le trafic est réparti de façon égale entre les serveurs backend.

* `wrr` (Weighted Round Robin) : le trafic est acheminé vers les serveurs backend en fonction
  de leur poids. Les serveurs qui ont un poids élevé reçoivent les nouvelles connexions en priorité
  et plus de requêtes que les serveurs de poids plus faible.

* `lc` (Least Connection) : davantage de trafic est attribué aux serveurs qui ont le moins de connexions actives.

* `wlc` (Weighted Least Connection) : davantage de trafic est acheminé vers les serveurs qui ont le moins de connexions
  par rapport à leur poids, c'est-à-dire le nombre de connexions divisé par le poids.

* `lblc` (Locality based Least Connection) : le trafic destiné à une même adresse IP est envoyé au
  même serveur backend si celui-ci est disponible et n'est pas surchargé. Sinon, le trafic
  est envoyé aux serveurs qui ont moins de connexions, et cette attribution est conservée pour la suite.

* `lblcr` (Locality Based Least Connection with Replication) : le trafic destiné à une même
  adresse IP est envoyé au serveur qui a le moins de connexions. Si tous les serveurs backend sont
  surchargés, l'algorithme en choisit un qui a moins de connexions et l'ajoute à l'ensemble cible.
  Si l'ensemble cible n'a pas changé pendant la durée indiquée, le serveur le plus chargé
  en est retiré, pour éviter un niveau de réplication trop élevé.

* `sh` (Source Hashing) : le trafic est envoyé à un serveur backend en consultant une table
  de hachage attribuée statiquement et fondée sur les adresses IP source.

* `dh` (Destination Hashing) : le trafic est envoyé à un serveur backend en consultant une
  table de hachage attribuée statiquement et fondée sur les adresses de destination.

* `sed` (Shortest Expected Delay) : le trafic est transféré au serveur backend dont le délai
  attendu est le plus court. Le délai attendu vaut `(C + 1) / U` si le trafic est envoyé à ce serveur, où `C` est
  le nombre de connexions sur le serveur et `U` le débit de service fixe (le poids) du
  serveur.

* `nq` (Never Queue) : le trafic est envoyé à un serveur inactif s'il y en a un, au lieu
  d'attendre un serveur rapide. Si tous les serveurs sont occupés, l'algorithme se comporte
  comme `sed`.

* `mh` (Maglev Hashing) : attribue les tâches entrantes selon
  l'[algorithme de hachage Maglev de Google](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf).
  Cet ordonnanceur a deux options : `mh-fallback`, qui permet de basculer vers un autre
  serveur si le serveur choisi n'est pas disponible, et `mh-port`, qui ajoute le numéro de port source
  au calcul du hachage. Avec `mh`, kube-proxy active toujours l'option `mh-port` et n'active
  jamais l'option `mh-fallback`.
  Avec `proxy-mode=ipvs`, `mh` fonctionne comme le hachage par source (`sh`), mais en tenant compte des ports.

Ces algorithmes d'ordonnancement se configurent avec le champ
[`ipvs.scheduler`](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
de la configuration de kube-proxy.

{{< figure src="/images/docs/services-ipvs-overview.svg" title="Mécanisme d'adresse IP virtuelle pour les Services, en mode IPVS" class="diagram-medium" >}}

### Mode de proxy `nftables` {#proxy-mode-nftables}

_Ce mode de proxy n'est disponible que sur les nœuds Linux, et nécessite un noyau
5.13 ou plus récent._

Dans ce mode, kube-proxy configure les règles de transfert des paquets avec
l'API nftables du sous-système netfilter du noyau. Pour chaque point de terminaison,
il installe des règles nftables qui, par défaut, choisissent un Pod backend
au hasard.

L'API nftables succède à l'API iptables : elle est conçue pour être plus performante
et mieux supporter la montée en charge qu'iptables.
Le mode de proxy `nftables` traite les changements de points de terminaison des services
plus vite et plus efficacement que le mode `iptables`, et il traite aussi
plus efficacement les paquets dans le noyau (même si la différence ne se voit que
dans les clusters qui comptent des dizaines de milliers de services).

#### Migrer du mode `iptables` vers `nftables` {#migrating-from-iptables-mode-to-nftables}

Si vous voulez passer du mode `iptables` (par défaut) au mode
`nftables`, sachez que certaines fonctionnalités s'y comportent un peu
différemment :

- **Interfaces des NodePort** : en mode `iptables`, par défaut, les
  [Services NodePort](/docs/concepts/services-networking/service/#type-nodeport)
  sont joignables sur toutes les adresses IP locales. Ce n'est généralement pas ce
  que veulent les utilisateurs : le mode `nftables` utilise donc par défaut
  `--nodeport-addresses primary`, si bien que les Services de `type: NodePort` ne sont
  joignables que sur les adresses IPv4 et/ou IPv6 principales du nœud. Vous pouvez
  changer ce comportement en donnant une valeur explicite à cette option,
  par exemple `--nodeport-addresses 0.0.0.0/0` pour écouter sur toutes les adresses
  IPv4 (locales).

- **NodePort et pare-feu** : le mode `iptables` de
  kube-proxy essaie d'être compatible avec les pare-feu trop restrictifs.
  Pour chaque Service de `type: NodePort`, il ajoute des règles qui acceptent le trafic
  entrant sur ce port, au cas où un pare-feu bloquerait ce trafic.
  Cette approche ne fonctionne pas avec les pare-feu
  basés sur nftables : en mode `nftables`, kube-proxy ne fait donc rien
  de tel. Si vous avez un pare-feu local, vous devez vous assurer
  qu'il est correctement configuré pour laisser passer le trafic de Kubernetes
  (par exemple en autorisant le trafic entrant sur toute la plage des NodePort).

- **Contournements du bug de conntrack** : les noyaux Linux antérieurs à la version 6.1 ont un
  bug qui peut provoquer la fermeture de connexions TCP de longue durée vers les adresses IP
  des services, avec l'erreur « Connection reset by peer ». Le
  mode `iptables` de kube-proxy installe un contournement pour ce bug,
  mais il s'est avéré par la suite que ce contournement causait d'autres problèmes dans certains
  clusters. Le mode `nftables` n'installe aucun contournement par
  défaut. Vous pouvez toutefois consulter la métrique
  `iptables_ct_state_invalid_dropped_packets_total` de kube-proxy pour savoir si
  votre cluster dépend de ce contournement. Si c'est le cas, lancez
  kube-proxy avec l'option `--conntrack-tcp-be-liberal` pour contourner
  le problème en mode `nftables`.

{{< feature-state feature_gate_name="KubeProxyNFTablesLocalhostNodePorts" >}}

- **Services de `type: NodePort` sur `127.0.0.1`** : en mode `iptables`, si la
  plage `--nodeport-addresses` inclut `127.0.0.1` (et que l'option
  `--iptables-localhost-nodeports false` n'est pas passée), les
  Services de `type: NodePort` sont joignables même sur « localhost » (`127.0.0.1`).
  À l'origine, cela ne fonctionnait pas en mode `nftables`. Dans
  Kubernetes {{< skew currentVersion >}}, vous pouvez toutefois activer les NodePorts sur localhost
  en mode `nftables`, en activant la feature gate
  `KubeProxyNFTablesLocalhostNodePorts` et en donnant à
  `--nodeport-addresses` la valeur `primary,localhost` au lieu de la
  valeur par défaut `primary`.

  Pour savoir si vous dépendez de cette fonctionnalité, consultez
  la métrique
  `iptables_localhost_nodeports_accepted_packets_total` de kube-proxy : si elle
  n'est pas nulle, un client s'est connecté à un Service de `type:
  NodePort` via localhost (loopback).

### Mode de proxy `kernelspace` {#proxy-mode-kernelspace}

_Ce mode de proxy n'est disponible que sur les nœuds Windows._

kube-proxy configure des règles de filtrage des paquets dans la _Virtual Filtering Platform_ (VFP) de Windows,
une extension du vSwitch de Windows. Ces règles traitent les paquets encapsulés dans les réseaux
virtuels du nœud, et les réécrivent pour que l'adresse IP de destination (et les informations de couche 2)
permette d'acheminer chaque paquet vers la bonne destination.
La VFP joue sous Windows le même rôle que des outils comme `nftables` ou `iptables` sous Linux. Elle étend
le _Hyper-V Switch_, conçu à l'origine pour le réseau des machines virtuelles.

Lorsqu'un Pod d'un nœud envoie du trafic vers une adresse IP virtuelle, et que kube-proxy choisit comme cible
d'équilibrage de charge un Pod situé sur un autre nœud, le mode de proxy `kernelspace` réécrit ce paquet
pour l'adresser au Pod backend cible. Le _Host Networking Service_ (HNS) de Windows configure
les règles de réécriture des paquets de sorte que le trafic de retour semble venir de l'adresse IP
virtuelle, et non du Pod backend lui-même.

#### Direct server return en mode `kernelspace` {#windows-direct-server-return}

{{< feature-state feature_gate_name="WinDSR" >}}

Il existe une variante du fonctionnement de base : c'est le nœud qui héberge le Pod backend d'un Service
qui applique lui-même la réécriture des paquets, et non le nœud sur lequel s'exécute
le Pod client. C'est ce qu'on appelle le _direct server return_ (retour direct du serveur).

Pour l'utiliser, vous devez lancer kube-proxy avec l'argument de ligne de commande `--enable-dsr` **et**
activer la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `WinDSR`.

Le direct server return optimise aussi le trafic de retour des Pods, même lorsque les deux Pods
s'exécutent sur le même nœud.

## Affinité de session {#session-affinity}

Dans ces modèles de proxy, le trafic destiné au couple IP:port du Service est
relayé vers un backend approprié, sans que les clients aient besoin de connaître
Kubernetes, les Services ou les Pods.

Si vous voulez vous assurer que les connexions d'un client donné arrivent
toujours au même Pod, vous pouvez choisir une affinité de session basée
sur l'adresse IP du client, en donnant à `.spec.sessionAffinity` la valeur `ClientIP`
dans le Service (la valeur par défaut est `None`).

### Délai d'expiration de l'affinité de session {#session-stickiness-timeout}

Vous pouvez aussi définir la durée maximale de l'affinité de session en renseignant
`.spec.sessionAffinityConfig.clientIP.timeoutSeconds` dans le Service
(la valeur par défaut est 10800, soit 3 heures).

{{< note >}}
Sous Windows, il n'est pas possible de définir la durée maximale de l'affinité de session des Services.
{{< /note >}}

## Attribution des adresses IP aux Services {#ip-address-assignment-to-services}

Contrairement aux adresses IP des Pods, qui mènent réellement à une destination fixe,
aucun hôte en particulier ne répond aux adresses IP des Services. kube-proxy
utilise à la place une logique de traitement des paquets (comme iptables sous Linux) pour définir des
adresses IP _virtuelles_, redirigées de façon transparente selon les besoins.

Lorsque des clients se connectent à l'adresse IP virtuelle (VIP), leur trafic est automatiquement acheminé vers
un point de terminaison approprié. Les variables d'environnement et le DNS des Services s'appuient en fait
sur l'adresse IP virtuelle (et le port) du Service.

### Éviter les collisions {#avoiding-collisions}

L'un des grands principes de Kubernetes est que vous ne devriez jamais
être exposé à des situations où vos actions échouent sans que vous
y soyez pour rien. Pour la conception de la ressource Service, cela signifie ne pas
vous obliger à choisir vous-même une adresse IP si ce choix risque d'entrer en collision avec
celui de quelqu'un d'autre. Ce serait un défaut d'isolation.

Pour vous permettre de choisir une adresse IP pour vos Services, nous devons
garantir que deux Services ne peuvent pas entrer en collision. Kubernetes y parvient en attribuant à chaque
Service sa propre adresse IP, prise dans la plage CIDR `service-cluster-ip-range`
configurée pour le {{< glossary_tooltip term_id="kube-apiserver" text="serveur d'API" >}}.

### Suivi de l'attribution des adresses IP {#ip-address-allocation-tracking}

Pour garantir que chaque Service reçoit une adresse IP unique, un allocateur interne met à jour
de façon atomique une table d'attribution globale dans {{< glossary_tooltip term_id="etcd" >}},
avant la création de chaque Service. Cette table doit exister dans le registre pour que
les Services reçoivent une adresse IP. Sinon, leur création échoue
avec un message indiquant qu'aucune adresse IP n'a pu être attribuée.

Dans le plan de contrôle, un contrôleur en arrière-plan est chargé de créer cette
table (nécessaire pour prendre en charge la migration depuis d'anciennes versions de Kubernetes, qui utilisaient
un verrouillage en mémoire). Kubernetes utilise aussi des contrôleurs pour repérer les attributions
invalides (par exemple à la suite d'une intervention d'un administrateur) et pour libérer les adresses IP
attribuées qui ne sont plus utilisées par aucun Service.

#### Suivi de l'attribution des adresses IP avec l'API Kubernetes {#ip-address-objects}

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

Le plan de contrôle remplace l'allocateur etcd existant par une nouvelle implémentation
qui utilise des objets IPAddress et ServiceCIDR au lieu d'une table d'attribution globale interne.
Chaque adresse IP de cluster associée à un Service fait alors référence à un objet IPAddress.

L'activation de la feature gate remplace aussi un contrôleur en arrière-plan par un autre,
qui gère les objets IPAddress et prend en charge la migration depuis l'ancien modèle d'allocateur.
Kubernetes {{< skew currentVersion >}} ne permet pas de migrer des objets IPAddress
vers la table d'attribution interne.

L'un des principaux avantages du nouvel allocateur est qu'il supprime les limites de taille
de la plage d'adresses IP utilisable pour les adresses IP de cluster des Services.
Avec `MultiCIDRServiceAllocator` activé, il n'y a aucune limite pour IPv4, et pour IPv6
vous pouvez utiliser des plages de taille /64 au plus (au lieu de /108 avec
l'ancienne implémentation).

Comme les attributions d'adresses IP sont disponibles via l'API, vous pouvez, en tant qu'administrateur du cluster,
permettre aux utilisateurs de consulter les adresses IP attribuées à leurs Services.
Des extensions de Kubernetes, comme [Gateway API](/docs/concepts/services-networking/gateway/),
peuvent utiliser l'API IPAddress pour étendre les capacités réseau natives de Kubernetes.

Voici un court exemple où un utilisateur consulte les adresses IP :

```shell
kubectl get services
```

```
NAME         TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   2001:db8:1:2::1   <none>        443/TCP   3d1h
```

```shell
kubectl get ipaddresses
```

```
NAME              PARENTREF
2001:db8:1:2::1   services/default/kubernetes
2001:db8:1:2::a   services/kube-system/kube-dns
```

Kubernetes permet aussi aux utilisateurs de définir dynamiquement les plages d'adresses IP disponibles pour les Services,
avec des objets ServiceCIDR. Au démarrage du cluster, un objet ServiceCIDR par défaut nommé `kubernetes` est créé
à partir de la valeur de l'argument de ligne de commande `--service-cluster-ip-range` de kube-apiserver :

```shell
kubectl get servicecidrs
```

```
NAME         CIDRS         AGE
kubernetes   10.96.0.0/28  17m
```

Les utilisateurs peuvent créer ou supprimer des objets ServiceCIDR pour gérer les plages d'adresses IP disponibles pour les Services :

```shell
cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newservicecidr
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

```shell
kubectl get servicecidrs
```

```
NAME             CIDRS         AGE
kubernetes       10.96.0.0/28  17m
newservicecidr   10.96.0.0/24  7m
```

Les distributions ou les administrateurs de clusters Kubernetes peuvent vouloir vérifier que
les nouveaux ServiceCIDR ajoutés au cluster ne chevauchent pas d'autres réseaux du
cluster et n'appartiennent qu'à une plage d'adresses IP précise, ou simplement conserver
le comportement actuel, avec un seul ServiceCIDR par cluster. Voici un exemple
de ValidatingAdmissionPolicy qui permet de le faire :

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs-default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1","v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(i , variables.allowed.exists(j , cidr(j).containsCIDR(i)))"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs-default"
  validationActions: [Deny,Audit]
---
```


### Plages d'adresses IP pour les adresses IP virtuelles des Services {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes divise la plage `ClusterIP` en deux bandes, en fonction de
la taille de la plage `service-cluster-ip-range` configurée, selon la formule
`min(max(16, cidrSize / 16), 256)`. Cette formule signifie que le résultat n'est _jamais inférieur à 16 ni
supérieur à 256, avec une progression par paliers entre les deux_.

Kubernetes attribue de préférence les adresses IP dynamiques des Services dans la bande haute.
Si vous voulez attribuer une adresse IP précise à un Service de `type: ClusterIP`,
choisissez-la donc manuellement dans la bande **basse**. Cela
réduit le risque de conflit lors de l'attribution.

## Politiques de trafic {#traffic-policies}

Vous pouvez définir les champs `.spec.internalTrafficPolicy` et `.spec.externalTrafficPolicy`
pour contrôler la façon dont Kubernetes achemine le trafic vers les backends en bonne santé (« ready »).

### Politique de trafic interne {#internal-traffic-policy}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Vous pouvez définir le champ `.spec.internalTrafficPolicy` pour contrôler l'acheminement du trafic
venant de sources internes. Les valeurs valides sont `Cluster` et `Local`. Avec
`Cluster`, le trafic interne est acheminé vers tous les points de terminaison prêts. Avec `Local`, il n'est acheminé
que vers les points de terminaison prêts du nœud local. Si la politique de trafic est `Local` et qu'il n'y a aucun
point de terminaison sur le nœud local, kube-proxy abandonne le trafic.

### Politique de trafic externe {#external-traffic-policy}

Vous pouvez définir le champ `.spec.externalTrafficPolicy` pour contrôler l'acheminement du trafic
venant de sources externes. Les valeurs valides sont `Cluster` et `Local`. Avec
`Cluster`, le trafic externe est acheminé vers tous les points de terminaison prêts. Avec `Local`, il n'est
acheminé que vers les points de terminaison prêts du nœud local. Si la politique de trafic est `Local` et qu'il n'y a
aucun point de terminaison sur le nœud local, kube-proxy ne transfère aucun trafic pour le
Service concerné.

Avec `Cluster`, tous les nœuds sont des cibles éligibles pour l'équilibrage de charge, _tant que_
le nœud n'est pas en cours de suppression et que kube-proxy est en bonne santé. Dans ce mode, les vérifications
de santé de l'équilibreur de charge ciblent le port et le chemin de disponibilité (readiness) du proxy de service.
Pour kube-proxy, il s'agit de `${NODE_IP}:10256/healthz`, qui renvoie
un code HTTP 200 ou 503. Ce point de vérification de santé
pour les équilibreurs de charge renvoie 200 si :

1. kube-proxy est en bonne santé, c'est-à-dire :

   qu'il parvient à faire progresser la programmation du réseau sans dépasser le délai
   prévu (ce délai vaut **2 × `iptables.syncPeriod`**) ; et

1. le nœud n'est pas en cours de suppression (aucun horodatage de suppression n'est défini sur l'objet Node).

Lorsque le nœud est en cours de suppression, kube-proxy renvoie 503 et le marque comme non
éligible, car il prend en charge le drainage
des connexions des nœuds qui s'arrêtent. Du point de vue d'un équilibreur de charge
géré par Kubernetes, plusieurs choses importantes se passent _pendant_ la suppression d'un nœud, puis _après_.

Pendant la suppression :

* La sonde de disponibilité (readiness probe) de kube-proxy commence à échouer, ce qui revient à marquer le
  nœud comme non éligible au trafic de l'équilibreur de charge. L'échec de la vérification de santé
  de l'équilibreur de charge amène les équilibreurs qui prennent en charge le drainage des connexions à
  laisser se terminer les connexions existantes, et à empêcher l'établissement de nouvelles
  connexions.

Une fois le nœud supprimé :

* Le contrôleur de services du cloud controller manager de Kubernetes retire le
  nœud de l'ensemble des cibles éligibles. Retirer une instance de
  l'ensemble des cibles backend de l'équilibreur de charge met immédiatement fin à toutes
  les connexions vers cette instance. C'est aussi pour cette raison que kube-proxy fait d'abord échouer la vérification
  de santé pendant la suppression du nœud.

Point important pour les fournisseurs de Kubernetes : si vous configurez la
sonde de disponibilité de kube-proxy comme sonde de vivacité (liveness probe), kube-proxy
redémarrera en boucle pendant toute la durée de la suppression d'un nœud.
kube-proxy expose un chemin `/livez` qui, contrairement à `/healthz`, ne tient
**pas** compte de l'état de suppression du nœud, mais seulement de l'avancement de la programmation
du réseau. `/livez` est donc le chemin recommandé pour définir
une livenessProbe pour kube-proxy.

Si vous déployez kube-proxy, vous pouvez consulter l'état de disponibilité et de vivacité grâce
aux métriques `proxy_livez_total` et `proxy_healthz_total`. Chacune de ces
métriques publie deux séries, l'une avec le label 200 et l'autre avec le label 503.

Pour les Services `Local`, kube-proxy renvoie 200 si :

1. kube-proxy est en bonne santé et prêt, et
1. il a un point de terminaison local sur le nœud concerné.

La suppression d'un nœud n'a **pas** d'effet sur le code renvoyé par kube-proxy
pour les vérifications de santé des équilibreurs de charge. La raison est la suivante :
supprimer des nœuds pourrait provoquer une coupure du trafic entrant si tous les points de terminaison
s'exécutaient en même temps sur ces nœuds.

Le projet Kubernetes recommande que le code d'intégration des fournisseurs de cloud
configure des vérifications de santé d'équilibreur de charge qui ciblent le port healthz
du proxy de service. Si vous utilisez ou développez votre propre implémentation d'IP virtuelle
pour remplacer kube-proxy, mettez en place un port de vérification de santé
similaire, avec une logique équivalente à celle de kube-proxy.

### Trafic vers les points de terminaison en cours d'arrêt {#traffic-to-terminating-endpoints}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Si la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ProxyTerminatingEndpoints` est activée dans kube-proxy et que la politique de trafic est `Local`,
le kube-proxy de ce nœud utilise un algorithme plus élaboré pour choisir les points de terminaison d'un Service.
Avec cette fonctionnalité activée, kube-proxy vérifie si le nœud
a des points de terminaison locaux, et si tous ces points de terminaison locaux sont marqués comme en cours d'arrêt.
S'il y a des points de terminaison locaux et qu'ils sont **tous** en cours d'arrêt, kube-proxy
transfère le trafic vers ces points de terminaison en cours d'arrêt. Sinon, kube-proxy
transfère toujours en priorité le trafic vers des points de terminaison qui ne sont pas en cours d'arrêt.

Ce comportement permet aux Services `NodePort` et `LoadBalancer`
de drainer proprement les connexions lorsqu'ils utilisent `externalTrafficPolicy: Local`.

Pendant la mise à jour progressive (rolling update) d'un Deployment, le nombre de réplicas de ce Deployment
sur un nœud derrière un équilibreur de charge peut passer de N à 0. Dans certains cas, un équilibreur de charge externe peut envoyer du trafic à
un nœud qui n'a plus de réplica, entre deux vérifications de santé. Acheminer le trafic vers les points de terminaison
en cours d'arrêt garantit que les nœuds dont le nombre de Pods diminue peuvent recevoir proprement
le trafic et le drainer vers ces Pods en cours d'arrêt. Le temps que le Pod termine son arrêt, l'équilibreur de charge externe
devrait avoir constaté l'échec de la vérification de santé du nœud, et l'avoir complètement retiré du pool de
backends.

## Contrôle de la distribution du trafic {#traffic-distribution}

Le champ `spec.trafficDistribution` d'un Service Kubernetes vous permet
d'exprimer des préférences sur la façon dont le trafic doit être acheminé vers les points de terminaison du Service.

`PreferSameZone`
: Envoie en priorité le trafic vers les points de terminaison situés dans la même zone que le client.
  Le contrôleur EndpointSlice ajoute des `hints` (indications) aux EndpointSlices pour
  transmettre cette préférence, que kube-proxy utilise ensuite pour ses décisions de routage.
  Si la zone d'un client n'a aucun point de terminaison disponible, le trafic de ce client
  est acheminé à l'échelle du cluster.

`PreferSameNode`
: Envoie en priorité le trafic vers les points de terminaison situés sur le même nœud que le client.
  Comme pour `PreferSameZone`, le contrôleur EndpointSlice ajoute aux
  EndpointSlices des `hints` qui indiquent qu'une tranche doit être utilisée pour un
  nœud donné. Si le nœud d'un client n'a aucun point de terminaison disponible,
  le proxy de service se replie sur le comportement « même zone », ou sur l'ensemble du cluster
  s'il n'y a pas non plus de point de terminaison dans la même zone.

`PreferClose` (obsolète)
: Ancien alias de `PreferSameZone`, au sens moins
  explicite.

Si `trafficDistribution` n'a pas de valeur, la stratégie par défaut consiste
à répartir le trafic de façon égale entre tous les points de terminaison du cluster.

### Comparaison avec `service.kubernetes.io/topology-mode: Auto` {#comparison-with-service-kubernetes-io-topology-mode-auto}

Le champ `trafficDistribution` avec la valeur `PreferSameZone` et l'ancienne fonctionnalité de « routage
tenant compte de la topologie » (l'annotation `service.kubernetes.io/topology-mode: Auto`)
visent tous les deux à privilégier le trafic au sein d'une même zone, mais leurs approches diffèrent
sur un point essentiel :

* `service.kubernetes.io/topology-mode: Auto` essaie de répartir le trafic
  entre les zones proportionnellement aux ressources CPU allouables. Cette heuristique
  comprend des garde-fous (comme le [comportement de
  repli](/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)
  lorsqu'il y a peu de points de terminaison), et sacrifie un peu de prévisibilité au profit
  d'un équilibrage de charge potentiellement meilleur.

* `trafficDistribution: PreferSameZone` se veut plus simple et plus prévisible :
  « s'il y a des points de terminaison dans la zone, ils reçoivent tout le trafic de cette
  zone ; s'il n'y en a pas, le trafic est réparti vers les
  autres zones ». Cette approche est plus prévisible, mais c'est à vous
  d'[éviter de surcharger les points de
  terminaison](#considerations-for-using-traffic-distribution-control).

Si l'annotation `service.kubernetes.io/topology-mode` vaut `Auto`, elle
prime sur `trafficDistribution`. L'annotation pourrait devenir obsolète
à l'avenir au profit du champ `trafficDistribution`.

### Interaction avec les politiques de trafic {#interaction-with-traffic-policies}

Par rapport au champ `trafficDistribution`, les champs de politique de trafic
(`externalTrafficPolicy` et `internalTrafficPolicy`) visent à imposer des
exigences de localité du trafic plus strictes. Voici comment `trafficDistribution`
interagit avec eux :

* Priorité des politiques de trafic : pour un Service donné, si une politique de trafic
  (`externalTrafficPolicy` ou `internalTrafficPolicy`) vaut `Local`, elle
  prime sur `trafficDistribution` pour le type de trafic
  correspondant (externe ou interne, respectivement).

* Influence de `trafficDistribution` : pour un Service donné, si une politique de trafic
  (`externalTrafficPolicy` ou `internalTrafficPolicy`) vaut `Cluster` (la
  valeur par défaut), ou si ces champs ne sont pas définis, c'est `trafficDistribution`
  qui oriente le routage pour le type de trafic correspondant
  (externe ou interne, respectivement). Kubernetes essaie alors
  d'acheminer le trafic vers un point de terminaison situé dans la même zone que le client.

### Points d'attention pour le contrôle de la distribution du trafic {#considerations-for-using-traffic-distribution-control}

Un Service qui utilise `trafficDistribution` essaie d'acheminer le trafic vers des points de terminaison
(en bonne santé) de la topologie appropriée, même si certains points de terminaison
reçoivent alors beaucoup plus de trafic que d'autres. Si vous n'avez pas
assez de points de terminaison dans la même topologie (« même zone », « même
nœud », etc.) que les clients, ces points de terminaison risquent d'être surchargés. C'est
particulièrement probable si le trafic entrant n'est pas réparti proportionnellement dans
la topologie. Pour limiter ce risque, envisagez les stratégies suivantes :

* [Contraintes de répartition topologique des Pods](/docs/concepts/scheduling-eviction/topology-spread-constraints/) :
  utilisez-les pour répartir vos pods de façon égale
  entre les zones ou les nœuds.

* Deployments par zone : si vous utilisez la distribution du trafic « même zone »,
  mais que vous vous attendez à des profils de trafic différents selon
  les zones, vous pouvez créer un Deployment distinct pour chaque zone.
  Chaque charge de travail peut alors être mise à l'échelle indépendamment.
  Des modules complémentaires de gestion des charges de travail, proposés par l'écosystème
  en dehors du projet Kubernetes, peuvent aussi vous aider.

## {{% heading "whatsnext" %}}

Pour en savoir plus sur les Services,
lisez [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/).

Vous pouvez aussi :

* Découvrir le concept de [Service](/docs/concepts/services-networking/service/)
* Découvrir le concept d'[Ingress](/docs/concepts/services-networking/ingress/)
* Lire la [référence de l'API](/docs/reference/kubernetes-api/service-resources/service-v1/) Service
