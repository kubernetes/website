---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  StatefulSet quản lý việc triển khai và mở rộng một tập hợp các Pod, với lưu trữ bền vững và định danh cố định cho mỗi Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Quản lý việc triển khai và mở rộng một tập hợp các {{< glossary_tooltip text="Pod" term_id="pod" >}}, *và đảm bảo về thứ tự và tính duy nhất* của các Pod này.

<!--more--> 

Giống như một {{< glossary_tooltip term_id="deployment" >}}, StatefulSet quản lý các Pod dựa trên một đặc tả container giống hệt nhau. Khác với Deployment, StatefulSet duy trì một định danh gắn kết cho mỗi Pod của nó. Các Pod này được tạo từ cùng một đặc tả, nhưng không thể hoán đổi cho nhau&#58; mỗi Pod có một định danh cố định được duy trì xuyên suốt quá trình lập lịch lại.

Nếu bạn muốn sử dụng các volume lưu trữ để cung cấp tính bền vững cho workload của mình, bạn có thể sử dụng StatefulSet như một phần của giải pháp. Mặc dù các Pod riêng lẻ trong StatefulSet có thể gặp sự cố, các định danh cố định của Pod giúp việc khớp các volume hiện có với các Pod mới thay thế các Pod đã gặp sự cố dễ dàng hơn.
