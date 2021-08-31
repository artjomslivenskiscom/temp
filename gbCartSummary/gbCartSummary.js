import { LightningElement, api, track } from "lwc";
import { B2BBaseComponent } from "c/b2bBaseComponent";
import pubsub from "vlocity_cmt/pubsub";

export default class GbCartSummary extends B2BBaseComponent(
  LightningElement
  ) {
    @track enterpriseQuoteId = null;
    @track readOnly = true;
    @track isSupp=false;
    @track config = true;
    @track expand = false;
    @track isCheckout=false;
	@track sellerFlow;
    _isTypeOrder;
    _isOrderDetails;    
    _isQuoteSummary;
    _hasQuote = false;
    _hasOrder = false;
	_isTypeDisconnect=false;
    isAuthUser=false;

    @api
    set isTypeOrder(val) {
      if (val && typeof(val) == "string") {        
        this._isTypeOrder = (val == 'true' ? true : false);
      }
      else if(val && typeof(val) == "boolean"){
        this._isTypeOrder = val;
      }
    }
    get isTypeOrder() {
      return this._isTypeOrder;
    }
	@api
    set isTypeDisconnect(val) {
      if (val && typeof(val) == "string") {        
        this._isTypeDisconnect = (val == 'true' ? true : false);
      }
      else if(val && typeof(val) == "boolean"){
        this._isTypeDisconnect = val;
      }
    }
    get isTypeDisconnect() {
      return this._isTypeDisconnect;
    }
    @api
    set isOrderDetails(val) {
      if (val && typeof(val) == "string") {        
        this._isOrderDetails = (val == 'true' ? true : false);
      }
      else if(val && typeof(val) == "boolean"){
        this._isOrderDetails = val;
      }
    }
    get isOrderDetails() {
      return this._isOrderDetails;
    }
	
	@api
    set isQuoteSummary(val) {
      if (val && typeof(val) == "string") {        
        this._isQuoteSummary = (val == 'true' ? true : false);
      }
      else if(val && typeof(val) == "boolean"){
        this._isQuoteSummary = val;
      }
    }
    get isQuoteSummary() {
      return this._isQuoteSummary;
    }
    @track hasOrder = false;
    @track hasQuote = false;
    
    connectedCallback() {
    //console.log("isCheckout: " + isCheckout);
      this.hasOrder = this.omniJsonData.hasOrder ? this.omniJsonData.hasOrder : false;
      this.hasQuote = this.omniJsonData.hasQuote ? this.omniJsonData.hasQuote : false;
      this.authFlow = this.omniJsonData.AuthFlow ? this.omniJsonData.AuthFlow : false;
	  this.isAuthUser = this.omniJsonData.userProfile == 'End Customer Community' ? true:false;
      this.enterpriseQuoteId = this.omniJsonData.EnterpriseQuoteId;
	  this.sellerFlow = this.omniJsonData.sellerFlow ? this.omniJsonData.sellerFlow : false;
	  if(this.omniJsonData != undefined && this.omniJsonData.pCode && this.omniJsonData.isSavedOrder){
		if(this.omniJsonData.pCode == "00062" || this.omniJsonData.pCode == "00092" ){
		this.omniApplyCallResp({
		'siteBased': true
		 });
		 }
		console.log("pcode= "+this.omniJsonData.pCode+"sitebased= "+this.omniJsonData.siteBased);
	  }
	  if(this.omniJsonData.serviceid){
        this.serviceid = this.omniJsonData.serviceid;
      }
      if(this.omniJsonData.macFlow){
        this.macFlow = this.omniJsonData.macFlow;
      }
      else if(this.omniJsonData.MacFlow){
        this.macFlow = this.omniJsonData.MacFlow;
      }
      this.isCheckout= this.omniJsonData.isCheckout;
	  // this block will execute for supp flow only
      if(this.omniJsonData.IsSupp && this.omniJsonData.IsSupp!==undefined)
      {
        this.isSupp = true;
      }
      // registering events
      this._handleConfigureSite = {
        data: this.configureSite.bind(this)
      };
      pubsub.register("gb_configure_site", this._handleConfigureSite);
      pubsub.fire("gb_cart_summary_loaded", "data", null);
    }
	
	
	
    disconnectedCallback(){
      pubsub.unregister("gb_configure_site", this._handleConfigureSite);
    }
    
    configureSite(data) {
      const rootItemsIds = [];
      const {
        lineItem: {
          records,
          id
        }
      } = data;
      records.forEach(record => {
        rootItemsIds.push({Id: record.rootItemId})
      })
      const inputs = {
        "RootItemIds": rootItemsIds,
        "SalesQuoteId": this.enterpriseQuoteId,
        "MemberId": id,
		"AuthFlow": this.omniJsonData.AuthFlow ? this.omniJsonData.AuthFlow : false,
		"orderDetails": this.isOrderDetails ? this.isOrderDetails : false,
        "SellerFlow": this.omniJsonData.sellerFlow ? this.omniJsonData.sellerFlow : false
      }
      const options = {
        //queueableChainable: true
      };
      const params = {
        input: JSON.stringify(inputs),
        sClassName: "vlocity_cmt.IntegrationProcedureService",
        sMethodName : 'CloneSalesQLIs_ToGCartQLIs',
        options: JSON.stringify(options)
      };
      this.omniRemoteCall(params, true).then(response => {
        this.loading = false;
        this.omniApplyCallResp({
          "showConfig": true,
          "modify": true,
          "WorkingCartId": response.result.IPResult.GroupCartId,
          "RootItemIds": rootItemsIds,
          "QuoteMemberName": data.lineItem.title,
          "QuoteMemberId": data.lineItem.id,
		  "isSavedOrder":false,
		  "ResumeLwcSellerFlow":false,
		  "isBackButton":false
        })
		if(this._isTypeOrder){
          pubsub.fire("configureEvent", "configureLink", {
            navigate: true
            });
          this.omniNavigateTo("OrderConfiguration");
        }else if(this.macFlow){
            this.omniApplyCallResp({
                "macQuoteReconfig": true
            })
            this.omniNavigateTo("ConfigureProduct");
        }
        else{
            this.omniNavigateTo("ConfigureProduct");
        }
      }).catch(error => {
        this.loading = false;
        window.console.log(error, 'error');
      });
    }
  }