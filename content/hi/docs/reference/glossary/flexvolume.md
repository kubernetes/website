---
title: FlexVolume
id: flexvolume
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume आउट-ऑफ़-ट्री वॉल्यूम प्लगइन्स बनाने के लिए एक अप्रचलित इंटरफ़ेस है। कंटेनर स्टोरेज इंटरफ़ेस एक नया इंटरफ़ेस है जो FlexVolume के साथ कई समस्याओं का समाधान करता है।
aka: 
tags:
- storage 
---
 FlexVolume आउट-ऑफ़-ट्री वॉल्यूम प्लगइन्स बनाने के लिए एक अप्रचलित इंटरफ़ेस है। {{<glossary_tooltip text="कंटेनर स्टोरेज" term_id="csi">}} इंटरफ़ेस एक नया इंटरफ़ेस है जो FlexVolume के साथ कई समस्याओं का समाधान करता है।

<!--more--> 

FlexVolumes उपयोगकर्ताओं को अपने स्वयं के ड्राइवर लिखने और Kubernetes में अपने वॉल्यूम के लिए समर्थन जोड़ने में सक्षम बनाता है। FlexVolume ड्राइवर बायनेरिज़ और निर्भरताएँ होस्ट मशीनों पर स्थापित की जानी चाहिए। इसके लिए रूट एक्सेस की आवश्यकता है। स्टोरेज एसआईजी यदि संभव हो तो कंटेनर स्टोरेज इंटरफेस ड्राइवर को लागू करने का सुझाव देता है क्योंकि यह फ्लेक्सवॉल्यूम की सीमाओं को संबोधित करता है।

* [FlexVolume in the Kubernetes documentation](/docs/concepts/storage/volumes/#flexvolume)
* [More information on FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)