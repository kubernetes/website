---
title: بازبینی برای تأییدکنندگان و بازبین‌ها
linktitle: برای تأییدکنندگان و بازبین‌ها
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

[SIG Docs](/docs/contribute/participate/#reviewers) **بازبین‌ها** و
[Approvers](/docs/contribute/participate/#approvers) **تأییدکنندگان** هنگام بازبینی یک تغییر، چند کار اضافی انجام می‌دهند.

هر هفته، یکی از تأییدکنندگان مستندات داوطلب می‌شود تا Pull Requestها را اولویت‌بندی و بازبینی کند.
این شخص «**PR Wrangler**» آن هفته است. برای اطلاعات بیش‌تر، به
[برنامه PR Wrangler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
نگاه کنید. برای تبدیل شدن به یک PR Wrangler، در جلسه هفتگی SIG Docs شرکت کنید و داوطلب شوید.
حتی اگر در برنامه این هفته نیستید، همچنان می‌توانید PRهایی را بازبینی کنید که در حال حاضر
بازبینی فعالی ندارند.

علاوه بر گردش کار هفتگی، یک ربات بر اساس فایل‌هایی که در PR تغییر کرده‌اند،
بازبین‌ها و تأییدکنندگان مناسب را تعیین می‌کند.

<!-- body -->

## بازبینی یک PR

مستندات Kubernetes از فرایند
[بازبینی کد Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)
پیروی می‌کند.

هر آنچه در
[بازبینی یک Pull Request](/docs/contribute/review/reviewing-prs)
توضیح داده شده صادق است، اما بازبین‌ها و تأییدکنندگان باید این کارها را نیز انجام دهند:

- در صورت نیاز با فرمان `/assign` یک بازبین مشخص را برای PR تعیین کنید.  
  این موضوع هنگام درخواست بازبینی فنی از مشارکت‌کنندگان کد بسیار مهم است.

  {{< note >}}
  برای مشاهده افرادی که می‌توانند بازبینی فنی انجام دهند، به فیلد `reviewers` در front-matter بالای فایل Markdown نگاه کنید.
  {{< /note >}}

- اطمینان حاصل کنید که PR با [راهنمای محتوا](/docs/contribute/style/content-guide/)
  و [راهنمای سبک](/docs/contribute/style/style-guide/) هماهنگ است؛ اگر نیست،
  پیوند بخش مربوطه راهنما را برای نویسنده بفرستید.
- در صورت لزوم از گزینه **Request Changes** در GitHub برای پیشنهاد تغییرات به نویسنده PR استفاده کنید.
- در صورتی که پیشنهادهای شما اعمال شد، وضعیت بازبینی خود را با فرمان‌های `/approve` یا `/lgtm`
  در GitHub به‌روزرسانی کنید.

## کامیت در PR فرد دیگر

گذاشتن کامنت در PR مفید است، اما گاهی لازم است مستقیماً در PR فرد دیگری کامیت کنید.

مگر آن‌که نویسنده PR صراحتاً از شما بخواهد یا بخواهید یک PR رهاشده طولانی را احیا کنید،
«در دست گرفتن» کار دیگران توصیه نمی‌شود؛ چون فرصت مشارکت را از آن فرد می‌گیرد.

روش کار شما بستگی دارد به اینکه آیا نیاز است فایلی را ویرایش کنید که در محدوده PR
هست یا فایلی که هنوز تغییر نکرده است.

اگر هر یک از شرایط زیر برقرار باشد، نمی‌توانید در PR شخص دیگری کامیت بزنید:

- نویسنده PR شعبه خود را مستقیماً در مخزن
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  ایجاد کرده باشد. تنها بازبینی‌کننده‌ای با دسترسی push می‌تواند در PR کاربر دیگری کامیت کند.

  {{< note >}}
  نویسنده را تشویق کنید دفعه بعد شعبه خود را در فورک شخصی بسازد و سپس PR باز کند.
  {{< /note >}}

- نویسنده PR به‌صراحت ویرایش توسط تأییدکنندگان را غیرفعال کرده باشد.

## فرمان‌های Prow برای بازبینی

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
سیستم CI/CD مبتنی بر Kubernetes است که وظایف مرتبط با PRها را اجرا می‌کند.
Prow فرمان‌های شبیه‌چت را برای انجام عملیات GitHub در سراسر سازمان Kubernetes فعال می‌کند؛
مانند [افزودن و حذف برچسب‌ها](#adding-and-removing-issue-labels)، بستن issueها
و اختصاص تأییدکننده. فرمان‌های Prow را به‌صورت کامنت GitHub و با قالب `/<command-name>` وارد کنید.

{{< table caption="دستورات Prow برای بازبینی" >}}
فرمان Prow | محدودیت نقش | توضیحات
:-----------|:------------|:----------
`/lgtm` | اعضای سازمان | نشان می‌دهد بازبینی شما تمام شده و از تغییرات راضی هستید.
`/approve` | تأییدکنندگان | یک PR را برای ادغام تأیید می‌کند.
`/assign` | همه | فردی را برای بازبینی یا تأیید یک PR تعیین می‌کند.
`/close` | اعضای سازمان | یک issue یا PR را می‌بندد.
`/hold` | همه | برچسب `do-not-merge/hold` را اضافه می‌کند تا PR به‌طور خودکار ادغام نشود.
`/hold cancel` | همه | برچسب `do-not-merge/hold` را حذف می‌کند.
{{< /table >}}

برای مشاهده فرمان‌هایی که در یک PR می‌توانید استفاده کنید، به
[مرجع فرمان‌های Prow](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite) مراجعه کنید.

## دسته‌بندی و تریاژ issueها

به‌طور کلی، SIG Docs از فرایند
[تریاژ issueهای Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
پیروی می‌کند و از همان برچسب‌ها استفاده می‌کند.

این [فیلتر](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
در GitHub issueهایی را پیدا می‌کند که ممکن است به تریاژ نیاز داشته باشند.

### تریاژ یک Issue

1. اعتبارسنجی Issue

   - مطمئن شوید موضوع درباره مستندات وب‌سایت است. برخی Issueها را می‌توان با پاسخ به یک پرسش یا ارجاع گزارش‌کننده به یک منبع به‌سرعت بست. برای جزئیات، بخش [درخواست پشتیبانی یا گزارش باگ کد](#support-requests-or-code-bug-reports) را ببینید.  
   - ارزیابی کنید آیا Issue ارزش رسیدگی دارد یا نه.  
   - اگر Issue جزئیات کافی برای اقدام ندارد یا الگو به‌درستی پر نشده است، برچسب `triage/needs-information` را اضافه کنید.  
   - اگر Issue هم برچسب `lifecycle/stale` و هم `triage/needs-information` را دارد، آن را ببندید.

2. افزودن یک برچسب اولویت (راهنمای
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   برچسب‌های اولویت را با جزئیات شرح می‌دهد)

  {{< table caption="برچسب‌های Issue" >}}
  برچسب | توضیح
  :------------|:------------------
  `priority/critical-urgent` | همین حالا انجام دهید.
  `priority/important-soon` | ظرف ۳ ماه انجام دهید.
  `priority/important-longterm` | ظرف ۶ ماه انجام دهید.
  `priority/backlog` | قابل تعویق نامحدود؛ هر زمان منابع در دسترس بود انجام دهید.
  `priority/awaiting-more-evidence` | نگه‌دارنده یک Issue بالقوه خوب تا گم نشود.
  `help` یا `good first issue` | مناسب برای کسی با تجربه بسیار کم در Kubernetes یا SIG Docs. برای اطلاعات بیش‌تر، [Help Wanted و Good First Issue](https://kubernetes.dev/docs/guide/help-wanted/) را ببینید.
  {{< /table >}}

  در صورت صلاحدید، مالکیت یک Issue را بر عهده بگیرید و برای آن PR ارسال کنید
  (به‌ویژه اگر سریع انجام می‌شود یا مرتبط با کاری است که همین حالا انجام می‌دهید).

اگر درباره تریاژ Issue سؤالی دارید، در Slack کانال `#sig-docs` یا
لیست پستی [kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) بپرسید.

## افزودن و حذف برچسب Issue

برای افزودن برچسب، یک کامنت با یکی از قالب‌های زیر بگذارید:

- `/<label-to-add>` (مثلاً: `/good-first-issue`)
- `/<label-category> <label-to-add>` (مثلاً: `/triage needs-information` یا `/language ja`)

برای حذف برچسب، یک کامنت با یکی از قالب‌های زیر بگذارید:

- `/remove-<label-to-remove>` (مثلاً: `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (مثلاً: `/remove-triage needs-information`)

در هر دو حالت، برچسب باید از قبل وجود داشته باشد. اگر برچسبی که وجود ندارد را اضافه کنید، فرمان بدون پیام نادیده گرفته می‌شود.

برای فهرست کامل برچسب‌ها، بخش **Labels** مخزن [website](https://github.com/kubernetes/website/labels) را ببینید. همه برچسب‌ها توسط SIG Docs استفاده نمی‌شوند.

### برچسب‌های چرخه عمر Issue

Issueها معمولاً به‌سرعت باز و بسته می‌شوند.  
بااین‌حال، گاهی یک Issue پس از باز شدن غیرفعال می‌شود و گاهی لازم است بیش از ۹۰ روز باز بماند.

{{< table caption="برچسب‌های چرخه عمر Issue" >}}
برچسب | توضیح
:------------|:------------------
`lifecycle/stale` | پس از ۹۰ روز بدون فعالیت، Issue به‌طور خودکار با این برچسب علامت‌گذاری می‌شود. اگر چرخه عمر به‌صورت دستی با فرمان `/remove-lifecycle stale` برگردانده نشود، Issue خودکار بسته خواهد شد.
`lifecycle/frozen` | Issue دارای این برچسب پس از ۹۰ روز غیرفعال شدن منقضی نمی‌شود. کاربر این برچسب را دستی برای Issueهایی اضافه می‌کند که باید مدت‌زمان بسیار طولانی‌تری باز بمانند، مانند آن‌هایی که برچسب `priority/important-longterm` دارند.
{{< /table >}}

## رسیدگی به انواع خاص Issue

SIG Docs به‌اندازه‌ای با انواع زیر از Issue مواجه می‌شود که لازم است شیوه رسیدگی به آن‌ها مستند شود.

### Issueهای تکراری

اگر یک مشکل واحد بیش از یک Issue باز دارد، آن‌ها را در یک Issue ادغام کنید.
تصمیم بگیرید کدام Issue باز بماند (یا یک Issue جدید باز کنید)، سپس تمام اطلاعات مرتبط را منتقل کرده و Issueهای مرتبط را لینک کنید.
در نهایت، به همه Issueهای دیگر که همان مشکل را توصیف می‌کنند برچسب `triage/duplicate` بزنید و آن‌ها را ببندید. داشتن یک Issue منفرد، سردرگمی را کاهش می‌دهد و از دوباره‌کاری جلوگیری می‌کند.

### Issueهای پیوند مرده

اگر Issue پیوند مرده در مستندات API یا `kubectl` است، تا زمانی که مشکل کاملاً درک شود به آن برچسب `/priority critical-urgent` بدهید.  
به تمام Issueهای پیوند مرده دیگر برچسب `/priority important-longterm` بدهید، چون باید به‌صورت دستی رفع شوند.

### Issueهای وبلاگ

انتظار می‌رود [مطالب وبلاگ Kubernetes](/blog/) با گذر زمان قدیمی شوند؛ بنابراین فقط مطالب کمتر از یک‌سال را نگه‌داری می‌کنیم.  
اگر Issue مربوط به مطلبی قدیمی‌تر از یک سال است، معمولاً باید Issue را بدون رفع ببندید.

می‌توانید هنگام بستن PR، لینکی به
[به‌روزرسانی و نگه‌داری مقاله](/docs/contribute/blog/#maintenance)
بفرستید.

در صورت وجود توجیه مناسب، ایجاد استثنا اشکالی ندارد.

### درخواست پشتیبانی یا گزارش باگ کد {#support-requests-or-code-bug-reports}

برخی Issueهای مستندات در واقع مشکلات کد زیرین یا درخواست کمک هستند (مثلاً وقتی یک آموزش کار نمی‌کند).  
برای Issueهایی که مرتبط با مستندات نیستند، Issue را با برچسب `kind/support` ببندید و در کامنت کاربر را به محافل پشتیبانی (Slack، Stack Overflow) و در صورت مرتبط بودن، مخزن گزارش باگ (مثل `kubernetes/kubernetes`) راهنمایی کنید.

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

نمونه پاسخ گزارش باگ کد:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### اسکوآش کردن

به‌عنوان یک تأییدکننده، هنگام بازبینی Pull Requestها (PRها) ممکن است در شرایط مختلف یکی از کارهای زیر را انجام دهید:

- به مشارکت‌کننده توصیه کنید کامیت‌هایش را اسکوآش کند.
- کامیت‌ها را به‌جای مشارکت‌کننده اسکوآش کنید.
- به مشارکت‌کننده توصیه کنید هنوز اسکوآش نکند.
- مانع از اسکوآش شدن شوید.

**توصیه به مشارکت‌کنندگان برای اسکوآش**: یک مشارکت‌کننده تازه‌وارد ممکن است نداند که باید کامیت‌هایش را در PR اسکوآش کند. در این صورت، او را راهنمایی کنید، پیوندهای مفید در اختیارش بگذارید و در صورت نیاز پیشنهاد کمک بدهید. چند پیوند مفید:

- [باز کردن Pull Request و اسکوآش کامیت‌ها](/docs/contribute/new-content/open-a-pr#squashing-commits) برای مشارکت‌کنندگان مستندات  
- [گردش کار GitHub](https://www.k8s.dev/docs/guide/github-workflow/) (شامل نمودارها) برای توسعه‌دهندگان

**اسکوآش کامیت برای مشارکت‌کنندگان**: اگر مشارکت‌کننده ممکن است در اسکوآش کردن مشکل داشته باشد یا فشار زمانی برای ادغام PR وجود دارد، می‌توانید اسکوآش را برای او انجام دهید:

- مخزن `kubernetes/website`
  [برای اجازه اسکوآش هنگام ادغام PR پیکربندی شده است](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests). کافی است دکمه *Squash commits* را بزنید.
- در PR، اگر مشارکت‌کننده اجازه مدیریت PR را به نگه‌دارندگان داده باشد، می‌توانید کامیت‌ها را اسکوآش کرده و فورک او را با نتیجه به‌روزرسانی کنید. پیش از اسکوآش، به او توصیه کنید آخرین تغییرات را ذخیره و push کند؛ پس از اسکوآش، به او توصیه کنید کامیت اسکوآش‌شده را به کلون محلی خود pull کند.
- می‌توانید با افزودن یک برچسب مناسب به طوری که Tide / GitHub اسکوآش را انجام دهد یا با کلیک دکمه *Squash commits* هنگام ادغام PR، GitHub را وادار کنید کامیت‌ها را اسکوآش کند.

**توصیه برای پرهیز از اسکوآش**

- اگر یک کامیت کاری خراب یا نادرست انجام می‌دهد و آخرین کامیت این خطا را برمی‌گرداند، کامیت‌ها را اسکوآش نکنید. هرچند زبانه «Files changed» در GitHub و پیش‌نمایش Netlify هر دو خوب به‌نظر می‌رسند، ادغام چنین PRی ممکن است برای دیگران تعارض rebase یا merge ایجاد کند. در صورت لزوم دخالت کنید تا این خطر برای سایر مشارکت‌کنندگان پیش نیاید.

**هرگز اسکوآش نکنید**

- اگر یک بومی‌سازی جدید را راه‌اندازی می‌کنید یا مستندات نسخه جدیدی را منتشر می‌کنید و شاخه‌ای را ادغام می‌کنید که از فورک کاربر نیست، _هرگز کامیت‌ها را اسکوآش نکنید_. اسکوآش نکردن ضروری است زیرا باید تاریخچه کامیت برای آن فایل‌ها حفظ شود.
