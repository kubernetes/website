---
title: kubelet
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

Kubelet є основним "агентом вузла", який працює на кожному вузлі. Він може зареєструвати вузол на apiserver, використовуючи одне з наступного: імʼя хосту; прапорець для перевизначення імені хоста; або спеціальну логіку для провайдера хмарних послуг.

Kubelet працює в термінах PodSpec. PodSpe — це обʼєкт YAML або JSON, який описує Pod. Kubelet приймає набір PodSpec, які надаються різними механізмами (переважно через apiserver) і забезпечує, що контейнери, описані в цих PodSpec, працюють і є справними. Kubelet не управляє контейнерами, які не були створені Kubernetes.

Крім PodSpec з apiserver, є два способи, як маніфест контейнера може бути наданий kubelet.

Файл: Шлях, переданий як прапорець у командному рядку. Файли за цим шляхом будуть періодично моніторитися на наявність оновлень. Період моніторингу стандартно становить 20 секунд і налаштовується за допомогою прапорця.

HTTP endpoint: HTTP endpoint, переданий як параметр у командному рядку. Цей endpoint перевіряється кожні 20 секунд (також налаштовується за допомогою прапорця).

```shell
kubelet [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде працювати kubelet (встановіть '0.0.0.0' або '::' для прослуховування на всіх інтерфейсах та в усіх сімействах IP-адрес)  (ЗАСТАРІЛО: Цей параметр слід встановлювати через конфігураційний файл, вказаний прапорцем <code>--config</code> kubelet. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--allowed-unsafe-sysctls strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список небезпечних sysctl або шаблонів sysctl, розділених комами (завершуються на <code>&ast;</code>). Використовуйте їх на свій ризик. (ЗАСТАРІЛО: Цей параметр слід встановлювати через конфігураційний файл, вказаний прапорцем <code>--config</code> kubelet. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє анонімні запити до сервера kubelet. Запити, які не відхилені іншим методом автентифікації, розглядаються як анонімні. Анонімні запити мають імʼя користувача <code>system:anonymous</code> та імʼя групи <code>system:unauthenticated</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--authentication-token-webhook</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте API <code>TokenReview</code> для визначення автентифікації за допомогою маркерів доступу. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей від вебхук автентифікатора маркерів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--authorization-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "AlwaysAllow"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Режим авторизації для сервера kubelet. Дійсні варіанти — &quot;<code>AlwaysAllow</code>&quot; або &quot;<code>Webhook</code>&quot;. Режим Webhook використовує API <code>SubjectAccessReview</code> для визначення авторизації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей "authorized" від вебхук авторизатора. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей "unauthorized" від веб-хук авторизатора. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--bootstrap-kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig, який буде використовуватися для отримання клієнтського сертифіката для kubelet. Якщо файл, вказаний прапорцем <code>--kubeconfig</code>, не існує, використовується файл bootstrap kubeconfig для запиту клієнтського сертифіката від API сервера. У разі успіху, файл kubeconfig, що посилається на згенерований клієнтський сертифікат і ключ, буде записано за шляхом, вказаним прапорцем <code>--kubeconfig</code>. Файл клієнтського сертифіката і ключа буде збережено в теці, на яку вказує прапорець <code>--cert-dir</code>.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: /var/lib/kubelet/pki</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тека, де розташовані TLS сертифікати. Якщо вказані прапорці <code>--tls-cert-file</code> та <code>--tls-private-key-file</code>, цей прапорець буде ігноруватися.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cgroup-driver string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "cgroupfs"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Драйвер, який kubelet використовує для управління cgroups на хості. Можливі значення: &quot;<code>cgroupfs</code>&quot;, &quot;<code>systemd</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cgroup-root string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязковий кореневий cgroup для використання з Podʼами. Обробляється контейнерним середовищем на основі принципу найкращих зусиль. Типово: '', що означає використання стандартного значення контейнерного середовища. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cgroups-per-qos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкнути створення ієрархії QoS cgroup. Якщо це вірно, створюються cgroup верхнього рівня QoS та cgroup Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-ca-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, будь-який запит, що містить клієнтський сертифікат, підписаний однією з організацій, зазначених у файлі client-ca-file, буде автентифіковано з ідентичністю, що відповідає <code>CommonName</code> клієнтського сертифіката. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cloud-provider string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Постачальник для хмарних сервісів. Встановіть порожній рядок для запуску без постачальника хмари. Встановіть 'external' для запуску з зовнішнім постачальником хмари.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cluster-dns strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список IP-адрес DNS-серверів, розділений комами. Це значення використовується для DNS-серверів контейнерів у випадку Podʼів з &quot;dnsPolicy=ClusterFirst&quot;. Примітка: всі DNS-сервери у списку МАЮТЬ обслуговувати один і той же набір записів, інакше розвʼязання імен у кластері може працювати некоректно. Немає гарантії, який саме DNS-сервер буде використовуватися для розвʼязання імен. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)<p></td>
        </tr>
        <tr>
            <td colspan="2">--cluster-domain string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Домен для цього кластера. Якщо встановлено, kubelet налаштує всі контейнери для пошуку в цьому домені на додаток до пошукових доменів хоста. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Kubelet завантажить свою початкову конфігурацію з цього файлу. Шлях може бути абсолютним або відносним; відносні шляхи починаються з поточної робочої теки kubelet. Пропустіть цей прапорець, щоб використовувати вбудовані стандартні значення конфігурації. Прапорці командного рядка переважають над конфігурацією з цього файлу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config-dir string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки для вказівки додаткових конфігурацій, що дозволяє користувачу за бажанням зазначити додаткові конфігурації для перевизначення значень, що надаються стандартно у прапорці KubeletConfigFile. [default='']</p></td>
        </tr>
        <tr>
            <td colspan="2">--container-log-max-files int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>&lt;Увага: бета-функція&gt; Встановіть максимальну кількість файлів логів контейнерів, які можуть бути присутніми для контейнера. Число має бути &gt;= 2. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--container-log-max-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "10Mi"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>&lt;Увага: бета-функція&gt; Встановіть максимальний розмір (наприклад, <code>10Mi</code>) файлу логу контейнера до того, як буде виконано його ротацію. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--container-runtime-endpoint string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "unix:///run/containerd/containerd.sock"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Точка доступу до сервісу рушія контейнерів. Unix Domain Sockets підтримуються в Linux, тоді як точки доступу npipe і tcp підтримуються у Windows. Приклади: 'unix:///path/to/runtime.sock', 'npipe:////./pipe/runtime'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--contention-profiling</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє профілювання блоків, якщо профілювання увімкнено. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cpu-cfs-quota&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає застосування квоти CPU CFS для контейнерів, у яких вказано ліміти CPU. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cpu-cfs-quota-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100ms</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Встановлює значення періоду квоти CPU CFS, <code>cpu.cfs_period_us</code>, зазвичай використовується стандартне значення ядра Linux. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика CPU Manager для використання. Можливі значення: 'none', 'static'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-policy-options &lt;пари 'ключ=значення', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір параметрів key=value CPU Manager, які можна використовувати для точного налаштування їхньої поведінки. Якщо не надано, залишити стандартну поведінку. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-reconcile-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>&lt;Увага: альфа-функція&gt; Період узгодження політики керування CPU. Приклади: '10s', або '1m'. Якщо не вказано, використовується 'NodeStatusUpdateFrequency'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--enable-controller-attach-detach&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє контролеру Attach/Detach керувати приєднанням/відʼєднанням томів, запланованих до цього вузла, і забороняє kubelet виконувати будь-які операції приєднання/відʼєднання. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--enable-debugging-handlers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає серверні точки доступу для збору логів та локального запуску контейнерів і команд. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)<p></td>
        </tr>
        <tr>
            <td colspan="2">--enable-server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає сервер kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--enforce-node-allocatable strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "pods"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список рівнів застосування обмежень розподілу ресурсів вузла, розділений комами, який буде застосовуватися kubelet. Прийнятні опції: 'none', 'pods', 'system-reserved', 'system-reserved-compressible', 'kube-reserved' та 'kube-reserved-compressible'. Якщо зазначені останні чотири опції, обовʼязково також встановити <code>--system-reserved-cgroup</code> і <code>--kube-reserved-cgroup</code>, відповідно. Якщо зазначено 'none', додаткові опції не повинні бути встановлені. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/">[офіційну документацію](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/)</a> для отримання додаткової інформації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--event-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір сплеску записів подій, тимчасово дозволяє записам подій збільшуватися до цього числа, не перевищуючи event-qps. Число має бути &gt;= 0. Якщо встановлено 0, буде використано DefaultBurst: 10. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--event-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>QPS для обмеження створення подій. Число має бути &gt;= 0. Якщо 0, буде використано DefaultQPS: 5. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-hard &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір порогів виселення (наприклад, memory.available&lt;1Gi), досягнення яких спричиняє виселення Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-max-pod-grace-period int32</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний дозволений період відстрочки (у секундах) для використання при припиненні роботи подів у відповідь на досягнення порогу мʼякого виселення.  Якщо значення від'ємне, відкладіть до значення, вказаного для підсистеми. (ВИКОРИСТАННЯ ПАРАМЕТРУ ЗАСТАРІЛЕ: Цей параметр слід встановлювати через файл конфігурації, вказаний прапорцем --config Kubelet. Докладнішу інформацію див. на сторінці <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-minimum-reclaim &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір мінімальних відновлень (наприклад, imagefs.available=2Gi), що описує мінімальну кількість ресурсів, яку kubelet буде відновлювати під час виселення Podʼів, якщо цей ресурс знаходиться під тиском. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-pressure-transition-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість, протягом якої kubelet має чекати перед виходом із стану тиску виселення. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-soft &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір порогів виселення (наприклад, memory.available&lt;1.5Gi), які при досягненні протягом відповідного пільгового періоду спричинять виселення Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--eviction-soft-grace-period &lt;пари 'key=value', розділенікомами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пільгових періодів виселення (наприклад, memory.available=1m30s), які відповідають тривалості, протягом якої мʼякий поріг виселення має утримуватись перед тим, як буде ініційовано виселення Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--exit-on-lock-contention</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Чи повинен kubelet завершити роботу після конфлікту файлів блокування.</p></td>
        </tr>
        <tr>
            <td colspan="2">--experimental-allocatable-ignore-eviction</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено <code>true</code>, Hard Eviction Thresholds (жорсткі пороги виселення) будуть ігноруватися при розрахунку Node Allocatable (доступних вузлів). Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/">тут</a> для отримання додаткової інформації. [default=false] (ЗАСТАРІЛО: буде видалено в версії 1.25 або пізніше)</p></td>
        </tr>
        <tr>
            <td colspan="2">--experimental-mounter-path string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>[Експериментально] Шлях до виконуваного файлу монтувальника. Залиште порожнім, щоб використовувати стандартний <code>mount</code>. (ЗАСТАРІЛО: буде видалено в версії 1.24 або пізніше на користь використання CSI.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--fail-cgroupv1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Забороняє запуск kubelet на хості за допомогою cgroup v1.</p></td>
        </tr>
        <tr>
            <td colspan="2">--fail-swap-on&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Змушує kubelet не запускатися, якщо на вузлі увімкнено своп. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--feature-gates &lt;пари 'key=True|False, розділені комами'&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір пар <code>key=value</code>, що містить опис функціональних можливостей рівня alpha/experimental. Можливі варіанти:<br/>
            APIResponseCompression=true|false (BETA - default=true)<br/>
            APIServerIdentity=true|false (BETA - default=true)<br/>
            APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
            AllAlpha=true|false (ALPHA - default=false)<br/>
            AllBeta=true|false (BETA - default=false)<br/>
            AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
            AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
            AuthorizePodWebsocketUpgradeCreatePermission=true|false (BETA - default=true)<br/>
            CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
            CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            CRDObservedGenerationTracking=true|false (BETA - default=false)<br/>
            CSIServiceAccountTokenSecrets=true|false (BETA - default=true)<br/>
            CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
            ClearingNominatedNodeNameAfterBinding=true|false (BETA - default=true)<br/>
            ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
            ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
            CloudControllerManagerWatchBasedRoutesReconciliation=true|false (ALPHA - default=false)<br/>
            CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
            ClusterTrustBundle=true|false (BETA - default=false)<br/>
            ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
            ComponentFlagz=true|false (ALPHA - default=false)<br/>
            ComponentStatusz=true|false (ALPHA - default=false)<br/>
            ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
            ConstrainedImpersonation=true|false (ALPHA - default=false)<br/>
            ContainerCheckpoint=true|false (BETA - default=true)<br/>
            ContainerRestartRules=true|false (BETA - default=true)<br/>
            ContainerStopSignals=true|false (ALPHA - default=false)<br/>
            ContextualLogging=true|false (BETA - default=true)<br/>
            CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
            CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
            CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
            DRAAdminAccess=true|false (BETA - default=true)<br/>
            DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
            DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
            DRADeviceTaintRules=true|false (ALPHA - default=false)<br/>
            DRADeviceTaints=true|false (ALPHA - default=false)<br/>
            DRAExtendedResource=true|false (ALPHA - default=false)<br/>
            DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
            DRAPrioritizedList=true|false (BETA - default=true)<br/>
            DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
            DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
            DeclarativeValidation=true|false (BETA - default=true)<br/>
            DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
            DeploymentReplicaSetTerminatingReplicas=true|false (BETA - default=true)<br/>
            DetectCacheInconsistency=true|false (BETA - default=true)<br/>
            DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
            EnvFiles=true|false (BETA - default=true)<br/>
            EventedPLEG=true|false (ALPHA - default=false)<br/>
            ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
            GangScheduling=true|false (ALPHA - default=false)<br/>
            GenericWorkload=true|false (ALPHA - default=false)<br/>
            GracefulNodeShutdown=true|false (BETA - default=true)<br/>
            GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
            HPAConfigurableTolerance=true|false (BETA - default=true)<br/>
            HPAScaleToZero=true|false (ALPHA - default=false)<br/>
            HostnameOverride=true|false (BETA - default=true)<br/>
            ImageVolume=true|false (BETA - default=true)<br/>
            InOrderInformers=true|false (BETA - default=true)<br/>
            InOrderInformersBatchProcess=true|false (BETA - default=true)<br/>
            InPlacePodLevelResourcesVerticalScaling=true|false (ALPHA - default=false)<br/>
            InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
            InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
            InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
            KubeletCrashLoopBackOffMax=true|false (BETA - default=true)<br/>
            KubeletEnsureSecretPulledImages=true|false (BETA - default=true)<br/>
            KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
            KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
            KubeletPSI=true|false (BETA - default=true)<br/>
            KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
            KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
            KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
            KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
            ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
            LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
            LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
            LoggingBetaOptions=true|false (BETA - default=true)<br/>
            MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
            MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
            MaxUnavailableStatefulSet=true|false (BETA - default=true)<br/>
            MemoryQoS=true|false (ALPHA - default=false)<br/>
            MutableCSINodeAllocatableCount=true|false (BETA - default=true)<br/>
            MutablePVNodeAffinity=true|false (ALPHA - default=false)<br/>
            MutablePodResourcesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
            MutableSchedulingDirectivesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
            MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
            NodeDeclaredFeatures=true|false (ALPHA - default=false)<br/>
            NodeLogQuery=true|false (BETA - default=false)<br/>
            NominatedNodeNameForExpectation=true|false (BETA - default=true)<br/>
            OpenAPIEnums=true|false (BETA - default=true)<br/>
            OpportunisticBatching=true|false (BETA - default=true)<br/>
            PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
            PodCertificateRequest=true|false (BETA - default=false)<br/>
            PodDeletionCost=true|false (BETA - default=true)<br/>
            PodLevelResources=true|false (BETA - default=true)<br/>
            PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
            PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
            PodTopologyLabelsAdmission=true|false (BETA - default=true)<br/>
            PortForwardWebsockets=true|false (BETA - default=true)<br/>
            PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
            ProcMountType=true|false (BETA - default=true)<br/>
            QOSReserved=true|false (ALPHA - default=false)<br/>
            ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
            RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
            ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
            RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
            ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
            RestartAllContainersOnContainerExits=true|false (ALPHA - default=false)<br/>
            RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
            RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
            SELinuxChangePolicy=true|false (BETA - default=true)<br/>
            SELinuxMount=true|false (BETA - default=false)<br/>
            SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
            SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
            SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
            SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
            ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
            SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
            StatefulSetSemanticRevisionComparison=true|false (BETA - default=true)<br/>
            StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
            StorageVersionAPI=true|false (ALPHA - default=false)<br/>
            StorageVersionHash=true|false (BETA - default=true)<br/>
            StorageVersionMigrator=true|false (BETA - default=false)<br/>
            StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
            StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
            StructuredAuthenticationConfigurationJWKSMetrics=true|false (BETA - default=true)<br/>
            TaintTolerationComparisonOperators=true|false (ALPHA - default=false)<br/>
            TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
            TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
            UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
            UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
            UserNamespacesHostNetworkSupport=true|false (ALPHA - default=false)<br/>
            UserNamespacesSupport=true|false (BETA - default=true)<br/>
            VolumeLimitScaling=true|false (ALPHA - default=false)<br/>
            WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
            WatchList=true|false (BETA - default=true)<br/>
            WatchListClient=true|false (BETA - default=true)<br/>
            WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
            WindowsGracefulNodeShutdown=true|false (BETA - default=true)<br/>
            (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--file-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 20s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість між перевірками конфігураційних файлів на наявність нових даних. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--hairpin-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "promiscuous-bridge"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Як kubelet повинен налаштовувати hairpin NAT. Це дозволяє точкам доступу Service балансувати навантаження назад на себе, якщо вони намагаються отримати доступ до власного Service. Допустимі значення: &quot;promiscuous-bridge&quot;, &quot;hairpin-veth&quot; та &quot;none&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--healthz-bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 127.0.0.1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде працювати сервер healthz (встановіть на '0.0.0.0' або '::' для прослуховування на всіх інтерфейсах та IP-сімействах). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10248</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт точки доступу healthz на localhost (встановіть <code>0</code> щоб вимкнути). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kubelet</p></td>
        </tr>
        <tr>
            <td colspan="2">--hostname-override string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо не порожній, буде використовуватися цей рядок як ідентифікатор замість фактичного імені хоста.</p></td>
        </tr>
        <tr>
            <td colspan="2">--http-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 20s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість між перевірками http на наявність нових даних. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-credential-provider-bin-dir string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, де знаходяться двійкові файли втулка постачальника облікових даних.</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-credential-provider-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу втулка постачальника облікових даних. (JSON/YAML/YML) або тека таких файлів (обʼєднаних в лексикографічному порядку; нерекурсивний пошук)</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-gc-high-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 85</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Відсоток використання диска, після якого завжди виконується видалення непотрібних образів. Значення має бути в діапазоні [0, 100], щоб вимкнути збирання сміття, встановіть значення 100. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-gc-low-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 80</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Відсоток використання диска, до якого прибирання образів ніколи не виконується. Найменше використання диска, при якому проводиться збір сміття. Значення повинні бути в межах [0, 100] і не повинні перевищувати значення --image-gc-high-threshold. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-service-endpoint string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Точка доступу до віддаленого сервісу образів. Якщо не вказано, стандартно буде така ж, як і у --container-runtime-endpoint. Unix Domain Socket підтримуються в Linux, тоді як точки доступу 'npipe' і 'tcp' підтримуються у Windows. Приклади: 'unix:///path/to/runtime.sock', 'npipe:////./pipe/runtime'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kernel-memcg-notification</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо увімкнено, kubelet буде інтегруватися з повідомленням memcg ядра для визначення, чи перевищено порогові значення пам’яті для виселення, замість періодичного опитування. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Сплеск, який буде використовуватися при спілкуванні з API сервером Kubernetes. Число має бути &gt;= 0. Якщо встановлено 0, буде використано DefaultBurst: 100. Не стосується пудьсу API подій та вузлів, для яких обмеження швидкості контролюється іншим набором прапорців. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "application/vnd.kubernetes.protobuf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тип вмісту запитів, що надсилаються до apiserver. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>QPS, який буде використовуватися при спілкуванні з API сервером Kubernetes. Число має бути &gt;= 0. Якщо встановлено 0, буде використано DefaultQPS: 50. Не стосується пульсу API подій та вузлів, для яких обмеження швидкості контролюється іншим набором прапорців. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kube-reserved &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пар ResourceName=ResourceQuantity (наприклад, cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid=1000), які описують ресурси, зарезервовані для компонентів системи Kubernetes. В даний час підтримуються тільки cpu, memory, pid та локальний ephemeral storage для кореневої файлової системи. Дивіться <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a> для отримання додаткової інформації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kube-reserved-cgroup string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Абсолютне імʼя верхнього рівня cgroup, яке використовується для управління компонентами Kubernetes, для яких ресурси обчислення були зарезервовані за допомогою прапорця <code>--kube-reserved</code>. Наприклад, &quot;<code>/kube-reserved</code>&quot;. [default=''] (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig, що визначає, як підключитися до API сервера. Надання <code>--kubeconfig</code> увімкне режим API сервера, тоді як пропуск <code>--kubeconfig</code> увімкне автономний (standalone) режим. </p></td>
        </tr>
        <tr>
            <td colspan="2">--kubelet-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязкове абсолютне імʼя cgroups для створення та запуску kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--local-storage-capacity-isolation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо <code>true</code>, увімкнено ізоляцію локального тимчасового зберігання. Інакше функція ізоляції локального зберігання буде вимкнена. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--lock-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>&lt;Попередження: Альфа функція&gt; Шлях до файлу, який kubelet використовуватиме як файл блокування.</p></td>
        </tr>
        <tr>
            <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість секунд між очищеннями логу.</p></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі з розділеними вихідними потоками інформаційні повідомлення можуть бути буферизовані на деякий час для підвищення продуктивності. Стандартне значення, що дорівнює нулю байтів, вимикає буферизацію. Розмір може бути вказаний у байтах (512), кратних 1000 (1K), кратних 1024 (2Ki) або степенях цих значень (3M, 4G, 5Mi, 6Gi). Щоб використовувати це, увімкніть функціональну можливість <code>LoggingAlphaOptions</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--log-text-split-stream</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі помилки записуються у stderr, а інформаційні повідомлення — у stdout. Стандартно всі повідомлення записуються в один потік stdout. Щоб використовувати це, увімкніть функціональну можливість LoggingAlphaOptions. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Встановлює формат логу. Дозволені формати: &quot;text&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--make-iptables-util-chains&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення істинне, kubelet забезпечить наявність правил утиліти <code>iptables</code> на хості. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--manifest-url string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>URL для доступу до додаткових специфікацій Pod, які потрібно запустити. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--manifest-url-header colonSeparatedMultimapStringString</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список HTTP-заголовків, розділених комами, які слід використовувати при доступі до URL, наданого параметром --manifest-url. Кілька заголовків з однаковою назвою будуть додані в тому ж порядку, в якому вони надані. Цей параметр можна використовувати кілька разів. Наприклад: --manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--max-open-files int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1000000</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість файлів, які може відкрити процес kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--max-pods int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 110</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість Podʼів, які можуть працювати на цьому kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--maximum-dead-containers int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість старих екземплярів контейнерів, які можна зберігати глобально. Кожен контейнер займає певний простір на диску. Щоб вимкнути, встановіть відʼємне число. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--maximum-dead-containers-per-container int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість старих екземплярів, які потрібно зберігати для кожного контейнера. Кожен контейнер займає певний обсяг дискового простору. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--memory-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "None"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика Memory Manager для використання. Можливі значення: 'None', 'Static'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--minimum-container-ttl-duration duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальний вік для завершеного контейнера перед тим, як його буде прибрано. Приклади: '300ms', '10s' або '2h45m'. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--minimum-image-ttl-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальний вік для невикористаного образу перед тим, як його буде прибрано. Приклади:  '300ms', '10s' або '2h45m'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-ip string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса (або список IP-адрес для двох стеків, розділених комами) вузла. Якщо не встановлено, kubelet використовуватиме стандартну IPv4-адресу вузла, якщо така є, або його стандартну IPv6-адресу, якщо IPv4-адрес немає. Ви можете передати '::', щоб віддати перевагу стандартній IPv6-адресі замість стандартної IPv4-адреси. Якщо хмарний провайдер налаштований як зовнішній, цей прапорець допоможе запустити вузол з відповідною IP-адресою.</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-labels &lt;пари key=value, розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мітки для додавання під час реєстрації вузла в кластері. Мітки повинні бути у форматі key=value, розділені ','. Мітки в просторі 'kubernetes.io' повинні починатися з дозволеного префікса ('kubelet.kubernetes.io', 'node.kubernetes.io') або бути в спеціально дозволеному наборі (beta.kubernetes.io/arch, beta.kubernetes.io/instance-type, beta.kubernetes.io/os, failure-domain.beta.kubernetes.io/region, failure-domain.beta.kubernetes.io/zone, kubernetes.io/arch, kubernetes.io/hostname, kubernetes.io/os, node.kubernetes.io/instance-type, topology.kubernetes.io/region, topology.kubernetes.io/zone).</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-status-max-images int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість образів для показу в Node.Status.Images. Якщо вказано <code>-1</code>, обмеження не буде застосовано. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Визначає, як часто kubelet сповіщає про статус вузла у майстер. Примітка: будьте обережні при зміні константи, вона повинна узгоджуватися з nodeMonitorGracePeriod в контролері вузлів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -999</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Значення oom-score-adj для процесу kubelet. Значення повинні бути в межах від [-1000, 1000]. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--pod-cidr string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>CIDR для використання IP-адрес Pod, використовується тільки в автономному (standalone) режимі. У кластерному режимі це отримується від майстра. Для IPv6 максимальна кількість виділених IP-адрес складає 65536. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--pod-manifest-path string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли статичних Pod для запуску, або шлях до одного файлу статичного Pod. Файли, що починаються з крапки, будуть ігноруватися. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--pod-max-pids int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Встановлює максимальну кількість процесів на Pod. Якщо <code>-1</code>, kubelet стандартно використовує доступну на вузлі ємність PID. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--pods-per-core int32</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість Podʼів на ядро, які можуть працювати на цьому kubelet. Загальна кількість Podʼів на цьому kubelet не може перевищувати --max-pods, тому буде використовуватися --max-pods, якщо цей розрахунок призведе до більшої кількості дозволених Podʼів на kubelet. Значення <code>0</code> вимикає це обмеження. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10250</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, на якому kubelet буде обслуговувати запити. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--protect-kernel-defaults</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Стандартна поведінка kubelet для налаштування ядра. Якщо встановлено, kubelet видасть помилку, якщо будь-яке з налаштувань ядра відрізняється від стандартних значень kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--provider-id string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Унікальний ідентифікатор для ідентифікації вузла в базі даних машин, тобто у постачальника хмари.</p></td>
        </tr>
        <tr>
            <td colspan="2">--qos-reserved &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>&lt;Попередження: Alpha рівень&gt; Набір пар ResourceName=Percentage (наприклад, &quot;<code>memory=50%</code>&quot;), які описують, як запити ресурсів Pod резервуються на рівні QoS. На даний момент підтримується тільки memory. Потрібно активувати функціональну можливість QOSReserved. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--read-only-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10255</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт тільки для читання, на якому буде працювати kubelet без автентифікації/авторизації (для вимкнення встановіть <code>0</code>). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--register-node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Зареєструйте вузол в apiserver. Якщо --kubeconfig не вказано, цей параметр не має значення, оскільки kubelet не матиме API-сервера для реєстрації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--register-with-taints []v1.Taint</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Реєструє вузол з наданим списком taints (розділених комами &quot;&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;&quot;). Нічого не робить, якщо <code>--register-node</code> має значення <code>false</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--registry-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір для сплеску завантажень, тимчасово дозволяє завантаженням досягати цієї кількості, не перевищуючи при цьому --registry-qps. Використовується тільки якщо --registry-qps &gt; 0. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--registry-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо &gt; 0, обмежити QPS для завантажень з реєстру до цього значення. Якщо <code>0</code>, без обмежень. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--reserved-cpus string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список CPU або діапазонів CPU, розділених комами, зарезервованих для системи та використання Kubernetes. Цей конкретний список переважатиме над кількістю CPU в --system-reserved та --kube-reserved. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--reserved-memory reserved-memory</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список резервувань памʼяті для NUMA вузлів, розділених комами. (наприклад, --reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi). Загальна сума для кожного типу памʼяті повинна дорівнювати сумі kube-reserved, system-reserved та eviction-threshold. Дивіться <a href="/uk/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag</a> для отримання додаткових відомостей. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--resolv-conf string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/resolv.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл конфігурації резольвера, який використовується як основа для конфігурації DNS-резолюції контейнера. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--root-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/var/lib/kubelet"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки для управління файлами kubelet (монтування томів тощо).</p></td>
        </tr>
        <tr>
            <td colspan="2">--rotate-certificates</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконувати автоматичну ротацію клієнтськіх сертифікатів kubelet, запитуючи нові сертифікати у kube-apiserver, коли термін дії сертифіката наближається до закінчення. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--rotate-server-certificates</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Автоматично запитувати та виконувати ротацію сертифікатів kubelet, запитуючи нові сертифікати у kube-apiserver, коли термін дії сертифіката наближається до закінчення. Потрібно активувати функціональну можливість RotateKubeletServerCertificate та схвалення поданих обʼєктів CertificateSigningRequest. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--runonce</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо <code>true</code>, виходити після створення Podʼів з файлів статичних подів або віддалених URL. Взаємовиключно з --enable-server. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--runtime-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязкова абсолютна назва cgroups для створення та запуску середовища виконання.</p></td>
        </tr>
        <tr>
            <td colspan="2">--runtime-request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут для всіх запитів до середовища виконання, окрім довготривалих запитів — pull, logs, exec та attach. Коли тайм-аут перевищено, kubelet скасує запит, видасть помилку і спробує знову пізніше. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--seccomp-default RuntimeDefault</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає використання RuntimeDefault як стандартного профілю seccomp для всіх навантажень.</p></td>
        </tr>
        <tr>
            <td colspan="2">--serialize-image-pulls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Витягує образи по одному. Рекомендується <em>не</em> змінювати стандартні значення на вузлах, які використовують демон Docker версії &lt; 1.9 або сховище Aufs. Деталі дивіться в тікеті #10959. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--streaming-connection-idle-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 4h0m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний час, протягом якого зʼєднання для потокового режиму може бути неактивним перед автоматичним закриттям зʼєднання. <code>0</code> вказує на відсутність тайм-ауту. Приклад: <code>5m</code>. Примітка: всі зʼєднання до сервера kubelet мають максимальну тривалість 4 години. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--sync-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний проміжок часу між синхронізацією запущених контейнерів та конфігурацією. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--system-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязкова абсолютна назва cgroups, в якій слід розмістити всі процеси, що не є процесами ядра, що не знаходяться вже в cgroup під '/'. Пусто для відсутності контейнера. Для скасування прапорця потрібне перезавантаження. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--system-reserved &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пар ResourceName=ResourceQuantity (наприклад, cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid=1000), які описують ресурси, зарезервовані для не-Kubernetes компонентів. Наразі підтримуються тільки cpu, memory, pid та локальне тимчасове сховище для кореневої файлової системи. Дивіться <a href="/uk/docs/concepts/configuration/manage-resources-containers/"> https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a> для отримання додаткових відомостей. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--system-reserved-cgroup string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Абсолютна назва cgroup найвищого рівня, яка використовується для управління не-Kubernetes компонентами, для яких ресурси були зарезервовані за допомогою прапорця --system-reserved. Наприклад, /system-reserved. [default=''] (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-cert-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить x509 сертифікат, використовується для обслуговування HTTPS (з проміжними сертифікатами, якщо такі є, конкатенованими після серверного сертифіката). Якщо --tls-cert-file та --tls-private-key-file не вказані, для публічної адреси генеруються самопідписані сертифікат і ключ, які зберігаються в теці, вказаній в --cert-dir. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-cipher-suites strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список наборів шифрів для сервера, розділений комами. Якщо не вказано, будуть використані стандартні набори шифрів Go.<br/>
            Рекомендовані значення:
            TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>
            Небезпечні значення:
            TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.<br/>
            (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--tls-min-version string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна підтримувана версія TLS. Можливі значення: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-private-key-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить приватний ключ x509, що відповідає <code>--tls-cert-file</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика Topology Manager для використання. Можливі значення:'none', 'best-effort', 'restricted', 'single-numa-node'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-policy-options &lt;пари 'key=value', розділені комами&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Набір параметрів політики Topology Manager у форматі key=value, які можна використовувати для тонкого налаштування їх поведінки. Якщо не вказані, зберігається стандартна поведінка. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-scope string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "container"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Область, до якої застосовуються топологічні підказки. Topology Manager збирає підказки від Hint Providers і застосовує їх до визначеної області для забезпечення допуску Pod. Можливі значення: 'container', 'pod'. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">-v, --v int</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Число для рівня детальності логу</p></td>
        </tr>
        <tr>
            <td colspan="2">--version version[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та завершує роботу; --version=vX.Y.Z... встановлює версію, про яку буде повідомлено</p></td>
        </tr>
        <tr>
            <td colspan="2">--vmodule attern=N,...</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список налаштувань <code>pattern=N</code>, розділених комами, для фільтрованого логування файлів (працює тільки для текстового формату логу).</p></td>
        </tr>
        <tr>
            <td colspan="2">--volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Повний шлях до теки, в якій слід шукати додаткові втулки томів від сторонніх постачальників. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
        <tr>
            <td colspan="2">--volume-stats-agg-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вказує інтервал, через який kubelet обчислює та кешує використання диска томів для всіх Podʼів і томів. Щоб вимкнути обчислення томів, встановіть від’ємне число. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/</a> для отримання додаткової інформації.)</p></td>
        </tr>
    </tbody>
</table>
