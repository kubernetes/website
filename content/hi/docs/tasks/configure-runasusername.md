---
title: Windows Pods और Containers के लिए RunAsUserName कॉन्फ़िगर करें
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

यह पेज दिखाता है कि Windows nodes पर चलने वाले Pods और containers के लिए
`runAsUserName` सेटिंग का उपयोग कैसे करें। यह लगभग Linux-विशिष्ट `runAsUser`
सेटिंग के समकक्ष है, जिससे आप container में applications को default username से
अलग username पर चला सकते हैं।



## {{% heading "prerequisites" %}}


आपके पास Kubernetes cluster होना चाहिए और kubectl command-line tool आपके cluster से
communicate करने के लिए configured होना चाहिए। cluster में Windows worker nodes होने चाहिए,
जहाँ Windows workloads चलाने वाले containers वाले pods schedule किए जा सकें।



<!-- steps -->

## Pod के लिए Username सेट करें

Pod के container processes किस username से execute हों, यह बताने के लिए Pod specification में
`securityContext` field ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core))
शामिल करें, और उसके अंदर `windowsOptions`
([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core))
field में `runAsUserName` field दें।

Pod के लिए जो Windows security context options आप specify करते हैं, वे Pod के सभी Containers
और init Containers पर लागू होते हैं।

यहाँ Windows Pod की configuration file है जिसमें `runAsUserName` field सेट है:

{{% code_sample file="windows/run-as-username-pod.yaml" %}}

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

जांचें कि Pod का Container चल रहा है:

```shell
kubectl get pod run-as-username-pod-demo
```

चल रहे Container में shell खोलें:

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

जांचें कि shell सही username के रूप में चल रही है:

```powershell
echo $env:USERNAME
```

आउटपुट यह होना चाहिए:

```
ContainerUser
```

## Container के लिए Username सेट करें

Container के processes किस username से execute हों, यह बताने के लिए Container manifest में
`securityContext` field ([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core))
शामिल करें, और उसके अंदर `windowsOptions`
([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core))
field में `runAsUserName` field दें।

Container के लिए जो Windows security context options आप specify करते हैं, वे केवल उसी
Container पर लागू होते हैं, और Pod level पर की गई settings को override करते हैं।

यहाँ Pod की configuration file है जिसमें एक Container है, और `runAsUserName` field
Pod level तथा Container level दोनों पर सेट है:

{{% code_sample file="windows/run-as-username-container.yaml" %}}

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

जांचें कि Pod का Container चल रहा है:

```shell
kubectl get pod run-as-username-container-demo
```

चल रहे Container में shell खोलें:

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

जांचें कि shell सही username के रूप में चल रही है (यानी वही जो Container level पर सेट है):

```powershell
echo $env:USERNAME
```

आउटपुट यह होना चाहिए:

```
ContainerAdministrator
```

## Windows Username सीमाएँ

इस feature का उपयोग करने के लिए `runAsUserName` field में दिया गया मान एक वैध username होना चाहिए।
यह format `DOMAIN\USER` में होना चाहिए, जहाँ `DOMAIN\` वैकल्पिक है। Windows usernames case insensitive होते हैं।
इसके अलावा `DOMAIN` और `USER` के संबंध में कुछ प्रतिबंध हैं:

- `runAsUserName` field खाली नहीं हो सकती और इसमें control characters (ASCII values: `0x00-0x1F`, `0x7F`) नहीं होने चाहिए।
- `DOMAIN` या तो NetBios नाम होना चाहिए या DNS नाम, और दोनों पर अलग-अलग सीमाएँ लागू होती हैं:
  - NetBios names: अधिकतम 15 characters, `.` (dot) से शुरू नहीं होना चाहिए, और इन characters को शामिल नहीं कर सकता: `\ / : * ? " < > |`
  - DNS names: अधिकतम 255 characters, केवल alphanumeric characters, dots और dashes शामिल हों, और `.` (dot) या `-` (dash) से शुरू/समाप्त न हो।
- `USER` अधिकतम 20 characters का होना चाहिए, केवल dots या spaces से बना नहीं होना चाहिए, और इनमें से कोई character शामिल नहीं होना चाहिए: `" / \ [ ] : ; | = , + * ? < > @`।

`runAsUserName` field के स्वीकार्य मानों के उदाहरण:
`ContainerAdministrator`, `ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`।

इन सीमाओं के बारे में अधिक जानकारी के लिए [here](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) और [here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1) देखें।



## {{% heading "whatsnext" %}}


* [Kubernetes में Windows containers schedule करने की guide](/docs/concepts/windows/user-guide/)
* [Group Managed Service Accounts (GMSA) के साथ Workload Identity प्रबंधन](/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
* [Windows pods और containers के लिए GMSA कॉन्फ़िगर करें](/docs/tasks/configure-pod-container/configure-gmsa/)
