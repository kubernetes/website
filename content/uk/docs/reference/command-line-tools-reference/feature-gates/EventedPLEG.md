---
title: EventedPLEG
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
Вмикає підтримку kubelet для отримання подій життєвого циклу контейнера з {{< glossary_tooltip text="container runtime" term_id="container-runtime">}} через розширення до {{<glossary_tooltip term_id="cri" text="CRI">}}. (PLEG, скорочення від "Pod lifecycle event generator" — генератор подій життєвого циклу Pod). Щоб ця функція була корисною, вам також потрібно увімкнути підтримку подій життєвого циклу контейнера у кожному середовищі виконання контейнерів, що працює у вашому кластері. Якщо середовище виконання контейнера не оголошує про підтримку подій життєвого циклу контейнера, то kubelet автоматично перемикається на застарілий загальний механізм PLEG, навіть якщо ви увімкнули цю функціональну можливість.
