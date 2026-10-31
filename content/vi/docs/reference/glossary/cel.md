---
title: Common Expression Language
id: cel
full_link: https://cel.dev
short_description: >
  Một ngôn ngữ biểu thức được thiết kế để thực thi mã của người dùng một cách an toàn.
tags:
- extension
- fundamental
aka:
- CEL
---
 Một ngôn ngữ biểu thức đa dụng được thiết kế để chạy nhanh, có tính di động và
an toàn khi thực thi.

<!--more-->

Trong Kubernetes, CEL có thể được dùng để chạy truy vấn và lọc dữ liệu một cách
chi tiết. Ví dụ, bạn có thể dùng biểu thức CEL với
[kiểm soát admission động](/docs/reference/access-authn-authz/extensible-admission-controllers/)
để lọc các trường cụ thể trong request, và với
[cấp phát tài nguyên động (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/)
để chọn tài nguyên dựa trên các thuộc tính cụ thể.
