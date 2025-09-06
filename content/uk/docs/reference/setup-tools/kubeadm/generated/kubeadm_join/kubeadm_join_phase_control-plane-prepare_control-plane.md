### Опис {#synopsis}

Генерує маніфести для нових компонентів панелі управління.

```shell
kubeadm join phase control-plane-prepare control-plane [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--apiserver-advertise-address string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якому API-сервер буде оголошувати що віе прослуховує звернення. Якщо не вказано, використовується стандартний мережевий інтерфейс.</p></td>
        </tr>
        <tr>
            <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 6443</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, до якого API-сервер буде привʼязуватися.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--control-plane</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Створити новий екземпляр панелі управління на цьому вузлі</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка control-plane</p></td>
        </tr>
        <tr>
            <td colspan="2">--patches string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з іменами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot;, і вони відповідають форматам патчів, що підтримуються kubectl. Стандартно &quot;patchtype&quot; є &quot;strategic&quot;. &quot;extension&quot; повинно бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; є необовʼязковим рядком, який можна використовувати для визначення, які патчі застосовуються першими за алфавітно-цифровим порядком.</p></td>
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
