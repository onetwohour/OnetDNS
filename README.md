# <img src="./assets/favicon.png" width="28" style="vertical-align:middle" /> OnetDNS

안전하고 **광고-추적 없는** 인터넷 경험을 위해 설계된 무료 공개 DNS 서비스입니다.  
DNSSEC, DoT, DoH, DoH3(HTTP/3), DoQ, DNSCrypt까지 지원하며 **Privacy-first 정책**을 지향합니다.

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
| **다중 전송 프로토콜** | *DoH*, *DoT*, *DoQ*, *DoH3*, *DNSCrypt* 지원 |
| **이중화 구성** | Node 1/Node 2 서버로 안정성 확보 |
| **독립적 운영** | 타사 업스트림(Google, Cloudflare 등)을 경유하지 않고 직접 질의 |

---

## 엔드포인트

### DNS Node 1 서버
| 프로토콜 | 주소 | 참고 |
|----------|------|------|
| UDP/TCP | `3.39.126.146` | 레거시 DNS |
| DoH | `https://one.dns.onetwohour.com/dns-query` | HTTPS |
| DoT | `tls://one.dns.onetwohour.com` | TLS 1.3 |
| DoQ | `quic://one.dns.onetwohour.com` | QUIC |
| DoH3 | `h3://one.dns.onetwohour.com/dns-query` | HTTP/3 (QUIC) |
| DNSCrypt | `sdns://AQcAAAAAAAAAETMuMzkuMTI2LjE0Njo1NDQzIGz0WQR4dpND2A4x8FgxpXGEoTVomHh7nr5DcqV_2jpIJjIuZG5zY3J5cHQtY2VydC5vbmUuZG5zLm9uZXR3b2hvdXIuY29t` | DNSCrypt |

### DNS Node 2 서버
| 프로토콜 | 주소 | 참고 |
|----------|------|------|
| UDP/TCP | `15.165.111.52` | 레거시 DNS |
| DoH | `https://two.dns.onetwohour.com/dns-query` |HTTPS |
| DoT | `tls://two.dns.onetwohour.com` | TLS 1.3 |
| DoQ | `quic://two.dns.onetwohour.com` | QUIC |
| DoH3 | `h3://two.dns.onetwohour.com/dns-query` | HTTP/3 (QUIC) |
| DNSCrypt | `sdns://AQcAAAAAAAAAEjE1LjE2NS4xMTEuNTI6NTQ0MyDFWSZvLoZbNa9GDQJYwC-tcC4OYcHWpFnmeEpHmnzhiSYyLmRuc2NyeXB0LWNlcnQudHdvLmRucy5vbmV0d29ob3VyLmNvbQ` | DNSCrypt |

---

## 플랫폼별 설정 가이드

### Android
**설정** → **연결** → **기타 연결 설정** → **프라이빗 DNS**에서 다음 중 하나 입력:
- `one.dns.onetwohour.com` (Node 1)
- `two.dns.onetwohour.com` (Node 2)

