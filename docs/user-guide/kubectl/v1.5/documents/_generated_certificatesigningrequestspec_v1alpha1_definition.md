## CertificateSigningRequestSpec v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | CertificateSigningRequestSpec

> Example yaml coming soon...



This information is immutable after the request is created. Only the Request and ExtraInfo fields can be set on creation, other fields are derived by Kubernetes and cannot be modified by users.

<aside class="notice">
Appears In  <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
groups <br /> *string array* | 
request <br /> *string* | Base64-encoded PKCS#10 CSR data
uid <br /> *string* | 
username <br /> *string* | Information about the requesting user (if relevant) See user.Info interface for details

