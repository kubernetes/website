---
title: DNS pour les services et les pods
description: DNS services pods Kubernetes
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
Cette page fournit une vue d'ensemble du support DNS par Kubernetes.
{{% /capture %}}

{{% capture body %}}

## Introduction

Kubernetes planifie un pod et un service DNS sur le cluster et configure
les kubelets pour indiquer à chaque conteneur d'utiliser l'adresse IP du service DNS pour résoudre les noms DNS.

### Quels composants obtiennent des noms DNS?

Chaque service défini dans le cluster (y compris le serveur DNS lui-même) a un nom DNS. Par défaut, la liste de recherche DNS du client d'un pod inclura le namespace (espace de nommage) du pod et le domaine par défaut du cluster. C'est mieux
illustré par un exemple :

Supposons un service nommé `foo` dans le namespace Kubernetes `bar`. Un pod en cours d'exécution dans le namespace `bar` peut rechercher ce service en faisant simplement une requête DNS "foo". Un pod qui tourne dans le namespace `quux` peut rechercher ce service en effectuant une requête DNS `foo.bar`.

Les sections suivantes détaillent les types d’enregistrement et la structure supportée par Kubernetes. Toute autre structure ou noms ou requêtes qui fonctionnent sont
considérés comme des détails d'implémentation et peuvent changer sans préavis.
Pour une spécification plus à jour, voir
[Découverte des services basée sur le DNS Kubernetes](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Services

### Enregistrement A

Les services "normaux" (pas sans en-tête) se voient attribuer un enregistrement DNS A, et ont un nom sous la forme : `mon-service.mon-namespace.svc.cluster.local`. La résolution de ce nom donne l'adresse `ClusterIP` du service.

Les Services "Headless" (ou sans en-tête, c'est à dire sans ClusterIP) auront également un enregistrement type A, donc un nom sous la forme : `mon-service.mon-namespace.svc.cluster.local`. Contrairement aux Services Normaux, cela résout l'ensemble des adresses IP des pods sélectionnés par le Service.
On s'attend à ce que les clients consomment l'ensemble ou utilisent le standard de sélection round-robin de l'ensemble.

### Enregistrement SRV

Les enregistrements SRV sont créés pour les ports nommés faisant partie des services normaux ou [Headless (sans en-tête)](/docs/concepts/services-networking/service/#headless-services).
Pour chaque port nommé, l'enregistrement SRV aurait la forme
`_mon-nom-de-port._mon-protocole-de-port.mon-service.mon-namespace.svc.cluster.local`.
Pour un service régulier, cela se traduit par le numéro de port et le nom de domaine :
`mon-service.mon-namespace.svc.cluster.local`.
Pour un service sans en-tête, cela pourrait être résolu en plusieurs réponses, une réponse pour chaque pod lié à ce service et qui contient le numéro de port, ainsi le nom de domaine du pod est sous la forme `nom-auto-genere.mon-service.mon-namespace.svc.cluster.local`.

## Pods

### Enregistrement A

Lorsque cette option est activée, un enregistrement DNS A est attribué aux pods sous la forme `adresse-ip-du-pod.mon-namespace.pod.cluster.local`.

Par exemple, un pod avec l’IP `1.2.3.4` dans le namespace (espace de nommage) `default` avec un nom DNS de `cluster.local` aurait une entrée : `1-2-3-4.default.pod.cluster.local`.

### Nom d'hôte et sous-domaine d'un pod

Actuellement, lorsqu'un pod est créé, son nom d'hôte a la valeur `metadata.name` du pod.

La spécification du pod a un champ optionnel `hostname`, qui peut être utilisé pour spécifier la valeur du nom d'hôte du pod. Quand c'est spécifié, ce dernier a la priorité sur le nom du pod. Par exemple, si un pod a un `hostname` ayant la valeur "`mon-hote`", son nom d'hôte sera "`mon-hote`".

La spécification du pod a également un champ optionnel `subdomain` qui peut être utilisé pour spécifier son sous-domaine. Par exemple, un pod avec une valeur "`foo`" du champ `hostname` et une valeur "`bar`" du champ `subdomain`, dans le namespace "`mon-namespace`", aura un nom de domaine (FQDN) "`foo.bar.mon-namespace.svc.cluster.local`".

Exemple :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sous-domaine-par-default
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # En vrai, cette définition de port est à titre d'exemple, nous n'avons pas vraiment besoin de ports pour cette application.
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: sous-domaine-par-default
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: sous-domaine-par-default
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```


Si un service sans en-tête (headless) est dans le même namespace que son pod et avec le même nom que le sous-domaine, le serveur KubeDNS du cluster renvoie également un enregistrement A pour le nom d’hôte (hostname) du pod.
Par exemple, si un pod dont le nom d’hôte est "` busybox-1`" et le sous-domaine est "`sous-domaine-par-default`", et un service sans en-tête nommé "`sous-domaine-par-default`" dans le même namespace, le pod verra son propre nom de domaine complet "`busybox-1.sous-domaine-par-default.mon-namespace.svc.cluster.local`". Le DNS sert un enregistrement A portant ce nom, et pointant vers l'adresse IP du pod. Les deux Pods "`busybox1`" et "` busybox2`" peuvent avoir leurs enregistrements A distincts.

L’objet Endpoints peut spécifier le `hostname` pour n’importe quelle adresse d'endpoint (noeud final), avec son adresse IP.

{{< note >}}
Etant donné que les enregistrements A ne sont pas créés pour les noms de pods, le `hostname` est requis pour la création de l'enregistrement A du pod. Un pod sans `hostname` mais avec `subdomain` (sous domaine) ne créera que l'enregistrement A pour le service sans en-tête (`sous-domaine-par-default.mon-namespace.svc.cluster.local`), pointant vers l'adresse IP du pod.
{{< /note >}}

### Politique DNS du Pod

Les stratégies DNS peuvent être définies par pod. Actuellement, Kubernetes supporte des stratégies DNS qui sont spécifiques au pod. Ces politiques sont spécifiées dans le
Champ `dnsPolicy` de la spécification du pod.

- "`Default`" : le pod hérite de la configuration de résolution des noms du node (noeud) sur lequel ce même pod est en train de tourner.
Voir [discussion liée](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) pour plus de détails.
- "`ClusterFirst`" : toute requête DNS ne correspondant pas au suffixe du domaine configuré dans le cluster, tel que "`www.kubernetes.io`", sera transmise au serveur en amont hérité du node (noeud). Les administrateurs du cluster peuvent configurer des serveurs DNS supplémentaires que ce soit des serveurs secondaires (locaux) ou des vrais serveurs récursifs en amont pour faire la résolution.
  Voir [discussion liée](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods) pour plus de détails sur la manière dont les requêtes DNS sont traitées dans ces cas.
- "`ClusterFirstWithHostNet`" : pour les pods exécutés avec `hostNetwork`, vous devez explicitement définir sa politique DNS "`ClusterFirstWithHostNet`".
- "`None`" : une nouvelle valeur optionnelle introduite dans Kubernetes v1.9 (Beta dans v1.10). Elle permet à un pod d’ignorer les configurations DNS de l’environnement Kubernetes. Ainsi, toutes les configurations DNS sont supposées être fournies dans le champ `dnsConfig` de la spécification du pod.
  Voir la sous-section [Config DNS](#dns-config) ci-dessous.

{{<note>}}
"Default" n'est pas la stratégie DNS par défaut. Si `dnsPolicy` n'est pas explicitement spécifié, `ClusterFirst` sera utilisé.
{{</ note>}}


L’exemple ci-dessous montre un pod avec une stratégie DNS "`ClusterFirstWithHostNet`" car il a le champ `hostNetwork` défini à `true`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Configuration DNS du pod

Kubernetes v1.9 introduit une fonctionnalité Alpha (version beta de v1.10) qui permet aux utilisateurs d'avoir plus de contrôle sur les paramètres DNS d'un pod. Cette fonctionnalité est activée par défaut dans la version 1.10.
Pour activer cette fonctionnalité dans la version 1.9, l'administrateur du cluster doit activer la feature gate (porte de fonctionnalité) `CustomPodDNS` sur les serveurs apiserver et kubelet, par exemple, "`--feature-gates=CustomPodDNS=true,...`".
Lorsque la fonction est activée, les utilisateurs peuvent mettre le champ `dnsPolicy` d’un pod à "`None`" et ils peuvent rajouter un nouveau champ `dnsConfig` à la spécification du pod.

Le champ `dnsConfig` est facultatif et peut fonctionner avec toute configuration `dnsPolicy`.
Cependant, quand `dnsPolicy` du pod est réglé sur "`None`", le champ `dnsConfig` doit être explicitement spécifié.

Vous trouverez ci-dessous les propriétés qu'un utilisateur peut spécifier dans le champ `dnsConfig`:

- `nameservers` : liste d'adresses IP qui seront utilisées comme serveurs DNS pour le Pod. Il     peut y avoir au plus 3 adresses IP spécifiées. Quand le champ `dnsPolicy` du Pod est mis à      "`None`", la liste doit contenir au moins une adresse IP, sinon cette propriété est facultative.
  Les serveurs listés seront combinés avec les nameservers (serveurs de noms) de base générés à partir de la stratégie DNS spécifiée, tout en supprimant les adresses en double.
- `searches` : liste des domaines de recherche DNS pour la recherche du nom d'hôte dans le pod.
  Cette propriété est facultative. Si elle est spécifiée, la liste fournie sera fusionnée avec les noms de domaine de recherche de base générés à partir de la stratégie DNS choisie.
  Les noms de domaine en double sont supprimés.
  Kubernetes permet au plus 6 domaines de recherche.
- `options`: une liste optionnelle d'objets où chaque objet peut avoir une propriété `name` (obligatoire) et une propriété `value` (facultatif). Le contenu de cette propriété sera fusionné avec les options générées à partir de la stratégie DNS spécifiée.
  Les entrées en double sont supprimées.

Voici un exemple de Pod avec des configurations DNS personnalisées :

```yaml
apiVersion: v1
kind: Pod
metadata:
  namespace: default
  name: exemple-dns
spec:
  containers:
    - name: test
      image: nginx
  dnsPolicy: "None"
  dnsConfig:
    nameservers:
      - 1.2.3.4
    searches:
      - ns1.svc.cluster.local
      - mon.dns.search.suffix
    options:
      - name: ndots
        value: "2"
      - name: edns0
```

Lorsque le Pod ci-dessus est créé, le conteneur `test` obtient le contenu suivant dans son fichier `/etc/resolv.conf` :

```
nameserver 1.2.3.4
search ns1.svc.cluster.local mon.dns.search.suffix
options ndots:2 edns0
```

Pour la configuration IPv6, le chemin de recherche et le serveur de noms doivent être configurés comme suit :

```
$ kubectl exec -it exemple-dns -- cat /etc/resolv.conf
nameserver fd00:79:30::a
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

{{% /capture %}}

{{% capture whatsnext %}}

Pour obtenir des recommendations sur l’administration des configurations DNS, consultez
[Configurer le service DNS](/docs/tasks/administer-cluster/dns-custom-nameservers/)

{{% /capture %}}