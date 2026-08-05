---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker merupakan suatu teknologi perangkat lunak yang menyediakan virtualisasi pada level sistem operasi yang juga dikenal sebagai Container.
aka:
tags:
- fundamental
---
Docker (secara spesifik, Docker Engine) merupakan suatu teknologi perangkat lunak yang menyediakan virtualisasi pada level sistem operasi yang juga dikenal sebagai {{< glossary_tooltip term_id="container" >}}.

<!--more-->

Docker menggunakan fitur isolasi sumber daya pada kernel Linux seperti cgroup dan _namespace_, dan [UnionFS](https://docs.docker.com/get-started/overview/#union-file-systems) seperti OverlayFS dan lainnya untuk memungkinkan masing-masing Container dijalankan pada satu instans Linux, menghindari beban tambahan (_overhead_) saat memulai dan menjalankan VM.
