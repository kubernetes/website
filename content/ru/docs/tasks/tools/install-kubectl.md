---
reviewers:
- mikedanese
title: Установка и настройка kubectl
content_template: templates/task
weight: 10
card:
  name: tasks
  weight: 20
  title: Установка kubectl
---

{{% capture overview %}}
[kubectl](/docs/user-guide/kubectl/) - это утилита командной строки для Kubernetes, позволяющая выполнять команды на кластере Kubernetes. kubectl можно использовать для развёртывания приложений, инспектирования и управления ресурсами кластера, а также для просмотра логов. Для ознакомления с полным списком возможностей kubectl, обратитесь к странице [Обзор kubectl](/docs/reference/kubectl/overview/).
{{% /capture %}}

{{% capture prerequisites %}}
Необходимо использовать версию kubectl на одну минорную версию отличающуюся от вашего кластера. Например, клиент с версией v1.2 должен работать с версиями мастера v1.1, v1.2 и v1.3. Использование последней стабильной версии kubectl позволяет избежать непредвиденных проблем.
{{% /capture %}}

{{% capture steps %}}

## Установка kubectl на Linux

### Установка бинарного файла kubectl с использованием curl на Linux

1. Загрузите последний релиз с помощью команды:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    Для установки конкретной версии замените эту часть команды `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` на команду с выбранной версией.

    Например, для установки версии {{< param "fullversion" >}} на Linux введите:
    
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Сделайте бинарный файл kubectl исполняемым.

    ```
    chmod +x ./kubectl
    ```

3. Переместите бинарный файл в PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Выполните команду, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

### Установка с использованием нативного менеджера пакетов

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian или HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL или Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
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

### Установка с использованием других менеджеров пакетов

