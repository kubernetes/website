---
title: kubelet
content_type: tool-reference
weight: 20
---

## {{% heading "synopsis" %}}

Kubelet є основним "агентом вузла", який працює на кожному вузлі. Він може зареєструвати вузол на apiserver, використовуючи одне з наступного: імʼя хосту; прапорець для перевизначення імені хоста; або спеціальну логіку для провайдера хмарних послуг.

Kubelet працює в термінах PodSpec. PodSpe — це обʼєкт YAML або JSON, який описує Pod. Kubelet приймає набір PodSpec, які надаються різними механізмами (переважно через apiserver) і забезпечує, що контейнери, описані в цих PodSpec, працюють і є справними. Kubelet не управляє контейнерами, які не були створені Kubernetes.

Крім PodSpec з apiserver, є два способи, як маніфест контейнера може бути наданий kubelet.

- Файл: Шлях, переданий як прапорець у командному рядку. Файли за цим шляхом будуть періодично моніторитися на наявність оновлень. Період моніторингу стандартно становить 20 секунд і налаштовується за допомогою прапорця.
- HTTP endpoint: HTTP endpoint, переданий як параметр у командному рядку. Цей endpoint перевіряється кожні 20 секунд (також налаштовується за допомогою прапорця).

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
            <td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0 </td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">IP-адреса, на якій буде працювати kubelet (встановіть <code>0.0.0.0</code> або <code>::</code> для прослуховування на всіх інтерфейсах та в усіх сімействах IP-адрес)  (ЗАСТАРІЛО: Цей параметр слід встановлювати через конфігураційний файл, вказаний прапорцем <code>--config</code> kubelet. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)
            </td>
        </tr>
        <tr>
            <td colspan="2">--allowed-unsafe-sysctls strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список небезпечних sysctl або шаблонів sysctl, розділених комами (завершуються на <code>&ast;</code>). Використовуйте їх на свій ризик. (ЗАСТАРІЛО: Цей параметр слід встановлювати через конфігураційний файл, вказаний прапорцем <code>--config</code> kubelet. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Дозволяє анонімні запити до сервера kubelet. Запити, які не відхилені іншим методом автентифікації, розглядаються як анонімні. Анонімні запити мають імʼя користувача <code>system:anonymous</code> та імʼя групи <code>system:unauthenticated</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--authentication-token-webhook</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Використовуйте API <code>TokenReview</code> для визначення автентифікації за допомогою маркерів доступу. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>2m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість кешування відповідей від вебхук аутентифікатора маркерів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--authorization-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>AlwaysAllow</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Режим авторизації для сервера kubelet. Дійсні варіанти — &quot;<code>AlwaysAllow</code>&quot; або &quot;<code>Webhook</code>&quot;. Режим Webhook використовує API <code>SubjectAccessReview</code> для визначення авторизації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>5m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість кешування відповідей "authorized" від вебхук авторизатора. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>30s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість кешування відповідей "unauthorized" від веб-хук авторизатора. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--bootstrap-kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу kubeconfig, який буде використовуватися для отримання клієнтського сертифіката для kubelet. Якщо файл, вказаний прапорцем <code>--kubeconfig</code>, не існує, використовується файл bootstrap kubeconfig для запиту клієнтського сертифіката від API сервера. У разі успіху, файл kubeconfig, що посилається на згенерований клієнтський сертифікат і ключ, буде записано за шляхом, вказаним прапорцем <code>--kubeconfig</code>. Файл клієнтського сертифіката і ключа буде збережено в теці, на яку вказує прапорець <code>--cert-dir</code>.</td>
        </tr>
        <tr>
            <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>/var/lib/kubelet/pki</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тека, де розташовані TLS сертифікати. Якщо вказані прапорці <code>--tls-cert-file</code> та <code>--tls-private-key-file</code>, цей прапорець буде ігноруватися.</td>
        </tr>
        <tr>
            <td colspan="2">--cgroup-driver string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>cgroupfs</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Драйвер, який kubelet використовує для управління cgroups на хості. Можливі значення: &quot;<code>cgroupfs</code>&quot;, &quot;<code>systemd</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cgroup-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>''</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Необовʼязковий кореневий cgroup для використання з Podʼами. Обробляється контейнерним середовищем на основі принципу найкращих зусиль. Типово: '', що означає використання стандартного значення контейнерного середовища. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cgroups-per-qos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Увімкнути створення ієрархії QoS cgroup. Якщо це вірно, створюються cgroup верхнього рівня QoS та cgroup Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--client-ca-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено, будь-який запит, що містить клієнтський сертифікат, підписаний однією з організацій, зазначених у файлі client-ca-file, буде автентифіковано з ідентичністю, що відповідає <code>CommonName</code> клієнтського сертифіката. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cloud-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу конфігурації постачальника хмари. Порожній рядок означає відсутність файлу конфігурації. (ЗАСТАРІЛО: буде видалено в версії 1.25 або пізніше, на користь видалення коду постачальників хмари з kubelet.)</td>
        </tr>
        <tr>
            <td colspan="2">--cloud-provider string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Постачальник для хмарних сервісів. Встановіть порожній рядок для запуску без постачальника хмари. Встановіть 'external' для запуску з зовнішнім постачальником хмари. Якщо встановлено, постачальник хмари визначає імʼя вузла (консультуйтеся з документацією постачальника хмари, щоб дізнатися, чи і як використовується імʼя хоста).</td>
        </tr>
        <tr>
            <td colspan="2">--cluster-dns strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список IP-адрес DNS-серверів, розділений комами. Це значення використовується для DNS-серверів контейнерів у випадку Podʼів з "<code>dnsPolicy: ClusterFirst</code>".<br/><B>Примітка:</B> всі DNS-сервери у списку МАЮТЬ обслуговувати один і той же набір записів, інакше розвʼязання імен у кластері може працювати некоректно. Немає гарантії, який саме DNS-сервер буде використовуватися для розвʼязання імен. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cluster-domain string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Домен для цього кластера. Якщо встановлено, kubelet налаштує всі контейнери для пошуку в цьому домені на додаток до пошукових доменів хоста. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Kubelet завантажить свою початкову конфігурацію з цього файлу. Шлях може бути абсолютним або відносним; відносні шляхи починаються з поточної робочої теки kubelet. Пропустіть цей прапорець, щоб використовувати вбудовані стандартні значення конфігурації. Прапорці командного рядка переважають над конфігурацією з цього файлу.</td>
        </tr>
        <tr>
            <td colspan="2">--config-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: ''</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до теки для вказівки додаткових конфігурацій, що дозволяє користувачу за бажанням зазначити додаткові конфігурації для перевизначення значень, що надаються стандартно і в прапорці `--config`.<br/><B>Примітка:</B> Встановіть змінну середовища '<code>KUBELET_CONFIG_DROPIN_DIR_ALPHA</code>', щоб вказати теку.</td>
        </tr>
        <tr>
            <td colspan="2">--container-log-max-files int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Увага: бета-функція&gt; Встановіть максимальну кількість файлів логів контейнерів, які можуть бути присутніми для контейнера. Число має бути &gt;= 2. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--container-log-max-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>10Mi</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Увага: бета-функція&gt; Встановіть максимальний розмір (наприклад, <code>10Mi</code>) файлу логу контейнера до того, як буде виконано його ротацію. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--container-runtime-endpoint string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>"unix:///run/containerd/containerd.sock"</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Точка доступу до віддаленого сервісу. UNIX доменні сокети підтримуються в Linux, тоді як точки доступу 'npipe' і 'tcp' підтримуються у Windows. Приклади: <code>'unix:///path/to/runtime.sock'</code>, <code>'npipe:////./pipe/runtime'</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--contention-profiling</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Дозволяє профілювання блоків, якщо профілювання увімкнено. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cpu-cfs-quota&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вмикає застосування квоти CPU CFS для контейнерів, у яких вказано ліміти CPU. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cpu-cfs-quota-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>100ms</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Встановлює значення періоду квоти CPU CFS, <code>cpu.cfs_period_us</code>, зазвичай використовується стандартне значення ядра Linux. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>none</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Політика керування CPU для використання. Можливі значення: &quot;<code>none</code>&quot;, &quot;<code>static</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-policy-options string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір параметрів політики " key=value" менеджера процесорів, які можна використовувати для точного налаштування їхньої поведінки. Якщо не надано, залишити стандартну поведінку. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--cpu-manager-reconcile-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>10s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Увага: альфа-функція&gt; Період узгодження політики керування CPU. Приклади: &quot;<code>10s</code>&quot;, або &quot;<code>1m</code>&quot;. Якщо не вказано, використовується стандартна частота оновлення статусу вузла. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--enable-controller-attach-detach&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Дозволяє контролеру Attach/Detach керувати приєднанням/відʼєднанням томів, запланованих до цього вузла, і забороняє kubelet виконувати будь-які операції приєднання/відʼєднання. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--enable-debugging-handlers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вмикає серверні точки доступу для збору логів та локального запуску контейнерів і команд. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--enable-server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вмикає сервер kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--enforce-node-allocatable strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>pods</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список рівнів застосування обмежень розподілу ресурсів вузла, розділений комами, який буде застосовуватися kubelet. Прийнятні опції: &quot;<code>none</code>&quot;, &quot;<code>pods</code>&quot;, &quot;<code>system-reserved</code>&quot; та &quot;<code>kube-reserved</code>&quot;. Якщо зазначені останні дві опції, обовʼязково також встановити <code>--system-reserved-cgroup</code> і <code>--kube-reserved-cgroup</code>, відповідно. Якщо зазначено &quot;<code>none</code>&quot;, додаткові опції не повинні бути встановлені. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/">офіційну документацію</a> для отримання додаткової інформації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--event-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальний розмір сплеску записів подій, тимчасово дозволяє записам подій збільшуватися до цього числа, не перевищуючи <code>--event-qps</code>. Число має бути &gt;= 0. Якщо встановлено 0, буде використано стандартне значення (100). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--event-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">QPS для обмеження створення подій. Число має бути &gt;= 0. Якщо 0, буде використано стандартне значення QPS (50). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-hard strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>imagefs.available<15%,memory.available<100Mi,nodefs.available<10%</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір порогів виселення (наприклад, &quot;<code>memory.available<1Gi</code>&quot;), досягнення яких спричиняє виселення Podʼів. На вузлі Linux стандартне значення також включає &quot;<code>nodefs.inodesFree<5%</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-max-pod-grace-period int32</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальний допустимий період завершення (в секундах) для використання при завершенні Podʼів у відповідь на досягнення мʼякого порогу виселення. Якщо значення відʼємне, використовувати значення, вказане у Podʼі. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-minimum-reclaim strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір мінімальних відновлень (наприклад, &quot;<code>imagefs.available=2Gi</code>&quot;), що описує мінімальну кількість ресурсів, яку kubelet буде відновлювати під час виселення Podʼів, якщо цей ресурс знаходиться під тиском. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-pressure-transition-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>5m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість, протягом якої kubelet має чекати перед виходом із стану тиску виселення. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-soft strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір порогів виселення (наприклад, &quot;<code>memory.available<1.5Gi</code>&quot;), які при досягненні протягом відповідного пільгового періоду спричинять виселення Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--eviction-soft-grace-period strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір пільгових періодів виселення (наприклад, &quot;<code>memory.available=1m30s</code>&quot;), які відповідають тривалості, протягом якої мʼякий поріг виселення має утримуватись перед тим, як буде ініційовано виселення Podʼів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--exit-on-lock-contention</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Чи повинен kubelet завершити роботу після конфлікту файлів блокування.</td>
        </tr>
        <tr>
            <td colspan="2">--experimental-allocatable-ignore-eviction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>false</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено <code>true</code>, жорсткі пороги виселення будуть ігноруватися при розрахунку доступних ресурсів вузла. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/">тут</a> для отримання додаткової інформації. (ЗАСТАРІЛО: буде видалено в версії 1.25 або пізніше)</td>
        </tr>
        <tr>
            <td colspan="2">--experimental-mounter-path string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>mount</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">[Експериментально] Шлях до виконуваного файлу монтувальника. Залиште порожнім, щоб використовувати стандартний <code>mount</code>. (ЗАСТАРІЛО: буде видалено в версії 1.24 або пізніше на користь використання CSI.)</td>
        </tr>
        <tr>
            <td colspan="2">--fail-cgroupv1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Забороняє запуск kubelet на хості за допомогою cgroup v1.</td>
        </tr>
        <tr>
            <td colspan="2">--fail-swap-on&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Змушує kubelet не запускатися, якщо на вузлі увімкнено своп. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--feature-gates &lt;Перелік пар 'key=true/false'&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір пар <code>key=value</code>, що містить опис функціональних можливостей рівня alpha/experimental. Можливі варіанти:<br/>
            APIResponseCompression=true|false (BETA - default=true)<br/>
            APIServerIdentity=true|false (BETA - default=true)<br/>
            APIServerTracing=true|false (BETA - default=true)<br/>
            APIServingWithRoutine=true|false (BETA - default=true)<br/>
            AllAlpha=true|false (ALPHA - default=false)<br/>
            AllBeta=true|false (BETA - default=false)<br/>
            AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
            AnonymousAuthConfigurableEndpoints=true|false (BETA - default=true)<br/>
            AnyVolumeDataSource=true|false (BETA - default=true)<br/>
            AuthorizeNodeWithSelectors=true|false (BETA - default=true)<br/>
            AuthorizeWithSelectors=true|false (BETA - default=true)<br/>
            BtreeWatchCache=true|false (BETA - default=true)<br/>
            CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
            CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
            CRDValidationRatcheting=true|false (BETA - default=true)<br/>
            CSIMigrationPortworx=true|false (BETA - default=false)<br/>
            CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
            ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
            ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
            CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
            ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
            ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
            ComponentFlagz=true|false (ALPHA - default=false)<br/>
            ComponentStatusz=true|false (ALPHA - default=false)<br/>
            ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
            ConsistentListFromCache=true|false (BETA - default=true)<br/>
            ContainerCheckpoint=true|false (BETA - default=true)<br/>
            ContextualLogging=true|false (BETA - default=true)<br/>
            CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
            CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
            CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
            DRAAdminAccess=true|false (ALPHA - default=false)<br/>
            DRAResourceClaimDeviceStatus=true|false (ALPHA - default=false)<br/>
            DisableAllocatorDualWrite=true|false (ALPHA - default=false)
            DynamicResourceAllocation=true|false (BETA - default=false)<br/>
            EventedPLEG=true|false (ALPHA - default=false)<br/>
            ExternalServiceAccountTokenSigner=true|false (ALPHA - default=false)<br/>
            GracefulNodeShutdown=true|false (BETA - default=true)<br/>
            GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
            HPAScaleToZero=true|false (ALPHA - default=false)<br/>
            HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
            ImageMaximumGCAge=true|false (BETA - default=true)<br/>
            ImageVolume=true|false (ALPHA - default=false)<br/>
            InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
            InPlacePodVerticalScalingAllocatedStatus=true|false (ALPHA - default=false)<br/>
            InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
            InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
            InformerResourceVersion=true|false (ALPHA - default=false)<br/>
            JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
            JobManagedBy=true|false (ALPHA - default=false)<br/>
            JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
            JobSuccessPolicy=true|false (BETA - default=true)<br/>
            KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
            KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
            KubeletFineGrainedAuthz=true|false (ALPHA - default=false)<br/>
            KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
            KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
            KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
            KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
            KubeletTracing=true|false (BETA - default=true)<br/>
            LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=true)<br/>
            LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
            LoggingBetaOptions=true|false (BETA - default=true)<br/>
            MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
            MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
            MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
            MemoryQoS=true|false (ALPHA - default=false)<br/>
            MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
            MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
            NFTablesProxyMode=true|false (BETA - default=true)<br/>
            NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
            NodeLogQuery=true|false (BETA - default=false)<br/>
            NodeSwap=true|false (BETA - default=true)<br/>
            OpenAPIEnums=true|false (BETA - default=true)<br/>
            PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
            PodDeletionCost=true|false (BETA - default=true)<br/>
            PodLevelResources=true|false (ALPHA - default=false)<br/>
            PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
            PodLifecycleSleepActionAllowZero=true|false (ALPHA - default=false)<br/>
            PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
            PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
            PortForwardWebsockets=true|false (BETA - default=true)<br/>
            ProcMountType=true|false (BETA - default=true)<br/>
            QOSReserved=true|false (ALPHA - default=false)<br/>
            RecoverVolumeExpansionFailure=true|false (BETA - default=true)<br/>
            RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
            RelaxedDNSSearchValidation=true|false (ALPHA - default=false)<br/>
            RelaxedEnvironmentVariableValidation=true|false (BETA - default=true)<br/>
            ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
            RemoteRequestHeaderUID=true|false (ALPHA - default=false)<br/>
            ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
            ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
            RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
            RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
            SELinuxChangePolicy=true|false (ALPHA - default=false)<br/>
            SELinuxMount=true|false (ALPHA - default=false)<br/>
            SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
            SchedulerAsyncPreemption=true|false (ALPHA - default=false)<br/>
            SchedulerQueueingHints=true|false (BETA - default=true)<br/>
            SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
            SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
            ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
            ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
            ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
            SidecarContainers=true|false (BETA - default=true)<br/>
            StorageNamespaceIndex=true|false (BETA - default=true)<br/>
            StorageVersionAPI=true|false (ALPHA - default=false)<br/>
            StorageVersionHash=true|false (BETA - default=true)<br/>
            StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
            StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
            SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
            SystemdWatchdog=true|false (BETA - default=true)<br/>
            TopologyAwareHints=true|false (BETA - default=true)<br/>
            TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
            UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
            UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
            UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
            UserNamespacesSupport=true|false (BETA - default=false)<br/>
            VolumeAttributesClass=true|false (BETA - default=false)<br/>
            VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
            WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
            WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
            WatchList=true|false (BETA - default=true)<br/>
            WatchListClient=true|false (BETA - default=false)<br/>
            WinDSR=true|false (ALPHA - default=false)<br/>
            WinOverlay=true|false (BETA - default=true)<br/>
            WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
            WindowsGracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
            WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
            (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--file-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>20s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість між перевірками конфігураційних файлів на наявність нових даних. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--hairpin-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>promiscuous-bridge</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Як kubelet повинен налаштовувати hairpin NAT. Це дозволяє точкам доступу Service балансувати навантаження назад на себе, якщо вони намагаються отримати доступ до власного Service. Допустимі значення: &quot;<code>promiscuous-bridge</code>&quot;, &quot;<code>hairpin-veth</code>&quot; та &quot;<code>none</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--healthz-bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>127.0.0.1</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">IP-адреса, на якій буде працювати сервер healthz (встановіть на &quot;<code>0.0.0.0</code>&quot; або &quot;<code>::</code>&quot; для прослуховування на всіх інтерфейсах та IP-сімействах). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10248</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Порт точки доступу healthz на localhost (встановіть <code>0</code> щоб вимкнути). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Довідка kubelet</td>
        </tr>
        <tr>
            <td colspan="2">--hostname-override string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо не порожній, буде використовуватися цей рядок як ідентифікатор замість фактичного імені хоста. Якщо встановлено <code>--cloud-provider</code>, постачальник хмарних послуг визначає імʼя вузла (звіртесь з документацією постачальника хмарних послуг, щоб дізнатися, як використовується імʼя хосту).</td>
        </tr>
        <tr>
            <td colspan="2">--http-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>20s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тривалість між перевірками HTTP на наявність нових даних. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--image-credential-provider-bin-dir string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до теки, де знаходяться двійкові файли втулка постачальника облікових даних.</td>
        </tr>
        <tr>
            <td colspan="2">--image-credential-provider-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до конфігураційного файлу втулка постачальника облікових даних.</td>
        </tr>
        <tr>
            <td colspan="2">--image-gc-high-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 85</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Відсоток використання диска, після якого завжди виконується видалення непотрібних образів. Значення має бути в діапазоні [0, 100], щоб вимкнути збирання сміття, встановіть значення 100. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--image-gc-low-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 80</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Відсоток використання диска, до якого прибирання образів ніколи не виконується. Найменше використання диска, при якому проводиться збір сміття. Значення повинні бути в межах [0, 100] і не повинні перевищувати значення <code>--image-gc-high-threshold</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--image-service-endpoint string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Точка доступу до віддаленого сервісу образів. Якщо не вказано, стандартно буде така ж, як і у <code>--container-runtime-endpoint</code>. UNIX доменні сокети підтримуються в Linux, тоді як точки доступу `npipe` і `tcp` підтримуються у Windows. Приклади: <code>unix:///path/to/runtime.sock</code>, <code>npipe:////./pipe/runtime</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kernel-memcg-notification</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо увімкнено, kubelet буде інтегруватися з повідомленням memcg ядра для визначення, чи перевищено порогові значення пам’яті для виселення, замість періодичного опитування. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Сплеск, який буде використовуватися при спілкуванні з API сервером Kubernetes. Число має бути &gt;= 0. Якщо встановлено 0, буде використано стандартне значення (100). Не стосується пудьсу API подій та вузлів, для яких обмеження швидкості контролюється іншим набором прапорців. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>application/vnd.kubernetes.protobuf</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тип вмісту запитів, що надсилаються до apiserver. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kube-api-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">QPS, який буде використовуватися при спілкуванні з API сервером Kubernetes. Число має бути &gt;= 0. Якщо встановлено 0, буде використано стандартне значення (50). Не стосується пульсу API подій та вузлів, для яких обмеження швидкості контролюється іншим набором прапорців. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kube-reserved strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: &lt;None&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір пар <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (наприклад, &quot;<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>&quot;), які описують ресурси, зарезервовані для компонентів системи Kubernetes. В даний час підтримуються <code>cpu</code>, <code>memory</code> та локальне <code>ephemeral-storage</code> для кореневої файлової системи. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#kube-reserved">тут</a> для отримання додаткової інформації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kube-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>''</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Абсолютне імʼя верхнього рівня cgroup, яке використовується для управління компонентами Kubernetes, для яких ресурси обчислення були зарезервовані за допомогою прапорця <code>--kube-reserved</code>. Наприклад, &quot;<code>/kube-reserved</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу kubeconfig, що визначає, як підключитися до API сервера. Надання <code>--kubeconfig</code> увімкне режим API сервера, тоді як пропуск <code>--kubeconfig</code> увімкне автономний (standalone) режим. </td>
        </tr>
        <tr>
            <td colspan="2">--kubelet-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Необовʼязкове абсолютне імʼя cgroups для створення та запуску kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--local-storage-capacity-isolation&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо <code>true</code>, увімкнено ізоляцію локального тимчасового зберігання. Інакше функція ізоляції локального зберігання буде вимкнена. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--lock-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Попередження: Альфа функція&gt; Шлях до файлу, який kubelet використовуватиме як файл блокування.</td>
        </tr>
        <tr>
            <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>5s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість секунд між очищеннями логу.</td>
        </tr>
        <tr>
            <td colspan="2">--log-json-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>'0'</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">[Alpha] У форматі JSON з розділеними вихідними потоками інформаційні повідомлення можуть бути буферизовані на деякий час для підвищення продуктивності. Стандартне значення, що дорівнює нулю байтів, вимикає буферизацію. Розмір може бути вказаний у байтах (512), кратних 1000 (1K), кратних 1024 (2Ki) або степенях цих значень (3M, 4G, 5Mi, 6Gi). Щоб використовувати це, увімкніть функціональну можливість <code>LoggingAlphaOptions</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--log-json-split-stream</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">[Alpha] У форматі JSON помилки записуються у stderr, а інформаційні повідомлення — у stdout. Стандартно всі повідомлення записуються в один потік stdout. Щоб використовувати це, увімкніть функціональну можливість <code>LoggingAlphaOptions</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--log-text-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>'0'</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">[Alpha] У текстовому форматі з розділеними вихідними потоками інформаційні повідомлення можуть бути буферизовані на деякий час для підвищення продуктивності. Стандартне значення, що дорівнює нулю байтів, вимикає буферизацію. Розмір може бути вказаний у байтах (512), кратних 1000 (1K), кратних 1024 (2Ki) або степенях цих значень (3M, 4G, 5Mi, 6Gi). Щоб використовувати це, увімкніть функціональну можливість <code>LoggingAlphaOptions</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--log-text-split-stream</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">[Alpha] У текстовому форматі помилки записуються у stderr, а інформаційні повідомлення — у stdout. Стандартно всі повідомлення записуються в один потік stdout. Щоб використовувати це, увімкніть функціональну можливість <code>LoggingAlphaOptions</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>text</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Встановлює формат логу. Дозволені формати: &quot;<code>json</code>&quot; (контрольований <code>LoggingBetaOptions</code>, &quot;<code>text</code>&quot;). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--make-iptables-util-chains&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо значення істинне, kubelet забезпечить наявність правил утиліти <code>iptables</code> на хості. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--manifest-url string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">URL для доступу до додаткових специфікацій Pod, які потрібно запустити. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--manifest-url-header strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список HTTP-заголовків, розділених комами, які слід використовувати при доступі до URL, наданого параметру <code>--manifest-url</code>. Кілька заголовків з однаковою назвою будуть додані в тому ж порядку, в якому вони надані. Цей параметр можна використовувати кілька разів. Наприклад: <code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--max-open-files int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1000000</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Кількість файлів, які може відкрити процес kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--max-pods int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 110</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Кількість Podʼів, які можуть працювати на цьому kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--maximum-dead-containers int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість старих екземплярів контейнерів, які можна зберігати глобально. Кожен контейнер займає певний простір на диску. Щоб вимкнути, встановіть відʼємне число. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</td>
        </tr>
        <tr>
            <td colspan="2">--maximum-dead-containers-per-container int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість старих екземплярів, які потрібно зберігати для кожного контейнера. Кожен контейнер займає певний обсяг дискового простору. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</td>
        </tr>
        <tr>
            <td colspan="2">--memory-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>None</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Політика Memory Manager для використання. Можливі значення: &quot;<code>None</code>&quot;, &quot;<code>Static</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--minimum-container-ttl-duration duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Мінімальний вік для завершеного контейнера перед тим, як його буде прибрано. Приклади: &quot;<code>300ms</code>&quot;, &quot;<code>10s</code>&quot; або &quot;<code>2h45m</code>&quot;. (ЗАСТАРІЛО: Замість цього використовуйте <code>--eviction-hard</code> або <code>--eviction-soft</code>. Буде видалено в майбутніх версіях.)</td>
        </tr>
        <tr>
            <td colspan="2">--minimum-image-ttl-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>2m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Мінімальний вік для невикористаного образу перед тим, як його буде прибрано. Приклади: &quot;<code>300ms</code>&quot;, &quot;<code>10s</code>&quot; або &quot;<code>2h45m</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--node-ip string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">IP-адреса (або список IP-адрес для двох стеків, розділених комами) вузла. Якщо не встановлено, kubelet використовуватиме стандартну IPv4-адресу вузла, якщо така є, або його стандартну IPv6-адресу, якщо IPv4-адрес немає. Ви можете передати &quot;<code>::</code>&quot;, щоб віддати перевагу стандартній IPv6-адресі замість стандартної IPv4-адреси.</td>
        </tr>
        <tr>
            <td colspan="2">--node-labels &lt;пари key=value&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Попередження: Alpha функція&gt;Мітки для додавання під час реєстрації вузла в кластері. Мітки повинні бути у форматі <code>key=value</code>, розділені <code>','</code>. Мітки в просторі <code>'kubernetes.io'</code> повинні починатися з дозволеного префікса (<code>'kubelet.kubernetes.io'</code>, <code>'node.kubernetes.io'</code>) або бути в спеціально дозволеному наборі (<code>'beta.kubernetes.io/arch'</code>, <code>'beta.kubernetes.io/instance-type'</code>, <code>'beta.kubernetes.io/os'</code>, <code>'failure-domain.beta.kubernetes.io/region'</code>, <code>'failure-domain.beta.kubernetes.io/zone'</code>, <code>'kubernetes.io/arch'</code>, <code>'kubernetes.io/hostname'</code>, <code>'kubernetes.io/os'</code>, <code>'node.kubernetes.io/instance-type'</code>, <code>'topology.kubernetes.io/region'</code>, <code>'topology.kubernetes.io/zone'</code>).</td>
        </tr>
        <tr>
            <td colspan="2">--node-status-max-images int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість образів для показу в <code>node.status.images</code>. Якщо вказано <code>-1</code>, обмеження не буде застосовано. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>10s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Визначає, як часто kubelet сповіщає про статус вузла у майстер. <B>Примітка</B>: будьте обережні при зміні константи, вона повинна узгоджуватися з <code>nodeMonitorGracePeriod</code> в контролері вузлів. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -999</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Значення <code>oom-score-adj</code> для процесу kubelet. Значення повинні бути в межах від [-1000, 1000]. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--pod-cidr string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">CIDR для використання IP-адрес Pod, використовується тільки в автономному (standalone) режимі. У кластерному режимі це отримується від майстра. Для IPv6 максимальна кількість виділених IP-адрес складає 65536. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--pod-infra-container-image string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>registry.k8s.io/pause:3.10</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вказаний образ не буде видалений під час прибирання образів. Реалізації CRI мають власну конфігурацію для налаштування цього образу. (ЗАСТАРІЛО: буде видалено в 1.27. Прибирання образів буде отримувати інформацію про образи пісочниць з CRI.)</td>
        </tr>
        <tr>
            <td colspan="2">--pod-manifest-path string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до теки, що містить файли статичних Pod для запуску, або шлях до одного файлу статичного Pod. Файли, що починаються з крапки, будуть ігноруватися. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--pod-max-pids int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Встановлює максимальну кількість процесів на Pod. Якщо <code>-1</code>, kubelet стандартно використовує доступну на вузлі ємність PID. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--pods-per-core int32</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Кількість Podʼів на ядро, які можуть працювати на цьому kubelet. Загальна кількість Podʼів на цьому kubelet не може перевищувати <code>--max-pods</code>, тому буде використовуватися <code>--max-pods</code>, якщо цей розрахунок призведе до більшої кількості дозволених Podʼів на kubelet. Значення <code>0</code> вимикає це обмеження. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10250</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Порт, на якому kubelet буде обслуговувати запити. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--protect-kernel-defaults</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Стандартна поведінка kubelet для налаштування ядра. Якщо встановлено, kubelet видасть помилку, якщо будь-яке з налаштувань ядра відрізняється від стандартних значень kubelet. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--provider-id string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Унікальний ідентифікатор для ідентифікації вузла в базі даних машин, тобто у постачальника хмари.</td>
        </tr>
        <tr>
            <td colspan="2">--qos-reserved string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">&lt;Попередження: Alpha рівень&gt; Набір пар <code>&lt;resource name&gt;=&lt;percentage&gt;</code> (наприклад, &quot;<code>memory=50%</code>&quot;), які описують, як запити ресурсів Pod резервуються на рівні QoS. На даний момент підтримується тільки <code>memory</code>. Потрібно активувати функціональну можливість <code>QOSReserved</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--read-only-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10255</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Порт тільки для читання, на якому буде працювати kubelet без автентифікації/авторизації (для вимкнення встановіть <code>0</code>). (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--register-node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Зареєструйте вузол на сервері API. Якщо <code>--kubeconfig</code> не вказано, цей параметр не має значення, оскільки kubelet не матиме API-сервера для реєстрації. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--register-schedulable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Зареєструвати вузол як придатний для планування. Не матиме впливу, якщо <code>--register-node</code> має значення <code>false</code>. (ЗАСТАРІЛО: буде вилучено в майбутніх версіях)</td>
          </tr>
        <tr>
            <td colspan="2">--register-with-taints string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Реєструє вузол з наданим списком taints (розділених комами <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>). Нічого не робить, якщо <code>--register-node</code> має значення <code>false</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--registry-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальний розмір для сплеску завантажень, тимчасово дозволяє завантаженням досягати цієї кількості, не перевищуючи при цьому <code>--registry-qps</code>. Використовується тільки якщо <code>--registry-qps</code> більше 0. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--registry-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо &gt; 0, обмежити QPS для завантажень з реєстру до цього значення. Якщо <code>0</code>, без обмежень. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--reserved-cpus string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список CPU або діапазонів CPU, розділених комами, зарезервованих для системи та використання Kubernetes. Цей конкретний список переважатиме над кількістю CPU в <code>--system-reserved</code> та <code>--kube-reserved</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--reserved-memory string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список резервувань памʼяті для NUMA вузлів, розділених комами. (наприклад, &quot;<code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>&quot;). Загальна сума для кожного типу памʼяті повинна дорівнювати сумі <code>--kube-reserved</code>, <code>--system-reserved</code> та <code>--eviction-threshold</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">тут</a> для отримання додаткових відомостей. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--resolv-conf string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>/etc/resolv.conf</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Файл конфігурації резольвера, який використовується як основа для конфігурації DNS-резолюції контейнера. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--root-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>/var/lib/kubelet</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до теки для управління файлами kubelet (монтування томів тощо).</td>
        </tr>
        <tr>
            <td colspan="2">--rotate-certificates</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Виконувати автоматичну ротацію клієнтськіх сертифікатів kubelet, запитуючи нові сертифікати у <code>kube-apiserver</code>, коли термін дії сертифіката наближається до закінчення. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--rotate-server-certificates</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Автоматично запитувати та виконувати ротацію сертифікатів kubelet, запитуючи нові сертифікати у <code>kube-apiserver</code>, коли термін дії сертифіката наближається до закінчення. Потрібно активувати функціональну можливість <code>RotateKubeletServerCertificate</code> та схвалення поданих обʼєктів <code>CertificateSigningRequest</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--runonce</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо <code>true</code>, виходити після створення Podʼів з локальних маніфестів або віддалених URL. Взаємовиключно з <code>--enable-server</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--runtime-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Необовʼязкова абсолютна назва cgroups для створення та запуску середовища виконання.</td>
        </tr>
        <tr>
            <td colspan="2">--runtime-request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>2m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Тайм-аут для всіх запитів до середовища виконання, окрім довготривалих запитів — <code>pull</code>, <code>logs</code>, <code>exec</code> та <code>attach</code>. Коли тайм-аут перевищено, kubelet скасує запит, видасть помилку і спробує знову пізніше. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--seccomp-default</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вмикає використання <code>RuntimeDefault</code> як стандартного профілю seccomp для всіх навантажень.</td>
        </tr>
        <tr>
            <td colspan="2">--serialize-image-pulls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>true</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Витягує образи по одному. Рекомендується *не* змінювати стандартні значення на вузлах, які використовують демон Docker версії &lt; 1.9 або сховище <code>aufs</code>. Деталі дивіться в тікеті #10959. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--streaming-connection-idle-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>4h0m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальний час, протягом якого зʼєднання для потокового режиму може бути неактивним перед автоматичним закриттям зʼєднання. <code>0</code> вказує на відсутність тайм-ауту. Приклад: <code>5m</code>. Примітка: всі зʼєднання до сервера kubelet мають максимальну тривалість 4 години. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--sync-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>1m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальний проміжок часу між синхронізацією запущених контейнерів та конфігурацією. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--system-cgroups string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Необовʼязкова абсолютна назва cgroups, в якій слід розмістити всі процеси, що не є процесами ядра, що не знаходяться вже в cgroup під <code>'/'</code>. Пусто для відсутності контейнера. Для скасування прапорця потрібне перезавантаження. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--system-reserved string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: &lt;none&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір пар <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (наприклад, &quot;<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>&quot;), які описують ресурси, зарезервовані для не-Kubernetes компонентів. Наразі підтримуються тільки <code>cpu</code>, <code>memory</code> та локальне тимчасове сховище для кореневої файлової системи. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved">тут</a> для отримання додаткових відомостей. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--system-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>''</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Абсолютна назва cgroup найвищого рівня, яка використовується для управління не-Kubernetes компонентами, для яких ресурси були зарезервовані за допомогою прапорця <code>--system-reserved</code>. Наприклад, <code>/system-reserved</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--tls-cert-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Файл, що містить x509 сертифікат, використовується для обслуговування HTTPS (з проміжними сертифікатами, якщо такі є, конкатенованими після серверного сертифіката). Якщо <code>--tls-cert-file</code> та <code>--tls-private-key-file</code> не вказані, для публічної адреси генеруються самопідписані сертифікат і ключ, які зберігаються в теці, вказаній в <code>--cert-dir</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--tls-cipher-suites string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список наборів шифрів для сервера, розділений комами. Якщо не вказано, будуть використані стандартні набори шифрів Go.<br/>
            Рекомендовані значення:
            <code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>, <code>TLS_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_256_GCM_SHA384</code><br/><br/>
            Небезпечні значення:
            <code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_RC4_128_SHA</code>, <code>TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_RC4_128_SHA</code>, <code>TLS_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_RSA_WITH_RC4_128_SHA</code>.<br/><br/>
            (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--tls-min-version string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Minimum TLS version supported. Possible values: &quot;<code>VersionTLS10</code>&quot;, &quot;<code>VersionTLS11</code>&quot;, &quot;<code>VersionTLS12</code>&quot;, &quot;<code>VersionTLS13</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--tls-private-key-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Файл, що містить приватний ключ x509, що відповідає <code>--tls-cert-file</code>. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>'none'</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Політика Topology Manager для використання. Можливі значення: &quot;<code>none</code>&quot;, &quot;<code>best-effort</code>&quot;, &quot;<code>restricted</code>&quot;, &quot;<code>single-numa-node</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-policy-options string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Набір параметрів політики Topology Manager у форматі &lt;key&gt;=&lt;value&gt;, які можна використовувати для тонкого налаштування їх поведінки. Якщо не вказані, зберігається стандартна поведінка. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--topology-manager-scope string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>container</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Область, до якої застосовуються топологічні підказки. Topology Manager збирає підказки від постачальників підказок і застосовує їх до визначеної області для забезпечення допуску Pod. Можливі значення: &quot;<code>container</code>&quot;, &quot;<code>pod</code>&quot;. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">-v, --v Level</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Число для рівня детальності логу</td>
        </tr>
        <tr>
            <td colspan="2">--version version[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Виводить інформацію про версію та виходить; <code>--version=vX.Y.Z...</code> задає відображену версію.</td>
        </tr>
        <tr>
            <td colspan="2">--vmodule &lt;A list of 'pattern=N' strings&gt;</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Список налаштувань <code>pattern=N</code>, розділених комами, для фільтрованого логування файлів (працює тільки для текстового формату логу).</td>
        </tr>
        <tr>
            <td colspan="2">--volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Повний шлях до теки, в якій слід шукати додаткові втулки томів від сторонніх постачальників. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
        <tr>
            <td colspan="2">--volume-stats-agg-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: <code>1m0s</code></td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Вказує інтервал, через який kubelet обчислює та кешує використання диска томів для всіх Podʼів і томів. Щоб вимкнути обчислення томів, встановіть від’ємне число. (ЗАСТАРІЛО: Цей параметр слід налаштовувати через файл конфігурації, вказаний прапорцем kubelet <code>--config</code>. Дивіться <a href="/uk/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> для отримання додаткової інформації.)</td>
        </tr>
    </tbody>
</table>
