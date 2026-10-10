---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectRulesReviewStatus"
content_type: "api_reference"
description: "SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it&#39;s safe to assume the subject has that permission, even if that list is incomplete."
title: "SubjectRulesReviewStatus"
weight: 560
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

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## SubjectRulesReviewStatus {#SubjectRulesReviewStatus}

SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it&#39;s safe to assume the subject has that permission, even if that list is incomplete.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>evaluationError</code><br/><em>string</em></td>
      <td>evaluationError can appear in combination with Rules. It indicates an error occurred during rule evaluation, such as an authorizer that doesn't support rule evaluation, and that ResourceRules and/or NonResourceRules may be incomplete.</td>
    </tr>
    <tr>
      <td><code>incomplete</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>incomplete is true when the rules returned by this call are incomplete. This is most commonly encountered when an authorizer, such as an external authorizer, doesn't support rules evaluation.</td>
    </tr>
    <tr>
      <td><code>nonResourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "non-resource-rule-v1-authorization#NonResourceRule" >}}">NonResourceRule array</a></em></td>
      <td>nonResourceRules is the list of actions the subject is allowed to perform on non-resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.</td>
    </tr>
    <tr>
      <td><code>resourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "resource-rule-v1-authorization#ResourceRule" >}}">ResourceRule array</a></em></td>
      <td>resourceRules is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.</td>
    </tr>
  </tbody>
</table>









