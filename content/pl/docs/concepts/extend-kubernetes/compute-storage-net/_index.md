---
title: Rozszerzenia obliczeniowe, przechowywania danych i sieciowe
weight: 30
no_list: true
---

Ta sekcja obejmuje rozszerzenia do Twojego klastra, które nie
są częścią samego Kubernetesa. Możesz użyć tych rozszerzeń,
aby ulepszyć węzły w Twoim klastrze lub zapewnić sieć łączącą Pody.

* Wtyczki pamięci masowej [CSI](/docs/concepts/storage/volumes/#csi) i [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)

  Wtyczki {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI)
  dostarczają sposób na rozszerzenie Kubernetesa o wsparcie dla nowych rodzajów wolumenów. Wolumeny
  mogą być wspierane przez trwałe zewnętrzne systemy przechowywania, mogą dostarczać pamięć
  ulotną, lub mogą oferować interfejs tylko do odczytu dla informacji przy użyciu paradygmatu systemu plików.

  Kubernetes zawiera również wsparcie dla wtyczek
  [FlexVolume](/docs/concepts/storage/volumes/#flexvolume), które są przestarzałe od Kubernetesa v1.23 (na rzecz CSI).

  Wtyczki FlexVolume pozwalają użytkownikom montować typy woluminów, które nie są
  natywnie obsługiwane przez Kubernetesa. Gdy uruchamiasz Pod, który polega na
  przechowywaniu FlexVolume, "kubelet" wywołuje binarną wtyczkę, aby zamontować wolumin.
  Zarchiwizowany [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  dokument projektowy zawiera więcej szczegółów na temat tego podejścia.

  [FAQ dotyczące wtyczek wolumenów Kubernetesa dla dostawców pamięci masowej](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  zawiera ogólne informacje na temat wtyczek pamięci masowej.

* [Wtyczki urządzeń](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Wtyczki urządzeń umożliwiają węzłowi odkrywanie nowych funkcji węzła
  (dodatkowo do wbudowanych zasobów węzła, takich jak `cpu` i `memory`), oraz
  udostępniają te niestandardowe funkcje lokalne węzła dla Podów, które ich żądają.

* [Wtyczki sieciowe](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  Pluginy sieciowe umożliwiają Kubernetesowi działanie z różnymi topologiami i
  technologiami sieciowymi. Twój klaster Kubernetes potrzebuje _pluginu sieciowego_,
  aby mieć działającą sieć Pod i wspierać inne aspekty modelu sieciowego Kubernetesa.

  Kubernetes {{< skew currentVersion >}} jest kompatybilny z
  wtyczkami sieciowymi {{< glossary_tooltip text="CNI" term_id="cni" >}}.

