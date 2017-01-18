## SubresourceReference v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SubresourceReference

> Example yaml coming soon...



SubresourceReference contains enough information to let you inspect or modify the referred subresource.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscalerspec-v1beta1">HorizontalPodAutoscalerSpec</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string* | API version of the referent
kind <br /> *string* | Kind of the referent; More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string* | Name of the referent; More info: http://kubernetes.io/docs/user-guide/identifiers#names
subresource <br /> *string* | Subresource name of the referent

