---
title: CPUManagerPolicyAlphaOptions
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
Дозволяє тонко налаштовувати політики CPUManager, експериментальні, альфа-опції якості. Ця функціональна можливість захищає *групу* опцій CPUManager, які мають рівень якості альфа. Ця функціональна можливість ніколи не буде переведена у бета-версію або стабільну версію.
