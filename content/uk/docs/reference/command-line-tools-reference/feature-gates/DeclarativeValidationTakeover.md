---
title: DeclarativeValidationTakeover
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---

Якщо увімкнено, разом з функціональною можливістю [DeclarativeValidation](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation/), помилки декларативної перевірки повертаються безпосередньо користувачеві, замінюючи помилки ручної перевірки для правил, які мають декларативну реалізацію. Якщо вимкнено (і увімкнено `DeclarativeValidation`), завжди повертаються помилки перевірки, написані вручну, що фактично переводить декларативну перевірку у режим перевірки __mismatch validation mode__, який відстежує відповіді API, але не впливає на них. Цей режим __mismatch validation mode__ дозволяє відстежувати метрики `declarative_validation_mismatch_total` та `declarative_validation_panic_total`, які є деталями реалізації для більш безпечного розгортання, пересічному користувачеві не потрібно взаємодіяти з ними безпосередньо. Ця функціональна можливість працює лише на `kube-apiserver`. Примітка: Хоча декларативна валідація має на меті функціональну еквівалентність з рукописною валідацією, точний опис повідомлень про помилки може відрізнятися між цими двома підходами.
