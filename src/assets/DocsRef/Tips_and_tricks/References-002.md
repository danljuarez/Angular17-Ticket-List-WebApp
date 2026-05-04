# What is SonarQube?

**SonarQube** is a static code analysis platform (SonarQube) used to continuously inspect code quality and security. It detects issues like:

* Bugs and code smells
* Security vulnerabilities
* Duplicated code
* Test coverage gaps
* Maintainability risks

It integrates into CI/CD pipelines so every commit or merge request can be automatically analyzed, and builds can fail if quality gates are not met.

In GitLab pipelines (GitLab CI/CD), SonarQube is commonly used to enforce code quality for:

* **C# (.NET backend)**
* **Angular (TypeScript frontend)**

---

Here’s a clear breakdown of what **SonarQube** actually *analyzes and enforces* in a CI pipeline (like GitLab CI/CD) for **Angular 20/21 (TypeScript)** and **C# (.NET Core)** projects.

## Core Analysis Features (Both Angular + .NET)

These apply across both stacks:

### Code Quality (Clean Code)

* Detects **code smells** (bad practices, complexity, duplication)
* Enforces maintainability rules
* Measures:
  * Cognitive complexity
  * Technical debt
  * Maintainability rating (A–E)

---

### Security Analysis

* Detects **vulnerabilities** (e.g., injection risks)
* Flags **security hotspots** (areas needing review)
* Supports standards like:
  * OWASP Top 10
  * CWE

---

### Bug Detection

* Finds logic errors and risky patterns
* Examples:
  * Null reference risks
  * Incorrect condition handling
  * Async misuse

---

### Code Coverage

* Imports coverage reports:
  * `.NET`: OpenCover / Coverlet
  * Angular: `lcov.info`
* Tracks:
  * Line coverage
  * Branch coverage
* Used in **Quality Gates**

---

### Code Duplication

* Detects duplicated blocks across files
* Helps reduce maintenance cost

---

### Quality Gates

* Enforces pass/fail rules in pipeline:
  * Coverage threshold
  * No new critical bugs
  * No new vulnerabilities
* Can block merge requests

---

### New Code Focus

* Focuses only on **new/changed code**
* Prevents “legacy code penalty”
* Key for real-world adoption

---

## Angular 20/21 (TypeScript) Specific Features

### TypeScript Static Analysis

* Type safety issues
* Unused variables/imports
* Improper async/await usage
* RxJS misuse patterns

---

### Angular Best Practices

* Detects:
  * Poor component structure
  * Large components/services
  * Misuse of lifecycle hooks
* Encourages modular architecture

---

### Frontend Security

* Detects:
  * XSS risks
  * Unsafe DOM manipulation
  * Insecure bindings

---

### Test Coverage Integration

* Reads:
  * `coverage/lcov.info`
* Highlights:
  * Untested components/services

---

### Dependency Awareness (limited)

* Flags risky patterns, but not a full SCA tool <br>
  (you’d pair with tools like Snyk if needed)

---

## C# (.NET Core) Specific Features

### Deep Roslyn-Based Analysis

* Uses Microsoft compiler platform (Roslyn)
* Very accurate for:
  * Nullability issues
  * LINQ misuse
  * Async/await problems

---

### Security (Backend-Focused)

* Detects:
  * SQL injection risks
  * Hardcoded secrets
  * Insecure deserialization
  * Auth flaws

---

### Code Design & Architecture

* Flags:
  * Large classes (God objects)
  * High coupling
  * Poor layering

---

### Test Coverage (Advanced)

* Integrates with:
  * Coverlet
  * OpenCover
* Supports branch + line coverage

---

### Performance & Reliability

* Detects:
  * Inefficient loops
  * Memory misuse
  * Blocking async calls

---

## Pipeline-Level Capabilities

When integrated into CI:

### Pull Request / Merge Request Analysis

* Comments directly on code changes
* Highlights:
  * New bugs
  * New vulnerabilities
  * Coverage drop

---

### Dashboard & Reporting

* Centralized project health view:
  * Reliability
  * Security
  * Maintainability

---

### Multi-language Support

* Single scan can include:
  * C#
  * TypeScript
  * HTML/CSS
  * JSON configs

---

## What SonarQube Does *NOT* Cover (Important)

To stay realistic:
* ❌ Not a full dependency vulnerability scanner (no deep CVE DB like SCA tools)
* ❌ Not a runtime security tester (no DAST)
* ❌ Not a replacement for unit tests
* ❌ Limited Angular framework-specific semantic checks compared to linters like ESLint

---

## Bottom Line

In your pipeline, **SonarQube acts as a gatekeeper** that ensures:

* Clean, maintainable code
* Secure coding practices
* Tested changes (coverage)
* No degradation in new code

Across:

* **Angular frontend (TypeScript)**
* **.NET Core backend (C#)**

---