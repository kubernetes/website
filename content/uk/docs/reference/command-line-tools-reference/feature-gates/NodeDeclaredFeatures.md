---
title: NodeDeclaredFeatures
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Дозволяє вузлам повідомляти про підтримувані функції через їх `.status`. Це дозволяє планувальнику та контролеру допуску запобігати операціям на вузлах, які не мають функцій, необхідних для подів. Див. [Функції, оголошені вузлом](/docs/concepts/scheduling-eviction/node-declared-features/).
