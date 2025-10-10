---
# Removed from Kubernetes
title: BlockVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.17"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.21"    

removed: true
---
تعریف و مصرف دستگاه‌های بلوک خام را در Pods فعال کنید.
برای جزئیات بیشتر به [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) مراجعه کنید.