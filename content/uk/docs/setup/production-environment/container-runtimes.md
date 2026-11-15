---
title: Середовища виконання контейнерів
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

Щоб Podʼи могли працювати на кожному вузлі кластера, на нього потрібно встановити {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}. На цій сторінці описано, що для цього потрібно, і повʼязані завдання з налаштування вузлів.

Kubernetes {{< skew currentVersion >}} вимагає використання середовища виконання, яке відповідає {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Докладніше див. [Підтримка версій CRI](#cri-versions).

Ця сторінка містить огляд того, як використовувати кілька поширених середовищ виконання контейнерів з Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Релізи Kubernetes до v1.24 містили пряму інтеграцію з Docker Engine за допомогою компонента _dockershim_. Ця спеціальна пряма інтеграція більше не є частиною Kubernetes (про її вилучення було [оголошено](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) у випуску v1.20). Прочитайте [Перевірка впливу видалення dockershim на ваш кластер](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/), щоб зрозуміти, як це вилучення може вплинути на вас. Про міграцію з dockershim див. [Міграція з dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Якщо ви використовуєте версію Kubernetes, відмінну від v{{< skew currentVersion >}}, перегляньте документацію для цієї версії.
{{< /note >}}

<!-- body -->

## Встановлення та налаштування необхідних компонентів {#install-and-configure-prerequisites}

### Конфігурація мережі {#network-configuration}

Стандартно ядро Linux не дозволяє маршрутизувати пакети IPv4 між інтерфейсами. Більшість реалізацій мережі кластера Kubernetes змінять це налаштування (за потреби), але деякі можуть очікувати, що це зробить адміністратор. (Деякі також можуть очікувати, що будуть встановлені інші параметри sysctl, завантажені модулі ядра тощо; зверніться до документації вашої мережевої реалізації.)

### Увімкнення пересилання пакетів IPv4 {#prerequisite-ipv4-forwarding-optional}

Щоб вручну ввімкнути пересилання пакетів IPv4:

```bash
# параметри sysctl, необхідні для налаштування, параметри зберігаються після перезавантаження
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Застосуйте параметри sysctl без перезавантаження
sudo sysctl --system
```

Перевірте, що `net.ipv4.ip_forward` має значення 1, за допомогою команди:

```bash
sysctl net.ipv4.ip_forward
```

## Драйвери cgroup {#cgroup-drivers}

У Linux {{< glossary_tooltip text="контрольні групи" term_id="cgroup" >}} використовуються для обмеження ресурсів, які виділяються процесам.

І {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, і середовище виконання контейнерів, що працює під ним, мають взаємодіяти з контрольними групами, щоб забезпечувати [керування ресурсами Podʼів та контейнерів](/docs/concepts/configuration/manage-resources-containers/) і встановлювати такі ресурси, як запити та обмеження CPU/памʼяті. Щоб взаємодіяти з контрольними групами, kubelet і середовище виконання контейнерів мають використовувати _драйвер cgroup_. Дуже важливо, щоб kubelet і середовище виконання контейнерів використовували той самий драйвер cgroup і були налаштовані однаково.

Доступні два драйвери cgroup:

- [`cgroupfs`](#cgroupfs-cgroup-driver)
- [`systemd`](#systemd-cgroup-driver)

### Драйвер cgroupfs {#cgroupfs-cgroup-driver}

Драйвер `cgroupfs` — це [стандартний драйвер cgroup у kubelet](/docs/reference/config-api/kubelet-config.v1beta1). Коли використовується драйвер `cgroupfs`, kubelet і середовище виконання контейнерів безпосередньо взаємодіють із файловою системою cgroup, щоб налаштовувати cgroups.

Драйвер `cgroupfs` **не** рекомендовано, коли [systemd](https://www.freedesktop.org/wiki/Software/systemd/) є системою ініціалізації, оскільки systemd очікує, що в системі буде єдиний менеджер cgroup. Крім того, якщо ви використовуєте [cgroup v2](/docs/concepts/architecture/cgroups), використовуйте драйвер cgroup `systemd` замість `cgroupfs`.

### Драйвер cgroup systemd {#systemd-cgroup-driver}

Коли [systemd](https://www.freedesktop.org/wiki/Software/systemd/) вибрано системою ініціалізації для дистрибутиву Linux, процес ініціалізації створює й використовує кореневу контрольну групу (`cgroup`) і діє як менеджер cgroup.

systemd тісно інтегрований із cgroups і виділяє по одній cgroup на кожен юніт systemd. Тому, якщо ви використовуєте `systemd` як систему ініціалізації з драйвером `cgroupfs`, у системі зʼявляються два різні менеджери cgroup.

Два менеджери cgroup дають два різні уявлення про доступні та використовувані ресурси в системі. У деяких випадках вузли, на яких kubelet і середовище виконання контейнерів налаштовані на `cgroupfs`, а решта процесів використовує `systemd`, стають нестабільними під тиском на ресурси.

Щоб усунути цю нестабільність, використовуйте `systemd` як драйвер cgroup для kubelet і середовища виконання контейнерів, коли системою ініціалізації вибрано systemd.

Щоб встановити `systemd` як драйвер cgroup, змініть параметр `cgroupDriver` у [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) і встановіть його в `systemd`. Наприклад:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

Якщо ви налаштовуєте `systemd` як драйвер cgroup для kubelet, ви також маєте налаштувати `systemd` як драйвер cgroup для середовища виконання контейнерів. Інструкції див. у документації вашого середовища виконання контейнерів. Наприклад:

- [containerd](#containerd-systemd)
- [CRI-O](#cri-o)

У Kubernetes {{< skew currentVersion >}}, якщо ввімкнено функціональну можливість [`KubeletCgroupDriverFromCRI`](/docs/reference/command-line-tools-reference/feature-gates/#KubeletCgroupDriverFromCRI) і середовище виконання контейнерів підтримує CRI RPC `RuntimeConfig`, kubelet автоматично визначає відповідний драйвер cgroup із середовища виконання та ігнорує налаштування `cgroupDriver` у конфігурації kubelet.

Однак старіші версії середовищ виконання контейнерів (зокрема containerd 1.y і старіші) не підтримують CRI RPC `RuntimeConfig` і можуть некоректно відповідати на цей запит, тому kubelet повертається до використання значення свого прапорця `--cgroup-driver`.

У Kubernetes 1.38 цю резервну поведінку буде вилучено, і старіші версії containerd не працюватимуть із новішими kubelet.

{{< caution >}}
Зміна драйвера cgroup вузла, який уже приєднався до кластера, — делікатна операція. Якщо kubelet створював Podʼи, використовуючи семантику одного драйвера cgroup, перемикання середовища виконання контейнерів на інший драйвер cgroup може спричинити помилки під час спроби повторно створити пісочницю Podʼа для таких наявних Podʼів. Перезапуск kubelet може не усунути цих помилок.

Якщо ваша автоматизація це дозволяє, замініть вузол іншим з оновленою конфігурацією або перевстановіть його за допомогою автоматизації.
{{< /caution >}}

## Підтримка версій CRI {#cri-versions}

Ваше середовище виконання контейнерів має підтримувати v1 інтерфейсу середовища виконання контейнерів (CRI).

Kubernetes [починаючи з v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal) працює _тільки_ з v1 CRI API. Якщо середовище виконання контейнерів не підтримує v1 API, kubelet не зареєструється як вузол.

## Середовища виконання контейнерів {#container-runtimes}

{{% thirdparty-content %}}

### containerd {#containerd}

У цьому розділі описано кроки, потрібні для використання containerd як середовища виконання CRI.

Щоб встановити containerd у вашій системі, дотримуйтеся інструкцій із [початку роботи з containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md). Поверніться до цього кроку, коли створите коректний файл конфігурації `config.toml`.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
Ви можете знайти цей файл тут: `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Ви можете знайти цей файл тут: `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

У Linux стандартний сокет CRI для containerd — `/run/containerd/containerd.sock`. У Windows стандартна точка доступу CRI — `npipe://./pipe/containerd-containerd`.

#### Налаштування драйвера cgroup `systemd` {#containerd-systemd}

Щоб використовувати драйвер cgroup `systemd` у `/etc/containerd/config.toml` з `runc`, встановіть таку конфігурацію залежно від версії Containerd.

Containerd версії 1.x:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Containerd версії 2.x:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Драйвер cgroup `systemd` рекомендовано, якщо ви використовуєте [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Якщо ви встановили containerd з пакунка (наприклад, RPM або `.deb`), може виявитися, що втулок інтеграції CRI стандартно вимкнено.

Щоб використовувати containerd з Kubernetes, потрібно ввімкнути підтримку CRI. Переконайтеся, що `cri` немає у списку `disabled_plugins` у `/etc/containerd/config.toml`; якщо ви вносили зміни до цього файлу, також перезапустіть `containerd`.

Якщо після початкового встановлення кластера або після встановлення CNI контейнери циклічно аварійно завершуються (crash loop), конфігурація containerd, що постачається з пакунком, може містити несумісні параметри. Спробуйте скинути конфігурацію containerd командою `containerd config default > /etc/containerd/config.toml`, як зазначено в [getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics), а потім відповідно встановіть параметри конфігурації, наведені вище.
{{< /note >}}

Якщо ви застосували цю зміну, обовʼязково перезапустіть containerd:

```shell
sudo systemctl restart containerd
```

У Kubernetes v1.28 можна ввімкнути автоматичне виявлення драйвера cgroup як альфа-можливість. Докладніше див. [драйвер cgroup systemd](#systemd-cgroup-driver).

#### Перевизначення образу пісочниці (pause) {#override-pause-image-containerd}

У вашій [конфігурації containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) можна перевизначити образ пісочниці, задавши такий параметр конфігурації:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Після оновлення файлу конфігурації вам, можливо, також доведеться перезапустити `containerd`: `systemctl restart containerd`.

### CRI-O {#cri-o}

У цьому розділі наведено необхідні кроки для встановлення CRI-O як середовища виконання контейнерів.

Щоб встановити CRI-O, дотримуйтеся [інструкцій із встановлення CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### Драйвер cgroup {#cgroup-driver}

CRI-O стандартно використовує драйвер cgroup systemd, який, імовірно, добре вам підійде. Щоб перейти на драйвер cgroup `cgroupfs`, відредагуйте `/etc/crio/crio.conf` або розмістіть додатковий файл конфігурації (drop-in) у `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, наприклад:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Також зверніть увагу на змінений `conmon_cgroup`, який має бути встановлений у значення `pod`, коли CRI-O використовується з `cgroupfs`. Загалом конфігурацію драйвера cgroup для kubelet (зазвичай її задають через kubeadm) і CRI-O потрібно тримати узгодженими.

У Kubernetes v1.28 можна ввімкнути автоматичне виявлення драйвера cgroup як альфа-можливість. Докладніше див. [драйвер cgroup systemd](#systemd-cgroup-driver).

Для CRI-O стандартний сокет CRI — `/var/run/crio/crio.sock`.

#### Перевизначення образу пісочниці (pause) {#override-pause-image-cri-o}

У вашій [конфігурації CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) можна задати таке значення конфігурації:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Цей параметр конфігурації підтримує перезавантаження конфігурації наживо (live reload), щоб застосувати цю зміну: `systemctl reload crio` або надсилання сигналу `SIGHUP` процесу `crio`.

### Docker Engine {#docker}

{{< note >}}
Ці інструкції передбачають, що ви використовуєте адаптер [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) для інтеграції Docker Engine з Kubernetes.
{{< /note >}}

1. На кожному з ваших вузлів встановіть Docker для вашого дистрибутиву Linux згідно з [Встановлення Docker Engine](https://docs.docker.com/engine/install/#server).

2. Встановіть [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), дотримуючись вказівок у розділі встановлення документації.

Для `cri-dockerd` стандартний сокет CRI — `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) — це комерційне середовище виконання контейнерів, яке раніше було відоме як Docker Enterprise Edition.

Ви можете використовувати Mirantis Container Runtime з Kubernetes за допомогою компонента з відкритим кодом [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), який входить до складу MCR.

Докладніше про встановлення Mirantis Container Runtime див. [посібник з розгортання MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Перевірте юніт systemd із назвою `cri-docker.socket`, щоб дізнатися шлях до сокета CRI.

#### Перевизначення образу пісочниці (pause) {#override-pause-image-cri-dockerd-mcr}

Адаптер `cri-dockerd` приймає аргумент командного рядка, який визначає, який образ контейнера використовувати як інфраструктурний контейнер Podʼа («pause image»). Цей аргумент командного рядка — `--pod-infra-container-image`.

## {{% heading "whatsnext" %}} {#what-s-next}

Крім середовища виконання контейнерів, вашому кластеру потрібен робочий [мережевий втулок](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
