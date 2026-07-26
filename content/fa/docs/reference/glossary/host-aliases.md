---
title: HostAliases
id: HostAliases
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases نگاشتی بین آدرس IP و نام میزبان است که باید به فایل hosts یک پاد تزریق شود.

aka:
tags:
- operation
---
 HostAliases نگاشتی بین آدرس IP و نام میزبان است که به فایل hosts یک {{< glossary_tooltip text="پاد" term_id="pod" >}} تزریق می‌شود.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) یک لیست اختیاری از نام‌های میزبان و آدرس‌های IP است که در صورت مشخص شدن، به فایل hosts پاد تزریق می‌شوند. این فقط برای پادهای غیر hostNetwork معتبر است.
