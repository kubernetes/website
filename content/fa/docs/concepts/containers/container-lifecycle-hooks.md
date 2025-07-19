---
reviewers:
- xirehat
title: قلاب‌های چرخه عمر کانتینر
content_type: concept
weight: 40
---

<!-- overview -->

این صفحه توضیح می‌دهد که چگونه کانتینرهای مدیریت‌شده توسط kubelet می‌توانند از چارچوب قلاب چرخه حیات کانتینر برای اجرای کدی که توسط رویدادها در طول چرخه حیات مدیریت آنها ایجاد می‌شود، استفاده کنند.



<!-- body -->

## نمای کلی

مشابه بسیاری از فریم‌ورک‌های زبان‌های برنامه‌نویسی که دارای قلاب‌های چرخه‌عمر مؤلفه هستند، مانند Angular، Kubernetes نیز به کانتینرها قلاب‌های چرخه‌عمر ارائه می‌دهد. این قلاب‌ها به کانتینرها امکان می‌دهند تا از رویدادهای چرخه‌عمر مدیریتی خود آگاه شوند و هنگام اجرای قلاب مربوطه، کدی را که در یک هندلر پیاده‌سازی شده اجرا کنند.

## قلاب‌های کانتینر

دو قلاب وجود دارد که در اختیار کانتینرها قرار می‌گیرند:

`PostStart`

این قلاب بلافاصله پس از ایجاد کانتینر اجرا می‌شود. با این حال، تضمینی وجود ندارد که قلاب قبل از ENTRYPOINT کانتینر اجرا شود. هیچ پارامتری به هندلر ارسال نمی‌شود.

`PreStop`

این قلاب درست قبل از خاتمه کانتینر در اثر یک درخواست API یا رویدادی مدیریتی مانند شکست پروب liveness/startup، پیش‌دستی (preemption)، تداخل منابع و موارد دیگر فراخوانی می‌شود. فراخوانی قلاب `PreStop` در صورتی شکست می‌خورد که کانتینر قبلاً در وضعیت خاتمه‌یافته یا تکمیل‌شده باشد. این قلاب باید قبل از ارسال سیگنال TERM برای متوقف کردن کانتینر تکمیل شود. شمارش معکوس دوره مهلت خاتمه پاد قبل از اجرای قلاب `PreStop` آغاز می‌شود، بنابراین فارغ از نتیجه هندلر، کانتینر در نهایت در دوره مهلت خاتمه پاد متوقف خواهد شد. هیچ پارامتری به هندلر ارسال نمی‌شود.

توضیح دقیق‌تر رفتار خاتمه را می‌توانید در  
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)  
مطالعه کنید.

`StopSignal`

چرخه‌عمر `StopSignal` می‌تواند برای تعریف سیگنال توقفی استفاده شود که هنگام متوقف شدن کانتینر به آن ارسال می‌شود. اگر این مقدار تنظیم شود، هرگونه دستور `STOPSIGNAL` تعریف‌شده در درون ایمیج کانتینر را نادیده می‌گیرد.

توضیح دقیق‌تر رفتار خاتمه با سیگنال‌های توقف سفارشی را می‌توانید در  
[Stop Signals](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-stop-signals)  
مطالعه کنید.

### پیاده‌سازی هندلر قلاب

کانتینرها می‌توانند با پیاده‌سازی و ثبت یک هندلر برای قلاب مربوطه به آن دسترسی پیدا کنند.  
سه نوع هندلر قلاب وجود دارد که می‌توان برای کانتینرها پیاده‌سازی کرد:

* Exec – اجرای یک فرمان مشخص، مانند `pre-stop.sh`، در داخل cgroups و namespaceهای کانتینر.  
  منابع مصرف‌شده توسط این فرمان به حساب کانتینر منظور می‌شوند.  
* HTTP – ارسال یک درخواست HTTP به یک endpoint خاص درون کانتینر.  
* Sleep – ایست موقت کانتینر برای مدت زمان مشخص.  
  این یک ویژگی در سطح بتا است که به‌طور پیش‌فرض با `PodLifecycleSleepAction`  
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) فعال می‌شود.

{{< note >}}
بتا-level feature gate `PodLifecycleSleepActionAllowZero` که از نسخه v1.33 به‌طور پیش‌فرض فعال است،  
به شما اجازه می‌دهد مدت زمان Sleep را صفر ثانیه (عملاً عملیاتی انجام نمی‌شود)  
برای هندلرهای چرخه‌عمر Sleep تنظیم کنید.  
{{< /note >}}

