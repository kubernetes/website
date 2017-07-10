---
title: Pull an Image from Amazon EC2 Container Registry
---

{% capture overview %}

If you choose ECR as your private registry, we recommend that you run your cluster on AWS. The following information documents only this scenario.

NOTE: If you create your cluster by using the *Quick Start for Kubernetes by Heptio*, the appropriate policies and roles are created as part of the cluster. Solutions such as Kubernetes Operations (`kops`), `kube-aws`, and others also configure the necessary policies and roles automatically. You provide the following information manually only if you create a custom Kubernetes solution.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## ECR with AWS managed IAM policy

The simplest approach is to use the managed IAM policy that AWS provides: `AmazonEC2ContainerRegistryReadOnly`.

First, find the IAM role for each node in your cluster. Your nodes can share a single role, or you can assign different roles to different nodes or sets of nodes.

WARNING: Make sure to attach the appropriate role to each instance before you start the instance. You cannot attach a role to a running instance. You can, however, modify a role that is already attached to an instance.

Then run the following command for each role:

```bash
    aws iam attach-role-policy \
      --role-name <role-name> \
      --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
```

where `<role-name>` is the name of the AWS IAM role.

## ECR roles and policies defined in Kubernetes configuration

Or you can create the IAM policy, attach the policy to the appropriate role, and attach the role to the node instances in your Kubernetes configuration file.

Here's how to define the role in a CloudFormation template written in YAML:

```yaml
    # IAM role for nodes http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
    NodeRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          Version: '2012-10-17'
          Statement:
          - Effect: Allow
            Principal:
              Service:
              - ec2.amazonaws.com
            Action:
            - sts:AssumeRole
        Path: "/"
        # IAM policy for nodes that allows specific AWS resource listing and creation
        # http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
        Policies:
        - PolicyName: node
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
            - Effect: Allow
              Action:
              # we do need all the following permissions for the registry
              - ecr:GetAuthorizationToken
              - ecr:BatchCheckLayerAvailability
              - ecr:GetDownloadUrlForLayer
              - ecr:GetRepositoryPolicy
              - ecr:DescribeRepositories
              - ecr:ListImages
              - ecr:BatchGetImage
              Resource: "*"
``` 

After the IAM role is attached to the node, the kubelet on the node takes care of fetching and refreshing ECR credentials.

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn more about
[using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* See [Pull an Image from a Private Docker Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
* See [Pull an Image from Google Cloud Registry](/docs/tasks/configure-pod-container/pull-image-gcr).
* See [Secret](/docs/api-reference/v1.6/#secret-v1-core).
* See the `imagePullSecrets` field of
[PodSpec](/docs/api-reference/v1.6/#podspec-v1-core).

{% endcapture %}

{% include templates/task.md %}
