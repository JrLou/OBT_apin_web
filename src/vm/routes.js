/**
 * Created by lixifeng on 17/10/12.
 */

module.exports  = {

   getData(count = 10){
       let arr = [];
       for(let i =0;i<count;i++ ){
           arr.push({
               from:"北京"+i,
               to:"天津"+i,
               money:((i+1)*Math.random()*10+200).toFixed(0),
               views:Math.random().toFixed(1)*100,
               image:'/images/vm/xiangg.jpg',
               image2:'/images/vm/xiangg2.jpg',
               time:new Date().toString()
           })
       }
       return arr
   }
}