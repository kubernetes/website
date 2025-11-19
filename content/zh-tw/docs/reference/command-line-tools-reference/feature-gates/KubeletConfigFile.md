---
# Removed from Kubernetes
title: KubeletConfigFile
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: deprecated
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true
---

<!--
Enable loading kubelet configuration from
a file specified using a config file.
See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
for more details.
-->
允許從使用配置文件指定的文件中加載 kubelet 配置。
詳情參見[通過配置文件設置 kubelet 參數](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。
