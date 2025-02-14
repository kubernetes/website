---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview checks whether or not a user or group can perform an action."
title: "SubjectAccessReview"
weight: 4
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


## SubjectAccessReview {#SubjectAccessReview}

SubjectAccessReview checks whether or not a user or group can perform an action.

<hr>

- **apiVersion**: authorization.k8s.io/v1


- **kind**: SubjectAccessReview


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required

  Spec holds information about the request being evaluated

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  Status is filled in by the server and indicates whether the request is allowed or not





## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set

<hr>

- **extra** (map[string][]string)

  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.

- **groups** ([]string)

  *Atomic: will be replaced during a merge*
  
  Groups is the groups you're testing for.

- **nonResourceAttributes** (NonResourceAttributes)

  NonResourceAttributes describes information for a non-resource access request

  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface*

  - **nonResourceAttributes.path** (string)

    Path is the URL path of the request

  - **nonResourceAttributes.verb** (string)

    Verb is the standard HTTP verb

- **resourceAttributes** (ResourceAttributes)

  ResourceAuthorizationAttributes describes information for a resource access request

  <a name="ResourceAttributes"></a>
  *ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface*

  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector describes the limitation on access based on field.  It can only limit access, not broaden it.
    
    This field  is alpha-level. To use this field, you must enable the `AuthorizeWithSelectors` feature gate (disabled by default).

    <a name="FieldSelectorAttributes"></a>
    *FieldSelectorAttributes indicates a field limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*

    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.

    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      *Atomic: will be replaced during a merge*
      
      requirements is the parsed interpretation of a field selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="FieldSelectorRequirement"></a>
      *FieldSelectorRequirement is a selector that contains values, a key, and an operator that relates the key and values.*

      - **resourceAttributes.fieldSelector.requirements.key** (string), required

        key is the field selector key that the requirement applies to.

      - **resourceAttributes.fieldSelector.requirements.operator** (string), required

        operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. The list of operators may grow in the future.

      - **resourceAttributes.fieldSelector.requirements.values** ([]string)

        *Atomic: will be replaced during a merge*
        
        values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty.

  - **resourceAttributes.group** (string)

    Group is the API Group of the Resource.  "*" means all.

  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector describes the limitation on access based on labels.  It can only limit access, not broaden it.
    
    This field  is alpha-level. To use this field, you must enable the `AuthorizeWithSelectors` feature gate (disabled by default).

    <a name="LabelSelectorAttributes"></a>
    *LabelSelectorAttributes indicates a label limited access. Webhook authors are encouraged to * ensure rawSelector and requirements are not both set * consider the requirements field if set * not try to parse or consider the rawSelector field if set. This is to avoid another CVE-2022-2880 (i.e. getting different systems to agree on how exactly to parse a query is not something we want), see https://www.oxeye.io/resources/golang-parameter-smuggling-attack for more details. For the *SubjectAccessReview endpoints of the kube-apiserver: * If rawSelector is empty and requirements are empty, the request is not limited. * If rawSelector is present and requirements are empty, the rawSelector will be parsed and limited if the parsing succeeds. * If rawSelector is empty and requirements are present, the requirements should be honored * If rawSelector is present and requirements are present, the request is invalid.*

    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector is the serialization of a field selector that would be included in a query parameter. Webhook implementations are encouraged to ignore rawSelector. The kube-apiserver's *SubjectAccessReview will parse the rawSelector as long as the requirements are not present.

    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      *Atomic: will be replaced during a merge*
      
      requirements is the parsed interpretation of a label selector. All requirements must be met for a resource instance to match the selector. Webhook implementations should handle requirements, but how to handle them is up to the webhook. Since requirements can only limit the request, it is safe to authorize as unlimited request if the requirements are not understood.

      <a name="LabelSelectorRequirement"></a>
      *A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.*

      - **resourceAttributes.labelSelector.requirements.key** (string), required

        key is the label key that the selector applies to.

      - **resourceAttributes.labelSelector.requirements.operator** (string), required

        operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.

      - **resourceAttributes.labelSelector.requirements.values** ([]string)

        *Atomic: will be replaced during a merge*
        
        values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.

  - **resourceAttributes.name** (string)

    Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.

  - **resourceAttributes.namespace** (string)

    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)

    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)

    Subresource is one of the existing resource types.  "" means none.

  - **resourceAttributes.verb** (string)

    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)

    Version is the API Version of the Resource.  "*" means all.

- **uid** (string)

  UID information about the requesting user.

- **user** (string)

  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups





## SubjectAccessReviewStatus {#SubjectAccessReviewStatus}

SubjectAccessReviewStatus

<hr>

- **allowed** (boolean), required

  Allowed is required. True if the action would be allowed, false otherwise.

- **denied** (boolean)

  Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true.

- **evaluationError** (string)

  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)

  Reason is optional.  It indicates why a request was allowed or denied.





## Operations {#Operations}



<hr>






### `create` create a SubjectAccessReview

#### HTTP Request

POST /apis/authorization.k8s.io/v1/subjectaccessreviews

#### Parameters


- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized

