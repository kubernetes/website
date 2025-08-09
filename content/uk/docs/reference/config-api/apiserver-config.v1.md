---
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: false
---

Пакет v1 — це версія API v1.

## Типи ресурсів {#resource-types}

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)
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
            <td><p>Plugins дозволяє вказувати конфігурацію для кожного втулка контролю допуску.</p></td>
        </tr>
    </tbody>
</table>

## `AuthorizationConfiguration` {#apiserver-config-k8s-io-v1-AuthorizationConfiguration}

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.config.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthorizationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>authorizers</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
            </td>
            <td><p>Авторизатори — це впорядкований список авторизаторів для авторизації запитів. Це схоже на прапорець --authorization-modes kube-apiserver Має бути принаймні один.</p>
            </td>
        </tr>
    </tbody>
</table>

## `EncryptionConfiguration` {#apiserver-config-k8s-io-v1-EncryptionConfiguration}

EncryptionConfiguration зберігає повну конфігурацію для провайдерів шифрування. Він також дозволяє використовувати шаблони для вказання ресурсів, які повинні бути зашифровані. Використовуйте '\*.\<group\>' для шифрування всіх ресурсів у групі або '\*.\*' для шифрування всіх ресурсів. '\*.' можна використовувати для шифрування всіх ресурсів у основній групі. '\*.\*' зашифрує всі ресурси, навіть користувацькі, які додаються після запуску сервера API. Використання шаблонів, що перекриваються в межах одного списку ресурсів або між кількома записами, не дозволяється, оскільки частина конфігурації буде неефективною. Списки ресурсів обробляються в порядку, причому перші списки мають пріоритет.

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

## `AuthorizerConfiguration` {#apiserver-config-k8s-io-v1-AuthorizerConfiguration}

**Зʼявляється в:**

- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)

<table class="table">
    <thead>
        <tr><th width="30%">Поле</th><th>Опис</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Тип відноситься до типу авторизатора &quot;Webhook&quot; підтримується в загальному API сервері. Інші API сервери можуть підтримувати додаткові типи авторизаторів, такі як Node, RBAC, ABAC тощо.</p></td>
        </tr>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Name використовується для опису веб-хука. Це явно використовується в механізмах моніторингу для метрик. Примітка: Імена мають бути у вигляді міток DNS1123, наприклад <code>myauthorizername</code> або піддомени, як <code>myauthorizer.example.domain</code>. Обовʼязкове, без стандартного значення.</p></td>
        </tr>
        <tr>
            <td><code>webhook</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
            </td>
            <td><p>Webhook визначає конфігурацію для авторизації Webhook. Має бути визначений, якщо Type=Webhook. Не повинно бути визначено, якщо Type!=Webhook</p></td>
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
            <td><p>resources — це список ресурсів Kubernetes, які мають бути зашифровані. Імена ресурсів походять від <code>resource</code> або <code>resource.group</code> з group/version/resource. Наприклад: pandas.awesome.bears.example — це ресурс користувача з 'group': awesome.bears.example, 'resource': pandas. Використовуйте '\*.\*' для шифрування всіх ресурсів і '\*.\<group\>' для шифрування всіх ресурсів у певній групі. Наприклад: '\*.awesome.bears.example' зашифрує всі ресурси у групі 'awesome.bears.example'. Наприклад: '\*.' зашифрує всі ресурси в основній групі (такі як pods, configmaps тощо).</p></td>
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

## `WebhookConfiguration` {#apiserver-config-k8s-io-v1-WebhookConfiguration}

**Зʼявляється в:**

