---
title: Динамічне створення томів сховища
id: dynamicvolumeprovisioning
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  Дозволяє користувачам автоматично створювати томи сховища за запитом.

aka:
- Dynamic Volume Provisioning
tags:
- storage
---

Дозволяє користувачам автоматично створювати {{< glossary_tooltip text="Томи" term_id="volume" >}} сховища за запитом.

<!--more-->

Динамічне створення томів усуває потребу в адміністраторів кластерів у попередньому їх створені. Замість цього сховища автоматично створюються за запитом користувача. Динамічне створення томів ґрунтується на обʼєкті API, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, який посилається на {{< glossary_tooltip text="втулок тому" term_id="volume-plugin" >}}, що створює {{< glossary_tooltip text="Том" term_id="volume" >}}, та набір параметрів для передачі до втулка тому.
