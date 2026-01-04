---
title: kube-controller-manager
content_type: tool-reference
weight: 30
auto_generated: true
---

## {{% heading "synopsis" %}}

Менеджер контролерів Kubernetes — це демон, який вбудовує основні цикли керування, що постачаються з Kubernetes. У робототехніці та автоматизації автоматизації, цикл керування — це нескінченний цикл, який регулює стан системи. У Kubernetes контролер — це цикл керування, який відстежує спільний стан кластера через apiserver і вносить зміни, намагаючись перевести поточний стан у бажаний. Приклади контролерів, які постачаються з Kubernetes сьогодні це контролер реплікації, контролер точок доступу, контролер просторів імен та контролер службових облікових записів.

```shell
kube-controller-manager [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
   <colgroup>
      <col span="1" style="width: 10px;" />
      <col span="1" />
   </colgroup>
   <tbody>
      <tr>
         <td colspan="2">--allocate-node-cidrs</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи повинні CIDR для Podʼів бути виділені та налаштовані хмарним провайдером. Вимагає --cluster-cidr.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: []</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Зіставляє metric-label зі списком дозволених значень цієї мітки. Формат ключа — &lt;MetricName&gt;,&lt;LabelName&gt;. Формат значення — &lt;дозволене_значення&gt;,&lt;дозволене_значення&gt;...наприклад, metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-metric-labels-manifest string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу маніфесту, який містить зіставлення allow-list. Формат файлу такий самий, як і у прапорця --allow-metric-labels. Зауважте, що прапорець --allow-metric-labels замінить файл маніфесту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--attach-detach-reconcile-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування синхронізації узгоджувача між приєднанням та відʼєднанням томів. Ця тривалість має бути більшою за одну секунду, і збільшення цього значення порівняно зі стандартним може призвести до того, що томи не будуть збігатися з Podʼами.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>файл kubeconfig, що вказує на 'core' сервер kubernetes з достатніми правами для створення tokenreviews.authentication.k8s.io. Цей параметр не є обовʼязковим. Якщо він порожній, всі запити токенів вважаються анонімними, і жоден клієнтський центр сертифікації не шукається в кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-skip-lookup</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення false, authentication-kubeconfig буде використано для пошуку відсутньої конфігурації автентифікації в кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей від автентифікатора токенів webhook.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-tolerate-lookup-failure</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення встановлено, невдачі у пошуку відсутньої конфігурації автентифікації в кластері не вважатимуться фатальними. Зауважте, що це може призвести до автентифікації, яка розглядає всі запити як анонімні.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/healthz,/readyz,/livez"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список HTTP-шляхів, які пропускаються під час авторизації, тобто авторизуються без звʼязку з 'core' сервером kubernetes.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>файл kubeconfig, що вказує на 'core' сервер kubernetes з достатніми правами для створення subjectaccessreviews.authorization.k8s.io. Цей параметр не є обовʼязковим. Якщо він порожній, всі запити, не пропущені авторизацією, будуть заборонені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'authorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'unauthorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде прослуховуватися порт --secure-port. Відповідний інтерфейс(и) має бути доступним для решти кластера, а також для CLI/веб-клієнтів. Якщо цей параметр не вказано або вказано невизначену адресу (0.0.0.0 або ::), будуть використані всі інтерфейси та сімейства IP-адрес.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cert-dir string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тека, в якій знаходяться TLS-сертифікати. Якщо вказано --tls-cert-file та --tls-private-key-file, цей прапорець буде проігноровано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "RangeAllocator"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип розподілювача CIDR для використання</p></td>
      </tr>
      <tr>
         <td colspan="2">--client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, будь-який запит, що надає клієнтський сертифікат, підписаний одним із центрів сертифікації у клієнтському файлі, буде автентифіковано за допомогою ідентифікатора, що відповідає загальному імені клієнтського сертифіката.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cloud-config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації хмарного провайдера. Порожній рядок, якщо файл конфігурації відсутній.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cloud-provider string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Провайдер хмарних сервісів. Порожній рядок для відсутності провайдера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-cidr string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Діапазон CIDR для вузлів у кластері. Використовується лише коли --allocate-node-cidrs=true; якщо false, цей параметр буде проігноровано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kubernetes"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Префікс екземпляру для кластера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований сертифікат X509 CA, який використовується для випуску кластерних сертифікатів.  Якщо вказано, можна не вказувати більш специфічний прапорець --cluster-signing-*.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 8760h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Буде вказано максимальний термін дії підписаних сертифікатів.  Окремі CSR можуть запитувати коротші сертифікати, встановивши spec.expirationSeconds.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, що містить PEM-кодований закритий ключ RSA або ECDSA, який використовується для підпису кластерних сертифікатів.  Якщо вказано, не можна вказувати більш специфічний прапорець --cluster-signing-*.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kube-apiserver-client-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований сертифікат X509 CA, який використовується для випуску сертифікатів для підписувача kubernetes.io/kube-apiserver-client.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kube-apiserver-client-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований приватний ключ RSA або ECDSA, який використовується для підпису сертифікатів для підписувача kubernetes.io/kube-apiserver-client.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kubelet-client-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований сертифікат X509 CA, який використовується для випуску сертифікатів для підписувача kubernetes.io/kube-apiserver-client-kubelet.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kubelet-client-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований приватний ключ RSA або ECDSA, який використовується для підпису сертифікатів для підписувача kubernetes.io/kube-apiserver-client-kubelet.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kubelet-serving-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований сертифікат X509 CA, який використовується для випуску сертифікатів для підписувача kubernetes.io/kubelet-serving.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-kubelet-serving-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований приватний ключ RSA або ECDSA, який використовується для підпису сертифікатів для підписувача kubernetes.io/kubelet-serving.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-legacy-unknown-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований сертифікат X509 CA, який використовується для видачі сертифікатів для підписувача kubernetes.io/legacy-unknown.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-signing-legacy-unknown-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить PEM-кодований приватний ключ RSA або ECDSA, який використовується для підпису сертифікатів для kubernetes.io/legacy-unknown signer.  Якщо вказано, --cluster-signing-{cert,key}-file не має бути задано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-cron-job-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів завдання cron, яким дозволено синхронізуватися одночасно. Більша кількість = швидше реагують завдання, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-daemonset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів daemonset, яким дозволено синхронізуватися одночасно. Більша кількість = більш чутливі daemonset, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-deployment-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів deployment, яким дозволено синхронізуватися одночасно. Більша кількість = швидше розгортання, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-device-taint-eviction-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 8</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість операцій (видалення подів, оновлення статусу DeviceTaintRule), які можна виконувати одночасно. Більше число = краща реакція, але більше навантаження на CPU (і мережу).</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість операцій синхронізації точок доступу, які будуть виконуватися одночасно. Більша кількість = швидше оновлення точок доступу, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-ephemeralvolume-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість операцій синхронізації ефемерних томів, які будуть виконуватися одночасно. Більша кількість = швидше оновлення ефемерних томів, але більше навантаження на процесор (і мережу)</p></td>
      </tr         <td colspan="2"><a href="/uk/docs/concepts/cluster-administration/node-shutdown/#storage-force-detach-on-timeout">https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/#storage-force-detach-on-timeout</a></td>
      </tr>32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів Job, яким дозволено синхронізуватися одночасно. Більша кількість = швидше реагують завдання, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-namespace-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів namespace, яким дозволено синхронізуватися одночасно. Більша кількість = більш оперативне завершення роботи простору імен, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-rc-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість контролерів реплікації, яким дозволено синхронізуватися одночасно. Більша кількість = більш оперативне керування реплікацією, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-replicaset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість replica set, які дозволено синхронізувати одночасно. Більша кількість = більш оперативне керування реплікацією, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-resource-quota-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість квот ресурсів, які дозволено синхронізувати одночасно. Більша кількість = більш оперативне керування квотами, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість операцій синхронізації точок доступу сервісів, які будуть виконуватися одночасно. Чим більше число, тим швидше оновлюватиметься зріз кінцевих точок, але більше завантажуватиметься процесор (і мережа). Стандартно дорівнює 5.</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість сервісів, яким дозволено синхронізуватися одночасно. Більша кількість = більш оперативне управління послугами, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-serviceaccount-token-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів токенів службових облікових записів, яким дозволено синхронізуватися одночасно. Більша кількість = швидша генерація токенів, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-statefulset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обʼєктів statefulset, яким дозволено синхронізуватися одночасно. Більша кількість = більш швидкодіючі statefulsets, але більше навантаження на процесор (і мережу)</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-ttl-after-finished-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обробників ttl-after-finished-controller, яким дозволено синхронізуватися одночасно.</p></td>
      </tr>
      <tr>
         <td colspan="2">--concurrent-validating-admission-policy-status-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обробників ValidatingAdmissionPolicyStatusController, яким дозволено синхронізуватися одночасно.</p></td>
      </tr>
      <tr>
         <td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи повинні CIDR, виділені за допомогою allocate-node-cidrs, бути налаштовані на хмарному провайдері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--contention-profiling</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Активувати профілювання блоків, якщо профілювання увімкнено</p></td>
      </tr>
      <tr>
         <td colspan="2">--controller-shutdown-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування вимкнення контролерів перед завершенням роботи виконуваного файлу</p></td>
      </tr>
      <tr>
         <td colspan="2">--controller-start-interval duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал між запуском менеджерів контролерів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--controllers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "*"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Перелік контролерів для ввімкнення. '*' вмикає всі типово визначені контролери, 'foo' вмикає контролер з назвою 'foo', '-foo' вимикає контролер з назвою 'foo'.<br/>Всі контролери: bootstrap-signer-controller, certificatesigningrequest-approving-controller, certificatesigningrequest-cleaner-controller, certificatesigningrequest-signing-controller, cloud-node-lifecycle-controller, clusterrole-aggregation-controller, cronjob-controller, daemonset-controller, deployment-controller, device-taint-eviction-controller, disruption-controller, endpoints-controller, endpointslice-controller, endpointslice-mirroring-controller, ephemeral-volume-controller, garbage-collector-controller, horizontal-pod-autoscaler-controller, job-controller, kube-apiserver-serving-clustertrustbundle-publisher-controller, legacy-serviceaccount-token-cleaner-controller, namespace-controller, node-ipam-controller, node-lifecycle-controller, node-route-controller, persistentvolume-attach-detach-controller, persistentvolume-binder-controller, persistentvolume-expander-controller, persistentvolume-protection-controller, persistentvolumeclaim-protection-controller, pod-garbage-collector-controller, podcertificaterequest-cleaner-controller, replicaset-controller, replicationcontroller-controller, resourceclaim-controller, resourcequota-controller, root-ca-certificate-publisher-controller, selinux-warning-controller, service-cidr-controller, service-lb-controller, serviceaccount-controller, serviceaccount-token-controller, statefulset-controller, storage-version-migrator-controller, storageversion-garbage-collector-controller, taint-eviction-controller, token-cleaner-controller, ttl-after-finished-controller, ttl-controller, validatingadmissionpolicy-status-controller, volumeattributesclass-protection-controller<br/>Стандартно вимкнені контролери: bootstrap-signer-controller, token-cleaner-controller</p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-attach-detach-reconcile-sync</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вимкнути синхронізацію узгоджувача приєднання томів. Вимкнення цієї опції може призвести до невідповідності томів і Podʼів. Використовуйте з обережністю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-force-detach-on-timeout</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Заборонити примусове відʼєднання томів на основі максимального часу відʼєднання та стану вузла. Якщо цей прапорець встановлено у true, необхідно використовувати функцію примусового вимкнення вузла для відновлення після збою вузла. Докладні відомості див. на сторінці <a href="/uk/docs/concepts/cluster-administration/node-shutdown/#storage-force-detach-on-timeout">https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/#storage-force-detach-on-timeout</a></p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-http2-serving</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, HTTP2-сервіс буде вимкнено [default=false].</p></td>
      </tr>
      <tr>
         <td colspan="2">--disabled-metrics strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей прапорець забезпечує аварійний вихід для метрик, що поводяться не належним чином. Щоб вимкнути метрику, ви маєте вказати її повну назву. Застереження: вимкнення метрик має вищий пріоритет, ніж показ прихованих метрик.</p></td>
      </tr>
      <tr>
         <td colspan="2">--emulated-version strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>У версіях різні компоненти емулюють свої можливості (API, функції, ...) інших компонентів.<br/>
         Якщо встановлено, компонент буде емулювати поведінку цієї версії замість базової двійкової версії.<br/>
         Формат версії може бути лише major.minor, наприклад: '--emulated-version=wardle=1.2,kube=1.31'.<br/>
         Можливі варіанти:<br/>
         kube=1.32..1.35 (default=1.35) Якщо компонент не вказано, стандартно використовується &quot;kube&quot;</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-dynamic-provisioning&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть динамічне створення ресурсів для середовищ, які його підтримують.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає загальний збирач сміття. ПОВИНЕН бути синхронізований з відповідним прапорцем kube-apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-hostpath-provisioner</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає забезпечення HostPath PV під час роботи без хмарного провайдера. Це дозволяє тестувати та розробляти функції резервування.  HostPath provisioning не підтримується жодним чином, не працюватиме в багатовузловому кластері і не повинен використовуватися ні для чого іншого, окрім тестування або розробки.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-leader-migration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи вмикати міграцію лідера контролера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--endpoint-updates-batch-period duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість періоду пакетного оновлення точок доступу. Обробка змін у пакунках буде затримана на цей час, щоб обʼєднати їх з потенційними майбутніми оновленнями і зменшити загальну кількість оновлень точок доступу. Більша кількість = більша затримка програмування точок доступу, але менша кількість згенерованих ревізій точок доступу</p></td>
      </tr>
      <tr>
         <td colspan="2">--endpointslice-updates-batch-period duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість періоду пакетного оновлення зрізу точок доступу. Обробка змін у пакунках буде затримана на цей час, щоб обʼєднати їх з потенційними майбутніми оновленнями і зменшити загальну кількість оновлень точок доступу. Більша кількість = більша затримка програмування точок доступу, але менша кількість згенерованих ревізій точок доступу</p></td>
      </tr>
      <tr>
         <td colspan="2">--external-cloud-volume-plugin string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Втулок для використання, коли хмарний провайдер встановлений як зовнішній. Може бути порожнім, слід встановлювати лише тоді, коли хмарний провайдер є зовнішнім. Наразі використовується для дозволу роботи node-ipam-controller, persistentvolume-binder-controller, persistentvolume-expander-controller та attach-detach-controller у вбудованих хмарних провайдерів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список пар component:key=value, які описують функціональні можливості для альфа/експериментальних можливостей різних компонентів.<br/>
         Якщо компонент не вказано, стандартно використовується &quot;kube&quot;. Цей прапорець можна викликати багаторазово. Наприклад: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'. Можливі варіанти:<br/>
         kube:APIResponseCompression=true|false (BETA - default=true)<br/>
         kube:APIServerIdentity=true|false (BETA - default=true)<br/>
         kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
         kube:AllAlpha=true|false (ALPHA - default=false)<br/>
         kube:AllBeta=true|false (BETA - default=false)<br/>
         kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
         kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
         kube:AuthorizePodWebsocketUpgradeCreatePermission=true|false (BETA - default=true)<br/>
         kube:CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
         kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
         kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
         kube:CRDObservedGenerationTracking=true|false (BETA - default=false)<br/>
         kube:CSIServiceAccountTokenSecrets=true|false (BETA - default=true)<br/>
         kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
         kube:ClearingNominatedNodeNameAfterBinding=true|false (BETA - default=true)<br/>
         kube:ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
         kube:ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
         kube:CloudControllerManagerWatchBasedRoutesReconciliation=true|false (ALPHA - default=false)<br/>
         kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
         kube:ClusterTrustBundle=true|false (BETA - default=false)<br/>
         kube:ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
         kube:ComponentFlagz=true|false (ALPHA - default=false)<br/>
         kube:ComponentStatusz=true|false (ALPHA - default=false)<br/>
         kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
         kube:ConstrainedImpersonation=true|false (ALPHA - default=false)<br/>
         kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
         kube:ContainerRestartRules=true|false (BETA - default=true)<br/>
         kube:ContainerStopSignals=true|false (ALPHA - default=false)<br/>
         kube:ContextualLogging=true|false (BETA - default=true)<br/>
         kube:CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
         kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
         kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
         kube:DRAAdminAccess=true|false (BETA - default=true)<br/>
         kube:DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
         kube:DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
         kube:DRADeviceTaintRules=true|false (ALPHA - default=false)<br/>
         kube:DRADeviceTaints=true|false (ALPHA - default=false)<br/>
         kube:DRAExtendedResource=true|false (ALPHA - default=false)<br/>
         kube:DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
         kube:DRAPrioritizedList=true|false (BETA - default=true)<br/>
         kube:DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
         kube:DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
         kube:DeclarativeValidation=true|false (BETA - default=true)<br/>
         kube:DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
         kube:DeploymentReplicaSetTerminatingReplicas=true|false (BETA - default=true)<br/>
         kube:DetectCacheInconsistency=true|false (BETA - default=true)<br/>
         kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
         kube:EnvFiles=true|false (BETA - default=true)<br/>
         kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
         kube:ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
         kube:GangScheduling=true|false (ALPHA - default=false)<br/>
         kube:GenericWorkload=true|false (ALPHA - default=false)<br/>
         kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
         kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
         kube:HPAConfigurableTolerance=true|false (BETA - default=true)<br/>
         kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
         kube:HostnameOverride=true|false (BETA - default=true)<br/>
         kube:ImageVolume=true|false (BETA - default=true)<br/>
         kube:InOrderInformers=true|false (BETA - default=true)<br/>
         kube:InOrderInformersBatchProcess=true|false (BETA - default=true)<br/>
         kube:InPlacePodLevelResourcesVerticalScaling=true|false (ALPHA - default=false)<br/>
         kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
         kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
         kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
         kube:KubeletCrashLoopBackOffMax=true|false (BETA - default=true)<br/>
         kube:KubeletEnsureSecretPulledImages=true|false (BETA - default=true)<br/>
         kube:KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
         kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
         kube:KubeletPSI=true|false (BETA - default=true)<br/>
         kube:KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
         kube:KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
         kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
         kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
         kube:ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
         kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
         kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
         kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
         kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
         kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
         kube:MaxUnavailableStatefulSet=true|false (BETA - default=true)<br/>
         kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
         kube:MutableCSINodeAllocatableCount=true|false (BETA - default=true)<br/>
         kube:MutablePVNodeAffinity=true|false (ALPHA - default=false)<br/>
         kube:MutablePodResourcesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
         kube:MutableSchedulingDirectivesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
         kube:MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
         kube:NodeDeclaredFeatures=true|false (ALPHA - default=false)<br/>
         kube:NodeLogQuery=true|false (BETA - default=false)<br/>
         kube:NominatedNodeNameForExpectation=true|false (BETA - default=true)<br/>
         kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
         kube:OpportunisticBatching=true|false (BETA - default=true)<br/>
         kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
         kube:PodCertificateRequest=true|false (BETA - default=false)<br/>
         kube:PodDeletionCost=true|false (BETA - default=true)<br/>
         kube:PodLevelResources=true|false (BETA - default=true)<br/>
         kube:PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
         kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
         kube:PodTopologyLabelsAdmission=true|false (BETA - default=true)<br/>
         kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
         kube:PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
         kube:ProcMountType=true|false (BETA - default=true)<br/>
         kube:QOSReserved=true|false (ALPHA - default=false)<br/>
         kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
         kube:RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
         kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
         kube:RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
         kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
         kube:RestartAllContainersOnContainerExits=true|false (ALPHA - default=false)<br/>
         kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
         kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
         kube:SELinuxChangePolicy=true|false (BETA - default=true)<br/>
         kube:SELinuxMount=true|false (BETA - default=false)<br/>
         kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
         kube:SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
         kube:SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
         kube:SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
         kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
         kube:SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
         kube:StatefulSetSemanticRevisionComparison=true|false (BETA - default=true)<br/>
         kube:StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
         kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
         kube:StorageVersionHash=true|false (BETA - default=true)<br/>
         kube:StorageVersionMigrator=true|false (BETA - default=false)<br/>
         kube:StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
         kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
         kube:StructuredAuthenticationConfigurationJWKSMetrics=true|false (BETA - default=true)<br/>
         kube:TaintTolerationComparisonOperators=true|false (ALPHA - default=false)<br/>
         kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
         kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
         kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
         kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
         kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
         kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
         kube:UserNamespacesHostNetworkSupport=true|false (ALPHA - default=false)<br/>
         kube:UserNamespacesSupport=true|false (BETA - default=true)<br/>
         kube:VolumeLimitScaling=true|false (ALPHA - default=false)<br/>
         kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
         kube:WatchList=true|false (BETA - default=true)<br/>
         kube:WatchListClient=true|false (BETA - default=true)<br/>
         kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
         kube:WindowsGracefulNodeShutdown=true|false (BETA - default=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">--flex-volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Повний шлях до теки, у якій втулок flex volume має шукати додаткові втулки сторонніх розробників.</p></td>
      </tr>
      <tr>
         <td colspan="2">-h, --help</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kube-controller-manager</p></td>
      </tr>
      <tr>
         <td colspan="2">--horizontal-pod-autoscaler-cpu-initialization-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період після запуску Зod, коли проби CPU можуть бути пропущені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--horizontal-pod-autoscaler-downscale-stabilization duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період, за який автомасштабування буде дивитися в минуле і не зменшуватиме масштаб нижче будь-якої рекомендації, наданої ним протягом цього періоду.</p></td>
      </tr>
      <tr>
         <td colspan="2">--horizontal-pod-autoscaler-initial-readiness-delay duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період після запуску Pod, протягом якого готовність змінюється, буде вважатися початковою готовністю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--horizontal-pod-autoscaler-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період для синхронізації кількості Podʼів у horizontal pod autoscaler.</p></td>
      </tr>
      <tr>
         <td colspan="2">--horizontal-pod-autoscaler-tolerance float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.1</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна зміна (від 1.0) у співвідношенні бажаної та фактичної метрики для того, щоб  horizontal pod autoscaler розглянув можливість масштабування.</p></td>
      </tr>
      <tr>
         <td colspan="2">--http2-max-streams-per-connection int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Обмеження, яке сервер надає клієнтам на максимальну кількість потоків у зʼєднанні HTTP/2. Нуль означає використання стандартних значень golang.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Сплеск для використання під час спілкування з apiserver на kubernetes.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "application/vnd.kubernetes.protobuf"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип вмісту запитів, що надсилаються до apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 20</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>QPS для використання під час спілкування з kubernetes apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig з інформацією про авторизацію та розташування майстра (розташування майстра може бути перевизначено прапорцем master).</p></td>
      </tr>
      <tr>
         <td colspan="2">--large-cluster-size-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість вузлів, з яких node-lifecycle-controller вважає кластер великим для цілей логіки виселення. --secondary-node-eviction-rate неявно перевизначено у 0 для кластерів такого розміру або менших. Зауваження: Якщо вузли знаходяться у декількох зонах, цей поріг буде розглядатися як поріг розміру вузла зони для кожної зони, щоб визначити швидкість виселення вузла незалежно.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Запускає клієнта виборів лідера і отримує лідерство перед виконанням основного циклу. Увімкніть цю опцію під час запуску реплікованих компонентів для забезпечення високої доступності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість, протягом якої кандидати, що не є лідерами, чекатимуть після поновлення лідерства, перш ніж спробувати зайняти лідерство в лідируючому, але не поновленому лідерському слоті. Це фактично максимальний час, протягом якого лідер може бути зупинений, перш ніж його замінить інший кандидат. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал між спробами виконуючого обовʼязки майстра поновити слот лідера до того, як він перестане бути лідером. Він має бути меншим за тривалість оренди. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "leases"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип обʼєкта ресурсу, який використовується для блокування під час виборів лідера. Підтримуються такі варіанти 'leases'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kube-controller-manager"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя обʼєкта ресурсу, який використовується для блокування під час виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kube-system"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Простір імен обʼєкта ресурсу, який використовується для блокування під час виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час, протягом якого клієнти повинні чекати між спробою отримання та поновленням лідерства. Це стосується лише тих випадків, коли увімкнено обрання лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-migration-config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу для міграції лідера контролерів або порожній, щоб використовувати значення, яке є стандартною конфігурацією диспетчера контролерів. Конфігураційний файл має бути типу LeaderMigrationConfiguration, група controllermanager.config.k8s.io, версія v1alpha1.</p></td>
      </tr>
      <tr>
         <td colspan="2">--legacy-service-account-token-clean-up-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 8760h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період часу з моменту останнього використання токену застарілого облікового запису до його видалення.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість секунд між очищеннями логів</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-info-buffer-size quantity</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі з розділеними потоками виводу інформаційні повідомлення можуть буферизуватися на деякий час для підвищення продуктивності. Стандартне значення, рівне нулю байт, вимикає буферизацію. Розмір можна вказати як кількість байт (512), кратну 1000 (1K), кратну 1024 (2Ki) або степінь (3M, 4G, 5Mi, 6Gi). Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-split-stream</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі записувати повідомлення про помилки до stderr та інформаційні повідомлення до stdout. Стандартно до stdout записується один потік. Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Задає формат логу. Дозволені формати: &quot;text&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--master string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Адреса сервера API Kubernetes (перевизначає будь-яке значення в kubeconfig).</p></td>
      </tr>
      <tr>
         <td colspan="2">--max-endpoints-per-slice int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість точок доступу, яку буде додано до зрізу EndpointSlice. Чим більше точок на зріз, тим менше зрізів точок, але більші ресурси. Стандартне значення — 100.</p></td>
      </tr>
      <tr>
         <td colspan="2">--min-compatibility-version strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна версія компонентів панелі управління, з якою повинен бути сумісний сервер. <br/>Повинна бути меншою або дорівнювати емульованій версії. Формат версії може бути тільки major.minor, наприклад: '--min-compatibility-version=wardle=1.2,kube=1.31'.<br/>Варіанти: kube=1.32..1.35 (default: 1.34)<br/>Якщо компонент не вказано, стандартно використовується &quot;kube&quot;</p></td>
      </tr>
      <tr>
         <td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 12h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період ресинхронізації у рефлекторах буде випадковим між MinResyncPeriod та 2*MinResyncPeriod.</p></td>
      </tr>
      <tr>
         <td colspan="2">--mirroring-concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість операцій синхронізації точок доступу сервісів, які будуть виконуватися одночасно контролером endpointslice-mirroring-controller. Більша кількість = швидше оновлення зрізу точок доступу, але більше навантаження на процесор (і мережу). Стандартне значення — 5.</p></td>
      </tr>
      <tr>
         <td colspan="2">--mirroring-endpointslice-updates-batch-period duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість періоду пакетного оновлення EndpointSlice для контролера endpointslice-mirroring-controller. Обробка змін EndpointSlice буде затримана на цей період, щоб обʼєднати їх з потенційними майбутніми оновленнями і зменшити загальну кількість оновлень EndpointSlice. Більша кількість = більша затримка програмування точок доступу, але менша кількість згенерованих ревізій точок доступу</p></td>
      </tr>
      <tr>
         <td colspan="2">--mirroring-max-endpoints-per-subset int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1000</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість точок доступу, яку буде додано до зрізу EndpointSlice контролером endpointslice-mirroring-controller. Чим більше точок на зріз, тим менше зрізів точок, але більші ресурси. Стандартно дорівнює 100.</p></td>
      </tr>
      <tr>
         <td colspan="2">--namespace-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період синхронізації оновлень життєвого циклу простору імен</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-cidr-mask-size int32</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розмір маски для вузла cidr у кластері. Стандартне значення 24 для IPv4 та 64 для IPv6.</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-cidr-mask-size-ipv4 int32</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розмір маски для IPv4 вузла cidr у двостековому кластері. Стандартне значення — 24.</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-cidr-mask-size-ipv6 int32</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розмір маски для IPv6 вузла cidr у двостековому кластері. Стандартне значення — 64.</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-eviction-rate float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.1</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість вузлів на секунду, на яких видаляються підтипи у випадку відмови вузла, коли зона є справною (див. --unhealthy-zone-threshold для визначення справності/несправності зони). Під зоною мається на увазі весь кластер у небагатозонних кластерах.</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-monitor-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість часу, протягом якого ми дозволяємо вузлу не відповідати на запити, перш ніж позначити його як несправний. Має бути у N разів більшою за nodeStatusUpdateFrequency kubelet, де N означає кількість спроб, дозволених kubelet для публікації статусу вузла. Це значення також має бути більшим за суму HTTP2_PING_TIMEOUT_SECONDS і HTTP2_READ_IDLE_TIMEOUT_SECONDS</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період синхронізації NodeStatus у контролері cloud-node-lifecycle-controller.</p></td>
      </tr>
      <tr>
         <td colspan="2">--node-startup-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час, протягом якого ми дозволяємо стартовому вузлу не відповідати, перш ніж позначити його як несправний.</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-address-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення дорівнює true, SO_REUSEADDR буде використано при привʼязці порту. Це дозволяє паралельно привʼязуватись до підстановочних IP-адрес, таких як 0.0.0.0, і до конкретних IP-адрес, а також дозволяє уникнути очікування ядром звільнення сокетів у стані TIME_WAIT. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-port-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, SO_REUSEPORT буде використано при привʼязці порту, що дозволяє більш ніж одному екземпляру привʼязуватися до тієї самої адреси та порту. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикання профілювання через веб-інтерфейс host:port/debug/pprof/</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-increment-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інкремент часу, що додається для кожного Gi до ActiveDeadlineSeconds для поду NFS scrubber</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-minimum-timeout-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 60</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальне значення ActiveDeadlineSeconds, яке потрібно використовувати для HostPath Recycler pod.  Це лише для розробки та тестування і не працюватиме у багатовузловому кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-minimum-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 300</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>TМінімальне значення ActiveDeadlineSeconds, яке потрібно використовувати для pod NFS Recycler</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-pod-template-filepath-hostpath string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу з визначенням тома, який використовується як шаблон для переробки постійного тома HostPath. Він призначений лише для розробки та тестування і не працюватиме у багатовузловому кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-pod-template-filepath-nfs string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу з визначенням pod, який використовується як шаблон для рециркуляції постійних томів NFS</p></td>
      </tr>
      <tr>
         <td colspan="2">--pv-recycler-timeout-increment-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>інкремент часу, що додається до ActiveDeadlineSeconds на кожен Gi, для HostPath Pod scrubber.  Це призначено лише для розробки та тестування і не працюватиме у багатовузловому кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--pvclaimbinder-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період синхронізації постійних томів і заявок на постійні томи</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-allowed-names strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список загальних імен клієнтських сертифікатів, щоб дозволити вказувати імена користувачів у заголовках, визначених параметром --requestheader-username-headers. Якщо він порожній, можна використовувати будь-який сертифікат клієнта, підтверджений центрами сертифікації у файлі --requestheader-client-ca-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пакет кореневих сертифікатів для перевірки клієнтських сертифікатів на вхідних запитах перед тим, як довіряти іменам користувачів у заголовках, визначених параметром --requestheader-username-headers. ПОПЕРЕДЖЕННЯ: зазвичай не залежить від авторизації, яку вже виконано для вхідних запитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-extra-"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список префіксів заголовків запитів для перевірки. Пропонується X-Remote-Extra-.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-group"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність груп. Пропонується X-Remote-Group.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-uid-headers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність UID. Пропонується X-Remote-Uid. Потребує увімкнення функції RemoteRequestHeaderUID.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-user"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність імен користувачів. X-Remote-User є поширеним.</p></td>
      </tr>
      <tr>
         <td colspan="2">--resource-quota-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період синхронізації статусу використання квоти в системі</p></td>
      </tr>
      <tr>
         <td colspan="2">--root-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, цей кореневий центр сертифікації буде включено до токену секрету службового облікового запису. Це має бути дійсний пакет центрів сертифікації з PEM-кодуванням.</p></td>
      </tr>
      <tr>
         <td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Період узгодження маршрутів, створених для Node хмарним провайдером.</p></td>
      </tr>
      <tr>
         <td colspan="2">--secondary-node-eviction-rate float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.01</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість вузлів на секунду, на яких видаляються pods у разі відмови вузла, коли зона є несправною (див. --unhealthy-zone-threshold для визначення healthy/unhealthy зони). Під зоною мається на увазі весь кластер у небагатозонних кластерах. Це значення неявно перевизначається на 0, якщо розмір кластера менший за --large-cluster-size-threshold.</p></td>
      </tr>
      <tr>
         <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10257</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, на якому обслуговувати HTTPS з автентифікацією та авторизацією. Якщо 0, не обслуговувати HTTPS взагалі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-private-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає застарілі токени на основі секретності, якщо встановлено. Файл, що містить приватний ключ RSA або ECDSA, закодований PEM, який використовується для підпису токенів службових облікових записів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-cluster-ip-range string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Діапазон CIDR для Services у кластері. Використовується лише коли --allocate-node-cidrs=true; якщо false, цей параметр буде проігноровано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--show-hidden-metrics-for-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Попередня версія, для якої ви хочете показати приховані метрики. Значення має лише попередня мінорна версія, інші значення не будуть дозволені. Формат: &lt;major&gt;.&lt;minor&gt;, наприклад: '1.16'. Мета цього формату — переконатися, що ви маєте можливість помітити, що наступний реліз приховує додаткові метрики, замість того, щоб дивуватися, коли вони будуть назавжди вилучені в наступному релізі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--terminated-pod-gc-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 12500</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість podʼів, що завершили роботу, які можуть існувати до того, як збирач завершених podʼів почне їх видалення. Якщо &lt;= 0, то збирач завершених podʼів вимкнено.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить стандартний сертифікат x509 для HTTPS. (Сертифікат центру сертифікації, якщо такий є, додається після сертифіката сервера). Якщо HTTPS-сервіс увімкнено, а --tls-cert-file і --tls-private-key-file не вказано, для публічної адреси буде згенеровано самопідписаний сертифікат і ключ, які буде збережено в теці, вказаній в --cert-dir.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cipher-suites strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список наборів шифрів для сервера. Якщо не вказано, буде використано стандартний набір шифрів Go.<br/>Значення, яким надається перевага: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>Небезпечні значення: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-min-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна підтримувана версія TLS. Можливі значення: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-private-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить стандартний приватний ключ x509, який відповідає --tls-cert-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-sni-cert-key string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пара шляхів до файлів сертифіката x509 і приватного ключа, до яких за бажанням додається список шаблонів доменів, які є повними доменними іменами, можливо, з префіксальними підстановчими сегментами. Доменні шаблони також дозволяють використовувати IP-адреси, але IP-адреси слід використовувати лише в тому випадку, якщо apiserver має доступ до IP-адреси, запитуваної клієнтом. Якщо шаблони домену не надано, витягуються імена сертифікатів. Збіги без підстановочних знаків мають перевагу над збігами з підстановочними знаками, а явні шаблони доменів мають перевагу над отриманими іменами. Для кількох пар ключ/сертифікат використовуйте --tls-sni-cert-key кілька разів. Приклади: &quot;example.crt,example.key&quot; або &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--unhealthy-zone-threshold float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.55</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Частка вузлів у зоні, яка не повинна бути Ready (мінімум 3) для того, щоб зона вважалася несправною.</p></td>
      </tr>
      <tr>
         <td colspan="2">--use-service-account-credentials</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, використовуйте окремі облікові дані для кожного контролера.</p></td>
      </tr>
      <tr>
         <td colspan="2">-v, --v int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>число для визначення ступеня деталізації логу</p></td>
      </tr>
      <tr>
         <td colspan="2">--version version[=true]</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та виходить; --version=vX.Y.Z... встановлює вказану версію</p></td>
      </tr>
      <tr>
         <td colspan="2">--vmodule pattern=N,...</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>список параметрів pattern=N, розділених комами, для файлового фільтрування логу (працює лише для текстового формату логу).</p></td>
      </tr>
   </tbody>
</table>
