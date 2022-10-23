# cocos-eazax-kit

![cocos-creator](https://img.shields.io/badge/cocos--creator-2.4%2B-blue) ![typescript](https://img.shields.io/badge/typescript-4.2+-blue)

## 介绍

cocos-eazax-kit 是一个 Cocos Creator 游戏开发工具包，目前持续更新维护中...

### 内容

📦 包含但不仅限于以下内容：

- 开箱即用的组件
- Shader 效果
- 实用工具类
- 弹窗管理方案
- 音频播放方案
- 一些声明文件
- 等等等等...

### 示例

🌰 这里有一个示例项目：

- 示例项目仓库：[https://gitee.com/ichenpipi/cocos-eazax-cases](https://gitee.com/ichenpipi/cocos-eazax-cases)
- 示例项目在线预览：[https://ichenpipi.gitee.io/cocos-eazax-cases](https://ichenpipi.gitee.io/cocos-eazax-cases)

### 开源

如果此项目对你有帮助，请不要忘记 [![star](https://gitee.com/ichenpipi/cocos-eazax-kit/badge/star.svg?theme=dark)](https://gitee.com/ichenpipi/cocos-eazax-kit/stargazers)

如有使用上的问题，可以在 Gitee 上提 issue 或者添加我的微信 `im_chenpipi` 并留言。

> 👨‍💻 **开发交流群**
> 
> 皮皮创建了一个开发交流群，供小伙伴们交流开发经验、问题求助和摸鱼（划掉）。
> 
> 感兴趣的小伙伴可以添加我微信 `im_chenpipi` 并留言 `加群`。

## 使用说明

⚠️ 注意：本项目不是独立的 Cocos Creator 项目，无法直接启动！

✅ 你可以：

- 下载完整项目放在你的项目中即可使用内置的功能与模块。
- 只下载或复制你需要的代码（项目中的组件都是开箱即用）。

## 目录结构

- components - 常用组件
  - charts - 图表组件
    - ArcProgressBar.ts - 弧形进度条
    - RadarChart.ts - 雷达图
  - effects - Shader 配套组件
    - AfterEffect.ts - 后期效果
    - ColorBrush.ts - 彩色画笔效果
    - GaussianBlur.ts - 高斯模糊效果
    - HollowOut.ts - 镂空效果
    - Mosaic.ts - 马赛克效果
    - SineWave.ts - 波浪效果
  - localization - 本地化组件
    - LocalizationBase.ts - 多语言基类
    - LocalizationLabelString.ts - 多语言文本
    - LocalizationSpriteFrame.ts - 多语言精灵图像
  - popups - 弹窗组件
    - ConfirmPopup.ts - 确认弹窗（弹窗组件示例）
    - PopupBase.ts - 弹窗基类（配合 PopupManager 使用）
  - remotes - 远程组件
    - RemoteAsset.ts - 远程资源基类
    - RemoteSpine.ts - 远程 Spine
    - RemoteTexture.ts - 远程纹理（图像）
  - renderers - 渲染组件
    - GradientColor - 渐变色（Sprite）
  - tweens - 缓动效果组件
    - JellyTween.ts - 果冻效果
  - BackgroundFitter.ts - 背景适配
  - Counter.ts - 数值滚动
  - LongPress.ts - 节点长按
  - Marquee.ts - 文本跑马灯
  - RotateAround.ts - 围绕旋转
  - ScreenAdapter.ts - 屏幕适配
  - Subtitle.ts - 字幕
  - TouchBlocker.ts - 点击阻挡（控制）
- core - 核心脚本
  - remotes - 远程
    - RemoteLoader.ts - 远程资源加载器
    - SpineLoader.ts - 远程 Spine 加载器
    - ZipLoader.ts - 远程 Zip 加载器
  - AudioPlayer.ts - 音频播放器
  - EventManager.ts - 事件管理器
  - InstanceEvent.ts - 实例事件
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
  - effects - Shader 文件
    - eazax-avatar-circle-adjustable - 头像 Shader（可调整）
    - eazax-avatar-circle.effect - 头像 Shader（圆形）
    - eazax-avatar.effect - 头像 Shader
    - eazax-color-brush.effect - 彩色画笔 Shader
    - eazax-gaussian-blur.effect - 高斯模糊 Shader（性能爆炸，慎用）
    - eazax-gray.effect - 灰色 Shader
    - eazax-hollowout.effect - 镂空 Shader
    - eazax-hollowout-circle.effect - 镂空（圆形）Shader
    - eazax-hollowout-rect.effect - 镂空（矩形）Shader
    - eazax-kawase-blur.effect - Kawase 模糊 Shader
    - eazax-mosaic.effect - 马赛克 Shader
    - eazax-sine-wave.effect - 正弦波浪 Shader
    - eazax-single-color.effect - 单色（剪影）Shader
- third-party - 第三方库
- utils - 工具
  - ArrayUtil.ts - 数组工具
  - BrowserUtil.ts - 浏览器工具
  - ColorUtil.ts - 颜色工具
  - DebugUtil.ts - 调试工具
  - DeviceUtil.ts - 设备工具
  - ImageUtil.ts - 图像工具
  - MathUtil.ts - 数学工具
  - NodeUtil.ts - 节点工具
  - ObjectUtil.ts - 对象工具
  - PromiseUtil.ts - Promise 工具
  - RegexUtil.ts - 正则工具
  - RenderUtil.ts - 渲染工具
  - StorageUtil.ts - 本地储存工具
  - TimeUtil.ts - 时间工具
  - TweenUtil.ts - 缓动工具

## 环境

引擎：Cocos Creator 2.4+

编程语言：TypeScript 4.2+
