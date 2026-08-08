---
title: Liveness, Readiness और Startup Probes कॉन्फ़िगर करें
content_type: task
weight: 140
---

<!-- overview -->

यह पेज दिखाता है कि containers के लिए liveness, readiness और startup probes कैसे कॉन्फ़िगर करें।

probes के बारे में अधिक जानकारी के लिए देखें:
[Liveness, Readiness और Startup Probes](/docs/concepts/configuration/liveness-readiness-startup-probes)

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) यह जानने के लिए
liveness probes का उपयोग करता है कि container को कब restart करना है।
उदाहरण के लिए, liveness probes deadlock पकड़ सकते हैं, जहाँ application चल तो रही होती है
लेकिन आगे प्रगति नहीं कर पा रही होती। ऐसे state में container restart करना,
bugs होने के बावजूद application की availability बेहतर कर सकता है।

liveness probes का एक सामान्य pattern यह है कि readiness probes वाली
same low-cost HTTP endpoint का उपयोग किया जाए, लेकिन higher failureThreshold के साथ।
इससे Pod को hard kill करने से पहले कुछ समय तक not-ready के रूप में observe किया जाता है।

kubelet readiness probes का उपयोग यह जानने के लिए करता है कि container traffic
स्वीकार करने के लिए कब तैयार है। इस signal का एक उपयोग यह नियंत्रित करना है कि
किन Pods को Services के backends के रूप में उपयोग किया जाए।
Pod तब ready माना जाता है जब उसका `Ready`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) true हो।
जब Pod ready नहीं होता, तो उसे Service load balancers से हटा दिया जाता है।
Pod की `Ready` condition false होती है जब उसके Node की `Ready` condition true न हो,
या Pod के किसी `readinessGates` की condition false हो, या उसके containers में से कम से कम एक ready न हो।

kubelet startup probes का उपयोग यह जानने के लिए करता है कि container application शुरू हुई या नहीं।
यदि ऐसा probe कॉन्फ़िगर है, तो liveness और readiness probes तब तक शुरू नहीं होतीं
जब तक startup probe सफल न हो जाए। इससे यह सुनिश्चित होता है कि वे probes application startup में हस्तक्षेप न करें।
इससे धीमे शुरू होने वाले containers पर liveness checks अपनाई जा सकती हैं और container को
पूरी तरह शुरू होने से पहले kubelet द्वारा kill होने से बचाया जा सकता है।

{{< caution >}}
Liveness probes application failures से recovery का शक्तिशाली तरीका हो सकती हैं, लेकिन
इन्हें सावधानी से उपयोग करना चाहिए। Liveness probes को बहुत ध्यान से कॉन्फ़िगर करना चाहिए
ताकि वे वास्तव में unrecoverable application failure (जैसे deadlock) को ही दर्शाएँ।
{{< /caution >}}

{{< note >}}
Liveness probes का गलत implementation cascading failures का कारण बन सकता है। इसका परिणाम
high load में containers के बार-बार restart होने, application की scalability घटने से client requests fail होने,
और कुछ pods fail होने के कारण बाकी pods पर workload बढ़ने के रूप में हो सकता है।
अपने app के लिए readiness और liveness probes का अंतर और उनके सही उपयोग को समझें।
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## liveness command परिभाषित करें

लंबे समय तक चलने वाले कई applications अंततः broken states में पहुँच जाते हैं
और restart किए बिना recover नहीं कर पाते।
Kubernetes ऐसी स्थितियों का पता लगाने और सुधारने के लिए liveness probes देता है।

इस अभ्यास में आप ऐसा Pod बनाते हैं जो `registry.k8s.io/busybox:1.27.2` image पर आधारित container चलाता है।
यह Pod की configuration file है:

{{% code_sample file="pods/probe/exec-liveness.yaml" %}}

configuration file में आप देख सकते हैं कि Pod में एक ही `Container` है।
`periodSeconds` field बताती है कि kubelet हर 5 seconds में liveness probe चलाए।
`initialDelaySeconds` field बताती है कि पहली probe चलाने से पहले kubelet 5 seconds प्रतीक्षा करे।
probe चलाने के लिए kubelet target container में `cat /tmp/healthy` command execute करता है।
अगर command सफल होती है, तो 0 return होता है और kubelet container को जीवित और healthy मानता है।
अगर command non-zero return करती है, तो kubelet container को kill करके restart कर देता है।

