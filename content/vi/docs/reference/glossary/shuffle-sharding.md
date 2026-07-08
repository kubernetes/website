---
title: Shuffle-sharding
id: shuffle-sharding
full_link:
short_description: >
  Một kỹ thuật phân bổ requests vào queues cung cấp khả năng cô lập tốt hơn so với hashing modulo số lượng queues.

aka:
tags:
- fundamental
---
Một kỹ thuật phân bổ requests vào queues cung cấp khả năng cô lập tốt hơn so với hashing modulo số lượng queues.

<!--more-->

Chúng ta thường quan tâm đến việc cô lập các luồng requests khác nhau với nhau, để một luồng có cường độ cao không lấn át các luồng có cường độ thấp. Một cách đơn giản để đưa requests vào queues là hash một số đặc tính của request, modulo số lượng queues, để lấy chỉ số của queue cần sử dụng. Hàm hash sử dụng các đặc tính của request phù hợp với các luồng làm đầu vào. Ví dụ, trên Internet thường là 5-tuple gồm địa chỉ nguồn và đích, giao thức, và cổng nguồn và đích.

Cách tiếp cận dựa trên hash đơn giản đó có đặc tính là bất kỳ luồng cường độ cao nào cũng sẽ lấn át tất cả các luồng cường độ thấp được hash vào cùng queue. Để cung cấp khả năng cô lập tốt cho số lượng lớn các luồng cần số lượng lớn queues, điều này gây ra vấn đề. Shuffle-sharding là một kỹ thuật linh hoạt hơn có thể cô lập tốt hơn các luồng cường độ thấp khỏi các luồng cường độ cao. Thuật ngữ shuffle-sharding sử dụng phép ẩn dụ của việc chia bài từ một bộ bài; mỗi queue là một lá bài ẩn dụ. Kỹ thuật shuffle-sharding bắt đầu bằng việc hash các đặc tính nhận dạng luồng của request, để tạo ra một giá trị hash với hàng chục bit trở lên. Sau đó giá trị hash được sử dụng như một nguồn entropy để xáo trộn bộ bài và chia một tay bài (queues). Tất cả các queues được chia đều được kiểm tra, và request được đặt vào một trong các queues đã kiểm tra có độ dài ngắn nhất.
