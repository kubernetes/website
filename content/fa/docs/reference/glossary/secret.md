---
title: Secret
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  اطلاعات حساس مانند گذرواژه‌ها، توکن‌های OAuth و کلیدهای SSH را ذخیره می‌کند.

aka:
tags:
- core-object
- security
---
 اطلاعات حساس مانند گذرواژه‌ها، توکن‌های OAuth و کلیدهای SSH را ذخیره می‌کند.

<!--more-->

Secret‌ها کنترل بیشتری بر نحوهٔ استفاده از اطلاعات حساس در اختیار شما می‌گذارند و
خطر افشای تصادفی را کاهش می‌دهند. مقادیر Secret به‌صورت رشته‌های base64 کدگذاری می‌شوند و
به‌طور پیش‌فرض بدون رمزنگاری ذخیره می‌شوند، اما می‌توان آن‌ها را طوری پیکربندی کرد که
[در حالت سکون رمزنگاری شوند](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).

یک {{< glossary_tooltip text="Pod" term_id="pod" >}} می‌تواند به روش‌های گوناگون به Secret ارجاع دهد؛
برای نمونه از طریق ماونت یک وُلِیوم یا به‌صورت متغیر محیطی.
Secretها برای داده‌های محرمانه طراحی شده‌اند و
[ConfigMapها](/docs/tasks/configure-pod-container/configure-pod-configmap/)
برای داده‌های غیرمحرمانه در نظر گرفته شده‌اند.