### اجرای هندلر قلاب

وقتی یک قلاب مدیریت چرخه‌عمر کانتینر فراخوانی می‌شود، سیستم مدیریت Kubernetes هندلر را بر اساس نوع عمل قلاب اجرا می‌کند. عملیات‌های `httpGet`، `tcpSocket` ([منسوخ شده](/docs/reference/generated/kubernetes-api/v1.31/#lifecyclehandler-v1-core)) و `sleep` توسط فرآیند kubelet اجرا می‌شوند و `exec` در داخل کانتینر اجرا می‌شود.

فراخوانی هندلر قلاب `PostStart` هنگام ایجاد کانتینر شروع می‌شود، به این معنی که ENTRYPOINT کانتینر و قلاب `PostStart` به‌طور هم‌زمان فعال می‌شوند. با این حال، اگر اجرای قلاب `PostStart` طولانی شود یا در حین اجرا گیر کند، ممکن است مانع از انتقال کانتینر به وضعیت `running` شود.

قلاب‌های `PreStop` به‌صورت ناهمزمان با سیگنال توقف کانتینر اجرا نمی‌شوند؛ قلاب باید اجرای خود را قبل از ارسال سیگنال TERM کامل کند. اگر قلاب `PreStop` در حین اجرا گیر کند، فاز پاد به `Terminating` تغییر می‌کند و تا زمان اتمام دوره `terminationGracePeriodSeconds` و سپس کشته شدن پاد در آن وضعیت باقی می‌ماند. این دوره مهلت شامل مجموع زمانی است که برای اجرای قلاب `PreStop` و متوقف شدن طبیعی کانتینر نیاز است. برای مثال، اگر `terminationGracePeriodSeconds` برابر ۶۰ ثانیه باشد، و قلاب ۵۵ ثانیه و کانتینر ۱۰ ثانیه بعد از دریافت سیگنال برای توقف طبیعی زمان ببرد، کانتینر قبل از توقف طبیعی کشته می‌شود، چون `terminationGracePeriodSeconds` کمتر از مجموع زمان (۵۵+۱۰) است.

اگر هر یک از قلاب‌های `PostStart` یا `PreStop` با شکست مواجه شوند، کانتینر را نابود می‌کنند.

کاربران باید هندلرهای قلاب خود را تا حد ممکن سبک نگه دارند. با این حال، در برخی موارد اجرای فرمان‌های طولانی‌مدت منطقی است، مانند وقتی که لازم است قبل از توقف کانتینر، وضعیت (state) ذخیره شود.

### تضمین تحویل قلاب‌ها

تحویل قلاب قرار است *حداقل یک‌بار* باشد، یعنی ممکن است برای هر رویداد مشخص – مانند `PostStart` یا `PreStop` – قلاب چندین بار فراخوانی شود. مدیریت صحیح این شرایط بر عهده پیاده‌سازی قلاب است.

به‌طور کلی، معمولاً تنها یک‌بار تحویل انجام می‌شود. اگر مثلاً گیرنده HTTP قلاب از کار افتاده و قادر به دریافت درخواست نباشد، تلاشی برای ارسال مجدد صورت نمی‌گیرد. با این حال، در برخی موارد نادر ممکن است تحویل دوگانه رخ دهد. برای مثال، اگر kubelet در میانه ارسال قلاب ری‌استارت شود، ممکن است پس از برگشت، قلاب دوباره ارسال شود.

### اشکال‌زدایی هندلرهای قلاب

لاگ‌های مربوط به هندلر قلاب در رویدادهای پاد نمایش داده نمی‌شوند. اگر به دلیلی اجرای هندلر با شکست مواجه شود، یک رویداد منتشر می‌شود. برای `PostStart` این رویداد `FailedPostStartHook` و برای `PreStop` این رویداد `FailedPreStopHook` است. برای ایجاد دستی یک رویداد `FailedPostStartHook`، فایل [lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml) را ویرایش کرده و فرمان postStart را به `"badcommand"` تغییر دهید و سپس آن را اعمال کنید. در ادامه نمونه‌ای از خروجی رویدادهایی که با اجرای `kubectl describe pod lifecycle-demo` مشاهده می‌کنید آمده است:

```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```



## {{% heading "whatsnext" %}}


* برای کسب اطلاعات بیشتر درباره [محیط کانتینر](/docs/concepts/containers/container-environment/) مطالعه کنید.  
* تجربه عملی به‌دست آورید و با [پیوست هندلرها به رویدادهای چرخه‌عمر کانتینر](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/) کار کنید.  

