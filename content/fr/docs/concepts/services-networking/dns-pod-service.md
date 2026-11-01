---
title: DNS pour les Services et les Pods
content_type: concept
weight: 80
description: >-
  Vos charges de travail peuvent découvrir les Services de votre cluster grâce au DNS ;
  cette page explique comment cela fonctionne.
---
<!-- overview -->

Kubernetes crée des enregistrements DNS pour les Services et les Pods. Vous pouvez joindre
les Services avec des noms DNS stables plutôt qu'avec des adresses IP.

<!-- body -->

Kubernetes publie des informations sur les Pods et les Services, qui servent
à configurer le DNS. Le kubelet configure le DNS des Pods pour que les conteneurs en cours d'exécution
puissent trouver les Services par leur nom plutôt que par leur adresse IP.

Les Services définis dans le cluster reçoivent des noms DNS. Par défaut, la
liste de recherche DNS d'un Pod client contient le namespace du Pod lui-même et le
domaine par défaut du cluster.

### Namespaces des Services {#namespaces-of-services}

Une requête DNS peut renvoyer des résultats différents selon le namespace du Pod qui
l'envoie. Les requêtes DNS qui n'indiquent pas de namespace sont limitées au namespace
du Pod. Pour accéder aux Services d'autres namespaces, indiquez le namespace dans la requête DNS.

Prenons par exemple un Pod dans un namespace `test`, et un Service `data` dans
le namespace `prod`.

Une requête pour `data` ne renvoie aucun résultat, car elle utilise le namespace `test` du Pod.

Une requête pour `data.prod` renvoie le résultat attendu, car elle indique le
namespace.

Les requêtes DNS peuvent être complétées à l'aide du fichier `/etc/resolv.conf` du Pod. Le kubelet
configure ce fichier pour chaque Pod. Par exemple, une requête pour `data` seul peut être
complétée en `data.test.svc.cluster.local`. Ce sont les valeurs de l'option `search`
qui servent à compléter les requêtes. Pour en savoir plus sur les requêtes DNS, consultez
[la page de manuel de `resolv.conf`](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html).

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

En résumé, un Pod du namespace _test_ peut résoudre aussi bien
`data.prod` que `data.prod.svc.cluster.local`.

### Enregistrements DNS {#dns-records}

Quels objets reçoivent des enregistrements DNS ?

1. Les Services
1. Les Pods

