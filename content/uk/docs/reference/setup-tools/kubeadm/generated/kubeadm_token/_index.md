Керує токенами bootstrap

### Опис {#synopsis}

Ця команда керує токенами bootstrap. Вона є опціональною та потрібна лише для розширених випадків використання.

Коротко кажучи, токени bootstrap використовуються для встановлення двосторонньої довіри між клієнтом і сервером. Токен bootstrap може бути використаний, коли клієнт (наприклад, вузол, який збирається приєднатися до кластера) має довіряти серверу, з яким він взаємодіє. У цьому випадку можна використовувати токен bootstrap зі способом використання "signing". Токени bootstrap також можуть слугувати способом дозволити короткострокову автентифікацію на API-сервері (токен слугує способом, щоб API-сервер довіряв клієнту), наприклад, для виконання TLS Bootstrap.

Що саме таке токен bootstrap?
 - Це Secret у просторі імен kube-system типу "bootstrap.kubernetes.io/token".
 - Токен bootstrap повинен мати форму "[a-z0-9]{6}.[a-z0-9]{16}". Перша частина є публічним ідентифікатором токена,
   а друга — секретом токена (Token Secret), і її потрібно зберігати в таємниці за будь-яких обставин!
 - Secret повинен мати назву "bootstrap-token-(token-id)".

Більше про токени bootstrap можна прочитати тут: https://kubernetes.io/docs/admin/bootstrap-tokens/

```
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Чи вмикати режим пробного запуску</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка для token</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може бути переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
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
