---
title: Configuration des kubelet de votre cluster avec kubeadm
description: Configuration kubelet Kubernetes cluster kubeadm
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="1.11" state="stable" >}}

Le cycle de vie de l’outil CLI kubeadm est découplé de celui de la
[kubelet](/docs/reference/command-line-tools-reference/kubelet), qui est un démon qui s'éxécute
sur chaque noeud du cluster Kubernetes. L'outil CLI de kubeadm est exécuté par l'utilisateur lorsque
 Kubernetes est initialisé ou mis à niveau, alors que la kubelet est toujours exécutée en arrière-plan.

Comme la kubelet est un démon, elle doit être maintenue par une sorte d'init système ou un gestionnaire
 de service. Lorsque la kubelet est installée à l'aide de DEB ou de RPM,
systemd est configuré pour gérer la kubelet. Vous pouvez utiliser un gestionnaire différent à la place,
 mais vous devez le configurer manuellement.

Certains détails de configuration de la kubelet doivent être identiques pour
toutes les kubelets du cluster, tandis que d’autres aspects de la configuration
doivent être définis par nœud, pour tenir compte des différentes caractéristiques
d’une machine donnée, telles que le système d’exploitation, le stockage et la
mise en réseau. Vous pouvez gérer la configuration manuellement de vos kubelets,
mais [kubeadm fournit maintenant un type d’API `KubeletConfiguration` pour la gestion centralisée de vos configurations de kubelets](#configure-kubelets-using-kubeadm).



<!-- body -->

## Patterns de configuration des Kubelets

Les sections suivantes décrivent les modèles de configuration de kubelet simplifiés en
utilisant kubeadm, plutôt que de gérer manuellement la configuration des kubelets pour chaque nœud.

### Propagation de la configuration niveau cluster à chaque kubelet {#propagating-cluster-level-configuration-to-each-kubelet}

Vous pouvez fournir à la kubelet les valeurs par défaut à utiliser par les commandes `kubeadm init` et
 `kubeadm join`. Des exemples intéressants incluent l’utilisation d’un runtime CRI différent ou la
 définition du sous-réseau par défaut utilisé par les services.

Si vous souhaitez que vos services utilisent le sous-réseau `10.96.0.0 / 12` par défaut pour les
 services, vous pouvez passer le paramètre `--service-cidr` à kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Les adresses IP virtuelles pour les services sont maintenant attribuées à partir de ce sous-réseau.
Vous devez également définir l'adresse DNS utilisée par la kubelet, en utilisant l'option
 `--cluster-dns`. Ce paramètre doit être le même pour chaque kubelet sur chaque master et worker
du cluster. La kubelet fournit un objet API structuré versionné qui peut configurer la plupart des
 paramètres dans la kubelet et pousser cette configuration à chaque exécution de la kubelet dans
 le cluster. Cet objet s'appelle la **ComponentConfig** de la kubelet.
La ComponentConfig permet à l’utilisateur de spécifier des options tels que les adresses IP DNS du
cluster exprimées en une liste de valeurs pour une clé formatée en CamelCased, illustrée par l'exemple suivant:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Pour plus de détails sur ComponentConfig, jetez un œil à [cette section](#configure-kubelets-using-kubeadm).

### Fournir des détails de configuration spécifiques à l'instance {#providing-instance-specific-configuration-details}

Certaines machines nécessitent des configurations de kubelet spécifiques, en raison de la différences de
matériel, de système d’exploitation, réseau ou d’autres paramètres spécifiques à l’hôte. La liste suivante
 fournit quelques exemples.

- Le chemin d'accès au fichier de résolution DNS, tel que spécifié par l'option de configuration
de la kubelet `--resolv-conf`, peut différer selon les systèmes d'exploitation ou selon que vous utilisez
 ou non `systemd-resolved`. Si ce chemin est incorrect, la résolution DNS échouera sur le nœud
 dont la kubelet est configuré de manière incorrecte.

- L'objet API de nœud `.metadata.name` est défini par défaut sur le hostname de la machine,
sauf si vous utilisez un fournisseur de cloud. Vous pouvez utiliser l’indicateur `--hostname-override`
 pour remplacer le comportement par défaut si vous devez spécifier un nom de nœud différent du hostname
  de la machine.

- Actuellement, la kubelet ne peut pas détecter automatiquement le driver cgroup utilisé par le
runtime CRI, mais la valeur de `--cgroup-driver` doit correspondre au driver cgroup
utilisé par le runtime CRI pour garantir la santé de la kubelet.

- En fonction du runtime du CRI utilisé par votre cluster, vous devrez peut-être spécifier des
options différentes pour la kubelet. Par exemple, lorsque vous utilisez Docker,
vous devez spécifier des options telles que
`--network-plugin = cni`, mais si vous utilisez un environnement d’exécution externe, vous devez spécifier
`--container-runtime = remote` et spécifier le CRI endpoint en utilisant l'option
`--container-runtime-path-endpoint = <chemin>`.

Vous pouvez spécifier ces options en modifiant la configuration d’une kubelet individuelle dans
votre gestionnaire de service, tel que systemd.

## Configurer les kubelets en utilisant kubeadm {#configure-kubelets-using-kubeadm}

Il est possible de configurer la kubelet que kubeadm va démarrer si un objet API personnalisé
`KubeletConfiguration` est passé en paramètre via un fichier de configuration comme
`kubeadm ... --config some-config-file.yaml`.

En appelant `kubeadm config print-default --api-objects KubeletConfiguration` vous
pouvez voir toutes les valeurs par défaut pour cette structure.

Regardez aussi la [référence API pour le composant ComponentConfig des kubelets](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
pour plus d'informations sur les champs individuels.

### Workflow lors de l'utilisation de `kubeadm init`

Lorsque vous appelez `kubeadm init`, la configuration de la kubelet est organisée sur le disque
sur `/var/lib/kubelet/config.yaml`, et également chargé sur une ConfigMap du cluster. La ConfigMap
 est nommé `kubelet-config-1.X`, où `.X` est la version mineure de la version de Kubernetes
 que vous êtes en train d'initialiser. Un fichier de configuration de kubelet est également écrit dans
`/etc/kubernetes/kubelet.conf` avec la configuration de base à l'échelle du cluster pour tous les
kubelets du cluster. Ce fichier de configuration pointe vers les certificats clients permettant aux
kubelets de communiquer avec l'API server. Ceci répond au besoin de
[propager la configuration niveau cluster à chaque kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Pour répondre au besoin de
[fournir des détails de configuration spécifiques à l'instance de kubelet](#providing-instance-specific-configuration-details),
kubeadm écrit un fichier d'environnement dans `/var/lib/kubelet/kubeadm-flags.env`, qui contient une liste
d'options à passer à la kubelet quand elle démarre. Les options sont représentées dans le fichier comme ceci:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Outre les indicateurs utilisés lors du démarrage de la kubelet, le fichier contient également des
informations dynamiques comme des paramètres tels que le driver cgroup et s'il faut utiliser un autre
socket de runtime CRI (`--cri-socket`).

Après avoir rassemblé ces deux fichiers sur le disque, kubeadm tente d’exécuter ces deux commandes,
 si vous utilisez systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Si le rechargement et le redémarrage réussissent, le workflow normal de `kubeadm init` continue.

### Workflow en utilisant `kubeadm join`

Lorsque vous exécutez `kubeadm join`, kubeadm utilise les informations d'identification du bootstrap
token pour faire un bootstrap TLS, qui récupère les informations d’identité nécessaires pour télécharger le
`kubelet-config-1.X` ConfigMap puis l'écrit dans `/var/lib/kubelet/config.yaml`. Le fichier d’environnement
dynamique est généré exactement de la même manière que `kubeadm init`.

Ensuite, `kubeadm` exécute les deux commandes suivantes pour charger la nouvelle configuration dans la kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Après le chargement de la nouvelle configuration par la kubelet, kubeadm écrit le fichier KubeConfig
`/etc/kubernetes/bootstrap-kubelet.conf`, qui contient un certificat de CA et un jeton Bootstrap.
 Ceux-ci sont utilisés par la kubelet pour effectuer le TLS Bootstrap et obtenir une information
 d'identification unique, qui est stocké dans `/etc/kubernetes/kubelet.conf`. Quand ce fichier est
 écrit, la kubelet a terminé l'exécution du bootstrap TLS.

##  Le fichier kubelet généré pour systemd {#the-kubelet-drop-in-file-for-systemd}

Le fichier de configuration installé par le package DEB ou RPM de kubeadm est écrit dans
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` et est utilisé par systemd.

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating
the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Ce fichier spécifie les emplacements par défaut pour tous les fichiers gérés par kubeadm pour la kubelet.

- Le fichier KubeConfig à utiliser pour le TLS Bootstrap est `/etc/kubernetes/bootstrap-kubelet.conf`,
  mais il n'est utilisé que si `/etc/kubernetes/kubelet.conf` n'existe pas.
- Le fichier KubeConfig avec l’identité unique de la kubelet est `/etc/kubernetes/kubelet.conf`.
- Le fichier contenant le ComponentConfig de la kubelet est `/var/lib/kubelet/config.yaml`.
- Le fichier d'environnement dynamique qui contient `KUBELET_KUBEADM_ARGS` est sourcé à partir de
 `/var/lib/kubelet/kubeadm-flags.env`.
- Le fichier qui peut contenir les paramètres surchargés par l'utilisateur avec `KUBELET_EXTRA_ARGS`
 provient de `/etc/default/kubelet` (pour les  DEBs), ou `/etc/sysconfig/kubelet` (pour les RPMs)
 `KUBELET_EXTRA_ARGS` est le dernier de la chaîne d'options et a la priorité la plus élevée en cas
 de conflit de paramètres.

## Fichiers binaires de Kubernetes et contenu du package

Les packages DEB et RPM fournis avec les versions de Kubernetes sont les suivants:

| Nom du paquet    | Description                                                                                                                                    |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `kubeadm`        | Installe l'outil CLI `/usr/bin/kubeadm` et [le fichier instantané de kubelet](#the-kubelet-drop-in-file-for-systemd) pour la kubelet.          |
| `kubelet`        | Installe `/usr/bin/kubelet`.                                                                                                                   |
| `kubectl`        | Installe `/usr/bin/kubectl`.                                                                                                                   |
| `kubernetes-cni` | Installe les binaires officiels du CNI dans le repertoire `/opt/cni/bin`.                                                                      |
| `cri-tools`      | Installe `/usr/bin/crictl` à partir de [https://github.com/kubernetes-incubator/cri-tools](https://github.com/kubernetes-incubator/cri-tools). |


