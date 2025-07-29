---
title: مرجع
approvers:
- xirehat
linkTitle: "مرجع"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

این بخش از مستندات کوبرنتیز شامل ارجاعات است.

<!-- body -->

## مرجع API

* [واژه‌نامه](/docs/reference/glossary/) - فهرستی جامع و استاندارد از اصطلاحات کوبرنتیز

* [مرجع API کوبرنتیز](/docs/reference/kubernetes-api/)
* [مرجع تک‌صفحه‌ای API برای کوبرنتیز {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [استفاده از API کوبرنتیز](/docs/reference/using-api/) - نمای کلی API در کوبرنتیز
* [کنترل دسترسی API](/docs/reference/access-authn-authz/) - جزئیاتی درباره نحوه کنترل دسترسی به API در کوبرنتیز
* [برچسب‌ها، حاشیه‌نویسی‌ها و لکه‌های (Taints) شناخته‌شده](/docs/reference/labels-annotations-taints/)

## کتابخانه‌های client با پشتیبانی رسمی

برای فراخوانی API کوبرنتیز از یک زبان برنامه‌نویسی، می‌توانید از
[کتابخانه‌ها](/docs/reference/using-api/client-libraries/) استفاده کنید.  
کتابخانه‌هایی که به‌طور رسمی پشتیبانی می‌شوند:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)

## خط فرمان

* [kubectl](/docs/reference/kubectl/) - ابزار خط فرمان اصلی برای اجرای دستورها و مدیریت خوشه‌های کوبرنتیز.  
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - راهنمای نحوی برای استفاده از [عبارات JSONPath](https://goessner.net/articles/JsonPath/) با kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - ابزار خط فرمانی برای راه‌اندازی آسان یک خوشه ایمن کوبرنتیز.

## اجزا

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - عامل اصلی‌ای که روی هر گره اجرا می‌شود. kubelet مجموعه‌ای از PodSpecها را می‌گیرد و اطمینان حاصل می‌کند کانتینرهای توصیف‌شده در حال اجرا و سالم هستند.  
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - یک REST API که داده‌های اشیای API مانند پادها، سرویس‌ها و replication controllerها را اعتبارسنجی و پیکربندی می‌کند.  
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - یک Daemon ای که حلقه‌های کنترل اصلی همراه کوبرنتیز را در خود جای داده است.  
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - می‌تواند ارسال ساده جریان TCP/UDP یا ارسال TCP/UDP به‌صورت round-robin را بین مجموعه‌ای از بک‌اندها انجام دهد.  
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - زمان‌بندی‌کننده‌ای که دسترس‌پذیری، عملکرد و ظرفیت را مدیریت می‌کند.  
  * [Scheduler Policies](/docs/reference/scheduling/policies)  
  * [Scheduler Profiles](/docs/reference/scheduling/config#profiles)

* فهرست [ports and protocols](/docs/reference/networking/ports-and-protocols/) که باید روی گره‌های Control Plain و Worker باز باشند

## پیکربندی APIها

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.

این بخش میزبان مستندات APIهای «منتشر نشده» است که برای پیکربندی اجزا یا ابزارهای کوبرنتیز استفاده می‌شوند. اکثر این APIها توسط سرور API به روش RESTful در معرض نمایش قرار نمی‌گیرند، اگرچه برای کاربر یا اپراتور جهت استفاده یا مدیریت یک خوشه ضروری هستند.

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) و
* [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) و
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) و
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
  [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) و 
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)

## پیکربندی API برای kubeadm

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)

## API های خارجی

اینها APIهایی هستند که توسط پروژه کوبرنتیز تعریف شده‌اند، اما توسط پروژه اصلی پیاده‌سازی نشده‌اند:

* [Metrics API (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [Custom Metrics API (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [External Metrics API (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)

## اسناد طراحی

آرشیوی از اسناد طراحی برای قابلیت‌های کوبرنتیز. نقاط شروع خوبی وجود دارد

[معماری کوبرنتیز](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) و
[مرور کلی طراحی کوبرنتیز](https://git.k8s.io/design-proposals-archive).

