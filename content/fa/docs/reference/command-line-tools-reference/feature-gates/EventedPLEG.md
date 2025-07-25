---
title: EventedPLEG
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
پشتیبانی از kubelet را برای دریافت رویدادهای چرخه عمر کانتینر از {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} از طریق افزونه‌ای به {{<glossary_tooltip term_id="cri" text="CRI">}} فعال کنید.
(PLEG مخفف "Pod lifecycle event generator" است).
برای اینکه این ویژگی مفید باشد، باید پشتیبانی از رویدادهای چرخه عمر کانتینر را در هر زمان اجرای کانتینر که در خوشه شما اجرا می‌شود، فعال کنید. اگر زمان اجرای کانتینر پشتیبانی از رویدادهای چرخه عمر کانتینر را اعلام نکند، kubelet به طور خودکار به مکانیسم عمومی PLEG قدیمی تغییر می‌کند، حتی اگر این دروازه ویژگی را فعال کرده باشید.