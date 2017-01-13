## CertificateSigningRequest v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Certificates | v1alpha1 | CertificateSigningRequest



Describes a certificate signing request

<aside class="notice">
Appears In  <a href="#certificatesigningrequestlist-v1alpha1">CertificateSigningRequestList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[CertificateSigningRequestSpec](#certificatesigningrequestspec-v1alpha1)*  | The certificate request itself and any additional information.
status <br /> *[CertificateSigningRequestStatus](#certificatesigningrequeststatus-v1alpha1)*  | Derived information about the request.

