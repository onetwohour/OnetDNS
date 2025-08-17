# <img src="./assets/favicon.png" width="28" style="vertical-align:middle" /> OnetDNS

안전하고 **광고-추적 없는** 인터넷 경험을 위해 설계된 무료 공개 DNS 서비스입니다.  
DNSSEC, DoT, DoH, DoH3(HTTP/3), DoQ까지 지원하며 **Privacy-first 정책**을 지향합니다.

---

## 신뢰성 자동 검증
OnetDNS는 GitHub Actions를 통해 **Node 1과 Node 2 두 서버의** 주요 DNS 보안 기능을 **매일 자동 점검**합니다.

- **DNSSEC**: `example.com` 도메인을 기준으로 서명된 응답의 유효성(DNSSEC 검증 성공 여부)을 확인합니다.
- **DNS over HTTPS**: RFC 8484에 따라 HTTP POST 방식으로 DoH 엔드포인트의 응답을 확인합니다.
- **DNS over TLS**: TCP 853 포트를 통해 TLS 기반 암호화 DNS 연결이 가능한지 검사합니다.
- **DNS over QUIC**: UDP 853 포트를 통한 QUIC 기반 DNS 연결이 정상 작동하는지 점검합니다.

[![DNS Trust Check](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml/badge.svg)](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml)

---

