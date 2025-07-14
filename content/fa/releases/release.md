---
title: چرخه انتشار Kubernetes
type: docs
auto_generated: true
---
<!-- این محتوا به صورت خودکار تولید می‌شود از طریق https://github.com/kubernetes/website/blob/main/scripts/releng/update-release-info.sh -->

{{% pageinfo color="light" %}}
این محتوا به صورت خودکار تولید می‌شود و ممکن است لینک‌ها کار نکنند. منبع سند مشخص شده است.
[اینجا](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
{{% /pageinfo %}}
<!-- Lنکته محلی‌سازی: هنگام محلی‌سازی، بلوک pageinfo را حذف کنید -->

## هدف قرار دادن پیشرفت‌ها، مشکلات و روابط عمومی‌ها برای انتشار نقاط عطف

این سند بر توسعه‌دهندگان و مشارکت‌کنندگان Kubernetes متمرکز است که نیاز به ایجاد یک بهبود، مشکل یا درخواست pull دارند که یک نقطه عطف انتشار خاص را هدف قرار می‌دهد.

- [TL;DR](#tldr)
  - [Normal Dev (Weeks 1-11)](#normal-dev-weeks-1-11)
  - [Code Freeze (Weeks 12-14)](#code-freeze-weeks-12-14)
  - [Post-Release (Weeks 14+)](#post-release-weeks-14+)
- [Definitions](#definitions)
- [The Release Cycle](#the-release-cycle)
- [Removal Of Items From The Milestone](#removal-of-items-from-the-milestone)
- [Adding An Item To The Milestone](#adding-an-item-to-the-milestone)
  - [Milestone Maintainers](#milestone-maintainers)
  - [Feature additions](#feature-additions)
  - [Issue additions](#issue-additions)
  - [PR Additions](#pr-additions)
- [Other Required Labels](#other-required-labels)
  - [SIG Owner Label](#sig-owner-label)
  - [Priority Label](#priority-label)
  - [Issue/PR Kind Label](#issuepr-kind-label)

فرآیند هدایت بهبودها، مشکلات و درخواست‌های pull به یک نسخه Kubernetes، ذینفعان متعددی را در بر می‌گیرد:

- مالکان مربوط به بهبود، انتشار و درخواست pull
- رهبری SIG
- [تیم انتشار][release-team]

اطلاعات مربوط به گردش کار و تعاملات در زیر شرح داده شده است.

به عنوان مالک یک توسعه، انتشار یا درخواست pull ، it is your
مسئولیت اطمینان از برآورده شدن الزامات مربوط به نقاط عطف انتشار. در صورت نیاز به به‌روزرسانی، تیم اتوماسیون و انتشار با شما تماس خواهند گرفت., اما عدم اقدام می‌تواند منجر به حذف کار شما از مرحله‌ی مهم شود.. Additional
الزامات زمانی وجود دارند که نقطه عطف هدف، یک نسخه قبلی باشد.مشاهده کنید لینک پیوست شده را 
[cherry pick process][cherry-picks] .

## TL;DR

اگر می‌خواهید PR شما ادغام شود، به برچسب‌ها و مراحل مهم زیر نیاز دارد که در اینجا با Prow/commands نشان داده شده‌اند و برای اضافه کردن آنها لازم است:

### Normal Dev (Weeks 1-11)

- /sig {name}
- /kind {type}
- /lgtm
- /approved

### [Code Freeze][code-freeze] (هفته 12-14)

- /milestone {v1.y}
- /sig {name}
- /kind {bug, failing-test}
- /lgtm
- /approved

### پس از انتشار (هفته 14+)

بازگشت به الزامات مرحله 'Normal Dev':

- /sig {name}
- /kind {type}
- /lgtm
- /approved

ادغام‌ها در شاخه ۱.y اکنون انجام می‌شوند.[cherry-picks], تأیید شده توسط [ SIG Owner Label][release-managers].

در گذشته، برای درخواست‌های pull که با هدف تعیین نقطه عطف milestone-targeted انجام می‌شدند، الزام باز بودن یک issue مرتبط در GitHub وجود داشت، اما دیگر این‌طور نیست.
ویژگی‌ها یا بهبودها عملاً مشکلات گیت‌هاب یا [KEP] هستند.[keps] که منجر به PR های بعدی می شود.

فرآیند کلی برچسب‌گذاری باید در بین انواع مصنوعات سازگار باشد.

## تعاریف

- *صاحبان مسئله*: ایجادکننده، واگذارکنندگان و کاربری که مسئله را به مرحله انتشار رسانده است

- *release-team*: هر نسخه Kubernetes دارای تیمی است که مدیریت پروژه را انجام می‌دهد.
  وظایف شرح داده شده [اینجا][release-team].

  اطلاعات تماس تیم مرتبط با هر نسخه منتشر شده را می‌توان یافت.
  [اینجا](https://git.k8s.io/sig-release/releases/).

- *Y days*: مربوط به روزهای کاری است

- *افزایش*: ببینید "[آیا «چیز من» یک پیشرفت است؟](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)"

- *[enhancements-freeze][enhancements-freeze]*:
  مهلتی که [KEPs][keps] برای اینکه پیشرفت‌ها بخشی از نسخه فعلی باشند، باید تکمیل شوند

- *[exceptions][exceptions]*:
  فرآیند درخواست تمدید مهلت برای یک مورد خاص
ارتقاء 

- *[code-freeze][code-freeze]*:
  دوره حدود ۴ هفته‌ای قبل از تاریخ انتشار نهایی، که در طی آن فقط رفع اشکالات حیاتی در نسخه نهایی ادغام می‌شوند.

- *[Pruning](https://git.k8s.io/sig-release/releases/release_phases.md#pruning)*:
  فرآیند حذف یک بهبود از یک نقطه عطف انتشار، در صورتی که ... نباشد
  کاملاً پیاده‌سازی شده یا در غیر این صورت پایدار تلقی نمی‌شود.

- *release milestone*: رشته نسخه معنایی یا
  [نقطه عطف گیت‌هاب](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  اشاره به نسخهٔ اصلی.جزئی `vX.Y` از انتشار.

  همچنین ببینید
  [انتشار نسخه](https://git.k8s.io/sig-release/release-engineering/versioning.md).

- *شاخه رهاسازی*: شاخه گیت `release-X.Y` برای مرحله `vX.Y` ایجاد شده است.

  در زمان انتشار `vX.Y-rc.0` ایجاد شده و پس از انتشار تقریباً به مدت ۱۲ ماه با انتشار وصله‌های `vX.Y.Z` حفظ شده است.

توجه: نسخه‌های ۱.۱۹ و جدیدتر، ۱ سال پشتیبانی انتشار وصله دریافت می‌کنند و نسخه‌های ۱.۱۸ و قبل از آن، ۹ ماه پشتیبانی انتشار وصله دریافت می‌کنند.

## چرخه انتشار

![ایمیج یک چرخه انتشار Kubernetes](/images/releases/release-cycle.jpg)

انتشارهای Kubernetes در حال حاضر تقریباً سه بار در سال اتفاق می‌افتد.

فرآیند انتشار را می‌توان شامل سه مرحله اصلی دانست:

- تعریف افزایش
- پیاده سازی
- تثبیت

اما در واقعیت، این یک پروژه متن‌باز و چابک است که برنامه‌ریزی و پیاده‌سازی ویژگی‌ها در آن همواره در حال انجام است. با توجه به مقیاس پروژه و پایگاه توسعه‌دهندگان توزیع‌شده در سطح جهانی، برای سرعت پروژه بسیار مهم است که به یک مرحله تثبیت دنباله‌دار متکی نباشد و در عوض آزمایش یکپارچه‌سازی مداوم داشته باشد که تضمین می‌کند پروژه همیشه پایدار است، به طوری که بتوان کامیت‌های فردی را به عنوان چیزی که خراب شده است، علامت‌گذاری کرد.

با تعریف مداوم ویژگی‌ها در طول سال، مجموعه‌ای از موارد به صورت حبابی ظاهر می‌شوند که هدفشان انتشار یک نسخه خاص است. **[توقف پیشرفت‌ها][enhancements-freeze]**
تقریباً ۴ هفته پس از شروع چرخه انتشار شروع می‌شود. تا این مرحله، تمام کارهای مربوط به ویژگی‌های مورد نظر برای انتشار مورد نظر، در مصنوعات برنامه‌ریزی مناسب، همراه با [سرپرست بهبودها] تیم انتشار، تعریف شده‌اند.(https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md).

پس از انجماد بهبودها (Enhancements Freeze)، پیگیری مایل‌استون‌ها (milestones) در Pull Requestها و Issueها اهمیت زیادی دارد. مواردی که درون یک مایل‌استون قرار دارند، به عنوان یک لیست انجام (punchdown list) برای تکمیل نسخه انتشار مورد استفاده قرار می‌گیرند.

در مورد Issueها، مایل‌استون‌ها باید به‌درستی اعمال شوند؛ این کار باید از طریق triage توسط گروه SIG انجام شود تا [تیم انتشار [Release Team][release-team] بتواند باگ‌ها و بهبودها را دنبال کند.
(هر Issue مرتبط با بهبود باید حتماً دارای یک مایل‌استون باشد.)


نوعی اتوماسیون برای کمک به اختصاص خودکار نقاط عطف به PRها وجود دارد.

این اتوماسیون در حال حاضر برای مخازن زیر اعمال می‌شود:

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

ددر زمان ایجاد، Pull Requestهایی که به شاخه `master` ارسال می‌شوند نیاز دارند که افراد به صورت دستی مشخص کنند که این PR باید به کدام مایل‌استون (milestone) اختصاص یابد.
پس از Merge شدن، این PRها به‌طور خودکار `master` دریافت می‌کنند و از آن به بعد نیازی به مدیریت دستی مایل‌استون توسط انسان نیست.

برای PRهایی که به شاخه‌های نسخه (release branches) ارسال می‌شوند، مایل‌استون‌ها به‌صورت خودکار در لحظه ایجاد PR اعمال می‌شوند؛ بنابراین هیچ‌گونه مدیریت دستی برای مایل‌استون در این موارد لازم نیست.


هر تلاش یا فعالیت دیگری که باید توسط تیم انتشار (Release Team) پیگیری شود اما تحت پوشش خودکارسازی قرار نمی‌گیرد، باید دارای یک مایل‌استون (milestone) مشخص باشد.

پیاده‌سازی (Implementation) و رفع باگ (bug fixing) در طول چرخه انتشار به‌طور مداوم انجام می‌شود، اما در نهایت به یک دوره‌ی انجماد کد (code freeze) ختم می‌شود.


**[Code Freeze][code-freeze]** تقریباً در هفته دوازدهم آغاز می‌شود و حدود دو هفته ادامه دارد.
در این بازه زمانی، تنها رفع باگ‌های بحرانی به مخزن کد انتشار اضافه می‌شوند.


حدود دو هفته پس از Code Freeze و پیش از release وجود دارد که در این مدت باید تمامی مشکلات بحرانی باقی‌مانده حل شوند. این بازه زمانی همچنین فرصت نهایی‌سازی مستندات را فراهم می‌کند.

زمانی که کدبیس به اندازه کافی پایدار شد، شاخه master برای توسعه عمومی باز می‌شود و کار روی milestone بعدی انتشار در آن آغاز می‌شود. هر تغییر باقی‌مانده برای انتشار فعلی از شاخه master به شاخه release به صورت cherry pick منتقل می‌شود. انتشار از شاخه release ساخته می‌شود.

هر release بخشی از چرخه‌ی عمر گسترده‌تر Kubernetes است:

![تصویر چرخه عمر انتشار Kubernetes که سه نسخه را پوشش می‌دهد](/images/releases/release-lifecycle.jpg)

## حذف موارد از Milestone

قبل از پیش رفتن زیاد در روند افزودن یک مورد به milestone، لطفاً توجه کنید:
اعضای تیم [Release Team][release-team] می‌توانند مسائل را از milestone حذف کنند اگر خودشان یا SIG مسئول تشخیص دهند که آن مسئله در واقع مانع انتشار نیست و احتمال حل شدن به موقع آن کم است.

اعضای تیم Release Team ممکن است PRها را از milestone به دلایل زیر یا دلایل مشابه حذف کنند:

- PR ممکن است باعث ناپایداری شود و برای حل یک مشکل مسدودکننده ضروری نباشد.

- PR یک ویژگی جدید و دیرهنگام است و از فرآیند بهبودها یا [exception process][exceptions] عبور نکرده است.
- هیچ SIG مسئول و آماده‌ای برای قبول مالکیت PR و حل مشکلات پیگیری‌کننده آن وجود ندارد.
-PR به درستی برچسب‌گذاری نشده است.
-کار روی PR به‌وضوح متوقف شده است و تاریخ‌های تحویل نامشخص یا دیر شده‌اند.

در حالی که اعضای تیم Release Team در برچسب‌گذاری و تماس با SIGها کمک می‌کنند، مسئولیت دسته‌بندی PRها و جلب حمایت از SIG مربوطه بر عهده ارسال‌کننده است تا تضمین شود که هر مشکلی که توسط PR ایجاد شود، به سرعت حل خواهد شد.

در مواردی که اقدامات بیشتری لازم باشد، تیم Release Team از طریق کانال‌های زیر تلاش خواهد کرد تا از طریق ارتباط انسانی به انسانی موضوع را پیگیری کند.:

- ثبت کامنت در GitHub با ذکر نام تیم SIG و اعضای SIG مربوطه بسته به نوع مسئله.
- ارسال ایمیل به لیست پستی SIG
  - راه‌اندازی شده با آدرس‌های ایمیل گروهی از
    [community sig list][sig-list]
  - اختیاری، همچنین مستقیماً خطاب قرار دادن رهبری SIG یا سایر اعضای SIG
- ارسال پیام به کانال Slack تیم SIG
  -راه‌اندازی شده با کانال Slack و رهبری SIG از
    [community sig list][sig-list]
  - اختیاری، به‌صورت مستقیم با استفاده از علامت "@" رهبری SIG یا سایر اعضا را با شناسه‌شان ذکر کردن
  

## اضافه کردن موارد جدید به Milestone


### بررسی Milestone

The members of the [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub team are entrusted with the responsibility of specifying the release
milestone on GitHub artifacts.
اعضای گروه [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
گره github  این مسعولیت را بر عهده داردند که اپدیت ها و artifact  خای جدید را بروز رسانی کنند 
[maintained](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers) بررسی میشنود و اخرین اپدیت های leadership  ها در این جا قرار میگیرینداین گروه توسط 

اضافه کردن مرحله انتشار در حال انجام به  pull request  پس از توقف کد اکیداً ممنوع است، زیرا می‌تواند پایداری نسخه را به خطر بیندازد. قبل از اعمال چنین تغییراتی، باید از سرپرست تیم انتشار و مشاور  تأییدیه گرفته شود.

### ویژگی های اضافه شده

برنامه‌ریزی و تعریف قابلیت‌ها امروزه به شکل‌های مختلفی انجام می‌شود، اما یک مثال رایج ممکن است یک کار بزرگ باشد که در قالب یک [KEP][keps] توصیف شده و دارای وظایف مرتبط در گیت‌هاب است.
زمانی که این برنامه به حالت قابل اجرا می‌رسد و کار روی آن آغاز می‌شود، این قابلیت یا بخش‌هایی از آن برای یک نسخه آینده هدف‌گذاری می‌شود؛ به این صورت که مسائل (Issues) مربوطه در گیت‌هاب ایجاد شده و با استفاده از دستور /milestone در Prow علامت‌گذاری می‌شوند.

در حدود ۴ هفته‌ اول چرخه انتشار، مسئول ارتقاء (Enhancements Lead) در تیم انتشار با گروه‌های SIG و مالکان قابلیت‌ها از طریق گیت‌هاب، اسلک و جلسات SIG تعامل خواهد داشت تا تمام اسناد برنامه‌ریزی مورد نیاز را جمع‌آوری کند.

اگر قصد دارید یک قابلیت (Enhancement) را برای یک نسخه‌ی آینده هدف‌گذاری کنید، گفت‌و‌گو با رهبران گروه SIG خود و مسئول ارتقاء (Enhancements Lead) آن نسخه را آغاز کنید.

###  افزودن آیتم‌ها به لیست مسائل 

مسائل (Issues) با استفاده از دستور /milestone در Prow به‌عنوان هدف‌گذاری‌شده برای یک نسخه مشخص علامت‌گذاری می‌شوند.

رهبر تیم انتشار با عنوان  [Bug Triage Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)و همچنین کل جامعه، مسائل ورودی را زیر نظر گرفته و آن‌ها را دسته‌بندی می‌کنند، همان‌طور که در بخش راهنمای مشارکت‌کنندگان درباره‌ی [issue triage](https://k8s.dev/docs/guide/issue-triage/). توضیح داده شده است.

علامت‌گذاری مسائل (Issues) با نسخه (milestone) دید بهتری به جامعه ارائه می‌دهد تا بدانند یک مسئله کی مشاهده شده و تا چه زمانی جامعه احساس می‌کند باید حل شود. در طول دوره‌ی [Code Freeze][code-freeze]، برای ادغام یک PR حتماً باید یک نسخه (milestone) تعیین شود.

open issue دیگر برای ایجاد یک PR ضروری نیست، اما مسائل باز و PRهای مرتبط باید برچسب‌های هماهنگ داشته باشند. به عنوان مثال، ممکن است یک باگ با اولویت بالا تا زمانی که PR مرتبط آن فقط با برچسب اولویت پایین علامت‌گذاری شده است، ادغام نشود.

### PR افزایش

PRها با استفاده از دستور /milestone در Prow به‌عنوان هدف‌گذاری‌شده برای یک milestone علامت‌گذاری می‌شوند.

این یک الزام مسدودکننده (blocking requirement) در طول Code Freeze است، همان‌طور که در بالا توضیح داده شد.

## سایر برچسب های مورد نیاز

[در اینجا فهرست برچسب‌ها و کاربرد و هدف هر کدام آمده است.](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)

### برچسب SIG Owner

برچسب SIG owner نشان‌دهنده گروه SIG است که در صورت طولانی شدن رسیدگی به یک milestone issue یا نیاز به توجه بیشتر، مسئله به آن‌ها ارجاع داده می‌شود. اگر پس از ارجاع هیچ به‌روزرسانی‌ای صورت نگیرد، ممکن است آن issue به‌صورت خودکار از milestone حذف شود.

این برچسب‌ها با دستور /sig در Prow اضافه می‌شوند. به‌عنوان مثال، برای اضافه کردن برچسبی که نشان دهد SIG Storage مسئول است، کافی است کامنتی با متن /sig storage ارسال کنید.

### الویت برچسب ها 

برچسب‌های Priority برای تعیین مسیر ارجاع (escalation path) قبل از حذف مسائل از release milestone استفاده می‌شوند. همچنین این برچسب‌ها مشخص می‌کنند که آیا انتشار (release) باید تا حل شدن آن مسئله متوقف شود یا خیر.

- `priority/critical-urgent`:هرگز به‌صورت خودکار مسئله را از release milestone خارج نکنید؛ بلکه به‌طور مستمر از طریق تمامی کانال‌های موجود، موضوع را به contributor و SIG ارجاع دهید.
  - به‌عنوان یک مسئله مسدودکننده (release blocking issue) در نظر گرفته می‌شود
  - در طول [Code Freeze][code-freeze] نیازمند به‌روزرسانی روزانه از سوی مالکان issue است.
  - اگر تا پس از انتشار نسخه جزئی کشف نشود، نیاز به انتشار یک patch release خواهد داشت.
- `priority/important-soon`: موضوع را به مالکان issue و SIG owner ارجاع دهید؛ در صورت چندین تلاش ناموفق برای ارجاع، مسئله را از milestone خارج کنید.
  - به‌عنوان یک مسئله مسدودکننده‌ی release در نظر گرفته نمی‌شود.
  - نیاز به انتشار patch release ندارد.
  - پس از گذشت دورهٔ ۴ روزهٔ مهلت (grace period) در طول Code Freeze، به‌طور خودکار از release milestone خارج خواهد شد.
- `priority/important-longterm`: موضوع را به مالکان issue ارجاع دهید؛ پس از یک بار تلاش، مسئله را از milestone خارج کنید.
  - حتی کمتر فوری / بحرانی از `priority/important-soon`
  - از milestone با شدت بیشتری خارج شود نسبت به `priority/important-soon`

### برچسب Kind برای Issue/PR

برچسب kind برای کمک به شناسایی نوع تغییراتی که در طول زمان وارد release می‌شوند استفاده می‌شود. این موضوع به تیم انتشار کمک می‌کند تا درک بهتری از نوع مسائلی که ممکن است در صورت سرعت بالاتر چرخه انتشار از دست بروند، پیدا کند.

برای مسائل هدف‌گذاری‌شده در release، از جمله pull requestها، باید یکی از برچسب‌های kind زیر تنظیم شود:

- `kind/api-change`:افزودن، حذف یا تغییر یک API
- `kind/bug`: یک اشکال تازه کشف شده را برطرف می‌کند.
- `kind/cleanup`: اضافه کردن تست‌ها، ریفکتورینگ، رفع اشکالات قدیمی.
- `kind/design`: مربوط به طراحی
- `kind/documentation`:اسناد را اضافه می کند
- `kind/failing-test`:مورد آزمایشی CI به طور مداوم شکست می‌خورد.
- `kind/feature`: عملکرد جدید.
- `kind/flake`:مورد آزمایشی CI به طور متناوب دچار خطا می‌شود.

[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs
