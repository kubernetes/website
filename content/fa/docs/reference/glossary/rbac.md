---
title: RBAC (Role-Based Access Control)
id: rbac
date: 2018-04-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  تصمیم‌گیری‌های مجوزدهی را مدیریت می‌کند و به مدیران اجازه می‌دهد خط‌مشی‌های دسترسی را به‌صورت پویا از طریق Kubernetes API پیکربندی کنند.

aka: 
tags:
- security
- fundamental
---
 تصمیم‌گیری‌های مجوزدهی را مدیریت می‌کند و به مدیران اجازه می‌دهد خط‌مشی‌های دسترسی را به‌صورت پویا از طریق {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} پیکربندی کنند.

<!--more--> 

RBAC از چهار نوع شیء در کوبرنتیز استفاده می‌کند:

Role  
: قوانین مجوز را در یک فضای نام مشخص تعریف می‌کند.

ClusterRole  
: قوانین مجوز را در سطح کل خوشه تعریف می‌کند.

RoleBinding  
: مجوزهای تعریف‌شده در یک Role را به مجموعه‌ای از کاربران در یک فضای نام مشخص اعطا می‌کند.

ClusterRoleBinding  
: مجوزهای تعریف‌شده در یک ClusterRole را به مجموعه‌ای از کاربران در سطح کل خوشه اعطا می‌کند.

برای اطلاعات بیشتر، [RBAC](/docs/reference/access-authn-authz/rbac/) را ببینید.
