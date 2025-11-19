---
title: Job
id: job
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/job/
short_description: >
  Job 是需要運行完成的確定性的或批量的任務。

aka: 
tags:
- fundamental
- core-object
- workload
---

<!--
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  A finite or batch task that runs to completion.

aka: 
tags:
- fundamental
- core-object
- workload
-->

<!--
 A finite or batch task that runs to completion.
-->
Job 是需要運行完成的確定性的或批量的任務。

<!--more--> 

<!--
Creates one or more {{< glossary_tooltip term_id="pod" >}} objects and ensures that a specified number of them successfully terminate. As Pods successfully complete, the Job tracks the successful completions.
-->
創建一個或多個 {{< glossary_tooltip term_id="Pod" >}} 對象，並確保指定數量的 Pod 成功終止。
隨着各 Pod 成功結束，Job 會跟蹤記錄成功完成的個數。
