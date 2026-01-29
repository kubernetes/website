---
title: Про cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

У Linux {{< glossary_tooltip text="control groups" term_id="cgroup" >}} обмежують ресурси, які виділяються процесам.

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та середовище виконання контейнерів повинні співпрацювати з cgroups для забезпечення [управління ресурсами для Podʼів та контейнерів](/docs/concepts/configuration/manage-resources-containers/), що включає запити та обмеження на CPU/памʼяті для контейнеризованих навантажень.

Є дві версії cgroups у Linux: cgroup v1 і cgroup v2. cgroup v2 — це нове покоління API `cgroup` в Linux.

<!-- body -->

## Що таке cgroup v2? {#cgroup-v2}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 — це наступне покоління API Linux `cgroup`. cgroup v2 надає єдину систему управління з розширеними можливостями управління ресурсами.

cgroup v2 пропонує кілька поліпшень порівняно з cgroup v1, таких як:

- Один уніфікований дизайн ієрархії в API
- Безпечне делегування піддерева контейнерам
- Нові можливості, такі як [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Розширене управління розподілом ресурсів та ізоляція між різними ресурсами
  - Обʼєднаний облік різних типів виділення памʼяті (мережева памʼять, памʼять ядра і т. д.)
  - Облік негайних змін ресурсів, таких як запис кешу сторінок

Деякі можливості Kubernetes використовують виключно cgroup v2 для поліпшення управління ресурсами та ізоляцією. Наприклад, можливість [MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) покращує якість обслуговування памʼяті та покладається на примітиви cgroup v2.

## Використання cgroup v2 {#using-cgroupv2}

Рекомендованим способом використання cgroup v2 є використання дистрибутиву Linux, який типово має та використовує cgroup v2.

Щоб перевірити, чи ваш дистрибутив використовує cgroup v2, див. [Визначення версії cgroup на вузлах Linux](#check-cgroup-version).

### Вимоги {#requirements}

cgroup v2 має наступні вимоги:

- Дистрибутив ОС включає cgroup v2
- Версія ядра Linux — 5.8 або пізніше
- Середовище виконання контейнерів підтримує cgroup v2. Наприклад:
  - [containerd](https://containerd.io/) v1.4 і новіше
  - [cri-o](https://cri-o.io/) v1.20 і новіше
- kubelet та середовище виконання контейнерів налаштовані на використання [cgroup-драйвера systemd](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Підтримка cgroup v2 дистрибутивами Linux {#linux-distribution-cgroup-v2-support}

Для ознайомлення зі списком дистрибутивів Linux, які використовують cgroup v2, див. [документацію cgroup v2](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- цей список повинен бути узгоджений з https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
- Container Optimized OS (з версії M97)
- Ubuntu (з версії 21.10, рекомендовано 22.04+)
- Debian GNU/Linux (з Debian 11 bullseye)
- Fedora (з версії 31)
- Arch Linux (з квітня 2021)
- RHEL та схожі дистрибутиви (з версії 9)

Щоб перевірити, чи ваш дистрибутив використовує cgroup v2, див. документацію вашого дистрибутиву або скористайтеся інструкціями в [Визначенні версії cgroup на вузлах Linux](#check-cgroup-version).

Також можна включити cgroup v2 вручну у вашому дистрибутиві Linux, змінивши аргументи завантаження ядра. Якщо ваш дистрибутив використовує GRUB, `systemd.unified_cgroup_hierarchy=1` повинно бути додано в `GRUB_CMDLINE_LINUX` в `/etc/default/grub`, а потім виконайте `sudo update-grub`. Однак рекомендованим підходом є використання дистрибутиву, який вже стандартно має cgroup v2.

### Міграція на cgroup v2 {#migrating-cgroupv2}

Щоб перейти на cgroup v2, переконайтеся, що ваша система відповідаєте [вимогам](#requirements), а потім оновіть її до версії ядра, яка стандартно має cgroup v2.

Kubelet автоматично виявляє, що ОС працює з cgroup v2 і виконує відповідно без додаткової конфігурації.

При переході на cgroup v2 не повинно бути помітної різниці в використані, якщо користувачі не звертаються безпосередньо до файлової системи cgroup чи на вузлі, чи зсередини контейнерів.

cgroup v2 використовує інший API, ніж cgroup v1, тому, якщо є застосунки, які безпосередньо отримують доступ до файлової системи cgroup, вони повинні бути оновлені до новіших версій, які підтримують cgroup v2. Наприклад:

- Деякі сторонні агенти моніторингу та безпеки можуть залежати від файлової системи cgroup. Оновіть ці агенти до версій, які підтримують cgroup v2.
- Якщо ви використовуєте [cAdvisor](https://github.com/google/cadvisor) як окремий DaemonSet для моніторингу Podʼів та контейнерів, оновіть його до v0.43.0 чи новіше.
- Якщо ви розгортаєте Java-застосунки, віддайте перевагу використанню версій, які повністю підтримують cgroup v2:
  - [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 та пізніше
  - [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0 та пізніше
  - [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 та пізніше
- Якщо ви використовуєте пакунок [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs), переконайтеся, що ви використовуєте версію v1.5.1 чи вище.

## Визначення версії cgroup на вузлах Linux {#check-cgroup-version}

Версія cgroup залежить від використаного дистрибутиву Linux та версії cgroup, налаштованої в ОС. Щоб перевірити, яка версія cgroup використовується вашим дистрибутивом, виконайте команду `stat -fc %T /sys/fs/cgroup/` на вузлі:

```shell
stat -fc %T /sys/fs/cgroup/
```

Для cgroup v2 вивід — `cgroup2fs`.

Для cgroup v1 вивід — `tmpfs.`

## Визнання застарілим cgroup v1 {#deprecation-of-cgroup-v1}

{{< feature-state for_k8s_version="v1.35" state="deprecated" >}}

Kubernetes оголосив cgroup v1 застарілим. Видалення відбудеться відповідно до [політики застарівання Kubernetes](/docs/reference/using-api/deprecation-policy/).

Kubelet більше не буде запускатися на вузлі cgroup v1. Щоб вимкнути це налаштування, адміністратор кластера повинен встановити `failCgroupV1` на false у [файлі конфігурації kubelet](/docs/tasks/administer-cluster/kubelet-config-file/).

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Дізнайтеся більше про [середовище виконання контейнерів](/docs/concepts/architecture/cri)
- Дізнайтеся більше про [драйвери cgroup](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
