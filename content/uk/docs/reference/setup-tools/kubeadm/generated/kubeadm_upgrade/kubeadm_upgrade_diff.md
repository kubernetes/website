### Опис {#synopsis}

Показує які відмінності можуть бути застосовані до наявних маніфестів статичних Pod. Дивіться також: `kubeadm upgrade apply --dry-run`

```shell
kubeadm upgrade diff [version] [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 3</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Скільки рядків контексту в виведенні diff.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка diff</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який буде використовуватися при зверненні до кластера. Якщо прапорець не заданий, буде проведено пошук файлу kubeconfig в стандартних місцях.</p></td>
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
