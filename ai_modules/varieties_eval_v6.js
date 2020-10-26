function varieties_eval_v3(location, evalType, startDate) {
    /* input
    location: {
        parish: String,
        district: String,
        province: String,
        latt: String, // or Number
        long: String, // or Number
    },
    startDate: Date,
    evalType: String // 1 : กำไรสูงสุด, 2 ต้นทุนต่ำสุด, 3ํํํ เลือกพันธ์เอง
    */

    /*
    Return code type
    1 = เริ่มปลูกข้าว
    2 = เก็บเกี่ยวข้าว
    3 = ให้น้ำ 3 cm
    4 = ให้น้ำ 7 cm
    5 = ให้น้ำ 10 cm
    6 = ระบายน้ำออก
    7 = กำจัดวัชพืช
    8 = ตัดพันธ์ปน
    9 = ใส่ปุ๋ยสูตร 16-20-0
    10 = ใส่ปุ๋ยสูตร 21-0-0
    11 = ระวัโรคไหม้ข้าว
    12 = ระวังเพลี้ยกระโดดสีน้ำตาล
    13 = เตือนภัยแล้ง
    14 = เตือนภัยน้ำท่วม
    */

    /*
    array_code[0] = [1,3];
    array_code[1] = [7];
    array_code[2] = [8];
    array_code[3] = [9];
    array_code[4] = [4];
    array_code[5] = [4];
    array_code[6] = [4];
    array_code[7] = [4,7,8];
    array_code[8] = [4];
    array_code[9] = [4];
    array_code[10] = [6];
    array_code[11] = [5,10];
    array_code[12] = [5];
    array_code[13] = [5,8];
    array_code[14] = [5];
    array_code[15] = [5,8];
    array_code[16] = [5];
    array_code[17] = [5];
    array_code[18] = [6,8];
    array_code[19] = [2];
    */

 var location = {
    parish: 'a',
    district: 'b',
    province: 'c',
    latt: 'd',
    long: 'e',
};
var startDate =  new Date();
var evalType = "1";

// main
//เลือกโหมด --------------------------------------------------------------------
var mode = evalType;
// กำไรสูงสุด
if (mode == "1") {
/*
  ai อ่านข้อมูลจาก database ได้พันธ์ข้าว 5 พันธ์ที่ดีที่สุด
*/
var rice_varieties = String[2];
rice_varieties = ["กข1","กข50"];
}
// ต้นทุนต่ำสุด
else if (mode == "2") {
/*
  ai อ่านข้อมูลจาก database ได้พันธ์ข้าว 5 พันธ์ที่ดีที่สุด
*/
var rice_varieties = String[2];
rice_varieties = ["กข50","กข1"];
}
// เลือกพันธ์เอง > R1 : กข1 , R2 : กข50
else {
/*
  ai อ่านข้อมูลจาก database ได้พันธ์ข้าว 4 พันธ์ที่ดีที่สุด และพันธ์ข้าวที่เลือก
*/
    if (mode == "R1") {
        var rice_varieties = String[2];
        rice_varieties = ["กข1","กข50"];
    }

    else if (mode == "R2") {
        var rice_varieties = String[2];
        rice_varieties = ["กข50","กข1"];
    }

    else {
        // no
    }
}

//สร้าง time line --------------------------------------------------------------------
var province_area = location.province;

/*
  ai    สร้าง timeline จาก database ของพันธ์ข้าว 5 พันธ์ที่ดีที่สุด
*/



//data --------------------------------------
//v_list1 = ["กข1",10000,1000,15000,5000];
//v_list2 = ["กข50",7000,800,9500,2500];

varieties_list = ['กข1','กข50'];
cost_list = [10000,7000];
product_list = [1000,800];
price_list = [15000,9500];
profit_list = [5000,2500];


//set date -----------------------------------------------------------

var startDate_rice1 =  new Date();
var startDate_rice2 =  new Date();

//set date กข1 -----------------------------------------------

//day1
array_code_rice1 = [{}];
array_dat_rice1 = [{}];
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[0] = str_date;

array_code_rice1[0] = [1,3];

//day7
startDate_rice1.setDate(startDate_rice1.getDate() + 6);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[1] = str_date;

array_code_rice1[1] = [7];

//day18
startDate_rice1.setDate(startDate_rice1.getDate() + 11);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[2] = str_date;

array_code_rice1[2] = [8];

//day21
startDate_rice1.setDate(startDate_rice1.getDate() + 3);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[3] = str_date;

array_code_rice1[3] = [9];

//day27
startDate_rice1.setDate(startDate_rice1.getDate() + 6);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[4] = str_date;

array_code_rice1[4] = [4];

//day33
startDate_rice1.setDate(startDate_rice1.getDate() + 6);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[5] = str_date;

array_code_rice1[5] = [4];

//day38
startDate_rice1.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[6] = str_date;

array_code_rice1[6] = [4];

//day44
startDate_rice1.setDate(startDate_rice1.getDate() + 6);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[7] = str_date;

array_code_rice1[7] = [4,7,8];

//day48
startDate_rice1.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[8] = str_date;

array_code_rice1[8] = [4];

//day53
startDate_rice1.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[9] = str_date;

array_code_rice1[9] = [4];

//day57
startDate_rice1.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[10] = str_date;

array_code_rice1[10] = [6];

//day60
startDate_rice1.setDate(startDate_rice1.getDate() + 3);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[11] = str_date;

array_code_rice1[11] = [5,10];

//day68
startDate_rice1.setDate(startDate_rice1.getDate() + 8);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[12] = str_date;

array_code_rice1[12] = [5];

//day75
startDate_rice1.setDate(startDate_rice1.getDate() + 7);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[13] = str_date;

array_code_rice1[13] = [5,8];

//day84
startDate_rice1.setDate(startDate_rice1.getDate() + 9);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[14] = str_date;

array_code_rice1[14] = [5];

//day90
startDate_rice1.setDate(startDate_rice1.getDate() + 6);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[15] = str_date;

array_code_rice1[15] = [5,8];

//day97
startDate_rice1.setDate(startDate_rice1.getDate() + 7);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[16] = str_date;

array_code_rice1[16] = [5];

//day104
startDate_rice1.setDate(startDate_rice1.getDate() + 7);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[17] = str_date;

array_code_rice1[17] = [5];

//day109
startDate_rice1.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[18] = str_date;

array_code_rice1[18] = [6,8];

//day120
startDate_rice1.setDate(startDate_rice1.getDate() + 11);
var str_date = startDate_rice1.toISOString().slice(0,10);
array_dat_rice1[19] = str_date;

array_code_rice1[19] = [2];

//set date กข50 -----------------------------------------------

//day1
array_code_rice2 = [{}];
array_dat_rice2 = [{}];
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[0] = str_date;

array_code_rice2[0] = [1,3];

//day5
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[1] = str_date;

array_code_rice2[1] = [7];

//day14
startDate_rice2.setDate(startDate_rice1.getDate() + 9);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[2] = str_date;

array_code_rice2[2] = [8];

//day19
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[3] = str_date;

array_code_rice2[3] = [9];

//day23
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[4] = str_date;

array_code_rice2[4] = [4];

//day28
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[5] = str_date;

array_code_rice2[5] = [4];

//day33
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[6] = str_date;

array_code_rice2[6] = [4];

//day38
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[7] = str_date;

array_code_rice2[7] = [4,7,8];

//day42
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[8] = str_date;

array_code_rice2[8] = [4];

//day47
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[9] = str_date;

array_code_rice2[9] = [4];

//day52
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[10] = str_date;

array_code_rice2[10] = [6];

//day56
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[11] = str_date;

array_code_rice2[11] = [5,10];

//day60
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[12] = str_date;

array_code_rice2[12] = [5];

//day64
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[13] = str_date;

array_code_rice2[13] = [5,8];

//day69
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[14] = str_date;

array_code_rice2[14] = [5];

//day74
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[15] = str_date;

array_code_rice2[15] = [5,8];

//day78
startDate_rice2.setDate(startDate_rice1.getDate() + 4);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[16] = str_date;

array_code_rice2[16] = [5];

//day83
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[17] = str_date;

array_code_rice2[17] = [5];

//day85
startDate_rice2.setDate(startDate_rice1.getDate() + 2);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[18] = str_date;

array_code_rice2[18] = [6,8];

//day90
startDate_rice2.setDate(startDate_rice1.getDate() + 5);
var str_date = startDate_rice2.toISOString().slice(0,10);
array_dat_rice2[19] = str_date;

array_code_rice2[19] = [2];

// combine date ---------------------------------
timeline_date = [{},{}];
timeline_code = [{},{}];

num_i_date = 20
for(i_date=0;i_date<=num_i_date-1;i_date++){
    timeline_date[0][i_date] = array_dat_rice1[i_date];
    timeline_date[1][i_date] = array_dat_rice2[i_date];

    timeline_code[0][i_date] = array_code_rice1[i_date];
    timeline_code[1][i_date] = array_code_rice2[i_date];
}

console.log("time date")
console.log(timeline_date)
console.log(timeline_code)
console.log("time date end")

// process ------------------------------------
if (varieties_list.length = 2) {
    var output_v1 = [{},{}];
    var timeline = [{}];
}
else {
    console.log('error')
}


num_i = varieties_list.length;
num_j = 20;

//สร้าง output --------------------------------------------------------------------

for(i=0;i<=num_i-1;i++){

    // generate time line
    for(j=0;j<=num_j-1;j++){
        if (timeline_code[i][j].length = 1){
            timeline[j] = 
            {
                activitiesDate: timeline_date[i][j],
                activities: [
                    {
                      code: timeline_code[i][j][0],
                      active: false,
                    },
                  ],
             };
        }
        else if (timeline_code[i][j].length = 2){
            timeline[j] = 
            {
                activitiesDate: timeline_date[i][j],
                activities: [
                    {
                      code: timeline_code[i][j][0],
                      active: false,
                    },
                ],
                activities: [
                    {
                      code: timeline_code[i][j][1],
                      active: false,
                    },
                ],
             };
        }
        else if (timeline_code[i][j].length = 3){
            timeline[j] = 
            {
                activitiesDate: timeline_date[i][j],
                activities: [
                    {
                      code: timeline_code[i][j][0],
                      active: false,
                    },
                ],
                activities: [
                    {
                      code: timeline_code[i][j][1],
                      active: false,
                    },
                ],
                activities: [
                    {
                      code: timeline_code[i][j][2],
                      active: false,
                    },
                ],
             };
        }
        else {
            // etc
        }
        
    }

    // generate output
    for(j=0;j<=num_j-1;j++){
          output_v1[i] =
          {
              varieties: varieties_list[i],
              evalproduct: {
                  cost: {
                      value: cost_list[i],
                      enum: "1",
                  },
                  product: {
                      value: product_list[i],
                      enum: "1",
                  },
                  price: {
                      value: price_list[i],
                      enum: "1",
                  },
                  profit: {
                      value: profit_list[i],
                      enum: "1",
                  },
              },
              timeline
          };   
    }  
    
}  

console.log(timeline)

return output_v1;

}
