---
title: Job
id: job
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/job/
short_description: >
  Job 是需要运行完成的确定性的或批量的任务。

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
Job 是需要运行完成的确定性的或批量的任务。

<!--more--> 

<!--
Creates one or more {{< glossary_tooltip term_id="pod" >}} objects and ensures that a specified number of them successfully terminate. As Pods successfully complete, the Job tracks the successful completions.
-->
创建一个或多个 {{< glossary_tooltip term_id="Pod" >}} 对象，并确保指定数量的 Pod 成功终止。
随着各 Pod 成功结束，Job 会跟踪记录成功完成的个数。
