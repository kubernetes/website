<div dir="rtl">

# مستندات کوبرنتیز

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

این مخزن شامل مواردی است که برای ساخت [مستندات و وب سایت کوبرنتیز](https://kubernetes.io/) به آنها نیاز است. ما از این که شما قصد مشارکت دارید خوشحال هستیم.

## اجرای وب سایت در سیستم خود با استفاده از هوگو

برای دریافت مستندات نصب هوگو لطفاً به [سایت مستندات رسمی هوگو](https://gohugo.io/getting-started/installing/) وارد شوید. قبل از هر چیز مطمئن شوید که نسخه توسعه یافته هوگو را
دریافت نموده‌اید. برای این کار باید متغییر محیطی `HUGO_VERSION` را در فایل [`netlify.toml`](netlify.toml#L10) بررسی نمایید.

قبل از ساختن سایت، مخزن وب سایت کوبرنتیز را کلون نمایید:
<div dir="ltr">

```bash
git clone https://github.com/kubernetes/website.git
cd website
git submodule update --init --recursive --depth 1
```

</div>

**توجه:** وب سایت کوبرنتیز [تم هوگو داکی](https://github.com/google/docsy#readme) را برای استقرار استفاده می‌کند. 
اگر مخزن وب سایت خود را بروزرسانی نکرده‌اید، مسیر `website/themes/docsy` خالی خواهد بود و وب سایت بدون یک کپی از آن تم ساخته نخواهد شد.

برای بروزرسانی تم وب سایت از دستور زیر استفاده شود:
<div dir="ltr">

```bash
git submodule update --init --recursive --depth 1
```
</div>

برای ساخت و تست سایت در داخل سیستم خود می‌توانید از دستور زیر استفاده کنید:
<div dir="ltr">

```bash
hugo server --buildFuture
```
</div>
با اجرای دستور فوق سرور هوگو به صورت داخلی بر روی سیستم شما بر روی پورت 1313 شروع به کار خواهد کرد. برای دیدن وب سایت http://localhost:1313 در مرورگر خود باز کنید. با انجام هر تغییری در فایلهای سورس، هوگو مرورگر را وادار به بازخوانی صفحه می‌کند.

## مشارکت در SIG مستندسازی

شما می‌توانید با استفاده از لینک روبرو در مورد SIG مستندسازی کوبرنتیز و جلسات آنها اطلاعات بیشتری را بدست آورید. [صفحه جامعه کوبرنتیز](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)

همچنین شما می‌توانید با نگهدارنگان پروژه کوبرنتیز با استفاده از لینکهای زیر در تماس باشید:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## کمک به مستند سازی این پروژه

با استفاده از دکمه **Fork** که در ناحیه بالا سمت راست قرار گرفته است می‌توانید یک کپی از این مخزن را در حساب Github خود کپی کنید. به این کپی اصطلاحاً *fork* گفته می شود. تغییراتی را که مد نظر دارید را
در نسخه fork شده اعمال کنید و هنگامی که آماده بودید این تغییرات را برای ما ارسال کنید که این کار از طریق درخواست pull انجام می‌شود.

زمانی که درخواست pull شما برای یکی از بازبینان کوبرنتیز ارسال شد، وی موظف به ایجاد یک بازخورد واضح و قابل اعمال است. به عنوان مالک درخواست کننده pull **وظیفه شماست که به اصلاح مواردی بپردازید که بازبین برای شما به عنوان بازخورد مشخص کرده است.**

همچنین باید این نکته را توجه داشته باشید که ممکن است بیشتر از یک بازبین کوبرنتیز برای کار شما بازخورد ایجاد کند و یا اینکه حتی بازخوردی را دریافت کنید که با بازخورد ابتدایی متفاوت باشد.

علاوه بر این، در برخی موارد ممکن است یکی از بازبینان در صورت لزوم از یک بازبین فنی بخواهد تا بازخوردی را برای شما انجام دهد. بازبینان تمام تلاش خود را می‌کند که بازخوردهای خود را در سریعترین زمان به شما پاسخ بدهند ولی زمانبندی این موضوع می‌تواند بنا به شرایط متفاوت باشد.

برای اطلاعات بیشتر در خصوص مشارکت در مستندسازی کوبرنتیز به لینک‌های زیر مراجعه کنید:

* [مشارکت در مستندسازی کوبرنتیز](https://kubernetes.io/docs/contribute/)
* [انواع محتوای صفحات](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [راهنمای سبک مستندسازی](https://kubernetes.io/docs/contribute/style/style-guide/)
* [مستند بومی سازی کوبنتیز](https://kubernetes.io/docs/contribute/localization/)

## بومی‌سازی `README.md`'s

| زبان  | زبان |
|---|---|
|[چینی](README-zh.md)|[کره‌ای](README-ko.md)|
|[فرانسوی](README-fr.md)|[لهستانی](README-pl.md)|
|[آلمانی](README-de.md)|[پرتغالی](README-pt.md)|
|[هندی](README-hi.md)|[روسی](README-ru.md)|
|[اندونزیایی](README-id.md)|[اسپانیایی](README-es.md)|
|[ایتالیایی](README-it.md)|[اوکراینی](README-uk.md)|
|[ژاپنی](README-ja.md)|[ویتنامی](README-vi.md)|
|[فارسی](README-fa.md)|

## مرام نامه

مشارکت در جامعه کوبرنتیز توسط [CNCF مرام نامه](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) انجام می شود.

## سپاس

کوبرنتیز با مشارکت جامعه شکوفا می شود و ما از کمک شما برای ارائه کمکهایتان به وب سایت و مستندسازی مستنداتمان سپاسگزار هستیم.
</div>
