---
# Removed from Kubernetes
title: ExperimentalCriticalPodAnnotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.5"
    toVersion: "1.12"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true  
---
فعال کردن حاشیه‌نویسی پادهای خاص به عنوان *critical*
به طوری که  آنها تضمین شود[scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
این ویژگی از نسخه ۱.۱۳ توسط Pod Priority and Preemption منسوخ شده است.