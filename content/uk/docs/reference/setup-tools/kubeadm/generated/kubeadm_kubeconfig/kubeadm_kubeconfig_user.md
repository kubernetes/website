### Опис {#synopsis}

Виводить файл kubeconfig для додаткового користувача.

```shell
kubeadm kubeconfig user [flags]
```

### Приклади {#examples}

```shell
# Виводить файл kubeconfig для додаткового користувача з іменем foo
kubeadm kubeconfig user --client-name=foo

# Виводить файл kubeconfig для додаткового користувача з іменем foo, використовуючи конфігураційний файл kubeadm bar
kubeadm kubeconfig user --client-name=foo --config=bar
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--client-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача. Буде використовуватися як CN у разі створення клієнтських сертифікатів</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка user</p></td>
        </tr>
        <tr>
            <td colspan="2">--org strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Організації сертифіката клієнта. Буде використовуватися як O, якщо будуть створені клієнтські сертифікати</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>TТокен, який слід використовувати як механізм автентифікації для цього kubeconfig замість клієнтських сертифікатів</td>
        </tr>
        <tr>
            <td colspan="2">--validity-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 8760h0m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Термін дії клієнтського сертифіката. Відраховується від поточного часу.</p></td>
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
