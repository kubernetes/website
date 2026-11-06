---
title: Керування HugePages
content_type: task
description: Налаштування та керування великими сторінками як ресурсом, придатним для планування, у кластері.
weight: 160
---

<!-- overview -->
{{< feature-state feature_gate_name="HugePages" >}}

Kubernetes підтримує виділення та використання застосунками в Podʼі заздалегідь виділених великих сторінок (huge pages). На цій сторінці описано, як користувачі можуть використовувати великі сторінки.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вузли Kubernetes мають [заздалегідь виділити великі сторінки](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html), щоб вузол міг повідомляти про свою місткість великих сторінок.

Вузол може заздалегідь виділяти великі сторінки кількох розмірів; наприклад, такий рядок у `/etc/default/grub` виділяє `2*1GiB` сторінок розміром 1 GiB і `512*2 MiB` сторінок розміром 2 MiB:

```
GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"
```

Вузли автоматично виявлять усі ресурси великих сторінок і повідомлять про них як про ресурси, придатні для планування.

Коли ви переглянете опис вузла, ви маєте побачити щось подібне до наведеного нижче в розділах `Capacity` та `Allocatable`:

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
Для динамічно виділених сторінок (після завантаження системи) kubelet потрібно перезапустити, щоб нові виділення відобразилися.
{{< /note >}}

<!-- steps -->

## API

Великі сторінки можна використовувати через вимоги до ресурсів на рівні контейнера з назвою ресурсу `hugepages-<size>`, де `<size>` — найкомпактніше двійкове позначення з цілочисельними значеннями, підтримуваними на конкретному вузлі. Наприклад, якщо вузол підтримує розміри сторінок 2048KiB і 1048576KiB, він надаватиме ресурси, придатні для планування, `hugepages-2Mi` та `hugepages-1Gi`. На відміну від CPU або памʼяті, великі сторінки не підтримують надмірне виділення (overcommit). Зверніть увагу, що під час запиту ресурсів великих сторінок також потрібно запитувати ресурси памʼяті або CPU.

Pod може використовувати кілька розмірів великих сторінок в одній специфікації Podʼа. У цьому випадку для всіх монтувань томів потрібно використовувати нотацію `medium: HugePages-<hugepagesize>`.

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

Pod може використовувати `medium: HugePages`, лише якщо він запитує великі сторінки одного розміру.

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

- Запити великих сторінок мають дорівнювати обмеженням. Так відбувається стандартно, якщо обмеження вказано, а запити — ні.
- Великі сторінки ізольовані на рівні контейнера, тому кожен контейнер має власне обмеження у своїй пісочниці cgroup, як запитано в специфікації контейнера.
- Томи EmptyDir на основі великих сторінок не можуть споживати більше памʼяті великих сторінок, ніж запитує Pod.
- Застосунки, що використовують великі сторінки через `shmget()` із `SHM_HUGETLB`, мають працювати з допоміжною групою, яка відповідає `proc/sys/vm/hugetlb_shm_group`.
- Використанням великих сторінок у просторі імен можна керувати через ResourceQuota, подібно до інших обчислювальних ресурсів, таких як `cpu` або `memory`, за допомогою токена `hugepages-<size>`.
