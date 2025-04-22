---
title: Rozszerzanie API Kubernetesa
weight: 30
---

Niestandardowe zasoby Kubernetesa (ang. Custom Resources) stanowią rozszerzenie API. Kubernetes udostępnia dwie metody ich integracji z klastrem:

- Mechanizm [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  (CRD) pozwala deklaratywnie zdefiniować nowe niestandardowe API z
  grupą API, rodzajem i schematem, który określisz. Warstwa sterowania Kubernetesa
  obsługuje i zarządza przechowywaniem twojego niestandardowego zasobu. CRD pozwalają tworzyć
  nowe typy zasobów dla twojego klastra bez pisania i uruchamiania niestandardowego serwera API.
- [Warstwa agregacji](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  znajduje się za głównym
  serwerem API, który działa jako proxy. To rozwiązanie nazywa się
  Agregacją API (AA), które umożliwia dostarczanie implementacji dla
  własnych niestandardowych zasobów poprzez napisanie i
  wdrożenie własnego serwera API. Główny serwer API deleguje
  żądania do twojego serwera API, udostępniając je wszystkim jego klientom.
