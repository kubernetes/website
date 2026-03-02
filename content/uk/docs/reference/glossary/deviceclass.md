---
title: DeviceClass
id: deviceclass
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  Категорія пристроїв у кластері. Користувачі можуть запитувати певні пристрої з класу DeviceClass.
tags:
- extension
---

Категорія {{< glossary_tooltip text="пристроїв" term_id="device" >}} у кластері, яка може використовуватися з динамічним виділенням ресурсів (DRA).

<!--more-->

Адміністратори або власники пристроїв використовують DeviceClasses для визначення набору пристроїв, які можуть бути запитані та використані в робочих навантаженнях. Пристрої запитуються шляхом створення {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, які фільтруються за конкретними параметрами пристроїв у класі DeviceClass.

Для отримання додаткової інформації див. [Динамічне виділення ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)
