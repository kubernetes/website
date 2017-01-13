

-----------
# ServiceAccount v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ServiceAccount







ServiceAccount binds together: * a name, understood by users, and perhaps by peripheral systems, for an identity * a principal that can be authenticated and authorized * a set of secrets

<aside class="notice">
Appears In <a href="#serviceaccountlist-v1">ServiceAccountList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
imagePullSecrets <br /> *[LocalObjectReference](#localobjectreference-v1) array*  | ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: http://kubernetes.io/docs/user-guide/secrets#manually-specifying-an-imagepullsecret
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
secrets <br /> *[ObjectReference](#objectreference-v1) array*  | Secrets is the list of secrets allowed to be used by pods running using this ServiceAccount. More info: http://kubernetes.io/docs/user-guide/secrets


### ServiceAccountList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[ServiceAccount](#serviceaccount-v1) array*  | List of ServiceAccounts. More info: http://releases.k8s.io/HEAD/docs/design/service_accounts.md#service-accounts
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





