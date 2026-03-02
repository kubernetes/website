---
title: kubectl get
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Показати один або декілька ресурсів.

Виводить таблицю з найважливішою інформацією про вказані ресурси. Ви можете відфільтрувати список за допомогою селектора міток і прапорця `--selector`. Якщо потрібний тип ресурсу є простором назв, ви побачите результати лише у поточному просторі назв, якщо не вказати якийсь namespaces.

Зазначивши виведення як "template" і надавши шаблон Go як значення прапорця `--template`, ви можете відфільтрувати атрибути отриманих ресурсів.

Для отримання повного списку підтримуваних ресурсів скористайтеся "kubectl api-resources".

```shell
kubectl get [(-o|--output=)json|yaml|kyaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file|custom-columns|custom-columns-file|wide] (TYPE[.VERSION][.GROUP] [NAME | -l label] | TYPE[.VERSION][.GROUP]/NAME ...) [flags]
```

## {{% heading "examples" %}}

```shell
# Вивести перелік всіх Podʼів у форматі виводу ps
kubectl get pods

# Вивести перелік всії Podʼів у форматі виводу ps з додатковою інформацією (наприклад, імʼя вузла)
kubectl get pods -o wide

# Вивести перелік один контролер реплікації з вказаним NAME у форматі виводу ps
kubectl get replicationcontroller web

# Вивести перелік deployment у форматі виводу JSON, у версії "v1" групи API "apps"
kubectl get deployments.v1.apps -o json

# Вивести один Pod у форматі виводу JSON
kubectl get -o json pod web-pod-13je7

# Вивести перелік Podʼів, визначений типом та іменем у "pod.yaml", у форматі виводу JSON
kubectl get -f pod.yaml -o json

# Вивести перелік ресурси з теки з kustomization.yaml - наприклад, dir/kustomization.yaml
kubectl get -k dir/

# Повернути лише значення фази вказаного Pod
kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}

# Вивести перелік інформації про ресурси у власних стовпцях
kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0].name,IMAGE:.spec.containers[0].image

# Вивести перелік всіх контролерів реплікації та сервіси разом у форматі виводу ps
kubectl get rc,services

# Вивести перелік один або більше ресурсів за їх типом та іменами
kubectl get rc/web service/frontend pods/web-pod-13je7

# Вивести перелік субресурс 'status' для одного Pod
kubectl get pod web-pod-13je7 --subresource status

# Вивести перелік всіх deployments в namespace 'backend'
kubectl get deployments.apps --namespace backend

# Вивести перелік всіх pods пристуніх в усіх namespaces
kubectl get pods --all-namespaces
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">-A, --all-namespaces</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, показати список запитуваних обʼєктів у всіх просторах назв. Простір імен у поточному контексті ігнорується, навіть якщо вказано --namespace.</p></td>
        </tr>
        <tr>
            <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, ігнорувати будь-які помилки в шаблонах, коли в шаблоні відсутнє поле або ключ map. Застосовується лише до форматів виводу golang та jsonpath.</p></td>
        </tr>
        <tr>
            <td colspan="2">--chunk-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 500</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Повертати великі списки частинами, а не всі одразу. Для вимкнення задайте 0.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, теки або URL до файлів, яки визначають ресурс, для отримання з сервера.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка get</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-not-found</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено значення true, придушує помилку NotFound для певних обʼєктів, які не існують. Використання цього прапорця з командами, що запитують колекції ресурсів, не має ефекту, якщо ресурси не знайдено.</p></td>
        </tr>
        <tr>
            <td colspan="2">-k, --kustomize string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Обробити теку kustomization. Цей прапорець не можна використовувати разом з -f або -R.</p></td>
        </tr>
        <tr>
            <td colspan="2">-L, --label-columns strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Приймає список міток, розділених комами, які буде представлено у вигляді стовпчиків. Назви чутливі до регістру. Ви також можете використовувати декілька прапорців, наприклад, -L label1 -L label2...</p></td>
        </tr>
        <tr>
            <td colspan="2">--no-headers</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>При використанні стандартного або власного формату виводу стовпців не друкувати заголовки (заголовки стандартно друкуються).</p></td>
        </tr>
        <tr>
            <td colspan="2">-o, --output string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Формат виводу. Один з: (json, yaml, kyaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file, custom-columns, custom-columns-file, wide).Дивіться нестандартні стовпці [https://kubernetes.io/docs/reference/kubectl/#custom-columns](/docs/reference/kubectl/#custom-columns), шаблон golang [http://golang.org/pkg/text/template/#pkg-overview] та шаблон jsonpath [https://kubernetes.io/docs/reference/kubectl/jsonpath/](/docs/reference/kubectl/jsonpath/).</p></td>
        </tr>
        <tr>
            <td colspan="2">--output-watch-events</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виводити обʼєкти подій спостереження, якщо використовується --watch або --watch-only. Існуючі обʼєкти виводяться як початкові події ADDED.</p></td>
        </tr>
        <tr>
            <td colspan="2">--raw string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Необроблений URI для запиту з сервер.  Використовує транспорт, вказаний у файлі kubeconfig.</p></td>
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
            <td colspan="2">--server-print&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення true, сервер має повернути відповідний вивід таблиці. Підтримує API розширення та CRD.</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-kind</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо є, вкажіть тип ресурсу для запитуваного обʼєкта (обʼєктів).</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-labels</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Під час друку показувати всі мітки в останньому стовпчику (стандартно приховувати стовпчик міток)</p></td>
        </tr>
        <tr>
            <td colspan="2">--show-managed-fields</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, зберігати managedFields при виводі обʼєктів у форматі JSON або YAML.</p></td>
        </tr>
        <tr>
            <td colspan="2">--sort-by string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо поле не порожнє, відсортувати список ресурсів за вказаним полем. Специфікація поля виражається у вигляді виразу JSONPath (наприклад, '{.metadata.name}'). Поле в ресурсі API, визначене цим виразом JSONPath, має бути цілим чи рядком.</p></td>
        </tr>
        <tr>
            <td colspan="2">--subresource string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, редагування працюватиме з субресурсом запитуваного обʼєкта.</p></td>
        </tr>
        <tr>
            <td colspan="2">--template string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рядок шаблону або шлях до файлу шаблону для використання з -o=go-template, -o=go-template-file. Формат шаблону — golang-шаблони [http://golang.org/pkg/text/template/#pkg-overview].</p></td>
        </tr>
        <tr>
            <td colspan="2">-w, --watch</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Після отримання списку бажаних подій слідкувати за новими подіями.</p></td>
        </tr>
        <tr>
            <td colspan="2">--watch-only</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Спостерігати за змінами запитуваного обʼєкта (обʼєктів), не переглядаючи/отримуючи їх спочатку.</p></td>
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
