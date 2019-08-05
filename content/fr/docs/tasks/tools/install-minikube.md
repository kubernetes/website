---
title: Installer Minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

Cette page vous montre comment installer [Minikube](/fr/docs/tutorials/hello-minikube/), qui est un outil qui fait tourner un cluster Kubernetes à un noeud unique dans une machine virtuelle sur votre machine.

{{% /capture %}}

{{% capture prerequisites %}}

La virtualisation VT-x ou AMD-v doit être activée dans le BIOS de votre machine. 

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Pour vérifier si la virtualisation est prise en charge sur Linux, exécutez la commande suivante et vérifiez que la sortie n'est pas vide:
```
egrep --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}
{{% tab name="macOS" %}}
Pour vérifier si la virtualisation est prise en charge sur macOS, exécutez la commande suivante sur votre terminal.
```
sysctl -a | grep machdep.cpu.features
```
Si vous trouvez `VMX` dans la sortie, la fonction VT-x est supportée sur votre OS.
{{% /tab %}}
{{% tab name="Windows" %}}
Pour vérifier si la virtualisation est prise en charge sur Windows 8 et au-delà, exécutez la commande suivante sur votre terminal Windows ou à l'invite de commande. 
```
systeminfo
```
Si vous obtenez la sortie suivant, la virtualisation est prise en charge sur Windows.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

## Installer un hyperviseur

Si vous n'avez pas déjà un hyperviseur installé, installez-le maintenant pour votre système d'exploitation:

Système d'exploitation | Hyperviseurs supportés
:----------------|:---------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube supporte également une option `--vm-driver=none` qui exécute les composants Kubernetes sur la machine hôte et non dans une VM. L'utilisation de ce pilote nécessite Docker et un environnement Linux mais pas un hyperviseur.
{{< /note >}}

## Installer kubectl

* Installez kubectl en suivant les instructions de la section [Installer et configurer kubectl](/fr/docs/tasks/tools/install-kubectl/).

## Installer Minikube

### macOS

La façon la plus simple d'installer Minikube sur macOS est d'utiliser [Homebrew](https://brew.sh):

```shell
brew cask install minikube
```

Vous pouvez aussi l'installer sur macOS en téléchargeant un binaire statique:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Voici une façon simple d'ajouter l'exécutable de Minikube à votre path:

```shell
sudo mv minikube /usr/local/bin
```

### Linux

{{< note >}}
Ce document vous montre comment installer Minikube sur Linux en utilisant un binaire statique.
{{< /note >}}

Vous pouvez installer Minikube sur Linux en téléchargeant un binaire statique:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Voici une façon simple d'ajouter l'exécutable de Minikube à votre path:

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Windows

{{< note >}}
Pour exécuter Minikube sur Windows, vous devez d'abord installer [VirtualBox](https://www.virtualbox.org/) ou [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). Hyper-V peut être utilisé avec trois versions de Windows 10 : Windows 10 Enterprise, Windows 10 Professional et Windows 10 Education. Voir le dépôt GitHub officiel de Minikube pour plus [d'informations sur l'installation](https://github.com/kubernetes/minikube/#installation).
{{< /note >}}

La façon la plus simple d'installer Minikube sur Windows est d'utiliser [Chocolatey](https://chocolatey.org/) (exécuté avec les droits administrateur) :

```shell
choco install minikube kubernetes-cli
```

Une fois l'installation de Minikube terminée, fermez la session CLI en cours et redémarrez. Minikube devrait avoir été ajouté à votre path automatiquement.

#### Installation manuelle de Windows

Pour installer Minikube manuellement sur Windows, téléchargez [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), renommez-le en `minikube.exe`, et ajoutez-le à votre path.

#### Windows Installer

Pour installer manuellement Minikube sur Windows à l'aide de [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), téléchargez [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest) et exécutez l'Installer.

{{% /capture %}}

{{% capture whatsnext %}}

* [Exécutez Kubernetes localement via Minikube](/docs/setup/minikube/)

{{% /capture %}}

## Tout nettoyer pour recommencer à zéro

Si vous avez déjà installé minikube, exécutez:
```shell
minikube start
```

Si cette commande renvoie une erreur:
```shell
machine does not exist
```

Vous devez supprimer les fichiers de configuration:
```shell
rm -rf ~/.minikube
```
