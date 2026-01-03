Запустіть цю команду на будь-якому компʼютері, який ви хочете приєднати до існуючого кластера

### Опис {#synopsis}

Під час приєднання до ініціалізованого кластера за допомогою kubeadm, необхідно встановити двосторонню довіру. Цей процес розділяється на два етапи: виявлення (щоб Node довіряв Панелі Управління Kubernetes) та TLS завантаження (щоб Панель управління Kubernetes довіряла Node).

Існує дві основні схеми для виявлення. Перша — використовувати спільний токен разом з IP-адресою сервера API. Друга — надати файл, який є підмножиною стандартного файлу kubeconfig. Файл discovery/kubeconfig підтримує токен, втулки автентифікації client-go ("exec"), "tokenFile" та "authProvider". Цей файл може бути локальним або завантаженим через URL HTTPS. Форми приєднання є:

```shell
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443
kubeadm join --discovery-file path/to/file.conf
kubeadm join --discovery-file https://url/file.conf
```

Можна використовувати лише одну форму. Якщо інформація для виявлення завантажується з URL, обовʼязково використовувати HTTPS. У цьому випадку для перевірки зʼєднання використовується встановлений на хості набір сертифікатів CA.

Якщо ви використовуєте спільний токен для виявлення, слід також передати прапорець --discovery-token-ca-cert-hash для перевірки публічного ключа кореневого центру сертифікації (CA), який представлений Панеллю Управління Kubernetes. Значення цього прапорця визначається як "<тип-хешу>:<шестнадцяткове-кодоване-значення>", де підтримуваний тип хешу — "sha256". Хеш обчислюється по байтах обʼєкта Subject Public Key Info (SPKI) (як в RFC7469). Це значення доступне у вихідних даних "kubeadm init" або може бути обчислене за допомогою стандартних інструментів. Прапорець --discovery-token-ca-cert-hash може бути повторений кілька разів, щоб дозволити використання більше одного публічного ключа.

Якщо ви не можете знати хеш публічного ключа CA заздалегідь, ви можете передати прапорець --discovery-token-unsafe-skip-ca-verification для вимкнення цієї перевірки. Це послаблює модель безпеки kubeadm, оскільки інші вузли можуть потенційно видавати себе за Панель Управління Kubernetes.

Механізм TLS завантаження також керується через спільний токен. Це використовується для тимчасової автентифікації в Панелі Управління Kubernetes для подання запиту на підписання сертифіката (CSR) для локально створеної пари ключів. Типово, kubeadm налаштує Панель Управління Kubernetes автоматично схвалювати ці запити на підписання. Цей токен передається за допомогою прапорця --tls-bootstrap-token abcdef.1234567890abcdef.

Часто той самий токен використовується для обох частин. У цьому випадку прапорець --token можна використовувати замість окремого зазначення кожного токена.

Команда "join [api-server-endpoint]" виконує наступні фази:

```none
preflight               Виконати передстартові перевірки для приєднання
control-plane-prepare   Підготувати машину для обслуговування панелі управління
  /download-certs         Завантажити сертифікати, спільні для вузлів панелі управління, з Secret kubeadm-certs
  /certs                  Створити сертифікати для нових компонентів панелі управління
  /kubeconfig             Створити kubeconfig для нових компонентів панелі управління
  /control-plane          Створити маніфести для нових компонентів панелі управління
kubelet-start           Записати налаштування kubelet, сертифікати та (перезавантажити) kubelet
etcd-join               Приєднання etcd до вузлів панелі управління
kubelet-wait-bootstrap  Чекати, поки kubelet завантажиться
control-plane-join      Приєднати машину як екземпляр панелі управління
  /mark-control-plane     Позначити вузол як панель управління
wait-control-plane     Чекати запуску панелі управління
```

```shell
kubeadm join [api-server-endpoint] [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вузол має хостити новий екземпляр панелі управління, IP-адреса, яку сервер API буде оголошувати як ту, на якій він слухає. Якщо не встановлено, буде використовуватися стандартний інтерфейс.</p></td>
        </tr>
        <tr>
            <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Стандартно: 6443</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вузол має хостити новий екземпляр панелі управління, порт, до якого буде привʼязаний сервер API.</p></td>
        </tr>
        <tr>
            <td colspan="2">--certificate-key string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте цей ключ для розшифрування секретів сертифікатів, завантажених за допомогою init. Ключ сертифіката — це шестнадцятковий закодований рядок, який є AES ключем розміром 32 байти.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--control-plane</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Створити новий екземпляр панелі управління на цьому вузлі</p></td>
        </tr>
        <tr>
            <td colspan="2">--cri-socket string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до CRI сокета для підключення. Якщо не встановлено, kubeadm спробує автоматично визначити це значення; використовуйте цей параметр, лише якщо у вас встановлено більше одного CRI або якщо у вас нестандартний CRI сокет.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка join</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-preflight-errors strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки від усіх перевірок.</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вказати імʼя вузла.</p></td>
        </tr>
        <tr>
            <td colspan="2">--patches string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з назвами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot; і відповідають форматам патчів, підтримуваних kubectl. Типовий &quot;patchtype&quot; — &quot;strategic&quot;. &quot;extension&quot; має бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; — це необовʼязковий рядок, який можна використовувати для визначення, які патчі застосовуються першими в алфавітно-числовому порядку.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-phases strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список фаз, які потрібно пропустити</p></td>
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
