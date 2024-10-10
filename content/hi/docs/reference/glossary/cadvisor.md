---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Tool that provides understanding of the resource usage and performance characteristics for containers
aka:
tags:
- tool
---
cAdvisor (Container Advisor) provides container users an understanding of the resource usage and performance characteristics of their running {{< glossary_tooltip text="containers" term_id="container" >}}.

<!--more-->

It is a running daemon that collects, aggregates, processes, and exports information about running containers. Specifically, for each container it keeps resource isolation parameters, historical resource usage, histograms of complete historical resource usage and network statistics. This data is exported by container and machine-wide.
