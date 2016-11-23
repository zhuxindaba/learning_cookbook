---
title: docker
categories:
- development tools
---
### Docker(容器引擎)    
>docker是一个开源的可以运行任何app的轻量级的容器。docker容器既'hardware-agnostic(硬件不可知？)'又
>'platform-agnostic(平台不可知？)'.这意味着它可以运行在任何地方，在你的笔记本也行，在云平台亦可以。
>并且不要求使用特定的语言，框架，包系统。这使得应用程序的部署，web app的规模调整，后端服务能更好的构建
>而不依赖于特定的堆栈或提供者。
>docker是一个开放源码的部署引擎,它是由(dotCloud)[http://web.archive.org/web/20130530031104/https://www.dotcloud.com/]驱动的。

### 比VMs好     
>分发应用程序及沙坑执行的常用方法是使用虚拟机。典型的VM格式有VMware的vmdk，Oracle的VirtualBox
>亚马逊的ESC2,理论上这些格式允许每个开发者可以自动的打包应用程序到一个指定的机器以便于分发及部署。
>实际上，几乎不会有这种情况，因为受到以下原因的制裁：
>- Size: VMs很大，存储及移动他们不是很明智。
>- 性能: 运行VMs消耗CPU和内存很大，所以在很多场景下使用它们很不明智，安装过虚拟机的我深有体会。
>- 可移植性
>- 以硬件为中心: VMs的设计是基于机器管理员的想法，而不是软件开发者 。因此，它提供了非常有限的
>的工具给开发者，building, testing, running,比如，VMs提供应用程序的版本控制，监控，配置，
>日志记录等等。
>相比之下，Docker依赖于一种不同于集装箱化的沙盒方法，不像传统的虚拟化，集装箱化发生在内核
>级别。Docker容器非常小，几乎0内存0cpu消耗，可完全移植，并且是以程序为中心设计而设计的。
>也许最重要的是，Docker可以在操作系统中运行，也可以在虚拟机中运行。

### Play Well With Others    
>Docker不需要你购买特定的语言，特定的框架，特定的打包系统，特定的配置语言。
>你的程序是Unix进程么？使用文件了么？tcp链接？环境变量？标准Unix流以及命令行参数作为输入
>输出，在Docker都可以。

### Escape dependecy hell(逃脱地狱依赖)    
>一个常见的问题就是开发人员很难以一个简单自动的方式管理一个程序的所有依赖，常见的原因有以下一些:
>- 跨平台依赖(cross-platform dependencies).现在的应用程序经常依赖系统库、二进制文件、特定语言包，
>特定的框架模块、作为另外一个项目开发的内部组件等等的组合。这些依赖处在不同的"世界"并且需要不同的工具
>而且相互之间不一定能正常的工作，所以需要尴尬的自定义集成。
>- 依赖冲突.不同的应用程序有可能需要依赖一个库的不同版本。
>- 自定义依赖.开发者可能需要准备应用程序依赖的一个自定义版本，一些打包工具可以处理依赖的自定义版本,
>但是有些工具则不行，并且每种的处理方式又不同。
>Docker让开发者在一个地方描述所有的程序依赖来轻松的解决了地狱依赖的这些常见的问题，同时精简了组装过程。
>Docker通过运行Unix命令序列来定义一个build,在同一个容器里一个接一个的。构造命令修改了容器里的内容(经常
>是安装新文件，新文件系统)，下一个命令修改了更多的内容等等。由于每一个命令都是基于上一个命令的结果，命令
>执行的顺序标识依赖项。下面的是一个典型的Docker构造过程：

```
FROM ubuntu:12.04
RUN apt-get update && apt-get install -y python python-pip curl
RUN curl -sSL https://github.com/shykes/helloflask/archive/master.tar.gz | tar -xzv
RUN cd helloflask-master && pip install -r requirements.txt
```
>Docker不关心依赖的构建关系，只要他们可以在容器中可以通过Unix命令构建。


### ToDo（入门）
