---
title: KubeletCgroupDriverFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
گزینه تشخیص پیکربندی درایور cgroup در kubelet را از {{<glossary_tooltip term_id="cri" text="CRI">}} فعال کنید.
شما می‌توانید از این feature gate روی گره‌هایی با kubelet که از feature gate پشتیبانی می‌کند و جایی که یک زمان اجرای کانتینر CRI وجود دارد که از فراخوانی `RuntimeConfig` CRI پشتیبانی می‌کند، استفاده کنید. اگر CRI و kubelet هر دو از این ویژگی پشتیبانی کنند، kubelet تنظیمات پیکربندی `cgroupDriver` (یا آرگومان خط فرمان منسوخ شده `--cgroup-driver`) را نادیده می‌گیرد. اگر این feature gate را فعال کنید و زمان اجرای کانتینر از آن پشتیبانی نکند، kubelet به استفاده از درایور پیکربندی شده با استفاده از تنظیمات پیکربندی `cgroupDriver` برمی‌گردد.
برای جزئیات بیشتر به [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver) مراجعه کنید.