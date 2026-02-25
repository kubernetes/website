---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "Status"
content_type: "api_reference"
description: "Status — це значення, що повертається для викликів, які не повертають інших обʼєктів."
title: "Status"
weight: 12
auto_generated: false
---

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

Status — це значення, що повертається для викликів, які не повертають інших обʼєктів.

---

- **apiVersion** (string)

  APIVersion визначає версійну схему цього представлення обʼєкта. Сервери повинні конвертувати визнані схеми до останнього внутрішнього значення, і можуть відхиляти невизнані значення. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **code** (int32)

  Рекомендований HTTP-код відповіді для цього статусу, 0, якщо не встановлено.

- **details** (StatusDetails)

  Розширені дані, повʼязані з причиною. Кожна причина може визначити свої власні розширені деталі. Це поле є необовʼязковим, і дані, що повертаються, не гарантовано відповідають будь-якій схемі, крім тієї, що визначена типом причини.

  <a name="StatusDetails"></a>
  *StatusDetails — це набір додаткових властивостей, які МОЖУТЬ бути встановлені сервером для надання додаткової інформації про відповідь. Поле Reason обʼєкта Status визначає, які атрибути будуть встановлені. Клієнти повинні ігнорувати поля, які не відповідають визначеному типу кожного атрибута, і повинні припускати, що будь-який атрибут може бути порожнім, недійсним або невизначеним.*

  - **details.causes** ([]StatusCause)

    *Atommic: буде замінено під час злиття*

    Масив Causes містить додаткові деталі, повʼязані з невдачею StatusReason. Не всі StatusReasons можуть надавати детальні причини.

    <a name="StatusCause"></a>
    *StatusCause надає додаткову інформацію про невдачу api.Status, включаючи випадки, коли зустрічаються декілька помилок.*

    - **details.causes.field** (string)

      Поле ресурсу, яке спричинило цю помилку, назване за його серіалізацією в JSON. Може містити крапку і постфіксну нотацію для вкладених атрибутів. Масиви індексуються починаючи з нуля. Поля можуть зʼявлятися більше одного разу в масиві причин через наявність кількох помилок в полях. Необовʼязкове.

        Приклади:
          "name" — поле "name" поточного ресурсу
          "items[0].name" — поле "name" першого елемента масиву у "items"

      - **details.causes.message** (string)

        Опис причини помилки, зрозумілий для людини. Це поле може бути представлене читачеві як є.

      - **details.causes.reason** (string)

        Машинозчитуваний опис причини помилки. Якщо це значення порожнє, інформація відсутня.

    - **details.group** (string)

      Атрибут групи ресурсу, повʼязаний зі статусом StatusReason.

    - **details.kind** (string)

      Атрибут kind ресурсу, повʼязаний зі статусом StatusReason. У деяких операціях він може відрізнятися від запитаного типу ресурсу. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

    - **details.name** (string)

      Атрибут name ресурсу, повʼязаний зі статусом StatusReason (коли є одне імʼя, яке можна описати).

    - **details.retryAfterSeconds** (int32)

      Якщо вказано, час у секундах до повторного виконання операції. Деякі помилки можуть вказувати, що клієнт повинен виконати альтернативну дію — для цих помилок це поле може показати, як довго чекати перед виконанням альтернативної дії.

    - **details.uid** (string)

      UID ресурсу. (коли є один ресурс, який можна описати). Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids](/docs/concepts/overview/working-with-objects/names#uids)

- **kind** (string)

  Kind — це рядкове значення, що представляє обʼєкт REST, який цей обʼєкт представляє. Сервери можуть виводити це з точки доступу, на який клієнт надсилає запити. Не може бути оновлено. У форматі CamelCase. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **message** (string)

  Зрозумілий для людини опис статусу цієї операції.

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **reason** (string)

  Машинозчитуваний опис того, чому ця операція має статус "Failure". Якщо це значення порожнє, немає доступної інформації. Причина уточнює HTTP-код стану, але не перевизначає його.

- **status** (string)

  Статус операції. Один із: "Success" або "Failure". Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
