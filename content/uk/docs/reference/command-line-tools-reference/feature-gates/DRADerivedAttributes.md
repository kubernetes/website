---
title: DRADerivedAttributes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає `derivedAttributes` у динамічному виділенні ресурсів (DRA), дозволяючи авторам ResourceClaim та ResourceClaimTemplate обчислювати віртуальні атрибути пристроїв за допомогою виразів CEL для кожного пристрою, для використання в обмеженнях `matchAttribute` та `distinctAttribute`.

Для отримання додаткової інформації див. [Похідні атрибути](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes) у документації обʼєктів API DRA.
