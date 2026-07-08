---
title: Toleration
id: toleration
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Một core object bao gồm ba thuộc tính bắt buộc: key, value, và effect. Tolerations cho phép việc scheduling các pods lên các nodes hoặc nhóm nodes có taint tương ứng.

aka:
tags:
- core-object
- fundamental
---
Một core object bao gồm ba thuộc tính bắt buộc: key, value, và effect. Tolerations cho phép việc scheduling các pods lên các nodes hoặc nhóm nodes có {{< glossary_tooltip text="taints" term_id="taint" >}} tương ứng.

<!--more-->

Tolerations và {{< glossary_tooltip text="taints" term_id="taint" >}} hoạt động cùng nhau để đảm bảo rằng các pods không được schedule lên các nodes không phù hợp. Một hoặc nhiều tolerations được áp dụng cho một {{< glossary_tooltip text="pod" term_id="pod" >}}. Một toleration chỉ ra rằng {{< glossary_tooltip text="pod" term_id="pod" >}} được cho phép (nhưng không bắt buộc) để được schedule lên các nodes hoặc nhóm nodes có {{< glossary_tooltip text="taints" term_id="taint" >}} tương ứng.
