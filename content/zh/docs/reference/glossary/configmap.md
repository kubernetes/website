---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /zh/docs/tasks/configure-pod-container/configure-pod-configmap/
short_description: >
  ConfigMap 是一种 API 对象，用来将非机密性的数据保存到健值对中。使用时可以用作环境变量、命令行参数或者存储卷中的配置文件。
   
aka: 
tags:
- core-object
---

<!--
---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /zh/docs/tasks/configure-pod-container/configure-pod-configmap/
short_description: >
  An API object used to store non-confidential data in key-value pairs. Can be consumed as environment variables, command-line arguments, or config files in a volume.

aka: 
tags:
- core-object
---
-->

<!--
 An API object used to store non-confidential data in key-value pairs. Can be consumed as environment variables, command-line arguments, or config files in a {{< glossary_tooltip text="volume" term_id="volume" >}}.
-->

 ConfigMap 是一种 API 对象，用来将非机密性的数据保存到健值对中。使用时可以用作环境变量、命令行参数或者存储卷中的配置文件。

<!--more--> 

<!--
Allows you to decouple environment-specific configuration from your {{< glossary_tooltip text="container images" term_id="container" >}}, so that your applications are easily portable. When storing confidential data use a [Secret](/docs/concepts/configuration/secret/).
-->

ConfigMap 将您的环境配置信息和 {{< glossary_tooltip text="容器镜像" term_id="container" >}} 解耦，便于应用配置的修改。当您需要储存机密信息时可以使用 [Secret](/docs/concepts/configuration/secret/) 对象。
