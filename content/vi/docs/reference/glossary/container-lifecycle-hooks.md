---
title: Container Lifecycle Hooks
id: container-lifecycle-hooks
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  Các lifecycle hooks cung cấp các sự kiện trong vòng đời quản lý container và cho phép người dùng chạy mã khi các sự kiện đó xảy ra.

aka:
tags:
- extension
---
  Các lifecycle hooks cung cấp các sự kiện trong vòng đời quản lý {{< glossary_tooltip text="Container" term_id="container" >}} và cho phép người dùng chạy mã khi các sự kiện đó xảy ra.

<!--more-->

Hai hooks được cung cấp cho Container: PostStart thực thi ngay sau khi container được tạo, và PreStop có tính chất chặn (blocking) và được gọi ngay trước khi container bị kết thúc.
