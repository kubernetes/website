
Керує токенами bootstrap

### Опис {#synopsis}

Ця команда управляє bootstrap токенами. Вона є опціональною та необхідна лише для розширених випадків використання.

Коротко кажучи, bootstrap токени використовуються для встановлення двосторонньої довіри між клієнтом і сервером. Bootstrap токен може бути використаний, коли клієнт (наприклад, вузол, який збирається приєднатися до кластера) має довіряти серверу, з яким він взаємодіє. У цьому випадку можна використовувати bootstrap токен з дозволом на "підписування" ("signing"). Bootstrap токени також можуть функціонувати як спосіб дозволити короткострокову автентифікацію на API сервері (токен слугує способом, щоб API сервер довіряв клієнту), наприклад, для виконання TLS Bootstrap.

Що таке bootstrap токен більш конкретно?
- Це Secret у просторі імен kube-system типу "bootstrap.kubernetes.io/token".
- Bootstrap токен повинен мати форму "[a-z0-9]{6}.[a-z0-9]{16}". Перша частина є публічним ідентифікатором токена, а друга — секретом токена, який повинен бути збережений у таємниці за будь-яких обставин!
- Назва Secret повинна бути "bootstrap-token-(token-id)".

Більше інформації про bootstrap токени можна знайти тут: [https://kubernetes.io/docs/admin/bootstrap-tokens/](/docs/admin/bootstrap-tokens/)

```shell
kubeadm token [flags]
```

### Параметри {#options}

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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Не застосовувати жодних змін; просто вивести, що буде зроблено.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка token</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може буити переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
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
