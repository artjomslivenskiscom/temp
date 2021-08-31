import OmniscriptStep from 'vlocity_cmt/omniscriptStep';
import tmpl from './gbStep.html';
// import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { B2BBaseComponent } from "c/b2bBaseComponent";
import pubsub from 'vlocity_cmt/pubsub';
import { debounce,formatCurrency } from 'vlocity_cmt/utility';
import { LightningElement, api, track } from 'lwc';
import { invokeApexRemote } from 'c/b2bUtils';
import { saveForLater } from "vlocity_cmt/omniscriptUtils";

export default class GbStep extends B2BBaseComponent(OmniscriptStep) {
	@track loading = false;					   
	@track tracker=true
    @track _runAction = false;
    @track hasRendered = false;
    @track errorData = {};
    @track showError = false;
	@track hideOrderConfirmation;
	@track checkoutUnAuth=true;
    _jsonData;
    monthlyTotal = 0;
    oneTimeTotal = 0;
    invalidFlag = true;
    openModal = false;
    showSpinner = false;
    showDownloadButton = false;
	termCondition1 = false;
	termCondition2 = false;
	checkoutButton= true;
	showSaveForLaterbtn = true;
	registerFlag=true;
    dataUnique =[];		
    locationsLengthCheck = true;
	lengthOfLocations;
    // loading = false;

    // get monthlyTotal() {
    //     return this.cartData
    //       ? this.cartData.EffectiveRecurringTotal__c || 0
    //       : 0;
    // }
    // get oneTimeTotal() {
    //     return this.cartData
    //       ? this.cartData.EffectiveOneTimeTotal__c || 0
    //       : 0;
    // }

    connectedCallback() {
        super.connectedCallback();
        pubsub.register("b2btotalbarinfo", {
            result: this.onCartSuccess.bind(this),
            error : this.onCartError.bind(this)
        });
        // pubsub.register("updateb2btotalbar", {
        //     result: this.handleUpdate.bind(this)   
        // });
        this.handleUpdateObj = { data: this.handleUpdate.bind(this) };
        pubsub.register("gb_cart_summary_loaded", this.handleUpdateObj);

        this.handleDeleteUpdateObj = { data: this.handleUpdate.bind(this) };
        pubsub.register("gb_delete_successful", this.handleDeleteUpdateObj);

        //This handle config validation
        this.handleValidateObj = { data: this.handleValidate.bind(this) };
        pubsub.register("gb_validate_status", this.handleValidateObj);

        pubsub.register('checkEmailExist',  {
			checkEmailCallback: this.checkExistingEmail.bind(this)
        });
        pubsub.register("TermCondition1Event", {
            termCondition1: this.handleTermCondition1.bind(this)
        });
        pubsub.register("TermCondition2Event", {
            termCondition2: this.handleTermCondition2.bind(this)
        });
        pubsub.register("checkoutEvent", {
            checkout: this.handleCheckout.bind(this)
          });
		 // for Spinner		   
		pubsub.register('LoadSpinnerEvent',  {
			spinnerData: this.LoadSpinner.bind(this)
		});
		pubsub.register("hideOrderConfirmationStep", {
            hideOrderConfirmation: this.handleOrderConfirmation.bind(this)
          });
			 pubsub.register("UnAuth", {
            UnAuthVal : this.handleUnAuth.bind(this)
          });
		  //Locations Length event from GbOfferConfig unauth
		pubsub.register("locationLengthUnauthEvent", {

            locationLengthUnauth : this.handleUnAuthLocationsInfo.bind(this)
        });	
            this.omniApplyCallResp({
				"renderedCalledCount": 0
			});

        //This handle account validation
        this.template.addEventListener('omniinvalid', this.handleOmniValidate.bind(this));
        this.template.addEventListener('omnivalid', this.handleOmniValidate.bind(this));
        this.template.addEventListener('omniaggregate', this.handleOmniValidate.bind(this));
		if(this.jsonDef.name=='CartSummary' || this.jsonDef.name=='AccountCreation' || this.jsonDef.name=='OrderDetailSummary' || this.jsonDef.name=='OrderCheckout' || this.jsonDef.name=='OrderConfirmation'){
			this.showDownloadButton = true;
		}
		if(this.jsonDef.name=='AccountSelection' || this.jsonDef.name=='LocationManagement'|| this.jsonDef.name=='ConfigureProduct' || this.jsonDef.name=='OrderConfiguration'){
			this.showSaveForLaterbtn = false;
		}
		pubsub.register("InProgressOrderevent", {
            InProgressData: this.handleInProgressOrder.bind(this)
          });
    }
	
