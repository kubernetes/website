---
title: कंटेनर लाइफसाइकल हुक्स (Container Lifecycle Hooks)
content_type: कांसेप्ट (concept)
weight: 40
---

<!-- overview -->

यह पृष्ठ बताता है कि क्यूबलेट द्वारा प्रबंधित किए जाने वाले कंटेनर जीवन चक्र हुक फ्रेमवर्क का उपयोग करके उनमें घटनाओं के द्वारा ट्रिगर किए गए कोड को चलाने के लिए कैसे उपयोग कर सकते हैं।


<!-- body -->

## अवलोकन

कई प्रोग्रामिंग भाषा फ्रेमवर्क के अनुरूप जैसे Angular, कुबरनेटीज Containers को lifecycle hooks के साथ प्रदान करता है।
Hooks Containers को उनके मैनेजमेंट lifecycle के घटनाओं के बारे में जागरूक बनाते हैं
और जब संबंधित lifecycle hook को निष्पादित किया जाता है तो एक हैंडलर में लिखी कोड चलाने की सुविधा प्रदान करते हैं।

## कंटेनर हुक्स

कंटेनर्स के लिए दो हुक्स होते हैं जिनको बेहतरीन रूप से उपलब्ध कराया जाता है:

PostStart

यह हुक तुरंत एक कंटेनर बनाया जाने के बाद निष्पादित किया जाता है।
हालांकि, कंटेनर ENTRYPOINT से पहले हुक निष्पादित होने का कोई भरोसा नहीं है।
हैंडलर को कोई पैरामीटर नहीं पारित किए जाते हैं।

PreStop

यह हुक API अनुरोध या प्रबंधन घटना जैसे लिवलीहूड/स्टार्टअप परीक्षण में विफलता, पूर्ववर्तन, संसाधन संघर्ष और अन्य कारणों से कंटेनर को समाप्त करने से पहले तुरंत बुलाया जाता है।
कंटेनर पहले से ही एक समाप्त या पूर्णावस्था में है तो PreStop हुक कोल नहीं होगा और हुक को पूरा करने से पहले कंटेनर को रोकने के लिए TERM सिग्नल भेजा जाना चाहिए। पॉड की समाप्ति का ग्रेस अवधि नीचे गिनती शुरू होती है पहले PreStop हुक निष्पादित होने से पहले, इसलिए हैंडलर के नतीजे का अनुसरण करने के बावजूद, कंटेनर अंततः पॉड की समाप्ति ग्रेस अवधि के भीतर ही समाप्त हो जाएगा।

पॉडों के समाप्ति व्यवहार का और अधिक विस्तृत विवरण [पॉडों की समाप्ति](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) में दिया गया है।


### हुक हैंडलर कार्यान्वयन

कंटेनर उस हुक को लागू कर सकता है जिसके लिए उसने हैंडलर का कार्यान्वयन किया और पंजीकृत किया है।
कंटेनरों के लिए दो प्रकार के हुक हैंडलर का कार्यान्वयन किया जा सकता है:


* Exec - कंटेनर के cgroups और namespaces के भीतर pre-stop.sh जैसे विशिष्ट कमांड को निष्पादित करता है।
कमांड द्वारा संभावित संसाधन कंटेनर के खिलाफ गिनती की जाती है।
* HTTP - कंटेनर पर एक विशिष्ट endpoint पर एक HTTP अनुरोध निष्पादित करता है।


### हुक हैंडलर क्रियान्वयण

जब एक कंटेनर जीवन चक्र प्रबंधन हुक को कॉल किया जाता है,
तो कुबेरनेट्स प्रबंधन प्रणाली हुक कार्रवाई के अनुसार हैंडलर को निष्पादित करता है,
`httpGet` और `tcpSocket` कुबलेट प्रक्रिया द्वारा निष्पादित किए जाते हैं, और `exec` कंटेनर में निष्पादित किया जाता है।

हुक हैंडलर कॉल पॉड के संदर्भ में समन्वयात्मक होते हैं जो कंटेनर को समायोजित करते हैं।
यह यह मतलब होता है कि `PostStart` हुक के लिए,
कंटेनर ENTRYPOINT और हुक असमन्वित रूप से फायर करते हैं।
हालांकि, अगर हुक चलाने में बहुत अधिक समय लगता है या फंस जाता है,
तो कंटेनर `running` स्थिति तक पहुँच नहीं सकता।


