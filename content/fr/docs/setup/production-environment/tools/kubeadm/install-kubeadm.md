---
title: Installer kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: Installez l'outil de configuration kubeadm
---

<!-- overview -->

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Cette page vous apprend comment installer la boîte à outils `kubeadm`.
Pour plus d'informations sur la création d'un cluster avec kubeadm, une fois que vous avez effectué ce processus d'installation, voir la page: [Utiliser kubeadm pour créer un cluster](/fr/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).



## {{% heading "prerequisites" %}}


* Une ou plusieurs machines exécutant:
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Flatcar Container Linux (testé avec 2512.3.0)
* 2 Go ou plus de RAM par machine (toute quantité inférieure laissera peu de place à vos applications)
* 2 processeurs ou plus
* Connectivité réseau complète entre toutes les machines du cluster (réseau public ou privé)
* Nom d'hôte, adresse MAC et product_uuid uniques pour chaque nœud. Voir [ici](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) pour plus de détails.
* Certains ports doivent êtres ouverts sur vos machines. Voir [ici](#check-required-ports) pour plus de détails.
* Swap désactivé. Vous **devez** impérativement désactiver le swap pour que la kubelet fonctionne correctement.



<!-- steps -->

## Vérifiez que les adresses MAC et product_uuid sont uniques pour chaque nœud {#verify-mac-address}

* Vous pouvez obtenir l'adresse MAC des interfaces réseau en utilisant la commande `ip link` ou` ifconfig -a`
* Le product_uuid peut être vérifié en utilisant la commande `sudo cat /sys/class/dmi/id/product_uuid`

Il est très probable que les périphériques matériels aient des adresses uniques, bien que
certaines machines virtuelles puissent avoir des valeurs identiques. Kubernetes utilise ces valeurs pour identifier de manière unique les nœuds du cluster.
Si ces valeurs ne sont pas uniques à chaque nœud, le processus d'installation
peut [échouer](https://github.com/kubernetes/kubeadm/issues/31).

## Vérifiez les cartes réseaux

Si vous avez plusieurs cartes réseaux et que vos composants Kubernetes ne sont pas accessibles par la route par défaut,
nous vous recommandons d’ajouter une ou plusieurs routes IP afin que les adresses de cluster Kubernetes soient acheminées via la carte approprié.

## Permettre à iptables de voir le trafic ponté

Assurez-vous que le module `br_netfilter` est chargé. Cela peut être fait en exécutant `lsmod | grep br_netfilter`. Pour le charger explicitement, appelez `sudo modprobe br_netfilter`.

Pour que les iptables de votre nœud Linux voient correctement le trafic ponté, vous devez vous assurer que `net.bridge.bridge-nf-call-iptables` est défini sur 1 dans votre configuration` sysctl`, par ex.

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

Pour plus de détails, veuillez consulter la page [Configuration requise pour le plug-in réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements).

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

Le plug-in de réseau de pod que vous utilisez (voir ci-dessous) peut également nécessiter certains ports à ouvrir.
Étant donné que cela diffère d’un plugin à l’autre, veuillez vous reporter à la
documentation des plugins sur le(s) port(s) requis(s).

## Installation du runtime {#installing-runtime}

Pour exécuter des conteneurs dans des pods, Kubernetes utilise un 
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.

{{< tabs name="container_runtime" >}}
{{% tab name="Linux nodes" %}}

Par défaut, Kubernetes utilise le
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
pour s'interfacer avec votre environnement d'exécution de conteneur choisi.

Si vous ne spécifiez pas de runtime, kubeadm essaie automatiquement de détecter un
Runtime de conteneur en parcourant une liste de sockets de domaine Unix bien connus.
Le tableau suivant répertorie les environnements d'exécution des conteneurs et leurs chemins de socket associés:

{{< table caption = "Les environnements d'exécution des conteneurs et leurs chemins de socket" >}}
| Runtime    | Chemin vers le socket de domaine Unix |
|------------|---------------------------------------|
| Docker     | `/var/run/docker.sock`                |
| containerd | `/run/containerd/containerd.sock`     |
| CRI-O      | `/var/run/crio/crio.sock`             |
{{< /table >}}

<br />
Si Docker et containerd sont détectés, Docker est prioritaire. C'est
nécessaire car Docker 18.09 est livré avec containerd et les deux sont détectables même si vous
installez Docker.
Si deux autres environnements d'exécution ou plus sont détectés, kubeadm se ferme avec une erreur.

Le kubelet s'intègre à Docker via l'implémentation CRI intégrée de `dockershim`.

Voir [runtimes de conteneur](/docs/setup/production-environment/container-runtimes/)
pour plus d'informations.
{{% /tab %}}
{{% tab name="autres systèmes d'exploitation" %}}
Par défaut, kubeadm utilise {{< glossary_tooltip term_id="docker" >}} comme environnement d'exécution du conteneur.
Le kubelet s'intègre à Docker via l'implémentation CRI intégrée de `dockershim`.

Voir [runtimes de conteneur](/docs/setup/production-environment/container-runtimes/)
pour plus d'informations.
{{% /tab %}}
{{< /tabs >}}


## Installation de kubeadm, des kubelets et de kubectl

Vous installerez ces paquets sur toutes vos machines:

* `kubeadm`: la commande pour initialiser le cluster.

* la `kubelet`: le composant qui s'exécute sur toutes les machines de votre cluster et fait des actions
 comme le démarrage des pods et des conteneurs.

* `kubectl`: la ligne de commande utilisée pour parler à votre cluster.

kubeadm **n'installera pas** ni ne gèrera les `kubelet` ou` kubectl` pour vous.
Vous devez vous assurer qu'ils correspondent à la version du control plane de Kubernetes que vous souhaitez que kubeadm installe pour vous. Si vous ne le faites pas, vous risquez qu'une
erreur de version se produise, qui pourrait conduire à un comportement inattendu.
Cependant, une version mineure entre les kubelets et le control plane est pris en charge,
mais la version de la kubelet ne doit jamais dépasser la version de l'API server.
Par exemple, les kubelets exécutant la version 1.7.0 devraient être entièrement compatibles avec un API server en 1.8.0,
mais pas l'inverse.

For information about installing `kubectl`, see [Installation et configuration kubectl](/fr/docs/tasks/tools/install-kubectl/).

{{< warning >}}
Ces instructions excluent tous les packages Kubernetes de toutes les mises à niveau du système d'exploitation.
C’est parce que kubeadm et Kubernetes ont besoin d'une
[attention particulière lors de la mise à niveau](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/).
{{</ warning >}}

Pour plus d'informations sur les compatibilités de version, voir:

* Kubernetes [version et politique de compatibilité de version](/docs/setup/version-skew-policy/)
* Kubeadm-specific [politique de compatibilité de version](/fr/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# Mettre SELinux en mode permissif (le désactiver efficacement)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

  **Note:**

  - Mettre SELinux en mode permissif en lançant `setenforce 0` et `sed ... `le désactive efficacement.
  C'est nécessaire pour permettre aux conteneurs d'accéder au système de fichiers hôte, qui est nécessaire par exemple pour les réseaux de pod.
    Vous devez le faire jusqu'à ce que le support de SELinux soit amélioré dans Kubelet.

  - Vous pouvez laisser SELinux activé si vous savez comment le configurer, mais il peut nécessiter des paramètres qui ne sont pas pris en charge par kubeadm.

{{% /tab %}}
{{% tab name="Fedora CoreOS ou Flatcar Container Linux" %}}
Installez les plugins CNI (requis pour la plupart des réseaux de pods) :

```bash
CNI_VERSION="v0.8.2"
sudo mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | sudo tar -C /opt/cni/bin -xz
```

Définissez le répertoire pour télécharger les fichiers de commande

{{< note >}}
La variable DOWNLOAD_DIR doit être définie sur un répertoire accessible en écriture.
Si vous exécutez Flatcar Container Linux, définissez DOWNLOAD_DIR=/opt/bin
{{< /note >}}

```bash
DOWNLOAD_DIR=/usr/local/bin
sudo mkdir -p $DOWNLOAD_DIR
```

Installez crictl (requis pour Kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.17.0"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Installez `kubeadm`,` kubelet`, `kubectl` et ajoutez un service systemd` kubelet`:

RELEASE_VERSION="v0.6.0"

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Activez et démarrez `kubelet` :

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
La distribution Linux Flatcar Container monte le répertoire `/usr` comme un système de fichiers en lecture seule.
Avant de démarrer votre cluster, vous devez effectuer des étapes supplémentaires pour configurer un répertoire accessible en écriture.
Consultez le [Guide de dépannage de Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/) pour savoir comment configurer un répertoire accessible en écriture.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}


Kubelet redémarre maintenant toutes les quelques secondes,
car il attend les instructions de kubeadm dans une boucle de crash.

## Configurer le driver de cgroup utilisé par la kubelet sur un nœud master

Lorsque vous utilisez Docker, kubeadm détecte automatiquement le pilote ( driver ) de cgroup pour kubelet
et le configure dans le fichier `/var/lib/kubelet/config.yaml` lors de son éxecution.

Si vous utilisez un autre CRI, vous devez passer votre valeur `cgroupDriver` avec `kubeadm init`, comme ceci :

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: <value>
```

Pour plus de détails, veuillez lire [Utilisation de kubeadm init avec un fichier de configuration](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Veuillez noter que vous devez **seulement** le faire si le driver de cgroupe de votre CRI
n'est pas `cgroupfs`, car c'est déjà la valeur par défaut dans la kubelet.

{{< note >}}
Depuis que le paramètre `--cgroup-driver` est obsolète par kubelet, si vous l'avez dans`/var/lib/kubelet/kubeadm-flags.env`
ou `/etc/default/kubelet`(`/etc/sysconfig/kubelet` pour les RPM), veuillez le supprimer et utiliser à la place KubeletConfiguration
(stocké dans`/var/lib/kubelet/config.yaml` par défaut).
{{< /note >}}

Il est nécessaire de redémarrer la kubelet:

```bash
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

La détection automatique du pilote cgroup pour d'autres runtimes de conteneur
comme CRI-O et containerd est un travail en cours.


## Dépannage

Si vous rencontrez des difficultés avec kubeadm, veuillez consulter notre [documentation de dépannage](/fr/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}


* [Utiliser kubeadm pour créer un cluster](/fr/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
