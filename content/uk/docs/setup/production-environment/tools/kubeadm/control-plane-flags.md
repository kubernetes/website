---
title: Налаштування компонентів за допомогою kubeadm API
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано, як налаштувати компоненти, які розгортає kubeadm. Для компонентів панелі управління можна використовувати прапорці в структурі `ClusterConfiguration` або патчі для окремих вузлів. Для kubelet і kube-proxy можна використовувати `KubeletConfiguration` та `KubeProxyConfiguration` відповідно.

Усе це можна зробити через API конфігурації kubeadm. Докладніше про кожне поле конфігурації див. на наших [довідкових сторінках API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
Щоб переналаштувати вже створений кластер, див. [Переконфігурація кластера за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Налаштування панелі управління за допомогою прапорців у `ClusterConfiguration` {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

Обʼєкт kubeadm `ClusterConfiguration` дає змогу користувачам перевизначати стандартні прапорці, що передаються компонентам панелі управління, як-от APIServer, ControllerManager, Scheduler та Etcd. Компоненти визначаються за допомогою таких структур:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Ці структури містять спільне поле `extraArgs`, яке складається з пар `name` / `value`. Щоб перевизначити прапорець для компонента панелі управління:

1. Додайте відповідні `extraArgs` до вашої конфігурації.
2. Додайте прапорці до поля `extraArgs`.
3. Запустіть `kubeadm init` з `--config <YOUR CONFIG YAML>`.

{{< note >}}
Ви можете згенерувати обʼєкт `ClusterConfiguration` зі стандартними значеннями, виконавши `kubeadm config print init-defaults` і зберігши вивід у файл на ваш вибір.
{{< /note >}}

{{< note >}}
Обʼєкт `ClusterConfiguration` наразі є глобальним у кластерах kubeadm. Це означає, що будь-які прапорці, які ви додаєте, будуть застосовуватися до всіх екземплярів того самого компонента на різних вузлах. Щоб застосовувати індивідуальну конфігурацію для кожного компонента на різних вузлах, ви можете використовувати [патчі](#patches).
{{< /note >}}

{{< note >}}
Дублювання прапорців (ключів) або передавання одного й того самого прапорця `--foo` кілька разів наразі не підтримується. Щоб обійти це, слід використовувати [патчі](#patches).
{{< /note >}}

### Прапорці APIServer {#apiserver-flags}

Докладну інформацію див. у [довідковій документації для kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Приклад використання:

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

### Прапорці ControllerManager {#controllermanager-flags}

Докладну інформацію див. у [довідковій документації для kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Приклад використання:

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

### Прапорці планувальника {#scheduler-flags}

Докладну інформацію див. у [довідковій документації для kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Приклад використання:

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

### Прапорці etcd {#etcd-flags}

Докладну інформацію див. у [документації сервера etcd](https://etcd.io/docs/).

Приклад використання:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Налаштування за допомогою патчів {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm дає змогу передавати теку з файлами патчів в `InitConfiguration`, `JoinConfiguration` та `UpgradeConfiguration` на окремих вузлах. Ці патчі можна використовувати як останній крок налаштування перед записом конфігурації компонента на диск.

Ви можете передати цей файл в `kubeadm init` за допомогою `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Для `kubeadm init` ви можете передати файл, який містить як `ClusterConfiguration`, так і `InitConfiguration`, розділені `---`.
{{< /note >}}

Ви можете передати цей файл в `kubeadm join` за допомогою `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Якщо ви використовуєте `kubeadm upgrade apply` та `kubeadm upgrade node` для оновлення вузлів kubeadm, ви маєте знову надати ті самі патчі, щоб налаштування збереглися після оновлення.

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

Тека має містити файли з назвами `target[suffix][+patchtype].extension`. Наприклад, `kube-apiserver0+merge.yaml` або просто `etcd.json`.

- `target` може бути одним із `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
`kubeletconfiguration` та `corednsdeployment`.
- `suffix` — це необовʼязковий рядок, за яким можна визначити, які патчі застосовуються першими, в алфавітно-цифровому порядку.
- `patchtype` може бути одним із `strategic`, `merge` або `json`, і ці значення мають відповідати форматам патчів, [які підтримує kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch). Стандартний `patchtype` — `strategic`.
- `extension` має бути `json` або `yaml`.

## Налаштування kubelet {#kubelet}

Щоб налаштувати kubelet, ви можете додати [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) поруч із `ClusterConfiguration` або `InitConfiguration`, розділивши їх `---` у тому самому файлі конфігурації. Потім цей файл можна передати до `kubeadm init`, і kubeadm застосує ту саму базову `KubeletConfiguration` до всіх вузлів у кластері.

Щоб застосувати конфігурацію, специфічну для екземпляра, поверх базової `KubeletConfiguration`, можна використати [ціль патчу `kubeletconfiguration`](#patches).

Також можна використовувати прапорці kubelet як перевизначення, передаючи їх у поле `nodeRegistration.kubeletExtraArgs`, яке підтримують і `InitConfiguration`, і `JoinConfiguration`. Деякі прапорці kubelet застарілі, тому перевірте їхній статус у [довідковій документації kubelet](/docs/reference/command-line-tools-reference/kubelet), перш ніж їх використовувати.

Докладніше див. [Налаштування кожного kubelet у кластері за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

## Налаштування kube-proxy {#customizing-kube-proxy}

Щоб налаштувати kube-proxy, можна передати `KubeProxyConfiguration` поруч із `ClusterConfiguration` або `InitConfiguration` до `kubeadm init`, розділивши їх `---`.

Докладніше див. на наших [довідкових сторінках API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm розгортає kube-proxy як {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, тобто `KubeProxyConfiguration` застосовуватиметься до всіх екземплярів kube-proxy у кластері.
{{< /note >}}

## Налаштування CoreDNS {#customizing-coredns}

kubeadm дає змогу налаштувати Deployment CoreDNS за допомогою патчів для [цілі патчу `corednsdeployment`](#patches).

Патчі для інших обʼєктів API, повʼязаних з CoreDNS, як-от {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} `kube-system/coredns`, наразі не підтримуються. Ви маєте вручну застосувати патчі до будь-якого з цих обʼєктів за допомогою kubectl, а потім перестворити {{< glossary_tooltip text="Podʼи" term_id="pod" >}} CoreDNS.

Інакше ви можете вимкнути розгортання CoreDNS у kubeadm, додавши такий параметр до вашого `ClusterConfiguration`:

```yaml
dns:
  disabled: true
```

Також, виконавши таку команду:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

ви можете отримати файл маніфесту, який kubeadm створив би для CoreDNS у вашому середовищі.
