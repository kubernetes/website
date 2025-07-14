---
title: دروازه‌های ویژگی
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
---

<!-- overview -->
این صفحه شامل مروری بر دروازه‌های ویژگی مختلفی است که یک مدیر می‌تواند در اجزای مختلف Kubernetes مشخص کند.

برای توضیح مراحل یک ویژگی، به [feature stages](#feature-stages) مراجعه کنید.

<!-- body -->
## Overview

دروازه‌های ویژگی مجموعه‌ای از جفت‌های key=value هستند که ویژگی‌های Kubernetes را توصیف می‌کنند.
شما می‌توانید این ویژگی‌ها را با استفاده از پرچم خط فرمان `--feature-gates` در هر کامپوننت Kubernetes فعال یا غیرفعال کنید.
هر کامپوننت Kubernetes به شما امکان می‌دهد مجموعه‌ای از دروازه‌های ویژگی را که مربوط به آن کامپوننت هستند فعال یا غیرفعال کنید.
از پرچم `-h` برای مشاهده مجموعه کاملی از دروازه‌های ویژگی برای همه کامپوننت‌ها استفاده کنید.
برای تنظیم دروازه‌های ویژگی برای یک کامپوننت، مانند kubelet، از پرچم `--feature-gates` که به لیستی از جفت‌های ویژگی اختصاص داده شده است، استفاده کنید:

```shell
--feature-gates=...,GracefulNodeShutdown=true
```

جداول زیر خلاصه‌ای از دروازه‌های ویژگی هستند که می‌توانید روی اجزای مختلف Kubernetes تنظیم کنید.

- ستون "Since" شامل انتشار Kubernetes هنگام معرفی یک ویژگی یا تغییر مرحله انتشار آن است.
- ستون "Until" اگر خالی نباشد، شامل آخرین انتشار Kubernetes است که در آن هنوز می‌توانید از یک دروازه ویژگی استفاده کنید.
- اگر یک ویژگی در حالت آلفا یا بتا باشد، می‌توانید ویژگی ذکر شده را در جدول [Alpha/Beta feature gate table](#feature-gates-for-alpha-or-beta-features). پیدا کنید.
- اگر یک ویژگی پایدار است، می‌توانید تمام مراحل آن ویژگی را که در جدول  [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features). ذکر شده است، پیدا کنید. - جدول [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features)

همچنین ویژگی‌های منسوخ‌شده و حذف‌شده را فهرست می‌کند.


{{< note >}}
برای مراجعه به دروازه‌های ویژگی قدیمی که حذف شده‌اند، لطفاً به [feature gates removed](/docs/reference/command-line-tools-reference/feature-gates-removed/). مراجعه کنید.
{{< /note >}}

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
### Feature gates for Alpha or Beta features

{{< feature-gate-table include="alpha,beta" caption="Feature gates for features in Alpha or Beta states" >}}

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
### Feature gates for graduated or deprecated features

{{< feature-gate-table include="ga,deprecated" caption="Feature Gates for Graduated or Deprecated Features" >}}

## Using a feature

### Feature stages


یک ویژگی می‌تواند در مرحله *Alpha*، *بتا* یا *GA* باشد.
یک ویژگی *Alpha* به معنای:


* به طور پیش‌فرض غیرفعال است.
* ممکن است دارای اشکال باشد. فعال کردن این ویژگی ممکن است اشکالات را آشکار کند.
* پشتیبانی از این ویژگی ممکن است در هر زمانی و بدون اطلاع قبلی قطع شود.
* ممکن است API در نسخه‌های بعدی نرم‌افزار بدون اطلاع قبلی به روش‌های ناسازگار تغییر کند.
* به دلیل افزایش خطر اشکالات و عدم پشتیبانی بلندمدت، فقط برای استفاده در خوشه‌های آزمایشی کوتاه‌مدت توصیه می‌شود.

یک ویژگی *Beta* به این معنی است:

* معمولاً به طور پیش‌فرض فعال است. گروه‌های API بتا [disabled by default](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default).
* این ویژگی به خوبی آزمایش شده است. فعال کردن این ویژگی ایمن تلقی می‌شود.
* پشتیبانی از این ویژگی به طور کلی قطع نخواهد شد، اگرچه جزئیات ممکن است تغییر کند.
*طرحواره و/یا معنای اشیاء ممکن است در نسخه بتا یا پایدار بعدی به روش‌های ناسازگار تغییر کند. وقتی این اتفاق بیفتد، ما دستورالعمل‌هایی برای مهاجرت به نسخه بعدی ارائه خواهیم داد. این ممکن است نیاز به حذف، ویرایش و ایجاد مجدد اشیاء API داشته باشد. فرآیند ویرایش ممکن است نیاز به کمی تفکر داشته باشد. این ممکن است نیاز به زمان از کار افتادن برنامه‌هایی که به این ویژگی متکی هستند، داشته باشد.
* به دلیل احتمال تغییرات ناسازگار در نسخه‌های بعدی، فقط برای کاربردهای غیر حیاتی تجاری توصیه می‌شود. اگر چندین کلاستر دارید که می‌توانند به طور مستقل ارتقا یابند، ممکن است بتوانید این محدودیت را کاهش دهید.

{{< note >}}
لطفاً ویژگی‌های *Beta* را امتحان کنید و در مورد آنها بازخورد دهید!
پس از خروج از نسخه بتا، ممکن است ایجاد تغییرات بیشتر برای ما عملی نباشد.

{{< /note >}}

یک ویژگی *General Availability* (GA) همچنین به عنوان یک ویژگی *stable* شناخته می‌شود. این به معنی:

* این ویژگی همیشه فعال است؛ شما نمی‌توانید آن را غیرفعال کنید.
* دیگر به گیت ویژگی مربوطه نیازی نیست
* نسخه‌های پایدار ویژگی‌ها در نرم‌افزار منتشر شده برای بسیاری از نسخه‌های بعدی ظاهر خواهند شد.

## List of feature gates {#feature-gates}

هر دروازه ویژگی برای فعال/غیرفعال کردن یک ویژگی خاص طراحی شده است.

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list include="alpha,beta,ga,deprecated" >}}

## {{% heading "whatsnext" %}}

* [deprecation policy](/docs/reference/using-api/deprecation-policy/) برای Kubernetes، رویکرد پروژه برای حذف ویژگی‌ها و اجزا را توضیح می‌دهد.
* از Kubernetes 1.24، APIهای بتای جدید به طور پیش‌فرض فعال نیستند. هنگام فعال کردن یک ویژگی بتا، باید منابع API مرتبط را نیز فعال کنید.
به عنوان مثال، برای فعال کردن یک منبع خاص مانند
`storage.k8s.io/v1beta1/csistoragecapacities`، `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities` را تنظیم کنید.
برای جزئیات بیشتر در مورد پرچم‌های خط فرمان، به [API Versioning](/docs/reference/using-api/#api-versioning) مراجعه کنید.
