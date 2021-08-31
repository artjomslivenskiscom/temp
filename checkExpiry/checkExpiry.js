import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";
import tmpl from "./checkExpiry.html"

    export default class checkExpiry extends OmniscriptBaseMixin(LightningElement) {
        expired = false;
        OSHeaderJSONexp;
        render() {
            return tmpl;
        }
        connectedCallback(){
            this.OSHeaderJSONexp = document.querySelectorAll(this.omniJsonData.omniName)[0].jsonDef.expired;
            if(this.OSHeaderJSONexp){
                this.expired = true;
            }
            else{
                this.omniNextStep();
            }
           // this.omniApplyCallResp({"savedurlexpiry": expired});
        }
        createQuote(){
            window.parent.location = 'https://www.lumen.com/en-us/shop.html';
        }
    }