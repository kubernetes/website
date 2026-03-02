---
title: kubectl delete
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Видалення ресурсів за іменами файлів, stdin, ресурсами та іменами, або за ресурсами та селекторами міток.

Приймаються формати JSON та YAML. Можна вказати лише один тип аргументів: імена файлів, ресурси та імена, або ресурси та селектори міток.

Деякі ресурси, такі як Podʼи, підтримують належне видалення. Ці ресурси визначають стандартний період перед примусовим завершенням (пільговий період), але ви можете змінити це значення за допомогою прапорця `--grace-period` або передати `--now`, щоб встановити пільговий період на 1. Оскільки ці ресурси часто представляють сутності в кластері, видалення може не бути підтверджене одразу. Якщо вузол, який хостить Pod, відключений або не може досягти API-сервера, завершення може зайняти значно більше часу, ніж пільговий період. Щоб примусово видалити ресурс, ви повинні вказати прапорець `--force`. Примітка: лише підмножина ресурсів підтримує належне видалення. За відсутності підтримки, прапорець `--grace-period` ігнорується.

ВАЖЛИВО: Примусове видалення Podʼів не чекає підтвердження, що процеси Podʼа завершені, що може залишити ці процеси запущеними, поки вузол не виявить видалення та не завершить належне видалення. Якщо ваші процеси використовують спільне сховище або звертаються до віддаленого API та залежать від імені Podʼа для ідентифікації, примусове видалення цих Podʼів може призвести до запуску кількох процесів на різних машинах з однаковою ідентифікацією, що може призвести до пошкодження даних або неконсистентності. Примусово видаляйте Pod лише коли ви впевнені, що Pod завершено, або якщо ваш застосунок може витримати кілька копій одного Podʼа, які працюють одночасно. Також, якщо ви примусово видаляєте Pod, планувальник може розмістити нові Pod на цих вузлах до того, як вузол звільнить ці ресурси, що спричинить негайне виселення цих Podʼів.

Зверніть увагу, що команда delete НЕ перевіряє версію ресурсу, тому якщо хтось подасть оновлення ресурсу в той момент, коли ви подасте команду delete, їхнє оновлення буде втрачено разом з рештою ресурсу.

Після видалення CustomResourceDefinition інвалідація кешу виявлення може тривати до 6 годин. Якщо ви не хочете чекати, можливо, варто запустити "kubectl api-resources", щоб оновити кеш виявлення.

```shell
kubectl delete ([-f FILENAME] | [-k DIRECTORY] | TYPE [(NAME | -l label | --all)])
```

## {{% heading "examples" %}}

```shell
# Видалити Pod, використовуючи тип та імʼя, вказані в pod.json
kubectl delete -f ./pod.json

# Видалити ресурси з теки, що містить kustomization.yaml — наприклад, dir/kustomization.yaml
kubectl delete -k dir

# Видалити ресурси з усіх файлів, що закінчуються на '.json'
kubectl delete -f '*.json'

# Видалити Pod на основі типу та імені в JSON, переданому в stdin
cat pod.json | kubectl delete -f -

# Видалити Podʼи та сервіси з іменами "baz" та "foo"
kubectl delete pod,service baz foo

# Видалити Podʼи та сервіси з міткою name=myLabel
kubectl delete pods,services -l name=myLabel

# Видалити Pod з мінімальною затримкою
kubectl delete pod foo --now

# Примусово видалити Pod на мертвому вузлі
kubectl delete pod foo --force

# Видалити всі Podʼи
kubectl delete pods --all

# Видаляє всі Podʼи, тільки якщо користувач підтвердить видалення
kubectl delete pods --all --interactive
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вилучити всі ресурси у просторі імен вказаних типів ресурсів.</p></td>
        </tr>
        <tr>
            <td colspan="2">-A, --all-namespaces</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, показати список запитуваних обʼєктів у всіх просторах назв. Простір імен у поточному контексті ігнорується, навіть якщо вказано --namespace.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cascade string[="background"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "background"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;background&quot;, &quot;orphan&quot; або &quot;foreground&quot;. Вибирає стратегію каскадного видалення для залежних елементів (наприклад, Podʼів, створених Replication Controller). Стандартне значення — background.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;none&quot;, &quot;server&quot; або &quot;client&quot;. Якщо це стратегія client, вивести лише обʼєкт, який міг би бути надісланим, не надсилаючи його. Якщо це стратегія server, надіслати запит на стороні сервера без збереження ресурсу.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>містить ресурс, який потрібно видалити.</p></td>
        </tr>
        <tr>
            <td colspan="2">--force</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, негайно видалити ресурси з API і оминути процедуру належного видалення. Зверніть увагу, що негайне видалення деяких ресурсів може призвести до неузгодженості або втрати даних і потребує підтвердження.</p></td>
        </tr>
        <tr>
            <td colspan="2">--grace-period int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Період часу в секундах, який дається ресурсу для належного завершення роботи. Ігнорується, якщо значення відʼємне. Встановлюється у 1 для негайного завершення роботи. Може бути встановлене у 0, тільки якщо --force має значення true (примусове видалення).</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка delete</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-not-found</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вважати &quot;resource not found&quot; за успішне видалення. Стандартно дорівнює &quot;true&quot;, якщо вказано --all.</p></td>
        </tr>
        <tr>
            <td colspan="2">-i, --interactive</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, видаляти ресурс тільки після підтвердження користувача.</p></td>
        </tr>
        <tr>
            <td colspan="2">-k, --kustomize string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Обробити теку kustomization. Цей прапорець не можна використовувати разом з -f або -R.</p></td>
        </tr>
        <tr>
            <td colspan="2">--now</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, ресурсам дається сигнал про негайне припинення роботи (так само, як і --grace-period=1).</p></td>
        </tr>
        <tr>
            <td colspan="2">-o, --output string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Режим виводу. Використовуйте &quot;-o name&quot; для скороченого виводду (resource/name).</p></td>
        </tr>
        <tr>
            <td colspan="2">--raw string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необроблений URI для DELETE на сервер.  Використовує транспорт, вказаний у файлі kubeconfig.</p></td>
        </tr>
        <tr>
            <td colspan="2">-R, --recursive</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рекурсивно обробити теку, вказану у -f, --filename. Корисно, якщо ви хочете керувати повʼязаними маніфестами, організованими в одній теці.</p></td>
        </tr>
        <tr>
            <td colspan="2">-l, --selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор (запит на мітки) для фільтрації, що підтримує '=', '==', '!=', 'in', 'notin' (наприклад, -l key1=value1,key2=value2,key3 in (value3)). Обʼєкти, щоб мати збіг, повинні задовольняти усім зазначеним обмеженням міток.</p></td>
        </tr>
        <tr>
            <td colspan="2">--timeout duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед прийнятям рішення про відмову видалення, нуль означає визначення таймауту залежно від розміру обʼєкта</p></td>
        </tr>
        <tr>
            <td colspan="2">--wait&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
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
