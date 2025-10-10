---
title: کتابخانه های کلاینت ها

content_type: concept
weight: 30
---

<!-- overview -->
این صفحه شامل مروری بر کتابخانه‌های کلاینت برای استفاده از API کوبرنتیز از زبان‌های برنامه‌نویسی مختلف است.


<!-- body -->
برای نوشتن برنامه‌ها با استفاده از [Kubernetes REST API](/docs/reference/using-api/)، نیازی نیست که خودتان فراخوانی‌های API و انواع درخواست/پاسخ را پیاده‌سازی کنید. می‌توانید از یک کتابخانه کلاینت برای زبان برنامه‌نویسی مورد استفاده خود استفاده کنید.

کتابخانه‌های کلاینت اغلب وظایف رایجی مانند احراز هویت را برای شما انجام می‌دهند.
اکثر کتابخانه‌های کلاینت می‌توانند حساب سرویس Kubernetes را کشف کرده و از آن برای احراز هویت استفاده کنند، اگر کلاینت API در داخل خوشه Kubernetes در حال اجرا باشد، یا می‌توانند فرمت [kubeconfig file](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) را برای خواندن اعتبارنامه‌ها و آدرس سرور API درک کنند.

## کتابخانه‌های کلاینت Kubernetes که رسماً پشتیبانی می‌شوند

کتابخانه‌های کلاینت زیر رسماً توسط [Kubernetes SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery). نگهداری می‌شوند.

| زبان   | کتابخانه کلایسنت ها  | برنامه ساده |
|------------|----------------|-----------------|
| C          | [github.com/kubernetes-client/c](https://github.com/kubernetes-client/c/) | [browse](https://github.com/kubernetes-client/c/tree/master/examples)
| dotnet     | [github.com/kubernetes-client/csharp](https://github.com/kubernetes-client/csharp) | [browse](https://github.com/kubernetes-client/csharp/tree/master/examples)
| Go         | [github.com/kubernetes/client-go/](https://github.com/kubernetes/client-go/) | [browse](https://github.com/kubernetes/client-go/tree/master/examples)
| Haskell    | [github.com/kubernetes-client/haskell](https://github.com/kubernetes-client/haskell) | [browse](https://github.com/kubernetes-client/haskell/tree/master/kubernetes-client/example)
| Java       | [github.com/kubernetes-client/java](https://github.com/kubernetes-client/java/) | [browse](https://github.com/kubernetes-client/java/tree/master/examples)
| JavaScript | [github.com/kubernetes-client/javascript](https://github.com/kubernetes-client/javascript) | [browse](https://github.com/kubernetes-client/javascript/tree/master/examples)
| Perl       | [github.com/kubernetes-client/perl/](https://github.com/kubernetes-client/perl/) | [browse](https://github.com/kubernetes-client/perl/tree/master/examples)
| Python     | [github.com/kubernetes-client/python/](https://github.com/kubernetes-client/python/) | [browse](https://github.com/kubernetes-client/python/tree/master/examples)
| Ruby       | [github.com/kubernetes-client/ruby/](https://github.com/kubernetes-client/ruby/) | [browse](https://github.com/kubernetes-client/ruby/tree/master/examples)

## کتابخانه‌های کلاینت تحت مدیریت جامعه 

{{% thirdparty-content %}}

کتابخانه‌های کلاینت Kubernetes API زیر توسط نویسندگان آنها ارائه و نگهداری می‌شوند، نه تیم Kubernetes.

| زبان             | کتابخانه کلایسنت ها                         |
| -------------------- | ---------------------------------------- |
| Clojure              | [github.com/yanatan16/clj-kubernetes-api](https://github.com/yanatan16/clj-kubernetes-api) |
| DotNet               | [github.com/tonnyeremin/kubernetes_gen](https://github.com/tonnyeremin/kubernetes_gen) |
| DotNet (RestSharp)   | [github.com/masroorhasan/Kubernetes.DotNet](https://github.com/masroorhasan/Kubernetes.DotNet) |
| Elixir               | [github.com/obmarg/kazan](https://github.com/obmarg/kazan/) |
| Elixir               | [github.com/coryodaniel/k8s](https://github.com/coryodaniel/k8s) |
| Java (OSGi)          | [bitbucket.org/amdatulabs/amdatu-kubernetes](https://bitbucket.org/amdatulabs/amdatu-kubernetes) |
| Java (Fabric8, OSGi) | [github.com/fabric8io/kubernetes-client](https://github.com/fabric8io/kubernetes-client) |
| Java                 | [github.com/manusa/yakc](https://github.com/manusa/yakc) |
| Lisp                 | [github.com/brendandburns/cl-k8s](https://github.com/brendandburns/cl-k8s) |
| Lisp                 | [github.com/xh4/cube](https://github.com/xh4/cube) |
| Node.js (TypeScript) | [github.com/Goyoo/node-k8s-client](https://github.com/Goyoo/node-k8s-client) |
| Node.js              | [github.com/ajpauwels/easy-k8s](https://github.com/ajpauwels/easy-k8s)
| Node.js              | [github.com/godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) |
| Node.js              | [github.com/tenxcloud/node-kubernetes-client](https://github.com/tenxcloud/node-kubernetes-client) |
| Perl                 | [metacpan.org/pod/Net::Kubernetes](https://metacpan.org/pod/Net::Kubernetes) |
| PHP                  | [github.com/allansun/kubernetes-php-client](https://github.com/allansun/kubernetes-php-client) |
| PHP                  | [github.com/maclof/kubernetes-client](https://github.com/maclof/kubernetes-client) |
| PHP                  | [github.com/travisghansen/kubernetes-client-php](https://github.com/travisghansen/kubernetes-client-php) |
| PHP                  | [github.com/renoki-co/php-k8s](https://github.com/renoki-co/php-k8s) |
| Python               | [github.com/cloudcoil/cloudcoil](https://github.com/cloudcoil/cloudcoil) |
| Python               | [github.com/fiaas/k8s](https://github.com/fiaas/k8s) |
| Python               | [github.com/gtsystem/lightkube](https://github.com/gtsystem/lightkube) |
| Python               | [github.com/kr8s-org/kr8s](https://github.com/kr8s-org/kr8s) |
| Python               | [github.com/mnubo/kubernetes-py](https://github.com/mnubo/kubernetes-py) |
| Python               | [github.com/tomplus/kubernetes_asyncio](https://github.com/tomplus/kubernetes_asyncio) |
| Python               | [github.com/Frankkkkk/pykorm](https://github.com/Frankkkkk/pykorm) |
| Ruby                 | [github.com/abonas/kubeclient](https://github.com/abonas/kubeclient) |
| Ruby                 | [github.com/k8s-ruby/k8s-ruby](https://github.com/k8s-ruby/k8s-ruby) |
| Ruby                 | [github.com/kontena/k8s-client](https://github.com/kontena/k8s-client) |
| Rust                 | [github.com/kube-rs/kube](https://github.com/kube-rs/kube) |
| Rust                 | [github.com/ynqa/kubernetes-rust](https://github.com/ynqa/kubernetes-rust) |
| Scala                | [github.com/hagay3/skuber](https://github.com/hagay3/skuber) |
| Scala                | [github.com/hnaderi/scala-k8s](https://github.com/hnaderi/scala-k8s) |
| Scala                | [github.com/joan38/kubernetes-client](https://github.com/joan38/kubernetes-client) |
| Swift                | [github.com/swiftkube/client](https://github.com/swiftkube/client) |
