---
title: "bash auto-completion on macOS"
description: "Деякі додаткові налаштування для автозавершення bash у macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Вступ {#introduction}

Сценарій автодоповнення для Bash kubectl можна згенерувати за допомогою команди `kubectl completion bash`. Підключення цього сценарію в вашій оболонці дозволяє використовувати автодоповнення для kubectl.

Проте, сценарій автодоповнення для kubectl залежить від [**bash-completion**](https://github.com/scop/bash-completion), який потрібно встановити заздалегідь.

{{< warning>}}
Існують дві версії bash-completion: v1 і v2. V1 призначена для Bash 3.2 (яка є стандартною версією у macOS), а v2 — для Bash 4.1+. Сценарій автодоповнення для kubectl **не працює** коректно з bash-completion v1 та Bash 3.2. Для правильного використання автодоповнення для kubectl у macOS потрібно використовувати **bash-completion v2** та **Bash 4.1+**. Таким чином, для коректного використання автодоповнення для kubectl у macOS вам необхідно встановити та використовувати Bash 4.1+ ([*інструкції*](https://apple.stackexchange.com/a/292760)). Наступні інструкції передбачають, що ви використовуєте Bash 4.1+ (тобто будь-яку версію Bash 4.1 чи новіше).
{{< /warning >}}

#### Оновлення Bash {#upgrade-bash}

Інструкції тут передбачають, що ви використовуєте Bash 4.1+. Ви можете перевірити версію свого Bash, виконавши:

```bash
echo $BASH_VERSION
```

Якщо вона є занадто старою, ви можете встановити/оновити її за допомогою Homebrew:

```bash
brew install bash
```

Перезавантажте вашу оболонку і перевірте, що використовується бажана версія:

```bash
echo $BASH_VERSION $SHELL
```

Зазвичай Homebrew встановлює його в `/usr/local/bin/bash`.

#### Встановлення bash-completion {#install-bash-completion}

{{< note >}}
Як вже зазначалося, ці інструкції передбачають використання Bash 4.1+, що означає, що ви будете встановлювати bash-completion v2 (на відміну від Bash 3.2 та bash-completion v1, у якому випадку автодоповнення для kubectl не буде працювати).
{{< /note >}}

Ви можете перевірити, чи вже встановлена bash-completion v2, використавши команду `type _init_completion`. Якщо ні, ви можете встановити її за допомогою Homebrew:

```bash
brew install bash-completion@2
```

Як зазначено в виводі цієї команди, додайте наступне до вашого файлу `~/.bash_profile`:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Перезавантажте вашу оболонку і перевірте, що bash-completion v2 встановлена коректно за допомогою `type _init_completion`.

#### Активація автодоповнення для kubectl {#enable-kubectl-autocompletion}

Тепер вам потрібно забезпечити, щоб сценарій автодоповнення для kubectl підключався в усіх ваших сеансах оболонки. Існують кілька способів досягнення цього:

- Підключіть сценарій автодоповнення до вашого файлу `~/.bash_profile`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Додайте сценарій автодоповнення до теки `/usr/local/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Якщо у вас є аліас для kubectl, ви можете розширити автодоповнення оболонки, щоб воно працювало з цим аліасом:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- Якщо ви встановили kubectl за допомогою Homebrew (як пояснено [тут](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)), то сценарій автодоповнення для kubectl вже повинен знаходитися у `/usr/local/etc/bash_completion.d/kubectl`. У цьому випадку вам нічого робити не потрібно.

   {{< note >}}
   Установка bash-completion v2 за допомогою Homebrew додає всі файли у теку `BASH_COMPLETION_COMPAT_DIR`, тому останні два методи працюють.
   {{< /note >}}

У будь-якому випадку, після перезавантаження оболонки, автодоповнення для kubectl повинно працювати.
