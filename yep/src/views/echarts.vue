<template>
<div class="main_container">
 <div>
   <el-card style="width:1200px;margin-left: 130px;" >
     <div class="block">
       <label ><H4>查询每日成交信息</H4></label>
        <span class="demonstration" style="margin-left: 5px">选择查询日期 </span>
        <el-input v-model="selectDate.date" placeholder="1999/11/23" style="width: 200px;"></el-input>
        <el-button style="margin-left: 10px;margin-right: 30px;" @click="selectInfo">查询</el-button>
        <label style="margin-left: 10px;"> 成交量(股)</label>
          <el-input v-model="selectInfos.turnover" placeholder="成交量" style="width: 100px;"></el-input>
          <label style="margin-left: 10px;">成交金额(元)</label>
          <el-input v-model="selectInfos.tradingVolume" placeholder="成交金额" style="width: 100px;"></el-input>
     </div>
     <div>
       <label><H4>折线走势展示图</H4></label>

       <el-button @click="beforePriceShow" >前收盘价走势图</el-button>
       <el-button @click="openPriceShow" style="margin-left: 30px">开盘价走势图</el-button>
       <el-button @click="topPriceShow" style="margin-left: 30px">最高价走势图</el-button>
       <el-button @click="closingPriceShow" style="margin-left: 30px">收盘价走势图</el-button>
       <el-button @click="bottomPriceShow" style="margin-left: 30px">最低价走势图</el-button>
       <el-button @click="drawLine" style="margin-left: 30px">折线走势图</el-button>
       <div
           ref="myChart"
           id="myChart"
           :style="{ width: '1200px', height: '400px'}"
       ></div>
     </div>
     <div>
       <label><H4>上证指数展示图</H4></label>
       <el-button type="primary" @click="calucator">上证指数</el-button>
       <div
           ref="myChart1"
           id="myChart1"
           :style="{ width: '1200px', height: '400px'}"
       ></div>
     </div>
   </el-card>
 </div>
</div>


</template>

<script>
import {getRequest} from "@/Utils/api";
import {log} from "qrcode/lib/core/galois-field";

