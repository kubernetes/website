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
允许从使用配置文件指定的文件中加载 kubelet 配置。
详情参见[通过配置文件设置 kubelet 参数](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。