Les sections suivantes décrivent en détail les types d'enregistrements DNS et la structure
pris en charge. Toute autre structure, tout autre nom ou toute autre requête qui se trouverait fonctionner
relève de détails d'implémentation susceptibles de changer sans préavis.
Pour une spécification plus à jour, consultez
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Services {#services}

### Enregistrements A/AAAA {#a-aaaa-records}

Les Services « normaux » (non headless) reçoivent des enregistrements DNS A et/ou AAAA,
selon la ou les familles d'adresses IP du Service, avec un nom de la forme
`my-svc.my-namespace.svc.cluster-domain.example`. Ce nom est résolu en l'adresse IP de cluster
du Service.

Les [Services headless](/docs/concepts/services-networking/service/#headless-services)
(sans IP de cluster) reçoivent eux aussi des enregistrements DNS A et/ou AAAA,
avec un nom de la forme `my-svc.my-namespace.svc.cluster-domain.example`. Contrairement aux Services
normaux, ce nom est résolu en l'ensemble des adresses IP de tous les Pods sélectionnés par le Service.
Les clients sont censés utiliser cet ensemble, ou bien y choisir une adresse
en round-robin standard.

### Enregistrements SRV {#srv-records}

Des enregistrements SRV sont créés pour les ports nommés des Services normaux ou
headless.

- Pour chaque port nommé, l'enregistrement SRV a la forme
  `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
- Pour un Service normal, il est résolu en le numéro de port et le nom de domaine
  `my-svc.my-namespace.svc.cluster-domain.example`.
- Pour un Service headless, il est résolu en plusieurs réponses, une pour chaque Pod
  sous-jacent au Service. Chaque réponse contient le numéro de port et le nom de domaine du Pod,
  de la forme `hostname.my-svc.my-namespace.svc.cluster-domain.example`.

## Pods {#pods}

### Enregistrements A/AAAA {#a-aaaa-records-1}

Avant la mise en œuvre de la
[spécification DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md),
les versions de Kube-DNS utilisaient la résolution DNS suivante :

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

Par exemple, si un Pod du namespace `default` a l'adresse IP 172.17.0.3,
et que le nom de domaine de votre cluster est `cluster.local`, le Pod a le nom DNS suivant :

```
172-17-0-3.default.pod.cluster.local
```

Certains mécanismes DNS de cluster, comme [CoreDNS](https://coredns.io/), fournissent aussi des enregistrements `A` de la forme :

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

Par exemple, si un Pod du namespace `cafe` a l'adresse IP 172.17.0.3,
qu'il est un point de terminaison d'un Service nommé `barista` et que le nom de domaine de votre cluster est
`cluster.local`, le Pod aura l'enregistrement DNS `A` suivant, propre au Service.

```
172-17-0-3.barista.cafe.svc.cluster.local
```

### Champs hostname et subdomain d'un Pod {#pod-hostname-and-subdomain-field}

Actuellement, lorsqu'un Pod est créé, son nom d'hôte (vu depuis l'intérieur du Pod)
est la valeur `metadata.name` du Pod.

La spec du Pod a un champ facultatif `hostname`, qui permet d'indiquer un
autre nom d'hôte. Lorsqu'il est renseigné, il prime sur le nom du Pod pour
définir le nom d'hôte du Pod (toujours vu depuis l'intérieur du Pod). Par exemple,
un Pod dont `spec.hostname` vaut `"my-host"` aura pour
nom d'hôte `"my-host"`.

La spec du Pod a aussi un champ facultatif `subdomain`, qui permet d'indiquer
que le Pod fait partie d'un sous-groupe du namespace. Par exemple, un Pod dont `spec.hostname`
vaut `"foo"` et `spec.subdomain` vaut `"bar"`, dans le namespace `"my-namespace"`, aura
pour nom d'hôte `"foo"` et pour nom de domaine pleinement qualifié (FQDN)
`"foo.bar.my-namespace.svc.cluster.local"` (là encore, vu depuis l'intérieur
du Pod).

S'il existe un Service headless dans le même namespace que le Pod, avec
le même nom que le sous-domaine, le serveur DNS du cluster renvoie aussi des enregistrements A et/ou AAAA
pour le nom d'hôte pleinement qualifié du Pod.

Exemple :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: busybox-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # name is not required for single-port Services
    port: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: busybox-subdomain
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
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

Avec le Service `"busybox-subdomain"` ci-dessus et les Pods dont `spec.subdomain`
vaut `"busybox-subdomain"`, le premier Pod verra
`"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"` comme son propre FQDN. Le DNS fournit
des enregistrements A et/ou AAAA pour ce nom, qui pointent vers l'adresse IP du Pod. Les deux Pods « `busybox1` » et
« `busybox2` » auront chacun leurs propres enregistrements d'adresse.

Un {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}} peut indiquer
le nom d'hôte DNS de n'importe quelle adresse de point de terminaison, avec son adresse IP.

{{< note >}}
Aucun enregistrement A ou AAAA n'est créé pour les noms de Pods si le Pod n'a pas de `hostname`.
Pour un Pod sans `hostname` mais avec un `subdomain`, seul
l'enregistrement A ou AAAA du Service headless (`busybox-subdomain.my-namespace.svc.cluster-domain.example`)
est créé ; il pointe vers les adresses IP des Pods. Par ailleurs, le Pod doit être prêt (ready) pour avoir un
enregistrement, sauf si `publishNotReadyAddresses=True` est défini sur le Service.
{{< /note >}}

### Champ setHostnameAsFQDN d'un Pod {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Lorsqu'un Pod est configuré pour avoir un nom de domaine pleinement qualifié (FQDN), son
nom d'hôte est le nom d'hôte court. Par exemple, pour un Pod dont le nom de domaine
pleinement qualifié est `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`,
la commande `hostname` exécutée dans ce Pod renvoie par défaut `busybox-1`, et la
commande `hostname --fqdn` renvoie le FQDN.

Lorsque vous définissez `setHostnameAsFQDN: true` dans la spec du Pod, le kubelet écrit le FQDN du Pod
comme nom d'hôte dans le namespace de ce Pod. Dans ce cas, `hostname` et `hostname --fqdn`
renvoient tous les deux le FQDN du Pod.

{{< note >}}
Sous Linux, le champ hostname du noyau (le champ `nodename` de `struct utsname`) est limité à 64 caractères.

Si un Pod active cette fonctionnalité et que son FQDN dépasse 64 caractères, il ne pourra pas démarrer.
Le Pod restera à l'état `Pending` (`ContainerCreating` dans `kubectl`) et générera
des événements d'erreur, comme Failed to construct FQDN from Pod hostname and cluster domain,
FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested).
Pour améliorer l'expérience utilisateur dans ce cas, vous pouvez créer un
[contrôleur de webhook d'admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
qui vérifie la taille du FQDN lorsque les utilisateurs créent des objets de premier niveau, par exemple un Deployment.
{{< /note >}}

### Politique DNS d'un Pod {#pod-s-dns-policy}

Les politiques DNS se définissent Pod par Pod. Actuellement, Kubernetes prend en charge
les politiques DNS suivantes pour les Pods. Elles sont indiquées dans le
champ `dnsPolicy` de la spec du Pod.

- « `Default` » : le Pod hérite de la configuration de résolution de noms du nœud
  sur lequel il s'exécute.
  Consultez la [discussion à ce sujet](/docs/tasks/administer-cluster/dns-custom-nameservers)
  pour plus de détails.
- « `ClusterFirst` » : toute requête DNS qui ne correspond pas au suffixe de domaine configuré
  pour le cluster, comme « `www.kubernetes.io` », est transmise par le serveur DNS à un serveur
  de noms en amont. Les administrateurs du cluster peuvent avoir configuré des serveurs DNS supplémentaires,
  pour des domaines de délégation (stub domains) ou en amont.
  Consultez la [discussion à ce sujet](/docs/tasks/administer-cluster/dns-custom-nameservers)
  pour savoir comment les requêtes DNS sont traitées dans ces cas.
- « `ClusterFirstWithHostNet` » : pour les Pods qui s'exécutent avec hostNetwork, il faut
  régler explicitement leur politique DNS sur « `ClusterFirstWithHostNet` ». Sinon, les Pods
  qui s'exécutent avec hostNetwork et `"ClusterFirst"` se comporteront comme
  avec la politique `"Default"`.

  {{< note >}}
  Ce n'est pas pris en charge sous Windows. Pour plus de détails, voir [ci-dessous](#dns-windows).
  {{< /note >}}

- « `None` » : permet à un Pod d'ignorer les paramètres DNS de l'environnement
  Kubernetes. Tous les paramètres DNS sont alors censés être fournis par le
  champ `dnsConfig` de la spec du Pod.
  Consultez la sous-section [Configuration DNS d'un Pod](#pod-dns-config) ci-dessous.

{{< note >}}
« Default » n'est pas la politique DNS par défaut. Si `dnsPolicy` n'est pas
indiqué explicitement, c'est « ClusterFirst » qui est utilisé.
{{< /note >}}

L'exemple ci-dessous montre un Pod dont la politique DNS est
« `ClusterFirstWithHostNet` », car son champ `hostNetwork` vaut `true`.

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

### Configuration DNS d'un Pod {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

La configuration DNS d'un Pod donne aux utilisateurs plus de contrôle sur les paramètres DNS de ce Pod.

Le champ `dnsConfig` est facultatif et fonctionne avec n'importe quelle valeur de `dnsPolicy`.
En revanche, lorsque le `dnsPolicy` d'un Pod vaut « `None` », le champ `dnsConfig` doit
être renseigné.

Voici les propriétés qu'un utilisateur peut indiquer dans le champ `dnsConfig` :

- `nameservers` : une liste d'adresses IP qui serviront de serveurs DNS au
  Pod. On peut indiquer au maximum 3 adresses IP. Lorsque le `dnsPolicy` du Pod
  vaut « `None` », la liste doit contenir au moins une adresse IP ; dans les autres cas,
  cette propriété est facultative.
  Les serveurs indiqués sont ajoutés aux serveurs de noms de base générés à partir de la
  politique DNS choisie, les adresses en double étant supprimées.
- `searches` : une liste de domaines de recherche DNS pour la résolution des noms d'hôte dans le Pod.
  Cette propriété est facultative. Si elle est renseignée, la liste fournie est fusionnée
  avec les domaines de recherche de base générés à partir de la politique DNS choisie.
  Les noms de domaine en double sont supprimés.
  Kubernetes accepte jusqu'à 32 domaines de recherche.
- `options` : une liste facultative d'objets, dont chacun peut avoir une propriété `name`
  (obligatoire) et une propriété `value` (facultative). Le contenu de cette
  propriété est fusionné avec les options générées à partir de la politique DNS choisie.
  Les entrées en double sont supprimées.

Voici un exemple de Pod avec des paramètres DNS personnalisés :

{{% code_sample file="service/networking/custom-dns.yaml" %}}

Une fois le Pod ci-dessus créé, le fichier `/etc/resolv.conf` du conteneur `test`
a le contenu suivant :

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

Pour une configuration IPv6, le chemin de recherche et le serveur de noms devraient se présenter ainsi :

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

Le résultat ressemble à ceci :

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## Limites de la liste des domaines de recherche DNS {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes lui-même ne limite la configuration DNS que lorsque la liste des domaines de recherche
dépasse 32 éléments, ou que la longueur totale de tous les domaines de recherche dépasse 2048.
Cette limite s'applique respectivement au fichier de configuration du résolveur du nœud, à la configuration DNS
du Pod et à la configuration DNS fusionnée.

{{< note >}}
Les anciennes versions de certains environnements d'exécution de conteneurs peuvent imposer leurs propres restrictions
sur le nombre de domaines de recherche DNS. Selon l'environnement d'exécution
de conteneurs, les Pods qui ont beaucoup de domaines de recherche DNS peuvent rester bloqués
à l'état Pending.

Ce problème est connu pour containerd v1.5.5 et versions antérieures, ainsi que pour
CRI-O v1.21 et versions antérieures.
{{< /note >}}

## Résolution DNS sur les nœuds Windows {#dns-windows}

- `ClusterFirstWithHostNet` n'est pas pris en charge pour les Pods qui s'exécutent sur des nœuds Windows.
  Windows considère tout nom qui contient un `.` comme un FQDN et ne fait pas de résolution FQDN.
- Sous Windows, plusieurs résolveurs DNS peuvent être utilisés. Comme leurs
  comportements diffèrent légèrement, il est recommandé d'utiliser la
  cmdlet PowerShell [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  pour résoudre les noms.
- Sous Linux, vous disposez d'une liste de suffixes DNS, utilisée lorsque la résolution d'un nom
  en tant que nom pleinement qualifié a échoué.
  Sous Windows, vous ne pouvez avoir qu'un seul suffixe DNS : celui associé au
  namespace du Pod (par exemple `mydns.svc.cluster.local`). Windows peut résoudre les FQDN, les Services
  ou les noms réseau résolubles avec ce seul suffixe. Par exemple, un Pod lancé
  dans le namespace `default` aura le suffixe DNS `default.svc.cluster.local`.
  Dans un Pod Windows, vous pouvez résoudre à la fois `kubernetes.default.svc.cluster.local`
  et `kubernetes`, mais pas les noms partiellement qualifiés (`kubernetes.default` ou
  `kubernetes.default.svc`).

## {{% heading "whatsnext" %}}

Pour savoir comment administrer les configurations DNS, consultez
[Configurer le service DNS](/docs/tasks/administer-cluster/dns-custom-nameservers/).
