---
title: NodeDeclaredFeatures
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Дозволяє вузлам повідомляти про підтримувані функції через їх `.status`. Це дозволяє планувальнику та контролеру допуску запобігати операціям на вузлах, які не мають функцій, необхідних для подів. Див. [Функції, оголошені вузлом](/docs/concepts/scheduling-eviction/node-declared-features/).
