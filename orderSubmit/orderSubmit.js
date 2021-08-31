import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class OrderSubmit extends OmniscriptBaseMixin(LightningElement) {
    _masterOrderId = null;

    @api
    set prefillSummary(val) {
        if (val) {
            this._prefillSummary = val;
        }
    }
    get prefillSummary() {
        return this._prefillSummary;
    }

    @api
    set masterOrderId(val) {
        if (val) {
            this._masterOrderId = val;
        }
    }
    get masterOrderId() {
        return this._masterOrderId;
    }

    connectedCallback(){
        this._prefillSummary = { MasterOrderId: this.omniJsonData.MasterOrderId, 
		                         SettingName: "DyConn" };
	    console.log("YoYo", JSON.stringify(this._prefillSummary));
    }
}