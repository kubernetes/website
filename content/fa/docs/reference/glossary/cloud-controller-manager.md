---
title: مدیر کنترلر ابری (Cloud Controller Manager)
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  مولفه control plane که کوبرنتیز را با ارائه دهندگان ابری شخص ثالث ادغام می‌کند.
aka: 
tags:
- architecture
- operation
---
 یک مولفه کوبرنتیز {{< glossary_tooltip text="control plane" term_id="control-plane" >}} که منطق کنترل مختص ابر را در خود جای می‌دهد. مدیر کنترل‌کننده ابری به شما امکان می‌دهد کلاستر خود را به API ارائه‌دهنده ابر خود پیوند دهید و مولفه‌هایی را که با آن پلتفرم ابر در تعامل هستند از مولفه‌هایی که فقط با کلاستر شما در تعامل هستند جدا می‌کند.

<!--more-->

با جدا کردن منطق قابلیت همکاری بین کوبرنتیز و زیرساخت ابری زیربنایی، مؤلفه‌ی cloud-controller-manager، ارائه‌دهندگان ابر را قادر می‌سازد تا ویژگی‌ها را با سرعتی متفاوت در مقایسه با پروژه اصلی کوبرنتیز منتشر کنند.

