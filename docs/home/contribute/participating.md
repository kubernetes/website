---
title: Participating in SIG-DOCS
---

{% capture overview %}
SIG-DOCS is one of the [special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md) within the Kubernetes project, focused on writing, updating, and maintaining the documentation for the project as a whole.

{% endcapture %}

{% capture body %}

You can get an overview of [SIG-DOCS from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs). The SIG-DOCS group has two teams defined:
 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

These groups are used for access to the [website repository](https://github.com/kubernetes/website), which houses the content that hosted at this site.

These groups are also used by the github automation tooling that Kubernetes uses as a project.
https://github.com/kubernetes/community/blob/master/contributors/devel/owners.md

Our repo uses the blunderbuss and approve plugins of prow
 - repo config for Prow https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210, which in turn use the [OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and [OWNERS_ALIAS](https://github.com/kubernetes/website/blob/master/OWNERS_ALIAS) files in our repo for configuration.

 These list "reviewers" and "approvers" ...

 So what's all that stuff actually mean...


## Roles and Responsibilities

- being listed as an 'Approver'

- being listed as a 'Reviewer'

{% endcapture %}

{% capture whatsnext %}
For more information about contributing to the Kubernetes documentation, see:

* Review the SIG-DOCS [Style Guide](/docs/home/contribute/style-guide/).
* Learn how to [stage your documentation changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
* How to generate documentation:
  * Learn how to [generate Reference Documentation for Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
  * Learn how to [generate Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
  * Learn how to [generate Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
  * Learn how to [generate Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
{% endcapture %}

{% include templates/concept.md %}
