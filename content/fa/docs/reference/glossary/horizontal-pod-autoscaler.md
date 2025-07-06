---
title: مقیاس‌دهندهٔ خودکار افقی پاد
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  یک منبع API که تعداد رپلیکای پاد را بر اساس میزان استفادهٔ هدف CPU یا اهداف سفارشی متریک به‌طور خودکار مقیاس می‌کند.

aka: 
- HPA
tags:
- operation
---
 یک منبع API که تعداد رپلیکای {{< glossary_tooltip term_id="pod" >}} را بر اساس میزان استفادهٔ هدف CPU یا اهداف سفارشی متریک به‌طور خودکار مقیاس می‌کند.

<!--more--> 

HPA معمولاً همراه با {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}، {{< glossary_tooltip text="Deployments" term_id="deployment" >}} یا {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} استفاده می‌شود. این قابلیت را نمی‌توان روی اشیائی که قابل مقیاس نیستند اعمال کرد؛ برای مثال {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
