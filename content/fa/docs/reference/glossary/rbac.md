---
title: RBAC (کنترل دسترسی مبتنی بر نقش - Role-Based Access Control)
id: rbac
date: 2018-04-12
full_link: /fa/docs/reference/access-authn-authz/rbac/
short_description: >
  تصمیم‌های مجوزدهی را مدیریت می‌کند و به مدیران اجازه می‌دهد از طریق API کوبرنتیز سیاست‌های دسترسی را به‌صورت پویا پیکربندی کنند.

aka: 
tags:
- security
- fundamental
---
 تصمیم‌های مجوزدهی (Authorization) را مدیریت می‌کند و به مدیران اجازه می‌دهد از طریق {{< glossary_tooltip term_id="kubernetes-api" >}} به‌صورت پویا سیاست‌های دسترسی را پیکربندی کنند.

<!--more--> 

RBAC از چهار نوع آبجکت کوبرنتیز استفاده می‌کند:

Role
: قوانین مجوز (permission) را در یک فضای‌نام مشخص تعریف می‌کند.

ClusterRole
: قوانین مجوز (permission) را در سطح سراسر کلاستر تعریف می‌کند.

RoleBinding
: مجوزهای (permission) تعریف‌شده در یک Role را به مجموعه‌ای از کاربران در یک namespace مشخص اعطا می‌کند.

ClusterRoleBinding
: مجوزهای (permission) تعریف‌شده در یک Role را به مجموعه‌ای از کاربران در سراسر کلاستر اعطا می‌کند.

برای اطلاعات بیشتر، به [RBAC](/fa/docs/reference/access-authn-authz/rbac/) مراجعه کنید.
