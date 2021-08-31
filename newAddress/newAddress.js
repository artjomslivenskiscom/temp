import { LightningElement,track,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { fetchCustomLabels } from 'vlocity_cmt/utility';
import pubsub from 'vlocity_cmt/pubsub' ; 

export default class newAddress extends OmniscriptBaseMixin(LightningElement) {

    @track showButtons = false; 
    addressObj = {};
    @track address;
    @track city;
    @track state;
    @track zip;
    @track newAddressError = false;
    @track disableButton = true;
    @api get newAddress() {
        return this._newAddress;  
    }  
    set newAddress(value) {
        this._newAddress = value;
        if(value){
            this.showButtons = true;
        }
    }
    connectedCallback(){
       this.layout= this.getAttribute('data-omni-layout');
        pubsub.register("validateStep", {
            result: this.handleOmniValidate.bind(this)
        });
        pubsub.register("hideBlock", {
          result: this.cancel.bind(this)
        });
		 this.newAddressErrorMessage = 'This location does not support the selected product, please continue with other locations. If you would like to continue with this location, please request “quote assistance” in click to chat.';
    }

    handleOmniValidate () { 
        if(this.omniScriptHeaderDef) {
            this.disableButton = this.omniScriptHeaderDef.hasInvalidElements;
        }
    }

    openModal(response){ 
        this.address = this.omniJsonData.LocationManagement.LocationTypeAhead.Address;
        this.city = this.omniJsonData.LocationManagement.LocationTypeAhead.City;
        this.state = this.omniJsonData.LocationManagement.LocationTypeAhead.State;
        this.zip = this.omniJsonData.LocationManagement.LocationTypeAhead.ZipCode;  
        const element = this.template.querySelector(".gbModalContainer")
        element.openModal()
    }

    closeModal(){
        const element = this.template.querySelector(".gbModalContainer")
        element.closeModal()
    }

    addAddress(){
        this.loading = true;
        this.omniData = JSON.parse(JSON.stringify(this.omniJsonData));
        
        const inputs = {
                        "Street"     :   this.omniData.LocationManagement.LocationTypeAhead.Address,
                        "City"       :   this.omniData.LocationManagement.LocationTypeAhead.City,
                        "State"      :   this.omniData.LocationManagement.LocationTypeAhead.State,
                        "Country"    :   this.omniData.LocationManagement.LocationTypeAhead.Country,
                        "ZipCode"    :  this.omniData.LocationManagement.LocationTypeAhead.ZipCode
                        };	
        const params = {
            input: JSON.stringify(inputs),
            sClassName:   'vlocity_cmt.IntegrationProcedureService',
            sMethodName : 'GLM_AddressLocationQuery',
            options: '{}',
        };
        
        this.omniRemoteCall(params, true).then(response => {
            if (response && response.result && response.result.IPResult && response.result.IPResult.PrimaryAddress && response.result.IPResult.PrimaryAddress.MasterSiteId){
				this.loading = false;
					this.addressObj = {
											Address : response.result.IPResult.PrimaryAddress.CombinedAddressLine,
											SiteId  : response.result.IPResult.PrimaryAddress.MasterSiteId

										};
					this.newAddressError = false;
                //this.cancel();
                //this.showButtons = false;
                pubsub.fire("newTypeAheadEvent", "TypeAheadValueSelected", {
                    name: ['SelectedAddressNode'],
                    value: this.addressObj
                });
			}else{
                this.loading = false;
                this.newAddressError = true;
            }
            
        });
        const element = this.template.querySelector(".gbModalContainer");
        element.closeModal();
    }
    cancel(){
        this.showButtons = false;
        this.newAddressError = false;
        this.omniApplyCallResp({
            "newAddress":false,
            "LocationManagement" : {
                "LocationTypeAhead" : {
                    Address : null,
                    City : null,
                    State : null,
                    ZipCode : null
                }
            }
        });
    }
    cancelDeleteOfferModal(){
        if(!this.modalEle) this.modalEle = this.template.querySelector('[data-omni-key="omnimodal"]');
            this.modalEle.closeModal()
    }
    proceedDeleteOffer(){
        alert("DELETED");
        if(!this.modalEle) this.modalEle = this.template.querySelector('[data-omni-key="omnimodal"]');
            this.modalEle.closeModal()
    }

    showModal() {
        if(!this.modalEle) this.modalEle = this.template.querySelector('[data-omni-key="omnimodal"]');
        this.modalEle.openModal()
    }

}