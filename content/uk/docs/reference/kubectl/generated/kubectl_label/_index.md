---
title: kubectl label
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Оновлює мітки ресурсів.

* Ключ і значення мітки повинні починатися з літери або цифри і можуть містити літери, цифри, дефіси, крапки і підкреслення, до 63 символів кожна.
* За бажанням, ключ може починатися з префікса субдомену DNS і одного символу "/", наприклад, example.com/my-app.
* Якщо `--overwrite` має значення true, то наявні мітки можна перезаписати, інакше спроба перезаписати мітку призведе до помилки.
* Якщо вказано `--resource-version`, то під час оновлення буде використано цю версію ресурсу, інакше буде використано наявну версію ресурсу.

```shell
kubectl label [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]
```

## {{% heading "examples" %}}

```shell
# Оновити pod 'foo' міткою 'unhealthy' і значенням 'true'
kubectl label pods foo unhealthy=true

# Оновити pod 'foo' міткою 'status' і значенням 'unhealthy', замінивши будь-яке існуюче значення
kubectl label --overwrite pods foo status=unhealthy

# Оновити всі pods у просторі назв
kubectl label pods --all status=unhealthy

# Оновити pod, визначений за типом та назвою у файлі "pod.json"
kubectl label -f pod.json status=unhealthy

# Оновлювати pod 'foo' тільки якщо ресурс не змінився з версії 1
kubectl label pods foo status=unhealthy --resource-version=1

# Оновити pod 'foo', видаливши мітку з назвою 'bar', якщо вона існує
# Не потребує прапорця --overwrite
kubectl label pods foo bar-
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--all</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вибрати всі ресурси у просторі імен вказаних типів ресурсів.</p></td>
        </tr>
        <tr>
            <td colspan="2">-A, --all-namespaces</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, перевірити вказану дію в усіх просторах імен.</p></td>
        </tr>
        <tr>
            <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, ігнорувати будь-які помилки в шаблонах, коли в шаблоні відсутнє поле або ключ map. Застосовується лише до форматів виводу golang та jsonpath.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;none&quot;, &quot;server&quot; або &quot;client&quot;. Якщо це стратегія client, вивести лише обʼєкт, який міг би бути надісланим, не надсилаючи його. Якщо це стратегія server, надіслати запит на стороні сервера без збереження ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kubectl-label"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя менеджера, що використовується для відстеження права власності на поле.</p></td>
        </tr>
        <tr>
            <td colspan="2">--field-selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор (запит поля) для фільтрації підтримує '=', '==' і '!=' (наприклад, --field-selector key1=value1,key2=value2). Сервер підтримує лише обмежену кількість запитів до полів кожного типу.</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --filename strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, теки або URL до файлів, яки визначають ресурс, для оновлення міток.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка label</p></td>
        </tr>
        <tr>
            <td colspan="2">-k, --kustomize string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Обробити теку kustomization. Цей прапорець не можна використовувати разом з -f або -R.</p></td>
        </tr>
        <tr>
            <td colspan="2">--list</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, показувати мітки для даного ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--local</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, мітка НЕ буде звертатися до api-server, а виконуватиметься локально.</p></td>
        </tr>
        <tr>
            <td colspan="2">-o, --output string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Формат виводу. Один з: (json, yaml, kyaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</p></td>
        </tr>
        <tr>
            <td colspan="2">--overwrite</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, дозволити перезапис міток, інакше відхиляти оновлення міток, які перезаписують наявні мітки.</p></td>
        </tr>
        <tr>
            <td colspan="2">-R, --recursive</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рекурсивно обробити теку, вказану у -f, --filename. Корисно, якщо ви хочете керувати повʼязаними маніфестами, організованими в одній теці.</p></td>
        </tr>
        <tr>
            <td colspan="2">--resource-version string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення не порожнє, оновлення мітки буде успішним, тільки якщо це поточна версія ресурсу для обʼєкта. Дійсно лише при зазначенні одного ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">-l, --selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор (запит на мітки) для фільтрації, що підтримує '=', '==', '!=', 'in', 'notin' (наприклад, -l key1=value1,key2=value2,key3 in (value3)). Обʼєкти, щоб мати збіг, повинні задовольняти усім зазначеним обмеженням міток.</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-managed-fields</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, зберігати managedFields при виводі обʼєктів у форматі JSON або YAML.</p></td>
        </tr>
        <tr>
            <td colspan="2">--template string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рядок шаблону або шлях до файлу шаблону для використання з -o=go-template, -o=go-template-file. Формат шаблону — golang-шаблони [http://golang.org/pkg/text/template/#pkg-overview].</p></td>
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
