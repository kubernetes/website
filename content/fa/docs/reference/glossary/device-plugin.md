---
title: افزونه دستگاه
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  افزونه‌های نرم‌افزاری برای دسترسی پادها به دستگاه‌هایی که نیاز به راه‌اندازی یا تنظیمات خاص فروشنده دارند
aka:
tags:
- fundamental
- extension
---
 افزونه‌های دستگاه بر روی گره‌های {{< glossary_tooltip term_id="node" text="Nodes">}} اجرا می‌شوند و به {{< glossary_tooltip term_id="pod" text="Pods">}} دسترسی به منابعی مانند سخت‌افزار محلی که نیازمند مراحل راه‌اندازی یا پیکربندی خاص فروشنده است را فراهم می‌کنند.

<!--more-->

افزونه‌های دستگاه منابع را به {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} اعلام می‌کنند تا Pod‌های کاری بتوانند از ویژگی‌های سخت‌افزاری مربوط به گره‌ای که آن Pod روی آن اجرا می‌شود استفاده کنند. شما می‌توانید یک افزونه دستگاه را به‌صورت {{< glossary_tooltip term_id="daemonset" >}} مستقر کنید یا نرم‌افزار افزونه دستگاه را مستقیماً روی هر گره هدف نصب نمایید.

برای اطلاعات بیشتر به
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
مراجعه کنید.
