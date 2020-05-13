<template>
  <el-container>
    <!-- <h1>transmission</h1> -->
    <!-- 选项 -->
    <el-menu class="transmit">
      <el-menu-item index="upload" class="transmit-son">
        <i class="fal fa-arrow-alt-from-bottom"></i>
        <div class="transmit-upload up">上传</div>
      </el-menu-item>
      <el-menu-item index="download" class="transmit-son">
        <i class="fal fa-arrow-alt-from-top"></i>
        <div class="transmit-download down">下载</div>
      </el-menu-item>
    </el-menu>
    <hr>
    <el-main>
      <!-- 上传 -->
      <el-table
       v-loading="loading"
       element-loading-text="拼了老命的加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
       :data="upData"  
       class="up-checkbox">
        <el-input type="up-checks" v-model="checks"></el-input>
        <el-table-column prop="upName" label="文件名称" height="40px">
        </el-table-column>
        <el-table-column prop="upSize" label="文件大小" height="40px">
        </el-table-column>
        <el-table-column prop="upEvolve" label="上传进度" height="40px">
        </el-table-column>
        <el-table-column prop="upDate" label="上传日期" height="40px">
        </el-table-column>
        <!-- 滚动条 -->
        <GeminiScrollbar class="my-scroll-bar">
          <el-checkbox>
            <router-view />
          </el-checkbox>
        </GeminiScrollbar>
      </el-table>

      <!-- 下载 -->
      <div>
        <el-input type="down-checks" v-model="checks"></el-input>
          <el-table :data="blogData" style="100%">
          <el-table-column prop="downName" label="文件名称" height="40px" width="20%">
          </el-table-column>
          <el-table-column prop="downSize" label="文件大小" height="40px" width="10%">
          </el-table-column>
          <el-table-column prop="downEvolve" label="下载进度" height="40px" width="30%">
          </el-table-column>
          <el-table-column prop="downDate" label="下载日期" height="40px" width="30%">
          </el-table-column>
        </el-table>
        <!-- 滚动条 -->
        <GeminiScrollbar class="my-scroll-bar">
          <el-checkbox>
            <router-view />
          </el-checkbox>
        </GeminiScrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script>
function changeStyle(){
  var obj = document.getElementsByClassName("up");
  obj.style.cssText="background-color: #FFDA89;color:#505559;border:0px;"
}

var GeminiScrollbar = require('gemini-scrollbar')
var myScrollbar = new GeminiScrollbar({
    element: document.querySelector('.my-scrollbar')
}).create();
export default {
  data(){
    return {
      upData : [{
        upName:'文件1',
        upSize:'120M',
        upEvolve:' ',
        upDate:'2020-10-03'
      }, {
        upName:'文件2',
        upSize:'12M',
        upEvolve:' ',
        upDate:'2020-10-03'
      }, {
        upName:'文件3',
        upSize:'13M',
        upEvolve:' ',
        upDate:'2020-10-03'
      }, {
        upName:'文件4',
        upSize:'14M',
        upEvolve:' ',
        upDate:'2020-10-03'
      }
      ],
      loading:false
    };
  }
}
</script>

<style lang="less" scoped>
.transmit {
  height: 100px;
  width: 100%;
}
.transmit-son {
  height: 100%;
  width: 50px;
  border: 1px solid #BBBBBB;
  background-color: #ffffff;
  color:#969EA2;
}
.transmit-son:hover{
  border:0px;
  background-color: #FFDA89;
  color:#505559;
}
.transmit-son>i{
  size: 25px;
  color:#969EA2;
}
.transmit-son>i:hover{
  color:#505559;
}
.my-scroll-bar{
  height: 100%;
}
.gm-scrollbar.-vertical {
  background-color: rgb(207, 207, 207);
}
.gm-scrollbar.-horizontal {
  background-color: rgb(207, 207, 207);
}
.gm-scrollbar .thumb {
  background-color: rgb(159, 159, 160);
}
.gm-scrollbar .thumb:hover {
  background-color: rgb(53, 52, 52);
}
</style>