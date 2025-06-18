# OnetDNS

안전하고 **광고-추적 없는** 인터넷 경험을 위해 설계된 무료 공개 DNS 서비스입니다.  
DNSSEC, DoT, DoH, DoH3(HTTP/3), DoQ까지 지원하며 **무로그(No-log) 정책**을 준수합니다.

---

## 신뢰성 자동 검증
OnetDNS는 GitHub Actions를 통해 주요 DNS 보안 기능을 **매일 자동 점검**합니다.

- 🔒 **DNSSEC**: 서명 유효성 검사 (example.com 기준)
- 🔒 **DNS over TLS**: 853 포트 연결 검사
- 🔒 **DNS over HTTPS**: POST 요청 RFC 8484 표준 방식

[![DNS Trust Check](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml/badge.svg)](https://github.com/onetwohour/OnetDNS/actions/workflows/dns-trust.yml)

---

## 목차
1. [주요 특징](#주요-특징)
2. [엔드포인트](#엔드포인트)
3. [자주 묻는 질문](#자주-묻는-질문)
4. [라이선스](#라이선스)

---

## 주요 특징
| 기능 | 설명 |
|------|------|
| 🔒 **DNSSEC** | 레코드 위·변조 방지 |
| 🕵️ **무로그 정책** | 질의∙IP·타임스탬프 등 모든 로그 미보관 |
| 🚀 **광고 차단** | 광고 및 트래커 차단 |
| 🌐 **다중 전송 프로토콜** | *DoH*, *DoT*, *DoQ*, *DoH3* 완전 지원 |

---

## 엔드포인트
| 프로토콜 | 주소 | 포트 | 참고 |
|----------|------|------|------|
| UDP/TCP | `121.131.141.157` | 53 | 레거시 DNS |
| DoH | `https://dns.onetwohour.com/dns-query` | 443 | HTTPS |
| DoT | `tls://dns.onetwohour.com` | 853 | TLS 1.3 |
| DoQ | `quic://dns.onetwohour.com` | 853 | QUIC |
| DoH3 | `h3://dns.onetwohour.com/dns-query` | 443 | HTTP/3 (QUIC) |

> **TIP** <br>
> 갤럭시 사용자는 *설정 → 연결 → 기타 연결 설정 → 프라이빗 DNS* 에서 `dns.onetwohour.com` 만 입력하면 됩니다.

---

## 자주 묻는 질문

### - 광고 차단이 안 되는 사이트가 있어요!

DNS 원리 특성상 차단이 되지 않는 광고가 있을 수 있습니다. 그런 부분은 양해 바랍니다.

디스코드, 이메일, 깃허브 등 다양한 곳에서 피드백을 받고 있습니다. 문제가 있는 사이트가 있다면 제보해 주세요.

### - 로그를 정말로 저장하지 않나요?

네. 모든 통계를 제외한 로그는 저장되지 않습니다.

### - 상업적/기업 환경에서 사용해도 되나요?

누구나 자유롭게 사용할 수 있지만, **SLA를 보장하지는 않습니다.**

---

## 라이선스

이 프로젝트는 **MIT License**를 따릅니다.
© 2025 [onetwohour](https://github.com/onetwohour). All rights reserved.
