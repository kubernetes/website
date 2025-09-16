---
title: بازبینی برای تأییدکنندگان و بازبین‌ها
linktitle: برای تأییدکنندگان و بازبین‌ها
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

بازبین‌ها ([Reviewers](/docs/contribute/participate/#reviewers)) و
تأییدکنندگان ([Approvers](/docs/contribute/participate/#approvers)) در SIG Docs
هنگام بازبینی یک تغییر چند کار اضافه نیز انجام می‌دهند.

هر هفته یکی از تأییدکنندگان مستندات (docs approver) داوطلب می‌شود تا Pull Requestها را تریاژ (triage) و بازبینی کند.
این فرد در آن هفته "PR Wrangler" است. برای اطلاعات بیشتر، به
[زمان‌بندی PR Wrangler](https://github.com/kubernetes/website/wiki/PR-Wranglers) مراجعه کنید.
برای تبدیل شدن به PR Wrangler، در نشست هفتگی SIG Docs شرکت کنید و داوطلب شوید.
حتی اگر در برنامهٔ همین هفته نام شما نیست، هنوز هم می‌توانید Pull Requestهایی (PRها) را که در حال حاضر تحت بازبینی فعال نیستند، بررسی کنید.

علاوه بر چرخشی بودن، یک بات بازبین‌ها و تأییدکنندگان PR را بر اساس مالکیت فایل (پرونده)‌های تحت تأثیر تعیین می‌کند.

<!-- body -->

## بازبینی یک PR

مستندات کوبرنتیز از
[فرآیند بازبینی کد کوبرنتیز](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)
پیروی می‌کند.

هر آنچه در [بازبینی یک Pull Request](/docs/contribute/review/reviewing-prs) آمده است صدق می‌کند،
اما بازبین‌ها و تأییدکنندگان باید کارهای زیر را نیز انجام دهند:

- استفاده از دستور Prow `/assign` برای اختصاص دادن یک بازبین مشخص به یک Pull Request در صورت نیاز. این کار به‌ویژه زمانی اهمیت بیشتری دارد که نیاز به درخواست بازبینی فنی از مشارکت‌کنندگان کد باشد.

  {{< note >}}
  به فیلد `reviewers` در front-matter بالای فایل (پرونده) Markdown نگاه کنید تا ببینید چه کسی می‌تواند بازبینی فنی انجام دهد.
  {{< /note >}}

- اطمینان از اینکه PR مطابق با [راهنمای محتوا](/docs/contribute/style/content-guide/) و [راهنمای سبک](/docs/contribute/style/style-guide/) است؛
  اگر این‌طور نیست، نویسنده را به بخش مربوطه در راهنما(ها) ارجاع دهید.
- استفاده از گزینه **Request Changes** در GitHub در صورت لزوم برای پیشنهاد تغییر به نویسنده PR.
- تغییر وضعیت بازبینی خود در GitHub با استفاده از دستورات Prow `/approve` یا `/lgtm`  
  اگر پیشنهادهای شما اعمال شده‌اند.

## commit در PR شخص دیگر

گذاشتن نظر در PR مفید است، اما گاهی ممکن است لازم باشد در Pull Request شخص دیگری commit کنید.

هرگز کار شخص دیگری را «به‌دست نگیرید» مگر اینکه خود او صراحتاً درخواست کرده باشد
یا قصد داشته باشید یک PR قدیمی و رهاشده را احیا کنید.
گرچه این کار ممکن است در کوتاه‌مدت سریع‌تر باشد، اما فرصت مشارکت را از آن فرد می‌گیرد.

روش کار بستگی دارد به اینکه آیا نیاز دارید فایلی (پرونده‌ای) را ویرایش کنید که در دامنهٔ PR است
یا فایلی (پرونده‌ای) را که هنوز در آن PR تغییری نکرده است.

شما نمی‌توانید در PR شخص دیگر commit کنید اگر یکی از شرایط زیر برقرار باشد:

- اگر نویسنده PR شاخه (branch) خود را مستقیماً به مخزن
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  پوش کرده باشد. تنها بازبینی‌کننده‌ای با دسترسی push می‌تواند در PR کاربر دیگر commit کند.

  {{< note >}}
  نویسنده را تشویق کنید دفعه بعد شاخه خود را در fork شخصی بسازد و سپس PR باز کند.
  {{< /note >}}

- نویسنده PR به‌صراحت ویرایش توسط تأییدکنندگان را غیرفعال کرده باشد.

## دستورات Prow برای بازبینی

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
سیستم CI/CD مبتنی بر کوبرنتیز است که روی Pull Requestها اجرا می‌شود.  
Prow امکان استفاده از دستورات شبیه به چت‌بات را فراهم می‌کند تا کارهای GitHub مانند [افزودن یا حذف برچسب‌ها](#افزودن-و-حذف-برچسب-های-issue)، بستن Issueها و تعیین تاییدکنندگان را مدیریت کند.  
دستورات Prow به‌صورت کامنت در GitHub و با فرمت `/<command-name>` نوشته می‌شوند.

رایج‌ترین دستورات Prow برای بازبین‌ها و تأییدکنندگان عبارتند از:

{{< table caption="دستورات Prow برای بازبینی" >}}
دستور Prow | محدودیت نقش | توضیحات
:-----------|:------------|:----------
`/lgtm` | اعضای سازمان | نشان می‌دهد بازبینی شما تمام شده و از تغییرات راضی هستید.
`/approve` | تایید کنندگان | PR را برای ادغام تأیید می‌کند.
`/assign` | همه | شخصی را برای بازبینی یا تأیید PR تعیین می‌کند.
`/close` | اعضای سازمان | یک Issue یا PR را می‌بندد.
`/hold` | همه | برچسب `do-not-merge/hold` را اضافه می‌کند و مانع ادغام خودکار PR می‌شود.
`/hold cancel` | همه | برچسب `do-not-merge/hold` را حذف می‌کند.
{{< /table >}}

برای دیدن لیست کامل دستورات قابل استفاده در PR، به
[Prow مرجع دستورات](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite) مراجعه کنید.

## دسته‌بندی و اولویت‌بندی Issueها

به‌طور کلی، SIG Docs از فرآیند
[تریاژ Issueها در کوبرنتیز](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
پیروی می‌کند و از همان برچسب‌ها استفاده می‌کند.

این [فیلتر](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
در GitHub، فهرستی از issueها را پیدا می‌کند که ممکن است به تریاژ نیاز داشته باشند.

### Triage یک Issue

1. اعتبارسنجی Issue

   - مطمئن شوید که Issue مربوط به مستندات وب‌سایت است. برخی Issueها با پاسخ سریع یا ارجاع بسته می‌شوند.  
     (به بخش [درخواست‌های پشتیبانی یا گزارش باگ کد](#درخواست-های-پشتیبانی-یا-گزارش-باگ-کد) مراجعه کنید.)
   - بررسی کنید که Issue ارزش پیگیری دارد یا نه.
   - اگر Issue جزئیات کافی ندارد یا قالب به‌درستی پر نشده، برچسب `triage/needs-information` اضافه کنید.
   - اگر Issue هم `lifecycle/stale` و هم `triage/needs-information` دارد، آن را ببندید.

2. افزودن برچسب اولویت (برای جزئیات کامل به
   [دستورالعمل‌های تریاژ Issue‌ها](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority) مراجعه کنید)

{{< table caption="برچسب‌های Issue" >}}
برچسب | توضیحات
:------------|:------------------
`priority/critical-urgent` | همین حالا انجام دهید.
`priority/important-soon` | ظرف ۳ ماه انجام دهید.
`priority/important-longterm` | ظرف ۶ ماه انجام دهید.
`priority/backlog` | قابل تعویق نامحدود؛ هر زمان منابع در دسترس بود انجام دهید.
`priority/awaiting-more-evidence` | نگه‌دارنده یک Issue بالقوه خوب تا گم نشود.
`help` یا `good first issue` | مناسب برای کسی با تجربه بسیار کم در کوبرنتیز یا SIG Docs. برای اطلاعات بیش‌تر، [Help Wanted و Good First Issue](https://kubernetes.dev/docs/guide/help-wanted/) را ببینید.
{{< /table >}}

در صورت صلاحدید، مالکیت یک Issue را بر عهده بگیرید و برای آن PR ارسال کنید
(به‌ویژه اگر سریع انجام می‌شود یا مرتبط با کاری است که همین حالا انجام می‌دهید).

اگر درباره تریاژ یک Issue پرسشی داشتید، در کانال `#sig-docs` در Slack یا
[لیست ایمیل kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) بپرسید.

## افزودن و حذف برچسب های Issue

برای افزودن برچسب، یکی از قالب‌های زیر را در کامنت بگذارید:

- `/<label-to-add>` (مثال: `/good-first-issue`)
- `/<label-category> <label-to-add>` (مثال: `/triage needs-information` یا `/language ja`)

برای حذف برچسب:

- `/remove-<label-to-remove>` (مثال: `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (مثال: `/remove-triage needs-information`)

در هر دو حالت، برچسب باید از قبل وجود داشته باشد. اگر تلاش کنید برچسبی که وجود ندارد را اضافه کنید، فرمان بدون پیام نادیده گرفته می‌شود.

لیست همه برچسب‌ها در بخش [برچسب‌های مخزن وب‌سایت](https://github.com/kubernetes/website/labels) موجود است.
همه برچسب‌ها توسط SIG Docs استفاده نمی‌شوند.

### برچسب‌های چرخه عمر Issue

Issueها معمولاً به‌سرعت باز و بسته می‌شوند. بااین‌حال، گاهی یک Issue پس از باز شدن غیرفعال می‌شود و گاهی لازم است بیش از ۹۰ روز باز بماند.

{{< table caption="برچسب‌های چرخه عمر Issue" >}}
برچسب | توضیحات
:------------|:------------------
`lifecycle/stale` | پس از ۹۰ روز بدون فعالیت، Issue به‌طور خودکار با این برچسب علامت‌گذاری می‌شود. اگر چرخه عمر به‌صورت دستی با فرمان `/remove-lifecycle stale` برگردانده نشود، Issue خودکار بسته خواهد شد.
`lifecycle/frozen` | Issue دارای این برچسب پس از ۹۰ روز غیرفعال شدن منقضی نمی‌شود. کاربر این برچسب را دستی برای Issueهایی اضافه می‌کند که باید مدت‌زمان بسیار طولانی‌تری باز بمانند، مانند آن‌هایی که برچسب `priority/important-longterm` دارند.
{{< /table >}}

## مدیریت انواع خاص Issueها

SIG Docs به‌اندازه‌ای با انواع زیر از Issue مواجه می‌شود که لازم است شیوه رسیدگی به آن‌ها مستند شود.

### Issueهای تکراری

اگر یک مشکل واحد بیش از یک Issue باز دارد، آن‌ها را در یک Issue ادغام کنید.
تصمیم بگیرید کدام Issue باز بماند (یا یک Issue جدید باز کنید)، سپس تمام اطلاعات مرتبط را منتقل کرده و Issueهای مرتبط را پیوند کنید.
در نهایت، به همه Issueهای دیگر که همان مشکل را توصیف می‌کنند برچسب `triage/duplicate` بزنید و آن‌ها را ببندید. داشتن یک Issue منفرد، سردرگمی را کاهش می‌دهد و از دوباره‌کاری جلوگیری می‌کند.

### Issueهای مربوط به پیوند‌های خراب

اگر Issue پیوند مرده در مستندات API یا `kubectl` است، تا زمانی که مشکل کاملاً درک شود به آن برچسب `/priority critical-urgent` بدهید.  
به تمام Issueهای پیوند مرده دیگر برچسب `/priority important-longterm` بدهید، چون باید به‌صورت دستی رفع شوند.

### Issueهای وب‌نوشت (blog)

انتظار می‌رود [مطالب وب‌نوشت (blog) کوبرنتیز](/blog/) با گذر زمان قدیمی شوند؛ بنابراین فقط مطالب کمتر از یک‌سال را نگه‌داری می‌کنیم.  
اگر Issue مربوط به مطلبی قدیمی‌تر از یک سال است، معمولاً باید Issue را بدون رفع ببندید.

می‌توانید هنگام بستن PR، پیوندی به
[به‌روزرسانی و نگه‌داری مقاله](/docs/contribute/blog/#maintenance)
بفرستید.

در صورت وجود توجیه مناسب، ایجاد استثنا اشکالی ندارد.

### درخواست های پشتیبانی یا گزارش باگ کد

برخی از Issueهای مربوط به مستندات در واقع به کد اصلی مربوط می‌شوند یا درخواست کمک هستند،
برای مثال زمانی که یک آموزش (tutorial) درست کار نمی‌کند.
برای Issueهایی که به مستندات مربوط نیستند، آن‌ها را با برچسب `kind/support` ببندید
و در یک کامنت، درخواست‌کننده را به کانال‌های پشتیبانی دیگر (مانند Slack یا Stack Overflow) راهنمایی کنید.
اگر Issue مربوط به باگ در یک قابلیت باشد، درخواست‌کننده را به مخزن مرتبط هدایت کنید
(مخزن `kubernetes/kubernetes` نقطهٔ شروع مناسبی است).

نمونه پاسخ به درخواست پشتیبانی:

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

نمونه پاسخ به گزارش باگ کد:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### squash کردن (Squashing)

به‌عنوان یک تأییدکننده، هنگام بازبینی Pull Requestها (PRها) ممکن است در شرایط مختلف یکی از کارهای زیر را انجام دهید:

- به مشارکت‌کننده توصیه کنید commit‌هایش را squash کند.
- commit‌ها را به‌جای مشارکت‌کننده squash کنید.
- به مشارکت‌کننده توصیه کنید هنوز squash نکند.
- مانع از squash شدن شوید.

**توصیه به مشارکت‌کنندگان برای squash**: یک مشارکت‌کننده تازه‌وارد ممکن است نداند که باید commit‌هایش را در PR squash کند. در این صورت، او را راهنمایی کنید، پیوندهای مفید در اختیارش بگذارید و در صورت نیاز پیشنهاد کمک بدهید. چند پیوند مفید:

- [باز کردن Pull Request و squash commit‌ها](/docs/contribute/new-content/open-a-pr#squashing-commits) برای مشارکت‌کنندگان مستندات
- [گردش کار GitHub](https://www.k8s.dev/docs/guide/github-workflow/) (شامل نمودارها) برای توسعه‌دهندگان

**squash commit برای مشارکت‌کنندگان**: اگر مشارکت‌کننده ممکن است در squash کردن مشکل داشته باشد یا فشار زمانی برای ادغام PR وجود دارد، می‌توانید squash را برای او انجام دهید:

- مخزن `kubernetes/website`
  [برای اجازه squash هنگام ادغام PR پیکربندی شده است](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests). کافی است دکمه _Squash commits_ را بزنید.
- در یک PR، اگر مشارکت‌کننده اجازهٔ مدیریت PR را به نگه‌دارندگان (maintainers) بدهد،
  می‌توانید commit‌های او را squash کنید و fork او را با نتیجهٔ نهایی به‌روزرسانی نمایید.
  پیش از انجام squash، به او توصیه کنید آخرین تغییرات خود را ذخیره کرده و به PR پوش کند.
  پس از squash نیز به او بگویید commit squash‌ شده را به کلون محلی خود pull کند.

- همچنین می‌توانید با استفاده از یک برچسب (label) کاری کنید که GitHub commit‌ها را squash کند،
  به‌طوری که Tide / GitHub این کار را انجام دهند؛
  یا هنگام ادغام PR روی دکمهٔ _Squash commits_ کلیک کنید.

**توصیه برای پرهیز از squash**

- اگر یک commit تغییرات خراب‌کننده یا نادرستی انجام داده باشد و commit آخر برای بازگرداندن (revert) آن خطا باشد،
  در این حالت commit‌ها را squash نکنید.
  حتی اگر در تب "Files changed" در PR در GitHub و در پیش‌نمایش Netlify همه‌چیز درست به‌نظر برسد،
  ادغام چنین PRی می‌تواند برای دیگر مشارکت‌کنندگان باعث ایجاد conflict در rebase یا merge شود.
  در چنین شرایطی، متناسب با صلاح‌دید خود مداخله کنید تا از ایجاد مشکل برای دیگر مشارکت‌کنندگان جلوگیری شود.

**هرگز squash نکنید**

اگر در حال راه‌اندازی یک بومی‌سازی (localization) یا انتشار مستندات برای یک نسخهٔ جدید هستید،
در این حالت شاخه‌ای را ادغام می‌کنید که از fork یک کاربر نیست؛
در چنین شرایطی هرگز commit‌ها را squash نکنید.
عدم squash در اینجا ضروری است زیرا باید تاریخچهٔ کامل commit‌ها برای آن فایل (پرونده)‌ها حفظ شود.
