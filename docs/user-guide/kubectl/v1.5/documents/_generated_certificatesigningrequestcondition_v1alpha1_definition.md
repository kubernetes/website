## CertificateSigningRequestCondition v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | CertificateSigningRequestCondition

> Example yaml coming soon...





<aside class="notice">
Appears In  <a href="#certificatesigningrequeststatus-v1alpha1">CertificateSigningRequestStatus</a> </aside>

Field        | Description
------------ | -----------
lastUpdateTime <br /> *[Time](#time-unversioned)* | timestamp for the last update to this condition
message <br /> *string* | human readable message with details about the request state
reason <br /> *string* | brief reason for the request state
type <br /> *string* | request approval state, currently Approved or Denied.

