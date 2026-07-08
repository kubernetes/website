---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "RuleWithOperations"
content_type: "api_reference"
description: "RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid."
title: "RuleWithOperations"
weight: 430
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`


## RuleWithOperations {#RuleWithOperations}

RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>apiGroups is the API groups the resources belong to. '\*' is all groups. If '\*' is present, the length of the slice must be one. Required.</td>
    </tr>
    <tr>
      <td><code>apiVersions</code><br/><em>string array</em></td>
      <td>apiVersions is the API versions the resources belong to. '\*' is all versions. If '\*' is present, the length of the slice must be one. Required.</td>
    </tr>
    <tr>
      <td><code>operations</code><br/><em>string array</em></td>
      <td>operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '\*' is present, the length of the slice must be one. Required.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>resources is a list of resources this rule applies to.  For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '\*' means all resources, but not subresources. 'pods/\*' means all subresources of pods. '\*/scale' means all scale subresources. '\*/\*' means all resources and their subresources.  If wildcard is present, the validation rule will ensure resources do not overlap with each other.  Depending on the enclosing object, subresources might not be allowed. Required.</td>
    </tr>
    <tr>
      <td><code>scope</code><br/><em>string</em></td>
      <td>scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".<br/><br/>Possible enum values:<br/> - `"*"` means that all scopes are included.<br/> - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.<br/> - `"Namespaced"` means that scope is limited to namespaced objects.</td>
    </tr>
  </tbody>
</table>









