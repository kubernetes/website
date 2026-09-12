---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "ResourceAttributes"
content_type: "api_reference"
description: "ResourceAttributes включає атрибути авторизації, доступні для запитів ресурсів до інтерфейсу Authorizer"
title: "ResourceAttributes"
weight: 400
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## ResourceAttributes {#ResourceAttributes}

ResourceAttributes включає атрибути авторизації, доступні для запитів ресурсів до інтерфейсу Authorizer

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fieldSelector</code><br/><em><a href="{{< ref "field-selector-attributes-v1-authorization#FieldSelectorAttributes" >}}">FieldSelectorAttributes</a></em></td>
      <td>fieldSelector описує обмеження доступу на основі поля. Воно може лише обмежувати доступ, а не розширювати його.</td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>group є API Group ресурсу.  "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "label-selector-attributes-v1-authorization#LabelSelectorAttributes" >}}">LabelSelectorAttributes</a></em></td>
      <td>labelSelector описує обмеження доступу на основі міток. Воно може лише обмежувати доступ, а не розширювати його.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>name є імʼям ресурсу, до якого запитується доступ для "get" або видаляється для "delete". "" (порожнє) означає всі.</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>namespace є простором імен дії, до якої запитується доступ. Наразі немає різниці між відсутністю простору імен та всіма просторами імен "" (порожнє) зазвичай для LocalSubjectAccessReviews "" (порожнє) є порожнім для ресурсів з обмеженням на кластер "" (порожнє) означає "всі" для ресурсів з обмеженням на простір імен з SubjectAccessReview або SelfSubjectAccessReview</td>
    </tr>
    <tr>
      <td><code>resource</code><br/><em>string</em></td>
      <td>resource є одним з наявних типів ресурсів.  "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>subresource</code><br/><em>string</em></td>
      <td>subresource є одним з наявних типів ресурсів.  "" означає відсутність.</td>
    </tr>
    <tr>
      <td><code>verb</code><br/><em>string</em></td>
      <td>verb є дією API ресурсу Kubernetes, наприклад: get, list, watch, create, update, delete, proxy.  "*" означає всі.</td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>version є версією API ресурсу.  "*" означає всі.</td>
    </tr>
  </tbody>
</table>
