---
title: Network Policy
id: network-policy
date: 2018-04-12
full_link: /docs/concepts/services-networking/network-policies/
short_description: >
  Một đặc tả về cách các nhóm Pod được phép giao tiếp với nhau và với các network endpoint khác.

aka: 
tags:
- networking
- architecture
- extension
- core-object
---
 Một đặc tả về cách các nhóm Pod được phép giao tiếp với nhau và với các network endpoint khác.

<!--more--> 

NetworkPolicies giúp bạn khai báo cấu hình các Pod nào được phép kết nối với nhau, namespace nào được phép giao tiếp,
và cụ thể hơn là số port nào để thực thi mỗi policy. NetworkPolicy objects sử dụng {{< glossary_tooltip text="labels" term_id="label" >}}
để chọn các Pod và định nghĩa các quy tắc chỉ định traffic nào được phép đến các Pod đã chọn.

NetworkPolicies được triển khai bởi một network plugin được hỗ trợ bởi network provider.
Lưu ý rằng việc tạo một NetworkPolicy object mà không có controller để triển khai nó sẽ không có hiệu lực.
