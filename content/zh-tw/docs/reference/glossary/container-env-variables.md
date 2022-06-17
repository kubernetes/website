---
title: 容器環境變數（Container Environment Variables）
id: container-env-variables
date: 2018-04-12
full_link: /zh-cn/docs/concepts/containers/container-environment/
short_description: >
  容器環境變數提供了 name=value 形式的、執行容器化應用所必須的一些重要資訊。

aka: 
tags:
- fundamental
---

<!--
---
title: Container Environment Variables
id: container-env-variables
date: 2018-04-12
full_link: /docs/concepts/containers/container-environment/
short_description: >
  Container environment variables are name=value pairs that provide useful information into containers running in a Pod.

aka: 
tags:
- fundamental
---
-->

<!--
 Container environment variables are name=value pairs that provide useful information into containers running in a {{< glossary_tooltip text="pod" term_id="pod" >}}
-->

  容器環境變數提供了 name=value 形式的、在 {{< glossary_tooltip text="pod" term_id="pod" >}} 中執行的容器所必須的一些重要資訊。
  
<!--more-->
<!--
Container environment variables provide information that is required by the running containerized applications along with information about important resources to the {{< glossary_tooltip text="containers" term_id="container" >}}. For example, file system details, information about the container itself, and other cluster resources such as service endpoints.
-->

  容器環境變數為執行中的容器化應用提供必要的資訊，同時還提供與 {{< glossary_tooltip text="容器" term_id="container" >}} 重要資源相關的其他資訊，例如：檔案系統資訊、容器自身的資訊以及其他像服務端點（Service endpoints）這樣的叢集資源資訊。
