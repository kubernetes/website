---
title: Security Context
id: security-context
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  The securityContext field defines privilege and access control settings for a Pod or Container, including the runtime UID and GID.

aka: 
tags:
- security
---
 The securityContext field defines privilege and access control settings for a Pod or Container, including the runtime UID and GID.

<!--more--> 

The securityContext field in a {{< glossary_tooltip term_id="pod" >}} (applying to all containers) or container is used to set the user, groups, capabilities, privilege settings, and security policies (SELinux/AppArmor/Seccomp) and more that container processes use.
