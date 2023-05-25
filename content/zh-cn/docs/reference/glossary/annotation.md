---
title: 注解（Annotation）
id: annotation
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/annotations/
short_description: >
  注解是以键值对的形式给资源对象附加随机的无法标识的元数据。

aka: 
tags:
- fundamental
---
<!--
title: Annotation
id: annotation
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/annotations
short_description: >
  A key-value pair that is used to attach arbitrary non-identifying metadata to objects.

aka: 
tags:
- fundamental
-->

<!--
 A key-value pair that is used to attach arbitrary non-identifying metadata to objects.
-->
 注解是以键值对的形式给资源对象附加随机的无法标识的元数据。

<!--more--> 

<!--
The metadata in an annotation can be small or large, structured or unstructured, and can include characters not permitted by {{< glossary_tooltip text="labels" term_id="label" >}}. Clients such as tools and libraries can retrieve this metadata.
-->
注解中的元数据可大可小，可以是结构化的也可以是非结构化的，
并且能包含{{< glossary_tooltip text="标签" term_id="label" >}}不允许使用的字符。
像工具和软件库这样的客户端可以检索这些元数据。
