import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router";



//请求拦截器
axios.interceptors.request.use(config=>{
    //如果存在token，请求携带token
    if (window.sessionStorage.getItem('tokenStr')){
        config.headers['Authorization']=window.sessionStorage.getItem('tokenStr');
    }
    return config;
},error=>{
    console.log(error);
})

axios.interceptors.response.use(success=> {
    if (success.status && success.status === 200) {
        if (success.data.code === 500 || success.data.code === 401 || success.data.code === 403) {
            ElMessage.error({message: success.data.message});
            return;
        }
        if (success.data.message) {
            ElMessage.success({message: success.data.message});
        }
    }
    return success.data;
},error => {
    if(error.response.code===504||error.response.code===404){
        ElMessage.error({message:'服务器被吃了'});
    }
    else if(error.response.code===403){
        ElMessage.error({message:'权限不足，请联系管理员'});
    }
    else if(error.response.code===401){
        ElMessage.error({message:'尚未登录，请登录'});
        this.$router.push({push:'/', replace: true}).then(r  =>{})
    }
    else{
        if(error.response.data.message){
            ElMessage.error({message:error.response.data.message});
        }
        else{
            ElMessage.error({message:'未知错误'});
        }
    }

})


let base = '';      //ylm
//传送json格式的post请求
export const postRequest=(url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params
    })
}
//
// export const postingRequest=(url,params,body)=>{     //zjr专用post请求
//     return axios({
//         method:'post',
//         url:`${base}${url}`,
//         data:body,
//         params:params
//     })
// }

//传送json格式的put请求
export const putRequest=(url,params)=>{
    return axios({
        method:'put',
        url:`${base}${url}`,
        data:params
    })
}
//传送json格式的get请求
export const getRequest=(url,params)=>{
    return axios({
        method:'get',
        url:`${base}${url}`,
        // data:params,
        params:params
    })
}

//传送json格式的delete请求
export const deleteRequest=(url,params)=>{
    return axios({
        method:'delete',
        url:`${base}${url}`,
        data:params
    })
}

export const getEmailCode=(url,params)=> {
    return axios({
        url: `${base}${url}`,
        method: 'POST',
        data:params,
       // contentType:"application/json;charset=utf-8",
       // dataType:'json',
        //email
    })
}

/*
export const getEmailCode=((email)=>{
    return request({
        url:'/mail',
        method:'post',
        data:'email'
        //email
    })
})*/