    handleInProgressOrder(data){
		if(data && data.InProgressdata && (data.InProgressdata.hasOrder || data.InProgressdata.hasQuote)){
            this.errorData = {hasOrder: data.InProgressdata.hasOrder, hasQuote: data.InProgressdata.hasQuote};
            this.showError = true;
		}
    }
	
	handleUnAuthLocationsInfo(data){
		if(data){
			if(this.lengthOfLocations != undefined){
                if(data > this.lengthOfLocations){
                    this.lengthOfLocations = data;
                }
            }else{
                this.lengthOfLocations = data;
            }
            if(this.jsonData.locationLengthUnauth == undefined){
				this.omniApplyCallResp({
					"locationLengthUnauth": data
				});
			}else{
                if(this.jsonData.locationLengthUnauth != data){
                    this.locationsLengthTotal = data;
                    this.omniApplyCallResp({
                        "locationLengthUnauth": data
                    });
                }
            }
		}
	}
	
	handleOrderConfirmation(data){
		this.hideOrderConfirmation = data.hideOrderConfirmation;
	}

    buildUrl(){
        let id = this.jsonData.EnterpriseQuoteId;
        let term1 =  this.jsonData.OrderCheckout?this.jsonData.OrderCheckout.TermCondition1:'';
        let term2 =  this.jsonData.OrderCheckout?this.jsonData.OrderCheckout.TermCondition2:'';
        let term3 =  this.jsonData.OrderCheckout?this.jsonData.OrderCheckout.TermCondition3:'';
        window.localStorage.setItem("EnterpriseQuoteId", id)
        window.localStorage.setItem("term1", term1)
        window.localStorage.setItem("term2", term2)
        window.localStorage.setItem("term3", term3)
		window.localStorage.setItem("isAuthFlow",this.jsonData.AuthFlow)
    }
	
    saveOmni(){		
		this.layout = 'lightning';
		this.showSpinner = true;
		this.openModal = true;
        let OSHeaderJSON = document.querySelectorAll(this.jsonData.omniName)[0].jsonDef
        saveForLater(this, OSHeaderJSON, this.scriptHeaderDef.filesMap, "newport", false, true)
            .then(saveResult => {
				const inputs = {"Master_Quote_Id": this.jsonData.EnterpriseQuoteId};
                const params = {
                    input: JSON.stringify(inputs),
                    sClassName:  "vlocity_cmt.IntegrationProcedureService",
                    sMethodName : 'Quote_SaveQuote',
                    options: '{}',
                };
                this.omniRemoteCall(params, true).then(response => {
                    if(response)
                    //window.location.href = window.location.origin+"/shopbuy2/s/savedorders?eid="+this.jsonData.eid;
				this.savedOmniId = saveResult.instanceId; 
                console.log('saved Omniscript : ',this.savedOmniId);
                this.updateOmniInstance();
                })
            })
    }
    updateOmniInstance(){
		const inputs = {"savedOmniId": this.savedOmniId};   
		const params = {
			input: JSON.stringify(inputs),
			sClassName:   'Vlocity_UnauthQuoteSystemContext',
			sMethodName : 'updateSavedOmni',
			options: '{}',
		};
			
		this.omniRemoteCall(params, true).then(response => {
			if(response && response.result){
                this.resumeUrl = new URL(window.location.href);
                this.resumeUrl.search = ("&c__layout=newport&c__instanceId="+this.savedOmniId+"&c__target=c:" + this.scriptHeaderDef.omniscriptKey.replace(/_/g,""));
                this.resumeUrl = this.resumeUrl.toString();
				this.showSpinner = false;
				this.openModal = true;
                this.omniApplyCallResp({"customResumeURL": this.resumeUrl});
                this.cab = "bac";
                this.omniApplyCallResp({"abc": this.cab});                 				
                this.openModal2();				
			}   
		}).catch(error => {
			window.console.log(error, 'error');// variable set to true
		});
	}
	closeModal() {
        this.openModal = false;
		const element = this.template.querySelector(".gbModalContainer")
		element.closeModal()
    }
	openModal2() {		
			this.showSpinner = false;
			const element = this.template.querySelector(".gbModalContainer")
			element.openModal()		
	}	
    copyUrl(event){
        var inputEle = document.createElement("input");
        document.body.appendChild(inputEle);
        inputEle.value = this.jsonData.customResumeURL;
        const xy = this.jsonData.abc;
        inputEle.select();
        document.execCommand("copy");
        document.body.removeChild(inputEle);
    }
    
