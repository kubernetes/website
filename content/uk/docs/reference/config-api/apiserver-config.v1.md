---
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: false
---

Пакет v1 — це версія API v1.

## Типи ресурсів {#resource-types}

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

## `AdmissionConfiguration` {#apiserver-config-k8s-io-v1-AdmissionConfiguration}

<p>AdmissionConfiguration надає версійовану конфігурацію для контролерів допуску.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.config.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AdmissionConfiguration</code></td>
        </tr>
        <tr>
            <td><code>plugins</code><br/>
                <a href="#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
            </td>
            <td> <p>Plugins дозволяє вказувати конфігурацію для кожного втулка контролю допуску.</p></td>
        </tr>
    </tbody>
</table>

## `EncryptionConfiguration` {#apiserver-config-k8s-io-v1-EncryptionConfiguration}

EncryptionConfiguration зберігає повну конфігурацію для провайдерів шифрування. Він також дозволяє використовувати шаблони для вказання ресурсів, які повинні бути зашифровані. Використовуйте '&ast;.&lt;group&gt;' для шифрування всіх ресурсів у групі або '&ast;.&ast;' для шифрування всіх ресурсів. '&ast;.' можна використовувати для шифрування всіх ресурсів у основній групі. '&ast;.&ast;' зашифрує всі ресурси, навіть користувацькі, які додаються після запуску сервера API. Використання шаблонів, що перекриваються в межах одного списку ресурсів або між кількома записами, не дозволяється, оскільки частина конфігурації буде неефективною. Списки ресурсів обробляються в порядку, причому перші списки мають пріоритет.

Приклад:

```yaml
kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
resources:
- resources:
  - events
  providers:
  - identity: {}  # не шифрувати події, навіть якщо *.* зазначено нижче
- resources:
  - secrets
  - configmaps
  - pandas.awesome.bears.example
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: c2VjcmV0IGlzIHNlY3VyZQ==
- resources:
  - '*.apps'
  providers:
  - aescbc:
      keys:
      - name: key2
        secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
- resources:
  - '*.*'
  providers:
  - aescbc:
      keys:
      - name: key3
        secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
```

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.config.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>EncryptionConfiguration</code></td>
        </tr>
        <tr>
            <td><code>resources</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
            </td>
            <td><p>resources — це список, що містить ресурси та відповідні їм провайдери шифрування.</p></td>
        </tr>
  </tbody>
</table>

## `AESConfiguration` {#apiserver-config-k8s-io-v1-AESConfiguration}

**Зʼявляється в:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

AESConfiguration містить конфігурацію API для AES-трансформера.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>keys</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
            </td>
            <td><p>keys — це список ключів, які використовуються для створення AES-трансформера. Кожен ключ повинен бути 32 байти для AES-CBC та 16, 24 або 32 байти для AES-GCM.</p></td>
        </tr>
    </tbody>
</table>

## `AdmissionPluginConfiguration` {#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration}

**Зʼявляється в:**

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)

AdmissionPluginConfiguration надає конфігурацію для одного втулка.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Name — це назва контролера допуску. Вона повинна відповідати зареєстрованій назві втулка контролю допуску.</p> </td>
        </tr>
        <tr>
            <td><code>path</code><br/>
                <code>string</code>
            </td>
            <td><p>Path — це шлях до конфігураційного файлу, який містить конфігурацію втулка</p></td>
        </tr>
        <tr>
            <td><code>configuration</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
            </td>
            <td><p>Configuration — це вбудований конфігураційний обʼєкт, який використовується як конфігурація втулка. Якщо він присутній, то буде використовуватися замість шляху до конфігураційного файлу.</p></td>
        </tr>
    </tbody>
</table>

## `IdentityConfiguration` {#apiserver-config-k8s-io-v1-IdentityConfiguration}

**Зʼявляється в:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

IdentityConfiguration — це порожня структура, яка дозволяє використовувати трансформер ідентичності в конфігурації провайдера.

## `KMSConfiguration` {#apiserver-config-k8s-io-v1-KMSConfiguration}

**Зʼявляється в:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

