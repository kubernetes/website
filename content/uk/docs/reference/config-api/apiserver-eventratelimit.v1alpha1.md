---
title: Event Rate Limit Configuration (v1alpha1)
content_type: tool-reference
package: eventratelimit.admission.k8s.io/v1alpha1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [Configuration](#eventratelimit-admission-k8s-io-v1alpha1-Configuration)

## `Configuration` {#eventratelimit-admission-k8s-io-v1alpha1-Configuration}

Configuration надає конфігурацію для контролера доступу EventRateLimit.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>eventratelimit.admission.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>Configuration</code></td>
        </tr>
        <tr>
            <td><code>limits</code> <b>[Обовʼязкове]</b><br/>
                <a href="#eventratelimit-admission-k8s-io-v1alpha1-Limit"><code>[]Limit</code></a>
            </td>
            <td><p>limits — це обмеження на запити подій, що надходять. Обмеження можуть бути встановлені на події, отримані на рівні сервера, на рівні простору імен, на рівні користувача та на рівні джерела+обʼєкта. Потрібно принаймні одне обмеження.</p></td>
      </tr>
  </tbody>
</table>

## `Limit` {#eventratelimit-admission-k8s-io-v1alpha1-Limit}

**Зустрічається в:**

- [Configuration](#eventratelimit-admission-k8s-io-v1alpha1-Configuration)

Limit — це конфігурація для певного типу обмеження.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>type</code> <b>[Обовʼязкове]</b><br/>
                <a href="#eventratelimit-admission-k8s-io-v1alpha1-LimitType"><code>LimitType</code></a>
            </td>
            <td><p>type — це тип обмеження, до якого застосовується ця конфігурація.</p></td>
        </tr>
        <tr>
            <td><code>qps</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td><p>qps — це кількість запитів подій на секунду, дозволених для цього типу обмеження. Поля qps та burst використовуються разом, щоб визначити, чи приймається певний запит події. qps визначає, скільки запитів приймаються після вичерпання кількості запитів burst.</p></td>
        </tr>
        <tr>
            <td><code>burst</code> <b>[Обовʼязкове]</b><br/>
                <code>int32</code>
            </td>
            <td><p>burst — це кількість запитів подій burst, дозволених для цього типу обмеження. Поля qps та burst використовуються разом, щоб визначити, чи приймається певний запит події. burst визначає максимальний розмір дозволу, наданого для певного відра. Наприклад, якщо burst дорівнює 10, а qps дорівнює 3, то контроль доступу прийме 10 запитів перед блокуванням будь-яких запитів. Кожну секунду буде дозволено ще 3 запити. Якщо деяка частина цього дозволу не використовується, то вона переноситься на наступну секунду, поки не буде досягнуто максимального дозволу у 10 запитів.</p></td>
        </tr>
        <tr>
            <td><code>cacheSize</code><br/>
            <code>int32</code>
        </td>
            <td><p>cacheSize — це розмір LRU кешу для цього типу обмеження. Якщо кощик видаляється з кешу, то дозвол для цього кошика скидається. Якщо пізніше отримуються більше запитів для видаленого кошика, то цей кошик знову потрапляє в кеш з чистого аркуша, надаючи цьому кошику повний дозвіл на запити burst.</p>
                <p>Стандартний розмір кешу становить 4096.</p>
                <p>Якщо limitType — 'server', то cacheSize ігнорується.</p>
            </td>
        </tr>
    </tbody>
</table>

## `LimitType` {#eventratelimit-admission-k8s-io-v1alpha1-LimitType}

(Аліас `string`)

**Зустрічається в:**

- [Limit](#eventratelimit-admission-k8s-io-v1alpha1-Limit)

LimitType — це тип обмеження (наприклад, на рівні простору імен).
