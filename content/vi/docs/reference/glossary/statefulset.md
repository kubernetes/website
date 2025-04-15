---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Một StatefulSet quản lý việc triển khai và mở rộng một tập hợp các Pod, với khả năng lưu trữ bền vững và định danh riêng biệt cho mỗi Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Quản lý việc triển khai và mở rộng một tập hợp các {{< glossary_tooltip text="Pod" term_id="pod" >}}, *và đảm bảo tính tuần tự và duy nhất* của các Pod này.

<!--more--> 

Giống như {{< glossary_tooltip term_id="deployment" >}}, StatefulSet quản lý các Pod dựa trên một đặc tả container giống hệt nhau. Khác với Deployment, StatefulSet duy trì một định danh riêng biệt cho mỗi Pod. Các Pod này được tạo từ cùng một đặc tả, nhưng không thể thay thế lẫn nhau: mỗi Pod có một định danh riêng biệt được duy trì xuyên suốt quá trình lập lịch lại.

Nếu bạn muốn sử dụng các volume lưu trữ để đảm bảo tính bền vững cho workload của mình, bạn có thể sử dụng StatefulSet như một phần của giải pháp. Mặc dù các Pod riêng lẻ trong StatefulSet có thể gặp sự cố, nhưng định danh riêng biệt của Pod giúp việc kết nối các volume hiện có với các Pod mới thay thế trở nên dễ dàng hơn.
