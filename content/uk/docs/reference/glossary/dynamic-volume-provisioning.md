---
title: Динамічне створення томів сховища
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  Дозволяє користувачам автоматично створювати томи сховища за запитом.

aka: 
tags:
- core-object
- storage
---
Дозволяє користувачам автоматично створювати томи сховища за запитом.

<!--more--> 

Динамічне створення томів усуває потребу в адміністраторів кластерів у попередньому їх створені. Замість цього сховища автоматично створюються за запитом користувача. Динамічне створення томів ґрунтується на обʼєкті API, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, який посилається на {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}}, що створює {{< glossary_tooltip text="Volume" term_id="volume" >}}, та набір параметрів для передачі до Volume Plugin.