- [AuthorizerConfiguration](#apiserver-config-k8s-io-v1-AuthorizerConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>authorizedTTL</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування 'authorized' відповідей від авторизатора вебхуку. Теж, що й встановлення прапорця <code>--authorization-webhook-cache-authorized-ttl</code>. Стандартно: 5m0s</p></td>
        </tr>
        <tr>
            <td>
                <code>unauthorizedTTL</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування 'unauthorized' відповідей від авторизатора вебхуку. Теж, що й встановлення прапорця <code>--authorization-webhook-cache-unauthorized-ttl</code>. Стандартно: 30s</p></td>
        </tr>
        <tr>
            <td>
                <code>timeout</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Таймаут для запиту веб-хука. Максимально допустиме значення — 30 секунд. Обовʼязкове, без стандартного значення.</p></td>
        </tr>
        <tr>
            <td>
                <code>subjectAccessReviewVersion</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Версія API authorization.k8s.io SubjectAccessReview, яку потрібно надсилати до веб-хука та очікувати від нього. Теж, що й встановлення прапорця <code>--authorization-webhook-version</code>. Допустимі значення: v1beta1, v1. Обовʼязкове, без стандартного значення.</p></td>
        </tr>
        <tr>
            <td>
                <code>matchConditionSubjectAccessReviewVersion</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview version the CEL expressions are evaluated against. Допустимі значення: v1. Обовʼязкове, без стандартного значення.</p></td>
        </tr>
        <tr>
            <td>
                <code>failurePolicy</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
        <td>
            <p>Керує рішенням про авторизацію, коли вебхук не може завершити запит або повертає неправильну відповідь чи помилки в оцінці matchConditions. Допустимі значення:</p>
                <ul>
                    <li>NoOpinion: продовжити до наступних авторизаторів, щоб побачити, чи дозволив хтось із них запит</li>
                    <li>Deny: відхилити запит без узгодження з наступними авторизаторами. Обовʼязкове, без стандартного значення.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
                <code>connectionInfo</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
            </td>
            <td><p>ConnectionInfo визначає, як ми звʼязуємося з веб-хуком</p></td>
        </tr>
        <tr>
            <td>
                <code>matchConditions</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-config-k8s-io-v1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
            </td>
            <td>
                <p>matchConditions — це список умов, яким повинен відповідати запит, щоб бути відправленим на цей вебхук. Порожній список matchConditions відповідає всім запитам. Допускається максимум 64 умови збігу.</p>
                <p>Логіка точного збігу така (по порядку):</p>
                <ol>
                    <li>Якщо хоча б одне значення matchCondition дорівнює FALSE, то вебхук пропускається.</li>
                    <li>Якщо ALL matchConditions мають значення TRUE, то викликається веб-хук.</li>
                    <li>Якщо хоча б одне matchCondition повертає помилку (але жодне з них не є FALSE):
                    <ul>
                        <li>If failurePolicy=Deny, тоді веб-хук відхиляє запит</li>
                        <li>If failurePolicy=NoOpinion, то помилка ігнорується і веб-хук пропускається</li>
                    </ul>
                    </li>
                </ol>
            </td>
        </tr>
    </tbody>
</table>

## `WebhookConnectionInfo` {#apiserver-config-k8s-io-v1-WebhookConnectionInfo}

**Зʼявляється в:**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>type</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>Керує тим, як веб-хук повинен взаємодіяти з сервером. Допустимі значення:</p>
                <ul>
                    <li>KubeConfigFile: використовуйте файл, вказаний у kubeConfigFile, щоб визначити місцезнаходження сервера.</li>
                    <li>InClusterConfig: використовувати внутрішньокластерну конфігурацію для виклику API SubjectAccessReview, розміщеного на kube-apiserver. Цей режим не дозволено для kube-apiserver.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
                <code>kubeConfigFile</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Шлях до KubeConfigFile для інформації про зʼєднання. Обов'язковий, якщо connectionInfo. Має тип KubeConfig</p></td>
        </tr>
    </tbody>
</table>

## `WebhookMatchCondition` {#apiserver-config-k8s-io-v1-WebhookMatchCondition}

**Зʼявляється в:**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td>
                <code>expression</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td>
                <p>expression представляє вираз, який буде обчислено CEL. Повинен мати тип bool. Вирази CEL мають доступ до вмісту SubjectAccessReview у версії v1. Якщо версія, вказана в subjectAccessReviewVersion у змінній запиту, має значення v1beta1, вміст буде перетворено у версію v1 перед обчисленням виразу CEL.</p>
                <ul>
                    <li>'resourceAttributes' описує інформацію для запиту доступу до ресурсу і не встановлюється для нересурсних запитів, наприклад, has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</li>
                    <li>'nonResourceAttributes' описує інформацію для запиту доступу до нересурсів і не встановлюється для запитів до ресурсів. наприклад, has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.</li>
                    <li>'user' — користувач, для якого потрібно перевірити, наприклад, request.user == 'alice'</li>
                    <li>'groups' — це групи, для яких потрібно протестувати, наприклад, ('group1' в request.groups)</li>
                    <li>'extra' відповідає методу user.Info.GetExtra() з автентифікатора.</li>
                    <li>'uid' — інформація про користувача, який надіслав запит, наприклад, request.uid == '1'.</li>
                </ul>
                <p>Documentation on CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            </td>
        </tr>
    </tbody>
</table>
