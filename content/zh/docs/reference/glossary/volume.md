---
title: 卷
id: volume
date: 2018-04-12
full_link: /zh/docs/concepts/storage/volumes/
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
full_link: /zh/docs/concepts/storage/volumes/
short_description: >
  A directory containing data, accessible to the containers in a pod.

aka: 
tags:
- core-object
- fundamental
-->

<!--
 A directory containing data, accessible to the containers in a {{< glossary_tooltip text="pod" term_id="pod" >}}.
-->

包含可被 {{< glossary_tooltip text="pod" term_id="pod" >}} 中容器访问的数据的目录。

<!--more--> 
<!--
A Kubernetes volume lives as long as the {{< glossary_tooltip text="pod" term_id="pod" >}} that encloses it. Consequently, a volume outlives any {{< glossary_tooltip text="containers" term_id="container" >}} that run within the {{< glossary_tooltip text="pod" term_id="pod" >}}, and data is preserved across {{< glossary_tooltip text="container" term_id="container" >}} restarts. 
-->

每个 Kubernetes 卷在所处的{{< glossary_tooltip text="pod" term_id="pod" >}} 存在期间保持存在状态。
因此，卷的生命期会超出 {{< glossary_tooltip text="pod" term_id="pod" >}} 中运行的{{< glossary_tooltip text="容器" term_id="container" >}}，
并且保证{{< glossary_tooltip text="容器" term_id="container" >}}重启之后仍保留数据。

