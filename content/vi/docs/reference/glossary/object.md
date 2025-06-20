---
title: Object
id: object
date: 2020-10-12
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   Một thực thể trong hệ thống Kubernetes, đại diện cho một phần trạng thái của cluster của bạn.
aka:
tags:
- architecture
- fundamental
---
Một thực thể trong hệ thống Kubernetes. Một object là một
{{< glossary_tooltip text="API resource" term_id="api-resource" >}} mà Kubernetes API
sử dụng để đại diện cho trạng thái của cluster của bạn.
<!--more-->
Một Kubernetes object thường là một "bản ghi ý định"—khi bạn tạo object, 
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} của Kubernetes làm việc liên tục để đảm bảo
rằng thành phần mà nó đại diện thực sự tồn tại.
Bằng cách tạo một object, bạn đang thực sự nói với hệ thống Kubernetes về việc bạn muốn phần
workload của cluster của bạn trông như thế nào; đây là trạng thái mong muốn của cluster của bạn.
