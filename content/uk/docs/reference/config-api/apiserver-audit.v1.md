---
title: kube-apiserver Audit Configuration (v1)
content_type: tool-reference
package: audit.k8s.io/v1
auto_generated: false
---

## Типи ресурсів {#resource-types}


- [Event](#audit-k8s-io-v1-Event)
- [EventList](#audit-k8s-io-v1-EventList)
- [Policy](#audit-k8s-io-v1-Policy)
- [PolicyList](#audit-k8s-io-v1-PolicyList)

## `Event` {#audit-k8s-io-v1-Event}

**Зустрічається в:**

- [EventList](#audit-k8s-io-v1-EventList)

Подія захоплює всю інформацію, яка може бути включена в лог аудиту API.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>audit.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>Event</code></td>
        </tr>
        <tr>
            <td><code>level</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
            </td>
            <td><p>Рівень аудиту, на якому була згенерована подія.</p></td>
        </tr>
        <tr>
            <td><code>auditID</code> <b>[Обовʼязково]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
            </td>
            <td><p>Унікальний ідентифікатор аудиту, згенерований для кожного запиту.</p></td>
        </tr>
        <tr>
            <td><code>stage</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-Stage"><code>Stage</code></a>
            </td>
            <td><p>Стадія обробки запиту, коли був згенерований цей екземпляр події.</p></td>
        </tr>
        <tr>
            <td><code>requestURI</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>RequestURI — це URI запиту, який був надісланий клієнтом на сервер.</p></td>
        </tr>
        <tr>
            <td><code>verb</code> <b>[Обовʼязково]</b><br/>
                <code>string</code>
            </td>
            <td><p>Verb — це дієслово Kubernetes, повʼязане із запитом. Для запитів без ресурсів це нижчий регістр HTTP-методу.</p></td>
        </tr>
        <tr>
            <td><code>user</code> <b>[Обовʼязково]</b><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
            </td>
            <td><p>Інформація про автентифікованого користувача.</p></td>
        </tr>
        <tr>
            <td><code>impersonatedUser</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
            </td>
            <td><p>Інформація про користувача, який діє від імені іншого користувача.</p></td>
        </tr>
        <tr>
            <td><code>authenticationMetadata</code><br/>
                <a href="#audit-k8s-io-v1-AuthenticationMetadata"><code>AuthenticationMetadata</code></a>
            </td>
            <td><p>AuthenticationMetadata містить детальну інформацію про те, як було автентифіковано запит.</p> </td>
        </tr>
        <tr>
            <td><code>sourceIPs</code><br/>
                <code>[]string</code>
            </td>
            <td><p>IP-адреси джерела, звідки надійшов запит і проміжні проксі-сервери. IP-адреси джерела вказані у наступному порядку:</p>
                <ol>
                    <li>IP-адреси заголовку запиту X-Forwarded-For</li>
                    <li>Заголовок X-Real-Ip, якщо він не присутній у списку X-Forwarded-For</li>
                    <li>Віддалена адреса для зʼєднання, якщо вона не відповідає останній IP-адресі у списку до цього (X-Forwarded-For або X-Real-Ip). Примітка: Усі, крім останнього IP, можуть бути довільно встановлені клієнтом.</li>
                </ol>
            </td>
        </tr>
        <tr>
            <td><code>userAgent</code><br/>
                <code>string</code>
            </td>
            <td><p>UserAgent записує рядок агента користувача, наданий клієнтом. Зазначте, що UserAgent надається клієнтом і не може бути довіреним.</p></td>
        </tr>
        <tr>
            <td><code>objectRef</code><br/>
                <a href="#audit-k8s-io-v1-ObjectReference"><code>ObjectReference</code></a>
            </td>
            <td><p>Обʼєктне посилання на цей запит. Не застосовується для запитів типу Список або запитів без ресурсів.</p></td>
        </tr>
        <tr>
            <td><code>responseStatus</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#status-v1-meta"><code>meta/v1.Status</code></a>
            </td>
            <td><p>Статус відповіді, заповнений навіть коли ObjectReference не є типом Status. Для успішних відповідей це міститиме лише Code і StatusSuccess. Для не-статусних типів помилок відповідей це буде автоматично заповнено повідомленням про помилку.</p> </td>
        </tr>
        <tr>
            <td><code>requestObject</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
            </td>
            <td><p>Обʼєкт API із запиту у форматі JSON. RequestObject записується в тому вигляді, в якому він був у запиті (можливо, повторно закодований як JSON), до конвертації версій, стандартно, допуску або злиття. Це зовнішній обʼєкт типу версії, і він може бути недійсним обʼєктом самостійно. Опускається для запитів без ресурсів. Записується тільки на рівні Request та вище.</p> </td>
        </tr>
        <tr>
            <td><code>responseObject</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
            </td>
            <td><p>Обʼєкт API, що повертається у відповіді, у форматі JSON. ResponseObject записується після перетворення на зовнішній тип і серіалізується як JSON. Опускається для запитів без ресурсів.  Записується тільки на рівні Response.</p>
            </td>
        </tr>
        <tr>
            <td><code>requestReceivedTimestamp</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
            </td>
            <td><p>Час, коли запит досяг сервера API.</p></td>
        </tr>
        <tr>
            <td><code>stageTimestamp</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#microtime-v1-meta"><code>meta/v1.MicroTime</code></a>
            </td>
            <td><p>Час, коли запит досяг поточної стадії аудиту.</p></td>
        </tr>
        <tr>
            <td><code>annotations</code><br/>
                <code>map[string]string</code>
            </td>
            <td><p>Анотації — це неструктуровані ключові значення, які зберігаються разом з подією аудиту і можуть бути встановлені втулками, викликаними в ланцюжку обслуговування запитів, включаючи втулки автентифікації, авторизації та допуску. Зазначте, що ці анотації призначені для події аудиту і не відповідають метаданим анотацій надісланого обʼєкта. Ключі повинні унікально ідентифікувати інформуючий компонент.</p></td>
        </tr>
    </tbody>
</table>

## `EventList` {#audit-k8s-io-v1-EventList}

EventList містить події аудиту API.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>audit.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>EventList</code></td>
        </tr>
        <tr>
            <td><code>metadata</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
            </td>
            <td><p>Метадані списку, такі як інформація про пагінацію.</p></td>
        </tr>
        <tr>
            <td><code>items</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-Event"><code>[]Event</code></a>
            </td>
            <td><p>Перелік подій аудиту.</p></td>
        </tr>
    </tbody>
</table>

## `Policy` {#audit-k8s-io-v1-Policy}

**Зʼявляється у:**

- [PolicyList](#audit-k8s-io-v1-PolicyList)

Політика визначає конфігурацію журналювання аудиту та правила для того, як різні категорії запитів мають бути зареєстровані.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>audit.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>Policy</code></td></tr>
        <tr>
            <td><code>metadata</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
            </td>
            <td><p>ObjectMeta включено для забезпечення сумісності з API-інфраструктурою.</p>
                <p>Зверніться до документації Kubernetes API для полів поля <code>metadata</code>.</p>
            </td>
        </tr>
        <tr>
            <td><code>rules</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-PolicyRule"><code>[]PolicyRule</code></a>
            </td>
            <td><p>Правила визначають рівень аудиту, на якому має бути записаний запит.</p>
                <p>Запит може відповідати кільком правилам, у такому випадку буде використано ПЕРШЕ відповідне правило.</p>
                <p>Типово рівень аудиту — None, але може бути переважений універсальним правилом в кінці списку.</p>
                <p>PolicyRules мають строго визначений порядок.</p>
            </td>
        </tr>
        <tr>
            <td><code>omitStages</code><br/>
                <a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
            </td>
            <td><p>OmitStages — це список етапів, для яких не створюються події. Зверніть увагу, що це також може бути вказано для кожного правила окремо, у такому випадку обʼєднання обох буде пропущено.</p></td>
        </tr>
        <tr>
            <td><code>omitManagedFields</code><br/>
                <code>bool</code>
            </td>
            <td><p>OmitManagedFields вказує, чи слід пропускати керовані поля запитів та відповідей у журналі аудиту API. Це використовується як глобальний стандарт — значення 'true' призведе до пропуску керованих полів, в іншому випадку керовані поля будуть включені до логу аудиту API. Зверніть увагу, що це також може бути вказано для кожного правила окремо, у такому випадку значення, зазначене в правилі, переважить глобальний стандарт.</p>
            </td>
        </tr>
    </tbody>
</table>

## `PolicyList` {#audit-k8s-io-v1-PolicyList}

PolicyList — це список політик аудиту.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>audit.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>PolicyList</code></td>
        </tr>
        <tr>
            <td><code>metadata</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#listmeta-v1-meta"><code>meta/v1.ListMeta</code></a>
            </td>
            <td><span class="text-muted">Опис не надано.</span></td>
        </tr>
        <tr>
            <td><code>items</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-Policy"><code>[]Policy</code></a>
            </td>
            <td><span class="text-muted">Опис не надано.</span></td>
        </tr>
    </tbody>
</table>

## `AuthenticationMetadata`     {#audit-k8s-io-v1-AuthenticationMetadata}

**Зустрічається в:**

- [Event](#audit-k8s-io-v1-Event)

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>impersonationConstraint</code><br/>
            <code>string</code></td>
            <td><p>ImpersonationConstraint — це дієслово, повʼязане з режимом обмеженого наслідування, який використовувався для авторизації ImpersonatedUser, повʼязаного з цією подією аудиту.  Воно встановлюється тільки в разі використання обмеженого наслідування.</p></td>
        </tr>
    </tbody>
</table>

## `GroupResources` {#audit-k8s-io-v1-GroupResources}

**Зустрічається в:**

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

GroupResources представляють типи ресурсів в API групі.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>group</code><br/>
                <code>string</code>
          </td>
          <td><p>Група — це назва API групи, яка містить ресурси. Порожній рядок представляє основну API групу.</p></td>
        </tr>
        <tr>
            <td><code>resources</code><br/>
                <code>[]string</code>
            </td>
            <td><p>Ресурси — це список ресурсів, до яких застосовується це правило.</p>
                <p>Наприклад:</p>
                <ul>
                    <li><code>pods</code> відповідає Podʼам.</li>
                    <li><code>pods/log</code> відповідає субресурсу log Podʼів.</li>
                    <li><code>*</code> відповідає всім ресурсам та їх субресурсам.</li>
                    <li><code>pods/*</code> відповідає всім субресурсам Podʼів.</li>
                    <li><code>*/scale</code> відповідає всім субресурсам масштабу.</li>
                </ul>
                <p>Якщо присутній підстановочний знак, правило перевірки забезпечить, що ресурси не перекриваються між собою.</p>
                <p>Порожній список означає, що застосовуються всі ресурси та субресурси в цій API групі.</p>
            </td>
        </tr>
        <tr>
            <td><code>resourceNames</code><br/>
                <code>[]string</code>
            </td>
            <td><p>resourceNames — це список імен екземплярів ресурсів, які відповідають політиці. Використання цього поля вимагає, щоб Ресурси були вказані. Порожній список означає, що кожен екземпляр ресурсу відповідає.</p></td>
        </tr>
    </tbody>
</table>

## `Level` {#audit-k8s-io-v1-Level}

(Аліас `string`)

**Зустрічається в:**

- [Event](#audit-k8s-io-v1-Event)

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

Level визначає кількість інформації, що реєструється під час аудиту

## `ObjectReference` {#audit-k8s-io-v1-ObjectReference}

**Зустрічається в:**

- [Event](#audit-k8s-io-v1-Event)

ObjectReference містить достатньо інформації, щоб дозволити вам перевірити або змінити обʼєкт, на який посилається.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>resource</code><br/>
                <code>string</code>
            </td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
        <tr>
            <td><code>namespace</code><br/>
                <code>string</code>
            </td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
        <tr>
            <td><code>name</code><br/>
              <code>string</code>
            </td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
        <tr>
            <td><code>uid</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
            </td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
        <tr>
            <td><code>apiGroup</code><br/>
                <code>string</code>
            </td>
            <td><p>APIGroup — це назва API групи, яка містить обʼєкт, на який посилаються. Порожній рядок представляє основну API групу.</p></td>
        </tr>
        <tr>
            <td><code>apiVersion</code><br/>
                <code>string</code>
            </td>
            <td>
                <p>APIVersion — це версія API групи, яка містить обʼєкт, на який посилаються.</p>
            </td>
        </tr>
        <tr>
            <td><code>resourceVersion</code><br/>
                <code>string</code>
            </td>
            <td>
                <span class="text-muted">Опис відсутній.</span>
            </td>
        </tr>
        <tr>
            <td><code>subresource</code><br/>
                <code>string</code>
            </td>
            <td><span class="text-muted">Опис відсутній.</span></td>
        </tr>
    </tbody>
</table>

## `PolicyRule` {#audit-k8s-io-v1-PolicyRule}

**Зʼявляється в:**

- [Policy](#audit-k8s-io-v1-Policy)

PolicyRule зіставляє запити на основі метаданих з рівнем аудиту.
Запити повинні відповідати правилам кожного поля (перетин правил).

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>level</code> <b>[Обовʼязково]</b><br/>
                <a href="#audit-k8s-io-v1-Level"><code>Level</code></a>
            </td>
            <td><p>Рівень, на якому записуються запити, що відповідають цьому правилу.</p></td>
        </tr>
        <tr>
            <td><code>users</code><br/>
                <code>[]string</code>
            </td>
            <td><p>Користувачі (за автентифікованим імʼям користувача), до яких застосовується це правило. Порожній список означає всіх користувачів.</p></td>
        </tr>
        <tr>
            <td><code>userGroups</code><br/>
                <code>[]string</code>
            </td>
            <td><p>Групи користувачів, до яких застосовується це правило. Користувач вважається відповідним, якщо він є членом будь-якої з UserGroups. Порожній список означає всі групи користувачів.</p></td>
        </tr>
        <tr>
            <td><code>verbs</code><br/>
                <code>[]string</code>
            </td>
            <td><p>Дії, що відповідають цьому правилу. Порожній список означає всі дії.</p></td>
        </tr>
        <tr>
            <td><code>resources</code><br/>
                <a href="#audit-k8s-io-v1-GroupResources"><code>[]GroupResources</code></a>
            </td>
            <td><p>Ресурси, що відповідають цьому правилу. Порожній список означає всі види у всіх групах API.</p></td>
        </tr>
        <tr>
            <td><code>namespaces</code><br/>
                <code>[]string</code>
            </td>
            <td><p>Простори імен, що відповідають цьому правилу. Порожній рядок &quot;&quot; відповідає ресурсам без простору імен. Порожній список означає всі простори імен.</p></td>
        </tr>
        <tr>
            <td><code>nonResourceURLs</code><br/>
                <code>[]string</code>
            </td>
            <td><p>NonResourceURLs — це набір шляхів URL, які повинні бути аудійовані. <code>*</code> дозволені, але тільки як повний, кінцевий крок у шляху. Приклади:</p>
                <ul>
                    <li><code>/metrics</code> — Записувати запити для метрик apiserver</li>
                    <li><code>/healthz*</code> — Записувати всі перевірки стану</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>omitStages</code><br/>
                <a href="#audit-k8s-io-v1-Stage"><code>[]Stage</code></a>
            </td>
            <td><p>OmitStages — це список стадій, для яких не створюються події. Зверніть увагу, що це також може бути зазначено для всієї політики, в такому випадку обʼєднання обох буде виключено. Порожній список означає, що обмеження не застосовуються.</p></td>
        </tr>
        <tr>
            <td><code>omitManagedFields</code><br/>
                <code>bool</code>
            </td>
            <td><p>OmitManagedFields вказує, чи слід виключати керовані поля з тіла запиту та відповіді з логу аудиту API.</p>
                <ul>
                    <li>значення 'true' виключає керовані поля з логу аудиту API</li>
                    <li>значення 'false' вказує, що керовані поля повинні бути включені в логу аудиту API. Зверніть увагу, що значення, якщо зазначене, у цьому правилі буде переважати над глобальним стандартним значенням. Якщо значення не зазначено, то діє глобальне стандартне значення, вказане в Policy.OmitManagedFields.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## `Stage` {#audit-k8s-io-v1-Stage}

(Аліас `string`)

**Зʼявляється в:**

- [Event](#audit-k8s-io-v1-Event)

- [Policy](#audit-k8s-io-v1-Policy)

- [PolicyRule](#audit-k8s-io-v1-PolicyRule)

Stage визначає стадії обробки запитів, на яких можуть створюватися події аудиту.
