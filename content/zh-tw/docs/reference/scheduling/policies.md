---
title: 排程策略
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
---

<!--
title: Scheduling Policies
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
-->

<!-- overview -->
<!--
In Kubernetes versions before v1.23, a scheduling policy can be used to specify the *predicates* and *priorities* process. For example, you can set a scheduling policy by
running `kube-scheduler --policy-config-file <filename>` or `kube-scheduler --policy-configmap <ConfigMap>`.

This scheduling policy is not supported since Kubernetes v1.23. Associated flags `policy-config-file`, `policy-configmap`, `policy-configmap-namespace` and `use-legacy-policy-config` are also not supported. Instead, use the [Scheduler Configuration](/docs/reference/scheduling/config/) to achieve similar behavior.
-->

在 Kubernetes v1.23 版本之前，可以使用排程策略來指定 *predicates* 和 *priorities* 程序。
例如，可以透過執行 `kube-scheduler --policy-config-file <filename>` 或者
 `kube-scheduler --policy-configmap <ConfigMap>` 設定排程策略。

但是從 Kubernetes v1.23 版本開始，不再支援這種排程策略。
同樣地也不支援相關的 `policy-config-file`、 `policy-configmap`、 `policy-configmap-namespace` 以及 `use-legacy-policy-config` 標誌。
你可以透過使用 [排程配置](/zh-cn/docs/reference/scheduling/config/)來實現類似的行為。

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Learn about [kube-scheduler Configuration](/docs/reference/scheduling/config/)
* Read the [kube-scheduler configuration reference (v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
-->

* 瞭解 [排程](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)。
* 瞭解 [kube-scheduler 配置](/zh-cn/docs/reference/scheduling/config/)。
* 閱讀 [kube-scheduler 配置參考(v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)。

