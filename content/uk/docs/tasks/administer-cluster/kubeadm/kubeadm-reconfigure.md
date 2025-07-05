---
title: Переконфігурація кластера за допомогою kubeadm
content_type: task
weight: 90
---

<!-- overview -->

kubeadm не підтримує автоматизованих способів переконфігурації компонентів, що були розгорнуті на керованих вузлах. Один зі способів автоматизації цього — використання власного [оператора](/docs/concepts/extend-kubernetes/operator/).

Для зміни конфігурації компонентів вам потрібно вручну редагувати повʼязані обʼєкти кластера та файли на диску.

Цей посібник показує правильну послідовність кроків, які потрібно виконати для досягнення переконфігурації кластера kubeadm.

## {{% heading "prerequisites" %}}

- Вам потрібен кластер, що був розгорнутий за допомогою kubeadm.
- У вас мають бути адміністративні облікові дані (`/etc/kubernetes/admin.conf`) та мережеве зʼєднання з робочим kube-apiserver у кластері з хосту, на якому встановлено kubectl.
- Мати текстовий редактор встановлений на всіх хостах.

<!-- steps -->

## Переконфігурація кластера {#reconfigure-the-cluster}

kubeadm записує набір параметрів конфігурації компонентів на рівні кластера у ConfigMaps та в інших обʼєктах. Ці обʼєкти потрібно редагувати вручну. Команда `kubectl edit` може бути використана для цього.

Команда `kubectl edit` відкриє текстовий редактор, в якому ви можете редагувати та зберегти обʼєкт безпосередньо.

Ви можете використовувати змінні середовища `KUBECONFIG` та `KUBE_EDITOR` для вказівки розташування файлу kubeconfig, який використовується kubectl, та обраного текстового редактора.

Наприклад:

```shell
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <параметри>
```

{{< note >}}
Після збереження будь-яких змін у цих обʼєктах кластера, компоненти, що працюють на вузлах, можуть не оновлюватись автоматично. У нижченаведених кроках вказано, як це зробити вручну.
{{< /note >}}

{{< warning >}}
Конфігурація компонентів у ConfigMaps зберігається як неструктуровані дані (рядки YAML). Це означає, що перевірка правильності не буде проводитися при оновленні вмісту ConfigMap. Вам потрібно бути обережними та слідувати документованому формату API для певної конфігурації компонента, а також уникати друкарських помилок та помилок у відступах в YAML.
{{< /warning >}}

### Застосування змін у конфігурації кластера {#applying-cluster-configuration-changes}

#### Оновлення `ClusterConfiguration` {#updating-the-clusterconfiguration}

