---
title: باز کردن یک درخواست ادغام
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
---

<!-- overview -->

{{< note >}}
**توسعه‌دهندگان کد**: اگر در حال مستندسازی یک ویژگی جدید برای نسخه آتی کوبرنتیز هستید، به [مستندسازی یک ویژگی جدید](/docs/contribute/new-content/new-features/) مراجعه کنید.
{{< /note >}}

برای مشارکت در صفحات محتوای جدید یا بهبود صفحات محتوای موجود، یک درخواست ادغام باز کنید. مطمئن شوید که تمام الزامات موجود در بخش [قبل از شروع](/docs/contribute/new-content/) را رعایت می‌کنید.

اگر تغییر شما کوچک است، یا با گیت آشنا نیستید، برای یادگیری نحوه ویرایش یک صفحه، [تغییرات با استفاده از گیت‌هاب](#changes-using-github) را مطالعه کنید.

اگر تغییرات شما بزرگ است، برای یادگیری نحوه ایجاد تغییرات به صورت محلی در رایانه خود، [کار از یک انشعاب محلی](#fork-the-repo) را مطالعه کنید.

<!-- body -->

## تغییرات با استفاده از گیت‌هاب

اگر تجربه کمتری در کار با گردش‌های کاری گیت دارید، در اینجا روش آسان‌تری برای باز کردن یک درخواست ادغام ارائه شده است. شکل ۱ مراحل و جزئیات بعدی را شرح می‌دهد.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user New<br>Contributor]) --- id1[(kubernetes/website<br>GitHub)]
subgraph tasks[Changes using GitHub]
direction TB
    0[ ] -.-
    1[1. Edit this page] --> 2[2. Use GitHub markdown<br>editor to make changes]
    2 --> 3[3. fill in Propose file change]

end
subgraph tasks2[ ]
direction TB
4[4. select Propose file change] --> 5[5. select Create pull request] --> 6[6. fill in Open a pull request]
6 --> 7[7. select Create pull request] 
end

id1 --> tasks --> tasks2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,1,2,3,4,5,6,7 grey
class 0 spacewhite
class tasks,tasks2 white
class id1 k8s
{{</ mermaid >}}

شکل ۱. مراحل باز کردن یک درخواست ادغام با استفاده از گیت هاب.
1. در صفحه‌ای که مشکل را مشاهده می‌کنید، گزینه **ویرایش این صفحه** را در پنل ناوبری سمت راست انتخاب کنید.

1. تغییرات خود را در ویرایشگر نشانه‌گذاری گیت هاب اعمال کنید.

1. در پایین ویرایشگر، فرم **پیشنهاد تغییر پرونده** را پر کنید. در بخش اول، پیام commit خود را عنوان کنید. در بخش دوم، توضیحی ارائه دهید.

   {{< note >}}
   از هیچ [کلید واژه‌های گیت هاب] (https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) در پیام commit خود استفاده نکنید. می‌توانید بعداً آنها را به توضیحات درخواست ادغام اضافه کنید.
   {{< /note >}}

1. گزینه **پیشنهاد تغییر پرونده** را انتخاب کنید.

1. **ایجاد درخواست ادغام** را انتخاب کنید.

