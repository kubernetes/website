---
title: Встановлення та налаштування kubectl у Linux
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Вам потрібно використовувати версію kubectl, яка має мінорну версію що відрізняється не більше ніж на одиницю від мінорної версії вашого кластера. Наприклад, клієнт v{{< skew currentVersion >}} може співпрацювати з панелями управління v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} та v{{< skew currentVersionAddMinor 1 >}}. Використання останньої сумісної версії kubectl допомагає уникнути непередбачуваних проблем.

## Встановлення kubectl у Linux {#install-kubectl-on-linux}

Існують наступні методи встановлення kubectl у Linux:

- [Встановлення бінарного файлу kubectl за допомогою curl у Linux](#install-kubectl-binary-with-curl-on-linux)
- [Встановлення за допомогою стандартного пакетного менеджера](#install-using-native-package-management)
- [Встановлення за допомогою іншого пакетного менеджера](#install-using-other-package-management)

### Встановлення бінарного файлу kubectl за допомогою curl у Linux {#install-kubectl-binary-with-curl-on-linux}

1. Завантажте останній випуск за допомогою команди:

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Щоб завантажити певну версію, замініть частину команди `$(curl -L -s https://dl.k8s.io/release/stable.txt)` конкретною версією.

   Наприклад, щоб завантажити версію {{< skew currentPatchVersion >}} у Linux x86-64, введіть:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   А для Linux ARM64:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /note >}}

2. Перевірте бінарний файл (опційно)

   Завантажте файл хеш-суми kubectl:

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Перевірте бінарний файл kubectl за допомогою файлу хеш-суми:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   Якщо результат валідний, виведе:

   ```console
   kubectl: OK
   ```

   Якщо перевірка не пройшла, `sha256` поверне ненульовий статус і виведе повідомлення подібне до:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Завантажте ту ж версію бінарного файлу та файлу хеш-суми.
   {{< /note >}}

3. Встановіть kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Якщо у вас немає прав root на цільовій системі, все одно можна встановити
   kubectl у тека `~/.local/bin`:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # а потім додайте (в початок чи кінець) ~/.local/bin до $PATH
   ```

   {{< /note >}}

4. Перевірте, щоб переконатися, що встановлена вами версія є актуальною:

   ```bash
   kubectl version --client
   ```

   Або скористайтеся цим для детального перегляду версії:

   ```cmd
   kubectl version --client --output=yaml
   ```

### Встановлення за допомогою стандартного пакетного менеджера {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="Дистрибутиви на основі Debian" %}}

1. Оновіть індекс пакунків `apt` та встановіть пакунки, необхідні для використання репозиторію `apt` Kubernetes:

   ```shell
   sudo apt-get update
   # apt-transport-https може бути макетним пакетом; якщо так, ви можете пропустити цей пакет
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. Завантажте публічний ключ підпису для репозиторіїв пакунків Kubernetes. Той самий ключ підпису використовується для всіх репозиторіїв, тому ви можете проігнорувати версію в URL:

   ```shell
   # Якщо тека `/etc/apt/keyrings` не існує, її слід створити перед запуском curl, прочитайте примітку нижче.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # дозволяє непривілейованим програмам APT читати цей ключ
   ```

{{< note >}}
У випусках старших за Debian 12 і Ubuntu 22.04 тека `/etc/apt/keyrings` не існує, її слід створити перед запуском команди curl.
{{< /note >}}

3. Додайте відповідний репозиторій Kubernetes `apt`. Якщо ви хочете використовувати версію Kubernetes, відмінну від {{< param "version" >}}, замініть {{< param "version" >}} на потрібну мінорну версію в команді нижче:

   ```shell
   # Це перезапише будь-яку існуючу конфігурацію в /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # допомагає правильно працювати з такими інструментами, як command-not-found
   ```

{{< note >}}
Щоб оновити kubectl до іншого мінорного видання, вам потрібно буде збільшити версію в `/etc/apt/sources.list.d/kubernetes.list` перед виконанням `apt-get update` та `apt-get upgrade`. Цю процедуру більш докладно описано в [Зміні репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

4. Оновіть індекс пакунків `apt`, а потім встановіть kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Дистрибутиви на основі Red Hat" %}}

1. Додайте репозиторій Kubernetes `yum`. Якщо ви хочете використовувати версію Kubernetes, відмінну від {{< param "version" >}}, замініть {{< param "version" >}} на потрібну мінорну версію в команді нижче.

   ```bash
   # Це перезапише будь-яку існуючу конфігурацію у /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
Щоб оновити kubectl до іншого мінорного випуску, вам потрібно буде збільшити версію в `/etc/yum.repos.d/kubernetes.repo` перед виконанням `yum update`. Цю процедуру більш докладно описано в [Зміні репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Встановіть kubectl за допомогою `yum`:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Дистрибутиви на основі SUSE" %}}

1. Додайте репозиторій Kubernetes `zypper`. Якщо ви хочете використовувати версію Kubernetes, відмінну від {{< param "version" >}}, замініть {{< param "version" >}} на потрібну мінорну версію в команді нижче.

   ```bash
   # Це перезапише будь-яку існуючу конфігурацію у /etc/zypp/repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
Щоб оновити kubectl до іншого мінорного випуску, вам потрібно буде збільшити версію в `/etc/zypp/repos.d/kubernetes.repo` перед виконанням `zypper update`. Цю процедуру більш докладно описано в
[Зміні репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Оновіть `zypper` і підтвердіть додавання нового репозиторію:

   ```bash
   sudo zypper update
   ```

   Коли зʼявиться таке повідомлення, натисніть 't' або 'a':

   ```сonsole
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```

3. Встановіть `kubectl`, використовуючи `zypper`:

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}
{{< /tabs >}}

### Встановлення за допомогою іншого пакетного менеджера {#install-using-other-package-management}

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Якщо ви користуєтеся Ubuntu або іншим дистрибутивом Linux, який підтримує менеджер пакунків [snap](https://snapcraft.io/docs/core/install), kubectl доступний як застосунок [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Якщо ви користуєтеся Linux і використовуєте пакетний менеджер [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), kubectl доступний для [встановлення](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Перевірка конфігурації Verify {#verify-kubectl-configuration}

{{< include "included/verify-kubectl.md" >}}

## Необовʼязкові налаштування та втулки kubectl {#optional-kubectl-configurations-and-plugins}

### Увімкнення функціонала автодоповнення оболонки {#enable-shell-autocompletion}

kubectl надає підтримку автодоповнення для оболонок Bash, Zsh, Fish та PowerShell, що може зекономити вам багато часу на набір тексту.

Нижче наведені процедури для налаштування автодоповнення для оболонок Bash, Fish та Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Налаштування kuberc {#configure-kuberc}

Дивіться [kuberc](/docs/reference/kubectl/kuberc) для отримання докладної інформації.

### Встановлення втулка `kubectl convert` {#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

1. Завантажте останній випуск за допомогою наступної команди:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Перевірте бінарний файл (опціонально)

   Завантажте файл контрольної суми для kubectl-convert:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Перевірте бінарний файл kubectl-convert за допомогою файлу контрольної суми:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   Якщо перевірка пройшла успішно, вивід буде таким:

   ```console
   kubectl-convert: OK
   ```

   Якщо перевірка не вдалася, `sha256` виходить з ненульовим статусом і виводить подібне повідомлення:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Завантажте ту саму версію бінарного файлу та файлу контрольної суми.
   {{< /note >}}

1. Встановіть kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Перевірте, чи втулок успішно встановлено

   ```shell
   kubectl convert --help
   ```

   Якщо ви не бачите помилку, це означає, що втулок успішно встановлено.

1. Після встановлення втулка, вилучіть файли встановлення:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
