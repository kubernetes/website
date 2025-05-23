---
title: एक उदाहरण Stateful एप्लिकेशन चलाएं
content_type: tutorial
weight: 20
---

<!-- overview -->

यह पृष्ठ आपको कुबेरनेटेस में एक उदाहरण Stateful एप्लिकेशन चलाने का तरीका दिखाता है, जिसमें PersistentVolume और Deployment का उपयोग किया गया है। एप्लिकेशन MySQL है।

## {{% heading "objectives" %}}

- अपने वातावरण में एक डिस्क को संदर्भित करने वाले PersistentVolume को बनाएं।
- एक MySQL Deployment बनाएं।
- क्लस्टर में अन्य पॉड्स को ज्ञात DNS नाम पर MySQL को एक्सपोज़ करें।

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## MySQL को डिप्लॉय करें {#deploy-mysql}

आप एक Stateful एप्लिकेशन को कुबेरनेटेस Deployment बनाकर और इसे एक मौजूदा PersistentVolume से PersistentVolumeClaim के माध्यम से कनेक्ट करके चला सकते हैं। उदाहरण के लिए, यह YAML फ़ाइल एक Deployment का वर्णन करती है जो MySQL चलाती है और PersistentVolumeClaim को संदर्भित करती है। फ़ाइल /var/lib/mysql के लिए एक वॉल्यूम माउंट को परिभाषित करती है, और फिर एक PersistentVolumeClaim बनाती है जो 20G वॉल्यूम की तलाश करती है। यह दावा किसी भी मौजूदा वॉल्यूम द्वारा पूरा किया जा सकता है जो आवश्यकताओं को पूरा करता है, या एक डायनेमिक प्रोविजनर द्वारा।

नोट: पासवर्ड को कॉन्फ़िगरेशन YAML में परिभाषित किया गया है, और यह असुरक्षित है। सुरक्षित समाधान के लिए [कुबेरनेटेस Secrets](/docs/concepts/configuration/secret/) देखें।

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

1. YAML फ़ाइल के PV और PVC को डिप्लॉय करें:

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
```

1. YAML फ़ाइल की सामग्री को डिप्लॉय करें:

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
```

1. Deployment की जानकारी प्रदर्शित करें:

```shell
kubectl describe deployment mysql
```

आउटपुट इस प्रकार होगा:

```
Name:                 mysql
Namespace:            default
CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
Labels:               app=mysql
Annotations:          deployment.कुबेरनेटेस.io/revision=1
Selector:             app=mysql
Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
StrategyType:         Recreate
MinReadySeconds:      0
Pod Template:
  Labels:       app=mysql
  Containers:
   mysql:
   Image:      mysql:5.6
   Port:       3306/TCP
   Environment:
    MYSQL_ROOT_PASSWORD:      password
   Mounts:
    /var/lib/mysql from mysql-persistent-storage (rw)
  Volumes:
   mysql-persistent-storage:
   Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
   ClaimName:  mysql-pv-claim
   ReadOnly:   false
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     False   MinimumReplicasUnavailable
  Progressing   True    ReplicaSetUpdated
OldReplicaSets:       <none>
NewReplicaSet:        mysql-63082529 (1/1 replicas created)
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1
```

1. Deployment द्वारा बनाए गए पॉड्स की सूची देखें:

```shell
kubectl get pods -l app=mysql
```

आउटपुट इस प्रकार होगा:

```
NAME                   READY     STATUS    RESTARTS   AGE
mysql-63082529-2z3ki   1/1       Running   0          3m
```

1. PersistentVolumeClaim का निरीक्षण करें:

```shell
kubectl describe pvc mysql-pv-claim
```

आउटपुट इस प्रकार होगा:

```
Name:         mysql-pv-claim
Namespace:    default
StorageClass:
Status:       Bound
Volume:       mysql-pv-volume
Labels:       <none>
Annotations:    pv.कुबेरनेटेस.io/bind-completed=yes
           pv.कुबेरनेटेस.io/bound-by-controller=yes
Capacity:     20Gi
Access Modes: RWO
Events:       <none>
```

