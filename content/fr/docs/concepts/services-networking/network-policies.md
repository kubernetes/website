---
title: Politiques réseau
content_type: concept
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "NetworkPolicy"
weight: 70
description: >-
  Si vous voulez contrôler les flux de trafic au niveau des adresses IP ou des ports (couches 3 ou 4 du modèle OSI),
  les NetworkPolicies vous permettent de définir des règles pour les flux de trafic au sein de votre cluster,
  ainsi qu'entre les Pods et le monde extérieur.
  Votre cluster doit utiliser un plugin réseau qui sait faire respecter les NetworkPolicies.
---

<!-- overview -->

Si vous voulez contrôler les flux de trafic au niveau des adresses IP ou des ports pour les protocoles TCP, UDP et SCTP,
vous pouvez envisager d'utiliser les NetworkPolicies de Kubernetes pour certaines applications de votre cluster.
Les NetworkPolicies sont un mécanisme centré sur l'application, qui vous permet de définir comment un
{{< glossary_tooltip text="pod" term_id="pod">}} est autorisé à communiquer sur le réseau avec différentes
« entités » (nous employons ici le mot « entité » pour ne pas donner un sens de plus à des termes courants comme
« endpoints » et « services », qui ont un sens précis dans Kubernetes).
Les NetworkPolicies s'appliquent à une connexion dont l'une des extrémités au moins est un pod, et ne concernent pas
les autres connexions.

Les entités avec lesquelles un Pod peut communiquer sont identifiées par une combinaison des
trois identifiants suivants :

