---
title: PreferAlignCpusByUncoreCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Якщо увімкнено `PreferAlignCpusByUncoreCache`, а CPU Manager Policy встановлено на `static`, контейнери podʼів `Guaranteed` будуть індивідуально вирівнюватися з групою кешу uncore на основі політики best-effort. Ця функція може оптимізувати продуктивність для певних робочих навантажень, які чутливі до кешу, шляхом мінімізації розподілу CPU між кешами uncore.
