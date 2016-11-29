

-----------
# CertificateSigningRequestStatus v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Certificates | v1alpha1 | CertificateSigningRequestStatus









<aside class="notice">
Appears In <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
certificate <br /> *string*  | If request was approved, the controller will place the issued certificate here.
conditions <br /> *[CertificateSigningRequestCondition](#certificatesigningrequestcondition-v1alpha1) array*  | Conditions applied to the request, such as approval or denial.





## <strong>Write Operations</strong>

See supported operations below...

## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



replace status of the specified CertificateSigningRequest

### HTTP Request

`PUT /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
body <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | 
name  | name of the CertificateSigningRequest
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | OK




