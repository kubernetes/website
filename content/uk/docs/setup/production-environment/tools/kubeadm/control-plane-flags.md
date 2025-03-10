---
title: Налаштування компонентів за допомогою kubeadm API
content_type: concept
weight: 40
---

<!-- overview -->

Ця сторінка охоплює способи налаштування компонентів, які розгортаються за допомогою kubeadm. Для компонентів панелі управління можна використовувати прапорці у структурі `ClusterConfiguration` або патчі на рівні вузла. Для kubelet і kube-proxy ви можете використовувати `KubeletConfiguration` та `KubeProxyConfiguration`, відповідно.

Всі ці опції можливі за допомогою конфігураційного API kubeadm. Докладніше про кожне поле в конфігурації ви можете дізнатися на наших [довідкових сторінках API](/uk/docs/reference/config-api/kubeadm-config.v1beta3/).

{{< note >}}
На жаль, наразі не підтримується налаштування розгортання CoreDNS за допомогою kubeadm. Вам слід вручну патчити {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} `kube-system/coredns` та перестворити {{< glossary_tooltip text="Pods" term_id="pod" >}} CoreDNS після цього. Альтернативно, ви можете пропустити типове розгортання CoreDNS та розгорнути свій варіант. Докладніше про це читайте у [Використання фаз ініціалізації з kubeadm](/uk/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
{{< /note >}}

{{< note >}}
Щоб переконфігурувати кластер, який вже був створений, дивіться [Переконфігурація кластера з kubeadm](/uk/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Налаштовування панелі управління за допомогою прапорців у `ClusterConfiguration` {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

Обʼєкт конфігурації панелі управління kubeadm надає можливість користувачам перевизначати типові прапорці, що передаються компонентам панелі управління, таким як APIServer, ControllerManager, Scheduler та Etcd. Компоненти визначаються за допомогою наступних структур:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Ці структури містять спільне поле `extraArgs`, яке складається з пар `name` / `value`. Щоб перевизначити прапорець для компонента панелі управління:

1. Додайте відповідні `extraArgs` до вашої конфігурації.
2. Додайте прапорці до поля `extraArgs`.
3. Запустіть `kubeadm init` з `--config <ВАШ КОНФІГ YAML>`.

{{< note >}}
Ви можете згенерувати обʼєкт `ClusterConfiguration` з типовими значеннями, використовуючи `kubeadm config print init-defaults` і зберігши вивід у файл на ваш вибір.
{{< /note >}}

{{< note >}}
Обʼєкт `ClusterConfiguration` наразі є глобальним у кластерах kubeadm. Це означає, що будь-які прапорці, які ви додаєте, будуть застосовуватися до всіх екземплярів того самого компонента на різних вузлах. Щоб застосовувати індивідуальну конфігурацію для кожного компонента на різних вузлах, ви можете використовувати [патчі](#patches).
{{< /note >}}

{{< note >}}
Дублювання прапорців (ключів) або передача одного й того ж прапорця `--foo` кілька разів наразі не підтримується. Для обходу цього обмеження слід використовувати [патчі](#patches).
{{< /note >}}

### Прапорці APIServer {#apiserver-flags}

Докладну інформацію див. у [довідковій документації для kube-apiserver](/uk/docs/reference/command-line-tools-reference/kube-apiserver/).

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

Докладну інформацію див. у [довідковій документації для kube-controller-manager](/uk/docs/reference/command-line-tools-reference/kube-controller-manager/).

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

Докладну інформацію див. у [довідковій документації для kube-scheduler](/uk/docs/reference/command-line-tools-reference/kube-scheduler/).

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

### Налаштування за допомогою патчів {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm дозволяє передавати теку з файлами патчів в `InitConfiguration` та `JoinConfiguration` на окремих вузлах. Ці патчі можна використовувати як останній крок налаштування перед записом конфігурації компонента на диск.

Ви можете передати цей файл в `kubeadm init` за допомогою `--config <ВАШ КОНФІГ YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Для `kubeadm init` ви можете передати файл, який містить як `ClusterConfiguration`, так і `InitConfiguration` розділені `---`.
{{< /note >}}

Ви можете передати цей файл в `kubeadm join` за допомогою `--config <ВАШ КОНФІГ YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Тека має містити файли з назвами `target[suffix][+patchtype].extension`.
Наприклад, `kube-apiserver0+merge.yaml` або просто `etcd.json`.

- `target` може бути одним із `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd` та `kubeletconfiguration`.
- `suffix` — це необовʼязковий рядок, який можна використовувати для визначення порядку застосування патчів за алфавітною послідовністю.
- `patchtype` може бути одним із `strategic`, `merge` або `json` і вони повинні відповідати форматам патчів, [підтримуваним kubectl](/uk/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch). Типово `patchtype` — `strategic`.
- `extension` повинен бути або `json`, або `yaml`.

{{< note >}}
Якщо ви використовуєте `kubeadm upgrade` для оновлення ваших вузлів kubeadm, вам слід знову надати ті самі патчі, щоб налаштування залишалося після оновлення. Для цього ви можете використовувати прапорець `--patches`, який повинен вказувати на той самий каталог. `kubeadm upgrade` зараз не підтримує структуру конфігурації API,
яка може бути використана для того самого.
{{< /note >}}

## Налаштування kubelet {#kubelet}

Щоб налаштувати kubelet, ви можете додати [`KubeletConfiguration`](/uk/docs/reference/config-api/kubelet-config.v1beta1/) поруч із `ClusterConfiguration` або `InitConfiguration`, розділеними `---` у тому самому файлі конфігурації. Цей файл потім можна передати до `kubeadm init`, і kubeadm застосує ту ж саму базову `KubeletConfiguration` для всіх вузлів у кластері.

Для застосування конфігурації, специфічної для екземпляра, понад базовою `KubeletConfiguration`, ви можете використовувати ціль патчу [`kubeletconfiguration`](#patches).

Також ви можете використовувати прапорці kubelet як перевизначення, передаючи їх у поле `nodeRegistration.kubeletExtraArgs`, яке підтримується як `InitConfiguration`, так і `JoinConfiguration`. Деякі прапорці kubelet є застарілими, тому перевірте їх статус у [довідковій документації kubelet](/uk/docs/reference/command-line-tools-reference/kubelet), перш ніж їх використовувати.

Додаткові деталі дивіться в розділі [Налаштування кожного kubelet у вашому кластері за допомогою kubeadm](/uk/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

## Налаштування kube-proxy {#customizing-kube-proxy}

Щоб налаштувати kube-proxy, ви можете передати `KubeProxyConfiguration` поруч з `ClusterConfiguration` або `InitConfiguration` до `kubeadm init`, розділені `---`.

Для отримання докладнішої інформації ви можете перейти на наші [сторінки API-посилань](/uk/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm розгортає kube-proxy як {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, що означає, що `KubeProxyConfiguration` буде застосовуватися до всіх екземплярів kube-proxy в кластері.
{{< /note >}}
