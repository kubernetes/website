---
title: Installer kubeadm
description: kubeadm installation Kubernetes
content_template: templates/task
weight: 20
---

{{% capture overview %}}

<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">Cette page vous
apprend comment installer la boîte à outils `kubeadm`.
Pour plus d'informations sur la création d'un cluster avec kubeadm, une fois que vous avez 
effectué ce processus d'installation, voir la page: [Utiliser kubeadm pour créer un cluster](/docs/setup/independent/create-cluster-kubeadm/).

{{% /capture %}}

{{% capture prerequisites %}}

* Une ou plusieurs machines exécutant:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (best-effort)
  - HypriotOS v1.0.1+
  - Container Linux (testé avec 1800.6.0)
* 2 Go ou plus de RAM par machine (toute quantité inférieure laissera peu de place à vos applications)
* 2 processeurs ou plus
* Connectivité réseau complète entre toutes les machines du cluster (réseau public ou privé)
* Nom d'hôte, adresse MAC et product_uuid uniques pour chaque nœud. Voir [ici](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) pour plus de détails.
* Certains ports doivent êtres ouverts sur vos machines. Voir [ici](#check-required-ports) pour plus de détails.
* Swap désactivé. Vous devez impérativement désactiver le swap pour que la kubelet fonctionne correctement.

{{% /capture %}}

{{% capture steps %}}

## Vérifiez que les adresses MAC et product_uuid sont uniques pour chaque nœud {#verify-the-mac-address-and-product-uuid-are-unique-for-every-node}

* Vous pouvez obtenir l'adresse MAC des interfaces réseau en utilisant la commande `ip link` ou` ifconfig -a`
* Le product_uuid peut être vérifié en utilisant la commande `sudo cat/sys/class/dmi/id/product_uuid`

Il est très probable que les périphériques matériels aient des adresses uniques, bien que 
certaines machines virtuelles puissent avoir des valeurs identiques. Kubernetes utilise 
ces valeurs pour identifier de manière unique les nœuds du cluster.
Si ces valeurs ne sont pas uniques à chaque nœud, le processus d'installation
peut [échouer](https://github.com/kubernetes/kubeadm/issues/31).

## Vérifiez les cartes réseaux

Si vous avez plusieurs cartes réseaux et que vos composants Kubernetes ne sont pas accessibles par la
route par défaut, nous vous recommandons d’ajouter une ou plusieurs routes IP afin que les adresses 
de cluster Kubernetes soient acheminées via la carte approprié.

## Vérifiez les ports requis {#check-required-ports}

### nœuds maîtres (masters)

| Protocole | Direction | Plage de Port | Utilisé pour            | Utilisé par             |
|-----------|-----------|---------------|-------------------------|-------------------------|
| TCP       | Entrant   | 6443*         | Kubernetes API server   | Tous                    |
| TCP       | Entrant   | 2379-2380     | Etcd server client API  | kube-apiserver, etcd    |
| TCP       | Entrant   | 10250         | Kubelet API             | Lui-même, Control plane |
| TCP       | Entrant   | 10251         | kube-scheduler          | Lui-même                |
| TCP       | Entrant   | 10252         | kube-controller-manager | Lui-même                |

### nœuds workers

| Protocole | Direction | Plage de Port | Utilisé pour        | Utilisé par             |
|-----------|-----------|---------------|---------------------|-------------------------|
| TCP       | Entrant   | 10250         | Kubelet API         | Lui-même, Control plane |
| TCP       | Entrant   | 30000-32767   | NodePort Services** | Eux-mêmes               |

** Plage de ports par défaut pour les [Services NodePort](/docs/concepts/services-networking/service/).

Tous les numéros de port marqués d'un * sont écrasables. Vous devrez donc vous assurer que
les ports personnalisés que vous utilisez sont également ouverts.

Bien que les ports etcd soient inclus dans les nœuds masters, vous pouvez également héberger 
votre propre cluster etcd en externe ou sur des ports personnalisés.

Le plug-in de réseau de pod que vous utilisez (voir ci-dessous) peut également nécessiter certains ports à ouvrir. Étant donné que cela diffère d’un plugin à l’autre, veuillez vous reporter à la
documentation des plugins sur le(s) port(s) requis(s).

## Installing runtime

Depuis la version 1.6.0, Kubernetes a activé l'utilisation de la CRI, Container Runtime Interface, par défaut.
Le moteur de runtime de conteneur utilisé par défaut est Docker, activé par le biais de la l'implémentation CRI `dockershim` intégrée à l'interieur de la `kubelet`.

Les autres runtimes basés sur la CRI incluent:

- [containerd](https://github.com/containerd/cri) (plugin CRI construit dans containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)

Reportez-vous aux [instructions d'installation de la CRI](/docs/setup/cri) pour plus d'informations.

## Installation de kubeadm, des kubelets et de kubectl

Vous installerez ces paquets sur toutes vos machines:

* `kubeadm`: la commande pour initialiser le cluster.

* la `kubelet`: le composant qui s'exécute sur toutes les machines de votre cluster et fait des actions
 comme le démarrage des pods et des conteneurs.

* `kubectl`: la ligne de commande utilisée pour parler à votre cluster.

kubeadm **n'installera pas** ni ne gèrera les `kubelet` ou` kubectl` pour vous.
Vous devez vous assurer qu'ils correspondent à la version du control plane de Kubernetes que vous
 souhaitez que kubeadm installe pour vous. Si vous ne le faites pas, vous risquez qu'
 une erreur de version se produise, qui pourrait conduire à un comportement inattendu. 
 Cependant, une version mineure entre les kubelets et le control plane est pris en charge, 
 mais la version de la kubelet ne doit jamais dépasser la version de l'API server. Par exemple, 
 les kubelets exécutant la version 1.7.0 devraient être entièrement compatibles avec un API 
 server en 1.8.0, mais pas l'inverse.

{{< warning >}}
Ces instructions excluent tous les packages Kubernetes de toutes les mises à niveau du système
d'exploitation.
C’est parce que kubeadm et Kubernetes ont besoin d'une 
[attention particulière lors de la mise à niveau](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/).
{{</ warning >}}

Pour plus d'informations sur les compatibilités de version, voir:

* Kubernetes [version et politique de compatibilité de version](/docs/setup/version-skew-policy/)
* Kubeadm-specific [politique de compatibilité de version](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```bash
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# Mettre SELinux en mode permissif (le désactiver efficacement)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **Note:**

  - Mettre SELinux en mode permissif en lançant `setenforce 0` et `sed ... `le désactive efficacement. 
  C'est nécessaire pour permettre aux conteneurs d'accéder au système de fichiers hôte, qui 
  est nécessaire par exemple pour les réseaux de pod.
    Vous devez le faire jusqu'à ce que le support de SELinux soit amélioré dans la kubelet.
  - Certains utilisateurs de RHEL / CentOS 7 ont signalé des problèmes de routage incorrect 
  du trafic en raison du contournement d'iptables. Vous devez vous assurer que
    `net.bridge.bridge-nf-call-iptables` est configuré à 1 dans votre config `sysctl` par exemple:

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - Assurez-vous que le module `br_netfilter` est chargé avant cette étape. Cela peut être fait en exécutant `lsmod | grep br_netfilter`. Pour le charger explicitement, lancez `modprobe br_netfilter`.
{{% /tab %}}
{{% tab name="Container Linux" %}}
Installez les plugins CNI (requis pour la plupart des réseaux de pod):

```bash
CNI_VERSION="v0.6.0"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Installez crictl (obligatoire pour kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.11.1"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-incubator/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

Installez `kubeadm`, `kubelet`, `kubectl` et ajouter un service systemd `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Activez et démarrez la `kubelet`:

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


La kubelet redémarre maintenant toutes les secondes et quelques, car elle attend dans une boucle
kubeadm, pour lui dire quoi faire.

## Configurer le driver de cgroup utilisé par la kubelet sur un nœud master

Lorsque vous utilisez Docker, kubeadm détecte automatiquement le pilote ( driver ) de cgroup pour la kubelet
et le configure dans le fichier `/var/lib/kubelet/kubeadm-flags.env` lors de son éxecution.

Si vous utilisez un autre CRI, vous devez modifier le fichier `/etc/default/kubelet` avec votre 
valeur de `cgroup-driver` comme ceci:

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

Ce fichier sera utilisé par `kubeadm init` et` kubeadm join` pour sourcer des arguments supplémentaires définis par l'utilisateur pour la kubelet.

Veuillez noter que vous devez **seulement** le faire si le driver de cgroupe de votre CRI
n'est pas `cgroupfs`, car c'est déjà la valeur par défaut dans la kubelet.

Il est nécessaire de redémarrer la kubelet:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

## Dépannage

Si vous rencontrez des difficultés avec kubeadm, veuillez consulter notre [documentation de dépannage](/docs/setup/independent/troubleshooting-kubeadm/).

{{% capture whatsnext %}}

* [Utiliser kubeadm pour créer un cluster](/docs/setup/independent/create-cluster-kubeadm/)

{{% /capture %}}