जब container शुरू होता है, तो वह यह command चलाता है:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

container के जीवन के पहले 30 seconds तक `/tmp/healthy` फ़ाइल मौजूद रहती है।
इसलिए पहले 30 seconds के दौरान `cat /tmp/healthy` success code लौटाता है।
30 seconds के बाद `cat /tmp/healthy` failure code लौटाता है।

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

30 seconds के भीतर Pod events देखें:

```shell
kubectl describe pod liveness-exec
```

आउटपुट दर्शाता है कि अभी तक कोई liveness probe fail नहीं हुई:

```none
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

35 seconds के बाद Pod events फिर देखें:

```shell
kubectl describe pod liveness-exec
```

आउटपुट के नीचे ऐसे messages होंगे जो दिखाते हैं कि liveness probes fail हुईं
और failed containers को kill करके दोबारा बनाया गया।

```none
Type     Reason     Age                From               Message
----     ------     ----               ----               -------
Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal   Created    53s                kubelet, node01    Created container liveness
Normal   Started    53s                kubelet, node01    Started container liveness
Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

और 30 seconds प्रतीक्षा करें, फिर सत्यापित करें कि container restart हुआ है:

```shell
kubectl get pod liveness-exec
```

आउटपुट दिखाता है कि `RESTARTS` बढ़ गया है। ध्यान दें कि `RESTARTS` counter
जैसे ही failed container फिर running state में आता है, बढ़ जाता है:

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## liveness HTTP request परिभाषित करें

liveness probe का दूसरा प्रकार HTTP GET request का उपयोग करता है।
यहाँ उस Pod की configuration file है जो `registry.k8s.io/e2e-test-images/agnhost` image पर आधारित container चलाता है।

{{% code_sample file="pods/probe/http-liveness.yaml" %}}

configuration file में आप देख सकते हैं कि Pod में एक ही container है।
`periodSeconds` field बताती है कि kubelet हर 3 seconds में liveness probe चलाए।
`initialDelaySeconds` field बताती है कि पहली probe से पहले kubelet 3 seconds प्रतीक्षा करे।
probe चलाने के लिए kubelet container में चल रहे server को HTTP GET request भेजता है,
जो port 8080 पर listen कर रहा है। अगर server के `/healthz` path का handler success code लौटाता है,
तो kubelet container को alive और healthy मानता है। अगर handler failure code लौटाए,
तो kubelet container को kill करके restart कर देता है।

200 या उससे बड़ा और 400 से छोटा कोई भी code success दर्शाता है।
अन्य कोई भी code failure दर्शाता है।

आप server का source code यहाँ देख सकते हैं:
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)।

container के जीवित रहने के पहले 10 seconds तक `/healthz` handler
status 200 लौटाता है। उसके बाद handler status 500 लौटाता है।

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

container start होने के 3 seconds बाद kubelet health checks शुरू करता है।
इसलिए शुरुआती कुछ checks सफल होंगी। लेकिन 10 seconds के बाद checks fail होंगी
और kubelet container को kill करके restart कर देगा।

HTTP liveness check आज़माने के लिए Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

10 seconds बाद Pod events देखें और सत्यापित करें कि liveness probes fail हुईं
और container restart हुआ:

```shell
kubectl describe pod liveness-http
```

v1.13 के बाद के releases में local HTTP proxy environment variable settings
HTTP liveness probe को प्रभावित नहीं करतीं।

## TCP liveness probe परिभाषित करें

liveness probe का तीसरा प्रकार TCP socket का उपयोग करता है।
इस configuration के साथ kubelet निर्दिष्ट port पर आपके container से socket connection खोलने की कोशिश करेगा।
यदि connection बन जाता है तो container healthy माना जाता है, अन्यथा इसे failure माना जाता है।

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

