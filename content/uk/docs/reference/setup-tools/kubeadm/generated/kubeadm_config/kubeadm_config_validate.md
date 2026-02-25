
Зчитує файл, що містить конфігураційний API kubeadm, і повідомляє про будь-які проблеми під час валідації

### Опис {#synopsis}

Ця команда дозволяє перевірити файл конфігурації API kubeadm та повідомити про будь-які попередження та помилки. Якщо помилок немає, статус виводу буде нульовим, в іншому випадку він буде ненульовим. Будь-які проблеми з розбором, такі як невідомі поля API, спричинять помилки. Невідомі версії API та поля з недійсними значеннями також спричинять помилки. Будь-які інші помилки або попередження можуть бути повідомлені залежно від вмісту вхідного файлу.

У цій версії kubeadm підтримуються наступні версії API:

- kubeadm.k8s.io/v1beta4


```shell
kubeadm config validate [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--allow-experimental-api</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє валідацію експериментальних, невипущених API.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка validate</p></td>
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
