---
title: Spec
id: spec
date: 2023-12-17
full_link: /zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  在 Kubernetes 清單中的此字段用來定義預期狀態或預期設定。

aka:
tags:
- fundamental
- architecture
---
<!--
title: Spec
id: spec
date: 2023-12-17
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  Field in Kubernetes manifests that defines the desired state or configuration.

aka:
tags:
- fundamental
- architecture
-->

<!--
Defines how each object, like Pods or Services, should be configured and its desired state.
-->
定義 Pod 或 Service 這類每種對象應被如何設定及其預期狀態。

<!--more-->

<!--
Almost every Kubernetes object includes two nested object fields that govern the object's configuration: the object spec and the object status. For objects that have a spec, you have to set this when you create the object, providing a description of the characteristics you want the {{< glossary_tooltip text="resource" term_id="api-resource" >}} to have: its desired state.
-->
幾乎每個 Kubernetes 對象都包含兩個嵌套的對象字段，用於治理對象本身的設定：
對象規約（spec）和對象狀態（status）。
對於具有規約的對象，你必須在創建對象時設置規約，並提供{{< glossary_tooltip text="資源" term_id="api-resource" >}}所需特徵的描述：
即其預期狀態。

<!--
It varies for different objects like Pods, StatefulSets, and Services, detailing settings such as containers, volumes, replicas, ports,
and other specifications unique to each object type. This field encapsulates what state Kubernetes should maintain for the defined
object.
-->
此字段對於 Pod、StatefulSet 和 Service 等不同對象會有所差異，
字段詳細說明如容器、卷、副本、端口等設置以及每種對象特有的其他規約。
此字段封裝了 Kubernetes 針對所定義的對象應保持何種狀態。
