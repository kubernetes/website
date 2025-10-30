---
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  Một tác vụ hữu hạn hoặc dạng batch chạy cho đến khi hoàn tất.

aka: 
tags:
- fundamental
- core-object
- workload
---
 Một tác vụ hữu hạn hoặc dạng batch chạy cho đến khi hoàn tất.

<!--more-->

Job tạo ra một hoặc nhiều đối tượng {{< glossary_tooltip term_id="pod" >}} và đảm bảo rằng một số lượng nhất định trong số đó kết thúc thành công. Khi các Pod hoàn thành thành công, Job sẽ theo dõi và ghi nhận các lần hoàn tất đó.