Если вы используете Ubuntu или другой дистрибутив Linux, поддерживающий пакетный менеджер [snap](https://snapcraft.io/docs/core/install), kubectl доступен в виде приложения [snap](https://snapcraft.io/).

Если вы пользователь Linux и используете пакетный менеджер [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), kubectl доступен для [установки](https://docs.brew.sh/Homebrew-on-Linux#install).

{{< tabs name="other_kubectl_install" >}}
{{< tab name="Snap" codelang="bash" >}}
sudo snap install kubectl --classic

kubectl version
{{< /tab >}}
{{< tab name="Homebrew" codelang="bash" >}}
brew install kubectl

kubectl version
{{< /tab >}}
{{< /tabs >}}

## Установка kubectl на macOS

### Установка бинарного файла kubectl с использованием curl на macOS

1. Загрузите последний релиз:

    ```		 
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
    ```

    Для установки конкретной версии замените эту часть команды `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` на команду с выбранной версией.

    Например, для установки версии {{< param "fullversion" >}} на macOS введите:
		  
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. Сделайте бинарный файл kubectl исполняемым.

    ```
    chmod +x ./kubectl
    ```

3. Переместите бинарный файл в PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Выполните команду, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

### Установка с использованием Homebrew на macOS

Если вы пользователь macOS и используете пакетный менеджер [Homebrew](https://brew.sh/), вы можете установить kubectl с помощью Homebrew.

1. Выполните команду установки:

    ```
    brew install kubectl 
    ```
    or 
    
    ```
    brew install kubernetes-cli
    ```

2. Выполните, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

### Установка с использованием Macports на macOS

Если вы пользователь macOS и используете пакетный менеджер [Macports](https://macports.org/), вы можете установить kubectl с помощью Macports.

1. Выполните команду установки:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Выполните, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

## Установка kubectl на Windows

### Установка бинарного файла kubectl с использованием curl на Windows

1. Загрузите последний релиз {{< param "fullversion" >}} по [этой ссылке](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    Или, если у вас установлена утилита `curl`, воспользуйтесь командой:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    Чтобы определить последнюю стабильную версию (например, для написания скриптов), обратитесь к [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt)..

2. Добавьте бинарный файл в PATH.
3. Проверьте, что установленная версия `kubectl` соответствует загруженной:

    ```
    kubectl version
    ```
{{< note >}}
[Docker Desktop для Windows](https://docs.docker.com/docker-for-windows/#kubernetes) добавляет в PATH собственную версию `kubectl`. Если вы устанавливали Docker Desktop ранее, вам может быть необходимо разметить запись в переменной PATH до добавленной приложением Docker Desktop или удалить Docker Desktop `kubectl`.
{{< /note >}}

### Установка с помощью Powershell из PSGallery

Если вы пользователь Windows и используете пакетный менеджер [Powershell Gallery](https://www.powershellgallery.com/), вы можете установить kubectl с помощью Powershell.

1. Выполните команду установки (не забудьте указать `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}} Если вы не укажете `DownloadLocation`, `kubectl` будет установлени во временную пользовательскую директорию.{{< /note >}}
    
    Установщик создаст `$HOME/.kube` и даст ему инструции по созданию файла конфигурации

2. Выполните, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

    {{< note >}}Обновление производитеся с помощью повторного выполнения команд из пункта 1.{{< /note >}}

### Установка на Windows с использованием Chocolatey или Scoop

Для установки kubectl на Windows можно использовать пакетный менеджер [Chocolatey](https://chocolatey.org) или установщик командной строки [Scoop](https://scoop.sh).
{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
2. Выполните, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

3. Перейдите в домашнюю директорию:

    ```
    cd %USERPROFILE%
    ```
4. Создайте директорию`.kube`:

    ```
    mkdir .kube
    ```

5. Перейдите в только что созданную директорию `.kube`:

    ```
    cd .kube
    ```

6. Настройте kubectl на использование удалённого кластера Kubernetes:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Редактируйте конфигурационный файл с помощью удобного вам текстового редактора, например Notepad.{{< /note >}}

## Загрузка как часть Google Cloud SDK

Вы можете установить kubectl как часть Google Cloud SDK.

1. Установите [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Запустите команду установки `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
3. Выполните, чтобы проверить актуальность установленной версии:

    ```
    kubectl version
    ```

## Проверка конфигурации kubectl 

Для того, чтобы kubectl мог найти и получить доступ к кластеру Kubernetes, необходим [файл kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), который создаётся автоматически при создании кластера с использованием [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) или успешном развёртывании кластера Minikube. По умолчанию настройки kubectl находятся в `~/.kube/config`.

Проверить, что kubectl настроен правильно, можно получив состояние кластера:

```shell
kubectl cluster-info
```
Если вы видите в ответе URL, доступ kubectl к вашему кластеру настроен правильно.

Если вы видите сообщение, аналогичное данному, kubectl сконфигурирован неверно или kubectl не может установить связь с вашим кластером.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Например, если вы хотите запустить кластер Kubernetes на вашем ноутбуке (локально), вам сначала потребуется установить инструмен, такой как Minikube, и затем перевыполнить указанные выше команды.

Если kubectl cluster-info возвращает в ответе url, но вы не можете получить доступ к вашему кластеру, используйте следующую команду для проверку корректности настроек:

```shell
kubectl cluster-info dump
```

## Дополнительные настройки kubectl

### Включение автодополнения командной оболочки

kubectl предоставляет поддержку автодополнения для Bash и Zsh, что может позволить вам сильно сократить время набора команд.

Ниже указаны инструкции для настройки автодополнения для Bash (включая разницу между Linux и macOS) и Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash на Linux" %}}

### Введение

Скрипт для дополнений kubectl для Bash может быть сгенерирован с помощью команды `kubectl completion bash`. После завершения выполнения скрипта в вашем командной оболочке будет доступно автодополнение команд kubectl.

Однако, завершение скрипта зависит от [**bash-completion**](https://github.com/scop/bash-completion), что значит, что сначала необходимо установить данную утилиту (чтобы проверить, установлена ли у вас утилита bash-completion, используйте команду `type _init_completion`).

### Установка bash-completion

bash-completion предоставляется многими пакетными менеджерами (посмотрите [здесь](https://github.com/scop/bash-completion#installation)). Вы можете установить данную утилиту с помощью `apt-get install bash-completion` или `yum install bash-completion`, и т.д.

Команды, указанные выше, создадут `/usr/share/bash-completion/bash_completion` - главный скрипт для bash-completion. В зависимости от используемого пакетного менеджера может потребоваться вручную указать данный файл в вашем `~/.bashrc`.

Для проверки перезапустите вашу командную оболочку и введите `type _init_completion`. Если команда выполнилась успешно, настройка завершена, иначе добавьте в `~/.bashrc` следующую строку:

```shell
source /usr/share/bash-completion/bash_completion
```

Перезапустите вашу командную оболочку и проверьте, что bash-completion установлен корректно выполнив `type _init_completion`.

### Включение автодополнения kubectl

You now need to ensure that the kubectl completion script gets sourced in all your shell sessions. There are two ways in which you can do this:

- Source the completion script in your `~/.bashrc` file:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Add the completion script to the `/etc/bash_completion.d` directory:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```
- If you have an alias for kubectl, you can extend shell completion to work with that alias:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
bash-completion sources all completion scripts in `/etc/bash_completion.d`.
{{< /note >}}

Both approaches are equivalent. After reloading your shell, kubectl autocompletion should be working.

{{% /tab %}}


{{% tab name="Bash on macOS" %}}


### Introduction

The kubectl completion script for Bash can be generated with `kubectl completion bash`. Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on [**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.

{{< warning>}}
there are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2 (which is the default on macOS), and v2 is for Bash 4.1+. The kubectl completion script **doesn't work** correctly with bash-completion v1 and Bash 3.2. It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to correctly use kubectl completion on macOS, you have to install and use Bash 4.1+ ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). The following instructions assume that you use Bash 4.1+ (that is, any Bash version of 4.1 or newer).
{{< /warning >}}


### Install bash-completion

{{< note >}}
As mentioned, these instructions assume you use Bash 4.1+, which means you will install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1, in which case kubectl completion won't work).
{{< /note >}}

You can test if you have bash-completion v2 already installed with `type _init_completion`. If not, you can install it with Homebrew:

```shell
brew install bash-completion@2
```

As stated in the output of this command, add the following to your `~/.bashrc` file:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.

### Enable kubectl autocompletion

You now have to ensure that the kubectl completion script gets sourced in all your shell sessions. There are multiple ways to achieve this:

- Source the completion script in your `~/.bashrc` file:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc

    ```

- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- If you have an alias for kubectl, you can extend shell completion to work with that alias:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```
    
- If you installed kubectl with Homebrew (as explained [above](#install-with-homebrew-on-macos)), then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`. In that case, you don't need to do anything.

{{< note >}}
the Homebrew installation of bash-completion v2 sources all the files in the `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
{{< /note >}}

In any case, after reloading your shell, kubectl completion should be working.
{{% /tab %}}

{{% tab name="Zsh" %}}

The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:

```shell
source <(kubectl completion zsh)
```

If you have an alias for kubectl, you can extend shell completion to work with that alias:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```
    
After reloading your shell, kubectl autocompletion should be working.

If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [Install Minikube](/docs/tasks/tools/install-minikube/)
* See the [getting started guides](/docs/setup/) for more about creating clusters. 
* [Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Read the [kubectl reference docs](/docs/reference/kubectl/kubectl/)
{{% /capture %}}
