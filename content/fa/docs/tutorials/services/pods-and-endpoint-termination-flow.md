---
title: بررسی رفتار خاتمه برای Podها و Endpoint آنها
content_type: tutorial
weight: 60
---


<!-- overview -->

پس از آنکه برنامه خود را طبق مراحلی شبیه به
[اتصال برنامه‌ها به سرویس‌ها](/docs/tutorials/services/connect-applications-service/)
به یک **Service** متصل کردید، اکنون یک برنامه تکرارشونده و همیشه‌درحال‌اجرا دارید که روی یک شبکه در معرض دید قرار گرفته است.  
این آموزش به شما کمک می‌کند جریان خاتمه پادها را بررسی کرده و روش‌های پیاده‌سازی تخلیه تدریجی (graceful connection draining) را بشناسید.

<!-- body -->

## فرایند خاتمه پادها و اندپوینت‌های آن‌ها

اغلب پیش می‌آید که لازم است یک پاد را خاتمه دهید؛ چه برای به‌روزرسانی و چه برای کاهش مقیاس.  
برای بهبود دسترس‌پذیری برنامه، اجرای یک تخلیه صحیحِ اتصال‌های فعال اهمیت دارد.

این آموزش با استفاده از یک وب‌سرور ساده **nginx** برای نمایش مفهوم،  
جریان خاتمه پاد را در ارتباط با وضعیت و حذف اندپوینت متناظر توضیح می‌دهد.

<!-- body -->

## جریان نمونه با خاتمه اندپوینت

آنچه در ادامه می‌آید، جریان نمونه‌ای است که در سند
[خاتمه پادها](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
توصیف شده است.

فرض کنید یک Deployment با تنها یک رپلیکای `nginx`
(صرفاً برای مقاصد نمایشی) و یک Service در اختیار دارید:

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

اکنون پاد Deployment و سرویس را با استفاده از فایل‌های بالا ایجاد کنید:

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

پس از اجرای Pod و Service، می‌توانید نام هر EndpointSlice مرتبط را دریافت کنید:

```shell
kubectl get endpointslice
```

خروجی مشابه این است:

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

می‌توانید وضعیت آن را مشاهده کنید و تأیید کنید که یک نقطه پایانی ثبت شده است:

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

خروجی مشابه این است:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
```

حالا بیایید Pod را خاتمه دهیم و اعتبارسنجی کنیم که Pod با رعایت پیکربندی دوره خاتمه تدریجی خاتمه می‌یابد:

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

همه پادها:

```shell
kubectl get pods
```

خروجی مشابه این است:

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

می‌توانید ببینید که پاد جدید زمان‌بندی شده است.

در حالی که نقطه پایانی جدید برای پاد جدید ایجاد می‌شود، نقطه پایانی قدیمی هنوز در حالت خاتمه است:

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

خروجی مشابه این است:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
```

این کار به برنامه‌ها اجازه می‌دهد در هنگام خاتمه، وضعیت خود را اطلاع دهند  
و کلاینت‌ها (مانند لود بالانسرها) بتوانند قابلیت «تخلیه اتصال» (connection draining) را پیاده کنند.  
چنین کلاینت‌هایی می‌توانند اندپوینت‌های در حال خاتمه را شناسایی کرده و برای آن‌ها منطق ویژه‌ای اعمال کنند.

در کوبرنتیز، اندپوینت‌هایی که در حال خاتمه هستند همیشه وضعیت `ready` آن‌ها روی `false` تنظیم می‌شود.  
این کار برای حفظ سازگاری رو به عقب ضروری است تا لود بالانسرهای موجود از این اندپوینت‌ها برای ترافیک عادی استفاده نکنند.  
اگر نیاز به تخلیه ترافیک روی پاد در حال خاتمه باشد، می‌توان آمادگی واقعی را با شرط `serving` بررسی کرد.

وقتی پادی حذف می‌شود، اندپوینت قدیمی نیز حذف خواهد شد.


## {{% heading "whatsnext" %}}

* بیاموزید چگونه [برنامه‌ها را با سرویس‌ها متصل کنید](/docs/tutorials/services/connect-applications-service/)
* درباره [استفاده از سرویس برای دسترسی به یک برنامه در خوشه](/docs/tasks/access-application-cluster/service-access-application-cluster/) بیشتر بخوانید
* درباره [اتصال یک فرانت‌اند به بک‌اند با استفاده از سرویس](/docs/tasks/access-application-cluster/connecting-frontend-backend/) بیشتر بخوانید
* درباره [ایجاد یک لود بالانسر خارجی](/docs/tasks/access-application-cluster/create-external-load-balancer/) بیشتر بخوانید

