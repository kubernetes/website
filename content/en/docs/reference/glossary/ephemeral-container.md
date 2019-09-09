---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  A type of container type that you can temporarily run inside a Pod

aka:
tags:
- fundamental
---
A {{< glossary_tooltip term_id="container" >}} type that you can temporarily run inside a {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

If you want to investigate a Pod that's running with problems, you can add an ephemeral container to that Pod and carry out diagnostics. Ephemeral containers have no resource or scheduling guarantees, and you should not use them to run any part of the workload itself.

