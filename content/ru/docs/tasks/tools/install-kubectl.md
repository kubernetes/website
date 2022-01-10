---
reviewers:
- mikedanese
title: Установка и настройка kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Установка kubectl
---

<!-- overview -->
Инструмент командной строки Kubernetes [kubectl](/docs/user-guide/kubectl/) позволяет запускать команды для кластеров Kubernetes. Вы можете использовать kubectl для развертывания приложений, проверки и управления ресурсов кластера, а также для просмотра логов. Полный список операций kubectl смотрите в [Overview of kubectl](/docs/reference/kubectl/overview/).


## {{% heading "prerequisites" %}}

Используемая вами мажорная версия kubectl не должна отличаться от той, которая используется в кластере. Например, версия v1.2 может работать с версиями v1.1, v1.2 и v1.3. Использование последней версии kubectl поможет избежать непредвиденных проблем.


<!-- steps -->

## Установка kubectl в Linux

### Установка двоичного файла kubectl с помощью curl в Linux

1. Загрузите последнюю версию с помощью команды:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    Чтобы загрузить определенную версию, вставьте в фрагмент команды `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` нужную версию.

    Например, команда загрузки версии {{< param "fullversion" >}} для Linux будет выглядеть следующим образом:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Сделайте двоичный файл kubectl исполняемым:

    ```
    chmod +x ./kubectl
    ```

3. Переместите двоичный файл в директорию из переменной окружения PATH:

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

### Установка с помощью встроенного пакетного менеджера

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian или HypriotOS" codelang="bash" >}}sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL или Fedora" codelang="bash" >}}sudo cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

