---
title: PersistentVolumeClaim
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  PersistentVolume में परिभाषित स्टोरेज संसाधनों का दावा करता है ताकि इसे एक कंटेनर में वॉल्यूम के रूप में माउंट किया जा सके।
aka: 
tags:
- core-object
- storage
---
{{<glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}} में परिभाषित स्टोरेज संसाधनों का दावा करता है ताकि इसे एक {{<glossary_tooltip text="कंटेनर" term_id="container" >}} में वॉल्यूम के रूप में माउंट किया जा सके।

<!--more--> 

स्टोरेज की मात्रा निर्दिष्ट करता है, स्टोरेज को कैसे एक्सेस किया जाएगा (केवल पढ़ने के लिए, पढ़ने के लिए और/या विशेष) और इसे कैसे पुनः प्राप्त किया जाएगा (बरकरार रखा जाएगा, पुनर्चक्रित किया जाएगा या हटाया जाएगा)। स्टोरेज का विवरण PersistentVolume ऑब्जेक्ट में वर्णित है।