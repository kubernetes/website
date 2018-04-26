---
title: 支持的 Kubernetes 文档的版本
cn-approvers:
- chentao1596
---
<!--
---
title: 支持的 Kubernetes 文档的版本
title: Supported Versions of the Kubernetes Documentation
---
-->

{% capture overview %}

<!--
This website contains documentation for the current version of Kubernetes
and the four previous versions of Kubernetes.
-->
该网站包含了当前版本及以前四个版本的 Kubernetes 的文档。

{% endcapture %}

{% capture body %}

<!--
## Current version

The current version is
-->
## 当前版本

当前版本是
[{{page.version}}](/)。

<!--
## Previous versions
-->
## 早期版本

{% for v in page.versions %}
{% if v.version != page.version %}
* [{{ v.version }}]({{v.url}})
{% endif %}
{% endfor %}

{% endcapture %}

{% include templates/concept.md %}
