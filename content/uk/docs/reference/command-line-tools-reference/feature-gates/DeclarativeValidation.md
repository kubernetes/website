---
title: DeclarativeValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

Вмикає декларативну валідацію внутрішніх API Kubernetes. Якщо увімкнено, для API з правилами декларативної перевірки (визначеними за допомогою IDL-теґів у коді Go) буде виконано як згенерований код декларативної перевірки, так і оригінальний код перевірки, написаний вручну. Результати порівнюються, і про будь-які розбіжності повідомляється за допомогою метрики `declarative_validation_mismatch_total`. Користувачеві повертається лише результат валідації, написаний вручну (наприклад: фактична валідація у шляху запиту). Оригінальна рукописна перевірка залишається авторитетною перевіркою, коли її увімкнено, але це можна змінити, якщо увімкнути функціональну можливість [DeclarativeValidationTakeover](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover/) на додачу до цієї. Цzя функціональна можливість працює лише на `kube-apiserver`.
