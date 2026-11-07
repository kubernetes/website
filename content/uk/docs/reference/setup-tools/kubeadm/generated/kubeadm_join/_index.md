<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


Запустіть цю команду на будь-якому компʼютері, який ви хочете приєднати до існуючого кластера

### Опис {#synopsis}



Під час приєднання до кластера, ініціалізованого kubeadm, необхідно встановити двосторонню довіру. Цей процес розділяється на виявлення (щоб Node довіряв панелі управління Kubernetes) та TLS bootstrap (щоб панель управління Kubernetes довіряла Node).

Існує 2 основні схеми виявлення. Перша — використовувати спільний токен разом з IP-адресою API-сервера. Друга — надати файл, який є підмножиною стандартного файлу kubeconfig. Файл discovery/kubeconfig підтримує токен, втулки автентифікації client-go ("exec"), "tokenFile" та "authProvider". Цей файл може бути локальним або завантаженим через HTTPS URL. Можливі форми: kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443, kubeadm join --discovery-file path/to/file.conf або kubeadm join --discovery-file https://url/file.conf. Можна використовувати лише одну форму. Якщо інформація для виявлення завантажується з URL, обовʼязково використовувати HTTPS. Також у цьому випадку для перевірки зʼєднання використовується встановлений на хості набір сертифікатів CA.

Якщо ви використовуєте спільний токен для виявлення, слід також передати прапорець --discovery-token-ca-cert-hash для перевірки публічного ключа кореневого центру сертифікації (CA), наданого панеллю управління Kubernetes. Значення цього прапорця задається як "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;", де підтримуваний тип хешу — "sha256". Хеш обчислюється по байтах обʼєкта Subject Public Key Info (SPKI) (як в RFC7469). Це значення доступне у виводі "kubeadm init" або може бути обчислене за допомогою стандартних інструментів. Прапорець --discovery-token-ca-cert-hash можна вказувати кілька разів, щоб дозволити більше одного публічного ключа.

Якщо ви не можете знати хеш публічного ключа CA заздалегідь, ви можете передати прапорець --discovery-token-unsafe-skip-ca-verification, щоб вимкнути цю перевірку. Це послаблює модель безпеки kubeadm, оскільки інші вузли потенційно можуть видавати себе за панель управління Kubernetes.

Механізм TLS bootstrap також працює через спільний токен. Він використовується для тимчасової автентифікації в панелі управління Kubernetes, щоб подати запит на підписання сертифіката (CSR) для локально створеної пари ключів. Типово kubeadm налаштовує панель управління Kubernetes на автоматичне схвалення цих запитів на підписання. Цей токен передається за допомогою прапорця --tls-bootstrap-token abcdef.1234567890abcdef.

Часто той самий токен використовується для обох частин. У цьому випадку замість окремого зазначення кожного токена можна використовувати прапорець --token.


Команда "join [api-server-endpoint]" виконує такі фази:
```
preflight               Run join pre-flight checks
control-plane-prepare   Prepare the machine for serving a control plane
  /download-certs         Download certificates shared among control-plane nodes from the kubeadm-certs Secret
  /certs                  Generate the certificates for the new control plane components
  /kubeconfig             Generate the kubeconfig for the new control plane components
  /control-plane          Generate the manifests for the new control plane components
kubelet-start           Write kubelet settings, certificates and (re)start the kubelet
etcd-join               Join etcd for control plane nodes
kubelet-wait-bootstrap  Wait for the kubelet to bootstrap itself
control-plane-join      Join a machine as a control plane instance
  /mark-control-plane     Mark a node as a control-plane
wait-control-plane      Wait for the control plane to start
```


```
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вузол має розміщувати новий екземпляр панелі управління, IP-адреса, яку API-сервер оголошуватиме як адресу, на якій він слухає. Якщо не вказано, буде використано типовий мережевий інтерфейс.</p></td>
</tr>

<tr>
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вузол має розміщувати новий екземпляр панелі управління, порт, до якого привʼязуватиметься API-сервер.</p></td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте цей ключ для розшифрування секретів сертифікатів, завантажених init. Ключ сертифіката — це рядок у шістнадцятковому кодуванні, який є ключем AES розміром 32 байти.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Створити новий екземпляр панелі управління на цьому вузлі</p></td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до сокета CRI для підключення. Якщо порожньо, kubeadm спробує автоматично визначити це значення; використовуйте цей параметр лише якщо у вас встановлено більше одного CRI або якщо у вас нестандартний сокет CRI.</p></td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі файлу, файл або URL, з якого буде завантажена інформація про кластер.</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, токен, який використовується для перевірки інформації про кластер, отриманої з API-сервера.</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, перевірити, що публічний ключ кореневого центру сертифікації відповідає цьому хешу (формат: &quot;&lt;type&gt;:&lt;value&gt;&quot;).</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Для виявлення на основі токена, дозволити приєднання без закріплення --discovery-token-ca-cert-hash.</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Не застосовувати жодних змін; лише вивести, що було б зроблено.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка для join</p></td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки всіх перевірок.</p></td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть імʼя вузла.</p></td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з іменами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;, &quot;kubeproxydaemonset&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot;, і вони відповідають форматам патчів, що підтримуються kubectl. Типовим &quot;patchtype&quot; є &quot;strategic&quot;. &quot;extension&quot; повинен бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; є необовʼязковим рядком, який можна використовувати для визначення, які патчі застосовуються першими за алфавітно-цифровим порядком.</p></td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Список фаз, які потрібно пропустити</p></td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть токен, який використовується для тимчасової автентифікації в панелі управління Kubernetes під час приєднання вузла.</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте цей токен для discovery-token та tls-bootstrap-token, коли ці значення не вказані.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до 'справжньої' кореневої файлової системи хоста. Це змусить kubeadm виконати chroot у вказаний шлях.</p></td>
</tr>

</tbody>
</table>



