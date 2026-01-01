---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases نگاشتی بین آدرس IP (فایل)و نام میزبان است که باید به پرونده hosts یک Pod تزریق شود.

aka:
tags:
- operation
---
 HostAliases نگاشتی بین آدرس IP و نام میزبان است که به پرونده hosts یک {{< glossary_tooltip text="Pod" term_id="pod" >}} تزریق می‌شود.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) یک لیست اختیاری از نام‌های میزبان و آدرس‌های IP است که در صورت مشخص شدن، به پرونده hosts Pod تزریق می‌شوند. این فقط برای Podهای غیر hostNetwork معتبر است.
