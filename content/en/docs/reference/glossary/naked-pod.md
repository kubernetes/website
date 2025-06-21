---
title: Naked Pod
id: naked-pod
date: 2025-06-11
full_link: /docs/concepts/configuration/overview/
short_description: >
  A Pod that is not managed by a higher-level controller.

aka: 
tags:
- core-object
- fundamental
---
 A {{< glossary_tooltip text="pod" term_id="pod" >}} that **is not managed** by a higher-level controller such as {{< glossary_tooltip text="Deployment" term_id="deployment" >}},{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} or {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.

<!--more--> 

Naked Pods will not be rescheduled in the event of a node failure.

