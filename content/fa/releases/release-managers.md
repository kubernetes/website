---
title: مدیران انتشار 
type: docs
---

«مدیران انتشار» یک اصطلاح کلی است که شامل مجموعه‌ای از مشارکت‌کنندگان Kubernetes می‌شود که مسئول نگهداری شاخه‌های انتشار و ایجاد نسخه‌ها با استفاده از ابزارهایی هستند که SIG Release ارائه می‌دهد.

مسئولیت‌های هر نقش در ادامه شرح داده شده است.

- [تماس بگیرید](#contact)
  - [سیاست تحریم امنیتی](#security-embargo-policy)
- [کتاب های راهنما](#handbooks)
- [مدیریت تغیرات](#release-managers)
  - [یک تغیر دهنده شوید ](#becoming-a-release-manager)
- [همکاری جهت میدیریت تغیرات ](#release-manager-associates)
  - [تبدیل شدن به یک همکار مدیر انتشار](#becoming-a-release-manager-associate)
- [سرنخ‌های انتشار SIG](#sig-release-leads)
  - [صندلی](#chairs)
  - [سرنخ های فنی](#technical-leads)

## تماس بگیرید

| لیست پستی | Slack | دید | کاربرد | عضویت |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (channel) / @release-managers (user group) | عمومی | بحث عمومی برای انتشارManagers | Aهمه مدیران انتشار (شامل همکاران و روسای SIG) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | خصوصی | خصوصی بحث برای مدیران انتشار ممتاز | مدیران انتشار، رهبری انتشار SIG |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (channel) / @security-rel-team (user group) | خصوصی | Sهماهنگی انتشار اطلاعات امنیتی با کمیته واکنش امنیتی | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### سیاست تحریم امنیتی

برخی از اطلاعات مربوط به انتشارها مشمول تحریم هستند و ما سیاستی در مورد نحوه اعمال این تحریم‌ها تعریف کرده‌ایم.
لطفا به[Security Embargo Policy](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.
برای اطلاعات بیشتر
[سیاست تحریم امنیتی](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)

## کتاب های راهنما

**توجه: کتابچه‌های راهنمای تیم انتشار وصله (patch) و مدیر (branch) در تاریخ دیگری از حالت تکراری خارج خواهند شد.**

- [تیم انتشار وصله (patch)][handbook-patch-release]
- [مدیران شعب][handbook-branch-mgmt]

## مدیران انتشار  

**توجه:** مستندات ممکن است به تیم انتشار وصله و نقش مدیریت شاخه اشاره داشته باشد. این دو نقش در نقش مدیران انتشار ادغام شده‌اند.

حداقل الزامات برای مدیران انتشار و همکاران مدیر انتشار عبارتند از:

- آشنایی با دستورات پایه یونیکس و توانایی اشکال‌زدایی اسکریپت‌های شل
- آشنایی با گردش‌های کاری کد منبع شاخه‌بندی شده از طریق `git` و موارد مرتبط
  فراخوانی‌های خط فرمان `git`.
- آشنایی عمومی با فضای ابری گوگل (ساخت فضای ابری و ذخیره‌سازی ابری).
- پذیرای درخواست کمک و برقراری ارتباط شفاف است.
-انجمن کوبرنتیز [عضویت][community-membership]

مدیران انتشار مسئول موارد زیر هستند:

- هماهنگی و کاهش انتشارهای Kubernetes:
  - انتشار وصله‌(patch)ها (`x.y.z`، که در آن `z` > 0)
  - نسخه‌های جزئی (`x.y.z`، که `z` = 0)
  - نسخه‌های پیش‌انتشار (آلفا، بتا و نسخه‌های آزمایشی)
  - همکاری با [تیم انتشار][release-team] از طریق هر کدام
  چرخه انتشار
  - تنظیم [زمان‌بندی و آهنگ انتشار پچ‌ها][patches]
- نگهداری شاخه‌های انتشار:
  - بررسی Cherry-picks
  - اطمینان از سالم ماندن شاخه انتشار و عدم وجود وصله ناخواسته
    ادغام می شود
- راهنمایی [همکاران مدیر انتشار](#release-manager-associates) گروه
- توسعه فعال ویژگی‌ها و نگهداری کد در k/release
- حمایت از همکاران و مشارکت‌کنندگان مدیر انتشار از طریق فعالیت‌های فعال
  شرکت در برنامه‌ی buddy
  - ماهانه با همکاران خود در ارتباط باشید و وظایف را به آنها واگذار کنید، به آنها اختیار دهید تا کارها را کاهش دهند
    منتشر شده، و مربی
  - در دسترس بودن برای پشتیبانی از همکاران در جذب مشارکت‌کنندگان جدید، مثلاً
    پاسخ به سوالات و پیشنهاد کار مناسب برای انجام آنها

این تیم گاهی اوقات به‌طور نزدیک با کمیته پاسخ‌گویی به مسائل امنیتی همکاری می‌کند و بنابراین باید از دستورالعمل‌های تعیین‌شده در [فرآیند انتشار امنیتی] پیروی کند[security-release-process].


کنترل‌های دسترسی در گیت‌هاب:[@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)
اشاره‌های گیت‌هاب: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagruner](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### تبدیل شدن به یک مدیر انتشار

برای تبدیل شدن به یک مدیر انتشار (Release Manager)، ابتدا باید به عنوان دستیار مدیر انتشار (Release Manager Associate) فعالیت کرد. دستیاران با فعالیت مستمر در فرآیندهای انتشار طی چند چرخه، به مدیر انتشار ارتقاء می‌یابند و همچنین:

- نشان دادن تمایل به رهبری
- همکاری با مدیران انتشار در زمینه پچ‌ها، برای انتشار نهایی یک نسخه
به طور مستقل
  - از آنجا که انتشارها عملکرد محدودی دارند، ما همچنین سهم قابل توجهی در ارتقای تصویر و سایر وظایف اصلی مهندسی انتشار در نظر می‌گیریم.
- زیر سوال بردن نحوه کار همکاران، ارائه پیشنهاد برای بهبود، جمع‌آوری بازخورد و ایجاد تغییر
- قابل اعتماد بودن و پاسخگو بودن
- گرایش به کارهای پیشرفته‌ای که برای تکمیل به دسترسی و امتیازات سطح مدیر انتشار نیاز دارند

## همکاری برای مدیریت انتشار

همکاران مدیر انتشار، کارآموزان مدیران انتشار هستند که قبلاً به عنوان سایه‌های مدیر انتشار شناخته می‌شدند. آنها مسئول موارد زیر هستند:

- کار انتشار وصله(patch)، بررسی cherry pick
- مشارکت در انتشار k/release: به‌روزرسانی وابستگی‌ها و عادت کردن به کد منبع
- مشارکت در مستندسازی: نگهداری کتابچه‌های راهنما، حصول اطمینان از مستندسازی فرآیندهای انتشار
- با کمک مدیر انتشار: همکاری با تیم انتشار در طول چرخه انتشار و حذف انتشار های kuberntetes
- جستجوی فرصت‌هایی برای کمک به اولویت‌بندی و ارتباطات
  - ارسال پیش‌اعلان‌ها و به‌روزرسانی‌ها در مورد انتشار وصله‌ها
  - به‌روزرسانی تقویم، کمک به تاریخ‌های انتشار و مراحل مهم از 
    [جدول زمانی چرخه انتشار][k-sig-release-releases]
- از طریق برنامه‌ی Buddy، جذب مشارکت‌کنندگان جدید و جفت‌سازی با آنها در انجام وظایف

اشاره‌های گیت‌هاب: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski ([@salaxander](https://github.com/salaxander))

### تبدیل شدن به یک همکار مدیر انتشار
مشارکت‌کنندگان می‌توانند با ارائه موارد زیر به عنوان همکار (همکار) فعالیت کنند:

- مشارکت مداوم، شامل ۶ تا ۱۲ ماه انتشار فعال
کارهای مرتبط با مهندسی
- تجربه انجام نقش سرپرست فنی در تیم انتشار در طول چرخه انتشار
  - این تجربه، مبنای محکمی برای درک چگونگی عملکرد کلی SIG Release فراهم می‌کند - از جمله انتظارات ما در مورد مهارت‌های فنی، ارتباطات/پاسخگویی و قابلیت اطمینان
- کار روی آیتم‌های k/release که تعاملات ما با Testgrid را بهبود می‌بخشند، پاکسازی کتابخانه‌ها و غیره.
  - این تلاش‌ها نیازمند تعامل و همکاری با مدیران انتشار و همکاران است

## سرنخ‌های انتشار SIG

روسای انتشار SIG و سرپرستان فنی مسئول موارد زیر هستند:

- حاکمیت انتشار SIG
- برگزاری جلسات تبادل دانش برای مدیران و همکاران انتشار
- مربیگری در رهبری و اولویت‌بندی

آنها به صراحت در اینجا ذکر شده‌اند، زیرا آنها صاحبان کانال‌های ارتباطی مختلف و گروه‌های مجوز (تیم‌های GitHub، دسترسی GCP) برای هر نقش هستند.به این ترتیب، آنها اعضای جامعه با امتیاز بالا هستند و از برخی ارتباطات خصوصی، که گاهی اوقات می‌تواند مربوط به افشای اطلاعات امنیتی Kubernetes باشد، مطلع می‌باشند.

تیم گیت‌هاب: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### صندلی

- Jeremy Rickard  ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus  ([@justaugustus](https://github.com/justaugustus))

### سرنخ های فنی

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López  ([@verolop](https://github.com/verolop))

---

مدیران شاخه های قبلی، در [فهرست انتشارها] قابل مشاهده هستند.[k-sig-release-releases]
از مخزن kubernetes/sig-release در داخل `release-x.y/release_team.md`.

مثال: [1.15 تیم انتشار](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[عضویت در جامعه]: https://git.k8s.io/community/community-membership.md#member
[دفتر-(branch)-مدیریت-دفترچه]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[کتابچه راهنما-انتشار وصله]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[انتشار k-sig]: https://git.k8s.io/sig-release/releases
[وصله(patch) ها ]: /releases/patch-releases/
[منابع]: https://git.k8s.io/community/committee-security-response/README.md
[تیم توسعه]: https://git.k8s.io/sig-release/release-team/README.md
[فرآیند آزادسازی امنیت]: https://git.k8s.io/security/security-release-process.md

