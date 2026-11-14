### Опис {#synopsis}

Виводить код завершення команд для вказаної оболонки (bash або zsh). Код оболонки має бути виконаний, щоб забезпечити інтерактивне завершення команд kubeadm. Це можна зробити, підключивши його (source) у файлі .bash_profile.

Примітка: для цього потрібен фреймворк bash-completion.

Щоб встановити його на Mac, використовуйте homebrew: $ brew install bash-completion Після встановлення потрібно виконати bash_completion. Це можна зробити, додавши такий рядок до .bash_profile $ source $(brew --prefix)/etc/bash_completion

Якщо bash-completion не встановлено в Linux, встановіть пакет 'bash-completion' за допомогою менеджера пакетів вашого дистрибутива.

Примітка для користувачів zsh: [1] завершення команд у zsh підтримується лише у версіях zsh &gt;= 5.2

```
kubeadm completion SHELL [flags]
```

### Приклади {#examples}

```

# Install bash completion on a Mac using homebrew
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Load the kubeadm completion code for bash into the current shell
source <(kubeadm completion bash)

# Write bash completion code to a file and source it from .bash_profile
kubeadm completion bash > ~/.kube/kubeadm_completion.bash.inc
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Load the kubeadm completion code for zsh[1] into the current shell
source <(kubeadm completion zsh)
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка для completion</p></td>
        </tr>
    </tbody>
</table>

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до 'справжньої' кореневої файлової системи хоста. Це змусить kubeadm виконати chroot у вказаний шлях.</p></td>
        </tr>
    </tbody>
</table>
