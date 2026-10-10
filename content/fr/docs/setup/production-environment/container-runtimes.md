---
reviewers:
- vincepri
- bart0sh
title: Runtimes de conteneurs
content_type: concept
weight: 20
---
<!-- aperçu -->

{{% dockershim-removal %}}

Vous devez installer un
{{< glossary_tooltip text="runtime de conteneur" term_id="container-runtime" >}}
sur chaque nœud du cluster afin que les Pods puissent y être exécutés. Cette page décrit ce qui est nécessaire et présente les tâches liées à la configuration des nœuds.

Kubernetes {{< skew currentVersion >}} exige l’utilisation d’un runtime conforme à la
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Voir [Support des versions de la CRI](#cri-versions) pour plus d’informations.

Cette page donne un aperçu de l’utilisation de plusieurs runtimes de conteneurs courants avec Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Les versions de Kubernetes antérieures à la v1.24 incluaient une intégration directe avec Docker Engine,
via un composant nommé _dockershim_. Cette intégration directe ne fait plus
partie de Kubernetes (cette suppression a été
[annoncée](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
lors de la version v1.20).

Vous pouvez lire
[Vérifier si la suppression de Dockershim vous affecte](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
pour comprendre si cette suppression vous concerne. Pour apprendre à migrer depuis dockershim, voir
[Migrer depuis dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Si vous utilisez une version de Kubernetes différente de v{{< skew currentVersion >}},
consultez la documentation correspondant à cette version.
{{< /note >}}

<!-- corps -->
## Installer et configurer les prérequis

### Configuration réseau

Par défaut, le noyau Linux n’autorise pas le routage des paquets IPv4
entre les interfaces. La plupart des implémentations réseau des clusters Kubernetes
modifient ce paramètre (si nécessaire), mais certaines peuvent exiger que
l’administrateur le fasse lui-même. (Certaines peuvent aussi exiger d’autres
paramètres sysctl, le chargement de modules du noyau, etc. Consultez la
documentation de votre solution réseau spécifique.)

### Activer le transfert de paquets IPv4 {#prerequisite-ipv4-forwarding-optional}

Pour activer manuellement le transfert IPv4 :

```bash
# paramètres sysctl requis par la configuration, persistants après redémarrage
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# appliquer les paramètres sysctl sans redémarrer
sudo sysctl --system
```

Vérifiez que `net.ipv4.ip_forward` est défini sur 1 avec :

```bash
sysctl net.ipv4.ip_forward
```

## Pilotes de cgroup

Sous Linux, les {{< glossary_tooltip text="groupes de contrôle" term_id="cgroup" >}}
sont utilisés pour limiter les ressources allouées aux processus.

Le {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} et le
runtime de conteneur sous-jacent doivent tous deux interagir avec les cgroups afin d’appliquer la
[gestion des ressources pour les pods et les conteneurs](/docs/concepts/configuration/manage-resources-containers/)
et de définir des ressources telles que les demandes (requests) et limites (limits) CPU/mémoire.  
Pour interagir avec les cgroups, le kubelet et le runtime de conteneur doivent utiliser un *pilote de cgroup*.
Il est essentiel que le kubelet et le runtime de conteneur utilisent le même pilote de cgroup
et soient configurés de la même manière.

Deux pilotes de cgroup sont disponibles :

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### Pilote cgroupfs {#cgroupfs-cgroup-driver}

Le pilote `cgroupfs` est le [pilote de cgroup par défaut du kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
Lorsque le pilote `cgroupfs` est utilisé, le kubelet et le runtime de conteneur interagissent directement avec
le système de fichiers cgroup pour configurer les cgroups.

Le pilote `cgroupfs` n’est **pas** recommandé lorsque
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) est le système d’initialisation (init system),
car systemd s’attend à ce qu’un seul gestionnaire de cgroups soit utilisé sur le système.  
De plus, si vous utilisez [cgroup v2](/docs/concepts/architecture/cgroups), il est recommandé d’utiliser le pilote `systemd`
plutôt que `cgroupfs`.

### Pilote systemd cgroup {#systemd-cgroup-driver}

Lorsque [systemd](https://www.freedesktop.org/wiki/Software/systemd/) est utilisé comme système d’initialisation
d’une distribution Linux, le processus init crée et utilise un cgroup racine
(`cgroup`) et agit comme gestionnaire de cgroups.

systemd a une intégration étroite avec les cgroups et alloue un cgroup par unité systemd.
Par conséquent, si vous utilisez `systemd` comme système d’initialisation avec le pilote `cgroupfs`,
le système dispose alors de deux gestionnaires de cgroups différents.

Deux gestionnaires de cgroups entraînent deux vues différentes des ressources disponibles et utilisées sur le système.
Dans certains cas, les nœuds configurés avec `cgroupfs` pour le kubelet et le runtime de conteneur,
mais utilisant `systemd` pour les autres processus, peuvent devenir instables en cas de forte pression sur les ressources.

Pour éviter cette instabilité, il est recommandé d’utiliser `systemd` comme pilote de cgroup pour
le kubelet et le runtime de conteneur lorsque systemd est le système d’initialisation choisi.

Pour définir `systemd` comme pilote de cgroup, modifiez l’option
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
`cgroupDriver` et définissez-la sur `systemd`. Par exemple :

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
À partir de la version v1.22 et ultérieure, lors de la création d’un cluster avec kubeadm, si l’utilisateur ne définit pas le champ `cgroupDriver` dans `KubeletConfiguration`, kubeadm utilise par défaut `systemd`.
{{< /note >}}

Si vous configurez `systemd` comme pilote de cgroup pour le kubelet, vous devez également
configurer `systemd` comme pilote de cgroup pour le runtime de conteneur. Consultez
la documentation de votre runtime de conteneur pour les instructions. Par exemple :

* [containerd](#containerd-systemd)
* [CRI-O](#cri-o)

Dans Kubernetes {{< skew currentVersion >}}, avec le
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`KubeletCgroupDriverFromCRI` activé et un runtime de conteneur prenant en charge l’appel CRI `RuntimeConfig`,
le kubelet détecte automatiquement le pilote de cgroup approprié à partir du runtime
et ignore la configuration `cgroupDriver` du kubelet.

Cependant, les anciennes versions des runtimes de conteneurs (en particulier
containerd 1.y et versions inférieures) ne prennent pas en charge l’appel CRI `RuntimeConfig`,
et peuvent ne pas répondre correctement à cette requête. Dans ce cas, le kubelet revient à utiliser
la valeur définie dans son propre paramètre `--cgroup-driver`.

Dans Kubernetes 1.37, ce comportement de repli sera supprimé, et les anciennes versions
de containerd ne fonctionneront pas avec les versions plus récentes du kubelet.

{{< caution >}}
Changer le pilote de cgroup d’un nœud déjà intégré à un cluster est une opération sensible.
Si le kubelet a créé des Pods avec les conventions d’un pilote de cgroup donné, changer le runtime
de conteneur vers un autre pilote peut provoquer des erreurs lors de la recréation du sandbox
de ces Pods existants. Redémarrer le kubelet peut ne pas corriger ces erreurs.

Si vous disposez d’une automatisation adaptée, remplacez le nœud par un autre avec la configuration mise à jour,
ou réinstallez-le via un système automatisé.
{{< /caution >}}

### Migration vers le pilote `systemd` dans les clusters gérés par kubeadm

Si vous souhaitez migrer vers le pilote de cgroup `systemd` dans des clusters kubeadm existants,
suivez la procédure [configuration d’un pilote de cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Support des versions CRI {#cri-versions}

Votre runtime de conteneur doit prendre en charge la version v1 de l’interface CRI.

Kubernetes [à partir de la version v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
fonctionne _uniquement_ avec la version v1 de l’API CRI. Si un runtime de conteneur ne prend pas en charge l’API v1,
le kubelet ne s’enregistrera pas en tant que nœud.

## Runtimes de conteneurs

{{% thirdparty-content %}}

### containerd

Cette section décrit les étapes nécessaires pour utiliser containerd comme runtime CRI.

Pour installer containerd sur votre système, suivez les instructions de
[getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Revenez à cette étape une fois que vous avez créé un fichier de configuration `config.toml` valide.

{{< tabs name="Trouver votre fichier config.toml" >}}
{{% tab name="Linux" %}}
Vous pouvez trouver ce fichier dans le chemin `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Vous pouvez trouver ce fichier dans le chemin `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

Sous Linux, le socket CRI par défaut pour containerd est `/run/containerd/containerd.sock`.
Sous Windows, le point de terminaison CRI par défaut est `npipe://./pipe/containerd-containerd`.

#### Configuration du pilote de cgroup `systemd` {#containerd-systemd}

Pour utiliser le pilote de cgroup `systemd` dans `/etc/containerd/config.toml` avec `runc`,
définissez la configuration suivante en fonction de votre version de containerd

Versions 1.x de Containerd :

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Versions 2.x de Containerd :

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Le pilote de cgroup `systemd` est recommandé si vous utilisez [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Si vous avez installé containerd à partir d’un paquet (par exemple RPM ou `.deb`), il est possible que
le plugin d’intégration CRI soit désactivé par défaut.

Vous devez activer le support CRI pour utiliser containerd avec Kubernetes. Assurez-vous que `cri`
n’est pas inclus dans la liste `disabled_plugins` dans `/etc/containerd/config.toml`.
Si vous modifiez ce fichier, redémarrez également `containerd`.

Si vous observez des boucles de crash des conteneurs après l’installation initiale du cluster ou après
l’installation d’un CNI, la configuration de containerd fournie par le paquet peut contenir des paramètres
incompatibles. Dans ce cas, envisagez de réinitialiser la configuration de containerd avec :

`containerd config default > /etc/containerd/config.toml`

comme indiqué dans [getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics),
puis ajustez les paramètres de configuration mentionnés ci-dessus en conséquence.
{{< /note >}}

Si vous appliquez cette modification, assurez-vous de redémarrer containerd :

```shell
sudo systemctl restart containerd
```

Lorsque vous utilisez kubeadm, configurez manuellement le
[pilote de cgroup pour le kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

Dans Kubernetes v1.28, vous pouvez activer la détection automatique du pilote de cgroup en tant que fonctionnalité alpha. Voir [pilote de cgroup systemd](#systemd-cgroup-driver)
pour plus de détails.

#### Remplacement de l’image sandbox (pause) {#override-pause-image-containerd}

Dans votre [configuration containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md), vous pouvez remplacer l’image sandbox en définissant la configuration suivante :

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Vous devrez peut-être aussi redémarrer `containerd` après avoir modifié le fichier de configuration :
`systemctl restart containerd`.

### CRI-O

Cette section contient les étapes nécessaires pour installer CRI-O comme runtime de conteneur.

Pour installer CRI-O, suivez les [instructions d’installation de CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### Pilote de cgroup

CRI-O utilise par défaut le pilote de cgroup `systemd`, ce qui devrait généralement fonctionner correctement.

Pour passer au pilote de cgroup `cgroupfs`, vous pouvez soit modifier le fichier `/etc/crio/crio.conf`, soit ajouter une configuration de type drop-in dans
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, par exemple :

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```
Vous devez également noter le changement de `conmon_cgroup`, qui doit être défini sur la valeur `pod` lorsque vous utilisez CRI-O avec `cgroupfs`. Il est généralement nécessaire de garder
la configuration du pilote de cgroup du kubelet (souvent effectuée via kubeadm) et celle de CRI-O synchronisées.

Dans Kubernetes v1.28, vous pouvez activer la détection automatique du pilote de cgroup comme fonctionnalité alpha. Voir [pilote de cgroup systemd](#systemd-cgroup-driver)
pour plus de détails.

Pour CRI-O, le socket CRI est `/var/run/crio/crio.sock` par défaut.

#### Remplacement de l’image sandbox (pause) {#override-pause-image-cri-o}

Dans votre [configuration CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md), vous pouvez définir la valeur suivante :

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Cette option de configuration prend en charge le rechargement de configuration à chaud pour appliquer ce changement : `systemctl reload crio` ou en envoyant un signal `SIGHUP` au processus `crio`.

### Docker Engine {#docker}

{{< note >}}
Ces instructions supposent que vous utilisez l’adaptateur [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) pour intégrer Docker Engine à Kubernetes.
{{< /note >}}

1. Sur chacun de vos nœuds, installez Docker pour votre distribution Linux comme indiqué dans [Installer Docker Engine](https://docs.docker.com/engine/install/#server).

2. Installez [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), en suivant les instructions de la section d’installation de la documentation.

Pour `cri-dockerd`, le socket CRI est `/run/cri-dockerd.sock` par défaut.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) est un runtime de conteneur disponible commercialement,
anciennement connu sous le nom de Docker Enterprise Edition.

Vous pouvez utiliser Mirantis Container Runtime avec Kubernetes via le composant open source [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), inclus dans MCR.

Pour en savoir plus sur l’installation de Mirantis Container Runtime,
consultez le [guide de déploiement MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Vérifiez l’unité systemd nommée `cri-docker.socket` pour connaître le chemin du socket CRI.

#### Remplacement de l’image sandbox (pause) {#override-pause-image-cri-dockerd-mcr}

L’adaptateur `cri-dockerd` accepte un argument en ligne de commande permettant de spécifier l’image de conteneur utilisée comme conteneur d’infrastructure de Pod (“pause image”).
L’argument à utiliser est `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

En plus d’un runtime de conteneur, votre cluster aura besoin d’un plugin réseau fonctionnel
[plugin réseau](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
