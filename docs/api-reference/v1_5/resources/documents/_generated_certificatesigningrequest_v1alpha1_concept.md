

-----------
# CertificateSigningRequest v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | CertificateSigningRequest







Describes a certificate signing request

<aside class="notice">
Appears In <a href="#certificatesigningrequestlist-v1alpha1">CertificateSigningRequestList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[CertificateSigningRequestSpec](#certificatesigningrequestspec-v1alpha1)*  | The certificate request itself and any additional information.
status <br /> *[CertificateSigningRequestStatus](#certificatesigningrequeststatus-v1alpha1)*  | Derived information about the request.


### CertificateSigningRequestSpec v1alpha1

<aside class="notice">
Appears In <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
groups <br /> *string array*  | 
request <br /> *string*  | Base64-encoded PKCS#10 CSR data
uid <br /> *string*  | 
username <br /> *string*  | Information about the requesting user (if relevant) See user.Info interface for details

### CertificateSigningRequestStatus v1alpha1

<aside class="notice">
Appears In <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
certificate <br /> *string*  | If request was approved, the controller will place the issued certificate here.
conditions <br /> *[CertificateSigningRequestCondition](#certificatesigningrequestcondition-v1alpha1) array*  | Conditions applied to the request, such as approval or denial.

### CertificateSigningRequestList v1alpha1



Field        | Description
------------ | -----------
items <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1) array*  | 
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | 





