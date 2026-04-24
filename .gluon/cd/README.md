# NodeJS Helm Chart

Base Helm Chart to use as dependency in Darwin NodeJS microservices.


This Helm Chart was tested with

```bash
❯ helm version
version.BuildInfo{
  Version:"v3.6.0",
  GitCommit:"7f2df6467771a75f5646b7f12afb408590ed1755",
  GitTreeState:"clean",
  GoVersion:"go1.16.3"
}
```

and OpenShift:

```bash
❯ oc version
oc v3.11.0+0cbc58b
kubernetes v1.11.0+d4cacc0
```

Main References:

- [Helm - The package manager for Kubernetes](https://helm.sh/)
- [Helm - Getting Started](https://helm.sh/docs/chart_template_guide/getting_started/)
- [Helm Version Support Policy](https://helm.sh/docs/topics/version_skew/)
- [Helm Commands](https://helm.sh/docs/helm/)
- [Darwin - NodeJS Framework](https://sanes.atlassian.net/wiki/spaces/NARQREF/pages/14677938255/5.3.4.-+Darwin+NodeJS+Framework)

## Mandatory Parameters

These parameters have to be defined in the values.yaml of the Helm Chart that uses this.

| Name                 | Description                                                                                     | Value                          |
| -------------------- | ------------------------------------------------------------------------------------------------| -------------------------------|
| `image.registry`     | Path to images registry, eg: registry.global.ccc.srvb.bo.paas.cloudcenter.corp                  | `""`                           |
| `image.repository`   | Path to image                                                                                   | `""`                           |
| `image.tag`          | Image tag                                                                                       | `""`                           |
| `darwin.technologyVersion`| Nodejs version used ```18, 20```                                                           | `""`                           |

## Image parameters

| Name                     | Description                                                                                     | Value                       |
|--------------------------|-------------------------------------------------------------------------------------------------|-----------------------------|
| `image.registry`         | Path to images registry, eg: registry.global.ccc.srvb.bo.paas.cloudcenter.corp                  | `""`                        |
| `image.repository`       | Path to image                                                                                   | `""`                        |
| `image.tag`              | Image tag                                                                                       | `""`                        |
| `image.digest`           | image digest in the way sha256:aa.... Please note this parameter, if set, will override the tag | `"1.0.0"`                   |
| `image.pullPolicy`       | image pull policy                                                                               | `IfNotPresent`              |

## Deployment parameters

| Name                                 | Description                                                                                                                                                                                | Value                 |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| `nameOverride`                       | String to partially override common.names.fullname template (will maintain the release name)                                                                                               | `""`                  |
| `fullnameOverride`                   | String to fully override common.names.fullname template                                                                                                                                    | `""`                  |
| `active`                             | Indicates if service is online or offline                                                                                                                                                  | `{"online,"offline"}` |
| `commonLabels`                       | Labels to add to all deployed objects                                                                                                                                                      | `{}`                  |
| `commonAnnotations`                  | Annotations to add to all deployed objects                                                                                                                                                 | `{}`                  |
| `podLabels`                          | Additional pod labels                                                                                                                                                                      | `{}`                  |
| `podAnnotations`                     | Additional pod annotations                                                                                                                                                                 | `{}`                  |
| `replicaCount`                       | Configure replica count                                                                                                                                                                    | `1`                   |
| `lifecycle`                          | Override default container hooks. The default value is:  `{lifecycle: {preStop: {exec: {command: [sleep 120]}}}}`                                                                          | `{}`                  |
| `podSecurityContext.enabled`         | Enable pods' Security Context                                                                                                                                                              | `false`               |
| `containerSecurityContext.enabled`   | Enable containers' Security Context                                                                                                                                                        | `false`               |
| `podNodeSelector.enabled`            | Enable pods' Node Selector                                                                                                                                                                 | `false`               |
| `resources.limits`                   | Define Resource limits                                                                                                                                                                     | `{}`                  |
| `resources.limits.memory`            | Define memory limit                                                                                                                                                                        | `2G`                  |
| `resources.limits.cpu`               | Define cpu limit                                                                                                                                                                           | `1000m`               |
| `resources.requests`                 | Define Resource requests                                                                                                                                                                   | `{}`                  |
| `resources.requests.memory`          | Define memory request                                                                                                                                                                      | `1G`                  |
| `resources.requests.cpu`             | Define cpu request                                                                                                                                                                         | `200m`                |
| `containerPorts.http`                | Port HTTP to expose at container level                                                                                                                                                     | `8080`                |
| `containerPorts.https`               | Port HTTPS to expose at container level                                                                                                                                                    | `8443`                |
| `extraContainerPorts`                | Array of additional container ports for the container                                                                                                                                      | `{}`                  |
| `livenessProbe.enabled`              | Enable livenessProbe                                                                                                                                                                       | `true`                |
| `livenessProbe.initialDelaySeconds`  | Initial delay seconds for livenessProbe                                                                                                                                                    | `200`                 |
| `livenessProbe.periodSeconds`        | Period seconds for livenessProbe                                                                                                                                                           | `10`                  |
| `livenessProbe.timeoutSeconds`       | Timeout seconds for livenessProbe                                                                                                                                                          | `1`                   |
| `livenessProbe.failureThreshold`     | Failure threshold for livenessProbe                                                                                                                                                        | `3`                   |
| `livenessProbe.successThreshold`     | Success threshold for livenessProbe                                                                                                                                                        | `1`                   |
| `readinessProbe.enabled`             | Enable readinessProbe                                                                                                                                                                      | `true`                |
| `readinessProbe.initialDelaySeconds` | Initial delay seconds for readinessProbe                                                                                                                                                   | `15`                  |
| `readinessProbe.periodSeconds`       | Period seconds for readinessProbe                                                                                                                                                          | `10`                  |
| `readinessProbe.timeoutSeconds`      | Timeout seconds for readinessProbe                                                                                                                                                         | `1`                   |
| `readinessProbe.failureThreshold`    | Failure threshold for readinessProbe                                                                                                                                                       | `3`                   |
| `readinessProbe.successThreshold`    | Success threshold for readinessProbe                                                                                                                                                       | `1`                   |
| `terminationGracePeriodSeconds`      | Seconds the pod needs to gracefully terminate                                                                                                                                              | `"300"`               |
| `customLivenessProbe`                | Override default liveness probe                                                                                                                                                            | `{}`                  |
| `customReadinessProbe`               | Override default readiness probe                                                                                                                                                           | `{}`                  |
| `extraEnvVars`                       | Extra environment variables to be set on Node container. It overrides any environment variables specified in the container image.                                                          | `[]`                  |
| `extraEnvVarsCM`                     | Name of existing ConfigMap containing extra environment variables. It creates a "envFrom.configMapRef" attribute. It overrides any environment variables specified in the container image. | `""`                  |
| `extraEnvVarsSecret`                 | Name of existing Secret containing extra environment variables. It creates a "envFrom.secretRef" attribute. It overrides any environment variables specified in the container image.       | `""`                  |
| `extraVolumes`                       | Optionally specify extra list of additional volume for the container(s).                                                                                                                   | `[]`                  |
| `extraVolumeMounts`                  | Optionally specify extra list of additional volumeMounts for the container(s).                                                                                                             | `[]`                  |
| `initContainers`                     | Add additional init containers to the pods                                                                                                                                                 | `{}`                  |
| `updateStrategy.type`                | Deployment update strategy                                                                                                                                                                 | `RollingUpdate`       |
| `updateStrategy.rollingUpdate`       | Deployment rolling update configuration parameters                                                                                                                                         | `{}`                  |

## Darwin parameters

| Name                                       | Description                                              | Value                |
|--------------------------------------------|----------------------------------------------------------|----------------------|
| `darwin`                                   | Define framework specific settings                       | `{}`                 |
| `darwin.version`                           | Darwin Framework Version. eg values `3.0.4, 2.1.0`       | `""`  |
| `darwin.gitRepo`                           | Git repository with the source code of the microservice, eg `"https://github.alm.europe.cloudcenter.corp/sanes-darwin-poc/poc-certificates.git"` | `""`  |
| `darwin.technologyVersion`                 | Nodejs version of the image. Possible values `{16, 18}` | `""`  |
| `darwin.region`                            | Cluster identifier. Possible values `{"","bo1","bo2","weu1.az","weu2.az"}`      | `""`  |
| `darwin.suffix`                            | Suffix to blue green deployments                         |   `{"","-b","-g}`    |
| `darwin.logging_level_root`                | Root Logging Level                                       | `"INFO"`             |
| `darwin.tz`                                | TimeZone for the running containers                      | `"Europe/Madrid"`    |
| `darwin.config`                            | Define config service specific settings                  | `{}`                 |
| `darwin.config.type`                              | Use to configure the configmaps and secrets. Possible values `{"cm,"secret", "cm-secret", "none"}` | `cm-secret` |
| `darwin.config.overrideConfigMapName`      | Allows to overwrite the name of the ConfigMap that contains the configuration. | `""`                 |
| `darwin.config.overrideSecretName`         | Allows to overwrite the name of the Secret that contains the configuration. | `""`                 |
| `darwin.nodejs`                            | Define Node framework specific settings                  | `{}`                 |
| `darwin.nodejs.env`                        | Profiles, eg values {dev,pre,pro}                        |      `DEV`           |
| `darwin.nodejs.security.pkm.uri`                  |Values for security module                             |     `https://srvnuarintra.santander.dev.corp/pkm/v1/publicKey/` |
| `darwin.nodejs.logger.kafka.host`                 | Values for logger module                              |     `sanlcckfbrd0008.santander.dev.corp:9094,sanlcckfbrd0009.santander.dev.corp:9094,sanlcckfbrd0010.santander.dev.corp:9094,sanlcckfbrd0011.santander.dev.corp:9094` |
| `darwin.i18n`                                     | Internationalization feature for the application. |     `{}`           |
| `darwin.i18n.enabled`                             | Enable or disable the Internationalization feature. |     `false`        |
| `darwin.i18n.path`                                | Allows to change the path of the i18n files. |     `/etc/i18n/locales`        |
| `darwin.i18n.overrideConfigMapName`               | Allows to override the name of the ConfigMap that contains the i18n files. |     `""`        |

## Traffic exposure parameters

| Name                       | Description                            | Value       |
|----------------------------|----------------------------------------|-------------|
| `service`                   | Define service parameters             |    `{}`      |
| `service.type`             | Kubernetes Service type                | `ClusterIP` |
| `service.ports.http`       | http port                              | `8080`      |
| `service.ports.https`      | https port                             | `8443`      |
| `service.targetPort.http`  | targetPort http port                   | `8080`      |
| `service.targetPort.https` | targetPort https port                  | `8443`      |
| `service.annotations`      | Additional annotations for the service | `{}`        |
| `overrideServiceName`      | Override the service name              | `""`        |

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

### To 2.4.0

- We fix volumeMounts and volumes indentation.
- We update the .helmignore file.
- We update the the common library dependency to a new version and a new repository.
- We add the **service.overrideServiceName** property to allow to override the service name.
- We remove the **darwin.configType** property and add the **darwin.config.type** property to allow to configure the configmaps and secrets. Possible values are: **cm**, **secret**, **cm-secret** and **none**. We mantain the backward compatibility.
- We add the **darwin.config.overrideConfigMapName** property to allow to overwrite the name of the ConfigMap that contains the configuration.
- We add the **darwin.config.overrideSecretName** property to allow to overwrite the name of the Secret that contains the configuration.
- We add the **darwin.i18n** property to allow to configure the Internationalization feature for the application.
- We add the **darwin.i18n.enabled** property to enable or disable the Internationalization feature.
- We add the **darwin.i18n.path** property to allow to change the path of the i18n files.
- We add the **darwin.i18n.overwriteConfigMapName** property to allow to overwrite the name of the ConfigMap that contains the i18n files.

### To 2.3.0

- New property **podNodeSelector** that allows to indicate a node selector for the pod. This property is disabled by default. [doc](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)

### To 2.1.0

- We remove **kubeVersion** from the Chart.yaml file.

### To 2.1.0
- We remove **kubeVersion** from the Chart.yaml file.

### To 2.0.1
- We update the Chart Documentation
- We set configserver as default value for darwin.configType
- We include unitary test for the chart in golang.
- We remove NodeJS version 14 from the chart.
- We include NodeJS version 18 in the chart.

### To 2.0.0

- New **service.annotations** property to be able to add annotations to the service.
- The labels property is renamed to commonLabels.
- The annotations property is renamed to commonAnnotations.
- New attribute **extraVolumes**. specify extra list of additional volumeMounts for the container(s). [doc](https://kubernetes.io/docs/concepts/storage/volumes/)
- New attribute **extraVolumeMounts**. specify extra list of additional volumeMounts for the container(s). [doc](https://kubernetes.io/docs/concepts/storage/volumes/)
- New attribute **extraEnvVarsSecret**. It allow us to create a **"envFrom.configMapRef"** attribute [doc](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
- These new attributes overrides any environment variables specified in the container image.
- New attribute **extraEnvVars**. It allow us to add extra environment variables to be set on Node container
- New attribute **extraEnvVars**. It allow us to add extra environment variables to be set on Node container
- New property image.registry to indicate the registry where the image should be searched for.
- New property image.digest to select an image by the digest instead of by the tag.
- New extraContainerPorts property to be able to add other ports to the container.
- New properties livenessProbe.enabled and readinessProbe.enabled to enable/disable liveness/readiness probes.
- New properties customLivenessProbe and customReadinessProbe to override the default liveness/readiness probes that are invocations to the /actuator/health/readiness and /actuator/health/liveness endpoints on the http/https port.endpoints on the http/https port.
- New initContainers property for add additional init containers to the Controller pods.
- Allow Configuration based on Spring Cloud Config or ConfigMap. Additional we can use secrets.
- All reusable helm chart functions are removed in order to use the new 'common' library that provides all the functionality common to Darwin charts.
- The property **version** has been renamed to **darwin.technologyVersion**.
- Now, it is mandatory to define a value for the properties: **darwin.version**, **darwin.gitRepo** and **darwin.technologyVersion**. These values are propagated to the following deployment labels:
  - **santander.com/technology-version** from **darwin.technologyVersion** value.
  - **santander.com/git-host**, **santander.com/git-org** and **santander.com/git-repo** from **darwin.gitRepo** value.
  - **santander.com/darwin-version** from **darwin.version** value.
- The **name** property is removed from the **values.yaml** file because it is redundant. Now:
  - The name of the kubernetes resources will be created from the **common.names.fullname**.
  - The name of the container will be **.Release.Name**.
  - The environment variable APP_NAME shall have a value of **.Release.Name**.
- New property **podSecurityContext** that allows to indicate a security context for the pod.
- The **securityContext** property is renamed to **containerSecurityContext**.
- Now the lifecycle hooks can be customized using **lifecycle** property.
- The property **lifecycle.terminationGracePeriodSeconds** has been renamed to **terminationGracePeriodSeconds**.
- Migration from DeploymentConfig to Deployment.
  - NOTE: From this major release onwards this helm chart will deploy microservices via **Deployment** instead of **DeploymentConfig** so **ReplicaSet** will be created instead of **ReplicationController**. If you upgrade an application that has previously been deployed with previous versions of this helm chart, helm will automatically upgrade, i.e. it will remove the existing **DeploymentConfig** and **ReplicationController** resources and create the equivalent **Deployment** and **ReplicationSet**. If you are using this helm chart for the first time on an already deployed application, you will have to delete the resources before running this helm chart.
- Rename chart from **darwin-nodejs-chart** to **micro-nodejs**.
- Remove Istio integration.
- Fix indentation issues for: **extraEnvVars**, **extraVolumeMounts** and **extraVolumes**.
- Now the **service.port** and **service.targetPort** properties allow to define the port of the service for the http and https protocols.
- Minor bugs.

### To 1.0.0

- First version of template. It includes template configuration for:
  - Istio
  - Darwin Configuration
    - Security
    - Logs
    - Cloud Configuration service
  - Configmaps
  - Image
  - Lifecycle
  - Security context
  - Resources
  - Deployment Stategy
  - Liveness Probe
  - Readiness Probe
  - Blue/Green Deployment
- Allows to enable or disable Spring Cloud Configuration
