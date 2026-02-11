---
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: false
---

Пакет v1 — це версія API v1.

## Типи ресурсів {#resource-types}

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)
- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)
- [TracingConfiguration](#apiserver-config-k8s-io-v1-TracingConfiguration)

## `TracingConfiguration` {#TracingConfiguration}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-config-k8s-io-v1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

<p>TracingConfiguration надає версійну конфігурацію для клієнтів трасування OpenTelemetry.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>endpoint</code><br/><code>string</code></td>
            <td><p>Точка доступу колектора, до якої цей компонент буде надсилати трейси. Зʼєднання є незахищеним і наразі не підтримує TLS. Рекомендовано не встановлювати, точкою доступу є стандартне значення otlp grpc, localhost:4317.</p></td>
        </tr>
        <tr>
            <td><code>samplingRatePerMillion</code><br/><code>int32</code></td>
            <td><p>SamplingRatePerMillion — це кількість зразків, які потрібно зібрати на мільйон відрізків. Рекомендується не встановлювати. Якщо не встановлено, семплер дотримується частоти дискретизації батьківського відрізка, але в іншому випадку ніколи не виконує дискретизацію.</p></td>
        </tr>
    </tbody>
</table>

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

## `AuthenticationConfiguration`     {#apiserver-config-k8s-io-v1-AuthenticationConfiguration}

<p>AuthenticationConfiguration надає версійну конфігурацію для автентифікації.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.config.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthenticationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>jwt</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-JWTAuthenticator"><code>[]JWTAuthenticator</code></a></td>
            <td><p>jwt — це список автентифікаторів для автентифікації користувачів Kubernetes за допомогою токенів, сумісних із JWT. Автентифікатор спробує проаналізувати необроблений ідентифікаційний токен і перевірити, чи він підписаний налаштованим емітентом. Відкритий ключ для перевірки підпису виявляється з публічної точки доступу емітента за допомогою виявлення OIDC. Для вхідного токена кожен автентифікатор JWT буде перевірений у порядку, в якому він вказаний у цьому списку. Однак зверніть увагу, що інші автентифікатори можуть працювати до або після автентифікаторів JWT. Конкретне положення автентифікаторів JWT у звʼязках з іншими автентифікаторами не визначено і не є стабільним у різних версіях. Оскільки кожен автентифікатор JWT повинен мати унікальний URL-адресу емітента, максимум один автентифікатор JWT спробує криптографічно перевірити токен.</p>
            <p>Мінімальний дійсне корисне навантаження JWT повинно містити наступні вимоги:
{
&quot;iss&quot;: &quot;https://issuer.example.com&quot;,
&quot;aud&quot;: [&quot;audience&quot;],
&quot;exp&quot;: 1234567890,
&quot;<!-- raw HTML omitted -->&quot;: &quot;username&quot;
}</p></td>
        </tr>
        <tr>
            <td><code>anonymous</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-AnonymousAuthConfig"><code>AnonymousAuthConfig</code></a></td>
            <td><p>Якщо присутній, --anonymous-auth не повинен бути встановлений</p></td>
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

## `TracingConfiguration`     {#apiserver-config-k8s-io-v1-TracingConfiguration}

<p>TracingConfiguration забезпечує версійну конфігурацію для клієнтів трасування.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.config.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>TracingConfiguration</code></td>
        </tr>
        <tr>
            <td><code>TracingConfiguration</code> <b>[Обовʼязково]</b><br/><a href="#TracingConfiguration"><code>TracingConfiguration</code></a></td>
            <td>(Члени<code>TracingConfiguration</code> вбудовані в цей тип.)
            <p>Вбудовує структуру конфігурації трасування конфігурації компонента</p></td>
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

## `AnonymousAuthCondition`     {#apiserver-config-k8s-io-v1-AnonymousAuthCondition}

**Зʼявляється в:**

- [AnonymousAuthConfig](#apiserver-config-k8s-io-v1-AnonymousAuthConfig)

<p>AnonymousAuthCondition описує умови, за яких слід увімкнути анонімну автентифікацію.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>path</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
            <td><p>Шлях, для якого ввімкнено анонімну автентифікацію.</p></td>
        </tr>
    </tbody>
</table>

## `AnonymousAuthConfig`     {#apiserver-config-k8s-io-v1-AnonymousAuthConfig}

**Зʼявляється в:**

- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)

<p>AnonymousAuthConfig забезпечує конфігурацію для анонімного автентифікатора.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>enabled</code> <b>[Обовʼязково]</b><br/><code>bool</code></td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
        <tr>
            <td><code>conditions</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a></td>
            <td><p>Якщо встановлено, анонімна автентифікація дозволена тільки в тому випадку, якщо запит відповідає одній з умов.</p></td>
        </tr>
    </tbody>
</table>

## `AudienceMatchPolicyType`     {#apiserver-config-k8s-io-v1-AudienceMatchPolicyType}

(Аліас до `string`)

**Зʼявляється в:**

- [Issuer](#apiserver-config-k8s-io-v1-Issuer)

<p>AudienceMatchPolicyType — це набір допустимих значень для issuer.audienceMatchPolicy.</p>

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

## `ClaimMappings`     {#apiserver-config-k8s-io-v1-ClaimMappings}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)

<p>ClaimMappings забезпечує конфігурацію для зіставлення вимог</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>username</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a></td>
            <td>
                <p>username представляє опцію для атрибуту імені користувача. Значення вимоги повинно бути єдиним рядком. Те саме, що й прапорці --oidc-username-claim та --oidc-username-prefix. Якщо встановлено username.expression, вираз повинен утворювати значення рядка. Якщо username.expression використовує 'claims.email', то 'claims.email_verified' має використовуватися в username.expression або extra[<em>].valueExpression або claimValidationRules[</em>].expression. Прикладом виразу правила перевірки заявки, який відповідає перевірці, що автоматично застосовується, коли username.claim встановлено на 'email', є 'claims.?email_verified.orValue(true) == true'. Явно порівнюючи значення з true, ми дозволяємо перевірці типу бачити, що результат буде булевим, і переконуємося, що небулева заявка email_verified буде виявлена під час виконання.</p>
                <p>У підході на основі прапорців --oidc-username-claim та --oidc-username-prefix є необовʼязковими. Якщо --oidc-username-claim не встановлено, стандартним значенням є &quot;sub&quot;. Для конфігурації автентифікації не існує стандартних значень для claim або prefix. Claim та prefix необхідно встановлювати явно. Для claim, якщо --oidc-username-claim не було встановлено за допомогою підходу на основі прапорців, налаштуйте username.claim=&quot;sub&quot; у конфігурації автентифікації. Для prefix: (1) --oidc-username-prefix=&quot;-&quot;, до імені користувача не було додано префікс. Для такої самої поведінки з використанням конфігурації автентифікації встановіть username.prefix=&quot;&quot; (2) --oidc-username-prefix=&quot;&quot; і  --oidc-username-claim != &quot;email&quot;, префікс був &quot;&lt;значення --oidc-issuer-url&gt;#&quot;. Для такої самої поведінки з використанням конфігурації автентифікації встановіть username.prefix=&quot;<!-- raw HTML omitted -->#&quot; (3) --oidc-username-prefix=&quot;<!-- raw HTML omitted -->&quot;. Для такої самої поведінки з використанням конфігурації автентифікації встановіть username.prefix=&quot;<!-- raw HTML omitted -->&quot;</p>
            </td>
        </tr>
        <tr>
            <td><code>groups</code><br/><a href="#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a></td>
            <td><p>groups представляє опцію для атрибуту groups. Значення вимоги повинно бути рядком або масивом рядків. Якщо встановлено groups.claim, необхідно вказати префікс (який може бути порожнім рядком). Якщо встановлено groups.expression, вираз повинен утворювати значення рядка або масиву рядків. Значення &quot;&quot;, [], та null трактуються як відсутність відповідності групи.</p></td>
        </tr>
        <tr>
            <td><code>uid</code><br/><a href="#apiserver-config-k8s-io-v1-ClaimOrExpression"><code>ClaimOrExpression</code></a></td>
            <td><p>uid представляє опцію для атрибуту uid. Claim повинен бути рядком в однині. Якщо встановлено uid.expression, вираз повинен утворювати рядкове значення.</p></td>
        </tr>
        <tr>
            <td><code>extra</code><br/><a href="#apiserver-config-k8s-io-v1-ExtraMapping"><code>[]ExtraMapping</code></a></td>
            <td><p>extra представляє опцію для додаткового атрибуту. Вираз повинен створювати значення рядка або масиву рядків. Якщо значення порожнє, додаткове зіставлення не буде присутнє.</p>
                <p>жорстко закодований ключ / значення extra</p>
                <ul>
                    <li>key: &quot;foo&quot;valueExpression: &quot;'bar'&quot; Це призведе до появи додаткового атрибуту — foo: [&quot;bar&quot;]</li>
                </ul>
                <p>жорстко закодований ключ, значення копіюється зі значення claim</p>
                <ul>
                    <li>key: &quot;foo&quot; valueExpression: &quot;claims.some_claim&quot; Це призведе до появи додаткового атрибуту — foo: [значення some_claim]</li>
                </ul>
                <p>hжорстко закодований ключ, значення походить від значення claim</p>
                <ul>
                    <li>key: &quot;admin&quot; valueExpression: '(has(claims.is_admin) &amp;&amp; claims.is_admin) ? &quot;true&quot;:&quot;&quot;' Це призведе до:</li>
                    <ul>
                        <li>якщо is_admin claim присутній і дійсний, додатковий атрибут — admin: [&quot;true&quot;]</li>
                        <li>якщо claim is_admin присутня і має значення false або claim is_admin відсутня, додаткові атрибути не додаватимуться</li>
                    </ul>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## `ClaimOrExpression`     {#apiserver-config-k8s-io-v1-ClaimOrExpression}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)

<p>ClaimOrExpression забезпечує конфігурацію для окремого твердження або виразу.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/><code>string</code></td>
            <td><p>claim — це JWT-вимога, яку потрібно використовувати. Необхідно встановити або claim, або expression. Взаємовиключні з expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/><code>string</code></td>
            <td>
                <p>expression представляє вираз, який буде обчислюватися CEL.</p>
                <p>Вирази CEL мають доступ до вмісту вимог токенів, організованих у змінну CEL:</p>
                <ul>
                    <li>'claims' — це map імен вимог до значень вимог. Наприклад, до змінної з іменем 'sub' можна отримати доступ як 'claims.sub'. До вкладених вимог можна отримати доступ за допомогою крапкової нотації, наприклад 'claims.foo.bar'.</li>
                </ul>
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</p>
                <p>Взаємовиключне з claim.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ClaimValidationRule`     {#apiserver-config-k8s-io-v1-ClaimValidationRule}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)

<p>ClaimValidationRule забезпечує конфігурацію для правила перевірки однієї вимоги.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/><code>string</code></td>
            <td><p>claim — це назва потрібної вимоги. Те саме, що й прапорець --oidc-required-claim. Підтримуються лише ключі вимог типу string. Взаємовиключні з expression та message.</p></td>
        </tr>
        <tr>
            <td><code>requiredValue</code><br/><code>string</code></td>
            <td><p>requiredValue — це значення потрібної вимоги. Те саме, що й прапорець --oidc-required-claim. Підтримуються лише значення вимог у вигляді string. Якщо вимога встановлена, а requiredValue не встановлено, вимога має бути присутня із значенням, встановленим як порожній рядок. Взаємовиключне з expression та message.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/><code>string</code></td>
            <td>
                <p>expression представляє вираз, який буде оцінений CEL. Повинен повертати логічне значення.</p>
                <p>Вирази CEL мають доступ до вмісту вимог токенів, організованих у змінні CEL:</p>
                <ul>
                    <li>'claims' — це map імен вимог до значень вимог. Наприклад, до змінної з іменем 'sub' можна отримати доступ як 'claims.sub'. До вкладених вимог можна отримати доступ за допомогою крапкової нотації, наприклад 'claims.foo.bar'. Для проходження перевірки необхідно повернути значення true.</li>
                </ul>
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</p>
                <p>Mutually exclusive with claim and requiredValue.</p>
            </td>
        </tr>
        <tr>
            <td><code>message</code><br/><code>string</code></td>
            <td><p>message налаштовує повідомлення про помилку, яке повертається, коли вираз повертає значення false. message є літеральним рядком. Взаємовиключний з claim та requiredValue.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelectorType`     {#apiserver-config-k8s-io-v1-EgressSelectorType}

(Аліас до `string`)

**Зʼявляється в:**

- [Issuer](#apiserver-config-k8s-io-v1-Issuer)

<p>EgressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання трафіку.</p>

## `ExtraMapping`     {#apiserver-config-k8s-io-v1-ExtraMapping}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)

<p>ExtraMapping забезпечує конфігурацію для одного додаткового зіставлення.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>key</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
            <td><p>key — це рядок, який використовується як додатковий атрибут key. key повинен бути префіксом домену (наприклад, example.org/foo). Усі символи перед першим &quot;/&quot; повинні бути дійсним піддоменом, як визначено в RFC 1123. Усі символи після першого &quot;/&quot; повинні бути дійсними символами шляху HTTP, як визначено в RFC 3986. key повинен бути в нижньому регістрі. Повинен бути унікальним.</p></td>
        </tr>
        <tr>
            <td><code>valueExpression</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
            <td>
                <p>valueExpression — це вираз CEL для отримання додаткового значення атрибута. valueExpression повинен створювати значення типу рядок або масив рядків. Значення &quot;&quot;, [] і null розглядаються як відсутність додаткового зіставлення. Порожні значення рядків, що містяться в масиві рядків, відфільтровуються.</p>
                <p>Вирази CEL мають доступ до вмісту вимог токенів, організованих у змінну CEL:</p>
                <ul>
                    <li>'claims' — це map імен вимог до значень вимог. Наприклад, до змінної з іменем 'sub' можна отримати доступ як 'claims.sub'. До вкладених вимог можна отримати доступ за допомогою крапкової нотації, наприклад 'claims.foo.bar'.</li>
                </ul>
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</p>
            </td>
        </tr>
    </tbody>
</table>

## `IdentityConfiguration` {#apiserver-config-k8s-io-v1-IdentityConfiguration}

**Зʼявляється в:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

IdentityConfiguration — це порожня структура, яка дозволяє використовувати трансформер ідентичності в конфігурації провайдера.

## `Issuer` {#apiserver-config-k8s-io-v1-Issuer}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)

<p>Issuer надає конфігурацію для конкретних налаштувань зовнішнього постачальника.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>url</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
            <td><p>url вказує на URL-адресу емітента у форматі https://url або https://url/path. Вона повинна відповідати запиту &quot;iss&quot; у представленому JWT та емітенту, отриманому з виявлення. Те саме значення, що й прапорець --oidc-issuer-url. Інформація про виявлення отримується з &quot;{url}/.well-known/openid-configuration&quot;, якщо вона не замінена discoveryURL. Повинна бути унікальною для всіх автентифікаторів JWT. Зверніть увагу, що конфігурація селектору egress не використовується для цього мережевого зʼєднання.</p></td>
        </tr>
        <tr>
            <td><code>discoveryURL</code><br/><code>string</code></td>
            <td>
                <p>discoveryURL, якщо вказано, замінює URL-адресу, яка використовується для отримання інформації про виявлення, замість використання &quot;{url}/.well-known/openid-configuration&quot;. Використовується точне вказане значення, тому  &quot;/.well-known/openid-configuration&quot; має бути включено в discoveryURL, якщо це необхідно.</p>
                <p>Поле  &quot;issuer&quot; у отриманій інформації про виявлення повинно відповідати полю &quot;issuer.url&quot; в AuthenticationConfiguration і буде використовуватися для перевірки заявки &quot;iss&quot; у представленому JWT. Це стосується сценаріїв, коли відомі та jwks точки доступу розміщені в іншому місці, ніж емітент (наприклад, локально в кластері).</p>
                <p>Приклад: URL-адреса виявлення, яка відкривається за допомогою сервісу Kubernetes 'oidc' в просторі імен 'oidc-namespace', а інформація про виявлення доступна за адресою '/.well-known/openid-configuration'. discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot; certificateAuthority використовується для перевірки зʼєднання TLS, а імʼя хосту в сертифікаті leaf має бути встановлено на 'oidc.oidc-namespace'.</p>
                <p>curl https://oidc.oidc-namespace/.well-known/openid-configuration (.discoveryURL field) { issuer: &quot;https://oidc.example.com&quot; (.url field) }</p>
                <p>discoveryURL повинен відрізнятися від url. Повинен бути унікальним для всіх автентифікаторів JWT. Зверніть увагу, що конфігурація селектора egress не використовується для цього мережевого зʼєднання.</p>
            </td>
        </tr>
        <tr>
            <td><code>certificateAuthority</code><br/><code>string</code></td>
            <td><p>certificateAuthority містить сертифікати центру сертифікації, закодовані у форматі PEM, які використовуються для перевірки зʼєднання під час отримання інформації про виявлення. Якщо не встановлено, використовується системний верифікатор. Те саме значення, що й вміст файлу, на який посилається прапорець --oidc-ca-file.</p></td>
        </tr>
        <tr>
            <td><code>audiences</code> <b>[Обовʼязково]</b><br/><code>[]string</code></td>
            <td><p>audiences — набір дозволених аудиторій, яким має бути видано JWT. Принаймні один із записів має відповідати вимозі &quot;aud&quot; у представлених JWT. Те саме значення, що й прапорець --oidc-client-id (хоча це поле підтримує масив). Повинно бути не порожнім.</p></td>
        </tr>
        <tr>
            <td><code>audienceMatchPolicy</code><br/><a href="#apiserver-config-k8s-io-v1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a></td>
            <td>
                <p>audienceMatchPolicy визначає, як поле &quot;audiences&quot; використовується для зіставлення з вимогою &quot;aud&quot; у представленому JWT. Допустимі значення:</p>
                <ol>
                    <li>&quot;MatchAny&quot;, коли вказано кілька аудиторій, і</li>
                    <li>порожній (або не встановлений) або &quot;MatchAny&quot;, коли вказано одну аудиторію.</li>
                </ol>
                <ul>
                    <li><p>MatchAny: вимога &quot;aud&quot; у представленому JWT повинна відповідати принаймні одному із записів у полі &quot;audiences&quot;. Наприклад, якщо &quot;audiences&quot; дорівнює [&quot;foo&quot;, &quot;bar&quot;], то вимога &quot;aud&quot; у представленому JWT повинна містити або &quot;foo&quot;, або &quot;bar&quot; (а може містити і те, і інше).</p></li>
                    <li><p>&quot;&quot;: Політика відповідності може бути порожньою (або не встановленою), коли в полі &quot;audiences&quot; вказана одна аудиторія. Вимога &quot;aud&quot; у представленому JWT повинна містити одну аудиторію (і може містити інші).</p></li>
                </ul>
                <p>Для більш детальної перевірки аудиторії використовуйте claimValidationRules. Приклад: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])' для вимагання точної відповідності.</p>
            </td>
        </tr>
        <tr>
            <td><code>egressSelectorType</code><br/><a href="#apiserver-config-k8s-io-v1-EgressSelectorType"><code>EgressSelectorType</code></a></td>
            <td>
                <p>egressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання всього трафіку, що має звʼязки з цим емітентом (виявлення, JWKS, розподілені вимоги тощо). Якщо не вказано, номеронабирач користувача не використовується. Якщо вказано, допустимими варіантами є &quot;controlplane&quot; та &quot;cluster&quot;. Вони відповідають повʼязаним значенням у --egress-selector-config-file.</p>
                <ul>
                    <li><p>controlplane: для трафіку, призначеного для передачі на панель управління.</p></li>
                    <li><p>cluster: для трафіку, призначеного для системи, що управляється Kubernetes.</p></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## `JWTAuthenticator`     {#apiserver-config-k8s-io-v1-JWTAuthenticator}

**Зʼявляється в:**

- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)

<p>JWTAuthenticator забезпечує конфігурацію для окремого автентифікатора JWT.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>issuer</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-Issuer"><code>Issuer</code></a></td>
            <td><p>issuer містить основні параметри підключення постачальника OIDC.</p></td>
        </tr>
        <tr>
            <td><code>claimValidationRules</code><br/><a href="#apiserver-config-k8s-io-v1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a></td>
            <td><p>claimValidationRules — це правила, які застосовуються для перевірки вимог токенів з метою автентифікації користувачів.</p></td>
        </tr>
        <tr>
            <td><code>claimMappings</code> <b>[Обовʼязково]</b><br/><a href="#apiserver-config-k8s-io-v1-ClaimMappings"><code>ClaimMappings</code></a></td>
            <td><p>claimMappings вказує, що вимоги токена повинні розглядатися як атрибути користувача.</p></td>
        </tr>
        <tr>
            <td><code>userValidationRules</code><br/><a href="#apiserver-config-k8s-io-v1-UserValidationRule"><code>[]UserValidationRule</code></a></td>
            <td><p>userValidationRules — це правила, які застосовуються до кінцевого користувача перед завершенням автентифікації. Вони дозволяють застосовувати інваріанти до вхідних ідентифікаторів, наприклад, запобігати використанню префікса системи, який зазвичай використовується компонентами Kubernetes. Правила перевірки обʼєднуються за допомогою логічного оператора AND і повинні повертати значення true, щоб перевірка пройшла успішно.</p></td>
        </tr>
    </tbody>
</table>

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

## `PrefixedClaimOrExpression` {#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)

<p>PrefixedClaimOrExpression забезпечує конфігурацію для одного префіксованого твердження або виразу.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/><code>string</code></td>
            <td><p>claim — це JWT-вимога, яку слід використовувати. Взаємовиключна з expression.</p></td>
        </tr>
        <tr>
            <td><code>prefix</code><br/><code>string</code></td>
            <td><p>prefix додається до значення claim, щоб запобігти конфліктам з наявними іменами. prefix потрібно встановити, якщо встановлено claim, і може бути порожнім рядком. Взаємовиключний з expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/><code>string</code></td>
            <td>
                <p>expression представляє вираз, який буде обчислюватися CEL.</p>
                <p>Вирази CEL мають доступ до вмісту вимог токенів, організованих у змінну CEL:</p>
                <ul>
                    <li>'claims' — це map імен вимог до значень вимог. Наприклад, до змінної з іменем 'sub' можна отримати доступ як 'claims.sub'. До вкладених вимог можна отримати доступ за допомогою крапкової нотації, наприклад 'claims.foo.bar'.</li>
                </ul>
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</p>
                <p>Взаємовиключні з claim та prefix.</p>
            </td>
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

## `UserValidationRule` {#apiserver-config-k8s-io-v1-UserValidationRule}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)

<p>UserValidationRule забезпечує конфігурацію для окремого правила перевірки інформації про користувача.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expression</code> <b>[Обовʼязково]</b><br/><code>string</code></td>
            <td>
                <p>expression представляє вираз, який буде оцінений CEL. Повинен повертати true, щоб перевірка пройшла успішно.</p>
                <p>Вирази CEL мають доступ до вмісту UserInfo, організованого у змінну CEL:</p>
                <ul>
                    <li>'user' - authentication.k8s.io/v1, обʼєкт Kind=UserInfo посилається на  https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122 для отримання визначення. Документація API: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</li>
                </ul>
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            </td>
        </tr>
        <tr>
            <td><code>message</code><br/><code>string</code></td>
            <td><p>message налаштовує повідомлення про помилку, яке повертається, коли правило повертає значення false. message є літеральним рядком..</p></td>
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
            <td><code>cacheAuthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheAuthorizedRequests визначає, чи слід кешувати авторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля AuthorizedTTL. Стандартно: true</p></td>
        </tr>
        <tr>
            <td>
                <code>unauthorizedTTL</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування 'unauthorized' відповідей від авторизатора вебхуку. Теж, що й встановлення прапорця <code>--authorization-webhook-cache-unauthorized-ttl</code>. Стандартно: 30s</p></td>
        </tr>
        <tr>
            <td><code>cacheUnauthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheUnauthorizedRequests визначає, чи слід кешувати неавторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля UnauthorizedTTL. Стандартно: true</p></td>
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
                <p>Документація CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            </td>
        </tr>
    </tbody>
</table>
