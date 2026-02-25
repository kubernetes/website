---
title: "bash auto-completion on Linux"
description: "Деякі додаткові налаштування для автозавершення bash у Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Вступ {#introduction}

Сценарій автодоповнення kubectl для Bash може бути створений за допомогою команди `kubectl completion bash`. Підключення цього сценарію у вашій оболонці дозволить вам мати автодоповнення для kubectl.

Однак сценарій залежить від [**bash-completion**](https://github.com/scop/bash-completion), що означає, що спочатку вам потрібно встановити цей скрипт (ви можете перевірити, чи вже встановлено bash-completion, виконавши команду `type _init_completion`).

### Встановлення bash-completion {#install-bash-completion}

bash-completion надається багатьма менеджерами пакунків (див. [тут](https://github.com/scop/bash-completion#installation)). Ви можете встановити його за допомогою `apt-get install bash-completion` або `yum install bash-completion` тощо.

Вищевказані команди створюють `/usr/share/bash-completion/bash_completion`, який є основним сценарієм bash-completion. Залежно від вашого менеджера пакунків, вам доведеться вручну додати цей файл у ваш `~/.bashrc` файл.

Щоб дізнатися, перезавантажте вашу оболонку і виконайте `type _init_completion`. Якщо команда виконується успішно, значить, ви вже його встановили, інакше додайте наступне до вашого `~/.bashrc` файлу:

```bash
source /usr/share/bash-completion/bash_completion
```

Перезавантажте вашу оболонку і перевірте, чи bash-completion правильно встановлено, ввівши `type _init_completion`.

### Увімкнення автодоповнення kubectl {#enable-kubectl-autocompletion}

#### Bash

Тепер вам потрібно переконатися, що сценарій автодоповнення kubectl підключений у всіх ваших сеансах оболонки. Є два способи, якими це можна зробити:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="Користувач" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="Система" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

Якщо у вас є аліас для kubectl, ви можете розширити автодоповнення оболонки, щоб воно працювало з ним:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion підключає всі сценарії автодоповнення у `/etc/bash_completion.d`.
{{< /note >}}

Обидва підходи еквівалентні. Після перезавантаження вашої оболонки автодоповнення kubectl повинно працювати. Щоб увімкнути автодоповнення bash у поточному сеансі оболонки, переініціалізуйте файл ~/.bashrc:

```bash
source ~/.bashrc
```
