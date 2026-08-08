---
reviewers:
- enj
- liggitt
- thockin
title: Pods के लिए Service Accounts कॉन्फ़िगर करें
content_type: task
weight: 120
---

Kubernetes उन clients के लिए, जो आपके cluster के भीतर चलते हैं
या जिनका आपके cluster के
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
से किसी प्रकार का संबंध होता है, authentication के दो अलग तरीके प्रदान करता है ताकि वे
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} से प्रमाणित हो सकें।

एक _service account_ Pod में चलने वाली processes के लिए identity प्रदान करता है,
और यह ServiceAccount object से map होता है। जब आप API server से authenticate करते हैं,
तो आप स्वयं को एक विशेष _user_ के रूप में पहचानते हैं। Kubernetes user की अवधारणा को पहचानता है,
लेकिन स्वयं Kubernetes में User API **नहीं** है।

यह task guide ServiceAccounts के बारे में है, जो Kubernetes API में मौजूद हैं।
यह guide आपको Pods के लिए ServiceAccounts कॉन्फ़िगर करने के कुछ तरीके दिखाती है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## API server तक पहुँचने के लिए default service account का उपयोग करें

जब Pods API server से संपर्क करते हैं, तो वे किसी विशेष ServiceAccount
(उदाहरण के लिए `default`) के रूप में authenticate करते हैं।
हर {{< glossary_tooltip text="namespace" term_id="namespace" >}} में हमेशा कम से कम एक ServiceAccount होता है।

हर Kubernetes namespace में कम से कम एक ServiceAccount होता है:
उस namespace का default ServiceAccount, जिसका नाम `default` होता है।
अगर आप Pod बनाते समय ServiceAccount specify नहीं करते,
तो Kubernetes उस namespace का `default` ServiceAccount अपने-आप असाइन कर देता है।

आप अपने बनाए Pod का विवरण प्राप्त कर सकते हैं। उदाहरण के लिए:

```shell
kubectl get pods/<podname> -o yaml
```

आउटपुट में आपको `spec.serviceAccountName` field दिखाई देगी।
अगर Pod बनाते समय आप यह मान सेट नहीं करते, तो Kubernetes इसे अपने-आप सेट करता है।

Pod के अंदर चल रहा application, automatically mounted service account credentials का उपयोग करके
Kubernetes API तक पहुँच सकता है।
अधिक जानने के लिए [accessing the Cluster](/docs/tasks/access-application-cluster/access-cluster/) देखें।

जब Pod, ServiceAccount के रूप में authenticate करता है, तो उसका access level
उपयोग में मौजूद [authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules)
पर निर्भर करता है।

Pod delete होने पर API credentials अपने-आप revoke हो जाते हैं, भले ही
finalizers लगे हों। विशेष रूप से, Pod पर `.metadata.deletionTimestamp` सेट होने के 60 seconds बाद
API credentials revoke हो जाते हैं (deletion timestamp आमतौर पर वह समय होता है जब **delete**
request स्वीकार की गई, plus Pod का termination grace period)।

### API credential automounting से बाहर निकलें

