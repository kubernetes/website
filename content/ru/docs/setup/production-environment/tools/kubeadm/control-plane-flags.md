---
title: Настройка компонентов через API kubeadm
content_type: concept
weight: 40
---

<!-- overview -->

На этой странице описана настройка компонентов, развёртываемых kubeadm.
Для компонентов управляющего слоя можно использовать флаги структуры `ClusterConfiguration`
или патчи для отдельных узлов. Для kubelet и kube-proxy используются соответственно
`KubeletConfiguration` и `KubeProxyConfiguration`.

Все эти возможности доступны через API конфигурации kubeadm.
Подробности о каждом поле конфигурации приведены в
[справочнике API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
Об изменении конфигурации уже созданного кластера см.
[Перенастройка кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Настройка управляющего слоя флагами в `ClusterConfiguration` {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

Объект `ClusterConfiguration` kubeadm позволяет переопределять флаги по умолчанию,
передаваемые компонентам управляющего слоя: APIServer, ControllerManager, Scheduler и Etcd.
Компоненты определяются следующими структурами:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Эти структуры содержат общее поле `extraArgs`, состоящее из пар `name` / `value`.
Чтобы переопределить флаг компонента управляющего слоя:

1. Добавьте соответствующее поле `extraArgs` в конфигурацию.
2. Добавьте флаги в поле `extraArgs`.
3. Выполните `kubeadm init` с `--config <YOUR CONFIG YAML>`.

{{< note >}}
Чтобы создать объект `ClusterConfiguration` со значениями по умолчанию,
выполните `kubeadm config print init-defaults` и сохраните вывод в выбранный файл.
{{< /note >}}

{{< note >}}
В настоящее время объект `ClusterConfiguration` глобален для кластера kubeadm.
Поэтому добавленные флаги применяются ко всем экземплярам одного компонента на разных узлах.
Для индивидуальной настройки компонентов на разных узлах используйте [патчи](#patches).
{{< /note >}}

{{< note >}}
Повторяющиеся флаги (ключи), то есть передача одного и того же флага `--foo` несколько раз,
в настоящее время не поддерживаются. Для обхода этого ограничения используйте [патчи](#patches).
{{< /note >}}

### Флаги APIServer {#apiserver-flags}

Подробнее см. [справочную документацию kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Пример использования:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### Флаги ControllerManager {#controllermanager-flags}

Подробнее см. [справочную документацию kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Пример использования:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### Флаги Scheduler {#scheduler-flags}

Подробнее см. [справочную документацию kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Пример использования:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Флаги Etcd {#etcd-flags}

Подробнее см. [документацию сервера etcd](https://etcd.io/docs/).

Пример использования:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Настройка с помощью патчей {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm позволяет указать каталог с файлами патчей в `InitConfiguration`,
`JoinConfiguration` и `UpgradeConfiguration` на отдельных узлах.
Патчи применяются на последнем этапе настройки перед записью конфигурации компонентов на диск.

Следующий файл можно передать `kubeadm init` с помощью `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Для `kubeadm init` можно передать файл, содержащий `ClusterConfiguration`
и `InitConfiguration`, разделённые строкой `---`.
{{< /note >}}

Следующий файл можно передать `kubeadm join` с помощью `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Если вы обновляете узлы kubeadm командами `kubeadm upgrade apply` и `kubeadm upgrade node`,
нужно снова предоставить те же патчи, чтобы сохранить настройки после обновления.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

Каталог должен содержать файлы с именами `target[suffix][+patchtype].extension`.
Например, `kube-apiserver0+merge.yaml` или просто `etcd.json`.

- `target` может быть `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
  `kubeletconfiguration` или `corednsdeployment`.
- `suffix` — необязательная строка, определяющая порядок применения патчей
  при буквенно-цифровой сортировке.
- `patchtype` может быть `strategic`, `merge` или `json` и должен соответствовать
  [поддерживаемым kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch)
  форматам патчей. Значение `patchtype` по умолчанию — `strategic`.
- `extension` должно быть `json` или `yaml`.

## Настройка kubelet {#kubelet}

Чтобы настроить kubelet, добавьте [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
рядом с `ClusterConfiguration` или `InitConfiguration` в том же файле конфигурации,
разделив их строкой `---`. Передайте этот файл `kubeadm init`, и kubeadm применит
одну и ту же базовую `KubeletConfiguration` ко всем узлам кластера.

Чтобы дополнить базовую `KubeletConfiguration` настройками отдельного экземпляра,
используйте [цель патча `kubeletconfiguration`](#patches).

Другой вариант — переопределить настройки флагами kubelet, передав их в поле
`nodeRegistration.kubeletExtraArgs`, поддерживаемое `InitConfiguration` и `JoinConfiguration`.
Некоторые флаги kubelet устарели, поэтому перед использованием проверьте их статус
в [справочной документации kubelet](/docs/reference/command-line-tools-reference/kubelet).

Подробнее см. [Настройка каждого kubelet в кластере с помощью kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).

## Настройка kube-proxy {#customizing-kube-proxy}

Для настройки kube-proxy передайте `kubeadm init` объект `KubeProxyConfiguration`
рядом с `ClusterConfiguration` или `InitConfiguration`, разделив их строкой `---`.

Подробнее см. [справочник API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm развёртывает kube-proxy в виде {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}},
поэтому `KubeProxyConfiguration` применяется ко всем экземплярам kube-proxy в кластере.
{{< /note >}}

## Настройка CoreDNS {#customizing-coredns}

kubeadm позволяет настраивать Deployment CoreDNS с помощью
[цели патча `corednsdeployment`](#patches).

Патчи для других объектов API, связанных с CoreDNS, например
[ConfigMap](/docs/concepts/configuration/configmap/) `kube-system/coredns`,
пока не поддерживаются. Такие объекты необходимо изменять вручную с помощью kubectl,
а затем пересоздавать [поды](/docs/concepts/workloads/pods/) CoreDNS.

Также можно отключить развёртывание CoreDNS в kubeadm, добавив
в `ClusterConfiguration` следующий параметр:

```yaml
dns:
  disabled: true
```

Выполнив следующую команду:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

можно получить файл манифеста, который kubeadm создал бы для CoreDNS в вашей конфигурации.
