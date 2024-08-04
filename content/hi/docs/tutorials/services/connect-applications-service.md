---
title: एप्लिकेशन को सेवाओं से जोड़ें
content_type: tutorial
weight: 20
---


<!-- overview -->

## कंटेनरों को जोड़ने के लिए कुबेरनेट्स मॉडल

अब चूंकि आपके पास लगातार चलने वाला, रेप्लिकेटेड एप्लीकेशन है, तो आप इसे नेटवर्क पर प्रदर्शित कर सकते हैं।

Kubernetes मानता है कि पॉड अन्य पॉड के साथ संवाद कर सकते हैं, चाहे वे किसी भी होस्ट पर उतरें।
Kubernetes हर पॉड को अपना क्लस्टर-निजी IP पता देता है, इसलिए आपको पॉड के बीच स्पष्ट रूप से लिंक बनाने या कंटेनर पोर्ट को होस्ट पोर्ट पर मैप करने की आवश्यकता नहीं है। इसका मतलब है कि पॉड के भीतर सभी कंटेनर लोकलहोस्ट पर एक-दूसरे के पोर्ट तक पहुँच सकते हैं, और क्लस्टर में सभी पॉड NAT के बिना एक-दूसरे को देख सकते हैं। इस दस्तावेज़ का बाकी हिस्सा इस बात पर विस्तार से बताता है कि आप इस तरह के नेटवर्किंग मॉडल पर विश्वसनीय सेवाएँ कैसे चला सकते हैं।

यह ट्यूटोरियल अवधारणा को प्रदर्शित करने के लिए एक सरल nginx वेब सर्वर का उपयोग करता है।

<!-- body -->

## पॉड्स को क्लस्टर के सामने लाना

हमने पिछले उदाहरण में ऐसा किया था, लेकिन आइए इसे एक बार फिर से करें और नेटवर्किंग परिप्रेक्ष्य पर ध्यान केंद्रित करें।
एक nginx पॉड बनाएँ, और ध्यान दें कि इसमें एक कंटेनर पोर्ट विनिर्देश है:

{{% code_sample file="service/networking/run-my-nginx.yaml" %}}

इससे यह आपके क्लस्टर के किसी भी नोड से एक्सेस करने योग्य हो जाता है। पॉड जिस नोड पर चल रहा है, उसे जांचें:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

अपने पॉड्स के IP की जाँच करें:

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

आपको अपने क्लस्टर में किसी भी नोड में ssh करने में सक्षम होना चाहिए और दोनों IP के विरुद्ध क्वेरी बनाने के लिए `curl` जैसे टूल का उपयोग करना चाहिए। ध्यान दें कि कंटेनर नोड पर पोर्ट 80 का उपयोग नहीं कर रहे हैं, न ही ट्रैफ़िक को पॉड में रूट करने के लिए कोई विशेष NAT नियम हैं। इसका मतलब है कि आप एक ही नोड पर एक ही `containerPort` का उपयोग करके कई nginx पॉड चला सकते हैं, और पॉड के लिए निर्दिष्ट IP पते का उपयोग करके अपने क्लस्टर में किसी भी अन्य पॉड या नोड से उन्हें एक्सेस कर सकते हैं। यदि आप होस्ट नोड पर किसी विशिष्ट पोर्ट को बैकिंग पॉड्स पर अग्रेषित करने की व्यवस्था करना चाहते हैं, तो आप कर सकते हैं - लेकिन नेटवर्किंग मॉडल का मतलब यह होना चाहिए कि आपको ऐसा करने की आवश्यकता नहीं है।

यदि आप उत्सुक हैं तो आप [कुबेरनेट्स नेटवर्किंग](/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model) मॉडल के बारे में अधिक पढ़ सकते हैं।

## सेवा बनाना

तो हमारे पास फ्लैट, क्लस्टर वाइड, एड्रेस स्पेस में nginx चलाने वाले पॉड्स हैं। सिद्धांत रूप में, आप इन पॉड्स से सीधे बात कर सकते हैं, लेकिन जब कोई नोड मर जाता है तो क्या होता है? पॉड्स इसके साथ मर जाते हैं, और डिप्लॉयमेंट के अंदर रेप्लिकासेट अलग-अलग आईपी के साथ नए पॉड्स बनाएगा। यह वह समस्या है जिसे सर्विस हल करती है।

कुबेरनेट्स सेवा एक अमूर्तता है जो आपके क्लस्टर में कहीं चल रहे पॉड्स के तार्किक सेट को परिभाषित करती है, जो सभी एक ही कार्यक्षमता प्रदान करते हैं। बनाए जाने पर, प्रत्येक सेवा को एक अद्वितीय IP पता (जिसे क्लस्टरIP भी कहा जाता है) सौंपा जाता है। यह पता सेवा के जीवनकाल से जुड़ा होता है, और सेवा के जीवित रहने के दौरान इसमें कोई बदलाव नहीं होगा। पॉड्स को सेवा से बात करने के लिए कॉन्फ़िगर किया जा सकता है, और यह जान सकते हैं कि सेवा के लिए संचार स्वचालित रूप से कुछ पॉड पर लोड-बैलेंस हो जाएगा जो सेवा का सदस्य है।

