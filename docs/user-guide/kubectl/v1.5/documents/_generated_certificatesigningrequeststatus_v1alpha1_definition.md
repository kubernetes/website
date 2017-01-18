## CertificateSigningRequestStatus v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Certificates | v1alpha1 | CertificateSigningRequestStatus

> Example yaml coming soon...





<aside class="notice">
Appears In  <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
certificate <br /> *string* | If request was approved, the controller will place the issued certificate here.
conditions <br /> *[CertificateSigningRequestCondition](#certificatesigningrequestcondition-v1alpha1) array* | Conditions applied to the request, such as approval or denial.

