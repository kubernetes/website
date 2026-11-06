---
title: kubectl
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}} {#synopsis}

{{< glossary_definition term_id="kubectl" length="short" >}}

Додаткову інформацію можна знайти в розділі [Інструмент командного рядка](/docs/reference/kubectl/) (`kubectl`).

```shell
kubectl [flags]
```

## {{% heading "options" %}} {#options}

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо true, додає теку файлу до заголовка повідомлень логу</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">писати лог до standard error, а також в файл</td>
</tr>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя користувача для імперсонації під час операції</td>
</tr>

<tr>
<td colspan="2">--as-group stringArray</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Група для імперсонації під час операції, цей прапорець можна повторювати, щоб вказати кілька груп.</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу, що містить інформацію про конфігурацію реєстру контейнерів Azure.</td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Типове розташування теки кешу</td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу сертифіката для центра сертифікації</td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу клієнтського сертифіката для TLS</td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу ключа клієнта для TLS</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CIDR, відкриті у фаєрволі GCE для проксі трафіку L7 LB та перевірок стану</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">CIDR, відкриті у фаєрволі GCE для проксі трафіку L4 LB та перевірок стану</td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Назва кластера з kubeconfig, який слід використовувати</td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Назва контексту kubeconfig, який слід використовувати</td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Задає tolerationSeconds для toleration notReady:NoExecute, яка типово додається до кожного Podʼа, що ще не має такої toleration.</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Задає tolerationSeconds для toleration unreachable:NoExecute, яка типово додається до кожного Podʼа, що ще не має такої toleration.</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Довідка kubectl</td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо true, сертифікат сервера не буде перевірятися на дійсність. Це зробить ваші HTTPS-зʼєднання небезпечними</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу kubeconfig, який слід використовувати для CLI-запитів.</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">коли логування досягає рядка file:N, виводити трасування стека</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо не порожнє, записувати файли логів у цю теку</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо не порожнє, використовувати цей файл логу</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Визначає максимальний розмір, до якого може вирости файл логу. Одиниця виміру — мегабайти. Якщо значення дорівнює 0, максимальний розмір файлу необмежений.</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Максимальна кількість секунд між скиданнями буфера логу</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">писати лог в standard error, а не у файл</td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Вимагає, щоб версія сервера відповідала версії клієнта</td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо присутній, простір імен для цього CLI-запиту</td>
</tr>

<tr>
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо true, записувати логи лише до їхнього власного рівня важливості (замість того, щоб записувати до кожного нижчого рівня важливості)</td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Пароль для базової автентифікації на API-сервері</td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя профілю для захоплення. Одне з (none|cpu|heap|goroutine|threadcreate|block|mutex)</td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя файлу, в який записується профіль</td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Час очікування перед відмовою у виконанні окремого запиту до сервера. Ненульові значення повинні містити відповідну одиницю часу (наприклад, 1s, 2m, 3h). Значення нуль означає відсутність тайм-ауту запитів.</td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Адреса та порт API-сервера Kubernetes</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо true, уникати префіксів заголовків у повідомленнях логу</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо true, уникати заголовків під час відкриття файлів логів</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">логи, що дорівнюють або перевищують цей поріг, потрапляють до stderr</td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя сервера для перевірки сертифіката сервера. Якщо його не вказано, використовується імʼя хоста, через яке відбувається звʼязок із сервером</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Токен на предʼявника для автентифікації на API-сервері</td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя користувача kubeconfig, яке слід використовувати</td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Імʼя користувача для базової автентифікації на API-сервері</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">число, що задає рівень деталізації логу</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Вивести інформацію про версію та вийти</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">список параметрів pattern=N, розділених комами, для логування з фільтрацією за файлами</td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Трактувати попередження, отримані від сервера, як помилки і виходити з ненульовим кодом виходу</td>
</tr>

</tbody>
</table>

## {{% heading "envvars" %}} {#environment-variables}

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">Шлях до файлу конфігурації kubectl ("kubeconfig"). Типово: "$HOME/.kube/config"</td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">Якщо встановлено true, зовнішні втулки можна використовувати як субкоманди для вбудованих команд, якщо субкоманда не існує. На стадії alpha цю можливість можна використовувати лише для команди create (наприклад, kubectl create networkpolicy).
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

</tbody>
</table>

## {{% heading "seealso" %}} {#see-also}

* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) — Оновити анотації на ресурсі
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) — Вивести підтримувані ресурси API на сервері
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) — Вивести підтримувані версії API на сервері у форматі "група/версія"
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) — Застосувати конфігурацію до ресурсу за імʼям файлу або через stdin
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) — Приєднатися до запущеного контейнера
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) — Перевірити авторизацію
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) — Автоматичне масштабування Deployment, ReplicaSet або ReplicationController
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) — Змінити ресурси сертифікатів
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) — Показати інформацію про кластер
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) — Вивести код автодоповнення для зазначеної оболонки (bash або zsh)
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) — Змінити файли kubeconfig
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) — Позначити вузол як недоступний для планування
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) — Копіювати файли та теки до і з контейнерів
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) — Створити ресурс з файлу або stdin
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) — Створити сесії налагодження для виправлення неполадок з робочими навантаженнями та вузлами
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) — Видалити ресурси за допомогою імен файлів, stdin, ресурсів і назв або за допомогою ресурсів і селектора міток
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) — Показати деталі конкретного ресурсу або групи ресурсів
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) — Порівняти живу версію з потенційною версією, яку може бути застосовано
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) — Виконати drain вузла перед обслуговуванням
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) — Редагувати ресурс на сервері
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/) — Вивести список подій
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) — Виконати команду в контейнері
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) — Документація ресурсів
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) — Відкрити доступ до replication controller, service, deployment або pod як до нового Service Kubernetes
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) — Показати один або кілька ресурсів
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) — Зібрати ціль kustomization з теки або віддаленого URL
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) — Оновити мітки на ресурсі
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) — Вивести логи контейнера в Pod
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) — Вивести список прапорців, успадкованих усіма командами
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) — Оновити поле(я) ресурсу
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) — Надає утиліти для взаємодії з втулками
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) — Перенаправити один або кілька локальних портів до Pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) — Запустити проксі до API-сервера Kubernetes
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) — Замінити ресурс за імʼям файлу або stdin
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) — Керувати розгортанням ресурсу
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) — Запустити вказаний образ у кластері
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) — Встановити новий розмір для Deployment, ReplicaSet або Replication Controller
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) — Встановити певні властивості обʼєктів
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) — Оновити taint на одному або кількох вузлах
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) — Показати використання ресурсів (CPU/Памʼять/Зберігання)
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) — Позначити вузол як доступний для планування
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) — Вивести інформацію про клієнтську та серверну версії
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) — Експериментально: чекати на певний стан одного або кількох ресурсів