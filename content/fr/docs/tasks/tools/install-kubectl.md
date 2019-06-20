---
reviewers:
- remyleone
- rbenzair
title: Installer et configurer kubectl
description: Installation et configuration de kubectl
content_template: templates/task
weight: 10
card:
  name: tasks
  weight: 20
  title: Installer kubectl
---

{{% capture overview %}}
L'outil en ligne de commande de kubernetes, [kubectl](/docs/user-guide/kubectl/), vous permet d'exécuter des commandes dans les clusters Kubernetes. Vous pouvez utiliser kubectl pour déployer des applications, inspecter et gérer les ressources du cluster et consulter les logs. Pour une liste complète des opérations kubectl, voir [Aperçu de kubectl](/fr/docs/reference/kubectl/overview/).
{{% /capture %}}

{{% capture prerequisites %}}
Vous devez utiliser une version de kubectl qui différe seulement d'une version mineure de la version de votre cluster. Par exemple, un client v1.2 doit fonctionner avec un master v1.1, v1.2 et v1.3. L'utilisation de la dernière version de kubectl permet d'éviter des problèmes imprévus.
{{% /capture %}}

{{% capture steps %}}

## Installer kubectl sur Linux

### Installer le binaire de kubectl avec curl sur Linux

1. Téléchargez la dernière release avec la commande :

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    ```

    Pour télécharger une version spécifique, remplacez `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` avec la version spécifique.

    Par exemple, pour télécharger la version {{< param "fullversion" >}} sur Linux, tapez :
    
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Rendez le binaire kubectl exécutable.

    ```
    chmod +x ./kubectl
    ```

3. Déplacez le binaire dans votre PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

### Installation à l'aide des gestionnaires des paquets natifs

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}
    
    
### Installer avec snap

Si vous êtes sur Ubuntu ou une autre distribution Linux qui supporte le gestionnaire de paquets [snap](https://snapcraft.io/docs/core/install), kubectl est disponible comme application [snap](https://snapcraft.io/).

1. Passez à l'utilisateur snap et exécutez la commande d'installation :

    ```
    sudo snap install kubectl --classic
    ```

2. Testez pour vous assurer que la version que vous avez installée est à jour :

    ```
    kubectl version
    ```
    
## Installer kubectl sur macOS

### Installer le binaire kubectl avec curl sur macOS

1. Téléchargez la dernière release:

    ```		 
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl
    ```

    Pour télécharger une version spécifique, remplacez `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` avec la version spécifique.

    Par exemple, pour télécharger la version {{< param "fullversion" >}} sur macOS, tapez :
		  
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. Rendrez le binaire kubectl exécutable.

    ```
    chmod +x ./kubectl
    ```

3. Déplacez le binaire dans votre PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

### Installer avec Homebrew sur macOS

Si vous êtes sur MacOS et que vous utilisez le gestionnaire de paquets [Homebrew](https://brew.sh/), vous pouvez installer kubectl avec Homebrew.

1. Exécutez la commande d'installation:

    ```
    brew install kubernetes-cli
    ```

2. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

### Installer avec Macports sur macOS

Si vous êtes sur MacOS et que vous utilisez le gestionnaire de paquets [Macports](https://macports.org/), vous pouvez installer kubectl avec Macports.

1. Exécuter la commande d'installation:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

## Installer kubectl sur Windows

### Installer le binaire kubectl avec curl sur Windows

1. Téléchargez la dernière release {{< param "fullversion" >}} depuis [ce lien](https://storage.googleapis.com/kubernetes-release/release/{{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    Ou si vous avez `curl` installé, utilisez cette commande:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    Pour connaître la dernière version stable (par exemple, en scripting), jetez un coup d'oeil à [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Ajoutez le binaire dans votre PATH.
3. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

### Installer avec Powershell de PSGallery

Si vous êtes sous Windows et que vous utilisez le gestionnaire de paquets [Powershell Gallery](https://www.powershellgallery.com/) , vous pouvez installer et mettre à jour kubectl avec Powershell.

1. Exécutez les commandes d'installation (spécifier le `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}}Si vous ne spécifiez pas un `DownloadLocation`, `kubectl` sera installé dans le répertoire temp de l'utilisateur.{{< /note >}}
    
    Le programme d'installation creé `$HOME/.kube` qui est suivie par la création d'un fichier de configuration

2. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

    {{< note >}}La mise à jour de l'installation s'effectue en réexécutant les deux commandes listées à l'étape 1.{{< /note >}}

### Installer sur Windows avec Chocolatey ou Scoop

Pour installer kubectl sur Windows, vous pouvez utiliser le gestionnaire de paquets [Chocolatey](https://chocolatey.org) ou l'installateur en ligne de commande [Scoop](https://scoop.sh).
{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
2. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

3. Accédez à votre répertoire personnel:

    ```
    cd %USERPROFILE%
    ```
4. Créez le répertoire `.kube`:

    ```
    mkdir .kube
    ```

5. Allez dans le répertoire `.kube` que vous venez de créer:

    ```
    cd .kube
    ```

6. Configurez kubectl pour utiliser un remote cluster Kubernetes:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Editez le fichier de configuration avec un éditeur de texte de votre choix, tel que Notepad.{{< /note >}}

## Télécharger en tant qu'élément du SDK Google Cloud

Vous pouvez installer kubectl en tant qu'élément du SDK Google Cloud.

1. Installer [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Exécutez la commande d'installation `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
3. Testez pour vous assurer que la version que vous avez installée est à jour:

    ```
    kubectl version
    ```

## Vérification de la configuration de kubectl 

Pour permettre à kubectl de trouver et d'accéder à un cluster Kubernetes, il lui faut un [fichier kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), qui est créé automatiquement lorsque vous créez un cluster avec `kube-up.sh` ou en déployant un cluster Minikube avec succès. Par défaut, la configuration de kubectl est située sous `~/.kube/config`.

Vérifiez que kubectl est correctement configuré en obtenant l'état du cluster:

```shell
kubectl cluster-info
```
Si vous voyez une réponse avec une URL, kubectl est correctement configuré pour accéder à votre cluster.

Si vous voyez un message similaire à celui qui suit, kubectl n'est pas configuré correctement ou n'est pas capable de se connecter à un cluster Kubernetes.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Si par exemple, vous avez l'intention d'exécuter un cluster Kubernetes sur votre machine (localement), vous aurez besoin d'un outil comme Minikube pour être installé en premier et exécuter à nouveau les commandes décrites ci-dessus.

Si kubectl cluster-info retourne la réponse en url mais que vous ne pouvez pas accéder à votre cluster, vous pouvez vérifier s'il est configuré correctement, en utilisant:

```shell
kubectl cluster-info dump
```

## Configurations kubectl optionnelles

### Activation de l'auto-complétion de shell

kubectl fournit un support d'auto-complétion pour Bash et Zsh, ce qui peut vous éviter beaucoup de temps de saisie.

Vous trouverez ci-dessous les étapes à suivre pour configurer l'auto-complétion pour Bash (y compris la différence entre Linux et MacOS) et Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash on Linux" %}}

### Introduction

Le script de complétion kubectl pour Bash peut être généré avec la commande `kubectl completion bash`. Sourcer le script de completion dans votre shell permet l'auto-complétion de kubectl.

En revanche, le script de complétion dépend de [**bash-completion**](https://github.com/scop/bash-completion), ce qui implique que vous devez d'abord installer ce logiciel (vous pouvez tester si vous avez déjà installé bash-completion en utilisant `type _init_completion`).

### Installer bash-completion

bash-completion est fourni par plusieurs gestionnaires de paquets (voir [ici](https://github.com/scop/bash-completion#installation)). Vous pouvez l'installer avec `apt-get install bash-completion` or `yum install bash-completion`, etc.

Les commandes ci-dessus créent `/usr/share/bash-completion/bash_completion`, qui est le script principal de bash-completion. En fonction de votre gestionnaire de paquets, vous devez manuellement sourcer ce fichier dans votre `~/.bashrc`.

Il vous suffit de recharger votre shell et de lancer `type _init_completion`. Si la commande réussit, vous êtes déjà configuré, sinon ajoutez le suivant à votre fichier `~/.bashrc' :

```shell
source /usr/share/bash-completion/bash_completion
```

Rechargez votre shell et vérifiez que bash-completion est correctement installé en tapant `type _init_completion`.

### Activer l'auto-complétion de kubectl

Vous devez maintenant vérifier que le script de completion de kubectl est bien sourcé dans toutes vos sessions shell. Il y a deux façons de le faire:

- Sourcer le script de completion dans votre fichier `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Ajoutez le script de complétion dans le répertoire `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

{{< note >}}
bash-completion source tous les scripts de completion dans `/etc/bash_completion.d`.
{{< /note >}}

Les deux approches sont équivalentes. Après avoir rechargé votre shell, l'auto-complétion de kubectl devrait fonctionner.

{{% /tab %}}


{{% tab name="Bash on macOS" %}}

{{< warning>}}
macOS inclut Bash 3.2 par défaut. Le script de complétion kubectl nécessite Bash 4.1+ et ne fonctionne pas avec Bash 3.2. Une des solutions possibles est d'installer une version plus récente de Bash sous macOS (voir instructions [ici](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Les instructions ci-dessous ne fonctionnent que si vous utilisez Bash 4.1+.
{{< /warning >}}

### Introduction

Le script de complétion kubectl pour Bash peut être généré avec la commande `kubectl completion bash`. Sourcer le script de completion dans votre shell permet l'auto-complétion de kubectl.

En revanche, le script de complétion dépend de [**bash-completion**](https://github.com/scop/bash-completion), ce qui implique que vous devez d'abord installer ce logiciel (vous pouvez tester si vous avez déjà installé bash-completion en utilisant `type _init_completion`).

### Installer bash-completion

Vous pouvez installer bash-completion avec Homebrew:

```shell
brew install bash-completion
```

Comme indiqué dans la sortie de `brew install` (section "Caveats"), ajoutez les lignes suivantes à votre fichier `~/.bashrc` ou `~/.bash_profile` :

```shell
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
```

Rechargez votre shell.

### Activer l'auto-complétion de kubectl

Si vous avez installé kubectl avec Homebrew (comme expliqué [ici](#installer-avec-homebrew-sur-macos)), alors le script de complétion a été automatiquement installé dans `/usr/local/etc/bash_completion.d/kubectl`. Dans ce cas, vous n'avez rien à faire.

Si vous n'avez pas installé via Homebrew, vous devez maintenant vous assurer que le script de complétion kubectl est bien sourcé dans toutes vos sessions shell comme suit:

- Ajoutez le script de complétion dans le répertoire `/usr/local/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```


{{< note >}}
bash-completion (en cas d'installation avec Homebrew) source tous les scripts de complétion dans le répertoire.
{{< /note >}}

Après avoir rechargé votre shell, l'auto-complétion de kubectl devrait fonctionner.
{{% /tab %}}

{{% tab name="Zsh" %}}

Le script de complétion de kubectl pour Zsh peut être généré avec la commande `kubectl completion zsh`. Sourcer le script de completion dans votre shell permet l'auto-complétion de kubectl.

Pour faire ainsi dans toutes vos sessions shell, ajoutez ce qui suit à votre fichier `~/.zshrc`:

```shell
source <(kubectl completion zsh)
```

Après avoir rechargé votre shell, l'auto-complétion de kubectl devrait fonctionner.

Si vous rencontrez une erreur comme `complete:13: command not found: compdef`, alors ajoutez ce qui suit au début de votre fichier `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [Installer Minikube](/docs/tasks/tools/install-minikube/)
* Voir les [guides de démarrage](/fr/docs/setup/) pour plus d'informations sur la création de clusters. 
* [Apprenez comment lancer et exposer votre application](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Si vous avez besoin d'accéder à un cluster que vous n'avez pas créé, consultez [Partager l'accès du Cluster](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Consulter les [documents de référence de kubectl](/fr/docs/reference/kubectl/kubectl/)
{{% /capture %}}