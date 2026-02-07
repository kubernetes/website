---
title: kubectl expose
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Експонувати ресурс як нову службу Kubernetes.

Шукає deployment, service, replica set, replica controller або pod за назвою і використовує селектор для цього ресурсу як селектор для нового service на зазначеному порту. Deployment або replica set буде показано як сервіс, лише якщо його селектор буде перетворено на селектор, який підтримується сервісом, тобто коли селектор містить лише компонент matchLabels. Зауважте, що якщо за допомогою `--port` не вказано жодного порту, а експонований ресурс має декілька портів, усі вони будуть використані новим сервісом повторно. Також, якщо не вказано жодних міток, новий сервіс повторно використає мітки з ресурсу, який він відкриває.

Можливі ресурси включають (без урахування регістру):

pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)

```shell
kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

## {{% heading "examples" %}}

```shell
# Створити сервіс для реплікованого nginx, який працює на порту 80 та підключається до контейнерів на порту 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Створити сервіс для контролера реплікації, визначеного типом та іменем у "nginx-controller.yaml", який працює на порту 80 та підключається до контейнерів на порту 8000
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000

# Створити сервіс для Pod valid-pod, який працює на порту 444 з іменем "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# Створити другий сервіс на основі вищезгаданого сервісу, відкриваючи контейнерний порт 8443 як порт 443 з іменем "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https

# Створити сервіс для реплікованого стрімінгового застосунку на порту 4100, балансуючи UDP-трафік, з імʼям 'video-stream'
kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream

# Створити сервіс для реплікованого nginx за допомогою replica set, який працює на порту 80 та підключається до контейнерів на порту 8000
kubectl expose rs nginx --port=80 --target-port=8000

