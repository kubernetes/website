---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  幫助理解容器的資源用量與性能特徵的工具。

aka:
tags:
- tool
---
<!--
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Tool that provides understanding of the resource usage and performance characteristics for containers
aka:
tags:
- tool
-->

<!--
cAdvisor (Container Advisor) provides container users an understanding of the {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}}
usage and performance characteristics of their running {{< glossary_tooltip text="containers" term_id="container" >}}.
-->
cAdvisor (Container Advisor) 爲容器使用者提供對其運行中的{{< glossary_tooltip text="容器" term_id="container" >}}
的{{< glossary_tooltip text="資源" term_id="infrastructure-resource" >}}用量和性能特徵的知識。

<!--more-->

<!--
It is a running daemon that collects, aggregates, processes, and exports information about running containers. Specifically, for each container it keeps resource isolation parameters, historical resource usage, histograms of complete historical resource usage and network statistics. This data is exported by container and machine-wide.
-->
cAdvisor 是一個守護進程，負責收集、聚合、處理並輸出運行中容器的資訊。
具體而言，針對每個容器，該進程記錄容器的資源隔離參數、歷史資源用量、完整歷史資源用量和網路統計的直方圖。
這些資料可以按容器或按機器層面輸出。
