# Glass Reflection

用 React + Tailwind CSS + Framer Motion 搭建一个玻璃制品品牌官网，单页滚动式，要求如下：

【品牌信息】

- 品牌名：[你的品牌名]

- 定位：高端手工玻璃制品/艺术玻璃

- 主色调：纯黑 #000000 + 纯白 #FFFFFF + 玻璃折射感的淡蓝色渐变 #E8F4FD → #B8D8E8

- 字体：标题用 Playfair Display（衬线体，体现高级感），正文用 Inter

【页面结构（从上到下）】

1. Hero 首屏：全屏黑色背景，品牌名大字居中，副标题"光与玻璃的对话"，

   背景有一个缓慢旋转的 3D 玻璃球体效果（用 CSS 径向渐变模拟）

2. 品牌理念区：左图右文，图片是玻璃制品特写，文字讲述品牌故事

3. 产品展示区：3-4 个产品卡片，每个卡片是玻璃拟态风格（backdrop-filter: blur），

   鼠标悬停时卡片微微放大 + 边框发出淡蓝色光晕

4. 工艺流程区：时间轴样式，展示"设计→吹制→退火→质检"四个步骤，

   滚动到每个步骤时触发淡入动画

5. 联系/询价区：简洁表单 + 联系方式

【交互要求】

- 全局平滑滚动（smooth scroll）

- 每个区块在进入视口时触发上移+淡入动画（stagger 效果）

- 导航栏滚动时变为半透明磨砂玻璃效果

- 产品卡片 hover 时有 3D 轻微倾斜效果（perspective + rotateX/Y）

- 首屏文字逐字飞入动画

【技术要求】

- 响应式设计，移动端优先

- 所有产品图片先用占位图（placeholder），我后续替换

- 不使用任何第三方 UI 组件库，纯 Tailwind 手写样式

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/528d1ebb-0f79-452e-92f0-d8b417d00395).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
