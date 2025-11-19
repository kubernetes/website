---
title: 雲提供商（Cloud Provider）
id: cloud-provider
date: 2018-04-12
short_description: >
  一個提供雲計算平臺的組織。

aka:
- 雲服務提供商（Cloud Service Provider）
tags:
- community
---
<!--
title: Cloud Provider
id: cloud-provider
date: 2018-04-12
short_description: >
  An organization that offers a cloud computing platform.

aka:
- Cloud Service Provider
tags:
- community
-->

<!--
 A business or other organization that offers a cloud computing platform.
-->
 一個提供雲計算平臺的商業機構或其他組織。

<!--more-->

<!--
Cloud providers, sometimes called Cloud Service Providers (CSPs), offer
cloud computing platforms or services.

Many cloud providers offer managed infrastructure (also called
Infrastructure as a Service or IaaS).
With managed infrastructure the cloud provider is responsible for
servers, storage, and networking while you manage layers on top of that
such as running a Kubernetes cluster.

You can also find Kubernetes as a managed service; sometimes called
Platform as a Service, or PaaS. With managed Kubernetes, your
cloud provider is responsible for the Kubernetes control plane as well
as the {{< glossary_tooltip term_id="node" text="nodes" >}} and the
infrastructure they rely on: networking, storage, and possibly other
elements such as load balancers.
-->
雲提供商（Cloud provider），有時也稱作雲服務提供商（CSPs）提供雲計算平臺或服務。

很多雲提供商提供託管的基礎設施（也稱作基礎設施即服務或 IaaS）。
針對託管的基礎設施，雲提供商負責服務器、存儲和網絡，而用戶（你）
負責管理其上運行的各層軟件，例如運行一個 Kubernetes 集羣。

你也會看到 Kubernetes 被作爲託管服務提供；有時也稱作平臺即服務或 PaaS。
針對託管的 Kubernetes，你的雲提供商負責 Kubernetes 的控制平面以及
{{< glossary_tooltip term_id="node" text="節點" >}} 及他們所依賴的基礎設施：
網絡、存儲以及其他一些諸如負載均衡器之類的元素。
