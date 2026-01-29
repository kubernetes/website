---
title: 清單（Manifest）
id: manifest
date: 2019-06-28
short_description: >
  一個或多個 Kubernetes API 對象的序列化規範。

aka:
tags:
- fundamental
---
 [JSON](https://www.json.org/json-en.html)
 或 [YAML](https://yaml.org/) 格式的 Kubernetes API 對象規約。

<!--
title: Manifest
id: manifest
date: 2019-06-28
short_description: >
  A serialized specification of one or more Kubernetes API objects.

aka:
tags:
- fundamental
 Specification of a Kubernetes API object in [JSON](https://www.json.org/json-en.html)
or [YAML](https://yaml.org/) format.
-->

<!--more-->

<!-- 
A manifest specifies the desired state of an object that Kubernetes will maintain when you apply the manifest.
For YAML format, each file can contain multiple manifests.
 -->
清單指定在應用該清單時 kubernetes 將維護的對象的期望狀態。
對於 YAML 格式，每個檔案可包含多個清單。
