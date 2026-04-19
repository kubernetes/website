---
title: Common Expression Language
id: cel
full_link: https://cel.dev
short_description: >
  Một ngôn ngữ biểu thức được thiết kế để thực thi mã người dùng một cách an toàn.
tags:
- extension
- fundamental
aka:
- CEL
---
 Một ngôn ngữ biểu thức đa năng được thiết kế để thực thi nhanh, di động và
an toàn.

<!--more-->

Trong Kubernetes, CEL có thể được sử dụng để chạy các truy vấn và thực hiện lọc
chi tiết. Ví dụ, bạn có thể sử dụng biểu thức CEL với
[kiểm soát admission động](/docs/reference/access-authn-authz/extensible-admission-controllers/)
để lọc các trường cụ thể trong request, và với
[cấp phát tài nguyên động (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
để chọn tài nguyên dựa trên các thuộc tính cụ thể.
