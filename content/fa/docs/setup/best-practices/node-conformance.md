---
reviewers:
- xirehat
title: اعتبارسنجی تنظیمات گره
weight: 30
---

## تست انطباق گره

*آزمون انطباق گره* یک چارچوب آزمون کانتینری‌شده است که برای یک گره،
راستی‌آزمایی سامانه و آزمون کارکرد فراهم می‌کند. این آزمون بررسی می‌کند
آیا گره حداقل نیازمندی‌های کوبرنتیز را برآورده می‌کند یا نه؛
گره‌ای که این آزمون را با موفقیت پشت سر بگذارد،
صلاحیت پیوستن به یک خوشهٔ کوبرنتیز را دارد.

## پیش‌نیاز گره

هشدارها برای اجرای تست انطباق گره، یک گره باید همان پیش‌نیازهای یک گره استاندارد کوبرنتیز را داشته باشد. حداقل، گره باید سرویس‌های زیر را نصب کرده باشد:

* زمان‌های اجرای کانتینر سازگار با CRI مانند Docker، containerd و CRI-O
* kubelet

## اجرای تست انطباق گره


To run the node conformance test, perform the following steps:

برای اجرای آزمون انطباق گره، مراحل زیر را انجام دهید:

۱. مقدار گزینه `--kubeconfig` را برای kubelet تعیین کنید؛ برای مثال:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
   از آنجا که چارچوب آزمون برای بررسی kubelet یک کنترل‌پلین محلی راه‌اندازی می‌کند،
   از `http://localhost:8080` به‌عنوان نشانی سرور API استفاده کنید.
   چند پارامتر خط فرمان دیگر برای kubelet وجود دارد که ممکن است بخواهید به کار ببرید:

   * `--cloud-provider`: اگر از `--cloud-provider=gce` استفاده می‌کنید،
     این پرچم را برای اجرای آزمون حذف کنید.

۲. آزمون انطباق گره را با فرمان زیر اجرا کنید:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## اجرای تست انطباق گره برای سایر معماری‌ها

کوبرنتیز همچنین ایمیج‌های داکر تست انطباق گره را برای معماری‌های دیگر ارائه می‌دهد:

|  Arch  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## اجرای آزمون انتخاب شده

برای اجرای تست‌های خاص، متغیر محیطی `FOCUS` را با عبارت منظم تست‌هایی که می‌خواهید اجرا کنید، بازنویسی کنید.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  registry.k8s.io/node-test:0.2
```

برای رد کردن تست‌های خاص، متغیر محیطی `SKIP` را با عبارت منظم تست‌هایی که می‌خواهید رد کنید، بازنویسی کنید.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```

آزمون انطباق گره نسخهٔ کانتینری‌شده
[node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)
است و به‌طور پیش‌فرض همه آزمون‌های انطباق را اجرا می‌کند.

از نظر تئوری، اگر کانتینر را به‌درستی پیکربندی کرده و
حجم‌های موردنیاز را مناسب مانت کنید، می‌توانید هر آزمون e2e گره را اجرا کنید.
اما **به‌شدت توصیه می‌شود فقط آزمون انطباق را اجرا کنید**،
زیرا اجرای آزمون‌های غیرانطباق به پیکربندی بسیار پیچیده‌تری نیاز دارد.

## هشدارها

* آزمون تعدادی image داکر را روی گره باقی می‌گذارد؛ از جمله image آزمون انطباق گره و تصاویر
  کانتینرهایی که در آزمون کارکرد استفاده شدند.
* آزمون چند کانتینر مرده را روی گره باقی می‌گذارد. این کانتینرها در طول آزمون کارکرد
  ایجاد می‌شوند.