जैसा आप देख सकते हैं, TCP check की configuration HTTP check जैसी ही है।
यह उदाहरण readiness और liveness दोनों probes का उपयोग करता है।
kubelet container शुरू होने के 15 seconds बाद पहली liveness probe चलाएगा।
यह port 8080 पर `goproxy` container से connect करने की कोशिश करेगा।
अगर liveness probe fail होती है, तो container restart होगा।
kubelet हर 10 seconds में यह check चलाता रहेगा।

liveness probe के अलावा इस configuration में readiness probe भी शामिल है।
kubelet container शुरू होने के 15 seconds बाद पहली readiness probe चलाएगा।
liveness probe की तरह यह भी port 8080 पर `goproxy` container से connect करने की कोशिश करेगा।
यदि probe सफल होती है, तो Pod ready mark होगा और services से traffic प्राप्त करेगा।
यदि readiness probe fail होती है, तो Pod unready mark होगा और किसी भी service से traffic नहीं पाएगा।

TCP liveness check आज़माने के लिए Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

15 seconds बाद Pod events देखें और liveness probes की स्थिति सत्यापित करें:

```shell
kubectl describe pod goproxy
```

## gRPC liveness probe परिभाषित करें

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

यदि आपकी application
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)
implement करती है, तो यह उदाहरण दिखाता है कि application liveness checks के लिए
Kubernetes को इसका उपयोग करने हेतु कैसे कॉन्फ़िगर करें।
इसी तरह आप readiness और startup probes भी कॉन्फ़िगर कर सकते हैं।

यहाँ एक example manifest है:

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

gRPC probe उपयोग करने के लिए `port` कॉन्फ़िगर होना आवश्यक है।
अगर आप अलग प्रकार की probes और अलग features की probes में भेद करना चाहते हैं,
तो `service` field उपयोग कर सकते हैं।
आप `service` को `liveness` सेट कर सकते हैं और gRPC Health Checking endpoint को
यह request मिलने पर `service` को `readiness` सेट करने से अलग response देने के लिए कॉन्फ़िगर कर सकते हैं।
इससे आप दो अलग ports पर listen करने के बजाय एक ही endpoint का उपयोग
विभिन्न प्रकार के container health checks के लिए कर सकते हैं।
यदि आप अपना custom service name भी देना चाहते हैं और probe type भी बताना चाहते हैं,
तो Kubernetes project सुझाव देता है कि आप दोनों को जोड़कर नाम रखें।
उदाहरण: `myservice-liveness` (`-` separator के रूप में)।

{{< note >}}
HTTP या TCP probes के विपरीत, आप health check port को नाम से specify नहीं कर सकते,
और custom hostname भी कॉन्फ़िगर नहीं कर सकते।
{{< /note >}}

configuration problems (उदाहरण: गलत port/service, health checking protocol implement न होना)
को probe failure माना जाता है, ठीक HTTP और TCP probes की तरह।

gRPC liveness check आज़माने के लिए नीचे दी गई command से Pod बनाएं।
नीचे के उदाहरण में etcd pod को gRPC liveness probe उपयोग करने के लिए कॉन्फ़िगर किया गया है।

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

15 seconds बाद Pod events देखें और सत्यापित करें कि liveness check fail नहीं हुई:

```shell
kubectl describe pod etcd-with-grpc
```

gRPC probe का उपयोग करते समय कुछ तकनीकी बातें ध्यान रखने योग्य हैं:

- probes pod IP address या उसके hostname पर चलती हैं।
  सुनिश्चित करें कि आपका gRPC endpoint Pod के IP address पर listen करे।
- probes किसी authentication parameter (जैसे `-tls`) को support नहीं करतीं।
- built-in probes के लिए error codes नहीं होते। सभी errors को probe failure माना जाता है।
- यदि `ExecProbeTimeout` feature gate `false` पर सेट है, तो grpc-health-probe
  `timeoutSeconds` setting (जिसका default 1s है) का पालन **नहीं** करता, जबकि built-in probe timeout पर fail हो जाती है।

## named port का उपयोग करें

