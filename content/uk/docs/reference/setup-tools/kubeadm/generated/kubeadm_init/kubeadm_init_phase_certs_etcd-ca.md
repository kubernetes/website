
Генерує самопідписаний центр сертифікації для надання ідентифікаторів для etcd

### Опис {#synopsis}

Ця команда генерує самопідписаний центр сертифікації (CA) для надання ідентифікаторів для etcd, та зберігає їх у файлах etcd/ca.crt та etcd/ca.key.

Якщо обидва файли вже існують, kubeadm пропускає крок генерації та використовує наявні файли.

```shell
kubeadm init phase certs etcd-ca [flags]
```

### Операції {#operations}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/pki"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях, де будуть збережені сертифікати</p></td>
        </tr>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка etcd-ca</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "stable-1"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вибрати конкретну версію Kubernetes для панелі управління.</p></td>
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
