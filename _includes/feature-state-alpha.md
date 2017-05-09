{% assign dialog_title = "alpha" %}
{% capture dialog_content %}
This feature is currently in a `alpha` state, meaning:

* The version names contain alpha (e.g. v1alpha1).
* May be buggy. Enabling the feature may expose bugs. Disabled by default.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.

`alpha` level definition:

* Object Versioning: API version name contains alpha (e.g. v1alpha1)
* Availability: committed to main kubernetes repo; appears in an official release; feature is disabled by default, but may be enabled by flag
* Audience: developers and expert users interested in giving early feedback on features
* Completeness: some API operations, CLI commands, or UI support may not be implemented; the API need not have had an API review (an intensive and targeted review of the API, on top of a normal code review)
* Upgradeability: the object schema and semantics may change in a later software release, without any provision for preserving objects in an existing cluster; removing the upgradability concern allows developers to make rapid progress; in particular, API versions can increment faster than the minor release cadence and the developer need not maintain multiple versions; developers should still increment the API version when object schema or semantics change in an incompatible way
* Cluster Reliability: because the feature is relatively new, and may lack complete end-to-end tests, enabling the feature via a flag might expose bugs with destabilize the cluster (e.g. a bug in a control loop might rapidly create excessive numbers of object, exhausting API storage).
* Support: there is no commitment from the project to complete the feature; the feature may be dropped entirely in a later software release
* Recommended Use Cases: only in short-lived testing clusters, due to complexity of upgradeability and lack of long-term support and lack of upgradability.

{% endcapture %}

**FEATURE STATE:** `Kubernetes {{ for_k8s_version }}` {% include dialog.md %}