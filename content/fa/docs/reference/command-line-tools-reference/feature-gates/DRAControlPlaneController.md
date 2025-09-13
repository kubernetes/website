---
title: DRAControlPlaneController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.31"

removed: true
---
پشتیبانی از منابع با پارامترهای سفارشی و چرخه عمری که مستقل از Pod است را فعال می‌کند. تخصیص منابع توسط کنترل‌کننده صفحه کنترل درایور منبع انجام می‌شود.
p
