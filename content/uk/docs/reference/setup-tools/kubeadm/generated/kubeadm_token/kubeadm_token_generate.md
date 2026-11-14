
Генерує та виводить токен запуску, але не створює його на сервері

### Опис {#synopsis}

Ця команда виведе випадково згенерований токен запуску, який можна використовувати з командами "init" та "join".

Ви не зобовʼязані використовувати цю команду для створення токена. Ви можете зробити це самостійно, якщо він має формат "[a-z0-9]{6}.[a-z0-9]{16}". Ця команда надається для зручності створення токенів у зазначеному форматі.

Ви також можете використовувати "kubeadm init" без вказання токена, і він буде згенерований та виведений для вас.

```shell
kubeadm token generate [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка generate</p></td>
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
            <td colspan="2">--dry-run</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Чи ввімкнути режим dry-run чи ні</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig для використання при спілкуванні з кластером. Якщо прапорець не встановлено, можна шукати наявний файл kubeconfig у наборі стандартних місць.</p></td>
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
