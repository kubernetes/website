---
title: Sidecar контейнер
id: sidecar-container
full_link: /docs/concepts/workloads/pods/sidecar-containers/
short_description: >
  Допоміжний контейнер, який працює впродовж усього життєвого циклу Podʼа.
tags:
- fundamental
---

Один чи кілька {{< glossary_tooltip text="контейнерів" term_id="container" >}}, які зазвичай запускаються раніше за будь-які контейнери застосунків.

<!--more-->

Sidecar контейнери схожі на звичайні контейнери застосунків, але вони мають інше призначення: sidecar контейнер надає основному контейнеру застосунку сервіс, локальний для Podʼа. На відміну від {{< glossary_tooltip text="контейнерів ініціалізації" term_id="init-container" >}}, sidecar контейнери продовжують виконуватися після запуску Podʼа.

Докладніше дивіться [Sidecar контейнери](/docs/concepts/workloads/pods/sidecar-containers/).
