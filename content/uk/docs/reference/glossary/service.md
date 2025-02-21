---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  Спосіб відкрити доступ до застосунку, що запущений на декількох Podʼах у вигляді мережевої служби.

tags:
- fundamental
- core-object
---

Метод надання доступу ззовні до мережевого застосунку, який працює як один чи кілька {{< glossary_tooltip text="Podʼів" term_id="pod" >}} у вашому кластері.

<!--more-->

Набір Podʼів, з якими працює Service, (зазвичай) визначається {{< glossary_tooltip text="селектором" term_id="selector" >}}. Якщо додаються чи видаляються деякі Podʼи, набір Podʼів, що відповідає селектору, буде змінено. Service переконується, що мережевий трафік може бути направлений на поточний набір Podʼів з робочим навантаженням.

Serviceʼи Kubernetes можуть використовувати IP-мережу (IPv4, IPv6 або обидві) або посилатися на зовнішнє імʼя в Domain Name System (DNS).

Абстракція Service дозволяє використовувати інші механізми, такі як Ingress та Gateway.