### iOS/macOS
iOS 14+ 및 macOS Big Sur+ 지원:
- [DNS Node 1 프로필 다운로드](https://onetdns.onetwohour.com/OnetDNS-Node1.mobileconfig)
- [DNS Node 2 프로필 다운로드](https://onetdns.onetwohour.com/OnetDNS-Node2.mobileconfig)

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
- DNSCrypt: `sdns://AQcAAAAAAAAAETMuMzkuMTI2LjE0Njo1NDQzIGz0WQR4dpND2A4x8FgxpXGEoTVomHh7nr5DcqV_2jpIJjIuZG5zY3J5cHQtY2VydC5vbmUuZG5zLm9uZXR3b2hvdXIuY29t`, `sdns://AQcAAAAAAAAAEjE1LjE2NS4xMTEuNTI6NTQ0MyDFWSZvLoZbNa9GDQJYwC-tcC4OYcHWpFnmeEpHmnzhiSYyLmRuc2NyeXB0LWNlcnQudHdvLmRucy5vbmV0d29ob3VyLmNvbQ`

---

## 자주 묻는 질문

### ❓ 광고 차단이 안 되는 사이트가 있어요!

DNS 필터링 방식의 기술적 특성상 일부 광고는 차단되지 않을 수 있습니다. 문제가 발생하는 사이트는 디스코드, 이메일, GitHub 등을 통해 제보해 주시면 필터 개선에 도움이 됩니다.

### ❓ 로그를 정말로 저장하지 않나요?

OnetDNS는 사용자의 프라이버시를 최우선으로 합니다. "어떤 웹사이트를 조회했는지"와 같은 민감한 DNS 쿼리 내용은 그 어떤 경우에도 저장하거나 분석하지 않습니다.

다만, 안정적인 서비스 운영과 DDoS 공격 방어를 위해, 서버에 접속을 시도하는 트래픽의 IP 주소와 같은 최소한의 연결 정보가 시스템 로그에 아주 짧은 시간(수십 분) 동안 일시적으로 기록될 수 있습니다. 이 정보는 오직 비정상적인 대량 트래픽을 자동으로 탐지하고 차단하는 보안 목적으로만 사용되며, 정상적인 사용자의 활동을 추적하는 데에는 절대 사용되지 않습니다.

### ❓ 상업적/기업 환경에서 사용해도 되나요?

누구나 자유롭게 사용할 수 있지만, **SLA를 보장하지는 않습니다.**

### ❓ Node 1과 Node 2 서버의 차이점은?

두 서버는 **동일한 기능**을 제공하는 서버입니다. Node 1 서버 장애 시 Node 2 서버로 전환하여 서비스 연속성을 확보할 수 있습니다.

### ❓ 프로토콜별 기술적 강점은 무엇인가요?

각 프로토콜은 고유한 매커니즘을 통해 보안, 프라이버시, 성능 측면에서 차별화된 강점을 제공합니다.

-   **레거시 DNS (UDP/TCP)**
    -   인터넷의 근간을 이루는 표준 프로토콜로서, 추가적인 암호화 핸드셰이크 및 암복호화 과정이 없어 프로토콜 자체의 오버헤드가 가장 낮습니다. 신뢰성이 확보된 고품질 네트워크 환경에서는 가장 낮은 지연 시간을 기대할 수 있습니다.

-   **DNS over TLS (DoT)**
    -   전송 계층 암호화(TLS)를 통해 DNS 질의의 **기밀성**(Confidentiality)과 **무결성**(Integrity)을 보장합니다. 제3자에 의한 질의 내용 스니핑 및 변조, 특히 중간자 공격(MITM)을 원천적으로 방지합니다. 단, **전용 표준 포트**를 사용하므로 트래픽 식별 및 차단이 비교적 용이합니다.

-   **DNS over HTTPS (DoH)**
    -   DNS 질의를 HTTPS 트래픽으로 캡슐화하여 애플리케이션 계층에서 처리합니다. 결과적으로 일반 웹 트래픽과 **구별이 불가능**해, 네트워크 심층 패킷 분석(DPI) 등을 통한 트래픽 식별 및 차단을 회피하고 사용자의 프라이버시를 극대화하는 데 강점이 있습니다.

-   **DNS over QUIC (DoQ)**
    -   UDP 기반의 최신 전송 프로토콜인 QUIC을 채택하여 TCP의 **'Head-of-Line Blocking' 문제를 해결**하고, 0-RTT 연결 재설정을 지원합니다. 이로 인해 패킷 손실이 잦거나 IP가 변경되는 모바일 환경에서도 지연 시간을 최소화하고 연결 연속성을 보장하는 **성능상 강점**을 가집니다. DoT와 동일한 **전용 표준 포트**를 사용합니다.

-   **DNS over HTTP/3 (DoH3)**
    -   **DoH를 차세대 웹 프로토콜인 HTTP/3 위에서 실행**하는 방식입니다. HTTP/3는 내부적으로 QUIC을 사용하므로, DoH의 **강력한 프라이버시 보호 기능**과 QUIC의 **뛰어난 성능 및 연결 안정성**을 모두 결합한 가장 진보적인 프로토콜입니다.

-   **DNSCrypt**
    -   IETF 표준이 아닌 독자적인 프로토콜로, 타원 곡선 암호학을 활용해 클라이언트와 리졸버(DNS 해석 서버) 간의 통신 경로를 암호화합니다. 리졸버의 공개키를 통해 서버를 인증하여 **DNS 스푸핑을 효과적으로 방지**하고 질의 경로의 보안을 확보하는 데 특화되어 있습니다.

### ❓ 그렇다면 어떤 프로토콜을 사용해야 하나요?

사용자의 환경과 가장 중요하게 생각하는 가치에 따라 최적의 프로토콜을 선택할 수 있습니다.

-   **최고 수준의 '성능'과 '은닉성'을 모두 원할 때 → `DoH3`**
    -   **차단 회피 기능과 최신 네트워크 성능을 모두 놓치고 싶지 않을 때** 최고의 선택입니다. 현재 사용 가능한 가장 진보적인 프로토콜입니다.

-   **'은닉성을 통한 프라이버시'가 최우선일 때 → `DoH`**
    -   네트워크 검열이 심하거나, **DNS 통신 사실 자체를 일반 웹 트래픽 속에 완벽히 숨기고 싶을 때** 가장 효과적인 선택지입니다.

-   **'불안정한 네트워크에서 성능과 보안'을 원할 때 → `DoQ`**
    -   **강력한 최신 보안(TLS 1.3+)을 기반**으로, 특히 **패킷 손실이 잦은 모바일 및 Wi-Fi 환경에서 빠르고 끊김 없는 연결**을 원할 때 가장 유리합니다.

-   **검증된 '표준 암호화'를 선호할 때 → `DoT`**
    -   네트워크에서 특정 포트를 차단하지 않고, **가장 널리 알려진 표준 암호화 DNS를 적용하고 싶을 때** 안정적인 선택입니다.

-   **독자적인 '보안 생태계'를 신뢰할 때 → `DNSCrypt`**
    -   **DNSCrypt 프로토콜을 지원하는 특정 클라이언트나 환경을 사용 중**이며, 해당 방식의 경량화된 보안을 선호할 때 적합합니다.

-   **'호환성'이나 '절대 속도'가 중요할 때 → `레거시 DNS`**
    -   **신뢰할 수 있는 네트워크** 안에서 구형 장비를 사용하거나, 암호화로 인한 미세한 속도 저하도 피하고 싶을 때 제한적으로 사용할 수 있습니다.

일반적인 상황에서는 가장 진보적인 **`DoH3`** ​나 성능이 뛰어난 **`DoQ`** 를 사용하는 것이 가장 좋습니다. 하지만 **검열이나 차단 환경을 우회하는 것**이 최우선 목표라면 **`DoH`** 가 가장 확실한 선택입니다. **`DoT`** 는 가장 **표준적인 암호화 방식**을, **`DNSCrypt`** 는 **전용 클라이언트를 통한 가볍고 강력한 보안**을 원할 때 고려할 수 있는 훌륭한 대안입니다.

### ❓ 다른 DNS 서버를 경유하지 않는다는 것이 무엇을 의미하나요?

OnetDNS는 **완전히 독립적인 DNS 서비스**입니다. 사용자의 질의를 Google DNS(8.8.8.8), Cloudflare(1.1.1.1) 등의 타사 서버로 전달하지 않고, 자체 시스템에서 직접 처리합니다. 이를 통해 더 높은 프라이버시 보호와 빠른 응답을 제공합니다.

### ❓ 업스트림 DNS 서버는 사용하지 않나요?

네, 맞습니다. OnetDNS는 **업스트림 서버 없이** 운영됩니다. 루트 DNS 서버부터 시작해서 직접 권한 있는 서버까지 질의하여 응답을 제공합니다.

---

## 문의 및 지원

- **이메일**: [E-mail](mailto:mail@onetwohour.com)
- **Discord**: [Discord](https://discord.gg/gp3w9w7XXj)
- **후원**: [Buy me a coffee](https://www.buymeacoffee.com/onetwohour)

---

## 라이선스

이 프로젝트는 BSD 2-Clause 라이선스 하에 배포됩니다.
