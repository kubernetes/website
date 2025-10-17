---
title: kube-apiserver Configuration (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
auto_generated: false
---

Пакет v1beta1 є версією v1beta1 API.

## Типи ресурсів {#resource-types}

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-k8s-io-v1beta1-AuthorizationConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

## `TracingConfiguration`{#TracingConfiguration}

**З’являється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

TracingConfiguration надає версійні налаштування для клієнтів трасування OpenTelemetry.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>endpoint</code><br/>
                <code>string</code>
            </td>
            <td><p>Точка доступу колектора, до якого цей компонент буде надсилати трасування. Зʼєднання є незахищеним і наразі не підтримує TLS. Рекомендовано не встановлювати, стандартна точка доступу для otlp grpc — localhost:4317.</p></td>
        </tr>
        <tr>
            <td><code>samplingRatePerMillion</code><br/>
                <code>int32</code>
            </td>
            <td><p>SamplingRatePerMillion — це кількість зразків для збору на мільйон відрізків. Рекомендовано не встановлювати. Якщо не задано, семплер дотримується частоти дискретизації батьківського діапазону а якщо ні, то ніколи не робить вибірки.</p></td>
        </tr>
    </tbody>
</table>

## `AuthenticationConfiguration` {#apiserver-k8s-io-v1beta1-AuthenticationConfiguration}

AuthenticationConfiguration надає версійні налаштування для автентифікації.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1beta1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthenticationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>jwt</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-JWTAuthenticator"><code>[]JWTAuthenticator</code></a>
            </td>
            <td><p>jwt — це список автентифікаторів для автентифікації користувачів Kubernetes за допомогою токенів, що відповідають стандартам JWT. Автентифікатор спробує розібрати необроблений ID токен, перевірити, чи підписаний він налаштованим видавцем. Публічний ключ для перевірки підпису виявляється з публічної кінцевої точки видавця за допомогою OIDC discovery. Для вхідного токена кожен JWT автентифікатор буде спробуваний у порядку, в якому він зазначений у цьому списку. Однак зверніть увагу, що інші автентифікатори можуть працювати до або після JWT автентифікаторів. Конкретне положення JWT автентифікаторів щодо інших автентифікаторів не визначено і не стабільне між випусками. Оскільки кожен JWT автентифікатор повинен мати унікальний URL видавця, максимум один JWT автентифікатор спробує криптографічно перевірити токен.</p>
            <p>Мінімально допустимий JWT payload повинен містити наступні заявки:
<pre><code>{
&quot;iss&quot;: &quot;https://issuer.example.com&quot;,
&quot;aud&quot;: [&quot;audience&quot;],
&quot;exp&quot;: 1234567890,
&quot;<!-- raw HTML omitted -->&quot;: &quot;username&quot;
}</code></pre></p></td>
        </tr>
        <tr>
            <td><code>anonymous</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-AnonymousAuthConfig"><code>AnonymousAuthConfig</code></a>
            </td>
            <td><p>Якщо присутній --anonymous-auth не повинен бути встановлений</p></td>
        </tr>
    </tbody>
</table>

## `AuthorizationConfiguration` {#apiserver-k8s-io-v1beta1-AuthorizationConfiguration}

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1beta1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthorizationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>authorizers</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
            </td>
            <td><p>Authorizers — це впорядкований список авторизаторів для авторизації запитів. Це схоже на прапорець — --authorization-modes kube-apiserver. Має бути принаймні один.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelectorConfiguration` {#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration}

EgressSelectorConfiguration надає версійні налаштування для клієнтів вибору egress.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1beta1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>EgressSelectorConfiguration</code></td>
        </tr>
        <tr>
            <td><code>egressSelections</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-EgressSelection"><code>[]EgressSelection</code></a>
            </td>
            <td><p>connectionServices містить список налаштувань клієнтів вибору egress.</p></td>
        </tr>
    </tbody>
</table>

## `TracingConfiguration` {#apiserver-k8s-io-v1beta1-TracingConfiguration}

TracingConfiguration надає версійні налаштування для клієнтів трасування.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1beta1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>TracingConfiguration</code></td>
        </tr>
        <tr>
            <td><code>TracingConfiguration</code> <b>[Обовʼязково]</b><br/>
                <a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
            </td>
            <td>(Елементи <code>TracingConfiguration</code> вбудовані в цей тип.)
                <p>Вбудуйте структуру конфігурації трасування компонента.</p>
            </td>
        </tr>
    </tbody>
</table>

## `AnonymousAuthCondition` {#apiserver-k8s-io-v1beta1-AnonymousAuthCondition}

**З’являється в:**

- [AnonymousAuthConfig](#apiserver-k8s-io-v1beta1-AnonymousAuthConfig)

AnonymousAuthCondition описує стан, за якого анонімні автентифікації мають бути увімкнені.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>path</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Шлях для якого увімкнено анонімну автентифікацію.</p></td>
        </tr>
    </tbody>
</table>

## `AnonymousAuthConfig`{#apiserver-k8s-io-v1beta1-AnonymousAuthConfig}

**З’являється в:**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)

AnonymousAuthConfig надає конфігурацію для анонімного автентифікатора.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>enabled</code> <b>[Обовʼязково]</b><br/>
                <code>bool</code>
            </td>
            <td><span class="text-muted">Опис не надано.</span></td>
        </tr>
        <tr>
            <td><code>conditions</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a>
            </td>
            <td><p>Якщо встановлено, анонімна автентифікація дозволена, тільки якщо запит відповідає одній з умов.</p></td>
        </tr>
    </tbody>
</table>

## `AudienceMatchPolicyType` {#apiserver-k8s-io-v1beta1-AudienceMatchPolicyType}

(Аліас  `string`)

**З’являється в:**

- [Issuer](#apiserver-k8s-io-v1beta1-Issuer)

AudienceMatchPolicyType — це набір допустимих значень для issuer.audienceMatchPolicy

## `AuthorizerConfiguration` {#apiserver-k8s-io-v1beta1-AuthorizerConfiguration}

**З’являється в:**

- [AuthorizationConfiguration](#apiserver-k8s-io-v1beta1-AuthorizationConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Тип відноситься до типу авторизатора &quot;Webhook&quot; підтримується у загальному API сервері Інші API сервери можуть підтримувати додаткові типи авторизаторів такі як Node, RBAC, ABAC і т.д.</p></td>
        </tr>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Імʼя, яке використовується для опису webhook Це явно використовується в моніторинговій машинерії для метрик Примітка: Імена повинні бути мітками DNS1123, такими як <code>myauthorizername</code> або піддоменами, такими як <code>myauthorizer.example.domain</code> Обовʼязково, стандартного значення немає</p></td>
        </tr>
        <tr>
            <td><code>webhook</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
            </td>
            <td><p>Webhook визначає налаштування для Webhook авторизатора Має бути визначено, коли Type=Webhook Не повинно бути визначено, коли Type!=Webhook</p></td>
        </tr>
    </tbody>
</table>

## `ClaimMappings` {#apiserver-k8s-io-v1beta1-ClaimMappings}

**З’являється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

ClaimMappings надає налаштування для мапінгу claims.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>username</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
            </td>
            <td><p>username представляє опцію для атрибуту username. Значення claim має бути одним рядком. Те ж саме, що й прапори --oidc-username-claim та --oidc-username-prefix. Якщо встановлено username.expression, вираз повинен видавати значення рядка. Якщо username.expression використовує 'claims.email', тоді 'claims.email_verified' повинен використовуватися в username.expression або extra[&ast;].valueExpression or claimValidationRules[&ast;].expression. Приклад виразу правила валідації claims, який відповідає валідації, що автоматично застосовується, коли username.claim встановлено на 'email', — це 'claims.?email_verified.orValue(true) == true'. Явно порівнюючи значення значення з true, ми дозволимо перевірці типів побачити, що результат буде булевим, і переконатися, що небулевий email_verified буде перехоплено під час виконання.</p>
            <p>У підході на основі прапорів, прапорці --oidc-username-claim та --oidc-username-prefix є необовʼязковими. Якщо --oidc-username-claim не встановлено, стандартне значення — &quot;sub&quot;. Для конфігурації автентифікації стандартне значення для claim або prefix відсутні. Claim та prefix повинні бути встановлені явно. Для claim, якщо прапорець --oidc-username-claim не було встановлено за допомогою старого підходу, налаштуйте username.claim=&quot;sub&quot; у конфігурації автентифікації. Для prefix: (1) --oidc-username-prefix=&quot;-&quot;, префікс не додавався до імені користувача. Для такої ж поведінки за допомогою конфігурації автентифікації, встановіть username.prefix=&quot;&quot; (2) --oidc-username-prefix=&quot;&quot; та  --oidc-username-claim != &quot;email&quot;, префікс був &quot;&lt;значення --oidc-issuer-url&gt;#&quot;. Для такої ж поведінки за допомогою конфігурації автентифікації, встановіть username.prefix=&quot;<!-- raw HTML omitted -->#&quot; (3) --oidc-username-prefix=&quot;<!-- raw HTML omitted -->&quot;. Для такої ж поведінки за допомогою конфігурації автентифікації, встановіть username.prefix=&quot;<!-- raw HTML omitted -->&quot;</p></td>
        </tr>
        <tr>
            <td><code>groups</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
            </td>
            <td><p>groups представляє опцію для атрибуту groups. Значення claim має бути рядком або масивом рядків. Якщо groups.claim встановлено, префікс повинен бути вказаний (і може бути порожнім рядком). Якщо groups.expression встановлено, вираз повинен видавати значення рядка або масиву рядків. &quot;&quot;, [], і null значення розглядаються як відсутність мапінгу групи.</p></td>
        </tr>
        <tr>
            <td><code>uid</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-ClaimOrExpression"><code>ClaimOrExpression</code></a>
            </td>
            <td><p>uid представляє опцію для атрибуту uid. Claim повинен бути одним рядковим claim. Якщо uid.expression встановлено, вираз повинен видавати значення рядка.</p></td>
        </tr>
        <tr>
            <td><code>extra</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-ExtraMapping"><code>[]ExtraMapping</code></a>
            </td>
            <td><p>extra представляє опцію для атрибуту extra. вираз повинен видавати значення рядка або масиву рядків. Якщо значення порожнє, мапінг extra не буде присутнім.</p>
            <p>жорстко закодований extra ключ/значення</p>
            <ul>
                <li>key: &quot;foo&quot;
                    valueExpression: &quot;'bar'&quot;
                    Це призведе до появи extra атрибуту — foo: [&quot;bar&quot;]</li>
            </ul>
            <p>жорстко закодований ключ, значення копіюється з значення claim</p>
            <ul>
                <li>key: &quot;foo&quot;
                    valueExpression: &quot;claims.some_claim&quot;
                    Це призведе до появи extra атрибуту - foo: [значення some_claim]</li>
            </ul>
            <p>жорстко закодований ключ, значення виводиться з значення claim</p>
            <ul>
                <li>key: &quot;admin&quot;
                    valueExpression: '(has(claims.is_admin) &amp;&amp; claims.is_admin) ? &quot;true&quot;:&quot;&quot;'
                    Це призведе до:</li>
                <li>якщо claim is_admin присутній та true, extra атрибут — admin: [&quot;true&quot;]</li>
                <li>якщо claim is_admin присутній та false або claim is_admin не присутній, extra атрибут не буде доданий</li>
            </ul>
          </td>
        </tr>
    </tbody>
</table>

## `ClaimOrExpression` {#apiserver-k8s-io-v1beta1-ClaimOrExpression}

**З’являється в:**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

ClaimOrExpression надає налаштування для одного claim або виразу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це JWT claim для використання. Має бути встановлено або claim, або expression. Взаємовиключне з expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися за допомогою CEL.</p>
            <p>CEL вирази мають доступ до вмісту claims токену, організованих у CEL змінну:</p>
            <ul>
                <li>'claims' — це map з назвами claims до значень claims. Наприклад, змінну з назвою 'sub' можна отримати доступом як 'claims.sub'. Вкладені claims можна отримати доступом за допомогою нотації через крапку, наприклад 'claims.foo.bar'.</li>
            </ul>
            <p>Документація з CEL: <a href="docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            <p>Взаємовиключне з claim.</p></td>
        </tr>
    </tbody>
</table>

## `ClaimValidationRule` {#apiserver-k8s-io-v1beta1-ClaimValidationRule}

**З’являється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

ClaimValidationRule забезпечує конфігурацію для одного правила валідації заяви.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це імʼя необхідної заяви. Такий же, як прапорець --oidc-required-claim. Підтримуються тільки ключі заяв у форматі рядка. Взаємно виключає з expression та message.</p></td>
        </tr>
        <tr>
            <td><code>requiredValue</code><br/>
                <code>string</code>
            </td>
            <td><p>requiredValue — це значення необхідної заяви. Такий же, як прапорець --oidc-required-claim. Підтримуються тільки значення заяв у форматі рядка. Якщо claim встановлено, а requiredValue не встановлено, заява повинна бути присутня з значенням, яке дорівнює порожньому рядку. Взаємновиключнє з expression та message.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінений CEL. Повинен повернути булеве значення.</p>
            <p>Вирази CEL мають доступ до вмісту заявок токена, організованого у змінну CEL:</p>
            <ul>
                <li>'claims' — це відображення імен заявок на значення заявок. Наприклад, змінна з імʼям 'sub' може бути доступна як 'claims.sub'. Вкладені заяви можна отримати, використовуючи крапкову нотацію, наприклад 'cl ims.foo.bar'. Повинен повернути true для успішної валідації.</li>
            </ul>
            <p>Документація з CEL: <a href="docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            <p>Взаємовиключне з claim та requiredValue.</p></td>
        </tr>
        <tr>
            <td><code>message</code><br/>
                <code>string</code>
            </td>
            <td><p>message налаштовує повідомлення про помилку, яке повертається, коли expression повертає false. message є літералним рядком. Взаємовиключне з claim та requiredValue.</p></td>
        </tr>
    </tbody>
</table>

## `Connection` {#apiserver-k8s-io-v1beta1-Connection}

**З’являється в:**

- [EgressSelection](#apiserver-k8s-io-v1beta1-EgressSelection)

Connection надає конфігурацію для одного клієнта вибору egress зʼєднання.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>proxyProtocol</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-ProtocolType"><code>ProtocolType</code></a>
            </td>
                <td><p>Protocol — це протокол, який використовується для зʼєднання клієнта з konnectivity сервером.</p></td>
            </tr>
            <tr>
                <td><code>transport</code><br/>
                    <a href="#apiserver-k8s-io-v1beta1-Transport"><code>Transport</code></a>
            </td>
            <td><p>Transport визначає транспортні конфігурації, які ми використовуємо для зʼєднання з konnectivity сервером. Це обовʼязково, якщо ProxyProtocol — це HTTPConnect або GRPC.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelection` {#apiserver-k8s-io-v1beta1-EgressSelection}

**З’являється в:**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)

EgressSelection надає конфігурацію для одного клієнта вибору egress зʼєднання.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>name — це назва вибору egress зʼєднання. На даний момент підтримуються значення &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; та &quot;cluster&quot;. Селекторо egress зʼєднання &quot;master&quot; застарілий і його рекомендується замінити на &quot;controlplane&quot;.</p></td>
        </tr>
        <tr>
            <td><code>connection</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-Connection"><code>Connection</code></a>
            </td>
            <td><p>connection — це точна інформація, яка використовується для налаштування вибору вихідного зʼєднання.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelectorType` {#apiserver-k8s-io-v1beta1-EgressSelectorType}

(Аліас до `string`)

**З’являється в:**

- [Issuer](#apiserver-k8s-io-v1beta1-Issuer)

<p>EgressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання трафіку.</p>

## `ExtraMapping` {#apiserver-k8s-io-v1beta1-ExtraMapping}

**З’являється в:**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

ExtraMapping надає конфігурацію для одного додаткового зіставлення.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>key</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>key — це рядок, який використовується як ключ додаткового атрибуту. key повинен бути шляхом з префіксом домену (наприклад, example.org/foo). Усі символи перед першим &quot;/&quot; повинні бути дійсним субдоменом, як це визначено RFC 1123. Усі символи, що йдуть після першого &quot;/&quot;, повинні бути дійсними символами шляху HTTP, як це визначено RFC 3986. key повинен бути написаний малими літерами. Має бути унікальним.</p></td>
        </tr>
        <tr>
            <td><code>valueExpression</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>valueExpression — це вираз CEL для отримання значення додаткового атрибуту. valueExpression повинен повертати значення рядка або масиву рядків. &quot;&quot;, [], та null значення розглядаються як відсутність додаткового зіставлення. Порожні рядкові значення, що містяться у масиві рядків, відфільтровуються.</p>
            <p>Вирази CEL мають доступ до вмісту токенів, організованих у змінну CEL:</p>
            <ul>
                <li>'claims' — це зіставлення імен вимог до значень вимог. Наприклад, змінна з імʼям 'sub' може бути доступна як 'claims.sub'. Вкладені вимоги можуть бути доступні за допомогою крапкової нотації, наприклад, 'claims.foo.bar'.</li>
            </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p></td>
        </tr>
    </tbody>
</table>

## `Issuer` {#apiserver-k8s-io-v1beta1-Issuer}

**З’являється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

Issuer надає конфігурацію для специфічних налаштувань зовнішнього постачальника.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>url</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>url вказує на URL видавця у форматі https://url або https://url/path. Це повинно відповідати вимозі &quot;iss&quot; у наданому JWT і видавцю, який повертається discovery. Таке саме значення, як і прапорець --oidc-issuer-url. Інформація про discovery отримується з &quot;{url}/.well-known/openid-configuration&quot;, якщо discoveryURL не перевизначений. Вимагається бути унікальним серед усіх JWT автентифікаторів. Зверніть увагу, що конфігурація вибору вихідного зʼєднання не використовується для цього мережевого зʼєднання.</p></td>
        </tr>
        <tr>
            <td><code>discoveryURL</code><br/>
                <code>string</code>
            </td>
            <td><p>discoveryURL, якщо вказано, перевизначає URL, використовуваний для отримання інформації про discovery, замість використання &quot;{url}/.well-known/openid-configuration&quot;. Використовується точне вказане значення, тому &quot;/.well-known/openid-configuration&quot; повинен бути включений у discoveryURL, якщо це необхідно.</p>
            <p>Поле &quot;issuer&quot; у отриманій інформації про discovery повинно відповідати полю &quot;issuer.url&quot; в AuthenticationConfiguration і буде використовуватися для перевірки вимоги &quot;iss&quot; у наданому JWT. Це призначено для сценаріїв, коли загальновідомі та точки доступу jwks розміщуються в іншому місці, ніж видавець (наприклад, локально у кластері).</p>
            <p>Приклад: URL discovery, який експонується за допомогою сервіса kubernetes 'oidc' у просторі імен 'oidc-namespace' і інформація про discovery доступна за адресою '/.well-known/openid-configuration'. discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot; certificateAuthority використовується для перевірки TLS-зʼєднання, і імʼя хоста на сертифікаті повинно бути налаштовано на 'oidc.oidc-namespace'.</p>
            <p>curl https://oidc.oidc-namespace/.well-known/openid-configuration (.discoveryURL поле)
            <code>{
            issuer: &quot;https://oidc.example.com&quot; (.url поле)
            }</code></p></td>
            <p>discoveryURL повинен відрізнятися від url. Має бути унікальним серед усіх JWT автентифікаторів. Зверніть увагу, що конфігурація вибору вихідного зʼєднання не використовується для цього мережевого зʼєднання.</p></td>
        </tr>
        <tr>
            <td><code>certificateAuthority</code><br/>
                <code>string</code>
            </td>
            <td><p>certificateAuthority містить сертифікати уповноважених органів, закодовані в PEM, які використовуються для перевірки зʼєднання під час отримання інформації про discovery. Якщо не встановлено, використовується системний перевіряльник. Таке саме значення, як і вміст файлу, на який посилається прапорець --oidc-ca-file.</p></td>
        </tr>
        <tr>
            <td><code>audiences</code> <b>[Обовʼязково]</b><br/>
                <code>[]string</code>
            </td>
            <td><p>audiences — це набір прийнятних аудиторій, для яких повинен бути виданий JWT. Щонайменше один з записів повинен відповідати вимозі &quot;aud&quot; у наданих JWT. Таке саме значення, як і прапорець --oidc-client-id (хоча це поле підтримує масив). Має бути непорожнім.</p></td>
        </tr>
        <tr>
            <td><code>audienceMatchPolicy</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a>
            </td>
            <td><p>audienceMatchPolicy визначає, як поле &quot;audiences&quot; використовується для співставлення з вимогою &quot;aud&quot; у наданому JWT. Допустимі значення:</p>
            <ol>
                <li>&quot;MatchAny&quot;, коли вказано кілька аудиторій</li>
                <li>порожнє (або не встановлене) або &quot;MatchAny&quot;, коли вказано одну аудиторію.</li>
            </ol>
            <ul>
                <li><p>MatchAny: вимога &quot;aud&quot; у наданому JWT повинна відповідати щонайменше одному з записів у полі &quot;audiences&quot;. Наприклад, якщо &quot;audiences&quot; містить [&quot;foo&quot;, &quot;bar&quot;], вимога &quot;aud&quot; у наданому JWT повинна містити або &quot;foo&quot;, або &quot;bar&quot; (і може містити обидва).</p></li>
                <li><p>&quot;&quot;: Політика співставлення може бути порожньою (або не встановленою), коли у полі &quot;audiences&quot; вказано одну аудиторію. Вимога &quot;aud&quot; у наданому JWT повинна містити одну аудиторію (і може містити інші).</p></li>
            </ul>
            <p>Для більш точного перевірки аудиторій використовуйте claimValidationRules. Приклад: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])', щоб вимагати точного співпадіння.</p></td>
        </tr>
        <tr>
            <td><code>egressSelectorType</code><br/><a href="#apiserver-k8s-io-v1beta1-EgressSelectorType"><code>EgressSelectorType</code></a></td>
            <td>
                <p>egressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання всього трафіку, що має звʼязки з цим емітентом (виявлення, JWKS, розподілені заявки тощо). Якщо не вказано, номеронабирач користувача не використовується. Якщо вказано, допустимими варіантами є &quot;controlplane&quot; та &quot;cluster&quot;. Вони відповідають повʼязаним значенням у --egress-selector-config-file.</p>
                <ul>
                    <li><p>controlplane: для трафіку, призначеного для проходження до панелі управління.</p></li>
                    <li><p>cluster: для трафіку, призначеного для системи, що управляється Kubernetes.</p></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## `JWTAuthenticator` {#apiserver-k8s-io-v1beta1-JWTAuthenticator}

**З’являється в:**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)

JWTAuthenticator надає конфігурацію для одного JWT автентифікатора.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>issuer</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-Issuer"><code>Issuer</code></a>
            </td>
            <td><p>issuer містить основні параметри підключення постачальника OIDC.</p></td>
        </tr>
        <tr>
            <td><code>claimValidationRules</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a>
            </td>
            <td><p>claimValidationRules — це правила, які застосовуються для перевірки вимог токенів для автентифікації користувачів.</p></td>
        </tr>
        <tr>
            <td><code>claimMappings</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-ClaimMappings"><code>ClaimMappings</code></a>
            </td>
            <td><p>claimMappings вказує вимоги токена, які слід вважати атрибутами користувача.</p></td>
        </tr>
        <tr>
            <td><code>userValidationRules</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-UserValidationRule"><code>[]UserValidationRule</code></a>
            </td>
            <td><p>userValidationRules — це правила, які застосовуються до кінцевого користувача перед завершенням автентифікації. Ці правила дозволяють застосовувати інваріанти до вхідних ідентичностей, наприклад, забороняти використання префіксу system:, який зазвичай використовується компонентами Kubernetes. Правила перевірки логічно повʼязані оператором AND і всі повинні повернути true, щоб перевірка пройшла.</p></td>
        </tr>
    </tbody>
</table>

## `PrefixedClaimOrExpression` {#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression}

**З’являється в:**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

PrefixedClaimOrExpression надає конфігурацію для одного префіксованого вимоги або виразу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це JWT вимога для використання. Взаємовиключне з expression.</p></td>
        </tr>
        <tr>
            <td><code>prefix</code><br/>
                <code>string</code>
            </td>
            <td><p>prefix додається до значення вимоги, щоб уникнути конфліктів з існуючими іменами. prefix необхідно встановити, якщо встановлено claim, і він може бути порожнім рядком. Взаємовиключне з expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися за допомогою CEL.</p>
            <p>CEL вирази мають доступ до вмісту вимог токену, організованого у змінну CEL:</p>
            <ul>
                <li>'claims' є зіставленням імен вимог до значень вимог. Наприклад, змінну з іменем 'sub' можна отримати як 'claims.sub'. Вкладені вимоги можна отримати за допомогою нотації з крапкою, наприклад 'claims.foo.bar'.</li>
            </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            <p>Взаємовиключне з claim і prefix.</p></td>
        </tr>
    </tbody>
</table>

## `TCPTransport` {#apiserver-k8s-io-v1beta1-TCPTransport}

**З’являється в:**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

TCPTransport надає інформацію для підключення до konnectivity серверу через TCP

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>url</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>URL є місцем розташування konnectivity серверу для підключення. Як приклад, це може бути &quot;https://127.0.0.1:8131&quot;</p></td>
        </tr>
        <tr>
            <td><code>tlsConfig</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-TLSConfig"><code>TLSConfig</code></a>
            </td>
            <td><p>TLSConfig є конфігурацією, необхідною для використання TLS при підключенні до konnectivity серверу</p></td>
        </tr>
    </tbody>
</table>

## `TLSConfig` {#apiserver-k8s-io-v1beta1-TLSConfig}

**З’являється в:**

- [TCPTransport](#apiserver-k8s-io-v1beta1-TCPTransport)

TLSConfig надає інформацію для автентифікації для підключення до konnectivity серверу. Використовується тільки з TCPTransport

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>caBundle</code><br/>
                <code>string</code>
            </td>
            <td><p>caBundle — це місцезнаходження файлу CA, який буде використовуватися для визначення довіри до konnectivity серверу. Має бути відсутнім/порожнім, якщо TCPTransport.URL починається з http:// Якщо відсутній, а TCPTransport.URL починається з https://, стандартно використовуються системні корені довіри.</p></td>
        </tr>
        <tr>
            <td><code>clientKey</code><br/>
                <code>string</code>
            </td>
            <td><p>clientKey — це місцезнаходження файлу клієнтського ключа, який буде використовуватися в mtls рукостисканнях з konnectivity сервером. Має бути відсутнім/порожнім, якщо TCPTransport.URL починається з http:// Має бути налаштований, якщо TCPTransport.URL починається з https://</p></td>
        </tr>
        <tr>
            <td><code>clientCert</code><br/>
                <code>string</code>
            </td>
            <td><p>clientCert — це місцезнаходження файлу клієнтського сертифіката, який буде використовуватися в mtls рукостисканнях з konnectivity сервером. Має бути відсутнім/порожнім, якщо TCPTransport.URL починається з http:// Має бути налаштований, якщо TCPTransport.URL починається з https://</p></td>
        </tr>
    </tbody>
</table>

## `Transport` {#apiserver-k8s-io-v1beta1-Transport}

**З’являється в:**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)

Transport визначає конфігурації транспорту, які ми використовуємо для зʼєднання з konnectivity сервером

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>tcp</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-TCPTransport"><code>TCPTransport</code></a>
            </td>
            <td><p>TCP — це конфігурація TCP для звʼязку з konnectivity сервером через TCP. ProxyProtocol GRPC наразі не підтримується з TCP транспортом. Вимагає налаштування хоча б одного з TCP або UDS</p></td>
        </tr>
           <tr>
            <td><code>uds</code><br/>
                <a href="#apiserver-k8s-io-v1beta1-UDSTransport"><code>UDSTransport</code></a>
            </td>
            <td><p>UDS — це конфігурація UDS для звʼязку з konnectivity сервером  ерез UDS. Вимагає налаштування хоча б одного з TCP або UDS</p></td>
        </tr>
    </tbody>
</table>

## `UDSTransport` {#apiserver-k8s-io-v1beta1-UDSTransport}

**З’являється в:**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

UDSTransport надає інформацію для підключення до konnectivity серверу через UDS

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>udsName</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>UDSName — це назва unix domain socket для підключення до konnectivity серверу. Не використовує префікс unix://. (Наприклад: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)</p></td>
        </tr>
    </tbody>
</table>

## `UserValidationRule` {#apiserver-k8s-io-v1beta1-UserValidationRule}

**З’являється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

UserValidationRule надає конфігурацію для одного правила валідації інформації про користувача.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expression</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінено за допомогою CEL. Має повернути true, щоб перевірка була успішною.</p>
            <p>CEL вирази мають доступ до вмісту UserInfo, організованого в CEL змінну:</p>
            <ul>
                <li>'user' — authentication.k8s.io/v1, обʼєкт Kind=UserInfo.  верніться до https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122 для визначення. Документація API: <a href="docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io">https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</a></li>
            </ul>
            <p>Документація з CEL: <a href="docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p></td>
        </tr>
        <tr>
            <td><code>message</code><br/>
                 <code>string</code>
            </td>
            <td><p>message налаштовує повернуте повідомлення про помилку, коли правилоило повертає false. message є літеральним рядком.</p></td>
        </tr>
    </tbody>
</table>

## `WebhookConfiguration` {#apiserver-k8s-io-v1beta1-WebhookConfiguration}
**З’являється в:**

- [AuthorizerCoзguration](#apiserver-k8s-io-v1beta1-AuthorizerConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>authorizedTTL</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування відповідей 'authorized' від webhook авторизатора. Те ж саме, що і встановлення <code>--authorization-webhook-cache-authorized-ttl</code> прапорця. Стандартно: 5m0s</p></td>
        </tr>
        <tr>
            <td><code>cacheAuthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheAuthorizedRequests визначає, чи слід кешувати авторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля AuthorizedTTL. Стандартно: true</p></td>
        </tr>
        <tr>
            <td><code>unauthorizedTTL</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування відповідей 'unauthorized' від webhook авторизатора. Те ж саме, що і встановлення <code>--authorization-webhook-cache-unauthorized-ttl</code> прапорця. Стандартно: 30s</p></td>
        </tr>
        <tr>
            <td><code>cacheUnauthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheUnauthorizedRequests визначає, чи слід кешувати неавторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля UnauthorizedTTL. Стандартно: true</p></td>
        </tr>
        <tr>
            <td><code>timeout</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тайм-аут для запиту webhook. Максимальне допустиме значення - 30s. Обовʼязкове, стандартного значення немає.</p></td>
        </tr>
        <tr>
            <td><code>subjectAccessReviewVersion</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Версія API authorization.k8s.io SubjectAccessReview, яка буде відправлена та очікувана від webhook. Те ж саме, що і встановлення <code>--authorization-webhook-version</code> прапорця. Допустимі значення: v1beta1, v1.  Обовʼязкове, стандартного значення немає</p></td>
        </tr>
        <tr>
            <td><code>matchConditionSubjectAccessReviewVersion</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>MatchConditionSubjectAccessReviewVersion визначає версію SubjectAccessReview, для якої оцінюються CEL вирази. Допустимі значення: v1.  Обовʼязкове, стандартного значення немає</p> </td>
        </tr>
        <tr>
            <td><code>failurePolicy</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Контролює рішення про авторизацію, коли запит webhook не вдається завершити або повертає некоректну відповідь або помилки при оцінці matchConditions. Допустимі значення:</p>
            <ul>
                <li>NoOpinion: продовжувати до наступних авторизаторів, щоб перевірити, чи дозволяє запит хоча б один з них</li>
                <li>Deny: відхилити запит без консультацій з наступними авторизаторами. Обовʼязкове, стандартного значення немає.</li>
            </ul></td>
        </tr>
        <tr>
            <td><code>connectionInfo</code> <b>[Обовʼязкове]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
            </td>
            <td><p>ConnectionInfo визначає, як ми спілкуємося з webhook</p></td>
        </tr>
        <tr>
            <td><code>matchConditions</code> <b>[Обовʼязкове]</b><br/>
                <a href="#apiserver-k8s-io-v1beta1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
            </td>
            <td><p>matchConditions — це список умов, які повинні бути виконані, щоб запит був відправлений на цей webhook. Порожній список matchConditions відповідає всім запитам. Максимум 64 умови відповідності дозволені.</p>
            <p>Точна логіка відповідності (у порядку):</p>
            <ol>
                <li>Якщо хоча б одна matchCondition оцінюється як FALSE, то webhook пропускається.</li>
                <li>Якщо ВСІ matchConditions оцінюються як TRUE, то викликається webhook.</li>
                <li>Якщо хоча б одна matchCondition оцінюється як помилка (але жодна не є FALSE):
                <ul>
                    <li>Якщо failurePolicy=Deny, то webhook відхиляє запит</li>
                    <li>Якщо failurePolicy=NoOpinion, то помилка ігнорується, і webhook пропускається</li>
                </ul></li>
            </ol></td>
        </tr>
    </tbody>
</table>

## `WebhookConnectionInfo` {#apiserver-k8s-io-v1beta1-WebhookConnectionInfo}

**З’являється в:**

- [WebhookConfiguration](#apiserver-k8s-io-v1beta1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Контролює, як webhook має спілкуватися з сервером. Допустимі значення:</p>
            <ul>
                <li>KubeConfigFile: використовувати файл, вказаний у kubeConfigFile, для знаходження сервера.</li>
                <li>InClusterConfig: використовувати конфігурацію у кластері для виклику SubjectAccessReview API, розміщеного kube-apiserver. Цей режим не дозволений для kube-apiserver.</li>
            </ul></td>
        </tr>
        <tr>
            <td><code>kubeConfigFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Шлях до KubeConfigFile для інформації про зʼєднання. Обовʼязкове, якщо connectionInfo.Type — KubeConfig</p></td>
        </tr>
    </tbody>
</table>

## `WebhookMatchCondition` {#apiserver-k8s-io-v1beta1-WebhookMatchCondition}

**З’являється в:**

- [WebhookConfiguration](#apiserver-k8s-io-v1beta1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expression</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися CEL. Повинен оцінюватися як bool. CEL вирази мають доступ до вмісту SubjectAccessReview у версії v1. Якщо версія, вказана у змінній запиту subjectAccessReviewVersion, є v1beta1, вміст буде конвертовано у версію v1 перед оцінкою виразу CEL.</p>
            <ul>
                <li>'resourceAttributes' описує інформацію для запиту доступу до ресурсу і не встановлюється для нересурсних запитів, наприклад, has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</li>
                <li>'nonResourceAttributes' описує інформацію для запиту доступу до нересурсів і не встановлюється для запитів до ресурсів. наприклад, has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.</li>
                <li>'user' — користувач, для якого потрібно перевірити, наприклад, request.user == 'alice'</li>
                <li>'groups' — це групи, для яких потрібно протестувати, наприклад, ('group1' in request.groups)</li>
                <li>'extra' відповідає методу user.Info.GetExtra() з автентифікатора.</li>
                <li>'uid' — інформація про користувача, який надіслав запит, наприклад, request.uid == '1'.</li>
                </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p></td>
        </tr>
    </tbody>
</table>