# Створити сервіс для deployment nginx, який працює на порту 80 та підключається до контейнерів на порту 8000
kubectl expose deployment nginx --port=80 --target-port=8000
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, ігнорувати будь-які помилки в шаблонах, коли в шаблоні відсутнє поле або ключ map. Застосовується лише до форматів виводу golang та jsonpath.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cluster-ip string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>ClusterIP, який буде призначено сервісу. Залиште порожнім для автоматичного призначення або встановіть значення "None", щоб створити сервіс headless.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;none&quot;, &quot;server&quot; або &quot;client&quot;. Якщо це стратегія client, вивести лише обʼєкт, який міг би бути надісланим, не надсилаючи його. Якщо це стратегія server, надіслати запит на стороні сервера без збереження ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--external-ip string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додаткова зовнішня IP-адреса (не керована Kubernetes), яку буде використано для сервісу. Якщо цю IP-адресу перенаправлено на вузол, до сервісу можна отримати доступ з цієї IP-адреси на додачу до згенерованої IP-адреси сервісу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kubectl-expose"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя менеджера, що використовується для відстеження права власності на поле.</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --filename strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, теки або URL до файлів, яки визначають ресурс, для експонування сервісу</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка expose</p></td>
        </tr>
        <tr>
            <td colspan="2">-k, --kustomize string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Обробити теку kustomization. Цей прапорець не можна використовувати разом з -f або -R.</p></td>
        </tr>
        <tr>
            <td colspan="2">-l, --labels string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мітки, які будуть застосовані до сервісу, створеного цим викликом.</p></td>
        </tr>
        <tr>
            <td colspan="2">--load-balancer-ip string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>IP для призначення LoadBalancer. Якщо поле порожнє, буде створено та використано ефемерний IP (залежить від хмарного провайдера).</p></td>
        </tr>
        <tr>
            <td colspan="2">--name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя для новоствореного обʼєкта.</p></td>
        </tr>
        <tr>
            <td colspan="2">-o, --output string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Формат виводу. Один з: (json, yaml, kyaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</p></td>
        </tr>
        <tr>
            <td colspan="2">--override-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "merge"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Метод, який використовується для перевизначення згенерованого обʼєкта: json, merge або strategic.</p></td>
        </tr>
        <tr>
            <td colspan="2">--overrides string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вбудоване перевизначення JSON для згенерованого обʼєкта. Якщо він не порожній, то використовується для перевизначення згенерованого обʼєкта. Вимагає, щоб обʼєкт надавав дійсне поле apiVersion.</p></td>
        </tr>
        <tr>
            <td colspan="2">--port string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, на якому має працювати сервіс. Копіюється з ресурсу, що експонується, якщо не вказано</p></td>
        </tr>
        <tr>
            <td colspan="2">--protocol string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мережевий протокол для сервісу, який буде створено. Стандартно — "TCP".</p></td>
        </tr>
        <tr>
            <td colspan="2">-R, --recursive</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рекурсивно обробити теку, вказану у -f, --filename. Корисно, якщо ви хочете керувати повʼязаними маніфестами, організованими в одній теці.</p></td>
        </tr>
        <tr>
            <td colspan="2">--save-config</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, конфігурація поточного обʼєкта буде збережена в його анотації. В іншому випадку, анотацію буде збережено без змін. Цей прапорець корисно встановити, якщо ви хочете застосувати kubectl до цього обʼєкта у майбутньому.</p></td>
        </tr>
        <tr>
            <td colspan="2">--selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор міток, який потрібно використовувати для цього сервісу. Підтримуються лише вимоги до селектора на основі рівності. Якщо порожньо (стандартно), виводитиметься селектор з експонованого ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--session-affinity</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо не порожньо, встановлює сесійну подібнітсть для сервісу. Допустимі значення: None, ClientIP.</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-managed-fields</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, зберігати managedFields при виводі обʼєктів у форматі JSON або YAML.</p></td>
        </tr>
        <tr>
            <td colspan="2">--target-port string</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва або номер порту в контейнері, на який сервіс повинен спрямовувати трафік. Необовʼязково.</p></td>
        </tr>
        <tr>
            <td colspan="2">--template string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рядок шаблону або шлях до файлу шаблону для використання з -o=go-template, -o=go-template-file. Формат шаблону — golang-шаблони [http://golang.org/pkg/text/template/#pkg-overview].</p></td>
        </tr>
        <tr>
            <td colspan="2">--type string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тип сервісу: ClusterIP, NodePort, LoadBalancer або ExternalName. Стандартно використовується 'ClusterIP'.</p></td>
        </tr>
    </tbody>
</table>

## {{% heading "parentoptions" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--as string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача, яке використовується для виконання операції. Користувач може бути звичайним користувачем або службовим обліковим записом в просторі імен.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-group strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Група, яка використовується для операції; цей прапорець можна повторити для вказівки декількох груп.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-uid string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>UID, який використовується для операції.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-user-extra strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові параметри користувача, які слід використовувати для операції. Цей прапорець можна повторювати, щоб вказати кілька значень для одного і того ж ключа.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "$HOME/.kube/cache"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Типове розташування теки кешу</p></td>
        </tr>
        <tr>
            <td colspan="2">--certificate-authority string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу сертифіката для центра сертифікації</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-certificate string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського сертифіката для TLS</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-key string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу ключа клієнта для TLS</p></td>
        </tr>
        <tr>
            <td colspan="2">--cluster string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва файлу kubeconfig кластера, який слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--context string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва контексту kubeconfig, який слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--disable-compression</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, відмовляється від стиснення відповіді для всіх запитів до сервера</p></td>
        </tr>
        <tr>
            <td colspan="2">--insecure-skip-tls-verify</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, сертифікат сервера не буде перевірятися на дійсність. Це зробить ваші HTTPS-зʼєднання небезпечними</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig, який слід використовувати для CLI-запитів.</p></td>
        </tr>
        <tr>
            <td colspan="2">--kuberc string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kuberc, який буде використовуватися для налаштувань. Цю функцію можна вимкнути, експортувавши функцію KUBECTL_KUBERC=false або вимкнувши функцію KUBERC=off.</p></td>
        </tr>
        <tr>
            <td colspan="2">--match-server-version</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вимагає, щоб версія сервера відповідала версії клієнта</p></td>
        </tr>
        <tr>
            <td colspan="2">-n, --namespace string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо присутній, простір імен для цього CLI-запиту</p></td>
        </tr>
        <tr>
            <td colspan="2">--password string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пароль для базової автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя профілю для захоплення. Одне із (none|cpu|heap|goroutine|threadcreate|block|mutex|trace)</p></td>
        </tr>
        <tr>
            <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "profile.pprof"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, в який записується профіль</p></td>
        </tr>
        <tr>
            <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "0"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед відмовою у виконанні окремого запиту до сервера. Ненульові значення повинні містити відповідну одиницю часу (наприклад, 1s, 2m, 3h). Значення нуль означає відсутність тайм-ауту запитів.</p></td>
        </tr>
        <tr>
            <td colspan="2">-s, --server string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Адреса та порт сервера API Kubernetes</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Записи в драйвері зберігання будуть буферизовані на цей час і збережені в бекендах без памʼяті як одна транзакція</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "cadvisor"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "localhost:8086"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Хост:порт бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "root"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пароль бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-secure</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>використовувати захищене зʼєднання з базою даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "stats"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва таблиці</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "root"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-server-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя сервера, яке використовується для перевірки дійсності сертифіката сервера. Якщо воно не надане, використовується імʼя хоста, яке використовується для звʼязку з сервером</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Токен на предʼявника для автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--user string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача kubeconfig, яке слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--username string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача для базової автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--version version[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та завершує роботу; --version=vX.Y.Z... задає відповідну версію</p></td>
        </tr>
        <tr>
            <td colspan="2">--warnings-as-errors</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Трактувати попередження, отримані від сервера, як помилки і виходити з ненульовим кодом виходу</p></td>
        </tr>
    </tbody>
</table>

## {{% heading "seealso" %}}

* [kubectl](../kubectl/) — kubectl керує менеджером кластерів Kubernetes
