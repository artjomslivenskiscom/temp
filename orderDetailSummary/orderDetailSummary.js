import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class OrderDetailSummary extends OmniscriptBaseMixin(LightningElement) {
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
                             AuthFlow: this.omniJsonData.AuthFlow,
                             IsSupp:this.omniJsonData.IsSupp
                            };
                            if(this.omniJsonData.MacFlow){
                              this._prefillSummary.MacFlow= this.omniJsonData.MacFlow
                            }
    }
}