---
title: Kubelet Configuration (v1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1
auto_generated: false
---

## Типы ресурсов {#resource-types}

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

## `CredentialProviderConfig` {#kubelet-config-k8s-io-v1-CredentialProviderConfig}

CredentialProviderConfig є конфігурацією, що містить інформацію про кожного exec credential provider. Kubelet читає цю конфігурацію з диска та активує кожного провайдера відповідно до типу CredentialProvider.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
<tr><td><code>providers</code> <b>[Обовʼязково]</b><br/>
<a href="#kubelet-config-k8s-io-v1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers є списком втулків провайдерів облікових даних, які будуть активовані kubelet. Кілька провайдерів можуть відповідати одному образу, в такому випадку облікові дані з усіх провайдерів будуть повернуті kubelet. Якщо кілька провайдерів викликаються для одного образу, результати обʼєднуються. Якщо провайдери повертають ключі авторизації, що збігаються, спочатку буде використано значення від провайдера, що знаходиться раніше у списку.</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider` {#kubelet-config-k8s-io-v1-CredentialProvider}

**Зʼявляється в:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

CredentialProvider представляє exec втулок, який буде викликаний kubelet. Втулок викликається лише тоді, коли образ, що завантажується, відповідає образам, які обробляє втулок (див. matchImages).</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>name є обовʼязковим імʼям провайдера облікових даних. Назва повинна відповідати імені виконуваного файлу провайдера, яке бачить kubelet. Виконуваний файл повинен бути в директорії bin kubelet (встановленій за допомогою прапорця --image-credential-provider-bin-dir). Має бути унікальним серед всіх провайдерів.</p>
</td>
</tr>
<tr><td><code>matchImages</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages є обовʼязковим списком рядків, які використовуються для зіставлення з образами, щоб визначити, чи потрібно викликати цього провайдера. Якщо один з рядків відповідає запитаному образу від kubelet, втулок буде викликаний і отримає можливість надати облікові дані. Образи повинні містити домен реєстрації та URL шлях.</p>
   <p>Кожен запис у matchImages є шаблоном, який може містити порт і шлях. Глоби можна використовувати в домені, але не в порті чи шляху. Глоби підтримуються як піддомени, наприклад '&ast;.k8s.io' або 'k8s.&ast;.io', та топ-рівневі домени, такі як 'k8s.&ast;'. Підмножки часткових піддоменів, такі як 'app&ast;.k8s.io', також підтримуються. Кожен глоб може відповідати тільки одному сегменту піддомену, тому '&ast;.io' не відповідає '&ast;.k8s.io'.</p>
   <p>Зіставлення існує між образом і matchImage, коли всі з нижченаведених умов є істинними:</p>
   <ul>
   <li>Обидва містять однакову кількість частин домену, і кожна частина має збіг.</li>
   <li>URL шлях образу має бути префіксом цільового URL шляху образу.</li>
   <li>Якщо imageMatch містить порт, порт також повинен мати збіг в образі.</li>
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
   <p>defaultCacheDuration є стандартною тривалістю, впродовж якої втулок кешуватиме облікові дані в памʼяті, якщо тривалість кешу не надана у відповіді втулка. Це поле є обовʼязковим.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Обовʼязкова версія вхідного exec CredentialProviderRequest. Повернута CredentialProviderResponse МУСИТЬ використовувати таку ж версію кодування, як і вхідна. Поточні підтримувані значення:</p>
   <ul>
   <li>credentialprovider.kubelet.k8s.io/v1</li>
   </ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Аргументи для передачі команді при її виконанні.</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env визначає додаткові змінні середовища для передачі процесу. Вони обʼєднуються з середовищем хоста, а також змінними, які client-go використовує для передачі аргументів втулку.</p>
</td>
</tr>
<tr><td><code>tokenAttributes</code><br/>
<a href="#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes"><code>ServiceAccountTokenAttributes</code></a>
</td>
<td>
   <p>tokenAttributes - це конфігурація для токену службового облікового запису, який буде передано втулку. За допомогою цього поля постачальник облікових даних надає згоду на використання токенів облікових записів для витягування образів. Коли це поле встановлено, kubelet згенерує токен службового облікового запису, привʼязаного до podʼа, для якого витягується образ, і передасть його втулку у складі CredentialProviderRequest разом з іншими атрибутами, необхідними для втулка.</p>
   <p>Метадані службового облікового запису та атрибути токенів будуть використовуватися як розмірність для кешування облікових даних у kubelet. Ключ кешу генерується шляхом комбінування метаданих службового облікового запису (простір імен, імʼя, UID та ключ анотацій + значення для ключів, визначених у serviceAccountTokenAttribute.requiredServiceAccountAnnotationKeys та serviceAccountTokenAttribute.optionalServiceAccountAnnotationKeys). Метадані podʼа (простір імен, імʼя, UID), які містяться в токені службового облікового запису, не використовуються як розмірність для кешування облікових даних у kubelet. Це означає, що робочі навантаження, які використовують той самий службовий обліковий запис, можуть використовувати ті самі облікові дані для отримання образів. Для втулків, які не бажають такої поведінки, або втулків, які працюють у наскрізному режимі, тобто повертають токен службового облікового запису як є, можна встановити credentialProviderResponse.cacheDuration у 0. Це вимкне кешування облікових даних у kubelet, і втулок буде викликатися під час кожного витягування образу. Це призведе до накладних витрат на генерацію токенів для кожного витягування образу, але це єдиний спосіб гарантувати, що облікові дані не будуть спільно використовуватися різними podʼами (навіть якщо вони використовують один і той самий службовий обліковий запис).</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar` {#kubelet-config-k8s-io-v1-ExecEnvVar}

**Зʼявляється в:**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)

ExecEnvVar використовується для встановлення змінних середовища при виконанні втулка для облікових даних на основі exec.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>value</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `ServiceAccountTokenAttributes` {#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes}

**Зʼявляється в:**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)

ServiceAccountTokenAttributes - це конфігурація токена службового облікового запису, який буде передано втулку.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>serviceAccountTokenAudience</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>serviceAccountTokenAudience — цільова аудиторія для спроєктованого токена облікового запису послуги.</p>
</td>
</tr>
<tr><td><code>cacheType</code> <B>[Обовʼязкове]</B><br/>
<a href="#kubelet-config-k8s-io-v1-ServiceAccountTokenCacheType"><code>ServiceAccountTokenCacheType</code></a>
</td>
<td>
   <p>cacheType вказує тип ключа кешу, що використовується для кешування облікових даних, повернутих втулком, коли використовується токен службового облікового запису. Найбільш консервативним варіантом є встановлення цього параметра на &quot;Token&quot;, що означає, що kubelet буде кешувати повернуті облікові дані на основі кожного токена. Це слід встановити, якщо термін дії повернутого облікового запису обмежений терміном дії токена службового облікового запису. Якщо логіка втулка отримання облікових даних залежить тільки від службового облікового запису, а не від вимог, специфічних для pod, то втулок може встановити це значення на &quot;ServiceAccount&quot;. У цьому випадку kubelet буде кешувати повернуті облікові дані на основі кожного службового облікового запису. Використовуйте це, коли повернуті облікові дані дійсні для всіх pod, що використовують той самий службовий обліковий запис.</p>
</td>
</tr>
<tr><td><code>requireServiceAccount</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p>requireServiceAccount вказує, чи вимагає втулок наявність службового облікового запису. Якщо встановлено у true, kubelet буде викликати втулок лише за наявності службового облікового запису. Якщо встановлено значення false, kubelet буде викликати втулок, навіть якщо він не має службового облікового запису, і не буде включати токен у CredentialProviderRequest у цьому сценарії. Це корисно для втулків, які використовуються для отримання образів для podʼів без службових облікових записів (наприклад, статичних podʼів).</p>
</td>
</tr>
<tr><td><code>requiredServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
   <p>requiredServiceAccountAnnotationKeys - список ключів анотацій, які цікавлять втулок і які повинні бути присутніми в службовому обліковому записі. Ключі, визначені у цьому списку, буде вилучено з відповідного службового облікового запису та передано втулку як частину запиту CredentialProviderRequest. Якщо будь-який з ключів, визначених у цьому списку, відсутній в службовому обліковому записі, kubelet не викличе втулок і поверне помилку. Це поле є необовʼязковим і може бути порожнім. Втулки можуть використовувати це поле для отримання додаткової інформації, необхідної для отримання облікових даних, або для того, щоб дозволити робочим навантаженням використовувати токени службових облікових записів для витягування образів. Якщо поле не порожнє, requireServiceAccount має мати значення true. Ключі в цьому списку повинні бути унікальними. Цей список повинен бути взаємовиключним з optionalServiceAccountAnnotationKeys.</p>
</td>
</tr>
<tr><td><code>optionalServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
   <p>optionalServiceAccountAnnotationKeys - список ключів анотацій, які цікавлять втулок і які необовʼязково повинні бути присутніми в службовому обліковому записі. Ключі, визначені у цьому списку, будуть витягнуті з відповідного службового облікового запису і передані втулку як частина запиту CredentialProviderRequest. Втулок відповідає за перевірку існування анотацій та їхніх значень. Це поле є необовʼязковим і може бути порожнім. Втулки можуть використовувати це поле для отримання додаткової інформації, необхідної для отримання облікових даних. Ключі в цьому списку повинні бути унікальними.</p>
</td>
</tr>
</tbody>
</table>

## `ServiceAccountTokenCacheType` {#kubelet-config-k8s-io-v1-ServiceAccountTokenCacheType}

(Аліас до `string`)

**Зʼявляється в:**

- [ServiceAccountTokenAttributes](#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes)

<p>ServiceAccountTokenCacheType — це тип ключа кешу, який використовується для кешування облікових даних, повернутих втулком, коли використовується токен службового облікового запису.</p>
