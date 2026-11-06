---
title: Переконфігурація кластера за допомогою kubeadm
content_type: task
weight: 90
---

<!-- overview -->

kubeadm не підтримує автоматизованих способів переконфігурації компонентів, що були розгорнуті на керованих вузлах. Один зі способів автоматизації цього — використання власного [оператора](/docs/concepts/extend-kubernetes/operator/).

Для зміни конфігурації компонентів вам потрібно вручну редагувати повʼязані обʼєкти кластера та файли на диску.

Цей посібник показує правильну послідовність кроків, які потрібно виконати для досягнення переконфігурації кластера kubeadm.

## {{% heading "prerequisites" %}} {#before-you-begin}

- Вам потрібен кластер, що був розгорнутий за допомогою kubeadm.
- У вас мають бути адміністративні облікові дані (`/etc/kubernetes/admin.conf`) та мережеве зʼєднання з робочим kube-apiserver у кластері з хосту, на якому встановлено kubectl.
- На всіх хостах має бути встановлений текстовий редактор.

<!-- steps -->

## Переконфігурація кластера {#reconfiguring-the-cluster}

kubeadm записує набір параметрів конфігурації компонентів на рівні кластера у ConfigMap та інші обʼєкти. Ці обʼєкти потрібно редагувати вручну. Для цього можна використати команду `kubectl edit`.

Команда `kubectl edit` відкриє текстовий редактор, в якому ви можете редагувати та зберегти обʼєкт безпосередньо.

Ви можете використовувати змінні середовища `KUBECONFIG` та `KUBE_EDITOR`, щоб вказати розташування файлу kubeconfig, який використовує kubectl, та бажаний текстовий редактор.

Наприклад:

```
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <parameters>
```

{{< note >}}
Після збереження будь-яких змін у цих обʼєктах кластера компоненти, що працюють на вузлах, можуть не оновитися автоматично. Наведені нижче кроки пояснюють, як зробити це вручну.
{{< /note >}}

{{< warning >}}
Конфігурація компонентів у ConfigMap зберігається як неструктуровані дані (рядок YAML). Це означає, що валідація не виконуватиметься під час оновлення вмісту ConfigMap. Вам потрібно бути обережними та дотримуватися задокументованого формату API для конфігурації певного компонента, а також уникати друкарських помилок та помилок у відступах YAML.
{{< /warning >}}

### Застосування змін у конфігурації кластера {#applying-cluster-configuration-changes}

#### Оновлення `ClusterConfiguration` {#updating-the-clusterconfiguration}

