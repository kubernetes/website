---
title: Image Policy API (v1alpha1)
content_type: tool-reference
package: imagepolicy.k8s.io/v1alpha1
auto_generated: false
---

## Типи ресурсів {#resource-types}

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

## `ImageReview` {#imagepolicy-k8s-io-v1alpha1-ImageReview}

ImageReview перевіряє, чи дозволений набір образів у поді.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>imagepolicy.k8s.io/v1alpha1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>ImageReview</code></td>
        </tr>
        <tr>
            <td><code>metadata</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
            </td>
            <td><p>Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. Зверніться до документації Kubernetes API для полів метаданих <code>metadata</code>.</p></td>
        </tr>
        <tr>
            <td><code>spec</code> <b>[Обовʼязкове]</b><br/>
                <a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec"><code>ImageReviewSpec</code></a>
            </td>
            <td><p>Spec містить інформацію про под, що оцінюється.</p></td>
        </tr>
        <tr>
            <td><code>status</code><br/>
                <a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus"><code>ImageReviewStatus</code></a>
            </td>
            <td><p>Status заповнюється бекендом і вказує, чи слід дозволити Pod.</p></td>
        </tr>
    </tbody>
</table>

## `ImageReviewContainerSpec` {#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec}

**Зустрічається в:**

- [ImageReviewSpec](#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec)

ImageReviewContainerSpec — це опис контейнера в запиті на створення Podʼа.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>image</code><br/>
                <code>string</code>
            </td>
            <td><p>Це може бути у вигляді image:tag або image@SHA:012345679abcdef.</p></td>
        </tr>
    </tbody>
</table>

## `ImageReviewSpec` {#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec}

**Зустрічається в:**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

ImageReviewSpec — це опис запиту на створення Podʼа.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>containers</code><br/>
                <a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec"><code>[]ImageReviewContainerSpec</code></a>
            </td>
            <td><p>Containers — це список підмножини інформації в кожному контейнері пода, що створюється.</p></td>
        </tr>
        <tr>
            <td><code>annotations</code><br/>
                <code>map[string]string</code>
            </td>
            <td><p>Annotations — це список ключ-значення, витягнутий з анотацій Podʼа. Він включає лише ключі, які відповідають шаблону <code>*.image-policy.k8s.io/*</code>. Відповідно до кожного веб-хука, щоб визначити, як інтерпретувати ці анотації, якщо взагалі.</p></td>
        </tr>
        <tr>
            <td><code>namespace</code><br/>
                <code>string</code>
            </td>
            <td><p>Namespace — це простір імен, в якому створюється под.</p></td>
        </tr>
    </tbody>
</table>

## `ImageReviewStatus` {#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus}

**Зустрічається в:**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

ImageReviewStatus — це результат перевірки запиту на створення Podʼа.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>allowed</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td><p>Allowed вказує, що всі образи були дозволені до виконання.</p></td>
        </tr>
        <tr>
            <td><code>reason</code><br/>
                <code>string</code>
            </td>
            <td><p>Reason має бути порожнім, якщо Allowed є true, у протилежному випадку може містити короткий опис проблеми. Kubernetes може обрізати надто довгі помилки під час відображення користувачу.</p></td>
        </tr>
        <tr>
            <td><code>auditAnnotations</code><br/>
                <code>map[string]string</code>
            </td>
            <td><p>AuditAnnotations буде додано до обʼєкта атрибутів запиту контролера доступу за допомогою 'AddAnnotation'. Ключі повинні бути без префіксів (тобто контролер доступу додасть відповідний префікс).</p></td>
        </tr>
    </tbody>
</table>
