---
title: Container-Umgebungsvariablen
id: container-env-variables
date: 2024-10-10
full_link: /docs/concepts/containers/container-environment/
short_description: >
  Container-Umgebungsvariablen sind Name=Wert-Paare, die nützliche Informationen für Container bereitstellen, die in einem Pod ausgeführt werden.

aka: 
tags:
- fundamental
---
  Container-Umgebungsvariablen sind Name=Wert-Paare, die nützliche Informationen für Container bereitstellen, die in einem {{< glossary_tooltip text="Pod" term_id="pod" >}} ausgeführt werden.
  
<!--more-->

Container-Umgebungsvariablen liefern Informationen, die von den laufenden containerisierten Anwendungen benötigt werden, sowie Informationen über wichtige Ressourcen für die {{< glossary_tooltip text="Container" term_id="container" >}}. Zum Beispiel Dateisystemdetails, Informationen über den Container selbst und andere Cluster-Ressourcen wie Service-Endpunkte.
