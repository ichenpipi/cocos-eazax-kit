# Eazax-CCC

觉得有用的小伙伴记得点个 Star 不迷路 [![star](https://gitee.com/ifaswind/eazax-ccc/badge/star.svg?theme=dark)](https://gitee.com/ifaswind/eazax-ccc/stargazers)



## 介绍

Cocos Creator 游戏开发脚手架，持续维护中...



## 使用方法

**本项目（Eazax-CCC）不是独立的 Cocos Creator 项目，无法直接启动！**

- 下载该项目放在你的项目中即可使用内置的功能与模块。

- 项目中的脚本基本都是开箱即用，可以任意（下载或复制）带走自己需要的脚本。



## 目录结构

- component 常用组件
  - BackgroundFitter.ts 背景适配组件
  - GaussianBlur.ts 高斯模糊效果组件
  - Counter.ts 数值滚动组件
  - HollowOut.ts 镂空效果组件
  - LongPress.ts 节点长按组件
  - Marquee.ts 文本跑马灯组件
  - RotateAround.ts 围绕旋转组件
  - ScreenAdapter.ts 屏幕适配组件
  - Subtitle.ts 字幕组件
  - TouchBlocker.ts 点击屏蔽组件


- constant 内置常量
  - Events.ts 事件常量


- core 核心脚本
  - AudioPlayer.ts 音频播放类
  - GameEvent.ts 事件监听发送类
  - Navigator.ts 场景导航类
  - Storage.ts 本地储存类


- declaration 声明文件
  - cc.d.ts 扩展 cc 命名空间声明文件
  - editor.d.ts 编辑器命名空间声明文件
  - extension.d.ts 基础类型扩展声明声明文件
  - jsb.d.ts jsb 命名空间声明文件
  - wx.d.ts 微信命名空间声明文件


- extension 扩展实现
  - eazax.ts Eazax 封装
  - extension.ts 基础类型扩展实现


- localization 本地化组件
  - LocalizationBase.ts 多语言组件基类
  - LocalizationLabelString.ts 多语言文本组件
  - LocalizationSpriteFrame.ts 多语言精灵组件


- misc 杂项
  - EditorAsset.ts 编辑器资源类


- resources 资源文件
  - effects Shader 文件
    - eazax-avatar.effect 头像 Shader
    - eazax-avatar-circle.effect 头像（圆形） Shader
    - eazax-gaussian-blur.effect 高斯模糊 Shader
    - eazax-gaussian-blur-adjustable.effect 高斯模糊（可调整） Shader
    - eazax-hollowout.effect 镂空 Shader
    - eazax-hollowout-circle.effect 镂空（圆形） Shader
    - eazax-hollowout-rect.effect 镂空（矩形） Shader
    - eazax-silhouette.effect 剪影 Shader


- util 工具
  - ArrayUtil.ts 数组工具
  - BrowserUtil.ts 浏览器工具
  - CalUtil.ts 计算工具
  - NodeUtil.ts 节点工具
  - ObjectUtil.ts 对象工具
  - PromiseUtil.ts Promise 工具
  - RegexUtil.ts 正则工具
  - TimeUtil.ts 时间工具



## 环境

引擎：Cocos Creator 2.0 +

语言：TypeScript



## 菜鸟小栈

我是陈皮皮，这是我的个人公众号，专注但不仅限于游戏开发、前端和后端技术记录与分享。

每一篇原创都非常用心，你的关注就是我原创的动力！

> Input and output.

![](https://gitee.com/ifaswind/image-storage/raw/master/weixin/official-account.png)



## 交流群

皮皮创建了一个游戏开发交流群，供大家交流经验、问题求助等。

感兴趣的小伙伴可以添加我微信 `im_chenpipi` 并留言 `加群`。

