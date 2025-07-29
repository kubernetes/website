---
title: نام‌های مستعار میزبان
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  یک HostAliases نگاشتی میان نشانی IP و نام میزبان است که در فایل hosts یک پاد تزریق می‌شود.

aka:
tags:
- operation
---
 یک HostAliases نگاشتی میان نشانی IP و نام میزبان است که در فایل hosts یک {{< glossary_tooltip text="Pod" term_id="pod" >}} تزریق می‌شود.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) فهرستی اختیاری از نام‌های میزبان و نشانی‌های IP است که در صورت مشخص‌شدن، در فایل hosts پاد تزریق می‌شود. این گزینه فقط برای پادهایی معتبر است که hostNetwork نیستند.
