---
title: DisableAllocatorDualWrite
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---
شما می‌توانید قابلیت `MultiCIDRServiceAllocator` را فعال کنید. سرور API از مهاجرت از تخصیص‌دهنده‌های قدیمی ClusterIP با نگاشت بیتی به تخصیص‌دهنده‌های جدید IPAddress پشتیبانی می‌کند.
سرور API یک نوشتن دوگانه روی هر دو تخصیص‌دهنده انجام می‌دهد. این قابلیت، نوشتن دوگانه روی تخصیص‌دهنده‌های جدید Cluster IP را غیرفعال می‌کند؛ اگر مرحله مربوط به مهاجرت را تکمیل کرده‌اید، می‌توانید این قابلیت را فعال کنید.