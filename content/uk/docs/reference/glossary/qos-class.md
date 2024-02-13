---
title: Клас обслуговування QoS
id: qos-class
date: 2019-04-15
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  Клас обслуговування QoS (Quality of Service Class) надає можливість Kubernetes класифікувати Podʼи в кластері в декілька класів і приймати рішення щодо їх планування та видалення.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod

---
Клас обслуговування QoS (Quality of Service Class) надає можливість Kubernetes класифікувати Podʼи в кластері в декілька класів і приймати рішення щодо їх планування та видалення.

<!--more--> 

Клас QoS Podʼа встановлюється під час створення на основі його налаштувань обчислювальних ресурсів (запити та обмеження). Класи QoS використовуються для прийняття рішень щодо планування та видалення Podʼів. Kubernetes може присвоїти один із наступних класів QoS Поду: `Guaranteed`, `Burstable` або `BestEffort`.
