import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import OmniscriptSetValues from 'vlocity_cmt/omniscriptSetValues';
 
export default class gbGetUrlParams extends OmniscriptBaseMixin(OmniscriptSetValues) {
    connectedCallback() {
           super.connectedCallback();
           this.fetchParamsfromURL(["pcode", "tcode", "eId","quoteId","serviceId","isSavedOrder","IPCount","sellerFlow","OpportunityId","AccountBizOrg","resumeLwcSellerOppId","EnterpriseQuoteId","ccUser","communityUser","returnUrl"]);
           this.setParamsOmniJson(this.urlParams);
		   sessionStorage.setItem('priceDifference', null);
		   sessionStorage.setItem('termSelected', null);
			sessionStorage.setItem('amountDifference', null);
            sessionStorage.setItem('hyperWanBandwidthVal', null);
           localStorage.setItem("navigateOrderDetails",null);
           localStorage.setItem("iconStatus",null);
           localStorage.setItem("currentOfferId",null);
		   window.localStorage.setItem("solutionIdErrorMessage",null);
     }

     getQueryStringValue(key, inParentURL) {
		let hrefLocation;
		if (inParentURL == true) {
			hrefLocation = window.parent.location.href.toLowerCase();
		} else if (inParentURL == false) {
            hrefLocation = window.location.href;
		}
        let result = decodeURIComponent(hrefLocation.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
         if(!(key == 'quoteId' || key == 'serviceId' || key == 'AccountBizOrg' || key == 'OpportunityId' || key == 'resumeLwcSellerOppId' || key == 'EnterpriseQuoteId' || key == 'returnUrl')){
            result = result.toLowerCase();
		}
		if(key == 'resumeLwcSellerOppId' && result == ""){
			result = 'false';
		}
        if (result.includes('+')) {
            result = result.split('+').join(' ');
            return result;
        } if (result.includes('_')){
            result = result.split('_')
            if (result.length) {
                result = result.map((item) => ({"Id" : item }));
                return result
            } 
        } 
        else {
            if(key == "tcode"){
                result = [{"Id": result}]
            }
            return result;
        }
	};

	fetchParamsfromURL(params) {
        this.urlParams = {}
        params.forEach(param => this.urlParams[param] = this.getQueryStringValue(param, false))
        console.log("params= ", this.urlParams)
    }

    setParamsOmniJson(params) {
        this.omniApplyCallResp({"urlParams": params }); 
    }
	
}