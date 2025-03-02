---
title: Kubelet Configuration (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

## `CredentialProviderConfig` {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}

CredentialProviderConfig є конфігурацією, що містить інформацію про кожен втулок облікових даних exec. Kubelet читає цю конфігурацію з диска та активує кожен втулок відповідно до типу CredentialProvider.</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
<tr><td><code>providers</code> <b>[Обовʼязково]</b><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers є списком втулків провайдерів облікових даних, які будуть активовані kubelet. Кілька провайдерів можуть відповідати одному образу, в такому випадку облікові дані з усіх провайдерів будуть повернуті kubelet. Якщо кілька провайдерів викликаються для одного образу, результати обʼєднуються. Якщо провайдери повертають перекриваючі ключі автентифікації, використовується значення з провайдера, що знаходиться раніше в цьому списку.</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider` {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}

**Зʼявляється в:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

CredentialProvider представляє втулок exec, який буде викликаний kubelet. Втулок буде викликаний тільки тоді, коли образ, який завантажується, відповідає образам, які підтримуються втулком (див. matchImages).</p>

<table class="table">
<thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
<tbody>
<tr><td><code>name</code> <b>[Обовʼязково]</b><br/>
<code>string</code>
</td>
<td>
   <p>name є обовʼязковою назвою постачальника облікових даних. Назва повинна відповідати назві виконуваного файлу постачальника, як його бачить kubelet. Виконуваний файл повинен знаходитися в теці bin kubelet (встановленій за допомогою прапорця --image-credential-provider-bin-dir).</p>
</td>
</tr>
<tr><td><code>matchImages</code> <b>[Обовʼязково]</b><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages є обовʼязковим списком рядків, які використовуються для зіставлення з образами, щоб визначити, чи потрібно викликати цього провайдера. Якщо один з рядків відповідає запитаному образу від kubelet, втулок буде викликаний і отримає можливість надати облікові дані. Образи повинні містити домен реєстрації та URL шлях.</p>
   <p>Кожен запис у matchImages є шаблоном, який може містити порт і шлях. Глоби можуть використовуватися в домені, але не в порту чи шляху. Глоби підтримуються як піддомени, такі як <code>*.k8s.io</code> або <code>k8s.*.io</code>, і домени верхнього рівня, такі як <code>k8s.*</code>. Піддомени з частковими збігами, такі як <code>app*.k8s.io</code>, також підтримуються. Кожен шаблон може відповідати лише одному сегменту піддомена, тому <code>*.io</code> не відповідає <code>*.k8s.io</code>.</p>
   <p>Відповідність існує між образами і matchImage, коли все з наведеного нижче є істинними:</p>
   <ul>
   <li>Обидва містять однакову кількість частин домену, і кожна частина має збіг.</li>
   <li>Шлях URL образу matchImage повинен бути префіксом шляху URL цільового образу.</li>
   <li>Якщо imageMatch містить порт, порт також повинен мати збіг в образі.</li>
   </ul>
   <p>Приклади значень matchImages:</p>
   <ul>
   <li><code>123456789.dkr.ecr.us-east-1.amazonaws.com</code></li>
   <li><code>*.azurecr.io</code></li>
   <li><code>gcr.io</code></li>
   <li><code>*.*.registry.io</code></li>
   <li><code>registry.io:8080/path</code></li>
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
   <li>credentialprovider.kubelet.k8s.io/v1alpha1</li>
   </ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Аргументи, які слід передати команді при її виконанні.</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env визначає додаткові змінні середовища, які слід надати процесу. Вони обʼєднуються з середовищем хоста, а також з змінними, які використовує client-go для передачі аргументів втулку.</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar` {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}

**Зʼявляється в:**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)

ExecEnvVar використовується для встановлення змінних середовища при виконанні втулка облікових даних на основі exec.

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