## MySQL इंस्टेंस तक पहुंचना  {#accessing-the-mysql-instance}

उपरोक्त YAML फ़ाइल एक सेवा बनाती है जो क्लस्टर में अन्य पॉड्स को डेटाबेस तक पहुंचने की अनुमति देती है। सेवा विकल्प `clusterIP: None` सेवा DNS नाम को सीधे पॉड के IP पते पर हल करने देता है। यह तब इष्टतम है जब आपके पास सेवा के पीछे केवल एक पॉड हो और आप पॉड्स की संख्या बढ़ाने का इरादा न रखें।

MySQL सर्वर से कनेक्ट करने के लिए MySQL क्लाइंट चलाएं:

```shell
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

यह कमांड क्लस्टर में एक नया पॉड बनाता है जो MySQL क्लाइंट चला रहा है और सेवा के माध्यम से सर्वर से कनेक्ट करता है। यदि यह कनेक्ट होता है, तो आप जानते हैं कि आपका Stateful MySQL डेटाबेस चालू और चल रहा है।

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## अपडेट करना {#updating}

`kubectl apply` कमांड के साथ इमेज या Deployment के किसी अन्य भाग को सामान्य रूप से अपडेट किया जा सकता है। Stateful एप्लिकेशन के लिए यहां कुछ सावधानियां दी गई हैं:

- एप्लिकेशन को स्केल न करें। यह सेटअप केवल एक उदाहरण एप्लिकेशन के लिए है। अंतर्निहित PersistentVolume को केवल एक पॉड पर माउंट किया जा सकता है। क्लस्टर्ड Stateful एप्लिकेशन के लिए, [StatefulSet दस्तावेज़ीकरण](/docs/concepts/workloads/controllers/statefulset/) देखें।
- Deployment कॉन्फ़िगरेशन YAML फ़ाइल में `strategy:` `type: Recreate` का उपयोग करें। यह कुबेरनेटेस को रोलिंग अपडेट का उपयोग न करने का निर्देश देता है। रोलिंग अपडेट काम नहीं करेंगे, क्योंकि आप एक समय में एक से अधिक पॉड नहीं चला सकते। `Recreate` रणनीति पहले पॉड को रोक देगी और फिर अपडेटेड कॉन्फ़िगरेशन के साथ एक नया पॉड बनाएगी।

## डिप्लॉयमेंट हटाना  {#deleting-a-deployment}

नाम से डिप्लॉय की गई वस्तुओं को हटाएं:

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

यदि आपने मैन्युअल रूप से PersistentVolume प्रोविजन किया है, तो आपको इसे मैन्युअल रूप से हटाने की भी आवश्यकता है, साथ ही अंतर्निहित संसाधन को रिलीज़ करना होगा। यदि आपने डायनेमिक प्रोविजनर का उपयोग किया है, तो यह PersistentVolumeClaim को हटाने पर PersistentVolume को स्वचालित रूप से हटा देता है। कुछ डायनेमिक प्रोविजनर (जैसे EBS और PD के लिए) PersistentVolume को हटाने पर अंतर्निहित संसाधन को भी रिलीज़ कर देते हैं।

## {{% heading "whatsnext" %}}

- [Deployment ऑब्जेक्ट्स](/docs/concepts/workloads/controllers/deployment/) के बारे में और जानें।

- [एप्लिकेशन डिप्लॉय करना](/docs/tasks/run-application/run-stateless-application-deployment/) के बारे में और जानें।

- [kubectl run दस्तावेज़ीकरण](/docs/reference/generated/kubectl/kubectl-commands/#run)

- [Volumes](/docs/concepts/storage/volumes/) और [Persistent Volumes](/docs/concepts/storage/persistent-volumes/) के बारे में और जानें।
