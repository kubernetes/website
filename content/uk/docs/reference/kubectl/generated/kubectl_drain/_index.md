---
title: kubectl drain
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Очищує вузол для підготовки до обслуговування.

Зазначений вузол будо позначено, як не придатний для розміщення робочих навантажень для запобігання створенню нових Podʼів на ньому. 'drain' виселяє Podʼи, якщо API сервер підтримує [розлади](/docs/concepts/workloads/pods/disruptions/) або [виселення](/docs/concepts/scheduling-eviction/#pod-disruption). В іншому випадку він використовує звичайний DELETE, щоб видалити Podʼи. 'drain' виселяє або видаляє всі Podʼи, окрім дзеркальних Podʼів (які не можна видалити за допомогою API сервера). Якщо це самокерований Pod демона, drain не спрацює, якщо немає `--ignore-daemonsets`, і Pod не буде видалено, бо такі Podʼи будуть негайно замінені новими контролером DaemonSet, який не звертає уваги на позначку unschedulable. Якщо є якісь Podʼи, які не є дзеркальними Podʼами, і які не керуються контролером реплікації, replica set, daemon set, stateful set, або job то drain не видалить жодного Pod, якщо ви не скористаєтеся опцією `--force`. `--force` також дозволить продовжити видалення, якщо відсутній керуючий ресурс одного або декількох Podʼів.

'drain' чекає на коректне завершення. Ви не повинні працювати на машині, поки команда не завершиться.

Коли ви будете готові повернути вузол до експлуатації, скористайтеся командою `kubectl uncordon`, яка зробить вузол знову доступним для планування.

![kubectl drain](/images/docs/kubectl_drain.svg)

```shell
kubectl drain NODE
```

## {{% heading "examples" %}}

```shell
# Спорожнити вузол "foo", навіть якщо на ньому є Podʼи, які не керуються контролером реплікації, replica set, job, daemon set або stateful set
kubectl drain foo --force

# Як вище, але перервати, якщо наявні Podʼи, які не керуються контролером реплікації, replica set, job, daemon set або stateful set, і використовувати пільговий період у 15 хвилин
kubectl drain foo --grace-period=900
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--chunk-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 500</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Повертати великі списки частинами, а не всі одразу. Для вимкнення задайте 0.</p></td>
        </tr>
        <tr>
            <td colspan="2">--delete-emptydir-data</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Продовжувати, навіть якщо є Podʼи, що використовують emptyDir (локальні дані, які буде видалено, коли вузол буде спорожнено).</p></td>
        </tr>
        <tr>
            <td colspan="2">--disable-eviction</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Примусово виводити ресурси за допомогою delete, навіть якщо підтримується виселення. Це дозволить обійти перевірку PodDisruptionBudgets, використовуйте з обережністю.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Має бути &quot;none&quot;, &quot;server&quot; або &quot;client&quot;. Якщо це стратегія client, вивести лише обʼєкт, який міг би бути надісланим, не надсилаючи його. Якщо це стратегія server, надіслати запит на стороні сервера без збереження ресурсу.</p></td>
        </tr>
        <tr>
            <td colspan="2">--force</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Продовжувати, навіть якщо є Podʼи, які не задекларували контролер.</p></td>
        </tr>
        <tr>
            <td colspan="2">--grace-period int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Період часу в секундах, який дається ресурсу для належного завершення роботи. Якщо значення відʼємне, то буде використано стандартне значення, вказане у Pod.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка drain</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-daemonsets</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Ігнорувати Podʼи керовані DaemonSet.</p></td>
        </tr>
        <tr>
            <td colspan="2">--pod-selector string</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Селектор міток для фільтрування Podʼів на вузлі</p></td>
        </tr>
        <tr>
            <td colspan="2">-l, --selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор (запит на мітки) для фільтрації, що підтримує '=', '==', '!=', 'in', 'notin' (наприклад, -l key1=value1,key2=value2,key3 in (value3)). Обʼєкти, щоб мати збіг, повинні задовольняти усім зазначеним обмеженням міток.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-wait-for-delete-timeout int</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо хначення DeletionTimestamp Podʼа старіще за N секунд, пропускати очікування Podʼа. Значення секунд має бути більще за 0, щоб його оминути.</p></td>
        </tr>
        <tr>
            <td colspan="2">--timeout duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед прийнятям рішення про відмову видалення, нуль означає нескіченно</p></td>
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
