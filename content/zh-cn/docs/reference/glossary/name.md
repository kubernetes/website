---
title: 名称（Name）
id: name
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/names/
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
full_link: /docs/concepts/overview/working-with-objects/names/
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

客户端提供的字符串，引用资源 URL 中的对象，如`/api/v1/pods/some name`。

<!--more--> 

<!--
Only one object of a given kind can have a given name at a time. However, if you delete the object, you can make a new object with the same name.
-->

某一时刻，只能有一个给定类型的对象具有给定的名称。但是，如果删除该对象，则可以创建同名的新对象。
