---
title: kube-apiserver Configuration (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
auto_generated: false
---

Пакет v1alpha1 — це версія API v1alpha1.

## Типи ресурсів {#resource-types}

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)


## `TracingConfiguration`     {#TracingConfiguration}

**Зʼявляється в:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

TracingConfiguration надає версійну конфігурацію для клієнтів OpenTelemetry tracing.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>endpoint</code><br/>
                <code>string</code>
            </td>
            <td><p>Endpoint колектора, куди цей компонент буде надсилати трасування. Зʼєднання є незахищеним і наразі не підтримує TLS. Рекомендується не вказувати, і використовувати стандартно otlp grpc localhost:4317.</p></td>
        </tr>
        <tr>
            <td><code>samplingRatePerMillion</code><br/>
                <code>int32</code>
            </td>
            <td><p>SamplingRatePerMillion — це кількість зразків, які потрібно збирати на мільйон проміжків. Рекомендується не вказувати. Якщо не вказано, зразок буде відповідати ставці зразка батьківського проміжку, але інакше ніколи не буде зібраний.</p></td>
        </tr>
    </tbody>
</table>

## `AdmissionConfiguration` {#apiserver-k8s-io-v1alpha1-AdmissionConfiguration}

AdmissionConfiguration надає версійну конфігурацію для контролерів допуску.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AdmissionConfiguration</code></td>
        </tr>
        <tr>
            <td><code>plugins</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
            </td>
            <td><p>Plugins дозволяє вказати конфігурацію для кожного втулка контролю допуску.</p></td>
        </tr>
    </tbody>
</table>

## `AuthenticationConfiguration` {#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration}

AuthenticationConfiguration надає версійну конфігурацію для автентифікації.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthenticationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>jwt</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-JWTAuthenticator"><code>[]JWTAuthenticator</code></a>
            </td>
            <td><p>jwt — це список автентифікаторів для автентифікації користувачів Kubernetes за допомогою JWT-сумісних токенів. Автентифікатор спробує розпарсити ID токен, перевірити, чи він підписаний налаштованим постачальником. Публічний ключ для перевірки підпису знаходиться на публічній точці доступу постачальника, використовуючи OIDC discovery. Для вхідного токена кожен JWT-автентифікатор буде спробований у порядку, в якому він зазначений у цьому списку. Зверніть увагу, що інші автентифікатори можуть запускатися до або після JWT-автентифікаторів. Специфічне розташування JWT-автентифікаторів відносно інших автентифікаторів не визначено і не є стабільним у різних версіях. Оскільки кожен JWT-автентифікатор повинен мати унікальний URL постачальника, в більшості випадків лише один JWT-автентифікатор спробує криптографічно перевірити токен.</p>
            <p>Мінімальне дійсне наповнення JWT повинно містити наступні вимоги:
<pre><code>{
&quot;iss&quot;: &quot;https://issuer.example.com&quot;,
&quot;aud&quot;: [&quot;audience&quot;],
&quot;exp&quot;: 1234567890,
&quot;<!-- raw HTML omitted -->&quot;: &quot;username&quot;
}</code></pre></p></td>
        </tr>
    </tbody>
</table>

