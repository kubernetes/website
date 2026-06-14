---
title: Kubelet CredentialProvider (v1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

## `CredentialProviderRequest` {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest}

CredentialProviderRequest включає образ, для якого kubelet вимагає автентифікацію. Kubelet передасть цей обʼєкт запиту втулку через stdin. Загалом втулки повинні відповідати тією ж версією API, яку вони отримали.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderRequest</code></td></tr>
<tr><td><code>image</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>image — це образ контейнеа, який завантажується в рамках запиту втулка для автентифікатора. Втулки можуть за бажанням розпарсити образ для отримання будь-якої інформації, необхідної для отримання облікових даних.</p>
</td>
</tr>
<tr><td><code>serviceAccountToken</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>serviceAccountToken - токен службового облікового запису, привʼязаного до пода, для якого витягується образ. Цей токен надсилається до втулка, лише якщо у конфігурації постачальника облікових даних kubelet'а вказано поле tokenAttributes.serviceAccountTokenAudience.</p>
</td>
</tr>
<tr><td><code>serviceAccountAnnotations</code> <b>[Обовʼязково]</b><br/>
<code>map[string]string</code>
</td>
<td>
   <p>serviceAccountAnnotations - мапа анотацій в службовому обліковому записі, привʼязаному до пода, для якого витягується образ. Список анотацій в обліковому записі сервісу, які потрібно передати втулку, налаштовується в конфігурації постачальника облікових даних kubelet.</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProviderResponse` {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse}

CredentialProviderResponse містить облікові дані, які kubelet повинен використовувати для зазначеного образу, наданого в оригінальному запиті. Kubelet буде читати відповідь з втулка через stdout. Ця відповідь повинна бути встановлена на ту ж версію API, що й CredentialProviderRequest.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderResponse</code></td></tr>
<tr><td><code>cacheKeyType</code> <b>[Обовʼязкове]</b><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1-PluginCacheKeyType"><code>PluginCacheKeyType</code></a>
</td>
<td>
   <p>cacheKeyType вказує тип ключа кешування для використання на основі образу, наданого в запиті. Є три дійсні значення для типу ключа кешування: Image, Registry і Global. Якщо вказано недійсне значення, kubelet не буде використовувати відповідь.</p>
</td>
</tr>
<tr><td><code>cacheDuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>cacheDuration вказує тривалість, впродовж якої облікові дані повинні бути кешовані. Kubelet використовуватиме це поле для налаштування тривалості кешування в пам’яті для облікових даних в AuthConfig. Якщо null, kubelet використовуватиме defaultCacheDuration, надану в CredentialProviderConfig. Якщо встановлено 0, kubelet не буде кешувати наданий AuthConfig.</p>
</td>
</tr>
<tr><td><code>auth</code><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1-AuthConfig"><code>map[string]AuthConfig</code></a>
</td>
<td>
   <p>auth — це map, що містить інформацію для автентифікації, передану в kubelet. Кожен ключ є рядком для образу (детальніше про це нижче). Відповідний authConfig має бути дійсним для всіх образів, що відповідають цьому ключу. Втулок повинен встановити це поле в null, якщо не можна повернути дійсні облікові дані для запитаного образу.</p>
    <p>Кожен ключ у map є шаблоном, який може містити порт і шлях. Глоби можна використовувати в домені, але не в порті або шляху. Глоби підтримуються як піддомени, такі як '&ast;.k8s.io' або 'k8s.&ast;.io', і домени верхнього рівня, такі як 'k8s.&ast;'. Часткові піддомени, такі як 'app&ast;.k8s.io', також підтримуються. Кожен глоб може відповідати лише одному сегменту піддомена, тому '&ast;.io' не відповідає '&ast;.k8s.io'.</p>
    <p>Kubelet буде порівнювати образ з ключем, коли всі з наступного є істинними:</p>
    <ul>
        <li>Обидва містять однакову кількість частин домену, і кожна частина має збіг.</li>
        <li>URL шлях imageMatch має бути префіксом цільового URL шляху образу.</li>
        <li>Якщо imageMatch містить порт, то порт також повинен збігатись в образі.</li>
    </ul>
    <p>Коли повертається кілька ключів, kubelet проходитиме через усі ключі у зворотному порядку, щоб:</p>
    <ul>
      <li>довші ключі з’являються перед коротшими ключами з тим самим префіксом</li>
      <li>ключі з глобами з’являються перед ключами без глобів з тим самим префіксом.</li>
    </ul>
    <p>Для будь-якого відповідного образу kubelet спробує завантажити образ з наданими обліковими даними, зупиняючись після першого успішно автентифікованого завантаження.</p>
    <p>Приклади ключів:</p>
    <ul>
        <li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
        <li>&ast;.azurecr.io</li>
        <li>gcr.io</li>
        <li>&ast;.&ast;.registry.io</li>
        <li>registry.io:8080/path</li>
    </ul>
</td>
</tr>
</tbody>
</table>

## `AuthConfig`{#credentialprovider-kubelet-k8s-io-v1-AuthConfig}

**Зустрічається в:**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

AuthConfig містить інформацію для автентифікації для реєстру контейнерів.
Сьогодні підтримується тільки автентифікація на основі імені користувача та пароля, але в майбутньому можуть бути додані інші механізми автентифікації.

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>username</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>username — це імʼя користувача, яке використовується для автентифікації в реєстрі контейнерів. Порожнє імʼя користувача є дійсним.</p>
</td>
</tr>
<tr><td><code>password</code> <b>[Обовʼязкове]</b><br/>
<code>string</code>
</td>
<td>
   <p>password — це пароль, який використовується для автентифікації в реєстрі контейнерів. Порожній пароль є дійсним.</p>
</td>
</tr>
</tbody>
</table>

## `PluginCacheKeyType` {#credentialprovider-kubelet-k8s-io-v1-PluginCacheKeyType}

(Аліас `string`)

**Зустрічається в:**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)
