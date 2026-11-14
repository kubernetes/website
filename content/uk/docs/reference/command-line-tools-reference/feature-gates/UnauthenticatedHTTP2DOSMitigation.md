---
title: UnauthenticatedHTTP2DOSMitigation
content_type: feature_gate
_build:
  list: never
  render: false
 
stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29" 
---
Вмикає помʼякшення наслідків відмови в обслуговуванні (DoS) HTTP/2 для неавтентифікованих клієнтів. У версіях Kubernetes від 1.28.0 до 1.28.2 ця функціональна можливість відсутня.