Під час створення кластера та його оновлення, kubeadm записує [`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/) у ConfigMap, з назвою `kubeadm-config` у просторі імен `kube-system`.

Щоб змінити певну опцію у `ClusterConfiguration`, ви можете редагувати ConfigMap за допомогою цієї команди:

```shell
kubectl edit cm -n kube-system kubeadm-config
```

Конфігурація знаходиться в ключі `data.ClusterConfiguration`.

{{< note >}}
`ClusterConfiguration` включає різноманітні параметри, які впливають на конфігурацію окремих компонентів, таких як kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd та kube-proxy. Зміни в конфігурації повинні бути віддзеркалені в компонентах вузла вручну.
{{< /note >}}

#### Віддзеркалення змін `ClusterConfiguration` на вузлах панелі управління {#reflecting-clusterconfiguration-changes-on-control-plane-nodes}

kubeadm керує компонентами панелі управління як статичними маніфестами Pod, які розташовані в
теці `/etc/kubernetes/manifests`. Будь-які зміни у `ClusterConfiguration` в ключах `apiServer`, `controllerManager`, `scheduler` або `etcd` повинні віддзеркалюватись у відповідних файлах у теці маніфестів на вузлі панелі управління.

Такі зміни можуть включати:

- `extraArgs` — потребує оновлення списку прапорців, які передаються контейнеру компонента
- `extraVolumes` — потребує оновлення точок монтування для контейнера компонента
- `*SANs` — потребує написання нових сертифікатів з Subject Alternative Names.

Перед продовженням цих змін переконайтеся, що ви зробили резервну копію теки `/etc/kubernetes/`.

Для написання нових сертифікатів ви можете використовувати:

```shell
kubeadm init phase certs <component-name> --config <config-file>
```

Для написання нових файлів маніфестів у теці `/etc/kubernetes/manifests` ви можете використовувати:

```shell
# Для компонентів панелі управління Kubernetes
kubeadm init phase control-plane <component-name> --config <config-file>
# Для локального etcd
kubeadm init phase etcd local --config <config-file>
```

Зміст `<config-file>` повинен відповідати оновленням в `ClusterConfiguration`. Значення `<component-name>` повинно бути імʼям компонента панелі управління Kubernetes (`apiserver`, `controller-manager` або `scheduler`).

{{< note >}}
Оновлення файлу у `/etc/kubernetes/manifests` призведе до перезапуску статичного Podʼа для відповідного компонента. Спробуйте робити ці зміни один за одним на вузлі, щоб не переривати роботу кластера.
{{< /note >}}

### Застосування змін конфігурації kubelet {#applying-kubelet-configuration-changes}

#### Оновлення `KubeletConfiguration` {#updating-the-kubeletconfiguration}

Під час створення кластера та оновлення, kubeadm записує [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) у ConfigMap з назвою `kubelet-config` в просторі імен `kube-system`.

Ви можете редагувати цей ConfigMap за допомогою такої команди:

```shell
kubectl edit cm -n kube-system kubelet-config
```

Конфігурація розташована в ключі `data.kubelet`.

#### Віддзеркалення змін в kubelet {#reflecting-the-kubelet-changes}

Щоб віддзеркалити зміни на вузлах kubeadm, вам потрібно виконати наступне:

- Увійдіть на вузол kubeadm.
- Виконайте команду `kubeadm upgrade node phase kubelet-config`, щоб завантажити свіжий вміст `kubelet-config` ConfigMap в локальний файл `/var/lib/kubelet/config.yaml`.
- Відредагуйте файл `/var/lib/kubelet/kubeadm-flags.env`, щоб застосувати додаткову конфігурацію за допомогою прапорців.
- Перезапустіть службу kubelet за допомогою `systemctl restart kubelet`.

{{< note >}}
Виконуйте ці зміни по одному вузлу за раз, щоб дозволити належне перепланування робочих навантажень.
{{< /note >}}

{{< note >}}
Під час оновлення `kubeadm`, kubeadm завантажує `KubeletConfiguration` з ConfigMap `kubelet-config` і перезаписує вміст `/var/lib/kubelet/config.yaml`. Це означає, що локальна конфігурація вузла повинна бути застосована або за допомогою прапорців у `/var/lib/kubelet/kubeadm-flags.env`, або шляхом ручного оновлення вмісту `/var/lib/kubelet/config.yaml` після `kubeadm upgrade`, з подальшим перезапуском kubelet.
{{< /note >}}

### Застосування змін у конфігурації kube-proxy {#applying-kube-proxy-configuration-changes}

#### Оновлення `KubeProxyConfiguration` {#updating-the-kubeproxyconfiguration}

Під час створення кластера та оновлення, `kubeadm` записує [`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/) у ConfigMap в просторі імен `kube-system` з назвою `kube-proxy`.

Цей ConfigMap використовується DaemonSet `kube-proxy` в просторі імен `kube-system`.

Щоб змінити певну опцію в `KubeProxyConfiguration`, ви можете відредагувати ConfigMap за допомогою цієї команди:

```shell
kubectl edit cm -n kube-system kube-proxy
```

Конфігурація знаходиться в ключі `data.config.conf`.

#### Віддзеркалення змін у kube-proxy {#reflecting-the-kube-proxy-changes}

Після оновлення ConfigMap `kube-proxy`, ви можете перезапустити всі Podʼи kube-proxy:

Видаліть Podʼи за допомогою:

```shell
kubectl delete po -n kube-system -l k8s-app=kube-proxy
```

