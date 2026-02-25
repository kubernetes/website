---
title: Середовище виконання контейнерів
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

Для того, щоб запускати Podʼи на кожному вузлі кластера, потрібно встановити {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}. Ця сторінка надає огляд того, які компоненти беруть в цьому участь, та описує повʼязані завдання для налаштування вузлів.

Kubernetes {{< skew currentVersion >}} вимагає використання runtime, який відповідає специфікації {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Дивіться [Підтримка версій CRI](#cri-versions) для отримання додаткової інформації.

Ця сторінка містить огляд того, як використовувати кілька поширених середовищ виконання контейнерів з Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Релізи Kubernetes до v1.24 включно мали безпосередню інтеграцію з Docker Engine, використовуючи компонент під назвою _dockershim_. Ця безпосередня інтеграція більше не є частиною Kubernetes (про що було [оголошено](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) у випуску v1.20). Ви можете ознайомитись з матеріалами статті [Перевірте, чи вас стосується видалення Dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/), щоб зрозуміти, як це видалення може вплинути на вас. Щоб дізнатися про міграцію з dockershim, перегляньте [Міграція з dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Якщо ви використовуєте версію Kubernetes іншу, ніж v{{< skew currentVersion >}}, перевірте документацію для цієї версії.
{{< /note >}}

<!-- body -->

## Встановлення та налаштування необхідних компонентів{#install-and-configure-prerequisites}

### Конфігурація мережі {#network-configuration}

Стандартно ядро Linux не дозволяє маршрутизувати пакети IPv4 між інтерфейсами. Більшість реалізацій мережі кластера Kubernetes змінить це налаштування (якщо це потрібно), але деякі можуть очікувати, що адміністратор зробить це за них. (Деякі також можуть очікувати встановлення інших параметрів sysctl, завантаження модулів ядра тощо; перевірте документацію для вашої конкретної мережної реалізації.)

### Увімкнення маршрутизації IPv4 пакетів {#prerequisite-ipv4-forwarding-optional}

Для увімкнення вручну маршрутизації IPv4 пакетів:

```bash
# параметри sysctl, необхідні для налаштування, параметри зберігаються після перезавантаження
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Застосувати параметри sysctl без перезавантаження
sudo sysctl --system
```

Перевірте, що `net.ipv4.ip_forward` встановлено на 1 за допомогою:

```bash
sysctl net.ipv4.ip_forward
```

## Драйвери cgroup {#cgroup-drivers}

У Linux використовуються {{< glossary_tooltip text="control groups" term_id="cgroup" >}} для обмеження ресурсів, які виділяються процесам.

І {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, і відповідні середовища виконання контейнерів потребують взаємодії з cgroup для [управління ресурсами для Podʼів та контейнерів](/docs/concepts/configuration/manage-resources-containers/) та встановлення ресурсів, таких як обсяг памʼяті та обчислювальних ресурсів центрального процесора, а також їх обмежень. Щоб взаємодіяти з cgroup, kubelet та середовище виконання контейнерів повинні використовувати _драйвер cgroup_. Важливо, щоб kubelet та середовище виконання контейнерів використовували один і той самий драйвер cgroup та були налаштовані однаково.

Існують два доступні драйвери cgroup:

- [`cgroupfs`](#cgroupfs-cgroup-driver)
- [`systemd`](#systemd-cgroup-driver)

### Драйвер cgroupfs {#cgroupfs-cgroup-driver}

Драйвер `cgroupfs` є [стандартним драйвером cgroup в kubelet](/docs/reference/config-api/kubelet-config.v1beta1). Коли використовується драйвер `cgroupfs`, kubelet та середовище виконання контейнерів безпосередньо взаємодіють
з файловою системою cgroup для їх налаштування.

Драйвер `cgroupfs` **не** рекомендується використовувати, коли [systemd](https://www.freedesktop.org/wiki/Software/systemd/) є системою ініціалізації, оскільки systemd очікує наявності єдиного менеджера cgroup в системі. Крім того, якщо використовуєте [cgroup v2](/docs/concepts/architecture/cgroups), використовуйте драйвер `systemd` cgroup замість `cgroupfs`.

### Драйвер cgroup системи systemd {#systemd-cgroup-driver}

Коли [systemd](https://www.freedesktop.org/wiki/Software/systemd/) вибрано як систему ініціалізації в дистрибутиві Linux, процес ініціалізації створює і використовує кореневу групу cgroup (`cgroup`) та діє як менеджер cgroup.

systemd тісно інтегрований з cgroup та розміщує по одній cgroup на кожному юніті systemd. В результаті, якщо ви використовуєте `systemd` як систему ініціалізації з драйвером `cgroupfs`, система отримує два різних менеджери cgroup.

Наявність двох менеджерів cgroup призводить до двох видів доступних та використаних ресурсів в системі. У деяких випадках вузли, які налаштовані на використання `cgroupfs` для kubelet та середовище виконання контейнерів, але використовують `systemd` для інших процесів, стають нестійкими при зростанні тиску на ресурси.

Підхід до помʼякшення цієї нестійкості — використовувати `systemd` як драйвер cgroup для kubelet та середовище виконання контейнерів, коли `systemd` вибрано системою ініціалізації.

Щоб встановити `systemd` як драйвер cgroup, відредагуйте в [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) опцію `cgroupDriver` та встановіть її в `systemd`. Наприклад:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
Починаючи з v1.22 і пізніше, при створенні кластера за допомогою kubeadm, якщо користувач не встановить поле `cgroupDriver` в `KubeletConfiguration`, kubeadm встановлює типове значення — `systemd`.
{{< /note >}}

Якщо ви конфігуруєте `systemd` як драйвер cgroup для kubelet, вам також слід налаштувати `systemd` як драйвер cgroup для середовища виконання контейнерів. Дивіться документацію для вашого середовища виконання контейнерів для отримання докладних інструкцій. Наприклад:

- [containerd](#containerd-systemd)
- [CRI-O](#cri-o)

У Kubernetes {{< skew currentVersion >}}, з увімкненою [функціональною можливістю](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletCgroupDriverFromCRI` і середовищем виконання контейнерів, яке підтримує `RuntimeConfig` CRI RPC, kubelet автоматично визначає відповідний драйвер cgroup з runtime, та ігнорує налаштування `cgroupDriver` у конфігурації kubelet.

Однак, старі версії середовищ виконання контейнерів (зокрема, containerd 1.y і нижче) не підтримують `RuntimeConfig` CRI RPC і можуть не реагувати правильно на цей запит, тому Kubelet повертається до використання значення у своєму власному прапорці `--cgroup-driver`.

У Kubernetes 1.36 ця поведінка резервного копіювання буде скасована, і старі версії containerd зазнають невдачі з новими kubelet.

{{< caution >}}
Зміна драйвера cgroup вузла, який приєднався до кластера, — це чутлива операція. Якщо kubelet створював Podʼи, використовуючи семантику одного драйвера cgroup, зміна середовища виконання контейнерів на інший драйвер cgroup може спричинити помилки при спробі повторного створення пісочниці Pod для таких наявних Podʼів. Перезапуск kubelet може не вирішити таких помилок.

Якщо у вас є автоматизація, яка дозволяє це зробити, замініть вузол іншим з оновленою конфігурацією, або перевстановіть його за допомогою автоматизації.
{{< /caution >}}

### Міграція на драйвер `systemd` в кластерах, що керуються kubeadm {#migrating-to-systemd-driver-in-kubeadm-managed-clusters}

Якщо ви хочете мігрувати на драйвер `systemd` cgroup в кластерах, що керуються kubeadm, дотримуйтеся рекомендацій [налаштування драйвера cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Підтримка версій CRI {#cri-versions}

Ваше середовище виконання контейнерів повинне підтримувати принаймні версію v1alpha2 інтерфейсу контейнера.

Kubernetes [починаючи з v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal) працює _тільки_ з v1 CRI API. Попередні версії типово
використовують версію v1, проте, якщо середовище виконання контейнерів не підтримує v1 API, kubelet перемкнеться на використання (застарілої) версії API v1alpha2.

## Середовища виконання контейнерів {#container-runtimes}

{{% thirdparty-content %}}

### containerd

У цьому розділі описані необхідні кроки для використання containerd як середовища виконання контейнерів (CRI).

Щоб встановити containerd на вашу систему, дотримуйтеся інструкцій з
[Початок роботи з containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md). Поверніться до цього кроку, якщо ви створили файл конфігурації `config.toml`.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
Ви можете знайти цей файл тут: `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Ви можете знайти цей файл тут: `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

У Linux, типовий CRI-socket для containerd — `/run/containerd/containerd.sock`. У Windows, типова CRI-точка доступу — `npipe://./pipe/containerd-containerd`.

#### Налаштування драйвера cgroup `systemd` {#containerd-systemd}

Щоб використовувати драйвер cgroup `systemd` у `/etc/containerd/config.toml` за допомогою `runc`, встановіть наступний конфіг залежно від вашої версії Containerd

Containerd версії 1.x:

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]


 SystemdCgroup = true
```

Containerd версії 2.x:

```toml
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Драйвер cgroup `systemd` є рекомендованим, якщо ви використовуєте [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Якщо ви встановили containerd за допомогою менеджера пакунків (наприклад, RPM або `.deb`, ви можете знайти, що втулок інтеграції CRI є типово вимкненим.

Вам потрібно увімкнути підтримку CRI для того, щоб мати можливість використовувати containerd в Kubernetes. Переконайтеся, що `cri` немає в `disabled_plugins` у файлі `/etc/containerd/config.toml`; якщо вносили зміни до цього файлу, перезапустіть `containerd`.

Якщо ви стикаєтесь з постійними збоями після початкового встановлення кластера або після встановлення CNI, скоріш за все конфігурація containerd отримана з пакунка містить несумісні налаштування. Зважте на перевстановлення налаштувань containerd, командою `containerd config default > /etc/containerd/config.toml` (див. [getting-strated.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)) і потім внесіть зміни в налаштування, як вказано вище.
{{< /note >}}

Після внесення змін в перезавантажте containerd.

```shell
sudo systemctl restart containerd
```

Використовуючи kubeadm, вручну налаштуйте [cgroup драйвер для kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configure-the-kubelet-cgroup-driver).

У Kubernetes v1.28 ви можете увімкнути alpha-функцію автоматичного виявлення драйвера cgroup. Дивіться [systemd cgroup driver](#systemd-cgroup-driver) для отримання додаткової інформації.

#### Перевизначення образу пісочниці (pause) {#override-pause-image-containerd}

У вашій [конфігурації containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) ви можете перевизначити образ, встановивши наступну конфігурацію:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Можливо, вам доведеться також перезапустити `containerd`, якщо ви оновили файл конфігурації: `systemctl restart containerd`.

### CRI-O

У цьому розділі наведено необхідні кроки для встановлення CRI-O як середовища виконання контейнерів.

Для встановлення CRI-O слід дотримуватися [Інструкцій з встановлення CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### Драйвер cgroup {#cgroup-driver}

CRI-O використовує стандартний драйвер cgroup, який ймовірно буде працювати добре для вас. Для перемикання на драйвер cgroupfs, відредагуйте `/etc/crio/crio.conf` або розмістіть конфігурацію у вигляді окремого файлу в `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, наприклад:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Важливо відзначити змінений `conmon_cgroup`, який повинен бути встановлений в значення `pod` при використанні CRI-O з `cgroupfs`. Зазвичай необхідно синхронізувати конфігурацію драйвера cgroup kubelet (зазвичай встановлюється за допомогою kubeadm) та CRI-O.

У Kubernetes v1.28 можна ввімкнути автоматичне виявлення драйвера cgroup як альфа-функцію. Див. [драйвер cgroup systemd](#systemd-cgroup-driver) докладніше.

Для CRI-O типовий сокет CRI — `/var/run/crio/crio.sock`.

#### Перевизначення образу пісочниці (pause) {#override-pause-image-cri-o}

У вашій [конфігурації CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) ви можете встановити наступне значення конфігурації:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Цей параметр конфігурації підтримує перезавантаження конфігурації в реальному часі для застосування цих змін: `systemctl reload crio` або відсилання сигналу `SIGHUP` процесу `crio`.

### Docker Engine {#docker}

{{< note >}}
Ці інструкції передбачають, що ви використовуєте адаптер [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) для інтеграції Docker Engine з Kubernetes.
{{< /note >}}

1. На кожному з ваших вузлів встановіть Docker для вашого дистрибутиву Linux; дивіться [Інсталяція Docker Engine](https://docs.docker.com/engine/install/#server).

2. Встановіть [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), дотримуючись інструкцій у репозиторій з вихідним кодом.

Для `cri-dockerd` типовий сокет CRI — `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) є комерційно доступною реалізацією середовища виконання контейнерів, яка була раніше відома як Docker Enterprise Edition.

Ви можете використовувати Mirantis Container Runtime з Kubernetes за допомогою відкритої реалізації компонента [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), який входить до складу MCR.

Для отримання докладнішої інформації щодо встановлення Mirantis Container Runtime дивіться [посібник з розгортання MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Перевірте юніт systemd із назвою `cri-docker.socket`, щоб дізнатися шлях до сокета CRI.

#### Перевизначення образу пісочниці (pause) {#override-pause-image-cri-dockerd-mcr}

Адаптер `cri-dockerd` приймає аргумент командного рядка для зазначення образу контейнера, який слід використовувати як інфраструктурний контейнер для Podʼа («pause image»). Аргумент командного рядка, який слід використовувати — `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

Так само як і середовище виконання контейнерів, вашому кластеру знадобиться [втулок мережі](/docs/concepts/extend-kubernetes/networking/#how-to-implement-the-kubernetes-networking-model).