Під час створення кластера та його оновлення kubeadm записує свою [`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/) у ConfigMap з назвою `kubeadm-config` у просторі імен `kube-system`.

Щоб змінити певний параметр у `ClusterConfiguration`, ви можете редагувати ConfigMap за допомогою цієї команди:

```shell
kubectl edit cm -n kube-system kubeadm-config
```

Конфігурація розташована в ключі `data.ClusterConfiguration`.

{{< note >}}
`ClusterConfiguration` включає різноманітні параметри, які впливають на конфігурацію окремих компонентів, таких як kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd та kube-proxy. Зміни в конфігурації повинні бути віддзеркалені в компонентах вузла вручну.
{{< /note >}}

#### Віддзеркалення змін `ClusterConfiguration` на вузлах панелі управління {#reflecting-clusterconfiguration-changes-on-control-plane-nodes}

kubeadm керує компонентами панелі управління як маніфестами статичних Podʼів, які розташовані в теці `/etc/kubernetes/manifests`. Будь-які зміни у `ClusterConfiguration` в ключах `apiServer`, `controllerManager`, `scheduler` або `etcd` повинні бути віддзеркалені у відповідних файлах у теці маніфестів на вузлі панелі управління.

Такі зміни можуть включати:

- `extraArgs` — потребує оновлення списку прапорців, які передаються контейнеру компонента
- `extraVolumes` — потребує оновлення точок монтування для контейнера компонента
- `*SANs` — потребує створення нових сертифікатів з оновленими Subject Alternative Names

Перш ніж вносити ці зміни, переконайтеся, що ви зробили резервну копію теки `/etc/kubernetes/`.

Для створення нових сертифікатів ви можете використовувати:

```shell
kubeadm init phase certs <component-name> --config <config-file>
```

Для створення нових файлів маніфестів у теці `/etc/kubernetes/manifests` ви можете використовувати:

```shell
# Для компонентів панелі управління Kubernetes
kubeadm init phase control-plane <component-name> --config <config-file>
# Для локального etcd
kubeadm init phase etcd local --config <config-file>
```

Вміст `<config-file>` повинен відповідати оновленій `ClusterConfiguration`. Значення `<component-name>` повинно бути імʼям компонента панелі управління Kubernetes (`apiserver`, `controller-manager` або `scheduler`).

{{< note >}}
Оновлення файлу в `/etc/kubernetes/manifests` змусить kubelet перезапустити статичний Pod відповідного компонента. Намагайтеся вносити ці зміни на одному вузлі за раз, щоб кластер працював без простою.
{{< /note >}}

### Застосування змін конфігурації kubelet {#applying-kubelet-configuration-changes}

#### Оновлення `KubeletConfiguration` {#updating-the-kubeletconfiguration}

Під час створення кластера та оновлення kubeadm записує свою [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) у ConfigMap з назвою `kubelet-config` в просторі імен `kube-system`.

Ви можете редагувати цей ConfigMap за допомогою такої команди:

```shell
kubectl edit cm -n kube-system kubelet-config
```

Конфігурація розташована в ключі `data.kubelet`.

#### Віддзеркалення змін в kubelet {#reflecting-the-kubelet-changes}

Щоб віддзеркалити зміни на вузлах kubeadm, вам потрібно виконати таке:

- Увійдіть на вузол kubeadm.
- Виконайте команду `kubeadm upgrade node phase kubelet-config`, щоб завантажити найновіший вміст ConfigMap `kubelet-config` в локальний файл `/var/lib/kubelet/config.yaml`.
- Відредагуйте файл `/var/lib/kubelet/kubeadm-flags.env`, щоб застосувати додаткову конфігурацію за допомогою прапорців.
- Перезапустіть службу kubelet за допомогою `systemctl restart kubelet`.

{{< note >}}
Виконуйте ці зміни по одному вузлу за раз, щоб дозволити належне перепланування робочих навантажень.
{{< /note >}}

{{< note >}}
Під час `kubeadm upgrade` kubeadm завантажує `KubeletConfiguration` з ConfigMap `kubelet-config` і перезаписує вміст `/var/lib/kubelet/config.yaml`. Це означає, що локальна конфігурація вузла повинна бути застосована або за допомогою прапорців у `/var/lib/kubelet/kubeadm-flags.env`, або шляхом ручного оновлення вмісту `/var/lib/kubelet/config.yaml` після `kubeadm upgrade` з подальшим перезапуском kubelet.
{{< /note >}}

### Застосування змін у конфігурації kube-proxy {#applying-kube-proxy-configuration-changes}

#### Оновлення `KubeProxyConfiguration` {#updating-the-kubeproxyconfiguration}

Під час створення кластера та оновлення kubeadm записує свою [`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/) у ConfigMap в просторі імен `kube-system` з назвою `kube-proxy`.

Цей ConfigMap використовується DaemonSet `kube-proxy` в просторі імен `kube-system`.

Щоб змінити певний параметр у `KubeProxyConfiguration`, ви можете відредагувати ConfigMap за допомогою цієї команди:

```shell
kubectl edit cm -n kube-system kube-proxy
```

Конфігурація розташована в ключі `data.config.conf`.

#### Віддзеркалення змін у kube-proxy {#reflecting-the-kube-proxy-changes}

Після оновлення ConfigMap `kube-proxy` ви можете перезапустити всі Podʼи kube-proxy:

Видаліть Podʼи за допомогою:

```shell
kubectl delete po -n kube-system -l k8s-app=kube-proxy
```

