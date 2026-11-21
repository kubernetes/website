### Опис {#synopsis}

Поновлює сертифікат, вбудований у файл kubeconfig для використання менеджером контролерів.

Поновлення виконується безумовно, незалежно від дати закінчення терміну дії сертифіката; додаткові атрибути, такі як SAN, будуть базуватися на наявних файлах/сертифікатах, нема потреби вказувати їх повторно.

Типово поновлення намагається використовувати центр сертифікації в локальному PKI, керованому kubeadm; як альтернативу можна використовувати API сертифікатів K8s для поновлення сертифікатів, або, як останній варіант, згенерувати CSR-запит.

Після поновлення, щоб зміни набули чинності, необхідно перезапустити компоненти панелі управління та, за потреби, повторно розповсюдити поновлений сертифікат, якщо файл використовується деінде.

```
kubeadm certs renew controller-manager.conf [flags]
```

### Параметри {#options}

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
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка для controller-manager.conf</p></td>
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