आप `kubectl expose` के साथ अपने 2 nginx प्रतिकृतियों के लिए एक सेवा बना सकते हैं:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

यह निम्न yaml `kubectl apply -f` के समतुल्य है:

{{% code_sample file="service/networking/nginx-svc.yaml" %}}

यह विनिर्देश एक ऐसी सेवा बनाएगा जो `run: my-nginx` लेबल वाले किसी भी पॉड पर TCP पोर्ट 80 को लक्षित करेगी, और इसे एक अमूर्त सेवा पोर्ट पर प्रदर्शित करेगी। (`targetPort`: वह पोर्ट है जिस पर कंटेनर ट्रैफ़िक स्वीकार करता है, `port`: अमूर्त सेवा पोर्ट है, जो कोई भी पोर्ट हो सकता है जिसका उपयोग अन्य पॉड सेवा तक पहुंचने के लिए करते हैं)।

सेवा परिभाषा में समर्थित फ़ील्ड की सूची देखने के लिए [ServiceAPI](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) ऑब्जेक्ट देखें।

अपनी सेवा जांचें:

```shell89          
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

जैसा कि पहले बताया गया है, एक सेवा पॉड्स के एक समूह द्वारा समर्थित होती है। ये पॉड्स 
{{<glossary_tooltip term_id="endpoint-slice" text="एंडपॉइंट-स्लाइस">}} के माध्यम से उजागर होते हैं।
सेवा के चयनकर्ता का लगातार मूल्यांकन किया जाएगा और परिणाम एक एंडपॉइंटस्लाइस पर पोस्ट किए जाएंगे जो {{< glossary_tooltip term_id="label" text="लेबल">}} का उपयोग करके सेवा से जुड़ा हुआ है।
जब कोई पॉड मर जाता है, तो उसे स्वचालित रूप से एंडपॉइंटस्लाइस से हटा दिया जाता है जिसमें इसे एंडपॉइंट के रूप में शामिल किया जाता है। सेवा के चयनकर्ता से मेल खाने वाले नए पॉड स्वचालित रूप से उस सेवा के लिए एंडपॉइंटस्लाइस में जुड़ जाएंगे।

एंडपॉइंट की जाँच करें, और ध्यान दें कि आईपी पहले वेरिएबलरण में बनाए गए पॉड के समान हैं:

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get endpointslices -l kubernetes.io/service-name=my-nginx
```
```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

अब आप अपने क्लस्टर में किसी भी नोड से `<CLUSTER-IP>:<PORT>` पर nginx सेवा को कर्ल करने में सक्षम होंगे। 
ध्यान दें कि सेवा IP पूरी तरह से वर्चुअल है, यह कभी भी वायर से नहीं टकराती है। यदि आप इस बारे में उत्सुक हैं कि यह कैसे 
काम करता है तो आप [सेवा प्रॉक्सी](/docs/reference/networking/virtual-ips/) के बारे में अधिक पढ़ सकते हैं।


## सेवा तक पहुँचना

Kubernetes सर्विस खोजने के 2 प्राथमिक तरीकों का समर्थन करता है - पर्यावरण वेरिएबल और DNS। पहला तरीका बिना किसी 
परेशानी के काम करता है जबकि दूसरे के लिए [CoreDNS]((https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)) क्लस्टर ऐडऑन की आवश्यकता होती है।

{{< note >}}
यदि सेवा परिवेश वेरिएबल वांछित नहीं हैं (अपेक्षित प्रोग्राम वेरिएबलरों के साथ संभावित टकराव, प्रक्रिया के लिए बहुत अधिक वेरिएबल, केवल DNS का उपयोग, आदि के कारण) तो आप [पॉड स्पेक](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core) पर `enableServiceLinks` ध्वज को `false` पर सेट करके इस मोड को अक्षम कर सकते हैं।
{{< /note >}}


### पर्यावरण वेरिएबल

जब कोई पॉड किसी नोड पर चलता है, तो क्यूबलेट प्रत्येक सक्रिय सेवा के लिए पर्यावरण वेरिएबल का एक सेट जोड़ता है। यह एक क्रम समस्या का परिचय देता है। इसका कारण जानने के लिए, अपने चल रहे nginx पॉड्स के पर्यावरण का निरीक्षण करें (आपका पॉड नाम अलग होगा):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

ध्यान दें कि आपकी सेवा का कोई उल्लेख नहीं है। ऐसा इसलिए है क्योंकि आपने सेवा से पहले प्रतिकृतियां बनाई हैं। ऐसा करने का एक और नुकसान यह है कि शेड्यूलर दोनों पॉड को एक ही मशीन पर रख सकता है, जो आपकी पूरी सेवा को बंद कर देगा यदि यह मर जाती है। हम 2 पॉड को मारकर और उन्हें फिर से बनाने के लिए परिनियोजन की प्रतीक्षा करके इसे सही तरीके से कर सकते हैं। इस बार सेवा प्रतिकृतियों से *पहले* मौजूद है। यह आपको अपने पॉड के शेड्यूलर-स्तर की सेवा प्रसार देगा (बशर्ते आपके सभी नोड्स की क्षमता समान हो), साथ ही साथ सही पर्यावरण वेरिएबल:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

आप देखेंगे कि पॉड्स के अलग-अलग नाम हैं, क्योंकि उन्हें मार दिया जाता है और फिर से बनाया जाता है।

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

Kubernetes offers a DNS cluster addon Service that automatically assigns dns names
to other Services. You can check if it's running on your cluster:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

The rest of this section will assume you have a Service with a long lived IP
(my-nginx), and a DNS server that has assigned a name to that IP. Here we use
the CoreDNS cluster addon (application name `kube-dns`), so you can talk to the
Service from any pod in your cluster using standard methods (e.g. `gethostbyname()`).
If CoreDNS isn't running, you can enable it referring to the
[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)
or [Installing CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns).
Let's run another curl application to test this:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Then, hit enter and run `nslookup my-nginx`:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Securing the Service

Till now we have only accessed the nginx server from within the cluster. Before
exposing the Service to the internet, you want to make sure the communication
channel is secure. For this, you will need:

* Self signed certificates for https (unless you already have an identity certificate)
* An nginx server configured to use the certificates
* A [secret](/docs/concepts/configuration/secret/) that makes the certificates accessible to pods

You can acquire all these from the
[nginx https example](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/).
This requires having go and make tools installed. If you don't want to install those,
then follow the manual steps later. In short:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```
And also the configmap:
```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

You can find an example for `default.conf` in
[the Kubernetes examples project repo](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/).

```
configmap/nginxconfigmap created
```
```shell
kubectl get configmaps
```
```
NAME             DATA   AGE
nginxconfigmap   1      114s
```

You can view the details of the `nginxconfigmap` ConfigMap using the following command:

```shell
kubectl describe configmap  nginxconfigmap
```

The output is similar to:

```console
Name:         nginxconfigmap
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
default.conf:
----
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        listen 443 ssl;

        root /usr/share/nginx/html;
        index index.html;

        server_name localhost;
        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        location / {
                try_files $uri $uri/ =404;
        }
}

