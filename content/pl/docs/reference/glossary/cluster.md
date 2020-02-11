---
title: Klaster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   Zestaw maszyn, nazywanych węzłami, na których uruchamiane są aplikacje zarządzane przez Kubernetes. Klaster posiada przynajmniej jeden węzeł roboczy (*node*) i jeden węzeł typu master (*master node*).

aka: 
tags:
- fundamental
- operation
---
Zestaw maszyn, nazywanych węzłami, na których uruchamiane są aplikacje zarządzane przez Kubernetes. Klaster posiada przynajmniej jeden węzeł roboczy (*node*) i jeden węzeł typu master (*master node*).

<!--more-->
Na węźle (lub węzłach) roboczych rozmieszczane są pody, które są częściami składowymi aplikacji. Węzeł (lub węzły) typu master zarządzają węzłami roboczymi i podami należącymi do klastra. Zwielokrotnione węzły typu master zapewniają większą niezawodność i odporność klastra na awarie.
