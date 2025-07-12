---
title: API resource
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Một thực thể Kubernetes, đại diện cho một endpoint trên Kubernetes API server.

aka:
 - Resource
tags:
- architecture
---
Một thực thể trong hệ thống kiểu dữ liệu của Kubernetes, tương ứng với một endpoint trên {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.
Một resource thường đại diện cho một {{< glossary_tooltip text="object" term_id="object" >}}.
Một số resource đại diện cho một thao tác trên các object khác, ví dụ như kiểm tra quyền.
<!--more-->
Mỗi resource đại diện cho một HTTP endpoint (URI) trên Kubernetes API server, định nghĩa schema cho các object hoặc các thao tác trên resource đó.
