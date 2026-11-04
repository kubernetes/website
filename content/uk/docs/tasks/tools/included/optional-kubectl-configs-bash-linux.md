---
title: "Автодоповнення bash у Linux"
description: "Деякі необовʼязкові налаштування автодоповнення bash у Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Вступ {#introduction}

Скрипт автодоповнення kubectl для Bash можна згенерувати командою `kubectl completion bash`. Підключення цього скрипта у вашій оболонці вмикає автодоповнення kubectl.

Однак скрипт автодоповнення залежить від [**bash-completion**](https://github.com/scop/bash-completion), тому спочатку потрібно встановити це програмне забезпечення (ви можете перевірити, чи вже встановлено bash-completion, виконавши `type _init_completion`).

### Встановлення bash-completion {#install-bash-completion}

bash-completion є в багатьох менеджерах пакунків (див. [тут](https://github.com/scop/bash-completion#installation)). Ви можете встановити його за допомогою `apt-get install bash-completion`, `dnf install bash-completion` тощо.

Наведені вище команди створюють `/usr/share/bash-completion/bash_completion`, основний скрипт bash-completion. Залежно від вашого менеджера пакунків може знадобитися вручну підключити цей файл у файлі `~/.bashrc`.

Щоб це зʼясувати, перезавантажте оболонку й виконайте `type _init_completion`. Якщо команда виконується успішно, усе вже налаштовано; інакше додайте наведене нижче до файлу `~/.bashrc`:

```bash
source /usr/share/bash-completion/bash_completion
```

Перезавантажте оболонку й перевірте, що bash-completion правильно встановлено, виконавши `type _init_completion`.

### Увімкнення автодоповнення kubectl {#enable-kubectl-autocompletion}

#### Bash

Тепер потрібно забезпечити підключення скрипта автодоповнення kubectl в усіх сеансах оболонки. Це можна зробити двома способами:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="Користувач" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="Система" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

Якщо у вас є псевдонім для kubectl, ви можете розширити автодоповнення оболонки, щоб воно працювало з цим псевдонімом:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion підключає всі скрипти автодоповнення з `/etc/bash_completion.d`.
{{< /note >}}

Обидва підходи рівноцінні. Після перезавантаження оболонки автодоповнення kubectl має працювати. Щоб увімкнути автодоповнення bash у поточному сеансі оболонки, підключіть файл ~/.bashrc:

```bash
source ~/.bashrc
```
