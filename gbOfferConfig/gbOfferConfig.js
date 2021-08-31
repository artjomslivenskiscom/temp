/************************************************
Component Name: gbOfferConfig.js
Description : << Usage/functionality of the component >>
Version History:
21-06-2021	LBPSC-40898	Added logic to check if location is an Off-Net, Green-L and CSP customer. If it is, do not use Off-Net Pricing
	Author: R. Sparks
  Status Completed
22-06-2021	LBPSC-43980	Added logic to remove check for CSP Customer. All customers now eligible
	Author: R. Sparks
  Status Completed
				
************************************************/
import { LightningElement, api, track } from "lwc";
import { B2BBaseComponent } from "c/b2bBaseComponent";
import pubsub from "vlocity_cmt/pubsub";
import { gbOfferConfigJson } from "./gbOfferConfigJson";
import { invokeDR, invokeVIP } from "c/b2bUtils";
import vtag from 'vlocity_cmt/oaVtag';

export default class GBOfferConfig extends B2BBaseComponent(LightningElement) {
    @track isMacLumenProvided ;
    @track retry ;
    @track cartItems = { records: [] };
    @track discounts = [];
    @track loading = true;
    @track showSelectServices = true;
    @track solutionIdErrorMessage = false;
    @track IsOrderConfigureStep = false;
    @track IsOrderConfigureSuppTerms = false;
    @track showBilling=true;
	@track sellerAccountBiz;						  
	@track showServiceInstallation = true;
	macPssaError = false;
    @track isDeviceLumenFlag = false ;
	@track isQuoteConfigStep = false;
	@track ddosIpcount;
	@track refreshCart=true;
    @track isSiteBased = true;
	@track fiberNearNetMsg = false;
	floorValueMRC = 0;
    floorValueNRC = 0;
     showTechnical;
     showThrash;
    checkoutArray = [];
    _expand = true;
    _workingCartId = "";
    //_locOmniComponentId="";
    _vRFErrorMsg = null;
    _enterpriseQuoteId = null;
    _zone = "";
    _clsa = "";
     _termSelected = "";//LBPSC-45598
    _readOnly = false;
    _config = false;
    _isTypeOrder = false;
    _isOrderDetails = false;
    _isCheckout = false;
    _isQuoteSummary = false;
    _isTypeDisconnect = false;
    _isSupp = false;
    _hasQuote = false;
    _hasOrder = false;
    isPONRFlag;
    _isEdge = false;
    sdk = null;
    @track locations = [];
    @track locationIds = [];
    @api locBased = false;
    @api doValidate = false;
    @track isCheckout = false;
    @api altComponentId = ""; //OmniAnalytics tracking
    @api authFlow;
    @api omniJsonData;
    @track networkStatus;
	_serviceid;
  @track portConfigure = true;
  @track portComplete = true;
    hasRendered = true;
	_sellerFlow = false;
	_isShopLocPage = false;
	@api isAuthUser;
	@track showPortIcon = false; //LBPSC-42640
	@track hyperwanConfigure = true; //LBPSC-43168
	@track hyperwanComplete = true; //LBPSC-43168
	@track isSubSectionNotCompletedValue;
	@track isMetroRing1Available; //LBPSC-44134
  @track isEdge = false;
	@api 
	  set authenticatedFlow(data) {
		this._authenticatedFlow = data;
	  }
	  get authenticatedFlow() {
		return this._authenticatedFlow;
	  } 
 	
    @api
    set isEdge(val) {
      if(val) {
        this._isEdge = isEdge;
      }
    }
    get isEdge() {
      return this._isEdge;;
    }
	@api set initialLoad(val) {
		  this._initialLoad = val;
	}
	 get initialLoad() {
		return this._initialLoad;
	}
	@api
	set sellerFlow(val) {
	if (val && typeof(val) == "string") {        
	  this._sellerFlow = (val == 'true' ? true : false);
	}
	else if(val && typeof(val) == "boolean"){
	  this._sellerFlow = val;
	}
	}
    get sellerFlow() {
      return this._sellerFlow;
    }
    
    @api
    set isShopLocPage(val) {
      if (val) {
        this._isShopLocPage = val;
      }
    }
    get isShopLocPage() {
      return this._isShopLocPage;
    }
	
    @api
    set isCheckout(val) {
      if (val) {
        this._isCheckout = val;
      }
    }
    get isCheckout() {
      return this._isCheckout;
    }
    @api
    set serviceid(val) {
      if (val) {
        this._serviceid = val;
      }
    }
    get serviceid() {
      return this._serviceid;
    }
  @track headerData = {
    title: "Business Internet Enhanced",
    description: ""
  };

  @api set workingCartId(workingCartId) {
    if (workingCartId) {
      this._workingCartId = workingCartId;
    }
  }

  get workingCartId() {
    return this._workingCartId;
  }
  @api
    set isTypeDisconnect(val){
        this._isTypeDisconnect = val;
    }
    
    get isTypeDisconnect() {
        return this._isTypeDisconnect;
    }
  @api
  set vRFErrorMsg(vRFErrorMsg) {
    if (vRFErrorMsg != undefined || vRFErrorMsg != null) {
      this._vRFErrorMsg = vRFErrorMsg;
    }
  }
  get vRFErrorMsg() {
    return this._vRFErrorMsg;
  }
  @api set macFlow(macFlow) {
    if (macFlow) {
      this._macFlow = macFlow;
    }
  }
  get macFlow() {
    return this._macFlow;
    }
    @api set hasOrder(hasOrder) {
        if (hasOrder) {
            this._hasOrder = hasOrder;
        }
    }
    get hasOrder() {
        return this._hasOrder;
    }
    @api set hasQuote(hasQuote) {
        if (hasQuote) {
            this._hasQuote = hasQuote;
        }
    }
    get hasQuote() {
        return this._hasQuote;
  }
   @api 
  set clsa(val){
    this._clsa = val;
  }
  get clsa(){
    return this._clsa;
  }
  @api 
  set bprogram(val){
    this._bprogram = val;
  }
  get bprogram(){
    return this._bprogram;
  }
  @api 
  set zone(val){
    this._zone = val;
  }
  get zone(){
    return this._zone;
  }
  @api set quoteMemberId(quoteMemberId) {
    if (quoteMemberId) {
      this._quoteMemberId = quoteMemberId;
    }
  }
  get quoteMemberId() {
    return this._quoteMemberId;
  }
  @api set quoteMemberName(quoteMemberName) {
    if (quoteMemberName) {
      this._quoteMemberName = quoteMemberName;
    }
  }
  get quoteMemberName() {
    return this._quoteMemberName;
  }

  @api set enterpriseQuoteId(cartId) {
    if (cartId) {
      this._enterpriseQuoteId = cartId;
    }
  }
  get enterpriseQuoteId() {
    return this._enterpriseQuoteId;
  }

  @api set readOnly(data) {
    this._readOnly = data;
  }

  get readOnly() {
    return this._readOnly;
  }

  @api set config(data) {
    this._config = data;
  }

  get config() {
    return this._config;
  }
  @api
  set expand(val) {
    this._expand = val;
  }
  @api set isSupp(data) {
      this._isSupp = data;
    }
  
  get isSupp() {
    return this._isSupp;
  }

  get expand() {
    return this._expand;
  }

  @api
  set quoteId(val) {
    if (val) {
      this._quoteId = val;
    }
  }
  get quoteId() {
    return this._quoteId;
  }
  
  @api
  set isTypeOrder(val){
    this._isTypeOrder = val;
  }
  
  get isTypeOrder() {
    return this._isTypeOrder;
  }
  
  @api
    set isOrderDetails(val) {
      if (val) {
        this._isOrderDetails = val;
      }
    }
    get isOrderDetails() {
      return this._isOrderDetails;
    }
	
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
    set isQuoteSummary(val) {
      if (val) {
        this._isQuoteSummary = val;
      }
    }
    get isQuoteSummary() {
      return this._isQuoteSummary;
    }
    //20210119 OmniAnalytics tracking
    get componentId() {
        return this.omniScriptHeaderDef ? this.omniScriptHeaderDef.sOmniScriptId : this.altComponentId;
    }

