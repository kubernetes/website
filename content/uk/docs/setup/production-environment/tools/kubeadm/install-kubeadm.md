---
title: Встановлення kubeadm
content_type: concept
weight: 10
card:
  name: setup
  weight: 40
  title: Встановлення інструменту розгортання кластерів kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>

Ця сторінка показує, як встановити інструменти `kubeadm`. Для отримання інформації щодо того, як створити кластер за допомогою kubeadm після виконання цього процесу встановлення, див. сторінку [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "Інструкція з встановлення" >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* У вас має бути сумісний хост на основі Linux. Проєкт Kubernetes надає загальні інструкції для дистрибутивів Linux, зокрема на базі Debian та Red Hat, а також для дистрибутивів без менеджера пакетів.
* 2 ГБ або більше оперативної памʼяті на кожній машині (менше може залишити мало місця для ваших застосунків).
* 2 CPU або більше для машин панелі управління.
* Повноцінне мережеве зʼєднання між усіма машинами в кластері (публічна чи приватна мережа підходить).
* Унікальні імена хостів, MAC-адреси та product_uuid для кожного вузла. Див. [тут](#verify-mac-address) для отримання докладнішої інформації.
* Відкриті певні порти на ваших машинах. Див. [тут](#check-required-ports) для отримання докладнішої інформації.

{{< note >}}
Встановлення за допомогою `kubeadm` виконується за допомогою бінарних файлів, які використовують динамічне звʼязування та передбачають, що ваша цільова система надає бібліотеку `glibc`. Це припущення стосується багатьох дистрибутивів Linux (включаючи Debian, Ubuntu, Fedora, CentOS і т. д.), але не завжди відповідає дійсності у випадку власних та легких дистрибутивів, які типово не включають `glibc`, наприклад, Alpine Linux. Очікується, що дистрибутив включає або [шар сумісності](https://wiki.alpinelinux.org/wiki/Running_glibc_programs), який забезпечує необхідні символи, або `glibc`.
{{< /note >}}

<!-- steps -->

## Перевірте версію вашої операційної системи {#check-your-os-version}

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* Проєкт kubeadm підтримує ядра LTS. Дивіться [Список ядер LTS](https://www.kernel.org/category/releases.html).
* Ви можете отримати версію ядра за допомогою команди `uname -r`.

Докладнішу інформацію наведено у [Вимоги до ядра Linux](/docs/reference/node/kernel-version-requirements/).

{{% /tab %}}

{{% tab name="Windows" %}}

* Проект kubeadm підтримує останні версії ядра. Список останніх версій ядра наведено у [Windows Server Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* Ви можете отримати версію ядра (яку також називають версією ОС) за допомогою команди `systeminfo`.

Докладнішу інформацію наведено у статті [Сумісність версій ОС Windows](/docs/concepts/windows/intro/#windows-os-version-support).

{{% /tab %}}
{{< /tabs >}}

Кластер Kubernetes, створений за допомогою kubeadm, залежить від програмного забезпечення, яке використовує можливості ядра. Це програмне забезпечення включає, але не обмежується {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, {{< glossary_tooltip term_id="kubelet" text="kubelet">}} та втулком {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}.

Щоб допомогти вам уникнути несподіваних помилок, спричинених використанням непідтримуваної версії ядра, kubeadm виконує попередню перевірку `SystemVerification`. Ця перевірка не спрацює, якщо версія ядра не підтримується.

Ви можете пропустити перевірку, якщо знаєте, що ваше ядро надає необхідні можливості, навіть якщо kubeadm не підтримує його версію.

## Перевірка унікальності MAC-адрес та product_uuid для кожного вузла {#verify-mac-address}

* Ви можете отримати MAC-адресу мережевих інтерфейсів за допомогою команди `ip link` або `ifconfig -a`.
* product_uuid можна перевірити за допомогою команди `sudo cat /sys/class/dmi/id/product_uuid`.

Ймовірно, що апаратні пристрої матимуть унікальні адреси, хоча деякі віртуальні машини можуть мати ідентичні значення. Kubernetes використовує ці значення для унікальної ідентифікації вузлів в кластері. Якщо ці значення не є унікальними для кожного вузла, процес встановлення може [завершитися невдачею](https://github.com/kubernetes/kubeadm/issues/31).

## Перевірка мережевих адаптерів {#check-network-adapters}

Якщо у вас є більше одного мережевого адаптера і компоненти Kubernetes недоступні за стандартним маршрутом, ми рекомендуємо додати IP-маршрут(и), щоб адреси кластера Kubernetes відповідали конкретному адаптеру.

## Перевірка необхідних портів {#check-required-ports}

Ці [необхідні порти](/docs/reference/networking/ports-and-protocols/) повинні бути відкриті для взаємодії компонентів Kubernetes між собою. Ви можете використовувати інструменти, такі як [netcat](https://netcat.sourceforge.net), щоб перевірити, чи відкритий порт. Наприклад:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Мережевий втулок Podʼа, який ви використовуєте, також може вимагати, щоб певні порти були відкриті. Оскільки це відрізняється для кожного мережевого втулка, будь ласка, перегляньте їх документацію про те, які порти їм потрібні.

## Конфігурація swap {#swap-configuration}

Стандартно kubelet не запускається, якщо на вузлі виявлено swap-памʼять.
Це означає, що swap слід або вимкнути, або дозволити його використання kubelet.

* Щоб дозволити swap, додайте `failSwapOn: false` до конфігурації kubelet або як аргумент командного рядка. Примітка: навіть якщо вказано `failSwapOn: false`, робочі навантаження не матимуть стандартно доступу до swap. Це можна змінити, встановивши параметр `swapBehavior`, знову ж таки в конфігураційному файлі kubelet. Для використання swap, встановіть значення `swapBehavior` інше ніж стандартне налаштування `NoSwap`. Докладніше дивіться у розділі [Управління памʼяттю swap](/docs/concepts/cluster-administration/swap-memory-management).
* Щоб вимкнути swap, можна використовувати команду `sudo swapoff -a` для тимчасового відключення swap. Щоб зробити цю зміну постійною після перезавантаження, переконайтеся, що swap вимкнено у конфігураційних файлах, таких як `/etc/fstab`, `systemd.swap`, залежно від того, як це налаштовано у вашій системі.

## Встановлення середовища виконання контейнерів {#installing-runtime}

Для запуску контейнерів у Pod, Kubernetes використовує {{< glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів" >}}.

Стандартно Kubernetes використовує {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI), щоб взаємодіяти з обраним середовищем.

Якщо ви не вказуєте середовище виконання, `kubeadm` автоматично намагається виявити встановлене середовище виконання контейнерів, скануючи список відомих точок доступу.

Якщо виявлено кілька або жодного середовища виконання контейнерів, `kubeadm` повідомить про помилку та запросить вас вказати, яке середовище ви хочете використовувати.

Дивіться [середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/) для отримання додаткової інформації.

{{< note >}}
Рушій Docker не має реалізації [CRI](/docs/concepts/architecture/cri/), що є вимогою для роботи контейнерного середовища в Kubernetes. З цього приводу слід встановити додатковий сервіс [cri-dockerd](https://mirantis.github.io/cri-dockerd/).
`cri-dockerd` — це проєкт, побудований на основі колишньої вбудованої підтримки Docker Engine, яка була [вилучена](/dockershim) з kubelet у версії 1.24.
{{< /note >}}

Наведені нижче таблиці містять відомі точки доступу для підтримуваних операційних систем:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux container runtimes" >}}
| Середовище виконання                | Шлях до Unix socket               |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (з cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows container runtimes" >}}
| Середовище виконання                | Шлях до іменованого pipe Windows                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (з cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Встановлення kubeadm, kubelet та kubectl {#installing-kubeadm-kubelet-and-kubectl}

Ви повинні встановити ці пакунки на всіх своїх машинах:

* `kubeadm`: команда для ініціалізації кластера.

* `kubelet`: компонент, який працює на всіх машинах у вашому кластері та виконує такі дії, як запуск подів та контейнерів.

* `kubectl`: утиліта командного рядка для взаємодії з вашим кластером.

kubeadm **не буде** встановлювати або керувати `kubelet` або `kubectl` за вас, тому вам потрібно забезпечити відповідність їх версії версії панелі управління Kubernetes, яку ви хочете, щоб `kubeadm` встановив для вас. Якщо цього не зробити, існує ризик змішування версій, що може призвести до непередбачуваної та неправильної роботи. Однак підтримується розбіжність в _одну_ мінорну версію між `kubelet` та панеллю управління, але версія `kubelet` ніколи не повинна перевищувати версію API сервера. Наприклад, `kubelet` версії 1.7.0 буде повністю сумісний з API-сервером версії 1.8.0, але не навпаки.

Щодо інформації про встановлення `kubectl`, див. [Встановлення та налаштування kubectl](/docs/tasks/tools/).

{{< warning >}}
Ці інструкції виключають усі пакунки Kubernetes з будь-яких оновлень системи. Це через те, що `kubeadm` та Kubernetes вимагають [спеціальної уваги під час оновлення](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Докладніше про відмінності версій:

* [Політика версій та відмінностей](/docs/setup/release/version-skew-policy/) Kubernetes
* [Політика відмінностей версій для kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
Є окремий репозиторій пакунків для кожної мінорної версії Kubernetes. Якщо ви хочете встановити іншу мінорну версію, крім v{{< skew currentVersion >}}, див. посібник з встановлення для бажаної мінорної версії.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Debian-подібні дистрибутиви" %}}

Ці інструкції для Kubernetes v{{< skew currentVersion >}}.

1. Оновіть індекс пакунків `apt` та встановіть пакунки, необхідні для використання репозитарію Kubernetes `apt`:

   ```shell
   sudo apt-get update
   # apt-transport-https може бути фіктивним пакунком; якщо це так, ви можете пропустити цей крок
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Завантажте публічний ключ підпису для репозиторіїв пакунків Kubernetes. Той самий ключ підпису використовується для всіх репозитаріїв, тому ви можете ігнорувати версію в URL:

   ```shell
   # Якщо теки `/etc/apt/keyrings` не існує, її слід створити до виконання команди curl, див примітку нижче.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
У випусках старших за Debian 12 та Ubuntu 22.04 теки `/etc/apt/keyrings` типово не існує, її слід створити до команди curl.
{{< /note >}}

3. Додайте відповідний репозиторій Kubernetes `apt`. Зверніть увагу, що цей репозиторій містить пакунки лише для Kubernetes {{< skew currentVersion >}}; для інших мінорних версій Kubernetes вам потрібно змінити мінорну версію Kubernetes в URL так, щоб вона відповідала вашій бажаній мінорній версії (також перевірте, чи ви ознайомились з документацією для версії Kubernetes, яку ви плануєте встановити).

   ```shell
   # Це перезаписує будь-яку наявну конфігурацію в /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Оновіть індекс пакунків `apt`, встановіть kubelet, kubeadm та kubectl, та зафіксуйте їх версію:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Опціонально) Увімкніть kublet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Red Hat-подібні дистрибутиви" %}}

1. Встановіть SELinux у режим `permissive`:

   Ці інструкції для Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Встановити SELinux у режим `permissive` (фактично відключити його)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
* Встановлення SELinux у режим `permissive` за допомогою виконання `setenforce 0` та `sed ...` фактично його вимикає. Це необхідно для того, щоб дозволити контейнерам отримувати доступ до файлової системи хосту, наприклад, деякі мережеві застосунки кластера вимагають цього. Ви повинні зробити це до тих пір, поки підтримка SELinux не буде покращена в kubelet.
* Ви можете залишити увімкненим SELinux, якщо ви знаєте, як його налаштувати, але це може вимагати налаштувань, які не підтримуються kubeadm.
{{< /caution >}}

2. Додайте репозиторій Kubernetes `yum`. Параметр `exclude` в визначенні репозиторію забезпечує, що пакунки, повʼязані з Kubernetes, не оновлюються при виконанні `yum update`, оскільки є спеціальна процедура, якої слід дотримуватися для оновлення Kubernetes. Зверніть увагу, що цей репозиторій має пакунки лише для Kubernetes v{{< skew currentVersion >}}; для інших мінорних версій Kubernetes вам потрібно змінити мінорну версію Kubernetes в URL так, щоб вона відповідала вашій бажаній мінорній версії (також перевірте, чи ви ознайомились з документацією для версії Kubernetes, яку ви плануєте встановити).

   ```shell
   # Це перезаписує будь-яку існуючу конфігурацію в /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
      enabled=1
      gpgcheck=1
      gpgkey=<https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
      exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
      EOF

   ```

3. Встановіть kubelet, kubeadm та kubectl, та активуйте kubelet:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

   Для систем з DNF:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
   ```

4. (Опціонально) Увімкніть kubelet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Без менеджера пакунків" %}}

Встановіть втулки CNI (необхідно для більшості мережевих підсистем):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Визначте теку для завантаження файлів команд:

{{< note >}}
Змінна `DOWNLOAD_DIR` повинна бути встановлена на теку з правами на запис. Якщо ви використовуєте Flatcar Container Linux, встановіть `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Встановіть crictl (необхідно для взаємодії з Container Runtime Interface (CRI), необовʼязково для kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Встановіть `kubeadm`, `kubelet` та додайте службу `kubelet` systemd:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Звіртесь з примітками в розділі [Перш ніж ви розпочнете](#before-you-begin) для дистрибутивів Linux, які типово не містять `glibc`.
{{< /note >}}

Встановіть `kubectl`, відповідно до інструкцій на сторінці [Встановлення інструментів](/docs/tasks/tools/#kubectl).

Опціонально, увімкніть службу `kubelet` перед запуском `kubeadm`:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Дистрибутив Flatcar Container Linux монтує теку `/usr` як файлову систему тільки для читання. Перед ініціалізацією кластера вам потрібно виконати додаткові кроки для налаштування теки для запису. Див. [Посібник з усунення несправностей kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only), щоб дізнатися, як налаштувати теку для запису.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Kubelet тепер перезавантажується кожні кілька секунд, чекаючи в циклі crashloop на вказівки від kubeadm.

## Налаштування драйвера cgroup {#configure-a-cgroup-driver}

Як середовище виконання контейнерів, так і kubelet мають властивість, відому як ["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), яка є важливою для управління cgroup на машинах з операційною системою Linux.

{{< warning >}}
Обовʼязково встановлюйте спільний драйвер cgroup для середовища виконання контейнерів та kubelet, інакше процес kubelet завершиться із помилкою.

Докладніше дивіться в розділі [Налаштування драйвера cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
{{< /warning >}}

## Розвʼязання проблем {#troubleshooting}

Якщо у вас виникають труднощі з kubeadm, будь ласка, звертайтеся до наших [документів щодо розвʼязання проблем](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
