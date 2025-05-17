---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Một đối tượng cốt lõi gồm ba thuộc tính bắt buộc: key, value và effect. Toleration cho phép lập lịch các pod trên các node hoặc nhóm node có taint tương ứng.

aka:
tags:
- core-object
- fundamental
---
 Một đối tượng cốt lõi gồm ba thuộc tính bắt buộc: key, value và effect. Toleration cho phép lập lịch các pod trên các node hoặc nhóm node có {{< glossary_tooltip text="taint" term_id="taint" >}} tương ứng.

<!--more-->

Toleration và {{< glossary_tooltip text="taint" term_id="taint" >}} hoạt động cùng nhau để đảm bảo rằng các pod không được lập lịch trên những node không phù hợp. Một hoặc nhiều toleration có thể được áp dụng cho một {{< glossary_tooltip text="pod" term_id="pod" >}}. Một toleration chỉ ra rằng {{< glossary_tooltip text="pod" term_id="pod" >}} được phép (nhưng không bắt buộc) lập lịch trên các node hoặc nhóm node có {{< glossary_tooltip text="taint" term_id="taint" >}} tương ứng.
