---
title: Volume Plugin
id: volumeplugin
full_link:
short_description: >
  Một Volume Plugin cho phép tích hợp storage vào trong một Pod.

aka:
tags:
- storage
---
Một Volume Plugin cho phép tích hợp storage vào trong một {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Một Volume Plugin cho phép bạn gắn và mount các storage volumes để sử dụng bởi một {{< glossary_tooltip text="Pod" term_id="pod" >}}. Volume plugins có thể là _in tree_ hoặc _out of tree_. Các plugins _In tree_ là một phần của Kubernetes code repository và tuân theo chu kỳ release của nó. Các plugins _Out of tree_ được phát triển độc lập.
