---
title: Керування HugePages
content_type: task
description: Налаштування та керування великими сторінками як запланованим ресурсом в кластері.
weight: 160
---

<!-- overview -->
{{< feature-state feature_gate_name="HugePages" >}}

Kubernetes підтримує виділення та використання заздалегідь розміщених великих сторінок (huge pages) застосунками в Podʼі. Ця сторінка описує, як користувачі можуть використовувати великі сторінки.

## {{% heading "prerequisites" %}}

На вузлах Kubernetes необхідно [перед використанням резервувати місце під великі сторінки](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html), щоб вузол зміг вказати свою ємність для великих сторінок.

Вузол може резервувати великі сторінки різних розмірів, наприклад, наступний рядок у файлі `/etc/default/grub` резервує `2*1 ГБ` памʼяті для сторінок розміром 1 ГБ і `512*2 МБ` для сторінок розміром 2 МБ:

```
GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"
```

Вузли автоматично виявлять та повідомлять про всі великі сторінки як планові ресурси.

Під час опису вузла ви повинні побачити щось подібне до наступного у розділах `Capacity` та `Allocatable`:

```
Capacity:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
Allocatable:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
```

{{< note >}}
Для динамічно виділених сторінок (після завантаження), Kubelet потрібно перезапустити, щоб нові обсяги були показані.
{{< /note >}}

<!-- steps -->

## API

Великі сторінки можна використовувати за допомогою вимог до ресурсів на рівні контейнера з використанням імені ресурсу `hugepages-<size>`, де `<size>` — це найбільш компактне двійкове позначення з використанням цілочисельних значень, які підтримуються на певному вузлі. Наприклад, якщо вузол підтримує розміри сторінок 2048KiB та 1048576KiB, він буде показувати розміри `hugepages-2Mi` та `hugepages-1Gi`. На відміну від CPU або памʼяті, великі сторінки не підтримують перевищення. Зверніть увагу, що при запиті ресурсів великих сторінок також потрібно вказувати ресурси памʼяті або CPU.

Pod може мати різні розміри великих сторінок в одній специфікації Podʼа. У цьому випадку для всіх точок монтування томів вона повинна використовувати нотацію `medium: HugePages-<hugepagesize>`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

Pod може використовувати `medium: HugePages` лише у випадку, якщо він запитує великі сторінки лише одного розміру.


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- Запити великих сторінок повинні дорівнювати лімітам. Це є стандартним, якщо ліміти вказані, а запити — ні.
- Великі сторінки ізольовані на рівні контейнера, тому кожен контейнер має власний ліміт, як вказано у специфікації контейнера.
- Томи EmptyDir, що підтримуються великими сторінками, не можуть споживати більше памʼяті великих сторінок, ніж запитується для Podʼа.
- Застосунки, які використовують великі сторінки за допомогою `shmget()` з `SHM_HUGETLB`, повинні працювати з допоміжною групою, яка відповідає за `proc/sys/vm/hugetlb_shm_group`.
- Використанням великих сторінок у просторі імен можливо керувати за допомогою ResourceQuota, подібно іншим обчислювальним ресурсам, таким як `cpu` або `memory`, використовуючи токен `hugepages-<size>`.
