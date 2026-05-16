---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference містить достатньо інформації для того, щоб дозволити вам переглядати або змінювати зазначений обʼєкт."
title: "ObjectReference"
weight: 8
auto_generated: false
---

`import "k8s.io/api/core/v1"`

ObjectReference містить достатньо інформації для того, щоб дозволити вам переглядати або змінювати зазначений обʼєкт.

---

- **apiVersion** (string)

  apiVersion — це версія API ресурсу, до якого вказує цей обʼєкт.

- **fieldPath** (string)

  Якщо потрібно посилатися на частину обʼєкта замість цілого обʼєкта, цей рядок повинен містити дійсне висловлення доступу до поля JSON/Go, наприклад, desiredState.manifest.containers[2]. Наприклад, якщо посилання на обʼєкт стосується контейнера у межах Podʼа, це прийме значення подібне: "spec.containers{name}" (де "name" вказує на імʼя контейнера, що спричинило подію), або якщо не вказано жодного імені контейнера "spec.containers[2]" (контейнер з індексом 2 у цьому Pod). Ця синтаксична конструкція вибрана лише для того, щоб мати деякий чітко визначений спосіб посилання на частину обʼєкта.

- **kind** (string)

  Тип посилання. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  Назва посилання. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

- **namespace** (string)

  Простір імен посилання. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/](/docs/concepts/overview/working-with-objects/namespaces/)

- **resourceVersion** (string)

  Конкретна resourceVersion, до якої здійснено це посилання, якщо така існує. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  UID посилання. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids](/docs/concepts/overview/working-with-objects/names/#uids)
