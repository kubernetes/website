---
title: پاد آینه‌ای (Mirror Pod)
id: mirror-pod
date: 2019-08-06
short_description: >
  یک آبجکت در سرور API که یک پاد استاتیک روی یک kubelet را ردگیری می‌کند.
aka: 
tags:
- fundamental
---
 یک {{< glossary_tooltip text="پاد" term_id="pod" >}} که {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
برای نمایش یک {{< glossary_tooltip text="پاد استاتیک" term_id="static-pod" >}} از آن استفاده می‌کند.

<!--more--> 

وقتی kubelet در پیکربندی خود یک پاد استاتیک را پیدا می‌کند، به‌صورت خودکار تلاش می‌کند
برای آن روی سرور API کوبرنتیز یک آبجکت پاد ایجاد کند. این یعنی پاد روی سرور API
قابل‌مشاهده است، اما از آنجا قابل‌کنترل نیست.

(برای نمونه، حذف کردن یک پاد آینه‌ای باعث نمی‌شود دیمون kubelet اجرای آن را متوقف کند).
