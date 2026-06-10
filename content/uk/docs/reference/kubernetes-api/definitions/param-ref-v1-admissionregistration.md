---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "ParamRef"
content_type: "api_reference"
description: "ParamRef описує, як знайти параметри, які будуть використані як вхідні дані для виразів правил, застосованих політикою."
title: "ParamRef"
weight: 350
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## ParamRef {#ParamRef}

ParamRef описує, як знайти параметри, які будуть використані як вхідні дані для виразів правил, застосованих політикою.

<hr>

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>name є ім’ям ресурсу, на який посилаються. Одне з полів <code>name</code> або <code>selector</code> повинно бути встановлено, але <code>name</code> і <code>selector</code> є взаємовиключними властивостями. Якщо одне встановлено, інше повинно бути скинуто. Один параметр, який використовується для всіх запитів на допуск, можна налаштувати, встановивши поле <code>name</code>, залишивши <code>selector</code> порожнім і встановивши namespace, якщо <code>paramKind</code> обмежений простором імен.</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>namespace є простором імен ресурсу, на який посилаються. Дозволяє обмежити пошук параметрів до конкретного простору імен. Застосовується до обох полів <code>name</code> і <code>selector</code>. Параметр для конкретного простору імен можна використовувати, вказавши <code>paramKind</code>, обмежений простором імен, у політиці та залишивши це поле порожнім.
      <ul>
        <li>Якщо <code>paramKind</code> обмежений кластером, це поле МАЄ бути скинуто. Встановлення цього поля призводить до помилки конфігурації.</li>
        <li>Якщо <code>paramKind</code> обмежений простором імен, простір імен об’єкта, що оцінюється для допуску, буде використано, коли це поле залишено порожнім. Будьте обережні, якщо це поле залишено порожнім, зв’язування не повинно відповідати жодним ресурсам, обмеженим кластером, що призведе до помилки.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>parameterNotFoundAction</code><br/><em>string</em></td>
      <td>parameterNotFoundAction контролює поведінку зв’язування, коли ресурс існує, а name або selector дійсні, але немає параметрів, що відповідають зв’язуванню. Якщо значення встановлено на <code>Allow</code>, то відсутність відповідних параметрів буде розглядатися як успішна перевірка зв’язування. Якщо встановлено на <code>Deny</code>, то відсутність відповідних параметрів підпадатиме під <code>failurePolicy</code> політики. Дозволені значення: <code>Allow</code> або <code>Deny</code>. Обов’язково.</td>
    </tr>
    <tr>
      <td><code>selector</code><br/><em><a href="{{< ref "label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>selector можна використовувати для порівняння кількох об’єктів param на основі їхніх міток. Вкажіть selector: {} для відповідності всім ресурсам ParamKind. Якщо знайдено кілька параметрів, вони всі оцінюються з виразами політики, а результати об’єднуються за допомогою AND. Одне з полів <code>name</code> або <code>selector</code> повинно бути встановлено, але <code>name</code> і <code>selector</code> є взаємовиключними властивостями. Якщо одне встановлено, інше повинно бути скинуто.</td>
    </tr>
  </tbody>
</table>
