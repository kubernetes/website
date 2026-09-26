Виводить стандартну конфігурацію для оновлення, яка може бути використана для 'kubeadm upgrade'

### Опис {#synopsis}

Ця команда виводить обʼєкти, такі як стандартна конфігурація команди upgrade, яка використовується для 'kubeadm upgrade'.

Зверніть увагу, що конфіденційні значення, такі як поля Bootstrap Token, замінюються значеннями-заповнювачами, такими як abcdef.0123456789abcdef", щоб пройти перевірку, але не виконувати реальні дії для створення токена.

```shell
kubeadm config print upgrade-defaults [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка upgrade-defaults</p></td>
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
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig для використання при спілкуванні з кластером. Якщо прапорець не встановлено, набір стандартних розташувань може бути перевірений на наявність поточного файлу kubeconfig.</p></td>
        </tr>
        <tr>
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
        </tr>
    </tbody>
</table>
