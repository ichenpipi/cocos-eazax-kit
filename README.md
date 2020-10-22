# Eazax-CCC

![cocos creator](https://img.shields.io/badge/cocos%20creator-2.4.3-blue) ![typescript](https://img.shields.io/badge/typescript-4.0.3-blue)



## 介绍

一个 Cocos Creator 游戏开发脚手架，目前持续更新维护中...

包含但不仅限于以下内容：

- 开箱即用的组件
- Shader 效果文件
- 各种实用小工具
- 各种 d.ts 声明文件
- 弹窗管理方案
- 音频播放方案
- 等等等等等...



这里有一个示例项目：

- 示例项目仓库：[https://gitee.com/ifaswind/eazax-cases](https://gitee.com/ifaswind/eazax-cases)
- 示例在线预览：[https://ifaswind.gitee.io/eazax-cases](https://ifaswind.gitee.io/eazax-cases)



如果此项目对你有帮助，请不要忘记 [![star](https://gitee.com/ifaswind/eazax-ccc/badge/star.svg?theme=dark)](https://gitee.com/ifaswind/eazax-ccc/stargazers)

如有使用上的问题，可以在 gitee 上提 issue 或者添加我的微信 `im_chenpipi` 并留言。



> 【**游戏开发交流群**】
> 
> 皮皮创建了一个游戏开发交流群，供大家交流经验、问题求助等。
> 
> 感兴趣的小伙伴可以**添加我微信 `im_chenpipi` 并留言“加群”**。



## 使用说明

**⚠️ 注意：本项目（eazax-ccc）不是独立的 Cocos Creator 项目，无法直接启动！**

你可以：

- 下载完整项目放在你的项目中即可使用内置的功能与模块。
- 只下载或复制你需要的代码（项目中的组件都是开箱即用）。



## 目录结构

- components - 常用组件
  - effects - Shader 配套组件
    - GaussianBlur.ts - 高斯模糊效果
    - HollowOut.ts - 镂空效果
    - SineWave.ts - 波浪效果
  - localization - 本地化组件
    - LocalizationBase.ts - 多语言基类
    - LocalizationLabelString.ts - 多语言文本
    - LocalizationSpriteFrame.ts - 多语言精灵图像
  - popups - 弹窗组件
    - PopupBase.ts - 弹窗基类（配合 PopupManager 使用）
  - tweens - 缓动效果组件
    - JellyTween.ts - 果冻效果
  - BackgroundFitter.ts - 背景适配
  - Counter.ts - 数值滚动
  - LongPress.ts - 节点长按
  - Marquee.ts - 文本跑马灯
  - RadarChart.ts - 雷达图
  - RotateAround.ts - 围绕旋转
  - ScreenAdapter.ts - 屏幕适配
  - Subtitle.ts - 字幕
  - TouchBlocker.ts - 点击控制
- constants - 内置常量
  - Events.ts - 事件常量
- core - 核心脚本
  - AudioPlayer.ts - 音频播放器
  - EventManager.ts - 事件管理器
  - PopupManager.ts - 弹窗管理器
  - SceneNavigator.ts - 场景导航器
- declarations - 声明文件
  - cc.d.ts - 扩展 cc 声明文件
  - editor.d.ts - 编辑器声明文件
  - extension.d.ts - 基础类型扩展声明文件
  - jsb.d.ts - jsb 声明文件
  - wx.d.ts - 微信声明文件
- extensions - 扩展实现
  - eazax.ts - Eazax 封装
  - extension.ts - 基础类型扩展实现
- misc - 杂项
  - EditorAsset.ts - 编辑器资源类
- resources - 资源文件
  - effects -  Shader 文件
    - eazax-avatar.effect - 头像 Shader
    - eazax-avatar-circle.effect - 头像（圆形） Shader
    - eazax-gaussian-blur.effect - 高斯模糊 Shader
    - eazax-gaussian-blur-adjustable.effect - 高斯模糊（可调整） Shader
    - eazax-hollowout.effect - 镂空 Shader
    - eazax-hollowout-circle.effect - 镂空（圆形） Shader
    - eazax-hollowout-rect.effect - 镂空（矩形） Shader
    - eazax-silhouette.effect - 剪影 Shader
- utils - 工具
  - ArrayUtil.ts - 数组工具
  - BrowserUtil.ts - 浏览器工具
  - MathUtil.ts - 数学工具
  - NodeUtil.ts - 节点工具
  - ObjectUtil.ts - 对象工具
  - PromiseUtil.ts - Promise 工具
  - RegexUtil.ts - 正则工具
  - StorageUtil.ts - 本地储存工具
  - TimeUtil.ts - 时间工具



## 环境

引擎：Cocos Creator 2.4.3

编程语言：TypeScript 4.0.3



---



# 公众号

## 菜鸟小栈

😺我是陈皮皮，一个还在不断学习的游戏开发者，一个热爱分享的 Cocos Star Writer。

🎨这是我的个人公众号，专注但不仅限于游戏开发和前端技术分享。

💖每一篇原创都非常用心，你的关注就是我原创的动力！

> Input and output.

![](https://gitee.com/ifaswind/image-storage/raw/master/weixin/official-account.png)
