---
content_type: सिद्धांत
title: कुबेरनेटेस डॉक्स में योगदान दे
linktitle: योगदान
main_menu: true
no_list: true
weight: 80
card:
  name: योगदान
  weight: 10
  title: कुबेरनेटेस मे योगदान देना शुरू करे
---

<!-- अवलोकन  -->

*कुबेरनेटस सभी योगदानकर्ताओ से सुधार का स्वागत करता है चाहे वो नए हो या अनुभवी!*

{{< note  >}}
कुबेरनेटस मे योगदान करने के बारे मे अधिक जानकारी के लिए 
[योगदानकर्ता प्रलेखन](https://www.kubernetes.dev/docs/) देखें।
{{< /note  >}}

इस वेबसाइट की देख रेख [कुबेरनेटस SIG Docs](/docs/contribute/#get-involved-with-sig-docs) द्वारा की जाती है।

कुबेरनेटस प्रलेखन योगदानकर्ता :

- मौजूदा विषयों को सुधारते हैं 
- नए विषय बनाते हैं  
- प्रलेखन का अनुवाद करते हैं 
- कुबेरनेटस रिलीज चक्र मे प्रलेखन की देख रेख और प्रकाशन करते हैं



<!-- body -->

## शुरू करना 

कोई भी प्रलेखन के बारे मे इशू खोल सकता है या कुबेरनेटस वेबसाइट 
[`kubernetes/website` GitHub रिपॉजिटरी](https://github.com/kubernetes/website) 
मे बदलाव पुल अनुरोध (PR) द्वारा कर सकता है। 
आपको [Git](https://git-scm.com/) और 
[Github](https://skills.github.com/) 
की जानकारी होनी चाहिए ताकि आप कुबेरनेटेस समुदाय मे प्रभावी रूप से काम कर सकें। 

प्रलेखन मे सहयोग करने के लिए:

1. [योगदानकर्ता समझौता लाइसेन्स](https://github.com/kubernetes/community/blob/master/CLA.md) पर हस्ताक्षर करें। 
2. [प्रलेखन रिपॉजिटरी](https://github.com/kubernetes/website) 
   और वेबसाइट की [स्टैटिक साइट जनरेटर](https://gohugo.io) से खुद को परिचित करें। 
3. सुनिश्चित करें की आपको 
   [पुल अनुरोध करना](/docs/contribute/new-content/open-a-pr/) और 
   [बदलाओ की समीक्षा](/docs/contribute/review/reviewing-prs/) करना आता हो। 

<!-- इस चित्र की लाइव-एडिटर URL के लिए https://github.com/kubernetes/website/issues/28808 देखें  -->
<!-- आप मरमेड (mermaid) कोड को लाइव-एडिटर https://mermaid-js.github.io/mermaid-live-editor में कट/पेस्ट करके भी संपादित कर सकते हैं -->

{{< mermaid >}}
flowchart TB
subgraph third[PR ओपन करे]
direction TB
U[ ] -.-
Q[विषय सुधारे] --- N[विषय निर्माण करे]
N --- O[डॉक्स का अनुवाद करे]
O --- P[K8s रिलीज़ चक्र के प्रलेखन<br>को संचालित /प्रकाशित करें]

end

subgraph second[समीक्षा]
direction TB
   T[ ] -.-
   D[kubernetes/website<br>रिपॉजिटरी<br>को देखें] --- E[Hugo स्टैटिक साइट<br>जनरेटर<br>को देखें]
   E --- F[मूलभूत GitHub<br>कमांड समझें]
   F --- G[ओपन PR की समीक्षा करे<br>और समीक्षा प्रक्रिया<br>को बदलें]
end

subgraph first[साइनअप]
    direction TB
    S[ ] -.-
    B[CNCF<br>योगदानकर्ता<br>लइसेंस समझौता<br>पर हस्ताक्षर करें] --- C[sig-docs स्लैक चैनल<br>में जुड़ें] 
    C --- V[kubernetes-sig-docs<br>मेलिंग लिस्ट में जुड़ें]
    V --- M[साप्ताहिक<br>sig-docs कॉल<br>या स्लैक बैठक में शामिल हों]
end

A([fa:fa-user नए<br>योगदानकर्ता]) --> first
A --> second
A --> third
A --> H[सवाल पूछे!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
***आकृति - नए योगदानकर्ताओं के लिए योगदान शुरू करने का रास्ता***

ऊपर दी गई आकृति नए योगदानकर्ता के लिए दिशानिर्देश हैं। `Sign up` या `review` के लिए आप इनमे से कुछ या सभी निर्देशों का पालन कर सकते हैं। अब आप PR ओपन करने के लिए तैयार हैं जो आपके योगदान के उद्देश को पूरा करे जो `Open PR` खंड मे सूचीबद्ध हैं। आपके सभी प्रश्नों का सदैव स्वागत है। 

कुबेरनेटस समुदाय मे कुछ कार्यों के लिए अधिक विश्वास और अभिगम की आवश्यकता होती है। 
भूमिका और अनुमति के बारे मे ज्यादा जानकारी के लिए  
[SIG Docs मे भाग लेना](/docs/contribute/participate/) को देखें। 

## आपका पहला योगदान 

आप अपने पहले योगदान की तैयारी के लिए दिए गए दिशानिर्देश को देख सकते हैं। नीचे दिया हुआ चित्र दिशानिर्देश और उसकी विस्तार मे जानकारी देता है। 

<!-- इस चित्र की लाइव-एडिटर URL के लिए https://github.com/kubernetes/website/issues/28808 देखें -->
<!-- आप मरमेड (mermaid) कोड को लाइव-एडिटर https://mermaid-js.github.io/mermaid-live-editor में कट/पेस्ट करके भी संपादित कर सकते हैं -->

{{< mermaid >}}
flowchart LR
    subgraph second[पहला योगदान]
    direction TB
    S[ ] -.-
    G[दूसरे K8s मेम्बर्स के<br>PRs की समीक्षा करें] -->
    A[अपने पहले इशू (गुफ फर्स्ट इशू)<br>के लिए kubernetes/website<br>की इशू सूची पर जाएं] --> B[PR ओपन करें!!]
    end
    subgraph first[सूचित तैयारी]
    direction TB
       T[ ] -.-
       D[योगदान अवलोकन को पढे] -->E[K8s विषय<br>और विषय गाइड को पढ़ें]
       E --> F[Hugo पेज<br>विषय के प्रकार<br>और shortcodes के बारे मे जाने]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
**आकृति - आपके पहले योगदान की तैयारी**

- योगदान करने के विभिन्न तरीकों को जानने के लिए [योगदानकर्ता अवलोकन](/docs/contribute/new-content/overview/) को पढ़ें। 
- अच्छे प्रवेश बिन्दु के लिए [`kubernetes/website` इशू सूची](https://github.com/kubernetes/website/issues/)
  को जाचें। 
- मौजूदा प्रलेखन पर [Github का प्रयोग करते हुए पुल अनुरोध करॆ](/docs/contribute/new-content/open-a-pr/#changes-using-github) 
  और इशू दाखिल करने के बारे मे अधिक जानें। 
- भाषा और सटीकता के लिए अन्य कुबेरनेटस समुदाय के सदस्यों के 
  [पुल अनुरोध की समीक्षा करें](/docs/contribute/review/reviewing-prs/)। 
- कुबेरनेटस [प्रकरण ](/docs/contribute/style/content-guide/) और  
  [स्टाइल मार्गदर्शक](/docs/contribute/style/style-guide/) को पढ़ें ताकि आप सूचित टिप्पणी दे सकें। 
- [पेज प्रलेखन टाइप](/docs/contribute/style/page-content-types/)
  और  [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) के बारे मे जानें।  

## अगले कदम 

- रिपॉजिटरी के [लोकल क्लोन से काम करना](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
  सीखें। 
- [रिलीज़ में फीचर्स का](/docs/contribute/new-content/new-features/) आलेख करे। 
- [SIG  Docs](/docs/contribute/participate/) मे भाग लें और
  [सदस्य या समीक्षक](/docs/contribute/participate/roles-and-responsibilities/) बनें। 
                       
- [स्थानीयकरण](/docs/contribute/localization/) शुरू करे या उसमे सहायता करें। 

## सिग डॉक्स मे शामिल हो 

[SIG Docs](/docs/contribute/participate/) योगदानकर्ताओ का एक समूह है 
जो कुबेरनेटेस प्रलेखन और वेबसाईट की देख रेख और उसे प्रकाशित करता है। 
SIG Docs मे शामिल होना कुबेरनेटस योगदानकर्ताओ (फीचर विकास या उससे अन्यथा) के लिए 
कुबेरनेटस परियोजना पर प्रभाव डालने का बेहतरीन तरीका है। 

SIG Docs भिन्न प्रकार से संवाद करते हैं:

- [कुबेरनेटेस Slack चैनल मे #sig-docs से जुड़ें](https://slack.k8s.io/) और खुद का परिचय दें! 
- [kubernetes-sig-docs मेलिंग लिस्ट मे शामिल हो](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  वहाँ व्यापक विचार-विमर्श होता है और आधिकारिक फैसले का अभिलेखन किया जाता है।
- [SIG Docs विडिओ बैठक](https://github.com/kubernetes/community/tree/master/sig-docs) मे शामिल हो जो हर दो सप्ताह मे होती है। बैठक की घोषणा हमेशा `#sig-docs`  पर की जाती है और [कुबेरनेटेस समुदाय बैठक कैलंडर](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles) में जोड़ दिया जाता है। आपको [Zoom client](https://zoom.us/download) डाउनलोड करने की जरूरत पड़ेगी या फोन की मदद से भी डायल कर सकते हैं। 
- जिन सप्ताह मे Zoom बैठक नहीं हुई हो तब SIG Docs अतुल्यकालिक बैठक को जॉइन करे जो Slack पर होती है। बैठक की घोषणा हमेशा `#sig-docs` पर होती है। बैठक की घोषणा के बाद आप किसी भी सूत्र मे 24 घंटे तक योगदान कर सकते है।

## योगदान करने के अन्य तरीके 

- [कुबेरनेटस समुदाय साइट](/community/) पर जाए। Twitter या Slack Overflow मैं भाग ले, कुबेरनेटस स्थानीय आयोजन और मिलन के बारे मे जाने । 
- कुबेरनेटस फीचर विकास में शामिल होने के लिए [योगदानकर्ता चीटशीट](https://www.kubernetes.dev/docs/contributor-cheatsheet/) पढ़ें। 
- [कुबेरनेटस योगदानकर्ता](https://www.kubernetes.dev/) और [अतिरिक्त योगदानकर्ता साधन](https://www.kubernetes.dev/resources/) के बारे मे अधिक जानकारी के लिए योगदानकर्ता साइट पर जाएं। 
- [ब्लॉग पोस्ट या केस अध्ययन](/docs/contribute/new-content/blogs-case-studies/) प्रस्तुत करे। 
