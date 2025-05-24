---
title: TopologyManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
Дозволяє тонке налаштування політик менеджера топології, експериментальні варіанти з бета-якістю. Ця функціональна можливість захищає *групу* параметрів менеджера топології, рівень якості яких є бета. Ця функціональна можливість ніколи не перейде до стабільної версії.
