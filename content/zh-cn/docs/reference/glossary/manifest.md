---
title: 清单（Manifest）
id: manifest
date: 2019-06-28
short_description: >
  一个或多个 Kubernetes API 对象的序列化规范。

aka:
tags:
- fundamental
---
 [JSON](https://www.json.org/json-en.html)
 或 [YAML](https://yaml.org/) 格式的 Kubernetes API 对象规约。

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
清单指定在应用该清单时 kubernetes 将维护的对象的期望状态。
对于 YAML 格式，每个文件可包含多个清单。