Створюватимуться нові Podʼи, які використовують оновлений ConfigMap.

{{< note >}}
Оскільки `kubeadm` розгортає `kube-proxy` як DaemonSet, конфігурація, специфічна для вузла, не підтримується.
{{< /note >}}

### Застосування змін конфігурації CoreDNS {#applying-coredns-configuration-changes}

#### Оновлення розгортання CoreDNS та сервісу {#updating-the-coredns-deployment-and-service}

kubeadm розгортає CoreDNS як Deployment з назвою `coredns` та Service з назвою `kube-dns`, обидва у просторі імен `kube-system`.

Для оновлення будь-яких налаштувань CoreDNS ви можете редагувати обʼєкти Deployment та Service:

```shell
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

#### Віддзеркалення змін у CoreDNS {#reflecting-the-coredns-changes}

Після застосування змін у CoreDNS ви можете перезапустити його deployment:

```shell
kubectl rollout restart deployment -n kube-system coredns
```

{{< note >}}
kubeadm не дозволяє налаштування CoreDNS під час створення та оновлення кластера. Це означає, що якщо ви виконаєте `kubeadm upgrade apply`, ваші зміни в обʼєктах CoreDNS будуть втрачені та мають бути застосовані повторно.
{{< /note >}}

## Збереження переконфігурації {#persisting-the-reconfiguration}

Під час виконання команди `kubeadm upgrade` на керованому вузлі kubeadm може перезаписати конфігурацію, яка була застосована після створення кластера (переконфігурація).

### Збереження переконфігурації обʼєкту Node {#persisting-node-object-reconfiguration}

kubeadm записує Labels, Taints, сокенти CRI та іншу інформацію в обʼєкті Node для конкретного вузла Kubernetes. Для зміни будь-якого змісту цього обʼєкта Node ви можете використовувати:

```shell
kubectl edit no <імʼя-вузла>
```

Під час виконання `kubeadm upgrade` вміст такого Node може бути перезаписаний. Якщо ви бажаєте зберегти свої зміни в обʼєкті Node після оновлення, ви можете підготувати [команду патча для kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) і застосувати її до обʼєкта Node:

```shell
kubectl patch no <імʼя-вузла> --patch-file <файл-патча>
```

#### Збереження переконфігурації компонента панелі управління {#persisting-control-plane-component-reconfiguration}

Основним джерелом конфігурації панелі управління є обʼєкт `ClusterConfiguration`, збережений у кластері. Для розширення конфігурації статичних маніфестів Podʼів можна використовувати [патчі](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches).

Ці файли патчів повинні залишатися як файли на вузлах панелі управління, щоб забезпечити можливість їх використання командою `kubeadm upgrade ... --patches <directory>`.

Якщо переконфігурування виконується для `ClusterConfiguration` і статичних маніфестів Podʼів на диску, то набір патчів для конкретного вузла повинен бути відповідно оновлений.

#### Збереження переконфігурації kubelet {#persisting-kubelet-reconfiguration}

Будь-які зміни в `KubeletConfiguration`, збережені у `/var/lib/kubelet/config.yaml`, будуть перезаписані під час виконання `kubeadm upgrade`, завантажуючи вміст конфігурації `kubelet-config` ConfigMap для всього кластера. Для збереження конфігурації kubelet для Node потрібно або вручну змінити файл `/var/lib/kubelet/config.yaml` після оновлення, або файл `/var/lib/kubelet/kubeadm-flags.env` може містити прапорці. Прапорці kubelet перевизначають відповідні параметри `KubeletConfiguration`, але слід зауважити, що деякі з прапорців є застарілими.

Після зміни `/var/lib/kubelet/config.yaml` або `/var/lib/kubelet/kubeadm-flags.env` потрібен перезапуск kubelet.

## {{% heading "whatsnext" %}}

- [Оновлення кластерів з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Налаштування компонентів за допомогою API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Управління сертифікатами з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [Дізнайтеся більше про налаштування kubeadm](/docs/reference/setup-tools/kubeadm/)
