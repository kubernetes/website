---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: कुबेरनेट्स में Windows कंटेनरों को शेड्यूल करने के लिए गाइड
content_type: concept
weight: 75
---

<!-- overview -->

Windows एप्लिकेशन कई संगठनों में चलने वाली सेवाओं और अनुप्रयोगों के एक बड़े हिस्से का गठन करते हैं।
यह मार्गदर्शिका आपको कुबेरनेट्स में Windows कंटेनर को कॉन्फ़िगर और परिनियोजित करने के चरणों के बारे में बताती है।


<!-- body -->

## उद्देश्य

* Windows नोड पर Windows कंटेनर चलाने के लिए एक उदाहरण परिनियोजन कॉन्फ़िगर करें
* (वैकल्पिक) ग्रुप मैनेज्ड सर्विस अकाउंट्स (जीएमएसए) का उपयोग करके अपने पॉड के लिए एक एक्टिव डायरेक्टरी पहचाने और उसे कॉन्फ़िगर करें

## शुरू करने से पहले

* एक कुबेरनेट्स क्लस्टर बनाएं जिसमें
नियंत्रण विमान और [worker node running Windows Server](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/) शामिल है |
* यह ध्यान रखना महत्वपूर्ण है कि कुबेरनेट्स पर सेवाओं और वर्कलोड को बनाना और तैनात करना
Linux और विंडोज कंटेनरों के लिए समान रूप से व्यवहार करता है। 
[kubectl commands](/docs/reference/kubectl/overview/) क्लस्टर के साथ इंटरफेस करने के लिए समान हैं।
Windows कंटेनर के साथ अपने अनुभव को जम्पस्टार्ट करने के लिए नीचे दिए गए अनुभाग में उदाहरण दिया गया है।

## प्रारंभ करना: Windows कंटेनर परिनियोजित करना

कुबेरनेट्स पर Windows कंटेनर को परिनियोजित करने के लिए, पहले आपको एक उदाहरण के लिए एप्लिकेशन बनाना होगा। 
नीचे दिया गया उदाहरण YAML फ़ाइल एक साधारण वेबसर्वर एप्लिकेशन बनाता है। 
नीचे दी गई सामग्री के साथ `win-webserver.yaml` नामक एक सेवा युक्ति बनाएं:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # the port that this service should serve on
    - port: 80
      targetPort: 80
  selector:
    app: win-webserver
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: win-webserver
  name: win-webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app: win-webserver
  template:
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
     containers:
      - name: windowswebserver
        image: mcr.microsoft.com/windows/servercore:ltsc2019
        command:
        - powershell.exe
        - -command
        - "<#code used from https://gist.github.com/19WAS85/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
     nodeSelector:
      kubernetes.io/os: windows
