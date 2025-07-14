---
title: پیکربندی دسترسی به چند خوشه
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: پیکربندی دسترسی به خوشه ها
---

<!-- overview -->

این صفحه نحوه پیکربندی دسترسی به چندین خوشه را با استفاده از پوشه های پیکربندی نشان می‌دهد. پس از اینکه خوشه‌ها، کاربران و زمینه‌های شما در یک یا چند پوشه پیکربندی تعریف شدند، می‌توانید با استفاده از دستور `kubectl config use-context` به سرعت بین خوشه‌ها جابجا شوید.

{{< توجه >}}
پوشه ای که برای پیکربندی دسترسی به یک خوشه استفاده می‌شود، گاهی اوقات *پوشه kubeconfig* نامیده می‌شود. این یک روش عمومی برای اشاره به پوشه های پیکربندی است. این به این معنی نیست که پوشه ای با نام `kubeconfig` وجود دارد.
{{< /توجه >}}


{{< هشدار >}}
فقط از پوشه های kubeconfig از منابع معتبر استفاده کنید. استفاده از یک پوشه  kubeconfig که به طور خاص ساخته شده است، می‌تواند منجر به اجرای کد مخرب یا افشای پوشه شود. اگر مجبور به استفاده از یک پوشه kubeconfig نامعتبر هستید، ابتدا آن را با دقت بررسی کنید، دقیقاً مانند یک اسکریپت پوسته.
{{< /هشدار>}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

برای بررسی نصب بودن {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}، دستور `kubectl version --client` را اجرا کنید. نسخه kubectl باید در سرور API خوشه شما باشد.

<!-- steps -->

## تعریف خوشه‌ها، کاربران و زمینه‌ها

فرض کنید دو خوشه دارید، یکی برای کارهای توسعه و یکی برای کارهای تست. در خوشه «توسعه»، توسعه‌دهندگان frontend شما در یک فضای نام به نام «frontend» کار می‌کنند و توسعه‌دهندگان storage شما در یک فضای نام به نام «storage» کار می‌کنند. در خوشه «تست»، توسعه‌دهندگان در فضای نام پیش‌فرض کار می‌کنند یا فضاهای نام کمکی را به دلخواه خود ایجاد می‌کنند. دسترسی به خوشه توسعه نیاز به احراز هویت از طریق certificate دارد. دسترسی به خوشه تست نیاز به احراز هویت از طریق نام کاربری و رمز عبور دارد.

یک پرونده با نام `config-exercise` ایجاد کنید. در پرونده `config-exercise` خود، پوشه ای با نام `config-demo` با محتوای زیر ایجاد کنید:

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: test

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-test
```

یک پوشه پیکربندی، خوشه‌ها، کاربران و زمینه‌ها را توصیف می‌کند. پوشه `config-demo` شما چارچوبی برای توصیف دو خوشه، دو کاربر و سه زمینه دارد.

به پوشه `config-exercise` خود بروید. این دستورات را برای اضافه کردن جزئیات خوشه به پرونده پیکربندی خود وارد کنید:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

جزئیات کاربر را به پرونده پیکربندی خود اضافه کنید:

{{< احتیاط >}}
ذخیره رمزهای عبور در پیکربندی کلاینت کوبرنتیز خطرناک است. یک جایگزین بهتر، استفاده از یک افزونه اعتبارنامه و ذخیره جداگانه آنها است. به این لینک مراجعه کنید: [افزونه‌های اعتبارسنجی client-go](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
{{< /احتیاط >}}

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< توجه >}}
- برای حذف یک کاربر می‌توانید دستور `kubectl --kubeconfig=config-demo config unset users.<name>` را اجرا کنید.
- برای حذف یک خوشه، می‌توانید دستور `kubectl --kubeconfig=config-demo config unset clusters.<name>` را اجرا کنید.
- برای حذف یک زمینه، می‌توانید دستور `kubectl --kubeconfig=config-demo config unset contexts.<name>` را اجرا کنید.
{{< /توجه >}}

جزئیات زمینه را به پرونده پیکربندی خود اضافه کنید:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

برای مشاهده جزئیات اضافه شده، پرونده `config-demo` خود را باز کنید. به عنوان جایگزینی برای باز کردن پرونده `config-demo`، می‌توانید از دستور `config view` استفاده کنید.

```shell
kubectl config --kubeconfig=config-demo view
```

خروجی، دو خوشه، دو کاربر و سه زمینه را نشان می‌دهد:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # یادداشت مستندات (این نظر بخشی از خروجی دستور نیست).
    # ذخیره رمزهای عبور در پیکربندی کلاینت کوبرنتیز خطرناک است.
    # یک جایگزین بهتر، استفاده از یک افزونه اعتبارسنجی است.
    # و اعتبارنامه‌ها را جداگانه ذخیره کنید.
    # به https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins مراجعه کنید
    password: some-password
    username: exp
```

«fake-ca-file»، «fake-cert-file» و «fake-key-file» در بالا، محل قرارگیری نام‌های مسیر پرونده های گواهی هستند. شما باید این موارد را به نام‌های مسیر واقعی پرونده های گواهی در محیط خود تغییر دهید.

گاهی اوقات ممکن است بخواهید به جای پرونده های گواهی جداگانه، از داده‌های کدگذاری‌شده با Base64 که در اینجا جاسازی شده‌اند استفاده کنید؛ در این صورت باید پسوند `-data` را به کلیدها اضافه کنید، برای مثال، `certificate-authority-data`، `client-certificate-data`، `client-key-data`.

هر زمینه یک سه‌گانه (خوشه، کاربر، فضای نام) است. برای مثال، زمینه‌ی `dev-frontend` می‌گوید: "از اعتبارنامه‌های کاربر `developer` برای دسترسی به فضای نام `frontend` خوشه‌ی `development` استفاده کنید".

زمینه فعلی را تنظیم کنید:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

اکنون هر زمان که دستور `kubectl` را وارد کنید، این اقدام به خوشه و فضای نامی که در زمینه `dev-frontend` ذکر شده است، اعمال می‌شود. و این دستور از اعتبارنامه‌های کاربر ذکر شده در زمینه `dev-frontend` استفاده خواهد کرد.

برای دیدن فقط اطلاعات پیکربندی مرتبط با زمینه فعلی، از پرچم `--minify` استفاده کنید.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

خروجی، اطلاعات پیکربندی مرتبط با زمینه‌ی `dev-frontend` را نشان می‌دهد:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

حالا فرض کنید می‌خواهید مدتی در خوشه تست کار کنید.

زمینه فعلی را به "exp-test" تغییر دهید:

```shell
kubectl config --kubeconfig=config-demo use-context exp-test
```

اکنون هر دستور `kubectl` که شما بدهید، روی فضای نام پیش‌فرض خوشه `test` اعمال خواهد شد. و این دستور از اعتبار کاربری فهرست شده در زمینه «exp-test» استفاده می کند.

پیکربندی مرتبط با زمینه فعلی جدید، `exp-test` را مشاهده کنید.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

در نهایت، فرض کنید می‌خواهید مدتی در فضای نام `storage` از خوشه `development` کار کنید.

زمینه فعلی را به `dev-storage` تغییر دهید:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

پیکربندی مرتبط با زمینه فعلی جدید، `dev-storage`، را مشاهده کنید.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## ایجاد پرونده پیکربندی دوم

در پوشه‌ی `config-exercise` خود، پیونده ای با نام `config-demo-2` با محتوای زیر ایجاد کنید:

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

پرونده پیکربندی قبلی یک زمینه جدید به نام 'dev-ramp-up' را تعریف می کند.

## متغیر محیطی KUBECONFIG را تنظیم کنید

ببینید آیا متغیر محیطی با نام `KUBECONFIG` دارید یا خیر. در این صورت، مقدار فعلی متغیر محیطی `KUBECONFIG` خود را ذخیره کنید تا بتوانید بعداً آن را بازیابی کنید. برای مثال:

### لینوکس

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### PowerShell ویندوز

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

 متغیر محیطی `KUBECONFIG` فهرستی از مسیرها به پرونده های پیکربندی است. این فهرست برای لینوکس و مک با دونقطه و برای ویندوز با نقطه ویرگول جدا شده است. اگر یک متغیر محیطی `KUBECONFIG` دارید، با پرونده های پیکربندی موجود در فهرست آشنا شوید.

به طور موقت دو مسیر به متغیر محیطی `KUBECONFIG` خود اضافه کنید. برای مثال:

### لینوکس

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### PowerShell ویندوز

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

در پوشه‌ی `config-exercise` خود، این دستور را وارد کنید:

```shell
kubectl config view
```

خروجی، اطلاعات ادغام‌شده از تمام پرونده های فهرست‌شده در متغیر محیطی `KUBECONFIG` شما را نشان می‌دهد. به‌طور خاص، توجه داشته باشید که اطلاعات ادغام‌شده دارای زمینه `dev-ramp-up` از پرونده `config-demo-2` و سه زمینه از پرونده `config-demo` هستند:

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

برای اطلاعات بیشتر در مورد نحوه ادغام پرونده های kubeconfig، به [سازماندهی دسترسی خوشه‌ای با استفاده از پرونده های kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) مراجعه کنید.

## پوشه $HOME/.kube را بررسی کنید

اگر از قبل یک خوشه دارید و می‌توانید از `kubectl` برای تعامل با خوشه استفاده کنید، احتمالاً پرونده ای با نام `config` در پوشه `$HOME/.kube` دارید.

به `$HOME/.kube` بروید و ببینید چه پرونده هایی آنجا هستند. معمولاً پرونده ای با نام `config` وجود دارد. ممکن است پرونده های پیکربندی دیگری نیز در این پوشه وجود داشته باشد. به طور خلاصه با محتوای این پرونده ها آشنا شوید.

## $HOME/.kube/config‎ را به متغیر محیطی KUBECONFIG خود اضافه کنید.

اگر پرونده `$HOME/.kube/config` دارید و در متغیر محیطی `KUBECONFIG` شما فهرست نشده است، همین حالا آن را به متغیر محیطی `KUBECONFIG` خود اضافه کنید. برای مثال:

### لینوکس

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### PowerShell ویندوز

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

اطلاعات پیکربندی ادغام‌شده از تمام پرونده هایی که اکنون در متغیر محیطی `KUBECONFIG` شما فهرست شده‌اند را مشاهده کنید. در پوشه config-exercise خود، دستور زیر را وارد کنید:

```shell
kubectl config view
```

## پاکسازی

متغیر محیطی `KUBECONFIG` خود را به مقدار اصلی آن برگردانید. برای مثال:<br>

### لینوکس

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

### PowerShell ویندوز

```powershell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## موضوع نمایش داده شده توسط kubeconfig را بررسی کنید

همیشه مشخص نیست که پس از احراز هویت در خوشه، چه ویژگی‌هایی (نام کاربری، گروه‌ها) دریافت خواهید کرد. اگر همزمان بیش از یک خوشه را مدیریت کنید، این موضوع می‌تواند چالش‌برانگیزتر هم باشد.

یک زیردستور `kubectl` برای بررسی ویژگی‌های موضوع، مانند نام کاربری، برای زمینه کلاینت کوبرنتیز انتخابی شما وجود دارد: `kubectl auth whoami`.

برای کسب اطلاعات بیشتر در این مورد، [دسترسی API به اطلاعات احراز هویت برای یک کلاینت](/docs/reference/access-authn-authz/authentication/#self-subject-review) را مطالعه کنید.


## {{% heading "whatsnext" %}}

* [سازماندهی دسترسی به خوشه با استفاده از پرونده‌های kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [پیکربندی kubectl](/docs/reference/generated/kubectl/kubectl-commands#config)

