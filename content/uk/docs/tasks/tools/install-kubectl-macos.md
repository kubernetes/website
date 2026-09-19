---
title: Встановлення та налаштування kubectl у macOS
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Вам потрібно використовувати версію kubectl, яка має мінорну версію що відрізняється не більше ніж на одиницю від мінорної версії вашого кластера. Наприклад, клієнт v{{< skew currentVersion >}} може співпрацювати з панелями управління v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} та v{{< skew currentVersionAddMinor 1 >}}. Використання останньої сумісної версії kubectl допомагає уникнути непередбачуваних проблем.

## Встановлення kubectl у macOS {#install-kubectl-on-macos}

Існують наступні методи встановлення kubectl у macOS:

- [Встановлення kubectl у macOS](#install-kubectl-on-macos)
  - [Встановлення бінарника kubectl з curl у macOS](#install-kubectl-binary-with-curl-on-macos)
  - [Встановлення з Homebrew у macOS](#install-with-homebrew-on-macos)
  - [Встановлення з Macports у macOS](#install-with-macports-on-macos)
- [Перевірка конфігурації kubectl](#verify-kubectl-configuration)
- [Опціональне налаштування kubectl та втулка](#optional-kubectl-configurations-and-plugins)
  - [Увімкнення автопідстановки оболонки](#enable-shell-autocompletion)
  - [Встановлення втулка `kubectl convert`](#install-kubectl-convert-plugin)

### Встановлення бінарника kubectl з curl у macOS {#install-kubectl-binary-with-curl-on-macos}

1. Завантажте останнє видання:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Щоб завантажити певну версію, замініть частину `$(curl -L -s https://dl.k8s.io/release/stable.txt)` команди на конкретну версію.

   Наприклад, щоб завантажити версію {{< skew currentPatchVersion >}} на Intel macOS, введіть:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   А для macOS на Apple Silicon, введіть:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

2. Перевірте бінарний файл (опціонально)

   Завантажте файл контрольної суми для kubectl:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Перевірте бінарний файл kubectl за допомогою файлу контрольної суми:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   Якщо перевірка пройшла успішно, вивід буде таким:

   ```console
   kubectl: OK
   ```

   Якщо перевірка не вдалася, `shasum` виходить з ненульовим статусом і виводить подібне повідомлення:

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Завантажте ту саму версію бінарного файлу та файлу контрольної суми.
   {{< /note >}}

3. Зробіть бінарний файл kubectl виконуваним.

   ```bash
   chmod +x ./kubectl
   ```

4. Перемістіть бінарний файл kubectl до розташування файлу на вашій системі `PATH`.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Переконайтеся, що `/usr/local/bin` є в вашій змінній середовища PATH.
   {{< /note >}}

5. Перевірте, що встановлена версія kubectl актуальна:

   ```bash
   kubectl version --client
   ```

   Або використовуйте це для детального перегляду версії:

   ```cmd
   kubectl version --client --output=yaml
   ```

6. Після встановлення та перевірки kubectl видаліть файл контрольної суми:

   ```bash
   rm kubectl.sha256
   ```

### Встановлення за допомогою Homebrew у macOS {#install-with-homebrew-on-macos}

Якщо ви користуєтеся macOS і пакетним менеджером [Homebrew](https://brew.sh/), ви можете встановити kubectl за допомогою Homebrew.

1. Виконайте команду встановлення:

   ```bash
   brew install kubectl
   ```

   або

   ```bash
   brew install kubernetes-cli
   ```

2. Перевірте, що встановлена версія актуальна:

   ```bash
   kubectl version --client
   ```

### Встановлення за допомогою Macports у macOS {#install-with-macports-on-macos}

Якщо ви користуєтеся macOS і пакетним менеджером [Macports](https://macports.org/), ви можете встановити kubectl за допомогою Macports.

1. Виконайте команду встановлення:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

2. Перевірте, що встановлена версія актуальна:

   ```bash
   kubectl version --client
   ```

## Перевірка конфігурації kubectl {#verify-kubectl-configuration}

{{< include "included/verify-kubectl.md" >}}

## Опціональне налаштування kubectl та втулка {#optional-kubectl-configurations-and-plugins}

### Увімкнення автопідстановки оболонки {#enable-shell-autocompletion}

kubectl надає підтримку автодоповнення для оболонок Bash, Zsh, Fish та PowerShell, що може значно зекономити ваш час при введенні команд.

Нижче подані процедури для налаштування автодоповнення для оболонок Bash, Fish та Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Налаштування kuberc {#configure-kuberc}

Дивіться [kuberc](/docs/reference/kubectl/kuberc) для отримання докладної інформації.

### Встановлення втулка `kubectl convert` {#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

1. Завантажте останній випуск команди:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

2. Перевірте двійковий файл (опціонально):

   Завантажте файл контрольної суми для kubectl-convert:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Перевірте двійковий файл kubectl-convert за допомогою файлу контрольної суми:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   Якщо перевірка пройшла успішно, вивід буде таким:

   ```console
   kubectl-convert: OK
   ```

   Якщо перевірка не вдалася, `shasum` виходить з ненульовим статусом і виводить подібне повідомлення:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Завантажте ту саму версію бінарного файлу та файлу контрольної суми.
   {{< /note >}}

3. Зробіть двійковий файл kubectl-convert виконуваним.

   ```bash
   chmod +x ./kubectl-convert
   ```

4. Перемістіть двійковий файл kubectl-convert до розташування файлу у вашій системі `PATH`.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   Переконайтеся, що `/usr/local/bin` є в вашій змінній середовища PATH.
   {{< /note >}}

5. Перевірте, що втулок було встановлено:

   ```bash
   kubectl convert --help
   ```

   Якщо ви не бачите жодних помилок, втулок було встановлено успішно.

6. Після встановлення та перевірки kubectl-convert видаліть файл контрольної суми:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### Видалення kubectl {#uninstall-kubectl}

Залежно від того, як ви встановили `kubectl`, використовуйте один з наступних методів.

### Видалення kubectl за допомогою командного рядка {#uninstall-kubectl-using-the-command-line}

1. Знайдіть бінарний файл `kubectl` у вашій системі:

   ```bash
   which kubectl
   ```

2. Видаліть бінарний файл `kubectl`:

   ```bash
   sudo rm <path>
   ```

   Замініть `<path>` на шлях до бінарного файлу `kubectl` з попереднього кроку. Наприклад, `sudo rm /usr/local/bin/kubectl`.

### Видалення kubectl за допомогою Homebrew {#uninstall-kubectl-using-homebrew}

Якщо ви встановили `kubectl` за допомогою Homebrew, виконайте наступну команду:

```bash
brew remove kubectl
```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
