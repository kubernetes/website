---
title: kube-apiserver
content_type: tool-reference
weight: 30
auto_generated: flse
---

## {{% heading "synopsis" %}}

Сервер API Kubernetes перевіряє та налаштовує дані для обʼєктів api, які включають поди, сервіси, replicationcontrollers та інші. API Server обслуговує REST-операції та забезпечує інтерфейс до спільного стану кластера, через який взаємодіють всі інші компоненти.

```shell
kube-apiserver [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
   <colgroup>
      <col span="1" style="width: 10px;" />
      <col span="1" />
   </colgroup>
   <tbody>
      <tr>
         <td colspan="2">--admission-control strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Допуск поділяється на два етапи. На першому етапі виконуються тільки втулки допуску, що змінюють дані. На другому етапі виконуються тільки втулки допуску, що перевіряють дані. Імена в наведеному нижче списку можуть позначати втулки, що перевіряють дані, втулки, що змінюють дані, або обидва типи. Порядок втулків, в якому вони передаються до цього прапорця, не має значення. Список, розділений комами: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeDeclaredFeatureValidator, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PodNodeSelector, PodSecurity, PodTolerationRestriction, PodTopologyLabels, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook. (ЗАСТАРІЛО: Замість цього використовуйте --enable-admission-plugins або --disable-admission-plugins. Буде видалено в майбутній версії.)</p></td>
      </tr>
      <tr>
         <td colspan="2">--admission-control-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією контролю допуску.</p></td>
      </tr>
      <tr>
         <td colspan="2">--advertise-address string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде публікуватися інформація про apiserver для членів кластеру. Ця адреса має бути доступною для решти учасників кластера. Якщо не вказано, буде використано --bind-address. Якщо --bind-address не вказано, буде використано стандартний інтерфейс хоста.</p></td>
      </tr>
      <tr>
         <td colspan="2">--aggregator-reject-forwarding-redirect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Агрегатор відхиляє перенаправлення відповіді редиректу назад клієнту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: []</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Зіставляє метрику-мітку зі списком дозволених значень цієї мітки. Формат ключа — &lt;MetricName&gt;,&lt;LabelName&gt;. Формат значення — &lt;allowed_value&gt;, &lt;allowed_value&gt;... наприклад, metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-metric-labels-manifest string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу маніфесту, який містить зіставлення allow-list. Формат файлу такий самий, як і у прапорця --allow-metric-labels. Зауважте, що прапорець --allow-metric-labels замінить файл маніфесту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-privileged</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, дозволити привілейовані контейнери. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє анонімні запити до захищеного порту сервера API. Запити, які не були відхилені іншими методами автентифікації, вважаються анонімними. Анонімні запити мають імʼя користувача system:anonymous і назву групи system:unauthenticated.</p></td>
      </tr>
      <tr>
         <td colspan="2">--api-audiences strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Ідентифікатори API. Автентифікатор токенів службового облікового запису перевіряє, що токени, які використовуються з API, привʼязані принаймні до однієї з цих аудиторій. Якщо прапорець --service-account-issuer налаштовано, а цей прапорець не встановлено, стандартно у цьому полі буде вказано список з одного елемента, що містить URL-адресу емітента.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10000</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розмір буфера для зберігання подій перед пакетною передачею та записом. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір пакету. Використовується тільки в пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-max-wait duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед примусовим записом пакету, який не досягнув максимального розміру. Використовується тільки в пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-throttle-burst int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість запитів, надісланих одночасно, якщо ThrottleQPS не використовувався раніше. Використовується тільки в пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-throttle-enable</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи ввімкнено пакетний тротлінг. Використовується тільки в пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-batch-throttle-qps float</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна середня кількість партій в секунду. Використовується тільки в пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-compress</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, файли логів, що ротуються, буде стиснуто за допомогою gzip.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "json"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Формат збережених аудитів. &quot;legacy&quot; вказує на 1-рядковий текстовий формат для кожної події. &quot;json&quot; вказує на структурований формат json. Відомі формати: legacy, json.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-maxage int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість днів для зберігання старих файлів логів аудиту на основі мітки часу, закодованої в їхньому імені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-maxbackup int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість старих файлів логів аудиту, які слід зберігати. Встановлення значення 0 означатиме відсутність обмежень на кількість файлів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-maxsize int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір у мегабайтах файлу логу аудиту до того, як буде виконано його ротацію.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "blocking"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Стратегія надсилання подій аудиту. Блокування вказує на те, що надсилання подій має блокувати відповіді сервера. Пакетне виконання змушує бекенд буферизувати і записувати події асинхронно. Відомі такі режими: batch, blocking, blocking-strict.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-path string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, всі запити, що надходять до apiserver, будуть записуватися до цього файлу.  '-' означає стандартний вивід.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-truncate-enabled</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи увімкнено усікання подій та пакетів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10485760</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір пакету, що надсилається до відповідного бекенду. Фактичний розмір серіалізованого файлу може бути на кілька сотень байт більшим. Якщо пакет перевищує цей ліміт, він розбивається на кілька пакетів меншого розміру.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 102400</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір події аудиту, що надсилається до відповідного бекенду. Якщо розмір події перевищує це число, перший запит і відповідь видаляються, а якщо це не зменшує розмір достатньо, подія відкидається.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "audit.k8s.io/v1"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Група та версія API, що використовується для серіалізації подій аудиту, записаних до логу.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-policy-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу, який визначає конфігурацію політики аудиту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10000</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розмір буфера для зберігання подій перед пакетною передачею та записом. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 400</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір пакету. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед примусовим записом пакету, який не досягнув максимального розміру. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість запитів, надісланих одночасно, якщо ThrottleQPS не використовувався раніше. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи ввімкнено пакетний тротлінг. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-batch-throttle-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна середня кількість пакетів за секунду. Використовується тільки у пакетному режимі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу у форматі kubeconfig, який визначає конфігурацію вебхука аудиту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед повторною спробою після першого невдалого запиту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "batch"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Стратегія надсилання подій аудиту. Блокування вказує на те, що надсилання подій має блокувати відповіді сервера. Режим batch змушує бекенд буферизувати і записувати події асинхронно. Відомі такі режими: batch, blocking, blocking-strict.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-truncate-enabled</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Чи увімкнено усікання подій та пакетів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10485760</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір пакету, що надсилається до відповідного бекенду. Фактичний розмір серіалізованого файлу може бути на кілька сотень байт більшим. Якщо пакет перевищує цей ліміт, він розбивається на кілька пакетів меншого розміру.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 102400</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний розмір події аудиту, що надсилається до відповідного бекенду. Якщо розмір події перевищує це число, перший запит і відповідь видаляються, а якщо це не зменшує розмір достатньо, подія відкидається.</p></td>
      </tr>
      <tr>
         <td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "audit.k8s.io/v1"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Група та версія API, що використовується для серіалізації подій аудиту, записаних у webhook.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією автентифікації для налаштування автентифікатора JWT Token або анонімного автентифікатора. Потрібна функціональна можливість StructuredAuthenticationConfiguration. Цей прапорець є взаємовиключним з прапорцями --oidc-*, якщо у файлі налаштовано автентифікатор JWT Token. Цей прапорець є взаємовиключним з прапорцем --anonymous-auth, якщо у файлі налаштовано анонімний автентифікатор.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей від автентифікатора токенів вебхуків.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-token-webhook-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією вебхука для автентифікації токенів у форматі kubeconfig. Сервер API буде запитувати віддалений сервіс для визначення автентичності токенів на предʼявника.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-token-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "v1beta1"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Версія API authentication.k8s.io TokenReview для надсилання та очікування від вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією авторизації для налаштування ланцюжка авторизації. Вимагає наявності функціональної можливості StructuredAuthorizationConfiguration. Цей прапорець є взаємовиключним з іншими прапорцями --authorization-mode та --authorization-webhook-*.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-mode strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Впорядкований список втулків для авторизації на захищеному порту. Стандартно має значення AlwaysAllow, якщо не вказано --authorization-config. Список втулків, розділених комами: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-policy-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з політикою авторизації у форматі json, що використовується з --authorization-mode=ABAC, на захищеному порту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'authorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'unauthorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією webhook у форматі kubeconfig, що використовується з --authorization-mode=Webhook. Сервер API запитує віддалений сервіс для визначення доступу на захищеному порту сервера API.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "v1beta1"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Версія API authorization.k8s.io SubjectAccessReview, яку потрібно надсилати до вебхука та очікувати від нього.</p></td>
      </tr>
      <tr>
         <td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде прослуховуватися порт --secure-port. Відповідний інтерфейс(и) має бути доступним для решти кластера, а також для CLI/веб-клієнтів. Якщо цей параметр не вказано або вказано невизначену адресу (0.0.0.0 або ::), будуть використані всі інтерфейси та сімейства IP-адрес.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/var/run/kubernetes"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тека, в якій знаходяться TLS-сертифікати. Якщо вказано --tls-cert-file та --tls-private-key-file, цей прапорець буде проігноровано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, будь-який запит, що надає клієнтський сертифікат, підписаний одним із центрів сертифікації у клієнтському файлі, буде автентифіковано за допомогою ідентифікатора, що відповідає CommonName клієнтського сертифіката.</p></td>
      </tr>
      <tr>
         <td colspan="2">--contention-profiling</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Дозволяє профілювання блоків, якщо профілювання увімкнено</p></td>
      </tr>
      <tr>
         <td colspan="2">--coordinated-leadership-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість оренди, що використовується для скоординованих виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--coordinated-leadership-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Термін для продовження оренди виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--coordinated-leadership-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість для повторної спроби продовження оренди виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cors-allowed-origins strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список дозволених джерел для CORS, через кому. Допустимим джерелом може бути регулярний вираз для підтримки співставлення субдоменів. Якщо цей список порожній, CORS не буде ввімкнено. Будь ласка, переконайтеся, що кожен вираз співпадає з повним імʼям хоста шляхом привʼязки до початку за допомогою '^' або включення префікса '//', а також шляхом привʼязки до кінця за допомогою '$' або включення суфікса-розділювача портів ':'. Прикладами допустимих виразів є '//example.com(:|$)' і '^https://example.com(:|$)'</p></td>
      </tr>
      <tr>
         <td colspan="2">--debug-socket-path string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Використовуйте незахищений (без authn/authz) unix-доменний сокет для профілювання за вказаним шляхом</p></td>
      </tr>
      <tr>
         <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 300</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вказує толерантність у секундах для notReady:NoExecute, яка стандартно додається до кожного Podʼа, який ще не має такої толерантності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 300</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Показує tolerationSeconds толерантності для unreachable:NoExecute, яка стандартно додається до кожного Podʼа, який ще не має такої толерантності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість обробників, створених для виклику DeleteCollection. Вони використовуються для прискорення очищення простору імен.</p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-admission-plugins strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Втулки допуску, які слід вимкнути, хоча вони є у списку стандартно ввімкнутих втулків (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass, PodTopologyLabels, NodeDeclaredFeatureValidator, MutatingAdmissionPolicy, MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota). Список втулків допуску розділених комою: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeDeclaredFeatureValidator, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PodNodeSelector, PodSecurity, PodTolerationRestriction, PodTopologyLabels, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook. Порядок розташування втулків у цьому прапорці не має значення.</p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-http2-serving</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, HTTP2-сервіс буде вимкнено [default=false].</p></td>
      </tr>
      <tr>
         <td colspan="2">--disabled-metrics strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей прапорець забезпечує аварійний вихід для метрик, що поводяться не належним чином. Щоб вимкнути метрику, ви маєте вказати її повну назву. Застереження: вимкнення метрик має вищий пріоритет, ніж показ прихованих метрик.</p></td>
      </tr>
      <tr>
         <td colspan="2">--egress-selector-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією селектора egress apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">--emulated-version strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>У версіях різні компоненти емулюють свої можливості (API, функції, ...) інших компонентів.<br/>
         Якщо встановлено, компонент буде емулювати поведінку цієї версії замість базової двійкової версії.<br/>
         Формат версії може бути лише major.minor, наприклад: '--emulated-version=wardle=1.2,kube=1.31'.<br/>
         Можливі варіанти:<br/>
         kube=1.32..1.35 (default=1.35)<br/>
         Якщо компонент не вказано, стандартно використовується &quot;kube&quot;</p></td>
      </tr>
      <tr>
         <td colspan="2">--emulation-forward-compatible</td>
      </tr>
      <tr>
         <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено значення true, для будь-яких бета+ API, стандартно увімкнених або за допомогою --runtime-config у версії емуляції, їхні майбутні версії з вищим пріоритетом/стабільністю будуть автоматично ввімкнені, навіть якщо вони були випущені після версії емуляції. Можна встановити значення true, лише якщо версія емуляції нижча за бінарну версію.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-admission-plugins strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Втулки допуску, які слід увімкнути на додачу до стандартно увімкнутих (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass, PodTopologyLabels, NodeDeclaredFeatureValidator, MutatingAdmissionPolicy, MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota). Розділений комами список втулків допуску: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeDeclaredFeatureValidator, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PodNodeSelector, PodSecurity, PodTolerationRestriction, PodTopologyLabels, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook. Порядок розташування втулків у цьому прапорці не має значення.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-aggregator-routing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає маршрутизацію запитів агрегатора на IP точок доступу, а не на IP кластера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-bootstrap-token-auth</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть, щоб дозволити використовувати секрети типу 'bootstrap.kubernetes.io/token' у просторі імен 'kube-system' для автентифікації за допомогою TLS-завантаження.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає загальний збирач сміття. МАЄ бути синхронізовано з відповідним прапорцем kube-controller-manager.</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-logs-handler</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це правда, встановіть обробник /logs для журналів apiserver. (ЗАСТАРІЛЕ: Функціональність обробника журналів застаріла)</p></td>
      </tr>
      <tr>
         <td colspan="2">--enable-priority-and-fairness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, замініть обробник max-in-flight на покращений обробник, який ставить в чергу та розподіляє відправлення з пріоритетом та справедливістю</p></td>
      </tr>
      <tr>
         <td colspan="2">--encryption-provider-config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить конфігурацію для провайдерів шифрування, які будуть використовуватися для зберігання секретів у etcd</p></td>
      </tr>
      <tr>
         <td colspan="2">--encryption-provider-config-automatic-reload</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Визначає, чи слід автоматично перезавантажувати файл, заданий за допомогою --encryption-provider-config, у разі зміни вмісту диска. Встановлення цього параметра у значення true вимикає можливість унікальної ідентифікації окремих втулків KMS за допомогою точок доступу API сервера healthz.</p></td>
      </tr>
      <tr>
         <td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "lease"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Використовувати узгоджувач точок доступу (master-count, lease, none) master-count є застарілим і буде вилучений у наступній версії.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-cafile string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл центру сертифікації SSL, який використовується для захисту звʼязку etcd.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-certfile string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл SSL-сертифікату, який використовується для захисту звʼязку etcd.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал запитів на ущільнення. Якщо 0, то запит на ущільнення від apiserver вимкнено.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Частота опитування etcd для кількості ресурсів за типом. 0 вимикає збір метрик.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-db-metric-poll-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал запитів на опитування etcd та оновлення метрики. 0 вимикає збір метрики</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-healthcheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут для перевірки стану etcd.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-keyfile string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл ключа SSL, який використовується для захисту комунікації etcd.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/registry"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Префікс для додавання до всіх шляхів до ресурсів у etcd.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-readycheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут для перевірки готовності etcd</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-servers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список etcd серверів для зʼєднання (scheme://ip: port), через кому.</p></td>
      </tr>
      <tr>
         <td colspan="2">--etcd-servers-overrides strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Окремі перевизначення серверів etcd для кожного ресурсу, через кому. Формат перевизначення: група/ресурс#сервери, де сервери — це URL-адреси, розділені крапкою з комою. Зауважте, що це стосується лише ресурсів, скомпільованих у цей двійковий файл сервера? напр. &quot;/pods#http://etcd4:2379;http://etcd5:2379,/events#http://etcd6:2379&quot;</p></td>
      </tr>
      <tr>
         <td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Кількість часу для збереження подій.</p></td>
      </tr>
      <tr>
         <td colspan="2">--external-hostname string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя хоста, яке використовуватиметься під час генерації зовнішніх URL-адрес для цього master (наприклад, Swagger API Docs або OpenID Discovery).</p></td>
      </tr>
      <tr>
         <td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список пар component:key=value, які описують функціональні можливості для альфа/експериментальних можливостей різних компонентів.<br/>
         Якщо компонент не вказано, стандартно використовується &quot;kube&quot;. Цей прапорець можна викликати багаторазово. Наприклад: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'. Можливі варіанти:<br/>
            kube:APIResponseCompression=true|false (BETA - default=true)<br/>
            kube:APIServerIdentity=true|false (BETA - default=true)<br/>
            kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
            kube:AllAlpha=true|false (ALPHA - default=false)<br/>
            kube:AllBeta=true|false (BETA - default=false)<br/>
            kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
            kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
            kube:AuthorizePodWebsocketUpgradeCreatePermission=true|false (BETA - default=true)<br/>
            kube:CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
            kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            kube:CRDObservedGenerationTracking=true|false (BETA - default=false)<br/>
            kube:CSIServiceAccountTokenSecrets=true|false (BETA - default=true)<br/>
            kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
            kube:ClearingNominatedNodeNameAfterBinding=true|false (BETA - default=true)<br/>
            kube:ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
            kube:ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
            kube:CloudControllerManagerWatchBasedRoutesReconciliation=true|false (ALPHA - default=false)<br/>
            kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
            kube:ClusterTrustBundle=true|false (BETA - default=false)<br/>
            kube:ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
            kube:ComponentFlagz=true|false (ALPHA - default=false)<br/>
            kube:ComponentStatusz=true|false (ALPHA - default=false)<br/>
            kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
            kube:ConstrainedImpersonation=true|false (ALPHA - default=false)<br/>
            kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
            kube:ContainerRestartRules=true|false (BETA - default=true)<br/>
            kube:ContainerStopSignals=true|false (ALPHA - default=false)<br/>
            kube:ContextualLogging=true|false (BETA - default=true)<br/>
            kube:CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
            kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
            kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
            kube:DRAAdminAccess=true|false (BETA - default=true)<br/>
            kube:DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
            kube:DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
            kube:DRADeviceTaintRules=true|false (ALPHA - default=false)<br/>
            kube:DRADeviceTaints=true|false (ALPHA - default=false)<br/>
            kube:DRAExtendedResource=true|false (ALPHA - default=false)<br/>
            kube:DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
            kube:DRAPrioritizedList=true|false (BETA - default=true)<br/>
            kube:DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
            kube:DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
            kube:DeclarativeValidation=true|false (BETA - default=true)<br/>
            kube:DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
            kube:DeploymentReplicaSetTerminatingReplicas=true|false (BETA - default=true)<br/>
            kube:DetectCacheInconsistency=true|false (BETA - default=true)<br/>
            kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
            kube:EnvFiles=true|false (BETA - default=true)<br/>
            kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
            kube:ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
            kube:GangScheduling=true|false (ALPHA - default=false)<br/>
            kube:GenericWorkload=true|false (ALPHA - default=false)<br/>
            kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
            kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
            kube:HPAConfigurableTolerance=true|false (BETA - default=true)<br/>
            kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
            kube:HostnameOverride=true|false (BETA - default=true)<br/>
            kube:ImageVolume=true|false (BETA - default=true)<br/>
            kube:InOrderInformers=true|false (BETA - default=true)<br/>
            kube:InOrderInformersBatchProcess=true|false (BETA - default=true)<br/>
            kube:InPlacePodLevelResourcesVerticalScaling=true|false (ALPHA - default=false)<br/>
            kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
            kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
            kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
            kube:KubeletCrashLoopBackOffMax=true|false (BETA - default=true)<br/>
            kube:KubeletEnsureSecretPulledImages=true|false (BETA - default=true)<br/>
            kube:KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
            kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
            kube:KubeletPSI=true|false (BETA - default=true)<br/>
            kube:KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
            kube:KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
            kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
            kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
            kube:ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
            kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
            kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
            kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
            kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
            kube:MaxUnavailableStatefulSet=true|false (BETA - default=true)<br/>
            kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
            kube:MutableCSINodeAllocatableCount=true|false (BETA - default=true)<br/>
            kube:MutablePVNodeAffinity=true|false (ALPHA - default=false)<br/>
            kube:MutablePodResourcesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
            kube:MutableSchedulingDirectivesForSuspendedJobs=true|false (ALPHA - default=false)<br/>
            kube:MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
            kube:NodeDeclaredFeatures=true|false (ALPHA - default=false)<br/>
            kube:NodeLogQuery=true|false (BETA - default=false)<br/>
            kube:NominatedNodeNameForExpectation=true|false (BETA - default=true)<br/>
            kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
            kube:OpportunisticBatching=true|false (BETA - default=true)<br/>
            kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
            kube:PodCertificateRequest=true|false (BETA - default=false)<br/>
            kube:PodDeletionCost=true|false (BETA - default=true)<br/>
            kube:PodLevelResources=true|false (BETA - default=true)<br/>
            kube:PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
            kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
            kube:PodTopologyLabelsAdmission=true|false (BETA - default=true)<br/>
            kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
            kube:PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
            kube:ProcMountType=true|false (BETA - default=true)<br/>
            kube:QOSReserved=true|false (ALPHA - default=false)<br/>
            kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
            kube:RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
            kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
            kube:RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
            kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
            kube:RestartAllContainersOnContainerExits=true|false (ALPHA - default=false)<br/>
            kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
            kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
            kube:SELinuxChangePolicy=true|false (BETA - default=true)<br/>
            kube:SELinuxMount=true|false (BETA - default=false)<br/>
            kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
            kube:SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
            kube:SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
            kube:SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
            kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
            kube:SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
            kube:StatefulSetSemanticRevisionComparison=true|false (BETA - default=true)<br/>
            kube:StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
            kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
            kube:StorageVersionHash=true|false (BETA - default=true)<br/>
            kube:StorageVersionMigrator=true|false (BETA - default=false)<br/>
            kube:StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
            kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
            kube:StructuredAuthenticationConfigurationJWKSMetrics=true|false (BETA - default=true)<br/>
            kube:TaintTolerationComparisonOperators=true|false (ALPHA - default=false)<br/>
            kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
            kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
            kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
            kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
            kube:UserNamespacesHostNetworkSupport=true|false (ALPHA - default=false)<br/>
            kube:UserNamespacesSupport=true|false (BETA - default=true)<br/>
            kube:VolumeLimitScaling=true|false (ALPHA - default=false)<br/>
            kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
            kube:WatchList=true|false (BETA - default=true)<br/>
            kube:WatchListClient=true|false (BETA - default=true)<br/>
            kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
            kube:WindowsGracefulNodeShutdown=true|false (BETA - default=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">--goaway-chance float</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Щоб запобігти застряганню HTTP/2-клієнтів на одному apiserver, випадково закрийте зʼєднання (GOAWAY). Інші запити клієнта не будуть зачеплені, і клієнт відновить зʼєднання, ймовірно, потрапивши на інший apiserver після того, як знову пройде через балансувальник навантаження. Цей аргумент задає частку запитів, які будуть відправлені GOAWAY. Кластери з одним apiserver або ті, що не використовують балансувальник навантаження, НЕ повинні вмикати цей параметр. Мінімальне значення — 0 (вимкнено), максимальне — 0.02 (1/50 запитів); 0.001 (1/1000) є рекомендованим початковим значенням.</p></td>
      </tr>
      <tr>
         <td colspan="2">-h, --help</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kube-apiserver</p></td>
      </tr>
      <tr>
         <td colspan="2">--http2-max-streams-per-connection int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Обмеження, яке сервер надає клієнтам на максимальну кількість потоків у зʼєднанні HTTP/2. Нуль означає використання стандартного значення golang.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubelet-certificate-authority string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу сертифіката центру сертифікації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubelet-client-certificate string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського сертифіката для TLS.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubelet-client-key string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського ключа для TLS.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubelet-preferred-address-types strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список бажаних типів NodeAddressTypes для зʼєднань kubelet.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Таймаут для операцій kubelet.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubernetes-service-node-port int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення відмінне від нуля, майстер-сервіс Kubernetes (який створює/підтримує apiserver) матиме тип NodePort, використовуючи його як значення порту. Якщо нульове значення, майстер-сервіс Kubernetes матиме тип ClusterIP.</p></td>
      </tr>
      <tr>
         <td colspan="2">--lease-reuse-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 60</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час у секундах, протягом якого кожна оренда використовується повторно. Менше значення допоможе уникнути повторного використання однієї і тієї ж оренди великою кількістю обʼєктів. Зауважте, що занадто мале значення може спричинити проблеми з продуктивністю на рівні сховища.</p></td>
      </tr>
      <tr>
         <td colspan="2">--livez-grace-period duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей параметр вказує максимальний час, за який apiserver має завершити свою послідовність запуску і стати активним. З моменту запуску apiserver і до закінчення цього часу /livez вважатиме, що незавершені після запуску хуки будуть успішно завершені, а отже, повертатиме значення true.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість секунд між очищеннями логів</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-info-buffer-size quantity</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі з розділеними потоками виводу інформаційні повідомлення можуть буферизуватися на деякий час для підвищення продуктивності. Стандартне значення, рівне нулю байт, вимикає буферизацію. Розмір можна вказати як кількість байт (512), кратну 1000 (1K), кратну 1024 (2Ki) або степінь (3M, 4G, 5Mi, 6Gi). Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-split-stream</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі записувати повідомлення про помилки до stderr та інформаційні повідомлення до stdout. Стандартно до stdout записується один потік. Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Задає формат логу. Дозволені формати: &quot;text&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--max-connection-bytes-per-sec int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо ненульове, обмежити кожне зʼєднання користувача до цієї кількості байт/сек. Наразі застосовується лише до довготривалих запитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 200</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей та --max-requests-inflight підсумовуються для визначення загального ліміту паралелізму сервера (який має бути додатнім), якщо --enable-priority-and-fairness має значення true. В іншому випадку цей прапорець обмежує максимальну кількість запитів, що змінюються у процесі виконання, або нульове значення повністю вимикає обмеження.</p></td>
      </tr>
      <tr>
         <td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 400</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Це значення та --max-mutating-requests-inflight підсумовуються для визначення загального ліміту паралелізму сервера (який має бути додатнім), якщо --enable-priority-and-fairness має значення true. В іншому випадку цей прапорець обмежує максимальну кількість запитів, що не змінюються у процесі виконання, або нульове значення повністю вимикає ліміт.</p></td>
      </tr>
      <tr>
         <td colspan="2">--min-compatibility-version strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна версія компонентів панелі управління, з якою повинен бути сумісний сервер. <br/>Повинна бути меншою або дорівнювати емульованій версії. Формат версії може бути тільки major.minor, наприклад: '--min-compatibility-version=wardle=1.2,kube=1.31'.<br/>Варіанти: kube=1.32..1.35 (Стандартно: 1.34)<br/>Якщо компонент не вказано, типово використовується &quot;kube&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1800</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязкове поле, що вказує мінімальну кількість секунд, протягом яких обробник повинен тримати запит відкритим, перш ніж завершити його виконання. Наразі виконується лише обробником запитів watch, який обирає випадкове значення вище цього числа як таймаут зʼєднання, щоб розподілити навантаження.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, сертифікат сервера OpenID буде перевірено одним з центрів сертифікації в oidc-ca-файлі, інакше буде використано кореневий центр сертифікації хоста.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-client-id string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Ідентифікатор клієнта для клієнта OpenID Connect повинен бути встановлений, якщо встановлено oidc-issuer-url.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-groups-claim string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, імʼя власного запиту OpenID Connect для вказівки груп користувачів. Очікується, що значенням параметра буде рядок або масив рядків. Цей прапорець є експериментальним, будь ласка, зверніться до документації з автентифікації для отримання більш детальної інформації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-groups-prefix string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, до всіх груп буде додано цей префікс, щоб запобігти конфліктам з іншими стратегіями автентифікації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-issuer-url string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>URL-адреса емітента OpenID, приймається тільки схема HTTPS. Якщо встановлено, він буде використаний для перевірки OIDC JSON Web Token (JWT).</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-required-claim &lt;comma-separated 'key=value' pairs&gt;</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пара key=value, яка описує необхідний реквізит в ідентифікаторі. Якщо встановлено, перевіряється, що реквізит присутній в ідентифікаторі з відповідним значенням. Повторіть цей прапорець, щоб вказати декілька реквізитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-signing-algs strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "RS256"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список дозволених алгоритмів асиметричного підпису JOSE через кому. JWT з підтримуваними значеннями заголовка 'alg': RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512. Значення визначені в RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "sub"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Запит OpenID для використання в якості імені користувача. Зауважте, що не гарантується унікальність та незмінність запитів, відмінних від стандартного ('sub'). Цей прапорець є експериментальним, будь ласка, зверніться до документації з автентифікації для отримання більш детальної інформації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--oidc-username-prefix string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вказано, всі імена користувачів будуть доповнені цим значенням. Якщо не вказано, до імен користувачів, відмінних від "email", буде додано префікс URL-адреси емітента, щоб уникнути зіткнень. Щоб пропустити будь-яку префіксацію, вкажіть значення '-'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--peer-advertise-ip string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено і ввімкнено функцію UnknownVersionInteroperabilityProxy, цей IP буде використовуватися одноранговими kube-apiserverʼами для проксі-запитів до цього kube-apiserverʼа, коли запит не може бути оброблений одноранговим через невідповідність версій між kube-apiserʼами. Цей прапорець використовується лише у кластерах, сконфігурованих з декількома kube-apiserverʼами для забезпечення високої доступності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--peer-advertise-port string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо цей прапорець встановлено і ввімкнено функцію UnknownVersionInteroperabilityProxy, цей порт використовуватиметься одноранговими kube-apiserver'ами для проксі-запитів до цього kube-apiserver'а, коли запит не може бути оброблений одноранговим через невідповідність версій між kube-apiserver'ами. Цей прапорець використовується лише у кластерах, сконфігурованих з декількома kube-apiserver'ами для забезпечення високої доступності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--peer-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено і ввімкнено функцію UnknownVersionInteroperabilityProxy, цей файл буде використано для перевірки сертифікатів обслуговування однорангових kube-apiserver серверів. Цей прапорець використовується лише у кластерах, сконфігурованих з декількома kube-apiserver'ами для забезпечення високої доступності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-address-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення дорівнює true, SO_REUSEADDR буде використано при привʼязці порту. Це дозволяє паралельно привʼязуватись до підстановочних IP-адрес, таких як 0.0.0.0, і до конкретних IP-адрес, а також дозволяє уникнути очікування ядром звільнення сокетів у стані TIME_WAIT. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-port-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, SO_REUSEPORT буде використано при привʼязці порту, що дозволяє більш ніж одному екземпляру привʼязуватися до однієї адреси та порту. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть профілювання через веб-інтерфейс host:port/debug/pprof/</p></td>
      </tr>
      <tr>
         <td colspan="2">--proxy-client-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Клієнтський сертифікат, що використовується для підтвердження особи агрегатора або kube-apiserver, коли необхідно здійснити виклик під час запиту. Це включає проксирування запитів до користувацького API-сервера та виклики до втулків допуску webhook. Очікується, що цей сертифікат містить підпис від CA, вказаного у прапорі --requestheader-client-ca-file. Цей CA публікується в configmap 'extension-apiserver-authentication' у просторі імен kube-system. Компоненти, що отримують виклики від kube-aggregator, повинні використовувати цей CA для виконання своєї частини взаємної TLS перевірки.</p></td>
      </tr>
      <tr>
         <td colspan="2">--proxy-client-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Приватний ключ для клієнтського сертифіката, що використовується для підтвердження особи агрегатора або kube-apiserver, коли необхідно здійснити виклик під час запиту. Це включає проксирування запитів до користувацького API-сервера та виклики до втулків допуску webhook.</p></td>
      </tr>
      <tr>
         <td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Необовʼязкове поле, що вказує на тривалість, протягом якої обробник повинен тримати запит відкритим, перш ніж завершити його виконання. Це стандартний таймаут для запитів, але його можна перевизначити за допомогою прапорців, таких як --min-request-timeout для певних типів запитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-allowed-names strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список загальних імен клієнтських сертифікатів, щоб дозволити вказувати імена користувачів у заголовках, визначених параметром --requestheader-username-headers. Якщо він порожній, можна використовувати будь-який сертифікат клієнта, підтверджений центрами сертифікації у файлі --requestheader-client-ca-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пакет кореневих сертифікатів для перевірки клієнтських сертифікатів на вхідних запитах перед тим, як довіряти імена користувачів у заголовках, визначених параметром --requestheader-username-headers. ПОПЕРЕДЖЕННЯ: зазвичай не залежить від авторизації, яку вже виконано для вхідних запитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-extra-headers-prefix strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список префіксів заголовків запитів для перевірки. Запропоновано X-Remote-Extra-.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-group-headers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність груп. Пропонується X-Remote-Group.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-uid-headers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність UID. Пропонується X-Remote-Uid. Потребує увімкнення функції RemoteRequestHeaderUID.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-username-headers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність імен користувачів. X-Remote-User є поширеним.</p></td>
      </tr>
      <tr>
         <td colspan="2">--runtime-config &lt;comma-separated 'key=value' pairs&gt;</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пар key=value, які вмикають або вимикають вбудовані API. Підтримувані параметри:<br/>
         v1=true|false для основної групи API<br/>
         &lt;group&gt;/&lt;version&gt;=true|false для певної групи API та версії (наприклад, apps/v1=true) <br/>
         api/all=true|false контролює всі версії API<br/>
         api/ga=true|false контролює всі версії API у формі v[0-9]+<br/>
         api/beta=true| false контролює всі версії API форми v[0-9]+beta[0-9]+<br/>
         api/alpha=true|false контролює всі версії API форми v[0-9]+alpha[0 -9]+<br/>
         api/legacy застаріло та буде видалено в наступній версії</p></td>
      </tr>
      <tr>
         <td colspan="2">--runtime-config-emulation-forward-compatible</td>
      </tr>
      <tr>
         <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, API, ідентифіковані групою/версією, які ввімкнено в прапорці --runtime-config, будуть встановлені, навіть якщо він буде введено після версії емуляції. Якщо значення false, сервер не запуститься, якщо будь-які API, ідентифіковані групою/версією, які ввімкнено в прапорці --runtime-config, будуть введені після версії емуляції. Можна встановити значення true, лише якщо версія емуляції нижча за двійкову версію.</p></td>
      </tr>
      <tr>
         <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 6443</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, на якому буде обслуговуватися HTTPS з автентифікацією та авторизацією. Його не можна вимкнути за допомогою 0.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-extend-token-expiration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Вмикає прогнозоване продовження терміну дії облікового запису під час генерації токенів, що допомагає безпечному переходу від застарілих токенів до привʼязаних токенів облікових записів. Якщо цей прапорець увімкнено, термін дії токенів, що вводяться, буде подовжено до 1 року, щоб запобігти несподіваним збоям під час переходу, ігноруючи значення параметра service-account-max-token-expiration.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-issuer strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Ідентифікатор емітента токенів службового облікового запису. Емітент вказуватиме цей ідентифікатор у запиті &quot;iss&quot; на видачу випущених токенів. Це значення є рядком або URI. Якщо цей параметр не є дійсним URI згідно зі специфікацією OpenID Discovery 1.0, функція ServiceAccountIssuerDiscovery залишиться вимкненою, навіть якщо для функції gate буде встановлено значення true. Наполегливо рекомендується, щоб це значення відповідало специфікації OpenID: https://openid.net/specs/openid-connect-discovery-1_0.html. На практиці це означає, що service-account-issuer має бути URL-адресою https. Також наполегливо рекомендується, щоб ця URL-адреса могла обслуговувати документи виявлення OpenID за адресою {service-account-issuer}/.well-known/openid-configuration. Якщо цей прапорець вказано декілька разів, перший раз використовується для генерації токенів, а всі інші - для визначення прийнятних емітентів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-jwks-uri string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Перевизначає URI для набору веб-ключів JSON (JSON Web Key Set) у документі виявлення, що надсилається за адресою /.well-known/openid-configuration. Цей прапорець корисний, якщо документ виявлення та набір ключів надаються сторонам, що довіряють, за URL-адресою, відмінною від зовнішньої URL-адреси сервера API (автоматично визначеною або перевизначеною за допомогою external-hostname).</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-key-file strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. The specified file can contain multiple keys, and the flag can be specified multiple times with different files. If unspecified, --tls-private-key-file is used. Must be specified when --service-account-signing-key-file is provided</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, підтвердити наявність токенів ServiceAccount в etcd як частину автентифікації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-max-token-expiration duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний термін дії токена, створеного емітентом токенів службового облікового запису. Якщо запитується дійсний TokenRequest з тривалістю дії, що перевищує це значення, буде випущено токен з тривалістю дії, що дорівнює цьому значенню.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-signing-endpoint string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до сокета, який прослуховує зовнішній підписувач JWT. Цей прапорець є взаємовиключним з --service-account-signing-key-file та --service-account-key-file. Потребує увімкнення функціональної можливості gate (ExternalServiceAccountTokenSigner)</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-account-signing-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу, який містить поточний приватний ключ емітента токенів службового облікового запису. Цим приватним ключем емітент підписуватиме видані токени ідентифікаторів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-cluster-ip-range string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Діапазон IP-адрес у нотації CIDR, з якого призначаються сервісні кластерні IP-адреси. Він не повинен перетинатися з будь-якими діапазонами IP, призначеними вузлам або Podʼами. Максимальний допустимий діапазон — два двостекових CIDR.</p></td>
      </tr>
      <tr>
         <td colspan="2">--service-node-port-range &lt;a string in the form 'N1-N2'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30000-32767</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Діапазон портів для резервування для сервісів з видимістю NodePort.  Він не повинен перетинатися з ефемерним діапазоном портів на вузлах.  Приклад: '30000-32767'. Включно з обох кінців діапазону.</p></td>
      </tr>
      <tr>
         <td colspan="2">--show-hidden-metrics-for-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Попередня версія, для якої ви хочете показати приховані метрики. Значення має лише попередня мінорна версія, інші значення не будуть дозволені. Формат: &lt;major&gt;.&lt;minor&gt;, наприклад: '1.16'. Мета цього формату - переконатися, що ви маєте можливість помітити, що наступний реліз приховує додаткові метрики, замість того, щоб дивуватися, коли вони будуть назавжди вилучені в наступному релізі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--shutdown-delay-duration duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час затримки завершення роботи. Протягом цього часу сервер продовжує обслуговувати запити у звичайному режимі. Точки доступу /healthz і /livez повертатимуть успішне завершення, але /readyz одразу ж поверне помилку. Належне завершення роботи почнється після закінчення цієї затримки. Це може бути використано для того, щоб дозволити балансувальнику навантаження припинити надсилання трафіку на цей сервер.</p></td>
      </tr>
      <tr>
         <td colspan="2">--shutdown-send-retry-after</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, HTTP-сервер продовжуватиме прослуховування доти, доки всі недовготривалі запити у процесі виконання не будуть вичерпані, під час цього вікна всі вхідні запити будуть відхилені з кодом статусу 429 та заголовком відповіді "Retry-After", крім того, встановлюється заголовок відповіді "Connection: close" для того, щоб розірвати TCP-зʼєднання, коли воно не виконується.</p></td>
      </tr>
      <tr>
         <td colspan="2">--shutdown-watch-termination-grace-period duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей параметр, якщо його встановлено, вказує на максимальну тривалість пільгового періоду, протягом якого apiserver буде чекати, поки активні запити watch не вичерпаються під час вікна належного вимкнення сервера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--storage-backend string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Бекенд сховища для збереження даних. Параметри: 'etcd3' (стандартно).</p></td>
      </tr>
      <tr>
         <td colspan="2">--storage-initialization-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальний час очікування ініціалізації сховища перед оголошенням готовності apiserver. Стандартно — 1m.</p></td>
      </tr>
      <tr>
         <td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "application/vnd.kubernetes.protobuf"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип носія для зберігання обʼєктів у сховищі. Деякі ресурси або бекенди сховища можуть підтримувати лише певний тип носія і ігноруватимуть цей параметр. Підтримувані медіа-типи: [application/json, application/yaml, application/vnd.kubernetes.protobuf].</p></td>
      </tr>
      <tr>
         <td colspan="2">--strict-transport-security-directives strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список директив для HSTS через кому. Якщо цей список порожній, то директиви HSTS не будуть додані. Приклад: 'max-age=31536000,includeSubDomains,preload'</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить стандартний сертифікат x509 для HTTPS. (Сертифікат центру сертифікації, якщо такий є, додається після сертифіката сервера). Якщо HTTPS-сервіс увімкнено, а --tls-cert-file і --tls-private-key-file не вказано, для публічної адреси буде згенеровано самопідписаний сертифікат і ключ, які буде збережено в теці, вказаній в --cert-dir.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cipher-suites strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список наборів шифрів для сервера. Якщо не вказано, буде використано стандартний набір шифрів Go.<br/>Значення, яким надається перевага: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>Небезпечні значення: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-min-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна підтримувана версія TLS. Можливі значення: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-private-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить стандартний приватний ключ x509, який відповідає --tls-cert-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-sni-cert-key string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пара шляхів до файлів сертифіката x509 і приватного ключа, до яких за бажанням додається список доменних шаблонів, які є повними доменними іменами, можливо, з префіксальними підстановчими сегментами. Доменні шаблони також дозволяють використовувати IP-адреси, але IP-адреси слід використовувати лише в тому випадку, якщо apiserver має доступ до IP-адреси, запитуваної клієнтом. Якщо шаблони домену не надано, витягуються імена сертифікатів. Збіги без підстановочних знаків мають перевагу над збігами з підстановочними знаками, а явні шаблони доменів мають перевагу над отриманими іменами. Для кількох пар ключ/сертифікат використовуйте --tls-sni-cert-key кілька разів. Приклади: &quot;example.crt,example.key&quot; або &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--token-auth-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, файл, який буде використано для захисту захищеного порту сервера API за допомогою автентифікації за допомогою токенів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tracing-config-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл з конфігурацією трасування apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">-v, --v int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>число рівня деталізації логу</p></td>
      </tr>
      <tr>
         <td colspan="2">--version version[=true]</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та виходить; --version=vX.Y.Z... встановлює вказану версію</p></td>
      </tr>
      <tr>
         <td colspan="2">--vmodule pattern=N,...</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>список параметрів pattern=N, розділених комами, для файлового фільтрування логу (працює лише для текстового формату логу).</p></td>
      </tr>
      <tr>
         <td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть кешування watch в apiserver</p></td>
      </tr>
      <tr>
         <td colspan="2">--watch-cache-sizes strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Налаштування розміру кешу для деяких ресурсів (pods, nodes і т.д.), через кому. Формат індивідуальних налаштувань: resource[.group]#size, де resource —  малі літери множини (без версії), group пропущено для ресурсів apiVersion v1 (застаріле ядро API) і включено для інших, а size — число. Цей параметр має значення лише для ресурсів, вбудованих у apiserver, а не для ресурсів, визначених CRD або зібраних із зовнішніх серверів, і використовується лише у випадку, якщо увімкнено watch-cache. Єдиним допустимим значенням розміру є нуль, що означає вимкнення кешування watch для відповідного ресурсу; усі ненульові значення є еквівалентними і означають, що кешування для цього ресурсу не вимкнено.</p></td>
      </tr>
   </tbody>
</table>
