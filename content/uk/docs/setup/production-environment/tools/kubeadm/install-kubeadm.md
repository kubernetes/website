---
title: Встановлення kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Встановлення інструменту розгортання кластерів kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>

На цій сторінці показано, як встановити набір інструментів `kubeadm`. Інформацію про те, як створити кластер за допомогою kubeadm після встановлення, див. на сторінці [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "Інструкція з встановлення" >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* Сумісний хост Linux. Проєкт Kubernetes надає загальні інструкції для дистрибутивів Linux на основі Debian і Red Hat, а також для дистрибутивів без менеджера пакунків.
* 2 ГБ або більше оперативної памʼяті на кожній машині (якщо менше, залишиться мало місця для ваших застосунків).
* 2 CPU або більше для машин панелі управління.
* Повне мережеве зʼєднання між усіма машинами в кластері (підійде публічна чи приватна мережа).
* Унікальні імʼя хоста, MAC-адреса та product_uuid для кожного вузла. Докладніше див. [тут](#verify-mac-address).
* Певні порти на ваших машинах мають бути відкриті. Докладніше див. [тут](#check-required-ports).

{{< note >}}
Встановлення `kubeadm` виконується за допомогою бінарних файлів, які використовують динамічне компонування та передбачають, що ваша цільова система надає `glibc`. Це обґрунтоване припущення для багатьох дистрибутивів Linux (зокрема Debian, Ubuntu, Fedora, CentOS тощо), але воно не завжди справджується для власних і легких дистрибутивів, які стандартно не містять `glibc`, як-от Alpine Linux. Очікується, що дистрибутив містить або `glibc`, або [шар сумісності](https://wiki.alpinelinux.org/wiki/Running_glibc_programs), який надає очікувані символи.
{{< /note >}}

<!-- steps -->

## Перевірка версії операційної системи {#check-your-os-version}

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* Проєкт kubeadm підтримує ядра LTS. Див. [Список ядер LTS](https://www.kernel.org/category/releases.html).
* Ви можете отримати версію ядра за допомогою команди `uname -r`.

Докладніше див. [Вимоги до версії ядра Linux](/docs/reference/node/kernel-version-requirements/).

{{% /tab %}}

{{% tab name="Windows" %}}

* Проєкт kubeadm підтримує останні версії ядра. Список останніх версій ядра наведено у [Windows Server Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* Ви можете отримати версію ядра (яку також називають версією ОС) за допомогою команди `systeminfo`.

Докладніше див. [Сумісність версій ОС Windows](/docs/concepts/windows/intro/#windows-os-version-support).

{{% /tab %}}
{{< /tabs >}}

Кластер Kubernetes, створений за допомогою kubeadm, залежить від програмного забезпечення, яке використовує можливості ядра. До цього програмного забезпечення належать, зокрема, {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}, {{< glossary_tooltip term_id="kubelet" text="kubelet">}} і втулок {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}.

Щоб допомогти вам уникнути неочікуваних помилок через непідтримувану версію ядра, kubeadm виконує попередню перевірку (pre-flight check) `SystemVerification`. Ця перевірка завершується невдачею, якщо версія ядра не підтримується.

Ви можете пропустити перевірку, якщо знаєте, що ваше ядро надає необхідні можливості, навіть якщо kubeadm не підтримує його версію.

## Перевірка унікальності MAC-адрес та product_uuid для кожного вузла {#verify-mac-address}

* Ви можете отримати MAC-адресу мережевих інтерфейсів за допомогою команди `ip link` або `ifconfig -a`.
* product_uuid можна перевірити за допомогою команди `sudo cat /sys/class/dmi/id/product_uuid`.

Дуже ймовірно, що апаратні пристрої матимуть унікальні адреси, хоча деякі віртуальні машини можуть мати однакові значення. Kubernetes використовує ці значення для унікальної ідентифікації вузлів у кластері. Якщо ці значення не унікальні для кожного вузла, процес встановлення може [завершитися невдачею](https://github.com/kubernetes/kubeadm/issues/31).

## Перевірка мережевих адаптерів {#check-network-adapters}

Якщо у вас більше одного мережевого адаптера і компоненти Kubernetes недоступні через стандартний маршрут, радимо додати IP-маршрут(и), щоб адреси кластера Kubernetes проходили через відповідний адаптер.

## Перевірка необхідних портів {#check-required-ports}

Ці [потрібні порти](/docs/reference/networking/ports-and-protocols/) мають бути відкриті, щоб компоненти Kubernetes могли взаємодіяти між собою. Щоб перевірити, чи відкритий порт, можна використовувати такі інструменти, як [netcat](https://netcat.sourceforge.net). Наприклад:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Мережевий втулок для Podʼів, який ви використовуєте, також може вимагати відкриття певних портів. Оскільки це залежить від втулка, перегляньте документацію втулків щодо того, які порти їм потрібні.

## Налаштування свопу {#swap-configuration}

Стандартно kubelet не запускається, якщо на вузлі виявлено своп-памʼять. Це означає, що своп слід або вимкнути, або дозволити kubelet працювати з ним.

* Щоб дозволити своп, додайте `failSwapOn: false` до конфігурації kubelet або передайте як аргумент командного рядка. Примітка: навіть якщо задано `failSwapOn: false`, робочі навантаження стандартно не матимуть доступу до свопу. Це можна змінити, задавши `swapBehavior`, також у файлі конфігурації kubelet. Щоб використовувати своп, задайте `swapBehavior`, відмінне від стандартного значення `NoSwap`. Докладніше див. [Керування своп-памʼяттю](/docs/concepts/cluster-administration/swap-memory-management).
* Щоб вимкнути своп, можна скористатися командою `sudo swapoff -a`, яка тимчасово вимикає своп. Щоб ця зміна зберігалася після перезавантажень, переконайтеся, що своп вимкнено у файлах конфігурації, як-от `/etc/fstab`, `systemd.swap`, залежно від того, як його налаштовано у вашій системі.

## Встановлення середовища виконання контейнерів {#installing-runtime}

Для запуску контейнерів у Podʼах Kubernetes використовує {{< glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів" >}}.

Стандартно Kubernetes використовує {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI) для взаємодії з вибраним середовищем виконання контейнерів.

Якщо ви не вкажете середовище виконання, kubeadm автоматично намагається виявити встановлене середовище виконання контейнерів, перебираючи список відомих точок доступу.

Якщо виявлено кілька середовищ виконання контейнерів або жодного, kubeadm повідомить про помилку й попросить вказати, яке з них ви хочете використовувати.

Докладніше див. [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/).

{{< note >}}
Docker Engine не реалізує [CRI](/docs/concepts/architecture/cri/), що є вимогою для роботи середовища виконання контейнерів з Kubernetes. Тому потрібно встановити додатковий сервіс [cri-dockerd](https://mirantis.github.io/cri-dockerd/). cri-dockerd — це проєкт на основі колишньої вбудованої підтримки Docker Engine, яку було [вилучено](/dockershim) з kubelet у версії 1.24.
{{< /note >}}

Наведені нижче таблиці містять відомі точки доступу для підтримуваних операційних систем:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux container runtimes" >}}
| Середовище виконання               | Шлях до Unix-сокета                          |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (з cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows container runtimes" >}}
| Середовище виконання               | Шлях до іменованого каналу Windows           |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (з cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Встановлення kubeadm, kubelet та kubectl {#installing-kubeadm-kubelet-and-kubectl}

Ви встановите ці пакунки на всіх своїх машинах:

* `kubeadm`: команда для ініціалізації кластера.

* `kubelet`: компонент, який працює на всіх машинах у вашому кластері та виконує такі дії, як запуск Podʼів і контейнерів.

* `kubectl`: утиліта командного рядка для взаємодії з вашим кластером.

kubeadm **не** встановлює `kubelet` або `kubectl` і не керує ними за вас, тому вам потрібно переконатися, що їхні версії відповідають версії панелі управління Kubernetes, яку kubeadm встановить для вас. Якщо цього не зробити, існує ризик розбіжності версій, що може призвести до неочікуваної, помилкової поведінки. Однак підтримується розбіжність в _одну_ мінорну версію між kubelet і панеллю управління, але версія kubelet ніколи не може перевищувати версію API-сервера. Наприклад, kubelet версії 1.7.0 має бути повністю сумісним з API-сервером версії 1.8.0, але не навпаки.

Про встановлення `kubectl` див. [Встановлення та налаштування kubectl](/docs/tasks/tools/).

{{< warning >}}
Ці інструкції виключають усі пакунки Kubernetes з будь-яких оновлень системи. Це потрібно тому, що kubeadm і Kubernetes потребують [особливої уваги під час оновлення](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Докладніше про розбіжності версій див.:

* [Політика версій і розбіжності версій](/docs/setup/release/version-skew-policy/) Kubernetes
* [Політика розбіжності версій](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy), специфічна для kubeadm

{{% legacy-repos-deprecation %}}

{{< note >}}
Для кожної мінорної версії Kubernetes є окремий репозиторій пакунків. Якщо ви хочете встановити мінорну версію, відмінну від v{{< skew currentVersion >}}, див. посібник зі встановлення для потрібної мінорної версії.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Дистрибутиви на основі Debian" %}}

Ці інструкції стосуються Kubernetes v{{< skew currentVersion >}}.

1. Оновіть індекс пакунків `apt` і встановіть пакунки, потрібні для використання репозиторію Kubernetes `apt`:

   ```shell
   sudo apt-get update
   # apt-transport-https може бути фіктивним пакунком; якщо так, цей пакунок можна пропустити
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Завантажте публічний ключ підпису для репозиторіїв пакунків Kubernetes. Для всіх репозиторіїв використовується той самий ключ підпису, тому версію в URL можна ігнорувати:

   ```shell
   # Якщо теки `/etc/apt/keyrings` не існує, її слід створити до виконання команди curl, див. примітку нижче.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

   {{< note >}}
   У випусках, старіших за Debian 12 і Ubuntu 22.04, тека `/etc/apt/keyrings` стандартно не існує, і її слід створити до виконання команди curl.
   {{< /note >}}

3. Додайте відповідний репозиторій Kubernetes `apt`. Зверніть увагу, що цей репозиторій містить пакунки лише для Kubernetes {{< skew currentVersion >}}; для інших мінорних версій Kubernetes потрібно змінити мінорну версію Kubernetes в URL на потрібну (також переконайтеся, що ви читаєте документацію для тієї версії Kubernetes, яку плануєте встановити).

   ```shell
   # Це перезаписує будь-яку наявну конфігурацію в /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Оновіть індекс пакунків `apt`, встановіть kubelet, kubeadm і kubectl та зафіксуйте їхні версії:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Необовʼязково) Увімкніть сервіс kubelet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Дистрибутиви на основі Red Hat" %}}

1. Встановіть SELinux у режим `permissive`:

   Ці інструкції стосуються Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Переведіть SELinux у режим permissive (фактично вимкнувши його)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

   {{< caution >}}

   * Перемикання SELinux у режим `permissive` командами `setenforce 0` і `sed ...` фактично вимикає його. Це потрібно, щоб дозволити контейнерам доступ до файлової системи хоста; наприклад, цього вимагають деякі мережеві втулки кластера. Це потрібно робити, доки підтримку SELinux у kubelet не буде покращено.
   * Ви можете залишити SELinux увімкненим, якщо знаєте, як його налаштувати, але це може вимагати налаштувань, які kubeadm не підтримує.
   {{< /caution >}}

2. Додайте репозиторій Kubernetes `yum`. Параметр `exclude` у визначенні репозиторію гарантує, що пакунки, повʼязані з Kubernetes, не оновлюються під час звичайного `dnf update`, оскільки для оновлення Kubernetes слід дотримуватися спеціальної процедури. Зверніть увагу, що цей репозиторій містить пакунки лише для Kubernetes {{< skew currentVersion >}}; для інших мінорних версій Kubernetes потрібно змінити мінорну версію Kubernetes в URL на потрібну (також переконайтеся, що ви читаєте документацію для тієї версії Kubernetes, яку плануєте встановити).

   ```shell
   # Це перезаписує будь-яку наявну конфігурацію в /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. Встановіть kubelet, kubeadm та kubectl:

   Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

   Для систем Fedora з DNF5:

   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
   ```

   Для RHEL/CentOS 10 та пізніших версій, щоб уникнути завантаження `iptables` як залежності:

   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes --setopt=install_weak_deps=False
   ```

4. (Необовʼязково) Увімкніть сервіс kubelet перед запуском kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Без менеджера пакунків" %}}

Встановіть втулки CNI (потрібні для більшості мереж Podʼів):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Визначте теку для завантаження файлів команд:

{{< note >}}
Змінна `DOWNLOAD_DIR` має вказувати на теку, доступну для запису. Якщо ви використовуєте Flatcar Container Linux, встановіть `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

За бажанням встановіть crictl (потрібен для взаємодії з Container Runtime Interface (CRI), необовʼязковий для kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Встановіть `kubeadm`, `kubelet` і додайте сервіс systemd `kubelet`:

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
Для дистрибутивів Linux, які стандартно не містять `glibc`, див. примітку в розділі [Перш ніж ви розпочнете](#before-you-begin).
{{< /note >}}

Встановіть `kubectl`, дотримуючись інструкцій на сторінці [Встановлення інструментів](/docs/tasks/tools/#kubectl).

За бажанням увімкніть сервіс kubelet перед запуском kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Дистрибутив Flatcar Container Linux монтує теку `/usr` як файлову систему лише для читання. Перед початковим розгортанням кластера потрібно виконати додаткові кроки, щоб налаштувати теку, доступну для запису. Див. [Посібник з усунення несправностей kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only), щоб дізнатися, як налаштувати теку, доступну для запису.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Тепер kubelet перезапускається кожні кілька секунд, бо в циклі аварійних перезапусків (crashloop) чекає, поки kubeadm скаже йому, що робити.

## Усунення несправностей {#troubleshooting}

Якщо у вас виникають труднощі з kubeadm, зверніться до нашої [документації з усунення несправностей](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}} {#what-s-next}

* [Створення кластера за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
