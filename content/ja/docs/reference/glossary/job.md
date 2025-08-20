---
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  完了まで実行される有限またはバッチのタスク。

aka: 
tags:
- fundamental
- core-object
- workload
---
完了まで実行される有限またはバッチのタスク。

<!--more--> 

1つ以上の{{<glossary_tooltip term_id="pod">}}オブジェクトを作成し、指定した数のPodオブジェクトが正常に終了することを保証します。Podが正常に完了すると、ジョブは正常な完了を追跡します。
