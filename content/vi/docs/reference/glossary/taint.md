---
title: Taint
id: taint
date: 2019-11-26
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  Là một đối tượng bao gồm ba thuộc tính bắt buộc: key, value, và effect. Taints (dấu chờ) ngăn cản việc lập lịch cho các pod chạy trên các node hay nhóm các node.

aka:
tags:
  - core-object
  - fundamental
---

Là một đối tượng bao gồm ba thuộc tính bắt buộc: key, value, và effect. Taints (dấu chờ) ngăn cản việc lập lịch cho các pod chạy trên các {{< glossary_tooltip text="node" term_id="node" >}} hay nhóm các node.

<!--more-->

Taints (dấu chờ) và tolerations hoạt động cùng với nhau để đảm bảo rằng các pod sẽ không lập lịch chạy lên những node không phù hợp. Có thể đặt một hoặc nhiều hơn một dấu chờ lên node. Một node chỉ có thể lập lịch chạy cho một pod với tolerations phù hợp với những dấu taint được cấu hình.
