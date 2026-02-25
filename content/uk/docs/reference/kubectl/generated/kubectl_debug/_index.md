---
title: kubectl debug
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Налагодження ресурсів кластера за допомогою інтерактивних контейнерів налагодження.

'debug' автоматизує виконання поширених завдань налагодження для обʼєктів кластера, ідентифікованих за ресурсом та імʼям. Типово будуть використовуватися Podʼи, якщо ресурс не вказано.

Дія, яку виконує 'debug', залежить від вказаного ресурсу. Підтримувані дії включають:

* Workload: Створити копію поточного Podʼа зі зміненими атрибутами, наприклад, змінити теґ образу на нову версію.
* Workload: Додати ефемерний контейнер до вже працюючого Podʼа, наприклад, щоб додати утиліти для налагодження без перезапуску Podʼа.
* Node: Створити новий Pod, який працює у host namespaces вузла та має доступ до файлової системи вузла.

Примітка: Коли для всього цільового Pod налаштовано користувача без прав root, деякі можливості, надані профілем налагодження, можуть не працювати.

```shell
kubectl debug (POD | TYPE[[.VERSION].GROUP]/NAME) [ -- COMMAND [args...] ]
```

## {{% heading "examples" %}}

```shell
# Створити інтерактивну сесію налагодження в Pod mypod та одразу приєднатися до неї.
kubectl debug mypod -it --image=busybox

# Створити інтерактивну сесію налагодження для Pod з файлу pod.yaml та одразу приєднатися до неї.
# (вимагає увімкнення функції EphemeralContainers в кластері)
kubectl debug -f pod.yaml -it --image=busybox

# Створити контейнер налагодження з назвою debugger, використовуючи власний автоматизований образ для налагодження.
kubectl debug --image=myproj/debug-tools -c debugger mypod

# Створити копію mypod, додавши контейнер налагодження, та приєднатися до неї.
kubectl debug mypod -it --image=busybox --copy-to=my-debugger

# Створити копію mypod, змінивши команду mycontainer.
kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh

# Створити копію mypod, змінивши образи всіх контейнерів на busybox.
kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox

# Створити копію mypod, додавши контейнер налагодження та змінивши образи контейнерів.
kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug

# Створити інтерактивну сесію налагодження на вузлі та одразу приєднатися до неї.
# Контейнер працюватиме в host namespaces та файлову систему вузла буде змонтовано у /host.
kubectl debug node/mynode -it --image=busybox
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--arguments-only</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, все, що знаходиться після --, буде передано до нового контейнера як Args замість Command.</p></td>
        </tr>
        <tr>
            <td colspan="2">--attach</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, дочекайтись запуску контейнера, а потім приєднати його так, ніби було викликано команду 'kubectl attach ...'.  Стандартне значення false, якщо не задано параметр '-i/--stdin', у цьому випадку стандартне значення true.</p></td>
        </tr>
        <tr>
            <td colspan="2">-c, --container string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва контейнера, який буде використано для налагодження.</p></td>
        </tr>
        <tr>
            <td colspan="2">--copy-to string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Створіює копію цільового Pod з цією назвою.</p></td>
        </tr>
        </tr>
        <tr>
            <td colspan="2">--custom string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до JSON або YAML-файлу, що містить часткову специфікацію контейнера для налаштування вбудованих профілів налагодження.</p></td>
        </tr>
        <tr>
            <td colspan="2">--env stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: []</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Змінні оточення, які потрібно встановити в контейнері.</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --filename strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>визначення ресурсу для налагодження</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка debug</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Політика отримання образів для контейнера. Якщо залишити порожнім, це значення не буде вказано клієнтом і буде стандартно визначене сервером.</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-annotations</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, зберігати оригінальні анотації p
            Podʼів (цей прапорець працює лише при використанні '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-init-containers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Запустити ініціалізаційні контейнери для pod. Стандартно дорівнює true (цей прапорець працює лише у випадку використання з '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-labels</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, зберігати оригінальні мітки Podʼів (цей прапорець працює лише при використанні '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-liveness</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, зберегти оригінальні проби життєздатності Podʼа. (Цей прапорець працює лише при використанні '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-readiness</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, зберегти оригінальні проби готовності Podʼа. (Цей прапорець працює лише при використанні '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--keep-startup</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, зберігати оригінальні проби запуску (цей прапорець працює лише при використанні '--copy-to').</p></td>
        </tr>
        <tr>
            <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "legacy"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Варіанти: &quot; legacy&quot;, &quot;general&quot;, &quot;baseline&quot;, &quot;netadmin&quot;, &quot;restricted&quot; або &quot;sysadmin&quot;.</p></td>
        </tr>
        <tr>
            <td colspan="2">-q, --quiet</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, то придушити інформаційні повідомлення.</p></td>
        </tr>
        <tr>
            <td colspan="2">--replace</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>При використанні з '--copy-to' видаляє оригінальний Pod.</p></td>
        </tr>
        <tr>
            <td colspan="2">--same-node</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо використовується з '--copy-to', призначити копію цільового Pod на той самий вузол.</p></td>
        </tr>
        <tr>
            <td colspan="2">--set-image stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: []</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>При використанні з '--copy-to', список пар name=image для зміни образів контейнерів, подібно до того, як працює команда 'kubectl set image'.</p></td>
        </tr>
        <tr>
            <td colspan="2">--share-processes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>При використанні з '--copy-to' вмикає спільне використання простору імен процесів у копії.</p></td>
        </tr>
        <tr>
            <td colspan="2">-i, --stdin</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Залишати stdin відкритим у контейнері (контейнерах), навіть якщо до нього нічого не приєднано.</p></td>
        </tr>
        <tr>
            <td colspan="2">--target string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>При використанні ефемерного контейнера, спрямовувати процеси до цього контейнера.</p></td>
        </tr>
        <tr>
            <td colspan="2">-t, --tty</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Призначення TTY для контейнера налагодження.</p></td>
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
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові параметри користувача, які слід використовувати для операції. Цей прапорець можна повторювати, щоб вказати кілька значень для одного і того ж ключа.</p></td>
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
