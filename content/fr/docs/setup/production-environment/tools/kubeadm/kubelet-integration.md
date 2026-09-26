---
reviewers:
- sig-cluster-lifecycle
title: Configuration de chaque kubelet dans votre cluster avec kubeadm
content_type: concept
weight: 80
---

<!-- vue d’ensemble -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Le cycle de vie de l’outil CLI kubeadm est découplé du
[kubelet](/docs/reference/command-line-tools-reference/kubelet), qui est un daemon s’exécutant
sur chaque nœud au sein du cluster Kubernetes. L’outil CLI kubeadm est exécuté par l’utilisateur lors de l’initialisation ou de la mise à niveau de Kubernetes, tandis que le kubelet fonctionne en permanence en arrière-plan.

Étant donné que le kubelet est un daemon, il doit être géré par un système d’initialisation (init system) ou un gestionnaire de services. Lorsque le kubelet est installé via des paquets DEB ou RPM, systemd est configuré pour gérer le kubelet. Vous pouvez utiliser un autre gestionnaire de services, mais vous devrez le configurer manuellement.

Certaines configurations du kubelet doivent être identiques sur tous les kubelets du cluster, tandis que d’autres doivent être définies individuellement pour chaque kubelet afin de s’adapter aux caractéristiques spécifiques d’une machine (comme le système d’exploitation, le stockage et le réseau). Vous pouvez gérer la configuration des kubelets manuellement, mais kubeadm fournit désormais un type d’API `KubeletConfiguration` pour
[centraliser la gestion des configurations du kubelet](#configure-kubelets-using-kubeadm).

<!-- contenu principal -->

## Modèles de configuration du kubelet

Les sections suivantes décrivent des modèles de configuration du kubelet simplifiés grâce à kubeadm, plutôt que de gérer manuellement la configuration de chaque nœud.

### Propagation de la configuration au niveau du cluster vers chaque kubelet

Vous pouvez fournir au kubelet des valeurs par défaut utilisées par les commandes `kubeadm init` et `kubeadm join`.
Parmi les exemples intéressants, on peut citer l’utilisation d’un runtime de conteneurs différent ou la définition du sous-réseau par défaut utilisé par les services.

Si vous souhaitez que vos services utilisent le sous-réseau `10.96.0.0/12` par défaut, vous pouvez passer le paramètre `--service-cidr` à kubeadm :

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Les adresses IP virtuelles des services sont désormais allouées à partir de ce sous-réseau. Vous devez également définir l’adresse DNS utilisée par le kubelet, à l’aide de l’option `--cluster-dns`. Ce paramètre doit être identique pour tous les kubelets de tous les nœuds du plan de contrôle et des nœuds du cluster.

Le kubelet fournit un objet d’API structuré et versionné permettant de configurer la plupart de ses paramètres et de diffuser cette configuration à chaque kubelet en cours d’exécution dans le cluster. Cet objet est appelé
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

Le `KubeletConfiguration` permet à l’utilisateur de spécifier des options telles que les adresses IP du DNS du cluster, exprimées sous forme de liste de valeurs associées à une clé en camelCase, comme illustré dans l’exemple suivant :

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Pour plus de détails sur le `KubeletConfiguration`, consultez [cette section](#configure-kubelets-using-kubeadm).

### Fournir des configurations spécifiques à une instance

Certains hôtes nécessitent des configurations kubelet spécifiques en raison de différences de matériel, de système d’exploitation, de réseau ou d’autres paramètres propres à chaque machine. La liste suivante fournit quelques exemples :

- Le chemin du fichier de résolution DNS, spécifié par l’option `--resolv-conf` du kubelet, peut varier selon les systèmes d’exploitation ou selon l’utilisation de `systemd-resolved`. Si ce chemin est incorrect, la résolution DNS échouera sur le nœud dont le kubelet est mal configuré.

- L’objet Node API `.metadata.name` est défini par défaut avec le nom d’hôte de la machine, sauf si vous utilisez un fournisseur cloud. Vous pouvez utiliser l’option `--hostname-override` pour remplacer ce comportement si vous devez définir un nom de nœud différent du nom d’hôte de la machine.

- Actuellement, le kubelet ne peut pas détecter automatiquement le driver cgroup utilisé par le runtime de conteneurs, mais la valeur de `--cgroup-driver` doit correspondre à celle utilisée par le runtime pour garantir le bon fonctionnement du kubelet.

- Pour spécifier le runtime de conteneurs, vous devez définir son endpoint avec l’option `--container-runtime-endpoint=<path>`.

La méthode recommandée pour appliquer ce type de configuration spécifique à une instance consiste à utiliser les
[patchs `KubeletConfiguration`](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Configurer les kubelets avec kubeadm

Il est possible de configurer le kubelet que kubeadm va démarrer si un objet API personnalisé
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
est fourni via un fichier de configuration comme suit : `kubeadm ... --config some-config-file.yaml`.

En exécutant `kubeadm config print init-defaults --component-configs KubeletConfiguration`, vous pouvez
voir toutes les valeurs par défaut de cette structure.

Il est également possible d’appliquer des patchs spécifiques à une instance par-dessus la configuration de base `KubeletConfiguration`.
Consultez [Personnaliser le kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
pour plus de détails.

### Workflow lors de l’utilisation de `kubeadm init`

Lorsque vous exécutez `kubeadm init`, la configuration du kubelet est sérialisée sur le disque
dans `/var/lib/kubelet/config.yaml`, et également téléversée dans une ConfigMap `kubelet-config`
dans le namespace `kube-system` du cluster.

En outre, l’outil kubeadm détecte le socket CRI sur le nœud et écrit ses détails
(y compris le chemin du socket) dans une configuration locale `/var/lib/kubelet/instance-config.yaml`.

Un fichier de configuration kubelet est également écrit dans `/etc/kubernetes/kubelet.conf`,
contenant la configuration de base commune à tous les kubelets du cluster. Ce fichier de configuration
pointe vers les certificats clients permettant au kubelet de communiquer avec le serveur API. Cela
répond au besoin de
[propager la configuration au niveau du cluster vers chaque kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Pour répondre au second modèle de
[fourniture de paramètres spécifiques à une instance](#providing-instance-specific-configuration-details),
kubeadm écrit un fichier d’environnement dans `/var/lib/kubelet/kubeadm-flags.env`, qui contient une liste de
paramètres à passer au kubelet lors de son démarrage. Les flags sont présentés dans ce fichier comme suit :

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

En plus des options utilisées lors du démarrage du kubelet, ce fichier contient également des paramètres dynamiques
tels que le driver cgroup.

Après avoir écrit ces deux fichiers sur le disque, kubeadm tente d’exécuter les deux
commandes suivantes si vous utilisez systemd :

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Si le rechargement et le redémarrage réussissent, le flux normal de `kubeadm init` continue.

### Workflow lors de l’utilisation de `kubeadm join`

Lorsque vous exécutez `kubeadm join`, kubeadm utilise le jeton de bootstrap (Bootstrap Token) pour effectuer
un bootstrap TLS, qui récupère les identifiants nécessaires pour télécharger la ConfigMap
`kubelet-config`, puis l’écrit dans `/var/lib/kubelet/config.yaml`.

En outre, l’outil kubeadm détecte le socket CRI sur le nœud et écrit ses détails
(y compris le chemin du socket) dans une configuration locale `/var/lib/kubelet/instance-config.yaml`.

Le fichier d’environnement dynamique est généré exactement de la même manière que pour `kubeadm init`.

Ensuite, `kubeadm` exécute les deux commandes suivantes pour charger la nouvelle configuration dans le kubelet :

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Après que le kubelet a chargé la nouvelle configuration, kubeadm écrit le fichier KubeConfig
`/etc/kubernetes/bootstrap-kubelet.conf`, qui contient un certificat CA et un Bootstrap Token.
Ces éléments sont utilisés par le kubelet pour effectuer le bootstrap TLS et obtenir une
identité unique, qui est ensuite stockée dans `/etc/kubernetes/kubelet.conf`.

Une fois que le fichier `/etc/kubernetes/kubelet.conf` est écrit, le kubelet a terminé le bootstrap TLS.
Kubeadm supprime le fichier `/etc/kubernetes/bootstrap-kubelet.conf` après la fin de ce processus.

## Le fichier drop-in du kubelet pour systemd

`kubeadm` fournit la configuration indiquant comment systemd doit exécuter le kubelet.
Notez que la commande kubeadm ne modifie jamais ce fichier drop-in.

Ce fichier de configuration installé par le
[paquet kubeadm](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf)
est écrit dans `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` et est utilisé par systemd.
Il complète le fichier de base
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

Si vous souhaitez aller plus loin et le surcharger, vous pouvez créer le répertoire
`/etc/systemd/system/kubelet.service.d/` (et non `/usr/lib/systemd/system/kubelet.service.d/`)
et y placer vos propres personnalisations. Par exemple, vous pouvez ajouter un fichier local
`/etc/systemd/system/kubelet.service.d/local-overrides.conf` pour remplacer les paramètres de l’unité
configurés par kubeadm.

Voici ce que vous trouverez probablement dans `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` :

{{< note >}}
Le contenu ci-dessous est uniquement un exemple. Si vous ne souhaitez pas utiliser un gestionnaire de paquets,
suivez le guide décrit dans la section ([Sans gestionnaire de paquets](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)).
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# Ceci est un fichier que "kubeadm init" et "kubeadm join" génèrent au moment de l’exécution,
# en remplissant dynamiquement la variable KUBELET_KUBEADM_ARGS
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# Ceci est un fichier que l’utilisateur peut utiliser pour des surcharges des arguments du kubelet en dernier recours.
# Idéalement, l’utilisateur devrait utiliser l’objet .NodeRegistration.KubeletExtraArgs dans les fichiers de configuration à la place.
# KUBELET_EXTRA_ARGS doit être lu depuis ce fichier.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Ce fichier spécifie les emplacements par défaut de tous les fichiers gérés par kubeadm pour le kubelet.

- Le fichier KubeConfig utilisé pour le TLS Bootstrap est `/etc/kubernetes/bootstrap-kubelet.conf`,
  mais il n’est utilisé que si `/etc/kubernetes/kubelet.conf` n’existe pas.
- Le fichier KubeConfig contenant l’identité unique du kubelet est `/etc/kubernetes/kubelet.conf`.
- Le fichier contenant le ComponentConfig du kubelet est `/var/lib/kubelet/config.yaml`.
- Le fichier d’environnement dynamique contenant `KUBELET_KUBEADM_ARGS` est chargé depuis `/var/lib/kubelet/kubeadm-flags.env`.
- Le fichier pouvant contenir des options définies par l’utilisateur via `KUBELET_EXTRA_ARGS` est chargé depuis
  `/etc/default/kubelet` (pour les paquets DEB), ou `/etc/sysconfig/kubelet` (pour les RPM). `KUBELET_EXTRA_ARGS`
  est en dernier dans la chaîne des paramètres et a la plus haute priorité en cas de conflit.

## Binaires Kubernetes et contenu des paquets

Les paquets DEB et RPM fournis avec les versions de Kubernetes sont :

| Nom du paquet | Description |
|--------------|-------------|
| `kubeadm`    | Installe l’outil CLI `/usr/bin/kubeadm` et le [fichier drop-in du kubelet](#the-kubelet-drop-in-file-for-systemd). |
| `kubelet`    | Installe le binaire `/usr/bin/kubelet`. |
| `kubectl`    | Installe le binaire `/usr/bin/kubectl`. |
| `cri-tools`  | Installe le binaire `/usr/bin/crictl` depuis le dépôt [cri-tools](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Installe les binaires `/opt/cni/bin` depuis le dépôt [plugins](https://github.com/containernetworking/plugins). |