1. Les autres pods autorisés (exception : un pod ne peut pas bloquer l'accès à lui-même)
1. Les namespaces autorisés
1. Les blocs d'adresses IP (exception : le trafic depuis et vers le nœud sur lequel un Pod s'exécute est toujours autorisé,
   quelle que soit l'adresse IP du Pod ou du nœud)

Pour définir une NetworkPolicy basée sur les pods ou les namespaces, vous utilisez un
{{< glossary_tooltip text="sélecteur" term_id="selector">}} pour indiquer quel trafic est autorisé
depuis et vers le ou les Pods qui correspondent à ce sélecteur.

Pour les NetworkPolicies basées sur les adresses IP, en revanche, on définit des politiques à partir de blocs d'adresses IP (plages CIDR).

<!-- body -->
## Prérequis {#prerequisites}

Les politiques réseau sont mises en œuvre par le [plugin réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
Pour utiliser les politiques réseau, il vous faut une solution réseau qui prend en charge les NetworkPolicies.
Créer une ressource NetworkPolicy sans contrôleur pour la mettre en œuvre n'aura aucun effet.

## Les deux types d'isolation d'un pod {#the-two-sorts-of-pod-isolation}

Un pod peut être isolé de deux façons : en sortie (egress) et en entrée (ingress).
Ces isolations portent sur les connexions qui peuvent être établies. Ici, « isolé » n'a rien d'absolu :
cela signifie que « certaines restrictions s'appliquent ». À l'inverse, « non isolé dans une direction » signifie
qu'aucune restriction ne s'applique dans cette direction. Les deux types d'isolation (ou leur absence) sont déclarés
indépendamment l'un de l'autre, et entrent tous deux en jeu pour une connexion d'un pod vers un autre.

Par défaut, un pod n'est pas isolé en sortie : toutes les connexions sortantes sont autorisées.
Un pod est isolé en sortie s'il existe au moins une NetworkPolicy qui sélectionne ce pod et dont
les `policyTypes` contiennent « Egress » ; on dit alors que cette politique s'applique au pod en sortie.
Quand un pod est isolé en sortie, les seules connexions autorisées depuis ce pod sont celles qu'autorise
la liste `egress` d'au moins une NetworkPolicy qui s'applique au pod en sortie. Le trafic de réponse
de ces connexions autorisées est lui aussi autorisé implicitement.
Les effets de ces listes `egress` s'additionnent.

Par défaut, un pod n'est pas isolé en entrée : toutes les connexions entrantes sont autorisées.
Un pod est isolé en entrée s'il existe au moins une NetworkPolicy qui sélectionne ce pod et dont
les `policyTypes` contiennent « Ingress » ; on dit alors que cette politique s'applique au pod en entrée.
Quand un pod est isolé en entrée, les seules connexions autorisées vers ce pod sont celles qui viennent
du nœud du pod et celles qu'autorise la liste `ingress` d'au moins une NetworkPolicy qui s'applique
au pod en entrée. Le trafic de réponse de ces connexions autorisées est lui aussi autorisé implicitement.
Les effets de ces listes `ingress` s'additionnent.

Les politiques réseau n'entrent pas en conflit : elles s'additionnent. Si une ou plusieurs politiques s'appliquent
à un pod donné dans une direction donnée, les connexions autorisées dans cette direction pour ce pod sont l'union
de ce qu'autorisent ces politiques. L'ordre d'évaluation n'a donc aucune influence sur le résultat.

Pour qu'une connexion d'un pod source vers un pod de destination soit autorisée, il faut que la politique
en sortie du pod source et la politique en entrée du pod de destination l'autorisent toutes les deux.
Si l'un des deux côtés ne l'autorise pas, la connexion n'a pas lieu.

## La ressource NetworkPolicy {#networkpolicy-resource}

Consultez la référence [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
pour la définition complète de la ressource.

Voici un exemple de NetworkPolicy :

{{% code_sample file="service/networking/networkpolicy.yaml" %}}

{{< note >}}
Envoyer cette ressource (POST) au serveur d'API de votre cluster n'aura aucun effet si la solution réseau
que vous avez choisie ne prend pas en charge les politiques réseau.
{{< /note >}}

__Champs obligatoires__ : comme toute autre configuration Kubernetes, une NetworkPolicy a besoin des champs `apiVersion`,
`kind` et `metadata`. Pour des informations générales sur l'utilisation des fichiers de configuration, consultez
[Configurer un Pod pour utiliser une ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
et [Gestion des objets](/docs/concepts/overview/working-with-objects/object-management).

**spec** : la [spec](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
d'une NetworkPolicy contient toutes les informations nécessaires pour définir une politique réseau donnée dans le namespace concerné.

**podSelector** : chaque NetworkPolicy contient un `podSelector` qui sélectionne le groupe de pods
auquel la politique s'applique. La politique de l'exemple sélectionne les pods qui ont le label « role=db ». Un
`podSelector` vide sélectionne tous les pods du namespace.

**policyTypes** : chaque NetworkPolicy contient une liste `policyTypes` qui peut contenir `Ingress`,
`Egress` ou les deux. Le champ `policyTypes` indique si la politique s'applique au trafic
entrant vers les pods sélectionnés, au trafic sortant des pods sélectionnés, ou aux deux. Si aucun
`policyTypes` n'est indiqué dans une NetworkPolicy, `Ingress` est toujours défini par défaut, et
`Egress` l'est aussi si la NetworkPolicy contient des règles egress.

**ingress** : chaque NetworkPolicy peut contenir une liste de règles `ingress` autorisées. Chaque règle autorise
le trafic qui correspond à la fois aux sections `from` et `ports`. La politique de l'exemple contient une seule
règle, qui correspond au trafic sur un seul port, depuis l'une de trois sources : la première définie par
un `ipBlock`, la deuxième par un `namespaceSelector` et la troisième par un `podSelector`.

**egress** : chaque NetworkPolicy peut contenir une liste de règles `egress` autorisées. Chaque règle autorise
le trafic qui correspond à la fois aux sections `to` et `ports`. La politique de l'exemple contient une seule
règle, qui correspond au trafic sur un seul port vers n'importe quelle destination dans `10.0.0.0/24`.

La NetworkPolicy de l'exemple a donc les effets suivants :

1. elle isole les pods `role=db` du namespace `default` pour le trafic entrant et sortant
   (s'ils n'étaient pas déjà isolés)
1. (règles Ingress) elle autorise les connexions vers tous les pods du namespace `default` qui ont le label
   `role=db`, sur le port TCP 6379, depuis :

   * n'importe quel pod du namespace `default` qui a le label `role=frontend`
   * n'importe quel pod d'un namespace qui a le label `project=myproject`
   * les adresses IP des plages `172.17.0.0`–`172.17.0.255` et `172.17.2.0`–`172.17.255.255`
     (c'est-à-dire tout `172.17.0.0/16` sauf `172.17.1.0/24`)

1. (règles Egress) elle autorise les connexions depuis n'importe quel pod du namespace `default` qui a le label
   `role=db` vers le CIDR `10.0.0.0/24`, sur le port TCP 5978

Consultez le tutoriel [Déclarer une politique réseau](/docs/tasks/administer-cluster/declare-network-policy/)
pour d'autres exemples.

## Comportement des sélecteurs `to` et `from` {#behavior-of-to-and-from-selectors}

Quatre types de sélecteurs peuvent être indiqués dans une section `from` d'`ingress` ou dans une section `to`
d'`egress` :

**podSelector** : sélectionne certains Pods du même namespace que la NetworkPolicy, qui doivent être
autorisés comme sources en entrée ou comme destinations en sortie.

**namespaceSelector** : sélectionne certains namespaces dont tous les Pods doivent être autorisés comme
sources en entrée ou comme destinations en sortie.

**namespaceSelector** *et* **podSelector** : une même entrée `to`/`from` qui indique à la fois
`namespaceSelector` et `podSelector` sélectionne certains Pods dans certains namespaces. Veillez
à utiliser une syntaxe YAML correcte. Par exemple :

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

Cette politique contient un seul élément `from`, qui autorise les connexions depuis les Pods qui ont le label
`role=client` dans les namespaces qui ont le label `user=alice`. La politique suivante, elle, est différente :

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

Elle contient deux éléments dans le tableau `from`, et autorise les connexions depuis les Pods du
namespace local qui ont le label `role=client`, *ou* depuis n'importe quel Pod de n'importe quel namespace qui a le label
`user=alice`.

En cas de doute, utilisez `kubectl describe` pour voir comment Kubernetes a interprété la politique.

<a name="behavior-of-ipblock-selectors"></a>
**ipBlock** : sélectionne certaines plages CIDR d'adresses IP à autoriser comme sources en entrée ou comme
destinations en sortie. Il devrait s'agir d'adresses IP externes au cluster, car les adresses IP des Pods sont éphémères et imprévisibles.

Les mécanismes d'entrée et de sortie du cluster doivent souvent réécrire l'adresse IP source ou de destination
des paquets. Lorsque c'est le cas, rien ne définit si cette réécriture a lieu avant ou
après le traitement des NetworkPolicies, et le comportement peut varier selon la
combinaison de plugin réseau, de fournisseur cloud, d'implémentation des `Service`, etc.

En entrée, cela veut dire que, dans certains cas, vous pourrez filtrer les paquets entrants
selon leur véritable adresse IP source d'origine, alors que dans d'autres cas, l'« adresse IP source »
prise en compte par la NetworkPolicy peut être celle d'un `LoadBalancer`, du nœud du Pod, etc.

En sortie, cela veut dire que les connexions des pods vers des adresses IP de `Service` réécrites en
adresses IP externes au cluster peuvent être soumises ou non aux politiques basées sur `ipBlock`.

## Politiques par défaut {#default-policies}

Par défaut, s'il n'existe aucune politique dans un namespace, tout le trafic entrant et sortant est autorisé
vers et depuis les pods de ce namespace. Les exemples suivants vous permettent de modifier ce comportement par défaut
dans ce namespace.

### Refuser par défaut tout le trafic entrant {#default-deny-all-ingress-traffic}

Pour créer une politique d'isolation en entrée « par défaut » dans un namespace, créez une NetworkPolicy
qui sélectionne tous les pods mais n'autorise aucun trafic entrant vers ces pods.

{{% code_sample file="service/networking/network-policy-default-deny-ingress.yaml" %}}

Ainsi, même les pods qui ne sont sélectionnés par aucune autre NetworkPolicy restent isolés
en entrée. Cette politique n'a pas d'effet sur l'isolation en sortie des pods.

### Autoriser tout le trafic entrant {#allow-all-ingress-traffic}

Si vous voulez autoriser toutes les connexions entrantes vers tous les pods d'un namespace, vous pouvez créer une politique
qui les autorise explicitement.

{{% code_sample file="service/networking/network-policy-allow-all-ingress.yaml" %}}

Une fois cette politique en place, aucune autre politique ne peut entraîner le refus d'une connexion entrante
vers ces pods. Cette politique n'a pas d'effet sur l'isolation en sortie des pods.

### Refuser par défaut tout le trafic sortant {#default-deny-all-egress-traffic}

Pour créer une politique d'isolation en sortie « par défaut » dans un namespace, créez une NetworkPolicy
qui sélectionne tous les pods mais n'autorise aucun trafic sortant depuis ces pods.

{{% code_sample file="service/networking/network-policy-default-deny-egress.yaml" %}}

Ainsi, même les pods qui ne sont sélectionnés par aucune autre NetworkPolicy n'ont droit à aucun
trafic sortant. Cette politique ne change pas le comportement d'isolation en entrée des pods.

{{< caution >}}
Une politique qui refuse par défaut tout le trafic sortant bloque aussi le trafic DNS. Si vos charges de travail
ont besoin de la résolution DNS, vous devez ajouter une NetworkPolicy distincte qui autorise le trafic sortant
vers le service DNS de votre cluster.
{{< /caution >}}

### Autoriser tout le trafic sortant {#allow-all-egress-traffic}

Si vous voulez autoriser toutes les connexions depuis tous les pods d'un namespace, vous pouvez créer une politique qui
autorise explicitement toutes les connexions sortantes des pods de ce namespace.

{{% code_sample file="service/networking/network-policy-allow-all-egress.yaml" %}}

Une fois cette politique en place, aucune autre politique ne peut entraîner le refus d'une connexion sortante
depuis ces pods. Cette politique n'a pas d'effet sur l'isolation en entrée des pods.

### Refuser par défaut tout le trafic entrant et sortant {#default-deny-all-ingress-and-all-egress-traffic}

Vous pouvez créer une politique « par défaut » pour un namespace qui empêche tout le trafic entrant ET sortant
en créant la NetworkPolicy suivante dans ce namespace.

{{% code_sample file="service/networking/network-policy-default-deny-all.yaml" %}}

Ainsi, même les pods qui ne sont sélectionnés par aucune autre NetworkPolicy n'ont droit à aucun
trafic entrant ni sortant.

## Filtrage du trafic réseau {#network-traffic-filtering}

Les NetworkPolicies sont définies pour les connexions de [couche 4](https://fr.wikipedia.org/wiki/Couche_transport)
(TCP, UDP et, en option, SCTP). Pour tous les autres protocoles, le comportement peut varier
d'un plugin réseau à l'autre.

{{< note >}}
Vous devez utiliser un plugin {{< glossary_tooltip text="CNI" term_id="cni" >}} qui prend en charge
les NetworkPolicies pour le protocole SCTP.
{{< /note >}}

Lorsqu'une politique réseau `deny all` est définie, elle ne garantit que le refus des connexions TCP, UDP et SCTP.
Pour les autres protocoles, comme ARP ou ICMP, le comportement n'est pas défini.
Il en va de même pour les règles d'autorisation : quand un pod précis est autorisé comme source en entrée ou comme destination en sortie,
ce qu'il advient des paquets ICMP, par exemple, n'est pas défini. Des protocoles comme ICMP peuvent être autorisés par certains
plugins réseau et refusés par d'autres.

## Cibler une plage de ports {#targeting-a-range-of-ports}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Quand vous écrivez une NetworkPolicy, vous pouvez cibler une plage de ports au lieu d'un seul port.

Pour cela, utilisez le champ `endPort`, comme dans l'exemple suivant :

{{% code_sample file="service/networking/networkpolicy-multiport-egress.yaml" %}}

La règle ci-dessus autorise n'importe quel Pod qui a le label `role=db` dans le namespace `default` à communiquer
avec n'importe quelle adresse IP de la plage `10.0.0.0/24` en TCP, à condition que le port
de destination soit compris entre 32000 et 32768.

Les restrictions suivantes s'appliquent à l'utilisation de ce champ :

* Le champ `endPort` doit être supérieur ou égal au champ `port`.
* `endPort` ne peut être défini que si `port` est aussi défini.
* Les deux ports doivent être numériques.

{{< note >}}
Votre cluster doit utiliser un plugin {{< glossary_tooltip text="CNI" term_id="cni" >}} qui
prend en charge le champ `endPort` dans les spécifications des NetworkPolicies.
Si votre [plugin réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
ne prend pas en charge le champ `endPort` et que vous définissez une NetworkPolicy qui l'utilise,
seul le champ `port` sera pris en compte.
{{< /note >}}

## Cibler plusieurs namespaces par label {#targeting-multiple-namespaces-by-label}

Dans ce scénario, votre NetworkPolicy `Egress` cible plusieurs namespaces grâce à leurs
labels. Pour que cela fonctionne, vous devez poser un label sur les namespaces cibles. Par exemple :

```shell
kubectl label namespace frontend namespace=frontend
kubectl label namespace backend namespace=backend
```

Ajoutez les labels sous `namespaceSelector` dans votre NetworkPolicy. Par exemple :

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-namespaces
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchExpressions:
        - key: namespace
          operator: In
          values: ["frontend", "backend"]
```

{{< note >}}
Il n'est pas possible d'indiquer directement le nom des namespaces dans une NetworkPolicy.
Vous devez utiliser un `namespaceSelector` avec `matchLabels` ou `matchExpressions` pour sélectionner
les namespaces selon leurs labels.
{{< /note >}}

## Cibler un namespace par son nom {#targeting-a-namespace-by-its-name}

Le plan de contrôle de Kubernetes pose sur tous les namespaces un label immuable `kubernetes.io/metadata.name`,
dont la valeur est le nom du namespace.

Une NetworkPolicy ne peut pas cibler un namespace par son nom via un champ de l'objet, mais vous pouvez utiliser
ce label standardisé pour cibler un namespace précis.

## Cycle de vie d'un pod {#pod-lifecycle}

{{< note >}}
Ce qui suit s'applique aux clusters qui disposent d'un plugin réseau conforme et d'une implémentation conforme
des NetworkPolicies.
{{< /note >}}

Quand un nouvel objet NetworkPolicy est créé, le plugin réseau peut mettre un certain temps
à le prendre en compte. Si un pod concerné par une NetworkPolicy
est créé avant que le plugin réseau ait fini de traiter cette NetworkPolicy,
ce pod peut démarrer sans protection, et les règles d'isolation seront appliquées une fois
le traitement de la NetworkPolicy terminé.

Une fois la NetworkPolicy traitée par le plugin réseau :

1. Tous les nouveaux pods concernés par une NetworkPolicy donnée seront isolés avant de démarrer.
   Les implémentations des NetworkPolicies doivent garantir que le filtrage est effectif pendant tout
   le cycle de vie du Pod, dès le tout premier instant où l'un des conteneurs de ce Pod démarre.
   Comme elles s'appliquent au niveau du Pod, les NetworkPolicies s'appliquent de la même façon aux conteneurs d'initialisation,
   aux conteneurs sidecar et aux conteneurs ordinaires.

1. Les règles d'autorisation finiront par être appliquées après les règles d'isolation (ou peut-être en même temps).
   Dans le pire des cas, un pod nouvellement créé peut n'avoir aucune connectivité réseau au démarrage, si
   les règles d'isolation étaient déjà appliquées mais pas encore les règles d'autorisation.

Chaque NetworkPolicy créée finira par être traitée par un plugin réseau, mais l'API Kubernetes
ne permet pas de savoir à quel moment précis.

Les pods doivent donc pouvoir démarrer avec une connectivité réseau différente
de celle attendue. Si vous devez vous assurer que le pod peut joindre certaines destinations
avant de démarrer, vous pouvez utiliser un [conteneur d'initialisation](/docs/concepts/workloads/pods/init-containers/)
qui attend que ces destinations soient joignables avant que le kubelet ne démarre les conteneurs de l'application.

Chaque NetworkPolicy finira par être appliquée à tous les pods sélectionnés.
Comme le plugin réseau peut mettre en œuvre les NetworkPolicies de manière distribuée,
il est possible que les pods aient une vue légèrement incohérente des politiques réseau
au moment de la création d'un pod, ou quand des pods ou des politiques changent.
Par exemple, un pod nouvellement créé qui doit pouvoir joindre à la fois le Pod A
sur le Nœud 1 et le Pod B sur le Nœud 2 peut constater qu'il joint le Pod A immédiatement,
mais qu'il ne peut joindre le Pod B que quelques secondes plus tard.

## NetworkPolicy et pods `hostNetwork` {#networkpolicy-and-hostnetwork-pods}

Le comportement des NetworkPolicies pour les pods `hostNetwork` n'est pas défini, mais il devrait se limiter à deux possibilités :

- Le plugin réseau sait distinguer le trafic des pods `hostNetwork` de tout le reste du trafic
  (y compris distinguer le trafic de différents pods `hostNetwork` sur
  le même nœud), et applique les NetworkPolicies aux pods `hostNetwork` comme
  aux pods qui utilisent le réseau des pods.
- Le plugin réseau ne sait pas distinguer correctement le trafic des pods `hostNetwork`,
  et ignore donc les pods `hostNetwork` lorsqu'il évalue `podSelector` et `namespaceSelector`.
  Le trafic depuis et vers les pods `hostNetwork` est traité comme tout autre trafic depuis et vers l'adresse IP du nœud.
  (C'est l'implémentation la plus courante.)

Cela s'applique quand

1. un pod `hostNetwork` est sélectionné par `spec.podSelector`.

   ```yaml
     ...
     spec:
       podSelector:
         matchLabels:
           role: client
     ...
   ```

1. un pod `hostNetwork` est sélectionné par un `podSelector` ou un `namespaceSelector` dans une règle `ingress` ou `egress`.

   ```yaml
     ...
     ingress:
       - from:
         - podSelector:
             matchLabels:
               role: client
     ...
   ```

Par ailleurs, comme les pods `hostNetwork` ont la même adresse IP que le nœud sur lequel ils s'exécutent,
leurs connexions sont traitées comme des connexions du nœud. Par exemple, vous pouvez autoriser le trafic
venant d'un Pod `hostNetwork` avec une règle `ipBlock`.

## Ce que les politiques réseau ne permettent pas de faire (du moins, pas encore) {#what-you-can-t-do-with-network-policies-at-least-not-yet}

Dans Kubernetes {{< skew currentVersion >}}, les fonctionnalités suivantes n'existent pas dans
l'API NetworkPolicy, mais vous pouvez peut-être les contourner avec des composants du système d'exploitation
(comme SELinux, OpenVSwitch, IPTables, etc.), des technologies de couche 7 (contrôleurs
d'Ingress, implémentations de service mesh) ou des contrôleurs d'admission. Si vous découvrez la
sécurité réseau dans Kubernetes, sachez que les cas d'usage suivants ne peuvent pas (encore) être
mis en œuvre avec l'API NetworkPolicy.

- Forcer le trafic interne du cluster à passer par une passerelle commune (un service mesh ou un autre proxy
  est sans doute plus adapté).
- Tout ce qui touche à TLS (utilisez un service mesh ou un contrôleur d'Ingress pour cela).
- Des politiques propres à un nœud (vous pouvez utiliser la notation CIDR, mais vous ne pouvez pas cibler les nœuds
  par leur identité Kubernetes).
- Cibler des services par leur nom (vous pouvez en revanche cibler des pods ou des namespaces par leurs
  {{< glossary_tooltip text="labels" term_id="label" >}}, ce qui est souvent un bon moyen de contourner le problème).
- Créer ou gérer des « demandes de politique » traitées par un tiers.
- Des politiques par défaut appliquées à tous les namespaces ou à tous les pods (certains projets et distributions
  Kubernetes tiers savent le faire).
- Des outils avancés d'interrogation des politiques et d'analyse d'accessibilité.
- Journaliser les événements de sécurité réseau (par exemple les connexions bloquées ou acceptées).
- Refuser explicitement par une politique (actuellement, le modèle des NetworkPolicies refuse par
  défaut et permet seulement d'ajouter des règles d'autorisation).
- Empêcher le trafic de loopback ou le trafic entrant venant de l'hôte (les Pods ne peuvent pas, à l'heure actuelle, bloquer l'accès
  à localhost, ni bloquer l'accès depuis le nœud sur lequel ils s'exécutent).

## Impact des NetworkPolicies sur les connexions existantes {#networkpolicy-s-impact-on-existing-connections}

Quand l'ensemble des NetworkPolicies qui s'appliquent à une connexion existante change (parce que les NetworkPolicies
sont modifiées, ou parce que les labels concernés des namespaces ou des pods sélectionnés par la
politique, côté sujet comme côté pairs, changent pendant une connexion existante), c'est
l'implémentation qui détermine si le changement s'applique ou non à cette connexion existante.
Exemple : une politique est créée et refuse une connexion jusque-là autorisée. C'est l'implémentation
du plugin réseau sous-jacent qui détermine si cette nouvelle politique ferme ou non les connexions existantes.
Il est recommandé de ne pas modifier les politiques, les pods ou les namespaces d'une façon qui pourrait affecter les connexions existantes.

## {{% heading "whatsnext" %}}

- Consultez le tutoriel [Déclarer une politique réseau](/docs/tasks/administer-cluster/declare-network-policy/)
  pour d'autres exemples.
- Retrouvez des [exemples](https://github.com/ahmetb/kubernetes-network-policy-recipes) pour des
  scénarios courants rendus possibles par la ressource NetworkPolicy.
