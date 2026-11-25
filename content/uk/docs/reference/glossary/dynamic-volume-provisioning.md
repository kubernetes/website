---
title: Динамічне надання томів
id: dynamicvolumeprovisioning
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  Дозволяє користувачам запитувати автоматичне створення томів сховища.

aka:
- Dynamic Volume Provisioning
tags:
- storage
---

Дозволяє користувачам запитувати автоматичне створення {{< glossary_tooltip text="томів" term_id="volume" >}} сховища.

<!--more-->

Динамічне надання усуває потребу адміністраторів кластера заздалегідь надавати сховище. Натомість сховище надається автоматично за запитом користувача. Динамічне надання томів ґрунтується на обʼєкті API {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, який посилається на {{< glossary_tooltip text="втулок тому" term_id="volume-plugin" >}}, що надає {{< glossary_tooltip text="том" term_id="volume" >}}, і на набір параметрів, які передаються втулку тому.
