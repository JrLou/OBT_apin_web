class Control{


    bind(c1,c2,relation = true,showDown){

        if(!c1||!c2){
            return
        }
        let panel1 = c1.getPanel();
        let panel2 = c2.getPanel();
        if(!panel1||!panel2){
            return
        }
        panel1["addBind"] = (e)=>{
            if(panel2["exeBind"]){
                panel2["exeBind"](e);
            }

        };
        if(panel1["successBind"]){
            panel1["successBind"]();
        }

        if(!showDown&&relation){
            this.bind(c2,c1,relation,true)
        }

    }
}
module.exports = Control;