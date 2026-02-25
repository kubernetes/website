---
title: CRDValidationRatcheting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---
Ввімкнути оновлення власних ресурсів, щоб вони містили порушення їхньої схеми OpenAPI, якщо частини ресурсу, що порушують оновлення не змінилися. Докладніші відомості наведено у статті [Проковзування валідації](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting).

