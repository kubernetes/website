---
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

3. Переместите файл в директорию из переменной окружения PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Чтобы проверить актуальность установленной версии, выполните команду:

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

1. Загрузите последний релиз с помощью команды:

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

3. Переместите файл в директорию из переменной окружения PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Чтобы проверить актуальность установленной версии, выполните команду:

    ```
    kubectl version
    ```

### Установка с использованием Homebrew на macOS

Если вы пользователь macOS и используете пакетный менеджер [Homebrew](https://brew.sh/), вы можете установить kubectl с помощью Homebrew.

1. Для установки, выполните команду:

    ```
    brew install kubectl 
    ```
    или 
    
    ```
    brew install kubernetes-cli
    ```

2. Чтобы проверить актуальность установленной версии, выполните команду:

    ```
    kubectl version
    ```

### Установка с использованием Macports на macOS

Если вы пользователь macOS и используете пакетный менеджер [Macports](https://macports.org/), вы можете установить kubectl с помощью Macports.

1. Для установки, выполните команду:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Чтобы проверить актуальность установленной версии, выполните команду:

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

2. Добавьте путь к бинарному файлу в переменную окружения PATH.
3. Проверьте, что установленная версия `kubectl` соответствует загруженной:

    ```
    kubectl version
    ```
{{< note >}}
[Docker Desktop для Windows](https://docs.docker.com/docker-for-windows/#kubernetes) добавляет в PATH собственную версию `kubectl`. Если вы устанавливали Docker Desktop ранее, вам может быть необходимо разметить запись в переменной PATH до добавленной приложением Docker Desktop или удалить Docker Desktop `kubectl`.
{{< /note >}}

### Установка с помощью Powershell из PSGallery

Если вы пользователь Windows и используете пакетный менеджер [Powershell Gallery](https://www.powershellgallery.com/), вы можете установить kubectl с помощью Powershell.

1. Для установки, выполните команду (не забудьте указать `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}} Если вы не укажете `DownloadLocation`, `kubectl` будет установлен во временную пользовательскую директорию.{{< /note >}}
    
    Установщик создаст `$HOME/.kube` и даст ему инструкции по созданию файла конфигурации

2. Чтобы проверить актуальность установленной версии, выполните команду:

    ```
    kubectl version
    ```

    {{< note >}}Обновление производится с помощью повторного выполнения команд из пункта 1.{{< /note >}}

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
2. Чтобы проверить актуальность установленной версии, выполните команду:

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
    
    {{< note >}}Вы можете отредактировать конфигурационный файл с помощью удобного вам текстового редактора, например Notepad.{{< /note >}}

## Загрузка как часть Google Cloud SDK

Вы можете установить kubectl как часть Google Cloud SDK.

1. Установите [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Запустите команду установки `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
3. Чтобы проверить актуальность установленной версии, выполните команду:

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

Например, если вы хотите запустить кластер Kubernetes на вашем ноутбуке (локально), вам сначала потребуется установить инструмент, такой как Minikube, и затем перевыполнить указанные выше команды.

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

Однако выполнение скрипта зависит от [**bash-completion**](https://github.com/scop/bash-completion), что значит, что сначала необходимо установить данную утилиту (чтобы проверить, установлена ли у вас утилита bash-completion, используйте команду `type _init_completion`).

### Установка bash-completion

bash-completion предоставляется многими пакетными менеджерами (посмотрите [здесь](https://github.com/scop/bash-completion#installation)). Вы можете установить данную утилиту с помощью `apt-get install bash-completion` или `yum install bash-completion`, и т.д.

Команды, указанные выше, создадут `/usr/share/bash-completion/bash_completion` - главный скрипт для bash-completion. В зависимости от используемого пакетного менеджера может потребоваться вручную указать данный файл в вашем `~/.bashrc`.

Для проверки перезапустите вашу командную оболочку и введите `type _init_completion`. Если команда выполнилась успешно, настройка завершена, иначе добавьте в `~/.bashrc` следующую строку:

```shell
source /usr/share/bash-completion/bash_completion
```

Перезапустите вашу командную оболочку и проверьте, что bash-completion установлен корректно выполнив `type _init_completion`.

### Включение автодополнения kubectl

Теперь вам необходимо убедиться, что скрипт для дополнения команд kubectl применён во всех сессиях вашей командной оболочки. Есть два способа сделать это:

- Примените скрипт дополнений в вашем `~/.bashrc` файле:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Добавьте скрипт дополнений в директорию `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```
- Если у вас настроен псевдоним для kubectl, вы можете расширить действие дополнений в командной оболочке для работы с этим псевдонимом:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
Все исходные скрипты bash-completion находятся в `/etc/bash_completion.d`.
{{< /note >}}

Оба подхода равнозначны. После перезагрузки командной оболочки автодополнение kubectl должно работать.

{{% /tab %}}


{{% tab name="Bash на macOS" %}}


### Введение

Скрипт дополнений kubectl может быть сгенерирован с помощью команды `kubectl completion bash`. Применение этого скрипта в вашей командной оболочке активирует дополнения kubectl.

Однако скрипт дополнений kubectl зависит от утилиты [**bash-completion**](https://github.com/scop/bash-completion), которую необходимо установить заранее.

{{< warning>}}
Существуют две версии bash-completion, v1 и v2. V1 используется для Bash 3.2 (версия по умолчанию для macOS), а версия v2 для Bash 4.1+. Скрипт дополнений kubectl **не работает** корректно с bash-completion v1 и Bash 3.2. Для работы скрипта требуется **bash-completion v2** и **Bash 4.1+**. Поэтому, для возможности корректной работы дополнений kubectl, вам требуется установить и использовать Bash 4.1+ ([*инструкция*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). В следующих шагах инструкции предполагается, что вы используете Bash 4.1+ (т.е. версию Bash 4.1 или новее).
{{< /warning >}}


### Установка bash-completion

{{< note >}}
Как было упомянуто ранее, данные инструкции предполагают, что вы используете Bash 4.1+, что значит, что будет установлена версия bash-completion v2 (вместо Bash 3.2 и bash-completion v1, для которых дополнения kubectl не будут работать).
{{< /note >}}

Проверить, установлена ли у вас уже версия bash-completion v2 с помощью команды `type _init_completion`. Если нет, вы можете установить утилиту с помощью Homebrew:

```shell
brew install bash-completion@2
```

Следуя инструкции в выводе данной команды, добавьте следующую информацию в файл `~/.bashrc`:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Перезапустите вашу командную оболочку и проверьте, что версия bash-completion v2 установлена корректно, используя команду `type _init_completion`.

### Включение автодополнения kubectl

Теперь вам необходимо убедиться, что скрипт для дополнения команд kubectl применён во всех сессиях вашей командной оболочки. Есть несколько способов сделать это:

- Примените скрипт дополнений в вашем `~/.bashrc` файле:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc

    ```

- Добавьте скрипт дополнений в директорию `/usr/local/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Если у вас настроен псевдоним для kubectl, вы можете расширить действие дополнений в командной оболочке для работы с этим псевдонимом:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```
    
- Если вы устанавливали kubectl с помощью Homebrew (как указано [выше](#install-with-homebrew-on-macos)), тогда скрипт дополнений kubectl уже должен находиться в `/usr/local/etc/bash_completion.d/kubectl`. В этом случае, вам не нужно ничего делать дополнительно.

{{< note >}}
Установка bash-completion v2 с использованием Homebrew размещает все файлы в директории`BASH_COMPLETION_COMPAT_DIR`, поэтому предыдущие два способа работают.
{{< /note >}}

В любом случае, после перезагрузки вашей командной оболочки, дополнения kubectl должны работать.
{{% /tab %}}

{{% tab name="Zsh" %}}

Скрипт дополнений kubectl может быть сгенерирован с помощью команды `kubectl completion zsh`. Применение этого скрипта в вашей командной оболочке активирует дополнения kubectl.

Чтобы сделать это во всех сессиях вашей командной оболочки, добавьте следующую информацию в файл `~/.zshrc`:

```shell
source <(kubectl completion zsh)
```

Если у вас настроен псевдоним для kubectl, вы можете расширить действие дополнений в командной оболочке для работы с этим псевдонимом:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```
    
После перезагрузки вашей командной оболочки автодополнения kubectl должны работать.

Если вы получаете ошибку `complete:13: command not found: compdef`, тогда добавьте следующее в начало вашего файла `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [Установка Minikube](/docs/tasks/tools/install-minikube/)
* Обратитесь к [руководствам по началу работы](/docs/setup/), чтобы узнать больше о создании кластеров. 
* [Узнайте, как запустить и опубликовать ваше приложение.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Если вам нужен доступ к кластеру, созданному не вами, обратитесь к [документу по созданию общего доступа к кластеру](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Прочитайте [справочную документацию по kubectl](/docs/reference/kubectl/kubectl/)
{{% /capture %}}
