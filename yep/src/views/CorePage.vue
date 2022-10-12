<template>
  <div class="login-wrap">

    <div class="login-box">
      <el-form :rules="rules"
               v-loading = "loading"
               element-loading-text="正在计算中，请稍后..."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0,0,0,0.8)"
               ref="otherinfo"
               :model="otherinfo"
               class="loginContainer">

        <h3 class="loginTitle">国航行李托运计算系统</h3>

        <el-form-item>
          <div class="type">
            座舱类型：<el-select  v-model="otherinfo.seat" slot="prepend" placeholder="请选择" style="width:80%" @change="check(otherinfo.seat)" >
              <el-option label="头等舱" value="1"></el-option>
              <el-option label="公务舱" value="2"></el-option>
              <el-option label="经济舱" value="3"></el-option>
              <el-option label="悦享经济舱" value="4"></el-option>
              <el-option label="超级经济舱" value="5"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="type2">
            旅客类型：<el-select v-model="otherinfo.passenger" slot="prepend" placeholder="请选择" style="width:80%">
            <el-option label="成人票" value="1"></el-option>
            <el-option label="儿童票" value="2"></el-option>
            <el-option label="婴儿票" value="3"></el-option>
          </el-select>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="type2">
            旅客身份：<el-select v-model="otherinfo.status" slot="prepend" placeholder="请选择" style="width:80%">
            <el-option label="普通会员" value="0"></el-option>
            <el-option label="凤凰知音白金卡" value="1"></el-option>
            <el-option label="凤凰知音金卡" value="2"></el-option>
            <el-option label="凤凰知音银卡" value="3"></el-option>
            <el-option label="星空联盟金卡" value="4"></el-option>
          </el-select>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="type3">
            <el-button type="text"  @click="showRules3= true">区域类型：</el-button><el-select v-model="otherinfo.area" slot="prepend" placeholder="请选择" style="width:80%">
            <el-option label="国内航班（不含港澳台）" value="0"></el-option>
            <el-option label="国际区域一" value="1"></el-option>
            <el-option label="国际区域二" value="2"></el-option>
            <el-option label="国际区域三" value="3"></el-option>
            <el-option label="国际区域四" value="4"></el-option>
            <el-option label="国际区域五" value="5"></el-option>
          </el-select>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="type3">
                当日直达普通经济仓票价：
                <el-input placeholder="经济舱机票价格（限数字）" v-model="otherinfo.price" style="width:55%"
                         oninput="if(value>100000)value=100000;value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="number">
            <el-button type="success" style="margin-left: 15px" @click="drawer = true" >编辑行李信息</el-button>
            <el-button type="primary" style="margin-left: 50px" @click="calculate">开始计算</el-button>
          </div>
        </el-form-item>


      </el-form>
    </div>
  </div>

  <el-drawer v-model="drawer" title="I am the title" :with-header="false">


        <div class="hig2"> <el-button type="primary" plain @click="showRules1 = true">普通行李(不含可随身携带的行李)</el-button></div>
        <el-table :data="simpleBaggageList" style="width: 100%" max-height="400" border  stripe >
          <el-table-column prop="weight" style="width: 10%" label="重量(kg)"  />
          <el-table-column prop="length" style="width: 10%" label="长度(cm)" />
          <el-table-column prop="width" style="width: 10%" label="宽度(cm)" />
          <el-table-column prop="height" style="width: 10%" label="高度(cm)" />
          <el-table-column fixed="right" label="操作" style="width: 10%">
            <template #default="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, simpleBaggageList)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="dialogVisible3 = true">添加行李</el-button>

        <div class="hig"><el-button type="danger" plain @click="showRules2 = true">特殊行李(不含可免费托运的行李)</el-button></div>
        <el-table :data="specialBaggageList" style="width: 100%" max-height="400" border  stripe>
          <el-table-column prop="type" label="类别" style="width: 10%"/>
          <el-table-column prop="weight" style="width: 10%" label="重量(kg)"/>
          <el-table-column fixed="right" label="操作" style="width: 10%">
            <template #default="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, specialBaggageList)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="dialogVisible = true">添加行李</el-button>


    <el-dialog v-model="dialogVisible" title="新增特殊行李" width="20%" :before-close="handleClose">
      <el-form :model="baggage"  width="100%">
        <el-form-item label="行李类型">
          <el-select v-model="baggage.type" placeholder="请选择行李类型" style="width: 100%">
            <el-option label="运动器械器具第一类" value="1"></el-option>
            <el-option label="运动器械器具第二类" value="2"></el-option>
            <el-option label="运动器械器具第三类" value="8"></el-option>
            <el-option label="其它第一类" value="3"></el-option>
            <el-option label="其它第二类" value="4"></el-option>
            <el-option label="其它第三类" value="5"></el-option>
            <el-option label="其它第四类" value="6"></el-option>
            <el-option label="其它第五类" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重量(kg)">
          <el-input v-model="baggage.weight" placeholder="请输入" type="number" oninput="if(value>45)value=45;if(value.length>2)value=value.slice(0,2);if(value<2)value=2"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="AddSpecialBaggage(baggage)">确定</el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible3" title="新增行李" width="20%" :before-close="handleClose">
      <el-form :model="baggage"  width="100%" >
        <el-form-item label="重量(kg)" prop="weight">
          <el-input v-model="baggage.weight" placeholder="请输入2KG~32KG之间"  type="number" oninput="if(value>32)value=32;if(value.length>2)value=value.slice(0,2);if(value<2)value=2" />
        </el-form-item>
        <el-form-item label="长度(cm)" prop="length">
          <el-input v-model="baggage.length" placeholder="请输入"  type="number" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="宽度(cm)" prop="width">
          <el-input v-model="baggage.width" placeholder="请输入" type="number" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="高度(cm)" prop="height">
          <el-input v-model="baggage.height" placeholder="请输入" type="number" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="AddBaggage(baggage)">确定</el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="showRules1" title="可随时携带的行李规则" width="20%" >
      <template #default>
      <div class="rules1"></div>
      </template>
    </el-dialog>

    <el-dialog v-model="showRules2" title="特殊行李规则" width="33%" >
      <template #default>
        <div class="rules2-1"></div>
        <div class="rules2-2"></div>
      </template>
    </el-dialog>

  </el-drawer>

  <el-dialog title="请选择是否在以下区域" v-model="dialogVisible2" width="45%" :before-close="handleClose">
    <template #default>
        <el-form  class="align" width="100%">
         <el-form-item>
             <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="1">夏威夷与美洲、加勒比地区、欧洲、非洲、中东、亚洲、西南太平洋之间的航线</el-radio>
         </el-form-item>
          <el-form-item>
            <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="2">欧洲、非洲与亚洲（除日本、巴基斯坦、新加坡、哈萨克斯坦外）之间的航线</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="3">亚洲内（除日本、巴基斯坦、新加坡、哈萨克斯坦外）之间的航线</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="4">美洲、加勒比地区（除夏威夷）与欧洲、非洲、中东、亚洲、西南太平洋之间的航线</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="5">中东与欧洲、非洲、亚洲、西南太平洋之间的航线</el-radio>
          </el-form-item>
          <el-form-item>
          <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="6">日本、巴基斯坦、新加坡、哈萨克斯坦、西南太平洋与欧洲、非洲、亚洲
          （除日本、巴基斯坦、新加坡、哈萨克斯坦外）之间的航线</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio class="align" v-model="otherinfo.markForEconmyclass" label="7">其它的航线</el-radio>
          </el-form-item>
        </el-form>
         <div class="tip">(注：亚洲含中国大陆及港澳台地区，不含中东、西南太平洋）</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="extraInfo">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="showRules3" title="地区划分" width="33%" >
    <template #default>
      <el-form  class="align" width="100%">
        <el-form-item>
            <el-radio disabled v-model="radio" label="禁用">区域一：美洲（除美国/加拿大外）/加勒比海地区与欧洲/非洲/中东/亚洲/西南太平洋之间的航线</el-radio>
        </el-form-item>
        <el-form-item>
            <el-radio disabled v-model="radio" label="禁用"><p>区域二：欧洲/中东与非洲/亚洲/西南太平洋之间航线；日本与西南太平洋之间航线；日本/西南太<br/>平洋与亚洲（不含日本及西南太平洋）/非洲之间的航线</p></el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio disabled v-model="radio" label="禁用">区域三：加拿大与美洲（除美国/加拿大外）/加勒比海地区/欧洲/非洲/中东/亚洲/西部太平洋之间航线</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio disabled v-model="radio" label="禁用">区域四：美国（含夏威夷）与美洲（除美国外）/加勒比海地区/欧洲/非洲/中东亚洲/西南太平洋之间航线</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio disabled v-model="radio" label="禁用">区域五：非洲与亚洲（除日本外）之间航线；欧洲与中东之间航线；亚洲（除日本）内航线；美洲（除美国/加拿大）及加勒比海地区内航线；上述未列明的航线</el-radio>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>

  <el-dialog title="提示" :visible.sync="dialogVisibleForResult" width="30%" :before-close="handleClose">
    <span>托运费{this.result}</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleForResult = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisibleForResult = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {getRequest, postRequest} from "@/Utils/api";
import post from "@/views/sys/post";

class SpecialItem {
  constructor(type, weight) {
    this.type = type;
    this.weight =weight;
  }
}
class SimpleItem {
  constructor( weight, width, height, length) {
    this.weight =weight;
    this.width= width;
    this.height =height;
    this.length=length;
  }
}
class data{
  constructor(area,markForEconmyclass, passenger, price,seat,status) {
    this.area=area;
    this.markForEconmyclass=markForEconmyclass;
    this.passenger=passenger;
    this.price=price;
    this.seat=seat;
    this.status=status;
  }
}
class info{
  constructor(data,simpleBagageDataList,specialBagageDataList) {
    this.data=data;
    this.simpleBagageDataList=simpleBagageDataList;
    this.specialBagageDataList=specialBagageDataList;
  }
}
export default {
  name: "CorePage",
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      dialogVisibleForResult:false,
      showRules1:false,
      showRules2:false,
      showRules3:false,
      baggage:{
        type:"",
        weight:"",
        width:"",
        height:"",
        length:""
      },
      simpleBaggageList:[],
      specialBaggageList:[],
      otherinfo:{
        seat:"",
        passenger:"",
        status:"",
        area:"",
        price:"",
        markForEconmyclass:"0"
      },
      result:"",
    }
  },
  methods:{
  handleClose(done) {
    this.$confirm('确认关闭？').then(_ => {done();}).catch(_ => {});
  },
  AddBaggage(baggage){
    if( Number(baggage.width)+ Number(baggage.length)+ Number(baggage.height)>208){
      this.$message.error('行李尺寸不能大于208cm');
    }else if( Number(baggage.width)+ Number(baggage.length)+ Number(baggage.height)<60){
      this.$message.error('行李尺寸不能小于60cm');
    }else{
      var temp=new SimpleItem(baggage.weight,baggage.width,baggage.height,baggage.length)
      this.simpleBaggageList.push(temp);
      baggage.type="";
      baggage.weight="";
      baggage.length="";
      baggage.width="";
      baggage.height="";
    }
  },
  AddSpecialBaggage(baggage){
    if((baggage.type==="4"||baggage.type==="5"||baggage.type==="7")&&Number(baggage.weight)>32){
      this.$message.error('其它类行李不得超过32KG');
    }else if(baggage.type==="6"||Number(baggage.weight)>5){
      this.$message.error('枪支弹药不得超过5KG');
    }else{
    var temp=new SpecialItem(baggage.type,baggage.weight)
    this.specialBaggageList.push(temp);
    baggage.type="";
    baggage.weight="";
    baggage.length="";
    baggage.width="";
    baggage.height="";
    }
  },
  deleteRow(index, rows) {
    rows.splice(index, 1);
  },
  check(){
    if(this.otherinfo.seat==="4"){
      this.dialogVisible2=true;
    }
  },
  calculate(){
    if(this.otherinfo.seat===""||this.otherinfo.seat===""||this.otherinfo.status===""||this.otherinfo.area===""||this.otherinfo.price===""){
      this.$message.error('请输入所有字段！');
    }else {
      this.$refs.otherinfo.validate((valid) => {
        if (valid) {
          //this.loading = true;
          var temp1 = new data(this.otherinfo.area, this.otherinfo.markForEconmyclass
              , this.otherinfo.passenger, this.otherinfo.price, this.otherinfo.seat, this.otherinfo.status);
          var temp2 = new info(temp1, this.simpleBaggageList, this.specialBaggageList);
          postRequest('/plane/compute', temp2).then(resp => {

          })
        } else {
          this.loading = false;
          //this.$message.error('请输入所有字段！');
          this.$message.error(this.otherinfo.price + " " + this.otherinfo.status + " " + this.otherinfo.seat + " " + this.otherinfo.passenger + " " + this.otherinfo.area);
          return false;
        }
      });
    }
  }

  }
}
</script>

