---
title: Установка kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Установка инструмента настройки kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
На этой странице описана установка набора инструментов `kubeadm`.
О том, как после установки создать кластер, см. страницу
[Создание кластера с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "руководства по установке" >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* Совместимая машина с Linux. Проект Kubernetes предоставляет общие инструкции
  для дистрибутивов на основе Debian и Red Hat, а также для дистрибутивов без менеджера пакетов.
* Не менее 2 ГБ оперативной памяти на машину (при меньшем объёме приложениям останется мало памяти).
* Не менее 2 CPU для машин управляющего слоя.
* Полная сетевая связность между всеми машинами кластера (подходит как общедоступная, так и частная сеть).
* Уникальные имя хоста, MAC-адрес и product_uuid каждого узла. Подробнее см. [ниже](#verify-mac-address).
* Открытые на машинах определённые порты. Подробнее см. [ниже](#check-required-ports).

{{< note >}}
Установка `kubeadm` использует бинарные файлы с динамической компоновкой и предполагает
наличие `glibc` в целевой системе. Это справедливо для многих дистрибутивов Linux
(включая Debian, Ubuntu, Fedora, CentOS и другие), но не всегда для специализированных
и облегчённых дистрибутивов, в которых `glibc` отсутствует по умолчанию, например Alpine Linux.
Ожидается, что дистрибутив содержит `glibc` или
[слой совместимости](https://wiki.alpinelinux.org/wiki/Running_glibc_programs),
предоставляющий необходимые символы.
{{< /note >}}

<!-- steps -->

## Проверка версии ОС {#check-your-os-version}

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* Проект kubeadm поддерживает ядра LTS. См. [список ядер LTS](https://www.kernel.org/category/releases.html).
* Версию ядра можно узнать командой `uname -r`.

Подробнее см. [Требования к ядру Linux](/docs/reference/node/kernel-version-requirements/).

{{% /tab %}}

{{% tab name="Windows" %}}

* Проект kubeadm поддерживает последние версии ядра. Их список приведён в
  [сведениях о выпусках Windows Server](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* Версию ядра (также называемую версией ОС) можно узнать командой `systeminfo`.

Подробнее см. [Совместимость версий ОС Windows](/docs/concepts/windows/intro/#windows-os-version-support).

{{% /tab %}}
{{< /tabs >}}

Кластер Kubernetes, созданный с помощью kubeadm, зависит от программного обеспечения,
использующего возможности ядра. К нему относятся, в частности,
[среда выполнения контейнеров](/docs/setup/production-environment/container-runtimes/),
[kubelet](/docs/reference/command-line-tools-reference/kubelet/)
и плагин [Container Network Interface](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).

Чтобы избежать неожиданных ошибок из-за неподдерживаемой версии ядра, kubeadm выполняет
предварительную проверку `SystemVerification`. Она завершается ошибкой, если версия ядра не поддерживается.

Вы можете пропустить эту проверку, если знаете, что ядро предоставляет необходимые возможности,
хотя kubeadm и не поддерживает его версию.

## Проверка уникальности MAC-адреса и product_uuid каждого узла {#verify-mac-address}

* MAC-адреса сетевых интерфейсов можно узнать командой `ip link` или `ifconfig -a`.
* product_uuid можно проверить командой `sudo cat /sys/class/dmi/id/product_uuid`.

У физических устройств адреса, скорее всего, уникальны, но у некоторых виртуальных машин
значения могут совпадать. Kubernetes использует их для уникальной идентификации узлов кластера.
Если значения не уникальны для каждого узла, установка может
[завершиться ошибкой](https://github.com/kubernetes/kubeadm/issues/31).

## Проверка сетевых адаптеров {#check-network-adapters}

Если у вас несколько сетевых адаптеров и компоненты Kubernetes недоступны по маршруту
по умолчанию, рекомендуем добавить IP-маршруты, чтобы обращения к адресам кластера
проходили через нужный адаптер.

## Проверка необходимых портов {#check-required-ports}

Для взаимодействия компонентов Kubernetes должны быть открыты
[необходимые порты](/docs/reference/networking/ports-and-protocols/).
Проверить доступность порта можно инструментами вроде [netcat](https://netcat.sourceforge.net). Например:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Используемый сетевой плагин подов также может требовать открытия определённых портов.
Поскольку требования различаются, обратитесь к документации соответствующего плагина.

## Настройка подкачки {#swap-configuration}

По умолчанию kubelet отказывается запускаться, если на узле обнаружена память подкачки.
Поэтому подкачку необходимо либо отключить, либо разрешить её наличие в настройках kubelet.

* Чтобы разрешить подкачку, добавьте `failSwapOn: false` в конфигурацию kubelet
  или задайте соответствующий аргумент командной строки. Даже с `failSwapOn: false`
  рабочие нагрузки по умолчанию не получают доступ к подкачке. Это можно изменить параметром
  `swapBehavior` в файле конфигурации kubelet. Для использования подкачки задайте
  `swapBehavior`, отличный от значения по умолчанию `NoSwap`.
  Подробнее см. [Управление подкачкой](/docs/concepts/cluster-administration/swap-memory-management).
* Для временного отключения подкачки выполните `sudo swapoff -a`.
  Чтобы изменение сохранялось после перезагрузок, отключите подкачку в соответствующих
  файлах конфигурации, например `/etc/fstab` или `systemd.swap`, в зависимости от настройки системы.

## Установка среды выполнения контейнеров {#installing-runtime}

Для запуска контейнеров в подах Kubernetes использует
[среду выполнения контейнеров](/docs/setup/production-environment/container-runtimes/).

По умолчанию для взаимодействия с выбранной средой выполнения Kubernetes использует
[интерфейс среды выполнения контейнеров](/docs/concepts/architecture/cri/) (CRI).

Если среда выполнения не указана, kubeadm пытается автоматически обнаружить установленную
среду, проверяя список известных конечных точек.

Если обнаружено несколько сред выполнения или ни одной, kubeadm выдаёт ошибку
и просит указать, какую среду вы хотите использовать.

Подробнее см. [Среды выполнения контейнеров](/docs/setup/production-environment/container-runtimes/).

{{< note >}}
Docker Engine не реализует [CRI](/docs/concepts/architecture/cri/), необходимый
для работы среды выполнения контейнеров с Kubernetes. Поэтому требуется установить
дополнительный сервис [cri-dockerd](https://mirantis.github.io/cri-dockerd/).
Он основан на прежней встроенной поддержке Docker Engine,
[удалённой](/dockershim) из kubelet в версии 1.24.
{{< /note >}}

В таблицах ниже приведены известные конечные точки для поддерживаемых операционных систем:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Среды выполнения контейнеров в Linux" >}}
| Среда выполнения | Путь к сокету домена Unix |
|------------------------------------|----------------------------------------------|
| containerd | `unix:///var/run/containerd/containerd.sock` |
| CRI-O | `unix:///var/run/crio/crio.sock` |
| Docker Engine (с cri-dockerd) | `unix:///var/run/cri-dockerd.sock` |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Среды выполнения контейнеров в Windows" >}}
| Среда выполнения | Путь к именованному каналу Windows |
|------------------------------------|----------------------------------------------|
| containerd | `npipe:////./pipe/containerd-containerd` |
| Docker Engine (с cri-dockerd) | `npipe:////./pipe/cri-dockerd` |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Установка kubeadm, kubelet и kubectl {#installing-kubeadm-kubelet-and-kubectl}

На всех машинах необходимо установить следующие пакеты:

* `kubeadm`: команда для первоначального создания кластера.

* `kubelet`: компонент, работающий на всех машинах кластера и выполняющий, в частности,
  запуск подов и контейнеров.

* `kubectl`: инструмент командной строки для взаимодействия с кластером.

kubeadm **не устанавливает и не обслуживает** `kubelet` и `kubectl`, поэтому вы должны
сами обеспечить соответствие их версий той версии управляющего слоя Kubernetes,
которую должен установить kubeadm. Иначе различие версий может привести к неожиданному
поведению и ошибкам. Допускается расхождение на _одну_ минорную версию между kubelet
и управляющим слоем, но версия kubelet никогда не должна быть новее версии сервера API.
Например, kubelet 1.7.0 должен быть полностью совместим с сервером API 1.8.0, но не наоборот.

Об установке `kubectl` см. [Установка и настройка kubectl](/docs/tasks/tools/).

{{< warning >}}
Эти инструкции исключают все пакеты Kubernetes из системных обновлений,
поскольку обновление kubeadm и Kubernetes
[требует особого внимания](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Подробнее о расхождении версий:

* [Политика версий и совместимости версий](/docs/setup/release/version-skew-policy/) Kubernetes.
* [Политика совместимости версий kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy).

{{% legacy-repos-deprecation %}}

{{< note >}}
Для каждой минорной версии Kubernetes существует отдельный репозиторий пакетов.
Для установки версии, отличной от v{{< skew currentVersion >}}, обратитесь
к руководству по установке нужной минорной версии.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Дистрибутивы на основе Debian" %}}

Эти инструкции предназначены для Kubernetes v{{< skew currentVersion >}}.

1. Обновите индекс пакетов `apt` и установите пакеты, необходимые для использования репозитория Kubernetes `apt`:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Скачайте открытый ключ подписи репозиториев пакетов Kubernetes.
   Во всех репозиториях используется один и тот же ключ, поэтому версию в URL можно не учитывать:

   ```shell
   # If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
В версиях Debian до 12 и Ubuntu до 22.04 каталог `/etc/apt/keyrings`
по умолчанию отсутствует. Его нужно создать перед выполнением команды curl.
{{< /note >}}

3. Добавьте соответствующий репозиторий Kubernetes `apt`. Он содержит пакеты только
   для Kubernetes {{< skew currentVersion >}}. Для других минорных версий измените
   минорную версию в URL на нужную. Также убедитесь, что читаете документацию
   для версии Kubernetes, которую собираетесь установить.

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Обновите индекс пакетов `apt`, установите kubelet, kubeadm и kubectl и закрепите их версии:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. При необходимости включите сервис kubelet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Дистрибутивы на основе Red Hat" %}}

1. Переведите SELinux в режим `permissive`:

   Эти инструкции предназначены для Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- Перевод SELinux в режим permissive командами `setenforce 0` и `sed ...`
  фактически отключает его защиту. Это необходимо, чтобы контейнеры могли обращаться
  к файловой системе хоста; например, этого требуют некоторые сетевые плагины кластера.
  Это потребуется, пока поддержка SELinux в kubelet не будет улучшена.
- Вы можете оставить SELinux включённым, если умеете его настраивать, но для этого
  могут потребоваться настройки, не поддерживаемые kubeadm.
{{< /caution >}}

2. Добавьте репозиторий Kubernetes `yum`. Параметр `exclude` в описании репозитория
   предотвращает обновление пакетов Kubernetes при обычном `dnf update`, поскольку
   обновление Kubernetes требует специальной процедуры. Репозиторий содержит пакеты
   только для Kubernetes {{< skew currentVersion >}}. Для других минорных версий
   измените минорную версию в URL на нужную. Также убедитесь, что читаете документацию
   для версии Kubernetes, которую собираетесь установить.

   ```shell
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. Установите kubelet, kubeadm и kubectl:

   Для систем с DNF4 (Fedora < 41, RHEL/CentOS < 10):
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```
   Для систем Fedora с DNF5:
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
   ```

   Для RHEL/CentOS 10 и более новых версий, чтобы не устанавливать `iptables` как зависимость:
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes --setopt=install_weak_deps=False
   ```

4. При необходимости включите сервис kubelet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Без менеджера пакетов" %}}
Установите плагины CNI (необходимы для большинства сетей подов):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Определите каталог для скачивания исполняемых файлов команд:

{{< note >}}
Переменная `DOWNLOAD_DIR` должна указывать на каталог, доступный для записи.
В Flatcar Container Linux задайте `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

При необходимости установите crictl (нужен для взаимодействия с Container Runtime Interface (CRI), необязателен для kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Установите `kubeadm`, `kubelet` и добавьте сервис `kubelet` для systemd:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Для дистрибутивов Linux, в которых по умолчанию отсутствует `glibc`, см. примечание
в разделе [Подготовка](#before-you-begin).
{{< /note >}}

Установите `kubectl` по инструкциям на странице [Установка инструментов](/docs/tasks/tools/).

При необходимости включите сервис kubelet перед запуском kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Дистрибутив Flatcar Container Linux монтирует каталог `/usr` только для чтения.
Перед созданием кластера выполните дополнительные действия для настройки каталога,
доступного для записи. Инструкции приведены в
[руководстве по устранению неполадок kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only).
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Теперь kubelet перезапускается каждые несколько секунд, находясь в цикле сбоев
и ожидая указаний от kubeadm.

## Устранение неполадок {#troubleshooting}

При возникновении проблем с kubeadm обратитесь к
[документации по устранению неполадок](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Создание кластера с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
