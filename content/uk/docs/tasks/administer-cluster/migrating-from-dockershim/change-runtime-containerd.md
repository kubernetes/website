---
title: "Заміна середовища виконання контейнерів на вузлі з Docker Engine на containerd"
weight: 10
content_type: task
---

Це завдання описує кроки, потрібні для переходу вашого середовища виконання контейнерів з Docker на containerd. Воно стосується операторів кластерів, які працюють з Kubernetes 1.23 або старішими версіями. Воно також охоплює приклад сценарію міграції з dockershim на containerd. Альтернативні середовища виконання контейнерів можна вибрати на цій [сторінці](/docs/setup/production-environment/container-runtimes/).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{% thirdparty-content %}}

Встановіть containerd. Докладніше див. [документацію зі встановлення containerd](https://containerd.io/docs/getting-started/), а конкретні передумови — у [посібнику з containerd](/docs/setup/production-environment/container-runtimes/#containerd).

## Drain вузла {#drain-the-node}

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

Замініть `<node-to-drain>` на імʼя вузла, для якого ви виконуєте drain.

## Зупинка демона Docker {#stop-the-docker-daemon}

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Встановлення Containerd {#install-containerd}

Дотримуйтесь настанов [посібника](/docs/setup/production-environment/container-runtimes/#containerd) для отримання детальних кроків з встановлення containerd.

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. Встановіть пакунок `containerd.io` з офіційних репозиторіїв Docker. Інструкції з налаштування репозиторію Docker для вашого дистрибутива Linux і встановлення пакунка `containerd.io` можна знайти в [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).

1. Налаштуйте containerd:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

1. Перезапустіть containerd:

   ```shell
   sudo systemctl restart containerd
   ```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Розпочніть сеанс PowerShell, встановіть `$Version` у бажану версію (наприклад, `$Version="1.4.3"`), а потім виконайте такі команди:

1. Завантажте containerd:

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

2. Розпакуйте та налаштуйте:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # Перегляньте конфігурацію. Залежно від налаштувань можливо, ви захочете внести корективи:
   # - образ sandbox_image (образ pause Kubernetes)
   # - розташування cni bin_dir та conf_dir
   Get-Content config.toml

   # (Необовʼязково, але дуже рекомендується) Виключіть containerd зі сканування Windows Defender
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. Запустіть containerd:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

## Налаштування kubelet для використання containerd як його середовища виконання контейнерів {#configure-the-kubelet-to-use-containerd-as-its-container-runtime}

Відредагуйте файл `/var/lib/kubelet/kubeadm-flags.env` та додайте containerd як середовище виконання контейнерів до прапорців; `--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.

Користувачам kubeadm слід знати, що інструмент kubeadm зберігає сокет CRI хоста у файлі `/var/lib/kubelet/instance-config.yaml` на кожному вузлі. Ви можете створити цей файл `/var/lib/kubelet/instance-config.yaml` на вузлі.

Файл `/var/lib/kubelet/instance-config.yaml` дозволяє налаштувати параметр `containerRuntimeEndpoint`.

Ви можете встановити значення цього параметра на шлях до вибраного вами сокета CRI (наприклад, `unix:///run/containerd/containerd.sock`).

## Перезапуск kubelet {#restart-the-kubelet}

```shell
systemctl start kubelet
```

## Перевірка справності вузла {#verify-that-the-node-is-healthy}

Виконайте `kubectl get nodes -o wide`, і containerd зʼявиться як середовище виконання для вузла, який ми щойно змінили.

## Видалення Docker Engine {#remove-docker-engine}

{{% thirdparty-content %}}

Якщо вузол виглядає справним, видаліть Docker.

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```

{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```

{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```

{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```

{{% /tab %}}
{{< /tabs >}}

Наведені вище команди не видаляють образи, контейнери, томи чи власні файли конфігурації на вашому хості. Щоб видалити їх, виконайте інструкції Docker з [видалення Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine).

{{< caution >}}
Інструкції Docker з видалення Docker Engine несуть ризик видалити containerd. Будьте обережні, виконуючи команди.
{{< /caution >}}

## Uncordon вузла {#uncordon-the-node}

```shell
kubectl uncordon <node-to-uncordon>
```

Замініть `<node-to-uncordon>` на імʼя вузла, для якого ви раніше виконали drain.
