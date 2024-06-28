---
title: टेंट
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  एक मुख्य वस्तु जिसमें तीन आवश्यक गुण होते हैं: कुंजी, मूल्य और प्रभाव। टेंट्स नोड्स या नोड समूहों पर पॉड्स के शेड्यूलिंग को रोकते हैं।
aka: Taint
tags:
- core-object
- fundamental
---
एक मुख्य वस्तु जिसमें तीन आवश्यक गुण होते हैं: कुंजी, मूल्य और प्रभाव। टेंट्स {{<glossary_tooltip text="नोड्स" term_id="node" >}} या नोड समूहों पर {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} के शेड्यूलिंग को रोकते हैं।

<!--more-->

टेंट और {{<glossary_tooltip text="टोलेरशन" term_id="toleration" >}} यह सुनिश्चित करने के लिए एक साथ काम करते हैं कि पॉड्स अनुपयुक्त नोड्स पर शेड्यूल नहीं किए गए हैं। एक नोड पर एक या अधिक टेंट लगाए जाते हैं। एक नोड को केवल कॉन्फ़िगर किए गए टेंट के लिए मिलान टोलेरशन के साथ एक पॉड शेड्यूल करना चाहिए।