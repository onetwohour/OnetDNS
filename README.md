<div align="center">

<img src="assets/favicon.png" width="72" alt="" />

# Onet DNS

[![Server check](https://img.shields.io/github/actions/workflow/status/onetwohour/OnetDNS/dns-trust.yml?branch=main&style=for-the-badge&label=server%20check)](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml)
[![License](https://img.shields.io/badge/license-BSD--2--Clause-4C1?style=for-the-badge)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/gp3w9w7XXj)

[웹사이트](https://onetdns.onetwohour.com) · [엔드포인트](#엔드포인트) · [기기별 설정](#기기별-설정) · [개인정보](#개인정보) · [자주 묻는 질문](#자주-묻는-질문)

</div>

Onet DNS는 광고와 추적 도메인을 차단하는 무료 공개 DNS입니다. 같은 설정으로 동작하는 서버 두 대(Node 1, Node 2)가 질의를 다른 공개 DNS로 넘기지 않고 루트 서버부터 직접 재귀 조회하며, 응답은 DNSSEC으로 검증합니다. 두 서버는 [OnetDNS](https://github.com/onetwohour/OnetDNS-Core)로 운영합니다.

## 엔드포인트

| 프로토콜 | 포트 | Node 1 | Node 2 |
| --- | --- | --- | --- |
| DNS | UDP/TCP 53 | `3.39.126.146` | `15.165.111.52` |
| DNS over TLS | TCP 853 | `tls://one.dns.onetwohour.com` | `tls://two.dns.onetwohour.com` |
| DNS over QUIC | UDP 853 | `quic://one.dns.onetwohour.com` | `quic://two.dns.onetwohour.com` |
| DNS over HTTPS | TCP 443 | `https://one.dns.onetwohour.com/dns-query` | `https://two.dns.onetwohour.com/dns-query` |
| DNS over HTTP/3 | UDP 443 | `h3://one.dns.onetwohour.com/dns-query` | `h3://two.dns.onetwohour.com/dns-query` |
| DNSCrypt | UDP/TCP 5443 | [스탬프](#dnscrypt-스탬프) | [스탬프](#dnscrypt-스탬프) |

두 서버는 같은 기능을 제공합니다. 한 서버에 장애가 나도 계속 쓸 수 있도록 두 서버를 모두 등록해 두세요.

### DNSCrypt 스탬프

Node 1

```text
sdns://AQcAAAAAAAAAETMuMzkuMTI2LjE0Njo1NDQzICRPcENhGUJwJSNZyUTsMBLsqVKpB_bfbv_63qHNx86LJjIuZG5zY3J5cHQtY2VydC5vbmUuZG5zLm9uZXR3b2hvdXIuY29t
```

Node 2

```text
sdns://AQcAAAAAAAAAEjE1LjE2NS4xMTEuNTI6NTQ0MyD2cVyG4KhEQl8gMA8I0mdbF9fdFpIhB2LrfqXuAd8PLSYyLmRuc2NyeXB0LWNlcnQudHdvLmRucy5vbmV0d29ob3VyLmNvbQ
```

## 기기별 설정

### Android

Android 9 이상은 프라이빗 DNS(DNS over TLS)를 지원합니다. 삼성 기기에서는 **설정 → 연결 → 기타 연결 설정 → 프라이빗 DNS**에서 호스트 이름으로 `one.dns.onetwohour.com` 또는 `two.dns.onetwohour.com`을 입력합니다. 프라이빗 DNS에는 호스트 이름을 하나만 입력할 수 있습니다.

### iPhone, iPad, Mac

구성 프로필을 설치하면 DNS over TLS로 연결됩니다. iOS 14, macOS 11 이상이 필요합니다.

- [Node 1 프로필](https://onetdns.onetwohour.com/OnetDNS-Node1.mobileconfig)
- [Node 2 프로필](https://onetdns.onetwohour.com/OnetDNS-Node2.mobileconfig)

iPhone과 iPad에서는 Safari로 프로필을 내려받은 다음 **설정 → 일반 → VPN 및 기기 관리**에서 설치합니다. Mac에서는 내려받은 프로필을 열고 시스템 설정에서 설치를 승인합니다.

### Windows 11

1. **설정 → 네트워크 및 인터넷 → Wi-Fi**(또는 **이더넷**) **→ 하드웨어 속성**으로 이동합니다.
2. **DNS 서버 할당** 옆의 **편집**을 누르고 **수동**을 선택한 다음 IPv4를 켭니다.
3. 기본 설정 DNS에 `3.39.126.146`을, 대체 DNS에 `15.165.111.52`를 입력합니다.
4. 두 주소 모두 DNS over HTTPS를 수동 템플릿으로 켜고, 템플릿에 각각 `https://one.dns.onetwohour.com/dns-query`와 `https://two.dns.onetwohour.com/dns-query`를 입력합니다.
5. 일반 텍스트 대체는 꺼 둡니다. 켜 두면 암호화 연결에 실패했을 때 암호화하지 않은 DNS로 질의합니다.

Windows 10에는 암호화 DNS 설정이 없습니다. **제어판 → 네트워크 및 공유 센터 → 어댑터 설정 변경**에서 연결의 속성을 열고, **인터넷 프로토콜 버전 4(TCP/IPv4)** 에 두 IP 주소를 입력합니다.

### AdGuard와 그 밖의 클라이언트

AdGuard 앱에서는 **DNS 보호 → 사용자 정의 서버 추가**에 [엔드포인트](#엔드포인트) 표의 주소를 입력합니다. dnscrypt-proxy처럼 DNSCrypt를 지원하는 클라이언트에는 [DNSCrypt 스탬프](#dnscrypt-스탬프)를 사용합니다.

## 프로토콜 선택

지원한다면 DNS over HTTP/3나 DNS over QUIC을 권장합니다. 853 포트가 막힌 네트워크에서는 DNS over HTTPS를 사용합니다.

| 프로토콜 | 특징 |
| --- | --- |
| DNS over HTTP/3 | DoH를 QUIC 위에서 보냅니다. 웹 트래픽과 같은 443 포트를 쓰고, 패킷 손실과 네트워크 전환에 강합니다. |
| DNS over QUIC | QUIC으로 직접 보냅니다. 연결 수립이 빠르고 모바일 네트워크에 유리합니다. |
| DNS over HTTPS | HTTPS로 보냅니다. 일반 웹 트래픽과 같은 포트를 쓰므로 DNS만 골라 차단하기 어렵습니다. |
| DNS over TLS | TLS로 보냅니다. Android 프라이빗 DNS와 Apple 구성 프로필이 이 방식을 씁니다. 전용 포트를 쓰므로 네트워크에서 차단되기 쉽습니다. |
| DNSCrypt | IETF 표준이 아닌 별도 프로토콜입니다. 스탬프에 든 공개 키로 서버를 인증하고 질의를 암호화합니다. |
| DNS | 암호화하지 않습니다. 경로상에서 질의 내용이 보이고 응답이 변조될 수 있으므로, 암호화 DNS를 지원하지 않는 기기에만 씁니다. |

## 개인정보

질의 내용은 저장되지 않습니다. 다만, 총 조회 수는 운영을 위해 저장합니다.

## 서버 점검

GitHub Actions가 매일 두 서버의 DNS, DNS over HTTPS, DNS over TLS, DNS over QUIC 응답과 DNSSEC 검증 결과를 점검합니다. 결과는 위의 server check 배지와 [Actions](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml)에서 확인할 수 있습니다.

## Discord 봇

[Discord 서버](https://discord.gg/gp3w9w7XXj)의 봇으로 서버 상태를 확인하고 도메인 차단 여부를 검사할 수 있습니다.

| 명령 | 설명 |
| --- | --- |
| `/통계 server` | 최근 24시간의 질의 수, 차단 수, 차단율을 보여 줍니다. |
| `/로그 server [limit] [search]` | 최근 질의 로그를 보여 줍니다. `limit`은 기본 5건, 최대 10건이며, `search`로 도메인이나 클라이언트를 검색합니다. |
| `/검사 server hostname` | 도메인이 차단되는지 확인하고, 차단되면 적용된 규칙을 보여 줍니다. |
| `/서버테스트 server` | 서버가 외부 도메인을 정상적으로 조회하는지 확인합니다. |

## 자주 묻는 질문

### 광고가 차단되지 않는 사이트가 있어요

DNS 차단은 도메인 단위로 동작하므로, 광고를 본문과 같은 도메인에서 보내는 사이트에서는 광고를 막을 수 없습니다. 차단되지 않는 광고나 잘못 차단된 사이트는 Discord, 이메일, GitHub Issues로 알려 주세요.

### 업무 환경에서 써도 되나요?

누구나 자유롭게 쓸 수 있지만, SLA는 보장하지 않습니다.

### 업스트림 DNS를 쓰지 않나요?

쓰지 않습니다. Google(8.8.8.8)이나 Cloudflare(1.1.1.1) 같은 공개 DNS로 질의를 전달하지 않고, 루트 서버부터 권한 서버까지 직접 조회합니다. 따라서 사용자의 질의 기록이 다른 DNS 운영자에게 모이지 않습니다.

### 왜 운영하나요?

혼자 쓰긴 아깝잖아요 😎

### 언제까지 운영하나요?

비용 문제가 없는 한 계속 운영할 계획입니다.

## 함께 쓰면 좋은 서비스

[Noogle](https://search.onetwohour.com)은 SearXNG 기반의 메타 검색 엔진입니다. 여러 검색 엔진의 결과를 모아 보여 주며, 검색 기록을 저장하지 않습니다. 이름은 Google을 패러디한 것입니다.

## 문의

- 이메일: [mail@onetwohour.com](mailto:mail@onetwohour.com)
- Discord: [discord.gg/gp3w9w7XXj](https://discord.gg/gp3w9w7XXj)
- GitHub Issues: [onetwohour/OnetDNS](https://github.com/onetwohour/OnetDNS/issues)
- 후원: [Buy me a coffee](https://www.buymeacoffee.com/onetwohour)

## 라이선스

이 저장소는 [BSD-2-Clause](LICENSE) 라이선스로 배포합니다.
