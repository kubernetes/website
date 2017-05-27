{% assign dialog_title = "deprecated" %}
{% capture dialog_content %}
This feature is *deprecated*. See [Deprecating parts of the API](/docs/reference/deprecation-policy/#deprecating-parts-of-the-api) for more information.
{% endcapture %}

**DEPRECATION NOTICE:** As of `Kubernetes {{ for_k8s_version | default: page.version }}`, this has been {% include feature-dialog.md %}