1. صفحه **باز کردن درخواست ادغام** ظاهر می‌شود. فرم را پر کنید:

   - بخش **موضوع** درخواست ادغام به طور پیش فرض خلاصه commit است. در صورت نیاز می‌توانید آن را تغییر دهید.
   - بدنه‌ی اصلی شامل پیام commit توسعه‌یافته‌ی شما، در صورت وجود، و مقداری متن الگو است. جزئیاتی را که متن الگو درخواست می‌کند اضافه کنید، سپس متن الگوی اضافی را حذف کنید.
   - کادر انتخاب **اجازه ویرایش به نگهدارنده‌ها** را علامت بزنید.

   {{< note >}}
   توضیحات درخواست ادغام راهی عالی برای کمک به بررسی‌کنندگان در درک تغییر شما است. برای اطلاعات بیشتر، به [بازکردن درخواست ادغام](#open-a-pr) مراجعه کنید.
   {{</ note >}}

1. گزینه **ایجاد درخواست ادغام** را انتخاب کنید.

### رسیدگی به بازخوردها در گیت‌هاب

قبل از ترکیب کردن یک درخواست ادغام، اعضای جامعه کوبرنتیز آن را بررسی و تأیید می‌کنند. ربات k8s-ci-robot بر اساس نزدیکترین مالک ذکر شده در صفحات، بررسی‌کنندگان را پیشنهاد می‌دهد. اگر شخص خاصی را مد نظر دارید، در قسمت نظرات، نام کاربری گیت هاب او را بنویسید.

اگر یک داور از شما بخواهد تغییراتی ایجاد کنید:

1. به برگه ** پرونده های تغییر یافته ** بروید.
1. روی هر پرونده ای که توسط درخواست ادغام تغییر داده شده، آیکون مداد (ویرایش) را انتخاب کنید.
1. تغییرات درخواستی را اعمال کنید.
1. تغییرات را اعمال کنید.

اگر منتظر یک داور هستید، هر ۷ روز یکبار با او تماس بگیرید. همچنین می‌توانید در کانال اسلک با شناسه‌ی `#sig-docs` پیام ارسال کنید.

وقتی بررسی شما کامل شد، یک بررسی‌کننده درخواست ادغام شما را ترکیب می‌کند و تغییرات شما چند دقیقه بعد اعمال می‌شوند.

## کار از یک انشعاب محلی {#fork-the-repo}

اگر در استفاده از گیت تجربه بیشتری دارید، یا اگر تغییرات شما بزرگتر از چند خط است، از یک انشعاب محلی استفاده کنید.

مطمئن شوید که [گیت](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) را روی رایانه خود نصب کرده‌اید. همچنین می‌توانید از یک برنامه رابط کاربری گیت استفاده کنید.

شکل ۲ مراحلی را که باید هنگام کار از یک انشعاب محلی دنبال کنید نشان می‌دهد. جزئیات هر مرحله در ادامه آمده است.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
1[Fork the kubernetes/website<br>repository] --> 2[Create local clone<br>and set upstream]
subgraph changes[Your changes]
direction TB
S[ ] -.-
3[Create a branch<br>example: my_new_branch] --> 3a[Make changes using<br>text editor] --> 4["Preview your changes<br>locally using Hugo<br>(localhost:1313)<br>or build container image"]
end
subgraph changes2[Commit / Push]
direction TB
T[ ] -.-
5[Commit your changes] --> 6[Push commit to<br>origin/my_new_branch]
end

2 --> changes --> changes2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class 1,2,3,3a,4,5,6 grey
class S,T spacewhite
class changes,changes2 white
{{</ mermaid >}}

شکل ۲. کار کردن از یک انشعاب محلی برای اعمال تغییرات شما.

### مخزن kubernetes/website را انشعاب کنید

1. به مخزن [`kubernetes/website`](https://github.com/kubernetes/website/) بروید.
1. **انشعاب** را انتخاب کنید.

### یک نسخه مشابه محلی ایجاد کنید و جریان بالادست را تنظیم کنید

1. در یک پنجره خط فرمان، انشعاب خود را رونوشت کرده و [قالب Docsy هوگو](https://github.com/google/docsy#readme) را به‌روزرسانی کنید:

   ```shell
   git clone git@github.com:<github_username>/website
   cd website
   ```

1. به پوشه جدید `website` بروید. مخزن `kubernetes/website` را به عنوان راه دور `upstream` تنظیم کنید:

   ```shell
   cd website

   git remote add upstream https://github.com/kubernetes/website.git
   ```

1. مخازن «origin» و «upstream» خود را تأیید کنید:

   ```shell
   git remote -v
   ```

   خروجی مشابه زیر است:

   ```none
   origin	git@github.com:<github_username>/website.git (fetch)
   origin	git@github.com:<github_username>/website.git (push)
   upstream	https://github.com/kubernetes/website.git (fetch)
   upstream	https://github.com/kubernetes/website.git (push)
   ```

1. تغییرات را از انشعاب خود دریافت کنید

   ```shell
   git fetch origin
   git fetch upstream
   ```

   این کار باعث می‌شود قبل از شروع تغییرات، مخزن محلی شما به‌روز باشد.

   {{< note >}}
   این گردش کار با [گردش کار گیت‌هاب انجمن کوبرنتیز](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md) متفاوت است. لازم نیست قبل از ارسال به‌روزرسانی‌ها به شاخه خود، رونوشت محلی `main` خود را با `upstream/main` ادغام کنید.
   {{< /note >}}

### ایجاد شاخه

1. تصمیم بگیرید که کار خود را بر اساس کدام شاخه انجام دهید:

   - برای بهبود محتوای موجود، از `upstream/main` استفاده کنید.
   - برای محتوای جدید در مورد ویژگی‌های موجود، از `upstream/main` استفاده کنید.
   - برای محتوای محلی‌سازی شده، از قراردادهای محلی‌سازی استفاده کنید. برای اطلاعات بیشتر، به [مستندات محلی‌سازی کوبرنتیز](/docs/contribute/localization/) مراجعه کنید.
   - برای ویژگی‌های جدید در نسخه آتی کوبرنتیز، از شاخه ویژگی‌ها استفاده کنید. برای اطلاعات بیشتر، به [مستندسازی برای انتشار](/docs/contribute/new-content/new-features/) مراجعه کنید.
   - برای تلاش‌های طولانی‌مدتی که چندین مشارکت‌کننده‌ی SIG Docs در آن همکاری می‌کنند، مانند سازماندهی مجدد محتوا، از یک شاخه‌ی ویژگی خاص که برای آن تلاش ایجاد شده است، استفاده کنید.

   اگر در انتخاب شعبه به کمک نیاز دارید، در کانال Slack با شناسه `#sig-docs` سوال کنید.

1. بر اساس شاخه‌ای که در مرحله ۱ شناسایی کردید، یک شاخه جدید ایجاد کنید. این مثال فرض می‌کند که شاخه پایه «upstream/main» است:

   ```shell
   git checkout -b <my_new_branch> upstream/main
   ```

1. تغییرات خود را با استفاده از یک ویرایشگر متن انجام دهید.

در هر زمانی، از دستور `git status` برای مشاهده پرونده‌هایی که تغییر داده‌اید، استفاده کنید.

### تغییرات خود را اعمال کنید

وقتی آماده ارسال درخواست ادغام شدید، تغییرات خود را اعمال کنید.

1. در مخزن محلی خود، بررسی کنید که کدام پرونده ها را باید commit کنید:

   ```shell
   git status
   ```

   خروجی مشابه زیر است:

   ```none
   On branch <my_new_branch>
   Your branch is up to date with 'origin/<my_new_branch>'.

   Changes not staged for commit:
   (use "git add <file>..." to update what will be committed)
   (use "git checkout -- <file>..." to discard changes in working directory)

   modified:   content/en/docs/contribute/new-content/contributing-content.md

   no changes added to commit (use "git add" and/or "git commit -a")
   ```

1. پرونده های فهرست شده در قسمت **تغییرات که برای commit مرحله بندی نشده اند** را به commit اضافه کنید:

   ```shell
   git add <your_file_name>
   ```

   این کار را برای هر پرونده تکرار کنید.

1. پپس از اضافه کردن تمام پرونده ها، یک commit ایجاد کنید:

   ```shell
   git commit -m "Your commit message"
   ```

   {{< note >}}
   از هیچ [کلمات کلیدی گیت‌هاب](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) در پیام commit خود استفاده نکنید. می‌توانید بعداً آنها را به توضیحات درخواست ادغام اضافه کنید.
   {{< /note >}}

1. شاخه محلی و تغییرات جدید آن را به شاخه راه دور خود ارسال کنید:

   ```shell
   git push origin <my_new_branch>
   ```

### پیش نمایش تغییرات خود به صورت محلی {#preview-locally}

ایده خوبی است که قبل از اعمال تغییرات یا باز کردن درخواست ادغام، آنها را به صورت محلی پیش‌نمایش کنید. پیش‌نمایش به شما امکان می‌دهد خطاهای ساخت یا مشکلات قالب‌بندی را متوجه شوید.

شما می‌توانید image کانتینر وب‌سایت را بسازید یا هوگو را به صورت محلی اجرا کنید. ساخت image کانتینر کندتر است اما [کدهای کوتاه هوگو](/docs/contribute/style/hugo-shortcodes/) را نمایش می‌دهد که می‌تواند برای اشکال‌زدایی مفید باشد.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="هوگو در یک کانتینر" %}}

{{< note >}}
دستورات زیر از داکر به عنوان موتور کانتینر پیش‌فرض استفاده می‌کنند. متغیر محیطی `CONTAINER_ENGINE` را طوری تنظیم کنید که این رفتار را لغو کند.
{{< /note >}}

1. ساخت image کانتینر به صورت محلی
_فقط در صورتی به این مرحله نیاز دارید که در حال آزمایش تغییری در خود ابزار هوگو باشید_

   ```shell
   # Run this in a terminal (if required)
   make container-image
   ```

1. وابستگی‌های زیرماژول را در مخزن محلی خود دریافت کنید:

   ```shell
   # Run this in a terminal
   make module-init
   ```

1. هوگو را در یک کانتینر اجرا کنید:

   ```shell
   # Run this in a terminal
   make container-serve
   ```

1. در یک مرورگر وب، به نشانی `http://localhost:1313` بروید. هوگو تغییرات را مشاهده می‌کند و در صورت نیاز سایت را بازسازی می‌کند.

1. برای متوقف کردن نمونه محلی هوگو، به خط فرمان برگردید و `Ctrl+C` را تایپ کنید، یا پنجره خط فرمان را ببندید.

{{% /tab %}}
{{% tab name="هوگو در خط فرمان" %}}

روش دیگر، نصب و استفاده از دستور `hugo` برروی رایانه شماست:

1. نسخه‌های [هوگو (نسخه توسعه‌یافته)](https://gohugo.io/getting-started/installing/) و [Node](https://nodejs.org/en) مشخص شده در [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml) را نصب کنید.

1. هرگونه وابستگی را نصب کنید:

   ```shell
   npm ci
   ```

1. در یک خط فرمان، به مخزن وب‌سایت کوبرنتیز خود بروید و سرور هوگو را اجرا کنید:

   ```shell
   cd <path_to_your_repo>/website
   make serve
   ```
   اگر از ویندوز استفاده می‌کنید یا نمی‌توانید دستور make را اجرا کنید، از دستور زیر استفاده کنید:

   ```
   hugo server --buildFuture
   ```

1. در یک مرورگر وب، به نشانی `http://localhost:1313` بروید. هوگو تغییرات را مشاهده می‌کند و در صورت نیاز سایت را بازسازی می‌کند.

1. برای متوقف کردن نمونه محلی هوگو، به خط فرمان برگردید و `Ctrl+C` را تایپ کنید، یا پنجره خط فرمان را ببندید.

{{% /tab %}}
{{< /tabs >}}

### یک درخواست ادغام از انشعاب خود به kubernetes/website {#open-a-pr} باز کنید.

شکل ۳ مراحل باز کردن یک درخواست ادغام از انشعاب شما به [kubernetes/website](https://github.com/kubernetes/website) را نشان می‌دهد. جزئیات در ادامه آمده است.

لطفاً توجه داشته باشید که مشارکت‌کنندگان می‌توانند `kubernetes/website` را به صورت `k/website` ذکر کنند.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
subgraph first[ ]
direction TB
1[1. Go to kubernetes/website repository] --> 2[2. Select New Pull Request]
2 --> 3[3. Select compare across forks]
3 --> 4[4. Select your fork from<br>head repository drop-down menu]
end
subgraph second [ ]
direction TB
5[5. Select your branch from<br>the compare drop-down menu] --> 6[6. Select Create Pull Request]
6 --> 7[7. Add a description<br>to your PR]
7 --> 8[8. Select Create pull request]
end

first --> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
class 1,2,3,4,5,6,7,8 grey
class first,second white
{{</ mermaid >}}

شکل ۳. مراحل باز کردن یک درخواست ادغام از انشعاب شما به [kubernetes/website](https://github.com/kubernetes/website).

1. در یک مرورگر وب، به مخزن [`kubernetes/website`](https://github.com/kubernetes/website/) بروید.
1. **درخواست ادغام جدید** را انتخاب کنید.
1. گزینه **مقایسه بین شاخه‌ها** را انتخاب کنید.
1. از منوی کشویی **مخزن اصلی**، شاخه‌ی خود را انتخاب کنید.
1. از منوی کشویی **مقایسه** شاخه خود را انتخاب کنید.
1. گزینه **ایجاد درخواست ادغام** را انتخاب کنید.
1. توضیحی برای درخواست ادغام خود اضافه کنید:

    - **عنوان** (۵۰ کاراکتر یا کمتر): خلاصه‌ای از هدف تغییر را بیان کنید.
    - **شرح**: تغییر را با جزئیات بیشتری شرح دهید.

      - اگر مشکل مرتبطی در گیت‌هاب وجود دارد، عبارت‌های «رفع مشکلات #12345» یا «بستن مشکلات #12345» را در توضیحات ذکر کنید. خودکارسازی گیت‌هاب پس از ترکیب درخواست ادغام (در صورت استفاده) مشکل ذکر شده را می‌بندد. اگر درخواست های ادغام مرتبط دیگری وجود دارد، آنها را نیز لینک کنید.
      - اگر در مورد موضوع خاصی به مشاوره نیاز دارید، هر سوالی را که می‌خواهید داوران در مورد آن فکر کنند، در توضیحات خود ذکر کنید.

1. دکمه‌ی **ایجاد درخواست ادغام** را انتخاب کنید.

تبریک! درخواست ادغام شما در [درخواست های ادغام] (https://github.com/kubernetes/website/pulls) در دسترس است.

پس از باز کردن یک درخواست ادغام، گیت‌هاب تست‌های خودکار را اجرا می‌کند و سعی می‌کند پیش‌نمایشی را با استفاده از [Netlify](https://www.netlify.com/) اجرا کند.

- اگر ساخت Netlify با شکست مواجه شد، برای اطلاعات بیشتر **جزئیات** را انتخاب کنید.
- اگر ساخت Netlify با موفقیت انجام شود، با انتخاب **جزئیات** نسخه‌ای مرحله‌بندی‌شده از وب‌سایت کوبرنتیز با تغییرات اعمال‌شده شما باز می‌شود. اینگونه است که بررسی‌کنندگان تغییرات شما را بررسی می‌کنند.

گیت‌هاب همچنین به طور خودکار برچسب‌هایی را به یک درخواست ادغام اختصاص می‌دهد تا به بررسی‌کنندگان کمک کند. در صورت نیاز، می‌توانید آنها را نیز اضافه کنید. برای اطلاعات بیشتر، به [افزودن و حذف برچسب‌های مسئله](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels) مراجعه کنید.

### رسیدگی به بازخوردها به صورت محلی

1. پس از انجام تغییرات، commit قبلی خود را اصلاح کنید:

   ```shell
   git commit -a --amend
   ```

   - `-a`: commits all changes
   - `--amend`: amends the previous commit, rather than creating a new one

1. در صورت نیاز پیام commit خود را به روزرسانی کنید.

1. از دستور `git push origin <my_new_branch>` برای اعمال تغییرات و اجرای مجدد تست‌های Netlify استفاده کنید.

   {{< note >}}
   اگر به جای اصلاح از `git commit -m` استفاده می‌کنید، باید قبل از ادغام، [commitهای خود را فشرده کنید](#squashing-commits).
   {{< /note >}}

#### تغییرات از نظر داوران

گاهی اوقات داوران درخواست ادغام شما را تغییر میدهند. قبل از اعمال هرگونه تغییر دیگر، آن تغییرات را اعمال کنید.

1. تغییرات را از انشعاب راه دور خود دریافت کنید و شاخه کاری خود را مجدداً پایه گذاری کنید:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

1. پس از پایه گذاری مجدد، تغییرات جدید را به انشعاب خود ارسال (force-push) کنید:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

####  ادغام تضادها و پایه گذاری مجدد

{{< note >}}
برای اطلاعات بیشتر، به [شاخه‌بندی گیت - شاخه‌بندی و ادغام مقدماتی](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)، [ادغام پیشرفته](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging) مراجعه کنید، یا در کانال Slack `#sig-docs` درخواست کمک کنید.
{{< /note >}}

اگر مشارکت‌کننده‌ی دیگری تغییراتی را در همان پرونده در یک درخواست ادغام دیگر اعمال کند، می‌تواند باعث ایجاد تداخل ادغام شود. شما باید تمام تداخل‌های ادغام را در درخواست ادغام خود حل کنید.

1. انشعاب خود را به روز کنید و شاخه محلی خود را مجدداً پایه گذاری کنید:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   سپس تغییرات را به انشعاب خود ارسال (force-push) کنید:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

1. تغییرات را از `kubernetes/website` در `upstream/main` دریافت کنید و شاخه خود را تغییر دهید:

   ```shell
   git fetch upstream
   git rebase upstream/main
   ```

1. نتایج پایه گذاری مجدد را بررسی کنید:

   ```shell
   git status
   ```

   این منجر به تعدادی پوشه می‌شود که به عنوان مغایرت علامت‌گذاری شده‌اند.

1. هر پوشه دارای تداخل را باز کنید و به دنبال نشانگرهای تداخل بگردید: `>>>`، `<<<` و `===`. تداخل را برطرف کرده و نشانگر تداخل را حذف کنید.

   {{< note >}}
   برای اطلاعات بیشتر، به [نحوه نمایش تداخل‌ها](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented) مراجعه کنید.
   {{< /note >}}

1. پوشه‌ها را به مجموعه تغییرات اضافه کنید:

   ```shell
   git add <filename>
   ```

1. پایه گذاری مجدد را ادامه دهيد:

   ```shell
   git rebase --continue
   ```

1. در صورت نیاز مراحل ۲ تا ۵ را تکرار کنید.

   پس از اعمال تمام تغییرات، دستور `git status` نشان می‌دهد که عملیات پایه گذاری مجدد کامل شده است.

1. شاخه را به انشعاب خود ارسال کنید

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

   درخواست ادغام دیگر هیچ تداخلی را نشان نمی‌دهد.

### فشرده‌سازی تغییرات‌

{{< note >}}
برای اطلاعات بیشتر، به [ابزارهای گیت - تاریخچه بازنویسی](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) مراجعه کنید، یا در کانال Slack با شناسه `#sig-docs` درخواست کمک کنید.
{{< /note >}}

اگر درخواست ادغام شما چندین تغییر دارد، قبل از ترکیب درخواست ادغام خود، باید آنها را در یک commit واحد ترکیب کنید. می‌توانید تعداد تغییرات را در بخش **Commits** PR خود یا با اجرای دستور `git log` به صورت محلی بررسی کنید.

{{< note >}}
این مبحث، «vim» را به عنوان ویرایشگر متن خط فرمان فرض می‌کند.
{{< /note >}}

1. شروع یک پایه گذاری مجدد تعاملی:

   ```shell
   git rebase -i HEAD~<number_of_commits_in_branch>
   ```

   فشرده کردن تغییرات نوعی پایه گذاری مجدد است. سوئیچ `-i` به گیت می‌گوید که می‌خواهید به صورت تعاملی پایه گذاری کنید. `HEAD~<number_of_commits_in_branch` نشان می‌دهد که برای پایه گذاری مجدد، چند تغییر باید بررسی شوند.

   خروجی مشابه زیر است:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2

   # Rebase 3d18sf680..7d54e15ee onto 3d183f680 (3 commands)

   ...

   # These lines can be re-ordered; they are executed from top to bottom.
   ```

   بخش اول خروجی، تغییرات موجود در پایه گذاری مجدد را فهرست می‌کند. بخش دوم، گزینه‌های مربوط به هر تغییر را فهرست می‌کند. با تغییر کلمه `pick` وضعیت تغییرات پس از تکمیل پایه گذاری مجدد تغییر می‌کند.

   برای اهداف پایه گذاری مجدد، برروی «فشرده کردن» و «انتخاب» تمرکز کنید.

   {{< note >}}
   برای اطلاعات بیشتر، به [حالت تعاملی](https://git-scm.com/docs/git-rebase#_interactive_mode) مراجعه کنید.
   {{< /note >}}

1. شروع به ویرایش پرونده کنید.

   متن اصلی را تغییر دهید:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2
   ```

   To:

   ```none
   pick d875112ca Original commit
   squash 4fa167b80 Address feedback 1
   squash 7d54e15ee Address feedback 2
   ```

   این دستور، تغییرات «4fa167b80 Address feedback 1» و «7d54e15ee Address feedback 2» را در «d875112ca Original commit» فشرده می‌کند و فقط «d875112ca Original commit» را به عنوان بخشی از جدول زمانی باقی می‌گذارد.

1. پرونده خود را ذخیره کرده و از آن خارج شوید.

1. تغییرات فشرده‌شده‌ی خود را ارسال کنید:

   ```shell
   git push --force-with-lease origin <branch_name>
   ```

## در مخازن دیگر مشارکت کنید

پروژه کوبرنتیز (https://github.com/kubernetes) شامل بیش از ۵۰ مخزن است. بسیاری از این مخازن حاوی مستنداتی مانند متن راهنمای کاربر، پیام‌های خطا، ارجاعات API یا نظرات مربوط به کد هستند.

اگر متنی را مشاهده کردید که می‌خواهید آن را بهبود دهید، از گیت هاب برای جستجوی تمام مخازن موجود در سازمان کوبرنتیز استفاده کنید. این می‌تواند به شما کمک کند تا بفهمید مشکل یا درخواست ادغام خود را کجا ارسال کنید.

هر مخزن فرآیندها و رویه‌های خاص خود را دارد. قبل از اینکه مشکلی را ثبت کنید یا درخواست ادغام ارسال کنید، در صورت وجود، «README.md»، «CONTRIBUTING.md» و «code-of-conduct.md» آن مخزن را مطالعه کنید.

اکثر مخازن از قالب های مسئله و درخواست ادغام استفاده می کنند. نگاهی به برخی از مسائل و درخواست های ادغام باز بیندازید تا با فرآیندهای آن تیم آشنا شوید. هنگام ثبت مسائل یا درخواست های ادغام، حتماً قالب‌ها را با حداکثر جزئیات ممکن پر کنید.

## {{% heading "What's next?" %}}

- برای کسب اطلاعات بیشتر در مورد فرآیند بررسی، [بازبینی](/docs/contribute/review/reviewing-prs) را مطالعه کنید.

