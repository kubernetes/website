---
title: 不可變基礎設施
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  不可變基礎設施指的是一旦部署就不能變更的計算機基礎設施（虛擬機、容器和網路設施）

aka: 
tags:
- architecture
---

<!--
title: Immutable Infrastructure
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed

aka: 
tags:
- architecture
-->

<!--
Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed.
-->
不可變基礎設施指的是一旦部署就不能變更的計算機基礎設施（虛擬機、容器和網路設施）。

<!--more-->

<!--
Immutability can be enforced by an automated process that overwrites unauthorized changes or through a system that won’t allow changes in the first place.
{{< glossary_tooltip text="Containers" term_id="container" >}} are a good example of immutable infrastructure because persistent changes to containers
can only be made by creating a new version of the container or recreating the existing container from its image.
-->
不可變性可以通過某個自動化進程或某種系統來強制執行，前者會覆蓋未經授權的變更，而後者從源頭上就不允許進行變更。
{{< glossary_tooltip text="容器" term_id="container" >}}是不可變基礎設施的一個很好的例子，
這是因爲對容器的持久變更只能通過創建新版本的容器或從其映像檔重新創建現有容器來進行。

<!--
By preventing or identifying unauthorized changes, immutable infrastructures make it easier to identify and mitigate security risks. 
Operating such a system becomes a lot more straightforward because administrators can make assumptions about it.
After all, they know no one made mistakes or changes they forgot to communicate.
Immutable infrastructure goes hand-in-hand with infrastructure as code where all automation needed
to create infrastructure is stored in version control (such as Git).
This combination of immutability and version control means that there is a durable audit log of every authorized change to a system.
-->
通過防止或識別未經授權的變更，不可變基礎設施可以更容易地識別和緩解安全風險。
操作此類系統變得更加簡單明瞭，因爲管理員可以對其作一些假設。
畢竟，他們可以確認沒有人犯錯，也沒人做了變更而又忘記溝通。
不可變基礎設施與基礎設施即代碼關係緊密，後者將所有創建基礎設施所需的自動化都存儲在版本控制中（如 Git）。
不可變性和版本控制的結合意味着對系統的每個經過授權的變更都會對應一個持久的審計日誌記錄。