	@track isOrderConfigurable;
    getQueryParameters() {
    var params = {};
    var search = location.search.substring(1);
    if (search) {
        params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
            return key.toLowerCase() === "" ? value : decodeURIComponent(value)
        });
    }
    return params;
  }	
	
  @track oneTimeTotalOriginal;
  @track oneTimeTotalUpdatedValue;
  @track recurringTotalOriginal;
  @track recurringTotalUpdatedValue;
  renderedCallback(){
    console.log("locations",this.locations);
    if(!this.sellerFlow && this.isQuoteConfigStep == false){
      this.locations.forEach(offer =>{
        offer.records.forEach(recs => {
          this.oneTimeTotalOriginal = 0;
          this.oneTimeTotalUpdatedValue=0;
          this.recurringTotalOriginal=0;
          this.recurringTotalUpdatedValue=0;
          recs.columns.forEach(columnLi=>{
            if(columnLi.value.label == 'One Time Charge' && (columnLi.value.originalValue!=0 || columnLi.value.originalValue !=null)){
              this.oneTimeTotalOriginal = this.oneTimeTotalOriginal + columnLi.value.originalValue;
            }
            if(columnLi.value.label == 'One Time Charge' && (columnLi.value.value!=0  || columnLi.value.value !=null)){
              this.oneTimeTotalUpdatedValue = this.oneTimeTotalUpdatedValue + columnLi.value.value;
            }
            if(columnLi.value.label == 'Recurring Charge' && (columnLi.value.originalValue!=0  || columnLi.value.originalValue !=null)){
              this.recurringTotalOriginal = this.recurringTotalOriginal + columnLi.value.originalValue;
            }
            if(columnLi.value.label == 'Recurring Charge' && (columnLi.value.value!=0  || columnLi.value.value !=null)){
              this.recurringTotalUpdatedValue = this.recurringTotalUpdatedValue + columnLi.value.value;
            }
          });
          if(recs.lineItems){
            recs.lineItems.forEach(lineItemrec =>{
              lineItemrec.columns.forEach(columnLi=>{
                if(columnLi.value.label == 'One Time Charge' && (columnLi.value.originalValue!=0 || columnLi.value.originalValue !=null)){
                  this.oneTimeTotalOriginal = this.oneTimeTotalOriginal + columnLi.value.originalValue;
                }
                if(columnLi.value.label == 'One Time Charge' && (columnLi.value.value!=0  || columnLi.value.value !=null)){
                  this.oneTimeTotalUpdatedValue = this.oneTimeTotalUpdatedValue + columnLi.value.value;
                }
                if(columnLi.value.label == 'Recurring Charge' && (columnLi.value.originalValue!=0 || columnLi.value.originalValue !=null)){
                  this.recurringTotalOriginal = this.recurringTotalOriginal + columnLi.value.originalValue;
                }
                if(columnLi.value.label == 'Recurring Charge' && (columnLi.value.value!=0  || columnLi.value.value !=null)){
                  this.recurringTotalUpdatedValue = this.recurringTotalUpdatedValue + columnLi.value.value;
                }
              });
            });
          }
          console.log("this.oneTimeTotalOriginal"+this.oneTimeTotalOriginal);
        console.log("this.oneTimeTotalUpdatedValue"+this.oneTimeTotalUpdatedValue);
        console.log("this.recurringTotalOriginal"+this.recurringTotalOriginal);
        console.log("this.recurringTotalUpdatedValue"+this.recurringTotalUpdatedValue);
          offer.columns.forEach(col =>{
            if(col.value.label == 'One Time Charge'){
              col.value.originalValue += this.oneTimeTotalOriginal;
              col.value.updatedValue += this.oneTimeTotalUpdatedValue;
            }
            if(col.value.label == 'Recurring Charge'){
              col.value.originalValue += this.recurringTotalOriginal;
              col.value.updatedValue += this.recurringTotalUpdatedValue;
            }
          });
        });
    });
      pubsub.fire("priceFooter", "footerprice", {
        offer: this.locations
         });
    }
  }	

    connectedCallback() {
        let getAllURLParams = this.getQueryParameters();
        let urlParams = JSON.stringify(getAllURLParams);
        let parsedParams = JSON.parse(urlParams);
        let AccountBizOrg = parsedParams['AccountBizOrg'];
        this.sellerAccountBiz= AccountBizOrg;
		if(this.sellerAccountBiz){						  
        this.omniApplyCallResp({
          'SelectedCustomerNumber': this.sellerAccountBiz
        });	
		}		
		if(this.omniJsonData && this.omniJsonData.ResumeLwcSellerFlow){
			if(this.omniJsonData.ShowReConfigPage){
				if(Array.isArray(this.omniJsonData.QuoteMembers)){
					this.memberId;
					this.memberName
					this.cartId = this.omniJsonData.WorkingCart.Ids;
					this.quoteMemberDetails = this.omniJsonData.QuoteMembers;
					//this.qli = this.omniJsonData.QuoteLineItem.filter(qli => qli.QuoteId.includes(this.cartId));
					this.quoteMemberDetails.every((member,index) => {
						if(member.GLMID == this.omniJsonData.QuoteLineItem.GLMSiteId){
							this.memberId = member.Ids;
							this.memberName = member.Name;
						}
					});
					this.omniApplyCallResp({
						"QuoteMemberName": this.memberName,
						"QuoteMemberId": this.memberId
					});
				}else if(!Array.isArray(this.omniJsonData.QuoteMembers)){
					this.omniApplyCallResp({
						"QuoteMemberName": this.omniJsonData.QuoteMembers.Name,
						"QuoteMemberId": this.omniJsonData.QuoteMembers.Ids
					});
				}	
			}	
		}
		if(this.omniJsonData && this.omniJsonData.IPCount){
		  this.ddosIpcount = this.omniJsonData.IPCount;
		}
		//LBPSC-37269
		if(this.omniJsonData){
			this.isOrderConfigurable = this.omniJsonData.IsOrderConfigure;
			this.isSiteBased = this.omniJsonData.siteBased;
			this._sellerFlow = this.omniJsonData.sellerFlow;
		}
		//LBPSC-44134
		if(this.omniJsonData && this.omniJsonData.IsOrderConfigure && JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && this.omniJsonData.QuoteMemberId != undefined ){
			let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
			if(storedVal[this.omniJsonData.QuoteMemberId+'MetroRing'] != undefined){  //LBPSC-46229
				this.isMetroRing1Available = storedVal[this.omniJsonData.QuoteMemberId+'MetroRing']["MetroRing"]
			}
		}
		if(this.isAuthUser != undefined){ 
			this.userProfile = this.isAuthUser; 
		}else if(this.omniJsonData != undefined && this.omniJsonData.AuthUser != undefined){ 
			this.isAuthUser = this.omniJsonData.AuthUser; 
		}else if(this.omniJsonData != undefined && this.omniJsonData.userProfile != undefined){
		  this.isAuthUser = this.omniJsonData.userProfile == 'End Customer Community' ? true:false;
		}
		if(this.omniJsonDef && this.omniJsonDef.name && this.omniJsonDef.name == 'ProductConfig'){
			this.isQuoteConfigStep = true;
		}
        this.fields = gbOfferConfigJson.fields;
        this.isAuthFlow = this.authFlow;
        //this.showBilling = this.isAuthFlow || this.isCheckout || this.isTypeDisconnect ? true:false;
		//this.showBilling = this.isAuthFlow || this.isTypeDisconnect || (this.omniJsonData != undefined && this.omniJsonData.sellerFlow) ? true:false;
		this.showBilling = this.isAuthFlow || this.isTypeDisconnect || this.sellerFlow ? true:false;
        //console.log('VRFErrorMessage-->'+omniJsonData.VRFErrorMsg);																	 
        if (this.omniJsonData && this.omniJsonData.IsOrderConfigure) {
            this._prefillSummary = {
                ReadOnly: this.readOnly,
                SelectedCustomerNumber: this.omniJsonData.SelectedCustomerNumber,
                EnterpriseQuoteId: this.omniJsonData.EnterpriseQuoteId,
                QuoteMemberId: this.omniJsonData.QuoteMemberId,
                enterpriseId: this.omniJsonData.enterpriseId,
                AuthFlow:this.authFlow											
            };
			console.log("sellerAccountId= ", this.omniJsonData.SelectedCustomerNumber);																		   
            if (this.omniJsonData.MacFlow) {
                this.macFlow = this.omniJsonData.MacFlow
                this._prefillSummary.MacFlow = this.omniJsonData.MacFlow
            }
		if(this.omniJsonData.selectedBan){
          this._prefillSummary.selectedBan= this.omniJsonData.selectedBan
        }
		 // for LBPSC-33008
        this.IsOrderConfigureStep = true;	
		this.IsOrderConfigureSuppTerms = this.isSupp ? true:false;		
	}else{
        this._prefillSummary = { ReadOnly: this.readOnly,
							isCheckout:this._isCheckout,
							IsTypeDisconnect : this._isTypeDisconnect,
                            EnterpriseQuoteId: this._enterpriseQuoteId,
							AuthFlow:this.authFlow,
                            QuoteMemberId:''
                            };
		// for LBPSC-33008
		this.IsOrderConfigureStep= false;			  								 
    }
	if(this.omniJsonData != undefined && this.omniJsonData.userProfile != undefined)
	{ 
		console.log('this.userProfile gbOfferConfig', JSON.stringify(this.omniJsonData));
		this.getUserProfile = this.omniJsonData.userProfile; 
	}else if(this.authFlow)
	{ 
		console.log('this.userProfile Auth', JSON.stringify(this.omniJsonData)); 
		this.getUserProfile = this.authFlow; 
	}
        
    this.getB2BExpressSDK(this.workingCartId)
      .then(b2bSDK => {
        this.sdk = b2bSDK;
        const input = { cartId: this.workingCartId };
        this.getCartItems(
          input,
          gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
        );
      })
      .catch(e => {
        this.loading = false;
      });

    // registering events
	pubsub.register("loadCart",{
      data:this.loadCart.bind(this)
    });
	
    this._handleUpdateCart = {
      data: this.handleSaveCart.bind(this)
    };
    pubsub.register("b2b_update_cart", this._handleUpdateCart);
	
    this._handleRefreshCart = {
      data: this.handleSDKCallFailure.bind(this)
    };
    pubsub.register("b2b_refresh_Cart", this._handleRefreshCart);

    this._handleDeleteSite = {
      data: this.handleDeleteSite.bind(this)
    };
    pubsub.register("gb_delete_successful", this._handleDeleteSite);

    pubsub.register("isSubSectionNotCompletedEvent",{
      isSubSectionNotCompletedData : this.updateIsSubSectionNotCompleted.bind(this)
    });
    // registering events
    this._handleTabChange = {
      data: this.handleTabChange.bind(this)
    };
    pubsub.register("b2b-config-offer-tab-change", this._handleTabChange);
    pubsub.register("isDeviceLumen",{isDeviceLumenState: this.isDeviceLumenState.bind(this)});
    pubsub.register("isCurrLumenProvided",{isDeviceLumenProvided: this.isDeviceLumenProvided.bind(this)});



  }
    updateIsSubSectionNotCompleted(data){
    this.isSubSectionNotCompletedValue = data.isSubSectionNotCompleted;
  }
  loadCart(data){
    this.loading = true;
     this.getB2BExpressSDK(data.workingcart)
       .then(b2bSDK => {
         this.sdk = b2bSDK;
        const input = { cartId: data.workingcart };
        this.getCartItems(
          input,
          gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
        );
     })
      .catch(e => {
        this.loading = false;
       });
  }
  isDeviceLumenProvided(data){
		this.isMacLumenProvided = data.isMacLumenProvided;
	    this.retry = data.retry;
		} 
  
  
  isDeviceLumenState(data){
  this.isDeviceLumenFlag = data.isDeviceLumenFlag;
  }

  get oneTimeTotal() {
    return this.cartItems && this.cartItems.prices
      ? this.cartItems.prices.effectiveOneTimeTotal || 0
      : 0;
  }

  get recurringTotal() {
    return this.cartItems && this.cartItems.prices
      ? this.cartItems.prices.effectiveRecurringTotal || 0
      : 0;
  }
  
  get hideConfigCard() {
        return this._isTypeDisconnect ||
        (this.IsOrderConfigureStep && !this.showTechnical)
        ? true
        : false;
  }
	 
  showToast() {}

  /**
   * Handle loading SDK failure
   * @param {object} data
   * @memberof GBOfferConfig
   */
  handleSDKCallFailure() {
    this.loading = true;
    this.cartItems = Object.assign({}, this.sdk.getCartSummaryDetails(false,{columns: this.fields}));
    Promise.resolve().then(() => {
      this.loading = false;
    });
  }

  hasItemId(records, found, id) {
    if (found || !Array.isArray(records)) {
      return found;
    }
    records.forEach(record => {
      if (record.id === id) {
        found = true;
      }
      if (record.lineItems) {
        found = found || hasItemsId(record.lineItems, found, id);
      }
    })
    
    return found;
  }

  /**
   * Callback function for event b2b_update_cart
   * @param {object} data
   * @memberof GBOfferConfig
   */
  // handleSaveCart(data) {
  //   const lineItem = JSON.parse(JSON.stringify(data));
  //   const
  //     { lineItem:
  //       { customFields: {
  //         QuoteMemberId__r: {
  //           Id
  //         }
  //       },
  //       id
  //     },
  //       action
  //     } = lineItem;
  //   console.log('1')
  //   const _location = this.locations.find( ({ id }) => id === Id );

  //   if (action === "deleteLocation") {
  //     this.deleteQuoteMember(id);

  //     return;
  //   }

    
  //   const { records } = _location;
  //   console.log(JSON.parse(JSON.stringify(records)));
  //   const found = true//this.hasItemId(records, false, id);
  //   console.log(id, found)
  //   if (!found) {
  //     return;
  //   }
  //   if (action === "addProductToCart") {
  //     this.addProductToCart(lineItem);
  //   } else if (action === "updateLineItem") {
  //     this.updateLineItem(lineItem);
  //   } else if (action === "deleteLineItem") {
  //     this.deleteLineItem(lineItem);
  //   } else if (action === "applyAdjustment") {
  //     this.applyAdjustment(lineItem);
  //   } else if (action === "cloneItems") {
  //     this.cloneItems(lineItem);
  //   } else if (action === "getPriceDetails") {
  //     this.getPriceDetails(lineItem);
  //   } else if (action === "deleteAdjustment") {
  //     this.deleteAdjustment(lineItem);
  //   } else if (action === "getTimeLists") {
  //     this.getTimeLists(lineItem);
  //   }
  // }


    
    handleSaveCart(data) {
        const record = this.sdk.cartItems.records.find(r => r.Id.value === data.rootBundleId);
        if (!record) return;

        if (data.action === "addProductToCart") {
            this.addProductToCart(data);
        } else if (data.action === "updateLineItem") {
            this.updateLineItem(data);
            this.offNetFiberProcess(this.sdk.cartItems.records[0], data);
        } else if (data.action === "deleteLineItem") {
            this.deleteLineItem(data);
        } else if (data.action === "applyAdjustment") {
            this.applyAdjustment(data);
        } else if (data.action === "cloneItems") {
            this.cloneItems(data);
        } else if (data.action === "getPriceDetails") {
            this.getPriceDetails(data);
        } else if (data.action === "deleteAdjustment") {
            this.deleteAdjustment(data);
        } else if (data.action === "getTimeLists") {
            this.getTimeLists(data);
        }
    }

  /**
   * This function is used to get getCartItems input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  getCartItemsGetInput(input, apiConfig) {
    input = this.deepClone(input);
    let action = {'remote' : apiConfig, 'rest': {}};
    action.remote.params.cartId = input.cartId;
    return Object.assign(this.sdk.createGetCartItemsInput(), {
      cartId: input.cartId,
      columns: this.fields,
      customFields: apiConfig.params.customFields,
      actionObj: action,
      remoteClass: apiConfig.remoteClass
    });
  }
  
  /**
   * This function is used to call Offnet API
   * @param {object} input
   * @memberof GBOfferConfig
   */
  offNetFiberProcess(record,input){
      if((record.Name == "Fiber+ Internet" || record.Name == "Future Lumen® Fiber+ Internet_LWC") && (record.Network_Status__c && record.Network_Status__c.value === 'Off-Net' || record.Network_Status__c && record.Network_Status__c.value === 'Near-Net')){
			  let selectedTerm;
			  let selectedBandwidth;
			  let portQLI;
              const code = input.lineItemDetails.data ? input.lineItemDetails.data.code : null;
			  record.attributeCategories.records[0].productAttributes.records.forEach(record =>{
				  if(record.code == "ATT_FIBERPLUS_TERM" && record.userValues ){
					  selectedTerm  = record.userValues;
				  }
                  if(record.code == "ATT_FIBERPLUS_Bandwidth" && record.userValues ){
					  selectedBandwidth  = record.userValues;
				  }
                  })
              if(code == "ATT_FIBERPLUS_TERM"){
                  selectedTerm  = input.lineItemDetails.data.value;
				  this._termSelected = selectedTerm.replace(' Months', ''); //LBPSC-45598
              }
              else if( code == "ATT_FIBERPLUS_Bandwidth"){
                  selectedBandwidth  = input.lineItemDetails.data.value;
              }
			  if(selectedTerm && selectedBandwidth){
					if(record && record.lineItems && record.lineItems.records){
						record.lineItems.records.forEach(record =>{
						if(record.ProductCode == "PRD_FiberPlus_Port"){
							portQLI  = record.Id.value;
						}	
					})
					}
					const reqObj = {
					PortServiceBandwidth : selectedBandwidth,
					MemberId: this.quoteMemberId || record.vlocity_cmt__QuoteMemberId__c.value,
					SelectedTerm : selectedTerm.replace(' Months', ''),
					productCode : record.ProductCode,
					selectedAccount : record.vlocity_cmt__BillingAccountId__r.Name,
                    QuoteLineItemId : record.Id.value,
					portQLI : portQLI
				  }
				  console.log("This is request =", reqObj);
				  const message = {
					messageId: 'LPNFiber',
					message: 'The selected service bandwidth is not yet available at the requested location. Please select a different bandwidth or click to chat.',
					type: 'custom',
					showOnLocation: false
				  } 
				  this.OffnetApiCall(reqObj,message,record);
					resolve(input);
			   }
			else resolve(input)
	    }
		else resolve(input);
    }
	
				  
  
  

  /**
   * This function is used to get addProductToCart input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  addProductToCartGetInput(input, apiConfig) {
    input = this.deepClone(input);
    let addProductToCartInputObj =  Object.assign(this.sdk.createAddProductToCartInput(), {
      actionObj: input.childProduct.actions.addtocart,
      parentId: input.parentId,
      customFields: gbOfferConfigJson.APIConfig.postCartsItems.params.customFields,
      rootBundleId: input.rootBundleId,
      columns: this.fields,
    });
    if (gbOfferConfigJson && gbOfferConfigJson.APIConfig.postCartsItems) {
      Object.assign(
        addProductToCartInputObj.actionObj.remote.params,
        gbOfferConfigJson.APIConfig.postCartsItems.params,
      );
    }

    return addProductToCartInputObj;
  }

  /**
   * This function is used to get updateLineItem input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  updateLineItemGetInput(input) {
    input = this.deepClone(input);
    let isUpdatingAttribute = false;
    let actionObj = input.lineItem.actions.updateitems;
    if(input.lineItemDetails && input.lineItemDetails.action === "updateAttribute") {
      actionObj = input.lineItem.actions.modifyattributes;
      isUpdatingAttribute = true;
    } 
    let updateLineItemInputObj = Object.assign(
      this.sdk.createUpdateCartLineItemInput(),
      {
        actionObj: actionObj,
        lineItemId: input.lineItemId,
        rootBundleId: input.rootBundleId,
        parentId: input.parentId,
        lineItemDetails: input.lineItemDetails,
        columns: this.fields,
        customFields: gbOfferConfigJson.APIConfig.updateItems.params.customFields,
        remoteClass: gbOfferConfigJson.APIConfig.updateItems.remoteClass
      }
    );
    if (gbOfferConfigJson && gbOfferConfigJson.APIConfig.updateItems) {
      Object.assign(
        updateLineItemInputObj.actionObj.remote.params,
        gbOfferConfigJson.APIConfig.updateItems.params,
      );
    }
    if(isUpdatingAttribute) {
      updateLineItemInputObj.actionObj.remote.params.methodName = "putCartsItems";
    }
    return updateLineItemInputObj;
  }

  /**
   * This function is used to get deleteLineItem input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  deleteLineItemGetInput(input) {
    input = this.deepClone(input);
    let deleteLineItemObj =  Object.assign(this.sdk.createDeleteCartItemInput(), {
      actionObj: input.lineItem.actions.deleteitem,
      lineItemId: input.lineItemId,
      rootBundleId: input.rootBundleId,
      parentId: input.parentId,
      columns: this.fields,
	  customFields: gbOfferConfigJson.APIConfig.deleteItem.params.customFields,
      remoteClass: gbOfferConfigJson.APIConfig.deleteItem.remoteClass
    });
    if (gbOfferConfigJson && gbOfferConfigJson.APIConfig.deleteItem) {
      Object.assign(
        deleteLineItemObj.actionObj.remote.params,
        gbOfferConfigJson.APIConfig.deleteItem.params,
      );
    }
    return deleteLineItemObj;
  }

  /**
   * This function is used to get applyAdjustment input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  applyAdjustmentGetInput(input) {
    input = this.deepClone(input);
    return Object.assign(this.sdk.createApplyAdjustmentInput(), {
      actionObj: input.actionObj,
      adjustmentData: input.adjustmentData,
	  lineItemId: input.lineItemId,
      rootBundleId: input.rootBundleId,
      parentId: input.parentId,
      lineItem: input.lineItem,
      customFields: gbOfferConfigJson.APIConfig.updateItems.params.customFields,
      columns: this.fields
    });
  }

  /**
   * This function is used to get cloneItems input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  cloneItemsGetInput(input) {
    input = this.deepClone(input);
    return Object.assign(this.sdk.createCloneItemsInput(), {
      actionObj: input.lineItem.actions.cloneitem,
      columns: this.fields
    });
  }

  /**
   * This function is used to get getPriceDetails input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  createGetPriceDetailsInput(input) {
    return Object.assign(this.sdk.createGetPriceDetailsInput(), {
      actionObj: input.actionObj
    });
  }

  /**
   * This function is used to get deleteAdjustment input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  createDeleteAdjustmentInput(input) {
    return Object.assign(this.sdk.createDeletePriceAdjustmentInput(), {
      actionObj: input.actionObj,
      columns: this.fields
    });
  }

  /**
   * This function is used to get getTimeLists input object
   * @param {object} input
   * @memberof GBOfferConfig
   */
  createGetTimeListsInput(input) {
    return Object.assign(this.sdk.createGetTimeListsInput(), {
      actionObj: input.actionObj
    });
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  getCartItemsPreHook(input) {
    if(this.doValidate) input.actionObj.remote.params.validate = true;
    else input.actionObj.remote.params.validate = false;
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  addProductToCartPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  updateLineItemPreHook(input) {
    return new Promise((resolve, reject) => {
      const code = input.lineItemDetails.data ? input.lineItemDetails.data.code : null;
      // input.actionObj.remote.params.validate = true;
	  //LBPSC-47209-Start
		let PortServiceBandwidthValue;
		//let selectedHyperTerm;
		//let selectedHyperTermNumber;
		if(code === 'ATT_Bandwidth_SimpleWAN' || code === 'ATT_Port_Speed') {
			const record = this.sdk.cartItems.records.find(r=> r.ProductCode === 'PRD_Port');
			if(code === 'ATT_Port_Speed'){
				this.sdk.cartItems.records.forEach(rec =>{
					rec.attributeCategories.records.forEach(cat => {
						cat.productAttributes.records.forEach(attr => {
						if(attr.code == "ATT_Bandwidth_SimpleWAN"){
							PortServiceBandwidthValue = attr.userValues;
						}  
						//LBPSC-47265
						/*if(attr.code == "ATT_HYPERWAN_TERM"){
							selectedHyperTerm = attr.userValues;
							selectedHyperTermNumber = selectedHyperTerm.replace(' Months', '');
						}else{
							selectedHyperTermNumber="12";
						}
						//LBPSC-47265 */
					})
				})         
			})  ;                
		}      
		else{        
			PortServiceBandwidthValue = input.lineItemDetails.data.value;
			console.log("PortServiceBandwidthValue", PortServiceBandwidthValue)
		}
		if(record && record.Network_Status__c && record.Network_Status__c.value === 'Off-Net' && PortServiceBandwidthValue != null) {
		const reqObj = {//LBPSC-47209-End
            PortServiceBandwidth : PortServiceBandwidthValue,
            MemberId : this.quoteMemberId || record.vlocity_cmt__QuoteMemberId__c.value,
			SelectedTerm : '12', //selectedHyperTermNumber,  //LBPSC-47265 //'12',
            productCode :'PRD_SimpleWAN_OFFER_2'
		 }
          console.log("This is request =", reqObj);
          const message = {
            messageId: 'LPN',
            message: 'The selected port service bandwidth is not yet available at the requested location. Please select a different bandwidth or contact a support agent at (800)-414-1973 for assistance.',
            type: 'custom',
            showOnLocation: true
          }  
		  invokeVIP('Price_GetOffnetPricingInfo', reqObj).then(r => {
            const res = typeof r === "string" ? JSON.parse(r) : r;
            const prices = res.IPResult.prices;
            console.log("This is price", prices);
            let loc = this.locations.find(l => l.id === reqObj.MemberId);
            if(prices ===  null || !prices.length) {
              const mExist = loc.messages.find(m => m && (m.messageId === message.messageId));
              if(!mExist) loc.messages.push(message);
              resolve(null);
            } else {
              loc.messages = loc.messages.filter(m=> m.messageId != message.messageId);
              let priceObj = {};
              let solutionId = res.IPResult.solutionId;
              prices.forEach(p => priceObj[p.priceType] = parseFloat(p.price));
              //LBPSC-40898 - Even if isGreenLocation is true, Offnet Costing needs to be called
              // in order to get the SolutionId. Following will only use the prices from the response
              // if the isGreenLocation is false
              if(record.CSP_Pricing_Matrix_Field__c.value == 'List') {
                console.log('LBPSC-40898 - CSP = List - setting offnet values');
                record.OffnetMRC__c.value = priceObj.MRC;
                record.OffnetNRC__c.value = priceObj.NRC;
              } else if (record.isGreenLocation__c && record.isGreenLocation__c.value == false) {
                console.log('LBPSC-40898 - CSP != List and isGreenLocation is false - setting offnet values');
                record.OffnetMRC__c.value = priceObj.MRC;
                record.OffnetNRC__c.value = priceObj.NRC;
              }
              record.SolutionId__c.value = solutionId;           
              const QliRecords = {
                QuoteLineItemId:record.Id.value,
                SolutionId:record.SolutionId__c.value
              }
              invokeDR('DR_SaveSolutionId', QliRecords).then (r => {
                console.log(r); 
              });
              resolve(input);
            }
          });    
        } else resolve(input)
      } else resolve(input);
    })
  } 

  OffnetApiCall(reqObj,message,record){
			invokeVIP('Price_GetOffnetPricingInfo', reqObj).then(r => {
					const res = typeof r === "string" ? JSON.parse(r) : r;
					const prices = res.IPResult.prices;
					console.log("This is price", prices);
					let loc = this.locations.find(locId => locId.id === reqObj.MemberId);
					if(res.IPResult.solutionId == null){
                        this.solutionIdErrorMessage = true;
						window.localStorage.setItem("solutionIdErrorMessage", 'true');
                        window.localStorage.setItem("solutionMessageQuoteId",reqObj.MemberId);
                    }
                    if(prices ===  null && !prices.length) {
					  const mExist = loc.messages.find(m => m && (m.messageId === message.messageId));
					  if(!mExist) loc.messages.push(message);
					  resolve(null);
					} else  {
					  let priceObj = {};
					  //prices.forEach(p => priceObj[p.priceType] = parseFloat(p.price));
					  let mrcValue;
            let nrcValue;
            res.IPResult.prices.forEach(pri =>{
                if(pri.priceType == "MRC"){
                      mrcValue = parseFloat(pri.price);
                }
                else if(pri.priceType == "NRC"){
                      nrcValue = parseFloat(pri.price);
                }
            })
            let solutionId = res.IPResult.solutionId;
            //LBPSC-40898 - Even if isGreenLocation is true and CSP is being used, Offnet Costing needs to be called
            // in order to get the SolutionId. 
            //LBPSC-43980 - Decision made to treat Off-Net, Green-L as On-Net for all customers, not just CSP
            if (record.isGreenLocation__c.value == false) {
                record.OffnetMRC__c.value = mrcValue;
                record.OffnetNRC__c.value = nrcValue;
            }
					  record.SolutionId__c.value = solutionId;
					}
                    
					
				  });
	}
  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  deleteLineItemPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  applyAdjustmentPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  cloneItemsPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  getPriceDetailsPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  deleteAdjustmentPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * A custom function to be used by customers for customisation, any custom action prior to sdk call can be written here
   *  @param {object} input - Current Input Object.
   *  @memberof GBOfferConfig
   */
  getTimeListsPreHook(input) {
    return Promise.resolve(input);
  }

  /**
   * This function is used to make SDK call for getCartItems
   * @param {object} input - Current Input Object.
   * @param {object} data - Original pubsub input data
   * @memberof GBOfferConfig
   */
  getCartItemsSDKCall(input, data, cb) {
    this.sdk
      .getCartItems(input)
      .then(result => {
        this.getCartItemsProcessResponse(result);
        this.getCartItemsPostHook(result);
      })
      .catch(e => {
        this.getCartItemsHandleFailure(e);
      });
  }

  /**
   * This function is used to make SDK call for addProductToCart
   * @param {object} input - Current Input Object.
   * @param {object} data - Original pubsub input data
   * @memberof GBOfferConfig
   */
  addProductToCartSDKCall(input, data) {
    let childProductName = data.childProduct.name;
    let message = "Adding " + childProductName;
    this.showToast(message, "", "info", this);
    this.sdk
      .addProductToCart(input)
      .then(result => {
        let successMessage = "Added " + childProductName;
        this.showToast(successMessage, "", "success", this);
        this.addProductToCartProcessResponse(result, data);
        this.addProductToCartPostHook(result);
      })
      .catch(e => {
        let errorMessage = "Failed to add " + childProductName;
        this.showToast(errorMessage, "", "error", this);
        this.addProductToCartHandleFailure(e, data);
      });
  }

  /**
   * This function is used to make SDK call for updateLineItem
   * @param {object} input - Current Input Object.
   * @param {object} data - Original pubsub input data
   * @memberof GBOfferConfig
   */
  updateLineItemSDKCall(input, data) {
    let lineItemName = data.lineItem.name;
    let message = "Updating " + lineItemName;
    this.showToast(message, "", "info", this);
    /*if(this._sellerFlow || this.sellerAccountBiz != "" || this.macFlow){
		this.loading = true;
      let inputs = {
        "deleteAllAdjustment": "true",
        "quoteLineItemId": data.lineItemId,
		"macFlow":this.macFlow
      };
      let params = {
        input: JSON.stringify(inputs),
        sClassName: "vlocity_cmt.IntegrationProcedureService",
        sMethodName: "Seller_DeleteAdjustmentAPI",
        options: "{}"
      };
      this.omniRemoteCall(params, true)
        .then((response) => {
          if (response && response.result) {
			  this.loading = false;
            this.sdkUpdateCartLineItem(input, data,lineItemName,message);
          }
        }).catch((error) => {
			this.loading = false;
          console.log(error, "ERROR");
      });
    }else {*/
      this.sdkUpdateCartLineItem(input, data,lineItemName,message);
   // }
  }
  sdkUpdateCartLineItem(input, data,lineItemName,message){
    this.sdk
    .updateCartLineItem(input)
      .then(result => {
          let successMessage = "Updated " + lineItemName;
          this.showToast(successMessage, "", "success", this);
          this.updateLineItemProcessResponse(result, data);
          this.updateLineItemPostHook(result,data);
      })
      .catch(e => {
          let errorMessage = "Failed to update " + lineItemName;
          this.showToast(errorMessage, "", "error", this);
          this.udpateLineItemHandleFailure(e, data);
      });
  }
  getCartItemAPICall(){
    this.getB2BExpressSDK(this.workingCartId)
    .then(b2bSDK => {
      this.loading = true;
      this.sdk = b2bSDK;
      const input = { cartId: this.workingCartId };
      this.getCartItems(
      input,
      gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
      );
    })
    .catch(e => {
      this.loading = false;
    });
  }

  /**
   * This function is used to make SDK call for deleteLineItem
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  deleteLineItemSDKCall(input, data) {
    let lineItemName = data.lineItem.name;
    let message = "Deleting " + lineItemName;
    this.showToast(message, "", "info", this);
	this.loading = true;
    this.sdk
      .deleteCartItem(input)
      .then(result => {
        let successMessage = "Deleted " + lineItemName;
        this.showToast(successMessage, "", "success", this);
        this.deleteLineItemProcessResponse(result, data);
        this.deleteLineItemPostHook(result);
		this.loading = false;
      })
      .catch(e => {
        let errorMessage = "Failed to delete " + lineItemName;
        this.showToast(errorMessage, "", "error", this);
        this.deleteLineItemHandleFailure(e, data);
		this.loading = false;
      });
  }

  /**
   * This function is used to make SDK call for applyAdjustment
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  applyAdjustmentSDKCall(input, data) {
    this.showToast("Applying Adjustment", "", "info", this);
    this.sdk
      .applyAdjustment(input)
      .then(result => {
        this.showToast("Adjustment applied", "", "success", this);
        this.applyAdjustmentProcessResponse(result, data);
        this.applyAdjustmentPostHook(result);
      })
      .catch(e => {
        this.showToast("Failed to apply adjustment", "", "error", this);
        this.applyAdjustmentHandleFailure(e, data);
      });
  }

  /**
   * This function is used to make SDK call for cloneItems
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  cloneItemsSDKCall(input, data) {
    let lineItemName = data.lineItem.name;
    let message = "Cloning " + lineItemName;
    this.showToast(message, "", "info", this);
    this.sdk
      .cloneItems(input)
      .then(result => {
        let successMessage = "Cloned " + lineItemName;
        this.showToast(successMessage, "", "success", this);
        this.cloneItemsProcessResponse(result, data);
        this.cloneItemsPostHook(result);
      })
      .catch(e => {
        let errorMessage = "Failed to clone " + lineItemName;
        this.showToast(errorMessage, "", "error", this);
        this.cloneItemsHandleFailure(e, data);
      });
  }

  /**
   * This function is used to make SDK call for getPriceDetails
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  getPriceDetailsSDKCall(input, data) {
    this.sdk
      .getPriceDetails(input)
      .then(result => {
        this.getPriceDetailsProcessResponse(result, data);
        this.getPriceDetailsPostHook(result);
      })
      .catch(e => {
        let errorMessage = "Failed to Fetch Price Details ";
        this.showToast(errorMessage, "", "error", this);
        this.getPriceDetailsHandleFailure(e, data);
      });
  }

  /**
   * This function is used to make SDK call for deleteAdjustment
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  deleteAdjustmentSDKCall(input, data) {
    this.sdk
      .deletePriceAdjustments(input)
      .then(result => {
        this.deleteAdjustmentProcessResponse(result, data);
        this.deleteAdjustmentPostHook(result);
      })
      .catch(e => {
        let errorMessage = "Failed to Delete Price Adjustment ";
        this.showToast(errorMessage, "", "error", this);
        this.deleteAdjustmentHandleFailure(e, data);
      });
  }

  /**
   * This function is used to make SDK call for getTimeLists
   * @param {object} input - Current Input Object.
   * @memberof GBOfferConfig
   */
  getTimeListsSDKCall(input, data) {
    this.sdk
      .getTimeLists(input)
      .then(result => {
        this.getTimeListsProcessResponse(result, data);
        this.getTimeListsPostHook(result);
      })
      .catch(e => {
        let errorMessage = "Failed to fetch time lists";
        this.showToast(errorMessage, "", "error", this);
        this.getTimeListsHandleFailure(e, data);
      });
  }

 formatData(response) {
    if (!response.records) {
      return [];
    }
	let checkoutRecord;
    response.records.forEach(record => {
      const {
        attributeCategories = [],
        customFields: {
          vlocity_cmt__QuoteMemberId__c
        }
      } = record;
            if(record.customFields.ProductCode == "PRD_SimpleWAN_OFFER_2" && (this.omniJsonData && this.omniJsonData.IsOrderConfigure)){
                this.showTechnical = true;
                //this._isCheckout = true;
                //this.isCheckout = true;
            }
			if(record.customFields.ProductCode === 'PRD_FiberPlus_Internet_2' && record.customFields.Network_Status__c  != undefined)
			{
            this.networkStatus =  record.customFields.Network_Status__c.value; //43505
			}
            if(record.customFields.ProductCode == "PRD_Port" && record.customFields.Network_Status__c  != undefined && record.customFields.Network_Status__c.value =="Off-Net" && this._isTypeOrder){
              record.attributeCategories.forEach(cat => {
                cat.productAttributes.forEach(attr => {
                  if(attr.code == "ATT_Backup_Power_Customer_Site"){
                    if(attr.userValues == null){
                      this.portConfigure = false;
                        if(JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && vlocity_cmt__QuoteMemberId__c.value != undefined){
                          let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
                          if(storedVal[vlocity_cmt__QuoteMemberId__c.value] != undefined){
                            storedVal[vlocity_cmt__QuoteMemberId__c.value]["PortSection"] = 'NotCompleted';
                            window.localStorage.setItem("orderConfigureObject", JSON.stringify(storedVal));
                          }
                        }
                        console.log("inside 2 if");
                    }else{
                      this.portConfigure = true;
                      if(JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && vlocity_cmt__QuoteMemberId__c.value != undefined){
                        let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
                        if(storedVal[vlocity_cmt__QuoteMemberId__c.value] != undefined){
                          storedVal[vlocity_cmt__QuoteMemberId__c.value]["PortSection"] = 'Completed';
                          window.localStorage.setItem("orderConfigureObject", JSON.stringify(storedVal));
                        }
                      }
                      console.log("inside 2 else");
                    }
                  }
                })
              })
            }
       if(record.customFields.ProductCode === 'PRD_FiberPlus_Internet_2' && !this.isTypeOrder && !this.readOnly && !this.isQuoteSummary)
      {
        if(record.customFields.Network_Status__c !=undefined && record.customFields.Network_Status__c.value =="Near-Net"){
          this.fiberNearNetMsg=true;
      }
    }
    //EDGEP-85-start
  if(record.customFields.ProductCode == "PRD_EDGE_EVM" || record.customFields.ProductCode == "PRD_EDGE_EBM") {
    
    
      this.isEDGE = true;
      this.omniApplyCallResp({
        'isEDGE': true
      });
      console.log('This is edge product for testing ::::::JSON::::::::'+JSON.stringify(this.omniJsonData));
    
    
    console.log('This is edge product for testing ::::::after::::::::'+this.isEDGE);
    
     
 }
//EDGEP-85-- end
      if(record.customFields.ProductCode == "PRD_SimpleWAN_OFFER_2" && this._isTypeOrder){
        console.log("inside 1 if");
				if(record.lineItems != undefined && record.lineItems){
				  this.hyperwanConfigure = true;
				  if(JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && vlocity_cmt__QuoteMemberId__c.value != undefined){
					let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
					if(storedVal[vlocity_cmt__QuoteMemberId__c.value] != undefined){
						storedVal[vlocity_cmt__QuoteMemberId__c.value]["HyperwanSection"] = 'Completed';
						window.localStorage.setItem("orderConfigureObject", JSON.stringify(storedVal));
                    }
                  }
                console.log("inside 2 if");
				}else{
					this.hyperwanConfigure = false;
					if(JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && vlocity_cmt__QuoteMemberId__c.value != undefined){
						let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
						if(storedVal[vlocity_cmt__QuoteMemberId__c.value] != undefined){
						  storedVal[vlocity_cmt__QuoteMemberId__c.value]["HyperwanSection"] = 'NotCompleted';
                          window.localStorage.setItem("orderConfigureObject", JSON.stringify(storedVal));
						}
					}
                    console.log("inside 2 else");
				}
			}
			if(record.customFields.ProductCode == "PRD_DDOS_MS"){
				this.showServiceInstallation = false;
			}
			 if( this.macFlow && record.customFields.ProductCode == "PRD_DDOS_MS" ){
                record.attributeCategories.forEach(cat => {
                    cat.productAttributes.forEach(attr => {
						if(attr.code == "ATT_PSSA_YN" && attr.userValues == "No" && this.initialLoad == true ){
							this.omniApplyCallResp({
								'initialLoad': false
							});
							
							this.initialLoad = false;
                            //this.macPssaError = true;
						} 
                        else if(attr.code == "ATT_PSSA_YN" && attr.userValues == "Yes" && this.initialLoad == true ){
							this.initialLoad = false;
							this.omniApplyCallResp({
								'initialLoad': false
							});
							
                            this.macPssaError = true;
						}                      
                    })
                })
            }
			if(record.customFields.ProductCode != "PRD_SimpleWAN_OFFER_2"  && (this.omniJsonData && this.omniJsonData.IsOrderConfigure)){
                for (let i = 0; i < attributeCategories.length; i++) {
                    if (
                        attributeCategories[i].code.toLowerCase().includes('general') // TODO remove once hidden is implemented
                    ) {
                        attributeCategories.splice(i, 1);
                        i--;
                    } 
                    else {
                        // TODO remove hidden attributeCategories.productAttributes
                        attributeCategories[i].name = null;
                    }
                }
            }
            else if(record.customFields.ProductCode != "PRD_SimpleWAN_OFFER_2"){
              for (let i = 0; i < attributeCategories.length; i++) {
                if (
                    attributeCategories[i].code.toLowerCase().includes('order') ||
                    attributeCategories[i].code.toLowerCase().includes('general') // TODO remove once hidden is implemented
                ) {
                    attributeCategories.splice(i, 1);
                    i--;
                } 
              }
            }
           
            if(record.customFields.ProductCode == "PRD_FiberPlus_Port"){
                record.attributeCategories.forEach(cat => {
                    cat.productAttributes.forEach(attr => {
                        if(attr.code == "ATT_FIBERPLUS_CPE_PROVIDER" && attr.userValues == "Lumen Provided"){
                            this.isLumenProvided = true;
                        }else if(attr.code == "ATT_FIBERPLUS_CPE_PROVIDER" && attr.userValues == "Customer Provided"){
                            this.isLumenProvided = false;
                        }
                    })
                })
            }
            if(record.customFields.ProductCode == "PRD_FiberPlus_Onsite_Install" && record.itemType == "lineItem"){
                this.hasOptionalItem = true;
                this.optItem = record;                 
                }
            
      if (record.childProducts) {
                this.addOnData = record.childProducts;
        const { records = [] } =  this.formatData({records: record.childProducts})
        record.childProducts = records;
      }
      if (record.lineItems) {
        const { records = [] } =  this.formatData({records: record.lineItems})
        record.lineItems = records;
      }
      let _quoteMemberId = this.quoteMemberId || (vlocity_cmt__QuoteMemberId__c && vlocity_cmt__QuoteMemberId__c.value)
      let _quoteMemberName = this.quoteMemberName || (record.customFields.vlocity_cmt__QuoteMemberId__r && record.customFields.vlocity_cmt__QuoteMemberId__r.Name)
      let _quoteMemberOrderId = this.quoteMemberOrderId || (record.customFields.vlocity_cmt__QuoteMemberId__r && record.customFields.vlocity_cmt__QuoteMemberId__r.Quote_Member_Id__c)
      console.log('++ChildOrderGb = '+_quoteMemberOrderId );
      if(!this.isSupp){
      console.log('++ChildOrderGbIF = '+_quoteMemberOrderId );
      const path = record.productHierarchyPath.split('<');
      if (path.length <2) {
        let _location = this.locations.find( ({ id }) => id === _quoteMemberId );
        if (!_location) {
          let prefill = {};
	  if(window.localStorage.getItem("showShippingInfo")){
          	this.showShippingInfo = window.localStorage.getItem("showShippingInfo"),
                prefill.showShippingInfo = this.showShippingInfo
           }
            if (this.omniJsonData && this.omniJsonData.IsOrderConfigure) {
                prefill.ReadOnly= this.readOnly,
                prefill.SelectedCustomerNumber= this.omniJsonData.SelectedCustomerNumber,
                prefill.EnterpriseQuoteId= this.omniJsonData.EnterpriseQuoteId,
                prefill.QuoteMemberId= this.omniJsonData.QuoteMemberId,
                prefill.enterpriseId= this.omniJsonData.enterpriseId,
                prefill.AuthFlow=this.authFlow,
				prefill.ServiceId=this.omniJsonData.serviceid,
				prefill.BillingQuoteMemberId = this.omniJsonData.QuoteMemberId,
				prefill.OnlyMetroRing1Available = this.isMetroRing1Available
                if (this.omniJsonData.selectedBan) {
                    prefill.selectedBan = this.omniJsonData.selectedBan
                }
                            if (this.omniJsonData.MacFlow) {
                                prefill.MacFlow = this.omniJsonData.MacFlow
                            }
            }
            else{
                console.log('entered else part');
                prefill.ReadOnly= this.readOnly,
                prefill.isCheckout= this._isCheckout,
                prefill.IsTypeDisconnect= this._isTypeDisconnect,
                prefill.EnterpriseQuoteId= this._enterpriseQuoteId,
                prefill.AuthFlow=this.authFlow,
                prefill.QuoteMemberId=_quoteMemberId,
                prefill.MacFlow = this._macFlow,
				prefill.ServiceId=this.serviceid,
				prefill.BillingQuoteMemberId = _quoteMemberId
            }
          _location = {
            title: _quoteMemberName,
            attributes: [],
            columns: [],
            itemType: "location",
            childOrderNumber: _quoteMemberOrderId,
            records: [],
            id: _quoteMemberId,
            messages: [],
            subLabel: '',
            prefillSummary: prefill,
            showTile: this.isLumenProvided && !this.hasOptionalItem && !this.readOnly && !this.IsOrderConfigureStep,
            addOnData: this.addOnData
          }
			if(this._isOrderDetails == true || this._isTypeDisconnect == true){
				
			//Fetching Hyperwan and Port Details
			 if(JSON.parse(window.localStorage.getItem("orderConfigureObject")) != undefined && _quoteMemberId != undefined){
				let storedVal = JSON.parse(window.localStorage.getItem("orderConfigureObject"));
			     if(storedVal[_quoteMemberId] != undefined){
                  if(storedVal[_quoteMemberId]["HyperwanSection"] != undefined){
                   if(storedVal[_quoteMemberId]["HyperwanSection"] === "NotCompleted"){
                    this.hyperwanComplete = false;
              }
              else{
                if(storedVal[_quoteMemberId]["VPNSection"] != undefined){
                  if(storedVal[_quoteMemberId]["VPNSection"] === "NotCompleted"){
                    this.hyperwanComplete = false;
                  }
                }
              }
            }
            if(storedVal[_quoteMemberId]["PortSection"] != undefined){
              if(storedVal[_quoteMemberId]["PortSection"] === "NotCompleted"){
                this.portComplete = false;
              }
           
            }
          }
        }
			const inputs = {
              "QuoteMemberId": _quoteMemberId,
			  "MacFlow": this._macFlow ? this._macFlow : false,
              "NetworkStatus": this.networkStatus, 
			  "showShippingInfo": this.showShippingInfo ? this.showShippingInfo : this.showShippingInfo
            }
            const options = {
              //queueableChainable: true
            };
            const params = {
              input: JSON.stringify(inputs),
              sClassName: "vlocity_cmt.IntegrationProcedureService",
              sMethodName : 'orderDetails_Checkout',
              options: JSON.stringify(options)
            };
            
            console.info("params for VIP", params)
            this.omniRemoteCall(params, true).then(response => {
              this.loading = false;
              this.checkoutArray.push(response.result.IPResult);
              if(this.checkoutArray.length == this.locations.length){
                checkoutRecord = this.checkoutArray.filter(r => r.Checkout == true);
                  if(checkoutRecord.length || !this.portComplete || !this.hyperwanComplete){
                    const checkoutFlag = true;
                    pubsub.fire("checkoutEvent", "checkout", {
                      checkout: checkoutFlag
                        });
                  }
				  else{
					const checkoutFlag = false;
                    pubsub.fire("checkoutEvent", "checkout", {
                      checkout: checkoutFlag
                        }); 
				  }
              }
              pubsub.fire("iconCheck","iconCheckVal",this.checkoutArray);
            })
         } 
          this.locations.push(_location);
          this.locationIds.push(_quoteMemberId)
        }
		
		//for unauth locations size
        if(!this.authFlow){
            pubsub.fire("locationLengthUnauthEvent","locationLengthUnauth",this.locations.length);
        }
        //for unauth locations size
		
        if(record.customFields.Product2 && record.customFields.Product2.Primary_Parent_Product__c && record.customFields.Product2.Location_Based__c === "Yes") _location.subLabel = record.name;
        if (_location.id === _quoteMemberId) {
          _location.records.unshift(record);
          _location.messages.push(...this.processMessages(record));    
          _location.addOnData = this.addOnData;
          _location.showTile = this.isLumenProvided && !this.hasOptionalItem && !this.readOnly && !this.IsOrderConfigureStep
          }
          /*if(!this.isLumenProvided && this.hasOptionalItem){
						this.hasOptionalItem = false;
                        pubsub.fire("b2b_update_cart", "data", {
                            lineItem: this.optItem,
                            lineItemId: this.optItem.id,
                            rootBundleId: this.optItem.rootItemId,
                            parentId: this.optItem.parentId,
                            action: "deleteLineItem"
                        });
        } This part of code is needed in future*/
      }
      let inputs = {
        wQuoteMemberId : this._workingCartId,
        clsa : this._clsa,
        bprogramval : this._bprogram,
        selectedTerm : this._termSelected //LBPSC-45598
      }; 
      const params = {
      input: inputs,
      sClassName: "vlocity_cmt.IntegrationProcedureService",
      sMethodName: "Update_qli",
      options: "{}"
      }; 
	  if(this._clsa != '' || this._bprogram != ''){
		 this.omniRemoteCall(params, true).then((response) => {
			if (response && response.result && response.result.IPResult) {
			  
			}
		})
	  }
    }else{
      //if Supp Flow
      let inputs = {
        ChildOrderNumber: _quoteMemberOrderId
      }; 
      const params = {
      input: JSON.stringify(inputs),
      sClassName: "vlocity_cmt.IntegrationProcedureService",
      sMethodName: "IP_GetOLIDetails",
      options: "{}"
      };
      
      this.omniRemoteCall(params, true)
      .then((response) => {
        if (response && response.result && response.result.IPResult) {
			if(response.result.IPResult.OrderItem != undefined){
				this.isPONRFlag = response.result.IPResult.Res.OrderItem[0].isPONRReached;	
			}          
          let _productName = (record.customFields.Product2 && record.customFields.Product2.Name);
          console.log('++ProductName = '+_productName);
          const path = record.productHierarchyPath.split('<');
          if (path.length <2) {
            let _location = this.locations.find( ({ id }) => id === _quoteMemberId );
            if (!_location) {
            let prefill = {};
            if (this.omniJsonData && this.omniJsonData.IsOrderConfigure) {
                prefill.ReadOnly= this.readOnly,
                prefill.SelectedCustomerNumber= this.omniJsonData.SelectedCustomerNumber,
                prefill.EnterpriseQuoteId= this.omniJsonData.EnterpriseQuoteId,
                prefill.QuoteMemberId= this.omniJsonData.QuoteMemberId,
                prefill.enterpriseId= this.omniJsonData.enterpriseId,
                prefill.AuthFlow=this.authFlow,
				prefill.MacFlow=this.macFlow,
				prefill.ServiceId=this.omniJsonData.serviceid,
				prefill.BillingQuoteMemberId=this.omniJsonData.QuoteMemberId,
				prefill.OnlyMetroRing1Available = this.isMetroRing1Available
                if (this.omniJsonData.selectedBan) {
                    prefill.selectedBan = this.omniJsonData.selectedBan
                }
            }
            else{
                console.log('entered else part');
                prefill.ReadOnly= this.readOnly,
                prefill.isCheckout= this._isCheckout,
                prefill.IsTypeDisconnect= this._isTypeDisconnect,
                prefill.EnterpriseQuoteId= this._enterpriseQuoteId,
                prefill.AuthFlow=this.authFlow,
                prefill.QuoteMemberId=_quoteMemberId,
                prefill.MacFlow = this._macFlow,
				prefill.ServiceId=this.serviceid,
				prefill.BillingQuoteMemberId=_quoteMemberId
            }
            _location = {
              title: _quoteMemberName,
              attributes: [],
              columns: [],
              itemType: "location",
              records: [],
              id: _quoteMemberId,
              messages: [],
              subLabel: _productName,
              childOrderNumber: _quoteMemberOrderId,
              prefillSummary: prefill
             }
			
            this.locations.push(_location);
            this.locationIds.push(_quoteMemberId)
            }
            if(record.customFields.Product2 && record.customFields.Product2.Primary_Parent_Product__c && record.customFields.Product2.Location_Based__c === "Yes") _location.subLabel = record.name;
            if (_location.id === _quoteMemberId) {
              _location.records.unshift(record);
              _location.messages.push(...this.processMessages(record));    
            }
          }
        }
      }).catch((error) => {
        console.log(error, "ERROR");
      });      
     }//else isSuppFlow      
    }) 
	 pubsub.fire("backtoConfigureEvent", "selectedLocations", {
      selectedLocations: this.locations
        });
    return response;
  }
  processMessages(record, arr) {
    if(!arr) { var arr = [] };
    arr.push(...record.messages);
    if(record.lineitems) record.lineitems.forEach(item => processMessages(item, arr));
    return arr;
  }
  calculateLinePrice(records, monthly, oneTime) {
    records.forEach(record => {
      const {
        oneTimeTotal: {
          value: oneTimeTotal
        }, recurringTotal: {
          value: recurringTotal
        }
      } = record.prices;
      monthly += recurringTotal;
      oneTime += oneTimeTotal;
      if (records.lineItems) {
        const {
          monthly: monthlyChild,
          oneTime: oneTimeChild
        } = this.calculateLinePrice(records.lineItems, monthly, oneTime)
        monthly += monthlyChild;
        oneTime += oneTimeChild;
      }
    })
    return {
      monthly,
      oneTime
    }
  }
  formatMonthlyColumn(data) {
    return {
      dataType: 'Currency',
      label: 'Monthly',
      value: {
        dataType: 'CURRENCY',
        fieldName: "vlocity_cmt__RecurringCharge__c",
        location: true,
        editable: false,
        hidden: false,
        label: "Recurring Charge",
        value: data
      },
      valueMap: "vlocity_cmt__RecurringCharge__c"
    }
  }

  formatOneTimeColumn(data) {
    return {
      dataType: 'Currency',
      label: 'One Time',
      value: {
        dataType: 'CURRENCY',
        fieldName: "vlocity_cmt__OneTimeCharge__c",
        location: true,
        editable: false,
        hidden: false,
        label: "One Time Charge",
        value: data
      },
      valueMap: "vlocity_cmt__OneTimeCharge__c"
    }
  }
  processResponse(response, input) {
    this.loading = true; 
    // if(response.crossActionMessages && response.crossActionMessages.length){
    //   response.crossActionMessages.map(message => {
    //     const record = response.records.find(r=>r.id === message.Id);
    //     if(record && !(record.customFields.QuoteMemberId__c && record.customFields.QuoteMemberId__c.value)) {
    //       const item = response.records.find(r=> r.customFields.QuoteMemberId__c && r.customFields.QuoteMemberId__c.value);
    //       const r = this.sdk.cartItems.records.find(r=> r.Id.value === record.id)
    //       r.QuoteMemberId__c = item.customFields.QuoteMemberId__c;
    //       const lineItem = {
    //         lineItem: JSON.parse(JSON.stringify(record)),
    //         rootBundleId: record.rootItemId,
    //         parentId: record.parentId,
    //         lineItemId : record.id,
    //         action: "updateLineItem",
    //         lineItemDetails: {
    //           action: ""
    //         }
    //       }
    //       this.updateLineItem(lineItem);
    //     } else {
    //       this.cartItems = this.processLocations(response);
    //       Promise.resolve().then(() => {
    //         this.loading = false;
    //       });
    //       pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    //     }
    //   })
    // } else {
      this.updateONSPrice();
      this.cartItems = this.processLocations(response);      
      Promise.resolve().then(() => {
        this.loading = false;
      });
      pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    // }
  }

  processLocations(response) {
    this.locations.forEach(_location => {
      _location.records = [];
      _location.messages = _location.messages.filter(m=> m.type === 'custom');
    })
      // if(response.crossActionMessages.length) this.addMissingIds(response);
    const formattedResponse = this.formatData(response);
    this.omniApplyCallResp({
      "locationIds": this.locationIds
    })

    let isDirty = false;
	let disablePrevButton = false;
  
    this.locations.forEach(l =>{
      const { monthly, oneTime } = this.calculateLinePrice(l.records, 0, 0);
      const columns = [
        this.formatOneTimeColumn(oneTime),
        this.formatMonthlyColumn(monthly)
      ]
      l.columns = columns;
      l.records.forEach(record => {
        let hasSdWan = false;
        if (record.name.includes('SD-WAN')) {
          hasSdWan = true;
        }
        pubsub.fire("gb_location_update", "data", {
          result: { hasSdWan, id: l.id }
        });
      })
      if(l.messages.length) isDirty = true;
    });
	//if(response.messages.length) isDirty = true;
	if (response.messages && response.messages.length) {
        isDirty = false;
      response.messages.forEach(message => {
        if (message.severity === "ERROR") {
          isDirty = true;
        }        
      });
    }
	if(this.solutionIdErrorMessage){
      isDirty = true;
      disablePrevButton = true;
      if(disablePrevButton){
        pubsub.fire("DisableNavButton","DisableNavButtonData",{
          PrevButton : disablePrevButton
        });
      }
    }
	if(this.locBased) this.fireEvent("gbvalidate", { 'status' : isDirty});
    else pubsub.fire('gb_validate_status',"data", { 'status' : isDirty})
    return formattedResponse;
  }
  updateONSPrice(){
    if(this.macFlow && this.isMacLumenProvided == true && this.retry){
	  this.OnsiteInstallOTC=0;
	  if(this.omniJsonData && this.omniJsonData.InstallPrices){
			const ONSOTCharge =  this.omniJsonData.InstallPrices.find(r=> r.OnsiteInstallation=='Yes' && r.CSP=='List');
			if(ONSOTCharge){this.OnsiteInstallOTC=ONSOTCharge.NRC;}
		}

      this.retry = false;
      let adjustmentData = {
          detailType: 'OVERRIDE',
          method: 'ABSOLUTE',
          PricingVariableCode:'OT_STD_PRC',
          Field:'vlocity_cmt__OneTimeCharge__c',
          AdjustmentType:'OVERRIDE',
          value: this.OnsiteInstallOTC
          };
        let data = {
        actionObj: this.optItem.prices['oneTimeCharge'].actions.applyadjustment,
            action: "applyAdjustment",
            lineItem: this.optItem,
            fromModal: true,
            adjustmentData: adjustmentData,
            rootBundleId: this.optItem.rootItemId,
            parentId: this.optItem.parentId,
            lineItemId: this.optItem.id
          }
          this.applyAdjustment(data);      
                   
      }
      if( this.macFlow && this.isMacLumenProvided == false && this.retry){
        this.retry = false;
        let adjustmentData = {
            detailType: 'OVERRIDE',
            method: 'ABSOLUTE',
            PricingVariableCode:'OT_STD_PRC',
            Field:'vlocity_cmt__OneTimeCharge__c',
            AdjustmentType:'OVERRIDE',
            value: 0
            };
          let data = {
          actionObj: this.optItem.prices['oneTimeCharge'].actions.applyadjustment,
              action: "applyAdjustment",
              lineItem: this.optItem,
              fromModal: true,
              adjustmentData: adjustmentData,
              rootBundleId: this.optItem.rootItemId,
              parentId: this.optItem.parentId,
              lineItemId: this.optItem.id
            }
            this.applyAdjustment(data);
           
                     
        }
  }

  /**
   * This function is used to process getCartItems response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  getCartItemsProcessResponse(result) {
    this.loading = true;
    this.cartItems = this.processResponse(Object.assign({}, result));
    console.log('inside getCartItemsProcessResponse , cartItems : ' + JSON.stringify(this.cartItems));
    Promise.resolve().then(() => {
      this.loading = false;
    });
  }

  /**
   * This function is used to process addProductToCart response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  addProductToCartProcessResponse(result, input) {
    this.loading = true;
    this.cartItems = this.processResponse(Object.assign({}, result),input);
    Promise.resolve().then(() => {
      this.loading = false;
    });
    pubsub.fire("b2b_handle_status_" + input.childProduct.id, "data", {});
  }

  /**
   * This function is used to process updateLineItem response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  updateLineItemProcessResponse(result, input) {
    this.loading = true;
    this.cartItems = this.processResponse(Object.assign({}, result), input);
	if(this.refreshCart){
      this.getB2BExpressSDK(this.workingCartId)
      .then(b2bSDK => {
          this.sdk = b2bSDK;
          const input = { cartId: this.workingCartId };
          this.getCartItems(
          input,
          gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
          );
      })
      .catch(e => {
          this.loading = false;
      });
    }
	
    //45485 - MAC pricing adjustment Update logic	
    if(this.macFlow){	
      this.updatePriceAdjustmentMAC(result, input);	
    }	
    //45485 - MAC pricing adjustment Update logic
	
	if(this._sellerFlow || this.sellerAccountBiz != ""){
     // this.getCartItemAPICall();
    }
    this.refreshCart = false;
  }

  /**
   * This function is used to process deleteLineItem response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  deleteLineItemProcessResponse(result, input) {
    this.loading = true;
	this.getB2BExpressSDK(this.workingCartId)
                                .then(b2bSDK => {
                                    this.sdk = b2bSDK;
                                    const input = { cartId: this.workingCartId };
                                    this.getCartItems(
                                    input,
                                    gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
                                    );
                                })
                                .catch(e => {
                                    this.loading = false;
                                });
    //this.cartItems = this.processResponse(Object.assign({}, result),input);
    Promise.resolve().then(() => {
      this.loading = false;
    });
    pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
  }

  /**
   * This function is used to process applyAdjustment response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  applyAdjustmentProcessResponse(result, input) {
	this.loading = true;
    this.cartItems = this.processResponse(Object.assign({}, result), input);    
    if (!input.fromModal) {
      this.loading = true;
      Promise.resolve().then(() => {
        this.loading = false;
      });
      pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    } else {
      pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {
        action: "getPriceDetails"
      });
    }
  }

  /**
   * This function is used to process cloneItems response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  cloneItemsProcessResponse(result, input) {
    this.loading = true;
    this.cartItems = this.processResponse(Object.assign({}, result));
    Promise.resolve().then(() => {
      this.loading = false;
    });
    pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
  }

  /**
   * This function is used to process getPriceDetails response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  getPriceDetailsProcessResponse(result, input) {
    pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {
      response: result
    });
  }

  /**
   * This function is used to process deleteAdjustment response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  deleteAdjustmentProcessResponse(result, input) {	  
    pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {
      action: "getPriceDetails"
    });
	
	this.getB2BExpressSDK(this.workingCartId)
	.then(b2bSDK => {
		this.loading = true;		
		this.sdk = b2bSDK;
		const input = { cartId: this.workingCartId };
		this.getCartItems(
		input,
		gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
		);
	})
	.catch(e => {
		this.loading = false;
	});
}

  /**
   * This function is used to process getTimeLists response
   * @param {object} response - Response Object from SDK call.
   * @memberof GBOfferConfig
   */
  getTimeListsProcessResponse(result, input) {
    pubsub.fire("b2b_handle_time_lists_" + input.lineItem.id, "data", {
      result: result
    });
  }

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  getCartItemsPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  addProductToCartPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  updateLineItemPostHook(response, input) {
    const code = input.lineItemDetails.data ? input.lineItemDetails.data.code : null;
    if(code === 'ATT_Bandwidth_SimpleWAN') {
      const record = this.sdk.cartItems.records.find(r=> r.ProductCode === 'PRD_Port');
      if(record && record.Network_Status__c && record.Network_Status__c.value === 'Off-Net') {
        let mId = this.quoteMemberId || record.vlocity_cmt__QuoteMemberId__c.value;
        let loc = this.locations.find(l => l.id === mId);
        let _c2;
        for(let cat of record.attributeCategories.records) {
          for(let att of cat.productAttributes.records) {
            if(att.code ==='ATT_Port_Speed') {
              _c2 = att;
              break;
            }
          }
          if(_c2) break;
        }

        let data = {
          lineItem: JSON.parse(JSON.stringify(record)),
          rootBundleId: record.Id.value,
          parentId: record.parentId,
          lineItemId : record.Id.value,
          action: "updateLineItem",
          lineItemDetails: {
            action: "updateAttribute",
            data: {
              attributeHierarchyPath: '',
              value: null
            }
          },
          customObj: {
            code: 'Port',
            loc: mId
          }
        } 
        if(_c2.userValues != null) {
          loc.itemLoading = data.customObj.code; 
          this.updateLineItem(data);
          // input.actionObj.remote.params.validate = false;
        }  
      } 
    } 
	/**************POST HOOK to Update the device option as rent*****************/
	  if(code === 'ATT_FIBERPLUS_CPE_PROVIDER') {
      const record = this.sdk.cartItems.records.find(r=> r.ProductCode === 'PRD_FiberPlus_Internet_2');
    //  const CPErecord = this.sdk.cartItems.records[0].lineitems.records.find(r=> r.ProductCode === 'PRD_FiberPlus_CPE');

	 // let _deviceOption = CPErecord.attributeCategories[0].productAttributes[3].userValues;
	  let _CPEProvider = input.lineItemDetails.data.value;
    console.log('CPE Providere --> ',_CPEProvider);
	  if(this.isDeviceLumenFlag == true){
		let data = {
          lineItem: JSON.parse(JSON.stringify(record)),
          rootBundleId: record.Id.value,
          parentId: record.parentId,
          lineItemId : record.Id.value,
          action: "updateLineItem",
          lineItemDetails: {
            action: "updateAttribute",
            data: {
              attributeHierarchyPath: '',
              value: _CPEProvider,
              code: "ATT_FIBERPLUS_CPE_PROVIDER"
            }
          }
        } 
        this.isDeviceLumenFlag = false;  
          this.updateLineItem(data);
			}		
    }
	
	/*******************************/
	
    if(input.customObj) {
      const l = this.locations.find(l=>l.id=== input.customObj.loc);
      if(l) l.itemLoading = null;
    }
//	this.handleSaveCartItem(response,input);
const workingCart = this.sdk.cartItems;
        const rootItem = workingCart.records[0];
        vtag.track('productClick', {
            'ComponentId': this.componentId,
            //'ComponentId': 'a2d0n000000Hg8ZAAS',
            'effectiveQuoteTotal': workingCart.prices.effectiveQuoteTotal,
            'effectiveRecurringTotal': workingCart.prices.effectiveRecurringTotal,
            'priceListId': workingCart.prices.priceListId,
            'ProductName': rootItem.Name,
            'ProductCode': rootItem.ProductCode,
            'productHierarchyPath': rootItem.productHierarchyPath,
            'productId': rootItem.productId
        });
        //end of OmniAnalytics Tracking
  }
   @api lumen = false;
  handleSaveCartItem(resp,input){
    if(resp){
        if(input.lineItem.customFields.ProductCode == "PRD_FiberPlus_CPE"){
        resp.records.forEach(res => {
            res.lineItems.forEach(response => {
				if(response.customFields.ProductCode === "PRD_FiberPlus_CPE" ){
					response.attributeCategories.forEach(res1 => {
						res1.productAttributes.forEach(res2 => {
							if(res2.code === "ATT_FIBERPLUS_CPE_PROVIDER" && res2.userValues === "Lumen Provided"){
								this.lumen = true;
							}
							if(this.lumen && res2.code === "ATT_FIBERPLUS_CPE_OPTIONS" && res2.userValues === "Rent"){
								let output1 = {
									output : ""
								}
								let options1 = {
									options : ""
								}
								const params = {
									input: {
										"methodName": "getCartsItems.PostInvoke",
										"input":  response.id ,
										"output": output1,
										"options":options1
									},
									sClassName: 'setQLIAttributeValueByAttributeCode',
									sMethodName: 'invokeMethod',
									options: '{}',
								};
								this.loading = true;
								this.omniRemoteCall(params, true).then(response => {
									window.console.log(response, 'response');
								}).catch(error => {
									window.console.log(error, 'error');
								});
                                
                                this.getB2BExpressSDK(this.workingCartId)
                                .then(b2bSDK => {
                                    this.sdk = b2bSDK;
                                    const input = { cartId: this.workingCartId };
                                    this.getCartItems(
                                    input,
                                    gbOfferConfigJson.APIConfig.connectedCallback.getCartItems
                                    );
                                })
                                .catch(e => {
                                    this.loading = false;
                                });
                                this.loading = false
							}
						})
					})
				}
			})
		})
    }
	}
 }
   
	//LBPSC-45485 **Start**
 /**	
   * A custom function to be used by customers for MAC price update if adjustment available and applied	
   */	
  updatePriceAdjustmentMAC(response, data){	
    this.loading = true;
    // data is having ID for QLI, calling DR to get 2 fields for mrc and nrc discount % value
    let record = response.records.find(r=> r.name === data.lineItem.name);	

	
	//LBPSC-46466
	if(record == undefined){
		console.log('undefined record MAC adjustment!');
      response.records.forEach(rec => {
        if(rec.customFields.ProductCode == "PRD_DDOS_MS" || rec.customFields.ProductCode == "PRD_FiberPlus_Internet_2"){
          if(rec.lineItems != undefined){
            rec.lineItems.forEach(lItem => {
              if(lItem.id == data.lineItem.id){
                console.log('child line item: '+lItem.name+' child line item id: '+lItem.id);
                record = lItem;
              }
            });
          }
        }
      });
    }
	if(data.lineItemDetails.data.code === "ATT_ADDI_QTY" || data.lineItemDetails.data.code === "ATT_Include_Unlimited_Address_Space_Size"){
      if(data.lineItemDetails.data.value === "0" || data.lineItemDetails.data.value === "No"){
		console.log('returning as attribute is 0 or No.');
        return;
      }
    }
	//LBPSC-46466
    console.log('data.lineItem Id -- > ',data.lineItem.id);
    const reqObj = {
      qliId : data.lineItem.id
    }     
    //checking for floor value: required attribute Categories
    let attrs = "";
    this.attribute = [];
    this.attrCodes = ["ATT_TERM","ATT_FIBERPLUS_CPE_PROVIDER","ATT_FIBERPLUS_CPE_OPTIONS","ATT_FP_Zone"];
    record.attributeCategories.forEach(cat => {
      cat.productAttributes.forEach(attr => {
        if((!attr.hidden && attr.code!="ATT_PSSA_YN") || this.attrCodes.includes(attr.code)){
          if(record.customFields.ProductCode == "PRD_DDOS_MS" || record.customFields.ProductCode == "PRD_CTR_Path"){
            this.attribute.push(attr.userValues);
          }else{
            attrs = attrs + attr.userValues + ";"
          } 
        }
      });
    });
    if(this.attribute.length){
      this.attribute.push(this.attribute.shift());
      this.attribute.map(attr => {
        attrs = attrs + attr + ";"
      });
    }
    if(record.customFields.ProductCode == "PRD_CTR_Path") attrs = attrs.substr(0,attrs.length-1) + " additional CTRPs/FBMs;";
    //invoking IP for floor prices
    let reqObject = {
      "lineItemId" : data.lineItem.id,
      "ProductCode" : data.lineItem.customFields ? data.lineItem.customFields.ProductCode : data.lineItem.ProductCode,
      "ThresholdPricing" : true,
      "AttributesCombined" : attrs 
    }	 
    invokeVIP('GB_ddosPricingData', reqObject).then((res)=> {    
      console.log("Response Threshold in Offerconfig - MAC - ", JSON.parse(res));
      const result = JSON.parse(res).IPResult;
      //this.floorValueMRC = result.MRCFloor.includes(".")?parseFloat(result.MRCFloor):parseInt(result.MRCFloor);
      //this.floorValueNRC = result.NRCFloor.includes(".")?parseFloat(result.NRCFloor):parseInt(result.NRCFloor);
       result.map(res => {
         let value = res.Attributes.substr(0, res.Attributes.lastIndexOf(";"));
         if(value == attrs.substr(0, attrs.length-1)){
           this.floorValueMRC = res.MRCFloor.includes(".")?parseFloat(res.MRCFloor):parseInt(res.MRCFloor);
           this.floorValueNRC = res.NRCFloor.includes(".")?parseFloat(res.NRCFloor):parseInt(res.NRCFloor);
         }
       });
      console.log('floor values are ******-- mrc - ',this.floorValueMRC+'  nrc - '+this.floorValueNRC);
      invokeDR('DR_GetAdjustedMRCNRC', reqObj).then(r => {
              const res = typeof r === "string" ? JSON.parse(r) : r;
              console.log('res is 2329*******-- ',JSON.stringify(res));
              console.log('data.lineItem.prices.oneTimeCharge.value --> ',record.prices.oneTimeCharge.value);
              console.log('data.lineItem.prices.recurringCharge.value --> ',record.prices.recurringCharge.value);

              if(res[0].AdjustedNRCPercent != undefined ){
                console.log('inside ADJ ** NRC *****',record.prices.oneTimeCharge.value);
                if(record.prices.oneTimeCharge.value > 0){
                  let otc = record.prices.oneTimeCharge.value;
                  let adjustedOtc = parseFloat(Math.abs(((100 - res[0].AdjustedNRCPercent)/100) * otc)).toFixed(2);
                  let approvedOtc = adjustedOtc;
                  if(adjustedOtc < this.floorValueNRC){
                    approvedOtc = this.floorValueNRC; //floor value in case if adjusted Value , floor price
                  }
                  console.log('approvedOtc NRC--> ',approvedOtc); 
                  this.applyAdjustmentMAC(approvedOtc, 'vlocity_cmt__OneTimeCharge__c','OT_STD_PRC', data.lineItem,'oneTimeCharge');
                }
              }else{
                this.loading = false;
              }
              if(res[0].AdjustedMRCPercent != undefined ){
                console.log('inside ADJ MRC *****',record.prices.recurringCharge.value);
                if(record.prices.recurringCharge.value > 0){
                  let otc = record.prices.recurringCharge.value;
                  let adjustedrc = parseFloat(Math.abs(((100 - res[0].AdjustedMRCPercent)/100) * otc)).toFixed(2);
                  let approvedrc = adjustedrc;
                  if(adjustedrc < this.floorValueMRC){
                    approvedrc = this.floorValueMRC; //floor value in case if adjusted Value , floor price
                  }
                  console.log('approvedrc MRC--> ',approvedrc); 
                  this.applyAdjustmentMAC(approvedrc, 'vlocity_cmt__RecurringCharge__c','REC_MNTH_STD_PRC',data.lineItem,'recurringCharge');
                }
              }else{
                this.loading = false;
              }
      });
    });
    
  }
  
  applyAdjustmentMAC(adjustedValue, qliField, priceCode,lineItem, chargeType){
    let adjustmentData = {
      detailType: 'OVERRIDE',
      method: 'ABSOLUTE',
      PricingVariableCode: priceCode, 
      Field:qliField, 
      AdjustmentType:'OVERRIDE',
      value: adjustedValue
      };
    let data = {
        actionObj: lineItem.prices[chargeType].actions.applyadjustment,
        action: "applyAdjustment",
        lineItem: lineItem,
        fromModal: true,
        adjustmentData: adjustmentData,
        rootBundleId: lineItem.rootItemId,
        lineItemId: lineItem.id
      };
      this.loading = true;
      this.applyAdjustment(data);    
  }
  //**End** LBPSC-45485

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  deleteLineItemPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  applyAdjustmentPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  cloneItemsPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  getPriceDetailsPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  deleteAdjustmentPostHook(response) {}

  /**
   * A custom function to be used by customers for customisation, any custom action after successfull SDK call
   *  @param {object} response - SDK Response object.
   *  @memberof GBOfferConfig
   */
  getTimeListsPostHook(response) {}

  /**
   * This function is used to handle getCartItems failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  getCartItemsHandleFailure(error, input) {
    this.loading = false;
  }

  /**
   * This function is used to handle addProductToCart failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  addProductToCartHandleFailure(error, input) {
    console.error("error", error);
    pubsub.fire("b2b_handle_status_" + input.childProduct.id, "data", {});
    this.handleSDKCallFailure();
  }

  /**
   * This function is used to handle udpateLineItem failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  udpateLineItemHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    this.handleSDKCallFailure();
  }

  /**
   * This function is used to handle deleteLineItem failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  deleteLineItemHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    this.handleSDKCallFailure();
  }

  /**
   * This function is used to handle applyAdjustment failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  applyAdjustmentHandleFailure(error, input) {
    console.log("error", error);
    if (!input.fromModal) {
      pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
      this.handleSDKCallFailure();
    } else {
      pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {});
    }
  }

  /**
   * This function is used to handle cloneItems failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  cloneItemsHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_status_" + input.lineItem.id, "data", {});
    this.handleSDKCallFailure();
  }

  /**
   * This function is used to handle getPriceDetails failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  getPriceDetailsHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {});
  }

  /**
   * This function is used to handle deleteAdjustment failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  deleteAdjustmentHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_pricing_status_" + input.lineItem.id, "data", {
      action: "getPriceDetails"
    });
  }

  /**
   * This function is used to handle deleteAdjustment failure
   * @param {object} error - Error Object from SDK call.
   * @memberof GBOfferConfig
   */
  getTimeListsHandleFailure(error, input) {
    console.log("error", error);
    pubsub.fire("b2b_handle_time_lists_" + input.lineItem.id, "data", {
      result: {}
    });
  }

  /**
   * @param {object} data - inputs for getCartItems SDK call
   * @memberof GBOfferConfig
   */
  async getCartItems(data, apiConfig) {
    const input = this.getCartItemsGetInput(data, apiConfig);
    const updatedInput = await this.getCartItemsPreHook(input);
    console.log('Inside getCartItems async : ' + JSON.stringify(updatedInput));
    this.getCartItemsSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for addProductToCart SDK call
   * @memberof GBOfferConfig
   */
  async addProductToCart(data) {
    const input = this.addProductToCartGetInput(data);
    const updatedInput = await this.addProductToCartPreHook(input);
    this.addProductToCartSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for updateCartLineItem SDK call
   * @memberof GBOfferConfig
   */
  async updateLineItem(data) {
    const input = this.updateLineItemGetInput(data);
    const updatedInput = await this.updateLineItemPreHook(input);
    if(updatedInput) this.updateLineItemSDKCall(updatedInput, data);
    else  {
      this.loading = true;
      Promise.resolve().then(()=>this.loading=false);
    }
  }

  /**
   * @param {object} data - inputs for deleteCartItem SDK call
   * @memberof GBOfferConfig
   */
  async deleteLineItem(data) {
    const input = this.deleteLineItemGetInput(data);
    const updatedInput = await this.deleteLineItemPreHook(input);
    this.deleteLineItemSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for applyAdjustment SDK call
   * @memberof GBOfferConfig
   */
  async applyAdjustment(data) {
    const input = this.applyAdjustmentGetInput(data);
    const updatedInput = await this.applyAdjustmentPreHook(input);
    this.applyAdjustmentSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for cloneItems SDK call
   * @memberof GBOfferConfig
   */
  async cloneItems(data) {
    const input = this.cloneItemsGetInput(data);
    const updatedInput = await this.cloneItemsPreHook(input);
    this.cloneItemsSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for getPriceDetails SDK call
   * @memberof GBOfferConfig
   */
  async getPriceDetails(data) {
    const input = this.createGetPriceDetailsInput(data);
    const updatedInput = await this.getPriceDetailsPreHook(input);
    this.getPriceDetailsSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for deletePriceAdjustments SDK call
   * @memberof GBOfferConfig
   */
  async deleteAdjustment(data) {
    const input = this.createDeleteAdjustmentInput(data);
    const updatedInput = await this.deleteAdjustmentPreHook(input);
    this.deleteAdjustmentSDKCall(updatedInput, data);
  }

  /**
   * @param {object} data - inputs for getTimeLists SDK call
   * @memberof GBOfferConfig
   */
  async getTimeLists(data) {
    const input = this.createGetTimeListsInput(data);
    const updatedInput = await this.getTimeListsPreHook(input);
    this.getTimeListsSDKCall(updatedInput, data);
  }

  handleTabChange(data) {
    this.showSelectServices = (data.result.id === "selectServices");
  }

  handleDeleteSite(data) {
    if (!this.locBased){
      this.locations = this.locations.filter( ({ id }) => id !== data.memberId );
      if (!this._readOnly) {
        pubsub.unregister("b2b_update_cart", this._handleSaveCart);
        pubsub.unregister("b2b_refresh_Cart", this._handleRefreshCart);
        pubsub.unregister("b2b-config-offer-tab-change", this._handleTabChange);
        pubsub.unregister("gb_delete_successful", this._handleDeleteSite);
      }
      if(!this.locations.length){
        pubsub.fire('gb_validate_status',"data", { 'status' : true});
      }
    }
    
  }

  disconnectedCallback() {
    pubsub.unregister("b2b_update_cart", this._handleSaveCart);
    pubsub.unregister("b2b_refresh_Cart", this._handleRefreshCart);
    pubsub.unregister("b2b-config-offer-tab-change", this._handleTabChange);
    pubsub.unregister("gb_delete_successful", this._handleDeleteSite);
  }
}