    handleCheckout(data){
        if(data.checkout || this.jsonData.MacFlow){
            this.checkoutButton = data.checkout;
        }
    }
    handleTermCondition1(data){
        this.termCondition1 = data.termCondition1;
    }
    handleTermCondition2(data){
        this.termCondition2 = data.termCondition2;
    }
	LoadSpinner(data){
            this.loading = data.loading;											   
    }
    handleValidate(res) {
        if(this.jsonDef.bAccordionActive && this.stepName !="OrderCheckout") {
            this.invalidFlag = res.status;
            console.log("This is status",res);
        }
    }
	handleUnAuth(data){
        this.checkoutUnAuth = data.checkout;
    }
    checkExistingEmail(checkEmailExist){
        this.stepName = this.scriptHeaderDef.asName;
        if(checkEmailExist.name === 'emailExist'){
            this.emailExist = checkEmailExist.value;
        }
        if(checkEmailExist.name === 'confirmEmailExist'){
            this.confirmEmailExist = checkEmailExist.value;
        }
        if(this.stepName === 'OrderCheckout' && this.scriptHeaderDef)  {
            this.invalidFlag = this.scriptHeaderDef.hasInvalidElements || !(this.jsonData.OrderCheckout && this.jsonData.OrderCheckout.TermCondition1 && this.jsonData.OrderCheckout.TermCondition2) || this.emailExist || this.confirmEmailExist;
        }
    }
    
	handleOmniValidate = debounce(() => {
        this.stepName = this.scriptHeaderDef.asName;
        if(this.stepName === 'LocationManagement'){
            pubsub.fire("validateStep", "result");
        }        
        if(this.stepName ==="OrderDetailSummary" && this.jsonData.AuthFlow){
            this.invalidFlag = this.checkoutButton;	
        }
        if(this.stepName ==="OrderCheckout" && this.scriptHeaderDef){
            this.invalidFlag = this.scriptHeaderDef.hasInvalidElements || !(this.jsonData.OrderCheckout && this.jsonData.OrderCheckout.TermCondition1 && this.jsonData.OrderCheckout.TermCondition2) || this.emailExist || this.confirmEmailExist;
            if(this.jsonData.MacFlow){
                this.invalidFlag = !(this.termCondition1)
            }
        }
		if(this.stepName === 'AccountCreation' && this.scriptHeaderDef)  {	
            this.invalidFlag = this.scriptHeaderDef.hasInvalidElements || !(this.jsonData.AccountCreation && this.jsonData.AccountCreation.TermCondition1 && this.jsonData.AccountCreation.TermCondition2) || this.emailExist || this.confirmEmailExist;	
        }
		if(this.stepName ==="OrderDetailSummary" && !this.jsonData.AuthFlow){
            this.invalidFlag = this.checkoutUnAuth;
        }
    }, 100)

