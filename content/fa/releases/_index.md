---
linktitle: تاریخچه انتشار
title: انتشارها
type: docs
layout: release-info
notoc: true
---
<!-- overview -->

پروژه کوبرنتیز شاخه‌های انتشار (release branches) را برای سه نسخه جزئی (minor) اخیر نگهداری می‌کند.
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
کوبرنتیز 1.19 و نسخه های جدید تر ان
[تقریباً ۱ سال پشتیبانی patch دارند](/releases/patch-releases/#support-period).
نسخه‌های 1.18 و قدیمی‌تر کوبرنتیز تقریباً به‌مدت ۹ ماه پشتیبانی اصلاحی (patch support) دریافت می‌کردند.

نسخه‌های کوبرنتیز به‌صورت زیر بیان می‌شوند: **x.y.z**,
که در آن **x** نسخه اصلی (major version)، **y** نسخه فرعی (minor version)، و **z** نسخه اصلاحی (patch version) است.
که از اصطلاحات [نسخه‌بندی معنایی](https://semver.org/) پیروی می‌کند.
[سیاست ناسازگاری نسخه‌ها](/releases/version-skew-policy/) اطلاعات بیشتر در سند سیاست ناسازگاری نسخه‌ها موجود است.
<!-- body -->

## تاریخچه انتشار

{{< release-data >}}

## انتشارهای پایان عمر

نسخه‌های قدیمی‌تر کوبرنتیز که دیگر نگهداری نمی‌شوند در زیر فهرست شده‌اند.

<details>
  <summary>انتشارهای پایان عمر</summary>
  {{< note >}}
  این انتشارها دیگر پشتیبانی نمی‌شوند و به‌روزرسانی‌های امنیتی یا رفع اشکال دریافت نمی‌کنند.
  اگر یکی از این انتشارها را اجرا می‌کنید، پروژه کوبرنتیز اکیداً توصیه می‌کند به یک [نسخه پشتیبانی‌شده](#تاریخچه-انتشار) ارتقا دهید.
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## انتشار آینده

نگاهی بیندازید به [زمان‌بندی](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
برای انتشار نسخه بعدی **{{< skew nextMinorVersion >}}** کوبرنتیز!

{{< note >}}
این لینک برنامه‌ریزی ممکن است در مراحل اولیه برنامه‌ریزی انتشار به‌طور موقت در دسترس نباشد.
برای آخرین به‌روزرسانی‌ها، [مخزن SIG Release](https://github.com/kubernetes/sig-release/tree/master/releases) را بررسی کنید.
{{< /note >}}

## منابع مفید

برای اطلاعات کلیدی درباره نقش‌ها و فرآیند انتشار، به منابع [تیم انتشار کوبرنتیز](https://github.com/kubernetes/sig-release/tree/master/release-team) مراجعه کنید.
