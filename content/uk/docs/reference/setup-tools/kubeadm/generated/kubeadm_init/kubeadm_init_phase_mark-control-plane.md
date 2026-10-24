### Опис {#synopsis}

Позначає вузол як вузол панелі управління.

```shell
kubeadm init phase mark-control-plane [flags]
```

### Приклади {#examples}

```shell
# Застосовує мітку та taint панелі управління до поточного вузла, функціонально еквівалентно до того, що виконується командою kubeadm init.
kubeadm init phase mark-control-plane --config config.yaml

# Застосовує мітку та taint панелі управління до конкретного вузла
kubeadm init phase mark-control-plane --node-name myNode
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
        </tr>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка mark-control-plane</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть імʼя вузла.</p></td>
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
