---
title: kubectl run
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Створити та запустити певний образ у Pod.

```shell
kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server|client] [--overrides=inline-json] [--command] -- [COMMAND] [args...]
```

## {{% heading "examples" %}}

```shell
# Запустити pod nginx
kubectl run nginx --image=nginx

# Запустити pod hazelcast і дозволити контейнеру відкривати порт 5701
kubectl run hazelcast --image=hazelcast/hazelcast --port=5701

# Запустити pod hazelcast і встановити змінні середовища "DNS_DOMAIN=cluster" та "POD_NAMESPACE=default" у контейнері
kubectl run hazelcast --image=hazelcast/hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"

# Запустити pod hazelcast і встановити мітки "app=hazelcast" та "env=prod" у контейнері
kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"

# Імітація запуску; вивести відповідні обʼєкти API без їх створення
kubectl run nginx --image=nginx --dry-run=client

# Запустити pod nginx, але перевантажити spec частковим набором значень, розібраних з JSON
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'

# Запустити pod busybox і тримати його на передньому плані, не перезапускати його, якщо він завершиться
kubectl run -i -t busybox --image=busybox --restart=Never

# Запустити pod nginx, використовуючи стандартну команду, але використовуючи власні аргументи (arg1 .. argN) для цієї команди
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>

# Запустити pod nginx, використовуючи іншу команду та власні аргументи
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
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
            <td colspan="2">--annotations strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Анотації для застосування до pod.</p></td>
        </tr>
        <tr>
            <td colspan="2">--attach</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, дочекайтеся запуску Pod, а потім приєднайтеся до нього так, ніби було викликано команду 'kubectl attach ...'.  Стандартно має значення false, якщо не задано параметр '-i/--stdin', у цьому випадку значення буде true. За допомогою '--restart=Never' повертається код завершення процесу контейнера.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cascade string[="background"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "background"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;background&quot;, &quot;orphan&quot; або &quot;foreground&quot;. Вибирає стратегію каскадного видалення для залежних елементів (наприклад, Pods, створених ReplicationController). Стандартно — background.</p></td>
        </tr>
        <tr>
            <td colspan="2">--command</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо присутні істинні та додаткові аргументи, використовуйте їх як поле 'command' у контейнері, а не поле 'args', яке використовується стандартно.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;none&quot;, &quot;server&quot; або &quot;client&quot;. Якщо це стратегія client, вивести лише обʼєкт, який міг би бути надісланим, не надсилаючи його. Якщо це стратегія server, надіслати запит на стороні сервера без збереження ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--env strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Змінні оточення для установки в контейнері.</p></td>
        </tr>
        <tr>
            <td colspan="2">--expose --port</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, створить сервіс ClusterIP, асоційований з podʼом.  Потрібен --port.</p></td>
        </tr>
        <tr>
            <td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kubectl-run"</td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>імʼя файлу для заміни ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--force</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, негайно видалити ресурси з API і обійти належне видалення. Зверніть увагу, що негайне видалення деяких ресурсів може призвести до неузгодженості або втрати даних і потребує підтвердження.</p></td>
        </tr>
        <tr>
            <td colspan="2">--grace-period int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Період часу в секундах, який дається ресурсу для належного завершення роботи. Ігнорується, якщо значення відʼємне. Встановлюється у 1 для негайного завершення роботи. Може бути встановлено у 0, тільки якщо --force має значення true (примусове видалення).</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка run</p></td>
        </tr>
        <tr>
            <td colspan="2">--image string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва образу контейнера для запуску.</p></td>
        </tr>
        <tr>
            <td colspan="2">--image-pull-policy string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика отримання образів для контейнера. Якщо залишити порожнім, це значення не буде вказано клієнтом і буде використано сервером стандартна поведінка.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Мітки через кому для застосування до pod. Перевизначить попередні значення.</p></td>
        </tr>
        <tr>
            <td colspan="2">--leave-stdin-open</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо pod запущено в інтерактивному режимі або за допомогою stdin, залиште stdin відкритим після завершення першого приєднання. Типово, stdin буде закрито після завершення першого приєднання.</p></td>
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
            <td colspan="2">--pod-running-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість часу (наприклад, 5s, 2m або 3h, більше нуля) для очікування, поки не запрацює хоча б один Pod</p></td>
        </tr>
        <tr>
            <td colspan="2">--port string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, який експонує цей контейнер.</p></td>
        </tr>
        <tr>
            <td colspan="2">--privileged</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, запустити контейнер у привілейованому режимі.</p></td>
        </tr>
        <tr>
            <td colspan="2">-q, --quiet</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, не виводити повідомлення.</p></td>
        </tr>
        <tr>
            <td colspan="2">-R, --recursive</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рекурсивно обробити теку, вказану у -f, --filename. Корисно, якщо ви хочете керувати повʼязаними маніфестами, організованими в одній теці.</p></td>
        </tr>
        <tr>
            <td colspan="2">--restart string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "Always"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика перезапуску Pod. Підтримувані значення: [Always, OnFailure, Never]</p></td>
        </tr>
        <tr>
            <td colspan="2">--rm</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, видалити pod після його виходу.  Діє лише при приєднанні до контейнера, наприклад, за допомогою '--attach' або '-i/--stdin'.</p></td>
        </tr>
        <tr>
            <td colspan="2">--save-config</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, конфігурація поточного обʼєкта буде збережена в його анотації. В іншому випадку, анотацію буде збережено без змін. Цей прапорець корисно встановити, якщо ви хочете застосувати kubectl до цього обʼєкта у майбутньому.</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-managed-fields</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, зберігати managedFields при виводі обʼєктів у форматі JSON або YAML.</p></td>
        </tr>
        <tr>
            <td colspan="2">-i, --stdin</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Залишати stdin відкритим на контейнері в pod, навіть якщо до нього нічого не приєднано.</p></td>
        </tr>
        <tr>
            <td colspan="2">--template string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рядок шаблону або шлях до файлу шаблону для використання з -o=go-template, -o=go-template-file. Формат шаблону — golang-шаблони [http://golang.org/pkg/text/template/#pkg-overview].</p></td>
        </tr>
        <tr>
            <td colspan="2">--timeout duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед прийнятям рішення про відмову видалення, нуль означає визначення таймауту залежно від розміру обʼєкта</p></td>
        </tr>
        <tr>
            <td colspan="2">-t, --tty</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Призначити TTY для контейнера в pod.</p></td>
        </tr>
        <tr>
            <td colspan="2">--wait</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, очікувати, поки ресурси зникнуть, перш ніж повернутися.  Очікує фіналізаторів.</p></td>
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