KMSConfiguration містить назву, розмір кешу та шлях до конфігураційного файлу для трансформера конвертів на основі KMS.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>
                <code>string</code>
            </td>
            <td><p>apiVersion KeyManagementService</p></td>
        </tr>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>name — це назва втулка KMS,який буде використовуватися.</p></td>
        </tr>
        <tr>
            <td><code>cachesize</code><br/>
                <code>int32</code>
            </td>
            <td><p>cachesize — це максимальна кількість секретів, які кешуються в памʼяті. Стандартне значення — 1000. Встановіть негативне значення, щоб вимкнути кешування. Це поле дозволено лише для провайдерів KMS v1.</p></td>
        </tr>
        <tr>
            <td><code>endpoint</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>endpoint — це адреса прослуховувння gRPC сервера, наприклад, &quot;unix:///var/run/kms-provider.sock&quot;.</p></td>
        </tr>
        <tr>
            <td><code>timeout</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>timeout для gRPC викликів до kms-втулка (наприклад, 5 секунд). Стандатне значення — 3 секунди.</p></td>
        </tr>
    </tbody>
</table>

## `Key` {#apiserver-config-k8s-io-v1-Key}

**Зʼявляється в:**

- [AESConfiguration](#apiserver-config-k8s-io-v1-AESConfiguration)

- [SecretboxConfiguration](#apiserver-config-k8s-io-v1-SecretboxConfiguration)

Key містить імʼя та секрет наданого ключа для трансформера.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>name — це імʼя ключа, який буде використовуватися при збереженні даних на диск.</p></td>
        </tr>
        <tr>
            <td><code>secret</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>secret — це фактичний ключ, закодований в base64.</p></td>
        </tr>
    </tbody>
</table>

## `ProviderConfiguration` {#apiserver-config-k8s-io-v1-ProviderConfiguration}

**Зʼявляється в:**

- [ResourceConfiguration](#apiserver-config-k8s-io-v1-ResourceConfiguration)

ProviderConfiguration зберігає надану конфігурацію для провайдера шифрування.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>aesgcm</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
            </td>
            <td><p>aesgcm — це конфігурація для трансформера AES-GCM.</p></td>
        </tr>
        <tr>
            <td><code>aescbc</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
            </td>
            <td><p>aescbc — це конфігурація для трансформера AES-CBC.</p></td>
        </tr>
        <tr>
            <td><code>secretbox</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
            </td>
            <td><p>secretbox — це конфігурація для трансформера на основі Secretbox.</p></td>
        </tr>
        <tr>
            <td><code>identity</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
            </td>
            <td><p>identity — це (порожня) конфігурація для трансформера ідентичності.</p></td>
        </tr>
        <tr>
            <td><code>kms</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
            </td>
            <td><p>kms містить назву, розмір кешу та шлях до конфігураційного файлу для трансформера конвертів на основі KMS.</p></td>
        </tr>
    </tbody>
</table>

## `ResourceConfiguration` {#apiserver-config-k8s-io-v1-ResourceConfiguration}

**Зʼявляється в:**

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

ResourceConfiguration зберігає конфігурацію для кожного ресурсу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>resources</code> <b>[Обовʼязково]</b><br/>
                <code>[]string</code>
            </td>
            <td><p>resources — це список ресурсів Kubernetes, які мають бути зашифровані. Імена ресурсів походять від <code>resource</code> або <code>resource.group</code> з group/version/resource. Наприклад: pandas.awesome.bears.example — це ресурс користувача з 'group': awesome.bears.example, 'resource': pandas. Використовуйте '&ast;.&ast;' для шифрування всіх ресурсів і '&ast;.&lt;group&gt;' для шифрування всіх ресурсів у певній групі. Наприклад: '&ast;.awesome.bears.example' зашифрує всі ресурси у групі 'awesome.bears.example'. Наприклад: '&ast;.' зашифрує всі ресурси в основній групі (такі як pods, configmaps тощо).</p></td>
        </tr>
        <tr>
            <td><code>providers</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
            </td>
            <td><p>providers — це список трансформерів, які використовуються для читання та запису ресурсів на диск. Наприклад: aesgcm, aescbc, secretbox, identity, kms.</p></td>
        </tr>
    </tbody>
</table>

## `SecretboxConfiguration` {#apiserver-config-k8s-io-v1-SecretboxConfiguration}

**Зʼявляється в:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

SecretboxConfiguration містить API конфігурацію для трансформера Secretbox.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>keys</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
            </td>
            <td><p>keys — це список ключів, які використовуються для створення трансформера Secretbox. Кожен ключ повинен бути довжиною 32 байти.</p></td>
        </tr>
    </tbody>
</table>
