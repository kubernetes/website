Видаляє токени bootstrap на сервері

### Опис {#synopsis}

Ця команда видалить для вас список токенів bootstrap.

Значення [token-value] — це повний токен у вигляді "[a-z0-9]{6}.[a-z0-9]{16}" або Token ID виду "[a-z0-9]{6}", який потрібно видалити.

```
kubeadm token delete [token-value] ...
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка для delete</p></td>
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
            <td colspan="2">--dry-run</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Чи вмикати режим пробного запуску</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може бути переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
        </tr>
        <tr>
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до 'справжньої' кореневої файлової системи хоста. Це змусить kubeadm виконати chroot у вказаний шлях.</p></td>
        </tr>
    </tbody>
</table>
