---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectRulesReviewStatus"
content_type: "api_reference"
description: "SubjectRulesReviewStatus 包含了规则检查的结果。
              根据服务器配置的授权器集合以及评估过程中出现的任何错误，该检查结果可能是不完整的。
              由于授权规则是累加的，因此如果某条规则出现在列表中，
              即便该列表不完整，也可以确信主体拥有相应的权限。"
title: "SubjectRulesReviewStatus"
weight: 560
---

<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectRulesReviewStatus"
content_type: "api_reference"
description: "SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it&#39;s safe to assume the subject has that permission, even if that list is incomplete."
title: "SubjectRulesReviewStatus"
weight: 560
auto_generated: true
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## SubjectRulesReviewStatus {#SubjectRulesReviewStatus}

<!--
SubjectRulesReviewStatus contains the result of a rules check.
This check can be incomplete depending on the set of authorizers
the server is configured with and any errors experienced during evaluation.
Because authorization rules are additive, if a rule appears in a list it&#39;s
safe to assume the subject has that permission, even if that list is incomplete.
-->
SubjectRulesReviewStatus 包含了规则检查的结果。
根据服务器配置的授权器集合以及评估过程中出现的任何错误，该检查结果可能是不完整的。
由于授权规则是累加的，因此如果某条规则出现在列表中，
即便该列表不完整，也可以确信主体拥有相应的权限。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>evaluationError</code><br/><em>string</em></td>
      <td>
      <!--
      evaluationError can appear in combination with Rules.
      It indicates an error occurred during rule evaluation,
      such as an authorizer that doesn't support rule evaluation,
      and that ResourceRules and/or NonResourceRules may be incomplete.
      -->
      evaluationError 可能会与“规则”（Rules）一同出现。
      它表示在规则评估过程中发生了错误（例如，某个授权器不支持规则评估），并提示
      ResourceRules 和/或 NonResourceRules 可能是不完整的。
      </td>
    </tr>
    <tr>
      <td><code>incomplete</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>
      <!--
      incomplete is true when the rules returned by this call are incomplete.
      This is most commonly encountered when an authorizer,
      such as an external authorizer, doesn't support rules evaluation.
      -->
      当本次调用返回的规则不完整时，incomplete 字段为 true。
      这种情况最常见于授权器（例如外部授权器）不支持规则评估的场景。
      </td>
    </tr>
    <tr>
      <td><code>nonResourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "non-resource-rule-v1-authorization#NonResourceRule" >}}">NonResourceRule array</a></em></td>
      <td>
      <!--
      nonResourceRules is the list of actions the subject is allowed to perform on non-resources. 
      The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
      -->
      nonResourceRules 是主体被允许对非资源执行的操作列表。
      该列表的顺序无关紧要，可能包含重复项，也可能不完整。
      </td>
    </tr>
    <tr>
      <td><code>resourceRules</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "resource-rule-v1-authorization#ResourceRule" >}}">ResourceRule array</a></em></td>
      <td>
      <!--
      resourceRules is the list of actions the subject is allowed to perform on resources.
      The list ordering isn't significant, may contain duplicates, and possibly be incomplete.
      -->
      resourceRules 是主体被允许对资源执行的操作列表。
      该列表的顺序无关紧要，可能包含重复项，也可能不完整。
      </td>
    </tr>
  </tbody>
</table>

