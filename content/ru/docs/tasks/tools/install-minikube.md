---
title: Установка Minikube
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!-- overview -->

На этой странице рассказано, как установить [Minikube](/ru/docs/tutorials/hello-minikube), инструмент для запуска одноузлового кластера Kubernetes на виртуальной машине в персональном компьютере.



## {{% heading "prerequisites" %}}


{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Чтобы проверить, поддерживается ли виртуализация в Linux, выполните следующую команду и проверьте, что вывод не пустой:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
Чтобы проверить, поддерживается ли виртуализация в macOS, выполните следующую команду в терминале:
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
Если вы видите `VMX` в выводе (должен быть окрашенным), значит в вашем компьютере поддерживается виртуализация VT-x.
{{% /tab %}}

{{% tab name="Windows" %}}
Чтобы проверить, поддерживается ли виртуализация в Windows 8 и выше, выполните следующую команду в Windows Terminal или в командной строке.
```
systeminfo
```
Если вы видите следующий вывод, значит виртуализация поддерживается в Windows.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```
Если вы видите следующий вывод, значит системе уже установлен гипервизор, значит вы можете пропустить следующий шаг установке гипервизора.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```

{{% /tab %}}
{{< /tabs >}}



<!-- steps -->

## Установка minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Установка kubectl

Убедитесь, что у вас установлен kubectl. Вы можете установить kubectl согласно инструкциям в разделе [Установка и настройка kubectl](/ru/docs/tasks/tools/install-kubectl/#установка-kubectl-в-linux).

### Установка Hypervisor

Если у вас ещё не установлен гипервизор, установите один из них:

• [KVM](https://www.linux-kvm.org/), который также использует QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Minikube также поддерживает опцию `--vm-driver=none`, которая запускает компоненты Kubernetes на хосте, а не на виртуальной машине.
Для использования этого драйвера требуется только [Docker](https://www.docker.com/products/docker-desktop) и Linux, но не гипервизор.

Если вы используете драйвер `none` в Debian и его производных, используйте пакеты `.deb` для Docker, а не snap-пакет, который не работает с Minikube.
Вы можете скачать `.deb`-пакеты с сайта [Docker](https://www.docker.com/products/docker-desktop).

{{< caution >}}
Драйвера виртуальной машины `none` может привести к проблемам безопасности и потери данных. Перед использованием `--vm-driver=none` обратитесь к [этой документации](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) для получения дополнительной информации.
{{< /caution >}}

Minikube также поддерживает `vm-driver=podman`, похожий на драйвер Docker. Podman, работающий с правами суперпользователя (пользователь root) — это лучший способ гарантировать вашим контейнерам полный доступ ко всем возможностям в системе.

{{< caution >}}
Драйвер `podman` должен запускать контейнеры от имени суперпользователя, поскольку у обычных аккаунтов нет полного доступа ко всем возможностям операционной системы, которые могут понадобиться контейнерам для работы.
{{< /caution >}}

### Установка Minikube через пакет

Доступны *экспериментальные* пакеты для Minikube; Вы можете загрузить пакеты для Linux (AMD64) со страницы [релизов](https://github.com/kubernetes/minikube/releases) Minikube на GitHub.

Используйте пакетный менеджер в вашем дистрибутиве Linux для установки нужного пакета.

### Установка Minikube с помощью прямой ссылки

Вы также можете загрузить двоичный файл и использовать его вместо установки пакета:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Чтобы исполняемый файл Minikube был доступен из любой директории выполните следующие команды:

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### Установка Minikube через Homebrew

В качестве ещё одной альтернативы вы можете установить Minikube с помощью Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):

```shell
brew install minikube
```

{{% /tab %}}
{{% tab name="macOS" %}}
### Установка kubectl

Убедитесь, что у вас установлен kubectl. Вы можете установить kubectl согласно инструкциям в разделе [Установка и настройка kubectl](/ru/docs/tasks/tools/install-kubectl/#установка-kubectl-в-macos).

### Установка Hypervisor

Если у вас ещё не установлен гипервизор, установите один из них:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Установка Minikube
Простейший способ установить Minikube в macOS — использовать [Homebrew](https://brew.sh):

```shell
brew install minikube
```

Вы также можете установить его в macOS, загрузив двоичный файл:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Чтобы исполняемый файл Minikube был доступен из любой директории выполните следующие команды:

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### Установка kubectl

Убедитесь, что у вас установлен kubectl. Вы можете установить kubectl согласно инструкциям в разделе [Установка и настройка kubectl](/ru/docs/tasks/tools/install-kubectl/#установка-kubectl-в-windows).

### Установка Hypervisor

Если у вас ещё не установлен гипервизор, установите один из них:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V может работать в трёх версиях Windows 10: Windows 10 Enterprise, Windows 10 Professional и Windows 10 Education.
{{< /note >}}

### Установка Minikube с помощью Chocolatey

Простейший способ установить Minikube в Windows — использовать [Chocolatey](https://chocolatey.org/) (запущенный с правами администратора):

```shell
choco install minikube
```

После установки Minikube нужно перезапустить терминал. Minikube должен быть автоматически добавлен в директорию с исполняемыми файлами.

### Установка Minikube с помощью исполняемого файла установки

Для ручной установки Minikube в Windows с помощью [установщика Windows](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), загрузите и запустите установщик [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe).

### Установка Minikube с помощью прямой ссылки

Для ручной установки Minikube в Windows, загрузите [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), переименуйте его в `minikube.exe` и добавьте его в директорию исполняемых файлов.

{{% /tab %}}
{{< /tabs >}}


## Проверка установки

Чтобы убедиться в том, что гипервизор и Minikube были установлены корректно, выполните следующую команду, которая запускает локальный кластер Kubernetes:

{{< note >}}

Для использования опции `--vm-driver` с командой `minikube start` укажите имя установленного вами гипервизора в нижнем регистре в заполнителе `<driver_name>` команды ниже. Полный список значений для опции  `--vm-driver` перечислен в разделе по [указанию драйвера виртуальной машины](/ru/docs/setup/learning-environment/minikube/#указание-драйвера-виртуальной-машины).

{{< /note >}}

```shell
minikube start --vm-driver=<driver_name>
```

После того, как команда `minikube start` отработала успешно, выполните команду для проверки состояния кластера:

```shell
minikube status
```

Если ваш кластер запущен, то в выводе команды `minikube status` должно быть что-то вроде этого:

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

Теперь, когда вы убедились, что Minikube работает с выбранным вами гипервизором, вы можете продолжить использовать Minikube или остановить кластер. Чтобы остановить кластер выполните команду ниже:

```shell
minikube stop
```

## Очистка локального состояния {#cleanup-local-state}

Если вы уже установили Minikube, то выполните следующую команду:
```shell
minikube start
```

В таком случае команда `minikube start` вернёт ошибку:
```
machine does not exist
```

Чтобы исправить это, нужно очистить локальное состояние:
```shell
minikube delete
```


## {{% heading "whatsnext" %}}


* [Локальный запуск Kubernetes при помощи Minikube](/ru/docs/setup/learning-environment/minikube/)
