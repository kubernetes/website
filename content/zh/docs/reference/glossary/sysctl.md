---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
#   An interface for getting and setting Unix kernel parameters
  用于获取和设置Unix内核参数的接口

aka:
tags:
# - tool
- 工具
---
 <!-- `sysctl` is a semi-standardized interface for reading or changing the
 attributes of the running Unix kernel. -->
  `sysctl` 是一个半标准化的界面，用于读取或更改
 正在运行的 Unix 内核的属性。

<!--more-->

<!-- On Unix-like systems, `sysctl` is both the name of the tool that administrators
use to view and modify these settings, and also the system call that the tool
uses. -->
在类Unix系统上，名为 `sysctl` 是管理系统的工具
用于查看和修改系统设置，以及系统调用

<!-- {{< glossary_tooltip text="Container" term_id="container" >}} runtimes and
network plugins may rely on `sysctl` values being set a certain way. -->
{{<glossary_tooltip text =“Container”term_id =“container”>}} 运行时和网络插件可能依赖某些`sysctl`的值。