---
title: برچسب‌های پیشنهادی
content_type: concept
weight: 100
---

<!-- overview -->
می‌توانید اشیای کوبرنتیز را با ابزارهایی فراتر از `kubectl` و داشبورد مشاهده و مدیریت کنید.  
یک مجموعهٔ مشترک از برچسب‌ها به ابزارها اجازه می‌دهد به‌صورت میان‌عملی کار کنند و اشیا را به شیوه‌ای مشترک توصیف کنند که همهٔ ابزارها بتوانند آن را درک کنند.

علاوه بر پشتیبانی از ابزارها، برچسب‌های پیشنهادی برنامه‌ها را به گونه‌ای توصیف می‌کنند که بتوان آن‌ها را جست‌وجو کرد.


<!-- body -->
فرا‌داده حول مفهوم یک _برنامه_ سازمان‌دهی شده است. کوبرنتیز یک پلتفرم به‌عنوان سرویس (PaaS) نیست و مفهوم رسمی‌ای از «برنامه» ندارد و آن را اعمال نمی‌کند. در عوض، برنامه‌ها غیررسمی‌اند و با فرا‌داده توصیف می‌شوند. تعریف این‌که یک برنامه چه چیزهایی را دربر می‌گیرد، انعطاف‌پذیر است.

{{< note >}}
این‌ها برچسب‌های پیشنهادی هستند. استفاده از آن‌ها مدیریت برنامه‌ها را ساده‌تر می‌کند، اما برای هیچ ابزار هسته‌ای الزامی نیست.
{{< /note >}}

برچسب‌ها و حاشیه‌نویس‌های مشترک، پیشوند یکسانی دارند: `app.kubernetes.io`.  
برچسب‌های بدون پیشوند خصوصیِ کاربران‌اند. این پیشوند مشترک اطمینان می‌دهد که برچسب‌های مشترک با برچسب‌های سفارشی کاربر تداخل نداشته باشند.

## برچسب‌ها

برای بهره‌گیری کامل از این برچسب‌ها، باید آن‌ها را روی هر شیء منبع اعمال کنید.

| Key                                 | Description           | Example  | Type |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | The name of the application | `mysql` | string |
| `app.kubernetes.io/instance`        | A unique name identifying the instance of an application | `mysql-abcxyz` | string |
| `app.kubernetes.io/version`         | The current version of the application (e.g., a [SemVer 1.0](https://semver.org/spec/v1.0.0.html), revision hash, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | The component within the architecture | `database` | string |
| `app.kubernetes.io/part-of`         | The name of a higher level application this one is part of | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | The tool being used to manage the operation of an application | `Helm` | string |

برای نشان دادن این برچسب‌ها در عمل، شیء {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} زیر را در نظر بگیرید:

```yaml
# This is an excerpt
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: Helm
```

## برنامه‌ها و نمونه‌های برنامه

یک برنامه می‌تواند یک یا چند بار در یک خوشهٔ کوبرنتیز (و در برخی موارد در همان namespace) نصب شود.  
برای نمونه، می‌توان WordPress را بیش از یک بار نصب کرد؛ به‌گونه‌ای که وب‌سایت‌های مختلف، نصب‌های متفاوتی از WordPress باشند.

نام برنامه و نام نمونهٔ آن به‌طور جداگانه ثبت می‌شوند.  
برای مثال، WordPress دارای `app.kubernetes.io/name` برابر با `wordpress` است، در حالی که نام نمونهٔ آن با `app.kubernetes.io/instance` مشخص می‌شود و مقداری مانند `wordpress-abcxyz` دارد.  
این کار باعث می‌شود هم برنامه و هم نمونهٔ آن قابل شناسایی باشند.  
هر نمونه از یک برنامه باید نام یکتایی داشته باشد.

## مثال‌ها

برای نشان دادن روش‌های گوناگون استفاده از این برچسب‌ها، مثال‌های زیر سطوح مختلفی از پیچیدگی را دارند.

### یک سرویس بی‌حالت ساده

حالت یک سرویس بی‌حالت ساده را که با اشیای `Deployment` و `Service` استقرار یافته در نظر بگیرید.  
دو قطعهٔ زیر نشان می‌دهند که برچسب‌ها چگونه می‌توانند در ساده‌ترین شکل به کار روند.

`Deployment` برای نظارت بر پادهایی که خودِ برنامه را اجرا می‌کنند به کار می‌رود.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

از `Service` برای نمایش برنامه استفاده می‌شود.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

### برنامه وب با یک پایگاه داده

یک برنامهٔ کمی پیچیده‌تر را در نظر بگیرید: یک برنامهٔ وب (WordPress)  
که از یک پایگاه داده (MySQL) استفاده می‌کند و با Helm نصب شده است.  
قطعه‌های زیر آغاز اشیایی را نشان می‌دهند که برای استقرار این برنامه به‌کار می‌روند.

بخش ابتدایی `Deployment` زیر برای WordPress به‌کار می‌رود:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

از `Service` برای نمایش وردپرس استفاده می‌شود:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

MySQL به‌صورت یک `StatefulSet` در دسترس قرار می‌گیرد و برای خودش و همچنین برای برنامهٔ بزرگ‌تری که به آن تعلق دارد، متادیتا دارد:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

از شیء `Service` برای در معرض قرار دادن MySQL به‌عنوان بخشی از WordPress استفاده می‌شود:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

در `StatefulSet` و `Service` مربوط به MySQL مشاهده می‌کنید که اطلاعات مربوط به هر دو، یعنی MySQL و WordPress به‌عنوان برنامهٔ گسترده‌تر، درج شده است.
