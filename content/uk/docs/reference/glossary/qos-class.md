---
title: Клас обслуговування QoS
id: qos-class
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  Клас обслуговування QoS (Quality of Service Class) надає можливість Kubernetes класифікувати Podʼи в кластері за кількома класами і приймати рішення щодо їх планування та виселення.

aka:
- QoS Class
tags:
- fundamental
- architecture
related:
 - pod
---

Клас обслуговування QoS (Quality of Service Class) надає можливість Kubernetes класифікувати Podʼи в кластері за кількома класами і приймати рішення щодо їх планування та виселення.

<!--more-->

Клас QoS Podʼа встановлюється під час створення на основі його налаштувань {{< glossary_tooltip text="ресурсів інфраструктури" term_id="infrastructure-resource" >}} (запити та обмеження). Класи QoS використовуються для прийняття рішень щодо планування та виселення Podʼів. Kubernetes може присвоїти один із таких класів QoS Podʼу: `Guaranteed`, `Burstable` або `BestEffort`.
