---
title: Встановлення Minikube
content_template: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!-- overview -->

<!--This page shows you how to install [Minikube](/docs/tutorials/hello-minikube),
a tool that runs a single-node Kubernetes cluster in a virtual machine on your personal computer.
-->

Ця сторінка описує, як встановити [Minikube](/docs/tutorials/hello-minikube) - інструмент, який дозволяє
запустити Kubernetes кластер з однієї ноди у віртуальній машині на вашому персональному комп'ютері.


## {{% heading "prerequisites" %}}

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Для перевірки, чи підтримується віртуалізація на Linux, запустіть наступну команду і впевніться що її вивід не пустий:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
Для перевірки, чи підтримується віртуалізація на macOS, запустіть наступну команду в терміналі.
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
Якщо ви бачите `VMX` у виводі (має бути кольоровий), то VT-x опція включена на вашому хості.
{{% /tab %}}

{{% tab name="Windows" %}}
Для перевірки, чи підтримується віртуалізація на  Windows 8 та версіях вище, запустіть наступну команду в терміналі
вашого або через command prompt.
```
systeminfo
```
Якщо ви бачите наступне, віртуалізація підтримується на Windows.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

Якщо ви бачите наступнний вивід, на вашій системі вже встановлен гіпервізор і ви можете пропустити наступний крок.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}



<!-- steps -->

# Встановлення Minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Встановлення kubectl

Впевніться що kubectl встановлений. Ви можете встановити kubectl згідно інструкції [Встановлення та налаштування kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux).

### Встановлення Hypervisor

Якщо у вас немає встановленого гіпервізора, то встановіть один з наступних:

• [KVM](https://www.linux-kvm.org/), який також використовує QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Minikube також пітримує опцію `--driver=none` яка дозволяє запускати компоненти Kubernetes
на хост системі, ні в віртуальній машині.
Використання цього драйвера вимагає [Docker](https://www.docker.com/products/docker-desktop) та Linux оточення але не гіпервізор.

Якщо ви використувуєте `none` драйвер у Debian або похідних дістрибутивах, використовуйте `.deb` пакети для
Docker замість встановлення snap пакетів, які не працюють з Minikube.
Ви можете скачати `.deb` пакети звідси [Docker](https://www.docker.com/products/docker-desktop).

{{< caution >}}
`none` VM драйвер може привести до проблем з безпекою та втрати даних.
Перед тим, як використовувати `--driver=none`, ознайомтесь [з цієй документацієй](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) для отримання додаткової інформації.
{{< /caution >}}

Minikube також підтримує `vm-driver=podman` схожий на Docker драйвер. Podman запущений як суперюзер (root user) це найкрайщий  шлях забезпечити повний доступ ваших контейнерів до будь-якої функції, наявної у вашій системі.

{{< caution >}}
`podman` драйвер вимагає запущені контейнери з під root користувача оскільки звичайні облікові записи користувачів не мають повного доступу до всіх функцій операційної системи, які, можливо, потребуватимуть їх роботи.
{{< /caution >}}

### Встановлення Minikube як Linux пакет

Доступні *experimental* пакети для Minikube; ви можете знайти Linux (AMD64) пакети
для Minikube's [releases](https://github.com/kubernetes/minikube/releases) на сторінці GitHub.

Використовувайте ваш Linux інсталер пакетів для того, шоб поставити відповідний пакет.

### Встановлення Minikube за допомогою прямого завантаження

Якщо ви не можете встановити Minikube за допомогою пакета, ви можете скачати автономний бінарний файл,
та використати його.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Ось простий спосіб додати виконуваний файл Minikube до вашого шляху:

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### Встановлення Minikube використовуючи Homebrew

Як альтернативний варіант, ви можете установити Minikube використовуючи Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):

```shell
brew install minikube
```

{{% /tab %}}
{{% tab name="macOS" %}}
### Встановлення kubectl

Впевніться шо kubectl встановлен. Ви можете встановити kubectl згідно інструкції [Установка та налаштування kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos).

### Встановлення Hypervisor

Якщо у вас немає встановленого гіпервізора, то встановіть один з наступних:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Встановлення Minikube
Найпростіший спосіб встановити Minikube на macOS це використати [Homebrew](https://brew.sh):

```shell
brew install minikube
```

Ви також можете встановити Minikube за допомогою автономного бінарного файла:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Ось простий спосіб додати виконуваний файл Minikube до вашого шляху:

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### Встановлення kubectl

Впевніться шо kubectl встановлен. Ви можете встановити kubectl згідно інструкції [Установка та налаштування kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

### Встановлення Hypervisor

Якщо у вас немає встановленого гіпервізора, то встановіть один з наступних:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V може бути запущен на трьох версіях Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education.
{{< /note >}}

### Встановлення Minikube за допомогою Chocolatey

Найпростіший спосіб встановити Minikube на  Windows за допомогою [Chocolatey](https://chocolatey.org/) (run as an administrator):

```shell
choco install minikube
```

Коли Minikube закінчив установку, закрийте поточну CLI сесію та перезавантажтесь. Minikube має бути додан до вашого шляху автоматично.

### Встановлення Minikube за допомогою програми встановлення

Для встановлення Minikube вручну на Windows за допомогою [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), скачайте [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) та виконайте програму.

### Встановлення Minikube за допомогою прямого завантаження

Для встановлення Minikube вручну на Windows, скачайте [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), перейменуйте  в `minikube.exe`, та додайте до вашего шляху.

{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [Запуск Kubernetes локально за допомогою Minikube](/docs/setup/learning-environment/minikube/)


## Підтвердження встановлення

Щоб підтвердити успішну установку як гіпервізора, так і Minikube, ви можете запустити таку команду, щоб запустити локальний кластер Kubernetes:

{{< note >}}

Щоб встановити `--driver` за допомогою` minikube start`, введіть ім'я гіпервізора, який ви встановили, малими літерами, де `<driver_name>` згадано нижче. Повний список значень `--driver` доступний у [вказуванні документації на драйвер VM](https://kubernetes.io/docs/setup/learning-environment/minikube/#specifying-the-vm-driver).

{{< /note >}}

```shell
minikube start --driver=<driver_name>
```

Після того як `minikube start` закінчився, запустіть команду нижче, щоб перевірити стан кластера:

```shell
minikube status
```
Якщо ваш кластер працює, вивід із "minikube status" має бути аналогічним:

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

Після того, як ви підтвердили, чи Minikube працює з обраним вами гіпервізором, ви можете продовжувати використовувати Minikube або ви можете зупинити кластер. Щоб зупинити кластер, запустіть:

```shell
minikube stop
```

## Очистити локальний стан {#cleanup-local-state}

Якщо ви раніше встановили Minikube та запустили:
```shell
minikube start
```

але `minikube start` повертає помилку:
```
machine does not exist
```

тоді вам треба очистити локальний стан minikube:
```shell
minikube delete
```
