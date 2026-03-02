---
title: Kubelet Configuration (v1beta1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1beta1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1beta1-CredentialProviderConfig)
- [ImagePullIntent](#kubelet-config-k8s-io-v1beta1-ImagePullIntent)
- [ImagePulledRecord](#kubelet-config-k8s-io-v1beta1-ImagePulledRecord)
- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
- [SerializedNodeConfigSource](#kubelet-config-k8s-io-v1beta1-SerializedNodeConfigSource)

## `FormatOptions` {#FormatOptions}

**Зʼявляється в:**

- [LoggingConfiguration](#LoggingConfiguration)

FormatOptions містить параметри для різних форматів логування.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>text</code> <b>[Обовʼязково]</b><br/>
<a href="#TextOptions"><code>TextOptions</code></a>
</td>
<td>
   <p>[Alpha] Text містить параметри для формату логування "text". Доступно лише при увімкненій функціональній можливості LoggingAlphaOptions.</p>
</td>
</tr>
<tr><td><code>json</code> <b>[Обовʼязково]</b><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <p>[Alpha] JSON містить параметри для формату журналювання "json". Доступно лише при увімкненій функціональній можливості LoggingAlphaOptions.</p>
</td>
</tr>
</tbody>
</table>

## `JSONOptions` {#JSONOptions}

**Зʼявляється в:**

- [FormatOptions](#FormatOptions)

JSONOptions містить параметри для формату логування "json".

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>OutputRoutingOptions</code> <b>[Обовʼязково]</b><br/>
<a href="#OutputRoutingOptions"><code>OutputRoutingOptions</code></a>
</td>
<td>(Члени <code>OutputRoutingOptions</code> вбудовані в цей тип.)
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `LogFormatFactory` {#LogFormatFactory}

LogFormatFactory забезпечує підтримку певного додаткового формату логу, який не є стандартним.

## `LoggingConfiguration` {#LoggingConfiguration}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

LoggingConfiguration містить параметри для логування.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>format</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Format Flag визначає структуру повідомлень логу. Станадртне значення для формату — <code>text</code></p>
</td>
</tr>
<tr><td><code>flushFrequency</code> <b>[Обовʼязково]</b><br/>
<a href="#TimeOrMetaDuration"><code>TimeOrMetaDuration</code></a>
</td>
<td>
   <p>Максимальний час між очищенням логів. Якщо рядок, розбирається як тривалість (наприклад, &quot;1s&quot;). Якщо ціле число, максимальна кількість наносекунд (наприклад, 1с = 1000000000). Ігнорується, якщо обраний механізм логування записує повідомлення без буферизації.</p>
</td>
</tr>
<tr><td><code>verbosity</code> <b>[Обовʼязково]</b><br/>
<a href="#VerbosityLevel"><code>VerbosityLevel</code></a>
</td>
<td>
   <p>Verbosity є порогом, який визначає, які повідомлення логу записуються. Стандартне значення — нуль, що записує лише найбільш важливі повідомлення. Більші значення дозволяють додаткові повідомлення. Повідомлення про помилки завжди записуються.</p>
</td>
</tr>
<tr><td><code>vmodule</code> <b>[Обовʼязково]</b><br/>
<a href="#VModuleConfiguration"><code>VModuleConfiguration</code></a>
</td>
<td>
   <p>VModule переозначає поріг детальності для окремих файлів. Підтримується тільки для формату логу "text".</p>
</td>
</tr>
<tr><td><code>options</code> <b>[Обовʼязково]</b><br/>
<a href="#FormatOptions"><code>FormatOptions</code></a>
</td>
<td>
   <p>[Alpha] Options містить додаткові параметри, специфічні для різних форматів логування. Використовуються лише параметри для обраного формату, але всі вони перевіряються. Доступно тільки при увімкненій функціональній можливості LoggingAlphaOptions.</p>
</td>
</tr>
</tbody>
</table>

## `LoggingOptions` {#LoggingOptions}

LoggingOptions можна використовувати з ValidateAndApplyWithOptions для перевизначення деяких глобальних стандартних значень.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>ErrorStream</code> <b>[Обовʼязково]</b><br/>
<a href="https://pkg.go.dev/io#Writer"><code>io.Writer</code></a>
</td>
<td>
   <p>ErrorStream можна використовувати для перевизначення стандартного значення os.Stderr.</p>
</td>
</tr>
<tr><td><code>InfoStream</code> <b>[Обовʼязково]</b><br/>
<a href="https://pkg.go.dev/io#Writer"><code>io.Writer</code></a>
</td>
<td>
   <p>InfoStream можна використовувати для перевизначення стандартного значення os.Stdout.</p>
</td>
</tr>
</tbody>
</table>

## `OutputRoutingOptions` {#OutputRoutingOptions}

**Зʼявляється в:**

- [JSONOptions](#JSONOptions)

- [TextOptions](#TextOptions)

OutputRoutingOptions містить параметри, що підтримуються як для формату "text", так і для "json".

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>splitStream</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p>[Alpha] SplitStream перенаправляє повідомлення про помилки на stderr, тоді як інформаційні повідомлення відправляються на stdout з буферизацією. Стандартне значення — записувати обидва потоки у stdout без буферизації. Доступно тільки коли увімкнено функціональну можливість LoggingAlphaOptions.</p>
</td>
</tr>
<tr><td><code>infoBufferSize</code> <b>[Обовʼязково]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   <p>[Alpha] InfoBufferSize встановлює розмір інформаційного потоку при використанні розділених потоків. Стандартне значення — нуль, що вимикає буферизацію. Доступно тільки коли увімкнено функціональну можливість LoggingAlphaOptions.</p>
</td>
</tr>
</tbody>
</table>

## `TextOptions` {#TextOptions}

**Зʼявляється в:**

- [FormatOptions](#FormatOptions)

TextOptions містить параметри для формату логування "text".

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>OutputRoutingOptions</code> <b>[Обовʼязково]</b><br/>
<a href="#OutputRoutingOptions"><code>OutputRoutingOptions</code></a>
</td>
<td>(Члени <code>OutputRoutingOptions</code> вбудовані в цей тип.)
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `TimeOrMetaDuration` {#TimeOrMetaDuration}

**Зʼявляється в:**

- [LoggingConfiguration](#LoggingConfiguration)

TimeOrMetaDuration присутній лише для зворотної сумісності з полем flushFrequency, і нові поля повинні використовувати metav1.Duration.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>Duration</code> <b>[Обовʼязково]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>Duration містить тривалість</p>
</td>
</tr>
<tr><td><code>-</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p>SerializeAsString контролює, чи буде значення серіалізоване як рядок чи ціле число</p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`{#TracingConfiguration}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

TracingConfiguration надає версіоновану конфігурацію для клієнтів OpenTelemetry tracing.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>Endpoint колектора, до якого цей компонент буде відправляти трасування. Зʼєднання не є захищеним і наразі не підтримує TLS. Рекомендується не задавати, і endpoint стандартно буде otlp grpc, localhost:4317.</p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p>SamplingRatePerMillion — кількість зразків для збору на мільйон спанів. Рекомендується не задавати. Якщо не задано, пробник поважає темп рідного спану, але в іншому випадку ніколи не здійснює пробу.</p>
</td>
</tr>
</tbody>
</table>

## `VModuleConfiguration` {#VModuleConfiguration}

(Аліас для `[]k8s.io/component-base/logs/api/v1.VModuleItem`)

**Зʼявляється в:**

- [LoggingConfiguration](#LoggingConfiguration)

VModuleConfiguration — це колекція окремих імен файлів або шаблонів
та відповідний поріг докладності.

## `VerbosityLevel` {#VerbosityLevel}

(Аліас для `uint32`)

**Зʼявляється в:**

- [LoggingConfiguration](#LoggingConfiguration)

VerbosityLevel представляє поріг докладності для klog або logr.

## `CredentialProviderConfig` {#kubelet-config-k8s-io-v1beta1-CredentialProviderConfig}

CredentialProviderConfig — це конфігурація, яка містить інформацію про кожного постачальника облікових даних exec. Kubelet зчитує цю конфігурацію з диска та активує кожного постачальника, як зазначено в типі CredentialProvider.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
<tr><td><code>providers</code> <b>[Обовʼязково]</b><br/>
<a href="#kubelet-config-k8s-io-v1beta1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers — це список втулків постачальників облікових даних, які будуть активовані kubelet. Кілька постачальників можуть відповідати одному образу, у такому випадку облікові дані від усіх постачальників будуть повернуті kubelet. Якщо кілька постачальників викликаються для одного образуу, результати обʼєднуються. Якщо провайдери повертають ключі авторизації, що збігаються, спочатку буде використано значення від провайдера, що знаходиться раніше у списку.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullIntent`     {#kubelet-config-k8s-io-v1beta1-ImagePullIntent}

ImagePullIntent — це запис про спробу kubelet завантажити образ.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePullIntent</code></td></tr>


<tr><td><code>image</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Image — це специфікація образу з поля <code>image</code> контейнера. Імʼя файлу — це хеш SHA-256 цього значення. Це зроблено для уникнення використання в імені файлу небезпечних символів, таких як «:» і «/».</p>
</td>
</tr>
</tbody>
</table>

## `ImagePulledRecord`     {#kubelet-config-k8s-io-v1beta1-ImagePulledRecord}

ImagePullRecord — це запис образу, який було отримано kubelet.

Якщо в полі `kubernetesSecrets` немає записів, а `nodeWideCredentials` і `anonymous` мають значення `false`, під час наступного запиту образу, представленого цим записом, необхідно повторно перевірити облікові дані.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePulledRecord</code></td></tr>


<tr><td><code>lastUpdatedTime</code> <b>[Обовʼязково]</b><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>LastUpdatedTime — час останнього оновлення цього запису.</p>
</td>
</tr>
<tr><td><code>imageRef</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>ImageRef — це посилання на образ, представлений цим файлом, отриманим від CRI. Імʼя файлу — це хеш SHA-256 цього значення. Це зроблено для уникнення використання в імені файлу небезпечних символів, таких як ':' і '/'.</p>
</td>
</tr>
<tr><td><code>credentialMapping</code> <b>[Обовʼязково]</b><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ImagePullCredentials"><code>map[string]ImagePullCredentials</code></a>
</td>
<td>
   <p>CredentialMapping відображає <code>image</code> на набір облікових даних, з якими він був раніше витягнутий. <code>image</code> в цьому випадку є вмістом поля <code>image</code> контейнера pod, з якого було видалено теґ/дайджест.
   <p>Приклад: Контейнер запитує <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> image: &quot;credentialMapping&quot;: { &quot;hello-world&quot;: { &quot;nodePodsAccessible&quot;: true } }</p>
</td>
</tr>
</tbody>
</table>

## `KubeletConfiguration` {#kubelet-config-k8s-io-v1beta1-KubeletConfiguration}

KubeletConfiguration містить конфігурацію для Kubelet.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeletConfiguration</code></td></tr>
<tr><td><code>enableServer</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p>enableServer вмикає захищений сервер Kubelet. Примітка: незахищений порт Kubelet контролюється параметром readOnlyPort. Стандартне значення: true</p>
</td>
</tr>
<tr><td><code>staticPodPath</code><br/>
<code>string</code>
</td>
<td>
   <p>staticPodPath — це шлях до теки з локальними (статичними) Podʼами для запуску, або шлях до окремого статичного файлу Podʼа. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>podLogsDir</code><br/>
<code>string</code>
</td>
<td>
   <p>podLogsDir - власний шлях до кореневої теки, який kubelet використовуватиме для розміщення лог-файлів под'ів. Стандартно: &quot;/var/log/pods/&quot; Примітка: не рекомендується використовувати теку temp як теку логу, оскільки це може спричинити неочікувану поведінку у багатьох місцях.</p>
</td>
</tr>
<tr><td><code>syncFrequency</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>syncFrequency — максимальний період між синхронізацією запущених контейнерів і конфігурацією. Стандартно: &quot;1m&quot];</p>
</td>
</tr>
<tr><td><code>fileCheckFrequency</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>fileCheckFrequency — тривалість між перевірками конфігураційних файлів на наявність нових даних. Стандартно: &quot;20s&quot];</p>
</td>
</tr>
<tr><td><code>httpCheckFrequency</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>httpCheckFrequency — інтервал між перевірками http на наявність нових даних. Стандартно: &quot;20s&quot];</p>
</td>
</tr>
<tr><td><code>staticPodURL</code><br/>
<code>string</code>
</td>
<td>
   <p>staticPodURL — це URL-адреса для доступу до статичних Podʼів для запуску. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>staticPodURLHeader</code><br/>
<code>map[string][]string</code>
</td>
<td>
   <p>staticPodURLHeader — map slice із заголовками HTTP, які потрібно використовувати при доступі до podURL. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>address</code><br/>
<code>string</code>
</td>
<td>
   <p>address — IP-адреса, на якій буде працювати Kubelet (встановлено на 0.0.0.0 для всіх інтерфейсів). Стандартно: &quot;0.0.0.0&quot;;</p>
</td>
</tr>
<tr><td><code>port</code><br/>
<code>int32</code>
</td>
<td>
   <p>port — це порт, на якому буде обслуговуватися Kubelet. Номер порту має бути в діапазоні від 1 до 65535 включно. Стандартно: 10250</p>
</td>
</tr>
<tr><td><code>readOnlyPort</code><br/>
<code>int32</code>
</td>
<td>
   <p>readOnlyPort - це порт тільки для читання, на якому Kubelet буде працювати без автентифікації/авторизації. Номер порту повинен бути в діапазоні від 1 до 65535 включно. Встановлення цього поля у 0 вимикає сервіс тільки для читання. Стандартно: 0 (вимкнено)</p>
</td>
</tr>
<tr><td><code>tlsCertFile</code><br/>
<code>string</code>
</td>
<td>
   <p>tlsCertFile — файл, що містить сертифікат x509 для HTTPS. (Сертифікат центру сертифікації, якщо такий є, додається після сертифіката сервера). Якщо tlsCertFile і tlsPrivateKeyFile не вказано, самопідписаний сертифікат і ключ генеруються для публічної адреси і зберігаються у теці, яку передано у прапорці Kubelet --cert-dir. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>tlsPrivateKeyFile</code><br/>
<code>string</code>
</td>
<td>
   <p>tlsPrivateKeyFile — файл, що містить приватний ключ x509, який відповідає tlsCertFile. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>tlsCipherSuites</code><br/>
<code>[]string</code>
</td>
<td>
   <p>tlsCipherSuites — список дозволених наборів шифрів для сервера. Зверніть увагу, що набори шифрів TLS 1.3 не налаштовуються. Значення беруться з констант пакета tls (https://golang.org/pkg/crypto/tls/#pkg-constants). Стандартно: nil</p>
</td>
</tr>
<tr><td><code>tlsMinVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>tlsMinVersion — мінімальна підтримувана версія TLS. Значення беруться з констант пакета tls (https://golang.org/pkg/crypto/tls/#pkg-constants). Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>rotateCertificates</code><br/>
<code>bool</code>
</td>
<td>
   <p>rotateCertificates дозволяє ротацію клієнтських сертифікатів. Kubelet запросить новий сертифікат з API certificates.k8s.io. Для цього потрібен затверджувач, який схвалює запити на підписання сертифікатів. Стандартно: false</p>
</td>
</tr>
<tr><td><code>serverTLSBootstrap</code><br/>
<code>bool</code>
</td>
<td>
   <p>serverTLSBootstrap вмикає bootstrap серверного сертифікату. Замість того, щоб самостійно підписувати серверний сертифікат, Kubelet буде запитувати сертифікат з API 'certificates.k8s.io'. Для цього потрібен затверджувач для схвалення запитів на підписання сертифікатів (CSR). Функція RotateKubeletServerCertificate має бути ввімкнена при встановленні цього поля. Стандартно: false</p>
</td>
</tr>
<tr><td><code>authentication</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletAuthentication"><code>KubeletAuthentication</code></a>
</td>
<td>
   <p>authentication визначає спосіб автентифікації запитів до сервера Kubelet. Стандартно:
<pre>anonymous:
  enabled: false
webhook:
  enabled: true
  cacheTTL: &quot;2m&quot;</pre></p>
</td>
</tr>
<tr><td><code>authorization</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletAuthorization"><code>KubeletAuthorization</code></a>
</td>
<td>
   <p>authorization визначає спосіб авторизації запитів до сервера Kubelet. Стандартно:<pre>
mode: Webhook
webhook:
  cacheAuthorizedTTL: &quot;5m&quot;
  cacheUnauthorizedTTL: &quot;30s&quot;</pre></p>
</td>
</tr>
<tr><td><code>registryPullQPS</code><br/>
<code>int32</code>
</td>
<td>
   <p>registryPullQPS — ліміт отримання образів з реєстру за секунду. Значення не повинно бути відʼємним числом. Встановлення значення 0 означає відсутність обмеження. Стандартно: 5</p>
</td>
</tr>
<tr><td><code>registryBurst</code><br/>
<code>int32</code>
</td>
<td>
   <p>registryBurst — максимальний розмір стрімких витягань, тимчасово дозволяє стрімким витяганням досягати цього числа, але при цьому не перевищувати registryPullQPS. Значення не повинно бути відʼємним числом. Використовується тільки якщо registryPullQPS більше 0. Стандартно: 10</p>
</td>
</tr>
<tr><td><code>imagePullCredentialsVerificationPolicy</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy"><code>ImagePullCredentialsVerificationPolicy</code></a>
</td>
<td>
   <p>imagePullCredentialsVerificationPolicy визначає, як слід перевіряти облікові дані, коли pod запитує образ, який вже присутній на вузлі:</p>
<ul>
<li>NeverVerify
<ul>
<li>будь-хто на вузлі може використовувати будь- який образ, наявний на вузлі</li>
</ul>
</li>
<li>NeverVerifyPreloadedImages
<ul>
<li>образи, які було витягнуто на вузол не за допомогою kubelet, можна використовувати без повторної перевірки облікових даних для витягування</li>
</ul>
</li>
<li>NeverVerifyAllowlistedImages
<ul>
<li>як &quot;NeverVerifyPreloadedImages&quot;, але тільки образи вузлів з <code>preloadedImagesVerificationAllowlist</code> не потребують повторної перевірки</li>
</ul>
</li>
<li>AlwaysVerify
<ul>
<li>всі образи потребують перевірки облікових даних</li>
</ul>
</li>
</ul>
</td>
</tr>
<tr><td><code>preloadedImagesVerificationAllowlist</code><br/>
<code>[]string</code>
</td>
<td>
   <p>preloadedImagesVerificationAllowlist визначає список образів, які звільняються від перевірки облікових даних для політики &quot;NeverVerifyAllowlistedImages&quot; <code>imagePullCredentialsVerificationPolicy</code>. Список може містити підстановочний суфікс &quot;/&ast;&quot; для повного сегмента шляху. Використовуйте тільки специфікації файлів образів без теґу або дайджесту образу.</p>
</td>
</tr>
<tr><td><code>eventRecordQPS</code><br/>
<code>int32</code>
</td>
<td>
   <p>eventRecordQPS — максимальна кількість створених подій за секунду. Якщо 0, то обмеження не застосовується. Значення не може бути відʼємним. Стандартно: 50</p>
</td>
</tr>
<tr><td><code>eventBurst</code><br/>
<code>int32</code>
</td>
<td>
   <p>eventBurst - максимальний розмір сплеску створення подій, тимчасово дозволяє створювати події до цього числа, але не більше ніж eventRecordQPS. Це поле не може бути відʼємним числом і використовується лише тоді, коли eventRecordQPS &gt; 0. Стандартно: 100</p>
</td>
</tr>
<tr><td><code>enableDebuggingHandlers</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableDebuggingHandlers вмикає точки доступу до логів на сервері та локальний запуск контейнерів і команд, включно з функціями exec, attach, logs та portforward. Стандартно: true</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableContentionProfiling вмикає профілювання блоків, якщо enableDebuggingHandlers має значення true. Стандартно: false</p>
</td>
</tr>
<tr><td><code>healthzPort</code><br/>
<code>int32</code>
</td>
<td>
   <p>healthzPort — порт точки доступу localhost healthz (для вимкнення встановлюється на 0). Допустиме значення від 1 до 65535. Стандартне значення: 10248</p>
</td>
</tr>
<tr><td><code>healthzBindAddress</code><br/>
<code>string</code>
</td>
<td>
   <p>healthzBindAddress - IP-адреса для сервера healthz. Стандартно: &quot;127.0.0.1&quot;;</p>
</td>
</tr>
<tr><td><code>oomScoreAdj</code><br/>
<code>int32</code>
</td>
<td>
   <p>oomScoreAdj — значення oom-score-adj для процесу kubelet. Значення має бути в діапазоні [-1000, 1000]. Стандартно: -999</p>
</td>
</tr>
<tr><td><code>clusterDomain</code><br/>
<code>string</code>
</td>
<td>
   <p>clusterDomain — DNS-домен для цього кластера. Якщо задано, kubelet налаштує всі контейнери на пошук у цьому домені на додаток до пошукових доменів хоста. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>clusterDNS</code><br/>
<code>[]string</code>
</td>
<td>
   <p>clusterDNS — список IP-адрес для DNS-сервера кластера. Якщо встановлено, kubelet налаштує всі контейнери на використання цього списку для DNS-розпізнавання замість DNS-серверів хоста. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>streamingConnectionIdleTimeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>streamingConnectionIdleTimeout — максимальний час, протягом якого потокове зʼєднання може простоювати, перш ніж зʼєднання буде автоматично закрито. Застаріле: більше не має ніякого ефекту. Стандартно: &quot;4h&quot;;</p>
</td>
</tr>
<tr><td><code>nodeStatusUpdateFrequency</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeStatusUpdateFrequency - частота, з якою kubelet обчислює статус вузла. Якщо функцію оренди вузлів не увімкнено, це також частота, з якою kubelet надсилає статус вузла майстру. Примітка: Якщо функцію оренди вузла не увімкнено, будьте обережні при зміні константи, вона має працювати з nodeMonitorGracePeriod у nodecontroller. Стандартно: &quot;10s&quot;</p>
</td>
</tr>
<tr><td><code>nodeStatusReportFrequency</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeStatusReportFrequency — частота, з якою kubelet надсилає статус вузла майстру, якщо статус вузла не змінюється. Kubelet ігноруватиме цю частоту і відправлятиме статус вузла негайно, якщо буде виявлено будь-яку зміну. Використовується лише тоді, коли увімкнено функцію оренди вузлів. nodeStatusReportFrequency має стандартне значення 5m. Але якщо nodeStatusUpdateFrequency задано явно, стандартне значення nodeStatusReportFrequency буде встановлено на nodeStatusUpdateFrequency для зворотної сумісності. Стандартно: &quot;5m&quot];</p>
</td>
</tr>
<tr><td><code>nodeLeaseDurationSeconds</code><br/>
<code>int32</code>
</td>
<td>
   <p>nodeLeaseDurationSeconds - це тривалість, яку Kubelet встановить для відповідного lease. NodeLease надає індикатор справності вузла, змушуючи Kubelet створювати та періодично поновлювати договір оренди, названий на честь вузла, у просторі імен kube-node-lease. Якщо термін дії договору закінчується, вузол можна вважати несправним. Наразі оренда поновлюється кожні 10 секунд, згідно з KEP-0009. У майбутньому інтервал поновлення оренди може бути встановлений на основі тривалості оренди. Значення поля має бути більше 0. Стандартно: 40</p>
</td>
</tr>
<tr><td><code>imageMinimumGCAge</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>imageMinimumGCAge — мінімальний вік невикористаного образу перед тим, як його буде вилучено. Стандартно: &quot;2m&quot];</p>
</td>
</tr>
<tr><td><code>imageMaximumGCAge</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>imageMaximumGCAge — максимальний вік, протягом якого образ може бути невикористаним, перш ніж його буде вилучено у смітник. Стандартне значення цього поля - &quot;0s&quot;, що вимикає це поле - тобто образи не буде вилучено у смітник через те, що їх не було використано надто довго. Стандартно: &quot;0s&quot; (вимкнено)</p>
</td>
</tr>
<tr><td><code>imageGCHighThresholdPercent</code><br/>
<code>int32</code>
</td>
<td>
   <p>imageGCHighThresholdPercent — це відсоток використання диска, після якого завжди запускається прибирання образів. Відсоток обчислюється діленням значення цього поля на 100, тому значення цього поля має бути від 0 до 100 включно. Якщо вказано, значення має бути більшим за imageGCLowThresholdPercent. Стандартно: 85</p>
</td>
</tr>
<tr><td><code>imageGCLowThresholdPercent</code><br/>
<code>int32</code>
</td>
<td>
   <p>imageGCLowThresholdPercent — це відсоток використання диска, до якого прибирання образів ніколи не виконуватиметься. Найнижчий відсоток використання диска для збирання сміття. Відсоток обчислюється діленням значення цього поля на 100, тому значення поля має бути у діапазоні від 0 до 100 включно. Якщо вказано, значення має бути меншим за imageGCHighThresholdPercent. Стандартно: 80</p>
</td>
</tr>
<tr><td><code>volumeStatsAggPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>volumeStatsAggPeriod — це частота для обчислення та кешування обсягу використання диска для всіх Podʼів. Стандартно: &quot;1m&quot;</p>
</td>
</tr>
<tr><td><code>kubeletCgroups</code><br/>
<code>string</code>
</td>
<td>
   <p>kubeletCgroups — абсолютна назва cgroups для ізоляції kubelet. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>systemCgroups</code><br/>
<code>string</code>
</td>
<td>
   <p>systemCgroups — абсолютна назва cgroups, до якої слід помістити усі неядерні процеси, які ще не знаходяться у контейнері. Порожньо, якщо немає контейнера. Скидання прапорця вимагає перезавантаження. Якщо це поле не порожнє, слід вказати cgroupRoot. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>cgroupRoot</code><br/>
<code>string</code>
</td>
<td>
   <p>cgroupRoot - це коренева cgroup, яку слід використовувати для Podʼів. Ця група обробляється під час виконання контейнера на основі принципу найкращих зусиль.</p>
</td>
</tr>
<tr><td><code>cgroupsPerQOS</code><br/>
<code>bool</code>
</td>
<td>
   <p>cgroupsPerQOS вмикає ієрархію CGroup на основі QoS: CGroups верхнього рівня для класів QoS і всі Burstable та BestEffort Pods підпорядковуються певній CGroup QoS верхнього рівня. Стандартно: true</p>
</td>
</tr>
<tr><td><code>cgroupDriver</code><br/>
<code>string</code>
</td>
<td>
   <p>cgroupDriver — це драйвер, який kubelet використовує для керування CGroups на хості (cgroupfs або systemd). Стандартно: &quot;cgroupfs&quot;;</p>
</td>
</tr>
<tr><td><code>cpuManagerPolicy</code><br/>
<code>string</code>
</td>
<td>
   <p>cpuManagerPolicy - назва політики, яку буде використано. Потребує увімкнення функціональних можливостей CPUManager. Стандартно: &quot;None&quot;</p>
</td>
</tr>
<tr><td><code>singleProcessOOMKill</code><br/>
<code>bool</code>
</td>
<td>
   <p>singleProcessOOMKill, якщо встановлено, запобігає встановленню прапорця <code>memory.oom.group</code> для контейнерних cgroups у cgroups v2. Це призводить до того, що процеси у контейнері буде знищено за допомогою OOM індивідуально, а не як групу. Це означає, що якщо прапорець має значення true, поведінка узгоджується з поведінкою cgroups v1. Стандартне значення визначається автоматично, якщо ви його не вкажете. У не-linux, таких як windows, дозволено лише null / absent. У cgroup v1 linux дозволено лише null / absent та true. У cgroup v2 linux дозволені значення null / absent, true і false. Стандартне значення — false.</p>
</td>
</tr>
<tr><td><code>cpuManagerPolicyOptions</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>cpuManagerPolicyOptions — це набір key=value, який дозволяє встановити додаткові опції для точного налаштування поведінки політик диспетчера процесорів.  Стандартно: nil</p>
</td>
</tr>
<tr><td><code>cpuManagerReconcilePeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cpuManagerReconcilePeriod - період узгодження для CPU Manager. Стандартне значення: &quot;10s&quot;</p>
</td>
</tr>
<tr><td><code>memoryManagerPolicy</code><br/>
<code>string</code>
</td>
<td>
   <p>memoryManagerPolicy - назва політики, яку використовуватиме менеджер памʼяті. Потребує увімкнення функціональної можливості MemoryManager. Стандартно: &quot;none&quot;</p>
</td>
</tr>
<tr><td><code>topologyManagerPolicy</code><br/>
<code>string</code>
</td>
<td>
   <p>topologyManagerPolicy — назва політики менеджера топології, яку слід використовувати. Допустимі значення включають:</p>
<ul>
<li><code>restricted</code>: kubelet дозволяє лише ті Podʼи, які мають оптимальне вирівнювання вузлів NUMA для запитуваних ресурсів;</li>
<li><code>best-effort</code>: kubelet надаватиме перевагу Podʼам з NUMA-вирівнюванням ресурсів процесора та пристроїв;</li>
<li><code>none</code>: kubelet не знає про вирівнювання NUMA ресурсів процесора та пристроїв під час роботи.</li>
<li><code>single-numa-node</code>: kubelet дозволяє використовувати лише Podʼи з єдиним NUMA-вирівнюванням ресурсів процесора та пристроїв.</li>
</ul>
<p>Default: &quot;none&quot;</p>
</td>
</tr>
<tr><td><code>topologyManagerScope</code><br/>
<code>string</code>
</td>
<td>
   <p>topologyManagerScope представляє обсяг генерації підказок топології, які запитує менеджер топології та генерують постачальники підказок. Допустимі значення включають:</p>
<ul>
<li><code>container</code>: політика топології застосовується для кожного контейнера окремо.</li>
<li><code>pod</code>: політика топології застосовується на основі кожного окремого блоку.</li>
</ul>
<p>Default: &quot;container&quot;</p>
</td>
</tr>
<tr><td><code>topologyManagerPolicyOptions</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>TopologyManagerPolicyOptions - це набір key=value, який дозволяє встановити додаткові опції для точного налаштування поведінки політик менеджера топології. Потребує увімкнення обох функціональних можливостей — &quot;TopologyManager&quot; та &quot;TopologyManagerPolicyOptions&quot;. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>qosReserved</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>qosReserved — це набір пар імені ресурсу та відсотка, які визначають мінімальний відсоток ресурсу, зарезервований для ексклюзивного використання на рівні гарантованого QoS. Наразі підтримувані ресурси: &quot;памʼять&quot; Потребує увімкнення функціональної можливості QOSReserved. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>runtimeRequestTimeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>runtimeRequestTimeout — це таймаут для всіх запитів часу виконання, окрім довготривалих запитів — pull, logs, exec та attach. Стандартно: &quot;2m&quot;</p>
</td>
</tr>
<tr><td><code>hairpinMode</code><br/>
<code>string</code>
</td>
<td>
   <p>hairpinMode вказує, як Kubelet має налаштувати міст контейнера для пакета hairpin. Встановлення цього прапорця дозволяє точкам доступу в Service перерозподіляти навантаження на себе, якщо вони намагаються отримати доступ до свого власного Service. Значення:</p>
<ul>
<li>&quot;promiscuous-bridge&quot;: зробити контейнерний міст невпорядкованим.</li>
<li>&quot;hairpin-veth&quot;:       встановити прапорець hairpin на інтерфейсах container veth.</li>
<li>&quot;none&quot;:               нічого не робити.</li>
</ul>
<p>Зазвичай, для досягнення hairpin NAT потрібно встановити <code>--hairpin-mode=hairpin-veth</code>, оскільки promiscuous-bridge передбачає наявність контейнерного моста з назвою cbr0. Стандартно: &quot;promiscuous-bridge&quot;</p>
</td>
</tr>
<tr><td><code>maxPods</code><br/>
<code>int32</code>
</td>
<td>
   <p>maxPods — максимальна кількість Podʼів, які можуть бути запущені на цьому Kubelet. Значення має бути цілим невідʼємним числом. Стандартно: 110</p>
</td>
</tr>
<tr><td><code>podCIDR</code><br/>
<code>string</code>
</td>
<td>
   <p>podCIDR — це CIDR для IP-адрес pod, який використовується лише в режимі standalone. У кластерному режимі він отримується з панелі управління. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>podPidsLimit</code><br/>
<code>int64</code>
</td>
<td>
   <p>podPidsLimit — максимальна кількість PID у будь-якому pod.
Default: -1</p>
</td>
</tr>
<tr><td><code>resolvConf</code><br/>
<code>string</code>
</td>
<td>
   <p>resolvConf — це файл конфігурації резолвера, який використовується як основа для налаштування DNS-резолюції контейнера. Якщо встановлено порожній рядок, він перевизначає стандартне значення і фактично вимикає DNS-запити. Стандартно: &quot;/etc/resolv.conf&quot;</p>
</td>
</tr>
<tr><td><code>runOnce</code><br/>
<code>bool</code>
</td>
<td>
   <p>runOnce змушує Kubelet один раз перевірити сервер API на наявність Podʼів, запустити ті з них, які вказані у статичних файлах Podʼів, і вийти. Стандартно: false</p>
</td>
</tr>
<tr><td><code>cpuCFSQuota</code><br/>
<code>bool</code>
</td>
<td>
   <p>cpuCFSQuota вмикає застосування квоти CPU CFS для контейнерів, які визначають ліміти процесора. Стандартно: true</p>
</td>
</tr>
<tr><td><code>cpuCFSQuotaPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cpuCFSQuotaPeriod — це значення періоду квоти CFS процесора, <code>cpu.cfs_period_us</code>. Значення має бути від 1 мс до 1 секунди включно. Потребує увімкнення функціональної можливості CustomCPUCFSQuotaPeriod. Стандартно: &quot;100ms&quot;;</p>
</td>
</tr>
<tr><td><code>nodeStatusMaxImages</code><br/>
<code>int32</code>
</td>
<td>
   <p>nodeStatusMaxImages обмежує кількість зображень, про які повідомляється у Node.status.images. Значення має бути більшим за -2. Зауваження: Якщо вказано -1, обмеження не буде застосовано. Якщо вказано 0, жодного образу не буде повернуто. Стандартно: 50</p>
</td>
</tr>
<tr><td><code>maxOpenFiles</code><br/>
<code>int64</code>
</td>
<td>
   <p>maxOpenFiles - кількість файлів, які може відкрити процес Kubelet. Значення має бути невідʼємним числом. Стандартно: 1000000</p>
</td>
</tr>
<tr><td><code>contentType</code><br/>
<code>string</code>
</td>
<td>
   <p>contentType — тип вмісту запитів, що надсилаються до apiserver. Стандартно: &quot;application/vnd.kubernetes.protobuf&quot;;</p>
</td>
</tr>
<tr><td><code>kubeAPIQPS</code><br/>
<code>int32</code>
</td>
<td>
   <p>kubeAPIQPS - це QPS, який слід використовувати під час спілкування з apiserver'ом kubernetes. Стандартно: 50</p>
</td>
</tr>
<tr><td><code>kubeAPIBurst</code><br/>
<code>int32</code>
</td>
<td>
   <p>kubeAPIBurst — це кількість пакетів, які слід дозволити під час спілкування з сервером API kubernetes. Це поле не може бути відʼємним числом. Стандартно: 100</p>
</td>
</tr>
<tr><td><code>serializeImagePulls</code><br/>
<code>bool</code>
</td>
<td>
   <p>serializeImagePulls, якщо увімкнено, вказує Kubelet завантажувати образи один за одним. Ми рекомендуємо <em>не</em> змінювати стандартні значення на вузлах, де працює демон docker версії &lt; 1.9 або сховище Aufs. Деталі наведено у Issue #10959. Стандартно: true</p>
</td>
</tr>
<tr><td><code>maxParallelImagePulls</code><br/>
<code>int32</code>
</td>
<td>
   <p>MaxParallelImagePulls задає максимальну кількість паралельних завантажень образів. Це поле не можна встановити, якщо SerializeImagePulls має значення true. Встановлення значення nil означає відсутність обмежень. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>evictionHard</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>evictionHard — це map назв сигналів до величин, що визначає жорсткі пороги виселення. Наприклад: <code>{&quot;memory.available&quot;: &quot;300Mi&quot;}</code>. Щоб явно вимкнути, передайте порогове значення 0% або 100% для довільного ресурсу. Стандартно:
<pre>memory.available:  &quot;100Mi&quot;
nodefs.available:  &quot;10%&quot;
nodefs.inodesFree: &quot;5%&quot;
imagefs.available: &quot;15%&quot;</pre></p>
</td>
</tr>
<tr><td><code>evictionSoft</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>evictionSoft це map імен сигналів до величин, яка визначає мʼякі пороги виселення. Наприклад: <code>{&quot;memory.available&quot;: &quot;300Mi&quot;}</code>. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>evictionSoftGracePeriod</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>evictionSoftGracePeriod це map назв сигналів до величин, яка визначає пільгові періоди для кожного сигналу мʼякого виселення. Наприклад: <code>{&quot;memory.available&quot;: &quot;30s&quot;}</code>. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>evictionPressureTransitionPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>evictionPressureTransitionPeriod — це тривалість, протягом якої kubelet має зачекати, перш ніж вийти зі стану тиску витіснення. Тривалість 0s буде перетворено на стандартне значення 5m. Стандартно: &quot;5m&quot;</p>
</td>
</tr>
<tr><td><code>evictionMaxPodGracePeriod</code><br/>
<code>int32</code>
</td>
<td>
   <p>evictionMaxPodGracePeriod - це максимально дозволений пільговий період (у секундах), який можна використовувати при завершенні роботи подів у відповідь на досягнення порогу мʼякого виселення. Це значення фактично обмежує значення terminationGracePeriodSeconds під час мʼякого виселення. Стандартно: 0</p>
</td>
</tr>
<tr><td><code>evictionMinimumReclaim</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>evictionMinimumReclaim це map імен сигналів до величин, що визначає мінімальні відновлення, які описують мінімальну кількість заданого ресурсу, яку kubelet буде відновлювати при виконанні виселення pod, поки цей ресурс знаходиться під тиском. Наприклад: <code>{&quot;imagefs.available&quot;: &quot;2Gi&quot;}</code>. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>mergeDefaultEvictionSettings</code><br/>
<code>bool</code>
</td>
<td>
   <p>mergeDefaultEvictionSettings вказує, що стандартні значення для полів evictionHard, evictionSoft, evictionSoftGracePeriod та evictionMinimumReclaim слід обʼєднати у значення, вказані для цих полів у цій конфігурації. Сигнали, вказані в цій конфігурації, мають пріоритет. Сигнали, не вказані в цій конфігурації, успадковують стандартні значення. Якщо false, і якщо будь-який сигнал вказано у цій конфігурації, то інші сигнали, не вказані у цій конфігурації, будуть встановлені у 0. Це стосується обʼєднання полів, для яких існує стандартне значення, і наразі тільки evictionHard має стандартне значення. Стандартне значення: false</p>
</td>
</tr>
<tr><td><code>podsPerCore</code><br/>
<code>int32</code>
</td>
<td>
   <p>podsPerCore — максимальна кількість Podʼів на ядро. Не може перевищувати maxPods. Значення має бути цілим невідʼємним числом. Якщо 0, то немає обмеження на кількість Podʼів. Стандартно: 0</p>
</td>
</tr>
<tr><td><code>enableControllerAttachDetach</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableControllerAttachDetach дозволяє контролеру Attach/Detach керувати приєднанням/відʼєднанням томів, запланованих для цього вузла, і забороняє kubelet виконувати будь-які операції приєднання/відʼєднання. Зауваження: приєднання/відʼєднання томів CSI не підтримується kubelet, тому для цього варіанту використання ця опція має мати значення true. Стандартно: true</p>
</td>
</tr>
<tr><td><code>protectKernelDefaults</code><br/>
<code>bool</code>
</td>
<td>
   <p>protectKernelDefaults, якщо значення true, призводить до помилки Kubelet, якщо прапорці ядра не відповідають його очікуванням. В іншому випадку Kubelet спробує змінити прапорці ядра так, щоб вони відповідали його очікуванням. Стандартно: false</p>
</td>
</tr>
<tr><td><code>makeIPTablesUtilChains</code><br/>
<code>bool</code>
</td>
<td>
   <p>makeIPTablesUtilChains, якщо значення true, змушує Kubelet створювати ланцюжок KUBE-IPTABLES-HINT у iptables як підказку іншим компонентам про конфігурацію iptables у системі. Стандартно: true</p>
</td>
</tr>
<tr><td><code>iptablesMasqueradeBit</code><br/>
<code>int32</code>
</td>
<td>
   <p>iptablesMasqueradeBit раніше контролював створення ланцюжка KUBE-MARK-MASQ. Застарілий: більше не має жодного впливу. Стандартно: 14</p>
</td>
</tr>
<tr><td><code>iptablesDropBit</code><br/>
<code>int32</code>
</td>
<td>
   <p>iptablesDropBit раніше контролював створення ланцюжка KUBE-MARK-DROP. Застаріла: більше не має жодного впливу. Стандартно: 15</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <p>featureGates - це map імен функціональних можливостей до bools, які вмикають або вимикають експериментальні можливості. Це поле змінює вбудовані стандартні значення з &quot;k8s.io/kubernetes/pkg/features/kube_features.go&quot;. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>failSwapOn</code><br/>
<code>bool</code>
</td>
<td>
   <p>failSwapOn вказує Kubelet не запускатися, якщо на вузлі увімкнено підкачку. Стандартно: true</p>
</td>
</tr>
<tr><td><code>memorySwap</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-MemorySwapConfiguration"><code>MemorySwapConfiguration</code></a>
</td>
<td>
   <p>memorySwap налаштовує памʼять підкачки, доступну для контейнерних робочих навантажень.</p>
</td>
</tr>
<tr><td><code>containerLogMaxSize</code><br/>
<code>string</code>
</td>
<td>
   <p>containerLogMaxSize — величина, що визначає максимальний розмір лог-файлу контейнера перед його ротацією. Наприклад: &quot;5Mi&quot; або &quot;256Ki&quot;. Стандартно: &quot;10Mi&quot";</p>
</td>
</tr>
<tr><td><code>containerLogMaxFiles</code><br/>
<code>int32</code>
</td>
<td>
   <p>containerLogMaxFiles визначає максимальну кількість файлів логу контейнера, які можуть бути присутніми для контейнера. Стандартно: 5</p>
</td>
</tr>
<tr><td><code>containerLogMaxWorkers</code><br/>
<code>int32</code>
</td>
<td>
   <p>ContainerLogMaxWorkers визначає максимальну кількість паралельних робочих процесів для виконання операцій ротації логів. Встановіть це значення рівним 1, щоб вимкнути паралельні робочі процеси ротації логу. Стандартно: 1</p>
</td>
</tr>
<tr><td><code>containerLogMonitorInterval</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>ContainerLogMonitorInterval визначає тривалість, протягом якої контейнерні логи відстежуються для виконання операції ротації логів. Стандартно це значення дорівнює 10 * time.Seconds. Але його можна налаштувати на менше значення залежно від частоти генерації логів і розміру, щодо якого потрібно виконати ротацію. Стандартно: 10s</p>
</td>
</tr>
<tr><td><code>configMapAndSecretChangeDetectionStrategy</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ResourceChangeDetectionStrategy"><code>ResourceChangeDetectionStrategy</code></a>
</td>
<td>
   <p>configMapAndSecretChangeDetectionStrategy - режим, у якому працюють менеджери ConfigMap і Secret. Допустимі значення включають:</p>
<ul>
<li><code>Get</code>: kubelet отримує необхідні обʼєкти безпосередньо з сервера API;</li>
<li><code>Cache</code>: kubelet використовує TTL кеш для обʼєктів, отриманих з сервера API;</li>
<li><code>Watch</code>: kubelet використовує watch для спостереження за змінами в обʼєктах, які його цікавлять.</li>
</ul>
<p>Default: &quot;Watch&quot;</p>
</td>
</tr>
<tr><td><code>systemReserved</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>systemReserved - це набір пар ResourceName=ResourceQuantity (наприклад, cpu=200m,memory=150G), які описують ресурси, зарезервовані для компонентів, що не належать до kubernetes. Наразі підтримуються лише процесор і памʼять. Дивіться <a href="
   /uk/docs/tasks/administer-cluster/reserve-compute-resources">https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources</a> для більш детальної інформації. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>kubeReserved</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>kubeReserved — це набір пар ResourceName=ResourceQuantity (наприклад, cpu=200m,memory=150G), які описують ресурси, зарезервовані для компонентів системи kubernetes. Наразі підтримуються процесор, памʼять та локальне сховище для кореневої файлової системи. Більш детальну інформацію можна знайти на сторінці <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources">https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources</a>. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>reservedSystemCPUs</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Параметр reservedSystemCPUs визначає список процесорів, зарезервованих для системних потоків рівня хоста та потоків, повʼязаних з kubernetes. Це забезпечує &quot;статичний&quot; список процесорів, а не &quot;динамічний&quot; список за допомогою systemReserved та kubeReserved. Цей параметр не підтримує systemReservedCgroup або kubeReservedCgroup.</p>
</td>
</tr>
<tr><td><code>showHiddenMetricsForVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>showHiddenMetricsForVersion — це попередня версія, для якої ви хочете показати приховані метрики. Тільки попередня мінорна версія є значущою, інші значення не допускаються. Формат <code>&lt;major&gt;.&lt;minor&gt;</code>, наприклад: <code>1.16</code>. Метою цього формату є забезпечення можливості помітити, якщо в наступному випуску будуть приховані додаткові метрики, а не бути здивованими, коли вони будуть остаточно видалені в наступному випуску. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>systemReservedCgroup</code><br/>
<code>string</code>
</td>
<td>
   <p>systemReservedCgroup допомагає kubelet ідентифікувати абсолютну назву верхнього рівня CGroup, який використовується для забезпечення <code>systemReserved</code> обчислювального резервування ресурсів для системних демонів ОС. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable">Node Allocatable</a> документацію для отримання додаткової інформації. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>kubeReservedCgroup</code><br/>
<code>string</code>
</td>
<td>
   <p>kubeReservedCgroup допомагає kubelet ідентифікувати абсолютну назву верхнього рівня CGroup, який використовується для забезпечення <code>KubeReserved</code> обчислювального резервування ресурсів для системних демонів вузла Kubernetes. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable">Node Allocatable</a> документацію для отримання додаткової інформації. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>enforceNodeAllocatable</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Цей прапорець визначає різні примусові дії Node Allocatable, які Kubelet повинен виконувати. Цей прапорець приймає список опцій. Прийнятні опції: <code>none</code>, <code>pods</code>, <code>system-reserved</code> і <code>kube-reserved</code>. Якщо вказано <code>none</code>, інші опції не можуть бути вказані. Коли <code>system-reserved</code> є в списку, має бути вказано systemReservedCgroup. Коли <code>kube-reserved</code> є в списку, має бути вказано kubeReservedCgroup. Це поле підтримується тільки тоді, коли <code>cgroupsPerQOS</code> встановлено на true. Дивіться <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable">Node Allocatable</a> для отримання додаткової інформації. Стандартно: [&quot;pods&quot;]</p>
</td>
</tr>
<tr><td><code>allowedUnsafeSysctls</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Список небезпечних sysctl або шаблонів sysctl, розділених комами (які закінчуються на <code>*</code>). Небезпечні групи sysctl включають <code>kernel.shm*</code>, <code>kernel.msg*</code>, <code>kernel.sem</code>, <code>fs.mqueue.*</code> та <code>net.*</code>. Наприклад: &quot;<code>kernel.msg*,net.ipv4.route.min_pmtu</code>&quot;. Стандартно: []</p>
</td>
</tr>
<tr><td><code>volumePluginDir</code><br/>
<code>string</code>
</td>
<td>
   <p>volumePluginDir — це повний шлях до теки, в якій слід шукати додаткові втулки томів сторонніх розробників. Стандартно: &quot;/usr/libexec/kubernetes/kubelet-plugins/volume/exec/&quot;</p>
</td>
</tr>
<tr><td><code>providerID</code><br/>
<code>string</code>
</td>
<td>
   <p>providerID, якщо вказано, встановлює унікальний ID екземпляра, який зовнішній постачальник (наприклад, хмарний постачальник) може використовувати для ідентифікації конкретного вузла. Стандартно: &quot;&quot;</p>
</td>
</tr>
<tr><td><code>kernelMemcgNotification</code><br/>
<code>bool</code>
</td>
<td>
   <p>kernelMemcgNotification, якщо вказано, інструктує kubelet інтегруватися з нотифікацією memcg ядра для визначення, чи перевищені порогові значення памʼяті для виселення, замість опитування. Стандартно: false</p>
</td>
</tr>
<tr><td><code>logging</code> <b>[Обовʼязково]</b><br/>
<a href="#LoggingConfiguration"><code>LoggingConfiguration</code></a>
</td>
<td>
    <p>logging вказує параметри логування. Для отримання додаткової інформації зверніться до <a href="https://github.com/kubernetes/component-base/blob/master/logs/options.go">Options for Logs</a>. стандартно: Format: text</p></td>
</tr>
<tr><td><code>enableSystemLogHandler</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableSystemLogHandler дозволяє отримати доступ до системних логів через веб-інтерфейс за адресою host:port/logs/. Стандартно: true</p>
</td>
</tr>
<tr><td><code>enableSystemLogQuery</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableSystemLogQuery активує функцію запиту логів вузла на точці доступу /logs. Для роботи цієї функції також потрібно включити EnableSystemLogHandler. Увімкнення цього параметра впливає на безпеку. Рекомендується вмикати її за необхідності для налагодження і вимикати за інших обставин. Стандартно: false</p>
</td>
</tr>
<tr><td><code>shutdownGracePeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>shutdownGracePeriod вказує загальну тривалість, на яку вузол повинен затримати завершення роботи і загальний період належного завершення роботи для завершення роботи Podʼів під час завершення роботи вузла. Стандартно: &quot;0s&quot;</p>
</td>
</tr>
<tr><td><code>shutdownGracePeriodCriticalPods</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>shutdownGracePeriodCriticalPods вказує тривалість, що використовується для завершення критичних Podʼів під час завершення роботи вузла. Це повинно бути менше ніж shutdownGracePeriod. Наприклад, якщо shutdownGracePeriod=30s, і shutdownGracePeriodCriticalPods=10s, під час завершення роботи вузла перші 20 секунд будуть зарезервовані для мʼякого завершення роботи звичайних Podʼів, а останні 10 секунд будуть зарезервовані для завершення роботи критичних Podʼів. Стандартно: &quot;0s&quot;</p>
</td>
</tr>
<tr><td><code>shutdownGracePeriodByPodPriority</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ShutdownGracePeriodByPodPriority"><code>[]ShutdownGracePeriodByPodPriority</code></a>
</td>
<td>
   <p>shutdownGracePeriodByPodPriority вказує період часу для належного завершення роботи Podʼів на основі їх значення класу пріоритету. Коли отримано запит на завершення роботи, Kubelet ініціює завершення роботи для всіх Podʼів, що працюють на вузлі, з періодом часу, що залежить від пріоритету Podʼа, і потім чекає на завершення роботи всіх Podʼів. Кожен запис у масиві представляє час належного завершення роботи для Podʼа з значенням класу пріоритету, що лежить у діапазоні цього значення та наступного вищого запису в списку під час завершення роботи вузла. Наприклад, щоб дозволити критичним Podʼам 10 секунд для завершення роботи, Podʼам з пріоритетом &gt;=10000 — 20 секунд, а всім іншим Podʼам — 30 секунд.</p>
<p>shutdownGracePeriodByPodPriority:</p>
<ul>
<li>priority: 2000000000
shutdownGracePeriodSeconds: 10</li>
<li>priority: 10000
shutdownGracePeriodSeconds: 20</li>
<li>priority: 0
shutdownGracePeriodSeconds: 30</li>
</ul>
<p>Час, який Kubelet чекатиме перед завершенням роботи, буде максимумом з усіх shutdownGracePeriodSeconds для кожного діапазону класів пріоритету, представленого на вузлі. Коли всі Podʼи завершать роботу або досягнуть своїх періодівналежного завершення, Kubelet звільнить блокування інгібіції завершення роботи. Потрібно, щоб була ввімкнена функція GracefulNodeShutdown. Ця конфігурація має бути порожньою, якщо встановлено або ShutdownGracePeriod, або ShutdownGracePeriodCriticalPods. Стандартно: nil</p>
</td>
</tr>
<tr><td><code>crashLoopBackOff</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-CrashLoopBackOffConfig"><code>CrashLoopBackOffConfig</code></a>
</td>
<td>
   <p>CrashLoopBackOff містить конфіг для зміни параметрів на рівні вузла для поведінки перезапуску контейнера</p>
</td>
</tr>
<tr><td><code>reservedMemory</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-MemoryReservation"><code>[]MemoryReservation</code></a>
</td>
<td>
   <p>reservedMemory визначає список резервувань памʼяті для NUMA-вузлів, розділений комами. Цей параметр має сенс лише в контексті функції керування памʼяттю. Менеджер памʼяті не виділятиме зарезервовану памʼять для робочих навантажень контейнерів. Наприклад, якщо у вас є NUMA0 з 10Gi памʼяті, і reservedMemory було вказано для резервування 1Gi памʼяті на NUMA0, менеджер памʼяті передбачатиме, що лише 9Gi доступні для виділення. Ви можете вказати різну кількість вузлів NUMA та типів памʼяті. Ви можете взагалі опустити цей параметр, але повинні знати, що кількість зарезервованої памʼяті з усіх вузлів NUMA повинна бути рівною кількості памʼяті, вказаній у <a href="/uk/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable">node allocatable</a>. Якщо хоча б один параметр node allocatable має ненульове значення, вам потрібно буде вказати принаймні один вузол NUMA. Також уникайте вказування:</p>
<ol>
<li>Дублікати, той самий вузол NUMA і тип пам’яті, але з іншим значенням.</li>
<li>нульові обмеження для будь-якого типу памʼяті.</li>
<li>Ідентифікатори вузлів NUMAs, які не існують на машині.</li>
<li>типи пам’яті, крім пам’яті та hugepages-<!-- raw HTML omitted --></li>
</ol>
<p>Стандартно: nil</p>
</td>
</tr>
<tr><td><code>enableProfilingHandler</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableProfilingHandler дозволяє профілювання через веб-інтерфейс host:port/debug/pprof/. Стандартно: true</p>
</td>
</tr>
<tr><td><code>enableDebugFlagsHandler</code><br/>
<code>bool</code>
</td>
<td>
   <p>enableDebugFlagsHandler дозволяє доступ до прапорців через веб-інтерфейс host:port/debug/flags/v. Стандартно: true</p>

</td>
</tr>
<tr><td><code>seccompDefault</code><br/>
<code>bool</code>
</td>
<td>
   <p>SeccompDefault дозволяє використовувати <code>RuntimeDefault</code> як профіль seccomp стнадартно для всіх робочих навантажень. Стандартно: false</p>

</td>
</tr>
<tr><td><code>memoryThrottlingFactor</code><br/>
<code>float64</code>
</td>
<td>
   <p>MemoryThrottlingFactor визначає множник, який множиться на обмеження памʼяті або доступну памʼять вузла при встановленні значення cgroupv2 memory.high для забезпечення MemoryQoS. Зменшення цього коефіцієнта встановить нижчу високу межу для cgroups контейнера і створить більший тиск на відновлення памʼяті, тоді як збільшення зменшить тиск на відновлення. Детальніше дивіться за посиланням: <a href="https://kep.k8s.io/2570">KEP-2570</a>. Стандартно: 0.9</p>

</td>
</tr>
<tr><td><code>registerWithTaints</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <p>registerWithTaints — це масив "taints" (міток) для додавання до обʼєкта вузла під час реєстрації kubelet. Набирає чинності лише тоді, коли параметр registerNode встановлено в значення true і під час початкової реєстрації вузла. Стандартно: nil</p>

</td>
</tr>
<tr><td><code>registerNode</code><br/>
<code>bool</code>
</td>
<td>
   <p>registerNode дозволяє автоматичну реєстрацію з apiserver. Стандартно: true</p>
</td>
</tr>
<tr><td><code>tracing</code><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>
   <p>Tracing визначає версійовану конфігурацію для клієнтів трасування OpenTelemetry. Див. <a href="https://kep.k8s.io/2832">kep.k8s.io/2832</a> для отримання додаткової інформації. Стандартно: nil</p>

</td>
</tr>
<tr><td><code>localStorageCapacityIsolation</code><br/>
<code>bool</code>
</td>
<td>
   <p>LocalStorageCapacityIsolation дозволяє використовувати функцію ізоляції локального тимчасового зберігання. Стандартно: true. Ця функція дозволяє користувачам встановлювати запити/межі для тимчасового зберігання контейнерів та керувати ним так само, як процесорами та памʼяттю. Вона також дозволяє встановлювати sizeLimit для томів emptyDir, що призведе до видалення Podʼа, якщо використання диска з тома перевищить межу. Ця функція залежить від можливості правильної детекції використання кореневої файлової системи диска. Для деяких систем, таких як kind rootless, якщо ця можливість не підтримується, функцію LocalStorageCapacityIsolation слід вимкнути. Після вимкнення користувач не повинен встановлювати запити/межі для тимчасового зберігання контейнерів або sizeLimit для emptyDir. Стандартно: true</p>
</td>
</tr>
<tr><td><code>containerRuntimeEndpoint</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>ContainerRuntimeEndpoint є точкою доступу середовища виконання контейнерів. В Linux підтримуються Unix Domain Sockets, а у Windows підтримуються точки npipe та tcp. Приклади: 'unix:///path/to/runtime.sock', 'npipe:////./pipe/runtime'</p>
</td>
</tr>
<tr><td><code>imageServiceEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>ImageServiceEndpoint є точкою доступу сервісу контейнерних образів. Unix Domain Socket підтримуються в Linux, а npipe та tcp точки підтримуються у Windows. Приклади: 'unix:///path/to/runtime.sock', 'npipe:////./pipe/runtime'. Якщо не вказано, використовується значення з containerRuntimeEndpoint.</p>
</td>
</tr>
<tr><td><code>failCgroupV1</code><br/>
<code>bool</code>
</td>
<td>
   <p>FailCgroupV1 забороняє запуск kubelet на хостах, які використовують cgroup v1. Стандартно цей параметр має значення 'true', що означає, що kubelet не запускатимється на хостах cgroup v1, якщо цей параметр явно не вимкнено. Стандартно: 'true'</p>
</td>
</tr>
<tr><td><code>userNamespaces</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-UserNamespaces"><code>UserNamespaces</code></a>
</td>
<td>
   <p>UserNamespaces містить конфігурацію User Namespace.</p>
</td>
</tr>
</tbody>
</table>

## `SerializedNodeConfigSource` {#kubelet-config-k8s-io-v1beta1-SerializedNodeConfigSource}

SerializedNodeConfigSource дозволяє серіалізувати v1.NodeConfigSource. Цей тип використовується всередині Kubelet для відстеження збережених динамічних конфігурацій. Він існує в API групі kubeletconfig, оскільки класифікується як версійний вхідний параметр для Kubelet.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>SerializedNodeConfigSource</code></td></tr>

<tr><td><code>source</code><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.34/#nodeconfigsource-v1-core"><code>core/v1.NodeConfigSource</code></a>
</td>
<td>
   <p>source є джерелом, яке ми серіалізуємо.</p>
</td>
</tr>
</tbody>
</table>

## `CrashLoopBackOffConfig` {#kubelet-config-k8s-io-v1beta1-CrashLoopBackOffConfig}


**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>maxContainerRestartPeriod</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>maxContainerRestartPeriod - максимальна тривалість затримки при перезапуску контейнера, мінімум 1 секунда, максимум 300 секунд. Якщо не задано, стандартно використовується внутрішній максимум затримки при повторному запуску контейнера (300 секунд).</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider` {#kubelet-config-k8s-io-v1beta1-CredentialProvider}

**Зʼявляється в:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1beta1-CredentialProviderConfig)

<p>CredentialProvider представляє втулок exec, який викликається kubelet. Втулок викликається тільки тоді, коли образ, що завантажується, відповідає образам, що обробляються втулком (див. matchImages).</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>name є обовʼязковою назвою постачальника облікових даних. Має відповідати назві виконуваного файлу постачальника, яку бачить kubelet. Виконуваний файл повинен бути в теці bin kubelet (встановлений прапорцем --image-credential-provider-bin-dir). Має бути унікальним серед всіх провайдерів.</p>
</td>
</tr>
<tr><td><code>matchImages</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages є обовʼязковим списком рядків, які використовуються для порівняння з образами, щоб визначити, чи слід викликати цього постачальника. Якщо один із рядків відповідає запитаному образу від kubelet, втулок буде викликаний і отримає можливість надати облікові дані. Очікується, що образи міститимуть домен реєстрації та URL-адресу.</p>
   <p>Кожен запис у matchImages є шаблоном, який може містити порт і шлях. Глоби можна використовувати в домені, але не в порту чи шляху. Глоби підтримуються як піддоменами, такими як '&ast;.k8s.io' або 'k8s.&ast;.io', а також топ-рівневими доменами, такими як 'k8s.&ast;'. Часткові піддомени, такі як 'app&ast;.k8s.io', також підтримуються. Кожен глоб може відповідати лише одному сегменту піддомену, тому '&ast;.io' не відповідає '&ast;.k8s.io'.</p>
   <p>Відповідність існує між образом і matchImage, коли всі з нижченаведених умов виконані:</p>
   <ul>
   <li>Обидва містять однакову кількість частин домену, і кожна частина має збіг.</li>
   <li>URL шлях образу повинен бути префіксом цільового URL шляху образу.</li>
   <li>Якщо matchImage містить порт, порт також повинен мати збіг в образі.</li>
   </ul>
   <p>Приклади значень matchImages:</p>
   <ul>
   <li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
   <li>&ast;.azurecr.io</li>
   <li>gcr.io</li>
   <li>&ast;.&ast;.registry.io</li>
   <li>registry.io:8080/path</li>
   </ul>
</td>
</tr>
<tr><td><code>defaultCacheDuration</code> <b>[Обовʼязково]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>defaultCacheDuration є стандартним періодом, протягом якого втулок буде кешувати облікові дані в памʼяті, якщо в відповіді втулка не вказано період кешування. Це поле є обовʼязковим.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Обовʼязкова версія введення запиту CredentialProvider. Повернутий CredentialProviderResponse МУСИТЬ використовувати таку ж версію кодування, як і ввод. Поточні підтримувані значення:</p>
   <ul>
   <li>credentialprovider.kubelet.k8s.io/v1beta1</li>
   </ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Аргументи, які передаються команді при її виконанні.</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env визначає додаткові змінні середовища, які потрібно надати процесу. Вони обʼєднуються з середовищем хоста, а також змінними, які client-go використовує для передачі аргументів втулку.</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar` {#kubelet-config-k8s-io-v1beta1-ExecEnvVar}

**Зʼявляється в:**

- [CredentialProvider](#kubelet-config-k8s-io-v1beta1-CredentialProvider)

<p>ExecEnvVar використовується для встановлення змінних середовища при виконанні втулку облікових даних на основі exec.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>name визначає імʼя змінної середовища.</p>
</td>
</tr>
<tr><td><code>value</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>value визначає значення змінної середовища.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullCredentials`     {#kubelet-config-k8s-io-v1beta1-ImagePullCredentials}


**Зʼявляється в:**

- [ImagePulledRecord](#kubelet-config-k8s-io-v1beta1-ImagePulledRecord)


ImagePullCredentials описує облікові дані, які можна використовувати для отримання образу.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>kubernetesSecrets</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ImagePullSecret"><code>[]ImagePullSecret</code></a>
</td>
<td>
   <p>KubernetesSecretCoordinates — це індекс координат усіх секретів Kubernetes, які використовувалися для отримання образу.</p>
</td>
</tr>
<tr><td><code>kubernetesServiceAccounts</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-ImagePullServiceAccount"><code>[]ImagePullServiceAccount</code></a>
</td>
<td>
   <p>KubernetesServiceAccounts — це індекс координат усіх службових облікових записів Kubernetes, які використовувалися для отримання образу.</p>
</td>
</tr>
<tr><td><code>nodePodsAccessible</code><br/>
<code>bool</code>
</td>
<td>
   <p>NodePodsAccessible — це прапорець, який позначає, що всі поди на вузлі мають доступ до облікових даних для отримання, або що для отримання облікові дані не потрібні.</p>
   <p>Якщо true, це взаємовиключно з полем <code>kubernetesSecrets</code>.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullCredentialsVerificationPolicy`     {#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy}

(Аліас `string`)

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)


ImagePullCredentialsVerificationPolicy — це зчислення для політики, яка застосовується, коли pod запитує образ, що зʼявляється у системі.

## `ImagePullSecret`     {#kubelet-config-k8s-io-v1beta1-ImagePullSecret}


**Зʼявляється в:**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1beta1-ImagePullCredentials)


ImagePullSecret — це представлення координат обʼєкта секрету Kubernetes разом із хешем облікових даних для витягування секрету, який містить цей обʼєкт.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>uid</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>namespace</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>credentialHash</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>CredentialHash — це SHA-256, отриманий шляхом хешування вмісту облікових даних для отримання образу, зазначеного в секреті, визначеному координатами UID/Namespace/Name.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullServiceAccount`     {#kubelet-config-k8s-io-v1beta1-ImagePullServiceAccount}


**Зʼявляється в:**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1beta1-ImagePullCredentials)


ImagePullServiceAccount — це представлення координат обʼєкта службового облікового запису Kubernetes, для якого kubelet надіслав токен службового облікового запису до втулка постачальника облікових даних для отримання облікових даних для отримання образів.


<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>uid</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>namespace</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
</tbody>
</table>


## `KubeletAnonymousAuthentication` {#kubelet-config-k8s-io-v1beta1-KubeletAnonymousAuthentication}

**Зʼявляється в:**

- [KubeletAuthentication](#kubelet-config-k8s-io-v1beta1-KubeletAuthentication)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>enabled</code><br/>
<code>bool</code>
</td>
<td>
   <p>enabled дозволяє анонімні запити до сервера kubelet. Запити, які не відхиляються іншим методом автентифікації, обробляються як анонімні запити. Анонімні запити мають імʼя користувача <code>system:anonymous</code> та групу <code>system:unauthenticated</code>.</p>
</td>
</tr>
</tbody>
</table>

## `KubeletAuthentication` {#kubelet-config-k8s-io-v1beta1-KubeletAuthentication}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>x509</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletX509Authentication"><code>KubeletX509Authentication</code></a>
</td>
<td>
   <p>x509 містить налаштування, що стосуються автентифікації за допомогою клієнтських сертифікатів x509.</p>
</td>
</tr>
<tr><td><code>webhook</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletWebhookAuthentication"><code>KubeletWebhookAuthentication</code></a>
</td>
<td>
   <p>webhook містить налаштування, що стосуються автентифікації за допомогою webhook токенів на предʼявника.</p>
</td>
</tr>
<tr><td><code>anonymous</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletAnonymousAuthentication"><code>KubeletAnonymousAuthentication</code></a>
</td>
<td>
   <p>anonymous містить налаштування, що стосуються анонімної автентифікації.</p>
</td>
</tr>
</tbody>
</table>

## `KubeletAuthorization` {#kubelet-config-k8s-io-v1beta1-KubeletAuthorization}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>mode</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletAuthorizationMode"><code>KubeletAuthorizationMode</code></a>
</td>
<td>
   <p>mode визначає режим авторизації для запитів до сервера kubelet. Дійсні значення: <code>AlwaysAllow</code> і <code>Webhook</code>. Режим Webhook використовує API SubjectAccessReview для визначення авторизації.</p>
</td>
</tr>
<tr><td><code>webhook</code><br/>
<a href="#kubelet-config-k8s-io-v1beta1-KubeletWebhookAuthorization"><code>KubeletWebhookAuthorization</code></a>
</td>
<td>
   <p>webhook містить налаштування, що стосуються авторизації через Webhook.</p>
</td>
</tr>
</tbody>
</table>

## `KubeletAuthorizationMode`     {#kubelet-config-k8s-io-v1beta1-KubeletAuthorizationMode}

(Аліас до `string`)

**Зʼявляється в:**

- [KubeletAuthorization](#kubelet-config-k8s-io-v1beta1-KubeletAuthorization)

## `KubeletWebhookAuthentication` {#kubelet-config-k8s-io-v1beta1-KubeletWebhookAuthentication}

**Зʼявляється в:**

- [KubeletAuthentication](#kubelet-config-k8s-io-v1beta1-KubeletAuthentication)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>enabled</code><br/>
<code>bool</code>
</td>
<td>
   <p>enabled дозволяє автентифікацію за допомогою токенів, підтримувану API tokenreviews.authentication.k8s.io.</p>
</td>
</tr>
<tr><td><code>cacheTTL</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cacheTTL дозволяє кешування результатів автентифікації.</p>
</td>
</tr>
</tbody>
</table>

## `KubeletWebhookAuthorization` {#kubelet-config-k8s-io-v1beta1-KubeletWebhookAuthorization}

**Зʼявляється в:**

- [KubeletAuthorization](#kubelet-config-k8s-io-v1beta1-KubeletAuthorization)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>cacheAuthorizedTTL</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cacheAuthorizedTTL — тривалість кешування відповідей 'authorized' від веб-хук авторизатора.</p>
</td>
</tr>
<tr><td><code>cacheUnauthorizedTTL</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cacheUnauthorizedTTL — тривалість кешування відповідей 'unauthorized' від веб-хук авторизатора.</p>
</td>
</tr>
</tbody>
</table>

## `KubeletX509Authentication` {#kubelet-config-k8s-io-v1beta1-KubeletX509Authentication}

**Зʼявляється в:**

- [KubeletAuthentication](#kubelet-config-k8s-io-v1beta1-KubeletAuthentication)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>clientCAFile</code><br/>
<code>string</code>
</td>
<td>
   <p>clientCAFile — шлях до файлу сертифікатів у форматі PEM. Якщо встановлено, будь-який запит, що надає клієнтський сертифікат, підписаний одним з органів сертифікації з цього пакету, автентифікується з іменем користувача, що відповідає CommonName, та групами, що відповідають організації у клієнтському сертифікаті.</p>
</td>
</tr>
</tbody>
</table>

## `MemoryReservation` {#kubelet-config-k8s-io-v1beta1-MemoryReservation}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<p>MemoryReservation визначає різні типи резервування памʼяті для кожного взула NUMA.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>numaNode</code> <b>[Обовʼязково]</b><br/>
<code>int32</code>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
<tr><td><code>limits</code> <b>[Обовʼязково]</b><br/>
<a href="/docs/reference/generated/kubernetes-api/v1.35/#resourcelist-v1-core"><code>core/v1.ResourceList</code></a>
</td>
<td>
   <span class="text-muted">Опис відсутній.</span></td>
</tr>
</tbody>
</table>

## `MemorySwapConfiguration` {#kubelet-config-k8s-io-v1beta1-MemorySwapConfiguration}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>swapBehavior</code><br/>
<code>string</code>
</td>
<td>
   <p>swapBehavior налаштовує використання swap-пам’яті для контейнерних навантажень. Може бути однією з таких опцій:</p>
   <ul>
     <li>"" (порожнє).</li>
     <li>"NoSwap": Навантаження не можуть використовувати swap. Стандартно</li>
     <li>"LimitedSwap": Використання swap для навантажень обмежене. Ліміт swap пропорційний запиту пам’яті контейнера.</li>
   </ul>
</td>
</tr>
</tbody>
</table>

## `ResourceChangeDetectionStrategy` {#kubelet-config-k8s-io-v1beta1-ResourceChangeDetectionStrategy}

(Аліас `string`)

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<p>ResourceChangeDetectionStrategy позначає режим, у якому внутрішні менеджери (секрети, configmap) виявляють зміни об’єктів.</p>

## `ShutdownGracePeriodByPodPriority`     {#kubelet-config-k8s-io-v1beta1-ShutdownGracePeriodByPodPriority}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

<p>ShutdownGracePeriodByPodPriority визначає період належного завершення перед завершенням роботи для Podʼів на основі їхнього значення пріоритету.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>

<tr><td><code>priority</code> <b>[Обовʼязкове]</b><br/>
<code>int32</code>
</td>
<td>
   <p>priority — це значення пріоритету, яке повʼязане з періодом належного завершення перед завершенням роботи</p>
</td>
</tr>
<tr><td><code>shutdownGracePeriodSeconds</code> <b>[Обовʼязкове]</b><br/>
<code>int64</code>
</td>
<td>
   <p>shutdownGracePeriodSeconds — це період належного завершення перед завершенням роботи в секундах</p>
</td>
</tr>
</tbody>
</table>


## `UserNamespaces`     {#kubelet-config-k8s-io-v1beta1-UserNamespaces}


**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

UserNamespaces містисть конфігурацію User Namespace.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>


<tr><td><code>idsPerPod</code><br/>
<code>int64</code>
</td>
<td>
   <p>IDsPerPod — це довжина зіставлення UID та GID. Довжина має бути кратною 65536 і не перевищувати 1&lt;&lt;32. У не-linux системах, таких як Windows, допускається лише null / absent.</p>
   <p>Зміна значення може вимагати перестворення всіх контейнерів на вузлі.</p>
   <p>Стандартно: 65536</p>
</td>
</tr>
</tbody>
</table>
