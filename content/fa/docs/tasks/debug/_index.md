---
title: "نظارت، ثبت وقایع و اشکال‌زدایی"
description: راه‌اندازی نظارت و ثبت وقایع برای عیب‌یابی یک خوشه یا اشکال‌زدایی یک برنامه کانتینری.
weight: 40
reviewers:
- xirehat
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: دریافت کمک
---

<!-- overview -->

گاهی اوقات اوضاع خراب می‌شود. این راهنما برای رفع آن‌ها طراحی شده است. شامل دو بخش است:

* [عیب‌یابی برنامه شما](/docs/tasks/debug/debug-application/) – مفید برای کاربرانی که کد خود را در کوبرنتیز مستقر می‌کنند و می‌پرسند چرا برنامه‌شان کار نمی‌کند.  
* [عیب‌یابی خوشه شما](/docs/tasks/debug/debug-cluster/) – مفید برای مدیران خوشه و افرادی که خوشه کوبرنتیزشان دچار مشکل است.  

شما همچنین باید مشکلات شناخته‌شده‌ی [نسخه](https://github.com/kubernetes/kubernetes/releases)‌ای را که استفاده می‌کنید بررسی کنید.

<!-- body -->

## دریافت کمک

اگر هیچ‌یک از راهنماهای بالا پاسخگوی مشکل شما نبود، روش‌های مختلفی برای دریافت کمک از جامعه‌ی کوبرنتیز وجود دارد.

### پرسش‌ها

مستندات این سایت طوری ساختاربندی شده که پاسخ طیف گسترده‌ای از پرسش‌ها را فراهم کند. [مفاهیم](/docs/concepts/) معماری کوبرنتیز و عملکرد هر مولفه را توضیح می‌دهد، در حالی که [نصب](/docs/setup/) دستورالعمل‌های عملی برای شروع کار ارائه می‌کند. [وظایف](/docs/tasks/) نشان می‌دهد چگونه کارهای رایج را انجام دهید، و [آموزش‌ها](/docs/tutorials/) راهنماهای جامع‌تری برای سناریوهای واقعی، صنعتی یا توسعه‌ی انتها به انتها هستند. بخش [مرجع](/docs/reference/) مستندات دقیقی درباره‌ی [API کوبرنتیز](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) و رابط‌های خط فرمان (CLI)، مانند [`kubectl`](/docs/reference/kubectl/)، در اختیار شما قرار می‌دهد.

## کمک! سوال من پوشش داده نشده! الان به کمک نیاز دارم!

### Stack Exchange، Stack Overflow یا Server Fault {#stack-exchange}

اگر سوالاتی مرتبط با **توسعه نرم‌افزار** برای برنامه‌ی کانتینری‌شده‌تان دارید، می‌توانید آن‌ها را در [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) بپرسید.

اگر سوالات کوبرنتیز شما مربوط به **مدیریت خوشه** یا **پیکربندی** است، می‌توانید آن‌ها را در [Server Fault](https://serverfault.com/questions/tagged/kubernetes) مطرح کنید.

همچنین چند سایت خاص دیگر در شبکه‌ی Stack Exchange وجود دارد که ممکن است مکان مناسبی برای پرسش‌های کوبرنتیز در حوزه‌هایی مانند  
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes)،  
[مهندسی نرم‌افزار](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes)  
یا [امنیت اطلاعات (InfoSec)](https://security.stackexchange.com/questions/tagged/kubernetes)  
باشند.

ممکن است شخص دیگری در جامعه قبلاً پرسش مشابهی را مطرح کرده باشد یا بتواند در حل مشکل شما کمک کند.

تیم کوبرنتیز نیز پست‌های با تگ Kubernetes را زیر نظر دارد. اگر هیچ پرسش موجودی کمک نکرد، **لطفاً مطمئن شوید که سوال شما [موضوعی برای Stack Overflow](https://stackoverflow.com/help/on-topic)، [Server Fault](https://serverfault.com/help/on-topic) یا سایت شبکه‌ی Stack Exchange مربوطه است** و قبل از پرسش جدید، راهنمایی‌های [چگونه یک سوال جدید بپرسیم](https://stackoverflow.com/help/how-to-ask) را مطالعه کنید!

### Slack

بسیاری از اعضای جامعه‌ی کوبرنتیز در اسلک کوبرنتیز در کانال `#kubernetes-users` حضور دارند.  
اسلک نیاز به ثبت‌نام دارد؛ شما می‌توانید [درخواست دعوتنامه کنید](https://slack.kubernetes.io)، و ثبت‌نام برای همه باز است. احساس راحتی کنید و هر سوالی دارید بپرسید.  
پس از ثبت‌نام، از طریق مرورگر وب یا اپ اختصاصی اسلک به [سازمان Kubernetes در Slack](https://kubernetes.slack.com) دسترسی پیدا کنید.

وقتی ثبت‌نام کردید، فهرست در حال رشد کانال‌ها را برای موضوعات مختلف مرور کنید. برای مثال، افراد تازه‌وارد به کوبرنتیز ممکن است بخواهند به کانال  
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) بپیوندند. به‌عنوان مثال دیگر، توسعه‌دهندگان باید به کانال  
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors) ملحق شوند.

همچنین کانال‌های زیادی مختص کشورها یا زبان‌های محلی وجود دارد. برای دریافت پشتیبانی و اطلاعات محلی، می‌توانید به این کانال‌ها بپیوندید:

{{< table caption="کانال‌های Slack مختص کشور / زبان" >}}
کشور | کانال
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### انجمن

از پیوستن به انجمن رسمی Kubernetes استقبال می‌شود: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### باگ‌ها و درخواست ویژگی

اگر مشکلی که مشاهده می‌کنید شبیه یک باگ است، یا می‌خواهید یک درخواست قابلیت ثبت کنید، لطفاً از [سیستم پیگیری مسائل در گیت‌هاب](https://github.com/kubernetes/kubernetes/issues) استفاده کنید.

قبل از ثبت یک مسئله، لطفاً در میان مسائل موجود جستجو کنید تا ببینید آیا مشکل شما قبلاً پوشش داده شده است یا خیر.

اگر در حال ثبت یک باگ هستید، لطفاً اطلاعات دقیقی درباره نحوه بازتولید مشکل ارائه دهید، مانند:

* نسخه Kubernetes: `kubectl version`  
* ارائه‌دهنده ابری، توزیع سیستم‌عامل، پیکربندی شبکه و نسخه زمان‌اجرای کانتینر  
* مراحل لازم برای بازتولید مشکل  


