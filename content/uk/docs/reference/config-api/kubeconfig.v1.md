---
title: kubeconfig (v1)
content_type: tool-reference
package: v1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [Config](#Config)

## `Config` {#Config}

<p>Config містить інформацію, необхідну для підключення до віддалених кластерів Kubernetes як вказаний користувач</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Config</code></td></tr>
<tr><td><code>kind</code><br/>
<code>string</code>
</td>
<td>
   <p>Спадкове поле з pkg/api/types.go TypeMeta. TODO(jlowdermilk): видалити його після усунення залежностей з низхідних напрямків.</p>
</td>
</tr>
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>Спадкове поле з pkg/api/types.go TypeMeta. TODO(jlowdermilk): видалити його після усунення залежностей з низхідних напрямків.</p>
</td>
</tr>
<tr><td><code>preferences,omitzero</code> <b>[Обовʼязкове]</b><br/>
<a href="#Preferences"><code>Preferences</code></a>
</td>
<td>
   <p>Preferences містить загальну інформацію для використання у взаємодії з CLI. Застаріле: це поле застаріле в версії 1.34. Воно не використовується жодним із компонентів Kubernetes.</p>
</td>
</tr>
<tr><td><code>clusters</code> <b>[Обовʼязкове]</b><br/>
<a href="#NamedCluster"><code>[]NamedCluster</code></a>
</td>
<td>
   <p>Clusters — це map імен, на які можна посилатися в конфігураціях кластерів</p>
</td>
</tr>
<tr><td><code>users</code> <b>[Обовʼязкове]</b><br/>
<a href="#NamedAuthInfo"><code>[]NamedAuthInfo</code></a>
</td>
<td>
   <p>AuthInfos — це map імен, на які можна посилатися в конфігураціях користувача</p>
</td>
</tr>
<tr><td><code>contexts</code> <b>[Обовʼязкове]</b><br/>
<a href="#NamedContext"><code>[]NamedContext</code></a>
</td>
<td>
   <p>Contexts — це map імен, на які можна посилатися, до конфігурацій контекстів</p>
</td>
</tr>
<tr><td><code>current-context</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>CurrentContext — це імʼя контексту, який ви хочете використовувати стандартно</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions містить додаткову інформацію. Це корисно для розширювачів, щоб читання та запис не знищували невідомі поля</p>
</td>
</tr>
</tbody>
</table>

## `AuthInfo` {#AuthInfo}

**Зʼявляється в:**
- [NamedAuthInfo](#NamedAuthInfo)

AuthInfo містить інформацію, яка описує ідентифікаційні дані. Це використовується для інформування кластера Kubernetes, хто ви є.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>client-certificate</code><br/>
<code>string</code>
</td>
<td>
   <p>ClientCertificate — це шлях до файлу клієнтського сертифіката для TLS.</p>
</td>
</tr>
<tr><td><code>client-certificate-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>ClientCertificateData містить дані в кодуванні PEM з файлу клієнтського сертифіката для TLS. Перезаписує ClientCertificate.</p>
</td>
</tr>
<tr><td><code>client-key</code><br/>
<code>string</code>
</td>
<td>
   <p>ClientKey — це шлях до файлу клієнтського ключа для TLS.</p>
</td>
</tr>
<tr><td><code>client-key-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>ClientKeyData містить дані в кодуванні PEM з файлу клієнтського ключа для TLS. Перезаписує ClientKey.</p>
</td>
</tr>
<tr><td><code>token</code><br/>
<code>string</code>
</td>
<td>
   <p>Token — це токен, що підтверджує право на доступ до кластера Kubernetes.</p>
</td>
</tr>
<tr><td><code>tokenFile</code><br/>
<code>string</code>
</td>
<td>
   <p>TokenFile — це вказівка на файл, який містить токен (як описано вище). Якщо присутні як Token, так і TokenFile, TokenFile буде періодично зчитуватися, і останнє успішно зчитане значення матиме пріоритет над Token.</p>
</td>
</tr>
<tr><td><code>as</code><br/>
<code>string</code>
</td>
<td>
   <p>Impersonate — імʼя користувача, від імені якого потрібно діяти. Імʼя збігається з прапорцем.</p>
</td>
</tr>
<tr><td><code>as-uid</code><br/>
<code>string</code>
</td>
<td>
   <p>ImpersonateUID — це UID, від імені якого потрібно діяти.</p>
</td>
</tr>
<tr><td><code>as-groups</code><br/>
<code>[]string</code>
</td>
<td>
   <p>ImpersonateGroups — це групи, від імені якої потрібно діяти.</p>
</td>
</tr>
<tr><td><code>as-user-extra</code><br/>
<code>map[string][]string</code>
</td>
<td>
   <p>ImpersonateUserExtra містить додаткову інформацію для користувача, від імені якого потрібно діяти.</p>
</td>
</tr>
<tr><td><code>username</code><br/>
<code>string</code>
</td>
<td>
   <p>Username — це імʼя користувача для базової автентифікації в кластері Kubernetes.</p>
</td>
</tr>
<tr><td><code>password</code><br/>
<code>string</code>
</td>
<td>
   <p>Password — це пароль для базової автентифікації в кластері Kubernetes.</p>
</td>
</tr>
<tr><td><code>auth-provider</code><br/>
<a href="#AuthProviderConfig"><code>AuthProviderConfig</code></a>
</td>
<td>
   <p>AuthProvider вказує на власний втулок автентифікації для кластера Kubernetes.</p>
</td>
</tr>
<tr><td><code>exec</code><br/>
<a href="#ExecConfig"><code>ExecConfig</code></a>
</td>
<td>
   <p>Exec вказує на власний втулок автентифікації на основі виконання для кластера Kubernetes.</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions містить додаткову інформацію. Це корисно для розширювачів, щоб читання та запис не знищували невідомі поля.</p>
</td>
</tr>
</tbody>
</table>

## `AuthProviderConfig` {#AuthProviderConfig}

**Зʼявляється в:**

- [AuthInfo](#AuthInfo)

AuthProviderConfig містить конфігурацію для вказаного провайдера автентифікації.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>config</code> <b>[Обовʼязково]</b><br/>
<code>map[string]string</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
</tbody>
</table>

## `Cluster` {#Cluster}

**Зʼявляється в:**

- [NamedCluster](#NamedCluster)

Cluster містить інформацію про те, як спілкуватися з кластером Kubernetes.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>server</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Server — це адреса кластера Kubernetes (https://hostname:port).</p>
</td>
</tr>
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
   <p>TLSServerName використовується для перевірки сертифіката сервера. Якщо TLSServerName порожній, використовується імʼя хоста, щоб звʼязатися з сервером.</p>
</td>
</tr>
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
   <p>InsecureSkipTLSVerify пропускає перевірку дійсності сертифіката сервера. Це зробить ваші HTTPS-зʼєднання небезпечними.</p>
</td>
</tr>
<tr><td><code>certificate-authority</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificateAuthority - це шлях до файлу сертифіката для сертифікаційного центру.</p>
</td>
</tr>
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>CertificateAuthorityData містить PEM-кодовані сертифікати сертифікаційного центру. Перекриває CertificateAuthority.</p>
</td>
</tr>
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <p>ProxyURL — це URL-адреса проксі, яка буде використовуватися для всіх запитів, здійснюваних цим клієнтом. Підтримуються URL-адреси зі схемами "http", "https" та "socks5". Якщо ця конфігурація не надана або порожній рядок, клієнт спробує створити конфігурацію проксі з змінних середовища http_proxy та https_proxy. Якщо ці змінні середовища не встановлені, клієнт не спробує проксіювати запити.</p>
<p>Проксіювання socks5 наразі не підтримує точки доступу потокової передачі spdy (exec, attach, port forward).</p>
</td>
</tr>
<tr><td><code>disable-compression</code><br/>
<code>bool</code>
</td>
<td>
   <p>DisableCompression дозволяє клієнту відмовитися від стиснення відповіді для всіх запитів до сервера. Це корисно для прискорення запитів (зокрема списків), коли пропускна здатність мережі між клієнтом і сервером достатня, заощаджуючи час на стисненні (на стороні сервера) та розпакуванні (на стороні клієнта): https://github.com/kubernetes/kubernetes/issues/112296.</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions містить додаткову інформацію. Це корисно для розширювачів, щоб читання і запис не пошкоджували невідомі поля</p>
</td>
</tr>
</tbody>
</table>

## `Context` {#Context}

**Зʼявляється в:**

- [NamedContext](#NamedContext)

Context — це набір посилань на кластер (як спілкуватись з кластером Kubernetes), користувача (як користувач ідентифікує себе) і простір імен (з якою підмножиною ресурсів стандартно працювати)</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>cluster</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Cluster —це імʼя кластера для цього контексту</p>
</td>
</tr>
<tr><td><code>user</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>AuthInfo — це імʼя authInfo для цього контексту</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <p>Namespace — це стандартний простір імен, який використовується для запитів, де простір імен не вказаний</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions містить додаткову інформацію. Це корисно для розширювачів, щоб читання і запис не пошкоджували невідомі поля</p>
</td>
</tr>
</tbody>
</table>

## `ExecConfig` {#ExecConfig}

**Зʼявляється в:**

- [AuthInfo](#AuthInfo)

ExecConfig визначає команду для надання клієнтських облікових даних. Команда виконується і виводить структурований stdout, що містить облікові дані.

Дивіться групу API client.authentication.k8s.io для специфікацій точного формату вводу та виводу.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>command</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Команда для виконання.</p>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Аргументи для передачі команді під час її виконання.</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env визначає додаткові змінні середовища для експонування процесу. Вони обʼєднуються з середовищем хосту, а також зі змінними, які client-go використовує для передачі аргументів втулку.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Бажана версія введення ExecInfo. Повернені ExecCredentials МАЮТЬ використовувати те ж саме кодування версії, що й ввод.</p>
</td>
</tr>
<tr><td><code>installHint</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>Цей текст показується користувачеві, коли виконуваний файл здається відсутнім. Наприклад, <code>brew install foo-cli</code> може бути гарною підказкою для встановлення foo-cli на системах Mac OS.</p>
</td>
</tr>
<tr><td><code>provideClusterInfo</code> <b>[Обовʼязково]</b><br/>
<code>bool</code>
</td>
<td>
   <p>ProvideClusterInfo визначає, чи слід надавати інформацію про кластер, яка може потенційно містити дуже великі дані CA, цьому exec втулку як частину змінної середовища KUBERNETES_EXEC_INFO. Стандартно встановлено на false. Пакет k8s.io/client-go/tools/auth/exec надає допоміжні методи для отримання цієї змінної середовища.</p>
</td>
</tr>
<tr><td><code>interactiveMode</code><br/>
<a href="#ExecInteractiveMode"><code>ExecInteractiveMode</code></a>
</td>
<td>
   <p>InteractiveMode визначає звʼязки цього втулку зі стандартним вводом. Дійсні значення: &quot;Never&quot; (цей exec втулок ніколи не використовує стандартний ввод), &quot;IfAvailable&quot; (цей exec втулок хоче використовувати стандартний ввод, якщо він доступний) або &quot;Always&quot; (цей exec втулок вимагає стандартний ввод для функціонування). Див. значення ExecInteractiveMode для більш детальної інформації.</p>
    <p>Якщо APIVersion — client.authentication.k8s.io/v1alpha1 або client.authentication.k8s.io/v1beta1, то це поле є необовʼязковим і стандартно встановлено у &quot;IfAvailable&quot; при відсутності значення. В іншому випадку це поле є обовʼязковим.</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar` {#ExecEnvVar}

**Зʼявляється в:**

- [ExecConfig](#ExecConfig)

ExecEnvVar використовується для налаштування змінних середовища під час виконання втулка облікових даних на основі exec.

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

## `ExecInteractiveMode`     {#ExecInteractiveMode}

(Аліас для `string`)

**Зʼявляється в:**

- [ExecConfig](#ExecConfig)

ExecInteractiveMode є рядком, який описує взаємодію exec втулка зі стандартним вводом.

## `NamedAuthInfo` {#NamedAuthInfo}

**Зʼявляється в:**

- [Config](#Config)

NamedAuthInfo повʼязує псевдоніми з інформацією для автентифікації.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва є псевдонімом для цієї AuthInfo</p>
</td>
</tr>
<tr><td><code>user</code> <b>[Обовʼязкове]</b><br/>
<a href="#AuthInfo"><code>AuthInfo</code></a>
</td>
<td>
   <p>AuthInfo містить інформацію для автентифікації</p>
</td>
</tr>
</tbody>
</table>

## `NamedCluster` {#NamedCluster}

**Зʼявляється в:**

- [Config](#Config)

NamedCluster повʼязує псевдоніми з інформацією про кластер.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва є псевдонімом для цього кластера</p>
</td>
</tr>
<tr><td><code>cluster</code> <b>[Обовʼязкове]</b><br/>
<a href="#Cluster"><code>Cluster</code></a>
</td>
<td>
   <p>Cluster містить інформацію про кластер</p>
</td>
</tr>
</tbody>
</table>

## `NamedContext` {#NamedContext}

**Зʼявляється в:**

- [Config](#Config)

NamedContext повʼязує псевдоніми з інформацією про контекст</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва є псевдонімом для цього контексту</p>
</td>
</tr>
<tr><td><code>context</code> <b>[Обовʼязкове]</b><br/>
<a href="#Context"><code>Context</code></a>
</td>
<td>
   <p>Context містить інформацію про контекст</p>
</td>
</tr>
</tbody>
</table>

## `NamedExtension` {#NamedExtension}

**Зʼявляється в:**

- [Config](#Config)

- [AuthInfo](#AuthInfo)

- [Cluster](#Cluster)

- [Context](#Context)

- [Preferences](#Preferences)

NamedExtension повʼязує псевдоніми з інформацією про розширення</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>Назва є псевдонімом для цього розширення</p>
</td>
</tr>
<tr><td><code>extension</code> <b>[Обовʼязкове]</b><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Extension містить інформацію про розширення</p>
</td>
</tr>
</tbody>
</table>

## `Preferences`     {#Preferences}

**Зʼявляється в:**

- [Config](#Config)

<p>Застаріле: ця структура застаріла у версії 1.34. Вона не використовується жодним із компонентів Kubernetes.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>colors</code><br/>
<code>bool</code>
</td>
<td>
   <span class="text-muted">Опис не надано.</span></td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions містить додаткову інформацію. Це корисно для розширювачів, щоб читання і запис не пошкоджували невідомі поля</p>
</td>
</tr>
</tbody>
</table>