BinaryData
====

Events:  <none>
```

Following are the manual steps to follow in case you run into problems running make (on windows for example):

```shell
# Create a public private key pair
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# Convert the keys to base64 encoding
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
 
Use the output from the previous commands to create a yaml file as follows.
The base64 encoded value should all be on a single line.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
  tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
Now create the secrets using the file:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

Now modify your nginx replicas to start an https server using the certificate
in the secret, and the Service, to expose both ports (80 and 443):

{{% code_sample file="service/networking/nginx-secure-app.yaml" %}}

Noteworthy points about the nginx-secure-app manifest:

- It contains both Deployment and Service specification in the same file.
- The [nginx server](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)
  serves HTTP traffic on port 80 and HTTPS traffic on 443, and nginx Service
  exposes both ports.
- Each container has access to the keys through a volume mounted at `/etc/nginx/ssl`.
  This is set up *before* the nginx server is started.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

At this point you can reach the nginx server from any node.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

Note how we supplied the `-k` parameter to curl in the last step, this is because
we don't know anything about the pods running nginx at certificate generation time,
so we have to tell curl to ignore the CName mismatch. By creating a Service we
linked the CName used in the certificate with the actual DNS name used by pods
during Service lookup. Let's test this from a pod (the same secret is being reused
for simplicity, the pod only needs nginx.crt to access the Service):

{{% code_sample file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## Exposing the Service

For some parts of your applications you may want to expose a Service onto an
external IP address. Kubernetes supports two ways of doing this: NodePorts and
LoadBalancers. The Service created in the last section already used `NodePort`,
so your nginx HTTPS replica is ready to serve traffic on the internet if your
node has a public IP.

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

Let's now recreate the Service to use a cloud load balancer.
Change the `Type` of `my-nginx` Service from `NodePort` to `LoadBalancer`:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149     xx.xxx.xxx.xxx     8080:30163/TCP        21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

The IP address in the `EXTERNAL-IP` column is the one that is available on the public internet.
The `CLUSTER-IP` is only available inside your cluster/private cloud network.

Note that on AWS, type `LoadBalancer` creates an ELB, which uses a (long)
hostname, not an IP.  It's too long to fit in the standard `kubectl get svc`
output, in fact, so you'll need to do `kubectl describe service my-nginx` to
see it.  You'll see something like this:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


* Learn more about [Using a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Learn more about [Connecting a Front End to a Back End Using a Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Learn more about [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
