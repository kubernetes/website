---
title: ServiceIPStaticSubrange
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.24"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.25"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"    

removed: true  
---
یک استراتژی برای تخصیص IP کلاستر سرویس‌ها فعال می‌کند، که به موجب آن محدوده IP کلاستر تقسیم می‌شود. آدرس‌های IP کلاستر پویا ترجیحاً از محدوده بالایی تخصیص داده می‌شوند و به کاربران اجازه می‌دهند IPهای کلاستر استاتیک را از محدوده پایینی با ریسک کم تصادم اختصاص دهند. برای جزئیات بیشتر به [Avoiding collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions) مراجعه کنید.