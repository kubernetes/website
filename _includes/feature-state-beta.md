{% assign dialog_title = "beta" %}
{% capture dialog_content %}
This feature is currently in a *beta* state, meaning:

* The version names contain beta (e.g. v2beta3).
* Code is well tested. Enabling the feature is considered safe. Enabled by default.
* Support for the overall feature will not be dropped, though details may change.
* The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release. When this happens, we will provide instructions for migrating to the next version. This may require deleting, editing, and re-creating API objects. The editing process may require some thought. This may require downtime for applications that rely on the feature.
* Recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases. If you have multiple clusters that can be upgraded independently, you may be able to relax this restriction.
* **Please do try our beta features and give feedback on them! After they exit beta, it may not be practical for us to make more changes.**

{% endcapture %}

**FEATURE STATE:** `Kubernetes {{ for_k8s_version | default: page.version }}` {% include feature-dialog.md %}
