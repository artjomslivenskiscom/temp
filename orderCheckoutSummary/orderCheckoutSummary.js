import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class OrderCheckoutSummary extends OmniscriptBaseMixin(LightningElement) {
@api
  set prefillSummary(val) {
    if (val) {
      this._prefillSummary = val;
    }
  }
  get prefillSummary() {
    return this._prefillSummary;
  }

  connectedCallback(){
    this._prefillSummary = { EnterpriseQuoteId: this.omniJsonData.EnterpriseQuoteId,
                             IsTypeOrder: this.omniJsonData.IsTypeOrder,
                             UserProfile: this.omniJsonData.userProfile,
							 AuthFlow:this.omniJsonData.AuthFlow
                            };
							if(this.omniJsonData.MacFlow){
                              this._prefillSummary.MacFlow= this.omniJsonData.MacFlow
                            }
	console.log(JSON.stringify(this._prefillSummary));
  }
}