---
title: "Автодоповнення bash у macOS"
description: "Деякі необовʼязкові налаштування автодоповнення bash у macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Вступ {#introduction}

Скрипт автодоповнення kubectl для Bash можна згенерувати командою `kubectl completion bash`. Підключення цього скрипта у вашій оболонці вмикає автодоповнення kubectl.

Однак скрипт автодоповнення kubectl залежить від [**bash-completion**](https://github.com/scop/bash-completion), який потрібно встановити заздалегідь.

{{< warning >}}
Існують дві версії bash-completion: v1 і v2. V1 призначена для Bash 3.2 (стандартна версія в macOS), а v2 — для Bash 4.1+. Скрипт автодоповнення kubectl **не працює** правильно з bash-completion v1 і Bash 3.2. Він потребує **bash-completion v2** і **Bash 4.1+**. Отже, щоб правильно використовувати автодоповнення kubectl у macOS, потрібно встановити й використовувати Bash 4.1+ ([*інструкції*](https://apple.stackexchange.com/a/292760)). Наведені нижче інструкції передбачають, що ви використовуєте Bash 4.1+ (тобто будь-яку версію Bash 4.1 або новішу).
{{< /warning >}}

### Оновлення Bash {#upgrade-bash}

Ці інструкції передбачають, що ви використовуєте Bash 4.1+. Перевірити версію Bash можна, виконавши:

```bash
echo $BASH_VERSION
```

Якщо вона надто стара, ви можете встановити або оновити її за допомогою Homebrew:

```bash
brew install bash
```

Перезавантажте оболонку й перевірте, що використовується потрібна версія:

```bash
echo $BASH_VERSION $SHELL
```

Зазвичай Homebrew встановлює його в `/usr/local/bin/bash`.

### Встановлення bash-completion {#install-bash-completion}

{{< note >}}
Як уже зазначалося, ці інструкції передбачають використання Bash 4.1+, тобто ви встановлюватимете bash-completion v2 (на відміну від Bash 3.2 і bash-completion v1, де автодоповнення kubectl не працюватиме).
{{< /note >}}

Ви можете перевірити, чи вже встановлено bash-completion v2, за допомогою `type _init_completion`. Якщо ні, встановіть його за допомогою Homebrew:

```bash
brew install bash-completion@2
```

Як зазначено у виводі цієї команди, додайте наведене нижче до файлу `~/.bash_profile`:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Перезавантажте оболонку й перевірте, що bash-completion v2 правильно встановлено, за допомогою `type _init_completion`.

### Увімкнення автодоповнення kubectl {#enable-kubectl-autocompletion}

Тепер потрібно забезпечити підключення скрипта автодоповнення kubectl в усіх сеансах оболонки. Це можна зробити кількома способами:

- Підключіть скрипт автодоповнення у файлі `~/.bash_profile`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Додайте скрипт автодоповнення до теки `/usr/local/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Якщо у вас є псевдонім для kubectl, ви можете розширити автодоповнення оболонки, щоб воно працювало з цим псевдонімом:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- Якщо ви встановили kubectl за допомогою Homebrew (як пояснено [тут](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)), скрипт автодоповнення kubectl вже має бути в `/usr/local/etc/bash_completion.d/kubectl`. У цьому випадку нічого робити не потрібно.

   {{< note >}}
   Установлення bash-completion v2 через Homebrew підключає всі файли з теки `BASH_COMPLETION_COMPAT_DIR`, тому два останні способи працюють.
   {{< /note >}}

У будь-якому разі після перезавантаження оболонки автодоповнення kubectl має працювати.
