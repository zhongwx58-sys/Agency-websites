---
title: "系统代理 TUN 与 DNS"
author: 路由课
date: 2026-10-27
pageClass: cg-directory
---

<SectionIntro section="advanced" />

# 系统代理 TUN 与 DNS

理解流量进入代理的方式，解释应用表现差异。

## 本模块目标

检查请求是否被接管，并定位 DNS 与 IPv6 的相关行为。

## 课程顺序

1. [系统代理的作用](/lessons/6-1.html)：讲解遵循系统设置的请求与需要单独检查的应用。
2. [TUN 的位置与权限](/lessons/6-2.html)：说明虚拟网卡、路由接管、服务权限与冲突检查。
3. [手机连接与分应用](/lessons/6-3.html)：按系统介绍 VPN 权限、后台运行和应用选择差异。
4. [DNS 查询路径](/lessons/6-4.html)：画出目标域名和代理服务器域名的解析与连接关系。
5. [DNS 模式与 IPv6](/lessons/6-5.html)：按客户端支持范围讲解模式、IPv4 和 IPv6 检查。
6. [典型现象分析](/lessons/6-6.html)：排查浏览器能用但应用不能用、切换网络后失效等问题。
