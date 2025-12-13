---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
این دروازه ویژگی، نقطه‌ای را کنترل می‌کند که در آن یک مقدار پیش‌فرض برای
`.spec.containers[*].ports[*].hostPort`
برای Podها با استفاده از `hostNetwork: true` اختصاص داده می‌شود. پیش‌فرض از Kubernetes نسخه ۱.۲۸ این است که فقط یک مقدار پیش‌فرض در Podها تنظیم شود.
فعال کردن این به این معنی است که یک مقدار پیش‌فرض حتی به `.spec` یک `[PodTemplate](/docs/concepts/workloads/pods/#pod-templates) تعبیه‌شده (برای مثال، در یک Deployment) اختصاص داده می‌شود، که روشی است که نسخه‌های قدیمی‌تر Kubernetes کار می‌کردند.
شما باید کد خود را مهاجرت دهید تا به رفتار قدیمی متکی نباشد.