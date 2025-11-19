---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/
short_description: >
  ConfigMap 是一種 API 對象，用來將非機密性的數據保存到鍵值對中。使用時可以用作環境變量、命令列參數或者存儲卷中的設定文件。
   
aka: 
tags:
- core-object
---
<!--
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/concepts/configuration/configmap/
short_description: >
  An API object used to store non-confidential data in key-value pairs. Can be consumed as environment variables, command-line arguments, or configuration files in a volume.

aka: 
tags:
- core-object
-->

<!--
 An API object used to store non-confidential data in key-value pairs.
{{< glossary_tooltip text="Pods" term_id="pod" >}} can consume ConfigMaps as
environment variables, command-line arguments, or as configuration files in a
{{< glossary_tooltip text="volume" term_id="volume" >}}.
-->
ConfigMap 是一種 API 對象，用來將非機密性的數據保存到鍵值對中。使用時，
{{< glossary_tooltip text="Pod" term_id="pod" >}} 可以將其用作環境變量、命令列參數或者存儲卷中的設定文件。

<!--more--> 

<!--
A ConfigMap allows you to decouple environment-specific configuration from your {{< glossary_tooltip text="container images" term_id="image" >}}, so that your applications are easily portable.
-->
ConfigMap 將你的環境設定信息和{{< glossary_tooltip text="容器映像檔" term_id="image" >}}解耦，便於應用設定的修改。
