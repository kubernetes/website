---
linktitle: تاریخچه انتشار
title: انتشار ها
type: docs
layout: release-info
notoc: true
---
<!-- overview -->

پروژه Kubernetes شاخه‌های انتشار (release branches) را برای سه نسخه جزئی (minor) اخیر نگهداری می‌کند.
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 و نسخه های جدید تر ان
[تقریباً ۱ سال پشتیبانی دارند](/releases/patch-releases/#support-period).
نسخه‌های 1.18 و قدیمی‌تر Kubernetes تقریباً به‌مدت ۹ ماه پشتیبانی اصلاحی (patch support) دریافت می‌کردند.

نسخه‌های Kubernetes به‌صورت زیر بیان می‌شوند: **x.y.z**,
که در آن **x** نسخه اصلی (major version)، **y** نسخه فرعی (minor version)، و **z** نسخه اصلاحی (patch version) است.,
مطابق با اصطلاحات نسخه‌بندی معنایی [Semantic Versioning](https://semver.org/).

[سیاست ناسازگاری نسخه‌ها](/releases/version-skew-policy/)اطلاعات بیشتر در سند سیاست ناسازگاری نسخه‌ها موجود است.
<!-- body -->

## تاریخجه انتشار

{{< release-data >}}

## انتشار اینده

نگاهی بیندازید به[برنامه ریزی](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
برای انتشار نسخه بعدی **{{< skew nextMinorVersion >}}** کوبرنتیز!
## منابع مفید

برای اطلاعات کلیدی درباره نقش‌ها و فرآیند انتشار[به منابع تیم انتشار Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)، به منابع تیم انتشار Kubernetes مراجعه کنید.