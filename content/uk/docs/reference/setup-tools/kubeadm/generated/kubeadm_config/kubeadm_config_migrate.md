
Зчитує стару версію типів конфігураційного API kubeadm з файлу і виводе аналогічний обʼєкт конфігурації для нової версії

### Опис {#synopsis}

Ця команда дозволяє конвертувати обʼєкти конфігурації старих версій у найновішу підтримувану версію, локально у CLI інструменті, без жодних змін у кластері. У цій версії kubeadm підтримуються наступні версії API:

- kubeadm.k8s.io/v1beta4

Крім того, kubeadm може записувати конфігурацію лише версії "kubeadm.k8s.io/v1beta4", але читати обидві версії. Отже, незалежно від того, яку версію ви передаєте параметру --old-config, API обʼєкт буде прочитано, десеріалізовано, встановлено стандартні значення, конвертовано, валідовано та повторно серіалізовано під час запису у stdout або --new-config, якщо вказано.

Іншими словами, вихід цієї команди є тим, що kubeadm фактично читав би внутрішньо, якщо ви надіслали б цей файл команді "kubeadm init".

```shell
kubeadm config migrate [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволити міграцію на експериментальні, невипущені API</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка migrate</p></td>
        </tr>
        <tr>
            <td colspan="2">--new-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до отриманого еквівалентного конфігураційного файлу kubeadm з використанням нової версії API. Необовʼязково, якщо не вказано, вивід буде надіслано у STDOUT.</p></td>
        </tr>
        <tr>
            <td colspan="2">--old-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm, який використовує стару версію API і який має бути конвертований. Цей прапорець є обовʼязковим.</p></td>
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
