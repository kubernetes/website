---
विषय सूची : संकल्पना 
शीर्षक : कुबेरनेटेस डाक्यमेन्ट मे योगदान दे 
linktitle: योगदान 
मुख्य मेनू : सच 
no_list: सही 
weight: 80
card:
  नाम : योगदान 
  weight: 10
  शीर्षक : कुबेरनेटेस मे योगदान देना शुरू करे 
---

<!-- अवलोकन  -->

*कुबेरनेटेस सभी योगदानकर्ताओ से सुधार का स्वागत करता है चाहे वो नए हो या अनुभवी   *

{{< ध्यान दे  >}}
कुबेरनेटेस मे योगदान करने के बारे मे ज्यादा जानकारी के लिए 
[योगदानकर्ता प्रलेखन ](https://www.kubernetes.dev/docs/) देखे । .
{{< /ध्यान दे  >}}

ये वेबसाईट  [कुबेरनेटेस सिग डॉक्स ](/docs/contribute/#get-involved-with-sig-docs) द्वारा  देख रेख की जाती है ।

कुबेरनेटेस  प्रलेखन  योगदानकर्ता :

- पुराने विषय को सुधारते है 
- नए विषय बनाते है 
- प्रलेखन को दूसरी भाषा मे बदलते है 
- कुबेरनेटेस रिलीज चक्र मे प्रलेखन की देख रेख और प्रकाशन करते है 



<!-- body -->

## शुरू करना 

कोई भी प्रलेखन के बारे मे मुद्दा खोल सकते है  या कुबेरनेटेस वेबसाईट 
[`kubernetes/website` GitHub repository](https://github.com/kubernetes/website)मे बदलाव  का योगदान पुल रीक्वेस्ट (PR) द्वारा कर सकते है । 
आपको 
[गिट ](https://git-scm.com/) और 
[गीठब ](https://lab.github.com/) 
के बारे मे जानकारी होनी चाहिए ताकि आप कुबेरनेटेस समुदाय मे प्रभावी रूप से काम कर सके। 

प्रलेखन मे शामिल होने के लिए:

1. [योगदानकर्ता समझौता लाइसेन्स ](https://github.com/kubernetes/community/blob/master/CLA.md)पर हस्ताक्षर करे । 
2. [प्रलेखन संग्रह ](https://github.com/kubernetes/website) 
   और वेबसाईट की [स्टैटिक साइट जनरेटर ](https://gohugo.io) से खुद को परिचित कर ले । 
3. इस बात की समीक्षा करे के आपको 
   [पुल रीक्वेस्ट करना ](/docs/contribute/new-content/open-a-pr/) और 
   [बदलाओ की समीक्षा ](/docs/contribute/review/reviewing-prs/) करना आता हो । 

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[PR ओपन करे]
direction TB
U[ ] -.-
Q[विषय सुधारे] --- N[विषय निर्माण करे]
N --- O[डॉक्स का अनुवाद करे]
O --- P[जो डॉक्स K8s release cycle <br> का हिस्सा है <br> उसे संचालित /प्रकाशित करे]

end

subgraph second[समीक्षा ]
direction TB
   T[ ] -.-
   D[K8s/website<br>भंडार गृह  को देखे ] --- E[हुगो स्टैटिक साइट<br>जनरेटर <br>को चेकाउट करे ]
   E --- F[मूलभूत गिटहब <br>आदेश को समझे]
   F --- G[ओपन pr की समीक्षा करे <br>और समीक्षा प्रक्रिया  <br>को बदले]
end

subgraph first[साइन अप करे]
    direction TB
    S[ ] -.-
    B[CNCF<br>Contributor<br>License Agreement <br> को साइन करे] --- C[sig-docs<br>स्लैक चैनल को जॉइन करे] 
    C --- V[kubernetes-sig-docs<br>mailing list को जॉइन करे]
    V --- M[साप्ताहिक <br>sig-docs calls<br>या स्लैक बैठक मे शामिल हो]
end

A([fa:fa-user New<br>Contributor]) --> first
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
***आकृति  - नए योगदानकर्ताओ के लिए योगदान शुरू करने का रास्ता***

ऊपर  दी गई आकर्ति नए योगदानकर्ता के लिए दिशानिर्देश'है।  साइन अप या समीक्षा के लिए आप इनमे से कुछ निर्देश या सभी निर्देश का पालन कर सकते है ।  अब आप PR करने के लिए तैयार है  जो आपके योगदान उद्देश को पूरा करे , उन मे से कुछ Open PR खंड मे है । एक बार फिर से आपके सभी प्रशनों का स्वागत है । 

कुबेरनेटेस  समुदाय मे कुछ काम मे ज्यादा विश्वास और एक्सेस की जरूरत पड़ती है। भूमिका और अनुमति के बारे मे ज्यादा जानकारी के लिए  
 [सिग डॉक्स मे भाग लेना ](/docs/contribute/participate/) को जरूर देखे । 

## आपका पहला योगदान 

आप अपने पहले योगदान की तैयारी के लिए दिए गए दिशानिर्देश को देख ले। नीचे दिया हुआ चित्र दिशानिर्देश और उसकी विस्तार मे जानकारी देता है। 

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[पहला योगदान]
    direction TB
    S[ ] -.-
    G[दूसरे K8s मेम्बर्स के <br> prs की समीक्षा करे] -->
    A[पहली अच्छी समस्या के लिए K8s/website<br>की समस्या सूची पर जाए ] --> B[pr ओपन करे!!]
    end
    subgraph first[सूचित तैयारी ]
    direction TB
       T[ ] -.-
       D[योगदान अवलोकन को पढे] -->E[K8s content<br>and style guide को पढे]
       E --> F[Hugo page<br>content types<br>और shortcodes के बारे मे जाने]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
***आकृति  - आपके पहले योगदान की तैयारी ***

- योगदान करने के विभिन्न तरीकों को जानने के लिए  [योगदानकर्ता अवलोकन](/docs/contribute/new-content/overview/) को पढे । 
- अच्छे प्रवेश बिन्दु के लिए  [`कुबेरनेटेस /वेबसाईट ` मुद्दा सूची ](https://github.com/kubernetes/website/issues/)
  को जाँचे । 
- [गिट हब का प्रयोग करते हुए पुल रीक्वेस्ट खोले  ](/docs/contribute/new-content/open-a-pr/#changes-using-github) पुराने प्रलेखन मे और मुद्दा को भरने की प्रक्रिया के बारे मे ज्यादा अच्छे से जाने । 
- भाषा  और ठीक तरीके से पुल रीक्वेस्ट के लिए  दूसरे कुबेरनेटेस समुदाय के सदस्यों के  [पुल रीक्वेस्ट की समीक्षा करे ](/docs/contribute/review/reviewing-prs/) । 
- कुबेरनेटेस  [प्रकरण ](/docs/contribute/style/content-guide/) और  
  [स्टाइल मार्गदर्शक](/docs/contribute/style/style-guide/) को पढे ताकि आप सूचित टिप्पणी दे सके। 
- [पेज प्रलेखन टाइप ](/docs/contribute/style/page-content-types/)
  और  [हुगो शॉर्टकोडेस ](/docs/contribute/style/hugo-shortcodes/) के बारे मे जाने। 

## अगला कदम 

-  कोड संग्रह मे  [लोकल क्लोन से काम करने ](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
 के बारे मे सीखे। 
- [रिलीज मे फीचर्स को ](/docs/contribute/new-content/new-features/) आलेख करे। 
- [सिग डॉक्स ](/docs/contribute/participate/) मे भाग ले  और
  [सदस्य या समीक्षक ](/docs/contribute/participate/roles-and-responsibilities/) बने। 
                       
- [स्थानीयकरण ](/docs/contribute/localization/) शुरू करे या उसमे सहायता करे। 

## सिग डॉक्स मे शामिल हो 

[सिग डॉक्स](/docs/contribute/participate/) योगदानकर्ताओ का एक समूह है जो कुबेरनेटेस प्रलेखन और वेबसाईट की देख रेख और उसे प्रकाशित करता है। सिग डॉक्स मे शामिल होना कुबेरनेटेस परियोजना मे बाद प्रभाव डालने का  कुबेरनेटेस योगदानकर्ताओ (महत्ववावपूर्ण लेख या उससे अन्यथा) के लिए बेहतरीन तरीका है । 

सिग डॉक्स भिन्न प्रकार से संवाद करते है :

- [#sig-docs को जॉइन करे  कुबेरनेटेस स्लैक चैनल मे](https://slack.k8s.io/) । खुद का परिचय देना सुनिश्चित करे। 
- [kubernetes-sig-docs` मैलिंग लिस्ट मे शामिल हो ](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  वहाँ व्यापक विचार-विमर्श होता है और आधिकारिक फैसले का अभिलेखन किया जाता है।
- [सिग डॉक्स विडिओ बैठक](https://github.com/kubernetes/community/tree/master/sig-docs) मे शामिल हो जो हर दो सप्ताह मे होती है। 
 बैठक की घोषणा हमेशा `#sig-docs पर की जाती है ` और  [कुबेरनेटेस समुदाय बैठक कैलंडर](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles) मे जोड़ दिया जाता है।  आपको [Zoom client](https://zoom.us/download) डाउनलोड करने की जरूरत पड़ेगी  या फोन की मदद से भी डायल कर सकते है। 
- जिन सप्ताह मे zoom बैठक नहीं हुई हो तब सिग डॉक्स अतुल्यकालिक बैठक को जॉइन करे जो स्लैक मे होती है।  बैठक की घोषणा हमेशा `#sig-docs`पर होती है। बैठक की घोषणा के बाद आप किसी भी सूत्र मे 24 घंटे तक योगदान कर सकते है।

## योगदान करने के अन्य तरीके 

- [कुबेरनेटेस समुदाय साइट](/community/) पर जाए।  ट्विटर या स्टैक ओवर्फ्लो मे भाग ले , कुबेरनेटेस आयोजन और मिलन के बारे मे जाने । 
- [योगदानकर्ता प्रवंचक पत्रक](https://www.kubernetes.dev/docs/contributor-cheatsheet/) को पढे ताकि आप कुबेरनेटेस माहत्वपूर्ण लेख के विकास मे शामिल हो सके। 
-[कुबेरनेटेस योगदानकर्ताओ ](https://www.kubernetes.dev/) और  [अतिरिक्त योगदानकर्ता साधन](https://www.kubernetes.dev/resources/) के बारे मे ज्यादा जानकारी के लिए योगदानकर्ता'साइट पर जाए। 
- [ब्लॉग पोस्ट या मामले का अध्ययन ](/docs/contribute/new-content/blogs-case-studies/) जमा करे। 
