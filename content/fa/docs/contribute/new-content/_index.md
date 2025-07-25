---
title: مشارکت در محتوای جدید
content_type: concept
main_menu: true
weight: 25
simple_list: true # for whatsnext section
---



<!-- overview -->

این بخش شامل اطلاعاتی است که باید قبل از ارسال محتوای جدید بدانید.

همچنین صفحات اختصاصی در مورد ارسال [مطالعات موردی](/docs/contribute/new-content/case-studies) و [مقالات وب نوشت](/docs/contribute/blog/) وجود دارد.

<!-- body -->

## جریان وظیفه محتوای جدید

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->
{{< mermaid >}}
flowchart LR 
    subgraph second[Before you begin]
    direction TB
    S[ ] -.-
    A[Sign the CNCF CLA] --> B[Choose Git branch]
    B --> C[One language per PR]
    C --> F[Check out<br>contributor tools]
    end
    subgraph first[Contributing Basics]
    direction TB
       T[ ] -.-
       D[Write docs in markdown<br>and build site with Hugo] --- E[source in GitHub]
       E --- G['/content/../docs' folder contains docs<br>for multiple languages]
       G --- H[Review Hugo page content<br>types and shortcodes]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***Figure - Contributing new content preparation***

شکل بالا اطلاعاتی را که باید قبل از ارسال محتوای جدید بدانید، نشان می‌دهد. جزئیات اطلاعات در ادامه آمده است.



<!-- body -->

## اصول اولیه مشارکت

- مستندات کوبرنتیز را در قالب بندی ساده بنویسید و سایت کوبرنتیز را با استفاده از [هوگو](https://gohugo.io/) بسازید.
- مستندات کوبرنتیز از [CommonMark](https://commonmark.org/) به عنوان چاشنی قالب بندی ساده خود استفاده می‌کند. 
- منبع در [گیت هاب](https://github.com/kubernetes/website) است. می‌توانید مستندات کوبرنتیز را در `/content/en/docs/` پیدا کنید. برخی از مستندات مرجع به طور خودکار از اسکریپت‌های موجود در پوشه `update-imported-docs/` تولید می‌شوند.
- [انواع محتوای صفحه](/docs/contribute/style/page-content-types/) نحوه‌ی نمایش محتوای مستندات در هوگو را شرح می‌دهد.
- شما می‌توانید از [کدهای کوتاه Docsy](https://www.docsy.dev/docs/adding-content/shortcodes/) یا [کدهای کوتاه سفارشی هوگو](/docs/contribute/style/hugo-shortcodes/) برای مشارکت در مستندات کوبرنتیز استفاده کنید.
- علاوه بر کدهای کوتاه استاندارد هوگو، ما از تعدادی از [کدهای کوتاه سفارشی هوگو](/docs/contribute/style/hugo-shortcodes/) در مستندات خود برای کنترل ارائه محتوا استفاده می‌کنیم.
- منبع مستندات به چندین زبان در `/content/` موجود است. هر زبان پوشه مخصوص به خود را با کد دو حرفی دارد که توسط [استاندارد ISO 639-1] (https://www.loc.gov/standards/iso639-2/php/code_list.php) تعیین می‌شود. به عنوان مثال، منبع مستندات انگلیسی در `/content/en/docs/` ذخیره می‌شود.
- برای اطلاعات بیشتر در مورد مشارکت در مستندسازی به زبان‌های مختلف یا شروع یک ترجمه جدید، به [بومی‌سازی](/docs/contribute/localization) مراجعه کنید..

## قبل از اینکه شروع کنید {#before-you-begin}

### قرارداد CNCF CLA را امضا کنید {#sign-the-cla}

همه مشارکت‌کنندگان کوبرنتیز **باید** راهنمای مشارکت‌کننده (https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) را مطالعه کنند و [توافقنامه مجوز مشارکت‌کننده (CLA) را امضا کنند] (https://github.com/kubernetes/community/blob/master/CLA.md).

درخواست‌های ادغام از مشارکت‌کنندگانی که CLA را امضا نکرده‌اند، در تست‌های خودکار رد می‌شوند. نام و ایمیلی که ارائه می‌دهید باید با نام و ایمیل موجود در `git config` شما مطابقت داشته باشد، و نام و ایمیل گیت شما باید با نام و ایمیل استفاده شده برای `CNCF CLA` مطابقت داشته باشد.

### انتخاب کنید که از کدام شاخه گیت استفاده کنید

هنگام باز کردن یک درخواست ادغام، باید از قبل بدانید که کار خود را بر اساس کدام شاخه (branch) انجام خواهید داد.

سناریو | شاخه
:---------|:------------
محتوای انگلیسی موجود یا جدید برای نسخه فعلی | `main`
محتوای مربوط به انتشار تغییر ویژگی | شاخه‌ای که با نسخه اصلی و فرعی که تغییر ویژگی در آن قرار دارد، مطابقت دارد، با استفاده از الگوی `dev-<version>`. برای مثال، اگر یک ویژگی در نسخه `v{{< skew nextMinorVersion >}}` تغییر کند، تغییرات مستندات را به شاخه `dev-{{< skew nextMinorVersion >}}`` اضافه کنید.
محتوا به زبان‌های دیگر (بومی‌سازی‌ها) | از قرارداد محلی‌سازی استفاده کنید. برای اطلاعات بیشتر به [استراتژی شاخه‌بندی محلی‌سازی](/docs/contribute/localization/#branch-strategy) مراجعه کنید.

اگر هنوز مطمئن نیستید کدام شاخه را انتخاب کنید، در `#sig-docs` در Slack سوال کنید.

{{< note >}}
 اگر قبلاً درخواست ادغام خود را ارسال کرده‌اید و می‌دانید که شاخه پایه اشتباه بوده است، شما (و فقط شما، به عنوان ارسال‌کننده) می‌توانید آن را تغییر دهید. 
{{< /note >}}

### زبان‌ها به ازای هر درخواست ادغام

درخواست‌های ادغام را به یک زبان برای هر درخواست ادغام محدود کنید. اگر نیاز دارید یک تغییر یکسان را در یک نمونه کد در چندین زبان ایجاد کنید، برای هر زبان یک درخواست ادغام جداگانه باز کنید.

## ابزارهایی برای مشارکت‌کنندگان

پوشه [ابزارهای مشارکت‌کنندگان در اسناد](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools) در مخزن `kubernetes/website` شامل ابزارهایی است که به شما کمک می‌کند روند مشارکت خود را روان‌تر پیش ببرید.

## {{% heading "What's next?" %}}

<!-- relies on simple_list: true in front matter for remaining links -->
* درباره ارسال [مقالات وب نوشت](/docs/contribute/blog/article-submission/) مطالعه کنید.
