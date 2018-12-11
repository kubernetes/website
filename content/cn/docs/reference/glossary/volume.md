---
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
---

<!--
 A directory containing data, accessible to the containers in a {{< glossary_tooltip text="pod" term_id="pod" >}}.

<!--more--> 

A Kubernetes volume lives as long as the {{< glossary_tooltip text="pod" term_id="pod" >}} that encloses it. Consequently, a volume outlives any {{< glossary_tooltip text="containers" term_id="container" >}} that run within the {{< glossary_tooltip text="pod" term_id="pod" >}}, and data is preserved across {{< glossary_tooltip text="container" term_id="container" >}} restarts. 
-->

包含数据的目录，可供{{<glossary_tooltip text =“pod”term_id =“pod”>}}中的容器访问。

<!--更多-->

只要包含它的{{<glossary_tooltip text =“pod”term_id =“pod”>}}, Kubernetes 卷就会存在。因此, 在{{<glossary_tooltip text =“pod”term_id =“pod”>}}内运行的任何{{<glossary_tooltip text =“containers”term_id =“container”>}}的数量都会超过，并且数据会保留在{{<glossary_tooltip text =“container”term_id =“container”>}}重新启动。