अगर आप नहीं चाहते कि {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
ServiceAccount की API credentials अपने-आप mount करे, तो आप default behavior से बाहर निकल सकते हैं।
आप service account पर `automountServiceAccountToken: false` सेट करके
`/var/run/secrets/kubernetes.io/serviceaccount/token` पर API credentials की automounting बंद कर सकते हैं:

उदाहरण के लिए:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

आप किसी विशेष Pod के लिए भी API credentials की automounting बंद कर सकते हैं:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

यदि ServiceAccount और Pod की `.spec` दोनों में
`automountServiceAccountToken` का मान दिया गया है, तो Pod spec को प्राथमिकता मिलती है।

## एक से अधिक ServiceAccount का उपयोग करें {#use-multiple-service-accounts}

हर namespace में कम से कम एक ServiceAccount होता है: default ServiceAccount
resource, जिसका नाम `default` है। आप
[वर्तमान namespace](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
में सभी ServiceAccount resources की सूची इस तरह देख सकते हैं:

```shell
kubectl get serviceaccounts
```

आउटपुट इस प्रकार होगा:

```
NAME      SECRETS    AGE
default   1          1d
```

आप अतिरिक्त ServiceAccount objects इस तरह बना सकते हैं:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

ServiceAccount object का नाम एक वैध
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) होना चाहिए।

अगर आप service account object का पूरा dump ऐसे लेते हैं:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

तो आउटपुट इस तरह होगा:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-06-16T00:12:34Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
```

आप authorization plugins का उपयोग करके
[service accounts पर permissions सेट](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
कर सकते हैं।

non-default service account का उपयोग करने के लिए Pod के `spec.serviceAccountName`
field में उस ServiceAccount का नाम सेट करें जिसे आप उपयोग करना चाहते हैं।

आप `serviceAccountName` field केवल Pod बनाते समय या नए Pod के template में ही सेट कर सकते हैं।
पहले से मौजूद Pod की `.spec.serviceAccountName` field अपडेट नहीं की जा सकती।

{{< note >}}
`.spec.serviceAccount` field, `.spec.serviceAccountName` का deprecated alias है।
अगर आप workload resource से fields हटाना चाहते हैं, तो [pod template](/docs/concepts/workloads/pods#pod-templates)
पर दोनों fields को स्पष्ट रूप से empty सेट करें।
{{< /note >}}

### साफ़-सफ़ाई {#cleanup-use-multiple-service-accounts}

अगर आपने ऊपर के उदाहरण से `build-robot` ServiceAccount बनाया है,
तो इसे हटाने के लिए यह चलाएँ:

```shell
kubectl delete serviceaccount/build-robot
```

## ServiceAccount के लिए API token manually बनाएं

मान लीजिए आपके पास पहले बताए अनुसार "build-robot" नाम का service account मौजूद है।

आप `kubectl` से उस ServiceAccount के लिए time-limited API token प्राप्त कर सकते हैं:

```shell
kubectl create token build-robot
```

इस command का आउटपुट एक token होता है, जिससे आप उस
ServiceAccount के रूप में authenticate कर सकते हैं। आप `kubectl create token` में
`--duration` command line argument देकर token की विशेष duration मांग सकते हैं
(हालांकि वास्तविक issued token duration छोटी भी हो सकती है या कभी-कभी लंबी भी)।

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

`kubectl` v1.31 या बाद के version में आप ऐसा service account token बना सकते हैं
जो सीधे किसी Node से bound हो:

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

token तब तक वैध रहेगा जब तक वह expire न हो जाए, या उससे संबंधित Node या service account delete न हो जाए।

{{< note >}}
Kubernetes v1.22 से पहले के versions Kubernetes API access करने के लिए long term credentials
स्वतः बनाते थे। यह पुराना तरीका token Secrets बनाने पर आधारित था जिन्हें फिर running Pods में mount किया जा सकता था।
अधिक नए versions में, जिनमें Kubernetes v{{< skew currentVersion >}} भी शामिल है, API credentials सीधे
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API के जरिए प्राप्त की जाती हैं,
और इन्हें Pods में
[projected volume (प्रोजेक्टेड वॉल्यूम)](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
के जरिए mount किया जाता है।
इस तरीके से प्राप्त tokens की सीमित lifetime होती है, और जिस Pod में वे mount हैं उसके delete होने पर
वे स्वतः invalid हो जाते हैं।

आप फिर भी manually service account token Secret बना सकते हैं; उदाहरण के लिए
अगर आपको ऐसा token चाहिए जो कभी expire न हो। हालांकि API access के लिए token लेने का
recommended तरीका [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource ही है।
{{< /note >}}

### ServiceAccount के लिए manually long-lived API token बनाएं

अगर आप ServiceAccount के लिए API token लेना चाहते हैं, तो आपको
एक नई Secret बनानी होगी जिसमें special annotation `kubernetes.io/service-account.name` हो।

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

अगर आप Secret को इस तरह देखें:

```shell
kubectl get secret/build-robot-secret -o yaml
```

तो आप देखेंगे कि अब इस Secret में "build-robot" ServiceAccount के लिए API token मौजूद है।

आपके द्वारा सेट annotation की वजह से control plane उस ServiceAccount के लिए अपने-आप token बनाता है
और उसे संबंधित Secret में store करता है। control plane delete किए गए ServiceAccounts के tokens भी साफ करता है।

```shell
kubectl describe secrets/build-robot-secret
```

आउटपुट इस तरह होगा:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
यहाँ `token` की सामग्री छोड़ी गई है।

ध्यान रखें कि `kubernetes.io/service-account-token` Secret की सामग्री ऐसी जगह display न करें
जहाँ कोई अन्य व्यक्ति आपकी terminal/computer screen देख सके।
{{< /note >}}

जब आप associated Secret वाले ServiceAccount को delete करते हैं, तो Kubernetes
control plane उस Secret से long-lived token अपने-आप साफ कर देता है।

{{< note >}}
अगर आप ServiceAccount को इस तरह देखते हैं:

` kubectl get serviceaccount build-robot -o yaml`

तो ServiceAccount API object के
[`.secrets`](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/) field में
आपको `build-robot-secret` Secret नहीं दिखेगी, क्योंकि वह field केवल auto-generated Secrets से भरी जाती है।
{{< /note >}}

## Service account में ImagePullSecrets जोड़ें

पहले, [imagePullSecret बनाएं](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)।
फिर जांचें कि वह बन चुकी है। उदाहरण के लिए:

- imagePullSecret बनाएं, जैसा कि
  [Specifying ImagePullSecrets on a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) में बताया गया है।

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=<registry name> \
          --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
          --docker-email=DUMMY_DOCKER_EMAIL
  ```

- जांचें कि यह बन चुकी है।

  ```shell
  kubectl get secrets myregistrykey
  ```

  आउटपुट इस तरह होगा:

  ```
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

### Service account में image pull secret जोड़ें

अब namespace के default service account को modify करें ताकि वह इस Secret को imagePullSecret के रूप में उपयोग करे।

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

आप object को manually edit करके भी यही परिणाम पा सकते हैं:

```shell
kubectl edit serviceaccount/default
```

`sa.yaml` file का आउटपुट कुछ ऐसा होगा:

आपके चुने हुए text editor में कुछ इस तरह की configuration खुलेगी:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
```

अपने editor का उपयोग करके `resourceVersion` key वाली line हटाएँ, `imagePullSecrets:`
के लिए lines जोड़ें और save करें। `uid` value को उसी तरह रहने दें जैसा मिला था।

इन बदलावों के बाद edited ServiceAccount कुछ ऐसा दिखेगा:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
imagePullSecrets:
  - name: myregistrykey
```

### सत्यापित करें कि नए Pods के लिए imagePullSecrets सेट हैं

अब जब current namespace में default ServiceAccount का उपयोग करते हुए नया Pod बनाया जाएगा,
तो नए Pod की `spec.imagePullSecrets` field अपने-आप सेट होगी:

```shell
kubectl run nginx --image=<registry name>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

आउटपुट:

```
myregistrykey
```

## ServiceAccount token वॉल्यूम प्रोजेक्शन

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
token request projection को enable और उपयोग करने के लिए, आपको `kube-apiserver` में
निम्न command line arguments specify करने होंगे:

`--service-account-issuer`
: service account token issuer का Identifier परिभाषित करता है। आप
  `--service-account-issuer` argument कई बार दे सकते हैं; यह issuer को बिना बाधा बदलेने के लिए उपयोगी हो सकता है।
  जब यह flag कई बार दिया जाता है, तो पहला token generate करने के लिए उपयोग होता है और सभी values
  accepted issuers तय करने के लिए उपयोग होती हैं। `--service-account-issuer` को कई बार
  specify करने के लिए Kubernetes v1.22 या बाद का version आवश्यक है।

`--service-account-key-file`
: PEM-encoded X.509 private/public keys (RSA या ECDSA) वाली फ़ाइल का path बताता है,
  जो ServiceAccount tokens verify करने के लिए उपयोग होती हैं। इस फ़ाइल में कई keys हो सकती हैं
  और यह flag अलग-अलग files के साथ कई बार दिया जा सकता है।
  यदि कई बार दिया जाए, तो किसी भी निर्दिष्ट key से signed tokens को Kubernetes API server वैध मानता है।

`--service-account-signing-key-file`
: उस फ़ाइल का path बताता है जिसमें service account token issuer की वर्तमान private key होती है।
  issuer इसी private key से ID tokens sign करता है।

`--api-audiences` (छोड़ा जा सकता है)
: ServiceAccount tokens के audiences परिभाषित करता है। service account token authenticator
  verify करता है कि API के विरुद्ध उपयोग हो रहे tokens इनमें से कम से कम एक audience से bound हों।
  यदि `api-audiences` कई बार दिया जाए, तो किसी भी निर्दिष्ट audience के tokens Kubernetes API server द्वारा वैध माने जाते हैं।
  यदि आप `--service-account-issuer` सेट करते हैं लेकिन `--api-audiences` नहीं सेट करते,
  तो control plane default रूप से एक single-element audience list उपयोग करता है जिसमें केवल issuer URL होता है।

{{< /note >}}

kubelet ServiceAccount token को Pod में project भी कर सकता है। आप token की
वांछित properties (जैसे audience और validity duration) specify कर सकते हैं।
ये properties default ServiceAccount token पर configurable नहीं होतीं।
Pod या ServiceAccount में से किसी एक के delete होने पर token API के लिए invalid हो जाएगा।

Pod की `spec` में आप यह behavior
[projected volume (प्रोजेक्टेड वॉल्यूम)](/docs/concepts/storage/volumes/#projected) type
`ServiceAccountToken` का उपयोग करके कॉन्फ़िगर कर सकते हैं।

इस projected volume का token एक {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}} (JWT) होता है।
इस token का JSON payload एक well-defined schema का पालन करता है। Pod-bound token का उदाहरण payload:

```yaml
{
  "aud": [  # matches the requested audiences, or the API server's default audiences when none are explicitly requested
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # matches the first value passed to the --service-account-issuer flag
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a", 
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {
      "name": "127.0.0.1",
      "uid": "58456cb0-dd00-45ed-b797-5578fdceaced"
    },
    "pod": {
      "name": "coredns-69cbfb9798-jv9gn",
      "uid": "778a530c-b3f4-47c0-9cd5-ab018fb64f33"
    },
    "serviceaccount": {
      "name": "coredns",
      "uid": "a087d5a0-e1dd-43ec-93ac-f13d89cd13af"
    },
    "warnafter": 1700081020
  },
  "nbf": 1700077413,
  "sub": "system:serviceaccount:kube-system:coredns"
}
```

### Service account token projection का उपयोग करते हुए Pod लॉन्च करें

Pod को `vault` audience और दो घंटे की validity duration वाला token देने के लिए
आप ऐसा Pod manifest define कर सकते हैं:

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

Pod बनाएं:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

kubelet यह करेगा: Pod की ओर से token request और store करेगा;
token को Pod में configurable file path पर उपलब्ध कराएगा;
और expiration के करीब आते ही token refresh करेगा।
यदि token अपनी कुल time-to-live (TTL) का 80% से पुराना हो जाए,
या token 24 घंटे से पुराना हो, तो kubelet proactively rotation request करता है।

token rotate होने पर application को token reload करना जिम्मेदारी है।
अक्सर application के लिए token को schedule पर reload करना पर्याप्त होता है
(उदाहरण: हर 5 मिनट), बिना वास्तविक expiry time track किए।

### Service account issuer डिस्कवरी

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

यदि आपने अपने cluster में ServiceAccounts के लिए
[token projection](#serviceaccount-token-volume-projection) enable किया है,
तो आप discovery feature भी उपयोग कर सकते हैं। Kubernetes clients को
_identity provider_ की तरह federate करने का तरीका देता है, ताकि एक या अधिक
external systems _relying party_ की तरह काम कर सकें।

{{< note >}}
issuer URL को
[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html) का पालन करना चाहिए।
व्यवहार में इसका अर्थ है कि URL `https` scheme का उपयोग करे और
`{service-account-issuer}/.well-known/openid-configuration` पर OpenID provider configuration serve करे।

यदि URL इसका पालन नहीं करता, तो ServiceAccount issuer discovery endpoints
register या accessible नहीं होंगे।
{{< /note >}}

enable होने पर Kubernetes API server HTTP के जरिए OpenID Provider
Configuration document publish करता है। यह document
`/.well-known/openid-configuration` पर उपलब्ध होता है।
OpenID Provider Configuration को कभी-कभी _discovery document_ भी कहा जाता है।
Kubernetes API server इससे संबंधित JSON Web Key Set (JWKS) भी HTTP के जरिए
`/openid/v1/jwks` पर publish करता है।

{{< note >}}
`/.well-known/openid-configuration` और `/openid/v1/jwks` पर मिलने वाले responses
OIDC compatible होने के लिए डिज़ाइन किए गए हैं, लेकिन strictly OIDC compliant नहीं हैं।
इन documents में केवल वे parameters होते हैं जो Kubernetes service account tokens को
validate करने के लिए आवश्यक हैं।
{{< /note >}}

जो clusters {{< glossary_tooltip text="RBAC" term_id="rbac">}} का उपयोग करते हैं, उनमें
`system:service-account-issuer-discovery` नाम का एक default ClusterRole शामिल होता है।
एक default ClusterRoleBinding यह role `system:serviceaccounts` group को assign करता है,
जिससे सभी ServiceAccounts निहित रूप से जुड़े होते हैं।
इससे cluster पर चल रहे pods अपने mounted service account token के जरिए
service account discovery document access कर सकते हैं।
इसके अतिरिक्त administrators अपनी सुरक्षा आवश्यकताओं और जिन external systems से वे federate करना चाहते हैं,
उनके आधार पर इस role को `system:authenticated` या `system:unauthenticated` से भी bind कर सकते हैं।

JWKS response में public keys होती हैं जिन्हें relying party Kubernetes service account tokens
validate करने के लिए उपयोग कर सकती है। Relying parties पहले OpenID Provider Configuration query करती हैं,
और response में `jwks_uri` field का उपयोग करके JWKS location प्राप्त करती हैं।

कई स्थितियों में Kubernetes API servers public internet पर उपलब्ध नहीं होते,
लेकिन API server से cached responses serve करने वाले public endpoints users या service providers द्वारा उपलब्ध कराए जा सकते हैं।
ऐसे मामलों में OpenID Provider Configuration में `jwks_uri` को override किया जा सकता है ताकि वह API server address के बजाय
public endpoint पर point करे। इसके लिए API server पर `--service-account-jwks-uri` flag पास किया जाता है।
issuer URL की तरह JWKS URI में भी `https` scheme आवश्यक है।

## {{% heading "whatsnext" %}}

यह भी देखें:

- [Cluster Admin Guide to Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/) पढ़ें।
- [Authorization in Kubernetes](/docs/reference/access-authn-authz/authorization/) के बारे में पढ़ें।
- [Secrets](/docs/concepts/configuration/secret/) के बारे में पढ़ें।
  - या [Secrets का उपयोग करके credentials को सुरक्षित रूप से distribute करें](/docs/tasks/inject-data-application/distribute-credentials-secure/) सीखें।
  - लेकिन यह भी ध्यान रखें कि ServiceAccount के रूप में authenticate करने के लिए Secrets का उपयोग deprecated है।
    इसके लिए recommended विकल्प [ServiceAccount token volume projection](#serviceaccount-token-volume-projection) है।
- [projected volumes](/docs/tasks/configure-pod-container/configure-projected-volume-storage/) के बारे में पढ़ें।
- OIDC discovery की पृष्ठभूमि के लिए
  [ServiceAccount signing key retrieval (प्राप्ति)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
  Kubernetes Enhancement Proposal पढ़ें।
- [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html) पढ़ें।
