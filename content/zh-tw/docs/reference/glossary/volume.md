---
title: 卷（Volume）
id: volume
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/volumes/
short_description: >
  包含可被 Pod 中容器訪問的數據的目錄。

aka: 
tags:
- fundamental
---
<!--
title: Volume
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  A directory containing data, accessible to the containers in a pod.

aka:
tags:
- fundamental
-->

<!--
A directory containing data, accessible to the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip term_id="pod" >}}.
-->
包含可被 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中{{< glossary_tooltip text="容器" term_id="container" >}}訪問的數據的目錄。

<!--
A Kubernetes volume lives as long as the Pod that encloses it. Consequently, a volume outlives any containers that run within the Pod, and data in the volume is preserved across container restarts.
-->

每個 Kubernetes 卷在所處的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 存在期間保持存在狀態。
因此，卷的生命期會超出 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中運行的{{< glossary_tooltip text="容器" term_id="container" >}}，
並且保證{{< glossary_tooltip text="容器" term_id="container" >}}重啓之後仍保留數據。

<!--
See [storage](/docs/concepts/storage/) for more information.
-->
更多信息可參考[存儲](/zh-cn/docs/concepts/storage/)
