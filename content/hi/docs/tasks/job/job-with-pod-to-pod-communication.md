---
title: पॉड-टू-पॉड कम्युनिकेशन के साथ जॉब
content_type: task
min-kubernetes-server-version: v1.21
weight: 40
---

<!-- overview -->

इस उदाहरण में, आप एक जॉब चलाएंगे जो इंडेक्स्ड कम्प्लीशन मोड में कॉन्फ़िगर किया गया है, जिससे जॉब द्वारा बनाए गए पॉड्स पॉड IP एड्रेस के बजाय पॉड होस्टनाम का उपयोग करके एक-दूसरे के साथ कम्युनिकेट कर सकते हैं।

जॉब के भीतर पॉड्स को एक-दूसरे के साथ कम्युनिकेट करने की आवश्यकता हो सकती है। प्रत्येक पॉड में चल रहा यूजर वर्कलोड Kubernetes API सर्वर से अन्य पॉड्स के IPs जानने के लिए क्वेरी कर सकता है, लेकिन Kubernetes के बिल्ट-इन DNS रेजोल्यूशन पर भरोसा करना बहुत आसान है।

इंडेक्स्ड कम्प्लीशन मोड में जॉब्स स्वचालित रूप से पॉड्स के होस्टनाम को `${jobName}-${completionIndex}` फॉर्मेट में सेट करते हैं। आप इस फॉर्मेट का उपयोग पॉड होस्टनाम को निर्धारित रूप से बनाने और पॉड कम्युनिकेशन को सक्षम करने के लिए कर सकते हैं, बिना Kubernetes कंट्रोल प्लेन के साथ क्लाइंट कनेक्शन बनाए बिना API रिक्वेस्ट के माध्यम से पॉड होस्टनाम/IPs प्राप्त करने की आवश्यकता के।

यह कॉन्फ़िगरेशन उन उपयोग के मामलों के लिए उपयोगी है जहां पॉड नेटवर्किंग की आवश्यकता होती है लेकिन आप Kubernetes API सर्वर के साथ नेटवर्क कनेक्शन पर निर्भर नहीं करना चाहते हैं।

## {{% heading "prerequisites" %}}

आपको पहले से ही [Job](/docs/concepts/workloads/controllers/job/) के बुनियादी उपयोग से परिचित होना चाहिए।

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

#### नोट:

यदि आप minikube या इसी तरह के टूल का उपयोग कर रहे हैं, तो आपको यह सुनिश्चित करने के लिए अतिरिक्त कदम उठाने की आवश्यकता हो सकती है कि आपके पास DNS है।

## पॉड-टू-पॉड कम्युनिकेशन के साथ जॉब शुरू करना

जॉब में पॉड होस्टनाम का उपयोग करके पॉड-टू-पॉड कम्युनिकेशन को सक्षम करने के लिए, आपको निम्नलिखित करना होगा:

1. आपके जॉब द्वारा बनाए गए पॉड्स के लिए एक वैध लेबल सेलेक्टर के साथ एक हेडलेस सर्विस सेटअप करें। हेडलेस सर्विस जॉब के समान नेमस्पेस में होनी चाहिए। इसे करने का एक आसान तरीका `job-name: <your-job-name>` सेलेक्टर का उपयोग करना है, क्योंकि `job-name` लेबल स्वचालित रूप से Kubernetes द्वारा जोड़ा जाएगा। यह कॉन्फ़िगरेशन DNS सिस्टम को आपके जॉब को चलाने वाले पॉड्स के होस्टनाम के रिकॉर्ड बनाने के लिए ट्रिगर करेगा।
2. निम्नलिखित मान को अपने जॉब टेम्पलेट स्पेक में शामिल करके जॉब पॉड्स के लिए हेडलेस सर्विस को सबडोमेन सर्विस के रूप में कॉन्फ़िगर करें:  
```yaml  
subdomain: <headless-svc-name>  
```

### उदाहरण

नीचे पॉड होस्टनाम के माध्यम से पॉड-टू-पॉड कम्युनिकेशन के साथ एक जॉब का एक कार्यशील उदाहरण है। जॉब तभी पूरा होता है जब सभी पॉड्स होस्टनाम का उपयोग करके एक-दूसरे को सफलतापूर्वक पिंग करते हैं।

#### नोट:

नीचे दिए गए उदाहरण में प्रत्येक पॉड पर निष्पादित बैश स्क्रिप्ट में, यदि पॉड को नेमस्पेस के बाहर से पहुंचने की आवश्यकता है तो पॉड होस्टनाम को नेमस्पेस द्वारा भी प्रीफिक्स किया जा सकता है।

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP को हेडलेस सर्विस बनाने के लिए None होना चाहिए
  selector:
    job-name: example-job # जॉब नाम से मेल खाना चाहिए
---
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      subdomain: headless-svc # सर्विस नाम से मेल खाना चाहिए
      restartPolicy: Never
      containers:
      - name: example-workload
        image: bash:latest
        command:
        - bash
        - -c
        - |
          for i in 0 1 2
          do
            gotStatus="-1"
            wantStatus="0"             
            while [ $gotStatus -ne $wantStatus ]
            do                                       
              ping -c 1 example-job-${i}.headless-svc > /dev/null 2>&1
              gotStatus=$?                
              if [ $gotStatus -ne $wantStatus ]; then
                echo "Failed to ping pod example-job-${i}.headless-svc, retrying in 1 second..."
                sleep 1
              fi
            done                                                         
            echo "Successfully pinged pod: example-job-${i}.headless-svc"
          done          
```

उपरोक्त उदाहरण को लागू करने के बाद, नेटवर्क पर एक-दूसरे तक पहुंचें: `<pod-hostname>.<headless-service-name>`। आपको निम्नलिखित के समान आउटपुट दिखाई देना चाहिए:

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

#### नोट:

ध्यान रखें कि इस उदाहरण में उपयोग किया गया `<pod-hostname>.<headless-service-name>` नाम फॉर्मेट DNS पॉलिसी को `None` या `Default` पर सेट करने के साथ काम नहीं करेगा। [पॉड की DNS पॉलिसी](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy) देखें। 