---
title: "Inside DIUT: architecture of an on-premise laboratory platform"
description: "How DIUT separates clinical workflows, infrastructure, and document rendering without losing the advantages of a single monorepo."
publishedAt: 2026-07-22
tags:
  - type: project
    value: diut
  - type: skill
    value: Clean Architecture
  - type: skill
    value: NestJS
  - type: skill
    value: gRPC
  - type: skill
    value: Kubernetes
draft: false
---

[DIUT](https://github.com/wermarter/diut) is a laboratory information platform built for the Ho Chi Minh City Center for Disease Control. It supports the operational path from patient and sample intake through test results, authorization, printing, and reporting. The system runs on-premise, where maintainability and operational independence matter as much as feature delivery.

Its architecture follows one guiding idea: keep business decisions close together, while placing databases, transport protocols, and deployment machinery behind explicit seams.

## The system at a glance

DIUT is a Bun and TypeScript monorepo with three deployable applications:

- `hcdc-web-app`, a React and Vite client organized by laboratory feature;
- `hcdc-access-service`, the main NestJS application and system of record; and
- `browser-service`, an isolated NestJS worker for Chromium-based PDF generation.

Four internal libraries support them. `@diut/hcdc` contains the shared domain model and authorization vocabulary. `@diut/common` holds small cross-cutting types and utilities. `@diut/services` owns gRPC contracts. `@diut/nestjs-infra` packages reusable NestJS bootstrap, persistence, logging, storage, Redis, and Puppeteer adapters.

```text
React client
    |
    | HTTP, generated from OpenAPI
    v
Access service -----> MongoDB
    |                Redis
    |                MinIO / S3
    |
    | streaming gRPC
    v
Browser service ----> Chromium ----> merged PDF
```

The monorepo makes contracts easy to share, but the deployable applications remain independently buildable and scalable.

## Business workflows at the center

The access service uses four top-level areas: `controller`, `app`, `domain`, and `infra`.

HTTP controllers are adapters. They validate transport-specific input, invoke a use case, and translate the result into an HTTP response. The `app` area contains use cases such as creating a sample, entering a result, locking a record, or exporting a report. The `domain` area defines the interfaces and exceptions those use cases depend on. The `infra` area supplies concrete adapters for MongoDB, Redis, object storage, request context, and the browser service.

A typical request therefore moves inward:

```text
controller -> use case -> domain interface -> infrastructure adapter
```

The dependency direction is the important part. A sample-creation use case knows that it needs a sample repository and an authorization context; it does not construct Mongoose models or read HTTP cookies. NestJS tokens connect those interfaces to their adapters at the composition root.

This creates a useful seam around business behavior. Validation, authorization, related-record checks, result initialization, and persistence are coordinated by one use case, while transport and storage details remain replaceable.

## One domain language across client and server

The `@diut/hcdc` library defines entities such as samples, patients, tests, branches, users, and permission rules. It also defines the actions that can be performed on each subject.

Authorization is attribute-based rather than limited to static roles. CASL rules can express conditions against domain fields, allowing permissions to reflect branches, record state, and laboratory responsibility. The server evaluates those rules inside use cases, close to the decisions they protect. The React client consumes the same vocabulary to shape navigation and user interactions, while the server remains the authority.

The web application mirrors the domain in feature folders such as sample intake, sample results, patients, reports, and administration. Redux Toolkit Query provides the HTTP layer, with endpoint types generated from the access service's OpenAPI document. This keeps the client-server contract mechanical and lets frontend code concentrate on workflow.

## Why document rendering is a separate service

Printing laboratory results is more demanding than returning ordinary JSON. It requires templates, domain-specific formatting, Chromium, PDF generation, and merging multiple pages into one document.

DIUT keeps the decisions in the access service. A print use case checks permissions, loads the requested samples and print forms, prepares domain data, and renders EJS templates into HTML. It then sends a stream of page requests to the browser service over gRPC. The browser service renders pages sequentially with Puppeteer and returns one merged PDF.

This is a deliberately narrow interface: HTML and page settings go in; a PDF comes back. Chromium's runtime weight and failure modes stay outside the main application, and the renderer can scale independently without moving clinical rules out of the access service.

## Deployment is part of the architecture

The same separation appears in operations. Each application has its own container, Helm chart, Kubernetes Service, health endpoint, and autoscaling configuration. Envoy Gateway routes HTTP and gRPC traffic. MongoDB provides primary persistence, Redis supports caching and coordination, and MinIO supplies S3-compatible object storage.

Argo CD manages delivery, while Prometheus, Loki, Tempo, Grafana, and OpenTelemetry provide metrics, logs, and traces. Longhorn supplies persistent storage for the on-premise cluster. Ansible handles the machine-level setup beneath Kubernetes.

These choices are not an infrastructure appendix. For a laboratory platform deployed onto a small set of Ubuntu servers, reproducible installation, observable failures, and recoverable state are architectural requirements.

## The resulting trade-off

DIUT is not split into many network services. Most business behavior remains in one access service, preserving locality and straightforward transactions. A separate service exists only where there is a real operational seam: headless-browser document rendering.

That balance is the architecture's strongest quality. Shared libraries prevent contract drift, use cases concentrate business decisions, adapters contain technical change, and the deployment model can evolve without rewriting the laboratory workflow. The result is a system shaped around the work it protects rather than the technologies used to deliver it.
