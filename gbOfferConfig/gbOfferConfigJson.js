export let gbOfferConfigJson = {
  fields: [
    {
      label: "One Time",
      valueMap: "vlocity_cmt__OneTimeCharge__c",
      dataType: "Currency"
    },
    {
      label: "Monthly",
      valueMap: "vlocity_cmt__RecurringCharge__c",
      dataType: "Currency"
    }
  ],
  APIConfig: {
    connectedCallback: {
      getCartItems: {
        type: "ApexRemote",
        remoteClass: "CpqAppHandler",
        params: {
          methodName: "getCartsItems",
          cartId: "workingCartId",
          fields:
            "vlocity_cmt__BillingAccountId__c,vlocity_cmt__ServiceAccountId__c,Quantity,vlocity_cmt__RecurringTotal__c,vlocity_cmt__OneTimeTotal__c,vlocity_cmt__OneTimeManualDiscount__c,vlocity_cmt__RecurringManualDiscount__c,vlocity_cmt__ProvisioningStatus__c,vlocity_cmt__RecurringCharge__c,vlocity_cmt__OneTimeCharge__c,ListPrice,vlocity_cmt__ParentItemId__c,vlocity_cmt__BillingAccountId__r.Name,vlocity_cmt__ServiceAccountId__r.Name,vlocity_cmt__PremisesId__r.Name,vlocity_cmt__InCartQuantityMap__c,vlocity_cmt__EffectiveQuantity__c, vlocity_cmt__QuoteMemberId__r.Name, vlocity_cmt__QuoteMemberId__r.Quote_Member_Id__c,vlocity_cmt__QuoteMemberId__c,OffnetMRC__c, OffnetNRC__c, description, Product2.Primary_Parent_Product__c, Product2.Location_Based__c, Network_Status__c,SolutionId__c,Product2.AttributeToDisplay__c, Product2.Description,Product2.Name,isGreenLocation__c,CSP_Pricing_Matrix_Field__c,Promo_Description__c,Promo_Code_ID__c",
          customFields:
            ["attributeCategories", "vlocity_cmt__QuoteMemberId__c", "vlocity_cmt__QuoteMemberId__r", "ProductCode","code", "hidden", "description", "Product2", "Network_Status__c", "SolutionId__c", "isGreenLocation__c","CSP_Pricing_Matrix_Field__c","Promo_Description__c","Promo_Code_ID__c"],
          pagesize: "30",
          price: false,
          priceDetailsFields:
            "vlocity_cmt__OneTimeCharge__c,vlocity_cmt__OneTimeManualDiscount__c,vlocity_cmt__OneTimeCalculatedPrice__c,vlocity_cmt__OneTimeTotal__c,vlocity_cmt__RecurringCharge__c,vlocity_cmt__RecurringCalculatedPrice__c,vlocity_cmt__RecurringTotal__c",
          validate: false
        }
      }
    },
    updateItems: {
      type: "ApexRemote",
      remoteClass: "CpqAppHandler",
      params: {
        fields:
          "vlocity_cmt__BillingAccountId__c,vlocity_cmt__ServiceAccountId__c,Quantity,vlocity_cmt__RecurringTotal__c,vlocity_cmt__OneTimeTotal__c,vlocity_cmt__OneTimeManualDiscount__c,vlocity_cmt__RecurringManualDiscount__c,vlocity_cmt__ProvisioningStatus__c,vlocity_cmt__RecurringCharge__c,vlocity_cmt__OneTimeCharge__c,ListPrice,vlocity_cmt__ParentItemId__c,vlocity_cmt__BillingAccountId__r.Name,vlocity_cmt__ServiceAccountId__r.Name,vlocity_cmt__PremisesId__r.Name,vlocity_cmt__InCartQuantityMap__c,vlocity_cmt__EffectiveQuantity__c, vlocity_cmt__QuoteMemberId__r.Name, vlocity_cmt__QuoteMemberId__r.Quote_Member_Id__c,vlocity_cmt__QuoteMemberId__c, OffnetMRC__c, OffnetNRC__c, description, Product2.Primary_Parent_Product__c, Product2.Location_Based__c, Network_Status__c,SolutionId__c,Product2.Description,Product2.AttributeToDisplay__c,isGreenLocation__c,CSP_Pricing_Matrix_Field__c,Promo_Description__c,Promo_Code_ID__c",
        customFields:
          ["attributeCategories", "vlocity_cmt__QuoteMemberId__c","vlocity_cmt__QuoteMemberId__r","ProductCode", "code", "hidden", "description", "Product2", "Network_Status__c", "SolutionId__c", "isGreenLocation__c","CSP_Pricing_Matrix_Field__c","Promo_Description__c","Promo_Code_ID__c"],
        filters: null,
        methodName : "putCartsItems",
        hierarchy: -1,
        includeAttachment: false,
        lastRecordId: null,
        pagesize: 30,
        priceDetailsFields:
            "vlocity_cmt__OneTimeCharge__c,vlocity_cmt__OneTimeManualDiscount__c,vlocity_cmt__OneTimeCalculatedPrice__c,vlocity_cmt__OneTimeTotal__c,vlocity_cmt__RecurringCharge__c,vlocity_cmt__RecurringCalculatedPrice__c,vlocity_cmt__RecurringTotal__c",
        price: true,
        query: null,
        validate: true
      }
    },
    deleteItem: {
      type: "ApexRemote",
      remoteClass: "CpqAppHandler",
      params: {
        methodName : "deleteCartsItems",
        fields:
          "vlocity_cmt__BillingAccountId__c,vlocity_cmt__ServiceAccountId__c,Quantity,vlocity_cmt__RecurringTotal__c,vlocity_cmt__OneTimeTotal__c,vlocity_cmt__OneTimeManualDiscount__c,vlocity_cmt__RecurringManualDiscount__c,vlocity_cmt__ProvisioningStatus__c,vlocity_cmt__RecurringCharge__c,vlocity_cmt__OneTimeCharge__c,ListPrice,vlocity_cmt__ParentItemId__c,vlocity_cmt__BillingAccountId__r.Name,vlocity_cmt__ServiceAccountId__r.Name,vlocity_cmt__PremisesId__r.Name,vlocity_cmt__InCartQuantityMap__c,vlocity_cmt__EffectiveQuantity__c, vlocity_cmt__QuoteMemberId__r.Name, vlocity_cmt__QuoteMemberId__r.Quote_Member_Id__c,vlocity_cmt__QuoteMemberId__c,OffnetMRC__c, OffnetNRC__c, description, Product2.Primary_Parent_Product__c, Product2.Location_Based__c, Network_Status__c, SolutionId__c,Product2.Description,Product2.AttributeToDisplay__c,isGreenLocation__c,CSP_Pricing_Matrix_Field__c,Promo_Description__c,Promo_Code_ID__c",
        customFields:
          ["attributeCategories", "vlocity_cmt__QuoteMemberId__c", "vlocity_cmt__QuoteMemberId__r", "ProductCode", "code", "hidden", "description","Product2", "Network_Status__c", "SolutionId__c", "isGreenLocation__c","CSP_Pricing_Matrix_Field__c","Promo_Description__c","Promo_Code_ID__c"],
        filters: null,
        hierarchy: -1,
        includeAttachment: false,
        lastRecordId: null,
        pagesize: 30,
        price: true,
        query: null,
        validate: true
      }
    },
    postCartsItems: {
      type: "ApexRemote",
      remoteClass: "CpqAppHandler",
      params: {
        methodName: "postCartsItems",
        customFields:
          ["attributeCategories", "vlocity_cmt__QuoteMemberId__c", "vlocity_cmt__QuoteMemberId__r", "ProductCode", "code", "hidden", "description", "Product2", "Network_Status__c", "SolutionId__c", "isGreenLocation__c","CSP_Pricing_Matrix_Field__c","Promo_Description__c","Promo_Code_ID__c"],
        price: true,
        validate: true,
        includeAttachment: false,
        pagesize: 30,
        lastRecordId: null,
        hierarchy: -1,
        query: null
      }
    }
  }
};