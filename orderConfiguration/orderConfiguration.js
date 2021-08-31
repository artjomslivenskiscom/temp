import { LightningElement,api } from 'lwc';
import pubsub from 'vlocity_cmt/pubsub';
    import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
    export default class orderConfiguration extends OmniscriptBaseMixin(LightningElement) {
      @api
	  set prefillSummary(val) {
		if (val) {
		  this._prefillSummary = val;
		}
	  }
	  get prefillSummary() {
		return this._prefillSummary;
	  }
      connectedCallback() {
		let eid = this.omniJsonData.eId ? this.omniJsonData.eId : this.omniJsonData.urlParams.eId;
		let suppFlag = this.omniJsonData.IsSupp ? this.omniJsonData.IsSupp : false;
          this._prefillSummary = { EnterpriseQuoteId: this.omniJsonData.EnterpriseQuoteId,
                                   WorkingCartId: this.omniJsonData.WorkingCartId,
                                   QuoteMemberId: this.omniJsonData.QuoteMemberId,
                                   IsTypeOrder:this.omniJsonData.IsTypeOrder,
                                   IsOrderConfigure: true,
								   enterpriseId:eid,
								    SelectedCustomerNumber: this.omniJsonData.selectedCustomerNumber,
									IsSupp:suppFlag,
									AuthFlow:this.omniJsonData.AuthFlow
                                };
								if(this.omniJsonData.selectedBan && this.omniJsonData.selectedBan.selectedBan){
                                  this._prefillSummary.selectedBan= this.omniJsonData.selectedBan.selectedBan
                                }
								else if(this.omniJsonData.selectedBan){
                                  this._prefillSummary.selectedBan=this.omniJsonData.selectedBan
                                }
                            if(this.omniJsonData.MacFlow){
                              this._prefillSummary.MacFlow= this.omniJsonData.MacFlow
                            }
                            console.log('SelectedCustomerNumber'+ this.omniJsonData.selectedCustomerNumber);
                            pubsub.register("selectedBanEvent", {
                              selectedBan: this.handleselectedBan.bind(this)
                            });
    pubsub.fire("suppConfigure", "data", { suppConfigureFlag : true });
    console.log('firing SUPPPPPPConfigure', this.omniJsonData.IsSupp);
  }
      handleselectedBan(data){
        this.omniApplyCallResp({
          selectedBan: data,
        });
      }
	}