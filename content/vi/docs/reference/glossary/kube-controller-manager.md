---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Thành phần Control Plane chạy các tiến trình controller.

aka: 
tags:
- architecture
- fundamental
---
 Thành phần control plane chạy các tiến trình {{< glossary_tooltip text="controller" term_id="controller" >}}.

<!--more-->

Về mặt logic, mỗi {{< glossary_tooltip text="controller" term_id="controller" >}} là một tiến trình riêng biệt, nhưng để giảm độ phức tạp, tất cả đều được biên dịch thành một binary duy nhất và chạy trong một tiến trình duy nhất.
