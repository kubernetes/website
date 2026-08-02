---
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "Scale"
content_type: "api_reference"
description: "Scale представляє запит на масштабування ресурсу."
title: "Scale"
weight: 440
auto_generated: false
---

`apiVersion: autoscaling/v1`

`import "k8s.io/api/autoscaling/v1"`

## Scale {#Scale}

Scale представляє запит на масштабування ресурсу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a>.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind є рядком, що представляє REST-ресурс, який цей обʼєкт представляє. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не можна оновлювати. У CamelCase. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a>.</td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Стандартні метадані обʼєкта; Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>.</td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#ScaleSpec" >}}">ScaleSpec</a></em></td>
      <td>spec визначає поведінку масштабування. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a>.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#ScaleStatus" >}}">ScaleStatus</a></em></td>
      <td>status визначає поточний стан масштабування. Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a>. Тільки для читання.</td>
    </tr>
  </tbody>
</table>

## ScaleSpec {#ScaleSpec}

ScaleSpec описує атрибути субресурсу масштабування.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>replicas</code><br/><em>integer</em></td>
      <td>replicas є бажаною кількістю екземплярів для масштабованого обʼєкта.</td>
    </tr>
  </tbody>
</table>

## ScaleStatus {#ScaleStatus}

ScaleStatus описує поточний стан субресурсу масштабування.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>replicas</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>replicas є фактичною кількістю спостережуваних екземплярів масштабованого обʼєкта.</td>
    </tr>
    <tr>
      <td><code>selector</code><br/><em>string</em></td>
      <td>selector є запитом міток для подів, які повинні відповідати кількості реплік. Це те саме, що і селектор міток, але у форматі рядка, щоб уникнути інспекції клієнтами. Рядок буде у тому ж форматі, що й синтаксис параметра запиту. Більше інформації про селектори міток: <a href="/uk/docs/concepts/overview/working-with-objects/labels/">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/</a></td>
    </tr>
  </tbody>
</table>