```

{{< note >}}
पोर्ट मैपिंग भी समर्थित है, लेकिन इस उदाहरण में सादगी के लिए
कंटेनर पोर्ट 80 सीधे सेवा के संपर्क में है।
{{< /note >}}

1. जांचें कि सभी नोड स्वस्थ हैं:

    ```bash
    kubectl get nodes
    ```

1. सेवा को तैनात करें और पॉड अपडेट देखें:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    जब सेवा को सही ढंग से तैनात किया जाता है, तो दोनों पॉड्स को रेडी के रूप में चिह्नित किया जाता है। वॉच कमांड से बाहर निकलने के लिए, Ctrl + C दबाएं।

1. जांचें कि परिनियोजन सफल हुआ। सत्यापित करना:

    * Windows नोड पर प्रति पॉड दो कंटेनर, उपयोग करें `docker ps` 
    * Linux कंट्रोल प्लेन नोड से सूचीबद्ध दो पॉड, उपयोग करें `kubectl get pods` 
    * पूरे नेटवर्क में नोड-टू-पॉड कम्युनिकेशन, Linux कंट्रोल प्लेन नोड से आपके पॉड आईपी का  `curl`  पोर्ट 80
      वेब सर्वर प्रतिक्रिया की जांच करने के लिए
    * पॉड-टू-पॉड कम्युनिकेशन, पॉड्स के बीच पिंग (और मेजबानों में, यदि आपके पास एक से अधिक विंडोज नोड हैं)
      docker exec या kubectl exec का उपयोग करना
    * सेवा-से-पॉड कम्युनिकेशन, `curl` वर्चुअल सर्विस आईपी (`kubectl get services` के अंतर्गत देखा गया)
      Linux कंट्रोल प्लेन नोड से और अलग-अलग पॉड्स से
    * सेवा खोज, `curl` कुबेरनेट्स के साथ सेवा का नाम [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * इनबाउंड कनेक्टिविटी, Linux कंट्रोल प्लेन नोड या क्लस्टर के बाहर की मशीनों से नोडपोर्ट  `curl` 
    * आउटबाउंड कनेक्टिविटी, `curl` बाहरी आईपी पॉड के अंदर से kubectl exec का उपयोग करे

{{< note >}}
Windows नेटवर्किंग स्टैक की वर्तमान प्लेटफॉर्म सीमाओं के कारण Windows कंटेनर होस्ट उन पर निर्धारित सेवाओं के आईपी तक पहुंचने में सक्षम नहीं हैं।
केवल Windows पॉड ही सेवा आईपी तक पहुँचने में सक्षम हैं।
{{< /note >}}

## अवलोकनीयता (Observability)

### कार्यभार से लॉग कैप्चर करना

लॉग्स अवलोकनीयता का एक महत्वपूर्ण तत्व हैं; वे उपयोगकर्ताओं को अंतर्दृष्टि प्राप्त करने में सक्षम बनाते हैं
कार्यभार के परिचालन पहलू में और समस्याओं के निवारण के लिए एक प्रमुख घटक हैं।
क्योंकि Windows कंटेनर और Windows कंटेनर के अंदर वर्कलोड Linux कंटेनर से अलग व्यवहार करते हैं,
उपयोगकर्ताओं को परिचालन दृश्यता को सीमित करते हुए, लॉग एकत्र करने में कठिन समय था।
उदाहरण के लिए विंडोज वर्कलोड आमतौर पर ETW (Event Tracing for Window) में लॉग इन करने के लिए कॉन्फ़िगर किया गया है।
या एप्लिकेशन इवेंट लॉग में प्रविष्टियां पुश करें। 
[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), Microsoft द्वारा एक खुला स्रोत उपकरण,
विंडोज कंटेनर के अंदर कॉन्फ़िगर किए गए लॉग स्रोतों की निगरानी के लिए अनुशंसित तरीका है।
LogMonitor मॉनिटरिंग इवेंट लॉग, ETW प्रदाताओं और कस्टम एप्लिकेशन लॉग का समर्थन करता है,
उन्हें `kubectl logs <pod>` द्वारा उपभोग के लिए STDOUT में पाइप करना।

इसके बायनेरिज़ और कॉन्फ़िगरेशन फ़ाइलों को कॉपी करने के लिए LogMonitor गिटहब पेज में दिए गए निर्देशों का पालन करें
अपने सभी कंटेनरों में और अपने लॉग को STDOUT पर धकेलने के लिए LogMonitor के लिए आवश्यक प्रवेश बिंदु जोड़ें।

## कॉन्फ़िगर करने योग्य कंटेनर उपयोगकर्ता नाम का उपयोग करना

कुबेरनेट्स v1.16 से शुरू होकर, विंडोज कंटेनरों को उनके प्रवेश बिंदुओं और प्रक्रियाओं को चलाने के लिए कॉन्फ़िगर किया जा सकता है
छवि डिफ़ॉल्ट की तुलना में अलग उपयोगकर्ता नाम के साथ।
इसे हासिल करने का तरीका Linux कंटेनरों के लिए किए जाने वाले तरीके से थोड़ा अलग है।
इसके बारे में और जानें [यहां](/docs/tasks/configure-pod-container/configure-runasusername/).

## समूह प्रबंधित सेवा खातों के साथ कार्यभार पहचान प्रबंधित करना

Kubernetes v1.14 से शुरू होकर, Windows कंटेनर वर्कलोड को ग्रुप मैनेज्ड सर्विस अकाउंट्स (जीएमएसए) का उपयोग करने के लिए कॉन्फ़िगर किया जा सकता है।
समूह प्रबंधित सेवा खाते एक विशिष्ट प्रकार के सक्रिय निर्देशिका खाते हैं जो स्वचालित पासवर्ड प्रबंधन प्रदान करते हैं,
सरलीकृत सेवा प्रमुख नाम (एसपीएन) प्रबंधन, और कई सर्वरों पर प्रबंधन को अन्य प्रशासकों को सौंपने की क्षमता।
जीएमएसए के साथ कॉन्फ़िगर किए गए कंटेनर जीएमएसए के साथ कॉन्फ़िगर की गई पहचान को ले जाने के दौरान बाहरी सक्रिय निर्देशिका डोमेन संसाधनों तक पहुंच सकते हैं।
Windows कंटेनरों के लिए जीएमएसए को कॉन्फ़िगर करने और उपयोग करने के बारे में और [यहां](/docs/tasks/configure-pod-container/configure-gmsa/) जानें|

## कलंक और सहनशीलता

उपयोगकर्ताओं को आज के क्रम में कलंक और नोड चयनकर्ताओं के कुछ संयोजन का उपयोग करने की आवश्यकता है
Linux और Windows वर्कलोड को उनके संबंधित ओएस-विशिष्ट नोड्स पर रखें।
यह संभावना केवल विंडोज उपयोगकर्ताओं पर बोझ डालती है। अनुशंसित दृष्टिकोण नीचे उल्लिखित है,
इसका एक मुख्य लक्ष्य यह है कि यह दृष्टिकोण का मौजूदा Linux वर्कलोड की अनुकूलता को ना तोडे।

### ओएस-विशिष्ट वर्कलोड सुनिश्चित करना उपयुक्त कंटेनर होस्ट पर उतरता है

उपयोगकर्ता यह सुनिश्चित कर सकते हैं कि विंडोज कंटेनरों को टेंट और टॉलेरेशन का उपयोग करके उपयुक्त होस्ट पर शेड्यूल किया जा सकता है।
सभी कुबेरनेट्स नोड्स में आज निम्नलिखित डिफ़ॉल्ट लेबल हैं:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

यदि कोई पॉड विनिर्देश एक नोड चयनकर्ता निर्दिष्ट नहीं करता है जैसे की `"kubernetes.io/os": windows`,
यह संभव है कि पॉड को किसी भी होस्ट, विंडोज या Linux पर शेड्यूल किया जा सकता है।
यह समस्याग्रस्त हो सकता है क्योंकि एक Windows कंटेनर केवल Windows पर चल सकता है और एक Linux कंटेनर केवल Linux पर चल सकता है।
नोड चयनकर्ता का उपयोग करना सबसे अच्छा अभ्यास है।

हालाँकि, हम समझते हैं कि कई मामलों में उपयोगकर्ताओं के पास Linux कंटेनरों के लिए पहले से मौजूद बड़ी संख्या में परिनियोजन हैं,
साथ ही ऑफ-द-शेल्फ कॉन्फ़िगरेशन का एक पारिस्थितिकी तंत्र, जैसे कि सामुदायिक हेल्म चार्ट, और प्रोग्रामेटिक पॉड पीढ़ी के मामले, जैसे कि ऑपरेटरों के साथ।
उन स्थितियों में, आप नोड चयनकर्ताओं को जोड़ने के लिए कॉन्फ़िगरेशन परिवर्तन करने में संकोच कर सकते हैं।
विकल्प टेंट्स का उपयोग करना है। क्योंकि क्यूबलेट पंजीकरण के दौरान टेंट सेट कर सकता है,
केवल Windows पर चलते समय इसे स्वचालित रूप से एक दाग जोड़ने के लिए आसानी से संशोधित किया जा सकता है।

उदाहरण के लिए:  `--register-with-taints='os=windows:NoSchedule'`

सभी Windows नोड्स में एक कलंक जोड़कर, उन पर कुछ भी निर्धारित नहीं किया जाएगा (जिसमें मौजूदा Linux पॉड्स शामिल हैं)।
Windows पॉड को Windows नोड पर शेड्यूल करने के लिए,
Windows को चुनने के लिए इसे नोड चयनकर्ता और उपयुक्त मिलान सहनशीलता दोनों की आवश्यकता होगी।

```yaml
nodeSelector:
    kubernetes.io/os: windows
    node.kubernetes.io/windows-build: '10.0.17763'
