{% assign dialog_title = "deprecated" %}
{% capture dialog_content %}
This feature is *deprecated*. For more information on this state, see the [Kubernetes Deprecation Policy](/docs/reference/deprecation-policy/).
{% endcapture %}

**DEPRECATION NOTICE:** As of `Kubernetes {{ for_k8s_version | default: page.version }}`, this has been {% include feature-dialog.md %}
