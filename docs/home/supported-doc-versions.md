---
title: Supported Versions of the Kubernetes Documentation
---

{% capture overview %}

This website contains doucmentation for the current version of Kubernetes
and the four previous versions of Kubernetes.

{% endcapture %}

{% capture body %}

## Current version

The current version is
[{{page.version}}](/).

## Previous versions

{% for v in page.versions %}
{% if v.version != page.version %}
* [{{ v.version }}](https://{{v.version}}.docs.kubernetes.io/)
{% endif %}
{% endfor %}

{% endcapture %}

{% include templates/concept.md %}