export default {
  name: "echarts",
  // mounted() {
  //  this.drawLine()
  // },
  mounted() {
    this.getInfo()
    this.calucator()
  },
  data() {
    return {
      turnover:'',
      tradingVolume:'',
      selectInfos:{
        turnover:'',
        tradingVolume:'',
      },
      selectDate:{
        date:''
      },
      Info:[
        {
          bottomPrice:''
        },
          {
        date:''
      },
        {
          beforePrice:'',
        },
        {
          openPrice:'',
        },
        {
          topPrice:'',
        },
        {
          closingPrice:'',
        },

      ],
      beforePrice:[],
      date:[],
      openPrice:[],
      topPrice:[],
      closingPrice:[],
      bottomPrice:[],

      shangzheng:[
        {
          date:''
        },
        {
          index:''
        }
      ],
      sdate:[],
      index:[]
    }

    },
  methods: {

    getInfo() {
      let date = []
      let be = []
      let open = []
      let top = []
      let bottom = []
      let close = []
      getRequest("/banker/getGraphInfo").then(resp => {
        if (resp) {
          this.Info = resp;
          this.Info.map((item) => {
            be.push(item.beforePrice - 0)
            open.push(item.openPrice - 0)
            top.push(item.topPrice - 0)
            bottom.push(item.bottomPrice - 0)
            close.push(item.closingPrice - 0)
            date.push(item.date)
          })
          this.beforePrice = be
          this.openPrice = open
          this.date = date
          this.topPrice = top
          this.bottomPrice = bottom
          this.closingPrice = close
        }
      })
    },
    drawLine() {
      // this.getInfo()
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        xAxis: {
          name: "日期",
          type: 'category',
          data: this.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: "前收盘价",
            data: this.beforePrice,
            type: 'line',
            smooth: true
          },
          {
            name: "开盘价",
            data: this.openPrice,
            type: 'line',
            smooth: true
          },
          {
            name: "最高价",
            data: this.topPrice,
            type: 'line',
            smooth: true
          },
          {
            name: "最低价",
            data: this.bottomPrice,
            type: 'line',
            smooth: true
          },
          {
            name: "收盘价",
            data: this.closingPrice,
            type: 'line',
            smooth: true
          }
        ],

      };
      // 设置实例参数
      myChart.setOption(option);


    },
    selectInfo() {
      getRequest("/banker/getDailyInfo", this.selectDate).then(resp => {
        console.log(this.selectDate)
        if (resp) {
          this.selectInfos = resp;
          console.log(this.selectDate.date)
          console.log(this.selectInfos)
        }

      })
    },
    beforePriceShow() {

      console.log(this.beforePrice)
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        title: {
          text: '前收盘价(元)',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          name: '时间',
          data: this.date
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {

            data: this.beforePrice,
            type: 'line',
            smooth: true
          }
        ]

      }
      myChart.setOption(option);

    },


    openPriceShow() {
      this.getInfo()
      console.log(this.openPrice)
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        title: {
          text: '开盘价(元)',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          name: '时间',
          data: this.date
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {

            data: this.openPrice,
            type: 'line',
            smooth: true
          }
        ]
      }
      myChart.setOption(option);

    },


    topPriceShow() {
      console.log(this.openPrice)
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        title: {
          text: '最高价(元)',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          name: '时间',
          data: this.date
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            data: this.topPrice,
            type: 'line',
            smooth: true
          }
        ]

      }
      myChart.setOption(option);
    },
    closingPriceShow() {
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        title: {
          text: '收盘价(元)',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          name: '时间',
          data: this.date
        },
        yAxis: {
          name: '收盘价(元)',
          type: 'value'
        },
        series: [
          {
            data: this.closingPrice,
            type: 'line',
            smooth: true
          }
        ]

      }
      myChart.setOption(option);
    },
    bottomPriceShow() {
      console.log(this.openPrice)
      const dom = this.$refs['myChart'];
      const myChart = this.$echarts.init(dom); // 初始化echarts实例
      const option = {
        title: {
          text: '最低价(元)',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },

        xAxis: {
          name: '时间',
          data: this.date
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            data: this.bottomPrice,
            type: 'line',
            smooth: true
          }
        ]

      }
      myChart.setOption(option);
    },
    calucator() {

      const data=this.Info.map((item)=>{
        return [+item.openPrice,+item.closingPrice,+item.bottomPrice,+item.topPrice];
      })
      console.log(data)
      let sdate = []
      let index = []
      getRequest("/banker/getTrade").then(resp => {
        if (resp) {
          this.shangzheng = resp
          this.shangzheng.map((item) => {
            sdate.push(item.date)
            index.push(item.index - 0)
          })
          this.sdate = sdate
          this.index = index
          const dom1 = this.$refs['myChart1'];
          const myChart1 = this.$echarts.init(dom1); // 初始化echarts实例
          const option = {
            title: {
              text: '上证指数',
              left: 0
            },
            legend: {
              data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '15%'
            },

            xAxis: {
              name: '时间',
              type: 'category',
              data: this.sdate,
              scale: true,
              boundaryGap: false,
              axisLine: {onZero: false},
              splitLine: {show: false},
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax'

            },
            yAxis: {
              scale: true,
              splitArea: {
                show: true
              },
            },
            dataZoom: [
              {
                type: 'inside',
                start: 50,
                end: 100,
              },
              {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
              }
            ],
            series: [
              {
                name: '日K',
                type: 'candlestick',
                data: data,
                itemStyle: {// 对象样式
                  normal: {
                    color: '#FD1050',
                    color0: '#0CF49B',
                    borderColor: '#FD1050',
                    borderColor0: '#0CF49B'
                  }
                }
              },

              {
                name: 'MA5',
                type: 'line',
                data:   this.calculateMA(5,data),
                smooth: true,
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA10',
                type: 'line',
                data: this.calculateMA(10,data),
                smooth: true,
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA20',
                type: 'line',
                data: this.calculateMA(20,data),
                smooth: true,
                lineStyle: {
                  opacity: 0.5
                }
              },
              {
                name: 'MA30',
                type: 'line',
                data: this.calculateMA(30,data),
                smooth: true,
                lineStyle: {
                  opacity: 0.5
                }
              },
            ],
            Chart1: null,
            candleDate: {
              categoryData: [],
              values: []
            }
          }

          myChart1.setOption(option);
        }
      })
    },

    calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data[i - j][1]
        }
        result.push(sum / dayCount)
      }
      return result
    }
  }

}
</script>

<style scoped>
.main_container {
  background-color: #eef1e1;
}
</style>