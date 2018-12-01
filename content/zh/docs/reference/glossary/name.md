---
title: 名称
id: name
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/names
short_description: >
  客户端提供的字符串，引用资源 URL 中的对象，如 `/api/v1/pods/some-name`。

aka: 
tags:
- fundamental
---

<!--
---
title: Name
id: name
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/names
short_description: >
  A client-provided string that refers to an object in a resource URL, such as `/api/v1/pods/some-name`.

aka: 
tags:
- fundamental
---
-->

<!--
 A client-provided string that refers to an object in a resource URL, such as `/api/v1/pods/some-name`.
-->

客户端提供的字符串，指的是资源 URL 中的对象，如 `/api/v1/pods/some-name`。

<!--more--> 

<!--
Only one object of a given kind can have a given name at a time. However, if you delete the object, you can make a new object with the same name.
-->

只有给定资源类型 (kind) 的一个对象一次可以有一个给定的名称（即同类型的多个对象的名称不重复）。但如果删除了对象，则可以用相同的名称创建新对象。
