---
title: एक पुल अनुरोध खोलना
content type: संकल्पना
weight: 10
card:
    name: योगदान देना
    weight: 40
---

<!-- अवलोकन  -->

{{< note >}}
**कोड डेवलपर्स:**: यदि आप आगामी कुबेरनेट्स रिलीज के लिए एक नई सुविधा का प्रलेखीकरण कर रहे हैं, तो देखें [एक नई सुविधा का प्रलेखन](/docs/contribute/new-content/new-features/)|
{{< /note >}}

नए सामग्री पृष्ठों में योगदान करने या मौजूदा सामग्री पृष्ठों में सुधार करने के लिए, पुल अनुरोध (PR) खोलें। सुनिश्चित करें कि आप [शुरू करने से पहले](/docs/contribute/new-content/overview/#before-you-begin) अनुभाग में सभी आवश्यकताओं का पालन करते हैं।

यदि आपका परिवर्तन छोटा है, या आप git से अपरिचित हैं, तो किसी पृष्ठ को संपादित करने का तरीका जानने के लिए [GitHub का उपयोग करके परिवर्तन](#changes-using-github) को पढ़ें।

यदि आपके परिवर्तन बड़े हैं, तो अपने कंप्यूटर पर स्थानीय रूप से परिवर्तन करने का तरीका जानने के लिए [स्थानीय प्रति से कार्य करें](#fork-the-repo) को पढ़ें।

<!-- body -->

## GitHub का उपयोग करके परिवर्तन

यदि आप git वर्कफ़्लो के साथ कम अनुभवी हैं, तो यहाँ एक पुल अनुरोध खोलने का एक आसान तरीका है। चित्रा 1 चरणों की रूपरेखा और विवरण का पालन करता है।

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user New<br>Contributor]) --- id1[(K8s/Website<br>GitHub)]
subgraph tasks[Changes using GitHub]
direction TB
    0[ ] -.-
    1[1. Edit this page] --> 2[2. Use GitHub markdown<br>editor to make changes]
    2 --> 3[3. fill in Propose file change]

end
subgraph tasks2[ ]
direction TB
4[4. select Propose file change] --> 5[5. select Create pull request] --> 6[6. fill in Open a pull request]
6 --> 7[7. select Create pull request] 
end

id1 --> tasks --> tasks2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,1,2,3,4,5,6,7 grey
class 0 spacewhite
class tasks,tasks2 white
class id1 k8s
{{</ mermaid >}}

चित्रा 1. GitHub का उपयोग करके PR खोलने के चरण।

1. उस पृष्ठ पर जहां आपको समस्या दिखाई देती है, ऊपर दाईं ओर पेंसिल आइकन चुनें।
    आप पृष्ठ के निचले भाग तक भी स्क्रॉल कर सकते हैं और **इस पृष्ठ को संपादित करें** का चयन कर सकते हैं।

1. GitHub मार्कडाउन संपादक में अपने परिवर्तन करें।

1. संपादक के नीचे, **प्रस्ताव फ़ाइल परिवर्तन** फ़ॉर्म भरें।
   पहले क्षेत्र में, अपने प्रतिबद्ध संदेश को एक शीर्षक दें।
   दूसरे क्षेत्र में, विवरण प्रदान करें।

    {{< note >}}
    अपने प्रतिबद्ध संदेश में किसी भी [GitHub कीवर्ड](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) का उपयोग न करें। आप उन्हें बाद में पुल अनुरोध विवरण में जोड़ सकते हैं।
    {{< /note >}}

1. **फ़ाइल परिवर्तनों का प्रस्ताव** चुनें।

1. **पुल अनुरोध बनाएं** चुनें।

1. **ओपन ए पुल रिक्वेस्ट** स्क्रीन दिखाई देती है। प्रपत्र को भरें:
   
   - पुल अनुरोध का **विषय** क्षेत्र प्रतिबद्ध सारांश के लिए डिफ़ॉल्ट है।
     जरूरत पड़ने पर आप इसे बदल सकते हैं।
   - **बॉडी** ​​में आपका विस्तारित प्रतिबद्ध संदेश शामिल है, यदि आपके पास एक है,
     और कुछ टेम्पलेट पाठ। जोड़ें
     विवरण टेम्पलेट टेक्स्ट मांगता है, फिर अतिरिक्त टेम्पलेट टेक्स्ट हटा दें।
   - **अनुरक्षकों से संपादन की अनुमति दें** चेकबॉक्स चयनित रहने दें।

    {{< note >}}
    पीआर विवरण समीक्षकों को आपके परिवर्तन को समझने में मदद करने का एक शानदार तरीका है।
   अधिक जानकारी के लिए, [पीआर खोलना](#open-a-pr) देखें। 
    {{</ note >}}

1. **पुल अनुरोध बनाएं** चुनें।

### GitHub में प्रतिक्रिया को संबोधित करना

पुल अनुरोध को मर्ज करने से पहले, कुबेरनेट्स समुदाय के सदस्य समीक्षा करते हैं और
इसे मंज़ूरी दें। `K8s-ci-robot` समीक्षकों को निकटतम के आधार पर सुझाव देता है
पृष्ठों में उल्लिखित स्वामी। यदि आपके मन में कोई विशिष्ट है,
इसमें उनके GitHub उपयोगकर्ता नाम के साथ एक टिप्पणी छोड़ें।