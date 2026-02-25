---
title: kube-apiserver Admission (v1)
content_type: tool-reference
package: admission.k8s.io/v1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)

## `AdmissionReview` {#admission-k8s-io-v1-AdmissionReview}

AdmissionReview описує запит/відповідь на перегляд доступу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>admission.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>AdmissionReview</code></td>
        </tr>
        <tr>
            <td><code>request</code><br/>
                <a href="#admission-k8s-io-v1-AdmissionRequest"><code>AdmissionRequest</code></a>
            </td>
            <td><p>request описує атрибути запиту на перегляд доступу.</p></td>
        </tr>
        <tr>
            <td><code>response</code><br/>
                <a href="#admission-k8s-io-v1-AdmissionResponse"><code>AdmissionResponse</code></a>
            </td>
            <td><p>response описує атрибути відповіді на перегляд доступу.</p></td>
        </tr>
    </tbody>
</table>

## `AdmissionRequest` {#admission-k8s-io-v1-AdmissionRequest}

**Зʼявляється в:**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)

AdmissionRequest описує атрибути доступу для запиту на перегляд доступу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>uid</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
            </td>
            <td><p>uid — це ідентифікатор для індивідуального запиту/відповіді. Це дозволяє нам розрізняти випадки запитів, які є в іншому випадку ідентичними (паралельні запити, запити, коли попередні запити не змінили і т. д.). UID призначений для відстеження зворотного звʼязку (запит/відповідь) між KAS і WebHook, а не користувацьким запитом. Він підходить для співставлення записів журналу між вебхуком і apiserver для аудиту або налагодження.</p></td>
        </tr>
        <tr>
            <td><code>kind</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
            </td>
            <td><p>kind — це повністю кваліфікований тип обʼєкта, що подається (наприклад, v1.Pod або autoscaling.v1.Scale)</p></td>
        </tr>
        <tr>
            <td><code>resource</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
            </td>
            <td><p>resource — це повністю кваліфікований ресурс, що запитується (наприклад, v1.pods)</p></td>
        </tr>
        <tr>
            <td><code>subResource</code><br/>
                <code>string</code>
            </td>
            <td><p>subResource — це субресурс, що запитується, якщо такий є (наприклад, &quot;status&quot; або &quot;scale&quot;)</p></td>
        </tr>
        <tr>
            <td><code>requestKind</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionKind"><code>meta/v1.GroupVersionKind</code></a>
            </td>
            <td><p>requestKind — це повністю кваліфікований тип початкового API-запиту (наприклад, v1.Pod або autoscaling.v1.Scale). Якщо це вказано і відрізняється від значення в &quot;kind&quot;, було виконано еквівалентне співставлення та перетворення.</p>
                <p>Наприклад, якщо deployments можна змінювати за допомогою apps/v1 та apps/v1beta1, і вебхук зареєстрував правило <code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> і <code>matchPolicy: Equivalent</code>, API-запит до деплойментів apps/v1beta1 буде перетворено та надіслано до вебхука з <code>kind: {group:&quot;apps&quot;, version:&quot;v1&quot;, kind:&quot;Deployment&quot;}</code> (відповідно до правила, зареєстрованого вебхуком), і <code>requestKind: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, kind:&quot;Deployment&quot;}</code> (вказуючи на тип початкового API-запиту).</p>
                <p>Дивіться документацію для поля &quot;matchPolicy&quot; у типі конфігурації вебхука для отримання додаткової інформації.</p>
          </td>
        </tr>
        <tr>
            <td><code>requestResource</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#GroupVersionResource"><code>meta/v1.GroupVersionResource</code></a>
            </td>
            <td><p>requestResource — це повністю кваліфікований ресурс початкового API-запиту (наприклад, v1.pods). Якщо це вказано і відрізняється від значення в &quot;resource&quot;, було виконано еквівалентне співставлення та перетворення.</p>
                <p>Наприклад, якщо deployments можна змінювати за допомогою apps/v1 та apps/v1beta1, і вебхук зареєстрував правило <code>apiGroups:[&quot;apps&quot;], apiVersions:[&quot;v1&quot;], resources: [&quot;deployments&quot;]</code> і <code>matchPolicy: Equivalent</code>, API-запит до деплойментів apps/v1beta1 буде перетворено та надіслано до вебхука з <code>resource: {group:&quot;apps&quot;, version:&quot;v1&quot;, resource:&quot;deployments&quot;}</code> (відповідно до ресурсу, зареєстрованого вебхуком), і <code>requestResource: {group:&quot;apps&quot;, version:&quot;v1beta1&quot;, resource:&quot;deployments&quot;}</code> (вказуючи на ресурс початкового API-запиту).</p>
                <p>Дивіться документацію для поля &quot;matchPolicy&quot; у типі конфігурації вебхука.</p>
            </td>
        </tr>
        <tr>
            <td><code>requestSubResource</code><br/>
                <code>string</code>
            </td>
            <td><p>requestSubResource — це назва субресурсу початкового API-запиту, якщо такий є (наприклад, &quot;status&quot; або &quot;scale&quot;). Якщо це вказано і відрізняється від значення в &quot;subResource&quot;, було виконано еквівалентне співставлення та перетворення. Дивіться документацію для поля &quot;matchPolicy&quot; у типі конфігурації вебхука.</p></td>
        </tr>
        <tr>
            <td><code>name</code><br/>
                <code>string</code>
            </td>
            <td><p>name — це назва обʼєкта, як подано в запиті. У разі операції CREATE клієнт може не вказати імʼя та покластися на сервер для генерації імені. Якщо це так, це поле буде містити порожній рядок.</p></td>
        </tr>
        <tr>
            <td><code>namespace</code><br/>
                <code>string</code>
            </td>
            <td><p>namespace — це простір імен, повʼязаний із запитом (якщо є).</p></td>
        </tr>
        <tr>
            <td><code>operation</code> <b>[Обовʼязкове]</b><br/>
                <a href="#admission-k8s-io-v1-Operation"><code>Operation</code></a>
            </td>
            <td><p>operation — це операція, що виконується. Це може відрізнятися від операції, що запитується. Наприклад, патч може призвести до виконання операції CREATE або UPDATE.</p></td>
        </tr>
        <tr>
            <td><code>userInfo</code> <b>[Обовʼязкове]</b><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#userinfo-v1-authentication-k8s-io"><code>authentication/v1.UserInfo</code></a>
            </td>
            <td><p>userInfo — це інформація про користувача, який виконує запит</p></td>
        </tr>
        <tr>
            <td><code>object</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
            </td>
            <td><p>object — це обʼєкт з вхідного запиту.</p></td>
        </tr>
        <tr>
            <td><code>oldObject</code><br/>
                <a href="https://pkg.go.dev/k8s.io/      apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/
            pkg/runtime.RawExtension</code></a>
            </td>
            <td><p>oldObject — це існуючий обʼєкт. Заповнюється тільки для запитів TE і UPDATE. </p></td>
        </tr>
        <tr>
            <td><code>dryRun</code><br/>
                <code>bool</code>
            </td>
            <td><p>dryRun вказує, що зміни точно не ть збережені —ля цього запиту. Типово: false.</p></td>
        </tr>
        <tr>
            <td><code>options</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
            </td>
            <td><p>options — це структура опцій операції, що виконується. наприклад, <code>meta.k8s.io/v1.DeleteOptions</code> або <code>meta.k8s.io/v1.CreateOptions</code>. Це може бути інше, ніж опції, надані викликачем. наприклад, для запиту патчу виконана операція може бути CREATE, у цьому випадку Options буде <code>meta.k8s.io/v1.CreateOptions</code>, навіть якщо викликач надав <code>meta.k8s.io/v1.PatchOptions</code>.</p></td>
        </tr>
    </tbody>
