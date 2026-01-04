---
title: kubectl
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

kubectl керує менеджером кластерів Kubernetes.

Додаткову інформацію можна знайти в розділі [Інструмент командного рядка](/docs/reference/kubectl/) (`kubectl`).

```shell
kubectl [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--add-dir-header</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо true, додає теку файлу до заголовка повідомлень логу</td>
        </tr>
        <tr>
            <td colspan="2">--alsologtostderr</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">писати лог до standard error, а також в файл</td>
        </tr>
        <tr>
            <td colspan="2">--as string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача, яке використовується для виконання операції.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-group stringArray</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Назва групи, яка використовується для виконання операції, цей прапорець можна повторити, щоб вказати кілька груп.</td>
        </tr>
        <tr>
            <td colspan="2">--azure-container-registry-config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу, що містить інформацію про конфігурацію реєстру контейнера Azure.</td>
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
            <td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 130.211.0.0/22,35.191.0.0/16</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>CIDR, відкриті в фаєврволі GCE для трафіку L7 LB та перевірок стану</p></td>
        </tr>
        <tr>
            <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>CIDR, відкриті в фаєврволі GCE для трафіку L4 LB та перевірок стану</p></td>
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
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kubectl</p></td>
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
            <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">коли логування попадаж в рядок file:N, видавати trace стека</td>
        </tr>
        <tr>
            <td colspan="2">--log-dir string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо не порожньо, записати лог-файли в цю теку</td>
        </tr>
        <tr>
            <td colspan="2">--log-file string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо не порожньо, використовувати цей файл</td>
        </tr>
        <tr>
            <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1800</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Визначає максимальний розмір, до якого може вирости файл логу. Одиниця виміру — мегабайти. Якщо значення дорівнює 0, максимальний розмір файлу необмежений.</td>
        </tr>
        <tr>
            <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість секунд між очищеннями журналу</td>
        </tr>
        <tr>
            <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">писати лог в standard error, а не у файл</td>
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
            <td colspan="2">--one-output</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо true, записувати логи лише до їхнього власного рівня важливості (замість того, щоб записувати до кожного нижчого рівня важливості)</td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя профілю для захоплення. Одне із (none|cpu|heap|goroutine|threadcreate|block|mutex)</p></td>
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
            <td colspan="2">--skip-headers</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо true, уникати префіксів заголовків у повідомленнях логу</td>
        </tr>
        <tr>
            <td colspan="2">--skip-log-headers</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Якщо true, уникати заголовків при відкритті файлів логів</td>
        </tr>
        <tr>
            <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">логи, що дорівнюють або перевищують цей поріг, потрапляють до stderr</td>
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
            <td colspan="2">-v, --v Level</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">число рівня повноти записів логу</td>
        </tr>
        <tr>
            <td colspan="2">--version version[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вивести інформацію про версію та вийти</p></td>
        </tr>
        <tr>
            <td colspan="2">--vmodule moduleSpec</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">список параметрів pattern=N, розділених комами, для файл-фільтрованого логування.</td>
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

## {{% heading "envvars" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">KUBECONFIG</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу конфігурації kubectl ("kubeconfig"). Типово: "$HOME/.kube/config"</td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_EXPLAIN_OPENAPIV3</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Вмикає чи вимикає використання нового джерела даних OpenAPIv3 для викликів `kubectl explain`. OpenAPIV3 типово увімкнено з версії Kubernetes 1.24.
        </td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_ENABLE_CMD_SHADOW</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено true, зовнішні втулки можна використовувати як субкоманди для вбудованих команд, якщо субкоманда не існує. На альфа-стадії ця функція може бути використана лише для команди create (наприклад, kubectl create networkpolicy).
        </td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_PORT_FORWARD_WEBSOCKETS</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено true, команда kubectl port-forward спробує передавати дані, використовуючи протокол веб-сокетів. Якщо перехід до веб-сокетів не вдасться, команди повернуться до використання поточного протоколу SPDY.
        </td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_REMOTE_COMMAND_WEBSOCKETS</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено true, команди kubectl exec, cp та attach спробують передавати дані, використовуючи протокол веб-сокетів. Якщо перехід до веб-сокетів не вдасться, команди повернуться до використання поточного протоколу SPDY.
        </td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_KUBERC</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Коли встановлено true, файл kuberc береться до уваги для визначення налаштувань користувача.
            </td>
        </tr>
        <tr>
            <td colspan="2">KUBECTL_KYAML</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено значення true, kubectl може створювати вихідний формат YAML, що є специфічним для Kubernetes.
            </td>
        </tr>
    </tbody>
</table>

## {{% heading "seealso" %}}

* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) — Оновити анотації на ресурсі
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) — Вивести підтримувані API ресурси на сервері
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) — Вивести підтримувані API версії на сервері у форматі "група/версія"
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) — Застосувати конфігурацію до ресурсу за імʼям файлу або через stdin
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) — Приєднатися до працюючого контейнера
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) — Перевірити авторизацію
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) — Автоматичне масштабування Deployment, ReplicaSet або ReplicationController
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) — Змінити ресурси сертифікатів
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) — Показати інформацію про кластер
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) — Вивести код автодоповнення для зазначеної оболонки (bash або zsh)
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) — Змінити kubeconfig файли
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) — Позначити вузол як недоступний для планування
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) — Копіювати файли та теки до і з контейнерів
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) — Створити ресурс з файлу або stdin
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) — Створити сесії налагодження для виправлення неполадок з робочими навантаженнями та вузлами
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) — Видалити ресурси за допомогою імен файлів, stdin, ресурсів і назв або за допомогою ресурсів і селектора міток
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) — Показати деталі конкретного ресурсу або групи ресурсів
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) — Порівняти живу версію з потенційною версією, яку може бути застосовано
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) — Спорожнити вузол перед обслуговуванням
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) — Редагувати ресурс на сервері
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/) — Список подій
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) — Виконати команду в контейнері
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) — Документація по ресурсах
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) — Експонувати новий сервіс Kubernetes з replication controller, service, deployment чи pod
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) — Показати один або кілька ресурсів
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) — Створити kustomization з теки або віддаленого URL
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) — Оновити мітки на ресурсі
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) — Вивести логи для контейнера в pod
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) — Вивести список прапорців, успадкованих усіма командами
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) — Оновити поле(я) ресурсу
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) — Надає утиліти для взаємодії з dnekrfvb
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) — Gthtyfghfdkznb один або кілька локальних портів до pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) — Запустити проксі до Kubernetes API сервера
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) — Замінити ресурс за імʼям файлу або stdin
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) — Керувати розгортанням ресурсу
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) — Запустити вказаний образ на кластері
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) — Встановити новий розмір для Deployment, ReplicaSet або Replication Controller
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) — Встановити конкретні функції на обʼєктах
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) — Оновити taint на одному або кількох вузлах
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) — Показати використання ресурсів (CPU/Памʼять/Зберігання)
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) — Позначити вузол як доступний для планування
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) — Вивести інформацію про клієнтську та серверну версії
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) — Експериментально: Чекати на конкретну умову для одного або кількох ресурсів
