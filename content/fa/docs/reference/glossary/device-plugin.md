---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  افزونه‌های نرم‌افزاری برای دسترسی پادها به دستگاه‌هایی که نیاز به راه‌اندازی یا تنظیمات خاص ارائه‌دهنده دارند
aka:
tags:
- fundamental
- extension
---
 افزونه‌های دستگاه روی worker {{< glossary_tooltip term_id="node" text="گره‌ها">}} اجرا می‌شوند و به {{< glossary_tooltip term_id="pod" text="Podها">}} دسترسی به منابعی مانند سخت‌افزار محلی که نیاز به مراحل اولیه یا راه‌اندازی خاص ارائه‌دهنده دارند را فراهم می‌کنند.

<!--more-->

افزونه‌های دستگاه، منابع را به {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} منتشر می‌کنند، به طوری که پادهای بار کاری(Workloads) بتوانند به ویژگی‌های سخت‌افزاری مربوط به گره‌(node)ای که آن پاد در آن اجرا می‌شود، دسترسی داشته باشند. می‌توانید یک افزونه دستگاه را به عنوان {{< glossary_tooltip term_id="daemonset" >}} مستقر کنید، یا نرم‌افزار افزونه دستگاه را مستقیماً روی هر گره هدف نصب کنید.

برای اطلاعات بیشتر به [افزونه‌های دستگاه](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) مراجعه کنید.
