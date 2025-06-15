---
title: Встановлення та налаштування kubectl у Windows
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Вам потрібно використовувати версію kubectl, яка має мінорну версію що відрізняється не більше ніж на одиницю від мінорної версії вашого кластера. Наприклад, клієнт v{{< skew currentVersion >}} може співпрацювати з панелями управління v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} та v{{< skew currentVersionAddMinor 1 >}}. Використання останньої сумісної версії kubectl допомагає уникнути непередбачуваних проблем.

## Встановлення kubectl у Windows {#install-kubectl-on-windows}

Існують наступні методи встановлення kubectl у Windows:

- [Встановлення бінарника kubectl у Windows (за допомогою прямого завантаження або за допомогою curl)](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [Встановлення за допомогою Chocolatey, Scoop або winget у Windows](#install-nonstandard-package-tools)

### Встановлення бінарника kubectl у Windows (за допомогою прямого завантаження або за допомогою curl) {#install-kubectl-binary-on-windows-via-direct-download-or-curl}

1. У вас є два варіанти встановлення kubectl на вашому пристрої з Windows

   - Безпосереднє завантаження:

     Завантажте останню версію {{< skew currentVersion >}} патчу безпосередньо для вашої архітектури, відвідавши [сторінку випуску Kubernetes](https://kubernetes.io/releases/download/#binaries). Переконайтеся, що вибрано правильний двійковий файл для вашої архітектури (наприклад, amd64, arm64 тощо).

   - Використовуючи curl

     Або, якщо у вас встановлено `curl`, використовуйте цю команду:

     ```powershell
     curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
     ```

   {{< note >}}
   Щоб дізнатися останню стабільну версію (наприклад, для скриптів), перегляньте [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

2. Перевірте бінарний файл (опціонально)

   Завантажте файл контрольної суми для `kubectl`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   Перевірте бінарний файл `kubectl` за допомогою файлу контрольної суми:

   - Використовуючи командний рядок для ручного порівняння виводу `CertUtil` з завантаженим файлом контрольної суми:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Використовуючи PowerShell для автоматизації перевірки за допомогою оператора `-eq` для отримання результату `True` або `False`:

     ```powershell
     Compare-String -eq (Get-FileHash kubectl.exe -Algorithm SHA256).Hash (Get-Content kubectl.exe.sha256)
     ```

3. Додайте на початок чи в кінець змінної середовища `PATH` шлях до теки з `kubectl`.

4. Перевірте, що версія `kubectl` збігається з завантаженою:

   ```cmd
   kubectl version --client
   ```

   Або використайте це для детального перегляду версії:

   ```cmd
   kubectl version --client --output=yaml
   ```

{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) додає свою власну версію `kubectl` до `PATH`. Якщо ви вже встановили Docker Desktop раніше, можливо, вам потрібно розмістити свій шлях в `PATH` перед тим, який додається інсталятором Docker Desktop, або видалити `kubectl` Docker Desktop.
{{< /note >}}

### Встановлення на Windows за допомогою Chocolatey, Scoop або winget {#install-nonstandard-package-tools}

1. Для встановлення kubectl у Windows ви можете використовувати пакетний менеджер [Chocolatey](https://chocolatey.org), командний інсталятор [Scoop](https://scoop.sh), або менеджер пакунків [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/).

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}

   ```powershell
   choco install kubernetes-cli
   ```

   {{% /tab %}}
   {{% tab name="scoop" %}}

   ```powershell
   scoop install kubectl
   ```

   {{% /tab %}}
   {{% tab name="winget" %}}

   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Перевірте, що встановлена версія оновлена:

   ```powershell
   kubectl version --client
   ```

1. Перейдіть до вашої домашньої теки:

   ```powershell
   # Якщо ви використовуєте cmd.exe, виконайте: cd %USERPROFILE%
   cd ~
   ```

1. Створіть теку `.kube`:

   ```powershell
   mkdir .kube
   ```

1. Перейдіть до теки `.kube`, що ви щойно створили:

   ```powershell
   cd .kube
   ```

1. Налаштуйте kubectl для використання віддаленого кластера Kubernetes:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Редагуйте файл конфігурації за допомогою текстового редактора на ваш вибір, наприклад, Notepad.
{{< /note >}}

## Перевірка конфігурації kubectl {#verify-kubectl-configuration}

{{< include "included/verify-kubectl.md" >}}

## Опціональні конфігурації та втулки kubectl {#optional-kubectl-configurations-and-plugins}

### Увімкнення автопідстановки оболонки {#enable-shell-autocompletion}

kubectl надає підтримку автодоповнення для оболонок Bash, Zsh, Fish та PowerShell, що може значно зекономити ваш час при введенні команд.

Нижче подані процедури для налаштування автодоповнення для PowerShell.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### Налаштування kuberc {#configure-kuberc}

Дивіться [kuberc](/docs/reference/kubectl/kuberc) для отримання докладної інформації.

### Встановлення втулка `kubectl convert` {#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

1. Завантажте останній випуск команди:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

2. Перевірте двійковий файл (опціонально).

   Завантажте файл контрольної суми для `kubectl-convert`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Перевірте бінарний файл `kubectl-convert` за допомогою файлу контрольної суми:

   - Використовуючи командний рядок для ручного порівняння виводу `CertUtil` з завантаженим файлом контрольної суми:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Використовуючи PowerShell для автоматизації перевірки за допомогою оператора `-eq` для отримання результату `True` або `False`:

     ```powershell
     Compare-String -eq (Get-FileHash kubectl-convert.exe -Algorithm SHA256).Hash (Get-Content kubectl-convert.exe.sha256)
     ```

3. Додайте на початок чи в кінець змінної середовища `PATH` шлях до теки з `kubectl-convert`.

4. Перевірте, що версія `kubectl-convert` збігається з завантаженою:

   ```cmd
   kubectl-convert version
   ```

   Або використайте це для детального перегляду версії:

   ```cmd
   kubectl-convert version --output=yaml
   ```

5. Після встановлення втулка, вилучіть інсталяційні файли:

   ```powershell
   Remove-Item kubectl-convert.exe
   Remove-Item kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
