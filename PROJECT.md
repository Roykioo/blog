# 项目配置信息

## 服务器
- IP: 8.153.207.31
- SSH 密钥: ~/.ssh/buddy.pem
- 用户: root

## 域名
- 域名: roykioo.top
- 状态: 实名认证审核中
- NS 待修改为: ns1.alidns.com, ns2.alidns.net

## 网站部署路径
- 本地: /Users/roykioo/Desktop/webdoc
- 服务器: /var/www/webdoc

## 部署命令
```bash
rsync -avz --delete -e "ssh -i ~/.ssh/buddy.pem" /Users/roykioo/Desktop/webdoc/ root@8.153.207.31:/var/www/webdoc/
```
