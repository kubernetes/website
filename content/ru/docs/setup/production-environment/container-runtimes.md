---
title: Среды выполнения контейнеров
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

На каждом узле кластера необходимо установить
[среду выполнения контейнеров](/docs/setup/production-environment/container-runtimes/),
чтобы на нём могли работать поды. Эта страница описывает необходимые действия
и связанные задачи настройки узлов.

Kubernetes {{< skew currentVersion >}} требует использования среды выполнения,
соответствующей [интерфейсу среды выполнения контейнеров](/docs/concepts/architecture/cri/) (CRI).

Подробнее см. в разделе [Поддержка версий CRI](#cri-versions).

На этой странице описано использование нескольких распространённых сред выполнения
контейнеров с Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Версии Kubernetes до v1.24 включали прямую интеграцию с Docker Engine с помощью
компонента _dockershim_. Эта специальная интеграция больше не входит в Kubernetes
(о её удалении было [объявлено](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
при выпуске v1.20).
Чтобы понять, как это может повлиять на вас, прочитайте
[Проверка влияния удаления Dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).
О переходе с dockershim см. раздел
[Миграция с dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Если вы используете версию Kubernetes, отличную от v{{< skew currentVersion >}},
обратитесь к документации для этой версии.
{{< /note >}}

<!-- body -->
## Установка и настройка необходимых компонентов {#install-and-configure-prerequisites}

### Настройка сети {#network-configuration}

По умолчанию ядро Linux не разрешает маршрутизацию пакетов IPv4 между интерфейсами.
Большинство реализаций сети кластера Kubernetes при необходимости изменяют эту настройку,
но некоторые предполагают, что это сделает администратор.
Некоторым также могут требоваться другие параметры sysctl, загрузка модулей ядра
и другие действия; обратитесь к документации вашей сетевой реализации.

### Включение пересылки пакетов IPv4 {#prerequisite-ipv4-forwarding-optional}

Чтобы вручную включить пересылку пакетов IPv4:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Убедитесь, что `net.ipv4.ip_forward` имеет значение 1:

```bash
sysctl net.ipv4.ip_forward
```

## Драйверы cgroup {#cgroup-drivers}

В Linux {{< glossary_tooltip text="контрольные группы" term_id="cgroup" >}}
используются для ограничения ресурсов, выделяемых процессам.

Как [kubelet](/docs/reference/command-line-tools-reference/kubelet/), так и среда выполнения
контейнеров должны взаимодействовать с контрольными группами, чтобы обеспечивать
[управление ресурсами подов и контейнеров](/docs/concepts/configuration/manage-resources-containers/)
и задавать, например, запросы и ограничения CPU и памяти.
Для взаимодействия с контрольными группами kubelet и среда выполнения контейнеров
используют *драйвер cgroup*. Крайне важно, чтобы они использовали один и тот же
драйвер cgroup с согласованными настройками.

Доступны два драйвера cgroup:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### Драйвер cgroupfs {#cgroupfs-cgroup-driver}

`cgroupfs` — это [драйвер cgroup по умолчанию в kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
При его использовании kubelet и среда выполнения контейнеров взаимодействуют
напрямую с файловой системой cgroup для настройки контрольных групп.

Драйвер `cgroupfs` **не** рекомендуется, если системой инициализации является
[systemd](https://www.freedesktop.org/wiki/Software/systemd/), поскольку systemd
предполагает наличие единственного средства управления cgroup в системе.
Кроме того, при использовании [cgroup v2](/docs/concepts/architecture/cgroups)
используйте драйвер cgroup `systemd` вместо `cgroupfs`.

### Драйвер cgroup systemd {#systemd-cgroup-driver}

Если в дистрибутиве Linux системой инициализации выбран
[systemd](https://www.freedesktop.org/wiki/Software/systemd/), процесс инициализации
создаёт и использует корневую контрольную группу (`cgroup`) и управляет контрольными группами.

systemd тесно интегрирован с cgroup и выделяет отдельную контрольную группу для каждого
модуля systemd. В результате при использовании системы инициализации `systemd`
с драйвером `cgroupfs` в системе оказываются два разных средства управления cgroup.

Они формируют два представления о доступных и используемых ресурсах системы.
В некоторых случаях узлы, использующие `cgroupfs` для kubelet и среды выполнения
контейнеров, а `systemd` для остальных процессов, становятся нестабильными
при нехватке ресурсов.

Чтобы уменьшить эту нестабильность, используйте `systemd` в качестве драйвера cgroup
для kubelet и среды выполнения контейнеров, если systemd выбран системой инициализации.

Для этого задайте параметру `cgroupDriver` в
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
значение `systemd`. Например:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

Если для kubelet настроен драйвер cgroup `systemd`, его также необходимо настроить
для среды выполнения контейнеров. Инструкции приведены в документации вашей среды выполнения, например:

* [containerd](#containerd-systemd)
* [CRI-O](#cri-o)

В Kubernetes {{< skew currentVersion >}}, если включён
[переключатель возможностей](/docs/reference/command-line-tools-reference/feature-gates/)
`KubeletCgroupDriverFromCRI` и среда выполнения поддерживает CRI RPC `RuntimeConfig`,
kubelet автоматически определяет подходящий драйвер cgroup из среды выполнения
и игнорирует параметр `cgroupDriver` в своей конфигурации.

Однако старые версии сред выполнения контейнеров (в частности, containerd 1.y и ниже)
не поддерживают CRI RPC `RuntimeConfig` и могут некорректно отвечать на этот запрос.
В таком случае kubelet использует значение своего флага `--cgroup-driver`.

В Kubernetes 1.38 этот запасной механизм будет удалён, и старые версии containerd
не смогут работать с новыми версиями kubelet.

{{< caution >}}
Изменение драйвера cgroup узла, уже присоединённого к кластеру, требует осторожности.
Если kubelet создал поды с использованием одного драйвера cgroup, переключение среды
выполнения контейнеров на другой драйвер может вызывать ошибки при повторном создании
изолированной среды (sandbox) существующих подов. Перезапуск kubelet может не устранить эти ошибки.

Если ваши средства автоматизации это позволяют, замените узел другим с обновлённой
конфигурацией или переустановите его с помощью автоматизации.
{{< /caution >}}

## Поддержка версий CRI {#cri-versions}

Среда выполнения контейнеров должна поддерживать версию v1 интерфейса CRI.

Kubernetes [начиная с v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_работает только_ с v1 API CRI. Если среда выполнения не поддерживает API v1,
kubelet не зарегистрируется в качестве узла.

## Среды выполнения контейнеров {#container-runtimes}

{{% thirdparty-content %}}

### containerd

В этом разделе описаны шаги для использования containerd в качестве среды выполнения CRI.

Чтобы установить containerd в вашей системе, следуйте
[руководству по началу работы с containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Вернитесь к этому шагу после создания корректного файла конфигурации `config.toml`.

{{< tabs name="Расположение файла config.toml" >}}
{{% tab name="Linux" %}}
Файл находится по пути `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Файл находится по пути `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

В Linux сокет CRI по умолчанию для containerd — `/run/containerd/containerd.sock`.
В Windows конечная точка CRI по умолчанию — `npipe://./pipe/containerd-containerd`.

#### Настройка драйвера cgroup `systemd` {#containerd-systemd}

Чтобы использовать драйвер cgroup `systemd` с `runc`, задайте в `/etc/containerd/config.toml`
следующие параметры в зависимости от версии containerd.

Версии containerd 1.x:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Версии containerd 2.x:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Драйвер cgroup `systemd` рекомендуется при использовании [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Если containerd установлен из пакета (например, RPM или `.deb`), плагин интеграции CRI
может быть отключён по умолчанию.

Для использования containerd с Kubernetes поддержка CRI должна быть включена.
Убедитесь, что `cri` не входит в список `disabled_plugins` в `/etc/containerd/config.toml`.
Если вы изменили этот файл, также перезапустите `containerd`.

Если после первоначальной установки кластера или установки CNI контейнеры циклически
завершаются с ошибкой, конфигурация containerd из пакета может содержать несовместимые параметры.
Рассмотрите сброс конфигурации командой `containerd config default > /etc/containerd/config.toml`,
как описано в [getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics),
а затем задайте указанные выше параметры.
{{< /note >}}

После этого изменения обязательно перезапустите containerd:

```shell
sudo systemctl restart containerd
```

В Kubernetes v1.28 можно включить автоматическое определение драйвера cgroup
как альфа-возможность. Подробнее см. [Драйвер cgroup systemd](#systemd-cgroup-driver).

#### Замена образа sandbox (pause) {#override-pause-image-containerd}

В [конфигурации containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
можно заменить образ sandbox, задав следующие параметры:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

После обновления файла конфигурации также может потребоваться перезапуск `containerd`: `systemctl restart containerd`.

### CRI-O

В этом разделе описаны шаги установки CRI-O в качестве среды выполнения контейнеров.

Для установки следуйте [инструкциям по установке CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### Драйвер cgroup {#cgroup-driver}

По умолчанию CRI-O использует драйвер cgroup systemd, который, скорее всего, вам подойдёт.
Чтобы переключиться на `cgroupfs`, отредактируйте `/etc/crio/crio.conf`
или поместите дополнительную конфигурацию в `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, например:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Обратите внимание и на изменение `conmon_cgroup`: при использовании CRI-O с `cgroupfs`
его значение должно быть `pod`. В целом настройки драйвера cgroup для kubelet
(обычно задаваемые через kubeadm) и CRI-O необходимо поддерживать согласованными.

В Kubernetes v1.28 можно включить автоматическое определение драйвера cgroup
как альфа-возможность. Подробнее см. [Драйвер cgroup systemd](#systemd-cgroup-driver).

Для CRI-O сокет CRI по умолчанию — `/var/run/crio/crio.sock`.

#### Замена образа sandbox (pause) {#override-pause-image-cri-o}

В [конфигурации CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)
можно задать следующее значение:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Этот параметр поддерживает перезагрузку конфигурации без остановки процесса:
используйте `systemctl reload crio` или отправьте процессу `crio` сигнал `SIGHUP`.

### Docker Engine {#docker}

{{< note >}}
Эти инструкции предполагают использование адаптера
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/)
для интеграции Docker Engine с Kubernetes.
{{< /note >}}

1. На каждом узле установите Docker для своего дистрибутива Linux согласно разделу
   [Установка Docker Engine](https://docs.docker.com/engine/install/#server).

2. Установите [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), следуя разделу установки в документации.

Для `cri-dockerd` сокет CRI по умолчанию — `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) — коммерческая
среда выполнения контейнеров, ранее известная как Docker Enterprise Edition.

Mirantis Container Runtime можно использовать с Kubernetes через компонент с открытым
исходным кодом [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), входящий в MCR.

Подробнее об установке Mirantis Container Runtime см. в
[руководстве по развёртыванию MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Чтобы узнать путь к сокету CRI, проверьте модуль systemd с именем `cri-docker.socket`.

#### Замена образа sandbox (pause) {#override-pause-image-cri-dockerd-mcr}

Адаптер `cri-dockerd` принимает аргумент командной строки, задающий образ контейнера
инфраструктуры пода («образ pause»). Используйте аргумент `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

Помимо среды выполнения контейнеров, кластеру потребуется работающий
[сетевой плагин](/ru/docs/concepts/cluster-administration/networking/#реализация-сетевой-модели-kubernetes).
