# 变更日志

规范参考：[Conventional Commits](https://conventionalcommits.org)

# 1.0.0 (2020-04-29)


### 功能

* hello world :) ([d041845](https://github.com/PachVerb/yunjv/commit/d04184524036b45f38b1f100d0b13d132f8541ad))


### 持续集成

* **github-actions:** 为单元测试添加 IS_TEST 环境变量 ([cfbd85e](https://github.com/PachVerb/yunjv/commit/cfbd85ea77d30052863e8376aa03f352c5196ad6))
* **github-actions:** 使用 .env.local 文件注入环境变量 ([7b52e79](https://github.com/PachVerb/yunjv/commit/7b52e796b4518cb795eb3b88b85d7705f129d3ca))
* **github-actions:** 修改为提前获得新版本号 ([784847f](https://github.com/PachVerb/yunjv/commit/784847fcd7faae776898cfcf5611d8ad84b16998))
* **github-actions:** 暂时取消单元测试步骤 ([170ffb1](https://github.com/PachVerb/yunjv/commit/170ffb1810b8d07ad72ec251ad7988c18b01f238))
* **github-actions:** 添加 release 流水线 ([0e9dea9](https://github.com/PachVerb/yunjv/commit/0e9dea9a5fee46e3f31dafd5978318eaf629b5a9))
* **github-actions:** 添加单元测试 ([c205680](https://github.com/PachVerb/yunjv/commit/c20568078d88b0270acf7cf2aa6c30ffa89b74dc))
* **semantic-release:** 使用中文 commit type ([ffb2f5c](https://github.com/PachVerb/yunjv/commit/ffb2f5cbb9b714cef8d8d6c7da9ade06dec34b8f))


### 杂务

* 移动 browserslist 配置到 `package.json` ([3fb7551](https://github.com/PachVerb/yunjv/commit/3fb7551e9e9d866275555d95dc428b2c74f4b060))
* **git-hooks:** 添加 pre-push, 使用 eslint、jest 缓存加速 ([e2ea7b1](https://github.com/PachVerb/yunjv/commit/e2ea7b1c4a25030d7ba3c59095e18dc6ed08b413))
* **jest:** 添加 modulePathIgnorePatterns 忽略 dist 目录 ([826777b](https://github.com/PachVerb/yunjv/commit/826777bf0cbcfdd231ad7b320fd9c0bb989cca06))
* **run-scripts:** 添加 lint:strict ([eaf50d1](https://github.com/PachVerb/yunjv/commit/eaf50d1a1d44358bd10be4351adb09bbf8331286))
* 使用 vue-cli 初始化项目 ([3b5fdf8](https://github.com/PachVerb/yunjv/commit/3b5fdf8e91bfbd9322460360d7ba509fc6f0eaaa))
* 初始化 vue-cli-plugin-electron-builder ([a22ff05](https://github.com/PachVerb/yunjv/commit/a22ff05984fac9230b2ae2315fcc20642aba1c1e))
* 安装 commitizen ([0c82e15](https://github.com/PachVerb/yunjv/commit/0c82e1522b2680fc0018b0123024523435e00fbf))
* 安装 commitlint，添加 git hook `commit-msg` ([bf49de5](https://github.com/PachVerb/yunjv/commit/bf49de5b2ce0e2207f780a7c117097c6e9bcf5c2))


### 构建工具

* **peerdependencies:** webpack@4.43.0 ([1864caa](https://github.com/PachVerb/yunjv/commit/1864caadca5902bcd47c8204509c1c604416030a))
* 修改 run-scripts 的 `serve`, `build` 为 electron 版本 ([474d5a6](https://github.com/PachVerb/yunjv/commit/474d5a685099864838d71ebb85df22e173b05869))


### 格式

* 自定义 lint 配置 ([2c25056](https://github.com/PachVerb/yunjv/commit/2c25056ea2c934c865da2569f4bdaa24bb29b04f))