आप HTTP और TCP probes के लिए named [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
उपयोग कर सकते हैं। gRPC probes named ports को support नहीं करतीं।

उदाहरण:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## startup probes से धीमे शुरू होने वाले containers को सुरक्षित रखें {#define-startup-probes}

कभी-कभी आपको ऐसी applications से निपटना पड़ता है जिन्हें पहली initialization पर
अतिरिक्त startup time चाहिए। ऐसे मामलों में liveness probe parameters सेट करना मुश्किल हो सकता है,
क्योंकि deadlock पर तेज प्रतिक्रिया भी चाहिए और startup समय पर probe से समस्या भी नहीं होनी चाहिए।
इसका समाधान है startup probe सेट करना जिसमें वही command, HTTP या TCP check हो, और
`failureThreshold * periodSeconds` इतना लंबा हो कि worst-case startup time कवर हो जाए।

तो पिछला उदाहरण इस प्रकार बन जाएगा:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

startup probe की वजह से application को startup पूरा करने के लिए अधिकतम 5 minutes
(30 * 10 = 300s) मिलेंगे।
startup probe एक बार सफल होते ही liveness probe takeover करती है
ताकि container deadlocks पर तेज प्रतिक्रिया मिल सके।
अगर startup probe कभी सफल नहीं होती, तो container 300s के बाद kill हो जाएगा
और Pod की `restartPolicy` लागू होगी।

## readiness probes परिभाषित करें

कभी-कभी applications अस्थायी रूप से traffic serve नहीं कर पातीं।
उदाहरण के लिए startup के दौरान application को बड़े data या configuration files load करने पड़ सकते हैं,
या startup के बाद external services पर निर्भर होना पड़ सकता है।
ऐसी स्थितियों में आप application को kill नहीं करना चाहते,
लेकिन उसे requests भी नहीं भेजना चाहते। Kubernetes इसके लिए readiness probes प्रदान करता है।
जिस pod में containers report करते हैं कि वे ready नहीं हैं, उसे Kubernetes Services के जरिए traffic नहीं मिलता।

{{< note >}}
Readiness probes container के पूरे lifecycle में चलती हैं।
{{< /note >}}

{{< caution >}}
readiness और liveness probes एक-दूसरे पर निर्भर नहीं होतीं।
अगर आप readiness probe चलाने से पहले प्रतीक्षा करना चाहते हैं, तो
`initialDelaySeconds` या `startupProbe` का उपयोग करें।
{{< /caution >}}

Readiness probes, liveness probes की तरह ही कॉन्फ़िगर होती हैं।
केवल अंतर यह है कि `livenessProbe` के बजाय `readinessProbe` field उपयोग होती है।

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

HTTP और TCP readiness probes की configuration भी liveness probes जैसी ही रहती है।

Readiness और liveness probes एक ही container के लिए parallel में उपयोग की जा सकती हैं।
दोनों का उपयोग यह सुनिश्चित कर सकता है कि traffic ऐसे container तक न पहुँचे जो उसके लिए ready नहीं है,
और failure होने पर containers restart हों।

## Probes कॉन्फ़िगर करें

<!--Eventually, some of this section could be moved to a concept topic.-->

[प्रोब्स (Probes)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
में कई fields होती हैं जिनसे आप startup, liveness और readiness checks के behavior को अधिक सटीक रूप से नियंत्रित कर सकते हैं:

* `initialDelaySeconds`: container start होने के बाद startup, liveness या readiness probes शुरू करने से पहले कितने seconds प्रतीक्षा करनी है।
  यदि startup probe परिभाषित है, तो liveness और readiness की delays तब तक शुरू नहीं होतीं जब तक startup probe सफल न हो जाए।
  Kubernetes के कुछ पुराने versions में, यदि periodSeconds को initialDelaySeconds से बड़ा सेट किया गया हो,
  तो initialDelaySeconds को नज़रअंदाज़ किया जा सकता था। लेकिन वर्तमान versions में initialDelaySeconds हमेशा मान्य होती है
  और probe इस शुरुआती delay के बाद ही शुरू होती है। Default 0 seconds, minimum 0।
* `periodSeconds`: probe कितनी बार (seconds में) चलानी है। Default 10 seconds।
  Minimum value 1 है।
  जब container Ready नहीं होता, तो `ReadinessProbe` कभी-कभी configured `periodSeconds` interval से अलग समय पर भी चल सकती है,
  ताकि Pod जल्दी ready हो सके।
* `timeoutSeconds`: probe timeout होने से पहले कितने seconds प्रतीक्षा करनी है।
  Default 1 second, minimum 1।
* `successThreshold`: fail होने के बाद probe को successful मानने के लिए लगातार सफल probes की न्यूनतम संख्या।
  Default 1। liveness और startup Probes के लिए यह 1 ही होना चाहिए।
  Minimum value 1।
* `failureThreshold`: probe लगातार `failureThreshold` बार fail हो जाए तो Kubernetes
  overall check को failed मानता है: container _ready/healthy/live_ नहीं है।
  Default 3। Minimum value 1।
  startup या liveness probe के मामले में, यदि कम से कम `failureThreshold` probes fail हों,
  तो Kubernetes container को unhealthy मानता है और उसी specific container का restart trigger करता है।
  kubelet उस container के `terminationGracePeriodSeconds` setting का सम्मान करता है।
  readiness probe fail होने पर kubelet failed container को चलाता रहता है और probes भी जारी रखता है;
  check fail होने के कारण kubelet Pod की `Ready`
  [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) को `false` सेट कर देता है।
* `terminationGracePeriodSeconds`: failed container को shutdown trigger करने और फिर container runtime को उसे force stop करने के बीच
  kubelet कितना grace period दे, यह कॉन्फ़िगर करता है।
  Default रूप से यह Pod-level `terminationGracePeriodSeconds` को inherit करता है
  (यदि न दिया हो तो 30 seconds), और minimum value 1 है।
  अधिक जानकारी के लिए [probe-level `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds) देखें।

{{< caution >}}
readiness probes का गलत implementation container में processes की संख्या को लगातार बढ़ा सकता है,
और अगर इसे नियंत्रित न किया जाए तो resource starvation हो सकती है।
{{< /caution >}}

### HTTP प्रोब्स

[HTTP प्रोब्स](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
में `httpGet` पर कुछ अतिरिक्त fields सेट की जा सकती हैं:

* `host`: connect करने के लिए host name; default pod IP होता है।
  आमतौर पर इसके बजाय `httpHeaders` में "Host" सेट करना बेहतर है।
* `scheme`: host से connect करने के लिए scheme (HTTP या HTTPS)। Default "HTTP" है।
* `path`: HTTP server पर access करने का path। Default "/" है।
* `httpHeaders`: request में सेट करने के लिए custom headers। HTTP repeated headers को अनुमति देता है।
* `port`: container पर access करने वाले port का नाम या संख्या। संख्या 1 से 65535 के बीच होनी चाहिए।

HTTP probe के लिए kubelet निर्दिष्ट port और path पर HTTP request भेजकर check करता है।
kubelet probe को Pod के IP address पर भेजता है, जब तक `httpGet` में optional `host` field से address override न हो।
अगर `scheme` field `HTTPS` हो, तो kubelet certificate verification skip करते हुए HTTPS request भेजता है।
अधिकांश स्थितियों में आप `host` field सेट नहीं करना चाहेंगे।
एक स्थिति जहाँ आप इसे सेट करेंगे: मान लें container 127.0.0.1 पर listen करता है
और Pod की `hostNetwork` field true है। तब `httpGet` के अंतर्गत `host` को 127.0.0.1 सेट करना चाहिए।
अगर आपका pod virtual hosts पर निर्भर है (जो अधिक सामान्य मामला है),
तो `host` का उपयोग न करें; बल्कि `httpHeaders` में `Host` header सेट करें।

HTTP probe के लिए kubelet अनिवार्य `Host` header के अलावा दो request headers भेजता है:
- `User-Agent`: default value `kube-probe/{{< skew currentVersion >}}` है,
  जहाँ `{{< skew currentVersion >}}` kubelet का version है।
- `Accept`: default value `*/*` है।

आप probe के लिए `httpHeaders` define करके default headers override कर सकते हैं।
उदाहरण:

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: application/json

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: MyUserAgent
```

इन दोनों headers को empty value देकर आप इन्हें हटा भी सकते हैं।

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: ""

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: ""
```

{{< note >}}
जब kubelet HTTP का उपयोग करके Pod probe करता है, तो वह redirects केवल तब follow करता है जब redirect उसी host पर हो।
अगर probing के दौरान kubelet को 11 या उससे अधिक redirects मिलते हैं, तो probe को successful माना जाता है
और संबंधित Event बनाया जाता है:

```none
Events:
  Type     Reason        Age                     From               Message
  ----     ------        ----                    ----               -------
  Normal   Scheduled     29m                     default-scheduler  Successfully assigned default/httpbin-7b8bc9cb85-bjzwn to daocloud
  Normal   Pulling       29m                     kubelet            Pulling image "docker.io/kennethreitz/httpbin"
  Normal   Pulled        24m                     kubelet            Successfully pulled image "docker.io/kennethreitz/httpbin" in 5m12.402735213s
  Normal   Created       24m                     kubelet            Created container httpbin
  Normal   Started       24m                     kubelet            Started container httpbin
 Warning  ProbeWarning  4m11s (x1197 over 24m)  kubelet            Readiness probe warning: Probe terminated redirects
```

यदि kubelet को ऐसा redirect मिलता है जिसमें hostname request से अलग है, तो probe outcome को successful माना जाता है
और kubelet redirect failure रिपोर्ट करने के लिए event बनाता है।
{{< /note >}}

{{< caution >}}
**httpGet** probe process करते समय kubelet response body का केवल पहले 10KiB तक पढ़ता है।
probe की success केवल response status code से तय होती है, जो response headers में मिलता है।

यदि आप ऐसे endpoint को probe करते हैं जो **10KiB** से बड़ा response body लौटाता है,
तो kubelet status code के आधार पर probe को successful mark कर सकता है,
लेकिन 10KiB limit पर पहुंचने के बाद connection बंद कर देगा।
इस अचानक closure से application logs में **connection reset by peer** या **broken pipe errors** दिख सकती हैं,
जिन्हें वास्तविक network issues से अलग पहचानना कठिन हो सकता है।

विश्वसनीय `httpGet` probes के लिए strongly recommended है कि dedicated health check endpoints उपयोग करें
जो minimal response body लौटाएँ। यदि बड़े payload वाले existing endpoint का उपयोग करना ही पड़े,
तो उसके बजाय HEAD request करने के लिए `exec` probe उपयोग करने पर विचार करें।
{{< /caution >}}

### TCP प्रोब्स

TCP probe के लिए kubelet probe connection node से बनाता है, Pod के अंदर से नहीं।
इसका मतलब है कि `host` parameter में service name का उपयोग नहीं किया जा सकता,
क्योंकि kubelet उसे resolve नहीं कर पाता।

### प्रोब-स्तरीय `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

1.25 और उसके बाद, users probe specification के हिस्से के रूप में
probe-level `terminationGracePeriodSeconds` सेट कर सकते हैं।
जब pod-level और probe-level दोनों `terminationGracePeriodSeconds` सेट हों,
तो kubelet probe-level value का उपयोग करेगा।

`terminationGracePeriodSeconds` सेट करते समय निम्न बातों का ध्यान रखें:

* kubelet हमेशा probe-level `terminationGracePeriodSeconds` field का सम्मान करता है
  यदि वह Pod पर मौजूद है।

* यदि आपके पास existing Pods हैं जिनमें `terminationGracePeriodSeconds` field सेट है और
  आप per-probe termination grace periods का उपयोग नहीं करना चाहते,
  तो आपको वे existing Pods delete करने होंगे।

उदाहरण:

```yaml
spec:
  terminationGracePeriodSeconds: 3600  # pod-level
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # Override pod-level terminationGracePeriodSeconds #
      terminationGracePeriodSeconds: 60
```

readiness probes के लिए probe-level `terminationGracePeriodSeconds` सेट नहीं किया जा सकता।
API server इसे reject कर देगा।

## {{% heading "whatsnext" %}}

* इसके बारे में और जानें:
  [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)।

आप API references भी पढ़ सकते हैं:

* [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), और विशेष रूप से:
  * [container(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [probe(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
