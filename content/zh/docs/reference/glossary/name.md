---
title: 名称
id: name
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/names
short_description: >
  客户端提供的字符串，用来指代资源 URL 中的对象，如 `/api/v1/pods/some-name`。

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

客户端提供的字符串，用来指代资源 URL 中的对象，如 `/api/v1/pods/some-name`。

<!--more--> 

<!--
Only one object of a given kind can have a given name at a time. However, if you delete the object, you can make a new object with the same name.
-->

对给定资源类型 (kind) 而言，同一时刻只能有一个对象使用给定的名称。不过，如果该对象被删除，则可以使用同一名称创建新新对象。
