---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request."
title: "SelfSubjectReview"
weight: 6
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

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`


## SelfSubjectReview {#SelfSubjectReview}

SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.

<hr>

- **apiVersion**: authentication.k8s.io/v1


- **kind**: SelfSubjectReview


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **status** (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a>)

  Status is filled in by the server with the user attributes.





## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.

<hr>

- **userInfo** (UserInfo)

  User attributes of the user making this request.

  <a name="UserInfo"></a>
  *UserInfo holds the information about the user needed to implement the user.Info interface.*

  - **userInfo.extra** (map[string][]string)

    Any additional information provided by the authenticator.

  - **userInfo.groups** ([]string)

    *Atomic: will be replaced during a merge*
    
    The names of groups this user is a part of.

  - **userInfo.uid** (string)

    A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.

  - **userInfo.username** (string)

    The name that uniquely identifies this user among all active users.





## Operations {#Operations}



<hr>






### `create` create a SelfSubjectReview

#### HTTP Request

POST /apis/authentication.k8s.io/v1/selfsubjectreviews

#### Parameters


- **body**: <a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Accepted

401: Unauthorized

