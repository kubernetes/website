{% assign dialog_title = "stable" %}
{% capture dialog_content %}
This feature is *stable*, meaning:

* The version name is vX where X is an integer.
* Stable versions of features will appear in released software for many subsequent versions.

{% endcapture %}

**FEATURE STATE:** `Kubernetes {{ for_k8s_version | default: page.version }}` {% include feature-dialog.md %}
