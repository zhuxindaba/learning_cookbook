---
title: Phbricator
categories:
- Phabricator
---

### Phabricator    
>Phabricator是一个开发软件工具的集成，包含任务管理，代码review，管理git,svn等等,持续集成的构建，
>内部通道的讨论等等。

### 在我们局域网内安装phabricator     
>Phabricator是一个LAMP应用程序，所以:
>- 一台linux或Mac OS电脑。(ps: windows不行奥，因为一些命令行在windows无法执行。。。)
>- 一个域名(可有可无，在内网上访问就行了，除非你需要家里办公也访问)(格式:phabricator.xxxxx.com).
>- 一些基本的系统管理员的技能(linux命令得熟悉啊！)
>- 一个web容器，Apache或Nginx（常用的两种方式）
>- PHP(version: >= 5.2, 版本7不支持), MySql(version: >= 5.5), git.
>系统管理员应该会的一些技能（也就是linux的一些指令）,比如：在操作系统安装软件，文件系统的操作，进程
>的管理，权限的处理，修改配置文件，设置环境变量等等。

### 安装需要的组件    
>- git(在包管理系统中一般称为'git')
>- Apache(一般称为"httpd"或"apache2")或者nginx
>- MySQL Server(一般是"mysqlId"或"mysql-server")
>- PHP(一般是"php")
>- 需要的PHP扩展，比如"php-mysql", "php5-mysql"
>如果已经安装好了这些，那么获取Phrbricator以及它的依赖:

```
//选择你要安装的文件夹，并在该文件夹下执行以下命令
git clone https://github.com/phacility/libphutil.git
git clone https://github.com/phacility/arcanist.git
git clone https://github.com/phacility/phabricator.git
```
>APC是建议安装的，所以没有深究。

### Apache容器的配置  
>- 配置web容器(Apache, nginx)
>- 在浏览器访问phabricator
>Apache的httpd.conf

```
<VirtualHost *>
  # Change this to the domain which points to your host.
  ServerName phabricator.example.com

  # Change this to the path where you put 'phabricator' when you checked it
  # out from GitHub when following the Installation Guide.
  #
  # Make sure you include "/webroot" at the end!
  DocumentRoot /path/to/phabricator/webroot
  RewriteEngine on
  RewriteRule ^(.*)$          /index.php?__path__=$1  [B,L,QSA]
</VirtualHost>
```
>如果Apache的配置文件目录不是Phabricator的目录，那么你需要添加`<Directory />`块，这个块
>标示依赖于你的Apache的版本，通过运行`httpd -v`得到当前运行Apache的版本，如果版本号小于2.4,

```
<Directory "/path/to/phabricator/webroot">
  Order allow,deny
  Allow from all
</Directory>
```
>如果大于2.4:

```
<Directory "/path/to/phabricator/webroot">
  Require all granted
</Directory>
```
>配置完成之后，请重启Apache，并继续接下来的配置.

### Nginx的配置    
>nginx.conf:

```
server {
  server_name phabricator.example.com;
  #你的phabricator安装目录
  root        /path/to/phabricator/webroot;

  location / {
    index index.php;
    rewrite ^/(.*)$ /index.php?__path__=/$1 last;
  }

  location /index.php {
    fastcgi_pass   localhost:9000;
    fastcgi_index   index.php;

    #required if PHP was built with --enable-force-cgi-redirect
    fastcgi_param  REDIRECT_STATUS    200;

    #variables to make the $_SERVER populate in PHP
    fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
    fastcgi_param  QUERY_STRING       $query_string;
    fastcgi_param  REQUEST_METHOD     $request_method;
    fastcgi_param  CONTENT_TYPE       $content_type;
    fastcgi_param  CONTENT_LENGTH     $content_length;

    fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;

    fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
    fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

    fastcgi_param  REMOTE_ADDR        $remote_addr;
  }
}
```
>配置完成之后重启nginx，并继续接下来的配置

### 配置Mysql    
>当MySQL运行时，需要加载Phabricator的schemata，所以要在phabricator目录下执行:`./bin/storage upgrade`
>如果你配置的用户不是连接数据库的特权用户，所以需要覆盖默认的用户，所以更改schema，通过一下命令更改
>`./bin/storage upgrade --user <user> --password <password>`并且`./bin/storage upgrade --force`
>**注意：**当修改了phabricator后，运行`storage upgrade`来应用新的修改。

### 配置账号及注册    
>phabricator提供了很多的登录体系，你可以配置谁可以访问或者注册你安装的phabricator以及用户用存在的账号登录phabricator。
>登录方式称之为授权给予，比如可用的"用户名/密码"授权，允许你通过传统的用户名密码登录，其余的支持用证书登录。比如:
>- **用户名密码：**使用用户名密码登录注册
>- **LDAP：**使用LDAP证书登录注册
>- **OAuth：**用户使用支持OAuth2的协议登录，比如(Facebook,Google,GitHub)
>- **其余的提供程序：**有许多可用的支持，Phabricator可以扩展，相关知识请自行了解。
>默认情况下，没有可用的提供程序，你必须在安装完成之后使用"Auth"程序添加一种或多种提供程序。在你添加供应程序之后，
>你可以使用存在的账号连接phabricator（比如你可以使用GitHub的OAuth账号登录Phabricator）或者用户使用它注册新的账
>号（假设你启用这些选项）
>**恢复管理员账号**如果你意外的在phabrication中锁住了，你可以使用`bin/auth`脚本恢复管理员账号的访问，恢复访问，请使用:
>`./bin/auth recover <username>`,username是你想恢复的管理员的账号。
>**通过web页面管理账号**使用管理员账号登录phabricator并路由到`/people`,点击"People",如果你是管理员，你可以看见创建
>及修改账号的选项。
>**手动的创建新账号**，有两种手工创建账号的方式，一种是通过web网页另一种是通过命令行，`./bin/accountadamin`,一些选项
>(如设置密码，更改账号标记)只能在命令行中可见。你可以使用此命令来使一个用户成为管理员（比如你意外的移除了你管理员的标记）
>或者创建一个管理员账号。

### TODO(配置文件存储)     


### TODO(配置邮件发送)    
