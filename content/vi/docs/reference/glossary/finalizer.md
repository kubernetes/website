---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
    Một khóa có phạm vi namespace dùng để yêu cầu Kubernetes chờ đến khi thỏa mãn các điều kiện cụ thể trước khi xóa hoàn toàn một đối tượng đã được đánh dấu để xóa.
aka: 
tags:
- fundamental
- operation
---
Finalizer là các khóa có phạm vi namespace được dùng để yêu cầu Kubernetes chờ đến khi các điều kiện nhất định được thỏa mãn trước khi xóa hoàn toàn các tài nguyên đã được đánh dấu để xóa. Finalizer giúp thông báo cho {{<glossary_tooltip text="controller" term_id="controller">}} thực hiện việc dọn dẹp (clean up) các tài nguyên mà đối tượng bị xóa đang sở hữu.

<!--more-->
Khi bạn yêu cầu Kubernetes xóa một đối tượng có chỉ định finalizer, API của Kubernetes sẽ đánh dấu đối tượng đó là đang chờ xóa bằng cách gán giá trị cho trường `.metadata.deletionTimestamp`, và trả về mã trạng thái `202` (HTTP "Accepted"). Đối tượng mục tiêu sẽ vẫn ở trạng thái "terminating" (đang chấm dứt) trong khi control plane hoặc các thành phần khác thực hiện các hành động được định nghĩa trong finalizer. Sau khi các hành động này hoàn tất, controller sẽ gỡ bỏ các finalizer liên quan khỏi đối tượng mục tiêu. Khi trường `metadata.finalizers` rỗng, Kubernetes xem quá trình xóa đã hoàn tất và tiến hành xóa đối tượng đó.

Bạn có thể sử dụng finalizer để kiểm soát quá trình {{<glossary_tooltip text="thu gom rác (garbage collection)" term_id="garbage-collection">}} của các tài nguyên. Ví dụ, bạn có thể định nghĩa một finalizer để dọn dẹp các tài nguyên liên quan hoặc hạ tầng trước khi controller xóa tài nguyên chính.