---
title: Immutable Infrastructure
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed

aka: 
tags:
- architecture
---
 Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed.

<!--more-->

Immutability can be enforced by an automated process that overwrites unauthorized changes or through a system that won’t allow changes in the first place.
{{< glossary_tooltip text="Containers" term_id="container" >}} are a good example of immutable infrastructure because persistent changes to containers
can only be made by creating a new version of the container or recreating the existing container from its image.

By preventing or identifying unauthorized changes, immutable infrastructures make it easier to identify and mitigate security risks. 
Operating such a system becomes a lot more straightforward because administrators can make assumptions about it.
After all, they know no one made mistakes or changes they forgot to communicate.
Immutable infrastructure goes hand-in-hand with infrastructure as code where all automation needed
to create infrastructure is stored in version control (such as Git).
This combination of immutability and version control means that there is a durable audit log of every authorized change to a system.

---
title: Hạ tầng bất biến (Immutable Infrastructure)
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Hạ tầng bất biến là kiểu hạ tầng máy tính (máy ảo, container, thiết bị mạng) không được thay đổi sau khi đã triển khai.

aka:
tags:
- architecture
---

Hạ tầng bất biến là cách thiết kế hạ tầng máy tính (máy ảo, container, thiết bị mạng) không thay đổi sau khi đã triển khai.

<!--more-->

Tính “bất biến” có thể được đảm bảo bằng quy trình tự động ghi đè mọi thay đổi không được phép, hoặc bằng một hệ thống vốn dĩ không cho phép thay đổi ngay từ đầu.
{{< glossary_tooltip text="Containers" term_id="container" >}} là ví dụ điển hình: nếu muốn thay đổi giữ được lâu dài thì phải tạo phiên bản container mới, hoặc tạo lại container hiện có từ image của nó.

Nhờ ngăn chặn hay phát hiện thay đổi trái phép, hạ tầng bất biến giúp dễ nhận diện và giảm thiểu rủi ro bảo mật. Vận hành hệ thống cũng “dễ thở” hơn vì quản trị viên có thể giả định rằng không có ai lỡ tay sửa đổi rồi quên báo.

Hạ tầng bất biến thường đi kèm với mô hình Infrastructure as Code (IaC), nơi toàn bộ kịch bản/cấu hình dựng hạ tầng được lưu trong hệ thống quản lý phiên bản (như Git).
Sự kết hợp giữa tính bất biến và quản lý phiên bản tạo ra một nhật ký kiểm toán bền vững cho mọi thay đổi được phép trong hệ thống.