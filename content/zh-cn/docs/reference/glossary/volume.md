---
title: 卷（Volume）
id: volume
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/volumes/
short_description: >
  包含可被 Pod 中容器访问的数据的目录。

aka: 
tags:
- core-object
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
- core-object
- fundamental
-->


<!--
 A directory containing data, accessible to the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip term_id="pod" >}}.
-->
包含可被 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中{{< glossary_tooltip text="容器" term_id="container" >}}访问的数据的目录。

		   

<!--
A Kubernetes volume lives as long as the Pod that encloses it. Consequently, a volume outlives any containers that run within the Pod, and data in the volume is preserved across container restarts.
-->

每个 Kubernetes 卷在所处的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 存在期间保持存在状态。
因此，卷的生命期会超出 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中运行的{{< glossary_tooltip text="容器" term_id="container" >}}，
并且保证{{< glossary_tooltip text="容器" term_id="container" >}}重启之后仍保留数据。

<!--
See [storage](/docs/concepts/storage/) for more information.
-->
更多信息可参考[存储](/zh-cn/docs/concepts/storage/)
