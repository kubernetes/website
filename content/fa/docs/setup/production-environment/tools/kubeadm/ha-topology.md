---
reviewers:
- چرخه حیات cluster sig
title: گزینه‌هایی برای توپولوژی با دسترسی بالا
content_type: مفهوم
weight: 50
---

<!-- overview -->
این صفحه دو گزینه برای پیکربندی توپولوژی کلاستر ‌ های Kubernetes با دسترسی بالا (HA) شما را توضیح می‌دهد.

شما می‌توانید یک کلاستر HA راه‌اندازی کنید:



- با control plane nodes انباشته، که در آن گره‌های etcd با  control plane nodes در یک مکان قرار دارند.
- با  control plane nodes etcd خارجی، که در آن etcd روی nodes جداگانه‌ای از صفحه کنترل اجرا می‌شود.

قبل از راه‌اندازی یک کلاستر HA، باید مزایا و معایب هر توپولوژی را به دقت بررسی کنید.


{{< note >}}
kubeadm cluster etcd را به صورت ایستا بوت‌استرپ می‌کند. برای جزئیات بیشتر، etcd [Clustering Guide](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static) را مطالعه کنید.
{{< /note >}}

<!-- body -->

## Stacked etcd topology


یک cluster HA انباشته‌شده، [topology](https://en.wikipedia.org/wiki/Network_topology) است که در آن cluster ذخیره‌سازی داده‌های توزیع‌شده ارائه شده توسط etcd، روی cluster تشکیل‌شده توسط nodes مدیریت‌شده توسط kubeadm که اجزای control plane را اجرا می‌کنند، انباشته می‌شود.


هرontrol plane node ، نمونه‌ای از `kube-apiserver`، `kube-scheduler` و `kube-controller-manager` را اجرا می‌کند. `kube-apiserver` با استفاده از یک متعادل‌کننده بار، در معرض گره‌های کارگر قرار می‌گیرد.


هر control plane node یک عضو محلی etcd ایجاد می‌کند و این عضو etcd فقط با `kube-apiserver` این گره ارتباط برقرار می‌کند. همین امر در مورد نمونه‌های محلی `kube-controller-manager` و `kube-scheduler` نیز صدق می‌کند.


این توپولوژی، سطوح کنترل و اعضای etcd را در nodes یکسان جفت می‌کند. راه‌اندازی آن ساده‌تر از یک کلاستر با nodes etcd خارجی است و مدیریت تکثیر آن نیز ساده‌تر است.

با این حال، یک کلاستر, خطر اتصال ناموفق را به همراه دارد. اگر یک گره از کار بیفتد، هم عضو etcd و هم یک نمونه control plane از دست می‌روند و افزونگی به خطر می‌افتد. می‌توانید با اضافه کردن control plane nodes بیشتر، این خطر را کاهش دهید.


بنابراین، شما باید حداقل سه control plane nodes انباشته شده را برای یک کلاستر HA اجرا کنید.


این توپولوژی پیش‌فرض در kubeadm است. یک عضو محلی etcd هنگام استفاده از `kubeadm init` و `kubeadm join --control-plane` به طور خودکار روی control plane nodes ایجاد می‌شود.


![Stacked etcd topology](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## توپولوژی etcd خارجی


یک cluster HA با etcd خارجی، یک توپولوژی است [topology](https://en.wikipedia.org/wiki/Network_topology) که در آن cluster ذخیره‌سازی داده‌های توزیع‌شده ارائه شده توسط etcd، خارج از cluster تشکیل‌شده توسط nodes است که اجزای ontrol plane را اجرا می‌کنند.

مانند توپولوژی پشته‌ای etcd، هرcontrol plane node در توپولوژی etcd خارجی، نمونه‌ای از `kube-apiserver`، `kube-scheduler` و `kube-controller-manager` را اجرا می‌کند. و `kube-apiserver` با استفاده از یک متعادل‌کننده بار در معرض گره‌های کارگر قرار می‌گیرد. با این حال، اعضای etcd روی میزبان‌های جداگانه اجرا می‌شوند و هر میزبان etcd با `kube-apiserver` هر control plane node ارتباط برقرار می‌کند.


این توپولوژی،control plane و عضو etcd را از هم جدا می‌کند. بنابراین، یک تنظیمات HA فراهم می‌کند که در آن از دست دادن یک نمونه control plane یا یک عضو etcd تأثیر کمتری دارد و به اندازه توپولوژی HA انباشته، بر افزونگی خوشه تأثیر نمی‌گذارد.

با این حال، این توپولوژی به دو برابر تعداد میزبان‌ها نسبت به توپولوژی HA پشته‌ای نیاز دارد.
برای یک کلاستر HA با این توپولوژی، حداقل سه میزبان برای گره‌های صفحه کنترل و سه میزبان برای گره‌های etcd مورد نیاز است.

![External etcd topology](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Set up a highly available cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