Буде створено нові Podʼи, які використовують оновлений ConfigMap.

{{< note >}}
Оскільки `kubeadm` розгортає `kube-proxy` як DaemonSet, конфігурація, специфічна для вузла, не підтримується.
{{< /note >}}

### Застосування змін конфігурації CoreDNS {#applying-coredns-configuration-changes}

#### Оновлення Deployment і Service CoreDNS {#updating-the-coredns-deployment-and-service}

kubeadm розгортає CoreDNS як Deployment з назвою `coredns` та Service з назвою `kube-dns`, обидва у просторі імен `kube-system`.

Для оновлення будь-яких налаштувань CoreDNS ви можете редагувати обʼєкти Deployment та Service:

```shell
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

#### Віддзеркалення змін у CoreDNS {#reflecting-the-coredns-changes}

Після застосування змін у CoreDNS ви можете перезапустити Deployment CoreDNS:

```shell
kubectl rollout restart deployment -n kube-system coredns
```

{{< note >}}
kubeadm не дозволяє налаштування CoreDNS під час створення та оновлення кластера. Це означає, що якщо ви виконаєте `kubeadm upgrade apply`, ваші зміни в обʼєктах CoreDNS будуть втрачені та мають бути застосовані повторно.
{{< /note >}}

## Збереження переконфігурації {#persisting-the-reconfiguration}

Під час виконання команди `kubeadm upgrade` на керованому вузлі kubeadm може перезаписати конфігурацію, яка була застосована після створення кластера (переконфігурація).

### Збереження переконфігурації обʼєкта Node {#persisting-node-object-reconfiguration}

kubeadm записує Labels, Taints, сокет CRI та іншу інформацію в обʼєкт Node для конкретного вузла Kubernetes. Для зміни будь-якого вмісту цього обʼєкта Node ви можете використовувати:

```shell
kubectl edit no <node-name>
```

Під час виконання `kubeadm upgrade` вміст такого Node може бути перезаписаний. Якщо ви бажаєте зберегти свої зміни в обʼєкті Node після оновлення, ви можете підготувати [команду патча для kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) і застосувати її до обʼєкта Node:

```shell
kubectl patch no <node-name> --patch-file <patch-file>
```

#### Збереження переконфігурації компонента панелі управління {#persisting-control-plane-component-reconfiguration}

Основним джерелом конфігурації панелі управління є обʼєкт `ClusterConfiguration`, збережений у кластері. Для розширення конфігурації статичних маніфестів Podʼів можна використовувати [патчі](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches).

Ці файли патчів повинні залишатися як файли на вузлах панелі управління, щоб забезпечити можливість їх використання командою `kubeadm upgrade ... --patches <directory>`.

Якщо переконфігурування виконується для `ClusterConfiguration` і статичних маніфестів Podʼів на диску, то набір патчів для конкретного вузла повинен бути відповідно оновлений.

#### Збереження переконфігурації kubelet {#persisting-kubelet-reconfiguration}

Будь-які зміни в `KubeletConfiguration`, збережені у `/var/lib/kubelet/config.yaml`, будуть перезаписані під час `kubeadm upgrade` вмістом ConfigMap `kubelet-config` для всього кластера. Щоб зберегти специфічну для вузла конфігурацію kubelet, потрібно або вручну оновити файл `/var/lib/kubelet/config.yaml` після оновлення, або додати прапорці у файл `/var/lib/kubelet/kubeadm-flags.env`. Прапорці kubelet перевизначають відповідні параметри `KubeletConfiguration`, але слід зауважити, що деякі з прапорців є застарілими.

Після зміни `/var/lib/kubelet/config.yaml` або `/var/lib/kubelet/kubeadm-flags.env` потрібен перезапуск kubelet.

## {{% heading "whatsnext" %}} {#what-s-next}

- [Оновлення кластерів з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Налаштування компонентів за допомогою API kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Управління сертифікатами з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [Дізнайтеся більше про налаштування kubeadm](/docs/reference/setup-tools/kubeadm/)
