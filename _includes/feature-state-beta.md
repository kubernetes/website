{% assign dialog_title = "`beta`" %}
{% capture dialog_content %}
This feature is currently in a `beta` state, meaning:

* The version names contain beta (e.g. v2beta3).
* Code is well tested. Enabling the feature is considered safe. Enabled by default.
* Support for the overall feature will not be dropped, though details may change.
* The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release. When this happens, we will provide instructions for migrating to the next version. This may require deleting, editing, and re-creating API objects. The editing process may require some thought. This may require downtime for applications that rely on the feature.
* Recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases. If you have multiple clusters which can be upgraded independently, you may be able to relax this restriction.
* **Please do try our beta features and give feedback on them! Once they exit beta, it may not be practical for us to make more changes.**

`beta` level definition:

* Object Versioning: API version name contains beta (e.g. v2beta3)
* Availability: in official Kubernetes releases, and enabled by default
* Audience: users interested in providing feedback on features
* Completeness: all API operations, CLI commands, and UI support should be implemented; end-to-end tests complete; the API has had a thorough API review and is thought to be complete, though use during beta may frequently turn up API issues not thought of during review
* Upgradeability: the object schema and semantics may change in a later software release; when this happens, an upgrade path will be documented; in some cases, objects will be automatically converted to the new version; in other cases, a manual upgrade may be necessary; a manual upgrade may require downtime for anything relying on the new feature, and may require manual conversion of objects to the new version; when manual conversion is necessary, the project will provide documentation on the process (for an example, see v1 conversion tips)
* Cluster Reliability: since the feature has e2e tests, enabling the feature via a flag should not create new bugs in unrelated features; because the feature is new, it may have minor bugs
* Support: the project commits to complete the feature, in some form, in a subsequent Stable version; typically this will happen within 3 months, but sometimes longer; releases should simultaneously support two consecutive versions (e.g. v1beta1 and v1beta2; or v1beta2 and v1) for at least one minor release cycle (typically 3 months) so that users have enough time to upgrade and migrate objects
* Recommended Use Cases: in short-lived testing clusters; in production clusters as part of a short-lived evaluation of the feature in order to provide feedback

{% endcapture %}

**FEATURE STATE:** Kubernetes `{{ for_k8s_version }}` {% include dialog.md %}