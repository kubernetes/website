---
title: 名稱（Name）
id: name
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/names/
short_description: >
  客戶端提供的字串，用來指代資源 URL 中的物件，如 `/api/v1/pods/some-name`。

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

客戶端提供的字串，引用資源 url 中的物件，如`/api/v1/pods/some name`。

<!--more--> 

<!--
Only one object of a given kind can have a given name at a time. However, if you delete the object, you can make a new object with the same name.
-->

某一時刻，只能有一個給定型別的物件具有給定的名稱。但是，如果刪除該物件，則可以建立同名的新物件。
