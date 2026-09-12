---
title: गैंग शेड्यूलिंग
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GangScheduling" >}}

गैंग शेड्यूलिंग यह सुनिश्चित करती है कि Pods के एक समूह को "ऑल-ऑर-नथिंग" आधार पर शेड्यूल किया जाए।
यदि क्लस्टर पूरे समूह (या Pods की एक निर्धारित न्यूनतम संख्या) को समायोजित नहीं कर सकता,
तो किसी भी Pod को किसी नोड से बाउंड नहीं किया जाता।

यह सुविधा [PodGroup API](/docs/concepts/workloads/podgroup-api/) पर निर्भर करती है।
सुनिश्चित करें कि क्लस्टर में [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
फ़ीचर गेट और `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}} सक्षम हैं।

<!-- body -->

## यह कैसे काम करती है

जब `GangScheduling` प्लगइन सक्षम होता है, तो शेड्यूलर उन Pods के लाइफ़साइकल को बदल देता है जो
`gang` [शेड्यूलिंग नीति](/docs/concepts/workloads/workload-api/policies/) वाले किसी
[PodGroup](/docs/concepts/workloads/podgroup-api/) से संबंधित होते हैं।
यह प्रक्रिया प्रत्येक PodGroup के लिए इन चरणों का पालन करती है:

1. शेड्यूलर Pods को `PreEnqueue` फ़ेज़ में तब तक रोके रखता है जब तक:
   * संदर्भित PodGroup ऑब्जेक्ट मौजूद न हो।
   * `PodGroup` के लिए बनाए गए `Pods` की संख्या कम से कम `minCount` के बराबर न हो।

   जब तक दोनों शर्तें पूरी नहीं होतीं, तब तक `Pods` सक्रिय शेड्यूलिंग कतार में प्रवेश नहीं करते।

2. कोरम पूरा होने के बाद, शेड्यूलर समूह के सभी Pods के लिए प्लेसमेंट खोजने का प्रयास करता है।
   यह एकल, परमाणु शेड्यूलिंग निर्णय लेने के लिए [PodGroup शेड्यूलिंग](/docs/concepts/scheduling-eviction/podgroup-scheduling/) चक्र का उपयोग करता है।
   `GangScheduling` प्लगइन एक `Permit` एक्सटेंशन पॉइंट लागू करता है जिसका मूल्यांकन चक्र के दौरान प्रत्येक शेड्यूल-योग्य Pod के लिए किया जाता है।
   इसका उपयोग सफलतापूर्वक रखे गए pods की संख्या की `minCount` मान से तुलना करके यह निर्धारित करने के लिए किया जाता है कि `minCount` बाधा संतुष्ट होती है या नहीं।

3. यदि शेड्यूलर कम से कम `minCount` संख्या के Pods के लिए वैध प्लेसमेंट खोज लेता है,
   तो यह उन सफलतापूर्वक रखे गए Pods को उनके निर्दिष्ट नोड्स से बाउंड होने की अनुमति देता है।
   यदि यह `minCount` आवश्यकता को पूरा करने के लिए पर्याप्त प्लेसमेंट नहीं खोज पाता, तो किसी भी Pod को शेड्यूल नहीं किया जाता।
   इसके बजाय, उन्हें क्लस्टर संसाधनों के मुक्त होने की प्रतीक्षा के लिए अनशेड्यूलेबल कतार में ले जाया जाता है,
   जिससे इस बीच अन्य वर्कलोड शेड्यूल हो सकें।

## {{% heading "whatsnext" %}}

* [PodGroup API](/docs/concepts/workloads/podgroup-api/) और इसके [लाइफ़साइकल](/docs/concepts/workloads/podgroup-api/lifecycle/) के बारे में जानें।
* [PodGroup शेड्यूलिंग नीतियों](/docs/concepts/workloads/workload-api/policies/) के बारे में पढ़ें।
* [PodGroup शेड्यूलिंग](/docs/concepts/scheduling-eviction/podgroup-scheduling/) के बारे में पढ़ें।