</table>

## `AdmissionResponse` {#admission-k8s-io-v1-AdmissionResponse}

**Зʼявляється в:**

- [AdmissionReview](#admission-k8s-io-v1-AdmissionReview)

AdmissionResponse описує відповідь на перегляд доступу.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>uid</code> <b>[Обовʼязкове]</b><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/types#UID"><code>k8s.io/apimachinery/pkg/types.UID</code></a>
            </td>
            <td><p>uid — це ідентифікатор для індивідуального запиту/відповіді. Це повинно бути скопійовано з відповідного AdmissionRequest.</p></td>
        </tr>
        <tr>
            <td><code>allowed</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td><p>allowed вказує, чи було дозволено запит на перегляд доступу.</p></td>
        </tr>
        <tr>
            <td><code>status</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#status-v1-meta"><code>meta/v1.Status</code></a>
            </td>
            <td><p>status це result що містить додаткові деталі щодо причин відхилення запиту на перегляд доступу. Це поле НЕ враховується, якщо &quot;Allowed&quot; є &quot;true&quot;.</p></td>
        </tr>
        <tr>
            <td><code>patch</code><br/>
                <code>[]byte</code>
            </td>
            <td><p>patch — тіло патчу. Наразі ми підтримуємо лише &quot;JSONPatch&quot;, який реалізує RFC 6902.</p></td>
        </tr>
        <tr>
            <td><code>patchType</code><br/>
                <a href="#admission-k8s-io-v1-PatchType"><code>PatchType</code></a>
            </td>
            <td><p>patchType — тип патчу. Наразі ми підтримуємо лише &quot;JSONPatch&quot;.</p></td>
        </tr>
        <tr>
            <td><code>auditAnnotations</code><br/>
                <code>map[string]string</code>
            </td>
            <td><p>auditAnnotations — це неструктурована карта ключ-значення, встановлена віддаленим контролером перегляду доступу (наприклад, error=image-blacklisted). Контролери MutatingAdmissionWebhook і ValidatingAdmissionWebhook додадуть до ключів префікс з іменем вебхука (наприклад, imagepolicy.example.com/error=image-blacklisted). AuditAnnotations буде надано вебхуком для додавання додаткового контексту до логу аудиту для цього запиту.</p></td>
        </tr>
        <tr>
            <td><code>warnings</code><br/>
                <code>[]string</code>
            </td>
            <td><p>warnings — це список попереджувальних повідомлень, що повертаються клієнту API, який робить запит. Попереджувальні повідомлення описують проблему, яку клієнт, що робить API-запит, має виправити або врахувати. По можливості обмежте попереджувальні повідомлення до 120 символів. Попереджувальні повідомлення, що перевищують 256 символів, та велика кількість попереджувальних повідомлень можуть бути скорочені.</p></td>
        </tr>
    </tbody>
</table>

## `Operation` {#admission-k8s-io-v1-Operation}

(Аліас `string`)

**Зʼявляється в:**

- [AdmissionRequest](#admission-k8s-io-v1-AdmissionRequest)

Operation — це тип операції з ресурсом, який перевіряється для контролю доступу

## `PatchType` {#admission-k8s-io-v1-PatchType}

(Аліас `string`)

**Зʼявляється в:**

- [AdmissionResponse](#admission-k8s-io-v1-AdmissionResponse)

PatchType — це тип патчу, що використовується для представлення зміненого обʼєкта.
