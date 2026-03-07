### Опис {#synopsis}

Запустіть цю команду, щоб налаштувати панель управління Kubernetes

Команда "init" виконує наступні етапи:

```none
preflight                     Виконання перевірок перед запуском
certs                         Генерація сертифікатів
  /ca                           Генерація самопідписаного CA Kubernetes для забезпечення ідентифікації інших компонентів Kubernetes
  /apiserver                    Генерація сертифіката для обслуговування Kubernetes API
  /apiserver-kubelet-client     Генерація сертифіката для зʼєднання API server з kubelet
  /front-proxy-ca               Генерація самопідписаного CA для забезпечення ідентифікації front proxy
  /front-proxy-client           Генерація сертифіката для клієнта front proxy
  /etcd-ca                      Генерація самопідписаного CA для забезпечення ідентифікації etcd
  /etcd-server                  Генерація сертифіката для обслуговування etcd
  /etcd-peer                    Генерація сертифіката для звʼязку між вузлами etcd
  /etcd-healthcheck-client      Генерація сертифіката для перевірки живучості etcd
  /apiserver-etcd-client        Генерація сертифіката, який використовується apiserver для доступу до etcd
  /sa                           Генерація приватного ключа для підписання токенів службових облікових записів разом з його відкритим ключем
kubeconfig                    Генерація всіх kubeconfig файлів, необхідних для створення панелі управління, та kubeconfig файлу адміністратора
  /admin                        Генерація kubeconfig файлу для використання адміністратором та самим kubeadm
  /super-admin                  Генерація kubeconfig файлу для супер-адміністратора
  /kubelet                      Генерація kubeconfig файлу для використання kubelet *лише* для завантаження кластера
  /controller-manager           Генерація kubeconfig файлу для використання контролер-менеджером
  /scheduler                    Генерація kubeconfig файлу для використання планувальником
etcd                          Генерація маніфесту статичного Pod для локального etcd
  /local                        Генерація маніфесту статичного Pod для локального, одновузлового локального etcd
control-plane                 Генерація всіх маніфестів статичних Podʼів, необхідних для створення панелі управління
  /apiserver                    Генерація маніфесту статичного Pod для kube-apiserver
  /controller-manager           Генерація маніфесту статичного Pod для kube-controller-manager
  /scheduler                    Генерація маніфесту статичного Pod для kube-scheduler
kubelet-start                 Запис налаштувань kubelet та (перезавантаження) kubelet
upload-config                 Завантаження конфігурації kubeadm та kubelet до ConfigMap
upload-config                 Завантаження конфігурації kubeadm та kubelet у ConfigMap
  /kubeadm                      Завантаження конфігурації кластера kubeadm у ConfigMap
  /kubelet                      Завантаження конфігурації компоненту kubelet у ConfigMap
upload-certs                  Завантаження сертифікатів у kubeadm-certs
mark-control-plane            Маркування вузла як вузла панелі управління
bootstrap-token               Генерація bootstrap токенів, які використовуються для приєднання вузла до кластера
kubelet-finalize             Оновлення налаштувань, що стосуються kubelet, після TLS завантаження
  /enable-client-cert-rotation  Ввімкнути ротацію сертифікатів клієнтів kubelet
addon                        Встановлення необхідних надбудов для проходження тестів відповідності
  /coredns                     Встановлення надбудови CoreDNS у Kubernetes кластер
  /kube-proxy                  Встановлення надбудови kube-proxy у Kubernetes кластер
show-join-command            Показати команду приєднання для вузлів керування та робочих вузлів
```

```shell
kubeadm init [прапорці]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP адреса, за якою API Server буде оголошувати, що він слухає. Якщо не встановлено, буде використаний стандартний мережевий інтерфейс.</p></td>
        </tr>
        <tr>
            <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 6443</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Порт, до якого буде привʼязаний API Server.</p></td>
        </tr>
        <tr>
            <td colspan="2">--apiserver-cert-extra-sans strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові опціональні альтернативні імена субʼєкта (SANs) для використання в сертифікаті обслуговування API Server. Можуть бути як IP-адреси, так і DNS імена.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/pki"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях для збереження та зберігання сертифікатів.</p></td>
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
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--control-plane-endpoint string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть стабільну IP адресу або DNS імʼя для панелі управління.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cri-socket string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до сокета CRI для підключення. Якщо не заповнено, kubeadm спробує автоматично визначити це значення; використовуйте цю опцію тільки якщо у вас встановлено більше одного CRI або якщо у вас нестандартний сокет CRI.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Не застосовувати жодних змін; просто вивести, що буде зроблено.</p></td>
        </tr>
        <tr>
            <td colspan="2">--feature-gates string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пар ключ=значення, що описують функціональні можливості для різних функцій. Опції:<br/>
                ControlPlaneKubeletLocalMode=true|false (default=true)<br/>
                NodeLocalCRISocket=true|false (BETA - default=true)<br/>
                PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
                RootlessControlPlane=true|false (ALPHA - default=false)</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка init</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-preflight-errors strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки всіх перевірок.</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "registry.k8s.io"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виберіть реєстр контейнерів для завантаження образів панелі управління</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "stable-1"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виберіть конкретну версію Kubernetes для панелі управління.</p></td>
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
            <td colspan="2">--pod-network-cidr string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть діапазон IP-адрес для мережі Podʼів. Якщо встановлено, панель управління автоматично виділить CIDR для кожного вузла.</p></td>
        </tr>
        <tr>
            <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "10.96.0.0/12"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте альтернативний діапазон IP-адрес для VIP сервісів.</p></td>
        </tr>
        <tr>
            <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "cluster.local"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте альтернативний домен для сервісів, наприклад &quot;myorg.internal&quot;.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-certificate-key-print</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Не виводити ключ, який використовується для шифрування сертифікатів панелі управління.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-phases strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список етапів, які потрібно оминути</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-token-print</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пропустити друк стандартного bootstrap токена, згенерованого 'kubeadm init'.</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Токен для встановлення двосторонньої довіри між вузлами та вузлами панелі управління. Формат [a-z0-9]{6}.[a-z0-9]{16} — наприклад, abcdef.0123456789abcdef</p></td>
        </tr>
        <tr>
            <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 24h0m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час перед автоматичним видаленням токена (наприклад, 1s, 2m, 3h). Якщо встановлено '0', токен ніколи не закінчиться</p></td>
        </tr>
        <tr>
            <td colspan="2">--upload-certs</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Завантажити сертифікати панелі управління у Secret kubeadm-certs.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>[ЕКСПЕРИМЕНТАЛЬНО] Шлях до 'реальної' кореневої файлової системи хоста.</p></td>
        </tr>
    </tbody>
</table>
