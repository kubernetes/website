---
title: "Заміна середовища виконання контейнерів на вузлі з Docker Engine на containerd"
weight: 10
content_type: task
---

Це завдання визначає кроки, необхідні для оновлення вашого середовища виконання контейнерів на containerd з Docker. Воно буде корисним для операторів кластерів, які працюють з Kubernetes 1.23 або старішими версіями. Воно також охоплює приклад сценарію міграції з dockershim на containerd. З цієї [сторінки](/docs/setup/production-environment/container-runtimes/) можна вибрати альтернативні середовища виконання контейнерів.

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

Встановіть containerd. Для отримання додаткової інформації дивіться [документацію з встановлення containerd](https://containerd.io/docs/getting-started/) і для конкретних передумов виконуйте кроки описані в [посібнику containerd](/docs/setup/production-environment/container-runtimes/#containerd).

## Виведення вузла з експлуатації {#drain-the-node}

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

Замініть `<node-to-drain>` на імʼя вузла, який ви збираєтеся виводити з експлуатації.

## Зупиніть службу Docker {#stop-the-docker-daemon}

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Встановлення Containerd {#install-containerd}

Дотримуйтесь настанов [посібника](/docs/setup/production-environment/container-runtimes/#containerd) для отримання детальних кроків з встановлення containerd.

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. Встановіть пакунок `containerd.io` з офіційних репозиторіїв Docker. Інструкції щодо налаштування репозиторію Docker для вашого конкретного дистрибутиву Linux і встановлення пакунка `containerd.io` можна знайти у [Починаючи з containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).

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

Розпочніть сеанс PowerShell, встановіть значення `$Version` на бажану версію (наприклад, `$Version="1.4.3"`), а потім виконайте наступні команди:

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

Відредагуйте файл `/var/lib/kubelet/kubeadm-flags.env` та додайте середовище виконання контейнерів до прапорців; `--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.

Використовуючи kubeadm, користувачі повинні знати, що інструмент kubeadm зберігає сокет CRI хоста в файлі `/var/lib/kubelet/instance-config.yaml` на кожному вузлі. Ви можете створити цей файл `/var/lib/kubelet/instance-config.yaml` на вузлі.

Файл `/var/lib/kubelet/instance-config.yaml` дозволяє налаштувати параметр `containerRuntimeEndpoint`.

Ви можете встановити значення цього параметра на шлях до вибраного вами сокета CRI (наприклад, `unix:///run/containerd/containerd.sock`).

## Перезапустіть kubelet {#restart-the-kubelet}

```shell
systemctl start kubelet
```

## Перевірте, що вузол справний {#verify-that-the-node-is-healthy}

Запустіть `kubectl get nodes -o wide`, і containerd зʼявиться як середовище виконання для вузла, який ми щойно змінили.

## Видаліть Docker Engine {#remove-docker-engine}

{{% thirdparty-content %}}

Якщо вузол виглядає справним, видаліть Docker.

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
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

Попередні команди не видаляють образи, контейнери, томи або налаштовані файли конфігурації на вашому хості. Щоб їх видалити, слідуйте інструкціям Docker щодо [Видалення Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine).

{{< caution >}}
Інструкції Docker щодо видалення Docker Engine створюють ризик видалення containerd. Будьте обережні при виконанні команд.
{{< /caution >}}

## Введення вузла в експлуатацію {#uncordon-the-node}

```shell
kubectl uncordon <node-to-uncordon>
```

Замініть `<node-to-uncordon>` на імʼя вузла, який ви раніше вивели з експлуатації.
