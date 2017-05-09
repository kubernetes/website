{% assign dialog_title = "stable" %}
{% capture dialog_content %}
This feature is `stable`, meaning:

* The version name is vX where X is an integer.
* Stable versions of features will appear in released software for many subsequent versions.

`stable` level definition:

* Object Versioning: API version vX where X is an integer (e.g. v1)
* Availability: in official Kubernetes releases, and enabled by default
* Audience: all users
* Completeness: same as beta
* Upgradeability: only strictly compatible changes allowed in subsequent software releases
* Cluster Reliability: high
* Support: API version will continue to be present for many subsequent software releases;
* Recommended Use Cases: any

{% endcapture %}

**FEATURE STATE:** `Kubernetes {{ for_k8s_version }}` {% include dialog.md %}