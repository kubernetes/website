### Опис {#synopsis}

Виводить код завершення команд для вказаного командного інтерпретатора (bash або zsh). Код оболонки має бути використаний, щоб забезпечити інтерактивне завершення команд kubeadm. Це можна зробити, отримавши його з .bash_profile.

Примітка: Ця команда  вимагає наявності пакету bash-completion.

Для встановлення на macOS використовуйте brew:

```shell
brew install bash-completion
```

Після встановлення bash-completion, вам потрібно додати наступний код у ваш файл .bash_profile:

```shell
source $(brew --prefix)/etc/bash_completion
```

Якщо bash-completion не встановлено у Linux, встановіть його за допомогою пакетного менеджера вашої системи.

Примітка для користувачів zsh: [1] zsh completion підтримується тількіи для версій zsh &gt;= 5.2.

```shell
kubeadm completion SHELL [flags]
```

### Приклади {#examples}

```shell
# Встановлення bash completion на Mac за допомогою homebrew
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Завантаження коду completion kubeadm для bash у поточну оболонку
source <(kubeadm completion bash)

# Запишіть код завершення bash у файл і викличте його з .bash_profile
kubeadm completion bash > ~/.kube/kubeadm_completion.bash.inc
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Завантажте код завершення kubeadm для zsh[1] у поточну оболонку
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
        <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка completion</p></td>
        </tr>
    </tbody>
</table>

### Параметри успадковані від батьківських команд {#options-inherited-from-parent-commands}

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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
        </tr>
    </tbody>
</table>
