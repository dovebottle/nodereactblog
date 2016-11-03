#### 开启mongodb
``` mongod --dbpath=d:/Mongodb/data/db ```（对应你的安装目录）
``` mongo ```（在另一终端开启）

#### 开启node
``` npm start ``` 服务端场景（修改model、route重启服务器；修改css热插拔；修改其他文件刷新浏览器）<br>
``` npm run browsersync ``` 页面场景（修改route、app需要手动重启；修改css热插拔；修改model与其他文件刷新浏览器）<br>
``` npm run build ``` 打包文件<br>
``` npm run production ``` 线上场景<br>