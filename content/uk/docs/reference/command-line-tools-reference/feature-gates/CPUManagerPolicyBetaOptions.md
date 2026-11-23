---
title: CPUManagerPolicyBetaOptions
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
---
Дозволяє тонко налаштовувати політики CPUManager, експериментальні, бета-опції якості. Ця функціональна можливість захищає *групу* опцій CPUManager, які мають рівень якості бета. Ця функціональна можливість ніколи не буде переведена у стабільну версію.
