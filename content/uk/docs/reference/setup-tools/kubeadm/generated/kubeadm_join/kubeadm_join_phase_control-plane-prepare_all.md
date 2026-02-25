### Опис {#synopsis}

Готує машину для роботи як панелі управління.

```shell
kubeadm join phase control-plane-prepare all [api-server-endpoint] [flags]
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
            <td colspan="2">--certificate-key string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Ключ, що використовується для шифрування сертифікатів панелі управління у Secret kubeadm-certs. Ключ сертифіката — це шістнадцятковий рядок, який є ключем AES розміром 32 байти</p></td>
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
            <td colspan="2">--discovery-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі файлу, файл або URL, з якого буде завантажена інформація про кластер.</p></td>
        </tr>
        <tr>
            <td colspan="2">--discovery-token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, токен, який використовується для перевірки інформації про кластер, отриманої з сервера API.</p></td>
        </tr>
        <tr>
            <td colspan="2">--discovery-token-ca-cert-hash strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, перевірити, що публічний ключ кореневого центру сертифікації відповідає цьому хешу (формат: "&lt;тип&gt;:&lt;значення&gt;").</p></td>
        </tr>
        <tr>
            <td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, дозволити приєднання без закріплення --discovery-token-ca-cert-hash.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка all</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть імʼя вузла.</p></td>
        </tr>
        <tr>
            <td colspan="2">--patches string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з іменами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot;, і вони відповідають форматам патчів, що підтримуються kubectl. Стандартно &quot;patchtype&quot; є &quot;strategic&quot;. &quot;extension&quot; повинно бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; є необовʼязковим рядком, який можна використовувати для визначення, які патчі застосовуються першими за алфавітно-цифровим порядком.</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-bootstrap-token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть токен, який використовується для тимчасової автентифікації з Панеллю Управління Kubernetes під час приєднання вузла.</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте цей токен для discovery-token та tls-bootstrap-token, коли ці значення не вказані окремо.</p></td>
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
