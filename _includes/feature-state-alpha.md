{% assign dialog_title = "alpha" %}
{% capture dialog_content %}
This feature is currently in a *alpha* state, meaning:

* The version names contain alpha (e.g. v1alpha1).
* Might be buggy. Enabling the feature may expose bugs. Disabled by default.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.

{% endcapture %}

**FEATURE STATE:** `Kubernetes {{ for_k8s_version | default: page.version }}` {% include feature-dialog.md %}