tolerations:
    - key: "os"
      operator: "Equal"
      value: "windows"
      effect: "NoSchedule"
```

### एक ही क्लस्टर में कई Windows संस्करणों को संभालना

प्रत्येक पॉड द्वारा उपयोग किया जाने वाला Windows सर्वर संस्करण नोड से मेल खाना चाहिए। यदि आप एकाधिक Windows का उपयोग करना चाहते हैं
एक ही क्लस्टर में सर्वर संस्करण, फिर आपको अतिरिक्त नोड लेबल और नोड चयनकर्ता सेट करना चाहिए।

कुबेरनेट्स 1.17 इसे सरल बनाने के लिए स्वचालित रूप से एक नया लेबल `node.kubernetes.io/windows-build` जोड़ता है।
यदि आप एक पुराना संस्करण चला रहे हैं, तो इस लेबल को मैन्युअल रूप से Windows नोड्स में जोड़ने की अनुशंसा की जाती है।

यह लेबल Windows मेजर, माइनर और बिल्ड नंबर को दर्शाता है जिसे संगतता के लिए मिलान करने की आवश्यकता होती है।
यहां प्रत्येक Windows सर्वर संस्करण के लिए आज उपयोग किए जाने वाले मान दिए गए हैं।

| Product Name                         |   Build Number(s)      |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server version 1809          | 10.0.17763             |
| Windows Server version 1903          | 10.0.18362             |


### रनटाइम क्लास के साथ सरलीकरण

[RuntimeClass] का उपयोग दाग और सहनशीलता का उपयोग करने की प्रक्रिया को सरल बनाने के लिए किया जा सकता है।
एक क्लस्टर व्यवस्थापक एक `RuntimeClass` ऑब्जेक्ट बना सकता है जिसका उपयोग इन कलंक और सहनशीलता को समाहित करने के लिए किया जाता है।


1. इस फाइल को `runtimeClasses.yml` में सेव करें। इसमें उपयुक्त `nodeSelector` शामिल है
Windows OS, आर्किटेक्चर और वर्जन के लिए।

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: windows-2019
handler: 'docker'
scheduling:
  nodeSelector:
    kubernetes.io/os: 'windows'
    kubernetes.io/arch: 'amd64'
    node.kubernetes.io/windows-build: '10.0.17763'
  tolerations:
  - effect: NoSchedule
    key: os
    operator: Equal
    value: "windows"
```

1. क्लस्टर व्यवस्थापक के रूप में उपयोग करके `kubectl create -f रनटाइमClasses.yml` चलाएँ
1. पॉड स्पेक्स के लिए उपयुक्त `runtimeClassName: windows-2019` जोड़ें

उदाहरण के लिए:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iis-2019
  labels:
    app: iis-2019
spec:
  replicas: 1
  template:
    metadata:
      name: iis-2019
      labels:
        app: iis-2019
    spec:
      runtimeClassName: windows-2019
      containers:
      - name: iis
        image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        resources:
          limits:
            cpu: 1
            memory: 800Mi
          requests:
            cpu: .1
            memory: 300Mi
        ports:
          - containerPort: 80
 selector:
    matchLabels:
      app: iis-2019
---
apiVersion: v1
kind: Service
metadata:
  name: iis
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
  selector:
    app: iis-2019
```




[RuntimeClass]: https://kubernetes.io/docs/concepts/containers/runtime-class/
