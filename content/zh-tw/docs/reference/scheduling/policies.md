---
title: 調度策略
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
weight: 30
---

<!--
title: Scheduling Policies
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
weight: 30
-->

<!-- overview -->

<!--
In Kubernetes versions before v1.23, a scheduling policy can be used to specify the *predicates* and *priorities* process. For example, you can set a scheduling policy by
running `kube-scheduler --policy-config-file <filename>` or `kube-scheduler --policy-configmap <ConfigMap>`.

This scheduling policy is not supported since Kubernetes v1.23. Associated flags `policy-config-file`, `policy-configmap`, `policy-configmap-namespace` and `use-legacy-policy-config` are also not supported. Instead, use the [Scheduler Configuration](/docs/reference/scheduling/config/) to achieve similar behavior.
-->
在 Kubernetes v1.23 版本之前，可以使用調度策略來指定 **predicates** 和 **priorities** 進程。
例如，可以通過運行 `kube-scheduler --policy-config-file <filename>` 或者
 `kube-scheduler --policy-configmap <ConfigMap>` 設置調度策略。

但是從 Kubernetes v1.23 版本開始，不再支持這種調度策略。
同樣地也不支持相關的 `policy-config-file`、`policy-configmap`、`policy-configmap-namespace` 和 `use-legacy-policy-config` 標誌。
你可以通過使用[調度設定](/zh-cn/docs/reference/scheduling/config/)來實現類似的行爲。

## {{% heading "whatsnext" %}}

<!--
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Learn about [kube-scheduler Configuration](/docs/reference/scheduling/config/)
* Read the [kube-scheduler configuration reference (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
-->

* 瞭解[調度](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* 瞭解 [kube-scheduler 設定](/zh-cn/docs/reference/scheduling/config/)
* 閱讀 [kube-scheduler 設定參考 (v1)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