    disconnectedCallback() {
        pubsub.unregister("gb_location_update", this.handleUpdateObj);
        pubsub.unregister("gb_delete_successful", this.handleDeleteUpdateObj);
        pubsub.unregister("gb_validate_status", this.handleValidateObj);
        this.template.removeEventListener('omniinvalid', this.handleOmniValidate.bind(this));
        this.template.removeEventListener('omniaggregate', this.handleOmniValidate.bind(this));
    }
	
	handleUnAuthGBLocationInfo(data){
	this.stepName = this.scriptHeaderDef.asName;
	if((this.stepName ==="OrderDetailSummary" || this.stepName ==="OrderCheckout") && !this.jsonData.AuthFlow){
		 let invalidTrue=[];
		 let tempArray=[];
			if(data){
				let checkIfPresent = false;
				let firstTimeFlag = false;
				let editedArray = [];
				if(Array.isArray(this.dataUnique) && this.dataUnique.length){
					this.dataUnique.forEach(function(itemArr,index) {
						let tempObj = {};
							tempObj = itemArr;
							if(itemArr.qmId == data.qmId){
								tempObj = data;
								checkIfPresent = true;
							}
							editedArray.push(tempObj);
					});
					if(!checkIfPresent){
						editedArray.push(data);
					}
				}
				else {
					firstTimeFlag = true;
					tempArray.push(data);
				}

				if(firstTimeFlag){
					this.dataUnique = tempArray;
				}else{
					this.dataUnique = editedArray; 
				}
			}
            if(this.dataUnique.length == this.lengthOfLocations){
				invalidTrue = this.dataUnique.filter(dataUnique=>{
				  return dataUnique.qmChkFlag == true
				});
                (Array.isArray(invalidTrue) && invalidTrue.length) ? this.checkoutUnAuth = true : this.checkoutUnAuth = false;
			}else{
                this.checkoutUnAuth = true;
            }
			
		}
    }

handleUnAuthGBLocationInfo(data){
	this.stepName = this.scriptHeaderDef.asName;
	if((this.stepName ==="OrderDetailSummary" || this.stepName ==="OrderCheckout") && !this.jsonData.AuthFlow){
		 let invalidTrue=[];
		 let tempArray=[];
			if(data){
				let checkIfPresent = false;
				let firstTimeFlag = false;
				let editedArray = [];
				if(Array.isArray(this.dataUnique) && this.dataUnique.length){
					this.dataUnique.forEach(function(itemArr,index) {
						let tempObj = {};
							tempObj = itemArr;
							if(itemArr.qmId == data.qmId){
								tempObj = data;
								checkIfPresent = true;
							}
							editedArray.push(tempObj);
					});
					if(!checkIfPresent){
						editedArray.push(data);
					}
				}
				else {
					firstTimeFlag = true;
					tempArray.push(data);
				}

				if(firstTimeFlag){
					this.dataUnique = tempArray;
				}else{
					this.dataUnique = editedArray; 
				}
			}
            if(this.dataUnique.length == this.jsonData.locationLengthUnauth){
				invalidTrue = this.dataUnique.filter(dataUnique=>{
				  return dataUnique.qmChkFlag == true
				});
                (Array.isArray(invalidTrue) && invalidTrue.length) ? this.checkoutUnAuth = true : this.checkoutUnAuth = false;
			}else{
                this.checkoutUnAuth = true;
            }
			
		}
    }

    
    renderedCallback() {

        super.renderedCallback();
        // causes infinite looping 
        // this.updateCart();
        // first time updateCart;
		if(this.jsonData.EnterpriseQuoteId){
            this.hasQuoteId = true;
        }
        this.customerNumber =  this.jsonData.selectedCustomerNumber;
		this.isTypeDisconnect = this.jsonData.isTypeDisconnect;
        if(this.isTypeDisconnect){
            this.tracker = false;
        }
        // LBPSC-26921 start

        if(this.jsonData.MacFlow){
			this.stepName = this.scriptHeaderDef.asName;
			if((this.stepName === 'OrderDetailSummary' || this.stepName === 'OrderConfiguration') && this.registerFlag){ 
				this.registerFlag = false;
				pubsub.register("checkoutButton",{ 
					checkoutButtonState: this.submitOrderState.bind(this)}
				);
			}
			if(this.headerFlag === false&& !this.checkoutButton && (this.stepName === 'OrderDetailSummary' || this.stepName === 'OrderConfiguration')){
				this.invalidFlag = true;
			}
		}

         if(!this.jsonData.AuthFlow){ 
            if(this.stepName  ==="OrderDetailSummary" && this.locationsLengthCheck ){
                if(this.jsonData.renderedCalledCount == 0){
                    this.omniApplyCallResp({
					    "renderedCalledCount": 1
                    });
                    this.locationsLengthCheck = false;
                    
                    setTimeout(()=>{
                        pubsub.register("unAuthCheckArrayEvent", {
                            unAuthCheckArray : this.handleUnAuthGBLocationInfo.bind(this)
                        });
                    },2000);
                    
                }
            }		
              
            if((this.stepName === 'OrderDetailSummary' || this.stepName === 'OrderConfiguration') && this.registerFlag){ 
                this.registerFlag = false;
                pubsub.register("checkoutButton",{ 
                    checkoutButtonState: this.submitOrderState.bind(this)}
                );
            }
            if(this.headerFlag === false&& !this.checkoutUnAuth && (this.stepName === 'OrderDetailSummary' || this.stepName === 'OrderConfiguration')){
                this.invalidFlag = true;
            }
        }
	}
        // LBPSC-26921 end
	submitOrderState(data){
        this.headerFlag = data.contactFlag;
		if(this.jsonData.MacFlow){
			if(data.contactFlag && !this.checkoutButton){ 
				this.invalidFlag = false;
			}else{
				this.invalidFlag = true;
			}
			if(this.stepName ==="OrderCheckout"){
				if(data.contactFlag && this.termCondition1 ){
					this.invalidFlag = false;
				}
				else{
					this.invalidFlag = true;
				}
			}
		}
        if(this.jsonData.AuthFlow){
            if(data.contactFlag && !this.checkoutButton){ 
                this.invalidFlag = false;
            }else{
                this.invalidFlag = true;
            }
            if(this.stepName ==="OrderCheckout"){
                if(data.contactFlag && this.termCondition1 ){
                    this.invalidFlag = false;
                }
                else{
                    this.invalidFlag = true;
                }
            }
        }
        if(!this.jsonData.AuthFlow){
            if(data.contactFlag && !this.checkoutUnAuth){ 
                this.invalidFlag = false;
            }else{
                this.invalidFlag = true;
            }
            if(this.stepName ==="OrderCheckout"){
                if(data.contactFlag && this.termCondition1 ){
                    this.invalidFlag = false;
                }
                else{
                    this.invalidFlag = true;
                }
            }
        }
    }

    initialRenderCallback() {
        super.initialRenderCallback();
        window.scroll(0,0);
    }

    render() {
        return tmpl;
    }   

    updateCart() {
        // this.inputMap = '{ "cartId": "0Q00n0000006oL5"}';
        const inputMap = { 
            cartId : this.jsonData.EnterpriseQuoteId,
            validate: false 
        };
        invokeApexRemote('vlocity_cmt.CpqAppHandler','getCarts', inputMap).then(result =>{
            let res = JSON.parse(result);
            this.cartData = res.error ? {} : res.records[0].details.records[0];
            this.monthlyTotal = this.cartData.EffectiveRecurringTotal__c || "0";
            this.oneTimeTotal = this.cartData.EffectiveOneTimeTotal__c  || "0";
        }).catch(err => console.log("There is error getting info", err));
    }

    onCartSuccess(res) {
        let r = JSON.parse(res);
        this.cartData = r.error ? {} : JSON.parse(res).records[0].details.records[0];
        this._runAction = false;
    }

    onCartError(res) {
        console.log("There is error getting info", res);
    }

    handleUpdate() {
        console.log("handleUPdate called");
        this.updateCart();
    }

}