`PreStop` हुक कंटेनर को रोकने के सिग्नल से असिंक्रोनस रूप से नहीं चलाए जाते हैं; हुक को पूरा करना होगा पहले जब टर्म सिग्नल भेजा जाए।
यदि `PreStop` हुक के दौरान कोई खट्टा जाम होता है, तो पॉड का चरण `Terminating` होगा और इससे पहले कि `terminationGracePeriodSeconds`
समाप्त हो जाए, पॉड को मार दिया जाएगा। यह ग्रेस पीरियड यह दोनों चीजों के लिए लागू होता है - `PreStop` हुक को कार्यान्वित करने में और कंटेनर को
सामान्य रूप से रोकने में। उदाहरण के लिए, यदि `terminationGracePeriodSeconds` 60 है और हुक को पूरा करने में 55 सेकंड लगते हैं और कंटेनर
को सिग्नल प्राप्त करने के बाद सामान्य रूप से रोकने में 10 सेकंड लगते हैं, तो कंटेनर को सामान्य रूप से रोकने से पहले ही उसे मार दिया जाएगा
क्योंकि `terminationGracePeriodSeconds` उन दो चीजों के लिए कम है (55+10) जिसमें इन दोनों चीजों का होने में समय लगता है।


अगर `PostStart` या `PreStop` हुक असफल होता है, तो वह Container को रद्द कर देता है।

उपयोगकर्ताओं को अपने हुक हैंडलर को जितना हल्का संभव बनाना चाहिए।
हालांकि, लंबे समय तक चलने वाले कमांडों के मामलों में समझौता किया जा सकता है,
जैसे कि कंटेनर को बंद करने से पहले स्थिति को बचाने के लिए।


### हुक वितरण गारंटीज़

हुक वितरण कम से कम एक बार होना निर्धारित है,
जिसका अर्थ है कि किसी भी घटना के लिए एक हुक को एकाधिक बार बुलाया जा सकता है,
जैसे कि `PostStart` या `PreStop` के लिए।
इसे सही ढंग से संचालित करना हुक अंमल के लिए अधिकृत होता है।


आमतौर पर, केवल एकल पहुँच की जाती है।
उदाहरण के लिए, अगर एक HTTP हुक रिसीवर नीचे होता है और ट्रैफिक ले नहीं सकता है,
तो दोबारा भेजने का कोई प्रयास नहीं होता है।
हालांकि, कुछ दुर्लभ मामलों में, दोहरी पहुंच हो सकती है।
उदाहरण के लिए, यदि कोई कुबलेट हुक भेजने के बीच में बंद हो जाता है,
तो कुबलेट फिर से शुरू होने के बाद हुक फिर से भेजा जा सकता है।

### हुक हैंडलर को डिबग करना

एक हुक हैंडलर के लॉग पॉड इवेंट्स में प्रदर्शित नहीं होते हैं।
यदि किसी कारण से हैंडलर विफल हो जाता है, तो एक इवेंट प्रसारित किया जाता है।
`PostStart` के लिए, यह `FailedPostStartHook` इवेंट है,
और `PreStop` के लिए, यह `FailedPreStopHook` इवेंट है।
अपने आप `FailedPostStartHook` इवेंट उत्पन्न करने के लिए, फ़ाइल [lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml) में postStart कमांड को "badcommand" में बदलें और इसे लागू करें।
यहां कुछ उदाहरण आउटपुट है जो आपको `kubectl describe pod lifecycle-demo` चलाकर देखने को मिलेगा:


```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               कुबलेट            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  कुबलेट            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  कुबलेट            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  कुबलेट            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  कुबलेट            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  कुबलेट            FailedPostStartHook
  Normal   Pulled               4s               कुबलेट            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  कुबलेट            Back-off restarting failed container
```



## {{% heading "whatsnext" %}}


* कंटेनर वातावरण के बारे में अधिक जानें [Container environment](/docs/concepts/containers/container-environment/).
* हाथों का अनुभव प्राप्त करें
[कंटेनर लाइफसाइकल घटनाओं के हैंडलर लगाने के लिए](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).