## 목차
1. [주요 특징](#주요-특징)
2. [엔드포인트](#엔드포인트)
3. [플랫폼별 설정 가이드](#플랫폼별-설정-가이드)
4. [자주 묻는 질문](#자주-묻는-질문)
5. [라이선스](#라이선스)

---

## 주요 특징
| 기능 | 설명 |
|------|------|
| **DNSSEC** | 레코드 위·변조 방지 |
| **Privacy-first 정책** | 개인 식별이 가능한 DNS 질의 내용 미저장 |
| **광고 차단** | 광고 및 트래커 차단 |
| **다중 전송 프로토콜** | *DoH*, *DoT*, *DoQ*, *DoH3* 지원 |
| **이중화 구성** | Node 1/Node 2 서버로 안정성 확보 |
| **독립적 운영** | 타사 업스트림(Google, Cloudflare 등)을 경유하지 않고 직접 질의 |

---

## 엔드포인트

### DNS Node 1 서버
| 프로토콜 | 주소 | 포트 | 참고 |
|----------|------|------|------|
| UDP/TCP | `3.39.126.146` | 53 | 레거시 DNS |
| DoH | `https://one.dns.onetwohour.com/dns-query` | 443 | HTTPS |
| DoT | `tls://one.dns.onetwohour.com` | 853 | TLS 1.3 |
| DoQ | `quic://one.dns.onetwohour.com` | 853 | QUIC |
| DoH3 | `h3://one.dns.onetwohour.com/dns-query` | 443 | HTTP/3 (QUIC) |

### DNS Node 2 서버
| 프로토콜 | 주소 | 포트 | 참고 |
|----------|------|------|------|
| UDP/TCP | `15.165.111.52` | 53 | 레거시 DNS |
| DoH | `https://two.dns.onetwohour.com/dns-query` | 443 | HTTPS |
| DoT | `tls://two.dns.onetwohour.com` | 853 | TLS 1.3 |
| DoQ | `quic://two.dns.onetwohour.com` | 853 | QUIC |
| DoH3 | `h3://two.dns.onetwohour.com/dns-query` | 443 | HTTP/3 (QUIC) |

---

## 플랫폼별 설정 가이드

### Android
**설정** → **연결** → **기타 연결 설정** → **프라이빗 DNS**에서 다음 중 하나 입력:
- `one.dns.onetwohour.com` (Node 1)
- `two.dns.onetwohour.com` (Node 2)

### iOS/macOS
iOS 14+ 및 macOS Big Sur+ 지원:
- [DNS Node 1 프로필 다운로드](https://onetdns.onetwohour.com/onetdns-one.mobileconfig)
- [DNS Node 2 프로필 다운로드](https://onetdns.onetwohour.com/onetdns-two.mobileconfig)

**설치 방법**: Safari에서 프로필 다운로드 → 설정 → 일반 → VPN 및 기기 관리 → 프로필 설치

### Windows

**1. 암호화된 DNS (DoH) 설정 (Windows 11 권장)**
**설정** → **네트워크 및 인터넷** → **Wi-Fi** 또는 **이더넷** → **하드웨어 속성**으로 이동 후 **DNS 서버 할당** 옆의 **[편집]** 버튼을 클릭하세요.

- **다음 DNS 서버 주소 사용**을 선택합니다.
- **기본 설정 DNS**: `3.39.126.146`
- **대체 DNS**: `15.165.111.52`
- **기본 설정 DNS 암호화**: `HTTPS를 통한 DNS(수동)` 선택
- **대체 DNS 암호화**: `HTTPS를 통한 DNS(수동)` 선택
- **HTTPS 템플릿을 통한 암호화**: 각각 `https://one.dns.onetwohour.com/dns-query`, `https://two.dns.onetwohour.com/dns-query` 입력

**2. 레거시 IP 주소 설정**
**제어판** → **네트워크 및 인터넷** → **네트워크 및 공유 센터** → **어댑터 설정 변경**
- 기본 설정 DNS: `3.39.126.146`
- 보조 DNS: `15.165.111.52`

> 기본 설정 DNS와 보조 DNS의 주소를 바꾸어 작성해도 동일하게 동작합니다.

### AdGuard
**DNS 보호** → **사용자 정의 서버 추가**에서 원하는 프로토콜 입력:
- DoH: `https://one.dns.onetwohour.com/dns-query`, `https://two.dns.onetwohour.com/dns-query`
- DoT: `tls://one.dns.onetwohour.com`, `tls://two.dns.onetwohour.com`
- DoQ: `quic://one.dns.onetwohour.com`, `quic://two.dns.onetwohour.com`
- H3: `h3://one.dns.onetwohour.com/dns-query`, `h3://two.dns.onetwohour.com/dns-query`

---

## 자주 묻는 질문

### ❓ 광고 차단이 안 되는 사이트가 있어요!

DNS 원리 특성상 차단이 되지 않는 광고가 있을 수 있습니다. 그런 부분은 양해 바랍니다.

디스코드, 이메일, 깃허브 등 다양한 곳에서 피드백을 받고 있습니다. 문제가 있는 사이트가 있다면 제보해 주세요.

### ❓ 로그를 정말로 저장하지 않나요?

OnetDNS는 사용자의 프라이버시를 최우선으로 합니다. "어떤 웹사이트를 조회했는지"와 같은 민감한 DNS 쿼리 내용은 그 어떤 경우에도 저장하거나 분석하지 않습니다.

다만, 안정적인 서비스 운영과 DDoS 공격 방어를 위해, 서버에 접속을 시도하는 트래픽의 IP 주소와 같은 최소한의 연결 정보가 시스템 로그에 아주 짧은 시간(수십 분) 동안 일시적으로 기록될 수 있습니다. 이 정보는 오직 비정상적인 대량 트래픽을 자동으로 탐지하고 차단하는 보안 목적으로만 사용되며, 정상적인 사용자의 활동을 추적하는 데에는 절대 사용되지 않습니다.

### ❓ 상업적/기업 환경에서 사용해도 되나요?

누구나 자유롭게 사용할 수 있지만, **SLA를 보장하지는 않습니다.**

### ❓ Node 1과 Node 2 서버의 차이점은?

두 서버는 **동일한 기능**을 제공하는 서버입니다. Node 1 서버 장애 시 Node 2 서버로 전환하여 서비스 연속성을 확보할 수 있습니다.

### ❓ 다른 DNS 서버를 경유하지 않는다는 것이 무엇을 의미하나요?

OnetDNS는 **완전히 독립적인 DNS 서비스**입니다. 사용자의 질의를 Google DNS(8.8.8.8), Cloudflare(1.1.1.1) 등의 타사 서버로 전달하지 않고, 자체 시스템에서 직접 처리합니다. 이를 통해 더 높은 프라이버시 보호와 빠른 응답을 제공합니다.

### ❓ 업스트림 DNS 서버는 사용하지 않나요?

네, 맞습니다. OnetDNS는 **업스트림 서버 없이** 운영됩니다. 루트 DNS 서버부터 시작해서 직접 권한 있는 서버까지 질의하여 응답을 제공합니다.

### ❓ 어떤 광고 필터를 사용하나요?

OnetDNS는 필요에 따라 유동적으로 필터를 추가하거나 제거할 수 있습니다. 필터 목록을 실시간으로 확인하려면 디스코드를 방문해 주세요.

---

## 문의 및 지원

- **이메일**: [mail@onetwohour.com](mailto:mail@onetwohour.com)
- **Discord**: [https://discord.gg/gp3w9w7XXj](https://discord.gg/gp3w9w7XXj)
- **후원**: [Buy me a coffee](https://www.buymeacoffee.com/onetwohour)

---

## 라이선스

이 프로젝트는 BSD 2-Clause 라이선스 하에 배포됩니다.
