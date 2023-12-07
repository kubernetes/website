---
title: जॉब (Job)
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  एक परिमित या बैच कार्य जो पूरा होने तक चलता है।

aka: 
tags:
- fundamental
- core-object
- workload
---
 एक परिमित या बैच कार्य जो पूरा होने तक चलता है।

<!--more--> 

जॉब एक या अधिक {{<glossary_tooltip text="पॉड" term_id="pod" >}} ऑब्जेक्ट बनाता है और सुनिश्चित करता है कि उनमें से एक निर्दिष्ट संख्या सफलतापूर्वक समाप्त हो जाए। जैसे ही पॉड्स सफलतापूर्वक पूर्ण होते हैं, जॉब उस सफल समापन को ट्रैक करता है।