<style>
.login-wrap{
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  background-position: left top;
  background-color: #243;
  color: #cbe7e7;
  position: relative;
  background-image: url(.././assets/plane2.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
.login-box{
  width:800px;
  height:400px;
  top:40%;
  left:50%;
}
.loginContainer{
  border-radius:15px;
  background-clip:padding-box;
  /*margin:180px auto;  会让登录框位于页面底部，于是删掉*/
  width:20% ;
  height: 38%;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  padding: 15px 35px 15px 35px;
  background: #cbd6e7;
  border:1px solid #cbe7e7;
  box-shadow:0 0 25px #a7c8d7;
  opacity:0.9;
}
.loginTitle{
  margin:0 auto 40px auto;
  text-align:center;
  width: 100%;
  line-height: 70px;
  font-size: 20px;/*图像处理系统的大小*/
  font-family: 宋体,serif;
  color: #0b4d4d;/*图像处理系统的颜色*/
  border-bottom: 1px solid ;/*分割线的颜色*/
}
img {
  vertical-align: middle;
}
.number{
  font-family: 宋体,serif;
  color: #0972df;/*图像处理系统的颜色*/
  width: 100%;
}
.type{
  font-family: 宋体,serif;
  color: #0972df;/*图像处理系统的颜色*/
  width: 100%;
}
.type2 {
  font-family: 宋体, serif;
  color: #0972df; /*图像处理系统的颜色*/
  width: 100%;
}
.type3{
  font-family: 宋体,serif;
  color: #0972df;/*图像处理系统的颜色*/
  width: 100%;
}
.align{
  margin-left: 0;
}
.tip{
  font-family: 宋体, serif;
  color: #df0909; /*图像处理系统的颜色*/
}
.hig{
  margin-top: 50px;
  font-family: 粗体,serif;
  color: #e00e0e;
  font-size: 20px;/*图像处理系统的大小*/
  margin-bottom: 10px;
}
.hig2{
  font-family: 粗体,serif;
  color: #091edf;/*图像处理系统的颜色*/
  font-size: 20px;/*图像处理系统的大小*/
  margin-bottom: 10px;
}
.rules1{
  width:35vh;
  padding: 0;
  margin: 0;
  height:18vh;
  font-size: 16px;
  background-position: left top;
  background-color: #243;
  color: #cbe7e7;
  position: relative;
  background-image: url(.././assets/rules1.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
.rules2-1{
  width:60vh;
  padding: 0;
  margin: 0;
  height:40vh;
  font-size: 16px;
  background-position: left top;
  background-color: #243;
  color: #cbe7e7;
  position: relative;
  background-image: url(.././assets/rules2-1.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
.rules2-2{
  width:60vh;
  padding: 0;
  margin: 0;
  height:40vh;
  font-size: 16px;
  background-position: left top;
  background-color: #243;
  color: #cbe7e7;
  position: relative;
  background-image: url(.././assets/rules2-2.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
</style>