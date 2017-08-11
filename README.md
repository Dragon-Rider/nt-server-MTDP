# NodeJS应用示例

## 本地运行

```
$ npm install
$ npm start
```

现在，本示例应用已经跑在了你的 localhost:8080 端口上了。

## 部署到sinacloud

首先，提交代码到你的sinacloud应用的git仓库。

```
$ git remote add sinacloud $GIT_REPOS_URL_FOR_YOUR_APPLICATIRON
$ git push sinacloud master
```

登陆sinacloud容器云的管理页面，在部署页面中，点击部署。

部署完成之后，你就可以通过 http://$APPNAME.sinaapp.com 来访问你的应用了。

数据库启用

进入具体启动的云应用->数据库与缓存服务->共享性MySQL->导入本地neitui100.sql->清空数据表（为了每年分别区重）

## 部署到美团云
1. 首先，登录美团云
2. 进入开发文件夹，clone代码文件
3. npm start

#####注意， 如果遇到端口号被占用，还需要kill占用端口号的进程，操作步骤如下：

1. 找到占用端口号的进程：fuser -n tcp 80, 如果是mac系统使用命令：lsof -i tcp:80
2. 关闭进程：sudo kill pid

## 更多示例

本git仓库的其它分支里还包含了Socket.io、MySQL服务、Memcached服务等的使用示例。

## 相关文档

- [NodeJS应用部署指南](http://www.sinacloud.com/doc/sae/docker/nodejs-getting-started.html)
