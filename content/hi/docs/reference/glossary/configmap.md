---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-pod-configmap/
short_description: >
  An API object used to store non-confidential data in key-value pairs. Can be consumed as environment variables, command-line arguments, or config files in a volume.

aka: 
tags:
- core-object
---
 An API object used to store non-confidential data in key-value pairs. Can be consumed as environment variables, command-line arguments, or config files in a {{< glossary_tooltip text="volume" term_id="volume" >}}.

<!--more--> 

Allows you to decouple environment-specific configuration from your {{< glossary_tooltip text="container images" term_id="container" >}}, so that your applications are easily portable. When storing confidential data use a [Secret](/docs/concepts/configuration/secret/).
