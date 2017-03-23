# Nginx的安装部署    

### 源码下载
1. 从[官网](http://nginx.org/)下载源码包。

### 构建源码   
- 通过`configure`配置构建指令.以下是一些指令参数：
- `--prefix=path`: 定义保存服务文件的目录,默认的配置目录是`/usr/local/nginx`。
- `--sbin-path=path`: 定义执行nginx的文件名，默认值为`prefix/sbin/nginx`。
- `--conf-path=path`: 定义`nginx.conf`配置文件的文件名,如果确实需要，nginx可以通过一个不同的文件名来启动，通过`-c file`在命令行中指定文件，默认的文件名是`prefix/conf/nginx.conf`。   
- `--pid-path=path`: 定义`nginx.pid`文件的文件名，它会储存主进程的进程号,当nginx安装后，这个的文件名通常可以在`nginx.conf`配置文件中通过`pid`指令来更改它的文件名。默认的文件名是`prefix/logs/pid`。    
- `--error-log-path=path`: 设置发生错误、警告诊断文件的文件名,在安装nginx后，可以在`nginx.conf`配置文件中通过`error_log`指令来更改。默认的文件名为`prefix/logs/error.log`。    
- `--http-log-path=path`: 设置Http服务器的请求日志文件名，同上也可以在配置文件中通过`--access_log`指令更改，默认的文件名`prefix/logs/access_log`。    
- `--user=name`: 设置非特权用户的名称，它的凭证由工作进程使用。安装成功之后，可以通过`user`指令在配置文件中更改,默认的用户名是nobody。    
- `--group=name`:设置用户组的名字，他的凭证由工作进程使用，同上也通过`user`指令更改,默认情况下，用户组的名称用非特权用户名称一致。    
- `--with-select_module --without-select_module`: 启用或禁用允许服务使用`select()`方法构建模块。    
- `--with-poll_module --without-poll_module`: 启用或禁用允许服务使用`poll()`方法构建模块。    
- `--without-http_gzip_module`:禁用构建压缩Http服务器响应的模块。需要zlib库来构建和运行此模块。    
- `--without-http_rewrite_module`: 不允许构建一个允许HTTP服务器重定向或者修改请求URI的模块。运行此模块需要使用PCRE库。
- `--without-http_proxy_module`: 进制构建http服务的代理模块。
- `--with-http-ssl_module`: 启用一个模块来添加[HTTPS协议支持](http://nginx.org/en/docs/http/ngx_http_ssl_module.html)，该模块默认情况下不会构建，构建运行该模块需要`OpenSSL`库。
- `--with-pcre=path`: 设置`PCRE`库的源码位置。该库是正则表达式以及[`ngx_http_rewrite_module`](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)的`location`指令所必须的。
- `--with-pcre-jit`
- `--with-zlib=path`: 设置zlib库的位置,这个库是[`ngx_http_gzip_module`](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)所必须的。
- `--with-cc-opt=parameters`
- `--with-ld-opt=parameters`