## `AuthorizationConfiguration` {#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration}

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AuthorizationConfiguration</code></td>
        </tr>
        <tr>
            <td><code>authorizers</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
            </td>
            <td><p>Authorizers — це впорядкований список авторизаторів для авторизації запитів. Це схоже на прапорец --authorization-modes в kube-apiserver. Повинен бути принаймні один.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelectorConfiguration` {#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration}

EgressSelectorConfiguration надає версійну конфігурацію для клієнтів вибору виходу

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>EgressSelectorConfiguration</code></td>
        </tr>
        <tr>
            <td><code>egressSelections</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-EgressSelection"><code>[]EgressSelection</code></a>
            </td>
            <td><p>connectionServices містить список конфігурацій клієнтів вибору виходу.</p></td>
        </tr>
    </tbody>
</table>

## `TracingConfiguration` {#apiserver-k8s-io-v1alpha1-TracingConfiguration}

TracingConfiguration надає версійну конфігурацію для клієнтів трасування.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>apiserver.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>TracingConfiguration</code></td>
        </tr>
        <tr>
            <td><code>TracingConfiguration</code> <b>[Обовʼязково]</b><br/>
                <a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
            </td>
            <td>(Члени <code>TracingConfiguration</code> вбудовані в цей тип.)
                <p>Вбудувати структуру конфігурації трасування компонента.</p>
            </td>
        </tr>
    </tbody>
</table>

## `AdmissionPluginConfiguration` {#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration}

**Зʼявляється в:**

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)

AdmissionPluginConfiguration надає конфігурацію для одного втулка.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Name — це імʼя контролера допуску. Воно повинно відповідати зареєстрованому імені втулка допуску.</p></td>
        </tr>
        <tr>
            <td><code>path</code><br/>
                <code>string</code>
            </td>
            <td><p>Path — це шлях до конфігураційного файлу, що містить конфігурацію втулка.</p></td>
        </tr>
        <tr>
            <td><code>configuration</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
            </td>
            <td><p>Configuration — це вбудований обʼєкт конфігурації, який буде  використовуватися як конфігурація втулка. Якщо він присутній, він буде використовуватися замість шляху до конфігураційного файлу.</p></td>
        </tr>
    </tbody>
</table>

## `AnonymousAuthCondition`{#apiserver-k8s-io-v1alpha1-AnonymousAuthCondition}

**Зʼявляється в:**

- [AnonymousAuthConfig](#apiserver-k8s-io-v1alpha1-AnonymousAuthConfig)

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

## `AnonymousAuthConfig` {#apiserver-k8s-io-v1alpha1-AnonymousAuthConfig}

**Зʼявляється в:**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)

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
                <a href="#apiserver-k8s-io-v1alpha1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a>
            </td>
            <td><p>Якщо встановлено, анонімна автентифікація дозволена, тільки якщо запит відповідає одній з умов.</p></td>
        </tr>
    </tbody>
</table>

## `AudienceMatchPolicyType`{#apiserver-k8s-io-v1alpha1-AudienceMatchPolicyType}

(Псевдонім для `string`)

**Зʼявляється в:**

- [Issuer](#apiserver-k8s-io-v1alpha1-Issuer)


<p>AudienceMatchPolicyType є набором допустимих значень для issuer.audienceMatchPolicy</p>

## `AuthorizerConfiguration` {#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration}

**Зʼявляється в:**

- [AuthorizationConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Type визначає тип авторизатора. "Webhook" підтримується в загальному API-сервері. Інші API-сервери можуть підтримувати додаткові типи авторизаторів, такі як Node, RBAC, ABAC тощо.</p></td>
        </tr>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Name використовується для опису вебхука. Це явно використовується в механізмах моніторингу для метрик. Примітка: Імена повинні бути у форматі DNS1123, такі як <code>myauthorizername</code> або піддомени, такі як <code>myauthorizer.example.domain</code>. Обовʼязково, без стандартного значення.</p></td>
        </tr>
        <tr>
            <td><code>webhook</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
            </td>
            <td><p>Webhook визначає конфігурацію для вебхук-авторизатора. Повинна бути визначена, коли Type=Webhook. Не повинна бути визначена, коли Type!=Webhook.</p></td>
      </tr>
    </tbody>
</table>

## `ClaimMappings`     {#apiserver-k8s-io-v1alpha1-ClaimMappings}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

ClaimMappings надає конфігурацію для зіставлення заявок.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>username</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
            </td>
            <td><p>username представляє опцію для атрибута імені користувача. Значення заявки повинно бути єдиним рядком. Також використовується для прапорців --oidc-username-claim і --oidc-username-prefix. Якщо встановлено username.expression, вираз повинен повертати значення рядка. Якщо username.expression використовує 'claims.email', тоді 'claims.email_verified' повинно бути використане в username.expression або extra[&ast;].valueExpression or claimValidationRules[&ast;].expression. Приклад виразу правил перевірки заявок, який відповідає перевірці, автоматично застосованій, коли username.claim встановлено в 'email', є 'claims.?email_verified.orValue(true) == true'. Явно порівнюючи значення значення з true, ми дозволимо перевірці типів побачити, що результат буде булевим, і переконатися, що небулевий email_verified буде перехоплено під час виконання.</p>
            <p>У підході на основі прапорців, --oidc-username-claim і --oidc-username-prefix є необовʼязковими. Якщо --oidc-username-claim не встановлено, стандартне значення — &quot;sub&quot;. Для конфігурації автентифікації немає стандартного значення для заявки або префікса. Заявка та префікс повинні бути явно встановлені. Для заявки, якщо --oidc-username-claim не був встановлений з допомогою підходу старого прапорця, налаштуйте username.claim=&quot;sub&quot; у конфігурації автентифікації. Для префікса: (1) --oidc-username-prefix=&quot;-&quot; не додає префікс до імені користувача. Для такої ж поведінки, використовуючи конфігурацію автентифікації, налаштуйте username.prefix=&quot;&quot; (2) --oidc-username-prefix=&quot;&quot; і --oidc-username-claim != &quot;email&quot;, префікс був &quot;&quot;&lt;value of --oidc-issuer-url&gt;#&quot;. Для такої ж поведінки, використовуючи конфігурацію автентифікації, налаштуйте username.prefix=&quot;<!-- raw HTML omitted -->#&quot; (3) --oidc-username-prefix=&quot;<!-- raw HTML omitted -->&quot;. Для такої ж поведінки, використовуючи конфігурацію автентифікації, налаштуйте username.prefix=&quot;<!-- raw HTML omitted -->&quot;</p></td>
        </tr>
        <tr>
            <td><code>groups</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
            </td>
            <td><p>groups представляє опцію для атрибута груп. Значення заявки повинно бути рядком або масивом рядків. Якщо встановлено groups.claim, префікс повинен бути зазначений (і може бути пустим рядком). Якщо встановлено groups.expression, вираз повинен повертати рядок або масив рядків. &quot;&quot; (пустий рядок), [] (пустий масив) і null значення трактуються як відсутність зіставлення груп.</p></td>
        </tr>
        <tr>
            <td><code>uid</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-ClaimOrExpression"><code>ClaimOrExpression</code></a>
            </td>
            <td><p>uid представляє опцію для атрибута uid. Заявка повинна бути єдиним рядком. Якщо встановлено uid.expression, вираз повинен повертати рядок.</p></td>
        </tr>
        <tr>
            <td><code>extra</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-ExtraMapping"><code>[]ExtraMapping</code></a>
            </td>
            <td><p>extra представляє опцію для атрибута extra. вираз повинен повертати рядок або масив рядків. Якщо значення порожнє, відображення extra не буде присутнім.</p>
            <p>жорстко закодоване додаткові ключ/значення</p>
            <ul>
                <li>key: &quot;foo&quot;
                valueExpression: &quot;'bar'&quot;
                Це призведе до додаткового атрибута — foo: [&quot;bar&quot;]</li>
            </ul>
            <p>жорстко закодований ключ копіює значення заявки
                <ul>
                <li>key: &quot;foo&quot;
                valueExpression: &quot;claims.some_claim&quot;
                Це призведе до додаткового атрибута — foo: [value of some_claim]</li>
            </ul>
            <p>жорстко закодований ключ, значення, що походить від значення заявки</p>
            <ul>
                <li>key: "admin"
                valueExpression: '(has(claims.is_admin) && claims.is_admin) ? "true":"'
                Це призведе до:</li>
                <li>якщо заявка is_admin присутня і true, додатковий атрибут — admin: ["true"]</li>
                <li>якщо заявка is_admin присутня і false або заявка is_admin відсутня, жоден додатковий атрибут не буде доданий</li>
            </ul>
            </td>
        </tr>
    </tbody>
</table>

## `ClaimOrExpression`{#apiserver-k8s-io-v1alpha1-ClaimOrExpression}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

ClaimOrExpression надає конфігурацію для однієї заявки або виразу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це заявка JWT, яку потрібно використовувати. Або claim, або expression повинно бути встановлено. Взаємно виключаються в expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінений CEL.</p>
                <p>Вирази CEL мають доступ до вмісту заявок токена, організованих у змінні CEL:</p>
                <ul>
                  <li>'claims' це map назв заявок до значень заявок.
                Наприклад, змінну з іменем 'sub' можна отримати як 'claims.sub'.
                Вкладені заявки можна отримати за допомогою позначки крапки, наприклад, 'claims.foo.bar'.</li>
                </ul>
                <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
                <p>Взаємно виключаються в claim.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ClaimValidationRule` {#apiserver-k8s-io-v1alpha1-ClaimValidationRule}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

ClaimValidationRule надає конфігурацію для однієї правила перевірки заявки.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це імʼя обовʼязкової заявки. Також використовується для прапорця --oidc-required-claim. Підтримуються тільки рядкові ключі заявок. Взаємно виключається в expression і message.</p></td>
        </tr>
        <tr>
            <td><code>requiredValue</code><br/>
                <code>string</code>
            </td>
            <td><p>requiredValue — це значення обовʼязкової заявки. Також використовується для прапорця --oidc-required-claim. Підтримуються тільки рядкові значення заявок. Якщо claim встановлено, а requiredValue не встановлено, заявка повинна бути присутньою зі значенням, встановленим у порожній рядок. Взаємно виключається з expression і message.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінений CEL. Повинно повернути boolean.</p>
            <p>Вирази CEL мають доступ до вмісту заявок токена, організованих у змінні CEL:</p>
            <ul>
                <li>'claims' це map назв заявок до значень заявок. Наприклад, змінну з іменем 'sub' можна отримати як 'claims.sub'. Вкладені заявки можна отримати за допомогою позначки крапки, наприклад, 'claims.foo.bar'. Повинно повернути true для проходження перевірки.</li>
            </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
            <p>Взаємно виключається в claim і requiredValue.</p>
            </td>
        </tr>
        <tr>
            <td><code>message</code><br/>
                <code>string</code>
            </td>
            <td><p>message налаштовує повернуте повідомлення про помилку, коли вираз повертає false. message є літеральним рядком. Взаємно виключається з claim і requiredValue.</p></td>
        </tr>
    </tbody>
</table>

## `Connection` {#apiserver-k8s-io-v1alpha1-Connection}

**Зʼявляється в:**

- [EgressSelection](#apiserver-k8s-io-v1alpha1-EgressSelection)

Connection надає конфігурацію для одного клієнта egress selection.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>proxyProtocol</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-ProtocolType"><code>ProtocolType</code></a>
            </td>
            <td><p>proxyProtocol — це протокол, який використовується для підключення клієнта до сервера konnectivity.</p></td>
        </tr>
        <tr>
            <td><code>transport</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-Transport"><code>Transport</code></a>
            </td>
            <td><p>transport визначає конфігурації транспорту, які ми використовуємо для зʼєднання з сервером konnectivity. Це потрібно, якщо ProxyProtocol — HTTPConnect або GRPC.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelection` {#apiserver-k8s-io-v1alpha1-EgressSelection}

**Зʼявляється в:**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)

EgressSelection надає конфігурацію для одного клієнта egress selection.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>name</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>name — це назва egress selection. Підтримувані значення: &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; та &quot;cluster&quot;. &quot;master&quot; egress selector застарілий і замінений на &quot;controlplane&quot;.</p></td>
        </tr>
        <tr>
            <td><code>connection</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-Connection"><code>Connection</code></a>
            </td>
            <td><p>connection — це точна інформація, що використовується для налаштування egress selection.</p></td>
        </tr>
    </tbody>
</table>

## `EgressSelectorType` {#apiserver-k8s-io-v1alpha1-EgressSelectorType}

(Аліас до `string`)

**Зʼявляється в:**

- [Issuer](#apiserver-k8s-io-v1alpha1-Issuer)

<p>EgressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання трафіку.</p>

## `ExtraMapping` {#apiserver-k8s-io-v1alpha1-ExtraMapping}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

ExtraMapping надає конфігурацію для одного додаткового зіставлення.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>key</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>key — це рядок, що використовується як ключ додаткового атрибуту. key повинен бути шляхом з префіксом домену (наприклад, example.org/foo). Усі символи перед першим &quot;/&quot; повинні бути дійсним піддоменом, як визначено у RFC 1123. Усі символи після першого &quot;/&quot; повинні бути дійсними символами шляху HTTP, як визначено у RFC 3986. key повинен бути у нижньому регістрі. Має бути унікальним.</p></td>
        </tr>
        <tr>
            <td><code>valueExpression</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>valueExpression — це вираз CEL для вилучення значення додаткового атрибуту. valueExpression повинен виробляти рядкове або масив рядкових значень. &quot;&quot;, [], і null значення трактуються як відсутність додаткового зіставлення. Порожні рядкові значення, що містяться в масиві рядків, відфільтровуються.</p>
            <p>Вирази CEL мають доступ до вмісту заявок токена, організованих у змінній CEL:</p>
            <ul>
                <li>'claims' це map назв заявок до значень заявок. Наприклад, змінну з іменем 'sub' можна отримати як 'claims.sub'. Вкладені заявки можна отримати за допомогою позначки крапки, наприклад, 'claims.foo.bar'.</li>
            </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p></td>
        </tr>
    </tbody>
</table>

## `Issuer` {#apiserver-k8s-io-v1alpha1-Issuer}

**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

Issuer надає конфігурацію для конкретних налаштувань зовнішнього постачальника.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>url</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>url вказує на URL-адресу видавця у форматі https://url або https://url/path. Це повинно відповідати заявці &quot;iss&quot; у поданому JWT і видавцю, повернутому з виявлення. Те ж саме значення, що і прапорець --oidc-issuer-url. Інформація про виявлення отримується з &quot;{url}/.well-known/openid-configuration&quot;, якщо не перевизначено за допомогою discoveryURL. Має бути унікальним для всіх JWT автентифікаторів. Зверніть увагу, що конфігурація вибору egress не використовується для цього мережевого зʼєднання.</p></td>
        </tr>
        <tr>
            <td><code>discoveryURL</code><br/>
                <code>string</code>
            </td>
            <td><p>discoveryURL, якщо вказано, перевизначає URL, який використовується для отримання інформації про виявлення, замість використання &quot;{url}/.well-known/openid-configuration&quot;. Використовується точне вказане значення, тому &quot;/.well-known/openid-configuration&quot; повинно бути включено в discoveryURL, якщо це потрібно.</p>
            <p>Поле &quot;issuer&quot; у отриманій інформації про виявлення повинно відповідати полю &quot;issuer.url&quot; у AuthenticationConfiguration і буде використовуватися для перевірки заявки &quot;iss&quot; у поданому JWT. Це для сценаріїв, коли точки доступу well-known і jwks розміщені в іншому місці, ніж видавець (наприклад, локально в кластері).</p>
            <p>Приклад: URL виявлення, який опублікований за допомогою сервіса kubernetes 'oidc' у просторі імен 'oidc-namespace', а інформація про виявлення доступна за адресою '/.well-known/openid-configuration'. discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot; certificateAuthority використовується для перевірки зʼєднання TLS, а імʼя хоста на сертифікаті повинно бути встановлено як 'oidc.oidc-namespace'.</p>
            <p><code>curl https://oidc.oidc-namespace/.well-known/openid-configuration (.discoveryURL field) { issuer: &quot;https://oidc.example.com&quot; (.url field) }</code></p>
            <p>discoveryURL повинен відрізнятися від url. Має бути унікальним для всіх JWT автентифікаторів. Зверніть увагу, що конфігурація вибору egress не використовується для цього мережевого зʼєднання.</p></td>
        </tr>
        <tr>
            <td>
                <code>certificateAuthority</code><br/>
                <code>string</code>
            </td>
            <td><p>certificateAuthority містить PEM-кодовані сертифікати органу сертифікації, які використовуються для перевірки зʼєднання під час отримання інформації про виявлення. Якщо не встановлено, використовується системний перевіряючий. Те ж саме значення, що і вміст файлу, на який посилається прапорець --oidc-ca-file.</p></td>
        </tr>
        <tr>
            <td><code>audiences</code> <b>[Обовʼязково]</b><br/>
                <code>[]string</code>
            </td>
            <td><p>audiences — це набір прийнятних аудиторій, до яких повинен бути виданий JWT. Принаймні один з записів повинен відповідати заявці &quot;aud&quot; у поданих JWT. Те ж саме значення, що і прапорець --oidc-client-id (хоча це поле підтримує масив). Має бути непорожнім.</p></td>
        </tr>
        <tr>
            <td><code>audienceMatchPolicy</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a>
            </td>
            <td><p>audienceMatchPolicy визначає, як поле &quot;audiences&quot; використовується для відповідності заявці &quot;aud&quot; у поданому JWT. Допустимі значення:</p>
            <ol>
                <li>&quot;MatchAny&quot; при вказанні кількох аудиторій та</li>
                <li>порожній (або не встановлений) або &quot;MatchAny&quot; при вказанні однієї аудиторії.</li>
            </ol>
            <ul>
                <li><p>MatchAny: заявка &quot;aud&quot; у поданому JWT повинна відповідати принаймні одному з записів у полі &quot;audiences&quot;. Наприклад, якщо &quot;audiences&quot; — [&quot;foo&quot;, &quot;bar&quot;], заявка &quot;aud&quot; у поданому JWT повинна містити або &quot;foo&quot;, або &quot;bar&quot; (і може містити обидва).</p>
                </li>
                <li><p>&quot;&quot;: Політика відповідності може бути порожньою (або не встановленою) при вказанні однієї аудиторії у полі &quot;audiences&quot;. Заявка &quot;aud&quot; у поданому JWT повинна містити одну аудиторію (і може містити інші).</p>
                </li>
            </ul>
            <p>Для більш детальної перевірки аудиторій використовуйте claimValidationRules. приклад: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])' для вимоги точної відповідності.</p></td>
        </tr>
        <tr>
            <td><code>egressSelectorType</code><br/><a href="#apiserver-k8s-io-v1alpha1-EgressSelectorType"><code>EgressSelectorType</code></a></td>
            <td>
                <p>egressSelectorType — це індикатор, який вказує, який селектор egress слід використовувати для надсилання всього трафіку, що має звʼязки з цим емітентом (виявлення, JWKS, розподілені вимоги тощо).  Якщо не вказано, номеронабирач користувача не використовується. Якщо вказано, допустимими варіантами є &quot;controlplane&quot; та &quot;cluster&quot;. Вони відповідають повʼязаним значенням у --egress-selector-config-file.</p>
                <ul>
                    <li><p>controlplane: для трафіку, призначеного для передачі на панель управління.</p></li>
                    <li><p>cluster: для трафіку, призначеного для системи, що управляється Kubernetes.</p></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## `JWTAuthenticator`     {#apiserver-k8s-io-v1alpha1-JWTAuthenticator}

**Зʼявляється в:**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)

JWTAuthenticator надає конфігурацію для одного автентифікатора JWT.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>issuer</code> <b>[Обовʼязково]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-Issuer"><code>Issuer</code></a>
            </td>
            <td><p>issuer містить основні параметри підключення постачальника OIDC.</p></td>
        </tr>
        <tr>
            <td><code>claimValidationRules</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a>
            </td>
            <td><p>claimValidationRules — це правила, які застосовуються для перевірки заявок токена для автентифікації користувачів.</p></td>
        </tr>
        <tr>
            <td><code>claimMappings</code> <b>[Обовʼязково]</b><br/>
                <a h    ref="#apiserver-k8s-io-v1alpha1-ClaimMappings"><code>ClaimMappings</code></a>
            </td>
            <td>
                <p>claimMappings вказує заявки токена, які будуть розглядатися як атрибути користувача.</p></td>
        </tr>
        <tr>
            <td><code>userValidationRules</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-UserValidationRule"><code>[]UserValidationRule</code></a>
            <td><p>userValidationRules - це правила, які застосовуються до кінцевого користувача перед завершенням автентифікації. Ці правила дозволяють застосовувати інваріанти до вхідних ідентичностей, такі як запобігання використанню префіксу system:, який зазвичай використовується компонентами Kubernetes. Правила перевірки поєднуються логічним AND і повинні всі повертати true для успішної перевірки.</p></td>
        </tr>
    </tbody>
</table>

## `PrefixedClaimOrExpression`  {#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression}

**Зʼявляється в:**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

PrefixedClaimOrExpression надає конфігурацію для однієї префіксованої заявки або виразу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>claim</code><br/>
                <code>string</code>
            </td>
            <td><p>claim — це заявка JWT для використання. Є взаємовиключою з expression.</p></td>
        </tr>
        <tr>
            <td><code>prefix</code><br/>
                <code>string</code>
            </td>
            <td><p>prefix додається до значення заявки, щоб уникнути конфліктів з існуючими іменами. prefix повинен бути встановлений, якщо встановлена заявка, і може бути порожнім рядком. Взаємовиключається з expression.</p></td>
        </tr>
        <tr>
            <td><code>expression</code><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися CEL.</p>
                <p>CEL вирази мають доступ до вмісту заявок токена, організованого в CEL змінну:</p>
                <ul>
                    <li>'claims' — це мапа імен заявок до їх значень. Наприклад, змінну з іменем 'sub' можна отримати як 'claims.sub'. Вкладені заявки можна отримати за допомогою нотації крапок, наприклад, 'claims.foo.bar'.</li>
                </ul>
                <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p>
                <p>Є взаємовиключною з claim і prefix.</p>
            </td>
        </tr>
    </tbody>
</table>

## `ProtocolType` {#apiserver-k8s-io-v1alpha1-ProtocolType}

(Аліас `string`)

**Зʼявляється в:**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)

ProtocolType — набір допустимих значень для Connection.ProtocolType

## `Transport` {#apiserver-k8s-io-v1alpha1-TCPTransport}

**Зʼявляється в:**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

TCPTransport надає інформацію для зʼєднання з сервером konnectivity через TCP

<table class="table">
    <thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
    <tbody>
        <tr>
            <td><code>url</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>URL — це місцезнаходження сервера konnectivity, до якого потрібно підʼєднатися. Наприклад, це може бути https://127.0.0.1:8131&quot;</p></td>
        </tr>
        <tr>
            <td><code>tlsConfig</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-TLSConfig"><code>TLSConfig</code></a>
            </td>
            <td><p>TLSConfig — конфігурація, необхідна для використання TLS при підключенні до сервера konnectivity</p></td>
        </tr>
    </tbody>
</table>

## `TLSConfig` {#apiserver-k8s-io-v1alpha1-TLSConfig}

**Зʼявляється в:**

- [TCPTransport](#apiserver-k8s-io-v1alpha1-TCPTransport)

TLSConfig надає інформацію для автентифікації для підключення до konnectivity server. Використовується тільки з TCPTransport.


<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>caBundle</code><br/>
                <code>string</code>
            </td>
            <td><p>caBundle — це розташування файлу з CA, який буде використовуватися для встановлення довіри з konnectivity server. Повинно бути відсутнім/порожнім, якщо URL TCPTransport має префікс http://. Якщо відсутній, коли URL TCPTransport має префікс https://, стандартно використовуються системні корені довіри.</p></td>
        </tr>
        <tr>
            <td><code>clientKey</code><br/>
                <code>string</code>
            </td>
            <td><p>clientKey — це розташування файлу з ключем клієнта, який буде використовуватися в mtls-рукостисканнях з konnectivity server. Повинно бути відсутнім/порожнім, якщо URL TCPTransport має префікс http://. Повинно бути налаштованим, якщо URL TCPTransport має префікс https://</p></td>
        </tr>
        <tr>
            <td><code>clientCert</code><br/>
                <code>string</code>
            </td>
            <td><p>clientCert — це розташування файлу з сертифікатом клієнта, який буде використовуватися в mtls-рукостисканнях з konnectivity server. Повинно бути відсутнім/порожнім, якщо URL TCPTransport має префікс http://. Повинно бути налаштованим, якщо URL TCPTransport має префікс https://</p></td>
        </tr>
    </tbody>
</table>

## `Transport`{#apiserver-k8s-io-v1alpha1-Transport}

**Зʼявляється в:**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)

Transport визначає конфігурації транспорту, які ми використовуємо для підключення до konnectivity server.


<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>tcp</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-TCPTransport"><code>TCPTransport</code></a>
            </td>
            <td><p>TCP — це конфігурація TCP для звʼязку з konnectivity server через TCP. ProxyProtocol з GRPC наразі не підтримується з TCP транспортом. Потрібно налаштувати принаймні один з TCP або UDS.</p></td>
        </tr>
        <tr>
            <td><code>uds</code><br/>
                <a href="#apiserver-k8s-io-v1alpha1-UDSTransport"><code>UDSTransport</code></a>
            </td>
            <td><p>UDS — це конфігурація UDS для звʼязку з konnectivity server через UDS. Потрібно налаштувати принаймні один з TCP або UDS.</p></td>
        </tr>
    </tbody>
</table>

## `UDSTransport` {#apiserver-k8s-io-v1alpha1-UDSTransport}


**Зʼявляється в:**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)


UDSTransport надає інформацію для підключення до konnectivity server через UDS.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>udsName</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>UDSName — це назва unix domain socket для підключення до konnectivity server. Це не використовує префікс unix://. (Наприклад: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)</p></td>
        </tr>
    </tbody>
</table>

## `UserValidationRule` {#apiserver-k8s-io-v1alpha1-UserValidationRule}


**Зʼявляється в:**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

UserValidationRule надає конфігурацію для одного правила перевірки інформації про користувача.


<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expression</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися CEL. Повинен повернути true, щоб перевірка пройшла успішно.</p>
            <p>CEL вирази мають доступ до вмісту UserInfo, організованого в CEL змінну:</p>
            <ul>
                <li>'user' - authentication.k8s.io/v1, Обʼєкт Kind=UserInfo Див. https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122 для визначення. API документація: <a href="/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io">https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</a></li>
            </ul>
            <p>Документація з CEL: <a href="/uk/docs/reference/using-api/cel/">https://kubernetes.io/docs/reference/using-api/cel/</a></p></td>
        </tr>
        <tr>
            <td><code>message</code><br/>
                <code>string</code>
            </td>
            <td><p>message налаштовує повернуте повідомлення про помилку, коли правило повертає false. message є літеральним рядком.</p></td>
        </tr>
    </tbody>
</table>

## `WebhookConfiguration` {#apiserver-k8s-io-v1alpha1-WebhookConfiguration}


**Зʼявляється в:**

- [AuthorizerConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>authorizedTTL</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування відповідей "authorized" від вебхука авторизатора. Те ж саме, що й встановлення прапорця <code>--authorization-webhook-cache-authorized-ttl</code> Стандартно: 5m0s</p></td>
        </tr>
        <tr>
            <td><code>cacheAuthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheAuthorizedRequests визначає, чи слід кешувати авторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля AuthorizedTTL. Стандартно: true</p></td>
        </tr>
        <tr>
            <td><code>unauthorizedTTL</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Тривалість кешування відповідей "unauthorized" від вебхука авторизатора. Те ж саме, що й встановлення прапорця <code>--authorization-webhook-cache-unauthorized-ttl</code> Стандартно: 30s</p></td>
        </tr>
        <tr>
            <td><code>cacheUnauthorizedRequests</code><br/><code>bool</code></td>
            <td><p>CacheUnauthorizedRequests визначає, чи слід кешувати неавторизовані запити. Якщо встановлено значення true, TTL для кешованих рішень можна налаштувати за допомогою поля UnauthorizedTTL. Стандартно: true</p></td>
        </tr>
        <tr>
            <td><code>timeout</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
            </td>
            <td><p>Час очікування відповіді від вебхука Максимально дозволене значення — 30s. Обовʼязкове, стандартне значення відсутнє.</p></td>
        </tr>
        <tr>
            <td><code>subjectAccessReviewVersion</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Версія API authorization.k8s.io SubjectAccessReview, яку потрібно відправити та очікувати від вебхука. Те ж саме, що й встановлення прапорця <code>--authorization-webhook-version</code> Дійсні значення: v1beta1, v1. Обовʼязкове, стандартне значення відсутнє</p></td>
        </tr>
        <tr>
            <td><code>matchConditionSubjectAccessReviewVersion</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>MatchConditionSubjectAccessReviewVersion визначає версію SubjectAccessReview, яку використовують для оцінки виразів CEL. Дійсні значення: v1. Обовʼязкове, стандартне значення відсутнє</p></td>
        </tr>
        <tr>
            <td><code>failurePolicy</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Контролює рішення про авторизацію, коли запит вебхука не вдається завершити або повертає некоректну відповідь або помилки при оцінці matchConditions. Дійсні значення:</p>
            <ul>
                <li>NoOpinion: продовжити до наступних авторизаторів, щоб побачити, чи один з них дозволить запит</li>
                <li>Deny: відхилити запит без консультації з наступними авторизаторами. Обовʼязкове, стандартне значення відсутнє.</li>
            </ul></td>
        </tr>
        <tr>
            <td><code>connectionInfo</code> <b>[Обовʼязкове]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
            </td>
            <td><p>ConnectionInfo визначає, як ми спілкуємося з вебхуком</p></td>
        </tr>
        <tr>
            <td><code>matchConditions</code> <b>[Обовʼязкове]</b><br/>
                <a href="#apiserver-k8s-io-v1alpha1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
            </td>
            <td><p>matchConditions — це список умов, які мають бути виконані, щоб запит було надіслано на цей вебхук. Порожній список matchConditions відповідає всім запитам. Максимально допустимо 64 умови відповідності.</p>
            <p>Точна логіка відповідності (в порядку):</p>
            <ol>
                <li>Якщо принаймні одна умова відповідності оцінюється як FALSE, то вебхук пропускається.</li>
                <li>Якщо ВСІ умови відповідності оцінюються як TRUE, то вебхук викликається.</li>
                <li>Якщо принаймні одна умова відповідності оцінюється як помилка (але жодна з них не є FALSE):
                <ul>
                    <li>Якщо failurePolicy=Deny, то вебхук відхиляє запит</li>
                    <li>Якщо failurePolicy=NoOpinion, то помилка ігнорується, і вебхук пропускається</li>
                </ul></li>
            </ol>
        </td>
        </tr>
    </tbody>
</table>

## `WebhookConnectionInfo` {#apiserver-k8s-io-v1alpha1-WebhookConnectionInfo}

**Зʼявляється в:**

- [WebhookConfiguration](#apiserver-k8s-io-v1alpha1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Контролює, як вебхук повинен спілкуватися з сервером. Дійсні значення:</p>
                <ul>
                    <li>KubeConfigFile: використовувати файл, зазначений у kubeConfigFile, щоб знайти сервер.</li>
                    <li>InClusterConfig: використовувати внутрішньокластерну конфігурацію для виклику SubjectAccessReview API, який розміщений kube-apiserver. Цей режим не дозволено для kube-apiserver.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>kubeConfigFile</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Шлях до KubeConfigFile для інформації про підключення. Обовʼязково, якщо connectionInfo.Type є KubeConfig</p></td>
        </tr>
    </tbody>
</table>

## `WebhookMatchCondition` {#apiserver-k8s-io-v1alpha1-WebhookMatchCondition}

**Зʼявляється в:**

- [WebhookConfiguration](#apiserver-k8s-io-v1alpha1-WebhookConfiguration)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expression</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>expression представляє вираз, який буде оцінюватися за допомогою CEL. Повинен оцінюватися як bool. CEL вирази мають доступ до вмісту SubjectAccessReview у версії v1. Якщо версія, вказана в subjectAccessReviewVersion у змінній запиту, є v1beta1, вміст буде перетворено на версію v1 перед оцінкою виразу CEL.</p>
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