### Установка с помощью стороннего пакетного менеджера

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Если вы используйте Ubuntu или другой Linux-дистрибутив, в котором есть пакетный менеджер [snap](https://snapcraft.io/docs/core/install), kubectl доступен в виде приложения [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic

kubectl version
```
{{% /tab %}}
{{% tab name="Homebrew" %}}
Если вы работаете в Linux и используете пакетный менеджер [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), то kubectl можно [установить](https://docs.brew.sh/Homebrew-on-Linux#install) через него.

```shell
brew install kubectl

kubectl version
```
{{% /tab %}}
{{< /tabs >}}

## Установка kubectl в macOS

### Установка двоичного файла kubectl с помощью curl в macOS

1. Загрузите последнюю версию:

    ```
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
    ```

    Чтобы загрузить определенную версию, вставьте в фрагмент команды `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` нужную версию.

    Например, команда загрузки версии {{< param "fullversion" >}} для macOS будет выглядеть следующим образом:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. Сделайте двоичный файл kubectl исполняемым:

    ```
    chmod +x ./kubectl
    ```

3. Переместите двоичный файл в директорию из переменной окружения PATH:

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

4. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

### Установка с помощью Homebrew в macOS

Если вы используете macOS и [Homebrew](https://brew.sh/), то kubectl можно установить с помощью пакетного менеджера Homebrew.

1. Выполните команду установки:

    ```
    brew install kubectl
    ```

    Или:

    ```
    brew install kubernetes-cli
    ```

2. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

### Установка с помощью Macports в macOS

Если вы используйте macOS и [Macports](https://macports.org/), то kubectl можно установить с помощью пакетного менеджера Macports.

1. Выполните команду установки:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```

2. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

## Установка kubectl в Windows

### Установка двоичного файла kubectl с помощью curl в Windows

1. Загрузите последнюю версию {{< param "fullversion" >}} по [этой ссылке](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    Либо, если у вас установлен `curl`, выполните команду ниже:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    Последнюю стабильную версию (например, при написании скриптов) вы можете узнать из файла по ссылке [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Переместите двоичный файл в директорию из переменной окружения PATH:
3. Убедитесь, что версия `kubectl` совпадает загружённой:

    ```
    kubectl version --client
    ```
{{< note >}}

[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) добавляет собственную версию `kubectl` в переменную окружения `PATH`.
Если у вас установлен Docker Desktop, вам придётся поместить путь к установленному двоичному файлу перед записью, добавленной установщиком Docker Desktop, либо же удалить вовсе `kubectl`, поставляемый вместе с Docker Desktop.
{{< /note >}}

### Установка с помощью Powershell из PSGallery

Если вы работаете в Windows и используете менеджер пакетов [Powershell Gallery](https://www.powershellgallery.com/), вы можете установить и обновить kubectl с помощью Powershell.

1. Выполните команды по установке (обязательно укажите `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```

    {{< note >}}Если вы не укажете `DownloadLocation`, то `kubectl` будет установлен во временную директорию пользователя.{{< /note >}}

    Установщик создаст `$HOME/.kube` вместе с конфигурационным файлом.

2. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

    {{< note >}}Обновить kubectl можно путём выполнения двух команд, перечисленных в шаге 1.{{< /note >}}

### Установка в Windows с помощью Chocolatey или Scoop

Для установки kubectl в Windows вы можете использовать либо менеджер пакетов [Chocolatey](https://chocolatey.org) , либо установщик в командной строке [Scoop](https://scoop.sh).

{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
2. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

3. Перейдите в домашнюю директорию:

    ```
    cd %USERPROFILE%
    ```

4. Создайте директорию `.kube`:

    ```
    mkdir .kube
    ```

5. Перейдите в созданную только что директорию `.kube`:

    ```
    cd .kube
    ```

6. Настройте kubectl, чтобы возможно было использовать удаленный кластер Kubernetes:

    ```
    New-Item config -type file
    ```

    {{< note >}}Отредактируйте конфигурационный файл, используя ваш любимый текстовый редактор или обычный Notepad.{{< /note >}}

## Установка kubectl из SDK Google Cloud

Вы можете использовать kubectl из SDK Google Cloud, который использует этот CLI-инструмент.

1. Установите [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Выполните команду для установки `kubectl`:

    ```
    gcloud components install kubectl
    ```

3. Убедитесь, что установлена последняя версия:

    ```
    kubectl version --client
    ```

## Проверка конфигурации kubectl

Чтобы kubectl мог найти и получить доступ к кластеру Kubernetes, нужен [файл kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), который создаётся автоматически при создании кластера с помощью скрипта [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) или при успешном развертывании кластера Minikube. По умолчанию конфигурация kubectl находится в `~/.kube/config`.

Посмотрите на состояние кластера, чтобы убедиться, что kubectl правильно сконфигурирован:

```shell
kubectl cluster-info
```

Если вы видите URL-ответ, значит kubectl корректно настроен для работы с вашим кластером.

Если вы видите сообщение следующего содержания, то значит kubectl настроен некорректно или не может подключиться к кластеру Kubernetes:

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Например, если вы собираетесь запустить кластер Kubernetes на своем ноутбуке (локально), вам потребуется сначала установить специальный для этого инструмент, например Minikube, а затем снова выполнить указанные выше команды.

Если команда `kubectl cluster-info` возвращает URL-ответ, но вы не можете подключиться к своему кластеру, чтобы убедиться, что он правильно настроен, воспользуйтесь этой командой:

```shell
kubectl cluster-info dump
```

## Дополнительная конфигурация kubectl

### Включение автодополнения ввода shell

kubectl поддерживает автодополнение (автозаполнение) ввода в Bash и Zsh, которое сэкономит вам много времени на набор команд.

Ниже приведены инструкции по настройке автодополнения для Bash (для Linux и macOS) и Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash в Linux" %}}

### Основные сведения

Скрипт дополнения ввода kubectl для Bash может быть сгенерирован с помощью команды `kubectl completion bash`. Подключение скрипта дополнения ввода в вашу оболочку включает поддержку автозаполнения ввода для kubectl.

Однако скрипт дополнения ввода зависит от [**bash-completion**](https://github.com/scop/bash-completion), поэтому вам нужно сначала установить этот пакет (вы можете выполнить команду `type _init_completion`, чтобы проверить, установлен ли у вас уже bash-completion).

### Установка bash-completion

bash-completion можно установить через многие менеджеры пакеты (см. [здесь](https://github.com/scop/bash-completion#installation)). Вы можете установить его с помощью `apt-get install bash-completion` или `yum install bash-completion` и т.д.

Приведенные выше команды создадут файл `/usr/share/bash-completion/bash_completion`, который является основным скриптом bash-completion. В зависимости от используемого менеджера пакетов, вы можете подключить этот файл в файле  `~/.bashrc`.

Чтобы убедиться, что этот скрипт выполняется, перезагрузите оболочку и выполните команду `type _init_completion`. Если команда отработала успешно, установка сделана правильно, в противном случае добавьте следующее содержимое в файл `~/.bashrc`:

```shell
source /usr/share/bash-completion/bash_completion
```

Перезагрузите вашу оболочку и убедитесь, что bash-completion правильно установлен, напечатав в терминале `type _init_completion`.

### Включение автодополнения ввода kubectl

Теперь нужно убедиться, что скрипт дополнения ввода kubectl выполняется во всех сессиях командной оболочки. Есть два способа сделать это:

- Добавьте запуск скрипта дополнения ввода в файл `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Добавьте скрипт дополнения ввода в директорию `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

- Если у вас определён псевдоним для kubectl, вы можете интегрировать его с автодополнением оболочки:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
Все скрипты дополнения ввода bash-completion находятся в `/etc/bash_completion.d`.
{{< /note >}}

Оба подхода эквивалентны. После перезагрузки вашей оболочки, должны появляться дополнения ввода kubectl.

{{% /tab %}}


{{% tab name="Bash в macOS" %}}


### Основные сведения

Скрипт дополнения ввода kubectl для Bash может быть сгенерирован с помощью команды `kubectl completion bash`. Подключение скрипта дополнения ввода в вашей оболочке включает поддержку автозаполнения ввода для kubectl.

Однако скрипт дополнения ввода kubectl зависит от пакета [**bash-completion**](https://github.com/scop/bash-completion), который первым делом нужно установить.

{{< warning>}}
Есть две версии bash-completion: первая (v1) и вторая (v2). Первая предназначена для Bash 3.2 (который используется по умолчанию в macOS), а вторая — для Bash 4.1+. Скрипт дополнения ввода kubectl **не работает** корректно с bash-completion v1 и Bash 3.2. Требуется **bash-completion v2** и **Bash 4.1+**. Таким образом, чтобы правильно использовать дополнение kubectl в macOS, вам нужно установить и использовать Bash 4.1+ ([*инструкции по обновлению*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Последующие шаги предполагают, что вы используете Bash 4.1+ (то есть любую версию Bash 4.1 или более новую).
{{< /warning >}}


### Установка bash-completion

{{< note >}}
Как уже упоминалось, в этих инструкциях предполагается, что вы используете Bash 4.1+, поэтому вы устанавливаете bash-completion v2 (а не Bash 3.2 и bash-completion v1, в таком случае дополнение ввода kubectl не будет работать).
{{< /note >}}

Вы можете проверить, установлен ли у вас bash-completion v2, набрав команду `type _init_completion`. Если он не установлен, вы можете сделать это с помощью Homebrew:

```shell
brew install bash-completion@2
```

Как указано в выводе этой команды, добавьте следующий код в файл `~/.bashrc`:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Перезагрузите вашу командную оболочку и убедитесь, что bash-completion v2 корректно установлен, напечатав в терминале `type _init_completion`.

### Включение автодополнения ввода kubectl

Теперь нужно убедиться, что скрипт дополнения ввода kubectl выполняется во всех сессиях командной оболочки. Есть два способа сделать это:

- Добавьте запуск скрипта дополнения ввода в файл `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Добавьте скрипт дополнения ввода в директорию `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Если у вас определён псевдоним для kubectl, вы можете интегрировать его с автодополнением оболочки:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

Если вы установили kubectl с помощью Homebrew (как описано [выше](#install-with-homebrew-on-macos)), то скрипт дополнения ввода kubectl уже должен быть находится в `/usr/local/etc/bash_completion.d/kubectl`. В этом случае вам не нужно ничего делать.

{{< note >}}
Homebrew устанавливает bash-completion v2 в директорию `BASH_COMPLETION_COMPAT_DIR`, что делает рабочими два метода.
{{< /note >}}

Какой вариант бы вы не выбрали, после перезагрузки командной оболочки, дополнение ввода kubectl должно заработать.
{{% /tab %}}

{{% tab name="Zsh" %}}

Скрипт дополнения ввода kubectl для Zsh может быть сгенерирован с помощью команды `kubectl completion zsh`. Подключение скрипта дополнения ввода в вашу оболочку включает поддержку автозаполнения ввода для kubectl.

Чтобы подключить его во все сессии командной оболочки, добавьте следующую строчку в файл `~/.zshrc`:

```shell
source <(kubectl completion zsh)
```

Если у вас определён псевдоним для kubectl, вы можете интегрировать его с автодополнением оболочки:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'compdef __start_kubectl k' >>~/.zshrc
```

После перезагрузки командной оболочки должны появляться дополнения ввода kubectl.

Если появляется такая ошибка как `complete:13: command not found: compdef`, то добавьте следующее содержимое в начало вашего файла `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [Установка Minikube](/ru/docs/tasks/tools/install-minikube/)
* Смотрите [руководства по установке](/docs/setup/), чтобы узнать больше про создание кластеров.
* [Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Если у вас нет доступа к кластеру, который не создавали, посмотрите страницу [Совместный доступ к кластеру](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Read the [kubectl reference docs](/docs/reference/kubectl/kubectl/)

