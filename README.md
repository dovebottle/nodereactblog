#### 开启mongodb
``` mongod --dbpath=d:/Mongodb/data/db ```（对应你的安装目录）<br>
``` mongo ```（在另一终端开启,操作数据库）

#### 开启node
``` npm run build ``` 打包dll文件供开发场景使用<br>
``` npm start ``` 服务端场景（修改model、route重启服务器；修改css热插拔；修改其他文件刷新浏览器）<br>
``` npm run browsersync ``` 页面场景（修改route、models、app需要手动重启；修改css热插拔；修改model与其他文件刷新浏览器）<br>
``` npm run build ``` 打包文件,方便查看具体的打包状态<br>
``` npm run production ``` 线上场景<br>