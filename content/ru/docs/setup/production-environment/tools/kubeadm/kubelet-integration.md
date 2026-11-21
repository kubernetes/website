---
title: Настройка каждого kubelet в кластере с помощью kubeadm
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Жизненный цикл инструмента командной строки kubeadm отделён от
[kubelet](/docs/reference/command-line-tools-reference/kubelet) — службы,
работающей на каждом узле кластера Kubernetes. Пользователь запускает kubeadm
при инициализации или обновлении Kubernetes, а kubelet постоянно работает в фоне.

Поскольку kubelet является службой, им должна управлять система инициализации
или менеджер служб. При установке kubelet из пакетов DEB или RPM для этого настраивается systemd.
Можно использовать другой менеджер служб, но его придётся настроить вручную.

Некоторые параметры kubelet должны быть одинаковыми во всём кластере,
а другие задаются для каждого kubelet отдельно с учётом особенностей машины
(например, ОС, хранилища и сети). Конфигурацией kubelet можно управлять вручную,
но kubeadm предоставляет тип API `KubeletConfiguration` для
[централизованного управления конфигурацией kubelet](#configure-kubelets-using-kubeadm).

<!-- body -->

## Подходы к настройке kubelet {#kubelet-configuration-patterns}

В следующих разделах описаны подходы, которые упрощаются при использовании kubeadm
по сравнению с ручным управлением конфигурацией kubelet на каждом узле.

### Распространение общекластерной конфигурации на каждый kubelet {#propagating-cluster-level-configuration-to-each-kubelet}

Для kubelet можно задать значения по умолчанию, используемые командами `kubeadm init`
и `kubeadm join`. Например, можно выбрать другую среду выполнения контейнеров
или задать подсеть сервисов по умолчанию.

Чтобы использовать `10.96.0.0/12` в качестве подсети сервисов по умолчанию,
передайте kubeadm параметр `--service-cidr`:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Теперь виртуальные IP-адреса сервисов выделяются из этой подсети.
Также необходимо задать адрес DNS, используемый kubelet, флагом `--cluster-dns`.
Эта настройка должна быть одинаковой для всех kubelet на всех управляющих и рабочих узлах кластера.
Kubelet предоставляет версионируемый структурированный объект API для настройки
большинства своих параметров и распространения конфигурации на каждый работающий kubelet.
Этот объект называется [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
Он позволяет задавать флаги, например IP-адреса DNS кластера, в виде списка значений
ключа в стиле camelCase, как в следующем примере:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Подробнее о `KubeletConfiguration` см. [ниже](#configure-kubelets-using-kubeadm).

### Настройка отдельных экземпляров {#providing-instance-specific-configuration-details}

Некоторым машинам нужны особые настройки kubelet из-за различий в оборудовании,
операционной системе, сети или других параметрах. Вот несколько примеров.

- Путь к файлу разрешения DNS, задаваемый флагом `--resolv-conf` kubelet,
  может зависеть от операционной системы и использования `systemd-resolved`.
  Если путь неверен, разрешение DNS на узле с неправильно настроенным kubelet не будет работать.

- Поле `.metadata.name` объекта Node API по умолчанию получает имя хоста машины,
  кроме случаев использования облачного провайдера. Флаг `--hostname-override`
  позволяет задать имя узла, отличающееся от имени хоста.

- В настоящее время kubelet не может автоматически определить драйвер cgroup среды выполнения
  контейнеров, но для корректной работы kubelet значение `--cgroup-driver` должно совпадать
  с драйвером cgroup, используемым средой выполнения.

- Чтобы указать среду выполнения контейнеров, задайте её конечную точку
  флагом `--container-runtime-endpoint=<path>`.

Рекомендуемый способ применения таких индивидуальных настроек —
[патчи `KubeletConfiguration`](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Настройка kubelet с помощью kubeadm {#configure-kubelets-using-kubeadm}

Чтобы настроить kubelet, запускаемый kubeadm, передайте собственный объект API
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
в файле конфигурации: `kubeadm ... --config some-config-file.yaml`.

Команда `kubeadm config print init-defaults --component-configs KubeletConfiguration`
показывает все значения этой структуры по умолчанию.

К базовой `KubeletConfiguration` также можно применять патчи отдельных экземпляров.
Подробнее см. [Настройка kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#kubelet).

### Порядок действий при использовании `kubeadm init` {#workflow-when-using-kubeadm-init}

При вызове `kubeadm init` конфигурация kubelet записывается на диск
в `/var/lib/kubelet/config.yaml`, а также загружается в ConfigMap `kubelet-config`
в пространстве имён `kube-system` кластера.
Кроме того, kubeadm обнаруживает сокет CRI на узле и записывает сведения о нём,
включая путь к сокету, в локальную конфигурацию `/var/lib/kubelet/instance-config.yaml`.
В `/etc/kubernetes/kubelet.conf` также записывается файл конфигурации kubelet
с базовыми общекластерными настройками для всех kubelet. Он указывает на клиентские
сертификаты, позволяющие kubelet обращаться к серверу API. Это решает задачу
[распространения общекластерной конфигурации на каждый kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Для [настройки отдельных экземпляров](#providing-instance-specific-configuration-details)
kubeadm записывает файл окружения `/var/lib/kubelet/kubeadm-flags.env`
со списком флагов, передаваемых kubelet при запуске. Флаги представлены следующим образом:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Помимо флагов запуска kubelet, файл содержит динамические параметры, например драйвер cgroup.

После записи этих двух файлов kubeadm пытается выполнить следующие команды,
если используется systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Если перечитывание конфигурации и перезапуск завершились успешно,
обычный процесс `kubeadm init` продолжается.

### Порядок действий при использовании `kubeadm join` {#workflow-when-using-kubeadm-join}

При выполнении `kubeadm join` kubeadm использует учётные данные Bootstrap Token
для начальной настройки TLS, получая данные доступа для загрузки ConfigMap `kubelet-config`
и записывая его в `/var/lib/kubelet/config.yaml`.
Кроме того, kubeadm обнаруживает сокет CRI на узле и записывает сведения о нём,
включая путь, в локальную конфигурацию `/var/lib/kubelet/instance-config.yaml`.
Динамический файл окружения создаётся точно так же, как при `kubeadm init`.

Затем `kubeadm` выполняет две команды, чтобы kubelet загрузил новую конфигурацию:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

После загрузки новой конфигурации kubelet инструмент kubeadm записывает файл KubeConfig
`/etc/kubernetes/bootstrap-kubelet.conf`, содержащий сертификат CA и Bootstrap Token.
Kubelet использует их для начальной настройки TLS и получения уникальных учётных данных,
которые сохраняются в `/etc/kubernetes/kubelet.conf`.

После записи `/etc/kubernetes/kubelet.conf` начальная настройка TLS завершена.
Затем kubeadm удаляет `/etc/kubernetes/bootstrap-kubelet.conf`.

## Дополнительный файл конфигурации kubelet для systemd {#the-kubelet-drop-in-file-for-systemd}

`kubeadm` поставляется с конфигурацией запуска kubelet через systemd.
Сама команда kubeadm никогда не изменяет этот дополнительный файл.

Файл, устанавливаемый [пакетом](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf)
`kubeadm`, находится в `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`
и используется systemd. Он дополняет базовый
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

Для дальнейшего переопределения настроек создайте каталог `/etc/systemd/system/kubelet.service.d/`
(а не `/usr/lib/systemd/system/kubelet.service.d/`) и поместите туда файл со своими настройками.
Например, локальный файл `/etc/systemd/system/kubelet.service.d/local-overrides.conf`
может переопределять параметры модуля, заданные `kubeadm`.

Пример содержимого `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
Ниже приведён только пример. Если вы не хотите использовать менеджер пакетов,
следуйте инструкциям раздела
[Без менеджера пакетов](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#tabs-k8s-install-2).
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Этот файл задаёт расположения по умолчанию всех файлов kubelet, которыми управляет kubeadm.

- Файл KubeConfig для начальной настройки TLS — `/etc/kubernetes/bootstrap-kubelet.conf`.
  Он используется только при отсутствии `/etc/kubernetes/kubelet.conf`.
- Файл KubeConfig с уникальными учётными данными kubelet — `/etc/kubernetes/kubelet.conf`.
- Файл ComponentConfig kubelet — `/var/lib/kubelet/config.yaml`.
- Динамический файл окружения с `KUBELET_KUBEADM_ARGS` загружается из `/var/lib/kubelet/kubeadm-flags.env`.
- Файл с пользовательскими переопределениями флагов через `KUBELET_EXTRA_ARGS`
  загружается из `/etc/default/kubelet` (для DEB) или `/etc/sysconfig/kubelet` (для RPM).
  `KUBELET_EXTRA_ARGS` находится последним в цепочке флагов и имеет наивысший приоритет при конфликте настроек.

## Бинарные файлы Kubernetes и содержимое пакетов {#kubernetes-binaries-and-package-contents}

С выпусками Kubernetes поставляются следующие пакеты DEB и RPM:

| Имя пакета | Описание |
|--------------|-------------|
| `kubeadm` | Устанавливает инструмент командной строки `/usr/bin/kubeadm` и [дополнительный файл конфигурации kubelet](#the-kubelet-drop-in-file-for-systemd). |
| `kubelet` | Устанавливает бинарный файл `/usr/bin/kubelet`. |
| `kubectl` | Устанавливает бинарный файл `/usr/bin/kubectl`. |
| `cri-tools` | Устанавливает бинарный файл `/usr/bin/crictl` из [Git-репозитория cri-tools](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Устанавливает бинарные файлы в `/opt/cni/bin` из [Git-репозитория plugins](https://github.com/containernetworking/plugins). |
