---
title: ExperimentalHostUserNamespaceDefaulting
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.5"  
    toVersion: "1.27" 
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---
Дозволяє типово встановлювати простір імен користувача хосту. Призначено для контейнерів, які використовують інші простори імен хосту, монтування хосту або контейнерів, які мають привілеї чи використовують конкретні можливості, не привʼязані до простору імен, (наприклад, `MKNODE`, `SYS_MODULE` і т. д.). Слід вмикати лише у випадку, якщо перепризначення (remapping) просторів імен користувача увімкнено в демоні Docker.
