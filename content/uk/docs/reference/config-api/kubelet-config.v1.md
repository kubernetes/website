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
   <p>providers є списком втулків провайдерів облікових даних, які будуть активовані kubelet. Кілька провайдерів можуть відповідати одному образу, в такому випадку облікові дані з усіх провайдерів будуть повернуті kubelet. Якщо кілька провайдерів викликаються для одного образу, результати обʼєднуються. Якщо провайдери повертають перекриваючі ключі автентифікації, використовується значення з провайдера, що знаходиться раніше в цьому списку.</p>
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
   <p>name є обовʼязковим імʼям провайдера облікових даних. Назва повинна відповідати імені виконуваного файлу провайдера, яке бачить kubelet. Виконуваний файл повинен бути в директорії bin kubelet (встановленій за допомогою прапорця --image-credential-provider-bin-dir).</p>
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
