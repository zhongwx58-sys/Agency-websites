---
title: "故障排查"
author: 路由课
date: 2026-10-27
---

# 故障排查

<div class="legacy-content">

<div class="container"><div class="troubleshoot-list"><details><summary>配置导入失败，或提示解析错误</summary><p>先确认下载的是客户端支持的配置格式，而不是网页或错误提示。记录错误行号，核对缩进、字段以及客户端和内核版本。恢复原配置后，只调整出错部分。</p><RouteLink class="text-link" to="/lessons/12-1.html">查看完整排查步骤 </RouteLink></details><details><summary>一直超时，或提示认证失败</summary><p>核对服务器地址、端口、协议、账号及认证方式。分别检查入口与落地是否可达，不要同时修改 DNS、规则和节点。保存对应时间的日志。</p><RouteLink class="text-link" to="/lessons/12-2.html">查看完整排查步骤 </RouteLink></details><details><summary>延迟测试有结果，网页却打不开</summary><p>延迟测试只对应测试目标和方法。重新发起目标请求，依次核对 DNS、代理连接、TLS、网站响应与实际应用行为。</p><RouteLink class="text-link" to="/lessons/12-3.html">查看完整排查步骤 </RouteLink></details><details><summary>设置了链式代理，出口却不对</summary><p>确认规则选择的是最终落地出口，再检查该节点是否通过预期前置拨号。将本次请求的连接记录与检测页 IP 对照，避免只看客户端当前选中名称。</p><RouteLink class="text-link" to="/lessons/12-4.html">查看完整排查步骤 </RouteLink></details><details><summary>TUN 开启后异常，或更新后失效</summary><p>检查服务权限、其他 VPN 冲突、系统路由与本次配置变化。先回到已知可用配置，再一次改变一个条件复测。</p><RouteLink class="text-link" to="/lessons/12-5.html">查看完整排查步骤 </RouteLink></details><details><summary>需要求助，但不知道提供什么</summary><p>整理系统、客户端与内核版本、复现步骤、预期与实际路径、同一时间窗口的日志，以及已试过的恢复步骤。账号、订阅链接和密钥必须脱敏。</p><RouteLink class="text-link" to="/lessons/12-6.html">查看完整排查步骤 </RouteLink></details></div></div>

</div>
