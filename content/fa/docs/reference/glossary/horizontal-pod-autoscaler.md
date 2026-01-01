---
title: مقیاس‌گذاری افقی خودکار پادها
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  یک منبع API که به طور خودکار تعداد رونوشت (copy)های پاد را بر اساس میزان استفاده هدفمند از CPU یا اهداف متریک سفارشی، مقیاس‌بندی می‌کند.

aka: 
- HorizontalPodAutoscaler
- HPA
tags:
- operation
---
 یک منبع API که به طور خودکار تعداد رونوشت های {{< glossary_tooltip term_id="pod" >}} را بر اساس میزان استفاده هدفمند از CPU یا اهداف متریک سفارشی، مقیاس‌بندی می‌کند.

<!--more--> 

HPA معمولاً با {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}، {{< glossary_tooltip text="Deployments" term_id="deployment" >}}، یا {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} استفاده می‌شود. این روش را نمی‌توان روی اشیایی که قابلیت مقیاس‌بندی ندارند، مثلاً {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}، اعمال کرد.

