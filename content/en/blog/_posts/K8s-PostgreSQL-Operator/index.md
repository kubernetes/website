---
layout: blog
title: K8s PostgreSQL Operator
date: 
slug: 
---


K8s PostgreSQL Operator
=======================

Allow us to introduce the PostgreSQL Operator, a tool designed to transform your database management experience.

![Pramodh Ayyappan](https://uploads-ssl.webflow.com/62566ffa5e87f6550e8578bc/64c02246a4ed63e4844fd19b_pramodh.png)

Pramodh Ayyappan
----------------

July 27, 2023

In our Kubernetes-centric world, certain tasks still fall outside the scope of Kubernetes, leading to a disjointed experience. Traditional methods often lack the automation and consistency that we have come to expect. One such task that highlights this challenge is managing database credentials. As we delved deeper into this challenge, we realized that database credentials need to be a part of the K8s fold. Allow us to introduce the PostgreSQL Operator, a tool designed to transform your database management experience.

**How does it work?**
=====================

The PostgreSQL Operator introduces two Custom Resource Definitions (CRDs) - Role and Grant. The Role CRD is used to define a database user while the Grant CRD is used to specify the privileges and permissions granted to the user on database. The operator then automates the creation and management of these roles and grants in the PostgreSQL database. By leveraging the power of Kubernetes reconciliation loops, the operator ensures that the actual state of the system always matches the desired state, providing a reliable and consistent database user management experience.

**Advantages**
==============

The PostgreSQL Operator brings two significant advantages to the table - it empowers developers and abstracts complex PostgreSQL tasks.

**Developer empowerment**

Traditionally, managing database credentials and permissions has often required a central team acting as gatekeepers, resulting in slow and inefficient processes that create bottlenecks in the workflow. The PostgreSQL Operator revolutionizes this process by granting developers the autonomy to define roles and permissions using the Role and Grant CRDs. This reversal of control means that instead of a central team managing the database, developers can write a manifest, get it approved, and seamlessly move it along a CI pipeline to create users. This democratization of the process significantly speeds up workflows and enhances overall efficiency.

‍

**Simplifies PostgreSQL tasks**

On the other hand, the PostgreSQL Operator also simplifies complex PostgreSQL tasks. Take managing users and teams for instance, each may require varying levels of access to various tables within PostgreSQL schema. It is a complex task involving intricate SQL queries to setup and maintain fine-grained access control.

With the PostgreSQL Operator, you can easily define such permissions in a Grant CRD, which the operator then translates into the appropriate SQL commands. This abstraction of complex tasks ensures that permissions are always up-to-date, thanks to the power of Kubernetes reconciliation loops.

In essence, the PostgreSQL Operator not only empowers developers by democratizing the process of managing database credentials but also simplifies complex PostgreSQL tasks, making the management of PostgreSQL databases more efficient and inclusive.

**Installation**
----------------

**1\. Pre-requisite:** A Kubernetes secret that contains base64 encrypted PostgreSQL Database details, such as username, password, endpoint, port, database and role\_password .

.language-json { max-width: 781px; height:auto; white-space: pre-wrap !important; } .pre-json { max-width: 781px; height:auto; white-space: pre-wrap !important; } .code-block { font-size: 12px; height:200px; line-height:24px; white-space: pre-wrap !important; } @media only screen and (max-width: 768px) { .code-block { font-size: 10px; white-space: pre-wrap !important; display: flex; } }

    kubectl create secret generic "secret_name" --from-literal=username="postgresql_username" --from-literal=password="postgresql_password" --from-literal=endpoint="postgresql_endpoint" --from-literal=port="postgresql_port" --from-literal=database="postgresql_database" --from-literal=role_password="postgresql_role_password"

**2\. Install the Helm Chart**: To begin using the PostgreSQL Operator, start by installing the Helm chart provided in the official repository. You can find the chart at the following GitHub URL: [https://github.com/Facets-cloud/postgresql-operator/tree/main/chart](https://github.com/Facets-cloud/postgresql-operator/tree/main/chart).

.code-block { font-size: 12px; line-height:18px; white-space: pre-wrap; height:auto; /\* Add the following lines to reset padding and margin \*/ padding: 0; margin: 0; } @media only screen and (max-width: 768px) { .code-block { font-size: 10px; white-space: normal; display: inline-block; } .language-json { white-space: normal !important; word-spacing: normal !important; word-break: break-all !important; word-wrap: break-word !important; } }

     helm install pg-operator ./chart/postgresql-operator

**3\. Create CRDs for Roles and Grants**:Once the Helm chart is successfully installed, you need to create a Custom Resource to define the desired roles and grants for PostgreSQL. The PostgreSQL Operator repository provides examples for creating custom resources. Here are a couple of examples:

*   Role Example - [https://github.com/Facets-cloud/postgresql-operator/blob/main/examples/role.yaml](https://github.com/Facets-cloud/postgresql-operator/blob/main/examples/role.yaml)
*   Grant Example - [https://github.com/Facets-cloud/postgresql-operator/blob/main/examples/table-grant-all-table-all-privilege.yaml](https://github.com/Facets-cloud/postgresql-operator/blob/main/examples/table-grant-all-table-all-privilege.yaml).

You can explore more examples under the examples directory in the PostgreSQL Operator repository.

**4\. Check Role and Grant Status**

After creating custom resources, you can verify the status of the roles and grants using kubectl commands. Run the following commands:

a. To check the status of roles:

.code-block { font-size: 12px; line-height:18px; white-space: pre-wrap; height:auto; /\* Add the following lines to reset padding and margin \*/ padding: 0; margin: 0; } @media only screen and (max-width: 768px) { .code-block { font-size: 10px; white-space: normal; display: inline-block; } .language-json { white-space: normal !important; word-spacing: normal !important; word-break: break-all !important; word-wrap: break-word !important; } }

    kubectl get roles.postgresql.facets.cloud -o wide

*   This command provides an overview of the defined roles and their current status within the PostgreSQL cluster.

b. To check the status of grants:

.code-block { font-size: 12px; white-space: pre-wrap; } @media only screen and (max-width: 768px) { .code-block { font-size: 10px; white-space: normal; display: inline-block; } .language-json { white-space: normal !important; word-spacing: normal !important; word-break: break-all !important; word-wrap: break-word !important; } .pre-json { max-width: 100%; margin-right: 35px; white-space: pre-wrap !important; } }

    kubectl get grants.postgresql.facets.cloud -o wide

*   This command provides an overview of the defined grants and their current status within the PostgreSQL cluster.

By checking the role and grant status, you can ensure that the desired state specified in the CRDs is being applied correctly within the PostgreSQL cluster.

**Demo**
--------

A quick demo on deployment of PostgreSQL Operator, creation of Role and Grant

![](https://uploads-ssl.webflow.com/62566ffa5e87f6550e8578bc/64c0d9071079283f42de7ad6_demo.gif)

**Before you go**
=================

Give the [PostgreSQL Operator](https://github.com/Facets-cloud/postgresql-operator) a try today and experience the revolution in database management. We welcome contributions, so join us in enhancing this tool and shaping the future of PostgreSQL management.
